const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const path = require('path');
const fs = require('fs');
const logger = require('../../../shared/utils/logger');
const { WhatsAppTemplate, WhatsAppLog } = require('../../../database/models');

class WhatsAppService {
  constructor() {
    this.socket = null;
    this.qrCode = null;
    this.status = 'disconnected';
    this.phoneNumber = null;
    this.name = null;
    this.authFolder = path.join(process.cwd(), 'whatsapp-auth');
    this.eventListeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Get current connection status
   */
  getStatus() {
    return {
      status: this.status,
      qrCode: this.qrCode,
      phoneNumber: this.phoneNumber,
      name: this.name,
      isConnected: this.status === 'connected',
    };
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  /**
   * Initialize and connect to WhatsApp
   */
  async connect() {
    try {
      // Ensure auth folder exists
      if (!fs.existsSync(this.authFolder)) {
        fs.mkdirSync(this.authFolder, { recursive: true });
      }

      this.status = 'connecting';
      this.qrCode = null;
      this.emit('status', { status: 'connecting' });

      const { state, saveCreds } = await useMultiFileAuthState(this.authFolder);
      const { version } = await fetchLatestBaileysVersion();

      this.socket = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        browser: ['ERP System', 'Chrome', '120.0.0'],
        syncFullHistory: false,
        markOnlineOnConnect: true,
      });

      // Handle connection updates
      this.socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrCode = qr;
          this.status = 'qr_pending';
          logger.info('WhatsApp QR code generated');
          this.emit('qr', qr);
          this.emit('status', { status: 'qr_pending', qrCode: qr });
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error instanceof Boom)
            ? lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut
            : true;

          const statusCode = lastDisconnect?.error?.output?.statusCode;
          logger.info(`WhatsApp connection closed. Status: ${statusCode}. Reconnect: ${shouldReconnect}`);

          this.status = 'disconnected';
          this.qrCode = null;
          this.emit('status', { status: 'disconnected' });

          if (shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), 5000);
          } else if (statusCode === DisconnectReason.loggedOut) {
            logger.info('WhatsApp logged out. Clearing auth data...');
            await this.clearAuthData();
          }
        } else if (connection === 'open') {
          this.status = 'connected';
          this.qrCode = null;
          this.reconnectAttempts = 0;

          // Get user info
          const user = this.socket.user;
          if (user) {
            this.phoneNumber = user.id.split(':')[0].split('@')[0];
            this.name = user.name || user.verifiedName || 'Unknown';
          }

          logger.info(`WhatsApp connected as ${this.name} (${this.phoneNumber})`);
          this.emit('status', { 
            status: 'connected', 
            phoneNumber: this.phoneNumber, 
            name: this.name 
          });
        }
      });

      // Handle credentials update
      this.socket.ev.on('creds.update', saveCreds);

      // Handle incoming messages (for verification codes)
      this.socket.ev.on('messages.upsert', async (m) => {
        if (m.type === 'notify') {
          for (const msg of m.messages) {
            if (!msg.key.fromMe && msg.message) {
              this.emit('message', {
                from: msg.key.remoteJid,
                message: msg.message,
                timestamp: msg.messageTimestamp,
              });
            }
          }
        }
      });

      return { success: true, message: 'Connection initiated' };
    } catch (error) {
      logger.error('WhatsApp connection error:', error);
      this.status = 'disconnected';
      this.emit('status', { status: 'disconnected', error: error.message });
      throw error;
    }
  }

  /**
   * Disconnect from WhatsApp
   */
  async disconnect() {
    try {
      if (this.socket) {
        await this.socket.logout();
        this.socket = null;
      }
      this.status = 'disconnected';
      this.qrCode = null;
      this.phoneNumber = null;
      this.name = null;
      await this.clearAuthData();
      this.emit('status', { status: 'disconnected' });
      logger.info('WhatsApp disconnected and logged out');
      return { success: true, message: 'Disconnected successfully' };
    } catch (error) {
      logger.error('WhatsApp disconnect error:', error);
      throw error;
    }
  }

  /**
   * Clear auth data
   */
  async clearAuthData() {
    try {
      if (fs.existsSync(this.authFolder)) {
        fs.rmSync(this.authFolder, { recursive: true, force: true });
        logger.info('WhatsApp auth data cleared');
      }
    } catch (error) {
      logger.error('Error clearing auth data:', error);
    }
  }

  /**
   * Send a text message
   */
  async sendMessage(phoneNumber, message) {
    if (!this.socket || this.status !== 'connected') {
      throw new Error('WhatsApp is not connected');
    }

    try {
      // Format phone number (remove + and add @s.whatsapp.net)
      const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
      const jid = `${formattedNumber}@s.whatsapp.net`;

      const result = await this.socket.sendMessage(jid, { text: message });
      logger.info(`Message sent to ${phoneNumber}`);
      return { success: true, messageId: result.key.id };
    } catch (error) {
      logger.error(`Error sending message to ${phoneNumber}:`, error);
      throw error;
    }
  }

  /**
   * Check if a phone number has WhatsApp
   */
  async checkNumberExists(phoneNumber) {
    if (!this.socket || this.status !== 'connected') {
      throw new Error('WhatsApp is not connected');
    }

    try {
      const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
      const [result] = await this.socket.onWhatsApp(formattedNumber);
      return {
        exists: result?.exists || false,
        jid: result?.jid || null,
      };
    } catch (error) {
      logger.error(`Error checking number ${phoneNumber}:`, error);
      throw error;
    }
  }

  /**
   * Generate verification code
   */
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send verification code to a phone number
   */
  async sendVerificationCode(phoneNumber, code) {
    // Try to use template first, fallback to hardcoded message
    try {
      return await this.sendTemplateMessage('VERIFY_CODE', phoneNumber, null, { code });
    } catch (error) {
      // Fallback if template doesn't exist
      const message = `🔐 Tu código de verificación para ERP es: *${code}*\n\nEste código expira en 10 minutos.\n\n_No compartas este código con nadie._`;
      return this.sendMessage(phoneNumber, message);
    }
  }

  /**
   * Replace variables in a template message
   */
  replaceVariables(template, variables) {
    let result = template;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, variables[key] || '');
    });
    return result;
  }

  /**
   * Send a message using a template
   * @param {string} templateCode - Template code (e.g., 'WELCOME', 'REMINDER')
   * @param {string} phoneNumber - Recipient phone number
   * @param {string|null} toName - Recipient name (optional)
   * @param {object} variables - Variables to replace in template
   * @param {string|null} userId - User ID who triggered the send (optional)
   */
  async sendTemplateMessage(templateCode, phoneNumber, toName = null, variables = {}, userId = null) {
    if (!this.socket || this.status !== 'connected') {
      throw new Error('WhatsApp is not connected');
    }

    try {
      // Get template
      const template = await WhatsAppTemplate.findOne({
        where: { code: templateCode, isActive: true },
      });

      if (!template) {
        throw new Error(`Plantilla ${templateCode} no encontrada o inactiva`);
      }

      // Default variables
      const defaultVars = {
        appName: process.env.APP_NAME || 'ERP System',
        year: new Date().getFullYear().toString(),
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };

      const allVariables = { ...defaultVars, ...variables };

      // Replace variables in message
      const finalMessage = this.replaceVariables(template.message, allVariables);

      // Create log entry
      const log = await WhatsAppLog.create({
        templateId: template.id,
        templateCode: templateCode,
        toPhone: phoneNumber,
        toName: toName,
        message: finalMessage,
        status: 'PENDING',
        metadata: { variables: allVariables },
        sentBy: userId,
      });

      // Send message
      const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
      const jid = `${formattedNumber}@s.whatsapp.net`;

      const result = await this.socket.sendMessage(jid, { text: finalMessage });

      // Update log
      await log.update({
        status: 'SENT',
        messageId: result.key.id,
        sentAt: new Date(),
      });

      logger.info(`Template message sent to ${phoneNumber}: ${templateCode}`);
      return { success: true, messageId: result.key.id, logId: log.id };
    } catch (error) {
      logger.error(`Error sending template message to ${phoneNumber}:`, error);

      // Update log if exists
      const log = await WhatsAppLog.findOne({
        where: { toPhone: phoneNumber, status: 'PENDING' },
        order: [['createdAt', 'DESC']],
      });

      if (log) {
        await log.update({
          status: 'FAILED',
          error: error.message,
        });
      }

      throw error;
    }
  }

  /**
   * Send a message and log it (without template)
   */
  async sendMessageWithLog(phoneNumber, message, toName = null, userId = null) {
    if (!this.socket || this.status !== 'connected') {
      throw new Error('WhatsApp is not connected');
    }

    try {
      // Create log entry
      const log = await WhatsAppLog.create({
        toPhone: phoneNumber,
        toName: toName,
        message: message,
        status: 'PENDING',
        sentBy: userId,
      });

      // Send message
      const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
      const jid = `${formattedNumber}@s.whatsapp.net`;

      const result = await this.socket.sendMessage(jid, { text: message });

      // Update log
      await log.update({
        status: 'SENT',
        messageId: result.key.id,
        sentAt: new Date(),
      });

      logger.info(`Message sent to ${phoneNumber}`);
      return { success: true, messageId: result.key.id, logId: log.id };
    } catch (error) {
      logger.error(`Error sending message to ${phoneNumber}:`, error);

      const log = await WhatsAppLog.findOne({
        where: { toPhone: phoneNumber, status: 'PENDING' },
        order: [['createdAt', 'DESC']],
      });

      if (log) {
        await log.update({
          status: 'FAILED',
          error: error.message,
        });
      }

      throw error;
    }
  }
}

// Singleton instance
const whatsappService = new WhatsAppService();

module.exports = whatsappService;
