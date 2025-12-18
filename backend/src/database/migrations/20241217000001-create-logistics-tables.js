'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Storage Tanks
    await queryInterface.createTable('storage_tanks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      field_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'fields',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      type: {
        type: Sequelize.ENUM('CRUDE', 'WATER', 'DIESEL', 'CHEMICALS', 'GAS', 'CONDENSATE'),
        allowNull: false,
        defaultValue: 'CRUDE',
      },
      capacity: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      current_volume: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
      },
      diameter_ft: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      height_ft: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      last_gauging_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      last_inspection_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      next_inspection_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE', 'DECOMMISSIONED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      notes: {
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Tank Gaugings
    await queryInterface.createTable('tank_gaugings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      tank_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'storage_tanks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      gauging_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      volume: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      temperature: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      api_gravity: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      bsw: {
        type: Sequelize.DECIMAL(8, 4),
        allowNull: true,
      },
      level_inches: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      gauged_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      gauging_method: {
        type: Sequelize.ENUM('MANUAL', 'AUTOMATIC', 'RADAR', 'ULTRASONIC'),
        allowNull: false,
        defaultValue: 'MANUAL',
      },
      notes: {
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

    // Loading Tickets
    await queryInterface.createTable('loading_tickets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.ENUM('LOADING', 'UNLOADING', 'TRANSFER'),
        allowNull: false,
        defaultValue: 'LOADING',
      },
      source_tank_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'storage_tanks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      destination_tank_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'storage_tanks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      destination: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      vehicle_plate: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      driver_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      driver_id_number: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      carrier_company: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      product_type: {
        type: Sequelize.ENUM('CRUDE', 'DIESEL', 'GASOLINE', 'WATER', 'CHEMICALS', 'CONDENSATE'),
        allowNull: false,
        defaultValue: 'CRUDE',
      },
      api_gravity: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      bsw: {
        type: Sequelize.DECIMAL(8, 4),
        allowNull: true,
      },
      temperature: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      gross_volume: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      net_volume: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      loading_start: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      loading_end: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      seal_numbers: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      initial_tank_volume: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      final_tank_volume: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      authorized_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      received_by: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'VOID'),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      notes: {
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Crude Quality
    await queryInterface.createTable('crude_qualities', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      field_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'fields',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      tank_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'storage_tanks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      sample_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      sample_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      sample_point: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      api_gravity: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      bsw: {
        type: Sequelize.DECIMAL(8, 4),
        allowNull: true,
      },
      sulfur_content: {
        type: Sequelize.DECIMAL(8, 4),
        allowNull: true,
      },
      viscosity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      pour_point: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      salt_content: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      h2s_content: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
      },
      reid_vapor_pressure: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      flash_point: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      lab_report_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      lab_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      sampled_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      analyzed_by: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'ANALYZED', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      notes: {
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Pipelines
    await queryInterface.createTable('pipelines', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('CRUDE', 'GAS', 'WATER', 'MULTIPHASE', 'CONDENSATE', 'DIESEL'),
        allowNull: false,
        defaultValue: 'CRUDE',
      },
      origin: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      origin_field_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'fields',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      destination: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      destination_field_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'fields',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      length_km: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      diameter_inches: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      wall_thickness_inches: {
        type: Sequelize.DECIMAL(6, 3),
        allowNull: true,
      },
      material: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      capacity_bpd: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      max_pressure_psi: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      installation_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      last_inspection_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      next_inspection_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'MAINTENANCE', 'SHUTDOWN', 'DECOMMISSIONED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      operator: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      notes: {
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex('storage_tanks', ['code']);
    await queryInterface.addIndex('storage_tanks', ['field_id']);
    await queryInterface.addIndex('storage_tanks', ['status']);
    await queryInterface.addIndex('storage_tanks', ['type']);

    await queryInterface.addIndex('tank_gaugings', ['tank_id']);
    await queryInterface.addIndex('tank_gaugings', ['gauging_datetime']);

    await queryInterface.addIndex('loading_tickets', ['code']);
    await queryInterface.addIndex('loading_tickets', ['source_tank_id']);
    await queryInterface.addIndex('loading_tickets', ['status']);
    await queryInterface.addIndex('loading_tickets', ['type']);

    await queryInterface.addIndex('crude_qualities', ['code']);
    await queryInterface.addIndex('crude_qualities', ['field_id']);
    await queryInterface.addIndex('crude_qualities', ['tank_id']);
    await queryInterface.addIndex('crude_qualities', ['sample_date']);
    await queryInterface.addIndex('crude_qualities', ['status']);

    await queryInterface.addIndex('pipelines', ['code']);
    await queryInterface.addIndex('pipelines', ['origin_field_id']);
    await queryInterface.addIndex('pipelines', ['destination_field_id']);
    await queryInterface.addIndex('pipelines', ['status']);
    await queryInterface.addIndex('pipelines', ['type']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pipelines');
    await queryInterface.dropTable('crude_qualities');
    await queryInterface.dropTable('loading_tickets');
    await queryInterface.dropTable('tank_gaugings');
    await queryInterface.dropTable('storage_tanks');
  }
};
