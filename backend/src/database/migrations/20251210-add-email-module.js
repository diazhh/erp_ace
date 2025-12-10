'use strict';

/**
 * Migración: Módulo de Email
 * 
 * Cambios:
 * 1. Crear tabla email_config - Configuración SMTP
 * 2. Crear tabla email_templates - Plantillas de correo
 * 3. Crear tabla user_email - Verificación de email por usuario
 * 4. Crear tabla email_logs - Historial de correos enviados
 * 5. Insertar plantillas predeterminadas
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    
    // 1. Crear tabla email_config
    if (!tables.includes('email_config')) {
      await queryInterface.createTable('email_config', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        smtp_host: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        smtp_port: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 587,
        },
        smtp_secure: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        smtp_user: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        smtp_password: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        from_email: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        from_name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: 'ERP System',
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        last_tested_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        last_test_result: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        last_test_error: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        updated_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
      console.log('✅ Tabla email_config creada');
    }

    // 2. Crear tabla email_templates
    if (!tables.includes('email_templates')) {
      await queryInterface.createTable('email_templates', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        subject: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        body_html: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        body_text: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        variables: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: [],
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        is_system: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        updated_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
      console.log('✅ Tabla email_templates creada');
    }

    // 3. Crear tabla user_email
    if (!tables.includes('user_email')) {
      await queryInterface.createTable('user_email', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          unique: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        is_verified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        verification_code: {
          type: Sequelize.STRING(6),
          allowNull: true,
        },
        verification_expires: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        verified_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        notifications_enabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        last_email_sent_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
      console.log('✅ Tabla user_email creada');
    }

    // 4. Crear tabla email_logs
    if (!tables.includes('email_logs')) {
      await queryInterface.createTable('email_logs', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        template_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'email_templates',
            key: 'id',
          },
        },
        template_code: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        to_email: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        to_name: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        subject: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('PENDING', 'SENT', 'FAILED'),
          defaultValue: 'PENDING',
        },
        sent_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        error: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        metadata: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: {},
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
      console.log('✅ Tabla email_logs creada');
    }

    // 5. Insertar plantillas predeterminadas
    const [templates] = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM email_templates WHERE is_system = true"
    );
    
    if (templates[0].count === '0' || templates[0].count === 0) {
      const defaultTemplates = [
        {
          id: Sequelize.literal("gen_random_uuid()"),
          code: 'VERIFY_EMAIL',
          name: 'Verificación de Correo',
          subject: 'Verifica tu correo electrónico - {{appName}}',
          body_html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1976d2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .code { background: #1976d2; color: white; font-size: 32px; letter-spacing: 8px; padding: 15px 30px; text-align: center; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{appName}}</h1>
    </div>
    <div class="content">
      <h2>Hola {{userName}},</h2>
      <p>Has solicitado verificar tu correo electrónico. Utiliza el siguiente código para completar la verificación:</p>
      <div class="code">{{verificationCode}}</div>
      <p>Este código expira en <strong>{{expirationMinutes}} minutos</strong>.</p>
      <p>Si no solicitaste esta verificación, puedes ignorar este correo.</p>
    </div>
    <div class="footer">
      <p>Este es un correo automático, por favor no respondas.</p>
      <p>&copy; {{year}} {{appName}}</p>
    </div>
  </div>
</body>
</html>`,
          body_text: 'Hola {{userName}},\n\nTu código de verificación es: {{verificationCode}}\n\nEste código expira en {{expirationMinutes}} minutos.\n\nSi no solicitaste esta verificación, ignora este correo.',
          variables: JSON.stringify([
            { name: 'appName', description: 'Nombre de la aplicación' },
            { name: 'userName', description: 'Nombre del usuario' },
            { name: 'verificationCode', description: 'Código de verificación de 6 dígitos' },
            { name: 'expirationMinutes', description: 'Minutos hasta que expire el código' },
            { name: 'year', description: 'Año actual' },
          ]),
          is_active: true,
          is_system: true,
          created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
          updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        {
          id: Sequelize.literal("gen_random_uuid()"),
          code: 'WELCOME',
          name: 'Bienvenida',
          subject: '¡Bienvenido a {{appName}}!',
          body_html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1976d2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2; }
    .btn { display: inline-block; background: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Bienvenido!</h1>
    </div>
    <div class="content">
      <h2>Hola {{userName}},</h2>
      <p>Tu cuenta ha sido creada exitosamente en <strong>{{appName}}</strong>.</p>
      <div class="credentials">
        <p><strong>Tus credenciales de acceso:</strong></p>
        <p>Usuario: <strong>{{username}}</strong></p>
        <p>Contraseña temporal: <strong>{{temporaryPassword}}</strong></p>
      </div>
      <p><strong>Importante:</strong> Por seguridad, te recomendamos cambiar tu contraseña después del primer inicio de sesión.</p>
      <p style="text-align: center;">
        <a href="{{loginUrl}}" class="btn">Iniciar Sesión</a>
      </p>
    </div>
    <div class="footer">
      <p>Este es un correo automático, por favor no respondas.</p>
      <p>&copy; {{year}} {{appName}}</p>
    </div>
  </div>
</body>
</html>`,
          body_text: 'Hola {{userName}},\n\nTu cuenta ha sido creada en {{appName}}.\n\nCredenciales:\nUsuario: {{username}}\nContraseña temporal: {{temporaryPassword}}\n\nPor seguridad, cambia tu contraseña después del primer inicio de sesión.\n\nAccede en: {{loginUrl}}',
          variables: JSON.stringify([
            { name: 'appName', description: 'Nombre de la aplicación' },
            { name: 'userName', description: 'Nombre del usuario' },
            { name: 'username', description: 'Nombre de usuario para login' },
            { name: 'temporaryPassword', description: 'Contraseña temporal asignada' },
            { name: 'loginUrl', description: 'URL de inicio de sesión' },
            { name: 'year', description: 'Año actual' },
          ]),
          is_active: true,
          is_system: true,
          created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
          updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        {
          id: Sequelize.literal("gen_random_uuid()"),
          code: 'PASSWORD_RESET',
          name: 'Recuperación de Contraseña',
          subject: 'Recupera tu contraseña - {{appName}}',
          body_html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .code { background: #d32f2f; color: white; font-size: 32px; letter-spacing: 8px; padding: 15px 30px; text-align: center; border-radius: 8px; margin: 20px 0; }
    .warning { background: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Recuperación de Contraseña</h1>
    </div>
    <div class="content">
      <h2>Hola {{userName}},</h2>
      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
      <p>Utiliza el siguiente código para continuar:</p>
      <div class="code">{{resetCode}}</div>
      <p>Este código expira en <strong>{{expirationMinutes}} minutos</strong>.</p>
      <div class="warning">
        <strong>⚠️ Importante:</strong> Si no solicitaste restablecer tu contraseña, ignora este correo y tu cuenta permanecerá segura.
      </div>
    </div>
    <div class="footer">
      <p>Este es un correo automático, por favor no respondas.</p>
      <p>&copy; {{year}} {{appName}}</p>
    </div>
  </div>
</body>
</html>`,
          body_text: 'Hola {{userName}},\n\nHemos recibido una solicitud para restablecer tu contraseña.\n\nCódigo de recuperación: {{resetCode}}\n\nEste código expira en {{expirationMinutes}} minutos.\n\nSi no solicitaste esto, ignora este correo.',
          variables: JSON.stringify([
            { name: 'appName', description: 'Nombre de la aplicación' },
            { name: 'userName', description: 'Nombre del usuario' },
            { name: 'resetCode', description: 'Código de recuperación de 6 dígitos' },
            { name: 'expirationMinutes', description: 'Minutos hasta que expire el código' },
            { name: 'year', description: 'Año actual' },
          ]),
          is_active: true,
          is_system: true,
          created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
          updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      ];

      for (const template of defaultTemplates) {
        await queryInterface.sequelize.query(`
          INSERT INTO email_templates (id, code, name, subject, body_html, body_text, variables, is_active, is_system, created_at, updated_at)
          VALUES (gen_random_uuid(), :code, :name, :subject, :body_html, :body_text, :variables, :is_active, :is_system, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, {
          replacements: {
            code: template.code,
            name: template.name,
            subject: template.subject,
            body_html: template.body_html,
            body_text: template.body_text,
            variables: template.variables,
            is_active: template.is_active,
            is_system: template.is_system,
          },
        });
      }
      console.log('✅ Plantillas de correo predeterminadas creadas');
    }

    console.log('✅ Migración de módulo Email completada');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('email_logs');
    await queryInterface.dropTable('user_email');
    await queryInterface.dropTable('email_templates');
    await queryInterface.dropTable('email_config');
    console.log('✅ Tablas de Email eliminadas');
  }
};
