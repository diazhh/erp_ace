'use strict';

/**
 * Migración: Sistema de Flujo de Aprobación
 * 
 * Cambios:
 * 1. Agrega campos de pago a petty_cash_entries (paidBy, paidAt)
 * 2. Agrega campos de status, aprobación y pago a fuel_logs
 * 3. Extiende el ENUM de status en petty_cash_entries para incluir PAID
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // ========== PETTY CASH ENTRIES ==========
    const pettyCashColumns = await queryInterface.describeTable('petty_cash_entries');
      
    // Agregar campo paid_by
    if (!pettyCashColumns.paid_by) {
      await queryInterface.addColumn('petty_cash_entries', 'paid_by', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
    
    // Agregar campo paid_at
    if (!pettyCashColumns.paid_at) {
      await queryInterface.addColumn('petty_cash_entries', 'paid_at', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    
    // Agregar campo payment_reference
    if (!pettyCashColumns.payment_reference) {
      await queryInterface.addColumn('petty_cash_entries', 'payment_reference', {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Referencia del pago (número de transferencia, cheque, etc.)',
      });
    }
    
    // Extender ENUM de status para incluir PAID (fuera de transacción)
    const [statusValues] = await queryInterface.sequelize.query(
      `SELECT unnest(enum_range(NULL::enum_petty_cash_entries_status))::text as value`
    );
    
    const hasPaid = statusValues.some(row => row.value === 'PAID');
    
    if (!hasPaid) {
      await queryInterface.sequelize.query(
        `ALTER TYPE enum_petty_cash_entries_status ADD VALUE 'PAID'`
      );
    }
      
    // ========== FUEL LOGS ==========
    const fuelLogColumns = await queryInterface.describeTable('fuel_logs');
    
    // Agregar campo status
    if (!fuelLogColumns.status) {
      // Verificar si el ENUM ya existe
      const [enumExists] = await queryInterface.sequelize.query(
        `SELECT 1 FROM pg_type WHERE typname = 'enum_fuel_logs_status'`
      );
      
      if (enumExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE TYPE enum_fuel_logs_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED')`
        );
      }
      
      await queryInterface.addColumn('fuel_logs', 'status', {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING',
      });
    }
    
    // Agregar campo approved_by
    if (!fuelLogColumns.approved_by) {
      await queryInterface.addColumn('fuel_logs', 'approved_by', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
    
    // Agregar campo approved_at
    if (!fuelLogColumns.approved_at) {
      await queryInterface.addColumn('fuel_logs', 'approved_at', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    
    // Agregar campo rejection_reason
    if (!fuelLogColumns.rejection_reason) {
      await queryInterface.addColumn('fuel_logs', 'rejection_reason', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
    
    // Agregar campo paid_by
    if (!fuelLogColumns.paid_by) {
      await queryInterface.addColumn('fuel_logs', 'paid_by', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
    
    // Agregar campo paid_at
    if (!fuelLogColumns.paid_at) {
      await queryInterface.addColumn('fuel_logs', 'paid_at', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    
    // Agregar campo payment_reference
    if (!fuelLogColumns.payment_reference) {
      await queryInterface.addColumn('fuel_logs', 'payment_reference', {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Referencia del pago (número de transferencia, cheque, etc.)',
      });
    }
    
    // Agregar índices para búsquedas de aprobación (con IF NOT EXISTS)
    try {
      await queryInterface.addIndex('fuel_logs', ['status'], {
        name: 'fuel_logs_status_idx',
      });
    } catch (e) {
      // Índice ya existe, ignorar
    }
    
    try {
      await queryInterface.addIndex('petty_cash_entries', ['paid_by'], {
        name: 'petty_cash_entries_paid_by_idx',
      });
    } catch (e) {
      // Índice ya existe, ignorar
    }
    
    console.log('✅ Migración de flujo de aprobación completada');
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remover columnas de fuel_logs
      await queryInterface.removeColumn('fuel_logs', 'status', { transaction });
      await queryInterface.removeColumn('fuel_logs', 'approved_by', { transaction });
      await queryInterface.removeColumn('fuel_logs', 'approved_at', { transaction });
      await queryInterface.removeColumn('fuel_logs', 'rejection_reason', { transaction });
      await queryInterface.removeColumn('fuel_logs', 'paid_by', { transaction });
      await queryInterface.removeColumn('fuel_logs', 'paid_at', { transaction });
      await queryInterface.removeColumn('fuel_logs', 'payment_reference', { transaction });
      
      // Remover columnas de petty_cash_entries
      await queryInterface.removeColumn('petty_cash_entries', 'paid_by', { transaction });
      await queryInterface.removeColumn('petty_cash_entries', 'paid_at', { transaction });
      await queryInterface.removeColumn('petty_cash_entries', 'payment_reference', { transaction });
      
      // Remover ENUMs
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS enum_fuel_logs_status',
        { transaction }
      );
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
