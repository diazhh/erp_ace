const { Op } = require('sequelize');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');
const logger = require('../../../shared/utils/logger');

class OrganizationController {
  // ========== DEPARTMENTS ==========

  // Listar departamentos
  async listDepartments(req, res, next) {
    try {
      const { Department, Employee, Position } = require('../../../database/models');
      
      const {
        type,
        status = 'ACTIVE',
        parentId,
        includeChildren = 'false',
      } = req.query;

      const where = {};
      if (type) where.type = type;
      if (status) where.status = status;
      if (parentId === 'null') {
        where.parentId = null;
      } else if (parentId) {
        where.parentId = parentId;
      }

      const include = [
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'photoUrl'],
        },
        {
          model: Department,
          as: 'parent',
          attributes: ['id', 'code', 'name', 'type'],
        },
      ];

      if (includeChildren === 'true') {
        include.push({
          model: Department,
          as: 'children',
          attributes: ['id', 'code', 'name', 'type', 'status'],
        });
      }

      const departments = await Department.findAll({
        where,
        include,
        order: [['sortOrder', 'ASC'], ['name', 'ASC']],
      });

      return res.json({
        success: true,
        data: departments,
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener departamento por ID
  async getDepartmentById(req, res, next) {
    try {
      const { Department, Employee, Position } = require('../../../database/models');
      const { id } = req.params;

      const department = await Department.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'manager',
            attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'photoUrl', 'email', 'phone'],
          },
          {
            model: Department,
            as: 'parent',
            attributes: ['id', 'code', 'name', 'type'],
          },
          {
            model: Department,
            as: 'children',
            attributes: ['id', 'code', 'name', 'type', 'status', 'sortOrder'],
            order: [['sortOrder', 'ASC']],
          },
          {
            model: Position,
            as: 'positions',
            attributes: ['id', 'code', 'name', 'level', 'status'],
          },
          {
            model: Employee,
            as: 'employees',
            attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'photoUrl', 'position', 'status'],
            where: { status: 'ACTIVE' },
            required: false,
          },
        ],
      });

      if (!department) {
        throw new NotFoundError('Departamento no encontrado');
      }

      return res.json({
        success: true,
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear departamento
  async createDepartment(req, res, next) {
    try {
      const { Department, AuditLog } = require('../../../database/models');
      
      // Verificar código único
      const existing = await Department.findOne({
        where: { code: req.body.code },
      });
      if (existing) {
        throw new BadRequestError('Ya existe un departamento con este código');
      }

      // Calcular nivel si tiene padre
      if (req.body.parentId) {
        const parent = await Department.findByPk(req.body.parentId);
        if (!parent) {
          throw new BadRequestError('Departamento padre no encontrado');
        }
        req.body.level = parent.level + 1;
      }

      const department = await Department.create(req.body);

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'CREATE',
        entityType: 'Department',
        entityId: department.id,
        newValues: department.toJSON(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Departamento creado: ${department.name} por ${req.user.username}`);

      return res.status(201).json({
        success: true,
        message: 'Departamento creado correctamente',
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar departamento
  async updateDepartment(req, res, next) {
    try {
      const { Department, AuditLog } = require('../../../database/models');
      const { id } = req.params;

      const department = await Department.findByPk(id);
      if (!department) {
        throw new NotFoundError('Departamento no encontrado');
      }

      const oldValues = department.toJSON();

      // Verificar código único si cambia
      if (req.body.code && req.body.code !== department.code) {
        const existing = await Department.findOne({
          where: { code: req.body.code, id: { [Op.ne]: id } },
        });
        if (existing) {
          throw new BadRequestError('Ya existe otro departamento con este código');
        }
      }

      // Evitar que un departamento sea su propio padre
      if (req.body.parentId === id) {
        throw new BadRequestError('Un departamento no puede ser su propio padre');
      }

      // Recalcular nivel si cambia el padre
      if (req.body.parentId !== undefined && req.body.parentId !== department.parentId) {
        if (req.body.parentId) {
          const parent = await Department.findByPk(req.body.parentId);
          if (!parent) {
            throw new BadRequestError('Departamento padre no encontrado');
          }
          req.body.level = parent.level + 1;
        } else {
          req.body.level = 0;
        }
      }

      await department.update(req.body);

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'UPDATE',
        entityType: 'Department',
        entityId: department.id,
        oldValues,
        newValues: department.toJSON(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Departamento actualizado: ${department.name} por ${req.user.username}`);

      return res.json({
        success: true,
        message: 'Departamento actualizado correctamente',
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar departamento
  async deleteDepartment(req, res, next) {
    try {
      const { Department, Employee, AuditLog } = require('../../../database/models');
      const { id } = req.params;

      const department = await Department.findByPk(id);
      if (!department) {
        throw new NotFoundError('Departamento no encontrado');
      }

      // Verificar que no tenga hijos
      const childrenCount = await Department.count({ where: { parentId: id } });
      if (childrenCount > 0) {
        throw new BadRequestError('No se puede eliminar un departamento con subdepartamentos');
      }

      // Verificar que no tenga empleados asignados
      const employeesCount = await Employee.count({ where: { departmentId: id } });
      if (employeesCount > 0) {
        throw new BadRequestError('No se puede eliminar un departamento con empleados asignados');
      }

      const oldValues = department.toJSON();
      await department.destroy();

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'DELETE',
        entityType: 'Department',
        entityId: id,
        oldValues,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Departamento eliminado: ${department.name} por ${req.user.username}`);

      return res.json({
        success: true,
        message: 'Departamento eliminado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener árbol de departamentos (para organigrama)
  async getDepartmentTree(req, res, next) {
    try {
      const { Department, Employee } = require('../../../database/models');

      const buildTree = async (parentId = null) => {
        const departments = await Department.findAll({
          where: { parentId, status: 'ACTIVE' },
          include: [
            {
              model: Employee,
              as: 'manager',
              attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'photoUrl'],
            },
          ],
          order: [['sortOrder', 'ASC'], ['name', 'ASC']],
        });

        const tree = [];
        for (const dept of departments) {
          const children = await buildTree(dept.id);
          const employeeCount = await Employee.count({
            where: { departmentId: dept.id, status: 'ACTIVE' },
          });
          
          tree.push({
            ...dept.toJSON(),
            employeeCount,
            children,
          });
        }
        return tree;
      };

      const tree = await buildTree();

      return res.json({
        success: true,
        data: tree,
      });
    } catch (error) {
      next(error);
    }
  }

  // ========== POSITIONS ==========

  // Listar posiciones
  async listPositions(req, res, next) {
    try {
      const { Position, Department, Employee } = require('../../../database/models');
      
      const {
        departmentId,
        status = 'ACTIVE',
        level,
      } = req.query;

      const where = {};
      if (departmentId) where.departmentId = departmentId;
      if (status) where.status = status;
      if (level !== undefined) where.level = level;

      const positions = await Position.findAll({
        where,
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'code', 'name', 'type'],
          },
        ],
        order: [['level', 'ASC'], ['name', 'ASC']],
      });

      // Agregar conteo de empleados por posición
      const positionsWithCount = await Promise.all(
        positions.map(async (pos) => {
          const employeeCount = await Employee.count({
            where: { positionId: pos.id, status: 'ACTIVE' },
          });
          return {
            ...pos.toJSON(),
            employeeCount,
          };
        })
      );

      return res.json({
        success: true,
        data: positionsWithCount,
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener posición por ID
  async getPositionById(req, res, next) {
    try {
      const { Position, Department, Employee } = require('../../../database/models');
      const { id } = req.params;

      const position = await Position.findByPk(id, {
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'code', 'name', 'type'],
          },
          {
            model: Employee,
            as: 'employees',
            attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'photoUrl', 'status'],
          },
        ],
      });

      if (!position) {
        throw new NotFoundError('Posición no encontrada');
      }

      return res.json({
        success: true,
        data: position,
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear posición
  async createPosition(req, res, next) {
    try {
      const { Position, AuditLog } = require('../../../database/models');
      
      // Verificar código único
      const existing = await Position.findOne({
        where: { code: req.body.code },
      });
      if (existing) {
        throw new BadRequestError('Ya existe una posición con este código');
      }

      const position = await Position.create(req.body);

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'CREATE',
        entityType: 'Position',
        entityId: position.id,
        newValues: position.toJSON(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Posición creada: ${position.name} por ${req.user.username}`);

      return res.status(201).json({
        success: true,
        message: 'Posición creada correctamente',
        data: position,
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar posición
  async updatePosition(req, res, next) {
    try {
      const { Position, AuditLog } = require('../../../database/models');
      const { id } = req.params;

      const position = await Position.findByPk(id);
      if (!position) {
        throw new NotFoundError('Posición no encontrada');
      }

      const oldValues = position.toJSON();

      // Verificar código único si cambia
      if (req.body.code && req.body.code !== position.code) {
        const existing = await Position.findOne({
          where: { code: req.body.code, id: { [Op.ne]: id } },
        });
        if (existing) {
          throw new BadRequestError('Ya existe otra posición con este código');
        }
      }

      await position.update(req.body);

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'UPDATE',
        entityType: 'Position',
        entityId: position.id,
        oldValues,
        newValues: position.toJSON(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Posición actualizada: ${position.name} por ${req.user.username}`);

      return res.json({
        success: true,
        message: 'Posición actualizada correctamente',
        data: position,
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar posición
  async deletePosition(req, res, next) {
    try {
      const { Position, Employee, AuditLog } = require('../../../database/models');
      const { id } = req.params;

      const position = await Position.findByPk(id);
      if (!position) {
        throw new NotFoundError('Posición no encontrada');
      }

      // Verificar que no tenga empleados activos asignados
      const employeesCount = await Employee.count({ 
        where: { 
          positionId: id,
          status: { [Op.ne]: 'TERMINATED' }
        } 
      });
      if (employeesCount > 0) {
        throw new BadRequestError('No se puede eliminar una posición con empleados asignados');
      }

      const oldValues = position.toJSON();
      await position.destroy();

      // Auditoría
      await AuditLog.create({
        userId: req.user.id,
        action: 'DELETE',
        entityType: 'Position',
        entityId: id,
        oldValues,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Posición eliminada: ${position.name} por ${req.user.username}`);

      return res.json({
        success: true,
        message: 'Posición eliminada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // ========== ORGANIGRAMA ==========

  // Obtener organigrama de empleados
  async getOrgChart(req, res, next) {
    try {
      const { Employee, Department, Position } = require('../../../database/models');

      const buildOrgChart = async (supervisorId = null) => {
        const employees = await Employee.findAll({
          where: { 
            supervisorId,
            status: 'ACTIVE',
          },
          include: [
            {
              model: Department,
              as: 'departmentRef',
              attributes: ['id', 'code', 'name', 'type', 'color'],
            },
            {
              model: Position,
              as: 'positionRef',
              attributes: ['id', 'code', 'name', 'level'],
            },
          ],
          order: [['firstName', 'ASC']],
        });

        const chart = [];
        for (const emp of employees) {
          const subordinates = await buildOrgChart(emp.id);
          chart.push({
            id: emp.id,
            name: `${emp.firstName} ${emp.lastName}`,
            employeeCode: emp.employeeCode,
            position: emp.positionRef?.name || emp.position,
            department: emp.departmentRef?.name || emp.department,
            departmentColor: emp.departmentRef?.color || '#1976d2',
            photoUrl: emp.photoUrl,
            email: emp.email,
            phone: emp.phone || emp.mobilePhone,
            subordinates,
          });
        }
        return chart;
      };

      const orgChart = await buildOrgChart();

      return res.json({
        success: true,
        data: orgChart,
      });
    } catch (error) {
      next(error);
    }
  }

  // ========== DIRECTORIO ==========

  // Directorio de empleados
  async getDirectory(req, res, next) {
    try {
      const { Employee, Department, Position } = require('../../../database/models');
      
      const {
        search,
        departmentId,
        letter,
        page = 1,
        limit = 50,
      } = req.query;

      const where = { status: 'ACTIVE' };
      
      if (departmentId) {
        where.departmentId = departmentId;
      }

      if (letter) {
        where.firstName = { [Op.iLike]: `${letter}%` };
      }

      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { employeeCode: { [Op.iLike]: `%${search}%` } },
          { position: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await Employee.findAndCountAll({
        where,
        include: [
          {
            model: Department,
            as: 'departmentRef',
            attributes: ['id', 'code', 'name', 'type'],
          },
          {
            model: Position,
            as: 'positionRef',
            attributes: ['id', 'code', 'name'],
          },
          {
            model: Employee,
            as: 'supervisor',
            attributes: ['id', 'firstName', 'lastName', 'employeeCode'],
          },
        ],
        attributes: [
          'id', 'firstName', 'lastName', 'employeeCode', 'position', 'department',
          'email', 'phone', 'mobilePhone', 'extension', 'officeLocation', 'photoUrl',
        ],
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
        limit: parseInt(limit),
        offset,
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

  // Estadísticas de organización
  async getOrgStats(req, res, next) {
    try {
      const { Employee, Department, Position } = require('../../../database/models');
      const sequelize = require('sequelize');

      const [
        totalEmployees,
        totalDepartments,
        totalPositions,
        employeesByDepartment,
        employeesByType,
      ] = await Promise.all([
        Employee.count({ where: { status: 'ACTIVE' } }),
        Department.count({ where: { status: 'ACTIVE' } }),
        Position.count({ where: { status: 'ACTIVE' } }),
        Employee.findAll({
          attributes: [
            'department',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          ],
          where: { status: 'ACTIVE' },
          group: ['department'],
          order: [[sequelize.literal('count'), 'DESC']],
          limit: 10,
        }),
        Department.findAll({
          attributes: [
            'type',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          ],
          where: { status: 'ACTIVE' },
          group: ['type'],
        }),
      ]);

      return res.json({
        success: true,
        data: {
          totalEmployees,
          totalDepartments,
          totalPositions,
          employeesByDepartment: employeesByDepartment.map(d => ({
            department: d.department || 'Sin departamento',
            count: parseInt(d.get('count')),
          })),
          departmentsByType: employeesByType.map(d => ({
            type: d.type,
            count: parseInt(d.get('count')),
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrganizationController();
