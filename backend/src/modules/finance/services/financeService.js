const { Op } = require('sequelize');
const { sequelize } = require('../../../database');

class FinanceService {
  constructor(models) {
    this.models = models;
  }

  /**
   * Genera código único para transacción
   */
  async generateTransactionCode(type) {
    const year = new Date().getFullYear();
    const prefix = type === 'INCOME' ? 'ING' : type === 'EXPENSE' ? 'EGR' : type === 'TRANSFER' ? 'TRF' : 'AJU';
    
    const count = await this.models.Transaction.count({
      where: {
        code: { [Op.like]: `${prefix}-${year}-%` },
      },
    });
    
    return `${prefix}-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  /**
   * Obtiene la tasa de cambio activa para una fecha
   */
  async getExchangeRate(fromCurrency, toCurrency, date = new Date()) {
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    
    // Buscar tasa exacta para la fecha
    let rate = await this.models.ExchangeRate.findOne({
      where: {
        fromCurrency,
        toCurrency,
        date: dateStr,
        isActive: true,
      },
      order: [['createdAt', 'DESC']],
    });
    
    // Si no hay tasa para la fecha, buscar la más reciente
    if (!rate) {
      rate = await this.models.ExchangeRate.findOne({
        where: {
          fromCurrency,
          toCurrency,
          date: { [Op.lte]: dateStr },
          isActive: true,
        },
        order: [['date', 'DESC']],
      });
    }
    
    return rate ? parseFloat(rate.rate) : 1;
  }

  /**
   * Convierte monto a USD
   */
  async convertToUsd(amount, currency, date = new Date()) {
    if (currency === 'USD') return amount;
    
    const rate = await this.getExchangeRate(currency, 'USD', date);
    return amount * rate;
  }

  /**
   * Actualiza el saldo de una cuenta
   */
  async updateAccountBalance(accountId, amount, type, transaction = null) {
    const account = await this.models.BankAccount.findByPk(accountId, { transaction });
    if (!account) throw new Error('Cuenta no encontrada');
    
    let newBalance = parseFloat(account.currentBalance);
    
    if (type === 'INCOME' || type === 'TRANSFER_IN') {
      newBalance += parseFloat(amount);
    } else if (type === 'EXPENSE' || type === 'TRANSFER_OUT') {
      newBalance -= parseFloat(amount);
    } else if (type === 'ADJUSTMENT') {
      newBalance = parseFloat(amount);
    }
    
    await account.update({ currentBalance: newBalance }, { transaction });
    return newBalance;
  }

  /**
   * Procesa una transferencia entre cuentas
   */
  async processTransfer(data, userId) {
    const t = await sequelize.transaction();
    
    try {
      const code = await this.generateTransactionCode('TRANSFER');
      
      // Crear transacción de salida
      const outTransaction = await this.models.Transaction.create({
        code,
        transactionType: 'TRANSFER',
        category: 'TRANSFER',
        accountId: data.fromAccountId,
        destinationAccountId: data.toAccountId,
        amount: data.amount,
        currency: data.currency,
        exchangeRate: data.exchangeRate,
        transactionDate: data.transactionDate,
        description: data.description || 'Transferencia entre cuentas',
        reference: data.reference,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        createdBy: userId,
      }, { transaction: t });
      
      // Actualizar saldos
      await this.updateAccountBalance(data.fromAccountId, data.amount, 'TRANSFER_OUT', t);
      
      // Si hay tasa de cambio, calcular monto destino
      let destinationAmount = data.amount;
      if (data.exchangeRate && data.exchangeRate !== 1) {
        destinationAmount = data.amount * data.exchangeRate;
      }
      
      await this.updateAccountBalance(data.toAccountId, destinationAmount, 'TRANSFER_IN', t);
      
      await t.commit();
      return outTransaction;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Registra una transacción (ingreso o gasto)
   */
  async createTransaction(data, userId) {
    const t = await sequelize.transaction();
    
    try {
      const code = await this.generateTransactionCode(data.transactionType);
      
      // Calcular monto en USD si es necesario
      let amountInUsd = data.amount;
      if (data.currency !== 'USD') {
        amountInUsd = await this.convertToUsd(data.amount, data.currency, data.transactionDate);
      }
      
      const transaction = await this.models.Transaction.create({
        ...data,
        code,
        amountInUsd,
        createdBy: userId,
      }, { transaction: t });
      
      // Actualizar saldo de cuenta
      const balanceType = data.transactionType === 'INCOME' ? 'INCOME' : 'EXPENSE';
      await this.updateAccountBalance(data.accountId, data.amount, balanceType, t);
      
      await t.commit();
      return transaction;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Obtiene estadísticas financieras
   */
  async getFinanceStats(startDate, endDate) {
    const where = {};
    if (startDate && endDate) {
      where.transactionDate = {
        [Op.between]: [startDate, endDate],
      };
    }
    where.status = { [Op.ne]: 'CANCELLED' };
    
    // Total ingresos
    const totalIncome = await this.models.Transaction.sum('amount_in_usd', {
      where: { ...where, transactionType: 'INCOME' },
    }) || 0;
    
    // Total gastos
    const totalExpense = await this.models.Transaction.sum('amount_in_usd', {
      where: { ...where, transactionType: 'EXPENSE' },
    }) || 0;
    
    // Balance neto
    const netBalance = totalIncome - totalExpense;
    
    // Transacciones pendientes de conciliar
    const pendingReconciliation = await this.models.Transaction.count({
      where: { isReconciled: false, status: 'CONFIRMED' },
    });
    
    // Total en cuentas
    const accountBalances = await this.models.BankAccount.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'accountType', 'currency', 'currentBalance'],
    });
    
    const totalByAccount = accountBalances.reduce((acc, account) => {
      acc[account.currency] = (acc[account.currency] || 0) + parseFloat(account.currentBalance);
      return acc;
    }, {});
    
    // Gastos por categoría
    const expensesByCategory = await this.models.Transaction.findAll({
      where: { ...where, transactionType: 'EXPENSE' },
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount_in_usd')), 'total'],
      ],
      group: ['category'],
      order: [[sequelize.fn('SUM', sequelize.col('amount_in_usd')), 'DESC']],
      limit: 10,
    });
    
    return {
      totalIncome,
      totalExpense,
      netBalance,
      pendingReconciliation,
      accountBalances,
      totalByAccount,
      expensesByCategory,
    };
  }

  /**
   * Obtiene el flujo de caja mensual
   */
  async getCashFlow(year) {
    const months = [];
    
    for (let month = 1; month <= 12; month++) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      
      const income = await this.models.Transaction.sum('amount_in_usd', {
        where: {
          transactionType: 'INCOME',
          transactionDate: { [Op.between]: [startDate, endDate] },
          status: { [Op.ne]: 'CANCELLED' },
        },
      }) || 0;
      
      const expense = await this.models.Transaction.sum('amount_in_usd', {
        where: {
          transactionType: 'EXPENSE',
          transactionDate: { [Op.between]: [startDate, endDate] },
          status: { [Op.ne]: 'CANCELLED' },
        },
      }) || 0;
      
      months.push({
        month,
        income,
        expense,
        net: income - expense,
      });
    }
    
    return months;
  }
}

module.exports = FinanceService;
