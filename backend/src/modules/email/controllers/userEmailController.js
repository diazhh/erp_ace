const models = require('../../../database/models');
const emailService = require('../services/emailService');

const { UserEmail, User } = models;

/**
 * Obtener configuración de email del usuario actual
 */
const getMyEmailConfig = async (req, res) => {
  try {
    const userEmail = await UserEmail.findOne({
      where: { userId: req.user.id },
    });

    if (!userEmail) {
      return res.json({
        configured: false,
        email: null,
        isVerified: false,
        notificationsEnabled: true,
      });
    }

    res.json({
      configured: true,
      email: userEmail.email,
      isVerified: userEmail.isVerified,
      verifiedAt: userEmail.verifiedAt,
      notificationsEnabled: userEmail.notificationsEnabled,
      lastEmailSentAt: userEmail.lastEmailSentAt,
    });
  } catch (error) {
    console.error('Error obteniendo configuración de email:', error);
    res.status(500).json({ message: 'Error al obtener configuración', error: error.message });
  }
};

/**
 * Configurar email del usuario
 */
const setMyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El email es requerido' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Obtener nombre del usuario
    const user = await User.findByPk(req.user.id, {
      include: [{ model: models.Employee, as: 'employee' }],
    });

    const userName = user.employee 
      ? `${user.employee.firstName} ${user.employee.lastName}` 
      : user.username;

    // Enviar código de verificación
    const result = await emailService.sendVerificationEmail(req.user.id, email, userName);

    res.json({
      message: 'Código de verificación enviado',
      email,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error('Error configurando email:', error);
    res.status(500).json({ message: 'Error al configurar email', error: error.message });
  }
};

/**
 * Verificar código de email
 */
const verifyMyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'El código es requerido' });
    }

    const result = await emailService.verifyEmailCode(req.user.id, code);

    res.json({
      message: 'Email verificado exitosamente',
      email: result.email,
    });
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Reenviar código de verificación
 */
const resendVerificationCode = async (req, res) => {
  try {
    const userEmail = await UserEmail.findOne({
      where: { userId: req.user.id },
    });

    if (!userEmail) {
      return res.status(400).json({ message: 'No hay email configurado' });
    }

    if (userEmail.isVerified) {
      return res.status(400).json({ message: 'El email ya está verificado' });
    }

    // Obtener nombre del usuario
    const user = await User.findByPk(req.user.id, {
      include: [{ model: models.Employee, as: 'employee' }],
    });

    const userName = user.employee 
      ? `${user.employee.firstName} ${user.employee.lastName}` 
      : user.username;

    // Enviar nuevo código
    const result = await emailService.sendVerificationEmail(
      req.user.id, 
      userEmail.email, 
      userName
    );

    res.json({
      message: 'Código de verificación reenviado',
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error('Error reenviando código:', error);
    res.status(500).json({ message: 'Error al reenviar código', error: error.message });
  }
};

/**
 * Actualizar preferencias de notificaciones
 */
const updateNotificationPreferences = async (req, res) => {
  try {
    const { notificationsEnabled } = req.body;

    if (notificationsEnabled === undefined) {
      return res.status(400).json({ message: 'notificationsEnabled es requerido' });
    }

    const userEmail = await UserEmail.findOne({
      where: { userId: req.user.id },
    });

    if (!userEmail) {
      return res.status(400).json({ message: 'No hay email configurado' });
    }

    await userEmail.update({ notificationsEnabled });

    res.json({
      message: 'Preferencias actualizadas',
      notificationsEnabled,
    });
  } catch (error) {
    console.error('Error actualizando preferencias:', error);
    res.status(500).json({ message: 'Error al actualizar preferencias', error: error.message });
  }
};

/**
 * Eliminar configuración de email del usuario
 */
const removeMyEmail = async (req, res) => {
  try {
    const userEmail = await UserEmail.findOne({
      where: { userId: req.user.id },
    });

    if (!userEmail) {
      return res.status(400).json({ message: 'No hay email configurado' });
    }

    await userEmail.destroy();

    res.json({ message: 'Configuración de email eliminada' });
  } catch (error) {
    console.error('Error eliminando configuración:', error);
    res.status(500).json({ message: 'Error al eliminar configuración', error: error.message });
  }
};

module.exports = {
  getMyEmailConfig,
  setMyEmail,
  verifyMyEmail,
  resendVerificationCode,
  updateNotificationPreferences,
  removeMyEmail,
};
