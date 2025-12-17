const { Op } = require('sequelize');
const { sequelize } = require('../../../database');
const projectService = require('../services/projectService');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

class ProjectController {
  // ==================== PROJECTS ====================

  /**
   * Crear nuevo proyecto
   */
  async create(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Project } = require('../../../database/models');
      
      const {
        executionType,
        name,
        description,
        clientName,
        clientContact,
        clientEmail,
        clientPhone,
        startDate,
        endDate,
        currency,
        budget,
        estimatedCost,
        priority,
        projectType,
        location,
        address,
        managerId,
        departmentId,
        pettyCashId,
        contractorId,
        contractAmount,
        fieldId,
        wellId,
        notes,
      } = req.body;
      
      // Generar código según tipo de ejecución
      const code = await projectService.generateProjectCode(executionType || 'INTERNAL');
      
      const project = await Project.create({
        code,
        executionType: executionType || 'INTERNAL',
        name,
        description,
        clientName,
        clientContact,
        clientEmail,
        clientPhone,
        startDate,
        endDate,
        currency: currency || 'USD',
        budget,
        estimatedCost,
        priority: priority || 'MEDIUM',
        projectType,
        location,
        address,
        managerId,
        departmentId,
        pettyCashId,
        contractorId,
        contractAmount,
        fieldId,
        wellId,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      await t.commit();
      
      return res.status(201).json({
        success: true,
        message: 'Proyecto creado exitosamente',
        data: project,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Listar proyectos
   */
  async list(req, res, next) {
    try {
      const { Project, Employee, Department, Contractor, Field, Well } = require('../../../database/models');
      const { executionType, status, priority, managerId, departmentId, contractorId, fieldId, wellId, search, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (executionType) whereClause.executionType = executionType;
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (managerId) whereClause.managerId = managerId;
      if (departmentId) whereClause.departmentId = departmentId;
      if (contractorId) whereClause.contractorId = contractorId;
      if (fieldId) whereClause.fieldId = fieldId;
      if (wellId) whereClause.wellId = wellId;
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { code: { [Op.iLike]: `%${search}%` } },
          { clientName: { [Op.iLike]: `%${search}%` } },
        ];
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await Project.findAndCountAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
          { model: Contractor, as: 'contractor', attributes: ['id', 'code', 'companyName', 'status'] },
        ],
        order: [['createdAt', 'DESC']],
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
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener proyecto por ID
   */
  async getById(req, res, next) {
    try {
      const { Project, Employee, Department, PettyCash, Contractor } = require('../../../database/models');
      
      const project = await Project.findByPk(req.params.id, {
        include: [
          { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email'] },
          { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
          { model: PettyCash, as: 'pettyCash', attributes: ['id', 'code', 'name', 'currentBalance'] },
          { model: Contractor, as: 'contractor', attributes: ['id', 'code', 'companyName', 'contactName', 'contactPhone', 'contactEmail', 'status', 'rating'] },
        ],
      });
      
      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }
      
      return res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener proyecto con todas sus relaciones (trazabilidad)
   */
  async getFullById(req, res, next) {
    try {
      const { 
        Project, Employee, Department, PettyCash, User, Contractor,
        ProjectMember, ProjectMilestone, ProjectExpense, AuditLog 
      } = require('../../../database/models');
      
      const project = await Project.findByPk(req.params.id, {
        include: [
          { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'phone'] },
          { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
          { model: PettyCash, as: 'pettyCash', attributes: ['id', 'code', 'name', 'currentBalance', 'currency'] },
          { model: Contractor, as: 'contractor' },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
        ],
      });
      
      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }
      
      // Obtener estadísticas
      const stats = await projectService.getStats(project.id);
      
      // Obtener miembros del equipo
      const members = await ProjectMember.findAll({
        where: { projectId: project.id },
        include: [
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email'] },
        ],
        order: [['startDate', 'ASC']],
      });
      
      // Obtener hitos
      const milestones = await ProjectMilestone.findAll({
        where: { projectId: project.id },
        include: [
          { model: Employee, as: 'assignee', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['sortOrder', 'ASC'], ['dueDate', 'ASC']],
      });
      
      // Obtener últimos gastos
      const expenses = await ProjectExpense.findAll({
        where: { projectId: project.id },
        include: [
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['expenseDate', 'DESC']],
        limit: 20,
      });
      
      // Historial de auditoría
      const auditLogs = await AuditLog.findAll({
        where: { 
          entityType: 'Project',
          entityId: project.id,
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
          ...project.toJSON(),
          stats,
          members,
          milestones,
          recentExpenses: expenses,
          auditLogs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar proyecto
   */
  async update(req, res, next) {
    try {
      const { Project } = require('../../../database/models');
      
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }
      
      const {
        // No permitir cambiar executionType después de creado
        name,
        description,
        clientName,
        clientContact,
        clientEmail,
        clientPhone,
        startDate,
        endDate,
        actualEndDate,
        budget,
        estimatedCost,
        revenue,
        status,
        progress,
        priority,
        projectType,
        location,
        address,
        managerId,
        departmentId,
        pettyCashId,
        contractorId,
        contractAmount,
        paidToContractor,
        notes,
      } = req.body;
      
      await project.update({
        name,
        description,
        clientName,
        clientContact,
        clientEmail,
        clientPhone,
        startDate,
        endDate,
        actualEndDate,
        budget,
        estimatedCost,
        revenue,
        status,
        progress,
        priority,
        projectType,
        location,
        address,
        managerId,
        departmentId,
        pettyCashId,
        contractorId,
        contractAmount,
        paidToContractor,
        notes,
      });
      
      return res.json({
        success: true,
        message: 'Proyecto actualizado',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar proyecto
   */
  async delete(req, res, next) {
    try {
      const { Project, ProjectMember, ProjectMilestone, ProjectExpense } = require('../../../database/models');
      
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }
      
      // Verificar que no tenga gastos aprobados
      const approvedExpenses = await ProjectExpense.count({
        where: { 
          projectId: project.id,
          status: { [Op.in]: ['APPROVED', 'PAID'] },
        },
      });
      
      if (approvedExpenses > 0) {
        throw new BadRequestError('No se puede eliminar un proyecto con gastos aprobados');
      }
      
      // Eliminar en cascada
      await ProjectExpense.destroy({ where: { projectId: project.id } });
      await ProjectMilestone.destroy({ where: { projectId: project.id } });
      await ProjectMember.destroy({ where: { projectId: project.id } });
      await project.destroy();
      
      return res.json({
        success: true,
        message: 'Proyecto eliminado',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estadísticas del proyecto
   */
  async getStats(req, res, next) {
    try {
      const stats = await projectService.getStats(req.params.id);
      
      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estadísticas generales
   */
  async getGeneralStats(req, res, next) {
    try {
      const stats = await projectService.getGeneralStats();
      
      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener tipos de proyecto
   */
  async getProjectTypes(req, res, next) {
    try {
      const types = projectService.getProjectTypes();
      return res.json({
        success: true,
        data: types,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== MEMBERS ====================

  /**
   * Agregar miembro al proyecto
   */
  async addMember(req, res, next) {
    try {
      const { Project, ProjectMember } = require('../../../database/models');
      
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }
      
      const { employeeId, role, startDate, endDate, allocation, hourlyRate, canApproveExpenses, canEditMilestones, notes } = req.body;
      
      // Verificar si ya está asignado
      const canAssign = await projectService.canAssignEmployee(project.id, employeeId);
      if (!canAssign.allowed) {
        throw new BadRequestError(canAssign.reason);
      }
      
      const member = await ProjectMember.create({
        projectId: project.id,
        employeeId,
        role,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate,
        allocation: allocation || 100,
        hourlyRate,
        canApproveExpenses: canApproveExpenses || false,
        canEditMilestones: canEditMilestones || false,
        notes,
      });
      
      return res.status(201).json({
        success: true,
        message: 'Miembro agregado al proyecto',
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar miembros del proyecto
   */
  async listMembers(req, res, next) {
    try {
      const { ProjectMember, Employee } = require('../../../database/models');
      const { status } = req.query;
      
      const whereClause = { projectId: req.params.id };
      if (status) whereClause.status = status;
      
      const members = await ProjectMember.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'phone'] },
        ],
        order: [['startDate', 'ASC']],
      });
      
      return res.json({
        success: true,
        data: members,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar miembro del proyecto
   */
  async updateMember(req, res, next) {
    try {
      const { ProjectMember } = require('../../../database/models');
      
      const member = await ProjectMember.findByPk(req.params.memberId);
      if (!member) {
        throw new NotFoundError('Miembro no encontrado');
      }
      
      const { role, endDate, allocation, hourlyRate, hoursWorked, status, canApproveExpenses, canEditMilestones, notes } = req.body;
      
      await member.update({
        role,
        endDate,
        allocation,
        hourlyRate,
        hoursWorked,
        status,
        canApproveExpenses,
        canEditMilestones,
        notes,
      });
      
      return res.json({
        success: true,
        message: 'Miembro actualizado',
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remover miembro del proyecto
   */
  async removeMember(req, res, next) {
    try {
      const { ProjectMember } = require('../../../database/models');
      
      const member = await ProjectMember.findByPk(req.params.memberId);
      if (!member) {
        throw new NotFoundError('Miembro no encontrado');
      }
      
      await member.destroy();
      
      return res.json({
        success: true,
        message: 'Miembro removido del proyecto',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== MILESTONES ====================

  /**
   * Crear hito
   */
  async createMilestone(req, res, next) {
    try {
      const { Project, ProjectMilestone } = require('../../../database/models');
      
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }
      
      const { name, description, dueDate, sortOrder, weight, assigneeId, deliverables, dependsOn, notes } = req.body;
      
      // Obtener el siguiente orden si no se especifica
      let order = sortOrder;
      if (order === undefined) {
        const lastMilestone = await ProjectMilestone.findOne({
          where: { projectId: project.id },
          order: [['sortOrder', 'DESC']],
        });
        order = lastMilestone ? lastMilestone.sortOrder + 1 : 0;
      }
      
      const milestone = await ProjectMilestone.create({
        projectId: project.id,
        name,
        description,
        dueDate,
        sortOrder: order,
        weight: weight || 1,
        assigneeId,
        deliverables,
        dependsOn,
        createdBy: req.user.id,
        notes,
      });
      
      return res.status(201).json({
        success: true,
        message: 'Hito creado',
        data: milestone,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar hitos del proyecto
   */
  async listMilestones(req, res, next) {
    try {
      const { ProjectMilestone, Employee } = require('../../../database/models');
      const { status } = req.query;
      
      const whereClause = { projectId: req.params.id };
      if (status) whereClause.status = status;
      
      const milestones = await ProjectMilestone.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'assignee', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['sortOrder', 'ASC'], ['dueDate', 'ASC']],
      });
      
      return res.json({
        success: true,
        data: milestones,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar hito
   */
  async updateMilestone(req, res, next) {
    try {
      const { ProjectMilestone } = require('../../../database/models');
      
      const milestone = await ProjectMilestone.findByPk(req.params.milestoneId);
      if (!milestone) {
        throw new NotFoundError('Hito no encontrado');
      }
      
      const { name, description, dueDate, completedDate, status, sortOrder, weight, assigneeId, deliverables, dependsOn, notes } = req.body;
      
      // Si se marca como completado, registrar quién lo completó
      let completedBy = milestone.completedBy;
      if (status === 'COMPLETED' && milestone.status !== 'COMPLETED') {
        completedBy = req.user.id;
      }
      
      await milestone.update({
        name,
        description,
        dueDate,
        completedDate,
        status,
        sortOrder,
        weight,
        assigneeId,
        deliverables,
        dependsOn,
        completedBy,
        notes,
      });
      
      // Recalcular progreso del proyecto
      if (status) {
        await projectService.calculateProgress(milestone.projectId);
      }
      
      return res.json({
        success: true,
        message: 'Hito actualizado',
        data: milestone,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Completar hito
   */
  async completeMilestone(req, res, next) {
    try {
      const { ProjectMilestone } = require('../../../database/models');
      
      const milestone = await ProjectMilestone.findByPk(req.params.milestoneId);
      if (!milestone) {
        throw new NotFoundError('Hito no encontrado');
      }
      
      if (milestone.status === 'COMPLETED') {
        throw new BadRequestError('El hito ya está completado');
      }
      
      await milestone.update({
        status: 'COMPLETED',
        completedDate: new Date().toISOString().split('T')[0],
        completedBy: req.user.id,
      });
      
      // Recalcular progreso del proyecto
      const progress = await projectService.calculateProgress(milestone.projectId);
      
      return res.json({
        success: true,
        message: 'Hito completado',
        data: { milestone, projectProgress: progress },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar hito
   */
  async deleteMilestone(req, res, next) {
    try {
      const { ProjectMilestone, ProjectExpense } = require('../../../database/models');
      
      const milestone = await ProjectMilestone.findByPk(req.params.milestoneId);
      if (!milestone) {
        throw new NotFoundError('Hito no encontrado');
      }
      
      // Verificar que no tenga gastos asociados
      const expenses = await ProjectExpense.count({
        where: { milestoneId: milestone.id },
      });
      
      if (expenses > 0) {
        throw new BadRequestError('No se puede eliminar un hito con gastos asociados');
      }
      
      const projectId = milestone.projectId;
      await milestone.destroy();
      
      // Recalcular progreso
      await projectService.calculateProgress(projectId);
      
      return res.json({
        success: true,
        message: 'Hito eliminado',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== EXPENSES ====================

  /**
   * Crear gasto del proyecto
   */
  async createExpense(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Project, ProjectExpense } = require('../../../database/models');
      
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }
      
      const code = await projectService.generateExpenseCode(project.code);
      const {
        expenseType,
        category,
        description,
        amount,
        currency,
        exchangeRate,
        expenseDate,
        receiptNumber,
        receiptImageUrl,
        vendor,
        vendorRif,
        employeeId,
        milestoneId,
        isBudgeted,
        budgetLineItem,
        notes,
      } = req.body;
      
      const expense = await ProjectExpense.create({
        code,
        projectId: project.id,
        expenseType,
        category,
        description,
        amount,
        currency: currency || project.currency,
        exchangeRate,
        expenseDate: expenseDate || new Date().toISOString().split('T')[0],
        receiptNumber,
        receiptImageUrl,
        vendor,
        vendorRif,
        employeeId,
        milestoneId,
        isBudgeted: isBudgeted || false,
        budgetLineItem,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      await t.commit();
      
      return res.status(201).json({
        success: true,
        message: 'Gasto registrado',
        data: expense,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Listar gastos del proyecto
   */
  async listExpenses(req, res, next) {
    try {
      const { ProjectExpense, Employee, ProjectMilestone } = require('../../../database/models');
      const { status, expenseType, startDate, endDate, page = 1, limit = 20 } = req.query;
      
      const whereClause = { projectId: req.params.id };
      if (status) whereClause.status = status;
      if (expenseType) whereClause.expenseType = expenseType;
      if (startDate && endDate) {
        whereClause.expenseDate = { [Op.between]: [startDate, endDate] };
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await ProjectExpense.findAndCountAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'] },
          { model: ProjectMilestone, as: 'milestone', attributes: ['id', 'name'] },
        ],
        order: [['expenseDate', 'DESC']],
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
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener gasto por ID
   */
  async getExpenseById(req, res, next) {
    try {
      const { ProjectExpense, Project, Employee, ProjectMilestone, User } = require('../../../database/models');
      
      const expense = await ProjectExpense.findByPk(req.params.expenseId, {
        include: [
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'] },
          { model: ProjectMilestone, as: 'milestone', attributes: ['id', 'name'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: User, as: 'approver', attributes: ['id', 'username'] },
        ],
      });
      
      if (!expense) {
        throw new NotFoundError('Gasto no encontrado');
      }
      
      return res.json({
        success: true,
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Aprobar gasto
   */
  async approveExpense(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { ProjectExpense } = require('../../../database/models');
      
      const expense = await ProjectExpense.findByPk(req.params.expenseId);
      if (!expense) {
        throw new NotFoundError('Gasto no encontrado');
      }
      
      if (expense.status !== 'PENDING') {
        throw new BadRequestError('Solo se pueden aprobar gastos pendientes');
      }
      
      await expense.update({
        status: 'APPROVED',
        approvedBy: req.user.id,
        approvedAt: new Date(),
      }, { transaction: t });
      
      // Actualizar costo real del proyecto
      await projectService.updateActualCost(expense.projectId, t);
      
      await t.commit();
      
      return res.json({
        success: true,
        message: 'Gasto aprobado',
        data: expense,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Rechazar gasto
   */
  async rejectExpense(req, res, next) {
    try {
      const { ProjectExpense } = require('../../../database/models');
      
      const expense = await ProjectExpense.findByPk(req.params.expenseId);
      if (!expense) {
        throw new NotFoundError('Gasto no encontrado');
      }
      
      if (expense.status !== 'PENDING') {
        throw new BadRequestError('Solo se pueden rechazar gastos pendientes');
      }
      
      const { reason } = req.body;
      
      await expense.update({
        status: 'REJECTED',
        rejectionReason: reason,
        approvedBy: req.user.id,
        approvedAt: new Date(),
      });
      
      return res.json({
        success: true,
        message: 'Gasto rechazado',
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar gasto
   */
  async deleteExpense(req, res, next) {
    try {
      const { ProjectExpense } = require('../../../database/models');
      
      const expense = await ProjectExpense.findByPk(req.params.expenseId);
      if (!expense) {
        throw new NotFoundError('Gasto no encontrado');
      }
      
      if (expense.status === 'APPROVED' || expense.status === 'PAID') {
        throw new BadRequestError('No se pueden eliminar gastos aprobados o pagados');
      }
      
      await expense.destroy();
      
      return res.json({
        success: true,
        message: 'Gasto eliminado',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener tipos de gasto
   */
  async getExpenseTypes(req, res, next) {
    try {
      const types = projectService.getExpenseTypes();
      return res.json({
        success: true,
        data: types,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener roles de miembro
   */
  async getMemberRoles(req, res, next) {
    try {
      const roles = projectService.getMemberRoles();
      return res.json({
        success: true,
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== PROJECT UPDATES ====================

  /**
   * Crear actualización del proyecto
   */
  async createUpdate(req, res, next) {
    try {
      const { Project, ProjectUpdate, Employee } = require('../../../database/models');
      
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }
      
      // Obtener el empleado del usuario actual
      const employee = await Employee.findOne({ where: { userId: req.user.id } });
      if (!employee) {
        throw new BadRequestError('Usuario no tiene empleado asociado');
      }
      
      const {
        updateType,
        title,
        description,
        progressBefore,
        progressAfter,
        paymentId,
        milestoneId,
        isPublic,
        notes,
      } = req.body;
      
      const update = await ProjectUpdate.create({
        projectId: project.id,
        updateType: updateType || 'PROGRESS',
        title,
        description,
        progressBefore: progressBefore || project.progress,
        progressAfter,
        paymentId,
        milestoneId,
        reportedBy: employee.id,
        isPublic: isPublic !== false,
        notes,
      });
      
      // Si se reporta un nuevo progreso, actualizar el proyecto
      if (progressAfter !== undefined && progressAfter !== null) {
        await project.update({ progress: progressAfter });
      }
      
      return res.status(201).json({
        success: true,
        message: 'Actualización registrada',
        data: update,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar actualizaciones del proyecto
   */
  async listUpdates(req, res, next) {
    try {
      const { ProjectUpdate, Employee, ProjectMilestone, ContractorPayment, ProjectPhoto } = require('../../../database/models');
      const { updateType, page = 1, limit = 20 } = req.query;
      
      const whereClause = { projectId: req.params.id };
      if (updateType) whereClause.updateType = updateType;
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await ProjectUpdate.findAndCountAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'reporter', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: ProjectMilestone, as: 'milestone', attributes: ['id', 'name'] },
          { model: ContractorPayment, as: 'payment', attributes: ['id', 'code', 'amount'] },
          { model: ProjectPhoto, as: 'photos', attributes: ['id', 'photoUrl', 'thumbnailUrl', 'caption'] },
        ],
        order: [['reportedAt', 'DESC']],
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
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar actualización
   */
  async deleteUpdate(req, res, next) {
    try {
      const { ProjectUpdate, ProjectPhoto } = require('../../../database/models');
      
      const update = await ProjectUpdate.findByPk(req.params.updateId);
      if (!update) {
        throw new NotFoundError('Actualización no encontrada');
      }
      
      // Eliminar fotos asociadas
      await ProjectPhoto.destroy({ where: { updateId: update.id } });
      await update.destroy();
      
      return res.json({
        success: true,
        message: 'Actualización eliminada',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== PROJECT PHOTOS ====================

  /**
   * Agregar foto al proyecto
   */
  async addPhoto(req, res, next) {
    try {
      const { Project, ProjectPhoto } = require('../../../database/models');
      
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }
      
      const {
        updateId,
        photoUrl,
        thumbnailUrl,
        caption,
        category,
        fileName,
        fileSize,
        mimeType,
        takenAt,
        latitude,
        longitude,
        sortOrder,
        notes,
      } = req.body;
      
      // Obtener el siguiente orden si no se especifica
      let order = sortOrder;
      if (order === undefined) {
        const lastPhoto = await ProjectPhoto.findOne({
          where: { projectId: project.id },
          order: [['sortOrder', 'DESC']],
        });
        order = lastPhoto ? lastPhoto.sortOrder + 1 : 0;
      }
      
      const photo = await ProjectPhoto.create({
        projectId: project.id,
        updateId,
        photoUrl,
        thumbnailUrl,
        caption,
        category: category || 'PROGRESS',
        fileName,
        fileSize,
        mimeType,
        takenAt,
        latitude,
        longitude,
        sortOrder: order,
        uploadedBy: req.user.id,
        notes,
      });
      
      return res.status(201).json({
        success: true,
        message: 'Foto agregada',
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar fotos del proyecto
   */
  async listPhotos(req, res, next) {
    try {
      const { ProjectPhoto, ProjectUpdate, User } = require('../../../database/models');
      const { category, page = 1, limit = 50 } = req.query;
      
      const whereClause = { projectId: req.params.id };
      if (category) whereClause.category = category;
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await ProjectPhoto.findAndCountAll({
        where: whereClause,
        include: [
          { model: ProjectUpdate, as: 'update', attributes: ['id', 'title', 'updateType'] },
          { model: User, as: 'uploader', attributes: ['id', 'username'] },
        ],
        order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
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
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar foto
   */
  async updatePhoto(req, res, next) {
    try {
      const { ProjectPhoto } = require('../../../database/models');
      
      const photo = await ProjectPhoto.findByPk(req.params.photoId);
      if (!photo) {
        throw new NotFoundError('Foto no encontrada');
      }
      
      const { caption, category, sortOrder, notes } = req.body;
      
      await photo.update({ caption, category, sortOrder, notes });
      
      return res.json({
        success: true,
        message: 'Foto actualizada',
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar foto
   */
  async deletePhoto(req, res, next) {
    try {
      const { ProjectPhoto } = require('../../../database/models');
      
      const photo = await ProjectPhoto.findByPk(req.params.photoId);
      if (!photo) {
        throw new NotFoundError('Foto no encontrada');
      }
      
      await photo.destroy();
      
      return res.json({
        success: true,
        message: 'Foto eliminada',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener categorías de fotos
   */
  async getPhotoCategories(req, res, next) {
    try {
      const categories = [
        { code: 'PROGRESS', name: 'Avance de Obra', icon: 'construction' },
        { code: 'BEFORE', name: 'Antes', icon: 'history' },
        { code: 'AFTER', name: 'Después', icon: 'check_circle' },
        { code: 'ISSUE', name: 'Problema/Incidencia', icon: 'warning' },
        { code: 'DELIVERY', name: 'Entrega', icon: 'local_shipping' },
        { code: 'INSPECTION', name: 'Inspección', icon: 'search' },
        { code: 'OTHER', name: 'Otro', icon: 'photo' },
      ];
      return res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener tipos de actualización
   */
  async getUpdateTypes(req, res, next) {
    try {
      const types = [
        { code: 'PROGRESS', name: 'Reporte de Avance', icon: 'trending_up' },
        { code: 'ISSUE', name: 'Problema/Incidencia', icon: 'warning' },
        { code: 'MILESTONE', name: 'Hito Alcanzado', icon: 'flag' },
        { code: 'PAYMENT', name: 'Pago Realizado', icon: 'payment' },
        { code: 'PHOTO', name: 'Registro Fotográfico', icon: 'photo_camera' },
        { code: 'NOTE', name: 'Nota General', icon: 'note' },
        { code: 'APPROVAL', name: 'Aprobación', icon: 'check_circle' },
      ];
      return res.json({
        success: true,
        data: types,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
