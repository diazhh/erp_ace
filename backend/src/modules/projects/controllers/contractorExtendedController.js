const { Op } = require('sequelize');
const { sequelize } = require('../../../database');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

/**
 * Generar códigos únicos
 */
async function generateInvoiceCode() {
  const { ContractorInvoice } = require('../../../database/models');
  const year = new Date().getFullYear();
  
  const lastInvoice = await ContractorInvoice.findOne({
    where: { code: { [Op.like]: `INV-CTR-${year}-%` } },
    order: [['createdAt', 'DESC']],
  });
  
  let nextNumber = 1;
  if (lastInvoice && lastInvoice.code) {
    const match = lastInvoice.code.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  
  return `INV-CTR-${year}-${String(nextNumber).padStart(4, '0')}`;
}

async function generatePaymentCode() {
  const { ContractorPayment } = require('../../../database/models');
  const year = new Date().getFullYear();
  
  const lastPayment = await ContractorPayment.findOne({
    where: { code: { [Op.like]: `PAY-CTR-${year}-%` } },
    order: [['createdAt', 'DESC']],
  });
  
  let nextNumber = 1;
  if (lastPayment && lastPayment.code) {
    const match = lastPayment.code.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  
  return `PAY-CTR-${year}-${String(nextNumber).padStart(4, '0')}`;
}

async function generatePurchaseOrderCode() {
  const { PurchaseOrder } = require('../../../database/models');
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
  
  return `OC-${year}-${String(nextNumber).padStart(4, '0')}`;
}

class ContractorExtendedController {
  // ==================== BANK ACCOUNTS ====================

  async listBankAccounts(req, res, next) {
    try {
      const { ContractorBankAccount, User } = require('../../../database/models');
      const { status } = req.query;
      
      const whereClause = { contractorId: req.params.id };
      if (status) whereClause.status = status;
      
      const accounts = await ContractorBankAccount.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'verifier', attributes: ['id', 'username'] },
        ],
        order: [['isPrimary', 'DESC'], ['createdAt', 'DESC']],
      });
      
      return res.json({ success: true, data: accounts });
    } catch (error) {
      next(error);
    }
  }

  async createBankAccount(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Contractor, ContractorBankAccount } = require('../../../database/models');
      
      const contractor = await Contractor.findByPk(req.params.id);
      if (!contractor) throw new NotFoundError('Contratista no encontrado');
      
      const {
        bankName, bankCode, accountNumber, accountType, currency,
        holderName, holderIdType, holderIdNumber,
        swiftCode, iban, routingNumber, isPrimary, notes,
      } = req.body;
      
      // Si es primaria, quitar primaria de otras
      if (isPrimary) {
        await ContractorBankAccount.update(
          { isPrimary: false },
          { where: { contractorId: contractor.id }, transaction: t }
        );
      }
      
      const account = await ContractorBankAccount.create({
        contractorId: contractor.id,
        bankName, bankCode, accountNumber, accountType: accountType || 'CHECKING',
        currency: currency || 'VES',
        holderName, holderIdType, holderIdNumber,
        swiftCode, iban, routingNumber,
        isPrimary: isPrimary || false,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      await t.commit();
      return res.status(201).json({ success: true, message: 'Cuenta bancaria agregada', data: account });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  async updateBankAccount(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { ContractorBankAccount } = require('../../../database/models');
      
      const account = await ContractorBankAccount.findByPk(req.params.accountId);
      if (!account) throw new NotFoundError('Cuenta no encontrada');
      
      const { isPrimary, ...data } = req.body;
      
      if (isPrimary && !account.isPrimary) {
        await ContractorBankAccount.update(
          { isPrimary: false },
          { where: { contractorId: account.contractorId }, transaction: t }
        );
      }
      
      await account.update({ ...data, isPrimary }, { transaction: t });
      await t.commit();
      
      return res.json({ success: true, message: 'Cuenta actualizada', data: account });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  async verifyBankAccount(req, res, next) {
    try {
      const { ContractorBankAccount } = require('../../../database/models');
      
      const account = await ContractorBankAccount.findByPk(req.params.accountId);
      if (!account) throw new NotFoundError('Cuenta no encontrada');
      
      await account.update({
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Cuenta verificada', data: account });
    } catch (error) {
      next(error);
    }
  }

  async deleteBankAccount(req, res, next) {
    try {
      const { ContractorBankAccount, ContractorPayment } = require('../../../database/models');
      
      const account = await ContractorBankAccount.findByPk(req.params.accountId);
      if (!account) throw new NotFoundError('Cuenta no encontrada');
      
      // Verificar que no tenga pagos asociados
      const payments = await ContractorPayment.count({ where: { bankAccountId: account.id } });
      if (payments > 0) {
        throw new BadRequestError('No se puede eliminar una cuenta con pagos asociados');
      }
      
      await account.destroy();
      return res.json({ success: true, message: 'Cuenta eliminada' });
    } catch (error) {
      next(error);
    }
  }

  // ==================== DOCUMENTS ====================

  async listDocuments(req, res, next) {
    try {
      const { ContractorDocument, User } = require('../../../database/models');
      const { documentType, status } = req.query;
      
      const whereClause = { contractorId: req.params.id };
      if (documentType) whereClause.documentType = documentType;
      if (status) whereClause.status = status;
      
      const documents = await ContractorDocument.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: User, as: 'verifier', attributes: ['id', 'username'] },
        ],
        order: [['createdAt', 'DESC']],
      });
      
      return res.json({ success: true, data: documents });
    } catch (error) {
      next(error);
    }
  }

  async createDocument(req, res, next) {
    try {
      const { Contractor, ContractorDocument } = require('../../../database/models');
      
      const contractor = await Contractor.findByPk(req.params.id);
      if (!contractor) throw new NotFoundError('Contratista no encontrado');
      
      const {
        documentType, name, description, documentNumber,
        issueDate, expiryDate, fileUrl, fileName, fileSize, mimeType, notes,
      } = req.body;
      
      const document = await ContractorDocument.create({
        contractorId: contractor.id,
        documentType, name, description, documentNumber,
        issueDate, expiryDate, fileUrl, fileName, fileSize, mimeType,
        createdBy: req.user.id,
        notes,
      });
      
      return res.status(201).json({ success: true, message: 'Documento agregado', data: document });
    } catch (error) {
      next(error);
    }
  }

  async updateDocument(req, res, next) {
    try {
      const { ContractorDocument } = require('../../../database/models');
      
      const document = await ContractorDocument.findByPk(req.params.documentId);
      if (!document) throw new NotFoundError('Documento no encontrado');
      
      await document.update(req.body);
      return res.json({ success: true, message: 'Documento actualizado', data: document });
    } catch (error) {
      next(error);
    }
  }

  async verifyDocument(req, res, next) {
    try {
      const { ContractorDocument } = require('../../../database/models');
      
      const document = await ContractorDocument.findByPk(req.params.documentId);
      if (!document) throw new NotFoundError('Documento no encontrado');
      
      await document.update({
        status: 'VALID',
        verifiedAt: new Date(),
        verifiedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Documento verificado', data: document });
    } catch (error) {
      next(error);
    }
  }

  async rejectDocument(req, res, next) {
    try {
      const { ContractorDocument } = require('../../../database/models');
      
      const document = await ContractorDocument.findByPk(req.params.documentId);
      if (!document) throw new NotFoundError('Documento no encontrado');
      
      await document.update({
        status: 'REJECTED',
        rejectionReason: req.body.reason,
        verifiedAt: new Date(),
        verifiedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Documento rechazado', data: document });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req, res, next) {
    try {
      const { ContractorDocument } = require('../../../database/models');
      
      const document = await ContractorDocument.findByPk(req.params.documentId);
      if (!document) throw new NotFoundError('Documento no encontrado');
      
      await document.destroy();
      return res.json({ success: true, message: 'Documento eliminado' });
    } catch (error) {
      next(error);
    }
  }

  getDocumentTypes(req, res) {
    const types = [
      { code: 'RIF', name: 'Registro de Información Fiscal', required: true },
      { code: 'CONSTITUTIVE_ACT', name: 'Acta Constitutiva', required: true },
      { code: 'COMMERCIAL_REGISTER', name: 'Registro Mercantil', required: false },
      { code: 'TAX_COMPLIANCE', name: 'Solvencia SENIAT', required: true },
      { code: 'SOCIAL_SECURITY', name: 'Solvencia IVSS', required: true },
      { code: 'HOUSING_FUND', name: 'Solvencia FAOV/BANAVIH', required: true },
      { code: 'INCE', name: 'Solvencia INCE', required: true },
      { code: 'INSURANCE_POLICY', name: 'Póliza de Seguro', required: false },
      { code: 'PROFESSIONAL_LICENSE', name: 'Licencia Profesional', required: false },
      { code: 'BANK_REFERENCE', name: 'Referencia Bancaria', required: false },
      { code: 'COMMERCIAL_REFERENCE', name: 'Referencia Comercial', required: false },
      { code: 'CONTRACT', name: 'Contrato', required: false },
      { code: 'QUOTE', name: 'Cotización', required: false },
      { code: 'OTHER', name: 'Otro', required: false },
    ];
    return res.json({ success: true, data: types });
  }

  // ==================== INVOICES ====================

  async listInvoices(req, res, next) {
    try {
      const { ContractorInvoice, Contractor, Project, PurchaseOrder, User } = require('../../../database/models');
      const { contractorId, projectId, status, startDate, endDate, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (contractorId) whereClause.contractorId = contractorId;
      if (projectId) whereClause.projectId = projectId;
      if (status) whereClause.status = status;
      if (startDate && endDate) {
        whereClause.invoiceDate = { [Op.between]: [startDate, endDate] };
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await ContractorInvoice.findAndCountAll({
        where: whereClause,
        include: [
          { model: Contractor, as: 'contractor', attributes: ['id', 'code', 'companyName'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: PurchaseOrder, as: 'purchaseOrder', attributes: ['id', 'code', 'title'] },
        ],
        order: [['invoiceDate', 'DESC']],
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

  async createInvoice(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Contractor, ContractorInvoice } = require('../../../database/models');
      
      const contractor = await Contractor.findByPk(req.body.contractorId);
      if (!contractor) throw new NotFoundError('Contratista no encontrado');
      
      const code = await generateInvoiceCode();
      const {
        contractorId, projectId, purchaseOrderId,
        invoiceNumber, controlNumber, invoiceDate, dueDate,
        currency, subtotal, taxRate, taxAmount,
        retentionRate, retentionAmount, ivaRetentionRate, ivaRetentionAmount,
        total, description, fileUrl, notes,
      } = req.body;
      
      // Calcular neto a pagar
      const netPayable = parseFloat(total) - parseFloat(retentionAmount || 0) - parseFloat(ivaRetentionAmount || 0);
      
      const invoice = await ContractorInvoice.create({
        code, contractorId, projectId, purchaseOrderId,
        invoiceNumber, controlNumber, invoiceDate, dueDate,
        currency: currency || 'USD', subtotal, taxRate: taxRate || 16, taxAmount,
        retentionRate, retentionAmount, ivaRetentionRate, ivaRetentionAmount,
        total, netPayable, pendingAmount: netPayable,
        description, fileUrl,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      await t.commit();
      return res.status(201).json({ success: true, message: 'Factura registrada', data: invoice });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  async getInvoiceById(req, res, next) {
    try {
      const { ContractorInvoice, Contractor, Project, PurchaseOrder, ContractorPayment, User } = require('../../../database/models');
      
      const invoice = await ContractorInvoice.findByPk(req.params.invoiceId, {
        include: [
          { model: Contractor, as: 'contractor' },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: PurchaseOrder, as: 'purchaseOrder', attributes: ['id', 'code', 'title'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: User, as: 'approver', attributes: ['id', 'username'] },
          { model: ContractorPayment, as: 'payments' },
        ],
      });
      
      if (!invoice) throw new NotFoundError('Factura no encontrada');
      return res.json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  }

  async approveInvoice(req, res, next) {
    try {
      const { ContractorInvoice } = require('../../../database/models');
      
      const invoice = await ContractorInvoice.findByPk(req.params.invoiceId);
      if (!invoice) throw new NotFoundError('Factura no encontrada');
      if (invoice.status !== 'PENDING') throw new BadRequestError('Solo se pueden aprobar facturas pendientes');
      
      await invoice.update({
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Factura aprobada', data: invoice });
    } catch (error) {
      next(error);
    }
  }

  async rejectInvoice(req, res, next) {
    try {
      const { ContractorInvoice } = require('../../../database/models');
      
      const invoice = await ContractorInvoice.findByPk(req.params.invoiceId);
      if (!invoice) throw new NotFoundError('Factura no encontrada');
      
      await invoice.update({
        status: 'REJECTED',
        rejectionReason: req.body.reason,
        approvedAt: new Date(),
        approvedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Factura rechazada', data: invoice });
    } catch (error) {
      next(error);
    }
  }

  // ==================== PAYMENTS ====================

  async listPayments(req, res, next) {
    try {
      const { ContractorPayment, Contractor, ContractorInvoice, Project, User } = require('../../../database/models');
      const { contractorId, projectId, status, startDate, endDate, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (contractorId) whereClause.contractorId = contractorId;
      if (projectId) whereClause.projectId = projectId;
      if (status) whereClause.status = status;
      if (startDate && endDate) {
        whereClause.paymentDate = { [Op.between]: [startDate, endDate] };
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await ContractorPayment.findAndCountAll({
        where: whereClause,
        include: [
          { model: Contractor, as: 'contractor', attributes: ['id', 'code', 'companyName'] },
          { model: ContractorInvoice, as: 'invoice', attributes: ['id', 'code', 'invoiceNumber', 'total'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
        ],
        order: [['paymentDate', 'DESC']],
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

  async createPayment(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Contractor, ContractorPayment, ContractorInvoice, Project } = require('../../../database/models');
      
      const contractor = await Contractor.findByPk(req.body.contractorId);
      if (!contractor) throw new NotFoundError('Contratista no encontrado');
      
      const code = await generatePaymentCode();
      const {
        contractorId, invoiceId, projectId, bankAccountId, sourceBankAccountId,
        paymentDate, paymentMethod, referenceNumber,
        currency, amount, exchangeRate, amountInLocalCurrency,
        concept, description, receiptUrl, notes,
      } = req.body;
      
      const payment = await ContractorPayment.create({
        code, contractorId, invoiceId, projectId, bankAccountId, sourceBankAccountId,
        paymentDate, paymentMethod: paymentMethod || 'TRANSFER', referenceNumber,
        currency: currency || 'USD', amount, exchangeRate, amountInLocalCurrency,
        concept, description, receiptUrl,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      // Actualizar factura si está asociada
      if (invoiceId) {
        const invoice = await ContractorInvoice.findByPk(invoiceId, { transaction: t });
        if (invoice) {
          const newPaidAmount = parseFloat(invoice.paidAmount) + parseFloat(amount);
          const newPendingAmount = parseFloat(invoice.netPayable) - newPaidAmount;
          const newStatus = newPendingAmount <= 0 ? 'PAID' : 'PARTIAL';
          
          await invoice.update({
            paidAmount: newPaidAmount,
            pendingAmount: Math.max(0, newPendingAmount),
            status: newStatus,
          }, { transaction: t });
        }
      }
      
      // Actualizar proyecto si está asociado
      if (projectId) {
        const project = await Project.findByPk(projectId, { transaction: t });
        if (project) {
          const newPaidToContractor = parseFloat(project.paidToContractor || 0) + parseFloat(amount);
          await project.update({ paidToContractor: newPaidToContractor }, { transaction: t });
        }
      }
      
      await t.commit();
      return res.status(201).json({ success: true, message: 'Pago registrado', data: payment });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  async getPaymentById(req, res, next) {
    try {
      const { ContractorPayment, Contractor, ContractorInvoice, Project, ContractorBankAccount, BankAccount, User } = require('../../../database/models');
      
      const payment = await ContractorPayment.findByPk(req.params.paymentId, {
        include: [
          { model: Contractor, as: 'contractor' },
          { model: ContractorInvoice, as: 'invoice' },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: ContractorBankAccount, as: 'bankAccount' },
          { model: BankAccount, as: 'sourceBankAccount', attributes: ['id', 'accountName', 'bankName'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: User, as: 'approver', attributes: ['id', 'username'] },
          { model: User, as: 'processor', attributes: ['id', 'username'] },
        ],
      });
      
      if (!payment) throw new NotFoundError('Pago no encontrado');
      return res.json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }

  async approvePayment(req, res, next) {
    try {
      const { ContractorPayment } = require('../../../database/models');
      
      const payment = await ContractorPayment.findByPk(req.params.paymentId);
      if (!payment) throw new NotFoundError('Pago no encontrado');
      if (payment.status !== 'PENDING') throw new BadRequestError('Solo se pueden aprobar pagos pendientes');
      
      await payment.update({
        status: 'PROCESSING',
        approvedAt: new Date(),
        approvedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Pago aprobado', data: payment });
    } catch (error) {
      next(error);
    }
  }

  async processPayment(req, res, next) {
    try {
      const { ContractorPayment } = require('../../../database/models');
      
      const payment = await ContractorPayment.findByPk(req.params.paymentId);
      if (!payment) throw new NotFoundError('Pago no encontrado');
      if (payment.status !== 'PROCESSING') throw new BadRequestError('Solo se pueden procesar pagos aprobados');
      
      const { referenceNumber, receiptUrl } = req.body;
      
      await payment.update({
        status: 'COMPLETED',
        referenceNumber: referenceNumber || payment.referenceNumber,
        receiptUrl: receiptUrl || payment.receiptUrl,
        processedAt: new Date(),
        processedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Pago procesado', data: payment });
    } catch (error) {
      next(error);
    }
  }

  // ==================== PURCHASE ORDERS ====================

  async listPurchaseOrders(req, res, next) {
    try {
      const { PurchaseOrder, Contractor, Project, User } = require('../../../database/models');
      const { contractorId, projectId, orderType, status, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (contractorId) whereClause.contractorId = contractorId;
      if (projectId) whereClause.projectId = projectId;
      if (orderType) whereClause.orderType = orderType;
      if (status) whereClause.status = status;
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await PurchaseOrder.findAndCountAll({
        where: whereClause,
        include: [
          { model: Contractor, as: 'contractor', attributes: ['id', 'code', 'companyName'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
        ],
        order: [['orderDate', 'DESC']],
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

  async createPurchaseOrder(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Contractor, PurchaseOrder, PurchaseOrderItem } = require('../../../database/models');
      
      const contractor = await Contractor.findByPk(req.body.contractorId);
      if (!contractor) throw new NotFoundError('Contratista no encontrado');
      
      const code = await generatePurchaseOrderCode();
      const {
        contractorId, projectId, orderType, title, description,
        orderDate, deliveryDate, currency, subtotal, taxRate, taxAmount, total,
        paymentTerms, deliveryTerms, warranty, deliveryAddress, fileUrl, notes, items,
      } = req.body;
      
      const order = await PurchaseOrder.create({
        code, contractorId, projectId, orderType: orderType || 'SERVICE',
        title, description, orderDate, deliveryDate,
        currency: currency || 'USD', subtotal, taxRate: taxRate || 16, taxAmount, total,
        paymentTerms, deliveryTerms, warranty, deliveryAddress, fileUrl,
        requestedBy: req.user.id,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      // Crear items
      if (items && items.length > 0) {
        const itemsData = items.map((item, index) => ({
          purchaseOrderId: order.id,
          itemNumber: index + 1,
          description: item.description,
          unit: item.unit || 'UND',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
          notes: item.notes,
        }));
        await PurchaseOrderItem.bulkCreate(itemsData, { transaction: t });
      }
      
      await t.commit();
      return res.status(201).json({ success: true, message: 'Orden de compra creada', data: order });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  async getPurchaseOrderById(req, res, next) {
    try {
      const { PurchaseOrder, PurchaseOrderItem, Contractor, Project, ContractorInvoice, User } = require('../../../database/models');
      
      const order = await PurchaseOrder.findByPk(req.params.orderId, {
        include: [
          { model: Contractor, as: 'contractor' },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: PurchaseOrderItem, as: 'items', order: [['itemNumber', 'ASC']] },
          { model: ContractorInvoice, as: 'invoices', attributes: ['id', 'code', 'invoiceNumber', 'total', 'status'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { model: User, as: 'requester', attributes: ['id', 'username'] },
          { model: User, as: 'approver', attributes: ['id', 'username'] },
        ],
      });
      
      if (!order) throw new NotFoundError('Orden no encontrada');
      return res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async updatePurchaseOrder(req, res, next) {
    try {
      const { PurchaseOrder } = require('../../../database/models');
      
      const order = await PurchaseOrder.findByPk(req.params.orderId);
      if (!order) throw new NotFoundError('Orden no encontrada');
      if (!['DRAFT', 'PENDING'].includes(order.status)) {
        throw new BadRequestError('Solo se pueden editar órdenes en borrador o pendientes');
      }
      
      await order.update(req.body);
      return res.json({ success: true, message: 'Orden actualizada', data: order });
    } catch (error) {
      next(error);
    }
  }

  async approvePurchaseOrder(req, res, next) {
    try {
      const { PurchaseOrder } = require('../../../database/models');
      
      const order = await PurchaseOrder.findByPk(req.params.orderId);
      if (!order) throw new NotFoundError('Orden no encontrada');
      if (order.status !== 'PENDING') throw new BadRequestError('Solo se pueden aprobar órdenes pendientes');
      
      await order.update({
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: req.user.id,
      });
      
      return res.json({ success: true, message: 'Orden aprobada', data: order });
    } catch (error) {
      next(error);
    }
  }

  async sendPurchaseOrder(req, res, next) {
    try {
      const { PurchaseOrder } = require('../../../database/models');
      
      const order = await PurchaseOrder.findByPk(req.params.orderId);
      if (!order) throw new NotFoundError('Orden no encontrada');
      if (order.status !== 'APPROVED') throw new BadRequestError('Solo se pueden enviar órdenes aprobadas');
      
      await order.update({ status: 'SENT' });
      return res.json({ success: true, message: 'Orden enviada al contratista', data: order });
    } catch (error) {
      next(error);
    }
  }

  async confirmPurchaseOrder(req, res, next) {
    try {
      const { PurchaseOrder } = require('../../../database/models');
      
      const order = await PurchaseOrder.findByPk(req.params.orderId);
      if (!order) throw new NotFoundError('Orden no encontrada');
      if (order.status !== 'SENT') throw new BadRequestError('Solo se pueden confirmar órdenes enviadas');
      
      await order.update({ status: 'CONFIRMED' });
      return res.json({ success: true, message: 'Orden confirmada por contratista', data: order });
    } catch (error) {
      next(error);
    }
  }

  async updatePurchaseOrderProgress(req, res, next) {
    try {
      const { PurchaseOrder } = require('../../../database/models');
      
      const order = await PurchaseOrder.findByPk(req.params.orderId);
      if (!order) throw new NotFoundError('Orden no encontrada');
      
      const { progress, status } = req.body;
      
      await order.update({
        progress: progress !== undefined ? progress : order.progress,
        status: status || (progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS'),
      });
      
      return res.json({ success: true, message: 'Progreso actualizado', data: order });
    } catch (error) {
      next(error);
    }
  }

  getOrderTypes(req, res) {
    const types = [
      { code: 'PURCHASE', name: 'Orden de Compra', icon: 'shopping_cart' },
      { code: 'SERVICE', name: 'Orden de Servicio', icon: 'engineering' },
      { code: 'WORK', name: 'Orden de Obra', icon: 'construction' },
    ];
    return res.json({ success: true, data: types });
  }
}

module.exports = new ContractorExtendedController();
