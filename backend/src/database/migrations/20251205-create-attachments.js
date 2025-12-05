'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tipo ENUM para entity_type (si no existe)
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_attachments_entity_type" AS ENUM (
          'transaction',
          'petty_cash_entry',
          'vehicle_maintenance',
          'fuel_log',
          'contractor_payment',
          'project_expense',
          'project',
          'incident',
          'inspection',
          'quote',
          'purchase_order',
          'contractor_invoice',
          'inventory_movement',
          'loan_payment',
          'employee_document',
          'training'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Crear tipo ENUM para category (si no existe)
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_attachments_category" AS ENUM (
          'RECEIPT',
          'INVOICE',
          'PHOTO',
          'BEFORE',
          'AFTER',
          'PROGRESS',
          'EVIDENCE',
          'DOCUMENT',
          'CONTRACT',
          'REPORT',
          'OTHER'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Crear tabla attachments
    await queryInterface.createTable('attachments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      entity_type: {
        type: '"enum_attachments_entity_type"',
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      original_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      file_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      thumbnail_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      category: {
        type: '"enum_attachments_category"',
        allowNull: false,
        defaultValue: 'OTHER',
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      uploaded_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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

    // Crear índices
    await queryInterface.addIndex('attachments', ['entity_type', 'entity_id'], {
      name: 'idx_attachments_entity',
    });
    await queryInterface.addIndex('attachments', ['uploaded_by'], {
      name: 'idx_attachments_uploaded_by',
    });
    await queryInterface.addIndex('attachments', ['category'], {
      name: 'idx_attachments_category',
    });
    await queryInterface.addIndex('attachments', ['mime_type'], {
      name: 'idx_attachments_mime_type',
    });
    await queryInterface.addIndex('attachments', ['is_active'], {
      name: 'idx_attachments_is_active',
    });
    await queryInterface.addIndex('attachments', ['created_at'], {
      name: 'idx_attachments_created_at',
    });

    // Agregar permisos para attachments
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`
    );

    if (adminRole.length > 0) {
      const permissions = [
        { name: 'attachments:create', description: 'Subir archivos adjuntos', module: 'attachments' },
        { name: 'attachments:read', description: 'Ver archivos adjuntos', module: 'attachments' },
        { name: 'attachments:delete', description: 'Eliminar archivos adjuntos', module: 'attachments' },
      ];

      for (const perm of permissions) {
        // Insertar permiso
        const [result] = await queryInterface.sequelize.query(
          `INSERT INTO permissions (id, name, description, module, created_at, updated_at)
           VALUES (gen_random_uuid(), '${perm.name}', '${perm.description}', '${perm.module}', NOW(), NOW())
           ON CONFLICT (name) DO NOTHING
           RETURNING id`
        );

        // Si se insertó, asignar al rol admin
        if (result.length > 0) {
          await queryInterface.sequelize.query(
            `INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at)
             VALUES ('${adminRole[0].id}', '${result[0].id}', NOW(), NOW())
             ON CONFLICT DO NOTHING`
          );
        }
      }
    }

    console.log('✅ Tabla attachments creada con éxito');
    console.log('✅ Permisos de attachments agregados');
  },

  async down(queryInterface) {
    // Eliminar permisos
    await queryInterface.sequelize.query(`
      DELETE FROM role_permissions 
      WHERE permission_id IN (SELECT id FROM permissions WHERE module = 'attachments')
    `);
    await queryInterface.sequelize.query(`
      DELETE FROM permissions WHERE module = 'attachments'
    `);

    // Eliminar tabla
    await queryInterface.dropTable('attachments');

    // Eliminar tipos ENUM
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_attachments_entity_type"');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_attachments_category"');

    console.log('✅ Tabla attachments eliminada');
  },
};
