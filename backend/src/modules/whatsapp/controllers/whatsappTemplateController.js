const { WhatsAppTemplate, WhatsAppLog, User } = require('../../../database/models');
const logger = require('../../../shared/utils/logger');

/**
 * Get all WhatsApp templates
 * GET /api/whatsapp/templates
 */
const getTemplates = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    
    const where = {};
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const templates = await WhatsAppTemplate.findAll({
      where,
      order: [['isSystem', 'DESC'], ['category', 'ASC'], ['name', 'ASC']],
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
      ],
    });

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    logger.error('Error getting WhatsApp templates:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener plantillas',
      error: error.message,
    });
  }
};

/**
 * Get a template by ID
 * GET /api/whatsapp/templates/:id
 */
const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await WhatsAppTemplate.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
      ],
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada',
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    logger.error('Error getting WhatsApp template:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener plantilla',
      error: error.message,
    });
  }
};

/**
 * Get a template by code
 * GET /api/whatsapp/templates/code/:code
 */
const getTemplateByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const template = await WhatsAppTemplate.findOne({
      where: { code },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
      ],
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada',
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    logger.error('Error getting WhatsApp template by code:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener plantilla',
      error: error.message,
    });
  }
};

/**
 * Create a new template
 * POST /api/whatsapp/templates
 */
const createTemplate = async (req, res) => {
  try {
    const { code, name, message, variables, category } = req.body;

    if (!code || !name || !message) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: code, name, message',
      });
    }

    // Check if code already exists
    const existing = await WhatsAppTemplate.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una plantilla con ese código',
      });
    }

    const template = await WhatsAppTemplate.create({
      code: code.toUpperCase(),
      name,
      message,
      variables: variables || [],
      category: category || 'NOTIFICATION',
      isSystem: false,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Plantilla creada exitosamente',
      data: template,
    });
  } catch (error) {
    logger.error('Error creating WhatsApp template:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear plantilla',
      error: error.message,
    });
  }
};

/**
 * Update a template
 * PUT /api/whatsapp/templates/:id
 */
const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message, variables, category, isActive } = req.body;

    const template = await WhatsAppTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada',
      });
    }

    await template.update({
      name: name || template.name,
      message: message || template.message,
      variables: variables !== undefined ? variables : template.variables,
      category: category || template.category,
      isActive: isActive !== undefined ? isActive : template.isActive,
      updatedBy: req.user.id,
    });

    res.json({
      success: true,
      message: 'Plantilla actualizada',
      data: template,
    });
  } catch (error) {
    logger.error('Error updating WhatsApp template:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar plantilla',
      error: error.message,
    });
  }
};

/**
 * Delete a template (only custom templates)
 * DELETE /api/whatsapp/templates/:id
 */
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await WhatsAppTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada',
      });
    }

    if (template.isSystem) {
      return res.status(400).json({
        success: false,
        message: 'No se pueden eliminar plantillas del sistema',
      });
    }

    await template.destroy();
    res.json({
      success: true,
      message: 'Plantilla eliminada',
    });
  } catch (error) {
    logger.error('Error deleting WhatsApp template:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar plantilla',
      error: error.message,
    });
  }
};

/**
 * Get WhatsApp message logs
 * GET /api/whatsapp/logs
 */
const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, templateCode } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (templateCode) where.templateCode = templateCode;

    const { count, rows } = await WhatsAppLog.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        { model: WhatsAppTemplate, as: 'template', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'sender', attributes: ['id', 'username'] },
      ],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Error getting WhatsApp logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial',
      error: error.message,
    });
  }
};

/**
 * Get log statistics
 * GET /api/whatsapp/logs/stats
 */
const getLogStats = async (req, res) => {
  try {
    const { sequelize } = require('../../../database/models');
    
    const stats = await WhatsAppLog.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
    });

    const byTemplate = await WhatsAppLog.findAll({
      attributes: [
        'templateCode',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: { templateCode: { [sequelize.Sequelize.Op.ne]: null } },
      group: ['templateCode'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
    });

    res.json({
      success: true,
      data: {
        byStatus: stats,
        byTemplate: byTemplate,
      },
    });
  } catch (error) {
    logger.error('Error getting WhatsApp log stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message,
    });
  }
};

/**
 * Preview a template with variables
 * POST /api/whatsapp/templates/:id/preview
 */
const previewTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { variables = {} } = req.body;

    const template = await WhatsAppTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada',
      });
    }

    // Replace variables in message
    let previewMessage = template.message;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      previewMessage = previewMessage.replace(regex, variables[key]);
    });

    res.json({
      success: true,
      data: {
        original: template.message,
        preview: previewMessage,
        variables: template.variables,
      },
    });
  } catch (error) {
    logger.error('Error previewing WhatsApp template:', error);
    res.status(500).json({
      success: false,
      message: 'Error al previsualizar plantilla',
      error: error.message,
    });
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  getTemplateByCode,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getLogs,
  getLogStats,
  previewTemplate,
};
