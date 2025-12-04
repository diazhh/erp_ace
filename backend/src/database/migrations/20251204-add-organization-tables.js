'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tabla departments
    await queryInterface.createTable('departments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      type: {
        type: Sequelize.ENUM('DIRECTION', 'MANAGEMENT', 'DEPARTMENT', 'AREA', 'UNIT'),
        defaultValue: 'DEPARTMENT',
      },
      parent_id: {
        type: Sequelize.UUID,
        references: {
          model: 'departments',
          key: 'id',
        },
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      manager_id: {
        type: Sequelize.UUID,
        references: {
          model: 'employees',
          key: 'id',
        },
      },
      location: {
        type: Sequelize.STRING(200),
      },
      budget: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      budget_currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'USD',
      },
      cost_center: {
        type: Sequelize.STRING(20),
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE',
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      color: {
        type: Sequelize.STRING(7),
        defaultValue: '#1976d2',
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
      },
    });

    // Crear tabla positions
    await queryInterface.createTable('positions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      department_id: {
        type: Sequelize.UUID,
        references: {
          model: 'departments',
          key: 'id',
        },
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      min_salary: {
        type: Sequelize.DECIMAL(15, 2),
      },
      max_salary: {
        type: Sequelize.DECIMAL(15, 2),
      },
      salary_currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'USD',
      },
      requirements: {
        type: Sequelize.TEXT,
      },
      responsibilities: {
        type: Sequelize.TEXT,
      },
      competencies: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      is_supervisory: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      max_headcount: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE',
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
      },
    });

    // Crear tabla employee_bank_accounts
    await queryInterface.createTable('employee_bank_accounts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id',
        },
      },
      account_type: {
        type: Sequelize.ENUM('CHECKING', 'SAVINGS', 'PAGO_MOVIL', 'ZELLE', 'CRYPTO'),
        defaultValue: 'CHECKING',
      },
      bank_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      bank_code: {
        type: Sequelize.STRING(10),
      },
      account_number: {
        type: Sequelize.STRING(30),
      },
      account_holder: {
        type: Sequelize.STRING(200),
      },
      holder_id_type: {
        type: Sequelize.ENUM('V', 'E', 'J', 'P', 'G'),
      },
      holder_id_number: {
        type: Sequelize.STRING(20),
      },
      phone_number: {
        type: Sequelize.STRING(20),
      },
      zelle_email: {
        type: Sequelize.STRING(255),
      },
      wallet_address: {
        type: Sequelize.STRING(100),
      },
      network: {
        type: Sequelize.STRING(20),
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'VES',
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      payment_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 100,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION'),
        defaultValue: 'ACTIVE',
      },
      verified_at: {
        type: Sequelize.DATE,
      },
      verified_by: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      notes: {
        type: Sequelize.TEXT,
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
      },
    });

    // Agregar columnas a employees
    await queryInterface.addColumn('employees', 'department_id', {
      type: Sequelize.UUID,
      references: {
        model: 'departments',
        key: 'id',
      },
    });

    await queryInterface.addColumn('employees', 'position_id', {
      type: Sequelize.UUID,
      references: {
        model: 'positions',
        key: 'id',
      },
    });

    await queryInterface.addColumn('employees', 'supervisor_id', {
      type: Sequelize.UUID,
      references: {
        model: 'employees',
        key: 'id',
      },
    });

    await queryInterface.addColumn('employees', 'extension', {
      type: Sequelize.STRING(10),
    });

    await queryInterface.addColumn('employees', 'office_location', {
      type: Sequelize.STRING(100),
    });

    await queryInterface.addColumn('employees', 'skills', {
      type: Sequelize.JSONB,
      defaultValue: [],
    });

    // Crear índices (ignorar errores si ya existen)
    const createIndexSafe = async (table, fields, options = {}) => {
      try {
        await queryInterface.addIndex(table, fields, options);
      } catch (e) {
        console.log(`Index on ${table}(${fields.join(',')}) already exists, skipping...`);
      }
    };

    await createIndexSafe('departments', ['code']);
    await createIndexSafe('departments', ['parent_id']);
    await createIndexSafe('departments', ['manager_id']);
    await createIndexSafe('departments', ['type']);
    await createIndexSafe('departments', ['status']);

    await createIndexSafe('positions', ['code']);
    await createIndexSafe('positions', ['department_id']);
    await createIndexSafe('positions', ['level']);
    await createIndexSafe('positions', ['status']);

    await createIndexSafe('employee_bank_accounts', ['employee_id']);
    await createIndexSafe('employee_bank_accounts', ['account_type']);
    await createIndexSafe('employee_bank_accounts', ['is_primary']);
    await createIndexSafe('employee_bank_accounts', ['status']);
  },

  async down(queryInterface, Sequelize) {
    // Eliminar columnas de employees
    await queryInterface.removeColumn('employees', 'skills');
    await queryInterface.removeColumn('employees', 'office_location');
    await queryInterface.removeColumn('employees', 'extension');
    await queryInterface.removeColumn('employees', 'supervisor_id');
    await queryInterface.removeColumn('employees', 'position_id');
    await queryInterface.removeColumn('employees', 'department_id');

    // Eliminar tablas
    await queryInterface.dropTable('employee_bank_accounts');
    await queryInterface.dropTable('positions');
    await queryInterface.dropTable('departments');
  },
};
