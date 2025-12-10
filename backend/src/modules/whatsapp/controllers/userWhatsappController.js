const whatsappService = require('../services/whatsappService');
const logger = require('../../../shared/utils/logger');

// Will be set after models are initialized
let UserWhatsApp = null;

const setModels = (models) => {
  UserWhatsApp = models.UserWhatsApp;
};

/**
 * Get user's WhatsApp configuration
 * GET /api/whatsapp/user/config
 */
const getUserConfig = async (req, res) => {
  try {
    const userId = req.user.id;

    let config = await UserWhatsApp.findOne({
      where: { userId },
    });

    res.json({
      success: true,
      data: config ? {
        phoneNumber: config.phoneNumber,
        countryCode: config.countryCode,
        isVerified: config.isVerified,
        verifiedAt: config.verifiedAt,
        notificationsEnabled: config.notificationsEnabled,
      } : null,
    });
  } catch (error) {
    logger.error('Error getting user WhatsApp config:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener configuración de WhatsApp',
      error: error.message,
    });
  }
};

/**
 * Request verification code
 * POST /api/whatsapp/user/request-verification
 */
const requestVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phoneNumber, countryCode = '+58' } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere número de teléfono',
      });
    }

    // Check if WhatsApp service is connected
    const waStatus = whatsappService.getStatus();
    if (!waStatus.isConnected) {
      return res.status(503).json({
        success: false,
        message: 'El servicio de WhatsApp no está disponible. Contacte al administrador.',
      });
    }

    // Format full phone number
    const fullNumber = `${countryCode}${phoneNumber}`.replace(/[^0-9+]/g, '');

    // Check if number has WhatsApp
    const numberCheck = await whatsappService.checkNumberExists(fullNumber);
    if (!numberCheck.exists) {
      return res.status(400).json({
        success: false,
        message: 'Este número no tiene WhatsApp activo',
      });
    }

    // Generate verification code
    const verificationCode = whatsappService.generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create or update user WhatsApp config
    let config = await UserWhatsApp.findOne({ where: { userId } });
    
    if (config) {
      await config.update({
        phoneNumber,
        countryCode,
        verificationCode,
        verificationExpires,
        isVerified: false,
        verifiedAt: null,
      });
    } else {
      config = await UserWhatsApp.create({
        userId,
        phoneNumber,
        countryCode,
        verificationCode,
        verificationExpires,
      });
    }

    // Send verification code via WhatsApp
    await whatsappService.sendVerificationCode(fullNumber, verificationCode);

    res.json({
      success: true,
      message: 'Código de verificación enviado a tu WhatsApp',
      data: {
        phoneNumber,
        countryCode,
        expiresAt: verificationExpires,
      },
    });
  } catch (error) {
    logger.error('Error requesting verification:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar código de verificación',
      error: error.message,
    });
  }
};

/**
 * Verify code
 * POST /api/whatsapp/user/verify
 */
const verifyCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere código de verificación',
      });
    }

    const config = await UserWhatsApp.findOne({ where: { userId } });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'No hay solicitud de verificación pendiente',
      });
    }

    if (config.isVerified) {
      return res.json({
        success: true,
        message: 'El número ya está verificado',
        data: {
          isVerified: true,
          verifiedAt: config.verifiedAt,
        },
      });
    }

    // Check if code expired
    if (new Date() > new Date(config.verificationExpires)) {
      return res.status(400).json({
        success: false,
        message: 'El código ha expirado. Solicita uno nuevo.',
      });
    }

    // Verify code
    if (config.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Código incorrecto',
      });
    }

    // Mark as verified
    await config.update({
      isVerified: true,
      verifiedAt: new Date(),
      verificationCode: null,
      verificationExpires: null,
    });

    res.json({
      success: true,
      message: 'Número verificado exitosamente',
      data: {
        isVerified: true,
        verifiedAt: config.verifiedAt,
        phoneNumber: config.phoneNumber,
        countryCode: config.countryCode,
      },
    });
  } catch (error) {
    logger.error('Error verifying code:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar código',
      error: error.message,
    });
  }
};

/**
 * Update notification preferences
 * PUT /api/whatsapp/user/notifications
 */
const updateNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled } = req.body;

    const config = await UserWhatsApp.findOne({ where: { userId } });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'No hay configuración de WhatsApp',
      });
    }

    await config.update({ notificationsEnabled: enabled });

    res.json({
      success: true,
      message: `Notificaciones ${enabled ? 'activadas' : 'desactivadas'}`,
      data: {
        notificationsEnabled: config.notificationsEnabled,
      },
    });
  } catch (error) {
    logger.error('Error updating notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar preferencias',
      error: error.message,
    });
  }
};

/**
 * Remove WhatsApp configuration
 * DELETE /api/whatsapp/user/config
 */
const removeConfig = async (req, res) => {
  try {
    const userId = req.user.id;

    const config = await UserWhatsApp.findOne({ where: { userId } });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'No hay configuración de WhatsApp',
      });
    }

    await config.destroy();

    res.json({
      success: true,
      message: 'Configuración de WhatsApp eliminada',
    });
  } catch (error) {
    logger.error('Error removing config:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar configuración',
      error: error.message,
    });
  }
};

module.exports = {
  setModels,
  getUserConfig,
  requestVerification,
  verifyCode,
  updateNotifications,
  removeConfig,
};
