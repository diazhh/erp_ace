'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Agregar columna execution_type a projects
    await queryInterface.addColumn('projects', 'execution_type', {
      type: Sequelize.ENUM('INTERNAL', 'OUTSOURCED'),
      allowNull: false,
      defaultValue: 'INTERNAL',
      comment: 'INTERNAL: ejecutado por la empresa, OUTSOURCED: ejecutado por contratista',
    });

    // 2. Agregar columna project_id a petty_cash_entries
    await queryInterface.addColumn('petty_cash_entries', 'project_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Proyecto asociado al gasto',
    });

    // 3. Crear tabla project_updates
    await queryInterface.createTable('project_updates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      update_type: {
        type: Sequelize.ENUM('PROGRESS', 'ISSUE', 'MILESTONE', 'PAYMENT', 'PHOTO', 'NOTE', 'APPROVAL'),
        allowNull: false,
        defaultValue: 'PROGRESS',
        comment: 'Tipo de actualización del proyecto',
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Título de la actualización',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descripción detallada',
      },
      progress_before: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Progreso antes de la actualización',
      },
      progress_after: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Progreso después de la actualización',
      },
      payment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'contractor_payments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID del pago si es actualización de pago',
      },
      milestone_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'project_milestones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID del hito si es actualización de hito',
      },
      reported_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Empleado que reporta la actualización',
      },
      reported_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Si es visible para todos o solo internos',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 4. Crear tabla project_photos
    await queryInterface.createTable('project_photos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      update_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'project_updates',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID de la actualización asociada',
      },
      photo_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
        comment: 'URL de la foto',
      },
      thumbnail_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'URL de la miniatura',
      },
      caption: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Descripción de la foto',
      },
      category: {
        type: Sequelize.ENUM('PROGRESS', 'BEFORE', 'AFTER', 'ISSUE', 'DELIVERY', 'INSPECTION', 'OTHER'),
        allowNull: false,
        defaultValue: 'PROGRESS',
        comment: 'Categoría de la foto',
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Tamaño en bytes',
      },
      mime_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      taken_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Fecha en que se tomó la foto',
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
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
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 5. Crear índices
    await queryInterface.addIndex('projects', ['execution_type']);
    await queryInterface.addIndex('petty_cash_entries', ['project_id']);
    await queryInterface.addIndex('project_updates', ['project_id']);
    await queryInterface.addIndex('project_updates', ['update_type']);
    await queryInterface.addIndex('project_updates', ['reported_by']);
    await queryInterface.addIndex('project_updates', ['reported_at']);
    await queryInterface.addIndex('project_photos', ['project_id']);
    await queryInterface.addIndex('project_photos', ['update_id']);
    await queryInterface.addIndex('project_photos', ['category']);
    await queryInterface.addIndex('project_photos', ['uploaded_by']);
  },

  async down(queryInterface, Sequelize) {
    // Eliminar índices
    await queryInterface.removeIndex('project_photos', ['uploaded_by']);
    await queryInterface.removeIndex('project_photos', ['category']);
    await queryInterface.removeIndex('project_photos', ['update_id']);
    await queryInterface.removeIndex('project_photos', ['project_id']);
    await queryInterface.removeIndex('project_updates', ['reported_at']);
    await queryInterface.removeIndex('project_updates', ['reported_by']);
    await queryInterface.removeIndex('project_updates', ['update_type']);
    await queryInterface.removeIndex('project_updates', ['project_id']);
    await queryInterface.removeIndex('petty_cash_entries', ['project_id']);
    await queryInterface.removeIndex('projects', ['execution_type']);

    // Eliminar tablas
    await queryInterface.dropTable('project_photos');
    await queryInterface.dropTable('project_updates');

    // Eliminar columnas
    await queryInterface.removeColumn('petty_cash_entries', 'project_id');
    await queryInterface.removeColumn('projects', 'execution_type');

    // Eliminar ENUMs
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_project_photos_category";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_project_updates_update_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_projects_execution_type";');
  },
};
