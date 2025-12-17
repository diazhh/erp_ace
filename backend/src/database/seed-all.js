require('dotenv').config();
const { sequelize } = require('./index');

const seedAll = async () => {
  try {
    const models = require('./models');
    const {
      User, Role, Permission, Employee, EmployeeDocument, Department, Position, EmployeeBankAccount,
      PayrollPeriod, PayrollEntry, EmployeeLoan, LoanPayment,
      BankAccount, Transaction, ExchangeRate, TransactionCategory,
      PettyCash, PettyCashEntry,
      Contractor, ContractorBankAccount, ContractorDocument, ContractorInvoice, ContractorPayment,
      PurchaseOrder, PurchaseOrderItem,
      Project, ProjectMember, ProjectMilestone, ProjectExpense, ProjectUpdate, ProjectValuation,
      Warehouse, InventoryCategory, InventoryItem, WarehouseStock, InventoryMovement,
      Vehicle, VehicleAssignment, VehicleMaintenance, FuelLog,
      Quote, QuoteItem, QuoteRequest,
      Incident, Inspection, Training, TrainingAttendance, SafetyEquipment,
      DocumentCategory, Document, DocumentVersion
    } = models;

    console.log('🌱 ========================================');
    console.log('   SEED COMPLETO DEL SISTEMA ERP');
    console.log('========================================\n');

    // ========================================
    // 1. DEPARTAMENTOS Y POSICIONES
    // ========================================
    console.log('🏢 Creando estructura organizacional...');

    const departmentsData = [
      { code: 'DIR', name: 'Dirección General', description: 'Alta dirección de la empresa', status: 'ACTIVE', type: 'DIRECTION' },
      { code: 'OPS', name: 'Operaciones', description: 'Gestión de operaciones y proyectos', status: 'ACTIVE', type: 'MANAGEMENT' },
      { code: 'FIN', name: 'Finanzas', description: 'Contabilidad y finanzas', status: 'ACTIVE', type: 'MANAGEMENT' },
      { code: 'RRHH', name: 'Recursos Humanos', description: 'Gestión del talento humano', status: 'ACTIVE', type: 'DEPARTMENT' },
      { code: 'ADM', name: 'Administración', description: 'Servicios administrativos', status: 'ACTIVE', type: 'DEPARTMENT' },
      { code: 'HSE', name: 'HSE', description: 'Salud, Seguridad y Ambiente', status: 'ACTIVE', type: 'DEPARTMENT' },
      { code: 'PROC', name: 'Procura', description: 'Compras y adquisiciones', status: 'ACTIVE', type: 'DEPARTMENT' },
      { code: 'LOG', name: 'Logística', description: 'Almacén y transporte', status: 'ACTIVE', type: 'DEPARTMENT' },
    ];

    const departments = {};
    for (const deptData of departmentsData) {
      const [dept] = await Department.findOrCreate({
        where: { code: deptData.code },
        defaults: deptData
      });
      departments[deptData.code] = dept;
    }
    console.log(`   ✅ ${Object.keys(departments).length} departamentos creados`);

    const positionsData = [
      { code: 'GG', name: 'Gerente General', departmentCode: 'DIR', level: 1 },
      { code: 'GO', name: 'Gerente de Operaciones', departmentCode: 'OPS', level: 2 },
      { code: 'GF', name: 'Gerente de Finanzas', departmentCode: 'FIN', level: 2 },
      { code: 'GRRHH', name: 'Gerente de RRHH', departmentCode: 'RRHH', level: 2 },
      { code: 'SP', name: 'Supervisor de Proyectos', departmentCode: 'OPS', level: 3 },
      { code: 'IP', name: 'Ingeniero de Proyectos', departmentCode: 'OPS', level: 4 },
      { code: 'TC', name: 'Técnico de Campo', departmentCode: 'OPS', level: 5 },
      { code: 'CS', name: 'Contador Senior', departmentCode: 'FIN', level: 3 },
      { code: 'AC', name: 'Analista Contable', departmentCode: 'FIN', level: 4 },
      { code: 'CRRHH', name: 'Coordinador de RRHH', departmentCode: 'RRHH', level: 3 },
      { code: 'AA', name: 'Asistente Administrativo', departmentCode: 'ADM', level: 5 },
      { code: 'EHSE', name: 'Especialista HSE', departmentCode: 'HSE', level: 3 },
      { code: 'IHSE', name: 'Inspector HSE', departmentCode: 'HSE', level: 4 },
      { code: 'APRO', name: 'Analista de Procura', departmentCode: 'PROC', level: 4 },
      { code: 'ALOG', name: 'Almacenista', departmentCode: 'LOG', level: 5 },
      { code: 'COND', name: 'Conductor', departmentCode: 'LOG', level: 5 },
    ];

    const positions = {};
    for (const posData of positionsData) {
      const [pos] = await Position.findOrCreate({
        where: { code: posData.code },
        defaults: {
          code: posData.code,
          name: posData.name,
          departmentId: departments[posData.departmentCode]?.id,
          level: posData.level,
          status: 'ACTIVE'
        }
      });
      positions[posData.code] = pos;
    }
    console.log(`   ✅ ${Object.keys(positions).length} posiciones creadas`);

    // ========================================
    // 2. CATEGORÍAS DE TRANSACCIONES
    // ========================================
    console.log('\n💰 Creando categorías financieras...');

    const categoriesData = [
      { code: 'ING', name: 'Ingresos', type: 'INCOME', description: 'Ingresos operativos' },
      { code: 'ING-SERV', name: 'Servicios Petroleros', type: 'INCOME', parentCode: 'ING' },
      { code: 'ING-CONS', name: 'Consultoría', type: 'INCOME', parentCode: 'ING' },
      { code: 'GAS', name: 'Gastos', type: 'EXPENSE', description: 'Gastos operativos' },
      { code: 'GAS-NOM', name: 'Nómina', type: 'EXPENSE', parentCode: 'GAS' },
      { code: 'GAS-PROV', name: 'Proveedores', type: 'EXPENSE', parentCode: 'GAS' },
      { code: 'GAS-SERV', name: 'Servicios', type: 'EXPENSE', parentCode: 'GAS' },
      { code: 'GAS-FLOT', name: 'Flota', type: 'EXPENSE', parentCode: 'GAS' },
      { code: 'GAS-MANT', name: 'Mantenimiento', type: 'EXPENSE', parentCode: 'GAS' },
      { code: 'GAS-VIAJ', name: 'Viáticos', type: 'EXPENSE', parentCode: 'GAS' },
      { code: 'GAS-MAT', name: 'Materiales', type: 'EXPENSE', parentCode: 'GAS' },
    ];

    const categories = {};
    for (const catData of categoriesData) {
      const [cat] = await TransactionCategory.findOrCreate({
        where: { code: catData.code },
        defaults: {
          code: catData.code,
          name: catData.name,
          type: catData.type,
          description: catData.description,
          parent_id: catData.parentCode ? categories[catData.parentCode]?.id : null,
          isActive: true
        }
      });
      categories[catData.code] = cat;
    }
    console.log(`   ✅ ${Object.keys(categories).length} categorías creadas`);

    // ========================================
    // 3. CUENTAS BANCARIAS
    // ========================================
    console.log('\n🏦 Creando cuentas bancarias...');

    const bankAccountsData = [
      {
        name: 'Cuenta Principal USD',
        bankName: 'Banco Mercantil',
        accountNumber: '01050012345678901234',
        accountType: 'CHECKING',
        currency: 'USD',
        currentBalance: 150000.00,
        isActive: true,
        notes: 'Cuenta principal operativa USD'
      },
      {
        name: 'Cuenta Operativa VES',
        bankName: 'Banco Provincial',
        accountNumber: '01080098765432109876',
        accountType: 'CHECKING',
        currency: 'VES',
        currentBalance: 5000000.00,
        isActive: true,
        notes: 'Cuenta operativa Bolívares'
      },
      {
        name: 'Cuenta Reserva USD',
        bankName: 'Banesco',
        accountNumber: '01340011223344556677',
        accountType: 'SAVINGS',
        currency: 'USD',
        currentBalance: 50000.00,
        isActive: true,
        notes: 'Cuenta de reserva USD'
      },
    ];

    const bankAccounts = {};
    for (const accData of bankAccountsData) {
      const [acc] = await BankAccount.findOrCreate({
        where: { accountNumber: accData.accountNumber },
        defaults: accData
      });
      bankAccounts[accData.name] = acc;
    }
    console.log(`   ✅ ${Object.keys(bankAccounts).length} cuentas bancarias creadas`);

    // ========================================
    // 4. TASAS DE CAMBIO
    // ========================================
    console.log('\n💱 Creando tasas de cambio...');

    const today = new Date();
    const exchangeRatesData = [];
    for (let i = 30; i >= 0; i--) {
      const rateDate = new Date(today);
      rateDate.setDate(rateDate.getDate() - i);
      const baseRate = 36.50 + (Math.random() * 2 - 1);
      exchangeRatesData.push({
        fromCurrency: 'USD',
        toCurrency: 'VES',
        rate: parseFloat(baseRate.toFixed(4)),
        date: rateDate.toISOString().split('T')[0],
        source: 'BCV',
        isActive: true
      });
    }

    for (const rateData of exchangeRatesData) {
      await ExchangeRate.findOrCreate({
        where: {
          fromCurrency: rateData.fromCurrency,
          toCurrency: rateData.toCurrency,
          date: rateData.date
        },
        defaults: rateData
      });
    }
    console.log(`   ✅ ${exchangeRatesData.length} tasas de cambio creadas`);

    // ========================================
    // 5. CONTRATISTAS/PROVEEDORES
    // ========================================
    console.log('\n🏗️ Creando contratistas y proveedores...');

    // Obtener usuario admin para createdBy
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    const createdById = adminUser?.id;

    const contractorsData = [
      {
        code: 'CONT-001',
        companyName: 'Servicios Petroleros del Oriente C.A.',
        taxId: 'J-12345678-9',
        contactName: 'José Martínez',
        contactEmail: 'jmartinez@spoca.com',
        contactPhone: '0281-2345678',
        address: 'Av. Principal, Edificio SPO, Piso 3',
        city: 'Puerto La Cruz',
        state: 'Anzoátegui',
        specialties: ['Perforación', 'Workover', 'Completación'],
        status: 'ACTIVE',
        rating: 4.5,
        createdBy: createdById
      },
      {
        code: 'CONT-002',
        companyName: 'Transporte y Logística Zulia C.A.',
        taxId: 'J-23456789-0',
        contactName: 'María López',
        contactEmail: 'mlopez@tlzulia.com',
        contactPhone: '0261-7654321',
        address: 'Zona Industrial, Galpón 15',
        city: 'Maracaibo',
        state: 'Zulia',
        specialties: ['Transporte pesado', 'Grúas', 'Izaje'],
        status: 'ACTIVE',
        rating: 4.2,
        createdBy: createdById
      },
      {
        code: 'PROV-001',
        companyName: 'Suministros Industriales Venezuela',
        taxId: 'J-34567890-1',
        contactName: 'Carlos Rodríguez',
        contactEmail: 'crodriguez@sivca.com',
        contactPhone: '0212-5551234',
        address: 'Av. Libertador, Centro Comercial Industrial',
        city: 'Caracas',
        state: 'Distrito Capital',
        specialties: ['Materiales', 'Herramientas', 'EPP'],
        status: 'ACTIVE',
        rating: 4.0,
        createdBy: createdById
      },
      {
        code: 'PROV-002',
        companyName: 'Ferretería Industrial del Centro',
        taxId: 'J-45678901-2',
        contactName: 'Ana Gómez',
        contactEmail: 'agomez@ficca.com',
        contactPhone: '0241-8889999',
        address: 'Zona Industrial Castillito',
        city: 'Valencia',
        state: 'Carabobo',
        specialties: ['Ferretería', 'Tornillería', 'Soldadura'],
        status: 'ACTIVE',
        rating: 3.8,
        createdBy: createdById
      },
      {
        code: 'CONT-003',
        companyName: 'Ingeniería y Construcción Falcón',
        taxId: 'J-56789012-3',
        contactName: 'Pedro Hernández',
        contactEmail: 'phernandez@icfalcon.com',
        contactPhone: '0269-2468135',
        address: 'Calle Comercio, Edificio ICF',
        city: 'Punto Fijo',
        state: 'Falcón',
        specialties: ['Construcción', 'Obras civiles', 'Mantenimiento'],
        status: 'ACTIVE',
        rating: 4.3,
        createdBy: createdById
      },
    ];

    const contractors = {};
    for (const contData of contractorsData) {
      const [cont] = await Contractor.findOrCreate({
        where: { code: contData.code },
        defaults: contData
      });
      contractors[contData.code] = cont;

      // Crear cuenta bancaria para el contratista
      await ContractorBankAccount.findOrCreate({
        where: { contractorId: cont.id, isPrimary: true },
        defaults: {
          contractorId: cont.id,
          bankName: 'Banco Mercantil',
          accountNumber: `0105${Math.random().toString().slice(2, 18)}`,
          accountType: 'CHECKING',
          holderName: contData.companyName,
          holderIdType: 'J',
          holderIdNumber: contData.taxId?.replace(/[^0-9]/g, ''),
          currency: 'USD',
          isPrimary: true,
          isVerified: true,
          status: 'ACTIVE',
          createdBy: createdById
        }
      });
    }
    console.log(`   ✅ ${Object.keys(contractors).length} contratistas/proveedores creados`);

    // ========================================
    // 6. PROYECTOS
    // ========================================
    console.log('\n📋 Creando proyectos...');

    const projectsData = [
      {
        code: 'PRY-2024-001',
        name: 'Mantenimiento Pozo Anaco-15',
        description: 'Trabajos de mantenimiento y workover en pozo Anaco-15',
        clientName: 'PDVSA Gas',
        location: 'Campo Anaco, Anzoátegui',
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        budget: 250000.00,
        currency: 'USD',
        status: 'IN_PROGRESS',
        progress: 65,
        priority: 'HIGH',
        executionType: 'OUTSOURCED',
        contractorCode: 'CONT-001',
        createdBy: createdById
      },
      {
        code: 'PRY-2024-002',
        name: 'Instalación Línea de Flujo Sector Norte',
        description: 'Instalación de 5km de línea de flujo en sector norte',
        clientName: 'PDVSA Occidente',
        location: 'Campo Lagunillas, Zulia',
        startDate: '2024-03-01',
        endDate: '2024-09-30',
        budget: 450000.00,
        currency: 'USD',
        status: 'IN_PROGRESS',
        progress: 35,
        priority: 'MEDIUM',
        executionType: 'OUTSOURCED',
        contractorCode: 'CONT-002',
        createdBy: createdById
      },
      {
        code: 'PRY-2024-003',
        name: 'Construcción Estación de Bombeo',
        description: 'Construcción de nueva estación de bombeo para campo petrolero',
        clientName: 'Petroquímica de Venezuela',
        location: 'Complejo Petroquímico El Tablazo, Zulia',
        startDate: '2024-02-01',
        endDate: '2024-12-31',
        budget: 800000.00,
        currency: 'USD',
        status: 'IN_PROGRESS',
        progress: 20,
        priority: 'HIGH',
        executionType: 'OUTSOURCED',
        contractorCode: 'CONT-003',
        createdBy: createdById
      },
      {
        code: 'PRY-2023-010',
        name: 'Rehabilitación Tanque TK-105',
        description: 'Rehabilitación y pintura de tanque de almacenamiento',
        clientName: 'PDVSA Refinación',
        location: 'Refinería El Palito, Carabobo',
        startDate: '2023-09-01',
        endDate: '2024-01-31',
        actualEndDate: '2024-01-15',
        budget: 180000.00,
        currency: 'USD',
        status: 'COMPLETED',
        progress: 100,
        priority: 'MEDIUM',
        executionType: 'OUTSOURCED',
        contractorCode: 'CONT-003',
        createdBy: createdById
      },
      {
        code: 'PRY-2024-004',
        name: 'Suministro EPP Anual',
        description: 'Contrato anual de suministro de equipos de protección personal',
        clientName: 'Interno',
        location: 'Nacional',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        budget: 50000.00,
        currency: 'USD',
        status: 'IN_PROGRESS',
        progress: 75,
        priority: 'LOW',
        executionType: 'INTERNAL',
        contractorCode: 'PROV-001',
        createdBy: createdById
      },
    ];

    const projects = {};
    for (const projData of projectsData) {
      const { contractorCode, ...projectFields } = projData;
      const [proj] = await Project.findOrCreate({
        where: { code: projData.code },
        defaults: {
          ...projectFields,
          contractorId: contractors[contractorCode]?.id,
          departmentId: departments['OPS']?.id
        }
      });
      projects[projData.code] = proj;
    }
    console.log(`   ✅ ${Object.keys(projects).length} proyectos creados`);

    // ========================================
    // 6.1 MIEMBROS DE PROYECTO
    // ========================================
    console.log('\n👥 Creando miembros de proyecto...');

    // Obtener empleados existentes
    const allEmployees = await Employee.findAll({ where: { status: 'ACTIVE' }, limit: 10 });
    
    const projectMembersData = [
      { projectCode: 'PRY-2024-001', employeeIndex: 0, role: 'PROJECT_MANAGER', allocation: 100, status: 'ACTIVE' },
      { projectCode: 'PRY-2024-001', employeeIndex: 1, role: 'ENGINEER', allocation: 80, status: 'ACTIVE' },
      { projectCode: 'PRY-2024-001', employeeIndex: 2, role: 'TECHNICIAN', allocation: 100, status: 'ACTIVE' },
      { projectCode: 'PRY-2024-002', employeeIndex: 0, role: 'PROJECT_MANAGER', allocation: 50, status: 'ACTIVE' },
      { projectCode: 'PRY-2024-002', employeeIndex: 3, role: 'SUPERVISOR', allocation: 100, status: 'ACTIVE' },
      { projectCode: 'PRY-2024-002', employeeIndex: 4, role: 'TECHNICIAN', allocation: 100, status: 'ACTIVE' },
      { projectCode: 'PRY-2024-003', employeeIndex: 1, role: 'PROJECT_MANAGER', allocation: 100, status: 'ACTIVE' },
      { projectCode: 'PRY-2024-003', employeeIndex: 5, role: 'ENGINEER', allocation: 80, status: 'ACTIVE' },
    ];

    let membersCreated = 0;
    for (const memberData of projectMembersData) {
      const project = projects[memberData.projectCode];
      const employee = allEmployees[memberData.employeeIndex];
      if (project && employee) {
        await ProjectMember.findOrCreate({
          where: { projectId: project.id, employeeId: employee.id },
          defaults: {
            projectId: project.id,
            employeeId: employee.id,
            role: memberData.role,
            allocation: memberData.allocation,
            status: memberData.status,
            startDate: project.startDate
          }
        });
        membersCreated++;
      }
    }
    console.log(`   ✅ ${membersCreated} miembros de proyecto creados`);

    // ========================================
    // 6.2 HITOS DE PROYECTO
    // ========================================
    console.log('\n🎯 Creando hitos de proyecto...');

    const milestonesData = [
      { projectCode: 'PRY-2024-001', name: 'Movilización de equipos', description: 'Traslado de equipos y personal al sitio', dueDate: '2024-01-20', status: 'COMPLETED', weight: 10 },
      { projectCode: 'PRY-2024-001', name: 'Inspección inicial', description: 'Evaluación del estado del pozo', dueDate: '2024-02-01', status: 'COMPLETED', weight: 15 },
      { projectCode: 'PRY-2024-001', name: 'Trabajos de workover', description: 'Ejecución de trabajos principales', dueDate: '2024-04-30', status: 'IN_PROGRESS', weight: 50 },
      { projectCode: 'PRY-2024-001', name: 'Pruebas de producción', description: 'Verificación de resultados', dueDate: '2024-06-15', status: 'PENDING', weight: 15 },
      { projectCode: 'PRY-2024-001', name: 'Desmovilización', description: 'Retiro de equipos y cierre', dueDate: '2024-06-30', status: 'PENDING', weight: 10 },
      { projectCode: 'PRY-2024-002', name: 'Topografía y replanteo', description: 'Levantamiento topográfico del trazado', dueDate: '2024-03-15', status: 'COMPLETED', weight: 10 },
      { projectCode: 'PRY-2024-002', name: 'Excavación de zanja', description: 'Apertura de zanja para tubería', dueDate: '2024-05-30', status: 'IN_PROGRESS', weight: 25 },
      { projectCode: 'PRY-2024-002', name: 'Tendido de tubería', description: 'Instalación de línea de flujo', dueDate: '2024-07-31', status: 'PENDING', weight: 35 },
      { projectCode: 'PRY-2024-002', name: 'Pruebas hidrostáticas', description: 'Pruebas de presión', dueDate: '2024-09-15', status: 'PENDING', weight: 20 },
      { projectCode: 'PRY-2024-002', name: 'Entrega final', description: 'Documentación y entrega', dueDate: '2024-09-30', status: 'PENDING', weight: 10 },
      { projectCode: 'PRY-2024-003', name: 'Obras civiles', description: 'Fundaciones y estructuras', dueDate: '2024-05-31', status: 'IN_PROGRESS', weight: 30 },
      { projectCode: 'PRY-2024-003', name: 'Instalación mecánica', description: 'Montaje de bombas y equipos', dueDate: '2024-08-31', status: 'PENDING', weight: 35 },
      { projectCode: 'PRY-2024-003', name: 'Instalación eléctrica', description: 'Cableado y tableros', dueDate: '2024-10-31', status: 'PENDING', weight: 20 },
      { projectCode: 'PRY-2024-003', name: 'Comisionamiento', description: 'Pruebas y puesta en marcha', dueDate: '2024-12-15', status: 'PENDING', weight: 15 },
    ];

    let milestonesCreated = 0;
    for (const msData of milestonesData) {
      const project = projects[msData.projectCode];
      if (project) {
        await ProjectMilestone.findOrCreate({
          where: { projectId: project.id, name: msData.name },
          defaults: {
            projectId: project.id,
            name: msData.name,
            description: msData.description,
            dueDate: msData.dueDate,
            status: msData.status,
            weight: msData.weight,
            completedDate: msData.status === 'COMPLETED' ? msData.dueDate : null,
            createdBy: createdById
          }
        });
        milestonesCreated++;
      }
    }
    console.log(`   ✅ ${milestonesCreated} hitos creados`);

    // ========================================
    // 6.3 GASTOS DE PROYECTO
    // ========================================
    console.log('\n💸 Creando gastos de proyecto...');

    const expensesData = [
      { projectCode: 'PRY-2024-001', code: 'GAS-001-001', expenseType: 'MATERIALS', description: 'Tubería de revestimiento 7"', amount: 15000, currency: 'USD', expenseDate: '2024-02-10', status: 'APPROVED', vendor: 'Tubos de Acero CA' },
      { projectCode: 'PRY-2024-001', code: 'GAS-001-002', expenseType: 'SERVICES', description: 'Servicio de grúa', amount: 8500, currency: 'USD', expenseDate: '2024-02-15', status: 'APPROVED', vendor: 'Grúas Oriente' },
      { projectCode: 'PRY-2024-001', code: 'GAS-001-003', expenseType: 'LABOR', description: 'Mano de obra especializada', amount: 12000, currency: 'USD', expenseDate: '2024-03-01', status: 'APPROVED', vendor: 'Personal propio' },
      { projectCode: 'PRY-2024-001', code: 'GAS-001-004', expenseType: 'EQUIPMENT', description: 'Alquiler de equipo de perforación', amount: 25000, currency: 'USD', expenseDate: '2024-03-15', status: 'PENDING', vendor: 'Drilling Services CA' },
      { projectCode: 'PRY-2024-002', code: 'GAS-002-001', expenseType: 'MATERIALS', description: 'Tubería API 5L 8"', amount: 45000, currency: 'USD', expenseDate: '2024-03-20', status: 'APPROVED', vendor: 'Tubos de Acero CA' },
      { projectCode: 'PRY-2024-002', code: 'GAS-002-002', expenseType: 'SERVICES', description: 'Excavación mecánica', amount: 18000, currency: 'USD', expenseDate: '2024-04-01', status: 'APPROVED', vendor: 'Movimientos de Tierra CA' },
      { projectCode: 'PRY-2024-002', code: 'GAS-002-003', expenseType: 'TRAVEL', description: 'Viáticos personal técnico', amount: 3500, currency: 'USD', expenseDate: '2024-04-15', status: 'APPROVED', vendor: 'Interno' },
      { projectCode: 'PRY-2024-003', code: 'GAS-003-001', expenseType: 'MATERIALS', description: 'Concreto premezclado', amount: 22000, currency: 'USD', expenseDate: '2024-03-01', status: 'APPROVED', vendor: 'Cemex Venezuela' },
      { projectCode: 'PRY-2024-003', code: 'GAS-003-002', expenseType: 'MATERIALS', description: 'Acero de refuerzo', amount: 35000, currency: 'USD', expenseDate: '2024-03-15', status: 'APPROVED', vendor: 'Sidor' },
      { projectCode: 'PRY-2024-003', code: 'GAS-003-003', expenseType: 'EQUIPMENT', description: 'Bombas centrífugas', amount: 85000, currency: 'USD', expenseDate: '2024-04-01', status: 'PENDING', vendor: 'Flowserve' },
    ];

    let expensesCreated = 0;
    for (const expData of expensesData) {
      const project = projects[expData.projectCode];
      if (project) {
        await ProjectExpense.findOrCreate({
          where: { code: expData.code },
          defaults: {
            projectId: project.id,
            code: expData.code,
            expenseType: expData.expenseType,
            description: expData.description,
            amount: expData.amount,
            currency: expData.currency,
            expenseDate: expData.expenseDate,
            status: expData.status,
            vendor: expData.vendor,
            createdBy: createdById
          }
        });
        expensesCreated++;
      }
    }
    console.log(`   ✅ ${expensesCreated} gastos de proyecto creados`);

    // ========================================
    // 6.4 VALUACIONES DE PROYECTO (OUTSOURCED)
    // ========================================
    console.log('\n📊 Creando valuaciones de proyecto...');

    const valuationsData = [
      { projectCode: 'PRY-2024-001', code: 'VAL-001-01', periodStart: '2024-01-15', periodEnd: '2024-02-15', previousPercent: 0, currentPercent: 20, status: 'APPROVED', description: 'Valuación #1 - Movilización e inspección' },
      { projectCode: 'PRY-2024-001', code: 'VAL-001-02', periodStart: '2024-02-16', periodEnd: '2024-03-31', previousPercent: 20, currentPercent: 45, status: 'APPROVED', description: 'Valuación #2 - Inicio trabajos workover' },
      { projectCode: 'PRY-2024-001', code: 'VAL-001-03', periodStart: '2024-04-01', periodEnd: '2024-04-30', previousPercent: 45, currentPercent: 65, status: 'SUBMITTED', description: 'Valuación #3 - Avance trabajos principales' },
      { projectCode: 'PRY-2024-002', code: 'VAL-002-01', periodStart: '2024-03-01', periodEnd: '2024-03-31', previousPercent: 0, currentPercent: 10, status: 'APPROVED', description: 'Valuación #1 - Topografía y replanteo' },
      { projectCode: 'PRY-2024-002', code: 'VAL-002-02', periodStart: '2024-04-01', periodEnd: '2024-05-15', previousPercent: 10, currentPercent: 35, status: 'DRAFT', description: 'Valuación #2 - Excavación de zanja' },
      { projectCode: 'PRY-2024-003', code: 'VAL-003-01', periodStart: '2024-02-01', periodEnd: '2024-03-31', previousPercent: 0, currentPercent: 10, status: 'APPROVED', description: 'Valuación #1 - Preparación del sitio' },
      { projectCode: 'PRY-2024-003', code: 'VAL-003-02', periodStart: '2024-04-01', periodEnd: '2024-05-15', previousPercent: 10, currentPercent: 20, status: 'UNDER_REVIEW', description: 'Valuación #2 - Obras civiles' },
    ];

    let valuationsCreated = 0;
    for (const valData of valuationsData) {
      const project = projects[valData.projectCode];
      if (project && project.executionType === 'OUTSOURCED') {
        const contractAmount = project.budget || 100000;
        const currentAmount = (valData.currentPercent - valData.previousPercent) * contractAmount / 100;
        const totalAccumulatedAmount = valData.currentPercent * contractAmount / 100;
        
        await ProjectValuation.findOrCreate({
          where: { code: valData.code },
          defaults: {
            projectId: project.id,
            code: valData.code,
            periodStart: valData.periodStart,
            periodEnd: valData.periodEnd,
            previousPercent: valData.previousPercent,
            currentPercent: valData.currentPercent,
            totalAccumulatedPercent: valData.currentPercent,
            currentAmount: currentAmount,
            totalAccumulatedAmount: totalAccumulatedAmount,
            currency: project.currency || 'USD',
            status: valData.status,
            description: valData.description,
            submittedAt: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED'].includes(valData.status) ? new Date() : null,
            approvedAt: valData.status === 'APPROVED' ? new Date() : null,
            createdBy: createdById
          }
        });
        valuationsCreated++;
      }
    }
    console.log(`   ✅ ${valuationsCreated} valuaciones creadas`);

    // ========================================
    // 6.5 ACTUALIZACIONES DE PROYECTO
    // ========================================
    console.log('\n📝 Creando actualizaciones de proyecto...');

    const updatesData = [
      { projectCode: 'PRY-2024-001', updateType: 'PROGRESS', title: 'Inicio de movilización', description: 'Se inició la movilización de equipos al sitio. Personal técnico en camino.', progressBefore: 0, progressAfter: 5, reportedAt: '2024-01-16' },
      { projectCode: 'PRY-2024-001', updateType: 'MILESTONE', title: 'Movilización completada', description: 'Todos los equipos y personal están en sitio. Se inicia inspección.', progressBefore: 5, progressAfter: 10, reportedAt: '2024-01-20' },
      { projectCode: 'PRY-2024-001', updateType: 'PROGRESS', title: 'Inspección inicial completada', description: 'Se completó la evaluación del estado del pozo. Resultados favorables.', progressBefore: 10, progressAfter: 20, reportedAt: '2024-02-01' },
      { projectCode: 'PRY-2024-001', updateType: 'ISSUE', title: 'Retraso por condiciones climáticas', description: 'Lluvias intensas causaron retraso de 3 días en las operaciones.', progressBefore: 45, progressAfter: 45, reportedAt: '2024-03-20' },
      { projectCode: 'PRY-2024-001', updateType: 'PROGRESS', title: 'Avance en trabajos de workover', description: 'Se completó el 65% de los trabajos principales. Operaciones en curso.', progressBefore: 45, progressAfter: 65, reportedAt: '2024-04-30' },
      { projectCode: 'PRY-2024-002', updateType: 'PROGRESS', title: 'Inicio de proyecto', description: 'Se dio inicio formal al proyecto con la llegada del equipo topográfico.', progressBefore: 0, progressAfter: 5, reportedAt: '2024-03-02' },
      { projectCode: 'PRY-2024-002', updateType: 'MILESTONE', title: 'Topografía completada', description: 'Levantamiento topográfico finalizado. Trazado definido.', progressBefore: 5, progressAfter: 10, reportedAt: '2024-03-15' },
      { projectCode: 'PRY-2024-002', updateType: 'PROGRESS', title: 'Avance en excavación', description: 'Se ha completado 2.5km de zanja. Avance del 50% en esta fase.', progressBefore: 10, progressAfter: 35, reportedAt: '2024-05-10' },
      { projectCode: 'PRY-2024-003', updateType: 'PROGRESS', title: 'Inicio de obras civiles', description: 'Comenzaron los trabajos de fundaciones para la estación de bombeo.', progressBefore: 0, progressAfter: 5, reportedAt: '2024-02-05' },
      { projectCode: 'PRY-2024-003', updateType: 'PROGRESS', title: 'Avance en fundaciones', description: 'Fundaciones principales completadas al 80%.', progressBefore: 5, progressAfter: 15, reportedAt: '2024-04-01' },
      { projectCode: 'PRY-2024-003', updateType: 'SAFETY', title: 'Simulacro de emergencia', description: 'Se realizó simulacro de evacuación con resultados satisfactorios.', progressBefore: 15, progressAfter: 15, reportedAt: '2024-04-15' },
      { projectCode: 'PRY-2024-003', updateType: 'PROGRESS', title: 'Estructuras metálicas', description: 'Inicio del montaje de estructuras metálicas.', progressBefore: 15, progressAfter: 20, reportedAt: '2024-05-01' },
    ];

    let updatesCreated = 0;
    for (const updData of updatesData) {
      const project = projects[updData.projectCode];
      if (project) {
        await ProjectUpdate.findOrCreate({
          where: { projectId: project.id, title: updData.title },
          defaults: {
            projectId: project.id,
            updateType: updData.updateType,
            title: updData.title,
            description: updData.description,
            progressBefore: updData.progressBefore,
            progressAfter: updData.progressAfter,
            reportedAt: updData.reportedAt,
            reportedBy: createdById
          }
        });
        updatesCreated++;
      }
    }
    console.log(`   ✅ ${updatesCreated} actualizaciones creadas`);

    // ========================================
    // 7. ALMACENES E INVENTARIO
    // ========================================
    console.log('\n📦 Creando almacenes e inventario...');

    const warehousesData = [
      { code: 'ALM-CENTRAL', name: 'Almacén Central', location: 'Caracas', warehouseType: 'MAIN', status: 'ACTIVE', createdBy: createdById },
      { code: 'ALM-ANACO', name: 'Almacén Anaco', location: 'Anaco, Anzoátegui', warehouseType: 'PROJECT', projectCode: 'PRY-2024-001', status: 'ACTIVE', createdBy: createdById },
      { code: 'ALM-ZULIA', name: 'Almacén Zulia', location: 'Maracaibo, Zulia', warehouseType: 'SECONDARY', status: 'ACTIVE', createdBy: createdById },
    ];

    const warehouses = {};
    for (const whData of warehousesData) {
      const { projectCode, ...warehouseFields } = whData;
      const [wh] = await Warehouse.findOrCreate({
        where: { code: whData.code },
        defaults: {
          ...warehouseFields,
          projectId: projectCode ? projects[projectCode]?.id : null
        }
      });
      warehouses[whData.code] = wh;
    }
    console.log(`   ✅ ${Object.keys(warehouses).length} almacenes creados`);

    // Categorías de inventario
    const invCategoriesData = [
      { code: 'MAT', name: 'Materiales', description: 'Materiales de construcción y operación', level: 0 },
      { code: 'MAT-TUB', name: 'Tubería', parentCode: 'MAT', level: 1 },
      { code: 'MAT-VAL', name: 'Válvulas', parentCode: 'MAT', level: 1 },
      { code: 'MAT-ACC', name: 'Accesorios', parentCode: 'MAT', level: 1 },
      { code: 'HER', name: 'Herramientas', description: 'Herramientas manuales y eléctricas', level: 0 },
      { code: 'EPP', name: 'EPP', description: 'Equipos de protección personal', level: 0 },
      { code: 'EPP-CAB', name: 'Protección Cabeza', parentCode: 'EPP', level: 1 },
      { code: 'EPP-MAN', name: 'Protección Manos', parentCode: 'EPP', level: 1 },
      { code: 'EPP-PIE', name: 'Protección Pies', parentCode: 'EPP', level: 1 },
      { code: 'CON', name: 'Consumibles', description: 'Materiales consumibles', level: 0 },
    ];

    const invCategories = {};
    for (const catData of invCategoriesData) {
      const { parentCode, ...categoryFields } = catData;
      const [cat] = await InventoryCategory.findOrCreate({
        where: { code: catData.code },
        defaults: {
          ...categoryFields,
          parentId: parentCode ? invCategories[parentCode]?.id : null,
          status: 'ACTIVE',
          createdBy: createdById
        }
      });
      invCategories[catData.code] = cat;
    }
    console.log(`   ✅ ${Object.keys(invCategories).length} categorías de inventario creadas`);

    // Items de inventario
    const invItemsData = [
      { code: 'TUB-4-SCH40', name: 'Tubería 4" SCH40', categoryCode: 'MAT-TUB', unit: 'MTS', minStock: 100, maxStock: 500, reorderPoint: 150, unitCost: 45.00, itemType: 'MATERIAL' },
      { code: 'TUB-6-SCH40', name: 'Tubería 6" SCH40', categoryCode: 'MAT-TUB', unit: 'MTS', minStock: 50, maxStock: 200, reorderPoint: 75, unitCost: 85.00, itemType: 'MATERIAL' },
      { code: 'VAL-COMP-4', name: 'Válvula Compuerta 4"', categoryCode: 'MAT-VAL', unit: 'UND', minStock: 10, maxStock: 50, reorderPoint: 15, unitCost: 350.00, itemType: 'MATERIAL' },
      { code: 'VAL-BOLA-2', name: 'Válvula Bola 2"', categoryCode: 'MAT-VAL', unit: 'UND', minStock: 20, maxStock: 100, reorderPoint: 30, unitCost: 120.00, itemType: 'MATERIAL' },
      { code: 'CASCO-BL', name: 'Casco de Seguridad Blanco', categoryCode: 'EPP-CAB', unit: 'UND', minStock: 50, maxStock: 200, reorderPoint: 75, unitCost: 25.00, itemType: 'EQUIPMENT' },
      { code: 'CASCO-AM', name: 'Casco de Seguridad Amarillo', categoryCode: 'EPP-CAB', unit: 'UND', minStock: 30, maxStock: 100, reorderPoint: 45, unitCost: 25.00, itemType: 'EQUIPMENT' },
      { code: 'GUANTE-NIL', name: 'Guantes de Nitrilo', categoryCode: 'EPP-MAN', unit: 'PAR', minStock: 200, maxStock: 1000, reorderPoint: 300, unitCost: 8.00, itemType: 'CONSUMABLE' },
      { code: 'BOTA-SEG', name: 'Botas de Seguridad', categoryCode: 'EPP-PIE', unit: 'PAR', minStock: 30, maxStock: 100, reorderPoint: 45, unitCost: 85.00, itemType: 'EQUIPMENT' },
      { code: 'SOLD-6013', name: 'Electrodo 6013 3/32"', categoryCode: 'CON', unit: 'KG', minStock: 50, maxStock: 200, reorderPoint: 75, unitCost: 12.00, itemType: 'CONSUMABLE' },
      { code: 'DISCO-COR', name: 'Disco de Corte 7"', categoryCode: 'CON', unit: 'UND', minStock: 100, maxStock: 500, reorderPoint: 150, unitCost: 5.00, itemType: 'CONSUMABLE' },
    ];

    const invItems = {};
    for (const itemData of invItemsData) {
      const { categoryCode, ...itemFields } = itemData;
      const qty = Math.floor(Math.random() * (itemData.maxStock - itemData.minStock)) + itemData.minStock;
      const [item] = await InventoryItem.findOrCreate({
        where: { code: itemData.code },
        defaults: {
          ...itemFields,
          categoryId: invCategories[categoryCode]?.id,
          currency: 'USD',
          status: 'ACTIVE',
          totalStock: qty,
          availableStock: qty,
          createdBy: createdById
        }
      });
      invItems[itemData.code] = item;

      // Crear stock en almacén central
      await WarehouseStock.findOrCreate({
        where: { warehouseId: warehouses['ALM-CENTRAL'].id, itemId: item.id },
        defaults: {
          warehouseId: warehouses['ALM-CENTRAL'].id,
          itemId: item.id,
          quantity: qty,
          reservedQuantity: 0,
          lastCountDate: new Date()
        }
      });
    }
    console.log(`   ✅ ${Object.keys(invItems).length} items de inventario creados con stock`);

    // ========================================
    // 8. VEHÍCULOS Y FLOTA
    // ========================================
    console.log('\n🚗 Creando flota de vehículos...');

    const vehiclesData = [
      { code: 'VEH-001', plate: 'ABC-123', brand: 'Toyota', model: 'Hilux', year: 2022, vehicleType: 'PICKUP', fuelType: 'DIESEL', status: 'AVAILABLE', color: 'Blanco' },
      { code: 'VEH-002', plate: 'DEF-456', brand: 'Ford', model: 'Ranger', year: 2021, vehicleType: 'PICKUP', fuelType: 'DIESEL', status: 'ASSIGNED', color: 'Gris' },
      { code: 'VEH-003', plate: 'GHI-789', brand: 'Chevrolet', model: 'N300', year: 2023, vehicleType: 'VAN', fuelType: 'GASOLINE', status: 'AVAILABLE', color: 'Blanco' },
      { code: 'VEH-004', plate: 'JKL-012', brand: 'Hyundai', model: 'Tucson', year: 2022, vehicleType: 'SUV', fuelType: 'GASOLINE', status: 'ASSIGNED', color: 'Negro' },
      { code: 'VEH-005', plate: 'MNO-345', brand: 'Mitsubishi', model: 'L200', year: 2020, vehicleType: 'PICKUP', fuelType: 'DIESEL', status: 'IN_MAINTENANCE', color: 'Rojo' },
    ];

    const vehicles = {};
    for (const vehData of vehiclesData) {
      const [veh] = await Vehicle.findOrCreate({
        where: { plate: vehData.plate },
        defaults: {
          ...vehData,
          mileage: Math.floor(Math.random() * 80000) + 20000,
          tankCapacity: vehData.fuelType === 'DIESEL' ? 80 : 60,
          ownershipType: 'OWNED'
        }
      });
      vehicles[vehData.code] = veh;
    }
    console.log(`   ✅ ${Object.keys(vehicles).length} vehículos creados`);

    // ========================================
    // 9. HSE - CAPACITACIONES Y EQUIPOS
    // ========================================
    console.log('\n🦺 Creando datos de HSE...');

    const trainingsData = [
      { code: 'CAP-001', title: 'Inducción HSE General', trainingType: 'INDUCTION', durationHours: 8, status: 'COMPLETED', scheduledDate: '2024-01-15' },
      { code: 'CAP-002', title: 'Trabajo en Alturas', trainingType: 'HEIGHTS', durationHours: 16, status: 'COMPLETED', scheduledDate: '2024-02-20' },
      { code: 'CAP-003', title: 'Manejo Defensivo', trainingType: 'DEFENSIVE_DRIVING', durationHours: 8, status: 'COMPLETED', scheduledDate: '2024-03-10' },
      { code: 'CAP-004', title: 'Primeros Auxilios', trainingType: 'FIRST_AID', durationHours: 8, status: 'SCHEDULED', scheduledDate: '2024-12-15' },
      { code: 'CAP-005', title: 'Espacios Confinados', trainingType: 'CONFINED_SPACES', durationHours: 16, status: 'SCHEDULED', scheduledDate: '2025-01-20' },
    ];

    const trainings = {};
    for (const trainData of trainingsData) {
      const [train] = await Training.findOrCreate({
        where: { code: trainData.code },
        defaults: {
          ...trainData,
          location: 'Sala de Capacitación - Oficina Central',
          maxParticipants: 20,
          createdBy: createdById
        }
      });
      trainings[trainData.code] = train;
    }
    console.log(`   ✅ ${Object.keys(trainings).length} capacitaciones creadas`);

    const safetyEquipmentData = [
      { code: 'EQ-001', name: 'Extintor ABC 10lb', equipmentType: 'FIRE_EXTINGUISHER', serialNumber: 'EXT-2024-001', status: 'AVAILABLE', lastInspectionDate: '2024-06-01', expiryDate: '2025-06-01' },
      { code: 'EQ-002', name: 'Extintor CO2 15lb', equipmentType: 'FIRE_EXTINGUISHER', serialNumber: 'EXT-2024-002', status: 'AVAILABLE', lastInspectionDate: '2024-06-01', expiryDate: '2025-06-01' },
      { code: 'EQ-003', name: 'Botiquín Primeros Auxilios', equipmentType: 'FIRST_AID_KIT', serialNumber: 'BOT-2024-001', status: 'AVAILABLE', lastInspectionDate: '2024-09-01', expiryDate: '2025-03-01' },
      { code: 'EQ-004', name: 'Arnés de Seguridad', equipmentType: 'HARNESS', serialNumber: 'ARN-2024-001', status: 'ASSIGNED', lastInspectionDate: '2024-08-01', expiryDate: '2026-08-01' },
      { code: 'EQ-005', name: 'Detector de Gases Portátil', equipmentType: 'OTHER', serialNumber: 'DET-2024-001', status: 'AVAILABLE', lastInspectionDate: '2024-10-01', expiryDate: '2025-10-01' },
    ];

    for (const eqData of safetyEquipmentData) {
      await SafetyEquipment.findOrCreate({
        where: { code: eqData.code },
        defaults: {
          ...eqData,
          warehouseId: warehouses['ALM-CENTRAL']?.id,
          condition: 'GOOD',
          createdBy: createdById
        }
      });
    }
    console.log(`   ✅ ${safetyEquipmentData.length} equipos de seguridad creados`);

    // ========================================
    // 10. CATEGORÍAS DE DOCUMENTOS
    // ========================================
    console.log('\n📁 Creando categorías de documentos...');

    const docCategoriesData = [
      { code: 'CONT', name: 'Contratos', description: 'Contratos y acuerdos legales', module: 'LEGAL' },
      { code: 'PROC', name: 'Procedimientos', description: 'Procedimientos operativos', module: 'GENERAL' },
      { code: 'FORM', name: 'Formatos', description: 'Formatos y plantillas', module: 'ADMINISTRATIVE' },
      { code: 'CERT', name: 'Certificaciones', description: 'Certificaciones y acreditaciones', module: 'HSE', requires_expiry: true },
      { code: 'INF', name: 'Informes', description: 'Informes y reportes', module: 'GENERAL' },
      { code: 'PLAN', name: 'Planes', description: 'Planes de trabajo y proyectos', module: 'PROJECT' },
    ];

    for (const catData of docCategoriesData) {
      await DocumentCategory.findOrCreate({
        where: { code: catData.code },
        defaults: { ...catData, status: 'ACTIVE', createdBy: createdById }
      });
    }
    console.log(`   ✅ ${docCategoriesData.length} categorías de documentos creadas`);

    // ========================================
    // 11. CAJA CHICA
    // ========================================
    console.log('\n💵 Creando cajas chicas...');

    // Primero necesitamos empleados, así que verificamos si existen
    const employeeCount = await Employee.count();
    if (employeeCount > 0) {
      const firstEmployee = await Employee.findOne();
      
      const pettyCashData = [
        { code: 'CC-CENTRAL', name: 'Caja Chica Central', initialAmount: 5000.00, currentBalance: 3500.00, currency: 'USD', status: 'ACTIVE' },
        { code: 'CC-OPS', name: 'Caja Chica Operaciones', initialAmount: 2000.00, currentBalance: 1200.00, currency: 'USD', status: 'ACTIVE' },
      ];

      for (const pcData of pettyCashData) {
        await PettyCash.findOrCreate({
          where: { code: pcData.code },
          defaults: {
            ...pcData,
            custodianId: firstEmployee.id,
            minimumBalance: pcData.initialAmount * 0.2,
            maximumExpense: pcData.initialAmount * 0.1,
            bankAccountId: bankAccounts['Cuenta Principal USD']?.id,
            createdBy: createdById
          }
        });
      }
      console.log(`   ✅ ${pettyCashData.length} cajas chicas creadas`);
    }

    // ========================================
    // RESUMEN FINAL
    // ========================================
    console.log('\n========================================');
    // ========================================
    // COMPLIANCE MODULE
    // ========================================
    const seedCompliance = require('./seeders/compliance-seeder');
    await seedCompliance(models);

    // ========================================
    // JIB MODULE
    // ========================================
    const seedJIB = require('./seeders/jib-seeder');
    await seedJIB(models);

    console.log('📊 RESUMEN DE DATOS CREADOS');
    console.log('========================================');
    
    const counts = {
      'Departamentos': await Department.count(),
      'Posiciones': await Position.count(),
      'Categorías Financieras': await TransactionCategory.count(),
      'Cuentas Bancarias': await BankAccount.count(),
      'Tasas de Cambio': await ExchangeRate.count(),
      'Contratistas/Proveedores': await Contractor.count(),
      'Proyectos': await Project.count(),
      'Almacenes': await Warehouse.count(),
      'Categorías Inventario': await InventoryCategory.count(),
      'Items Inventario': await InventoryItem.count(),
      'Vehículos': await Vehicle.count(),
      'Capacitaciones HSE': await Training.count(),
      'Equipos Seguridad': await SafetyEquipment.count(),
      'Categorías Documentos': await DocumentCategory.count(),
      'Cajas Chicas': await PettyCash.count(),
    };

    for (const [key, value] of Object.entries(counts)) {
      console.log(`   ${key}: ${value}`);
    }

    console.log('\n🎉 Seed completo ejecutado exitosamente!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedAll();
