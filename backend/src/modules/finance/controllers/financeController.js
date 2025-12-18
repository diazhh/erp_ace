const { Op } = require('sequelize');
const FinanceService = require('../services/financeService');
const { BadRequestError, NotFoundError } = require('../../../shared/errors/AppError');
const logger = require('../../../shared/utils/logger');

class FinanceController {
  // ==================== BANK ACCOUNTS ====================

  async createAccount(req, res, next) {
    try {
      const { BankAccount } = require('../../../database/models');
      
      const data = {
        ...req.body,
        createdBy: req.user.id,
      };
      
      const account = await BankAccount.create(data);
      logger.info(`Cuenta bancaria creada: ${account.name}`);
      
      return res.status(201).json({
        success: true,
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAccounts(req, res, next) {
    try {
      const { BankAccount, User } = require('../../../database/models');
      
      const { type, currency, isActive } = req.query;
      
      const where = {};
      if (type) where.accountType = type;
      if (currency) where.currency = currency;
      if (isActive !== undefined) where.isActive = isActive === 'true';
      
      const accounts = await BankAccount.findAll({
        where,
        include: [
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['name', 'ASC']],
      });
      
      return res.json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAccountById(req, res, next) {
    try {
      const { BankAccount, Transaction, User } = require('../../../database/models');
      
      const account = await BankAccount.findByPk(req.params.id, {
        include: [
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
        ],
      });
      
      if (!account) {
        throw new NotFoundError('Cuenta no encontrada');
      }
      
      // Obtener últimas transacciones
      const recentTransactions = await Transaction.findAll({
        where: { accountId: account.id },
        order: [['transactionDate', 'DESC'], ['createdAt', 'DESC']],
        limit: 10,
      });
      
      return res.json({
        success: true,
        data: {
          ...account.toJSON(),
          recentTransactions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener cuenta con todas sus relaciones (trazabilidad completa)
  async getAccountFullById(req, res, next) {
    try {
      const { BankAccount, Transaction, User, Employee, AuditLog } = require('../../../database/models');
      const { sequelize } = require('../../../database');
      
      const account = await BankAccount.findByPk(req.params.id, {
        include: [
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
        ],
      });
      
      if (!account) {
        throw new NotFoundError('Cuenta no encontrada');
      }
      
      // Obtener transacciones con paginación
      const { page = 1, limit = 20, startDate, endDate } = req.query;
      const offset = (page - 1) * limit;
      
      const transactionWhere = { accountId: account.id };
      if (startDate && endDate) {
        transactionWhere.transactionDate = { [Op.between]: [startDate, endDate] };
      }
      
      const { count: transactionCount, rows: transactions } = await Transaction.findAndCountAll({
        where: transactionWhere,
        include: [
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'] },
          { model: BankAccount, as: 'destinationAccount', attributes: ['id', 'name'] },
        ],
        order: [['transactionDate', 'DESC'], ['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      // Obtener transferencias entrantes
      const incomingTransfers = await Transaction.findAll({
        where: { 
          destinationAccountId: account.id,
          transactionType: 'TRANSFER',
        },
        include: [
          { model: BankAccount, as: 'account', attributes: ['id', 'name'] },
        ],
        order: [['transactionDate', 'DESC']],
        limit: 10,
      });
      
      // Obtener transferencias salientes
      const outgoingTransfers = await Transaction.findAll({
        where: { 
          accountId: account.id,
          transactionType: 'TRANSFER',
        },
        include: [
          { model: BankAccount, as: 'destinationAccount', attributes: ['id', 'name'] },
        ],
        order: [['transactionDate', 'DESC']],
        limit: 10,
      });
      
      // Estadísticas de la cuenta
      const stats = await Transaction.findAll({
        where: { 
          accountId: account.id,
          status: { [Op.ne]: 'CANCELLED' },
        },
        attributes: [
          'transactionType',
          [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        group: ['transactionType'],
        raw: true,
      });
      
      // Transacciones pendientes de conciliar
      const pendingReconciliation = await Transaction.count({
        where: { 
          accountId: account.id,
          isReconciled: false,
          status: 'CONFIRMED',
        },
      });
      
      // Evolución de saldo (últimos 30 días)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const balanceHistory = await Transaction.findAll({
        where: {
          accountId: account.id,
          transactionDate: { [Op.gte]: thirtyDaysAgo.toISOString().split('T')[0] },
          status: { [Op.ne]: 'CANCELLED' },
        },
        attributes: [
          'transactionDate',
          'transactionType',
          [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        ],
        group: ['transactionDate', 'transactionType'],
        order: [['transactionDate', 'ASC']],
        raw: true,
      });
      
      // Historial de auditoría
      const auditLogs = await AuditLog.findAll({
        where: { 
          entityType: 'BankAccount',
          entityId: account.id,
        },
        limit: 30,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        }],
      });
      
      return res.json({
        success: true,
        data: {
          ...account.toJSON(),
          transactions,
          transactionPagination: {
            total: transactionCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(transactionCount / limit),
          },
          incomingTransfers,
          outgoingTransfers,
          stats: {
            byType: stats,
            pendingReconciliation,
          },
          balanceHistory,
          auditLogs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAccount(req, res, next) {
    try {
      const { BankAccount } = require('../../../database/models');
      
      const account = await BankAccount.findByPk(req.params.id);
      if (!account) {
        throw new NotFoundError('Cuenta no encontrada');
      }
      
      await account.update(req.body);
      
      return res.json({
        success: true,
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const { BankAccount, Transaction } = require('../../../database/models');
      
      const account = await BankAccount.findByPk(req.params.id);
      if (!account) {
        throw new NotFoundError('Cuenta no encontrada');
      }
      
      // Verificar si tiene transacciones
      const transactionCount = await Transaction.count({
        where: { accountId: account.id },
      });
      
      if (transactionCount > 0) {
        throw new BadRequestError('No se puede eliminar una cuenta con transacciones');
      }
      
      await account.destroy();
      
      return res.json({
        success: true,
        message: 'Cuenta eliminada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== TRANSACTIONS ====================

  async createTransaction(req, res, next) {
    try {
      const models = require('../../../database/models');
      const financeService = new FinanceService(models);
      
      const transaction = await financeService.createTransaction(req.body, req.user.id);
      logger.info(`Transacción creada: ${transaction.code}`);
      
      return res.status(201).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req, res, next) {
    try {
      const { Transaction, BankAccount, User } = require('../../../database/models');
      
      const { 
        page = 1, 
        limit = 20, 
        type, 
        category, 
        accountId, 
        startDate, 
        endDate,
        status,
        isReconciled,
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = {};
      if (type) where.transactionType = type;
      if (category) where.category = category;
      if (accountId) where.accountId = accountId;
      if (status) where.status = status;
      if (isReconciled !== undefined) where.isReconciled = isReconciled === 'true';
      
      if (startDate && endDate) {
        where.transactionDate = { [Op.between]: [startDate, endDate] };
      } else if (startDate) {
        where.transactionDate = { [Op.gte]: startDate };
      } else if (endDate) {
        where.transactionDate = { [Op.lte]: endDate };
      }
      
      const { count, rows } = await Transaction.findAndCountAll({
        where,
        include: [
          { model: BankAccount, as: 'account', attributes: ['id', 'name', 'accountType', 'currency'] },
          { model: BankAccount, as: 'destinationAccount', attributes: ['id', 'name', 'accountType', 'currency'] },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['transactionDate', 'DESC'], ['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      return res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req, res, next) {
    try {
      const { Transaction, BankAccount, User, Employee } = require('../../../database/models');
      
      const transaction = await Transaction.findByPk(req.params.id, {
        include: [
          { model: BankAccount, as: 'account' },
          { model: BankAccount, as: 'destinationAccount' },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'reconciler', attributes: ['id', 'firstName', 'lastName'] },
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'idNumber'] },
        ],
      });
      
      if (!transaction) {
        throw new NotFoundError('Transacción no encontrada');
      }
      
      return res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req, res, next) {
    try {
      const { Transaction } = require('../../../database/models');
      
      const transaction = await Transaction.findByPk(req.params.id);
      if (!transaction) {
        throw new NotFoundError('Transacción no encontrada');
      }
      
      if (transaction.isReconciled) {
        throw new BadRequestError('No se puede modificar una transacción conciliada');
      }
      
      // Solo permitir editar ciertos campos
      const allowedFields = ['description', 'reference', 'counterparty', 'counterpartyDocument', 'notes', 'attachments'];
      const updateData = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });
      
      await transaction.update(updateData);
      
      return res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelTransaction(req, res, next) {
    try {
      const { Transaction } = require('../../../database/models');
      const models = require('../../../database/models');
      const financeService = new FinanceService(models);
      
      const transaction = await Transaction.findByPk(req.params.id);
      if (!transaction) {
        throw new NotFoundError('Transacción no encontrada');
      }
      
      if (transaction.isReconciled) {
        throw new BadRequestError('No se puede cancelar una transacción conciliada');
      }
      
      if (transaction.status === 'CANCELLED') {
        throw new BadRequestError('La transacción ya está cancelada');
      }
      
      // Revertir el saldo
      const reverseType = transaction.transactionType === 'INCOME' ? 'EXPENSE' : 'INCOME';
      await financeService.updateAccountBalance(transaction.accountId, transaction.amount, reverseType);
      
      await transaction.update({ status: 'CANCELLED' });
      
      logger.info(`Transacción cancelada: ${transaction.code}`);
      
      return res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== TRANSFERS ====================

  async createTransfer(req, res, next) {
    try {
      const models = require('../../../database/models');
      const financeService = new FinanceService(models);
      
      const transfer = await financeService.processTransfer(req.body, req.user.id);
      logger.info(`Transferencia creada: ${transfer.code}`);
      
      return res.status(201).json({
        success: true,
        data: transfer,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== RECONCILIATION ====================

  async reconcileTransaction(req, res, next) {
    try {
      const { Transaction } = require('../../../database/models');
      
      const transaction = await Transaction.findByPk(req.params.id);
      if (!transaction) {
        throw new NotFoundError('Transacción no encontrada');
      }
      
      if (transaction.isReconciled) {
        throw new BadRequestError('La transacción ya está conciliada');
      }
      
      await transaction.update({
        isReconciled: true,
        reconciledAt: new Date(),
        reconciledBy: req.user.id,
        status: 'RECONCILED',
      });
      
      return res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkReconcile(req, res, next) {
    try {
      const { Transaction } = require('../../../database/models');
      const { transactionIds } = req.body;
      
      if (!transactionIds || !transactionIds.length) {
        throw new BadRequestError('Debe proporcionar IDs de transacciones');
      }
      
      await Transaction.update(
        {
          isReconciled: true,
          reconciledAt: new Date(),
          reconciledBy: req.user.id,
          status: 'RECONCILED',
        },
        {
          where: {
            id: { [Op.in]: transactionIds },
            isReconciled: false,
          },
        }
      );
      
      return res.json({
        success: true,
        message: `${transactionIds.length} transacciones conciliadas`,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== EXCHANGE RATES ====================

  async createExchangeRate(req, res, next) {
    try {
      const { ExchangeRate } = require('../../../database/models');
      
      const data = {
        ...req.body,
        createdBy: req.user.id,
      };
      
      const rate = await ExchangeRate.create(data);
      
      return res.status(201).json({
        success: true,
        data: rate,
      });
    } catch (error) {
      next(error);
    }
  }

  async getExchangeRates(req, res, next) {
    try {
      const { ExchangeRate, User } = require('../../../database/models');
      
      const { fromCurrency, toCurrency, startDate, endDate, limit = 30 } = req.query;
      
      const where = { isActive: true };
      if (fromCurrency) where.fromCurrency = fromCurrency;
      if (toCurrency) where.toCurrency = toCurrency;
      
      if (startDate && endDate) {
        where.date = { [Op.between]: [startDate, endDate] };
      }
      
      const rates = await ExchangeRate.findAll({
        where,
        include: [
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['date', 'DESC']],
        limit: parseInt(limit),
      });
      
      return res.json({
        success: true,
        data: rates,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentRate(req, res, next) {
    try {
      const models = require('../../../database/models');
      const financeService = new FinanceService(models);
      
      const { from = 'USD', to = 'VES' } = req.query;
      const rate = await financeService.getExchangeRate(from, to);
      
      return res.json({
        success: true,
        data: {
          fromCurrency: from,
          toCurrency: to,
          rate,
          date: new Date().toISOString().split('T')[0],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== CATEGORIES ====================

  async getCategories(req, res, next) {
    try {
      const { TransactionCategory } = require('../../../database/models');
      
      const { type } = req.query;
      
      const where = { isActive: true, parentId: null };
      if (type) where.type = { [Op.in]: [type, 'BOTH'] };
      
      const categories = await TransactionCategory.findAll({
        where,
        include: [
          {
            model: TransactionCategory,
            as: 'subcategories',
            where: { isActive: true },
            required: false,
          },
        ],
        order: [['sortOrder', 'ASC'], ['name', 'ASC']],
      });
      
      return res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const { TransactionCategory } = require('../../../database/models');
      
      const category = await TransactionCategory.create(req.body);
      
      return res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== STATISTICS ====================

  async getStats(req, res, next) {
    try {
      const models = require('../../../database/models');
      const financeService = new FinanceService(models);
      
      const { startDate, endDate } = req.query;
      const stats = await financeService.getFinanceStats(startDate, endDate);
      
      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCashFlow(req, res, next) {
    try {
      const models = require('../../../database/models');
      const financeService = new FinanceService(models);
      
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const cashFlow = await financeService.getCashFlow(year);
      
      return res.json({
        success: true,
        data: cashFlow,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FinanceController();
