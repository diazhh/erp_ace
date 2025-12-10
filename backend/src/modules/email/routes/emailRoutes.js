const express = require('express');
const router = express.Router();
const authenticate = require('../../auth/middleware/authenticate');
const { authorizeAny } = require('../../auth/middleware/authorize');
const emailConfigController = require('../controllers/emailConfigController');
const userEmailController = require('../controllers/userEmailController');

// ========== RUTAS DE ADMINISTRACIÓN (requieren permisos) ==========

// Configuración SMTP
router.get(
  '/config',
  authenticate,
  authorizeAny('email:read', 'email:manage', 'email:*', '*:*'),
  emailConfigController.getConfig
);

router.post(
  '/config',
  authenticate,
  authorizeAny('email:manage', 'email:*', '*:*'),
  emailConfigController.saveConfig
);

router.post(
  '/config/test',
  authenticate,
  authorizeAny('email:manage', 'email:*', '*:*'),
  emailConfigController.testConnection
);

router.post(
  '/config/test-email',
  authenticate,
  authorizeAny('email:manage', 'email:*', '*:*'),
  emailConfigController.sendTestEmail
);

// Plantillas
router.get(
  '/templates',
  authenticate,
  authorizeAny('email:read', 'email:manage', 'email:*', '*:*'),
  emailConfigController.getTemplates
);

router.get(
  '/templates/:id',
  authenticate,
  authorizeAny('email:read', 'email:manage', 'email:*', '*:*'),
  emailConfigController.getTemplateById
);

router.post(
  '/templates',
  authenticate,
  authorizeAny('email:manage', 'email:*', '*:*'),
  emailConfigController.createTemplate
);

router.put(
  '/templates/:id',
  authenticate,
  authorizeAny('email:manage', 'email:*', '*:*'),
  emailConfigController.updateTemplate
);

router.delete(
  '/templates/:id',
  authenticate,
  authorizeAny('email:manage', 'email:*', '*:*'),
  emailConfigController.deleteTemplate
);

// Historial y estadísticas
router.get(
  '/logs',
  authenticate,
  authorizeAny('email:read', 'email:manage', 'email:*', '*:*'),
  emailConfigController.getEmailLogs
);

router.get(
  '/stats',
  authenticate,
  authorizeAny('email:read', 'email:manage', 'email:*', '*:*'),
  emailConfigController.getEmailStats
);

// ========== RUTAS DE USUARIO (cualquier usuario autenticado) ==========

// Configuración de email del usuario
router.get('/me', authenticate, userEmailController.getMyEmailConfig);
router.post('/me', authenticate, userEmailController.setMyEmail);
router.post('/me/verify', authenticate, userEmailController.verifyMyEmail);
router.post('/me/resend', authenticate, userEmailController.resendVerificationCode);
router.put('/me/notifications', authenticate, userEmailController.updateNotificationPreferences);
router.delete('/me', authenticate, userEmailController.removeMyEmail);

module.exports = router;
