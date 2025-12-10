const models = require('../../../database/models');
const emailService = require('../services/emailService');

const { EmailConfig, EmailTemplate, EmailLog, User } = models;

/**
 * Obtener configuración de email activa
 */
const getConfig = async (req, res) => {
  try {
    const config = await EmailConfig.findOne({
      where: { isActive: true },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
      ],
    });

    if (!config) {
      return res.json({
        configured: false,
        config: null,
      });
    }

    // No enviar la contraseña
    const configData = config.toJSON();
    configData.smtpPassword = '********';

    res.json({
      configured: true,
      config: configData,
    });
  } catch (error) {
    console.error('Error obteniendo configuración de email:', error);
    res.status(500).json({ message: 'Error al obtener configuración', error: error.message });
  }
};

/**
 * Guardar o actualizar configuración de email
 */
const saveConfig = async (req, res) => {
  try {
    const {
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser,
      smtpPassword,
      fromEmail,
      fromName,
    } = req.body;

    // Validaciones
    if (!smtpHost || !smtpPort || !smtpUser || !fromEmail) {
      return res.status(400).json({
        message: 'Faltan campos requeridos: smtpHost, smtpPort, smtpUser, fromEmail',
      });
    }

    // Buscar configuración existente
    let config = await EmailConfig.findOne({ where: { isActive: true } });

    const configData = {
      smtpHost,
      smtpPort: parseInt(smtpPort),
      smtpSecure: smtpSecure || false,
      smtpUser,
      fromEmail,
      fromName: fromName || 'ERP System',
      updatedBy: req.user.id,
    };

    // Solo actualizar contraseña si se proporciona una nueva
    if (smtpPassword && smtpPassword !== '********') {
      configData.smtpPassword = smtpPassword;
    }

    if (config) {
      await config.update(configData);
    } else {
      if (!smtpPassword || smtpPassword === '********') {
        return res.status(400).json({ message: 'La contraseña SMTP es requerida' });
      }
      configData.smtpPassword = smtpPassword;
      configData.createdBy = req.user.id;
      config = await EmailConfig.create(configData);
    }

    // Recargar servicio de email
    await emailService.reloadConfig();

    // No enviar la contraseña
    const responseData = config.toJSON();
    responseData.smtpPassword = '********';

    res.json({
      message: 'Configuración guardada exitosamente',
      config: responseData,
    });
  } catch (error) {
    console.error('Error guardando configuración de email:', error);
    res.status(500).json({ message: 'Error al guardar configuración', error: error.message });
  }
};

/**
 * Probar conexión SMTP
 */
const testConnection = async (req, res) => {
  try {
    const result = await emailService.testConnection();
    
    if (result.success) {
      res.json({ success: true, message: 'Conexión SMTP exitosa' });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error probando conexión SMTP:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Enviar correo de prueba
 */
const sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El email es requerido' });
    }

    const result = await emailService.sendTestEmail(email);
    res.json({ success: true, message: 'Correo de prueba enviado', messageId: result.messageId });
  } catch (error) {
    console.error('Error enviando correo de prueba:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtener todas las plantillas
 */
const getTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.findAll({
      order: [['isSystem', 'DESC'], ['name', 'ASC']],
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
      ],
    });

    res.json(templates);
  } catch (error) {
    console.error('Error obteniendo plantillas:', error);
    res.status(500).json({ message: 'Error al obtener plantillas', error: error.message });
  }
};

/**
 * Obtener una plantilla por ID
 */
const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await EmailTemplate.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'updater', attributes: ['id', 'username'] },
      ],
    });

    if (!template) {
      return res.status(404).json({ message: 'Plantilla no encontrada' });
    }

    res.json(template);
  } catch (error) {
    console.error('Error obteniendo plantilla:', error);
    res.status(500).json({ message: 'Error al obtener plantilla', error: error.message });
  }
};

/**
 * Actualizar una plantilla
 */
const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, bodyHtml, bodyText, isActive } = req.body;

    const template = await EmailTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: 'Plantilla no encontrada' });
    }

    await template.update({
      name: name || template.name,
      subject: subject || template.subject,
      bodyHtml: bodyHtml || template.bodyHtml,
      bodyText: bodyText !== undefined ? bodyText : template.bodyText,
      isActive: isActive !== undefined ? isActive : template.isActive,
      updatedBy: req.user.id,
    });

    res.json({ message: 'Plantilla actualizada', template });
  } catch (error) {
    console.error('Error actualizando plantilla:', error);
    res.status(500).json({ message: 'Error al actualizar plantilla', error: error.message });
  }
};

/**
 * Crear una plantilla personalizada
 */
const createTemplate = async (req, res) => {
  try {
    const { code, name, subject, bodyHtml, bodyText, variables } = req.body;

    if (!code || !name || !subject || !bodyHtml) {
      return res.status(400).json({
        message: 'Faltan campos requeridos: code, name, subject, bodyHtml',
      });
    }

    // Verificar que el código no exista
    const existing = await EmailTemplate.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({ message: 'Ya existe una plantilla con ese código' });
    }

    const template = await EmailTemplate.create({
      code,
      name,
      subject,
      bodyHtml,
      bodyText,
      variables: variables || [],
      isSystem: false,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: 'Plantilla creada', template });
  } catch (error) {
    console.error('Error creando plantilla:', error);
    res.status(500).json({ message: 'Error al crear plantilla', error: error.message });
  }
};

/**
 * Eliminar una plantilla (solo personalizadas)
 */
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await EmailTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: 'Plantilla no encontrada' });
    }

    if (template.isSystem) {
      return res.status(400).json({ message: 'No se pueden eliminar plantillas del sistema' });
    }

    await template.destroy();
    res.json({ message: 'Plantilla eliminada' });
  } catch (error) {
    console.error('Error eliminando plantilla:', error);
    res.status(500).json({ message: 'Error al eliminar plantilla', error: error.message });
  }
};

/**
 * Obtener historial de correos
 */
const getEmailLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, templateCode } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (templateCode) where.templateCode = templateCode;

    const { count, rows } = await EmailLog.findAndCountAll({
      where,
      include: [
        { model: EmailTemplate, as: 'template', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'username'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      logs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error obteniendo historial de correos:', error);
    res.status(500).json({ message: 'Error al obtener historial', error: error.message });
  }
};

/**
 * Obtener estadísticas de correos
 */
const getEmailStats = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalSent, totalFailed, sentToday, templates] = await Promise.all([
      EmailLog.count({ where: { status: 'SENT' } }),
      EmailLog.count({ where: { status: 'FAILED' } }),
      EmailLog.count({
        where: {
          status: 'SENT',
          sentAt: { [Op.gte]: today },
        },
      }),
      EmailTemplate.count({ where: { isActive: true } }),
    ]);

    res.json({
      totalSent,
      totalFailed,
      sentToday,
      activeTemplates: templates,
      successRate: totalSent + totalFailed > 0 
        ? ((totalSent / (totalSent + totalFailed)) * 100).toFixed(1) 
        : 100,
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

module.exports = {
  getConfig,
  saveConfig,
  testConnection,
  sendTestEmail,
  getTemplates,
  getTemplateById,
  updateTemplate,
  createTemplate,
  deleteTemplate,
  getEmailLogs,
  getEmailStats,
};
