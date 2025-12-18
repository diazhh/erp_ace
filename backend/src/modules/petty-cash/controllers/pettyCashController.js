const { Op } = require('sequelize');
const { sequelize } = require('../../../database');
const pettyCashService = require('../services/pettyCashService');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

class PettyCashController {
  // ==================== PETTY CASH ====================

  /**
   * Crear nueva caja chica
   */
  async create(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { PettyCash, PettyCashEntry } = require('../../../database/models');
      
      const {
        code: userCode,
        name,
        description,
        currency,
        initialAmount,
        minimumBalance,
        maximumExpense,
        custodianId,
        bankAccountId,
        requiresApproval,
        approvalThreshold,
        notes,
      } = req.body;
      
      // Usar código proporcionado por el usuario o generar uno automático
      let code = userCode?.trim();
      if (!code) {
        code = await pettyCashService.generatePettyCashCode();
      } else {
        // Verificar que el código no exista
        const { PettyCash: PC } = require('../../../database/models');
        const existing = await PC.findOne({ where: { code } });
        if (existing) {
          throw new BadRequestError(`El código ${code} ya está en uso`);
        }
      }
      
      const pettyCash = await PettyCash.create({
        code,
        name,
        description,
        currency: currency || 'USD',
        initialAmount: initialAmount || 0,
        currentBalance: initialAmount || 0,
        minimumBalance: minimumBalance || 0,
        maximumExpense,
        custodianId,
        bankAccountId,
        requiresApproval: requiresApproval !== false,
        approvalThreshold,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      // Crear movimiento inicial si hay monto
      if (initialAmount && parseFloat(initialAmount) > 0) {
        const entryCode = await pettyCashService.generateEntryCode(code);
        await PettyCashEntry.create({
          code: entryCode,
          pettyCashId: pettyCash.id,
          entryType: 'INITIAL',
          amount: initialAmount,
          currency: currency || 'USD',
          description: 'Apertura de caja chica',
          entryDate: new Date().toISOString().split('T')[0],
          status: 'APPROVED',
          approvedBy: req.user.id,
          approvedAt: new Date(),
          balanceAfter: initialAmount,
          createdBy: req.user.id,
        }, { transaction: t });
      }
      
      await t.commit();
      
      return res.status(201).json({
        success: true,
        message: 'Caja chica creada exitosamente',
        data: pettyCash,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Listar cajas chicas
   */
  async list(req, res, next) {
    try {
      const { PettyCash, Employee, User, BankAccount } = require('../../../database/models');
      const { status, custodianId } = req.query;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (custodianId) whereClause.custodianId = custodianId;
      
      const pettyCashes = await PettyCash.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'custodian', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: BankAccount, as: 'bankAccount', attributes: ['id', 'name', 'currency'] },
        ],
        order: [['createdAt', 'DESC']],
      });
      
      // Agregar indicador de necesidad de reposición
      const pettyCashesWithStatus = await Promise.all(
        pettyCashes.map(async (pc) => {
          const needsReplenishment = await pettyCashService.needsReplenishment(pc.id);
          return {
            ...pc.toJSON(),
            needsReplenishment,
          };
        })
      );
      
      return res.json({
        success: true,
        data: pettyCashesWithStatus,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener caja chica por ID
   */
  async getById(req, res, next) {
    try {
      const { PettyCash, Employee, User, BankAccount } = require('../../../database/models');
      
      const pettyCash = await PettyCash.findByPk(req.params.id, {
        include: [
          { model: Employee, as: 'custodian', attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: BankAccount, as: 'bankAccount', attributes: ['id', 'name', 'currency', 'currentBalance'] },
        ],
      });
      
      if (!pettyCash) {
        throw new NotFoundError('Caja chica no encontrada');
      }
      
      return res.json({
        success: true,
        data: pettyCash,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener caja chica con todas sus relaciones (trazabilidad)
   */
  async getFullById(req, res, next) {
    try {
      const { PettyCash, PettyCashEntry, Employee, User, BankAccount, AuditLog } = require('../../../database/models');
      
      const pettyCash = await PettyCash.findByPk(req.params.id, {
        include: [
          { model: Employee, as: 'custodian', attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'phone'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: BankAccount, as: 'bankAccount', attributes: ['id', 'name', 'currency', 'currentBalance', 'bankName'] },
        ],
      });
      
      if (!pettyCash) {
        throw new NotFoundError('Caja chica no encontrada');
      }
      
      // Obtener estadísticas
      const stats = await pettyCashService.getStats(pettyCash.id);
      
      // Obtener últimos movimientos
      const { entries } = await pettyCashService.getEntryHistory(pettyCash.id, { limit: 20 });
      
      // Historial de auditoría
      const auditLogs = await AuditLog.findAll({
        where: { 
          entityType: 'PettyCash',
          entityId: pettyCash.id,
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
          ...pettyCash.toJSON(),
          stats,
          recentEntries: entries,
          auditLogs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar caja chica
   */
  async update(req, res, next) {
    try {
      const { PettyCash } = require('../../../database/models');
      
      const pettyCash = await PettyCash.findByPk(req.params.id);
      if (!pettyCash) {
        throw new NotFoundError('Caja chica no encontrada');
      }
      
      const {
        name,
        description,
        minimumBalance,
        maximumExpense,
        custodianId,
        bankAccountId,
        requiresApproval,
        approvalThreshold,
        status,
        notes,
      } = req.body;
      
      await pettyCash.update({
        name,
        description,
        minimumBalance,
        maximumExpense,
        custodianId,
        bankAccountId,
        requiresApproval,
        approvalThreshold,
        status,
        notes,
      });
      
      return res.json({
        success: true,
        message: 'Caja chica actualizada',
        data: pettyCash,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar caja chica (soft delete)
   */
  async delete(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { PettyCash, PettyCashEntry } = require('../../../database/models');
      
      const pettyCash = await PettyCash.findByPk(req.params.id);
      if (!pettyCash) {
        throw new NotFoundError('Caja chica no encontrada');
      }
      
      // Verificar que no tenga movimientos pendientes
      const pendingEntries = await PettyCashEntry.count({
        where: {
          pettyCashId: pettyCash.id,
          status: 'PENDING',
        },
      });
      
      if (pendingEntries > 0) {
        throw new BadRequestError('No se puede eliminar una caja chica con movimientos pendientes');
      }
      
      // Verificar que el saldo sea cero o muy bajo
      if (parseFloat(pettyCash.currentBalance) > 1) {
        throw new BadRequestError('No se puede eliminar una caja chica con saldo. Primero debe realizar un ajuste.');
      }
      
      // Soft delete - cambiar estado a CLOSED
      await pettyCash.update({
        status: 'CLOSED',
        closedAt: new Date(),
        closedBy: req.user.id,
      }, { transaction: t });
      
      await t.commit();
      
      return res.json({
        success: true,
        message: 'Caja chica cerrada exitosamente',
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Obtener estadísticas de caja chica
   */
  async getStats(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const stats = await pettyCashService.getStats(req.params.id, startDate, endDate);
      
      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener categorías de gastos
   */
  async getCategories(req, res, next) {
    try {
      const categories = pettyCashService.getExpenseCategories();
      return res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== ENTRIES ====================

  /**
   * Crear movimiento (gasto)
   */
  async createEntry(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { PettyCash, PettyCashEntry } = require('../../../database/models');
      
      const pettyCash = await PettyCash.findByPk(req.params.id);
      if (!pettyCash) {
        throw new NotFoundError('Caja chica no encontrada');
      }
      
      const {
        entryType,
        amount,
        currency,
        exchangeRate,
        category,
        subcategory,
        description,
        receiptNumber,
        receiptDate,
        receiptImageUrl,
        vendor,
        vendorRif,
        entryDate,
        beneficiaryId,
        beneficiaryName,
        notes,
      } = req.body;
      
      // Validar si es gasto
      if (entryType === 'EXPENSE') {
        const canExpense = await pettyCashService.canMakeExpense(pettyCash.id, amount);
        if (!canExpense.allowed) {
          throw new BadRequestError(canExpense.reason);
        }
      }
      
      const code = await pettyCashService.generateEntryCode(pettyCash.code);
      
      // Determinar estado inicial
      let status = 'PENDING';
      let approvedBy = null;
      let approvedAt = null;
      
      // Reposiciones y ajustes se aprueban automáticamente si el usuario tiene permiso
      if (['REPLENISHMENT', 'ADJUSTMENT'].includes(entryType)) {
        status = 'APPROVED';
        approvedBy = req.user.id;
        approvedAt = new Date();
      } else if (entryType === 'EXPENSE') {
        const canExpense = await pettyCashService.canMakeExpense(pettyCash.id, amount);
        if (!canExpense.requiresApproval) {
          status = 'APPROVED';
          approvedBy = req.user.id;
          approvedAt = new Date();
        }
      }
      
      // Calcular nuevo saldo si está aprobado
      let balanceAfter = null;
      if (status === 'APPROVED') {
        balanceAfter = await pettyCashService.updateBalance(pettyCash.id, amount, entryType, t);
      }
      
      const entry = await PettyCashEntry.create({
        code,
        pettyCashId: pettyCash.id,
        entryType,
        amount,
        currency: currency || pettyCash.currency,
        exchangeRate,
        category,
        subcategory,
        description,
        receiptNumber,
        receiptDate,
        receiptImageUrl,
        vendor,
        vendorRif,
        entryDate: entryDate || new Date().toISOString().split('T')[0],
        beneficiaryId,
        beneficiaryName,
        status,
        approvedBy,
        approvedAt,
        balanceAfter,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      await t.commit();
      
      return res.status(201).json({
        success: true,
        message: status === 'APPROVED' ? 'Movimiento registrado' : 'Movimiento pendiente de aprobación',
        data: entry,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Listar movimientos de una caja chica
   */
  async listEntries(req, res, next) {
    try {
      const { page, limit, entryType, status, startDate, endDate, category } = req.query;
      
      const result = await pettyCashService.getEntryHistory(req.params.id, {
        page,
        limit,
        entryType,
        status,
        startDate,
        endDate,
        category,
      });
      
      return res.json({
        success: true,
        data: result.entries,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener movimiento por ID
   */
  async getEntryById(req, res, next) {
    try {
      const { PettyCashEntry, PettyCash, Employee, User, Project } = require('../../../database/models');
      
      const entry = await PettyCashEntry.findByPk(req.params.entryId, {
        include: [
          { model: PettyCash, as: 'pettyCash', attributes: ['id', 'code', 'name'] },
          { model: Employee, as: 'beneficiary', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: User, as: 'approver', attributes: ['id', 'username'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'], required: false },
        ],
      });
      
      if (!entry) {
        throw new NotFoundError('Movimiento no encontrado');
      }
      
      return res.json({
        success: true,
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Aprobar movimiento
   */
  async approveEntry(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { PettyCashEntry } = require('../../../database/models');
      
      const entry = await PettyCashEntry.findByPk(req.params.entryId);
      if (!entry) {
        throw new NotFoundError('Movimiento no encontrado');
      }
      
      if (entry.status !== 'PENDING') {
        throw new BadRequestError('Solo se pueden aprobar movimientos pendientes');
      }
      
      // Actualizar saldo
      const balanceAfter = await pettyCashService.updateBalance(
        entry.pettyCashId, 
        entry.amount, 
        entry.entryType, 
        t
      );
      
      await entry.update({
        status: 'APPROVED',
        approvedBy: req.user.id,
        approvedAt: new Date(),
        balanceAfter,
      }, { transaction: t });
      
      await t.commit();
      
      return res.json({
        success: true,
        message: 'Movimiento aprobado',
        data: entry,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Rechazar movimiento
   */
  async rejectEntry(req, res, next) {
    try {
      const { PettyCashEntry } = require('../../../database/models');
      
      const entry = await PettyCashEntry.findByPk(req.params.entryId);
      if (!entry) {
        throw new NotFoundError('Movimiento no encontrado');
      }
      
      if (entry.status !== 'PENDING') {
        throw new BadRequestError('Solo se pueden rechazar movimientos pendientes');
      }
      
      const { reason } = req.body;
      
      await entry.update({
        status: 'REJECTED',
        rejectionReason: reason,
        approvedBy: req.user.id,
        approvedAt: new Date(),
      });
      
      return res.json({
        success: true,
        message: 'Movimiento rechazado',
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marcar movimiento como pagado
   */
  async payEntry(req, res, next) {
    try {
      const { PettyCashEntry } = require('../../../database/models');
      
      const entry = await PettyCashEntry.findByPk(req.params.entryId);
      if (!entry) {
        throw new NotFoundError('Movimiento no encontrado');
      }
      
      if (entry.status !== 'APPROVED') {
        throw new BadRequestError('Solo se pueden pagar movimientos aprobados');
      }
      
      const { paymentReference } = req.body;
      
      await entry.update({
        status: 'PAID',
        paidBy: req.user.id,
        paidAt: new Date(),
        paymentReference,
      });
      
      return res.json({
        success: true,
        message: 'Movimiento marcado como pagado',
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancelar movimiento
   */
  async cancelEntry(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { PettyCashEntry } = require('../../../database/models');
      
      const entry = await PettyCashEntry.findByPk(req.params.entryId);
      if (!entry) {
        throw new NotFoundError('Movimiento no encontrado');
      }
      
      if (entry.status === 'CANCELLED') {
        throw new BadRequestError('El movimiento ya está cancelado');
      }
      
      // Si estaba aprobado, revertir el saldo
      if (entry.status === 'APPROVED') {
        // Revertir: si era gasto, sumar; si era reposición, restar
        const reverseType = entry.entryType === 'EXPENSE' ? 'REPLENISHMENT' : 'EXPENSE';
        await pettyCashService.updateBalance(entry.pettyCashId, entry.amount, reverseType, t);
      }
      
      await entry.update({
        status: 'CANCELLED',
        notes: `${entry.notes || ''}\n[Cancelado: ${req.body.reason || 'Sin razón'}]`,
      }, { transaction: t });
      
      await t.commit();
      
      return res.json({
        success: true,
        message: 'Movimiento cancelado',
        data: entry,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Crear reposición
   */
  async createReplenishment(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { PettyCash, PettyCashEntry, Transaction, BankAccount } = require('../../../database/models');
      
      const pettyCash = await PettyCash.findByPk(req.params.id);
      if (!pettyCash) {
        throw new NotFoundError('Caja chica no encontrada');
      }
      
      const { amount, description, notes, createTransaction } = req.body;
      
      const code = await pettyCashService.generateEntryCode(pettyCash.code);
      
      // Crear movimiento de reposición
      const balanceAfter = await pettyCashService.updateBalance(pettyCash.id, amount, 'REPLENISHMENT', t);
      
      const entry = await PettyCashEntry.create({
        code,
        pettyCashId: pettyCash.id,
        entryType: 'REPLENISHMENT',
        amount,
        currency: pettyCash.currency,
        description: description || 'Reposición de caja chica',
        entryDate: new Date().toISOString().split('T')[0],
        status: 'APPROVED',
        approvedBy: req.user.id,
        approvedAt: new Date(),
        balanceAfter,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      // Opcionalmente crear transacción en finanzas
      if (createTransaction && pettyCash.bankAccountId) {
        const bankAccount = await BankAccount.findByPk(pettyCash.bankAccountId);
        if (bankAccount) {
          // Crear transacción de egreso en la cuenta bancaria
          const txCode = `TX-${Date.now()}`;
          const newTransaction = await Transaction.create({
            code: txCode,
            accountId: pettyCash.bankAccountId,
            transactionType: 'EXPENSE',
            category: 'PETTY_CASH_REPLENISHMENT',
            amount,
            currency: pettyCash.currency,
            description: `Reposición caja chica ${pettyCash.code}`,
            transactionDate: new Date().toISOString().split('T')[0],
            status: 'CONFIRMED',
            reference: entry.code,
            createdBy: req.user.id,
          }, { transaction: t });
          
          // Actualizar saldo de cuenta bancaria
          await bankAccount.update({
            currentBalance: parseFloat(bankAccount.currentBalance) - parseFloat(amount),
          }, { transaction: t });
          
          // Guardar referencia en el entry (usar el UUID de la transacción)
          await entry.update({ transactionId: newTransaction.id }, { transaction: t });
        }
      }
      
      await t.commit();
      
      return res.status(201).json({
        success: true,
        message: 'Reposición registrada',
        data: entry,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Obtener estadísticas generales de todas las cajas
   */
  async getGeneralStats(req, res, next) {
    try {
      const { PettyCash, PettyCashEntry } = require('../../../database/models');
      const { sequelize } = require('../../../database');
      
      // Total de cajas activas
      const activeCashes = await PettyCash.count({ where: { status: 'ACTIVE' } });
      
      // Saldo total
      const totalBalance = await PettyCash.sum('currentBalance', { where: { status: 'ACTIVE' } });
      
      // Cajas que necesitan reposición
      const cashesNeedingReplenishment = await PettyCash.count({
        where: {
          status: 'ACTIVE',
          currentBalance: { [Op.lte]: sequelize.col('minimum_balance') },
        },
      });
      
      // Movimientos pendientes de aprobación
      const pendingApproval = await PettyCashEntry.count({ where: { status: 'PENDING' } });
      
      // Gastos del mes actual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const monthlyExpenses = await PettyCashEntry.sum('amount', {
        where: {
          entryType: 'EXPENSE',
          status: 'APPROVED',
          entryDate: { [Op.gte]: startOfMonth.toISOString().split('T')[0] },
        },
      });
      
      return res.json({
        success: true,
        data: {
          activeCashes,
          totalBalance: totalBalance || 0,
          cashesNeedingReplenishment,
          pendingApproval,
          monthlyExpenses: monthlyExpenses || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PettyCashController();
