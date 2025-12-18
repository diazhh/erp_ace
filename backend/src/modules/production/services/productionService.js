const { Op } = require('sequelize');
const {
  Field,
  Well,
  WellProduction,
  ProductionAllocation,
  MorningReport,
  WellLog,
  User,
  Project,
  PurchaseOrder,
  Contractor,
} = require('../../../database/models');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');
const logger = require('../../../shared/utils/logger');

class ProductionService {
  // ==================== FIELDS ====================

  async getFields(filters = {}) {
    const { status, type, search, page = 1, limit = 20 } = filters;
    const where = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await Field.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['name', 'ASC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getFieldById(id) {
    const field = await Field.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        {
          model: Well,
          as: 'wells',
          attributes: ['id', 'code', 'name', 'type', 'status', 'classification'],
        },
      ],
    });

    if (!field) {
      throw new NotFoundError('Campo no encontrado');
    }

    return field;
  }

  async createField(data, userId) {
    const existingField = await Field.findOne({ where: { code: data.code } });
    if (existingField) {
      throw new BadRequestError('Ya existe un campo con ese código');
    }

    const field = await Field.create({
      ...data,
      created_by: userId,
    });

    logger.info(`Campo creado: ${field.code}`, { fieldId: field.id, userId });
    return this.getFieldById(field.id);
  }

  async updateField(id, data, userId) {
    const field = await Field.findByPk(id);
    if (!field) {
      throw new NotFoundError('Campo no encontrado');
    }

    if (data.code && data.code !== field.code) {
      const existingField = await Field.findOne({ where: { code: data.code } });
      if (existingField) {
        throw new BadRequestError('Ya existe un campo con ese código');
      }
    }

    await field.update(data);
    logger.info(`Campo actualizado: ${field.code}`, { fieldId: id, userId });
    return this.getFieldById(id);
  }

  async deleteField(id, userId) {
    const field = await Field.findByPk(id);
    if (!field) {
      throw new NotFoundError('Campo no encontrado');
    }

    const wellCount = await Well.count({ where: { field_id: id } });
    if (wellCount > 0) {
      throw new BadRequestError('No se puede eliminar un campo con pozos asociados');
    }

    await field.destroy();
    logger.info(`Campo eliminado: ${field.code}`, { fieldId: id, userId });
    return { message: 'Campo eliminado exitosamente' };
  }

  // ==================== WELLS ====================

  async getWells(filters = {}) {
    const { fieldId, status, type, classification, search, page = 1, limit = 20 } = filters;
    const where = {};

    if (fieldId) where.field_id = fieldId;
    if (status) where.status = status;
    if (type) where.type = type;
    if (classification) where.classification = classification;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await Well.findAndCountAll({
      where,
      include: [
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['code', 'ASC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getWellById(id) {
    const well = await Well.findByPk(id, {
      include: [
        { model: Field, as: 'field', attributes: ['id', 'code', 'name', 'type', 'status'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });

    if (!well) {
      throw new NotFoundError('Pozo no encontrado');
    }

    return well;
  }

  async getWellDetail(id) {
    const well = await Well.findByPk(id, {
      include: [
        { model: Field, as: 'field' },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        {
          model: Project,
          as: 'projects',
          attributes: ['id', 'code', 'name', 'status', 'start_date', 'end_date'],
          limit: 10,
          order: [['created_at', 'DESC']],
        },
        {
          model: PurchaseOrder,
          as: 'purchaseOrders',
          attributes: ['id', 'code', 'title', 'total', 'status', 'created_at'],
          limit: 10,
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!well) {
      throw new NotFoundError('Pozo no encontrado');
    }

    // Obtener estadísticas de producción
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [recentProduction, logsCount, projectsCount, purchaseOrdersCount] = await Promise.all([
      WellProduction.findAll({
        where: {
          well_id: id,
          production_date: { [Op.gte]: last30Days },
        },
        order: [['production_date', 'DESC']],
        limit: 30,
      }),
      WellLog.count({ where: { well_id: id } }),
      Project.count({ where: { well_id: id } }),
      PurchaseOrder.count({ where: { well_id: id } }),
    ]);

    // Calcular totales de producción
    const productionStats = recentProduction.reduce((acc, p) => {
      acc.totalOil += parseFloat(p.oil_volume_bbl) || 0;
      acc.totalGas += parseFloat(p.gas_volume_mcf) || 0;
      acc.totalWater += parseFloat(p.water_volume_bbl) || 0;
      acc.daysProducing += 1;
      return acc;
    }, { totalOil: 0, totalGas: 0, totalWater: 0, daysProducing: 0 });

    return {
      ...well.toJSON(),
      stats: {
        last30Days: productionStats,
        avgOilBopd: productionStats.daysProducing > 0 ? productionStats.totalOil / productionStats.daysProducing : 0,
        avgGasMcfd: productionStats.daysProducing > 0 ? productionStats.totalGas / productionStats.daysProducing : 0,
        logsCount,
        projectsCount,
        purchaseOrdersCount,
      },
      recentProduction: recentProduction.slice(0, 10),
    };
  }

  async createWell(data, userId) {
    const field = await Field.findByPk(data.field_id);
    if (!field) {
      throw new NotFoundError('Campo no encontrado');
    }

    const existingWell = await Well.findOne({ where: { code: data.code } });
    if (existingWell) {
      throw new BadRequestError('Ya existe un pozo con ese código');
    }

    const well = await Well.create({
      ...data,
      created_by: userId,
    });

    logger.info(`Pozo creado: ${well.code}`, { wellId: well.id, fieldId: data.field_id, userId });
    return this.getWellById(well.id);
  }

  async updateWell(id, data, userId) {
    const well = await Well.findByPk(id);
    if (!well) {
      throw new NotFoundError('Pozo no encontrado');
    }

    if (data.code && data.code !== well.code) {
      const existingWell = await Well.findOne({ where: { code: data.code } });
      if (existingWell) {
        throw new BadRequestError('Ya existe un pozo con ese código');
      }
    }

    if (data.field_id && data.field_id !== well.field_id) {
      const field = await Field.findByPk(data.field_id);
      if (!field) {
        throw new NotFoundError('Campo no encontrado');
      }
    }

    await well.update(data);
    logger.info(`Pozo actualizado: ${well.code}`, { wellId: id, userId });
    return this.getWellById(id);
  }

  async deleteWell(id, userId) {
    const well = await Well.findByPk(id);
    if (!well) {
      throw new NotFoundError('Pozo no encontrado');
    }

    const productionCount = await WellProduction.count({ where: { well_id: id } });
    if (productionCount > 0) {
      throw new BadRequestError('No se puede eliminar un pozo con registros de producción');
    }

    await well.destroy();
    logger.info(`Pozo eliminado: ${well.code}`, { wellId: id, userId });
    return { message: 'Pozo eliminado exitosamente' };
  }

  async getWellProduction(wellId, filters = {}) {
    const { startDate, endDate, page = 1, limit = 30 } = filters;
    const where = { well_id: wellId };

    if (startDate && endDate) {
      where.production_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.production_date = { [Op.gte]: startDate };
    } else if (endDate) {
      where.production_date = { [Op.lte]: endDate };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await WellProduction.findAndCountAll({
      where,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'username'] },
      ],
      order: [['production_date', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // ==================== DAILY PRODUCTION ====================

  async getDailyProduction(filters = {}) {
    const { fieldId, wellId, startDate, endDate, status, page = 1, limit = 50 } = filters;
    const where = {};

    if (wellId) {
      where.well_id = wellId;
    } else if (fieldId) {
      const wells = await Well.findAll({
        where: { field_id: fieldId },
        attributes: ['id'],
      });
      where.well_id = { [Op.in]: wells.map(w => w.id) };
    }

    if (startDate && endDate) {
      where.production_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.production_date = { [Op.gte]: startDate };
    } else if (endDate) {
      where.production_date = { [Op.lte]: endDate };
    }

    if (status) where.status = status;

    const offset = (page - 1) * limit;
    const { rows, count } = await WellProduction.findAndCountAll({
      where,
      include: [
        {
          model: Well,
          as: 'well',
          attributes: ['id', 'code', 'name', 'type', 'status'],
          include: [{ model: Field, as: 'field', attributes: ['id', 'code', 'name'] }],
        },
        { model: User, as: 'reporter', attributes: ['id', 'username'] },
        { model: User, as: 'verifier', attributes: ['id', 'username'] },
      ],
      order: [['production_date', 'DESC'], ['well_id', 'ASC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getProductionById(id) {
    const production = await WellProduction.findByPk(id, {
      include: [
        {
          model: Well,
          as: 'well',
          include: [{ model: Field, as: 'field' }],
        },
        { model: User, as: 'reporter', attributes: ['id', 'username'] },
        { model: User, as: 'verifier', attributes: ['id', 'username'] },
        { model: User, as: 'approver', attributes: ['id', 'username'] },
      ],
    });

    if (!production) {
      throw new NotFoundError('Registro de producción no encontrado');
    }

    return production;
  }

  async createProduction(data, userId) {
    const well = await Well.findByPk(data.well_id);
    if (!well) {
      throw new NotFoundError('Pozo no encontrado');
    }

    const existingProduction = await WellProduction.findOne({
      where: {
        well_id: data.well_id,
        production_date: data.production_date,
      },
    });

    if (existingProduction) {
      throw new BadRequestError('Ya existe un registro de producción para este pozo en esta fecha');
    }

    // Calcular valores derivados
    const oilVolume = parseFloat(data.oil_volume_bbl) || 0;
    const waterVolume = parseFloat(data.water_volume_bbl) || 0;
    const gasVolume = parseFloat(data.gas_volume_mcf) || 0;
    const hoursOn = parseFloat(data.hours_on) || 24;

    const grossVolume = oilVolume + waterVolume;
    const bsw = grossVolume > 0 ? (waterVolume / grossVolume) * 100 : 0;
    const gor = oilVolume > 0 ? (gasVolume * 1000) / oilVolume : 0;

    const production = await WellProduction.create({
      ...data,
      gross_volume_bbl: grossVolume,
      net_volume_bbl: oilVolume,
      bsw_percent: data.bsw_percent || bsw,
      gor: data.gor || gor,
      oil_rate_bopd: hoursOn > 0 ? (oilVolume / hoursOn) * 24 : 0,
      gas_rate_mcfd: hoursOn > 0 ? (gasVolume / hoursOn) * 24 : 0,
      water_rate_bwpd: hoursOn > 0 ? (waterVolume / hoursOn) * 24 : 0,
      downtime_hours: 24 - hoursOn,
      reported_by: userId,
    });

    logger.info(`Producción registrada: ${well.code} - ${data.production_date}`, {
      productionId: production.id,
      wellId: data.well_id,
      userId,
    });

    return this.getProductionById(production.id);
  }

  async updateProduction(id, data, userId) {
    const production = await WellProduction.findByPk(id);
    if (!production) {
      throw new NotFoundError('Registro de producción no encontrado');
    }

    if (production.status === 'APPROVED') {
      throw new BadRequestError('No se puede modificar un registro aprobado');
    }

    // Recalcular valores si se actualizan volúmenes
    if (data.oil_volume_bbl !== undefined || data.water_volume_bbl !== undefined || data.gas_volume_mcf !== undefined) {
      const oilVolume = parseFloat(data.oil_volume_bbl ?? production.oil_volume_bbl) || 0;
      const waterVolume = parseFloat(data.water_volume_bbl ?? production.water_volume_bbl) || 0;
      const gasVolume = parseFloat(data.gas_volume_mcf ?? production.gas_volume_mcf) || 0;
      const hoursOn = parseFloat(data.hours_on ?? production.hours_on) || 24;

      const grossVolume = oilVolume + waterVolume;
      const bsw = grossVolume > 0 ? (waterVolume / grossVolume) * 100 : 0;
      const gor = oilVolume > 0 ? (gasVolume * 1000) / oilVolume : 0;

      data.gross_volume_bbl = grossVolume;
      data.net_volume_bbl = oilVolume;
      data.bsw_percent = data.bsw_percent || bsw;
      data.gor = data.gor || gor;
      data.oil_rate_bopd = hoursOn > 0 ? (oilVolume / hoursOn) * 24 : 0;
      data.gas_rate_mcfd = hoursOn > 0 ? (gasVolume / hoursOn) * 24 : 0;
      data.water_rate_bwpd = hoursOn > 0 ? (waterVolume / hoursOn) * 24 : 0;
      data.downtime_hours = 24 - hoursOn;
    }

    await production.update(data);
    logger.info(`Producción actualizada`, { productionId: id, userId });
    return this.getProductionById(id);
  }

  async verifyProduction(id, userId) {
    const production = await WellProduction.findByPk(id);
    if (!production) {
      throw new NotFoundError('Registro de producción no encontrado');
    }

    if (production.status !== 'DRAFT' && production.status !== 'SUBMITTED') {
      throw new BadRequestError('Solo se pueden verificar registros en estado borrador o enviado');
    }

    await production.update({
      status: 'VERIFIED',
      verified_by: userId,
      verified_at: new Date(),
    });

    logger.info(`Producción verificada`, { productionId: id, userId });
    return this.getProductionById(id);
  }

  async approveProduction(id, userId) {
    const production = await WellProduction.findByPk(id);
    if (!production) {
      throw new NotFoundError('Registro de producción no encontrado');
    }

    if (production.status !== 'VERIFIED') {
      throw new BadRequestError('Solo se pueden aprobar registros verificados');
    }

    await production.update({
      status: 'APPROVED',
      approved_by: userId,
      approved_at: new Date(),
    });

    logger.info(`Producción aprobada`, { productionId: id, userId });
    return this.getProductionById(id);
  }

  async deleteProduction(id, userId) {
    const production = await WellProduction.findByPk(id);
    if (!production) {
      throw new NotFoundError('Registro de producción no encontrado');
    }

    if (production.status === 'APPROVED') {
      throw new BadRequestError('No se puede eliminar un registro aprobado');
    }

    await production.destroy();
    logger.info(`Producción eliminada`, { productionId: id, userId });
    return { message: 'Registro de producción eliminado exitosamente' };
  }

  // ==================== ALLOCATIONS ====================

  async getAllocations(filters = {}) {
    const { fieldId, year, month, status, page = 1, limit = 20 } = filters;
    const where = {};

    if (fieldId) where.field_id = fieldId;
    if (year) where.period_year = year;
    if (month) where.period_month = month;
    if (status) where.status = status;

    const offset = (page - 1) * limit;
    const { rows, count } = await ProductionAllocation.findAndCountAll({
      where,
      include: [
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'calculator', attributes: ['id', 'username'] },
        { model: User, as: 'approver', attributes: ['id', 'username'] },
      ],
      order: [['period_year', 'DESC'], ['period_month', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getAllocationById(id) {
    const allocation = await ProductionAllocation.findByPk(id, {
      include: [
        { model: Field, as: 'field' },
        { model: User, as: 'calculator', attributes: ['id', 'username'] },
        { model: User, as: 'approver', attributes: ['id', 'username'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });

    if (!allocation) {
      throw new NotFoundError('Allocation no encontrada');
    }

    return allocation;
  }

  async generateAllocation(fieldId, month, year, userId) {
    const field = await Field.findByPk(fieldId);
    if (!field) {
      throw new NotFoundError('Campo no encontrado');
    }

    const existingAllocation = await ProductionAllocation.findOne({
      where: { field_id: fieldId, period_month: month, period_year: year },
    });

    if (existingAllocation && existingAllocation.status === 'APPROVED') {
      throw new BadRequestError('Ya existe una allocation aprobada para este período');
    }

    // Obtener pozos del campo
    const wells = await Well.findAll({
      where: { field_id: fieldId },
      attributes: ['id'],
    });

    const wellIds = wells.map(w => w.id);

    // Calcular producción del período
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const productions = await WellProduction.findAll({
      where: {
        well_id: { [Op.in]: wellIds },
        production_date: { [Op.between]: [startDate, endDate] },
      },
    });

    const totals = productions.reduce((acc, p) => {
      acc.oil += parseFloat(p.oil_volume_bbl) || 0;
      acc.gas += parseFloat(p.gas_volume_mcf) || 0;
      acc.water += parseFloat(p.water_volume_bbl) || 0;
      return acc;
    }, { oil: 0, gas: 0, water: 0 });

    const daysInMonth = endDate.getDate();
    const wellsProducing = await Well.count({
      where: { field_id: fieldId, status: 'ACTIVE' },
    });
    const wellsShutIn = await Well.count({
      where: { field_id: fieldId, status: 'SHUT_IN' },
    });

    const allocationData = {
      field_id: fieldId,
      period_month: month,
      period_year: year,
      total_oil_bbl: totals.oil,
      total_gas_mcf: totals.gas,
      total_water_bbl: totals.water,
      allocated_oil_bbl: totals.oil,
      allocated_gas_mcf: totals.gas,
      wells_producing: wellsProducing,
      wells_shut_in: wellsShutIn,
      production_days: daysInMonth,
      avg_oil_rate_bopd: totals.oil / daysInMonth,
      avg_gas_rate_mcfd: totals.gas / daysInMonth,
      allocation_method: 'WELL_TEST',
      status: 'CALCULATED',
      calculated_by: userId,
      calculated_at: new Date(),
      created_by: userId,
    };

    let allocation;
    if (existingAllocation) {
      await existingAllocation.update(allocationData);
      allocation = existingAllocation;
    } else {
      allocation = await ProductionAllocation.create(allocationData);
    }

    logger.info(`Allocation generada: ${field.code} - ${month}/${year}`, {
      allocationId: allocation.id,
      fieldId,
      userId,
    });

    return this.getAllocationById(allocation.id);
  }

  async approveAllocation(id, userId) {
    const allocation = await ProductionAllocation.findByPk(id);
    if (!allocation) {
      throw new NotFoundError('Allocation no encontrada');
    }

    if (allocation.status !== 'CALCULATED' && allocation.status !== 'REVIEWED') {
      throw new BadRequestError('Solo se pueden aprobar allocations calculadas o revisadas');
    }

    await allocation.update({
      status: 'APPROVED',
      approved_by: userId,
      approved_at: new Date(),
    });

    logger.info(`Allocation aprobada`, { allocationId: id, userId });
    return this.getAllocationById(id);
  }

  // ==================== MORNING REPORTS ====================

  async getMorningReports(filters = {}) {
    const { fieldId, startDate, endDate, status, page = 1, limit = 30 } = filters;
    const where = {};

    if (fieldId) where.field_id = fieldId;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.report_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.report_date = { [Op.gte]: startDate };
    } else if (endDate) {
      where.report_date = { [Op.lte]: endDate };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await MorningReport.findAndCountAll({
      where,
      include: [
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['report_date', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getMorningReportById(id) {
    const report = await MorningReport.findByPk(id, {
      include: [
        { model: Field, as: 'field' },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'submitter', attributes: ['id', 'username'] },
        { model: User, as: 'approver', attributes: ['id', 'username'] },
      ],
    });

    if (!report) {
      throw new NotFoundError('Reporte matutino no encontrado');
    }

    return report;
  }

  async createMorningReport(data, userId) {
    const field = await Field.findByPk(data.field_id);
    if (!field) {
      throw new NotFoundError('Campo no encontrado');
    }

    const existingReport = await MorningReport.findOne({
      where: { field_id: data.field_id, report_date: data.report_date },
    });

    if (existingReport) {
      throw new BadRequestError('Ya existe un reporte para este campo en esta fecha');
    }

    // Generar número de reporte
    const reportNumber = `MR-${field.code}-${data.report_date.replace(/-/g, '')}`;

    const report = await MorningReport.create({
      ...data,
      report_number: reportNumber,
      created_by: userId,
    });

    logger.info(`Reporte matutino creado: ${reportNumber}`, {
      reportId: report.id,
      fieldId: data.field_id,
      userId,
    });

    return this.getMorningReportById(report.id);
  }

  async updateMorningReport(id, data, userId) {
    const report = await MorningReport.findByPk(id);
    if (!report) {
      throw new NotFoundError('Reporte matutino no encontrado');
    }

    if (report.status === 'APPROVED') {
      throw new BadRequestError('No se puede modificar un reporte aprobado');
    }

    await report.update(data);
    logger.info(`Reporte matutino actualizado`, { reportId: id, userId });
    return this.getMorningReportById(id);
  }

  async submitMorningReport(id, userId) {
    const report = await MorningReport.findByPk(id);
    if (!report) {
      throw new NotFoundError('Reporte matutino no encontrado');
    }

    if (report.status !== 'DRAFT') {
      throw new BadRequestError('Solo se pueden enviar reportes en estado borrador');
    }

    await report.update({
      status: 'SUBMITTED',
      submitted_by: userId,
      submitted_at: new Date(),
    });

    logger.info(`Reporte matutino enviado`, { reportId: id, userId });
    return this.getMorningReportById(id);
  }

  async approveMorningReport(id, userId) {
    const report = await MorningReport.findByPk(id);
    if (!report) {
      throw new NotFoundError('Reporte matutino no encontrado');
    }

    if (report.status !== 'SUBMITTED') {
      throw new BadRequestError('Solo se pueden aprobar reportes enviados');
    }

    await report.update({
      status: 'APPROVED',
      approved_by: userId,
      approved_at: new Date(),
    });

    logger.info(`Reporte matutino aprobado`, { reportId: id, userId });
    return this.getMorningReportById(id);
  }

  async deleteMorningReport(id, userId) {
    const report = await MorningReport.findByPk(id);
    if (!report) {
      throw new NotFoundError('Reporte matutino no encontrado');
    }

    if (report.status === 'APPROVED') {
      throw new BadRequestError('No se puede eliminar un reporte aprobado');
    }

    await report.destroy();
    logger.info(`Reporte matutino eliminado`, { reportId: id, userId });
    return { message: 'Reporte matutino eliminado exitosamente' };
  }

  // ==================== DASHBOARD & STATISTICS ====================

  async getDashboard(fieldId = null) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const fieldWhere = fieldId ? { field_id: fieldId } : {};
    const wellWhere = fieldId ? { field_id: fieldId } : {};

    // Contadores de campos y pozos
    const totalFields = await Field.count({ where: { status: 'ACTIVE' } });
    const totalWells = await Well.count({ where: { ...wellWhere, status: 'ACTIVE' } });
    const wellsShutIn = await Well.count({ where: { ...wellWhere, status: 'SHUT_IN' } });

    // Obtener IDs de pozos para filtrar producción
    let wellIds = [];
    if (fieldId) {
      const wells = await Well.findAll({
        where: { field_id: fieldId },
        attributes: ['id'],
      });
      wellIds = wells.map(w => w.id);
    }

    const productionWhere = wellIds.length > 0 ? { well_id: { [Op.in]: wellIds } } : {};

    // Producción de ayer
    const yesterdayProduction = await WellProduction.findAll({
      where: {
        ...productionWhere,
        production_date: yesterday.toISOString().split('T')[0],
      },
    });

    const yesterdayTotals = yesterdayProduction.reduce((acc, p) => {
      acc.oil += parseFloat(p.oil_volume_bbl) || 0;
      acc.gas += parseFloat(p.gas_volume_mcf) || 0;
      acc.water += parseFloat(p.water_volume_bbl) || 0;
      return acc;
    }, { oil: 0, gas: 0, water: 0 });

    // Producción MTD
    const mtdProduction = await WellProduction.findAll({
      where: {
        ...productionWhere,
        production_date: { [Op.between]: [startOfMonth, today] },
      },
    });

    const mtdTotals = mtdProduction.reduce((acc, p) => {
      acc.oil += parseFloat(p.oil_volume_bbl) || 0;
      acc.gas += parseFloat(p.gas_volume_mcf) || 0;
      acc.water += parseFloat(p.water_volume_bbl) || 0;
      return acc;
    }, { oil: 0, gas: 0, water: 0 });

    // Producción YTD
    const ytdProduction = await WellProduction.findAll({
      where: {
        ...productionWhere,
        production_date: { [Op.between]: [startOfYear, today] },
      },
    });

    const ytdTotals = ytdProduction.reduce((acc, p) => {
      acc.oil += parseFloat(p.oil_volume_bbl) || 0;
      acc.gas += parseFloat(p.gas_volume_mcf) || 0;
      acc.water += parseFloat(p.water_volume_bbl) || 0;
      return acc;
    }, { oil: 0, gas: 0, water: 0 });

    // Top 5 pozos productores (último día con datos)
    const topWells = await WellProduction.findAll({
      where: {
        ...productionWhere,
        production_date: yesterday.toISOString().split('T')[0],
      },
      include: [
        { model: Well, as: 'well', attributes: ['id', 'code', 'name'] },
      ],
      order: [['oil_volume_bbl', 'DESC']],
      limit: 5,
    });

    // Pozos con downtime
    const wellsWithDowntime = await WellProduction.findAll({
      where: {
        ...productionWhere,
        production_date: yesterday.toISOString().split('T')[0],
        downtime_hours: { [Op.gt]: 0 },
      },
      include: [
        { model: Well, as: 'well', attributes: ['id', 'code', 'name'] },
      ],
      order: [['downtime_hours', 'DESC']],
      limit: 10,
    });

    return {
      summary: {
        totalFields,
        totalWells,
        wellsActive: totalWells,
        wellsShutIn,
      },
      yesterday: {
        date: yesterday.toISOString().split('T')[0],
        oilBbl: yesterdayTotals.oil,
        gasMcf: yesterdayTotals.gas,
        waterBbl: yesterdayTotals.water,
        wellsReporting: yesterdayProduction.length,
      },
      mtd: {
        oilBbl: mtdTotals.oil,
        gasMcf: mtdTotals.gas,
        waterBbl: mtdTotals.water,
        avgOilBopd: mtdTotals.oil / today.getDate(),
      },
      ytd: {
        oilBbl: ytdTotals.oil,
        gasMcf: ytdTotals.gas,
        waterBbl: ytdTotals.water,
      },
      topWells: topWells.map(p => ({
        wellId: p.well?.id,
        wellCode: p.well?.code,
        wellName: p.well?.name,
        oilBbl: parseFloat(p.oil_volume_bbl) || 0,
        gasMcf: parseFloat(p.gas_volume_mcf) || 0,
      })),
      wellsWithDowntime: wellsWithDowntime.map(p => ({
        wellId: p.well?.id,
        wellCode: p.well?.code,
        wellName: p.well?.name,
        downtimeHours: parseFloat(p.downtime_hours) || 0,
        reason: p.downtime_reason,
      })),
    };
  }

  async getProductionTrend(fieldId = null, days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let wellIds = [];
    if (fieldId) {
      const wells = await Well.findAll({
        where: { field_id: fieldId },
        attributes: ['id'],
      });
      wellIds = wells.map(w => w.id);
    }

    const productionWhere = wellIds.length > 0 ? { well_id: { [Op.in]: wellIds } } : {};

    const productions = await WellProduction.findAll({
      where: {
        ...productionWhere,
        production_date: { [Op.between]: [startDate, endDate] },
      },
      attributes: [
        'production_date',
        [require('sequelize').fn('SUM', require('sequelize').col('oil_volume_bbl')), 'total_oil'],
        [require('sequelize').fn('SUM', require('sequelize').col('gas_volume_mcf')), 'total_gas'],
        [require('sequelize').fn('SUM', require('sequelize').col('water_volume_bbl')), 'total_water'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'wells_reporting'],
      ],
      group: ['production_date'],
      order: [['production_date', 'ASC']],
      raw: true,
    });

    return productions.map(p => ({
      date: p.production_date,
      oilBbl: parseFloat(p.total_oil) || 0,
      gasMcf: parseFloat(p.total_gas) || 0,
      waterBbl: parseFloat(p.total_water) || 0,
      wellsReporting: parseInt(p.wells_reporting) || 0,
    }));
  }

  // ==================== FIELD DETAIL ====================

  async getFieldDetail(id) {
    const field = await Field.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        {
          model: Well,
          as: 'wells',
          attributes: ['id', 'code', 'name', 'type', 'status', 'classification', 'artificial_lift'],
        },
      ],
    });

    if (!field) {
      throw new NotFoundError('Campo no encontrado');
    }

    // Obtener estadísticas
    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const wellIds = field.wells.map(w => w.id);

    const [recentProduction, projectsCount, purchaseOrdersCount, logsCount] = await Promise.all([
      WellProduction.findAll({
        where: {
          well_id: { [Op.in]: wellIds },
          production_date: { [Op.gte]: last30Days },
        },
        order: [['production_date', 'DESC']],
      }),
      Project.count({ where: { field_id: id } }),
      PurchaseOrder.count({ where: { field_id: id } }),
      WellLog.count({ where: { well_id: { [Op.in]: wellIds } } }),
    ]);

    // Agrupar producción por fecha
    const productionByDate = {};
    recentProduction.forEach(p => {
      const date = p.production_date;
      if (!productionByDate[date]) {
        productionByDate[date] = { oil: 0, gas: 0, water: 0 };
      }
      productionByDate[date].oil += parseFloat(p.oil_volume_bbl) || 0;
      productionByDate[date].gas += parseFloat(p.gas_volume_mcf) || 0;
      productionByDate[date].water += parseFloat(p.water_volume_bbl) || 0;
    });

    const productionTrend = Object.entries(productionByDate)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calcular totales
    const totals = recentProduction.reduce((acc, p) => {
      acc.oil += parseFloat(p.oil_volume_bbl) || 0;
      acc.gas += parseFloat(p.gas_volume_mcf) || 0;
      acc.water += parseFloat(p.water_volume_bbl) || 0;
      return acc;
    }, { oil: 0, gas: 0, water: 0 });

    const daysWithData = Object.keys(productionByDate).length;

    return {
      ...field.toJSON(),
      stats: {
        wellsActive: field.wells.filter(w => w.status === 'ACTIVE').length,
        wellsShutIn: field.wells.filter(w => w.status === 'SHUT_IN').length,
        wellsTotal: field.wells.length,
        projectsCount,
        purchaseOrdersCount,
        logsCount,
        last30Days: {
          totalOil: totals.oil,
          totalGas: totals.gas,
          totalWater: totals.water,
          avgOilBopd: daysWithData > 0 ? totals.oil / daysWithData : 0,
          avgGasMcfd: daysWithData > 0 ? totals.gas / daysWithData : 0,
        },
      },
      productionTrend,
    };
  }

  // ==================== WELL LOGS (BITÁCORAS) ====================

  async getWellLogs(filters = {}) {
    const { wellId, fieldId, logType, status, startDate, endDate, page = 1, limit = 20 } = filters;
    const where = {};

    if (wellId) {
      where.well_id = wellId;
    } else if (fieldId) {
      const wells = await Well.findAll({
        where: { field_id: fieldId },
        attributes: ['id'],
      });
      where.well_id = { [Op.in]: wells.map(w => w.id) };
    }

    if (logType) where.log_type = logType;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.log_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.log_date = { [Op.gte]: startDate };
    } else if (endDate) {
      where.log_date = { [Op.lte]: endDate };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await WellLog.findAndCountAll({
      where,
      include: [
        { model: Well, as: 'well', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'responsible', attributes: ['id', 'username'] },
        { model: Contractor, as: 'contractor', attributes: ['id', 'code', 'companyName'] },
        { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
      ],
      order: [['log_date', 'DESC'], ['created_at', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getWellLogById(id) {
    const log = await WellLog.findByPk(id, {
      include: [
        { model: Well, as: 'well', include: [{ model: Field, as: 'field' }] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'responsible', attributes: ['id', 'username'] },
        { model: Contractor, as: 'contractor' },
        { model: Project, as: 'project' },
        { model: PurchaseOrder, as: 'purchaseOrder' },
      ],
    });

    if (!log) {
      throw new NotFoundError('Bitácora no encontrada');
    }

    return log;
  }

  async createWellLog(data, userId) {
    const well = await Well.findByPk(data.well_id);
    if (!well) {
      throw new NotFoundError('Pozo no encontrado');
    }

    const log = await WellLog.create({
      ...data,
      created_by: userId,
    });

    logger.info(`Bitácora creada: ${log.title}`, { logId: log.id, wellId: data.well_id, userId });
    return this.getWellLogById(log.id);
  }

  async updateWellLog(id, data, userId) {
    const log = await WellLog.findByPk(id);
    if (!log) {
      throw new NotFoundError('Bitácora no encontrada');
    }

    await log.update(data);
    logger.info(`Bitácora actualizada`, { logId: id, userId });
    return this.getWellLogById(id);
  }

  async deleteWellLog(id, userId) {
    const log = await WellLog.findByPk(id);
    if (!log) {
      throw new NotFoundError('Bitácora no encontrada');
    }

    await log.destroy();
    logger.info(`Bitácora eliminada`, { logId: id, userId });
    return { message: 'Bitácora eliminada exitosamente' };
  }

  // ==================== PRODUCTION BY DATE RANGE ====================

  async getWellProductionByDateRange(wellId, startDate, endDate) {
    const productions = await WellProduction.findAll({
      where: {
        well_id: wellId,
        production_date: { [Op.between]: [startDate, endDate] },
      },
      order: [['production_date', 'ASC']],
    });

    return productions.map(p => ({
      date: p.production_date,
      oilBbl: parseFloat(p.oil_volume_bbl) || 0,
      gasMcf: parseFloat(p.gas_volume_mcf) || 0,
      waterBbl: parseFloat(p.water_volume_bbl) || 0,
      hoursOn: parseFloat(p.hours_on) || 0,
      downtimeHours: parseFloat(p.downtime_hours) || 0,
    }));
  }

  async getFieldProductionByDateRange(fieldId, startDate, endDate) {
    const wells = await Well.findAll({
      where: { field_id: fieldId },
      attributes: ['id'],
    });
    const wellIds = wells.map(w => w.id);

    const productions = await WellProduction.findAll({
      where: {
        well_id: { [Op.in]: wellIds },
        production_date: { [Op.between]: [startDate, endDate] },
      },
      attributes: [
        'production_date',
        [require('sequelize').fn('SUM', require('sequelize').col('oil_volume_bbl')), 'total_oil'],
        [require('sequelize').fn('SUM', require('sequelize').col('gas_volume_mcf')), 'total_gas'],
        [require('sequelize').fn('SUM', require('sequelize').col('water_volume_bbl')), 'total_water'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'wells_reporting'],
      ],
      group: ['production_date'],
      order: [['production_date', 'ASC']],
      raw: true,
    });

    return productions.map(p => ({
      date: p.production_date,
      oilBbl: parseFloat(p.total_oil) || 0,
      gasMcf: parseFloat(p.total_gas) || 0,
      waterBbl: parseFloat(p.total_water) || 0,
      wellsReporting: parseInt(p.wells_reporting) || 0,
    }));
  }
}

module.exports = new ProductionService();
