'use strict';

/**
 * Migración: Sistema de Permisos Granulares
 * 
 * Cambios:
 * 1. Extiende tabla permissions con campos action, field, permission_type
 * 2. Agrega employee_id a users para vincular con empleados
 * 3. Agrega must_change_password a users
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Agregar columnas a permissions
      const permissionsColumns = await queryInterface.describeTable('permissions');
      
      if (!permissionsColumns.action) {
        await queryInterface.addColumn('permissions', 'action', {
          type: Sequelize.STRING(50),
          allowNull: true,
        }, { transaction });
      }
      
      if (!permissionsColumns.field) {
        await queryInterface.addColumn('permissions', 'field', {
          type: Sequelize.STRING(50),
          allowNull: true,
        }, { transaction });
      }
      
      if (!permissionsColumns.permission_type) {
        await queryInterface.addColumn('permissions', 'permission_type', {
          type: Sequelize.ENUM('module', 'action', 'field'),
          defaultValue: 'action',
        }, { transaction });
      }
      
      // 2. Agregar columnas a users
      const usersColumns = await queryInterface.describeTable('users');
      
      if (!usersColumns.employee_id) {
        await queryInterface.addColumn('users', 'employee_id', {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'employees',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, { transaction });
        
        // Índice para búsquedas rápidas
        await queryInterface.addIndex('users', ['employee_id'], {
          name: 'users_employee_id_idx',
          transaction,
        });
      }
      
      if (!usersColumns.must_change_password) {
        await queryInterface.addColumn('users', 'must_change_password', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        }, { transaction });
      }
      
      // 3. Actualizar permisos existentes para extraer action del code
      await queryInterface.sequelize.query(`
        UPDATE permissions 
        SET action = SPLIT_PART(code, ':', 2),
            permission_type = CASE 
              WHEN code LIKE '%:*' THEN 'module'::enum_permissions_permission_type
              WHEN ARRAY_LENGTH(STRING_TO_ARRAY(code, ':'), 1) = 3 THEN 'field'::enum_permissions_permission_type
              ELSE 'action'::enum_permissions_permission_type
            END
        WHERE action IS NULL
      `, { transaction });
      
      await transaction.commit();
      console.log('✅ Migración de permisos granulares completada');
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remover columnas de users
      await queryInterface.removeColumn('users', 'employee_id', { transaction });
      await queryInterface.removeColumn('users', 'must_change_password', { transaction });
      
      // Remover columnas de permissions
      await queryInterface.removeColumn('permissions', 'action', { transaction });
      await queryInterface.removeColumn('permissions', 'field', { transaction });
      await queryInterface.removeColumn('permissions', 'permission_type', { transaction });
      
      // Remover ENUM
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_permissions_permission_type"',
        { transaction }
      );
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
