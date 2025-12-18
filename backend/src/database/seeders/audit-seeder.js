/**
 * Seeder: Datos de Auditoría
 * 
 * Crea registros de auditoría de prueba para visualizar en las pestañas de auditoría
 */

const seedAuditLogs = async (models) => {
  const { AuditLog, User, Employee, BankAccount, PettyCash, PayrollPeriod, Department, Position } = models;

  console.log('📋 Iniciando seeder de Auditoría...');

  // Verificar si ya existen registros de auditoría
  const existingLogs = await AuditLog.count();
  if (existingLogs > 10) {
    console.log('ℹ️  Ya existen registros de auditoría, saltando seeder');
    return;
  }

  // Obtener usuario admin
  const admin = await User.findOne({ where: { username: 'admin' } });
  const userId = admin?.id;

  if (!userId) {
    console.log('⚠️  No se encontró usuario admin, saltando seeder de auditoría');
    return;
  }

  // Obtener entidades existentes para crear logs
  const employees = await Employee.findAll({ limit: 5 });
  const bankAccounts = await BankAccount.findAll({ limit: 3 });
  const pettyCashes = await PettyCash.findAll({ limit: 2 });
  const departments = await Department.findAll({ limit: 3 });
  const positions = await Position.findAll({ limit: 3 });

  const auditLogs = [];
  const now = new Date();

  // Helper para generar fechas pasadas
  const daysAgo = (days) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date;
  };

  // ==================== Logs de Empleados ====================
  for (const employee of employees) {
    // Log de creación
    auditLogs.push({
      userId,
      action: 'CREATE',
      entityType: 'Employee',
      entityId: employee.id,
      oldValues: null,
      newValues: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        status: 'ACTIVE',
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      metadata: { source: 'web', module: 'employees' },
      createdAt: daysAgo(Math.floor(Math.random() * 30) + 30),
    });

    // Log de actualización (algunos empleados)
    if (Math.random() > 0.5) {
      auditLogs.push({
        userId,
        action: 'UPDATE',
        entityType: 'Employee',
        entityId: employee.id,
        oldValues: { position: 'Analista' },
        newValues: { position: employee.position },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: { source: 'web', module: 'employees', changedFields: ['position'] },
        createdAt: daysAgo(Math.floor(Math.random() * 15)),
      });
    }
  }

  // ==================== Logs de Cuentas Bancarias ====================
  for (const account of bankAccounts) {
    auditLogs.push({
      userId,
      action: 'CREATE',
      entityType: 'BankAccount',
      entityId: account.id,
      oldValues: null,
      newValues: {
        name: account.name,
        accountType: account.accountType,
        currency: account.currency,
        isActive: true,
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      metadata: { source: 'web', module: 'finance' },
      createdAt: daysAgo(Math.floor(Math.random() * 60) + 30),
    });

    // Actualización de saldo
    auditLogs.push({
      userId,
      action: 'UPDATE',
      entityType: 'BankAccount',
      entityId: account.id,
      oldValues: { currentBalance: 0 },
      newValues: { currentBalance: account.currentBalance },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      metadata: { source: 'web', module: 'finance', changedFields: ['currentBalance'] },
      createdAt: daysAgo(Math.floor(Math.random() * 10)),
    });
  }

  // ==================== Logs de Caja Chica ====================
  for (const pettyCash of pettyCashes) {
    auditLogs.push({
      userId,
      action: 'CREATE',
      entityType: 'PettyCash',
      entityId: pettyCash.id,
      oldValues: null,
      newValues: {
        name: pettyCash.name,
        code: pettyCash.code,
        initialAmount: pettyCash.initialAmount,
        status: 'ACTIVE',
      },
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      metadata: { source: 'web', module: 'petty-cash' },
      createdAt: daysAgo(Math.floor(Math.random() * 45) + 15),
    });

    // Reposición
    auditLogs.push({
      userId,
      action: 'UPDATE',
      entityType: 'PettyCash',
      entityId: pettyCash.id,
      oldValues: { currentBalance: pettyCash.initialAmount * 0.3 },
      newValues: { currentBalance: pettyCash.currentBalance },
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      metadata: { source: 'web', module: 'petty-cash', action: 'replenishment' },
      createdAt: daysAgo(Math.floor(Math.random() * 5)),
    });
  }

  // ==================== Logs de Departamentos ====================
  for (const dept of departments) {
    auditLogs.push({
      userId,
      action: 'CREATE',
      entityType: 'Department',
      entityId: dept.id,
      oldValues: null,
      newValues: {
        name: dept.name,
        code: dept.code,
        isActive: true,
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      metadata: { source: 'web', module: 'organization' },
      createdAt: daysAgo(Math.floor(Math.random() * 90) + 60),
    });
  }

  // ==================== Logs de Cargos ====================
  for (const pos of positions) {
    auditLogs.push({
      userId,
      action: 'CREATE',
      entityType: 'Position',
      entityId: pos.id,
      oldValues: null,
      newValues: {
        name: pos.name,
        code: pos.code,
        level: pos.level,
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      metadata: { source: 'web', module: 'organization' },
      createdAt: daysAgo(Math.floor(Math.random() * 90) + 60),
    });
  }

  // ==================== Logs de Login/Logout ====================
  for (let i = 0; i < 5; i++) {
    auditLogs.push({
      userId,
      action: 'LOGIN',
      entityType: 'User',
      entityId: userId,
      oldValues: null,
      newValues: null,
      ipAddress: `192.168.1.${100 + i}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      metadata: { source: 'web', success: true },
      createdAt: daysAgo(i),
    });

    if (i > 0) {
      auditLogs.push({
        userId,
        action: 'LOGOUT',
        entityType: 'User',
        entityId: userId,
        oldValues: null,
        newValues: null,
        ipAddress: `192.168.1.${100 + i}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: { source: 'web' },
        createdAt: daysAgo(i - 0.5),
      });
    }
  }

  // Insertar todos los logs
  try {
    await AuditLog.bulkCreate(auditLogs, { validate: true });
    console.log(`✅ Creados ${auditLogs.length} registros de auditoría`);
  } catch (error) {
    console.error('❌ Error creando registros de auditoría:', error.message);
  }
};

module.exports = seedAuditLogs;
