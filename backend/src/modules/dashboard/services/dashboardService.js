const { Op } = require('sequelize');
const { sequelize } = require('../../../database');

class DashboardService {
  constructor(models) {
    this.models = models;
  }

  /**
   * Obtiene estadísticas consolidadas para el dashboard principal
   */
  async getMainDashboardStats() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Estadísticas de empleados
    const employeeStats = await this.getEmployeeStats();

    // Estadísticas de proyectos
    const projectStats = await this.getProjectStats();

    // Estadísticas financieras
    const financeStats = await this.getFinanceStats(startOfMonth, endOfMonth);

    // Estadísticas de inventario
    const inventoryStats = await this.getInventoryStats();

    // Estadísticas de flota
    const fleetStats = await this.getFleetStats();

    // Alertas pendientes
    const alerts = await this.getPendingAlerts();

    // Actividad reciente
    const recentActivity = await this.getRecentActivity();

    return {
      employees: employeeStats,
      projects: projectStats,
      finance: financeStats,
      inventory: inventoryStats,
      fleet: fleetStats,
      alerts,
      recentActivity,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Estadísticas de empleados
   */
  async getEmployeeStats() {
    const { Employee, Department } = this.models;

    const total = await Employee.count();
    const active = await Employee.count({ where: { status: 'ACTIVE' } });
    const onLeave = await Employee.count({ where: { status: 'ON_LEAVE' } });
    const inactive = await Employee.count({ where: { status: 'INACTIVE' } });

    // Empleados por departamento
    const byDepartment = await Employee.findAll({
      attributes: [
        'departmentId',
        [sequelize.fn('COUNT', sequelize.col('Employee.id')), 'count'],
      ],
      where: { status: 'ACTIVE' },
      include: [{
        model: Department,
        as: 'departmentRef',
        attributes: ['id', 'name', 'code'],
      }],
      group: ['departmentId', 'departmentRef.id'],
      raw: false,
    });

    return {
      total,
      active,
      onLeave,
      inactive,
      byDepartment: byDepartment.map(d => ({
        department: d.departmentRef?.name || 'Sin Departamento',
        count: parseInt(d.dataValues.count),
      })),
    };
  }

  /**
   * Estadísticas de proyectos
   */
  async getProjectStats() {
    const { Project } = this.models;

    const total = await Project.count();
    const active = await Project.count({ 
      where: { status: { [Op.in]: ['PLANNING', 'IN_PROGRESS'] } } 
    });
    const completed = await Project.count({ where: { status: 'COMPLETED' } });
    const onHold = await Project.count({ where: { status: 'ON_HOLD' } });

    // Proyectos atrasados (fecha fin pasada y no completados)
    const delayed = await Project.count({
      where: {
        endDate: { [Op.lt]: new Date() },
        status: { [Op.notIn]: ['COMPLETED', 'CANCELLED'] },
      },
    });

    // Proyectos por estado
    const byStatus = await Project.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Presupuesto total vs gastado
    const budgetStats = await Project.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('budget')), 'totalBudget'],
        [sequelize.fn('SUM', sequelize.col('actual_cost')), 'totalSpent'],
      ],
      where: { status: { [Op.notIn]: ['CANCELLED'] } },
      raw: true,
    });

    return {
      total,
      active,
      completed,
      onHold,
      delayed,
      byStatus: byStatus.map(s => ({
        status: s.status,
        count: parseInt(s.count),
      })),
      budget: {
        total: parseFloat(budgetStats[0]?.totalBudget) || 0,
        spent: parseFloat(budgetStats[0]?.totalSpent) || 0,
      },
    };
  }

  /**
   * Estadísticas financieras
   */
  async getFinanceStats(startDate, endDate) {
    const { Transaction, BankAccount } = this.models;

    // Ingresos del mes
    const monthlyIncome = await Transaction.sum('amount_in_usd', {
      where: {
        transactionType: 'INCOME',
        transactionDate: { [Op.between]: [startDate, endDate] },
        status: { [Op.ne]: 'CANCELLED' },
      },
    }) || 0;

    // Gastos del mes
    const monthlyExpense = await Transaction.sum('amount_in_usd', {
      where: {
        transactionType: 'EXPENSE',
        transactionDate: { [Op.between]: [startDate, endDate] },
        status: { [Op.ne]: 'CANCELLED' },
      },
    }) || 0;

    // Balance neto del mes
    const monthlyNet = monthlyIncome - monthlyExpense;

    // Saldo total en cuentas
    const accountBalances = await BankAccount.findAll({
      where: { isActive: true },
      attributes: ['currency', [sequelize.fn('SUM', sequelize.col('current_balance')), 'total']],
      group: ['currency'],
      raw: true,
    });

    // Transacciones pendientes de conciliar
    const pendingReconciliation = await Transaction.count({
      where: { isReconciled: false, status: 'CONFIRMED' },
    });

    // Gastos por categoría del mes
    const expensesByCategory = await Transaction.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount_in_usd')), 'total'],
      ],
      where: {
        transactionType: 'EXPENSE',
        transactionDate: { [Op.between]: [startDate, endDate] },
        status: { [Op.ne]: 'CANCELLED' },
      },
      group: ['category'],
      order: [[sequelize.fn('SUM', sequelize.col('amount_in_usd')), 'DESC']],
      limit: 5,
      raw: true,
    });

    return {
      monthlyIncome,
      monthlyExpense,
      monthlyNet,
      accountBalances: accountBalances.map(a => ({
        currency: a.currency,
        total: parseFloat(a.total) || 0,
      })),
      pendingReconciliation,
      expensesByCategory: expensesByCategory.map(e => ({
        category: e.category,
        total: parseFloat(e.total) || 0,
      })),
    };
  }

  /**
   * Estadísticas de inventario
   */
  async getInventoryStats() {
    const { InventoryItem, WarehouseStock } = this.models;

    const totalItems = await InventoryItem.count({ where: { status: 'ACTIVE' } });

    // Items con stock bajo
    const lowStock = await InventoryItem.count({
      where: {
        status: 'ACTIVE',
        totalStock: { [Op.lte]: sequelize.col('min_stock') },
        totalStock: { [Op.gt]: 0 },
      },
    });

    // Items sin stock
    const outOfStock = await InventoryItem.count({
      where: {
        status: 'ACTIVE',
        totalStock: 0,
      },
    });

    // Valor total del inventario
    const inventoryValue = await InventoryItem.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.literal('total_stock * unit_cost')), 'totalValue'],
      ],
      where: { status: 'ACTIVE' },
      raw: true,
    });

    return {
      totalItems,
      lowStock,
      outOfStock,
      totalValue: parseFloat(inventoryValue[0]?.totalValue) || 0,
    };
  }

  /**
   * Estadísticas de flota
   */
  async getFleetStats() {
    const { Vehicle, VehicleMaintenance } = this.models;

    const totalVehicles = await Vehicle.count();
    const activeVehicles = await Vehicle.count({ where: { status: 'ACTIVE' } });
    const inMaintenance = await Vehicle.count({ where: { status: 'MAINTENANCE' } });

    // Vehículos con documentos por vencer (próximos 30 días)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringDocs = await Vehicle.count({
      where: {
        [Op.or]: [
          { insuranceExpiry: { [Op.between]: [new Date(), thirtyDaysFromNow] } },
          { technicalReviewExpiry: { [Op.between]: [new Date(), thirtyDaysFromNow] } },
          { circulationPermitExpiry: { [Op.between]: [new Date(), thirtyDaysFromNow] } },
        ],
      },
    });

    // Mantenimientos pendientes
    const pendingMaintenance = await VehicleMaintenance.count({
      where: { status: 'SCHEDULED' },
    });

    return {
      totalVehicles,
      activeVehicles,
      inMaintenance,
      expiringDocs,
      pendingMaintenance,
    };
  }

  /**
   * Alertas pendientes
   */
  async getPendingAlerts() {
    const alerts = [];
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Documentos de empleados por vencer
    if (this.models.EmployeeDocument) {
      const expiringEmployeeDocs = await this.models.EmployeeDocument.count({
        where: {
          expiryDate: { [Op.between]: [today, thirtyDaysFromNow] },
          status: 'ACTIVE',
        },
      });
      if (expiringEmployeeDocs > 0) {
        alerts.push({
          type: 'warning',
          module: 'employees',
          message: `${expiringEmployeeDocs} documento(s) de empleados por vencer`,
          count: expiringEmployeeDocs,
        });
      }
    }

    // Vehículos con documentos por vencer
    const { Vehicle } = this.models;
    const expiringVehicleDocs = await Vehicle.count({
      where: {
        [Op.or]: [
          { insuranceExpiry: { [Op.between]: [today, thirtyDaysFromNow] } },
          { technicalReviewExpiry: { [Op.between]: [today, thirtyDaysFromNow] } },
        ],
      },
    });
    if (expiringVehicleDocs > 0) {
      alerts.push({
        type: 'warning',
        module: 'fleet',
        message: `${expiringVehicleDocs} vehículo(s) con documentos por vencer`,
        count: expiringVehicleDocs,
      });
    }

    // Préstamos pendientes de aprobación
    if (this.models.EmployeeLoan) {
      const pendingLoans = await this.models.EmployeeLoan.count({
        where: { status: 'PENDING' },
      });
      if (pendingLoans > 0) {
        alerts.push({
          type: 'info',
          module: 'payroll',
          message: `${pendingLoans} préstamo(s) pendiente(s) de aprobación`,
          count: pendingLoans,
        });
      }
    }

    // Proyectos atrasados
    const { Project } = this.models;
    const delayedProjects = await Project.count({
      where: {
        endDate: { [Op.lt]: today },
        status: { [Op.notIn]: ['COMPLETED', 'CANCELLED'] },
      },
    });
    if (delayedProjects > 0) {
      alerts.push({
        type: 'error',
        module: 'projects',
        message: `${delayedProjects} proyecto(s) atrasado(s)`,
        count: delayedProjects,
      });
    }

    // Items con stock bajo
    const { InventoryItem } = this.models;
    const lowStockItems = await InventoryItem.count({
      where: {
        status: 'ACTIVE',
        [Op.and]: [
          sequelize.where(
            sequelize.col('total_stock'),
            Op.lte,
            sequelize.col('min_stock')
          ),
        ],
      },
    });
    if (lowStockItems > 0) {
      alerts.push({
        type: 'warning',
        module: 'inventory',
        message: `${lowStockItems} item(s) con stock bajo`,
        count: lowStockItems,
      });
    }

    // Cajas chicas que necesitan reposición
    if (this.models.PettyCash) {
      const needsReplenishment = await this.models.PettyCash.count({
        where: {
          status: 'ACTIVE',
          [Op.and]: [
            sequelize.where(
              sequelize.col('current_balance'),
              Op.lte,
              sequelize.col('minimum_balance')
            ),
          ],
        },
      });
      if (needsReplenishment > 0) {
        alerts.push({
          type: 'warning',
          module: 'pettyCash',
          message: `${needsReplenishment} caja(s) chica(s) necesita(n) reposición`,
          count: needsReplenishment,
        });
      }
    }

    return alerts;
  }

  /**
   * Actividad reciente
   */
  async getRecentActivity() {
    const { AuditLog, User } = this.models;

    const recentLogs = await AuditLog.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'firstName', 'lastName'],
      }],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    return recentLogs.map(log => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      user: log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Sistema',
      timestamp: log.createdAt,
    }));
  }

  /**
   * Flujo de caja mensual para gráficos
   */
  async getCashFlowChart(year) {
    const { Transaction } = this.models;
    const months = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const income = await Transaction.sum('amount_in_usd', {
        where: {
          transactionType: 'INCOME',
          transactionDate: { [Op.between]: [startDate, endDate] },
          status: { [Op.ne]: 'CANCELLED' },
        },
      }) || 0;

      const expense = await Transaction.sum('amount_in_usd', {
        where: {
          transactionType: 'EXPENSE',
          transactionDate: { [Op.between]: [startDate, endDate] },
          status: { [Op.ne]: 'CANCELLED' },
        },
      }) || 0;

      months.push({
        month,
        monthName: new Date(year, month - 1).toLocaleString('es', { month: 'short' }),
        income,
        expense,
        net: income - expense,
      });
    }

    return months;
  }

  /**
   * Proyectos por estado para gráficos
   */
  async getProjectsByStatusChart() {
    const { Project } = this.models;

    const byStatus = await Project.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    return byStatus.map(s => ({
      status: s.status,
      count: parseInt(s.count),
    }));
  }

  /**
   * Empleados por departamento para gráficos
   */
  async getEmployeesByDepartmentChart() {
    const { Employee, Department } = this.models;

    const byDepartment = await Employee.findAll({
      attributes: [
        'departmentId',
        [sequelize.fn('COUNT', sequelize.col('Employee.id')), 'count'],
      ],
      where: { status: 'ACTIVE' },
      include: [{
        model: Department,
        as: 'departmentRef',
        attributes: ['id', 'name'],
      }],
      group: ['departmentId', 'departmentRef.id'],
      raw: false,
    });

    return byDepartment.map(d => ({
      department: d.departmentRef?.name || 'Sin Departamento',
      count: parseInt(d.dataValues.count),
    }));
  }
}

module.exports = DashboardService;
