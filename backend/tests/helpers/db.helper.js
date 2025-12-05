const db = require('../../src/database/models');
const sequelize = db.sequelize;

/**
 * Limpiar todas las tablas de la base de datos
 */
async function clearDatabase() {
  try {
    if (!sequelize) {
      throw new Error('Sequelize no está inicializado');
    }

    // Obtener todas las tablas
    const tables = await sequelize.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // Limpiar cada tabla (excepto SequelizeMeta)
    for (const table of tables) {
      if (table.tablename !== 'SequelizeMeta' && !table.tablename.startsWith('Sequelize')) {
        await sequelize.query(`TRUNCATE TABLE "${table.tablename}" RESTART IDENTITY CASCADE`);
      }
    }

    console.log('✓ Base de datos limpiada');
  } catch (error) {
    console.error('✗ Error al limpiar base de datos:', error);
    throw error;
  }
}

/**
 * Reiniciar secuencias de IDs
 */
async function resetSequences() {
  try {
    const sequences = await sequelize.query(
      `SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public'`,
      { type: sequelize.QueryTypes.SELECT }
    );

    for (const seq of sequences) {
      await sequelize.query(`ALTER SEQUENCE "${seq.sequence_name}" RESTART WITH 1`);
    }

    console.log('✓ Secuencias reiniciadas');
  } catch (error) {
    console.error('✗ Error al reiniciar secuencias:', error);
  }
}

/**
 * Ejecutar seeders de prueba
 */
async function seedTestData() {
  // Esta función se puede extender para crear datos de prueba específicos
  console.log('✓ Datos de prueba inicializados');
}

/**
 * Crear usuario de prueba básico
 */
async function createTestUser(userData = {}) {
  const db = require('../../src/database/models');
  const bcrypt = require('bcrypt');

  const defaultData = {
    username: 'testuser',
    email: 'test@example.com',
    password: await bcrypt.hash('Test123!', 10),
    isActive: true,
    ...userData
  };

  return await db.User.create(defaultData);
}

/**
 * Crear empleado de prueba básico
 */
async function createTestEmployee(employeeData = {}) {
  const db = require('../../src/database/models');

  const defaultData = {
    firstName: 'Test',
    lastName: 'Employee',
    idType: 'V',
    idNumber: '12345678',
    email: 'employee@test.com',
    phone: '04141234567',
    position: 'Test Position',
    employmentStatus: 'ACTIVE',
    hireDate: new Date(),
    baseSalary: 1000,
    ...employeeData
  };

  return await db.Employee.create(defaultData);
}

/**
 * Setup completo de base de datos para pruebas
 */
async function setupTestDatabase() {
  await clearDatabase();
  await resetSequences();
  await seedTestData();
}

/**
 * Teardown de base de datos después de pruebas
 */
async function teardownTestDatabase() {
  await clearDatabase();
}

module.exports = {
  clearDatabase,
  resetSequences,
  seedTestData,
  createTestUser,
  createTestEmployee,
  setupTestDatabase,
  teardownTestDatabase
};
