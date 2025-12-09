const { Op } = require('sequelize');

class ApprovalService {
  getModels() {
    return require('../../../database/models');
  }

  /**
   * Obtener todas las solicitudes pendientes de aprobación
   */
  async getPendingApprovals(filters = {}) {
    const { PettyCashEntry, FuelLog, PettyCash, Vehicle, Employee, User, Project } = this.getModels();
    const { type, page = 1, limit = 20 } = filters;

    const results = {
      pettyCashEntries: [],
      fuelLogs: [],
      totals: {
        pettyCashPending: 0,
        fuelLogsPending: 0,
        total: 0,
      },
    };

    // Obtener movimientos de caja chica pendientes
    if (!type || type === 'petty_cash') {
      const { count, rows } = await PettyCashEntry.findAndCountAll({
        where: { status: 'PENDING' },
        include: [
          { model: PettyCash, as: 'pettyCash', attributes: ['id', 'code', 'name'] },
          { model: Employee, as: 'beneficiary', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'], required: false },
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
      });

      results.pettyCashEntries = rows.map(entry => ({
        ...entry.toJSON(),
        entityType: 'petty_cash_entry',
      }));
      results.totals.pettyCashPending = count;
    }

    // Obtener registros de combustible pendientes
    if (!type || type === 'fuel_log') {
      const { count, rows } = await FuelLog.findAndCountAll({
        where: { status: 'PENDING' },
        include: [
          { model: Vehicle, as: 'vehicle', attributes: ['id', 'code', 'plate', 'brand', 'model'] },
          { model: Employee, as: 'driver', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'], required: false },
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
      });

      results.fuelLogs = rows.map(log => ({
        ...log.toJSON(),
        entityType: 'fuel_log',
      }));
      results.totals.fuelLogsPending = count;
    }

    results.totals.total = results.totals.pettyCashPending + results.totals.fuelLogsPending;

    return results;
  }

  /**
   * Obtener todas las solicitudes aprobadas pendientes de pago
   */
  async getPendingPayments(filters = {}) {
    const { PettyCashEntry, FuelLog, PettyCash, Vehicle, Employee, User, Project } = this.getModels();
    const { type, page = 1, limit = 20 } = filters;

    const results = {
      pettyCashEntries: [],
      fuelLogs: [],
      totals: {
        pettyCashApproved: 0,
        fuelLogsApproved: 0,
        total: 0,
      },
    };

    // Obtener movimientos de caja chica aprobados (pendientes de pago)
    if (!type || type === 'petty_cash') {
      const { count, rows } = await PettyCashEntry.findAndCountAll({
        where: { 
          status: 'APPROVED',
          entryType: 'EXPENSE', // Solo gastos necesitan pago
        },
        include: [
          { model: PettyCash, as: 'pettyCash', attributes: ['id', 'code', 'name'] },
          { model: Employee, as: 'beneficiary', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: User, as: 'approver', attributes: ['id', 'username'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'], required: false },
        ],
        order: [['approvedAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
      });

      results.pettyCashEntries = rows.map(entry => ({
        ...entry.toJSON(),
        entityType: 'petty_cash_entry',
      }));
      results.totals.pettyCashApproved = count;
    }

    // Obtener registros de combustible aprobados (pendientes de pago)
    if (!type || type === 'fuel_log') {
      const { count, rows } = await FuelLog.findAndCountAll({
        where: { status: 'APPROVED' },
        include: [
          { model: Vehicle, as: 'vehicle', attributes: ['id', 'code', 'plate', 'brand', 'model'] },
          { model: Employee, as: 'driver', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: User, as: 'approver', attributes: ['id', 'username'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'], required: false },
        ],
        order: [['approvedAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
      });

      results.fuelLogs = rows.map(log => ({
        ...log.toJSON(),
        entityType: 'fuel_log',
      }));
      results.totals.fuelLogsApproved = count;
    }

    results.totals.total = results.totals.pettyCashApproved + results.totals.fuelLogsApproved;

    return results;
  }

  /**
   * Obtener estadísticas de aprobaciones
   */
  async getApprovalStats() {
    const { PettyCashEntry, FuelLog } = this.getModels();

    // Contar por status
    const pettyCashPending = await PettyCashEntry.count({ where: { status: 'PENDING' } });
    const pettyCashApproved = await PettyCashEntry.count({ 
      where: { status: 'APPROVED', entryType: 'EXPENSE' } 
    });
    
    const fuelLogsPending = await FuelLog.count({ where: { status: 'PENDING' } });
    const fuelLogsApproved = await FuelLog.count({ where: { status: 'APPROVED' } });

    return {
      pendingApprovals: {
        pettyCash: pettyCashPending,
        fuelLogs: fuelLogsPending,
        total: pettyCashPending + fuelLogsPending,
      },
      pendingPayments: {
        pettyCash: pettyCashApproved,
        fuelLogs: fuelLogsApproved,
        total: pettyCashApproved + fuelLogsApproved,
      },
    };
  }
}

module.exports = new ApprovalService();
