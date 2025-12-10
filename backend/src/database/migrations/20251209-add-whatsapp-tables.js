'use strict';

/**
 * Migración: Sistema de WhatsApp (Baileys)
 * 
 * Cambios:
 * 1. Crea tabla whatsapp_sessions para gestionar sesión del sistema
 * 2. Crea tabla user_whatsapp para configuración de WhatsApp por usuario
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // ========== WHATSAPP SESSIONS ==========
    const tables = await queryInterface.showAllTables();
    
    if (!tables.includes('whatsapp_sessions')) {
      await queryInterface.createTable('whatsapp_sessions', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        session_id: {
          type: Sequelize.STRING(100),
          unique: true,
          allowNull: false,
          defaultValue: 'main',
        },
        status: {
          type: Sequelize.ENUM('disconnected', 'connecting', 'connected', 'qr_pending'),
          defaultValue: 'disconnected',
        },
        phone_number: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        last_connected: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        last_disconnected: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        auth_data: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: 'JSON serialized auth state',
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
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
      
      console.log('✅ Tabla whatsapp_sessions creada');
    }

    // ========== USER WHATSAPP ==========
    if (!tables.includes('user_whatsapp')) {
      await queryInterface.createTable('user_whatsapp', {
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
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        phone_number: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        country_code: {
          type: Sequelize.STRING(5),
          allowNull: false,
          defaultValue: '+58',
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

      // Índice para búsquedas por teléfono
      await queryInterface.addIndex('user_whatsapp', ['phone_number'], {
        name: 'user_whatsapp_phone_idx',
      });

      console.log('✅ Tabla user_whatsapp creada');
    }

    console.log('✅ Migración de WhatsApp completada');
  },

  async down(queryInterface, Sequelize) {
    // Eliminar tablas en orden inverso (por dependencias)
    await queryInterface.dropTable('user_whatsapp');
    await queryInterface.dropTable('whatsapp_sessions');
    
    // Eliminar ENUM
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_whatsapp_sessions_status"'
    );
    
    console.log('✅ Tablas de WhatsApp eliminadas');
  }
};
