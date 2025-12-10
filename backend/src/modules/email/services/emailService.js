const nodemailer = require('nodemailer');
const models = require('../../../database/models');

const { EmailConfig, EmailTemplate, UserEmail, EmailLog } = models;

class EmailService {
  constructor() {
    this.transporter = null;
    this.config = null;
  }

  /**
   * Inicializa el transporter con la configuración activa
   */
  async initialize() {
    try {
      this.config = await EmailConfig.findOne({
        where: { isActive: true },
        order: [['createdAt', 'DESC']],
      });

      if (!this.config) {
        console.log('⚠️ No hay configuración de email activa');
        return false;
      }

      this.transporter = nodemailer.createTransport({
        host: this.config.smtpHost,
        port: this.config.smtpPort,
        secure: this.config.smtpSecure,
        auth: {
          user: this.config.smtpUser,
          pass: this.config.smtpPassword,
        },
      });

      console.log('✅ Servicio de email inicializado');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando servicio de email:', error);
      return false;
    }
  }

  /**
   * Verifica la conexión SMTP
   */
  async testConnection() {
    try {
      if (!this.transporter) {
        await this.initialize();
      }

      if (!this.transporter) {
        throw new Error('No hay configuración de email activa');
      }

      await this.transporter.verify();
      
      // Actualizar estado de prueba
      if (this.config) {
        await this.config.update({
          lastTestedAt: new Date(),
          lastTestResult: true,
          lastTestError: null,
        });
      }

      return { success: true, message: 'Conexión SMTP exitosa' };
    } catch (error) {
      // Actualizar estado de prueba
      if (this.config) {
        await this.config.update({
          lastTestedAt: new Date(),
          lastTestResult: false,
          lastTestError: error.message,
        });
      }

      return { success: false, message: error.message };
    }
  }

  /**
   * Genera un código de verificación de 6 dígitos
   */
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Reemplaza variables en una plantilla
   */
  replaceVariables(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    }
    return result;
  }

  /**
   * Envía un correo usando una plantilla
   */
  async sendTemplateEmail(templateCode, toEmail, toName, variables = {}) {
    try {
      if (!this.transporter) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('No hay configuración de email activa');
        }
      }

      // Obtener plantilla
      const template = await EmailTemplate.findOne({
        where: { code: templateCode, isActive: true },
      });

      if (!template) {
        throw new Error(`Plantilla ${templateCode} no encontrada o inactiva`);
      }

      // Variables por defecto
      const defaultVars = {
        appName: process.env.APP_NAME || 'ERP System',
        year: new Date().getFullYear().toString(),
        loginUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
      };

      const allVariables = { ...defaultVars, ...variables };

      // Reemplazar variables
      const subject = this.replaceVariables(template.subject, allVariables);
      const html = this.replaceVariables(template.bodyHtml, allVariables);
      const text = template.bodyText 
        ? this.replaceVariables(template.bodyText, allVariables) 
        : null;

      // Crear log
      const emailLog = await EmailLog.create({
        templateId: template.id,
        templateCode: templateCode,
        toEmail,
        toName,
        subject,
        status: 'PENDING',
        metadata: { variables: allVariables },
      });

      // Enviar correo
      const info = await this.transporter.sendMail({
        from: `"${this.config.fromName}" <${this.config.fromEmail}>`,
        to: toName ? `"${toName}" <${toEmail}>` : toEmail,
        subject,
        html,
        text,
      });

      // Actualizar log
      await emailLog.update({
        status: 'SENT',
        sentAt: new Date(),
        metadata: { ...emailLog.metadata, messageId: info.messageId },
      });

      console.log(`✅ Email enviado a ${toEmail}: ${subject}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Error enviando email a ${toEmail}:`, error);
      
      // Actualizar log si existe
      const log = await EmailLog.findOne({
        where: { toEmail, status: 'PENDING' },
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
   * Envía correo de verificación de email
   */
  async sendVerificationEmail(userId, email, userName) {
    const code = this.generateVerificationCode();
    const expirationMinutes = 15;
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    // Guardar o actualizar UserEmail
    const [userEmail] = await UserEmail.findOrCreate({
      where: { userId },
      defaults: {
        email,
        verificationCode: code,
        verificationExpires: expiresAt,
        isVerified: false,
      },
    });

    if (userEmail.email !== email || userEmail.isVerified) {
      await userEmail.update({
        email,
        verificationCode: code,
        verificationExpires: expiresAt,
        isVerified: false,
        verifiedAt: null,
      });
    } else {
      await userEmail.update({
        verificationCode: code,
        verificationExpires: expiresAt,
      });
    }

    // Enviar correo
    await this.sendTemplateEmail('VERIFY_EMAIL', email, userName, {
      userName,
      verificationCode: code,
      expirationMinutes: expirationMinutes.toString(),
    });

    return { success: true, expiresAt };
  }

  /**
   * Verifica el código de email
   */
  async verifyEmailCode(userId, code) {
    const userEmail = await UserEmail.findOne({ where: { userId } });

    if (!userEmail) {
      throw new Error('No hay solicitud de verificación pendiente');
    }

    if (userEmail.isVerified) {
      throw new Error('El email ya está verificado');
    }

    if (userEmail.verificationCode !== code) {
      throw new Error('Código de verificación incorrecto');
    }

    if (new Date() > userEmail.verificationExpires) {
      throw new Error('El código de verificación ha expirado');
    }

    await userEmail.update({
      isVerified: true,
      verifiedAt: new Date(),
      verificationCode: null,
      verificationExpires: null,
    });

    return { success: true, email: userEmail.email };
  }

  /**
   * Envía correo de bienvenida
   */
  async sendWelcomeEmail(email, userName, username, temporaryPassword) {
    await this.sendTemplateEmail('WELCOME', email, userName, {
      userName,
      username,
      temporaryPassword,
    });

    return { success: true };
  }

  /**
   * Envía correo de recuperación de contraseña
   */
  async sendPasswordResetEmail(email, userName, resetCode, expirationMinutes = 15) {
    await this.sendTemplateEmail('PASSWORD_RESET', email, userName, {
      userName,
      resetCode,
      expirationMinutes: expirationMinutes.toString(),
    });

    return { success: true };
  }

  /**
   * Envía un correo de prueba
   */
  async sendTestEmail(toEmail) {
    try {
      if (!this.transporter) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('No hay configuración de email activa');
        }
      }

      const info = await this.transporter.sendMail({
        from: `"${this.config.fromName}" <${this.config.fromEmail}>`,
        to: toEmail,
        subject: 'Correo de prueba - ERP System',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>✅ Prueba de correo exitosa</h2>
            <p>Este es un correo de prueba enviado desde el sistema ERP.</p>
            <p>Si recibes este mensaje, la configuración de correo está funcionando correctamente.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Enviado el: ${new Date().toLocaleString('es-ES')}<br>
              Servidor SMTP: ${this.config.smtpHost}:${this.config.smtpPort}
            </p>
          </div>
        `,
        text: 'Prueba de correo exitosa. La configuración de correo está funcionando correctamente.',
      });

      // Crear log
      await EmailLog.create({
        toEmail,
        subject: 'Correo de prueba - ERP System',
        status: 'SENT',
        sentAt: new Date(),
        metadata: { messageId: info.messageId, type: 'test' },
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      // Crear log de error
      await EmailLog.create({
        toEmail,
        subject: 'Correo de prueba - ERP System',
        status: 'FAILED',
        error: error.message,
        metadata: { type: 'test' },
      });

      throw error;
    }
  }

  /**
   * Recarga la configuración
   */
  async reloadConfig() {
    this.transporter = null;
    this.config = null;
    return await this.initialize();
  }
}

// Singleton
const emailService = new EmailService();

module.exports = emailService;
