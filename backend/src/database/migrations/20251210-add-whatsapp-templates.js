'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create whatsapp_templates table
    await queryInterface.createTable('whatsapp_templates', {
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
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      variables: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      category: {
        type: Sequelize.ENUM('NOTIFICATION', 'REMINDER', 'VERIFICATION', 'MARKETING', 'TRANSACTIONAL', 'OTHER'),
        defaultValue: 'NOTIFICATION',
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
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    // Create whatsapp_logs table
    await queryInterface.createTable('whatsapp_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      template_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'whatsapp_templates',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      template_code: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      to_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      to_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'),
        defaultValue: 'PENDING',
      },
      message_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      delivered_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      read_at: {
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
      sent_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    // Create indexes
    await queryInterface.addIndex('whatsapp_templates', ['code'], { unique: true });
    await queryInterface.addIndex('whatsapp_templates', ['category']);
    await queryInterface.addIndex('whatsapp_templates', ['is_active']);
    await queryInterface.addIndex('whatsapp_logs', ['template_code']);
    await queryInterface.addIndex('whatsapp_logs', ['to_phone']);
    await queryInterface.addIndex('whatsapp_logs', ['status']);
    await queryInterface.addIndex('whatsapp_logs', ['created_at']);

    // Insert default system templates
    const now = new Date();
    await queryInterface.bulkInsert('whatsapp_templates', [
      {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        code: 'VERIFY_CODE',
        name: 'Código de Verificación',
        message: '🔐 Tu código de verificación para {{appName}} es: *{{code}}*\n\nEste código expira en 10 minutos.\n\n_No compartas este código con nadie._',
        variables: JSON.stringify([
          { name: 'code', description: 'Código de verificación de 6 dígitos' },
          { name: 'appName', description: 'Nombre de la aplicación' },
        ]),
        category: 'VERIFICATION',
        is_active: true,
        is_system: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
        code: 'WELCOME',
        name: 'Bienvenida',
        message: '👋 ¡Hola {{name}}!\n\nBienvenido/a a *{{appName}}*. Tu cuenta ha sido creada exitosamente.\n\nSi tienes alguna pregunta, no dudes en contactarnos.',
        variables: JSON.stringify([
          { name: 'name', description: 'Nombre del usuario' },
          { name: 'appName', description: 'Nombre de la aplicación' },
        ]),
        category: 'NOTIFICATION',
        is_active: true,
        is_system: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
        code: 'PASSWORD_RESET',
        name: 'Restablecimiento de Contraseña',
        message: '🔑 Hola {{name}},\n\nRecibimos una solicitud para restablecer tu contraseña en *{{appName}}*.\n\nTu código de restablecimiento es: *{{code}}*\n\nEste código expira en 15 minutos.\n\nSi no solicitaste este cambio, ignora este mensaje.',
        variables: JSON.stringify([
          { name: 'name', description: 'Nombre del usuario' },
          { name: 'code', description: 'Código de restablecimiento' },
          { name: 'appName', description: 'Nombre de la aplicación' },
        ]),
        category: 'VERIFICATION',
        is_active: true,
        is_system: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
        code: 'TASK_REMINDER',
        name: 'Recordatorio de Tarea',
        message: '📋 *Recordatorio de Tarea*\n\nHola {{name}},\n\nTienes una tarea pendiente:\n*{{taskName}}*\n\nFecha límite: {{dueDate}}\n\nAccede al sistema para más detalles.',
        variables: JSON.stringify([
          { name: 'name', description: 'Nombre del usuario' },
          { name: 'taskName', description: 'Nombre de la tarea' },
          { name: 'dueDate', description: 'Fecha límite' },
        ]),
        category: 'REMINDER',
        is_active: true,
        is_system: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'e5f6a7b8-c9d0-1234-efab-567890123456',
        code: 'APPROVAL_REQUEST',
        name: 'Solicitud de Aprobación',
        message: '✅ *Solicitud de Aprobación*\n\nHola {{approverName}},\n\n{{requesterName}} ha solicitado tu aprobación para:\n*{{itemType}}*: {{itemName}}\n\nMonto: {{amount}}\n\nPor favor revisa y aprueba en el sistema.',
        variables: JSON.stringify([
          { name: 'approverName', description: 'Nombre del aprobador' },
          { name: 'requesterName', description: 'Nombre del solicitante' },
          { name: 'itemType', description: 'Tipo de elemento (Orden de Compra, Gasto, etc.)' },
          { name: 'itemName', description: 'Nombre o descripción del elemento' },
          { name: 'amount', description: 'Monto a aprobar' },
        ]),
        category: 'TRANSACTIONAL',
        is_active: true,
        is_system: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'f6a7b8c9-d0e1-2345-fabc-678901234567',
        code: 'APPROVAL_APPROVED',
        name: 'Aprobación Confirmada',
        message: '✅ *Aprobación Confirmada*\n\nHola {{requesterName}},\n\nTu solicitud ha sido *APROBADA*:\n*{{itemType}}*: {{itemName}}\n\nAprobado por: {{approverName}}\nFecha: {{date}}',
        variables: JSON.stringify([
          { name: 'requesterName', description: 'Nombre del solicitante' },
          { name: 'itemType', description: 'Tipo de elemento' },
          { name: 'itemName', description: 'Nombre del elemento' },
          { name: 'approverName', description: 'Nombre del aprobador' },
          { name: 'date', description: 'Fecha de aprobación' },
        ]),
        category: 'TRANSACTIONAL',
        is_active: true,
        is_system: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'a7b8c9d0-e1f2-3456-abcd-789012345678',
        code: 'APPROVAL_REJECTED',
        name: 'Aprobación Rechazada',
        message: '❌ *Solicitud Rechazada*\n\nHola {{requesterName}},\n\nTu solicitud ha sido *RECHAZADA*:\n*{{itemType}}*: {{itemName}}\n\nRechazado por: {{approverName}}\nMotivo: {{reason}}\nFecha: {{date}}',
        variables: JSON.stringify([
          { name: 'requesterName', description: 'Nombre del solicitante' },
          { name: 'itemType', description: 'Tipo de elemento' },
          { name: 'itemName', description: 'Nombre del elemento' },
          { name: 'approverName', description: 'Nombre del aprobador' },
          { name: 'reason', description: 'Motivo del rechazo' },
          { name: 'date', description: 'Fecha de rechazo' },
        ]),
        category: 'TRANSACTIONAL',
        is_active: true,
        is_system: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'b8c9d0e1-f2a3-4567-bcde-890123456789',
        code: 'PAYMENT_RECEIVED',
        name: 'Pago Recibido',
        message: '💰 *Pago Recibido*\n\nHola {{name}},\n\nSe ha registrado un pago a tu favor:\n\nMonto: {{amount}}\nConcepto: {{concept}}\nFecha: {{date}}\n\nGracias por tu trabajo.',
        variables: JSON.stringify([
          { name: 'name', description: 'Nombre del beneficiario' },
          { name: 'amount', description: 'Monto del pago' },
          { name: 'concept', description: 'Concepto del pago' },
          { name: 'date', description: 'Fecha del pago' },
        ]),
        category: 'TRANSACTIONAL',
        is_active: true,
        is_system: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('whatsapp_logs');
    await queryInterface.dropTable('whatsapp_templates');
  },
};
