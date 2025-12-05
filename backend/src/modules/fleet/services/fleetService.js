const { Op } = require('sequelize');
const { sequelize } = require('../../../database');

class FleetService {
  constructor() {
    this.models = null;
  }

  getModels() {
    if (!this.models) {
      this.models = require('../../../database/models');
    }
    return this.models;
  }

  // ========== VEHICLE METHODS ==========

  /**
   * Genera código único para vehículo
   */
  async generateVehicleCode() {
    const { Vehicle } = this.getModels();
    const year = new Date().getFullYear().toString().slice(-2);
    
    const lastVehicle = await Vehicle.findOne({
      where: {
        code: { [Op.like]: `VEH-${year}-%` },
      },
      order: [['code', 'DESC']],
    });

    let nextNumber = 1;
    if (lastVehicle) {
      const lastNumber = parseInt(lastVehicle.code.split('-')[2], 10);
      nextNumber = lastNumber + 1;
    }

    return `VEH-${year}-${nextNumber.toString().padStart(4, '0')}`;
  }

  /**
   * Crear vehículo
   */
  async createVehicle(data, userId) {
    const { Vehicle } = this.getModels();
    
    const code = await this.generateVehicleCode();
    
    const vehicle = await Vehicle.create({
      ...data,
      code,
      createdBy: userId,
    });

    return vehicle;
  }

  /**
   * Obtener vehículos con filtros
   */
  async getVehicles(filters = {}) {
    const { Vehicle, VehicleAssignment, Employee, Project } = this.getModels();
    const {
      search,
      status,
      vehicleType,
      fuelType,
      ownershipType,
      page = 1,
      limit = 20,
    } = filters;

    const where = {};

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { plate: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { model: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (vehicleType) where.vehicleType = vehicleType;
    if (fuelType) where.fuelType = fuelType;
    if (ownershipType) where.ownershipType = ownershipType;

    const { count, rows } = await Vehicle.findAndCountAll({
      where,
      include: [
        {
          model: VehicleAssignment,
          as: 'assignments',
          where: { status: 'ACTIVE' },
          required: false,
          include: [
            { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'] },
            { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      distinct: true,
    });

    return {
      vehicles: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
  }

  /**
   * Obtener vehículo por ID con relaciones
   */
  async getVehicleById(id) {
    const { Vehicle, VehicleAssignment, Employee, Project, Department, User } = this.getModels();

    const vehicle = await Vehicle.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        {
          model: VehicleAssignment,
          as: 'assignments',
          include: [
            { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'idNumber'] },
            { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
            { model: Department, as: 'department', attributes: ['id', 'name'] },
          ],
          order: [['startDate', 'DESC']],
        },
      ],
    });

    return vehicle;
  }

  /**
   * Obtener vehículo completo con estadísticas
   */
  async getVehicleFull(id) {
    const { Vehicle, VehicleAssignment, VehicleMaintenance, FuelLog, Employee, Project, Department, User } = this.getModels();

    const vehicle = await Vehicle.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });

    if (!vehicle) return null;

    // Asignación actual
    const currentAssignment = await VehicleAssignment.findOne({
      where: { vehicleId: id, status: 'ACTIVE' },
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'idNumber'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
      ],
    });

    // Historial de asignaciones
    const assignments = await VehicleAssignment.findAll({
      where: { vehicleId: id },
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
      ],
      order: [['startDate', 'DESC']],
      limit: 20,
    });

    // Últimos mantenimientos
    const maintenances = await VehicleMaintenance.findAll({
      where: { vehicleId: id },
      order: [['completedDate', 'DESC'], ['scheduledDate', 'DESC']],
      limit: 10,
    });

    // Últimas cargas de combustible
    const fuelLogs = await FuelLog.findAll({
      where: { vehicleId: id },
      include: [
        { model: Employee, as: 'driver', attributes: ['id', 'firstName', 'lastName'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
      ],
      order: [['fuelDate', 'DESC']],
      limit: 20,
    });

    // Estadísticas
    const stats = await this.getVehicleStats(id);

    return {
      ...vehicle.toJSON(),
      currentAssignment,
      assignments,
      maintenances,
      fuelLogs,
      stats,
    };
  }

  /**
   * Estadísticas de un vehículo
   */
  async getVehicleStats(vehicleId) {
    const { VehicleMaintenance, FuelLog } = this.getModels();

    // Total costos de mantenimiento
    const maintenanceCosts = await VehicleMaintenance.findOne({
      where: { vehicleId, status: 'COMPLETED' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_cost')), 'totalMaintenanceCost'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'maintenanceCount'],
      ],
      raw: true,
    });

    // Total costos de combustible
    const fuelCosts = await FuelLog.findOne({
      where: { vehicleId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_cost')), 'totalFuelCost'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalFuelQuantity'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'fuelLogCount'],
      ],
      raw: true,
    });

    // Consumo promedio (km/litro)
    const fuelLogsForAvg = await FuelLog.findAll({
      where: { vehicleId, fullTank: true },
      order: [['mileage', 'ASC']],
      attributes: ['mileage', 'quantity'],
      raw: true,
    });

    let avgConsumption = null;
    if (fuelLogsForAvg.length >= 2) {
      let totalKm = 0;
      let totalLiters = 0;
      for (let i = 1; i < fuelLogsForAvg.length; i++) {
        totalKm += fuelLogsForAvg[i].mileage - fuelLogsForAvg[i - 1].mileage;
        totalLiters += parseFloat(fuelLogsForAvg[i].quantity);
      }
      if (totalLiters > 0) {
        avgConsumption = (totalKm / totalLiters).toFixed(2);
      }
    }

    return {
      totalMaintenanceCost: parseFloat(maintenanceCosts?.totalMaintenanceCost || 0),
      maintenanceCount: parseInt(maintenanceCosts?.maintenanceCount || 0),
      totalFuelCost: parseFloat(fuelCosts?.totalFuelCost || 0),
      totalFuelQuantity: parseFloat(fuelCosts?.totalFuelQuantity || 0),
      fuelLogCount: parseInt(fuelCosts?.fuelLogCount || 0),
      avgConsumption,
      totalCost: parseFloat(maintenanceCosts?.totalMaintenanceCost || 0) + parseFloat(fuelCosts?.totalFuelCost || 0),
    };
  }

  /**
   * Actualizar vehículo
   */
  async updateVehicle(id, data) {
    const { Vehicle } = this.getModels();
    
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) throw new Error('Vehículo no encontrado');

    await vehicle.update(data);
    return vehicle;
  }

  /**
   * Eliminar vehículo
   */
  async deleteVehicle(id) {
    const { Vehicle, VehicleAssignment, VehicleMaintenance, FuelLog } = this.getModels();

    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) throw new Error('Vehículo no encontrado');

    // Verificar si tiene asignaciones activas
    const activeAssignments = await VehicleAssignment.count({
      where: { vehicleId: id, status: 'ACTIVE' },
    });
    if (activeAssignments > 0) {
      throw new Error('No se puede eliminar un vehículo con asignaciones activas');
    }

    // Verificar si tiene registros
    const hasMaintenances = await VehicleMaintenance.count({ where: { vehicleId: id } });
    const hasFuelLogs = await FuelLog.count({ where: { vehicleId: id } });

    if (hasMaintenances > 0 || hasFuelLogs > 0) {
      // Soft delete - cambiar estado a SOLD
      await vehicle.update({ status: 'SOLD' });
      return { softDeleted: true };
    }

    await vehicle.destroy();
    return { deleted: true };
  }

  // ========== ASSIGNMENT METHODS ==========

  /**
   * Crear asignación
   */
  async createAssignment(data, userId) {
    const { Vehicle, VehicleAssignment } = this.getModels();
    const t = await sequelize.transaction();

    try {
      const vehicle = await Vehicle.findByPk(data.vehicleId, { transaction: t });
      if (!vehicle) throw new Error('Vehículo no encontrado');

      // Verificar si ya tiene asignación activa
      const activeAssignment = await VehicleAssignment.findOne({
        where: { vehicleId: data.vehicleId, status: 'ACTIVE' },
        transaction: t,
      });

      if (activeAssignment) {
        throw new Error('El vehículo ya tiene una asignación activa. Finalice la asignación actual primero.');
      }

      // Crear asignación
      const assignment = await VehicleAssignment.create({
        ...data,
        startMileage: data.startMileage || vehicle.mileage,
        createdBy: userId,
      }, { transaction: t });

      // Actualizar estado del vehículo
      await vehicle.update({ status: 'ASSIGNED' }, { transaction: t });

      await t.commit();
      return assignment;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Finalizar asignación
   */
  async endAssignment(assignmentId, data, userId) {
    const { Vehicle, VehicleAssignment } = this.getModels();
    const t = await sequelize.transaction();

    try {
      const assignment = await VehicleAssignment.findByPk(assignmentId, {
        include: [{ model: Vehicle, as: 'vehicle' }],
        transaction: t,
      });

      if (!assignment) throw new Error('Asignación no encontrada');
      if (assignment.status !== 'ACTIVE') throw new Error('La asignación no está activa');

      // Actualizar asignación
      await assignment.update({
        endDate: data.endDate || new Date(),
        endMileage: data.endMileage || assignment.vehicle.mileage,
        status: 'COMPLETED',
        notes: data.notes || assignment.notes,
      }, { transaction: t });

      // Actualizar kilometraje del vehículo si se proporcionó
      if (data.endMileage) {
        await assignment.vehicle.update({ mileage: data.endMileage }, { transaction: t });
      }

      // Actualizar estado del vehículo
      await assignment.vehicle.update({ status: 'AVAILABLE' }, { transaction: t });

      await t.commit();
      return assignment;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Obtener asignaciones
   */
  async getAssignments(filters = {}) {
    const { VehicleAssignment, Vehicle, Employee, Project, Department } = this.getModels();
    const { vehicleId, employeeId, projectId, status, page = 1, limit = 20 } = filters;

    const where = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (employeeId) where.employeeId = employeeId;
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const { count, rows } = await VehicleAssignment.findAndCountAll({
      where,
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'code', 'plate', 'brand', 'model'] },
        { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
      ],
      order: [['startDate', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return {
      assignments: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
  }

  // ========== MAINTENANCE METHODS ==========

  /**
   * Genera código único para mantenimiento
   */
  async generateMaintenanceCode() {
    const { VehicleMaintenance } = this.getModels();
    const year = new Date().getFullYear().toString().slice(-2);
    
    const lastMaintenance = await VehicleMaintenance.findOne({
      where: {
        code: { [Op.like]: `MNT-${year}-%` },
      },
      order: [['code', 'DESC']],
    });

    let nextNumber = 1;
    if (lastMaintenance) {
      const lastNumber = parseInt(lastMaintenance.code.split('-')[2], 10);
      nextNumber = lastNumber + 1;
    }

    return `MNT-${year}-${nextNumber.toString().padStart(4, '0')}`;
  }

  /**
   * Crear mantenimiento
   */
  async createMaintenance(data, userId) {
    const { Vehicle, VehicleMaintenance } = this.getModels();
    const t = await sequelize.transaction();

    try {
      const vehicle = await Vehicle.findByPk(data.vehicleId, { transaction: t });
      if (!vehicle) throw new Error('Vehículo no encontrado');

      const code = await this.generateMaintenanceCode();

      // Calcular total
      const totalCost = parseFloat(data.laborCost || 0) + 
                        parseFloat(data.partsCost || 0) + 
                        parseFloat(data.otherCost || 0);

      const maintenance = await VehicleMaintenance.create({
        ...data,
        code,
        totalCost,
        mileageAtService: data.mileageAtService || vehicle.mileage,
        createdBy: userId,
      }, { transaction: t });

      // Si el mantenimiento está en progreso, actualizar estado del vehículo
      if (data.status === 'IN_PROGRESS') {
        await vehicle.update({ status: 'IN_MAINTENANCE' }, { transaction: t });
      }

      await t.commit();
      return maintenance;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Completar mantenimiento
   */
  async completeMaintenance(maintenanceId, data, userId) {
    const { Vehicle, VehicleMaintenance } = this.getModels();
    const t = await sequelize.transaction();

    try {
      const maintenance = await VehicleMaintenance.findByPk(maintenanceId, {
        include: [{ model: Vehicle, as: 'vehicle' }],
        transaction: t,
      });

      if (!maintenance) throw new Error('Mantenimiento no encontrado');
      if (maintenance.status === 'COMPLETED') throw new Error('El mantenimiento ya está completado');

      // Calcular total
      const totalCost = parseFloat(data.laborCost || maintenance.laborCost || 0) + 
                        parseFloat(data.partsCost || maintenance.partsCost || 0) + 
                        parseFloat(data.otherCost || maintenance.otherCost || 0);

      // Actualizar mantenimiento
      await maintenance.update({
        ...data,
        totalCost,
        completedDate: data.completedDate || new Date(),
        status: 'COMPLETED',
        completedBy: userId,
      }, { transaction: t });

      // Actualizar vehículo
      const vehicleUpdates = {
        lastMaintenanceDate: maintenance.completedDate || new Date(),
        lastMaintenanceMileage: maintenance.mileageAtService,
      };

      if (maintenance.nextMaintenanceMileage) {
        vehicleUpdates.nextMaintenanceMileage = maintenance.nextMaintenanceMileage;
      } else if (maintenance.vehicle.maintenanceIntervalKm) {
        vehicleUpdates.nextMaintenanceMileage = maintenance.mileageAtService + maintenance.vehicle.maintenanceIntervalKm;
      }

      // Verificar si hay asignación activa para determinar el estado
      const { VehicleAssignment } = this.getModels();
      const activeAssignment = await VehicleAssignment.findOne({
        where: { vehicleId: maintenance.vehicleId, status: 'ACTIVE' },
        transaction: t,
      });

      vehicleUpdates.status = activeAssignment ? 'ASSIGNED' : 'AVAILABLE';

      await maintenance.vehicle.update(vehicleUpdates, { transaction: t });

      await t.commit();
      return maintenance;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Obtener mantenimientos
   */
  async getMaintenances(filters = {}) {
    const { VehicleMaintenance, Vehicle } = this.getModels();
    const { vehicleId, maintenanceType, status, startDate, endDate, page = 1, limit = 20 } = filters;

    const where = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (maintenanceType) where.maintenanceType = maintenanceType;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.scheduledDate = { [Op.between]: [startDate, endDate] };
    }

    const { count, rows } = await VehicleMaintenance.findAndCountAll({
      where,
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'code', 'plate', 'brand', 'model'] },
      ],
      order: [['scheduledDate', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return {
      maintenances: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
  }

  /**
   * Obtener mantenimiento por ID
   */
  async getMaintenanceById(id) {
    const { VehicleMaintenance, Vehicle, User } = this.getModels();

    return await VehicleMaintenance.findByPk(id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'completer', attributes: ['id', 'username'] },
      ],
    });
  }

  /**
   * Actualizar mantenimiento
   */
  async updateMaintenance(id, data) {
    const { VehicleMaintenance } = this.getModels();

    const maintenance = await VehicleMaintenance.findByPk(id);
    if (!maintenance) throw new Error('Mantenimiento no encontrado');

    // Recalcular total si se actualizan costos
    if (data.laborCost !== undefined || data.partsCost !== undefined || data.otherCost !== undefined) {
      data.totalCost = parseFloat(data.laborCost || maintenance.laborCost || 0) + 
                       parseFloat(data.partsCost || maintenance.partsCost || 0) + 
                       parseFloat(data.otherCost || maintenance.otherCost || 0);
    }

    await maintenance.update(data);
    return maintenance;
  }

  // ========== FUEL LOG METHODS ==========

  /**
   * Genera código único para registro de combustible
   */
  async generateFuelLogCode() {
    const { FuelLog } = this.getModels();
    const year = new Date().getFullYear().toString().slice(-2);
    
    const lastLog = await FuelLog.findOne({
      where: {
        code: { [Op.like]: `FUEL-${year}-%` },
      },
      order: [['code', 'DESC']],
    });

    let nextNumber = 1;
    if (lastLog) {
      const lastNumber = parseInt(lastLog.code.split('-')[2], 10);
      nextNumber = lastNumber + 1;
    }

    return `FUEL-${year}-${nextNumber.toString().padStart(4, '0')}`;
  }

  /**
   * Crear registro de combustible
   */
  async createFuelLog(data, userId) {
    const { Vehicle, FuelLog } = this.getModels();
    const t = await sequelize.transaction();

    try {
      const vehicle = await Vehicle.findByPk(data.vehicleId, { transaction: t });
      if (!vehicle) throw new Error('Vehículo no encontrado');

      const code = await this.generateFuelLogCode();

      // Calcular total
      const totalCost = parseFloat(data.quantity) * parseFloat(data.unitPrice);

      const fuelLog = await FuelLog.create({
        ...data,
        code,
        totalCost,
        createdBy: userId,
      }, { transaction: t });

      // Actualizar kilometraje del vehículo si es mayor
      if (data.mileage > vehicle.mileage) {
        await vehicle.update({ mileage: data.mileage }, { transaction: t });
      }

      await t.commit();
      return fuelLog;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Obtener registros de combustible
   */
  async getFuelLogs(filters = {}) {
    const { FuelLog, Vehicle, Employee, Project } = this.getModels();
    const { vehicleId, driverId, projectId, startDate, endDate, page = 1, limit = 20 } = filters;

    const where = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (driverId) where.driverId = driverId;
    if (projectId) where.projectId = projectId;
    if (startDate && endDate) {
      where.fuelDate = { [Op.between]: [startDate, endDate] };
    }

    const { count, rows } = await FuelLog.findAndCountAll({
      where,
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'code', 'plate', 'brand', 'model'] },
        { model: Employee, as: 'driver', attributes: ['id', 'firstName', 'lastName'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
      ],
      order: [['fuelDate', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return {
      fuelLogs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
  }

  /**
   * Obtener registro de combustible por ID
   */
  async getFuelLogById(id) {
    const { FuelLog, Vehicle, Employee, Project, User } = this.getModels();

    return await FuelLog.findByPk(id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Employee, as: 'driver', attributes: ['id', 'firstName', 'lastName'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });
  }

  /**
   * Actualizar registro de combustible
   */
  async updateFuelLog(id, data) {
    const { FuelLog } = this.getModels();

    const fuelLog = await FuelLog.findByPk(id);
    if (!fuelLog) throw new Error('Registro de combustible no encontrado');

    // Recalcular total si se actualizan cantidad o precio
    if (data.quantity !== undefined || data.unitPrice !== undefined) {
      data.totalCost = parseFloat(data.quantity || fuelLog.quantity) * 
                       parseFloat(data.unitPrice || fuelLog.unitPrice);
    }

    await fuelLog.update(data);
    return fuelLog;
  }

  /**
   * Eliminar registro de combustible
   */
  async deleteFuelLog(id) {
    const { FuelLog } = this.getModels();

    const fuelLog = await FuelLog.findByPk(id);
    if (!fuelLog) throw new Error('Registro de combustible no encontrado');

    await fuelLog.destroy();
    return { deleted: true };
  }

  // ========== STATISTICS ==========

  /**
   * Estadísticas generales de flota
   */
  async getFleetStats() {
    const { Vehicle, VehicleAssignment, VehicleMaintenance, FuelLog } = this.getModels();

    // Conteo por estado
    const vehiclesByStatus = await Vehicle.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Conteo por tipo
    const vehiclesByType = await Vehicle.findAll({
      attributes: [
        'vehicleType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['vehicleType'],
      raw: true,
    });

    // Total vehículos
    const totalVehicles = await Vehicle.count();

    // Vehículos disponibles
    const availableVehicles = await Vehicle.count({ where: { status: 'AVAILABLE' } });

    // Vehículos asignados
    const assignedVehicles = await Vehicle.count({ where: { status: 'ASSIGNED' } });

    // Vehículos en mantenimiento
    const inMaintenanceVehicles = await Vehicle.count({ where: { status: 'IN_MAINTENANCE' } });

    // Mantenimientos pendientes
    const pendingMaintenances = await VehicleMaintenance.count({
      where: { status: { [Op.in]: ['SCHEDULED', 'IN_PROGRESS'] } },
    });

    // Costos del mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyMaintenanceCost = await VehicleMaintenance.sum('total_cost', {
      where: {
        status: 'COMPLETED',
        completedDate: { [Op.gte]: startOfMonth },
      },
    });

    const monthlyFuelCost = await FuelLog.sum('total_cost', {
      where: {
        fuelDate: { [Op.gte]: startOfMonth },
      },
    });

    // Vehículos con documentos por vencer (próximos 30 días)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringDocuments = await Vehicle.count({
      where: {
        [Op.or]: [
          { insuranceExpiry: { [Op.between]: [new Date(), thirtyDaysFromNow] } },
          { registrationExpiry: { [Op.between]: [new Date(), thirtyDaysFromNow] } },
          { technicalReviewExpiry: { [Op.between]: [new Date(), thirtyDaysFromNow] } },
        ],
      },
    });

    // Vehículos que necesitan mantenimiento
    const needsMaintenance = await Vehicle.count({
      where: {
        nextMaintenanceMileage: { [Op.lte]: sequelize.col('mileage') },
      },
    });

    return {
      totalVehicles,
      availableVehicles,
      assignedVehicles,
      inMaintenanceVehicles,
      vehiclesByStatus,
      vehiclesByType,
      pendingMaintenances,
      monthlyMaintenanceCost: parseFloat(monthlyMaintenanceCost || 0),
      monthlyFuelCost: parseFloat(monthlyFuelCost || 0),
      monthlyTotalCost: parseFloat(monthlyMaintenanceCost || 0) + parseFloat(monthlyFuelCost || 0),
      expiringDocuments,
      needsMaintenance,
    };
  }

  /**
   * Obtener catálogos
   */
  getCatalogs() {
    return {
      vehicleTypes: [
        { value: 'SEDAN', label: 'Sedán' },
        { value: 'SUV', label: 'SUV' },
        { value: 'PICKUP', label: 'Pickup' },
        { value: 'VAN', label: 'Van' },
        { value: 'TRUCK', label: 'Camión' },
        { value: 'MOTORCYCLE', label: 'Motocicleta' },
        { value: 'HEAVY_EQUIPMENT', label: 'Equipo Pesado' },
        { value: 'OTHER', label: 'Otro' },
      ],
      fuelTypes: [
        { value: 'GASOLINE', label: 'Gasolina' },
        { value: 'DIESEL', label: 'Diesel' },
        { value: 'ELECTRIC', label: 'Eléctrico' },
        { value: 'HYBRID', label: 'Híbrido' },
        { value: 'GAS', label: 'Gas' },
      ],
      ownershipTypes: [
        { value: 'OWNED', label: 'Propio' },
        { value: 'LEASED', label: 'Leasing' },
        { value: 'RENTED', label: 'Alquilado' },
      ],
      vehicleStatuses: [
        { value: 'AVAILABLE', label: 'Disponible' },
        { value: 'ASSIGNED', label: 'Asignado' },
        { value: 'IN_MAINTENANCE', label: 'En Mantenimiento' },
        { value: 'OUT_OF_SERVICE', label: 'Fuera de Servicio' },
        { value: 'SOLD', label: 'Vendido' },
      ],
      maintenanceTypes: [
        { value: 'PREVENTIVE', label: 'Preventivo' },
        { value: 'CORRECTIVE', label: 'Correctivo' },
        { value: 'INSPECTION', label: 'Inspección' },
        { value: 'TIRE_SERVICE', label: 'Servicio de Neumáticos' },
        { value: 'BODY_WORK', label: 'Carrocería' },
        { value: 'ELECTRICAL', label: 'Eléctrico' },
        { value: 'OTHER', label: 'Otro' },
      ],
      maintenanceStatuses: [
        { value: 'SCHEDULED', label: 'Programado' },
        { value: 'IN_PROGRESS', label: 'En Progreso' },
        { value: 'COMPLETED', label: 'Completado' },
        { value: 'CANCELLED', label: 'Cancelado' },
      ],
      assignmentTypes: [
        { value: 'EMPLOYEE', label: 'Empleado' },
        { value: 'PROJECT', label: 'Proyecto' },
        { value: 'DEPARTMENT', label: 'Departamento' },
      ],
      fuelLogTypes: [
        { value: 'GASOLINE_91', label: 'Gasolina 91' },
        { value: 'GASOLINE_95', label: 'Gasolina 95' },
        { value: 'DIESEL', label: 'Diesel' },
        { value: 'ELECTRIC', label: 'Eléctrico (kWh)' },
        { value: 'GAS', label: 'Gas' },
      ],
      paymentMethods: [
        { value: 'CASH', label: 'Efectivo' },
        { value: 'CARD', label: 'Tarjeta' },
        { value: 'FLEET_CARD', label: 'Tarjeta de Flota' },
        { value: 'TRANSFER', label: 'Transferencia' },
        { value: 'PETTY_CASH', label: 'Caja Chica' },
      ],
      transmissions: [
        { value: 'MANUAL', label: 'Manual' },
        { value: 'AUTOMATIC', label: 'Automática' },
      ],
    };
  }

  /**
   * Obtener alertas de flota
   */
  async getAlerts() {
    const { Vehicle, VehicleMaintenance } = this.getModels();

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Documentos vencidos
    const expiredDocuments = await Vehicle.findAll({
      where: {
        status: { [Op.notIn]: ['SOLD', 'OUT_OF_SERVICE'] },
        [Op.or]: [
          { insuranceExpiry: { [Op.lt]: today } },
          { registrationExpiry: { [Op.lt]: today } },
          { technicalReviewExpiry: { [Op.lt]: today } },
        ],
      },
      attributes: ['id', 'code', 'plate', 'brand', 'model', 'insuranceExpiry', 'registrationExpiry', 'technicalReviewExpiry'],
    });

    // Documentos por vencer
    const expiringDocuments = await Vehicle.findAll({
      where: {
        status: { [Op.notIn]: ['SOLD', 'OUT_OF_SERVICE'] },
        [Op.or]: [
          { insuranceExpiry: { [Op.between]: [today, thirtyDaysFromNow] } },
          { registrationExpiry: { [Op.between]: [today, thirtyDaysFromNow] } },
          { technicalReviewExpiry: { [Op.between]: [today, thirtyDaysFromNow] } },
        ],
      },
      attributes: ['id', 'code', 'plate', 'brand', 'model', 'insuranceExpiry', 'registrationExpiry', 'technicalReviewExpiry'],
    });

    // Vehículos que necesitan mantenimiento
    const needsMaintenance = await Vehicle.findAll({
      where: {
        status: { [Op.notIn]: ['SOLD', 'OUT_OF_SERVICE', 'IN_MAINTENANCE'] },
        nextMaintenanceMileage: { [Op.lte]: sequelize.col('mileage') },
      },
      attributes: ['id', 'code', 'plate', 'brand', 'model', 'mileage', 'nextMaintenanceMileage'],
    });

    // Mantenimientos programados para hoy
    const todayMaintenances = await VehicleMaintenance.findAll({
      where: {
        scheduledDate: today.toISOString().split('T')[0],
        status: { [Op.in]: ['SCHEDULED', 'IN_PROGRESS'] },
      },
      include: [{ model: Vehicle, as: 'vehicle', attributes: ['id', 'code', 'plate', 'brand', 'model'] }],
    });

    return {
      expiredDocuments,
      expiringDocuments,
      needsMaintenance,
      todayMaintenances,
    };
  }
}

module.exports = new FleetService();
