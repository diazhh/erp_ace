const { Op } = require('sequelize');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

let models = null;
const getModels = () => {
  if (!models) {
    models = require('../../../database/models');
  }
  return models;
};

class PTWService {
  // ==================== Code Generation ====================
  async generatePermitCode(year = new Date().getFullYear()) {
    const { WorkPermit } = getModels();
    const lastPermit = await WorkPermit.findOne({
      where: { code: { [Op.like]: `PTW-${year}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastPermit) {
      const parts = lastPermit.code.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }
    return `PTW-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  async generateSWACode(year = new Date().getFullYear()) {
    const { StopWorkAuthority } = getModels();
    const lastSWA = await StopWorkAuthority.findOne({
      where: { code: { [Op.like]: `SWA-${year}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastSWA) {
      const parts = lastSWA.code.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }
    return `SWA-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  // ==================== Work Permit CRUD ====================
  async createPermit(data, userId) {
    const { WorkPermit, WorkPermitChecklist } = getModels();
    
    const code = await this.generatePermitCode();
    
    const permit = await WorkPermit.create({
      ...data,
      code,
      status: 'DRAFT',
      requested_by: userId,
    });

    // Create default checklists based on permit type
    const checklistTypes = ['PRE_WORK', 'POST_WORK'];
    for (const type of checklistTypes) {
      await WorkPermitChecklist.create({
        permit_id: permit.id,
        checklist_type: type,
        items: this.getDefaultChecklistItems(data.type, type),
      });
    }

    return this.findPermitById(permit.id);
  }

  getDefaultChecklistItems(permitType, checklistType) {
    const basePreWork = [
      { id: 1, text: 'Área de trabajo inspeccionada', checked: false },
      { id: 2, text: 'EPP verificado y en buen estado', checked: false },
      { id: 3, text: 'Personal informado de los riesgos', checked: false },
      { id: 4, text: 'Equipos de emergencia disponibles', checked: false },
      { id: 5, text: 'Comunicaciones establecidas', checked: false },
    ];

    const basePostWork = [
      { id: 1, text: 'Área de trabajo limpia y ordenada', checked: false },
      { id: 2, text: 'Equipos y herramientas retirados', checked: false },
      { id: 3, text: 'Sin condiciones inseguras pendientes', checked: false },
      { id: 4, text: 'Aislamientos removidos (si aplica)', checked: false },
    ];

    const typeSpecificPreWork = {
      HOT_WORK: [
        { id: 6, text: 'Prueba de gases realizada', checked: false },
        { id: 7, text: 'Extintores disponibles', checked: false },
        { id: 8, text: 'Vigía de fuego asignado', checked: false },
        { id: 9, text: 'Materiales combustibles removidos', checked: false },
      ],
      CONFINED_SPACE: [
        { id: 6, text: 'Atmósfera verificada (O2, LEL, H2S, CO)', checked: false },
        { id: 7, text: 'Ventilación adecuada', checked: false },
        { id: 8, text: 'Vigía de entrada asignado', checked: false },
        { id: 9, text: 'Equipo de rescate disponible', checked: false },
      ],
      ELECTRICAL: [
        { id: 6, text: 'Energía aislada y bloqueada', checked: false },
        { id: 7, text: 'Ausencia de tensión verificada', checked: false },
        { id: 8, text: 'Puesta a tierra instalada', checked: false },
      ],
      WORKING_AT_HEIGHT: [
        { id: 6, text: 'Arnés y línea de vida inspeccionados', checked: false },
        { id: 7, text: 'Puntos de anclaje verificados', checked: false },
        { id: 8, text: 'Área inferior acordonada', checked: false },
      ],
      EXCAVATION: [
        { id: 6, text: 'Servicios subterráneos localizados', checked: false },
        { id: 7, text: 'Entibado/talud adecuado', checked: false },
        { id: 8, text: 'Acceso/salida seguro', checked: false },
      ],
      LIFTING: [
        { id: 6, text: 'Plan de izaje aprobado', checked: false },
        { id: 7, text: 'Equipo de izaje certificado', checked: false },
        { id: 8, text: 'Área de izaje despejada', checked: false },
        { id: 9, text: 'Señalero designado', checked: false },
      ],
      LOCKOUT_TAGOUT: [
        { id: 6, text: 'Procedimiento LOTO revisado', checked: false },
        { id: 7, text: 'Todos los puntos de aislamiento identificados', checked: false },
        { id: 8, text: 'Candados y etiquetas instalados', checked: false },
      ],
    };

    if (checklistType === 'PRE_WORK') {
      return [...basePreWork, ...(typeSpecificPreWork[permitType] || [])];
    }
    return basePostWork;
  }

  async findPermitById(id) {
    const { WorkPermit, WorkPermitChecklist, WorkPermitExtension, StopWorkAuthority, User, Field, Well, Contractor } = getModels();
    
    const permit = await WorkPermit.findByPk(id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'approver', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'closer', attributes: ['id', 'username', 'email'] },
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: Well, as: 'well', attributes: ['id', 'code', 'name'] },
        { model: Contractor, as: 'contractor', attributes: ['id', 'companyName'] },
        { model: WorkPermitChecklist, as: 'checklists', include: [{ model: User, as: 'completedBy', attributes: ['id', 'username'] }] },
        { model: WorkPermitExtension, as: 'extensions', include: [{ model: User, as: 'requester', attributes: ['id', 'username'] }, { model: User, as: 'approver', attributes: ['id', 'username'] }] },
        { model: StopWorkAuthority, as: 'stopWorkEvents', attributes: ['id', 'code', 'reason', 'status', 'reported_at'] },
      ],
    });
    
    if (!permit) throw new NotFoundError('Work Permit not found');
    return permit;
  }

  async findAllPermits(filters = {}) {
    const { WorkPermit, User, Field, Well, Contractor } = getModels();
    const { page = 1, limit = 10, status, type, fieldId, wellId, search, startDate, endDate } = filters;
    
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (fieldId) where.field_id = fieldId;
    if (wellId) where.well_id = wellId;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (startDate) where.start_datetime = { [Op.gte]: startDate };
    if (endDate) where.end_datetime = { [Op.lte]: endDate };

    const { count, rows } = await WorkPermit.findAndCountAll({
      where,
      include: [
        { model: User, as: 'requester', attributes: ['id', 'username'] },
        { model: User, as: 'approver', attributes: ['id', 'username'] },
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: Well, as: 'well', attributes: ['id', 'code', 'name'] },
        { model: Contractor, as: 'contractor', attributes: ['id', 'companyName'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
  }

  async updatePermit(id, data, userId) {
    const { WorkPermit } = getModels();
    
    const permit = await WorkPermit.findByPk(id);
    if (!permit) throw new NotFoundError('Work Permit not found');
    if (!['DRAFT', 'PENDING'].includes(permit.status)) {
      throw new BadRequestError('Only DRAFT or PENDING permits can be edited');
    }
    
    await permit.update(data);
    return this.findPermitById(id);
  }

  async deletePermit(id) {
    const { WorkPermit, WorkPermitChecklist, WorkPermitExtension } = getModels();
    
    const permit = await WorkPermit.findByPk(id);
    if (!permit) throw new NotFoundError('Work Permit not found');
    if (permit.status !== 'DRAFT') throw new BadRequestError('Only DRAFT permits can be deleted');
    
    await WorkPermitChecklist.destroy({ where: { permit_id: id } });
    await WorkPermitExtension.destroy({ where: { permit_id: id } });
    await permit.destroy();
    
    return { success: true };
  }

  // ==================== Permit Workflow ====================
  async submitPermit(id, userId) {
    const { WorkPermit } = getModels();
    
    const permit = await WorkPermit.findByPk(id);
    if (!permit) throw new NotFoundError('Work Permit not found');
    if (permit.status !== 'DRAFT') throw new BadRequestError('Only DRAFT permits can be submitted');
    
    await permit.update({ status: 'PENDING' });
    return this.findPermitById(id);
  }

  async approvePermit(id, userId) {
    const { WorkPermit } = getModels();
    
    const permit = await WorkPermit.findByPk(id);
    if (!permit) throw new NotFoundError('Work Permit not found');
    if (permit.status !== 'PENDING') throw new BadRequestError('Only PENDING permits can be approved');
    
    await permit.update({
      status: 'APPROVED',
      approved_by: userId,
      approved_at: new Date(),
    });
    return this.findPermitById(id);
  }

  async rejectPermit(id, reason, userId) {
    const { WorkPermit } = getModels();
    
    const permit = await WorkPermit.findByPk(id);
    if (!permit) throw new NotFoundError('Work Permit not found');
    if (permit.status !== 'PENDING') throw new BadRequestError('Only PENDING permits can be rejected');
    
    await permit.update({
      status: 'DRAFT',
      rejection_reason: reason,
    });
    return this.findPermitById(id);
  }

  async activatePermit(id, userId) {
    const { WorkPermit, WorkPermitChecklist } = getModels();
    
    const permit = await WorkPermit.findByPk(id, {
      include: [{ model: WorkPermitChecklist, as: 'checklists' }],
    });
    if (!permit) throw new NotFoundError('Work Permit not found');
    if (permit.status !== 'APPROVED') throw new BadRequestError('Only APPROVED permits can be activated');
    
    // Check pre-work checklist
    const preWorkChecklist = permit.checklists.find(c => c.checklist_type === 'PRE_WORK');
    if (preWorkChecklist && !preWorkChecklist.all_passed) {
      throw new BadRequestError('Pre-work checklist must be completed before activation');
    }
    
    await permit.update({ status: 'ACTIVE' });
    return this.findPermitById(id);
  }

  async closePermit(id, notes, userId) {
    const { WorkPermit, WorkPermitChecklist } = getModels();
    
    const permit = await WorkPermit.findByPk(id, {
      include: [{ model: WorkPermitChecklist, as: 'checklists' }],
    });
    if (!permit) throw new NotFoundError('Work Permit not found');
    if (permit.status !== 'ACTIVE') throw new BadRequestError('Only ACTIVE permits can be closed');
    
    // Check post-work checklist
    const postWorkChecklist = permit.checklists.find(c => c.checklist_type === 'POST_WORK');
    if (postWorkChecklist && !postWorkChecklist.all_passed) {
      throw new BadRequestError('Post-work checklist must be completed before closing');
    }
    
    await permit.update({
      status: 'CLOSED',
      closed_by: userId,
      closed_at: new Date(),
      closure_notes: notes,
    });
    return this.findPermitById(id);
  }

  async cancelPermit(id, reason, userId) {
    const { WorkPermit } = getModels();
    
    const permit = await WorkPermit.findByPk(id);
    if (!permit) throw new NotFoundError('Work Permit not found');
    if (['CLOSED', 'CANCELLED'].includes(permit.status)) {
      throw new BadRequestError('Permit is already closed or cancelled');
    }
    
    await permit.update({
      status: 'CANCELLED',
      closure_notes: reason,
      closed_by: userId,
      closed_at: new Date(),
    });
    return this.findPermitById(id);
  }

  // ==================== Checklists ====================
  async updateChecklist(checklistId, items, userId) {
    const { WorkPermitChecklist } = getModels();
    
    const checklist = await WorkPermitChecklist.findByPk(checklistId);
    if (!checklist) throw new NotFoundError('Checklist not found');
    
    const allPassed = items.every(item => item.checked === true);
    
    await checklist.update({
      items,
      all_passed: allPassed,
      completed_by: allPassed ? userId : null,
      completed_at: allPassed ? new Date() : null,
    });
    
    return checklist;
  }

  // ==================== Extensions ====================
  async requestExtension(permitId, data, userId) {
    const { WorkPermit, WorkPermitExtension } = getModels();
    
    const permit = await WorkPermit.findByPk(permitId);
    if (!permit) throw new NotFoundError('Work Permit not found');
    if (!['APPROVED', 'ACTIVE'].includes(permit.status)) {
      throw new BadRequestError('Extensions can only be requested for APPROVED or ACTIVE permits');
    }
    
    const extension = await WorkPermitExtension.create({
      permit_id: permitId,
      original_end: permit.end_datetime,
      new_end: data.new_end,
      reason: data.reason,
      requested_by: userId,
      status: 'PENDING',
    });
    
    return extension;
  }

  async approveExtension(extensionId, userId) {
    const { WorkPermitExtension, WorkPermit } = getModels();
    
    const extension = await WorkPermitExtension.findByPk(extensionId);
    if (!extension) throw new NotFoundError('Extension not found');
    if (extension.status !== 'PENDING') throw new BadRequestError('Extension is not pending');
    
    await extension.update({
      status: 'APPROVED',
      approved_by: userId,
      approved_at: new Date(),
    });
    
    // Update permit end date
    const permit = await WorkPermit.findByPk(extension.permit_id);
    await permit.update({ end_datetime: extension.new_end });
    
    return extension;
  }

  async rejectExtension(extensionId, reason, userId) {
    const { WorkPermitExtension } = getModels();
    
    const extension = await WorkPermitExtension.findByPk(extensionId);
    if (!extension) throw new NotFoundError('Extension not found');
    if (extension.status !== 'PENDING') throw new BadRequestError('Extension is not pending');
    
    await extension.update({
      status: 'REJECTED',
      approved_by: userId,
      approved_at: new Date(),
      rejection_reason: reason,
    });
    
    return extension;
  }

  // ==================== Stop Work Authority ====================
  async createStopWork(data, userId) {
    const { StopWorkAuthority, WorkPermit } = getModels();
    
    const code = await this.generateSWACode();
    
    const swa = await StopWorkAuthority.create({
      ...data,
      code,
      status: 'OPEN',
      reported_by: userId,
      reported_at: new Date(),
    });

    // If linked to a permit, suspend it
    if (data.permit_id) {
      const permit = await WorkPermit.findByPk(data.permit_id);
      if (permit && permit.status === 'ACTIVE') {
        await permit.update({ status: 'SUSPENDED' });
      }
    }

    return this.findStopWorkById(swa.id);
  }

  async findStopWorkById(id) {
    const { StopWorkAuthority, WorkPermit, Field, Well, User } = getModels();
    
    const swa = await StopWorkAuthority.findByPk(id, {
      include: [
        { model: WorkPermit, as: 'permit', attributes: ['id', 'code', 'title', 'status'] },
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: Well, as: 'well', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'reporter', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'resolver', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'workResumer', attributes: ['id', 'username', 'email'] },
      ],
    });
    
    if (!swa) throw new NotFoundError('Stop Work Authority not found');
    return swa;
  }

  async findAllStopWork(filters = {}) {
    const { StopWorkAuthority, WorkPermit, Field, User } = getModels();
    const { page = 1, limit = 10, status, reason, severity, search } = filters;
    
    const where = {};
    if (status) where.status = status;
    if (reason) where.reason = reason;
    if (severity) where.severity = severity;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await StopWorkAuthority.findAndCountAll({
      where,
      include: [
        { model: WorkPermit, as: 'permit', attributes: ['id', 'code', 'title'] },
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'reporter', attributes: ['id', 'username'] },
      ],
      order: [['reported_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
  }

  async resolveStopWork(id, data, userId) {
    const { StopWorkAuthority } = getModels();
    
    const swa = await StopWorkAuthority.findByPk(id);
    if (!swa) throw new NotFoundError('Stop Work Authority not found');
    if (swa.status === 'CLOSED') throw new BadRequestError('SWA is already closed');
    
    await swa.update({
      status: 'RESOLVED',
      resolved_by: userId,
      resolved_at: new Date(),
      resolution_notes: data.resolution_notes,
      corrective_actions: data.corrective_actions || [],
      lessons_learned: data.lessons_learned,
    });
    
    return this.findStopWorkById(id);
  }

  async resumeWork(id, userId) {
    const { StopWorkAuthority, WorkPermit } = getModels();
    
    const swa = await StopWorkAuthority.findByPk(id);
    if (!swa) throw new NotFoundError('Stop Work Authority not found');
    if (swa.status !== 'RESOLVED') throw new BadRequestError('SWA must be resolved before resuming work');
    
    await swa.update({
      status: 'CLOSED',
      work_resumed_at: new Date(),
      work_resumed_by: userId,
    });

    // If linked to a permit, reactivate it
    if (swa.permit_id) {
      const permit = await WorkPermit.findByPk(swa.permit_id);
      if (permit && permit.status === 'SUSPENDED') {
        await permit.update({ status: 'ACTIVE' });
      }
    }
    
    return this.findStopWorkById(id);
  }

  // ==================== Dashboard ====================
  async getDashboard() {
    const { WorkPermit, StopWorkAuthority, sequelize } = getModels();
    
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Permit stats
    const permitsByStatus = await WorkPermit.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    const activePermits = await WorkPermit.count({ where: { status: 'ACTIVE' } });
    const pendingApproval = await WorkPermit.count({ where: { status: 'PENDING' } });
    const expiredPermits = await WorkPermit.count({
      where: { status: 'ACTIVE', end_datetime: { [Op.lt]: new Date() } },
    });

    const permitsByType = await WorkPermit.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['type'],
      raw: true,
    });

    // Stop Work stats
    const openStopWork = await StopWorkAuthority.count({ where: { status: { [Op.in]: ['OPEN', 'INVESTIGATING'] } } });
    const stopWorkByReason = await StopWorkAuthority.findAll({
      attributes: ['reason', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['reason'],
      raw: true,
    });

    // Recent items
    const recentPermits = await WorkPermit.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'code', 'title', 'type', 'status', 'start_datetime', 'end_datetime'],
    });

    const recentStopWork = await StopWorkAuthority.findAll({
      order: [['reported_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'code', 'reason', 'severity', 'status', 'reported_at'],
    });

    return {
      permits: {
        byStatus: permitsByStatus,
        byType: permitsByType,
        active: activePermits,
        pendingApproval,
        expired: expiredPermits,
      },
      stopWork: {
        open: openStopWork,
        byReason: stopWorkByReason,
      },
      recentPermits,
      recentStopWork,
    };
  }

  // ==================== Active Permits Board ====================
  async getActivePermitsBoard() {
    const { WorkPermit, User, Field, Well } = getModels();
    
    const activePermits = await WorkPermit.findAll({
      where: { status: { [Op.in]: ['APPROVED', 'ACTIVE'] } },
      include: [
        { model: User, as: 'requester', attributes: ['id', 'username'] },
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: Well, as: 'well', attributes: ['id', 'code', 'name'] },
      ],
      order: [['start_datetime', 'ASC']],
    });

    // Group by location/field
    const byField = {};
    for (const permit of activePermits) {
      const fieldKey = permit.field?.name || 'Sin Campo';
      if (!byField[fieldKey]) byField[fieldKey] = [];
      byField[fieldKey].push(permit);
    }

    return {
      total: activePermits.length,
      byField,
      permits: activePermits,
    };
  }
}

module.exports = new PTWService();
