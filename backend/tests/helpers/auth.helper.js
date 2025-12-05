const request = require('supertest');
const app = require('../../src/app');

/**
 * Login helper para obtener token JWT
 */
async function loginAs(username, password = 'Admin123!') {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password });

  if (response.status !== 200) {
    throw new Error(`Login failed for ${username}: ${JSON.stringify(response.body)}`);
  }

  return response.body.data.token;
}

/**
 * Obtener tokens para todos los usuarios de prueba
 */
async function getAllTestTokens() {
  const users = [
    { username: 'admin', password: 'Admin123!', role: 'superadmin' },
    { username: 'gerente.general', password: 'Gerente123!', role: 'gerente_general' },
    { username: 'gerente.admin', password: 'GerenteAdmin123!', role: 'gerente_admin' },
    { username: 'contador', password: 'Contador123!', role: 'contador' },
    { username: 'jefe.rrhh', password: 'RRHH123!', role: 'jefe_rrhh' },
    { username: 'gerente.ops', password: 'GerenteOps123!', role: 'gerente_ops' },
    { username: 'supervisor.proyecto', password: 'Supervisor123!', role: 'supervisor' },
    { username: 'empleado.regular', password: 'Empleado123!', role: 'empleado' }
  ];

  const tokens = {};

  for (const user of users) {
    try {
      tokens[user.role] = await loginAs(user.username, user.password);
    } catch (error) {
      // Usuario aún no existe, se creará en las pruebas
      tokens[user.role] = null;
    }
  }

  return tokens;
}

/**
 * Crear header de autorización
 */
function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Validar estructura de respuesta de error
 */
function expectErrorResponse(response, status, errorMessage = null) {
  expect(response.status).toBe(status);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('error');

  if (errorMessage) {
    expect(response.body.error).toContain(errorMessage);
  }
}

/**
 * Validar estructura de respuesta exitosa
 */
function expectSuccessResponse(response, status = 200) {
  expect(response.status).toBe(status);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('data');
}

module.exports = {
  loginAs,
  getAllTestTokens,
  authHeader,
  expectErrorResponse,
  expectSuccessResponse
};
