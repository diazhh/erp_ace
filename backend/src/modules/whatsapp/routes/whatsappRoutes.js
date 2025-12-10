const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const userWhatsappController = require('../controllers/userWhatsappController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

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

module.exports = router;
