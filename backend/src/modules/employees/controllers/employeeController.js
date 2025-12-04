const { Op } = require('sequelize');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');
const logger = require('../../../shared/utils/logger');

class EmployeeController {
  // Listar empleados con paginación y filtros
  async list(req, res, next) {
    try {
      const { Employee, EmployeeDocument } = require('../../../database/models');
      
      const {
        page = 1,
        limit = 10,
        search,
        status,
        department,
        position,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      // Filtros
      if (status) where.status = status;
      if (department) where.department = department;
      if (position) where.position = { [Op.iLike]: `%${position}%` };
      
      // Búsqueda
      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { idNumber: { [Op.iLike]: `%${search}%` } },
          { employeeCode: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows } = await Employee.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder]],
        include: [{
          model: EmployeeDocument,
          as: 'documents',
          attributes: ['id', 'documentType', 'documentName', 'expirationDate', 'status'],
          required: false,
        }],
      });

      return res.json({
        success: true,
        data: {
          employees: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener empleado por ID
  async getById(req, res, next) {
    try {
      const { Employee, EmployeeDocument, User } = require('../../../database/models');
      const { id } = req.params;

      const employee = await Employee.findByPk(id, {
        include: [
          {
            model: EmployeeDocument,
            as: 'documents',
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      if (!employee) {
        throw new NotFoundError('Empleado no encontrado');
      }

      return res.json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener empleado con todas sus relaciones (trazabilidad completa)
  async getFullById(req, res, next) {
    try {
      const { 
        Employee, 
        EmployeeDocument, 
        EmployeeBankAccount,
        Department,
        Position,
        User,
        PayrollEntry,
        PayrollPeriod,
        EmployeeLoan,
        LoanPayment,
        Transaction,
        AuditLog,
      } = require('../../../database/models');
      const { id } = req.params;

      const employee = await Employee.findByPk(id, {
        include: [
          {
            model: EmployeeDocument,
            as: 'documents',
            order: [['expirationDate', 'ASC']],
          },
          {
            model: EmployeeBankAccount,
            as: 'bankAccounts',
            order: [['isPrimary', 'DESC'], ['createdAt', 'DESC']],
          },
          {
            model: Department,
            as: 'departmentRef',
            attributes: ['id', 'code', 'name', 'type'],
          },
          {
            model: Position,
            as: 'positionRef',
            attributes: ['id', 'code', 'name', 'level'],
          },
          {
            model: Employee,
            as: 'supervisor',
            attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'position', 'photoUrl'],
          },
          {
            model: Employee,
            as: 'subordinates',
            attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'position', 'photoUrl', 'status'],
            where: { status: 'ACTIVE' },
            required: false,
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email'],
          },
          {
            model: PayrollEntry,
            as: 'payrollEntries',
            limit: 12,
            order: [['createdAt', 'DESC']],
            include: [{
              model: PayrollPeriod,
              as: 'period',
              attributes: ['id', 'code', 'name', 'startDate', 'endDate', 'status'],
            }],
          },
          {
            model: EmployeeLoan,
            as: 'loans',
            include: [{
              model: LoanPayment,
              as: 'payments',
              order: [['paymentDate', 'DESC']],
            }],
          },
        ],
      });

      if (!employee) {
        throw new NotFoundError('Empleado no encontrado');
      }

      // Obtener transacciones relacionadas (gastos del empleado)
      const transactions = await Transaction.findAll({
        where: { employeeId: id },
        limit: 20,
        order: [['transactionDate', 'DESC']],
        attributes: ['id', 'code', 'transactionType', 'category', 'amount', 'currency', 'description', 'transactionDate'],
      });

      // Obtener historial de auditoría
      const auditLogs = await AuditLog.findAll({
        where: { 
          entityType: 'Employee',
          entityId: id,
        },
        limit: 50,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        }],
      });

      // Calcular estadísticas
      const stats = {
        totalLoans: employee.loans?.length || 0,
        activeLoans: employee.loans?.filter(l => l.status === 'ACTIVE').length || 0,
        totalLoanAmount: employee.loans?.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0) || 0,
        pendingLoanBalance: employee.loans?.filter(l => l.status === 'ACTIVE').reduce((sum, l) => sum + parseFloat(l.remainingBalance || 0), 0) || 0,
        payrollEntriesCount: employee.payrollEntries?.length || 0,
        documentsExpiringSoon: employee.documents?.filter(d => {
          if (!d.expirationDate) return false;
          const daysUntilExpiry = Math.ceil((new Date(d.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length || 0,
        subordinatesCount: employee.subordinates?.length || 0,
        bankAccountsCount: employee.bankAccounts?.length || 0,
      };

      return res.json({
        success: true,
        data: {
          ...employee.toJSON(),
          transactions,
          auditLogs,
          stats,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear empleado
  async create(req, res, next) {
    try {
      const { Employee, AuditLog } = require('../../../database/models');
      
      // Verificar si ya existe un empleado con la misma cédula
      const existing = await Employee.findOne({
        where: { idNumber: req.body.idNumber },
      });

      if (existing) {
        throw new BadRequestError('Ya existe un empleado con este número de identificación');
      }

      // Generar código de empleado si no se proporciona
      if (!req.body.employeeCode) {
        const count = await Employee.count();
        req.body.employeeCode = `EMP-${String(count + 1).padStart(5, '0')}`;
      }

      const employee = await Employee.create(req.body);

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'CREATE',
        entityType: 'Employee',
        entityId: employee.id,
        newValues: employee.toJSON(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Empleado creado: ${employee.getFullName()} por ${req.user.username}`);

      return res.status(201).json({
        success: true,
        message: 'Empleado creado correctamente',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar empleado
  async update(req, res, next) {
    try {
      const { Employee, AuditLog } = require('../../../database/models');
      const { id } = req.params;

      const employee = await Employee.findByPk(id);
      if (!employee) {
        throw new NotFoundError('Empleado no encontrado');
      }

      const oldValues = employee.toJSON();

      // No permitir cambiar idNumber si ya existe otro empleado con ese número
      if (req.body.idNumber && req.body.idNumber !== employee.idNumber) {
        const existing = await Employee.findOne({
          where: { 
            idNumber: req.body.idNumber,
            id: { [Op.ne]: id },
          },
        });
        if (existing) {
          throw new BadRequestError('Ya existe otro empleado con este número de identificación');
        }
      }

      await employee.update(req.body);

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'UPDATE',
        entityType: 'Employee',
        entityId: employee.id,
        oldValues,
        newValues: employee.toJSON(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Empleado actualizado: ${employee.getFullName()} por ${req.user.username}`);

      return res.json({
        success: true,
        message: 'Empleado actualizado correctamente',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar empleado (soft delete)
  async delete(req, res, next) {
    try {
      const { Employee, AuditLog } = require('../../../database/models');
      const { id } = req.params;

      const employee = await Employee.findByPk(id);
      if (!employee) {
        throw new NotFoundError('Empleado no encontrado');
      }

      const oldValues = employee.toJSON();

      await employee.destroy(); // Soft delete por paranoid: true

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'DELETE',
        entityType: 'Employee',
        entityId: id,
        oldValues,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Empleado eliminado: ${employee.getFullName()} por ${req.user.username}`);

      return res.json({
        success: true,
        message: 'Empleado eliminado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de empleados
  async getStats(req, res, next) {
    try {
      const { Employee } = require('../../../database/models');

      const [
        totalActive,
        totalInactive,
        totalOnLeave,
        byDepartment,
      ] = await Promise.all([
        Employee.count({ where: { status: 'ACTIVE' } }),
        Employee.count({ where: { status: 'INACTIVE' } }),
        Employee.count({ where: { status: 'ON_LEAVE' } }),
        Employee.findAll({
          attributes: [
            'department',
            [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
          ],
          where: { status: 'ACTIVE' },
          group: ['department'],
        }),
      ]);

      return res.json({
        success: true,
        data: {
          total: totalActive + totalInactive + totalOnLeave,
          active: totalActive,
          inactive: totalInactive,
          onLeave: totalOnLeave,
          byDepartment: byDepartment.map(d => ({
            department: d.department || 'Sin departamento',
            count: parseInt(d.get('count')),
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener documentos por vencer
  async getExpiringDocuments(req, res, next) {
    try {
      const { EmployeeDocument, Employee } = require('../../../database/models');
      const { days = 30 } = req.query;

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + parseInt(days));

      const documents = await EmployeeDocument.findAll({
        where: {
          expirationDate: {
            [Op.between]: [new Date(), futureDate],
          },
          status: 'VALID',
        },
        include: [{
          model: Employee,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'employeeCode'],
        }],
        order: [['expirationDate', 'ASC']],
      });

      return res.json({
        success: true,
        data: documents,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();
