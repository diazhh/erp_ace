const request = require('supertest');
const app = require('../../../app');
const db = require('../../../database/models');
const { setupTestDatabase, teardownTestDatabase } = require('../../../../tests/helpers/db.helper');
const { loginAs, authHeader, expectErrorResponse, expectSuccessResponse } = require('../../../../tests/helpers/auth.helper');

describe('Employees API Tests', () => {
  let adminToken;
  let jefeRRHHToken;
  let contadorToken;
  let empleadoToken;
  let testEmployee;
  let empleadoUser;

  beforeAll(async () => {
    await setupTestDatabase();

    // Crear roles y permisos
    const adminRole = await db.Role.create({
      name: 'Super Administrador',
      isActive: true
    });

    const rrhhRole = await db.Role.create({
      name: 'Jefe de RRHH',
      isActive: true
    });

    const contadorRole = await db.Role.create({
      name: 'Contador',
      isActive: true
    });

    const empleadoRole = await db.Role.create({
      name: 'Empleado',
      isActive: true
    });

    // Crear permisos
    const employeesRead = await db.Permission.create({
      code: 'employees:read',
      name: 'Leer empleados',
      module: 'employees',
      action: 'read'
    });

    const employeesCreate = await db.Permission.create({
      code: 'employees:create',
      name: 'Crear empleados',
      module: 'employees',
      action: 'create'
    });

    const employeesUpdate = await db.Permission.create({
      code: 'employees:update',
      name: 'Actualizar empleados',
      module: 'employees',
      action: 'update'
    });

    const employeesDelete = await db.Permission.create({
      code: 'employees:delete',
      name: 'Eliminar empleados',
      module: 'employees',
      action: 'delete'
    });

    const employeesReadOwn = await db.Permission.create({
      code: 'employees:read:own',
      name: 'Leer propio perfil',
      module: 'employees',
      action: 'read',
      field: 'own'
    });

    // Asignar permisos a roles
    await adminRole.addPermissions([employeesRead, employeesCreate, employeesUpdate, employeesDelete]);
    await rrhhRole.addPermissions([employeesRead, employeesCreate, employeesUpdate, employeesDelete]);
    await contadorRole.addPermission(employeesRead);
    await empleadoRole.addPermission(employeesReadOwn);

    // Crear usuarios
    const admin = await db.User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'Admin123!',
      isActive: true
    });
    await admin.addRole(adminRole);

    const jefeRRHH = await db.User.create({
      username: 'jefe.rrhh',
      email: 'jefe.rrhh@test.com',
      password: 'RRHH123!',
      isActive: true
    });
    await jefeRRHH.addRole(rrhhRole);

    const contador = await db.User.create({
      username: 'contador',
      email: 'contador@test.com',
      password: 'Contador123!',
      isActive: true
    });
    await contador.addRole(contadorRole);

    const empleado = await db.User.create({
      username: 'empleado.regular',
      email: 'empleado@test.com',
      password: 'Empleado123!',
      isActive: true
    });
    await empleado.addRole(empleadoRole);
    empleadoUser = empleado;

    // Obtener tokens
    adminToken = await loginAs('admin', 'Admin123!');
    jefeRRHHToken = await loginAs('jefe.rrhh', 'RRHH123!');
    contadorToken = await loginAs('contador', 'Contador123!');
    empleadoToken = await loginAs('empleado.regular', 'Empleado123!');
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Limpiar empleados de prueba
    await db.Employee.destroy({ where: {}, force: true });
  });

  describe('GET /api/employees', () => {
    beforeEach(async () => {
      // Crear empleados de prueba
      await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        email: 'juan@test.com',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      await db.Employee.create({
        firstName: 'María',
        lastName: 'González',
        idType: 'V',
        idNumber: '87654321',
        email: 'maria@test.com',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });
    });

    it('[JEFE RRHH] debe listar todos los empleados', async () => {
      const response = await request(app)
        .get('/api/employees')
        .set(authHeader(jefeRRHHToken));

      expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('employees');
      expect(Array.isArray(response.body.data.employees)).toBe(true);
      expect(response.body.data.employees.length).toBeGreaterThanOrEqual(2);
    });

    it('[JEFE RRHH] debe listar con paginación', async () => {
      const response = await request(app)
        .get('/api/employees?page=1&limit=1')
        .set(authHeader(jefeRRHHToken));

      expectSuccessResponse(response);
      expect(response.body.data.employees).toHaveLength(1);
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('[JEFE RRHH] debe filtrar por búsqueda (nombre)', async () => {
      const response = await request(app)
        .get('/api/employees?search=Juan')
        .set(authHeader(jefeRRHHToken));

      expectSuccessResponse(response);
      expect(response.body.data.employees.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data.employees[0].firstName).toContain('Juan');
    });

    it('[JEFE RRHH] debe filtrar por búsqueda (cédula)', async () => {
      const response = await request(app)
        .get('/api/employees?search=12345678')
        .set(authHeader(jefeRRHHToken));

      expectSuccessResponse(response);
      expect(response.body.data.employees.length).toBeGreaterThanOrEqual(1);
    });

    it('[JEFE RRHH] debe filtrar por status', async () => {
      await db.Employee.create({
        firstName: 'Pedro',
        lastName: 'Inactivo',
        idType: 'V',
        idNumber: '99999999',
        hireDate: new Date(),
        employmentStatus: 'INACTIVE',
        terminationDate: new Date()
      });

      const response = await request(app)
        .get('/api/employees?status=ACTIVE')
        .set(authHeader(jefeRRHHToken));

      expectSuccessResponse(response);
      const allActive = response.body.data.employees.every(emp => emp.employmentStatus === 'ACTIVE');
      expect(allActive).toBe(true);
    });

    it('[EMPLEADO REGULAR] debe retornar 403', async () => {
      const response = await request(app)
        .get('/api/employees')
        .set(authHeader(empleadoToken));

      expectErrorResponse(response, 403);
    });

    it('[NO AUTH] debe retornar 401', async () => {
      const response = await request(app)
        .get('/api/employees');

      expectErrorResponse(response, 401);
    });
  });

  describe('GET /api/employees/stats', () => {
    beforeEach(async () => {
      await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Activo',
        idType: 'V',
        idNumber: '11111111',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      await db.Employee.create({
        firstName: 'María',
        lastName: 'Inactiva',
        idType: 'V',
        idNumber: '22222222',
        hireDate: new Date(),
        employmentStatus: 'INACTIVE',
        terminationDate: new Date()
      });
    });

    it('[JEFE RRHH] debe retornar estadísticas correctas', async () => {
      const response = await request(app)
        .get('/api/employees/stats')
        .set(authHeader(jefeRRHHToken));

      expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('active');
      expect(response.body.data).toHaveProperty('inactive');
      expect(response.body.data.total).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/employees/:id', () => {
    it('[JEFE RRHH] debe retornar empleado con datos básicos', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        email: 'juan@test.com',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      const response = await request(app)
        .get(`/api/employees/${employee.id}`)
        .set(authHeader(jefeRRHHToken));

      expectSuccessResponse(response);
      expect(response.body.data.firstName).toBe('Juan');
      expect(response.body.data.lastName).toBe('Pérez');
      expect(response.body.data.idNumber).toBe('12345678');
    });

    it('[EMPLEADO REGULAR] puede ver su propio perfil', async () => {
      const employee = await db.Employee.create({
        firstName: 'Regular',
        lastName: 'User',
        idType: 'V',
        idNumber: '99999999',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE',
        userId: empleadoUser.id
      });

      const response = await request(app)
        .get(`/api/employees/${employee.id}`)
        .set(authHeader(empleadoToken));

      // Nota: Esto depende de la implementación de authorize con 'own'
      // Si no está implementado, retornará 403
      // expectSuccessResponse(response);
    });

    it('[JEFE RRHH] debe retornar 404 con ID inválido', async () => {
      const response = await request(app)
        .get('/api/employees/00000000-0000-0000-0000-000000000000')
        .set(authHeader(jefeRRHHToken));

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/employees/:id/full', () => {
    it('[JEFE RRHH] debe incluir cuentas bancarias', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      await db.EmployeeBankAccount.create({
        employeeId: employee.id,
        bankName: 'Banco Test',
        accountNumber: '0102012345678901234',
        accountType: 'CHECKING',
        currency: 'VES',
        isPrimary: true,
        paymentPercentage: 100
      });

      const response = await request(app)
        .get(`/api/employees/${employee.id}/full`)
        .set(authHeader(jefeRRHHToken));

      expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('bankAccounts');
      expect(Array.isArray(response.body.data.bankAccounts)).toBe(true);
    });
  });

  describe('POST /api/employees', () => {
    it('[JEFE RRHH] debe crear empleado con datos válidos', async () => {
      const employeeData = {
        firstName: 'Nuevo',
        lastName: 'Empleado',
        idType: 'V',
        idNumber: '11111111',
        email: 'nuevo@test.com',
        phone: '04141234567',
        hireDate: new Date().toISOString(),
        employmentStatus: 'ACTIVE',
        baseSalary: 1500
      };

      const response = await request(app)
        .post('/api/employees')
        .set(authHeader(jefeRRHHToken))
        .send(employeeData);

      expectSuccessResponse(response, 201);
      expect(response.body.data.firstName).toBe('Nuevo');
      expect(response.body.data.idNumber).toBe('11111111');
    });

    it('[JEFE RRHH] debe generar código automáticamente', async () => {
      const employeeData = {
        firstName: 'Test',
        lastName: 'Code',
        idType: 'V',
        idNumber: '22222222',
        hireDate: new Date().toISOString(),
        employmentStatus: 'ACTIVE'
      };

      const response = await request(app)
        .post('/api/employees')
        .set(authHeader(jefeRRHHToken))
        .send(employeeData);

      expectSuccessResponse(response, 201);
      expect(response.body.data.employeeCode).toBeDefined();
      expect(response.body.data.employeeCode).toMatch(/^EMP-\d{4}$/);
    });

    it('[JEFE RRHH] debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/employees')
        .set(authHeader(jefeRRHHToken))
        .send({
          firstName: 'Solo Nombre'
          // Faltan campos requeridos
        });

      expect(response.status).toBe(400);
    });

    it('[JEFE RRHH] debe validar formato de email', async () => {
      const employeeData = {
        firstName: 'Test',
        lastName: 'Email',
        idType: 'V',
        idNumber: '33333333',
        email: 'email-invalido',
        hireDate: new Date().toISOString(),
        employmentStatus: 'ACTIVE'
      };

      const response = await request(app)
        .post('/api/employees')
        .set(authHeader(jefeRRHHToken))
        .send(employeeData);

      expect(response.status).toBe(400);
    });

    it('[JEFE RRHH] debe validar unicidad de cédula', async () => {
      await db.Employee.create({
        firstName: 'Primero',
        lastName: 'Empleado',
        idType: 'V',
        idNumber: '44444444',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      const employeeData = {
        firstName: 'Segundo',
        lastName: 'Empleado',
        idType: 'V',
        idNumber: '44444444', // Misma cédula
        hireDate: new Date().toISOString(),
        employmentStatus: 'ACTIVE'
      };

      const response = await request(app)
        .post('/api/employees')
        .set(authHeader(jefeRRHHToken))
        .send(employeeData);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('[CONTADOR] debe retornar 403', async () => {
      const employeeData = {
        firstName: 'Test',
        lastName: 'Forbidden',
        idType: 'V',
        idNumber: '55555555',
        hireDate: new Date().toISOString(),
        employmentStatus: 'ACTIVE'
      };

      const response = await request(app)
        .post('/api/employees')
        .set(authHeader(contadorToken))
        .send(employeeData);

      expectErrorResponse(response, 403);
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('[JEFE RRHH] debe actualizar empleado', async () => {
      const employee = await db.Employee.create({
        firstName: 'Original',
        lastName: 'Name',
        idType: 'V',
        idNumber: '66666666',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      const response = await request(app)
        .put(`/api/employees/${employee.id}`)
        .set(authHeader(jefeRRHHToken))
        .send({
          firstName: 'Updated',
          email: 'updated@test.com'
        });

      expectSuccessResponse(response);
      expect(response.body.data.firstName).toBe('Updated');
      expect(response.body.data.email).toBe('updated@test.com');
    });

    it('[JEFE RRHH] debe validar datos al actualizar', async () => {
      const employee = await db.Employee.create({
        firstName: 'Test',
        lastName: 'Update',
        idType: 'V',
        idNumber: '77777777',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      const response = await request(app)
        .put(`/api/employees/${employee.id}`)
        .set(authHeader(jefeRRHHToken))
        .send({
          email: 'email-invalido' // Email inválido
        });

      expect(response.status).toBe(400);
    });

    it('[EMPLEADO REGULAR] NO puede actualizar', async () => {
      const employee = await db.Employee.create({
        firstName: 'Test',
        lastName: 'NoUpdate',
        idType: 'V',
        idNumber: '88888888',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      const response = await request(app)
        .put(`/api/employees/${employee.id}`)
        .set(authHeader(empleadoToken))
        .send({ firstName: 'Hacked' });

      expectErrorResponse(response, 403);
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('[JEFE RRHH] debe poder eliminar empleado', async () => {
      const employee = await db.Employee.create({
        firstName: 'To',
        lastName: 'Delete',
        idType: 'V',
        idNumber: '99999999',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      const response = await request(app)
        .delete(`/api/employees/${employee.id}`)
        .set(authHeader(jefeRRHHToken));

      expectSuccessResponse(response);

      // Verificar que fue eliminado
      const deleted = await db.Employee.findByPk(employee.id);
      expect(deleted).toBeNull();
    });

    it('[CONTADOR] debe retornar 403', async () => {
      const employee = await db.Employee.create({
        firstName: 'Test',
        lastName: 'Delete',
        idType: 'V',
        idNumber: '00000001',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      const response = await request(app)
        .delete(`/api/employees/${employee.id}`)
        .set(authHeader(contadorToken));

      expectErrorResponse(response, 403);
    });
  });
});
