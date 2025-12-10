const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const path = require('path');
const fs = require('fs');
const logger = require('../../../shared/utils/logger');

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
    const message = `🔐 Tu código de verificación para ERP es: *${code}*\n\nEste código expira en 10 minutos.\n\n_No compartas este código con nadie._`;
    return this.sendMessage(phoneNumber, message);
  }
}

// Singleton instance
const whatsappService = new WhatsAppService();

module.exports = whatsappService;
