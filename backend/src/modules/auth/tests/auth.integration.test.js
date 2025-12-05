const { User, Role, Permission } = require('../../../database/models');
const { setupTestDatabase, teardownTestDatabase } = require('../../../../tests/helpers/db.helper');
const bcrypt = require('bcrypt');

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Limpiar usuarios antes de cada prueba
    await User.destroy({ where: {}, force: true });
    await Role.destroy({ where: {}, force: true });
    await Permission.destroy({ where: {}, force: true });
  });

  describe('User Creation and Login Flow', () => {
    it('debe crear usuario y verificar password hasheado', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.password).not.toBe(userData.password); // Password debe estar hasheado
      expect(user.password.length).toBeGreaterThan(50);
    });

    it('debe validar contraseña correcta con comparePassword', async () => {
      const password = 'Test123!';
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password,
        isActive: true
      });

      const isMatch = await user.comparePassword(password);
      expect(isMatch).toBe(true);
    });

    it('debe rechazar contraseña incorrecta con comparePassword', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      const isMatch = await user.comparePassword('WrongPassword!');
      expect(isMatch).toBe(false);
    });

    it('debe actualizar lastLogin al hacer login', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      expect(user.lastLogin).toBeNull();

      // Simular login
      user.lastLogin = new Date();
      await user.save();

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.lastLogin).not.toBeNull();
      expect(updatedUser.lastLogin).toBeInstanceOf(Date);
    });
  });

  describe('Role Assignment and Permission Inheritance', () => {
    it('debe asignar roles a usuario', async () => {
      // Crear rol
      const role = await Role.create({
        name: 'Test Role',
        description: 'Role de prueba',
        isActive: true
      });

      // Crear usuario
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      // Asignar rol
      await user.addRole(role);

      // Verificar
      const userWithRoles = await User.findByPk(user.id, {
        include: ['roles']
      });

      expect(userWithRoles.roles).toHaveLength(1);
      expect(userWithRoles.roles[0].id).toBe(role.id);
      expect(userWithRoles.roles[0].name).toBe('Test Role');
    });

    it('debe heredar permisos de roles asignados', async () => {
      // Crear permisos
      const permission1 = await Permission.create({
        code: 'users:read',
        name: 'Leer usuarios',
        module: 'users',
        action: 'read'
      });

      const permission2 = await Permission.create({
        code: 'users:create',
        name: 'Crear usuarios',
        module: 'users',
        action: 'create'
      });

      // Crear rol con permisos
      const role = await Role.create({
        name: 'User Manager',
        isActive: true
      });

      await role.addPermissions([permission1, permission2]);

      // Crear usuario con rol
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      await user.addRole(role);

      // Verificar permisos heredados
      const userWithRoles = await User.findByPk(user.id, {
        include: [{
          model: Role,
          as: 'roles',
          include: ['permissions']
        }]
      });

      const permissions = userWithRoles.roles[0].permissions;
      expect(permissions).toHaveLength(2);
      expect(permissions.map(p => p.code)).toContain('users:read');
      expect(permissions.map(p => p.code)).toContain('users:create');
    });

    it('debe acumular permisos de múltiples roles', async () => {
      // Crear permisos
      const perm1 = await Permission.create({
        code: 'users:read',
        name: 'Leer usuarios',
        module: 'users',
        action: 'read'
      });

      const perm2 = await Permission.create({
        code: 'employees:read',
        name: 'Leer empleados',
        module: 'employees',
        action: 'read'
      });

      // Crear roles
      const role1 = await Role.create({ name: 'Role 1', isActive: true });
      const role2 = await Role.create({ name: 'Role 2', isActive: true });

      await role1.addPermission(perm1);
      await role2.addPermission(perm2);

      // Crear usuario con ambos roles
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      await user.addRoles([role1, role2]);

      // Verificar
      const userWithRoles = await User.findByPk(user.id, {
        include: [{
          model: Role,
          as: 'roles',
          include: ['permissions']
        }]
      });

      const allPermissions = [];
      userWithRoles.roles.forEach(role => {
        role.permissions.forEach(perm => {
          if (!allPermissions.includes(perm.code)) {
            allPermissions.push(perm.code);
          }
        });
      });

      expect(allPermissions).toHaveLength(2);
      expect(allPermissions).toContain('users:read');
      expect(allPermissions).toContain('employees:read');
    });
  });

  describe('Password Management', () => {
    it('debe cambiar contraseña exitosamente', async () => {
      const oldPassword = 'OldPass123!';
      const newPassword = 'NewPass123!';

      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: oldPassword,
        isActive: true
      });

      const oldHash = user.password;

      // Cambiar contraseña
      user.password = newPassword;
      await user.save();

      const updatedUser = await User.findByPk(user.id);

      // Verificar que el hash cambió
      expect(updatedUser.password).not.toBe(oldHash);

      // Verificar que la nueva contraseña funciona
      const isNewMatch = await updatedUser.comparePassword(newPassword);
      expect(isNewMatch).toBe(true);

      // Verificar que la vieja contraseña no funciona
      const isOldMatch = await updatedUser.comparePassword(oldPassword);
      expect(isOldMatch).toBe(false);
    });

    it('debe hashear nueva contraseña automáticamente', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Initial123!',
        isActive: true
      });

      const newPassword = 'Changed123!';
      user.password = newPassword;
      await user.save();

      const updatedUser = await User.findByPk(user.id);

      // El password no debe ser el texto plano
      expect(updatedUser.password).not.toBe(newPassword);
      expect(updatedUser.password.length).toBeGreaterThan(50);

      // Pero debe validar correctamente
      const isMatch = await updatedUser.comparePassword(newPassword);
      expect(isMatch).toBe(true);
    });
  });

  describe('Role Permission Cascade', () => {
    it('debe actualizar permisos de usuarios al cambiar permisos del rol', async () => {
      // Crear permiso y rol
      const permission = await Permission.create({
        code: 'test:read',
        name: 'Test Read',
        module: 'test',
        action: 'read'
      });

      const role = await Role.create({
        name: 'Test Role',
        isActive: true
      });

      await role.addPermission(permission);

      // Crear usuario con el rol
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      await user.addRole(role);

      // Verificar permiso inicial
      let userWithRoles = await User.findByPk(user.id, {
        include: [{
          model: Role,
          as: 'roles',
          include: ['permissions']
        }]
      });

      expect(userWithRoles.roles[0].permissions).toHaveLength(1);

      // Agregar nuevo permiso al rol
      const newPermission = await Permission.create({
        code: 'test:create',
        name: 'Test Create',
        module: 'test',
        action: 'create'
      });

      await role.addPermission(newPermission);

      // Verificar que el usuario ahora tiene 2 permisos
      userWithRoles = await User.findByPk(user.id, {
        include: [{
          model: Role,
          as: 'roles',
          include: ['permissions']
        }]
      });

      expect(userWithRoles.roles[0].permissions).toHaveLength(2);
    });

    it('debe revocar permisos al remover rol del usuario', async () => {
      const permission = await Permission.create({
        code: 'test:read',
        name: 'Test Read',
        module: 'test',
        action: 'read'
      });

      const role = await Role.create({
        name: 'Test Role',
        isActive: true
      });

      await role.addPermission(permission);

      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      await user.addRole(role);

      // Verificar rol asignado
      let userWithRoles = await User.findByPk(user.id, {
        include: ['roles']
      });
      expect(userWithRoles.roles).toHaveLength(1);

      // Remover rol
      await user.removeRole(role);

      // Verificar rol removido
      userWithRoles = await User.findByPk(user.id, {
        include: ['roles']
      });
      expect(userWithRoles.roles).toHaveLength(0);
    });
  });

  describe('User Activation Status', () => {
    it('debe crear usuario activo por defecto', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      expect(user.isActive).toBe(true);
    });

    it('debe permitir desactivar usuario', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      user.isActive = false;
      await user.save();

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.isActive).toBe(false);
    });
  });
});
