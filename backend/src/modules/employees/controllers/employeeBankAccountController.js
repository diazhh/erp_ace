const { Op } = require('sequelize');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');
const logger = require('../../../shared/utils/logger');

class EmployeeBankAccountController {
  // Listar cuentas bancarias de un empleado
  async list(req, res, next) {
    try {
      const { EmployeeBankAccount, User } = require('../../../database/models');
      const { employeeId } = req.params;

      const accounts = await EmployeeBankAccount.findAll({
        where: { employeeId },
        include: [
          {
            model: User,
            as: 'verifier',
            attributes: ['id', 'username'],
          },
        ],
        order: [['isPrimary', 'DESC'], ['createdAt', 'DESC']],
      });

      return res.json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener cuenta bancaria por ID
  async getById(req, res, next) {
    try {
      const { EmployeeBankAccount, Employee, User } = require('../../../database/models');
      const { id } = req.params;

      const account = await EmployeeBankAccount.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['id', 'firstName', 'lastName', 'employeeCode'],
          },
          {
            model: User,
            as: 'verifier',
            attributes: ['id', 'username'],
          },
        ],
      });

      if (!account) {
        throw new NotFoundError('Cuenta bancaria no encontrada');
      }

      return res.json({
        success: true,
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear cuenta bancaria
  async create(req, res, next) {
    try {
      const { EmployeeBankAccount, Employee, AuditLog } = require('../../../database/models');
      
      // Verificar que el empleado existe
      const employee = await Employee.findByPk(req.body.employeeId);
      if (!employee) {
        throw new NotFoundError('Empleado no encontrado');
      }

      // Si es la primera cuenta, hacerla primaria
      const existingCount = await EmployeeBankAccount.count({
        where: { employeeId: req.body.employeeId },
      });
      if (existingCount === 0) {
        req.body.isPrimary = true;
      }

      // Validar que los porcentajes no excedan 100%
      if (req.body.paymentPercentage) {
        const totalPercentage = await EmployeeBankAccount.sum('paymentPercentage', {
          where: { 
            employeeId: req.body.employeeId,
            status: 'ACTIVE',
          },
        }) || 0;

        if (totalPercentage + parseFloat(req.body.paymentPercentage) > 100) {
          throw new BadRequestError('La suma de porcentajes de pago no puede exceder 100%');
        }
      }

      const account = await EmployeeBankAccount.create(req.body);

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'CREATE',
        entityType: 'EmployeeBankAccount',
        entityId: account.id,
        newValues: account.toJSON(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Cuenta bancaria creada para empleado ${employee.getFullName()} por ${req.user.username}`);

      return res.status(201).json({
        success: true,
        message: 'Cuenta bancaria creada correctamente',
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar cuenta bancaria
  async update(req, res, next) {
    try {
      const { EmployeeBankAccount, AuditLog } = require('../../../database/models');
      const { id } = req.params;

      const account = await EmployeeBankAccount.findByPk(id);
      if (!account) {
        throw new NotFoundError('Cuenta bancaria no encontrada');
      }

      const oldValues = account.toJSON();

      // Validar porcentajes si cambia
      if (req.body.paymentPercentage && req.body.paymentPercentage !== account.paymentPercentage) {
        const totalPercentage = await EmployeeBankAccount.sum('paymentPercentage', {
          where: { 
            employeeId: account.employeeId,
            status: 'ACTIVE',
            id: { [Op.ne]: id },
          },
        }) || 0;

        if (totalPercentage + parseFloat(req.body.paymentPercentage) > 100) {
          throw new BadRequestError('La suma de porcentajes de pago no puede exceder 100%');
        }
      }

      await account.update(req.body);

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'UPDATE',
        entityType: 'EmployeeBankAccount',
        entityId: account.id,
        oldValues,
        newValues: account.toJSON(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Cuenta bancaria actualizada: ${account.id} por ${req.user.username}`);

      return res.json({
        success: true,
        message: 'Cuenta bancaria actualizada correctamente',
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar cuenta bancaria
  async delete(req, res, next) {
    try {
      const { EmployeeBankAccount, AuditLog } = require('../../../database/models');
      const { id } = req.params;

      const account = await EmployeeBankAccount.findByPk(id);
      if (!account) {
        throw new NotFoundError('Cuenta bancaria no encontrada');
      }

      // Si es la cuenta primaria, asignar otra como primaria
      if (account.isPrimary) {
        const otherAccount = await EmployeeBankAccount.findOne({
          where: { 
            employeeId: account.employeeId,
            id: { [Op.ne]: id },
            status: 'ACTIVE',
          },
        });
        if (otherAccount) {
          await otherAccount.update({ isPrimary: true });
        }
      }

      const oldValues = account.toJSON();
      await account.destroy();

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'DELETE',
        entityType: 'EmployeeBankAccount',
        entityId: id,
        oldValues,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Cuenta bancaria eliminada: ${id} por ${req.user.username}`);

      return res.json({
        success: true,
        message: 'Cuenta bancaria eliminada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // Establecer como cuenta primaria
  async setPrimary(req, res, next) {
    try {
      const { EmployeeBankAccount, AuditLog } = require('../../../database/models');
      const { id } = req.params;

      const account = await EmployeeBankAccount.findByPk(id);
      if (!account) {
        throw new NotFoundError('Cuenta bancaria no encontrada');
      }

      // Quitar primaria de otras cuentas
      await EmployeeBankAccount.update(
        { isPrimary: false },
        { where: { employeeId: account.employeeId } }
      );

      // Establecer esta como primaria
      await account.update({ isPrimary: true });

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'UPDATE',
        entityType: 'EmployeeBankAccount',
        entityId: account.id,
        newValues: { isPrimary: true },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      return res.json({
        success: true,
        message: 'Cuenta establecida como primaria',
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  // Verificar cuenta bancaria
  async verify(req, res, next) {
    try {
      const { EmployeeBankAccount, AuditLog } = require('../../../database/models');
      const { id } = req.params;

      const account = await EmployeeBankAccount.findByPk(id);
      if (!account) {
        throw new NotFoundError('Cuenta bancaria no encontrada');
      }

      await account.update({
        status: 'ACTIVE',
        verifiedAt: new Date(),
        verifiedBy: req.user.id,
      });

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'UPDATE',
        entityType: 'EmployeeBankAccount',
        entityId: account.id,
        newValues: { status: 'ACTIVE', verifiedAt: new Date() },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      return res.json({
        success: true,
        message: 'Cuenta bancaria verificada',
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeBankAccountController();
