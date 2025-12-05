const db = require('../../../database/models');
const { setupTestDatabase, teardownTestDatabase } = require('../../../../tests/helpers/db.helper');

describe('Employee Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Limpiar empleados antes de cada prueba
    await db.Employee.destroy({ where: {}, force: true });
    await db.Department.destroy({ where: {}, force: true });
    await db.User.destroy({ where: {}, force: true });
  });

  describe('Employee-User Relationship', () => {
    it('debe vincular empleado con usuario al crear', async () => {
      // Crear usuario primero
      const user = await db.User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      // Crear empleado vinculado
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        email: 'juan.perez@test.com',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE',
        userId: user.id
      });

      expect(employee.userId).toBe(user.id);

      // Verificar relación
      const employeeWithUser = await db.Employee.findByPk(employee.id, {
        include: ['user']
      });

      expect(employeeWithUser.user).toBeDefined();
      expect(employeeWithUser.user.username).toBe('testuser');
    });

    it('debe obtener usuario desde empleado', async () => {
      const user = await db.User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        isActive: true
      });

      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE',
        userId: user.id
      });

      const foundEmployee = await db.Employee.findByPk(employee.id, {
        include: [{ association: 'user', attributes: ['username', 'email'] }]
      });

      expect(foundEmployee.user).toBeDefined();
      expect(foundEmployee.user.username).toBe('testuser');
    });

    it('debe permitir empleado sin usuario vinculado', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      expect(employee.userId).toBeNull();
    });
  });

  describe('Employee-Department Relationship', () => {
    it('debe asignar departamento al empleado', async () => {
      const department = await db.Department.create({
        name: 'Tecnología',
        code: 'TECH',
        type: 'DEPARTMENT',
        isActive: true
      });

      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE',
        departmentId: department.id
      });

      expect(employee.departmentId).toBe(department.id);

      // Verificar relación
      const employeeWithDept = await db.Employee.findByPk(employee.id, {
        include: ['departmentObj']
      });

      expect(employeeWithDept.departmentObj).toBeDefined();
      expect(employeeWithDept.departmentObj.name).toBe('Tecnología');
    });

    it('debe listar empleados por departamento', async () => {
      const department = await db.Department.create({
        name: 'Ventas',
        code: 'SALES',
        type: 'DEPARTMENT',
        isActive: true
      });

      await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE',
        departmentId: department.id
      });

      await db.Employee.create({
        firstName: 'María',
        lastName: 'González',
        idType: 'V',
        idNumber: '87654321',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE',
        departmentId: department.id
      });

      const employees = await db.Employee.findAll({
        where: { departmentId: department.id }
      });

      expect(employees).toHaveLength(2);
    });

    it('debe permitir empleado sin departamento', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      expect(employee.departmentId).toBeNull();
    });
  });

  describe('Employee-Supervisor Hierarchy', () => {
    it('debe establecer jerarquía supervisor-subordinado', async () => {
      // Crear supervisor
      const supervisor = await db.Employee.create({
        firstName: 'Carlos',
        lastName: 'Jefe',
        idType: 'V',
        idNumber: '11111111',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      // Crear subordinado
      const subordinate = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Empleado',
        idType: 'V',
        idNumber: '22222222',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE',
        supervisorId: supervisor.id
      });

      expect(subordinate.supervisorId).toBe(supervisor.id);

      // Verificar relación
      const employeeWithSupervisor = await db.Employee.findByPk(subordinate.id, {
        include: ['supervisor']
      });

      expect(employeeWithSupervisor.supervisor).toBeDefined();
      expect(employeeWithSupervisor.supervisor.firstName).toBe('Carlos');
    });

    it('debe listar subordinados de un supervisor', async () => {
      const supervisor = await db.Employee.create({
        firstName: 'Carlos',
        lastName: 'Jefe',
        idType: 'V',
        idNumber: '11111111',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Empleado1',
        idType: 'V',
        idNumber: '22222222',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE',
        supervisorId: supervisor.id
      });

      await db.Employee.create({
        firstName: 'María',
        lastName: 'Empleado2',
        idType: 'V',
        idNumber: '33333333',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE',
        supervisorId: supervisor.id
      });

      const supervisorWithSubordinates = await db.Employee.findByPk(supervisor.id, {
        include: ['subordinates']
      });

      expect(supervisorWithSubordinates.subordinates).toHaveLength(2);
    });

    it('debe permitir empleado sin supervisor', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      expect(employee.supervisorId).toBeNull();
    });
  });

  describe('Bank Accounts', () => {
    it('debe crear múltiples cuentas bancarias para un empleado', async () => {
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
        bankName: 'Banco Nacional',
        accountNumber: '01020123456789012345',
        accountType: 'CHECKING',
        currency: 'VES',
        isPrimary: true,
        paymentPercentage: 100
      });

      await db.EmployeeBankAccount.create({
        employeeId: employee.id,
        bankName: 'Banco Internacional',
        accountNumber: '99990123456789',
        accountType: 'SAVINGS',
        currency: 'USD',
        isPrimary: false,
        paymentPercentage: 0
      });

      const employeeWithAccounts = await db.Employee.findByPk(employee.id, {
        include: ['bankAccounts']
      });

      expect(employeeWithAccounts.bankAccounts).toHaveLength(2);
    });

    it('debe establecer cuenta primaria', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      const primaryAccount = await db.EmployeeBankAccount.create({
        employeeId: employee.id,
        bankName: 'Banco Principal',
        accountNumber: '01020123456789012345',
        accountType: 'CHECKING',
        currency: 'VES',
        isPrimary: true,
        paymentPercentage: 100
      });

      const account = await db.EmployeeBankAccount.findOne({
        where: { employeeId: employee.id, isPrimary: true }
      });

      expect(account).toBeDefined();
      expect(account.id).toBe(primaryAccount.id);
    });

    it('debe validar suma de porcentajes = 100%', async () => {
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
        bankName: 'Banco 1',
        accountNumber: '111111',
        accountType: 'CHECKING',
        currency: 'VES',
        isPrimary: true,
        paymentPercentage: 60
      });

      await db.EmployeeBankAccount.create({
        employeeId: employee.id,
        bankName: 'Banco 2',
        accountNumber: '222222',
        accountType: 'SAVINGS',
        currency: 'USD',
        isPrimary: false,
        paymentPercentage: 40
      });

      const accounts = await db.EmployeeBankAccount.findAll({
        where: { employeeId: employee.id }
      });

      const totalPercentage = accounts.reduce((sum, acc) => sum + acc.paymentPercentage, 0);
      expect(totalPercentage).toBe(100);
    });
  });

  describe('Employee Status Management', () => {
    it('debe crear empleado activo', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      expect(employee.employmentStatus).toBe('ACTIVE');
    });

    it('debe cambiar estado a INACTIVE', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      employee.employmentStatus = 'INACTIVE';
      employee.terminationDate = new Date();
      await employee.save();

      const updatedEmployee = await db.Employee.findByPk(employee.id);
      expect(updatedEmployee.employmentStatus).toBe('INACTIVE');
      expect(updatedEmployee.terminationDate).not.toBeNull();
    });

    it('debe validar unicidad de cédula', async () => {
      await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date(),
        employmentStatus: 'ACTIVE'
      });

      // Intentar crear otro empleado con la misma cédula
      await expect(
        db.Employee.create({
          firstName: 'María',
          lastName: 'González',
          idType: 'V',
          idNumber: '12345678', // Misma cédula
          hireDate: new Date(),
          employmentStatus: 'ACTIVE'
        })
      ).rejects.toThrow();
    });
  });
});
