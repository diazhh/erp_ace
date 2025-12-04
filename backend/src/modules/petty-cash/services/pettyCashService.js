const { Op } = require('sequelize');

class PettyCashService {
  /**
   * Genera código único para caja chica
   */
  async generatePettyCashCode() {
    const { PettyCash } = require('../../../database/models');
    
    const lastCash = await PettyCash.findOne({
      order: [['createdAt', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastCash && lastCash.code) {
      const match = lastCash.code.match(/CC-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    return `CC-${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Genera código único para movimiento
   */
  async generateEntryCode(pettyCashCode) {
    const { PettyCashEntry, PettyCash } = require('../../../database/models');
    
    // Si no se proporciona el código, obtenerlo
    let cashCode = pettyCashCode;
    if (!cashCode) {
      throw new Error('Se requiere el código de la caja chica');
    }
    
    const lastEntry = await PettyCashEntry.findOne({
      where: {
        code: { [Op.like]: `${cashCode}-%` },
      },
      order: [['createdAt', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastEntry && lastEntry.code) {
      const match = lastEntry.code.match(/-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    return `${cashCode}-${String(nextNumber).padStart(4, '0')}`;
  }

  /**
   * Actualiza el saldo de la caja chica
   */
  async updateBalance(pettyCashId, amount, entryType, transaction = null) {
    const { PettyCash } = require('../../../database/models');
    
    const pettyCash = await PettyCash.findByPk(pettyCashId, { transaction });
    if (!pettyCash) {
      throw new Error('Caja chica no encontrada');
    }
    
    let newBalance = parseFloat(pettyCash.currentBalance);
    
    switch (entryType) {
      case 'EXPENSE':
        newBalance -= parseFloat(amount);
        break;
      case 'REPLENISHMENT':
      case 'INITIAL':
        newBalance += parseFloat(amount);
        break;
      case 'ADJUSTMENT':
        // El monto puede ser positivo o negativo
        newBalance += parseFloat(amount);
        break;
    }
    
    await pettyCash.update({ currentBalance: newBalance }, { transaction });
    
    return newBalance;
  }

  /**
   * Verifica si se puede realizar un gasto
   */
  async canMakeExpense(pettyCashId, amount) {
    const { PettyCash } = require('../../../database/models');
    
    const pettyCash = await PettyCash.findByPk(pettyCashId);
    if (!pettyCash) {
      return { allowed: false, reason: 'Caja chica no encontrada' };
    }
    
    if (pettyCash.status !== 'ACTIVE') {
      return { allowed: false, reason: 'La caja chica no está activa' };
    }
    
    const currentBalance = parseFloat(pettyCash.currentBalance);
    const expenseAmount = parseFloat(amount);
    
    if (expenseAmount > currentBalance) {
      return { allowed: false, reason: 'Saldo insuficiente' };
    }
    
    if (pettyCash.maximumExpense && expenseAmount > parseFloat(pettyCash.maximumExpense)) {
      return { allowed: false, reason: `El monto excede el máximo permitido (${pettyCash.maximumExpense})` };
    }
    
    return { 
      allowed: true, 
      requiresApproval: pettyCash.requiresApproval && 
        (!pettyCash.approvalThreshold || expenseAmount >= parseFloat(pettyCash.approvalThreshold)),
    };
  }

  /**
   * Verifica si la caja necesita reposición
   */
  async needsReplenishment(pettyCashId) {
    const { PettyCash } = require('../../../database/models');
    
    const pettyCash = await PettyCash.findByPk(pettyCashId);
    if (!pettyCash) {
      return false;
    }
    
    return parseFloat(pettyCash.currentBalance) <= parseFloat(pettyCash.minimumBalance);
  }

  /**
   * Calcula el monto de reposición sugerido
   */
  async calculateReplenishmentAmount(pettyCashId) {
    const { PettyCash } = require('../../../database/models');
    
    const pettyCash = await PettyCash.findByPk(pettyCashId);
    if (!pettyCash) {
      return 0;
    }
    
    const initialAmount = parseFloat(pettyCash.initialAmount);
    const currentBalance = parseFloat(pettyCash.currentBalance);
    
    return Math.max(0, initialAmount - currentBalance);
  }

  /**
   * Obtiene estadísticas de la caja chica
   */
  async getStats(pettyCashId, startDate, endDate) {
    const { PettyCash, PettyCashEntry } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const pettyCash = await PettyCash.findByPk(pettyCashId);
    if (!pettyCash) {
      throw new Error('Caja chica no encontrada');
    }
    
    const whereClause = {
      pettyCashId,
      status: 'APPROVED',
    };
    
    if (startDate && endDate) {
      whereClause.entryDate = { [Op.between]: [startDate, endDate] };
    }
    
    // Total por tipo de movimiento
    const byType = await PettyCashEntry.findAll({
      where: whereClause,
      attributes: [
        'entryType',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['entryType'],
      raw: true,
    });
    
    // Total por categoría (solo gastos)
    const byCategory = await PettyCashEntry.findAll({
      where: {
        ...whereClause,
        entryType: 'EXPENSE',
        category: { [Op.ne]: null },
      },
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['category'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
      raw: true,
    });
    
    // Movimientos pendientes de aprobación
    const pendingCount = await PettyCashEntry.count({
      where: {
        pettyCashId,
        status: 'PENDING',
      },
    });
    
    // Calcular totales
    const totalExpenses = byType.find(t => t.entryType === 'EXPENSE')?.total || 0;
    const totalReplenishments = byType.find(t => t.entryType === 'REPLENISHMENT')?.total || 0;
    
    return {
      currentBalance: pettyCash.currentBalance,
      initialAmount: pettyCash.initialAmount,
      minimumBalance: pettyCash.minimumBalance,
      needsReplenishment: await this.needsReplenishment(pettyCashId),
      suggestedReplenishment: await this.calculateReplenishmentAmount(pettyCashId),
      totalExpenses,
      totalReplenishments,
      pendingApproval: pendingCount,
      byType,
      byCategory,
    };
  }

  /**
   * Obtiene el historial de movimientos
   */
  async getEntryHistory(pettyCashId, options = {}) {
    const { PettyCashEntry, Employee, User } = require('../../../database/models');
    
    const { page = 1, limit = 20, entryType, status, startDate, endDate, category } = options;
    const offset = (page - 1) * limit;
    
    const whereClause = { pettyCashId };
    
    if (entryType) whereClause.entryType = entryType;
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (startDate && endDate) {
      whereClause.entryDate = { [Op.between]: [startDate, endDate] };
    }
    
    const { count, rows } = await PettyCashEntry.findAndCountAll({
      where: whereClause,
      include: [
        { model: Employee, as: 'beneficiary', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'approver', attributes: ['id', 'username'] },
      ],
      order: [['entryDate', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });
    
    return {
      entries: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Categorías predefinidas de gastos
   */
  getExpenseCategories() {
    return [
      { code: 'OFFICE_SUPPLIES', name: 'Artículos de Oficina', icon: 'description' },
      { code: 'TRANSPORT', name: 'Transporte', icon: 'directions_car' },
      { code: 'FOOD', name: 'Alimentación', icon: 'restaurant' },
      { code: 'CLEANING', name: 'Limpieza', icon: 'cleaning_services' },
      { code: 'MAINTENANCE', name: 'Mantenimiento', icon: 'build' },
      { code: 'COURIER', name: 'Mensajería', icon: 'local_shipping' },
      { code: 'PARKING', name: 'Estacionamiento', icon: 'local_parking' },
      { code: 'UTILITIES', name: 'Servicios', icon: 'power' },
      { code: 'MEDICAL', name: 'Gastos Médicos', icon: 'medical_services' },
      { code: 'OTHER', name: 'Otros', icon: 'more_horiz' },
    ];
  }
}

module.exports = new PettyCashService();
