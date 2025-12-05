const { Op } = require('sequelize');
const models = require('../../../database/models');

// Generar código único para documento
const generateDocumentCode = async (documentType = 'OTHER') => {
  const prefixes = {
    CONTRACT: 'CTR', AGREEMENT: 'AGR', POLICY: 'POL', PROCEDURE: 'PRC',
    MANUAL: 'MAN', FORM: 'FRM', REPORT: 'RPT', CERTIFICATE: 'CRT',
    LICENSE: 'LIC', PERMIT: 'PRM', INVOICE: 'INV', RECEIPT: 'RCP',
    LETTER: 'LTR', MEMO: 'MEM', MINUTE: 'MIN', SPECIFICATION: 'SPC',
    DRAWING: 'DRW', PHOTO: 'PHT', ID_DOCUMENT: 'IDD', OTHER: 'DOC',
  };
  const prefix = prefixes[documentType] || 'DOC';
  const year = new Date().getFullYear().toString().slice(-2);
  
  const lastDocument = await models.Document.findOne({
    where: { code: { [Op.like]: `${prefix}-${year}-%` } },
    order: [['code', 'DESC']],
  });

  let sequence = 1;
  if (lastDocument) {
    const lastSequence = parseInt(lastDocument.code.split('-').pop(), 10);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${year}-${sequence.toString().padStart(4, '0')}`;
};

// Generar código para categoría
const generateCategoryCode = async (module = 'GENERAL') => {
  const prefix = module.substring(0, 3).toUpperCase();
  
  const lastCategory = await models.DocumentCategory.findOne({
    where: { code: { [Op.like]: `CAT-${prefix}-%` } },
    order: [['code', 'DESC']],
  });

  let sequence = 1;
  if (lastCategory) {
    const lastSequence = parseInt(lastCategory.code.split('-').pop(), 10);
    sequence = lastSequence + 1;
  }

  return `CAT-${prefix}-${sequence.toString().padStart(3, '0')}`;
};

// ==================== CATÁLOGOS ====================

exports.getCatalogs = async (req, res) => {
  try {
    const documentTypes = [
      { code: 'CONTRACT', name: 'Contrato' },
      { code: 'AGREEMENT', name: 'Convenio' },
      { code: 'POLICY', name: 'Política' },
      { code: 'PROCEDURE', name: 'Procedimiento' },
      { code: 'MANUAL', name: 'Manual' },
      { code: 'FORM', name: 'Formulario' },
      { code: 'REPORT', name: 'Informe' },
      { code: 'CERTIFICATE', name: 'Certificado' },
      { code: 'LICENSE', name: 'Licencia' },
      { code: 'PERMIT', name: 'Permiso' },
      { code: 'INVOICE', name: 'Factura' },
      { code: 'RECEIPT', name: 'Recibo' },
      { code: 'LETTER', name: 'Carta' },
      { code: 'MEMO', name: 'Memorando' },
      { code: 'MINUTE', name: 'Acta' },
      { code: 'SPECIFICATION', name: 'Especificación' },
      { code: 'DRAWING', name: 'Plano/Dibujo' },
      { code: 'PHOTO', name: 'Fotografía' },
      { code: 'ID_DOCUMENT', name: 'Documento de Identidad' },
      { code: 'OTHER', name: 'Otro' },
    ];

    const statuses = [
      { code: 'DRAFT', name: 'Borrador' },
      { code: 'PENDING_REVIEW', name: 'Pendiente de Revisión' },
      { code: 'APPROVED', name: 'Aprobado' },
      { code: 'REJECTED', name: 'Rechazado' },
      { code: 'EXPIRED', name: 'Vencido' },
      { code: 'ARCHIVED', name: 'Archivado' },
      { code: 'CANCELLED', name: 'Cancelado' },
    ];

    const entityTypes = [
      { code: 'EMPLOYEE', name: 'Empleado' },
      { code: 'PROJECT', name: 'Proyecto' },
      { code: 'CONTRACTOR', name: 'Contratista' },
      { code: 'VEHICLE', name: 'Vehículo' },
      { code: 'BANK_ACCOUNT', name: 'Cuenta Bancaria' },
      { code: 'PETTY_CASH', name: 'Caja Chica' },
      { code: 'INCIDENT', name: 'Incidente' },
      { code: 'TRAINING', name: 'Capacitación' },
      { code: 'INSPECTION', name: 'Inspección' },
      { code: 'PURCHASE_ORDER', name: 'Orden de Compra' },
      { code: 'INVOICE', name: 'Factura' },
      { code: 'GENERAL', name: 'General' },
    ];

    const modules = [
      { code: 'GENERAL', name: 'General' },
      { code: 'EMPLOYEE', name: 'Empleados' },
      { code: 'PROJECT', name: 'Proyectos' },
      { code: 'CONTRACTOR', name: 'Contratistas' },
      { code: 'VEHICLE', name: 'Flota' },
      { code: 'FINANCE', name: 'Finanzas' },
      { code: 'HSE', name: 'HSE' },
      { code: 'LEGAL', name: 'Legal' },
      { code: 'ADMINISTRATIVE', name: 'Administrativo' },
    ];

    const confidentialityLevels = [
      { code: 'PUBLIC', name: 'Público' },
      { code: 'INTERNAL', name: 'Interno' },
      { code: 'CONFIDENTIAL', name: 'Confidencial' },
      { code: 'RESTRICTED', name: 'Restringido' },
    ];

    const accessLevels = [
      { code: 'VIEW', name: 'Ver' },
      { code: 'DOWNLOAD', name: 'Descargar' },
      { code: 'EDIT', name: 'Editar' },
      { code: 'FULL', name: 'Completo' },
    ];

    res.json({
      success: true,
      data: { documentTypes, statuses, entityTypes, modules, confidentialityLevels, accessLevels },
    });
  } catch (error) {
    console.error('Error fetching catalogs:', error);
    res.status(500).json({ success: false, message: 'Error al obtener catálogos', error: error.message });
  }
};

// ==================== ESTADÍSTICAS ====================

exports.getStats = async (req, res) => {
  try {
    const { entityType, entityId, categoryId } = req.query;
    
    const whereClause = {};
    if (entityType) whereClause.entity_type = entityType;
    if (entityId) whereClause.entity_id = entityId;
    if (categoryId) whereClause.category_id = categoryId;

    const [totalDocuments, byStatus, byType, byConfidentiality, expiringCount, expiredCount] = await Promise.all([
      models.Document.count({ where: whereClause }),
      models.Document.findAll({
        where: whereClause,
        attributes: ['status', [models.Document.sequelize.fn('COUNT', '*'), 'count']],
        group: ['status'],
        raw: true,
      }),
      models.Document.findAll({
        where: whereClause,
        attributes: ['document_type', [models.Document.sequelize.fn('COUNT', '*'), 'count']],
        group: ['document_type'],
        raw: true,
      }),
      models.Document.findAll({
        where: whereClause,
        attributes: ['confidentiality_level', [models.Document.sequelize.fn('COUNT', '*'), 'count']],
        group: ['confidentiality_level'],
        raw: true,
      }),
      models.Document.count({
        where: {
          ...whereClause,
          expiry_date: { [Op.between]: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] },
          status: { [Op.notIn]: ['EXPIRED', 'ARCHIVED', 'CANCELLED'] },
        },
      }),
      models.Document.count({
        where: {
          ...whereClause,
          expiry_date: { [Op.lt]: new Date() },
          status: { [Op.notIn]: ['EXPIRED', 'ARCHIVED', 'CANCELLED'] },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        total: totalDocuments,
        byStatus: byStatus.reduce((acc, item) => { acc[item.status] = parseInt(item.count, 10); return acc; }, {}),
        byType: byType.reduce((acc, item) => { acc[item.document_type] = parseInt(item.count, 10); return acc; }, {}),
        byConfidentiality: byConfidentiality.reduce((acc, item) => { acc[item.confidentiality_level] = parseInt(item.count, 10); return acc; }, {}),
        expiring: expiringCount,
        expired: expiredCount,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas', error: error.message });
  }
};

// ==================== DOCUMENTOS PRÓXIMOS A VENCER ====================

exports.getExpiringDocuments = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const documents = await models.Document.findAll({
      where: {
        expiry_date: { [Op.between]: [today, futureDate] },
        status: { [Op.notIn]: ['EXPIRED', 'ARCHIVED', 'CANCELLED'] },
      },
      include: [
        { model: models.DocumentCategory, as: 'category' },
        { model: models.User, as: 'creator', attributes: ['id', 'username', 'email'] },
      ],
      order: [['expiry_date', 'ASC']],
    });

    res.json({ success: true, data: documents });
  } catch (error) {
    console.error('Error fetching expiring documents:', error);
    res.status(500).json({ success: false, message: 'Error al obtener documentos próximos a vencer', error: error.message });
  }
};

// ==================== CATEGORÍAS ====================

exports.listCategories = async (req, res) => {
  try {
    const { module, isActive, parentId } = req.query;

    const whereClause = {};
    if (module) whereClause.module = module;
    if (isActive !== undefined) whereClause.is_active = isActive === 'true';
    if (parentId) whereClause.parent_id = parentId;
    if (parentId === 'null') whereClause.parent_id = null;

    const categories = await models.DocumentCategory.findAll({
      where: whereClause,
      include: [
        { model: models.DocumentCategory, as: 'parent' },
        { model: models.DocumentCategory, as: 'children' },
        { model: models.User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Error al obtener categorías', error: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await models.DocumentCategory.findByPk(id, {
      include: [
        { model: models.DocumentCategory, as: 'parent' },
        { model: models.DocumentCategory, as: 'children' },
        { model: models.User, as: 'creator', attributes: ['id', 'username'] },
        { model: models.Document, as: 'documents', limit: 10 },
      ],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Error al obtener categoría', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, module, parentId, requiresExpiry, expiryAlertDays, isMandatory, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'El nombre es requerido' });
    }

    const code = await generateCategoryCode(module || 'GENERAL');

    const category = await models.DocumentCategory.create({
      code,
      name,
      description,
      module: module || 'GENERAL',
      parent_id: parentId,
      requires_expiry: requiresExpiry || false,
      expiry_alert_days: expiryAlertDays || 30,
      is_mandatory: isMandatory || false,
      sort_order: sortOrder || 0,
      created_by: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Categoría creada exitosamente', data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Error al crear categoría', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, module, parentId, requiresExpiry, expiryAlertDays, isMandatory, sortOrder, isActive } = req.body;

    const category = await models.DocumentCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    await category.update({
      name: name !== undefined ? name : category.name,
      description: description !== undefined ? description : category.description,
      module: module !== undefined ? module : category.module,
      parent_id: parentId !== undefined ? parentId : category.parent_id,
      requires_expiry: requiresExpiry !== undefined ? requiresExpiry : category.requires_expiry,
      expiry_alert_days: expiryAlertDays !== undefined ? expiryAlertDays : category.expiry_alert_days,
      is_mandatory: isMandatory !== undefined ? isMandatory : category.is_mandatory,
      sort_order: sortOrder !== undefined ? sortOrder : category.sort_order,
      is_active: isActive !== undefined ? isActive : category.is_active,
    });

    res.json({ success: true, message: 'Categoría actualizada exitosamente', data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar categoría', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await models.DocumentCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    const documentsCount = await models.Document.count({ where: { category_id: id } });
    if (documentsCount > 0) {
      return res.status(400).json({ success: false, message: `No se puede eliminar la categoría porque tiene ${documentsCount} documentos asociados` });
    }

    const childrenCount = await models.DocumentCategory.count({ where: { parent_id: id } });
    if (childrenCount > 0) {
      return res.status(400).json({ success: false, message: `No se puede eliminar la categoría porque tiene ${childrenCount} subcategorías` });
    }

    await category.destroy();

    res.json({ success: true, message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar categoría', error: error.message });
  }
};

// ==================== DOCUMENTOS ====================

exports.listDocuments = async (req, res) => {
  try {
    const {
      page = 1, limit = 10, search, entityType, entityId, categoryId,
      documentType, status, confidentialityLevel, sortBy = 'created_at', sortOrder = 'DESC',
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};
    if (entityType) whereClause.entity_type = entityType;
    if (entityId) whereClause.entity_id = entityId;
    if (categoryId) whereClause.category_id = categoryId;
    if (documentType) whereClause.document_type = documentType;
    if (status) whereClause.status = status;
    if (confidentialityLevel) whereClause.confidentiality_level = confidentialityLevel;

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { external_number: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await models.Document.findAndCountAll({
      where: whereClause,
      include: [
        { model: models.DocumentCategory, as: 'category' },
        { model: models.User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: models.User, as: 'approver', attributes: ['id', 'username', 'email'] },
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset,
    });

    res.json({
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
    console.error('Error fetching documents:', error);
    res.status(500).json({ success: false, message: 'Error al obtener documentos', error: error.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await models.Document.findByPk(id, {
      include: [
        { model: models.DocumentCategory, as: 'category' },
        { model: models.User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: models.User, as: 'approver', attributes: ['id', 'username', 'email'] },
        { model: models.User, as: 'archiver', attributes: ['id', 'username', 'email'] },
        { 
          model: models.DocumentVersion, 
          as: 'versions',
          include: [{ model: models.User, as: 'creator', attributes: ['id', 'username'] }],
        },
        {
          model: models.DocumentShare,
          as: 'shares',
          include: [
            { model: models.User, as: 'sharedWithUser', attributes: ['id', 'username', 'email'] },
            { model: models.Department, as: 'sharedWithDepartment' },
            { model: models.User, as: 'sharer', attributes: ['id', 'username'] },
          ],
        },
      ],
      order: [[{ model: models.DocumentVersion, as: 'versions' }, 'version_number', 'DESC']],
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    res.json({ success: true, data: document });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ success: false, message: 'Error al obtener documento', error: error.message });
  }
};

exports.createDocument = async (req, res) => {
  try {
    const {
      title, description, categoryId, documentType, entityType, entityId,
      fileName, filePath, fileType, fileSize, externalUrl, issueDate, expiryDate,
      externalNumber, tags, metadata, confidentialityLevel, notes,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'El título es requerido' });
    }

    const code = await generateDocumentCode(documentType || 'OTHER');

    const document = await models.Document.create({
      code,
      title,
      description,
      category_id: categoryId,
      document_type: documentType || 'OTHER',
      entity_type: entityType || 'GENERAL',
      entity_id: entityId,
      file_name: fileName,
      file_path: filePath,
      file_type: fileType,
      file_size: fileSize,
      external_url: externalUrl,
      issue_date: issueDate,
      expiry_date: expiryDate,
      external_number: externalNumber,
      tags: tags || [],
      metadata: metadata || {},
      confidentiality_level: confidentialityLevel || 'INTERNAL',
      notes,
      status: 'DRAFT',
      version: 1,
      created_by: req.user.id,
    });

    // Crear primera versión si hay archivo
    if (fileName || filePath || externalUrl) {
      await models.DocumentVersion.create({
        document_id: document.id,
        version_number: 1,
        file_name: fileName,
        file_path: filePath,
        file_type: fileType,
        file_size: fileSize,
        external_url: externalUrl,
        change_description: 'Versión inicial',
        is_current: true,
        created_by: req.user.id,
      });
    }

    const createdDocument = await models.Document.findByPk(document.id, {
      include: [
        { model: models.DocumentCategory, as: 'category' },
        { model: models.User, as: 'creator', attributes: ['id', 'username', 'email'] },
      ],
    });

    res.status(201).json({ success: true, message: 'Documento creado exitosamente', data: createdDocument });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ success: false, message: 'Error al crear documento', error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, categoryId, documentType, entityType, entityId,
      fileName, filePath, fileType, fileSize, externalUrl, issueDate, expiryDate,
      externalNumber, tags, metadata, confidentialityLevel, notes,
    } = req.body;

    const document = await models.Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    await document.update({
      title: title !== undefined ? title : document.title,
      description: description !== undefined ? description : document.description,
      category_id: categoryId !== undefined ? categoryId : document.category_id,
      document_type: documentType !== undefined ? documentType : document.document_type,
      entity_type: entityType !== undefined ? entityType : document.entity_type,
      entity_id: entityId !== undefined ? entityId : document.entity_id,
      file_name: fileName !== undefined ? fileName : document.file_name,
      file_path: filePath !== undefined ? filePath : document.file_path,
      file_type: fileType !== undefined ? fileType : document.file_type,
      file_size: fileSize !== undefined ? fileSize : document.file_size,
      external_url: externalUrl !== undefined ? externalUrl : document.external_url,
      issue_date: issueDate !== undefined ? issueDate : document.issue_date,
      expiry_date: expiryDate !== undefined ? expiryDate : document.expiry_date,
      external_number: externalNumber !== undefined ? externalNumber : document.external_number,
      tags: tags !== undefined ? tags : document.tags,
      metadata: metadata !== undefined ? metadata : document.metadata,
      confidentiality_level: confidentialityLevel !== undefined ? confidentialityLevel : document.confidentiality_level,
      notes: notes !== undefined ? notes : document.notes,
    });

    const updatedDocument = await models.Document.findByPk(id, {
      include: [
        { model: models.DocumentCategory, as: 'category' },
        { model: models.User, as: 'creator', attributes: ['id', 'username', 'email'] },
      ],
    });

    res.json({ success: true, message: 'Documento actualizado exitosamente', data: updatedDocument });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar documento', error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await models.Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    await models.DocumentVersion.destroy({ where: { document_id: id } });
    await models.DocumentShare.destroy({ where: { document_id: id } });
    await document.destroy();

    res.json({ success: true, message: 'Documento eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar documento', error: error.message });
  }
};

// ==================== WORKFLOW ====================

exports.submitForReview = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await models.Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    if (document.status !== 'DRAFT' && document.status !== 'REJECTED') {
      return res.status(400).json({ success: false, message: 'Solo se pueden enviar a revisión documentos en borrador o rechazados' });
    }

    await document.update({ status: 'PENDING_REVIEW' });

    res.json({ success: true, message: 'Documento enviado a revisión', data: document });
  } catch (error) {
    console.error('Error submitting document for review:', error);
    res.status(500).json({ success: false, message: 'Error al enviar documento a revisión', error: error.message });
  }
};

exports.approveDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await models.Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    if (document.status !== 'PENDING_REVIEW') {
      return res.status(400).json({ success: false, message: 'El documento no está pendiente de revisión' });
    }

    await document.update({
      status: 'APPROVED',
      approved_by: req.user.id,
      approved_at: new Date(),
    });

    res.json({ success: true, message: 'Documento aprobado exitosamente', data: document });
  } catch (error) {
    console.error('Error approving document:', error);
    res.status(500).json({ success: false, message: 'Error al aprobar documento', error: error.message });
  }
};

exports.rejectDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const document = await models.Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    if (document.status !== 'PENDING_REVIEW') {
      return res.status(400).json({ success: false, message: 'El documento no está pendiente de revisión' });
    }

    await document.update({
      status: 'REJECTED',
      notes: reason ? `${document.notes || ''}\nRechazado: ${reason}` : document.notes,
    });

    res.json({ success: true, message: 'Documento rechazado', data: document });
  } catch (error) {
    console.error('Error rejecting document:', error);
    res.status(500).json({ success: false, message: 'Error al rechazar documento', error: error.message });
  }
};

exports.archiveDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await models.Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    await document.update({
      status: 'ARCHIVED',
      archived_by: req.user.id,
      archived_at: new Date(),
    });

    res.json({ success: true, message: 'Documento archivado exitosamente', data: document });
  } catch (error) {
    console.error('Error archiving document:', error);
    res.status(500).json({ success: false, message: 'Error al archivar documento', error: error.message });
  }
};

// ==================== VERSIONES ====================

exports.createVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, filePath, fileType, fileSize, externalUrl, changeDescription, fileHash } = req.body;

    const document = await models.Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    // Marcar versiones anteriores como no actuales
    await models.DocumentVersion.update(
      { is_current: false },
      { where: { document_id: id } }
    );

    // Crear nueva versión
    const newVersion = await models.DocumentVersion.create({
      document_id: id,
      version_number: document.version + 1,
      file_name: fileName,
      file_path: filePath,
      file_type: fileType,
      file_size: fileSize,
      external_url: externalUrl,
      change_description: changeDescription,
      file_hash: fileHash,
      is_current: true,
      created_by: req.user.id,
    });

    // Actualizar documento con nueva versión
    await document.update({
      version: document.version + 1,
      file_name: fileName || document.file_name,
      file_path: filePath || document.file_path,
      file_type: fileType || document.file_type,
      file_size: fileSize || document.file_size,
      external_url: externalUrl || document.external_url,
    });

    res.status(201).json({ success: true, message: 'Nueva versión creada exitosamente', data: newVersion });
  } catch (error) {
    console.error('Error creating version:', error);
    res.status(500).json({ success: false, message: 'Error al crear versión', error: error.message });
  }
};

// ==================== COMPARTIR ====================

exports.shareDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, departmentId, accessLevel, expiresAt, notes } = req.body;

    const document = await models.Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    if (!userId && !departmentId) {
      return res.status(400).json({ success: false, message: 'Debe especificar un usuario o departamento' });
    }

    const share = await models.DocumentShare.create({
      document_id: id,
      shared_with_user_id: userId,
      shared_with_department_id: departmentId,
      access_level: accessLevel || 'VIEW',
      expires_at: expiresAt,
      notes,
      shared_by: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Documento compartido exitosamente', data: share });
  } catch (error) {
    console.error('Error sharing document:', error);
    res.status(500).json({ success: false, message: 'Error al compartir documento', error: error.message });
  }
};

exports.removeShare = async (req, res) => {
  try {
    const { id, shareId } = req.params;

    const share = await models.DocumentShare.findOne({
      where: { id: shareId, document_id: id },
    });

    if (!share) {
      return res.status(404).json({ success: false, message: 'Compartición no encontrada' });
    }

    await share.destroy();

    res.json({ success: true, message: 'Compartición eliminada exitosamente' });
  } catch (error) {
    console.error('Error removing share:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar compartición', error: error.message });
  }
};
