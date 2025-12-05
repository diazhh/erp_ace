'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tipo ENUM para status de valuación
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_project_valuations_status" AS ENUM(
          'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'INVOICED', 'PAID'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Crear tabla project_valuations
    await queryInterface.createTable('project_valuations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
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
      contractor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'contractors',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      valuation_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      period_start: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      period_end: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      previous_accumulated_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      previous_accumulated_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      current_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      current_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      total_accumulated_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      total_accumulated_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      inspection_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'INVOICED', 'PAID'),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      submitted_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reviewed_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approved_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      invoice_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'contractor_invoices',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      report_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      notes: {
        type: Sequelize.TEXT,
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

    // Crear índices (con IF NOT EXISTS via raw query)
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "project_valuations_project_id" ON "project_valuations" ("project_id");
      CREATE INDEX IF NOT EXISTS "project_valuations_contractor_id" ON "project_valuations" ("contractor_id");
      CREATE UNIQUE INDEX IF NOT EXISTS "project_valuations_project_id_valuation_number" ON "project_valuations" ("project_id", "valuation_number");
      CREATE INDEX IF NOT EXISTS "project_valuations_status" ON "project_valuations" ("status");
      CREATE INDEX IF NOT EXISTS "project_valuations_period_start" ON "project_valuations" ("period_start");
      CREATE INDEX IF NOT EXISTS "project_valuations_period_end" ON "project_valuations" ("period_end");
      CREATE INDEX IF NOT EXISTS "project_valuations_invoice_id" ON "project_valuations" ("invoice_id");
    `);

    // Agregar campo valuation_id a contractor_invoices para referencia inversa
    await queryInterface.addColumn('contractor_invoices', 'valuation_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'project_valuations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addIndex('contractor_invoices', ['valuation_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('contractor_invoices', 'valuation_id');
    await queryInterface.dropTable('project_valuations');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "public"."enum_project_valuations_status";');
  }
};
