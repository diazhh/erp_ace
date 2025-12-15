const { Op } = require('sequelize');
const { sequelize } = require('../../../database');

class ExpenseReportService {
  /**
   * Genera código único para reporte de gastos
   */
  async generateCode() {
    const { ExpenseReport } = require('../../../database/models');
    
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `RG-${year}`;
    
    const lastReport = await ExpenseReport.findOne({
      where: {
        code: { [Op.like]: `${prefix}%` },
      },
      order: [['code', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastReport) {
      const lastNumber = parseInt(lastReport.code.split('-').pop(), 10);
      nextNumber = lastNumber + 1;
    }
    
    return `${prefix}-${nextNumber.toString().padStart(4, '0')}`;
  }

  /**
   * Crea un nuevo reporte de gastos
   */
  async create(data, userId) {
    const { ExpenseReport, ExpenseReportItem, PettyCashEntry } = require('../../../database/models');
    const t = await sequelize.transaction();
    
    try {
      // Verificar que el PettyCashEntry existe y está PAID
      const pettyCashEntry = await PettyCashEntry.findByPk(data.pettyCashEntryId);
      if (!pettyCashEntry) {
        throw new Error('Movimiento de caja chica no encontrado');
      }
      if (pettyCashEntry.status !== 'PAID') {
        throw new Error('Solo se pueden crear reportes para movimientos pagados');
      }
      
      // Verificar que no tenga ya un reporte
      const existingReport = await ExpenseReport.findOne({
        where: { pettyCashEntryId: data.pettyCashEntryId },
      });
      if (existingReport) {
        throw new Error('Este movimiento ya tiene un reporte de gastos');
      }
      
      const code = await this.generateCode();
      
      // Calcular totales
      const totalSpent = data.items?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) || 0;
      const changeReturned = parseFloat(data.changeReturned || 0);
      const amountReceived = parseFloat(pettyCashEntry.amount);
      const difference = totalSpent - amountReceived + changeReturned;
      
      // Crear reporte
      const report = await ExpenseReport.create({
        code,
        pettyCashEntryId: data.pettyCashEntryId,
        employeeId: data.employeeId,
        reportDate: data.reportDate || new Date().toISOString().split('T')[0],
        amountReceived,
        totalSpent,
        changeReturned,
        difference,
        status: 'DRAFT',
        projectId: data.projectId || pettyCashEntry.projectId,
        notes: data.notes,
        createdBy: userId,
      }, { transaction: t });
      
      // Crear items
      if (data.items && data.items.length > 0) {
        const itemsData = data.items.map(item => ({
          expenseReportId: report.id,
          itemType: item.itemType,
          description: item.description,
          quantity: item.quantity || 1,
          unit: item.unit,
          unitPrice: item.unitPrice,
          amount: item.amount || (item.quantity * item.unitPrice),
          receiptNumber: item.receiptNumber,
          receiptDate: item.receiptDate,
          vendor: item.vendor,
          vendorRif: item.vendorRif,
          notes: item.notes,
        }));
        
        await ExpenseReportItem.bulkCreate(itemsData, { transaction: t });
      }
      
      // Actualizar PettyCashEntry
      await pettyCashEntry.update({
        hasExpenseReport: true,
        expenseReportId: report.id,
      }, { transaction: t });
      
      await t.commit();
      
      return this.getById(report.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Obtiene un reporte por ID
   */
  async getById(id) {
    const { 
      ExpenseReport, ExpenseReportItem, PettyCashEntry, PettyCash,
      Employee, User, Project, InventoryItem, Asset, FuelLog 
    } = require('../../../database/models');
    
    const report = await ExpenseReport.findByPk(id, {
      include: [
        { 
          model: PettyCashEntry, 
          as: 'pettyCashEntry',
          include: [
            { model: PettyCash, as: 'pettyCash', attributes: ['id', 'code', 'name'] },
          ],
        },
        { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
        { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'approver', attributes: ['id', 'username'] },
        { 
          model: ExpenseReportItem, 
          as: 'items',
          include: [
            { model: InventoryItem, as: 'inventoryItem', attributes: ['id', 'code', 'name'], required: false },
            { model: Asset, as: 'asset', attributes: ['id', 'code', 'name'], required: false },
            { model: FuelLog, as: 'fuelLog', attributes: ['id', 'code'], required: false },
          ],
        },
      ],
    });
    
    return report;
  }

  /**
   * Lista reportes con filtros
   */
  async list(options = {}) {
    const { ExpenseReport, PettyCashEntry, PettyCash, Employee, User, Project } = require('../../../database/models');
    
    const { 
      page = 1, 
      limit = 20, 
      status, 
      employeeId, 
      projectId,
      startDate,
      endDate,
      pettyCashId,
    } = options;
    
    const offset = (page - 1) * limit;
    const whereClause = {};
    
    if (status) whereClause.status = status;
    if (employeeId) whereClause.employeeId = employeeId;
    if (projectId) whereClause.projectId = projectId;
    if (startDate && endDate) {
      whereClause.reportDate = { [Op.between]: [startDate, endDate] };
    }
    
    const includeClause = [
      { 
        model: PettyCashEntry, 
        as: 'pettyCashEntry',
        include: [
          { model: PettyCash, as: 'pettyCash', attributes: ['id', 'code', 'name'] },
        ],
        ...(pettyCashId ? { where: { pettyCashId } } : {}),
      },
      { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
      { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
      { model: User, as: 'approver', attributes: ['id', 'username'] },
    ];
    
    const { count, rows } = await ExpenseReport.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });
    
    return {
      reports: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Actualiza un reporte (solo en estado DRAFT)
   */
  async update(id, data, userId) {
    const { ExpenseReport, ExpenseReportItem, PettyCashEntry } = require('../../../database/models');
    const t = await sequelize.transaction();
    
    try {
      const report = await ExpenseReport.findByPk(id);
      if (!report) {
        throw new Error('Reporte no encontrado');
      }
      if (report.status !== 'DRAFT') {
        throw new Error('Solo se pueden editar reportes en borrador');
      }
      
      // Recalcular totales si hay items
      let totalSpent = report.totalSpent;
      if (data.items) {
        totalSpent = data.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      }
      
      const changeReturned = parseFloat(data.changeReturned ?? report.changeReturned);
      const difference = totalSpent - parseFloat(report.amountReceived) + changeReturned;
      
      // Actualizar reporte
      await report.update({
        reportDate: data.reportDate || report.reportDate,
        totalSpent,
        changeReturned,
        difference,
        projectId: data.projectId !== undefined ? data.projectId : report.projectId,
        notes: data.notes !== undefined ? data.notes : report.notes,
      }, { transaction: t });
      
      // Actualizar items si se proporcionan
      if (data.items) {
        // Eliminar items existentes
        await ExpenseReportItem.destroy({
          where: { expenseReportId: id },
          transaction: t,
        });
        
        // Crear nuevos items
        const itemsData = data.items.map(item => ({
          expenseReportId: id,
          itemType: item.itemType,
          description: item.description,
          quantity: item.quantity || 1,
          unit: item.unit,
          unitPrice: item.unitPrice,
          amount: item.amount || (item.quantity * item.unitPrice),
          receiptNumber: item.receiptNumber,
          receiptDate: item.receiptDate,
          vendor: item.vendor,
          vendorRif: item.vendorRif,
          notes: item.notes,
        }));
        
        await ExpenseReportItem.bulkCreate(itemsData, { transaction: t });
      }
      
      await t.commit();
      
      return this.getById(id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Envía reporte para aprobación
   */
  async submit(id, userId) {
    const { ExpenseReport } = require('../../../database/models');
    
    const report = await ExpenseReport.findByPk(id);
    if (!report) {
      throw new Error('Reporte no encontrado');
    }
    if (report.status !== 'DRAFT') {
      throw new Error('Solo se pueden enviar reportes en borrador');
    }
    
    await report.update({
      status: 'SUBMITTED',
      submittedAt: new Date(),
    });
    
    return this.getById(id);
  }

  /**
   * Aprueba un reporte
   */
  async approve(id, userId) {
    const { ExpenseReport } = require('../../../database/models');
    
    const report = await ExpenseReport.findByPk(id);
    if (!report) {
      throw new Error('Reporte no encontrado');
    }
    if (report.status !== 'SUBMITTED') {
      throw new Error('Solo se pueden aprobar reportes enviados');
    }
    
    await report.update({
      status: 'APPROVED',
      approvedBy: userId,
      approvedAt: new Date(),
    });
    
    return this.getById(id);
  }

  /**
   * Rechaza un reporte
   */
  async reject(id, reason, userId) {
    const { ExpenseReport } = require('../../../database/models');
    
    const report = await ExpenseReport.findByPk(id);
    if (!report) {
      throw new Error('Reporte no encontrado');
    }
    if (report.status !== 'SUBMITTED') {
      throw new Error('Solo se pueden rechazar reportes enviados');
    }
    
    await report.update({
      status: 'REJECTED',
      rejectionReason: reason,
      approvedBy: userId,
      approvedAt: new Date(),
    });
    
    return this.getById(id);
  }

  /**
   * Agrega un item a un reporte
   */
  async addItem(reportId, itemData, userId) {
    const { ExpenseReport, ExpenseReportItem } = require('../../../database/models');
    
    const report = await ExpenseReport.findByPk(reportId);
    if (!report) {
      throw new Error('Reporte no encontrado');
    }
    if (report.status !== 'DRAFT') {
      throw new Error('Solo se pueden agregar items a reportes en borrador');
    }
    
    const item = await ExpenseReportItem.create({
      expenseReportId: reportId,
      itemType: itemData.itemType,
      description: itemData.description,
      quantity: itemData.quantity || 1,
      unit: itemData.unit,
      unitPrice: itemData.unitPrice,
      amount: itemData.amount || (itemData.quantity * itemData.unitPrice),
      receiptNumber: itemData.receiptNumber,
      receiptDate: itemData.receiptDate,
      vendor: itemData.vendor,
      vendorRif: itemData.vendorRif,
      notes: itemData.notes,
    });
    
    // Recalcular totales
    await this.recalculateTotals(reportId);
    
    return item;
  }

  /**
   * Elimina un item de un reporte
   */
  async removeItem(reportId, itemId, userId) {
    const { ExpenseReport, ExpenseReportItem } = require('../../../database/models');
    
    const report = await ExpenseReport.findByPk(reportId);
    if (!report) {
      throw new Error('Reporte no encontrado');
    }
    if (report.status !== 'DRAFT') {
      throw new Error('Solo se pueden eliminar items de reportes en borrador');
    }
    
    const item = await ExpenseReportItem.findOne({
      where: { id: itemId, expenseReportId: reportId },
    });
    if (!item) {
      throw new Error('Item no encontrado');
    }
    
    await item.destroy();
    
    // Recalcular totales
    await this.recalculateTotals(reportId);
    
    return { success: true };
  }

  /**
   * Recalcula los totales del reporte
   */
  async recalculateTotals(reportId) {
    const { ExpenseReport, ExpenseReportItem } = require('../../../database/models');
    
    const report = await ExpenseReport.findByPk(reportId);
    if (!report) return;
    
    const items = await ExpenseReportItem.findAll({
      where: { expenseReportId: reportId },
    });
    
    const totalSpent = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const difference = totalSpent - parseFloat(report.amountReceived) + parseFloat(report.changeReturned);
    
    await report.update({ totalSpent, difference });
  }

  /**
   * Obtiene estadísticas de reportes
   */
  async getStats(options = {}) {
    const { ExpenseReport, ExpenseReportItem } = require('../../../database/models');
    
    const { startDate, endDate, employeeId, projectId } = options;
    
    const whereClause = { status: 'APPROVED' };
    if (employeeId) whereClause.employeeId = employeeId;
    if (projectId) whereClause.projectId = projectId;
    if (startDate && endDate) {
      whereClause.reportDate = { [Op.between]: [startDate, endDate] };
    }
    
    // Totales generales
    const reports = await ExpenseReport.findAll({ where: whereClause });
    const totalReports = reports.length;
    const totalSpent = reports.reduce((sum, r) => sum + parseFloat(r.totalSpent), 0);
    const totalReceived = reports.reduce((sum, r) => sum + parseFloat(r.amountReceived), 0);
    const totalReturned = reports.reduce((sum, r) => sum + parseFloat(r.changeReturned), 0);
    
    // Por tipo de gasto
    const reportIds = reports.map(r => r.id);
    const byType = await ExpenseReportItem.findAll({
      where: { expenseReportId: { [Op.in]: reportIds } },
      attributes: [
        'itemType',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['itemType'],
      raw: true,
    });
    
    // Pendientes de aprobación
    const pendingCount = await ExpenseReport.count({
      where: { status: 'SUBMITTED' },
    });
    
    return {
      totalReports,
      totalSpent,
      totalReceived,
      totalReturned,
      difference: totalSpent - totalReceived + totalReturned,
      byType,
      pendingApproval: pendingCount,
    };
  }
}

module.exports = new ExpenseReportService();
