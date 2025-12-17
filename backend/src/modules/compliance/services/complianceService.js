const { Op } = require('sequelize');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

let models = null;
const getModels = () => {
  if (!models) {
    models = require('../../../database/models');
  }
  return models;
};

class ComplianceService {
  // ========== REGULATORY REPORTS ==========

  async generateReportCode(year = new Date().getFullYear()) {
    const { RegulatoryReport } = getModels();
    const lastReport = await RegulatoryReport.findOne({
      where: { code: { [Op.like]: `REP-${year}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastReport) {
      const parts = lastReport.code.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }
    return `REP-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  async createReport(data, userId) {
    const { RegulatoryReport } = getModels();
    const code = await this.generateReportCode();
    const report = await RegulatoryReport.create({
      ...data,
      code,
      status: 'DRAFT',
      created_by: userId,
    });
    return this.findReportById(report.id);
  }

  async findReportById(id) {
    const { RegulatoryReport, User, Field, Project } = getModels();
    const report = await RegulatoryReport.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'submitter', attributes: ['id', 'username', 'email'] },
        { model: Field, as: 'field', attributes: ['id', 'name', 'code'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
      ],
    });
    if (!report) throw new NotFoundError('Regulatory report not found');
    return report;
  }

  async findAllReports(filters = {}) {
    const { RegulatoryReport, User, Field, Project } = getModels();
    const { page = 1, limit = 10, status, type, entity, fieldId, projectId, search, dueDateFrom, dueDateTo } = filters;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (entity) where.entity = entity;
    if (fieldId) where.field_id = fieldId;
    if (projectId) where.project_id = projectId;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (dueDateFrom || dueDateTo) {
      where.due_date = {};
      if (dueDateFrom) where.due_date[Op.gte] = dueDateFrom;
      if (dueDateTo) where.due_date[Op.lte] = dueDateTo;
    }
    const { count, rows } = await RegulatoryReport.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: Field, as: 'field', attributes: ['id', 'name', 'code'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
      ],
      order: [['due_date', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    return { data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) } };
  }

  async updateReport(id, data, userId) {
    const { RegulatoryReport } = getModels();
    const report = await RegulatoryReport.findByPk(id);
    if (!report) throw new NotFoundError('Regulatory report not found');
    if (!['DRAFT', 'REVISION_REQUIRED'].includes(report.status)) {
      throw new BadRequestError('Only DRAFT or REVISION_REQUIRED reports can be edited');
    }
    await report.update(data);
    return this.findReportById(id);
  }

  async deleteReport(id) {
    const { RegulatoryReport } = getModels();
    const report = await RegulatoryReport.findByPk(id);
    if (!report) throw new NotFoundError('Regulatory report not found');
    if (report.status !== 'DRAFT') throw new BadRequestError('Only DRAFT reports can be deleted');
    await report.destroy();
    return { success: true };
  }

  async submitReport(id, userId) {
    const { RegulatoryReport } = getModels();
    const report = await RegulatoryReport.findByPk(id);
    if (!report) throw new NotFoundError('Regulatory report not found');
    if (!['DRAFT', 'REVISION_REQUIRED'].includes(report.status)) {
      throw new BadRequestError('Only DRAFT or REVISION_REQUIRED reports can be submitted');
    }
    await report.update({ status: 'PENDING', submitted_by: userId });
    return this.findReportById(id);
  }

  async markReportSubmitted(id, data, userId) {
    const { RegulatoryReport } = getModels();
    const report = await RegulatoryReport.findByPk(id);
    if (!report) throw new NotFoundError('Regulatory report not found');
    await report.update({
      status: 'SUBMITTED',
      submitted_date: data.submitted_date || new Date(),
      response_reference: data.response_reference,
      submitted_by: userId,
    });
    return this.findReportById(id);
  }

  async updateReportResponse(id, data) {
    const { RegulatoryReport } = getModels();
    const report = await RegulatoryReport.findByPk(id);
    if (!report) throw new NotFoundError('Regulatory report not found');
    await report.update({
      status: data.status,
      response_date: data.response_date,
      response_reference: data.response_reference,
      response_notes: data.response_notes,
    });
    return this.findReportById(id);
  }

  // ========== ENVIRONMENTAL PERMITS ==========

  async generatePermitCode(year = new Date().getFullYear()) {
    const { EnvironmentalPermit } = getModels();
    const lastPermit = await EnvironmentalPermit.findOne({
      where: { code: { [Op.like]: `PER-${year}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastPermit) {
      const parts = lastPermit.code.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }
    return `PER-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  async createPermit(data, userId) {
    const { EnvironmentalPermit } = getModels();
    const code = await this.generatePermitCode();
    const permit = await EnvironmentalPermit.create({
      ...data,
      code,
      created_by: userId,
    });
    return this.findPermitById(permit.id);
  }

  async findPermitById(id) {
    const { EnvironmentalPermit, User, Field, Project, Well } = getModels();
    const permit = await EnvironmentalPermit.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: Field, as: 'field', attributes: ['id', 'name', 'code'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
        { model: Well, as: 'well', attributes: ['id', 'name', 'code'] },
      ],
    });
    if (!permit) throw new NotFoundError('Environmental permit not found');
    return permit;
  }

  async findAllPermits(filters = {}) {
    const { EnvironmentalPermit, User, Field, Project, Well } = getModels();
    const { page = 1, limit = 10, status, type, fieldId, projectId, wellId, search, expiringDays } = filters;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (fieldId) where.field_id = fieldId;
    if (projectId) where.project_id = projectId;
    if (wellId) where.well_id = wellId;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { permit_number: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (expiringDays) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + parseInt(expiringDays));
      where.expiry_date = { [Op.lte]: futureDate, [Op.gte]: new Date() };
      where.status = 'ACTIVE';
    }
    const { count, rows } = await EnvironmentalPermit.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: Field, as: 'field', attributes: ['id', 'name', 'code'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: Well, as: 'well', attributes: ['id', 'name', 'code'] },
      ],
      order: [['expiry_date', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    return { data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) } };
  }

  async updatePermit(id, data, userId) {
    const { EnvironmentalPermit } = getModels();
    const permit = await EnvironmentalPermit.findByPk(id);
    if (!permit) throw new NotFoundError('Environmental permit not found');
    await permit.update(data);
    return this.findPermitById(id);
  }

  async deletePermit(id) {
    const { EnvironmentalPermit } = getModels();
    const permit = await EnvironmentalPermit.findByPk(id);
    if (!permit) throw new NotFoundError('Environmental permit not found');
    await permit.destroy();
    return { success: true };
  }

  // ========== COMPLIANCE AUDITS ==========

  async generateAuditCode(year = new Date().getFullYear()) {
    const { ComplianceAudit } = getModels();
    const lastAudit = await ComplianceAudit.findOne({
      where: { code: { [Op.like]: `AUD-${year}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastAudit) {
      const parts = lastAudit.code.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }
    return `AUD-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  async createAudit(data, userId) {
    const { ComplianceAudit } = getModels();
    const code = await this.generateAuditCode();
    const audit = await ComplianceAudit.create({
      ...data,
      code,
      status: 'PLANNED',
      created_by: userId,
    });
    return this.findAuditById(audit.id);
  }

  async findAuditById(id) {
    const { ComplianceAudit, User, Field, Project, Department, Employee } = getModels();
    const audit = await ComplianceAudit.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: Field, as: 'field', attributes: ['id', 'name', 'code'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: Employee, as: 'leadAuditor', attributes: ['id', 'firstName', 'lastName'] },
      ],
    });
    if (!audit) throw new NotFoundError('Compliance audit not found');
    return audit;
  }

  async findAllAudits(filters = {}) {
    const { ComplianceAudit, User, Field, Project, Department, Employee } = getModels();
    const { page = 1, limit = 10, status, type, fieldId, projectId, departmentId, search, startDateFrom, startDateTo } = filters;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (fieldId) where.field_id = fieldId;
    if (projectId) where.project_id = projectId;
    if (departmentId) where.department_id = departmentId;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (startDateFrom || startDateTo) {
      where.start_date = {};
      if (startDateFrom) where.start_date[Op.gte] = startDateFrom;
      if (startDateTo) where.start_date[Op.lte] = startDateTo;
    }
    const { count, rows } = await ComplianceAudit.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: Field, as: 'field', attributes: ['id', 'name', 'code'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: Employee, as: 'leadAuditor', attributes: ['id', 'firstName', 'lastName'] },
      ],
      order: [['start_date', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    return { data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) } };
  }

  async updateAudit(id, data, userId) {
    const { ComplianceAudit } = getModels();
    const audit = await ComplianceAudit.findByPk(id);
    if (!audit) throw new NotFoundError('Compliance audit not found');
    if (data.findings && Array.isArray(data.findings)) {
      data.findings_count = data.findings.length;
      data.major_findings = data.findings.filter(f => f.severity === 'MAJOR').length;
      data.minor_findings = data.findings.filter(f => f.severity === 'MINOR').length;
      data.observations = data.findings.filter(f => f.severity === 'OBSERVATION').length;
    }
    await audit.update(data);
    return this.findAuditById(id);
  }

  async deleteAudit(id) {
    const { ComplianceAudit } = getModels();
    const audit = await ComplianceAudit.findByPk(id);
    if (!audit) throw new NotFoundError('Compliance audit not found');
    if (!['PLANNED', 'CANCELLED'].includes(audit.status)) {
      throw new BadRequestError('Only PLANNED or CANCELLED audits can be deleted');
    }
    await audit.destroy();
    return { success: true };
  }

  async startAudit(id, userId) {
    const { ComplianceAudit } = getModels();
    const audit = await ComplianceAudit.findByPk(id);
    if (!audit) throw new NotFoundError('Compliance audit not found');
    if (audit.status !== 'PLANNED') throw new BadRequestError('Only PLANNED audits can be started');
    await audit.update({ status: 'IN_PROGRESS' });
    return this.findAuditById(id);
  }

  async completeAudit(id, data, userId) {
    const { ComplianceAudit } = getModels();
    const audit = await ComplianceAudit.findByPk(id);
    if (!audit) throw new NotFoundError('Compliance audit not found');
    if (audit.status !== 'IN_PROGRESS') throw new BadRequestError('Only IN_PROGRESS audits can be completed');
    const updateData = {
      status: 'COMPLETED',
      end_date: data.end_date || new Date(),
      conclusion: data.conclusion,
      recommendations: data.recommendations,
      follow_up_date: data.follow_up_date,
      follow_up_status: data.follow_up_date ? 'PENDING' : 'NOT_REQUIRED',
    };
    if (data.findings) {
      updateData.findings = data.findings;
      updateData.findings_count = data.findings.length;
      updateData.major_findings = data.findings.filter(f => f.severity === 'MAJOR').length;
      updateData.minor_findings = data.findings.filter(f => f.severity === 'MINOR').length;
      updateData.observations = data.findings.filter(f => f.severity === 'OBSERVATION').length;
    }
    await audit.update(updateData);
    return this.findAuditById(id);
  }

  async closeAudit(id, userId) {
    const { ComplianceAudit } = getModels();
    const audit = await ComplianceAudit.findByPk(id);
    if (!audit) throw new NotFoundError('Compliance audit not found');
    if (audit.status !== 'COMPLETED') throw new BadRequestError('Only COMPLETED audits can be closed');
    await audit.update({ status: 'CLOSED', follow_up_status: 'COMPLETED' });
    return this.findAuditById(id);
  }

  // ========== POLICIES ==========

  async generatePolicyCode(category) {
    const { Policy } = getModels();
    const prefix = category ? category.substring(0, 3).toUpperCase() : 'POL';
    const lastPolicy = await Policy.findOne({
      where: { code: { [Op.like]: `${prefix}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastPolicy) {
      const parts = lastPolicy.code.split('-');
      nextNumber = parseInt(parts[1], 10) + 1;
    }
    return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
  }

  async createPolicy(data, userId) {
    const { Policy } = getModels();
    const code = await this.generatePolicyCode(data.category);
    const policy = await Policy.create({
      ...data,
      code,
      status: 'DRAFT',
      created_by: userId,
    });
    return this.findPolicyById(policy.id);
  }

  async findPolicyById(id) {
    const { Policy, User, Department, Employee } = getModels();
    const policy = await Policy.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'approver', attributes: ['id', 'username', 'email'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: Employee, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
        { model: Policy, as: 'supersedes', attributes: ['id', 'code', 'title', 'version'] },
      ],
    });
    if (!policy) throw new NotFoundError('Policy not found');
    return policy;
  }

  async findAllPolicies(filters = {}) {
    const { Policy, User, Department, Employee } = getModels();
    const { page = 1, limit = 10, status, category, departmentId, search } = filters;
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (departmentId) where.department_id = departmentId;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { keywords: { [Op.overlap]: [search] } },
      ];
    }
    const { count, rows } = await Policy.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: Employee, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
      ],
      order: [['effective_date', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    return { data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) } };
  }

  async updatePolicy(id, data, userId) {
    const { Policy } = getModels();
    const policy = await Policy.findByPk(id);
    if (!policy) throw new NotFoundError('Policy not found');
    if (!['DRAFT', 'UNDER_REVIEW'].includes(policy.status)) {
      throw new BadRequestError('Only DRAFT or UNDER_REVIEW policies can be edited');
    }
    await policy.update(data);
    return this.findPolicyById(id);
  }

  async deletePolicy(id) {
    const { Policy } = getModels();
    const policy = await Policy.findByPk(id);
    if (!policy) throw new NotFoundError('Policy not found');
    if (policy.status !== 'DRAFT') throw new BadRequestError('Only DRAFT policies can be deleted');
    await policy.destroy();
    return { success: true };
  }

  async submitPolicyForReview(id, userId) {
    const { Policy } = getModels();
    const policy = await Policy.findByPk(id);
    if (!policy) throw new NotFoundError('Policy not found');
    if (policy.status !== 'DRAFT') throw new BadRequestError('Only DRAFT policies can be submitted for review');
    await policy.update({ status: 'UNDER_REVIEW' });
    return this.findPolicyById(id);
  }

  async approvePolicy(id, userId) {
    const { Policy } = getModels();
    const policy = await Policy.findByPk(id);
    if (!policy) throw new NotFoundError('Policy not found');
    if (policy.status !== 'UNDER_REVIEW') throw new BadRequestError('Only UNDER_REVIEW policies can be approved');
    await policy.update({ status: 'ACTIVE', approved_by: userId, approved_date: new Date() });
    return this.findPolicyById(id);
  }

  async supersededPolicy(id, newPolicyId, userId) {
    const { Policy } = getModels();
    const policy = await Policy.findByPk(id);
    if (!policy) throw new NotFoundError('Policy not found');
    await policy.update({ status: 'SUPERSEDED' });
    if (newPolicyId) {
      const newPolicy = await Policy.findByPk(newPolicyId);
      if (newPolicy) await newPolicy.update({ supersedes_id: id });
    }
    return this.findPolicyById(id);
  }

  // ========== CERTIFICATIONS ==========

  async generateCertificationCode(type) {
    const { Certification } = getModels();
    const prefix = type ? type.replace('_', '').substring(0, 3).toUpperCase() : 'CER';
    const lastCert = await Certification.findOne({
      where: { code: { [Op.like]: `${prefix}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastCert) {
      const parts = lastCert.code.split('-');
      nextNumber = parseInt(parts[1], 10) + 1;
    }
    return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
  }

  async createCertification(data, userId) {
    const { Certification } = getModels();
    const code = await this.generateCertificationCode(data.type);
    const certification = await Certification.create({
      ...data,
      code,
      created_by: userId,
    });
    return this.findCertificationById(certification.id);
  }

  async findCertificationById(id) {
    const { Certification, User, Department, Employee } = getModels();
    const certification = await Certification.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: Employee, as: 'responsible', attributes: ['id', 'firstName', 'lastName'] },
      ],
    });
    if (!certification) throw new NotFoundError('Certification not found');
    return certification;
  }

  async findAllCertifications(filters = {}) {
    const { Certification, User, Department, Employee } = getModels();
    const { page = 1, limit = 10, status, type, departmentId, search, expiringDays } = filters;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (departmentId) where.department_id = departmentId;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { certificate_number: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (expiringDays) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + parseInt(expiringDays));
      where.expiry_date = { [Op.lte]: futureDate, [Op.gte]: new Date() };
      where.status = 'ACTIVE';
    }
    const { count, rows } = await Certification.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: Employee, as: 'responsible', attributes: ['id', 'firstName', 'lastName'] },
      ],
      order: [['expiry_date', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    return { data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) } };
  }

  async updateCertification(id, data, userId) {
    const { Certification } = getModels();
    const certification = await Certification.findByPk(id);
    if (!certification) throw new NotFoundError('Certification not found');
    await certification.update(data);
    return this.findCertificationById(id);
  }

  async deleteCertification(id) {
    const { Certification } = getModels();
    const certification = await Certification.findByPk(id);
    if (!certification) throw new NotFoundError('Certification not found');
    await certification.destroy();
    return { success: true };
  }

  // ========== DASHBOARD ==========

  async getDashboard() {
    const { RegulatoryReport, EnvironmentalPermit, ComplianceAudit, Policy, Certification, sequelize } = getModels();
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(today.getDate() + 60);
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);

    // Reports due soon
    const reportsDueSoon = await RegulatoryReport.count({
      where: { due_date: { [Op.lte]: thirtyDaysFromNow, [Op.gte]: today }, status: { [Op.in]: ['DRAFT', 'PENDING'] } },
    });
    const reportsOverdue = await RegulatoryReport.count({
      where: { due_date: { [Op.lt]: today }, status: { [Op.in]: ['DRAFT', 'PENDING'] } },
    });
    const reportsByStatus = await RegulatoryReport.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    // Permits expiring
    const permitsExpiring30 = await EnvironmentalPermit.count({
      where: { expiry_date: { [Op.lte]: thirtyDaysFromNow, [Op.gte]: today }, status: 'ACTIVE' },
    });
    const permitsExpiring60 = await EnvironmentalPermit.count({
      where: { expiry_date: { [Op.lte]: sixtyDaysFromNow, [Op.gt]: thirtyDaysFromNow }, status: 'ACTIVE' },
    });
    const permitsExpiring90 = await EnvironmentalPermit.count({
      where: { expiry_date: { [Op.lte]: ninetyDaysFromNow, [Op.gt]: sixtyDaysFromNow }, status: 'ACTIVE' },
    });
    const permitsExpired = await EnvironmentalPermit.count({
      where: { expiry_date: { [Op.lt]: today }, status: 'ACTIVE' },
    });
    const permitsByStatus = await EnvironmentalPermit.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    // Audits
    const auditsPlanned = await ComplianceAudit.count({ where: { status: 'PLANNED' } });
    const auditsInProgress = await ComplianceAudit.count({ where: { status: 'IN_PROGRESS' } });
    const auditsPendingFollowUp = await ComplianceAudit.count({
      where: { follow_up_status: 'PENDING', follow_up_date: { [Op.lte]: thirtyDaysFromNow } },
    });
    const auditsByType = await ComplianceAudit.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['type'],
      raw: true,
    });

    // Policies
    const policiesActive = await Policy.count({ where: { status: 'ACTIVE' } });
    const policiesUnderReview = await Policy.count({ where: { status: 'UNDER_REVIEW' } });
    const policiesNeedingReview = await Policy.count({
      where: { next_review_date: { [Op.lte]: thirtyDaysFromNow, [Op.gte]: today }, status: 'ACTIVE' },
    });

    // Certifications
    const certificationsActive = await Certification.count({ where: { status: 'ACTIVE' } });
    const certificationsExpiring30 = await Certification.count({
      where: { expiry_date: { [Op.lte]: thirtyDaysFromNow, [Op.gte]: today }, status: 'ACTIVE' },
    });
    const certificationsExpiring90 = await Certification.count({
      where: { expiry_date: { [Op.lte]: ninetyDaysFromNow, [Op.gte]: today }, status: 'ACTIVE' },
    });
    const certificationsByType = await Certification.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['type'],
      raw: true,
    });

    // Recent items
    const recentReports = await RegulatoryReport.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'code', 'title', 'status', 'due_date', 'entity'],
    });
    const recentAudits = await ComplianceAudit.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'code', 'title', 'status', 'type', 'start_date'],
    });

    return {
      reports: { dueSoon: reportsDueSoon, overdue: reportsOverdue, byStatus: reportsByStatus, recent: recentReports },
      permits: { expiring30: permitsExpiring30, expiring60: permitsExpiring60, expiring90: permitsExpiring90, expired: permitsExpired, byStatus: permitsByStatus },
      audits: { planned: auditsPlanned, inProgress: auditsInProgress, pendingFollowUp: auditsPendingFollowUp, byType: auditsByType, recent: recentAudits },
      policies: { active: policiesActive, underReview: policiesUnderReview, needingReview: policiesNeedingReview },
      certifications: { active: certificationsActive, expiring30: certificationsExpiring30, expiring90: certificationsExpiring90, byType: certificationsByType },
    };
  }

  // ========== ALERTS ==========

  async getAlerts() {
    const { RegulatoryReport, EnvironmentalPermit, ComplianceAudit, Policy, Certification } = getModels();
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const alerts = [];

    // Overdue reports
    const overdueReports = await RegulatoryReport.findAll({
      where: { due_date: { [Op.lt]: today }, status: { [Op.in]: ['DRAFT', 'PENDING'] } },
      attributes: ['id', 'code', 'title', 'due_date'],
      limit: 10,
    });
    overdueReports.forEach(r => alerts.push({ type: 'REPORT_OVERDUE', severity: 'HIGH', entity: 'RegulatoryReport', id: r.id, code: r.code, title: r.title, date: r.due_date }));

    // Reports due soon
    const reportsDueSoon = await RegulatoryReport.findAll({
      where: { due_date: { [Op.lte]: thirtyDaysFromNow, [Op.gte]: today }, status: { [Op.in]: ['DRAFT', 'PENDING'] } },
      attributes: ['id', 'code', 'title', 'due_date'],
      limit: 10,
    });
    reportsDueSoon.forEach(r => alerts.push({ type: 'REPORT_DUE_SOON', severity: 'MEDIUM', entity: 'RegulatoryReport', id: r.id, code: r.code, title: r.title, date: r.due_date }));

    // Expired permits
    const expiredPermits = await EnvironmentalPermit.findAll({
      where: { expiry_date: { [Op.lt]: today }, status: 'ACTIVE' },
      attributes: ['id', 'code', 'name', 'expiry_date'],
      limit: 10,
    });
    expiredPermits.forEach(p => alerts.push({ type: 'PERMIT_EXPIRED', severity: 'HIGH', entity: 'EnvironmentalPermit', id: p.id, code: p.code, title: p.name, date: p.expiry_date }));

    // Permits expiring soon
    const permitsExpiringSoon = await EnvironmentalPermit.findAll({
      where: { expiry_date: { [Op.lte]: thirtyDaysFromNow, [Op.gte]: today }, status: 'ACTIVE' },
      attributes: ['id', 'code', 'name', 'expiry_date'],
      limit: 10,
    });
    permitsExpiringSoon.forEach(p => alerts.push({ type: 'PERMIT_EXPIRING_SOON', severity: 'MEDIUM', entity: 'EnvironmentalPermit', id: p.id, code: p.code, title: p.name, date: p.expiry_date }));

    // Audits pending follow-up
    const auditsPendingFollowUp = await ComplianceAudit.findAll({
      where: { follow_up_status: 'PENDING', follow_up_date: { [Op.lte]: thirtyDaysFromNow } },
      attributes: ['id', 'code', 'title', 'follow_up_date'],
      limit: 10,
    });
    auditsPendingFollowUp.forEach(a => alerts.push({ type: 'AUDIT_FOLLOW_UP_DUE', severity: 'MEDIUM', entity: 'ComplianceAudit', id: a.id, code: a.code, title: a.title, date: a.follow_up_date }));

    // Policies needing review
    const policiesNeedingReview = await Policy.findAll({
      where: { next_review_date: { [Op.lte]: thirtyDaysFromNow, [Op.gte]: today }, status: 'ACTIVE' },
      attributes: ['id', 'code', 'title', 'next_review_date'],
      limit: 10,
    });
    policiesNeedingReview.forEach(p => alerts.push({ type: 'POLICY_REVIEW_DUE', severity: 'LOW', entity: 'Policy', id: p.id, code: p.code, title: p.title, date: p.next_review_date }));

    // Certifications expiring soon
    const certificationsExpiringSoon = await Certification.findAll({
      where: { expiry_date: { [Op.lte]: thirtyDaysFromNow, [Op.gte]: today }, status: 'ACTIVE' },
      attributes: ['id', 'code', 'name', 'expiry_date'],
      limit: 10,
    });
    certificationsExpiringSoon.forEach(c => alerts.push({ type: 'CERTIFICATION_EXPIRING_SOON', severity: 'MEDIUM', entity: 'Certification', id: c.id, code: c.code, title: c.name, date: c.expiry_date }));

    return alerts.sort((a, b) => {
      const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }
}

module.exports = new ComplianceService();
