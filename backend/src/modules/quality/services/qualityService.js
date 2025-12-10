const { Op } = require('sequelize');
const { sequelize } = require('../../../database');
const models = require('../../../database/models');

const {
  QualityPlan,
  QualityInspection,
  NonConformance,
  CorrectiveAction,
  QualityCertificate,
  Project,
  Employee,
  User,
} = models;

// ========== PLANES DE CALIDAD ==========

const getPlans = async (filters = {}) => {
  const where = {};
  
  if (filters.status) where.status = filters.status;
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filters.search}%` } },
      { code: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  const plans = await QualityPlan.findAll({
    where,
    include: [
      { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
      { model: Employee, as: 'qualityManager', attributes: ['id', 'firstName', 'lastName'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return plans;
};

const getPlanById = async (id) => {
  const plan = await QualityPlan.findByPk(id, {
    include: [
      { model: Project, as: 'project' },
      { model: Employee, as: 'qualityManager' },
      { model: User, as: 'approver', attributes: ['id', 'username'] },
      { 
        model: QualityInspection, 
        as: 'inspections',
        include: [{ model: Employee, as: 'inspector', attributes: ['id', 'firstName', 'lastName'] }],
      },
    ],
  });

  return plan;
};

const createPlan = async (data, userId) => {
  // Generar código único
  const lastPlan = await QualityPlan.findOne({
    order: [['code', 'DESC']],
    where: { code: { [Op.like]: 'QP-%' } },
  });
  
  let nextNumber = 1;
  if (lastPlan) {
    const match = lastPlan.code.match(/QP-(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }
  const code = `QP-${String(nextNumber).padStart(4, '0')}`;

  const plan = await QualityPlan.create({
    ...data,
    code,
    createdBy: userId,
  });

  return plan;
};

const updatePlan = async (id, data) => {
  const plan = await QualityPlan.findByPk(id);
  if (!plan) throw new Error('Plan de calidad no encontrado');

  await plan.update(data);
  return plan;
};

const approvePlan = async (id, userId) => {
  const plan = await QualityPlan.findByPk(id);
  if (!plan) throw new Error('Plan de calidad no encontrado');

  await plan.update({
    status: 'ACTIVE',
    approvedBy: userId,
    approvedAt: new Date(),
  });

  return plan;
};

const deletePlan = async (id) => {
  const plan = await QualityPlan.findByPk(id);
  if (!plan) throw new Error('Plan de calidad no encontrado');

  await plan.destroy();
  return { message: 'Plan de calidad eliminado correctamente' };
};

// ========== INSPECCIONES ==========

const getInspections = async (filters = {}) => {
  const where = {};
  
  if (filters.result) where.result = filters.result;
  if (filters.inspectionType) where.inspectionType = filters.inspectionType;
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.qualityPlanId) where.qualityPlanId = filters.qualityPlanId;
  if (filters.inspectorId) where.inspectorId = filters.inspectorId;
  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filters.search}%` } },
      { code: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  const inspections = await QualityInspection.findAll({
    where,
    include: [
      { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
      { model: QualityPlan, as: 'qualityPlan', attributes: ['id', 'code', 'title'] },
      { model: Employee, as: 'inspector', attributes: ['id', 'firstName', 'lastName'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return inspections;
};

const getInspectionById = async (id) => {
  const inspection = await QualityInspection.findByPk(id, {
    include: [
      { model: Project, as: 'project' },
      { model: QualityPlan, as: 'qualityPlan' },
      { model: Employee, as: 'inspector' },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
      { 
        model: NonConformance, 
        as: 'nonConformances',
        include: [
          { model: Employee, as: 'responsible', attributes: ['id', 'firstName', 'lastName'] },
        ],
      },
    ],
  });

  return inspection;
};

const createInspection = async (data, userId) => {
  // Generar código único
  const lastInsp = await QualityInspection.findOne({
    order: [['code', 'DESC']],
    where: { code: { [Op.like]: 'QI-%' } },
  });
  
  let nextNumber = 1;
  if (lastInsp) {
    const match = lastInsp.code.match(/QI-(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }
  const code = `QI-${String(nextNumber).padStart(4, '0')}`;

  const inspection = await QualityInspection.create({
    ...data,
    code,
    createdBy: userId,
  });

  return inspection;
};

const updateInspection = async (id, data) => {
  const inspection = await QualityInspection.findByPk(id);
  if (!inspection) throw new Error('Inspección no encontrada');

  await inspection.update(data);
  return inspection;
};

const deleteInspection = async (id) => {
  const inspection = await QualityInspection.findByPk(id);
  if (!inspection) throw new Error('Inspección no encontrada');

  await inspection.destroy();
  return { message: 'Inspección eliminada correctamente' };
};

// ========== NO CONFORMIDADES ==========

const getNonConformances = async (filters = {}) => {
  const where = {};
  
  if (filters.status) where.status = filters.status;
  if (filters.ncType) where.ncType = filters.ncType;
  if (filters.category) where.category = filters.category;
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.responsibleId) where.responsibleId = filters.responsibleId;
  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filters.search}%` } },
      { code: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  const ncs = await NonConformance.findAll({
    where,
    include: [
      { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
      { model: QualityInspection, as: 'inspection', attributes: ['id', 'code', 'title'] },
      { model: Employee, as: 'responsible', attributes: ['id', 'firstName', 'lastName'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return ncs;
};

const getNonConformanceById = async (id) => {
  const nc = await NonConformance.findByPk(id, {
    include: [
      { model: Project, as: 'project' },
      { model: QualityInspection, as: 'inspection' },
      { model: Employee, as: 'detectedBy' },
      { model: Employee, as: 'responsible' },
      { model: User, as: 'verifiedBy', attributes: ['id', 'username'] },
      { 
        model: CorrectiveAction, 
        as: 'correctiveActions',
        include: [
          { model: Employee, as: 'responsible', attributes: ['id', 'firstName', 'lastName'] },
        ],
      },
    ],
  });

  return nc;
};

const createNonConformance = async (data, userId) => {
  // Generar código único
  const lastNC = await NonConformance.findOne({
    order: [['code', 'DESC']],
    where: { code: { [Op.like]: 'NC-%' } },
  });
  
  let nextNumber = 1;
  if (lastNC) {
    const match = lastNC.code.match(/NC-(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }
  const code = `NC-${String(nextNumber).padStart(4, '0')}`;

  const nc = await NonConformance.create({
    ...data,
    code,
    createdBy: userId,
  });

  return nc;
};

const updateNonConformance = async (id, data) => {
  const nc = await NonConformance.findByPk(id);
  if (!nc) throw new Error('No conformidad no encontrada');

  await nc.update(data);
  return nc;
};

const closeNonConformance = async (id, userId, verificationNotes) => {
  const nc = await NonConformance.findByPk(id);
  if (!nc) throw new Error('No conformidad no encontrada');

  await nc.update({
    status: 'CLOSED',
    closedDate: new Date(),
    verifiedById: userId,
    verificationNotes,
  });

  return nc;
};

const deleteNonConformance = async (id) => {
  const nc = await NonConformance.findByPk(id);
  if (!nc) throw new Error('No conformidad no encontrada');

  await nc.destroy();
  return { message: 'No conformidad eliminada correctamente' };
};

// ========== ACCIONES CORRECTIVAS ==========

const getCorrectiveActions = async (filters = {}) => {
  const where = {};
  
  if (filters.status) where.status = filters.status;
  if (filters.actionType) where.actionType = filters.actionType;
  if (filters.nonConformanceId) where.nonConformanceId = filters.nonConformanceId;
  if (filters.responsibleId) where.responsibleId = filters.responsibleId;

  const actions = await CorrectiveAction.findAll({
    where,
    include: [
      { model: NonConformance, as: 'nonConformance', attributes: ['id', 'code', 'title'] },
      { model: Employee, as: 'responsible', attributes: ['id', 'firstName', 'lastName'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return actions;
};

const createCorrectiveAction = async (data, userId) => {
  // Generar código único
  const lastCA = await CorrectiveAction.findOne({
    order: [['code', 'DESC']],
    where: { code: { [Op.like]: 'CA-%' } },
  });
  
  let nextNumber = 1;
  if (lastCA) {
    const match = lastCA.code.match(/CA-(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }
  const code = `CA-${String(nextNumber).padStart(4, '0')}`;

  const action = await CorrectiveAction.create({
    ...data,
    code,
    createdBy: userId,
  });

  // Actualizar estado de la NC
  await NonConformance.update(
    { status: 'ACTION_PENDING' },
    { where: { id: data.nonConformanceId, status: { [Op.in]: ['OPEN', 'UNDER_ANALYSIS'] } } }
  );

  return action;
};

const updateCorrectiveAction = async (id, data) => {
  const action = await CorrectiveAction.findByPk(id);
  if (!action) throw new Error('Acción correctiva no encontrada');

  await action.update(data);
  return action;
};

const completeCorrectiveAction = async (id, results) => {
  const action = await CorrectiveAction.findByPk(id);
  if (!action) throw new Error('Acción correctiva no encontrada');

  await action.update({
    status: 'COMPLETED',
    completedDate: new Date(),
    results,
  });

  return action;
};

const verifyCorrectiveAction = async (id, userId, effectivenessNotes, isEffective) => {
  const action = await CorrectiveAction.findByPk(id);
  if (!action) throw new Error('Acción correctiva no encontrada');

  await action.update({
    status: 'VERIFIED',
    effectivenessVerified: isEffective,
    effectivenessNotes,
    verifiedById: userId,
    verifiedAt: new Date(),
  });

  return action;
};

const deleteCorrectiveAction = async (id) => {
  const action = await CorrectiveAction.findByPk(id);
  if (!action) throw new Error('Acción correctiva no encontrada');

  await action.destroy();
  return { message: 'Acción correctiva eliminada correctamente' };
};

// ========== CERTIFICADOS ==========

const getCertificates = async (filters = {}) => {
  const where = {};
  
  if (filters.status) where.status = filters.status;
  if (filters.certificateType) where.certificateType = filters.certificateType;
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filters.search}%` } },
      { code: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  const certificates = await QualityCertificate.findAll({
    where,
    include: [
      { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
      { model: QualityInspection, as: 'inspection', attributes: ['id', 'code', 'title'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return certificates;
};

const getCertificateById = async (id) => {
  const certificate = await QualityCertificate.findByPk(id, {
    include: [
      { model: Project, as: 'project' },
      { model: QualityInspection, as: 'inspection' },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
    ],
  });

  return certificate;
};

const createCertificate = async (data, userId) => {
  // Generar código único
  const lastCert = await QualityCertificate.findOne({
    order: [['code', 'DESC']],
    where: { code: { [Op.like]: 'QC-%' } },
  });
  
  let nextNumber = 1;
  if (lastCert) {
    const match = lastCert.code.match(/QC-(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }
  const code = `QC-${String(nextNumber).padStart(4, '0')}`;

  const certificate = await QualityCertificate.create({
    ...data,
    code,
    createdBy: userId,
  });

  return certificate;
};

const updateCertificate = async (id, data) => {
  const certificate = await QualityCertificate.findByPk(id);
  if (!certificate) throw new Error('Certificado no encontrado');

  await certificate.update(data);
  return certificate;
};

const issueCertificate = async (id) => {
  const certificate = await QualityCertificate.findByPk(id);
  if (!certificate) throw new Error('Certificado no encontrado');

  await certificate.update({
    status: 'ISSUED',
  });

  return certificate;
};

const deleteCertificate = async (id) => {
  const certificate = await QualityCertificate.findByPk(id);
  if (!certificate) throw new Error('Certificado no encontrado');

  await certificate.destroy();
  return { message: 'Certificado eliminado correctamente' };
};

// ========== ESTADÍSTICAS ==========

const getStats = async () => {
  const [
    totalPlans,
    activePlans,
    totalInspections,
    passedInspections,
    failedInspections,
    totalNCs,
    openNCs,
    totalCAs,
    pendingCAs,
    totalCertificates,
  ] = await Promise.all([
    QualityPlan.count(),
    QualityPlan.count({ where: { status: 'ACTIVE' } }),
    QualityInspection.count(),
    QualityInspection.count({ where: { result: 'PASS' } }),
    QualityInspection.count({ where: { result: 'FAIL' } }),
    NonConformance.count(),
    NonConformance.count({ where: { status: { [Op.notIn]: ['CLOSED', 'CANCELLED'] } } }),
    CorrectiveAction.count(),
    CorrectiveAction.count({ where: { status: { [Op.in]: ['PLANNED', 'IN_PROGRESS'] } } }),
    QualityCertificate.count(),
  ]);

  // NCs por tipo
  const ncsByType = await NonConformance.findAll({
    attributes: [
      'ncType',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['ncType'],
    raw: true,
  });

  // NCs por categoría
  const ncsByCategory = await NonConformance.findAll({
    attributes: [
      'category',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['category'],
    raw: true,
  });

  return {
    totalPlans,
    activePlans,
    totalInspections,
    passedInspections,
    failedInspections,
    inspectionPassRate: totalInspections > 0 ? ((passedInspections / totalInspections) * 100).toFixed(1) : 0,
    totalNCs,
    openNCs,
    totalCAs,
    pendingCAs,
    totalCertificates,
    ncsByType,
    ncsByCategory,
  };
};

module.exports = {
  // Planes
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  approvePlan,
  deletePlan,
  // Inspecciones
  getInspections,
  getInspectionById,
  createInspection,
  updateInspection,
  deleteInspection,
  // No Conformidades
  getNonConformances,
  getNonConformanceById,
  createNonConformance,
  updateNonConformance,
  closeNonConformance,
  deleteNonConformance,
  // Acciones Correctivas
  getCorrectiveActions,
  createCorrectiveAction,
  updateCorrectiveAction,
  completeCorrectiveAction,
  verifyCorrectiveAction,
  deleteCorrectiveAction,
  // Certificados
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  issueCertificate,
  deleteCertificate,
  // Estadísticas
  getStats,
};
