const request = require('supertest');
const app = require('../../../app');
const { User, Role, Permission } = require('../../../database/models');
const { setupTestDatabase, teardownTestDatabase } = require('../../../../tests/helpers/db.helper');
const { loginAs, authHeader, expectErrorResponse, expectSuccessResponse } = require('../../../../tests/helpers/auth.helper');

describe('Auth API Tests', () => {
  let adminToken;
  let testUser;

  beforeAll(async () => {
    await setupTestDatabase();

    // Crear rol de administrador y permisos
    const adminRole = await Role.create({
      name: 'Super Administrador',
      description: 'Acceso total',
      isActive: true
    });

    const allPermission = await Permission.create({
      code: '*:*',
      name: 'All Permissions',
      module: '*',
      action: '*'
    });

    await adminRole.addPermission(allPermission);

    // Crear usuario admin
    const admin = await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'Admin123!',
      isActive: true
    });

    await admin.addRole(adminRole);

    // Obtener token de admin
    adminToken = await loginAs('admin', 'Admin123!');
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Limpiar usuarios de prueba (excepto admin)
    await User.destroy({
      where: { username: { $ne: 'admin' } },
      force: true
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });
    });

    it('[PÚBLICO] debe permitir login con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test123!'
        });

      expectSuccessResponse(response, 200);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.username).toBe('testuser');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('[PÚBLICO] debe retornar 401 con credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'WrongPassword!'
        });

      expectErrorResponse(response, 401, 'Credenciales inválidas');
    });

    it('[PÚBLICO] debe retornar 401 con usuario inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'noexiste',
          password: 'Test123!'
        });

      expectErrorResponse(response, 401);
    });

    it('[PÚBLICO] debe retornar token JWT válido', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test123!'
        });

      expect(response.body.data.token).toBeDefined();
      expect(typeof response.body.data.token).toBe('string');
      expect(response.body.data.token.split('.')).toHaveLength(3);
    });

    it('[PÚBLICO] debe retornar datos del usuario sin password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test123!'
        });

      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('username');
      expect(response.body.data.user).toHaveProperty('email');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('[PÚBLICO] debe actualizar lastLogin del usuario', async () => {
      const userBefore = await User.findOne({ where: { username: 'testuser' } });
      expect(userBefore.lastLogin).toBeNull();

      await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test123!'
        });

      const userAfter = await User.findOne({ where: { username: 'testuser' } });
      expect(userAfter.lastLogin).not.toBeNull();
      expect(userAfter.lastLogin).toBeInstanceOf(Date);
    });

    it('[PÚBLICO] debe rechazar usuario inactivo', async () => {
      testUser.isActive = false;
      await testUser.save();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test123!'
        });

      expectErrorResponse(response, 401);
    });

    it('[PÚBLICO] debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser'
          // falta password
        });

      expect(response.status).toBe(400);
    });

    it('[PÚBLICO] debe incluir roles y permisos en la respuesta', async () => {
      const role = await Role.create({ name: 'Test Role', isActive: true });
      await testUser.addRole(role);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test123!'
        });

      expectSuccessResponse(response);
      expect(response.body.data.user).toHaveProperty('roles');
      expect(response.body.data.user).toHaveProperty('permissions');
      expect(Array.isArray(response.body.data.user.roles)).toBe(true);
      expect(Array.isArray(response.body.data.user.permissions)).toBe(true);
    });
  });

  describe('GET /api/auth/me', () => {
    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });
    });

    it('[AUTENTICADO] debe retornar datos del usuario actual', async () => {
      const token = await loginAs('testuser', 'Test123!');

      const response = await request(app)
        .get('/api/auth/me')
        .set(authHeader(token));

      expectSuccessResponse(response);
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('[AUTENTICADO] debe incluir roles y permisos', async () => {
      const role = await Role.create({ name: 'Test Role', isActive: true });
      const permission = await Permission.create({
        code: 'test:read',
        name: 'Test Read',
        module: 'test',
        action: 'read'
      });
      await role.addPermission(permission);
      await testUser.addRole(role);

      const token = await loginAs('testuser', 'Test123!');

      const response = await request(app)
        .get('/api/auth/me')
        .set(authHeader(token));

      expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('roles');
      expect(response.body.data).toHaveProperty('permissions');
    });

    it('[NO AUTH] debe retornar 401 sin token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expectErrorResponse(response, 401);
    });

    it('[NO AUTH] debe retornar 401 con token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expectErrorResponse(response, 401);
    });
  });

  describe('POST /api/auth/logout', () => {
    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });
    });

    it('[AUTENTICADO] debe cerrar sesión correctamente', async () => {
      const token = await loginAs('testuser', 'Test123!');

      const response = await request(app)
        .post('/api/auth/logout')
        .set(authHeader(token));

      expectSuccessResponse(response);
      expect(response.body).toHaveProperty('message');
    });

    it('[NO AUTH] debe retornar 401 sin token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expectErrorResponse(response, 401);
    });
  });

  describe('POST /api/auth/change-password', () => {
    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'OldPass123!',
        isActive: true
      });
    });

    it('[AUTENTICADO] debe cambiar contraseña exitosamente', async () => {
      const token = await loginAs('testuser', 'OldPass123!');

      const response = await request(app)
        .post('/api/auth/change-password')
        .set(authHeader(token))
        .send({
          currentPassword: 'OldPass123!',
          newPassword: 'NewPass123!'
        });

      expectSuccessResponse(response);

      // Verificar que puede hacer login con nueva contraseña
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'NewPass123!'
        });

      expectSuccessResponse(loginResponse);
    });

    it('[AUTENTICADO] debe rechazar si contraseña actual es incorrecta', async () => {
      const token = await loginAs('testuser', 'OldPass123!');

      const response = await request(app)
        .post('/api/auth/change-password')
        .set(authHeader(token))
        .send({
          currentPassword: 'WrongPass123!',
          newPassword: 'NewPass123!'
        });

      expectErrorResponse(response, 400, 'Contraseña actual incorrecta');
    });

    it('[AUTENTICADO] debe rechazar contraseña débil', async () => {
      const token = await loginAs('testuser', 'OldPass123!');

      const response = await request(app)
        .post('/api/auth/change-password')
        .set(authHeader(token))
        .send({
          currentPassword: 'OldPass123!',
          newPassword: 'weak'
        });

      expect(response.status).toBe(400);
    });

    it('[AUTENTICADO] debe validar campos requeridos', async () => {
      const token = await loginAs('testuser', 'OldPass123!');

      const response = await request(app)
        .post('/api/auth/change-password')
        .set(authHeader(token))
        .send({
          currentPassword: 'OldPass123!'
          // falta newPassword
        });

      expect(response.status).toBe(400);
    });

    it('[NO AUTH] debe retornar 401 sin token', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .send({
          currentPassword: 'OldPass123!',
          newPassword: 'NewPass123!'
        });

      expectErrorResponse(response, 401);
    });
  });

  describe('Scenarios with Multiple Roles', () => {
    it('debe manejar usuario con múltiples roles y permisos', async () => {
      const role1 = await Role.create({ name: 'Role 1', isActive: true });
      const role2 = await Role.create({ name: 'Role 2', isActive: true });

      const perm1 = await Permission.create({
        code: 'users:read',
        name: 'Read Users',
        module: 'users',
        action: 'read'
      });

      const perm2 = await Permission.create({
        code: 'employees:read',
        name: 'Read Employees',
        module: 'employees',
        action: 'read'
      });

      await role1.addPermission(perm1);
      await role2.addPermission(perm2);

      const user = await User.create({
        username: 'multiuser',
        email: 'multi@test.com',
        password: 'Test123!',
        isActive: true
      });

      await user.addRoles([role1, role2]);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'multiuser',
          password: 'Test123!'
        });

      expectSuccessResponse(response);
      expect(response.body.data.user.roles).toHaveLength(2);
      expect(response.body.data.user.permissions).toContain('users:read');
      expect(response.body.data.user.permissions).toContain('employees:read');
    });
  });
});
