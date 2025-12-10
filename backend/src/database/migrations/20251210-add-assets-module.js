'use strict';

/**
 * Migración: Módulo de Activos Fijos
 * 
 * Cambios:
 * 1. Crear tabla asset_categories (categorías de activos)
 * 2. Crear tabla assets (activos fijos)
 * 3. Crear tabla asset_maintenances (mantenimientos de activos)
 * 4. Crear tabla asset_transfers (transferencias de activos)
 * 5. Crear tabla asset_depreciations (depreciación de activos)
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();

    // 1. Crear tabla asset_categories
    if (!tables.includes('asset_categories')) {
      await queryInterface.createTable('asset_categories', {
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
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        parent_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'asset_categories',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        default_depreciation_method: {
          type: Sequelize.ENUM('STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION'),
          allowNull: false,
          defaultValue: 'STRAIGHT_LINE',
        },
        default_useful_life_years: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        default_salvage_value_percent: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: true,
          defaultValue: 10.00,
        },
        account_code: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        depreciation_account_code: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
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

      await queryInterface.addIndex('asset_categories', ['code']);
      await queryInterface.addIndex('asset_categories', ['parent_id']);
      await queryInterface.addIndex('asset_categories', ['is_active']);
      console.log('✅ Tabla asset_categories creada');
    }

    // 2. Crear tabla assets
    if (!tables.includes('assets')) {
      await queryInterface.createTable('assets', {
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
        name: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        category_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'asset_categories',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        serial_number: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        model: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        brand: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        acquisition_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        acquisition_cost: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        currency: {
          type: Sequelize.STRING(3),
          allowNull: false,
          defaultValue: 'USD',
        },
        supplier_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'contractors',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        invoice_number: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        purchase_order_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'purchase_orders',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        depreciation_method: {
          type: Sequelize.ENUM('STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION'),
          allowNull: false,
          defaultValue: 'STRAIGHT_LINE',
        },
        useful_life_years: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        useful_life_units: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        salvage_value: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        depreciation_start_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        accumulated_depreciation: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        current_units: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        book_value: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        location_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'warehouses',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        location_description: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        assigned_to_employee_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'employees',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        assigned_to_project_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'projects',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        assigned_to_department_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'departments',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        status: {
          type: Sequelize.ENUM('ACTIVE', 'IN_MAINTENANCE', 'STORED', 'DISPOSED', 'SOLD', 'LOST', 'DAMAGED'),
          allowNull: false,
          defaultValue: 'ACTIVE',
        },
        condition: {
          type: Sequelize.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
          allowNull: false,
          defaultValue: 'GOOD',
        },
        warranty_expiry: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        warranty_notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        disposal_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        disposal_method: {
          type: Sequelize.ENUM('SOLD', 'SCRAPPED', 'DONATED', 'LOST', 'OTHER'),
          allowNull: true,
        },
        disposal_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
        },
        disposal_notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        photo_url: {
          type: Sequelize.STRING(500),
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
        disposed_by: {
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

      await queryInterface.addIndex('assets', ['code']);
      await queryInterface.addIndex('assets', ['category_id']);
      await queryInterface.addIndex('assets', ['status']);
      await queryInterface.addIndex('assets', ['assigned_to_employee_id']);
      await queryInterface.addIndex('assets', ['assigned_to_project_id']);
      await queryInterface.addIndex('assets', ['assigned_to_department_id']);
      await queryInterface.addIndex('assets', ['location_id']);
      await queryInterface.addIndex('assets', ['acquisition_date']);
      await queryInterface.addIndex('assets', ['supplier_id']);
      console.log('✅ Tabla assets creada');
    }

    // 3. Crear tabla asset_maintenances
    if (!tables.includes('asset_maintenances')) {
      await queryInterface.createTable('asset_maintenances', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        asset_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'assets',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        maintenance_type: {
          type: Sequelize.ENUM('PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'CALIBRATION', 'INSPECTION'),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        scheduled_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        start_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        completed_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        labor_cost: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
          defaultValue: 0,
        },
        parts_cost: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
          defaultValue: 0,
        },
        other_cost: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
          defaultValue: 0,
        },
        total_cost: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
        },
        currency: {
          type: Sequelize.STRING(3),
          allowNull: false,
          defaultValue: 'USD',
        },
        service_provider_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'contractors',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        service_provider_name: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'SCHEDULED',
        },
        result: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        condition_after: {
          type: Sequelize.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
          allowNull: true,
        },
        next_maintenance_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        transaction_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'transactions',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
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
        completed_by: {
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

      await queryInterface.addIndex('asset_maintenances', ['asset_id']);
      await queryInterface.addIndex('asset_maintenances', ['status']);
      await queryInterface.addIndex('asset_maintenances', ['maintenance_type']);
      await queryInterface.addIndex('asset_maintenances', ['scheduled_date']);
      await queryInterface.addIndex('asset_maintenances', ['completed_date']);
      await queryInterface.addIndex('asset_maintenances', ['service_provider_id']);
      console.log('✅ Tabla asset_maintenances creada');
    }

    // 4. Crear tabla asset_transfers
    if (!tables.includes('asset_transfers')) {
      await queryInterface.createTable('asset_transfers', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        asset_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'assets',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        transfer_type: {
          type: Sequelize.ENUM('LOCATION', 'EMPLOYEE', 'PROJECT', 'DEPARTMENT', 'RETURN'),
          allowNull: false,
        },
        from_location_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'warehouses',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        from_employee_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'employees',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        from_project_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'projects',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        from_department_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'departments',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        to_location_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'warehouses',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        to_employee_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'employees',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        to_project_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'projects',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        to_department_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'departments',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        transfer_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        expected_return_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        actual_return_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('PENDING', 'APPROVED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'PENDING',
        },
        condition_at_transfer: {
          type: Sequelize.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
          allowNull: true,
        },
        condition_at_return: {
          type: Sequelize.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
          allowNull: true,
        },
        reason: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        requested_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        approved_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        delivered_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        received_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
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

      await queryInterface.addIndex('asset_transfers', ['asset_id']);
      await queryInterface.addIndex('asset_transfers', ['transfer_type']);
      await queryInterface.addIndex('asset_transfers', ['status']);
      await queryInterface.addIndex('asset_transfers', ['transfer_date']);
      await queryInterface.addIndex('asset_transfers', ['from_employee_id']);
      await queryInterface.addIndex('asset_transfers', ['to_employee_id']);
      await queryInterface.addIndex('asset_transfers', ['from_project_id']);
      await queryInterface.addIndex('asset_transfers', ['to_project_id']);
      console.log('✅ Tabla asset_transfers creada');
    }

    // 5. Crear tabla asset_depreciations
    if (!tables.includes('asset_depreciations')) {
      await queryInterface.createTable('asset_depreciations', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        asset_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'assets',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        year: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        month: {
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
        opening_book_value: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        opening_accumulated_depreciation: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        depreciation_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        closing_book_value: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        closing_accumulated_depreciation: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        depreciation_method: {
          type: Sequelize.ENUM('STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION'),
          allowNull: false,
        },
        units_produced: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('CALCULATED', 'POSTED', 'REVERSED'),
          allowNull: false,
          defaultValue: 'CALCULATED',
        },
        transaction_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'transactions',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        calculated_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        posted_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        posted_at: {
          type: Sequelize.DATE,
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

      await queryInterface.addIndex('asset_depreciations', ['asset_id']);
      await queryInterface.addIndex('asset_depreciations', ['year', 'month']);
      await queryInterface.addIndex('asset_depreciations', ['status']);
      await queryInterface.addIndex('asset_depreciations', ['asset_id', 'year', 'month'], { unique: true });
      console.log('✅ Tabla asset_depreciations creada');
    }

    console.log('✅ Migración de módulo de activos fijos completada');
  },

  async down(queryInterface, Sequelize) {
    // Eliminar tablas en orden inverso
    await queryInterface.dropTable('asset_depreciations');
    await queryInterface.dropTable('asset_transfers');
    await queryInterface.dropTable('asset_maintenances');
    await queryInterface.dropTable('assets');
    await queryInterface.dropTable('asset_categories');
    
    // Eliminar ENUMs
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_categories_default_depreciation_method";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_assets_depreciation_method";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_assets_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_assets_condition";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_assets_disposal_method";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_maintenances_maintenance_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_maintenances_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_maintenances_condition_after";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_transfers_transfer_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_transfers_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_transfers_condition_at_transfer";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_transfers_condition_at_return";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_depreciations_depreciation_method";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_depreciations_status";');
    
    console.log('✅ Migración de módulo de activos fijos revertida');
  }
};
