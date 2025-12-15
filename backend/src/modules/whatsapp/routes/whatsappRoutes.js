const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const userWhatsappController = require('../controllers/userWhatsappController');
const whatsappTemplateController = require('../controllers/whatsappTemplateController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize, authorizeAny } = require('../../auth/middleware/authorize');

// ============================================
// ADMIN ROUTES - WhatsApp Session Management
// ============================================

// Get WhatsApp connection status
router.get('/status', authenticate, authorize('whatsapp:read'), whatsappController.getStatus);

// Connect to WhatsApp (generates QR)
router.post('/connect', authenticate, authorize('whatsapp:manage'), whatsappController.connect);

// Disconnect from WhatsApp
router.post('/disconnect', authenticate, authorize('whatsapp:manage'), whatsappController.disconnect);

// Send test message
router.post('/test-message', authenticate, authorize('whatsapp:manage'), whatsappController.sendTestMessage);

// Check if phone number has WhatsApp
router.post('/check-number', authenticate, authorize('whatsapp:manage'), whatsappController.checkNumber);

// ============================================
// USER ROUTES - Personal WhatsApp Configuration
// ============================================

// Get user's WhatsApp configuration
router.get('/user/config', authenticate, userWhatsappController.getUserConfig);

// Request verification code
router.post('/user/request-verification', authenticate, userWhatsappController.requestVerification);

// Verify code
router.post('/user/verify', authenticate, userWhatsappController.verifyCode);

// Update notification preferences
router.put('/user/notifications', authenticate, userWhatsappController.updateNotifications);

// Remove WhatsApp configuration
router.delete('/user/config', authenticate, userWhatsappController.removeConfig);

// ============================================
// TEMPLATE ROUTES - WhatsApp Message Templates
// ============================================

// Get all templates
router.get(
  '/templates',
  authenticate,
  authorizeAny('whatsapp:read', 'whatsapp:manage', 'whatsapp:*', '*:*'),
  whatsappTemplateController.getTemplates
);

// Get template by ID
router.get(
  '/templates/:id',
  authenticate,
  authorizeAny('whatsapp:read', 'whatsapp:manage', 'whatsapp:*', '*:*'),
  whatsappTemplateController.getTemplateById
);

// Get template by code
router.get(
  '/templates/code/:code',
  authenticate,
  authorizeAny('whatsapp:read', 'whatsapp:manage', 'whatsapp:*', '*:*'),
  whatsappTemplateController.getTemplateByCode
);

// Create template
router.post(
  '/templates',
  authenticate,
  authorizeAny('whatsapp:manage', 'whatsapp:*', '*:*'),
  whatsappTemplateController.createTemplate
);

// Update template
router.put(
  '/templates/:id',
  authenticate,
  authorizeAny('whatsapp:manage', 'whatsapp:*', '*:*'),
  whatsappTemplateController.updateTemplate
);

// Delete template
router.delete(
  '/templates/:id',
  authenticate,
  authorizeAny('whatsapp:manage', 'whatsapp:*', '*:*'),
  whatsappTemplateController.deleteTemplate
);

// Preview template with variables
router.post(
  '/templates/:id/preview',
  authenticate,
  authorizeAny('whatsapp:read', 'whatsapp:manage', 'whatsapp:*', '*:*'),
  whatsappTemplateController.previewTemplate
);

// ============================================
// LOG ROUTES - WhatsApp Message History
// ============================================

// Get message logs
router.get(
  '/logs',
  authenticate,
  authorizeAny('whatsapp:read', 'whatsapp:manage', 'whatsapp:*', '*:*'),
  whatsappTemplateController.getLogs
);

// Get log statistics
router.get(
  '/logs/stats',
  authenticate,
  authorizeAny('whatsapp:read', 'whatsapp:manage', 'whatsapp:*', '*:*'),
  whatsappTemplateController.getLogStats
);

module.exports = router;
