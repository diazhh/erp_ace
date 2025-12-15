'use strict';

/**
 * Migración: Agregar módulo de Reportes de Gastos (Rendiciones)
 * 
 * Cambios:
 * 1. Crear tabla expense_reports - Reportes de rendición de gastos
 * 2. Crear tabla expense_report_items - Items detallados del reporte
 * 3. Agregar columna expense_report_id a petty_cash_entries
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    
    // 1. Crear tabla expense_reports
    if (!tables.includes('expense_reports')) {
      await queryInterface.createTable('expense_reports', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
          comment: 'Código único del reporte (ej: RG-001)',
        },
        // Relación con el movimiento de caja chica
        petty_cash_entry_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'petty_cash_entries',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        // Empleado que reporta
        employee_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'employees',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        // Fecha del reporte
        report_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        // Monto original recibido (del PettyCashEntry)
        amount_received: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          comment: 'Monto recibido de caja chica',
        },
        // Total gastado (suma de items)
        total_spent: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
          comment: 'Total gastado en compras',
        },
        // Vuelto devuelto
        change_returned: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
          comment: 'Vuelto devuelto a caja chica',
        },
        // Diferencia (puede ser positiva si gastó de más, negativa si sobró)
        difference: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
          comment: 'Diferencia: total_spent - amount_received + change_returned',
        },
        // Estado del reporte
        status: {
          type: Sequelize.ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'DRAFT',
        },
        // Aprobación
        submitted_at: {
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
        approved_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        rejection_reason: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        // Proyecto asociado (opcional)
        project_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'projects',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        // Notas
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        // Auditoría
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

      // Índices
      await queryInterface.addIndex('expense_reports', ['code'], { unique: true });
      await queryInterface.addIndex('expense_reports', ['petty_cash_entry_id']);
      await queryInterface.addIndex('expense_reports', ['employee_id']);
      await queryInterface.addIndex('expense_reports', ['status']);
      await queryInterface.addIndex('expense_reports', ['report_date']);
      await queryInterface.addIndex('expense_reports', ['project_id']);
    }

    // 2. Crear tabla expense_report_items
    if (!tables.includes('expense_report_items')) {
      await queryInterface.createTable('expense_report_items', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        expense_report_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'expense_reports',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        // Tipo de gasto
        item_type: {
          type: Sequelize.ENUM('INVENTORY', 'ASSET', 'FUEL', 'SERVICE', 'OTHER'),
          allowNull: false,
          comment: 'INVENTORY=compra inventario, ASSET=activo fijo, FUEL=combustible, SERVICE=servicio, OTHER=otro',
        },
        // Descripción del gasto
        description: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        // Cantidad (para inventario)
        quantity: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 1,
        },
        // Unidad de medida
        unit: {
          type: Sequelize.STRING(20),
          allowNull: true,
          comment: 'Unidad de medida (unidad, litros, kg, etc.)',
        },
        // Precio unitario
        unit_price: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        // Monto total del item
        amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        // Datos del comprobante
        receipt_number: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        receipt_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        vendor: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        vendor_rif: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        // Referencias a entidades creadas (si se procesan)
        inventory_item_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'inventory_items',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          comment: 'Item de inventario creado/actualizado',
        },
        inventory_movement_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'inventory_movements',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          comment: 'Movimiento de inventario creado',
        },
        asset_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'assets',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          comment: 'Activo fijo creado',
        },
        fuel_log_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'fuel_logs',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          comment: 'Registro de combustible creado',
        },
        // Estado de procesamiento
        processed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: 'Si el item ya fue procesado (creó registro en inventario/asset/fuel)',
        },
        processed_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        // Notas del item
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        // Timestamps
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

      // Índices
      await queryInterface.addIndex('expense_report_items', ['expense_report_id']);
      await queryInterface.addIndex('expense_report_items', ['item_type']);
      await queryInterface.addIndex('expense_report_items', ['inventory_item_id']);
      await queryInterface.addIndex('expense_report_items', ['asset_id']);
      await queryInterface.addIndex('expense_report_items', ['fuel_log_id']);
    }

    // 3. Agregar columna expense_report_id a petty_cash_entries
    const pettyCashColumns = await queryInterface.describeTable('petty_cash_entries');
    if (!pettyCashColumns.expense_report_id) {
      await queryInterface.addColumn('petty_cash_entries', 'expense_report_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'expense_reports',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Reporte de rendición asociado',
      });
    }

    // 4. Agregar columna has_expense_report a petty_cash_entries
    if (!pettyCashColumns.has_expense_report) {
      await queryInterface.addColumn('petty_cash_entries', 'has_expense_report', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indica si el movimiento tiene reporte de rendición',
      });
    }

    console.log('✅ Migración expense_reports completada');
  },

  async down(queryInterface, Sequelize) {
    // Eliminar columnas de petty_cash_entries
    const pettyCashColumns = await queryInterface.describeTable('petty_cash_entries');
    if (pettyCashColumns.expense_report_id) {
      await queryInterface.removeColumn('petty_cash_entries', 'expense_report_id');
    }
    if (pettyCashColumns.has_expense_report) {
      await queryInterface.removeColumn('petty_cash_entries', 'has_expense_report');
    }

    // Eliminar tablas
    await queryInterface.dropTable('expense_report_items');
    await queryInterface.dropTable('expense_reports');
  }
};
