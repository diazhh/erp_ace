const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');
const { Op } = require('sequelize');

/**
 * Generar código de valuación
 */
async function generateValuationCode(projectCode, valuationNumber) {
  return `VAL-${projectCode}-${String(valuationNumber).padStart(3, '0')}`;
}

/**
 * Controlador de Valuaciones de Proyecto
 */
const valuationController = {
  /**
   * Crear valuación
   */
  async create(req, res, next) {
    const { sequelize } = require('../../../database');
    const t = await sequelize.transaction();
    
    try {
      const { Project, Contractor, ProjectValuation } = require('../../../database/models');
      
      const project = await Project.findByPk(req.params.id, {
        include: [{ model: Contractor, as: 'contractor' }],
      });
      
      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }
      
      if (project.executionType !== 'OUTSOURCED') {
        throw new BadRequestError('Las valuaciones solo aplican a proyectos contratados');
      }
      
      if (!project.contractorId) {
        throw new BadRequestError('El proyecto no tiene contratista asignado');
      }
      
      // Obtener última valuación para calcular acumulados
      const lastValuation = await ProjectValuation.findOne({
        where: { projectId: project.id },
        order: [['valuation_number', 'DESC']],
      });
      
      const valuationNumber = lastValuation ? lastValuation.valuationNumber + 1 : 1;
      const previousAccumulatedAmount = lastValuation ? parseFloat(lastValuation.totalAccumulatedAmount) : 0;
      const previousAccumulatedPercent = lastValuation ? parseFloat(lastValuation.totalAccumulatedPercent) : 0;
      
      const {
        periodStart,
        periodEnd,
        currentPercent,
        description,
        inspectionNotes,
        notes,
      } = req.body;
      
      // Validar que el porcentaje no exceda 100%
      const totalPercent = previousAccumulatedPercent + parseFloat(currentPercent);
      if (totalPercent > 100) {
        throw new BadRequestError(`El porcentaje total no puede exceder 100%. Acumulado anterior: ${previousAccumulatedPercent}%`);
      }
      
      // Calcular montos
      const contractAmount = parseFloat(project.contractAmount) || 0;
      const currentAmount = (contractAmount * parseFloat(currentPercent)) / 100;
      const totalAccumulatedAmount = previousAccumulatedAmount + currentAmount;
      
      const code = await generateValuationCode(project.code, valuationNumber);
      
      const valuation = await ProjectValuation.create({
        code,
        projectId: project.id,
        contractorId: project.contractorId,
        valuationNumber,
        periodStart,
        periodEnd,
        currency: project.currency || 'USD',
        previousAccumulatedAmount,
        previousAccumulatedPercent,
        currentAmount,
        currentPercent: parseFloat(currentPercent),
        totalAccumulatedAmount,
        totalAccumulatedPercent: totalPercent,
        description,
        inspectionNotes,
        status: 'DRAFT',
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      // Actualizar progreso del proyecto
      await project.update({ progress: Math.round(totalPercent) }, { transaction: t });
      
      await t.commit();
      
      return res.status(201).json({
        success: true,
        message: 'Valuación creada',
        data: valuation,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  },

  /**
   * Listar valuaciones de un proyecto
   */
  async list(req, res, next) {
    try {
      const { ProjectValuation, Contractor, ContractorInvoice, User } = require('../../../database/models');
      const { status, page = 1, limit = 20 } = req.query;
      
      const whereClause = { projectId: req.params.id };
      if (status) whereClause.status = status;
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await ProjectValuation.findAndCountAll({
        where: whereClause,
        include: [
          { model: Contractor, as: 'contractor', attributes: ['id', 'companyName', 'code'] },
          { model: ContractorInvoice, as: 'invoice', attributes: ['id', 'code', 'invoiceNumber', 'status'] },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['valuation_number', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      return res.json({
        success: true,
        data: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener valuación por ID
   */
  async getById(req, res, next) {
    try {
      const { ProjectValuation, Project, Contractor, ContractorInvoice, User } = require('../../../database/models');
      
      const valuation = await ProjectValuation.findByPk(req.params.valuationId, {
        include: [
          { 
            model: Project, 
            as: 'project', 
            attributes: ['id', 'code', 'name', 'contractAmount', 'currency'] 
          },
          { model: Contractor, as: 'contractor' },
          { model: ContractorInvoice, as: 'invoice' },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'submitter', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'reviewer', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName'] },
        ],
      });
      
      if (!valuation) {
        throw new NotFoundError('Valuación no encontrada');
      }
      
      return res.json({
        success: true,
        data: valuation,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Enviar valuación para revisión
   */
  async submit(req, res, next) {
    try {
      const { ProjectValuation } = require('../../../database/models');
      
      const valuation = await ProjectValuation.findByPk(req.params.valuationId);
      if (!valuation) {
        throw new NotFoundError('Valuación no encontrada');
      }
      
      if (valuation.status !== 'DRAFT') {
        throw new BadRequestError('Solo se pueden enviar valuaciones en borrador');
      }
      
      await valuation.update({
        status: 'SUBMITTED',
        submittedAt: new Date(),
        submittedBy: req.user.id,
      });
      
      return res.json({
        success: true,
        message: 'Valuación enviada para revisión',
        data: valuation,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Aprobar valuación
   */
  async approve(req, res, next) {
    try {
      const { ProjectValuation } = require('../../../database/models');
      
      const valuation = await ProjectValuation.findByPk(req.params.valuationId);
      if (!valuation) {
        throw new NotFoundError('Valuación no encontrada');
      }
      
      if (!['SUBMITTED', 'UNDER_REVIEW'].includes(valuation.status)) {
        throw new BadRequestError('Solo se pueden aprobar valuaciones enviadas o en revisión');
      }
      
      await valuation.update({
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: req.user.id,
      });
      
      return res.json({
        success: true,
        message: 'Valuación aprobada',
        data: valuation,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Rechazar valuación
   */
  async reject(req, res, next) {
    try {
      const { ProjectValuation } = require('../../../database/models');
      
      const valuation = await ProjectValuation.findByPk(req.params.valuationId);
      if (!valuation) {
        throw new NotFoundError('Valuación no encontrada');
      }
      
      if (!['SUBMITTED', 'UNDER_REVIEW'].includes(valuation.status)) {
        throw new BadRequestError('Solo se pueden rechazar valuaciones enviadas o en revisión');
      }
      
      const { reason } = req.body;
      if (!reason) {
        throw new BadRequestError('Debe proporcionar una razón de rechazo');
      }
      
      await valuation.update({
        status: 'REJECTED',
        rejectionReason: reason,
        reviewedAt: new Date(),
        reviewedBy: req.user.id,
      });
      
      return res.json({
        success: true,
        message: 'Valuación rechazada',
        data: valuation,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Generar factura desde valuación aprobada
   */
  async generateInvoice(req, res, next) {
    const { sequelize } = require('../../../database');
    const t = await sequelize.transaction();
    
    try {
      const { ProjectValuation, ContractorInvoice, Project } = require('../../../database/models');
      
      const valuation = await ProjectValuation.findByPk(req.params.valuationId, {
        include: [{ model: Project, as: 'project' }],
      });
      
      if (!valuation) {
        throw new NotFoundError('Valuación no encontrada');
      }
      
      if (valuation.status !== 'APPROVED') {
        throw new BadRequestError('Solo se pueden facturar valuaciones aprobadas');
      }
      
      if (valuation.invoiceId) {
        throw new BadRequestError('Esta valuación ya tiene una factura asociada');
      }
      
      const {
        invoiceNumber,
        controlNumber,
        invoiceDate,
        dueDate,
        taxRate = 16,
        retentionRate,
        ivaRetentionRate,
        description,
        fileUrl,
      } = req.body;
      
      if (!invoiceNumber || !invoiceDate) {
        throw new BadRequestError('Número de factura y fecha son requeridos');
      }
      
      // Calcular montos
      const subtotal = parseFloat(valuation.currentAmount);
      const taxAmount = (subtotal * parseFloat(taxRate)) / 100;
      const total = subtotal + taxAmount;
      
      let retentionAmount = 0;
      let ivaRetentionAmount = 0;
      
      if (retentionRate) {
        retentionAmount = (subtotal * parseFloat(retentionRate)) / 100;
      }
      if (ivaRetentionRate) {
        ivaRetentionAmount = (taxAmount * parseFloat(ivaRetentionRate)) / 100;
      }
      
      const netPayable = total - retentionAmount - ivaRetentionAmount;
      
      // Generar código de factura
      const lastInvoice = await ContractorInvoice.findOne({
        order: [['created_at', 'DESC']],
      });
      const invoiceCount = lastInvoice ? parseInt(lastInvoice.code.split('-').pop()) + 1 : 1;
      const invoiceCode = `INV-CTR-${String(invoiceCount).padStart(5, '0')}`;
      
      // Crear factura
      const invoice = await ContractorInvoice.create({
        code: invoiceCode,
        contractorId: valuation.contractorId,
        projectId: valuation.projectId,
        valuationId: valuation.id,
        invoiceNumber,
        controlNumber,
        invoiceDate,
        dueDate,
        currency: valuation.currency,
        subtotal,
        taxRate,
        taxAmount,
        retentionRate,
        retentionAmount,
        ivaRetentionRate,
        ivaRetentionAmount,
        total,
        netPayable,
        paidAmount: 0,
        pendingAmount: netPayable,
        description: description || `Factura por valuación ${valuation.code}`,
        fileUrl,
        status: 'PENDING',
        createdBy: req.user.id,
      }, { transaction: t });
      
      // Actualizar valuación
      await valuation.update({
        status: 'INVOICED',
        invoiceId: invoice.id,
      }, { transaction: t });
      
      await t.commit();
      
      return res.status(201).json({
        success: true,
        message: 'Factura generada exitosamente',
        data: invoice,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  },

  /**
   * Eliminar valuación (solo en borrador)
   */
  async delete(req, res, next) {
    try {
      const { ProjectValuation } = require('../../../database/models');
      
      const valuation = await ProjectValuation.findByPk(req.params.valuationId);
      if (!valuation) {
        throw new NotFoundError('Valuación no encontrada');
      }
      
      if (valuation.status !== 'DRAFT') {
        throw new BadRequestError('Solo se pueden eliminar valuaciones en borrador');
      }
      
      await valuation.destroy();
      
      return res.json({
        success: true,
        message: 'Valuación eliminada',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener estados de valuación
   */
  async getStatuses(req, res, next) {
    try {
      const statuses = [
        { code: 'DRAFT', name: 'Borrador', color: 'default' },
        { code: 'SUBMITTED', name: 'Enviada', color: 'info' },
        { code: 'UNDER_REVIEW', name: 'En Revisión', color: 'warning' },
        { code: 'APPROVED', name: 'Aprobada', color: 'success' },
        { code: 'REJECTED', name: 'Rechazada', color: 'error' },
        { code: 'INVOICED', name: 'Facturada', color: 'primary' },
        { code: 'PAID', name: 'Pagada', color: 'success' },
      ];
      
      return res.json({
        success: true,
        data: statuses,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = valuationController;
