const { Op } = require('sequelize');
const { sequelize } = require('../../../database');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

/**
 * Generar códigos únicos
 */
async function generateQuoteCode() {
  const { Quote } = require('../../../database/models');
  const year = new Date().getFullYear();
  
  const lastQuote = await Quote.findOne({
    where: { code: { [Op.like]: `COT-${year}-%` } },
    order: [['createdAt', 'DESC']],
  });
  
  let nextNumber = 1;
  if (lastQuote && lastQuote.code) {
    const match = lastQuote.code.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  
  return `COT-${year}-${String(nextNumber).padStart(4, '0')}`;
}

async function generateQuoteRequestCode() {
  const { QuoteRequest } = require('../../../database/models');
  const year = new Date().getFullYear();
  
  const lastRequest = await QuoteRequest.findOne({
    where: { code: { [Op.like]: `SOL-${year}-%` } },
    order: [['createdAt', 'DESC']],
  });
  
  let nextNumber = 1;
  if (lastRequest && lastRequest.code) {
    const match = lastRequest.code.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  
  return `SOL-${year}-${String(nextNumber).padStart(4, '0')}`;
}

class ProcurementController {
  // ==================== QUOTES ====================

  /**
   * Listar cotizaciones
   */
  async listQuotes(req, res, next) {
    try {
      const { Quote, Contractor, Project, User } = require('../../../database/models');
      const { contractorId, projectId, quoteType, status, startDate, endDate, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (contractorId) whereClause.contractorId = contractorId;
      if (projectId) whereClause.projectId = projectId;
      if (quoteType) whereClause.quoteType = quoteType;
      if (status) whereClause.status = status;
      if (startDate && endDate) {
        whereClause.quoteDate = { [Op.between]: [startDate, endDate] };
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await Quote.findAndCountAll({
        where: whereClause,
        include: [
          { model: Contractor, as: 'contractor', attributes: ['id', 'code', 'companyName'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
        ],
        order: [['quoteDate', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      return res.json({
        success: true,
        data: rows,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear cotización
   */
  async createQuote(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Contractor, Quote, QuoteItem } = require('../../../database/models');
      
      const contractor = await Contractor.findByPk(req.body.contractorId);
      if (!contractor) throw new NotFoundError('Contratista no encontrado');
      
      const code = await generateQuoteCode();
      const {
        contractorId, projectId, quoteRequestId, quoteType, title, description,
        quoteDate, validUntil, deliveryTime, currency, subtotal, taxRate, taxAmount, discount, total,
        paymentTerms, deliveryTerms, warranty, fileUrl, notes, items,
      } = req.body;
      
      const quote = await Quote.create({
        code, contractorId, projectId, quoteRequestId, quoteType: quoteType || 'SERVICE',
        title, description, quoteDate, validUntil, deliveryTime,
        currency: currency || 'USD', subtotal, taxRate: taxRate || 16, taxAmount, discount: discount || 0, total,
        paymentTerms, deliveryTerms, warranty, fileUrl,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      // Crear items
      if (items && items.length > 0) {
        const itemsData = items.map((item, index) => ({
          quoteId: quote.id,
          itemNumber: index + 1,
          description: item.description,
          unit: item.unit || 'UND',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
          inventoryItemId: item.inventoryItemId,
          notes: item.notes,
        }));
        await QuoteItem.bulkCreate(itemsData, { transaction: t });
      }
      
      // Actualizar contador en QuoteRequest si existe
      if (quoteRequestId) {
        const { QuoteRequest } = require('../../../database/models');
        await QuoteRequest.increment('receivedQuotes', { where: { id: quoteRequestId }, transaction: t });
      }
      
      await t.commit();
      return res.status(201).json({ success: true, message: 'Cotización registrada', data: quote });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Obtener cotización por ID
   */
  async getQuoteById(req, res, next) {
    try {
      const { Quote, QuoteItem, Contractor, Project, PurchaseOrder, User } = require('../../../database/models');
      
      const quote = await Quote.findByPk(req.params.id, {
        include: [
          { model: Contractor, as: 'contractor' },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: QuoteItem, as: 'items', order: [['itemNumber', 'ASC']] },
          { model: PurchaseOrder, as: 'purchaseOrder', attributes: ['id', 'code', 'status'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: User, as: 'reviewer', attributes: ['id', 'username'] },
          { model: User, as: 'approver', attributes: ['id', 'username'] },
        ],
      });
      
      if (!quote) throw new NotFoundError('Cotización no encontrada');
      return res.json({ success: true, data: quote });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar cotización
   */
  async updateQuote(req, res, next) {
    try {
      const { Quote } = require('../../../database/models');
      
      const quote = await Quote.findByPk(req.params.id);
      if (!quote) throw new NotFoundError('Cotización no encontrada');
      if (!['DRAFT', 'RECEIVED'].includes(quote.status)) {
        throw new BadRequestError('Solo se pueden editar cotizaciones en borrador o recibidas');
      }
      
      await quote.update(req.body);
      return res.json({ success: true, message: 'Cotización actualizada', data: quote });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Aprobar cotización
   */
  async approveQuote(req, res, next) {
    try {
      const { Quote } = require('../../../database/models');
      
      const quote = await Quote.findByPk(req.params.id);
      if (!quote) throw new NotFoundError('Cotización no encontrada');
      if (!['RECEIVED', 'UNDER_REVIEW'].includes(quote.status)) {
        throw new BadRequestError('Solo se pueden aprobar cotizaciones recibidas o en revisión');
      }
      
      await quote.update({
        status: 'APPROVED',
        isPreferred: true,
        approvedAt: new Date(),
        approvedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Cotización aprobada', data: quote });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rechazar cotización
   */
  async rejectQuote(req, res, next) {
    try {
      const { Quote } = require('../../../database/models');
      
      const quote = await Quote.findByPk(req.params.id);
      if (!quote) throw new NotFoundError('Cotización no encontrada');
      
      await quote.update({
        status: 'REJECTED',
        rejectionReason: req.body.reason,
        reviewedAt: new Date(),
        reviewedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Cotización rechazada', data: quote });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Convertir cotización a orden de compra
   */
  async convertQuoteToPO(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Quote, QuoteItem, PurchaseOrder, PurchaseOrderItem } = require('../../../database/models');
      
      const quote = await Quote.findByPk(req.params.id, {
        include: [{ model: QuoteItem, as: 'items' }],
      });
      
      if (!quote) throw new NotFoundError('Cotización no encontrada');
      if (quote.status !== 'APPROVED') {
        throw new BadRequestError('Solo se pueden convertir cotizaciones aprobadas');
      }
      if (quote.purchaseOrderId) {
        throw new BadRequestError('Esta cotización ya fue convertida a OC');
      }
      
      // Generar código de OC
      const year = new Date().getFullYear();
      const lastOrder = await PurchaseOrder.findOne({
        where: { code: { [Op.like]: `OC-${year}-%` } },
        order: [['createdAt', 'DESC']],
      });
      let nextNumber = 1;
      if (lastOrder && lastOrder.code) {
        const match = lastOrder.code.match(/-(\d+)$/);
        if (match) nextNumber = parseInt(match[1], 10) + 1;
      }
      const poCode = `OC-${year}-${String(nextNumber).padStart(4, '0')}`;
      
      // Crear OC
      const purchaseOrder = await PurchaseOrder.create({
        code: poCode,
        contractorId: quote.contractorId,
        projectId: quote.projectId,
        orderType: quote.quoteType,
        title: quote.title,
        description: quote.description,
        orderDate: new Date(),
        deliveryDate: req.body.deliveryDate,
        currency: quote.currency,
        subtotal: quote.subtotal,
        taxRate: quote.taxRate,
        taxAmount: quote.taxAmount,
        total: quote.total,
        paymentTerms: quote.paymentTerms,
        deliveryTerms: quote.deliveryTerms,
        warranty: quote.warranty,
        status: 'DRAFT',
        requestedBy: req.user.id,
        createdBy: req.user.id,
        notes: `Generada desde cotización ${quote.code}`,
      }, { transaction: t });
      
      // Crear items de OC
      if (quote.items && quote.items.length > 0) {
        const itemsData = quote.items.map(item => ({
          purchaseOrderId: purchaseOrder.id,
          itemNumber: item.itemNumber,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          notes: item.notes,
        }));
        await PurchaseOrderItem.bulkCreate(itemsData, { transaction: t });
      }
      
      // Actualizar cotización
      await quote.update({
        status: 'CONVERTED',
        purchaseOrderId: purchaseOrder.id,
      }, { transaction: t });
      
      await t.commit();
      return res.json({ 
        success: true, 
        message: 'Cotización convertida a orden de compra', 
        data: { quote, purchaseOrder } 
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Eliminar cotización
   */
  async deleteQuote(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Quote, QuoteItem } = require('../../../database/models');
      
      const quote = await Quote.findByPk(req.params.id);
      if (!quote) throw new NotFoundError('Cotización no encontrada');
      if (!['DRAFT', 'RECEIVED', 'REJECTED'].includes(quote.status)) {
        throw new BadRequestError('Solo se pueden eliminar cotizaciones en borrador, recibidas o rechazadas');
      }
      
      await QuoteItem.destroy({ where: { quoteId: quote.id }, transaction: t });
      await quote.destroy({ transaction: t });
      
      await t.commit();
      return res.json({ success: true, message: 'Cotización eliminada' });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  // ==================== QUOTE REQUESTS ====================

  /**
   * Listar solicitudes de cotización
   */
  async listQuoteRequests(req, res, next) {
    try {
      const { QuoteRequest, Project, Department, User } = require('../../../database/models');
      const { projectId, departmentId, requestType, status, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (departmentId) whereClause.departmentId = departmentId;
      if (requestType) whereClause.requestType = requestType;
      if (status) whereClause.status = status;
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await QuoteRequest.findAndCountAll({
        where: whereClause,
        include: [
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: Department, as: 'department', attributes: ['id', 'name'] },
          { model: User, as: 'requester', attributes: ['id', 'username'] },
        ],
        order: [['requestDate', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      return res.json({
        success: true,
        data: rows,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear solicitud de cotización
   */
  async createQuoteRequest(req, res, next) {
    try {
      const { QuoteRequest } = require('../../../database/models');
      
      const code = await generateQuoteRequestCode();
      const {
        projectId, departmentId, requestType, title, description, justification,
        requestDate, requiredDate, quotesDeadline, currency, estimatedBudget, minQuotes, notes,
      } = req.body;
      
      const request = await QuoteRequest.create({
        code, projectId, departmentId, requestType: requestType || 'SERVICE',
        title, description, justification,
        requestDate: requestDate || new Date(), requiredDate, quotesDeadline,
        currency: currency || 'USD', estimatedBudget, minQuotes: minQuotes || 3,
        requestedBy: req.user.id,
        createdBy: req.user.id,
        notes,
      });
      
      return res.status(201).json({ success: true, message: 'Solicitud de cotización creada', data: request });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener solicitud de cotización por ID
   */
  async getQuoteRequestById(req, res, next) {
    try {
      const { QuoteRequest, Quote, Project, Department, PurchaseOrder, User, Contractor } = require('../../../database/models');
      
      const request = await QuoteRequest.findByPk(req.params.id, {
        include: [
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: Department, as: 'department', attributes: ['id', 'name'] },
          { model: User, as: 'requester', attributes: ['id', 'username'] },
          { model: User, as: 'approver', attributes: ['id', 'username'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { 
            model: Quote, 
            as: 'quotes',
            include: [{ model: Contractor, as: 'contractor', attributes: ['id', 'code', 'companyName'] }],
          },
          { model: Quote, as: 'selectedQuote' },
          { model: PurchaseOrder, as: 'purchaseOrder', attributes: ['id', 'code', 'status'] },
        ],
      });
      
      if (!request) throw new NotFoundError('Solicitud no encontrada');
      return res.json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Aprobar solicitud de cotización
   */
  async approveQuoteRequest(req, res, next) {
    try {
      const { QuoteRequest } = require('../../../database/models');
      
      const request = await QuoteRequest.findByPk(req.params.id);
      if (!request) throw new NotFoundError('Solicitud no encontrada');
      if (request.status !== 'PENDING') throw new BadRequestError('Solo se pueden aprobar solicitudes pendientes');
      
      await request.update({
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Solicitud aprobada', data: request });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Seleccionar cotización ganadora
   */
  async selectQuote(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { QuoteRequest, Quote } = require('../../../database/models');
      
      const request = await QuoteRequest.findByPk(req.params.id);
      if (!request) throw new NotFoundError('Solicitud no encontrada');
      if (!['QUOTING', 'EVALUATING'].includes(request.status)) {
        throw new BadRequestError('Solo se puede seleccionar cotización en solicitudes en proceso de cotización o evaluación');
      }
      
      const { quoteId } = req.body;
      const quote = await Quote.findByPk(quoteId);
      if (!quote) throw new NotFoundError('Cotización no encontrada');
      
      // Marcar cotización como preferida
      await Quote.update({ isPreferred: false }, { where: { quoteRequestId: request.id }, transaction: t });
      await quote.update({ isPreferred: true, status: 'APPROVED' }, { transaction: t });
      
      // Actualizar solicitud
      await request.update({
        status: 'AWARDED',
        selectedQuoteId: quoteId,
      }, { transaction: t });
      
      await t.commit();
      return res.json({ success: true, message: 'Cotización seleccionada', data: request });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  // ==================== STATS ====================

  /**
   * Estadísticas de procura
   */
  async getStats(req, res, next) {
    try {
      const { Quote, QuoteRequest, PurchaseOrder, ContractorInvoice, ContractorPayment } = require('../../../database/models');
      
      // Cotizaciones
      const totalQuotes = await Quote.count();
      const pendingQuotes = await Quote.count({ where: { status: { [Op.in]: ['RECEIVED', 'UNDER_REVIEW'] } } });
      const approvedQuotes = await Quote.count({ where: { status: 'APPROVED' } });
      
      // Solicitudes
      const totalRequests = await QuoteRequest.count();
      const pendingRequests = await QuoteRequest.count({ where: { status: { [Op.in]: ['PENDING', 'QUOTING', 'EVALUATING'] } } });
      
      // Órdenes de compra
      const totalOrders = await PurchaseOrder.count();
      const pendingOrders = await PurchaseOrder.count({ where: { status: { [Op.in]: ['DRAFT', 'PENDING'] } } });
      const activeOrders = await PurchaseOrder.count({ where: { status: { [Op.in]: ['APPROVED', 'SENT', 'CONFIRMED', 'IN_PROGRESS'] } } });
      
      // Montos
      const ordersTotal = await PurchaseOrder.sum('total', { where: { status: { [Op.notIn]: ['CANCELLED', 'DRAFT'] } } });
      const invoicesTotal = await ContractorInvoice.sum('total', { where: { status: { [Op.notIn]: ['REJECTED'] } } });
      const paymentsTotal = await ContractorPayment.sum('amount', { where: { status: 'COMPLETED' } });
      
      return res.json({
        success: true,
        data: {
          quotes: { total: totalQuotes, pending: pendingQuotes, approved: approvedQuotes },
          requests: { total: totalRequests, pending: pendingRequests },
          orders: { total: totalOrders, pending: pendingOrders, active: activeOrders },
          amounts: { 
            ordersTotal: ordersTotal || 0, 
            invoicesTotal: invoicesTotal || 0, 
            paymentsTotal: paymentsTotal || 0,
            pendingPayments: (invoicesTotal || 0) - (paymentsTotal || 0),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProcurementController();
