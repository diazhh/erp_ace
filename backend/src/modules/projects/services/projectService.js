const { Op } = require('sequelize');

class ProjectService {
  /**
   * Genera código único para proyecto según tipo de ejecución
   * @param {string} executionType - 'INTERNAL' o 'OUTSOURCED'
   */
  async generateProjectCode(executionType = 'INTERNAL') {
    const { Project } = require('../../../database/models');
    
    // Prefijo según tipo de ejecución
    const prefix = executionType === 'OUTSOURCED' ? 'PRJ-CTR' : 'PRJ-INT';
    
    const lastProject = await Project.findOne({
      where: { executionType },
      order: [['createdAt', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastProject && lastProject.code) {
      const match = lastProject.code.match(/-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    return `${prefix}-${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Genera código único para gasto de proyecto
   */
  async generateExpenseCode(projectCode) {
    const { ProjectExpense } = require('../../../database/models');
    
    if (!projectCode) {
      throw new Error('Se requiere el código del proyecto');
    }
    
    const lastExpense = await ProjectExpense.findOne({
      where: {
        code: { [Op.like]: `${projectCode}-EXP-%` },
      },
      order: [['createdAt', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastExpense && lastExpense.code) {
      const match = lastExpense.code.match(/-EXP-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    return `${projectCode}-EXP-${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Calcula el progreso del proyecto basado en hitos
   */
  async calculateProgress(projectId) {
    const { Project, ProjectMilestone } = require('../../../database/models');
    
    const milestones = await ProjectMilestone.findAll({
      where: { projectId },
    });
    
    if (milestones.length === 0) {
      return 0;
    }
    
    const totalWeight = milestones.reduce((sum, m) => sum + m.weight, 0);
    const completedWeight = milestones
      .filter(m => m.status === 'COMPLETED')
      .reduce((sum, m) => sum + m.weight, 0);
    
    const progress = Math.round((completedWeight / totalWeight) * 100);
    
    // Actualizar el progreso del proyecto
    await Project.update({ progress }, { where: { id: projectId } });
    
    return progress;
  }

  /**
   * Actualiza el costo real del proyecto
   */
  async updateActualCost(projectId, transaction = null) {
    const { Project, ProjectExpense } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const result = await ProjectExpense.findOne({
      where: { 
        projectId,
        status: { [Op.in]: ['APPROVED', 'PAID'] },
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
      ],
      raw: true,
      transaction,
    });
    
    const actualCost = parseFloat(result?.total || 0);
    
    await Project.update(
      { actualCost },
      { where: { id: projectId }, transaction }
    );
    
    return actualCost;
  }

  /**
   * Obtiene estadísticas del proyecto
   */
  async getStats(projectId) {
    const { 
      Project, ProjectMember, ProjectMilestone, ProjectExpense, Employee 
    } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Proyecto no encontrado');
    }
    
    // Miembros activos
    const activeMembers = await ProjectMember.count({
      where: { projectId, status: 'ACTIVE' },
    });
    
    // Hitos por estado
    const milestonesByStatus = await ProjectMilestone.findAll({
      where: { projectId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });
    
    // Gastos por tipo
    const expensesByType = await ProjectExpense.findAll({
      where: { 
        projectId,
        status: { [Op.in]: ['APPROVED', 'PAID'] },
      },
      attributes: [
        'expenseType',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['expenseType'],
      raw: true,
    });
    
    // Gastos pendientes de aprobación
    const pendingExpenses = await ProjectExpense.count({
      where: { projectId, status: 'PENDING' },
    });
    
    // Hitos atrasados
    const today = new Date().toISOString().split('T')[0];
    const delayedMilestones = await ProjectMilestone.count({
      where: {
        projectId,
        status: { [Op.notIn]: ['COMPLETED', 'CANCELLED'] },
        dueDate: { [Op.lt]: today },
      },
    });
    
    // Calcular rentabilidad
    const budget = parseFloat(project.budget || 0);
    const actualCost = parseFloat(project.actualCost || 0);
    const revenue = parseFloat(project.revenue || 0);
    const profit = revenue - actualCost;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const budgetUsage = budget > 0 ? (actualCost / budget) * 100 : 0;
    
    return {
      project: {
        id: project.id,
        code: project.code,
        name: project.name,
        status: project.status,
        progress: project.progress,
        priority: project.priority,
      },
      team: {
        activeMembers,
      },
      milestones: {
        byStatus: milestonesByStatus,
        delayed: delayedMilestones,
        total: milestonesByStatus.reduce((sum, m) => sum + parseInt(m.count), 0),
      },
      financial: {
        budget,
        actualCost,
        revenue,
        profit,
        profitMargin: Math.round(profitMargin * 100) / 100,
        budgetUsage: Math.round(budgetUsage * 100) / 100,
        pendingExpenses,
        expensesByType,
      },
    };
  }

  /**
   * Obtiene estadísticas generales de todos los proyectos
   * @param {string} executionType - Filtrar por tipo de ejecución (opcional)
   */
  async getGeneralStats(executionType = null) {
    const { Project, ProjectMember, ProjectExpense } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const baseWhere = executionType ? { executionType } : {};
    
    // Proyectos por estado
    const byStatus = await Project.findAll({
      where: baseWhere,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });
    
    // Proyectos por prioridad
    const byPriority = await Project.findAll({
      where: baseWhere,
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['priority'],
      raw: true,
    });
    
    // Proyectos por tipo de ejecución
    const byExecutionType = await Project.findAll({
      attributes: [
        'executionType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['executionType'],
      raw: true,
    });
    
    // Totales financieros
    const financials = await Project.findOne({
      where: baseWhere,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('budget')), 'totalBudget'],
        [sequelize.fn('SUM', sequelize.col('actual_cost')), 'totalActualCost'],
        [sequelize.fn('SUM', sequelize.col('revenue')), 'totalRevenue'],
        [sequelize.fn('SUM', sequelize.col('contract_amount')), 'totalContractAmount'],
        [sequelize.fn('SUM', sequelize.col('paid_to_contractor')), 'totalPaidToContractor'],
      ],
      raw: true,
    });
    
    // Proyectos activos
    const activeProjects = await Project.count({
      where: { ...baseWhere, status: 'IN_PROGRESS' },
    });
    
    // Proyectos atrasados (fecha fin pasada y no completados)
    const today = new Date().toISOString().split('T')[0];
    const delayedProjects = await Project.count({
      where: {
        ...baseWhere,
        status: { [Op.notIn]: ['COMPLETED', 'CANCELLED'] },
        endDate: { [Op.lt]: today },
      },
    });
    
    return {
      total: byStatus.reduce((sum, s) => sum + parseInt(s.count), 0),
      active: activeProjects,
      delayed: delayedProjects,
      byStatus,
      byPriority,
      byExecutionType,
      financial: {
        totalBudget: parseFloat(financials?.totalBudget || 0),
        totalActualCost: parseFloat(financials?.totalActualCost || 0),
        totalRevenue: parseFloat(financials?.totalRevenue || 0),
        totalProfit: parseFloat(financials?.totalRevenue || 0) - parseFloat(financials?.totalActualCost || 0),
        // Para proyectos contratados
        totalContractAmount: parseFloat(financials?.totalContractAmount || 0),
        totalPaidToContractor: parseFloat(financials?.totalPaidToContractor || 0),
        pendingContractorPayments: parseFloat(financials?.totalContractAmount || 0) - parseFloat(financials?.totalPaidToContractor || 0),
      },
    };
  }

  /**
   * Verifica si un empleado puede ser asignado al proyecto
   */
  async canAssignEmployee(projectId, employeeId) {
    const { ProjectMember } = require('../../../database/models');
    
    const existing = await ProjectMember.findOne({
      where: { 
        projectId, 
        employeeId,
        status: 'ACTIVE',
      },
    });
    
    if (existing) {
      return { allowed: false, reason: 'El empleado ya está asignado al proyecto' };
    }
    
    return { allowed: true };
  }

  /**
   * Obtiene los proyectos de un empleado
   */
  async getEmployeeProjects(employeeId, options = {}) {
    const { Project, ProjectMember } = require('../../../database/models');
    
    const { status, includeCompleted = false } = options;
    
    const whereClause = { employeeId };
    if (status) {
      whereClause.status = status;
    } else if (!includeCompleted) {
      whereClause.status = 'ACTIVE';
    }
    
    const assignments = await ProjectMember.findAll({
      where: whereClause,
      include: [{
        model: Project,
        as: 'project',
        attributes: ['id', 'code', 'name', 'status', 'progress', 'startDate', 'endDate'],
      }],
      order: [['startDate', 'DESC']],
    });
    
    return assignments;
  }

  /**
   * Tipos de proyecto predefinidos
   */
  getProjectTypes() {
    return [
      { code: 'CONSTRUCTION', name: 'Construcción', icon: 'construction' },
      { code: 'CONSULTING', name: 'Consultoría', icon: 'support_agent' },
      { code: 'MAINTENANCE', name: 'Mantenimiento', icon: 'build' },
      { code: 'DEVELOPMENT', name: 'Desarrollo', icon: 'code' },
      { code: 'INSTALLATION', name: 'Instalación', icon: 'settings' },
      { code: 'RESEARCH', name: 'Investigación', icon: 'science' },
      { code: 'TRAINING', name: 'Capacitación', icon: 'school' },
      { code: 'OTHER', name: 'Otro', icon: 'more_horiz' },
    ];
  }

  /**
   * Tipos de gasto predefinidos
   */
  getExpenseTypes() {
    return [
      { code: 'LABOR', name: 'Mano de Obra', icon: 'engineering' },
      { code: 'MATERIALS', name: 'Materiales', icon: 'inventory' },
      { code: 'EQUIPMENT', name: 'Equipos', icon: 'precision_manufacturing' },
      { code: 'SERVICES', name: 'Servicios', icon: 'miscellaneous_services' },
      { code: 'TRAVEL', name: 'Viajes', icon: 'flight' },
      { code: 'OTHER', name: 'Otros', icon: 'more_horiz' },
    ];
  }

  /**
   * Roles de miembro de proyecto predefinidos
   */
  getMemberRoles() {
    return [
      { code: 'MANAGER', name: 'Gerente de Proyecto', icon: 'manage_accounts' },
      { code: 'LEAD', name: 'Líder Técnico', icon: 'person' },
      { code: 'DEVELOPER', name: 'Desarrollador', icon: 'code' },
      { code: 'ANALYST', name: 'Analista', icon: 'analytics' },
      { code: 'DESIGNER', name: 'Diseñador', icon: 'design_services' },
      { code: 'TESTER', name: 'Tester', icon: 'bug_report' },
      { code: 'SUPPORT', name: 'Soporte', icon: 'support' },
      { code: 'CONSULTANT', name: 'Consultor', icon: 'support_agent' },
      { code: 'TECHNICIAN', name: 'Técnico', icon: 'engineering' },
      { code: 'SUPERVISOR', name: 'Supervisor', icon: 'supervisor_account' },
      { code: 'OTHER', name: 'Otro', icon: 'person_outline' },
    ];
  }
}

module.exports = new ProjectService();
