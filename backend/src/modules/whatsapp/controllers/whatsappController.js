const whatsappService = require('../services/whatsappService');
const logger = require('../../../shared/utils/logger');

/**
 * Get WhatsApp connection status
 * GET /api/whatsapp/status
 */
const getStatus = async (req, res) => {
  try {
    const status = whatsappService.getStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    logger.error('Error getting WhatsApp status:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estado de WhatsApp',
      error: error.message,
    });
  }
};

/**
 * Connect to WhatsApp (generates QR code)
 * POST /api/whatsapp/connect
 */
const connect = async (req, res) => {
  try {
    const currentStatus = whatsappService.getStatus();
    
    if (currentStatus.status === 'connected') {
      return res.json({
        success: true,
        message: 'WhatsApp ya está conectado',
        data: currentStatus,
      });
    }

    if (currentStatus.status === 'connecting' || currentStatus.status === 'qr_pending') {
      return res.json({
        success: true,
        message: 'Conexión en progreso',
        data: currentStatus,
      });
    }

    await whatsappService.connect();
    
    // Wait a bit for QR code generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const status = whatsappService.getStatus();
    res.json({
      success: true,
      message: status.qrCode ? 'Escanea el código QR con WhatsApp' : 'Conectando...',
      data: status,
    });
  } catch (error) {
    logger.error('Error connecting to WhatsApp:', error);
    res.status(500).json({
      success: false,
      message: 'Error al conectar con WhatsApp',
      error: error.message,
    });
  }
};

/**
 * Disconnect from WhatsApp
 * POST /api/whatsapp/disconnect
 */
const disconnect = async (req, res) => {
  try {
    await whatsappService.disconnect();
    res.json({
      success: true,
      message: 'WhatsApp desconectado exitosamente',
    });
  } catch (error) {
    logger.error('Error disconnecting from WhatsApp:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desconectar WhatsApp',
      error: error.message,
    });
  }
};

/**
 * Send a test message
 * POST /api/whatsapp/test-message
 */
const sendTestMessage = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere número de teléfono y mensaje',
      });
    }

    const result = await whatsappService.sendMessage(phoneNumber, message);
    res.json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error('Error sending test message:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar mensaje',
      error: error.message,
    });
  }
};

/**
 * Check if a phone number has WhatsApp
 * POST /api/whatsapp/check-number
 */
const checkNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere número de teléfono',
      });
    }

    const result = await whatsappService.checkNumberExists(phoneNumber);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error checking phone number:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar número',
      error: error.message,
    });
  }
};

module.exports = {
  getStatus,
  connect,
  disconnect,
  sendTestMessage,
  checkNumber,
};
