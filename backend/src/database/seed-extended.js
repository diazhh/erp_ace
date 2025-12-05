require('dotenv').config();
const { sequelize } = require('./index');

const seedExtended = async () => {
  try {
    const models = require('./models');
    const {
      User, Employee, Department, Position,
      PayrollPeriod, PayrollEntry, EmployeeLoan, LoanPayment, EmployeeBankAccount,
      BankAccount, Transaction, TransactionCategory,
      PettyCash, PettyCashEntry,
      Contractor, ContractorInvoice, ContractorPayment,
      PurchaseOrder, PurchaseOrderItem, Quote, QuoteItem, QuoteRequest,
      Project, ProjectMember, ProjectMilestone, ProjectExpense, ProjectUpdate, ProjectValuation,
      Warehouse, InventoryCategory, InventoryItem, WarehouseStock, InventoryMovement,
      Vehicle, VehicleAssignment, VehicleMaintenance, FuelLog,
      Incident, Inspection, Training, TrainingAttendance, SafetyEquipment
    } = models;

    console.log('🌱 ========================================');
    console.log('   SEED EXTENDIDO DEL SISTEMA ERP');
    console.log('========================================\n');

    // Obtener usuario admin
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    const createdById = adminUser?.id;

    if (!createdById) {
      console.error('❌ No se encontró el usuario admin. Ejecuta primero seed.js');
      process.exit(1);
    }

    // Obtener empleados existentes
    const employees = await Employee.findAll({ limit: 10 });
    if (employees.length === 0) {
      console.error('❌ No hay empleados. Ejecuta primero seed-test-data.js');
      process.exit(1);
    }

    // Obtener proyectos existentes
    const projects = await Project.findAll();
    const projectsMap = {};
    projects.forEach(p => { projectsMap[p.code] = p; });

    // Obtener almacenes
    const warehouses = await Warehouse.findAll();
    const warehousesMap = {};
    warehouses.forEach(w => { warehousesMap[w.code] = w; });

    // Obtener items de inventario
    const invItems = await InventoryItem.findAll();
    const invItemsMap = {};
    invItems.forEach(i => { invItemsMap[i.code] = i; });

    // Obtener vehículos
    const vehicles = await Vehicle.findAll();

    // Obtener contratistas
    const contractors = await Contractor.findAll();
    const contractorsMap = {};
    contractors.forEach(c => { contractorsMap[c.code] = c; });

    // Obtener cuentas bancarias
    const bankAccounts = await BankAccount.findAll();
    const mainBankAccount = bankAccounts.find(b => b.currency === 'USD') || bankAccounts[0];

    // Obtener categorías de transacciones
    const txCategories = await TransactionCategory.findAll();
    const txCatMap = {};
    txCategories.forEach(c => { txCatMap[c.code] = c; });

    // Obtener cajas chicas
    const pettyCashes = await PettyCash.findAll();
    const mainPettyCash = pettyCashes[0];

    // Obtener capacitaciones
    const trainings = await Training.findAll();

    // ========================================
    // 1. NÓMINAS Y PERÍODOS DE PAGO
    // ========================================
    console.log('💰 Creando períodos de nómina y pagos...');

    const payrollPeriodsData = [
      { code: 'NOM-2024-01', name: 'Enero 2024', startDate: '2024-01-01', endDate: '2024-01-31', paymentDate: '2024-02-05', status: 'PAID' },
      { code: 'NOM-2024-02', name: 'Febrero 2024', startDate: '2024-02-01', endDate: '2024-02-29', paymentDate: '2024-03-05', status: 'PAID' },
      { code: 'NOM-2024-03', name: 'Marzo 2024', startDate: '2024-03-01', endDate: '2024-03-31', paymentDate: '2024-04-05', status: 'PAID' },
      { code: 'NOM-2024-04', name: 'Abril 2024', startDate: '2024-04-01', endDate: '2024-04-30', paymentDate: '2024-05-05', status: 'PAID' },
      { code: 'NOM-2024-05', name: 'Mayo 2024', startDate: '2024-05-01', endDate: '2024-05-31', paymentDate: '2024-06-05', status: 'PAID' },
      { code: 'NOM-2024-06', name: 'Junio 2024', startDate: '2024-06-01', endDate: '2024-06-30', paymentDate: '2024-07-05', status: 'PAID' },
      { code: 'NOM-2024-07', name: 'Julio 2024', startDate: '2024-07-01', endDate: '2024-07-31', paymentDate: '2024-08-05', status: 'PAID' },
      { code: 'NOM-2024-08', name: 'Agosto 2024', startDate: '2024-08-01', endDate: '2024-08-31', paymentDate: '2024-09-05', status: 'PAID' },
      { code: 'NOM-2024-09', name: 'Septiembre 2024', startDate: '2024-09-01', endDate: '2024-09-30', paymentDate: '2024-10-05', status: 'PAID' },
      { code: 'NOM-2024-10', name: 'Octubre 2024', startDate: '2024-10-01', endDate: '2024-10-31', paymentDate: '2024-11-05', status: 'PAID' },
      { code: 'NOM-2024-11', name: 'Noviembre 2024', startDate: '2024-11-01', endDate: '2024-11-30', paymentDate: '2024-12-05', status: 'PENDING_APPROVAL' },
      { code: 'NOM-2024-12', name: 'Diciembre 2024', startDate: '2024-12-01', endDate: '2024-12-31', paymentDate: '2025-01-05', status: 'DRAFT' },
    ];

    const payrollPeriods = {};
    for (const ppData of payrollPeriodsData) {
      const [pp] = await PayrollPeriod.findOrCreate({
        where: { code: ppData.code },
        defaults: {
          ...ppData,
          periodType: 'MONTHLY',
          currency: 'USD',
          createdBy: createdById
        }
      });
      payrollPeriods[ppData.code] = pp;
    }
    console.log(`   ✅ ${Object.keys(payrollPeriods).length} períodos de nómina creados`);

    // Crear entradas de nómina para los últimos 3 meses pagados
    const paidPeriods = ['NOM-2024-09', 'NOM-2024-10', 'NOM-2024-11'];
    let payrollEntriesCount = 0;
    
    for (const periodCode of paidPeriods) {
      const period = payrollPeriods[periodCode];
      if (!period) continue;

      for (const emp of employees) {
        const baseSalary = 800 + Math.random() * 1200; // Entre 800 y 2000 USD
        const grossPay = baseSalary * 1.15;
        const totalDeductions = baseSalary * 0.09;
        const [entry] = await PayrollEntry.findOrCreate({
          where: { periodId: period.id, employeeId: emp.id },
          defaults: {
            periodId: period.id,
            employeeId: emp.id,
            baseSalary: baseSalary.toFixed(2),
            daysWorked: 30,
            totalDays: 30,
            overtimeHours: Math.floor(Math.random() * 20),
            overtime: (Math.random() * 100).toFixed(2),
            bonus: (Math.random() * 150).toFixed(2),
            commission: 0,
            foodAllowance: 50,
            transportAllowance: 30,
            otherIncome: 0,
            grossPay: grossPay.toFixed(2),
            ssoDeduction: (baseSalary * 0.04).toFixed(2),
            rpeDeduction: (baseSalary * 0.005).toFixed(2),
            favDeduction: (baseSalary * 0.01).toFixed(2),
            islrDeduction: (baseSalary * 0.03).toFixed(2),
            loanDeduction: 0,
            otherDeductions: 0,
            totalDeductions: totalDeductions.toFixed(2),
            netPay: (grossPay - totalDeductions).toFixed(2),
            currency: 'USD',
            paymentStatus: period.status === 'PAID' ? 'PAID' : 'PENDING'
          }
        });
        payrollEntriesCount++;
      }
    }
    console.log(`   ✅ ${payrollEntriesCount} entradas de nómina creadas`);

    // ========================================
    // 2. PRÉSTAMOS DE EMPLEADOS
    // ========================================
    console.log('\n💳 Creando préstamos de empleados...');

    const loansData = [
      { code: 'PREST-2024-001', employeeIndex: 0, amount: 1500, installments: 6, reason: 'Emergencia médica familiar' },
      { code: 'PREST-2024-002', employeeIndex: 1, amount: 2000, installments: 12, reason: 'Reparación de vivienda' },
      { code: 'PREST-2024-003', employeeIndex: 2, amount: 800, installments: 4, reason: 'Gastos escolares' },
      { code: 'PREST-2024-004', employeeIndex: 3, amount: 3000, installments: 18, reason: 'Compra de vehículo' },
    ];

    let loansCount = 0;
    for (const loanData of loansData) {
      const emp = employees[loanData.employeeIndex];
      if (!emp) continue;

      const paidInstallments = Math.floor(loanData.installments / 2);
      const installmentAmount = loanData.amount / loanData.installments;
      const [loan] = await EmployeeLoan.findOrCreate({
        where: { code: loanData.code },
        defaults: {
          code: loanData.code,
          employeeId: emp.id,
          loanType: 'PERSONAL',
          description: loanData.reason,
          amount: loanData.amount,
          totalInstallments: loanData.installments,
          installmentAmount: installmentAmount.toFixed(2),
          paidInstallments: paidInstallments,
          remainingAmount: (loanData.amount - (paidInstallments * installmentAmount)).toFixed(2),
          currency: 'USD',
          startDate: '2024-07-01',
          status: 'ACTIVE',
          approvedBy: createdById,
          createdBy: createdById
        }
      });

      // Crear pagos del préstamo
      if (loan) {
        const paidCount = Math.floor(loanData.installments / 2);
        for (let i = 1; i <= paidCount; i++) {
          const paymentDate = new Date('2024-07-01');
          paymentDate.setMonth(paymentDate.getMonth() + i - 1);
          
          await LoanPayment.findOrCreate({
            where: { loanId: loan.id, installmentNumber: i },
            defaults: {
              loanId: loan.id,
              installmentNumber: i,
              amount: (loanData.amount / loanData.installments).toFixed(2),
              paymentDate: paymentDate.toISOString().split('T')[0],
              paymentMethod: 'PAYROLL_DEDUCTION',
              status: 'PAID',
              createdBy: createdById
            }
          });
        }
        loansCount++;
      }
    }
    console.log(`   ✅ ${loansCount} préstamos creados con pagos`);

    // ========================================
    // 3. TRANSACCIONES BANCARIAS
    // ========================================
    console.log('\n🏦 Creando transacciones bancarias...');

    if (mainBankAccount) {
      const transactionsData = [
        { code: 'TRX-2024-001', type: 'INCOME', category: 'SERVICIOS', description: 'Pago valuación PRY-2024-001 - Avance 30%', amount: 75000, date: '2024-03-15', reference: 'FAC-2024-001' },
        { code: 'TRX-2024-002', type: 'INCOME', category: 'SERVICIOS', description: 'Pago valuación PRY-2024-001 - Avance 60%', amount: 75000, date: '2024-05-20', reference: 'FAC-2024-002' },
        { code: 'TRX-2024-003', type: 'INCOME', category: 'SERVICIOS', description: 'Pago valuación PRY-2024-002 - Avance 20%', amount: 90000, date: '2024-04-10', reference: 'FAC-2024-003' },
        { code: 'TRX-2024-004', type: 'INCOME', category: 'CONSULTORIA', description: 'Consultoría técnica proyecto externo', amount: 15000, date: '2024-06-01', reference: 'FAC-2024-004' },
        { code: 'TRX-2024-005', type: 'EXPENSE', category: 'NOMINA', description: 'Nómina Septiembre 2024', amount: 25000, date: '2024-10-05', reference: 'NOM-2024-09' },
        { code: 'TRX-2024-006', type: 'EXPENSE', category: 'NOMINA', description: 'Nómina Octubre 2024', amount: 25500, date: '2024-11-05', reference: 'NOM-2024-10' },
        { code: 'TRX-2024-007', type: 'EXPENSE', category: 'PROVEEDORES', description: 'Pago contratista CONT-001 - Avance 1', amount: 45000, date: '2024-04-15', reference: 'PAG-CONT-001' },
        { code: 'TRX-2024-008', type: 'EXPENSE', category: 'PROVEEDORES', description: 'Pago contratista CONT-001 - Avance 2', amount: 50000, date: '2024-06-20', reference: 'PAG-CONT-002' },
        { code: 'TRX-2024-009', type: 'EXPENSE', category: 'FLOTA', description: 'Combustible flota Octubre', amount: 3500, date: '2024-10-30', reference: 'COMB-2024-10' },
        { code: 'TRX-2024-010', type: 'EXPENSE', category: 'MANTENIMIENTO', description: 'Mantenimiento vehículos Q3', amount: 2800, date: '2024-09-15', reference: 'MANT-2024-Q3' },
        { code: 'TRX-2024-011', type: 'EXPENSE', category: 'MATERIALES', description: 'Compra materiales proyecto PRY-2024-003', amount: 35000, date: '2024-05-10', reference: 'OC-2024-001' },
        { code: 'TRX-2024-012', type: 'EXPENSE', category: 'SERVICIOS', description: 'Servicios profesionales contables', amount: 2000, date: '2024-10-01', reference: 'SERV-2024-10' },
      ];

      let txCount = 0;
      for (const txData of transactionsData) {
        await Transaction.findOrCreate({
          where: { code: txData.code },
          defaults: {
            code: txData.code,
            accountId: mainBankAccount.id,
            transactionType: txData.type,
            category: txData.category,
            amount: txData.amount,
            currency: 'USD',
            description: txData.description,
            reference: txData.reference,
            transactionDate: txData.date,
            status: 'CONFIRMED',
            createdBy: createdById
          }
        });
        txCount++;
      }
      console.log(`   ✅ ${txCount} transacciones bancarias creadas`);
    }

    // ========================================
    // 4. MOVIMIENTOS DE CAJA CHICA
    // ========================================
    console.log('\n💵 Creando movimientos de caja chica...');

    if (mainPettyCash) {
      const pettyCashEntriesData = [
        { code: 'CC-001-0001', type: 'EXPENSE', description: 'Compra de útiles de oficina', amount: 45.50, date: '2024-10-05', category: 'OFFICE_SUPPLIES' },
        { code: 'CC-001-0002', type: 'EXPENSE', description: 'Taxi para entrega de documentos', amount: 25.00, date: '2024-10-08', category: 'TRANSPORTATION' },
        { code: 'CC-001-0003', type: 'EXPENSE', description: 'Refrigerios reunión de proyecto', amount: 85.00, date: '2024-10-12', category: 'MEALS' },
        { code: 'CC-001-0004', type: 'EXPENSE', description: 'Compra de agua para oficina', amount: 30.00, date: '2024-10-15', category: 'OFFICE_SUPPLIES' },
        { code: 'CC-001-0005', type: 'EXPENSE', description: 'Envío de encomienda urgente', amount: 55.00, date: '2024-10-18', category: 'COURIER' },
        { code: 'CC-001-0006', type: 'EXPENSE', description: 'Reparación menor equipo oficina', amount: 120.00, date: '2024-10-22', category: 'REPAIRS' },
        { code: 'CC-001-0007', type: 'EXPENSE', description: 'Combustible vehículo administrativo', amount: 80.00, date: '2024-10-25', category: 'FUEL' },
        { code: 'CC-001-0008', type: 'REPLENISHMENT', description: 'Reposición de caja chica', amount: 500.00, date: '2024-10-28', category: null },
        { code: 'CC-001-0009', type: 'EXPENSE', description: 'Compra de tóner impresora', amount: 95.00, date: '2024-11-02', category: 'OFFICE_SUPPLIES' },
        { code: 'CC-001-0010', type: 'EXPENSE', description: 'Almuerzo cliente potencial', amount: 150.00, date: '2024-11-05', category: 'MEALS' },
      ];

      let pcCount = 0;
      for (const pcData of pettyCashEntriesData) {
        await PettyCashEntry.findOrCreate({
          where: { code: pcData.code },
          defaults: {
            code: pcData.code,
            pettyCashId: mainPettyCash.id,
            entryType: pcData.type,
            category: pcData.category,
            description: pcData.description,
            amount: pcData.amount,
            entryDate: pcData.date,
            status: 'APPROVED',
            beneficiaryId: employees[0]?.id,
            approvedBy: createdById,
            createdBy: createdById
          }
        });
        pcCount++;
      }
      console.log(`   ✅ ${pcCount} movimientos de caja chica creados`);
    }

    // ========================================
    // 5. MEJORAS A PROYECTOS - MIEMBROS
    // ========================================
    console.log('\n📋 Mejorando proyectos con equipos y miembros...');

    const project1 = projectsMap['PRY-2024-001'];
    const project2 = projectsMap['PRY-2024-002'];
    const project3 = projectsMap['PRY-2024-003'];

    // Asignar miembros a proyectos
    if (project1 && employees.length >= 5) {
      const membersData = [
        { employeeIndex: 0, role: 'PROJECT_MANAGER', dedication: 100 },
        { employeeIndex: 1, role: 'SUPERVISOR', dedication: 100 },
        { employeeIndex: 2, role: 'ENGINEER', dedication: 80 },
        { employeeIndex: 3, role: 'TECHNICIAN', dedication: 100 },
        { employeeIndex: 4, role: 'TECHNICIAN', dedication: 100 },
      ];

      for (const memData of membersData) {
        const emp = employees[memData.employeeIndex];
        if (!emp) continue;
        await ProjectMember.findOrCreate({
          where: { projectId: project1.id, employeeId: emp.id },
          defaults: {
            projectId: project1.id,
            employeeId: emp.id,
            role: memData.role,
            dedicationPercentage: memData.dedication,
            startDate: project1.startDate,
            status: 'ACTIVE',
            createdBy: createdById
          }
        });
      }
    }

    if (project2 && employees.length >= 8) {
      const membersData = [
        { employeeIndex: 5, role: 'PROJECT_MANAGER', dedication: 100 },
        { employeeIndex: 6, role: 'SUPERVISOR', dedication: 100 },
        { employeeIndex: 7, role: 'ENGINEER', dedication: 100 },
      ];

      for (const memData of membersData) {
        const emp = employees[memData.employeeIndex];
        if (!emp) continue;
        await ProjectMember.findOrCreate({
          where: { projectId: project2.id, employeeId: emp.id },
          defaults: {
            projectId: project2.id,
            employeeId: emp.id,
            role: memData.role,
            dedicationPercentage: memData.dedication,
            startDate: project2.startDate,
            status: 'ACTIVE',
            createdBy: createdById
          }
        });
      }
    }
    console.log(`   ✅ Miembros asignados a proyectos`);

    // ========================================
    // 6. HITOS DE PROYECTOS
    // ========================================
    console.log('\n🎯 Creando hitos de proyectos...');

    if (project1) {
      const milestonesData = [
        { name: 'Movilización de equipos', dueDate: '2024-01-20', completedDate: '2024-01-18', progress: 100, status: 'COMPLETED' },
        { name: 'Preparación de locación', dueDate: '2024-02-15', completedDate: '2024-02-14', progress: 100, status: 'COMPLETED' },
        { name: 'Inicio de workover', dueDate: '2024-03-01', completedDate: '2024-03-02', progress: 100, status: 'COMPLETED' },
        { name: 'Completación de pozo', dueDate: '2024-04-30', completedDate: '2024-05-05', progress: 100, status: 'COMPLETED' },
        { name: 'Pruebas de producción', dueDate: '2024-05-31', completedDate: null, progress: 80, status: 'IN_PROGRESS' },
        { name: 'Entrega final', dueDate: '2024-06-30', completedDate: null, progress: 0, status: 'PENDING' },
      ];

      for (const msData of milestonesData) {
        await ProjectMilestone.findOrCreate({
          where: { projectId: project1.id, name: msData.name },
          defaults: {
            projectId: project1.id,
            name: msData.name,
            description: `Hito: ${msData.name}`,
            dueDate: msData.dueDate,
            completedDate: msData.completedDate,
            progress: msData.progress,
            status: msData.status,
            createdBy: createdById
          }
        });
      }
    }

    if (project2) {
      const milestonesData = [
        { name: 'Topografía y replanteo', dueDate: '2024-03-15', completedDate: '2024-03-14', progress: 100, status: 'COMPLETED' },
        { name: 'Excavación de zanja', dueDate: '2024-04-30', completedDate: '2024-05-02', progress: 100, status: 'COMPLETED' },
        { name: 'Tendido de tubería (2.5km)', dueDate: '2024-06-30', completedDate: null, progress: 60, status: 'IN_PROGRESS' },
        { name: 'Tendido de tubería (5km)', dueDate: '2024-08-15', completedDate: null, progress: 0, status: 'PENDING' },
        { name: 'Pruebas hidrostáticas', dueDate: '2024-09-15', completedDate: null, progress: 0, status: 'PENDING' },
        { name: 'Entrega y puesta en servicio', dueDate: '2024-09-30', completedDate: null, progress: 0, status: 'PENDING' },
      ];

      for (const msData of milestonesData) {
        await ProjectMilestone.findOrCreate({
          where: { projectId: project2.id, name: msData.name },
          defaults: {
            projectId: project2.id,
            name: msData.name,
            description: `Hito: ${msData.name}`,
            dueDate: msData.dueDate,
            completedDate: msData.completedDate,
            progress: msData.progress,
            status: msData.status,
            createdBy: createdById
          }
        });
      }
    }
    console.log(`   ✅ Hitos de proyectos creados`);

    // ========================================
    // 7. VALUACIONES DE PROYECTOS
    // ========================================
    console.log('\n📊 Creando valuaciones de proyectos...');

    if (project1) {
      const contractor = contractorsMap['CONT-001'];
      const valuationsData = [
        { number: 1, periodStart: '2024-01-01', periodEnd: '2024-02-28', prevPercent: 0, currPercent: 20, amount: 50000, status: 'PAID' },
        { number: 2, periodStart: '2024-03-01', periodEnd: '2024-04-30', prevPercent: 20, currPercent: 25, amount: 62500, status: 'PAID' },
        { number: 3, periodStart: '2024-05-01', periodEnd: '2024-06-30', prevPercent: 45, currPercent: 20, amount: 50000, status: 'APPROVED' },
      ];

      for (const valData of valuationsData) {
        const prevAmount = (valData.prevPercent / 100) * project1.budget;
        const totalPercent = valData.prevPercent + valData.currPercent;
        const totalAmount = prevAmount + valData.amount;
        
        await ProjectValuation.findOrCreate({
          where: { projectId: project1.id, valuationNumber: valData.number },
          defaults: {
            code: `VAL-PRY001-${valData.number.toString().padStart(3, '0')}`,
            projectId: project1.id,
            contractorId: contractor?.id,
            valuationNumber: valData.number,
            periodStart: valData.periodStart,
            periodEnd: valData.periodEnd,
            previousAccumulatedAmount: prevAmount,
            previousAccumulatedPercent: valData.prevPercent,
            currentAmount: valData.amount,
            currentPercent: valData.currPercent,
            totalAccumulatedAmount: totalAmount,
            totalAccumulatedPercent: totalPercent,
            currency: 'USD',
            status: valData.status,
            createdBy: createdById
          }
        });
      }
    }

    if (project2) {
      const contractor = contractorsMap['CONT-002'];
      const valuationsData = [
        { number: 1, periodStart: '2024-03-01', periodEnd: '2024-04-30', prevPercent: 0, currPercent: 15, amount: 67500, status: 'PAID' },
        { number: 2, periodStart: '2024-05-01', periodEnd: '2024-07-31', prevPercent: 15, currPercent: 20, amount: 90000, status: 'APPROVED' },
      ];

      for (const valData of valuationsData) {
        const prevAmount = (valData.prevPercent / 100) * project2.budget;
        const totalPercent = valData.prevPercent + valData.currPercent;
        const totalAmount = prevAmount + valData.amount;
        
        await ProjectValuation.findOrCreate({
          where: { projectId: project2.id, valuationNumber: valData.number },
          defaults: {
            code: `VAL-PRY002-${valData.number.toString().padStart(3, '0')}`,
            projectId: project2.id,
            contractorId: contractor?.id,
            valuationNumber: valData.number,
            periodStart: valData.periodStart,
            periodEnd: valData.periodEnd,
            previousAccumulatedAmount: prevAmount,
            previousAccumulatedPercent: valData.prevPercent,
            currentAmount: valData.amount,
            currentPercent: valData.currPercent,
            totalAccumulatedAmount: totalAmount,
            totalAccumulatedPercent: totalPercent,
            currency: 'USD',
            status: valData.status,
            createdBy: createdById
          }
        });
      }
    }
    console.log(`   ✅ Valuaciones de proyectos creadas`);

    // ========================================
    // 8. GASTOS DE PROYECTOS
    // ========================================
    console.log('\n💸 Creando gastos de proyectos...');

    if (project1) {
      const expensesData = [
        { code: 'PRY001-EXP-001', type: 'MATERIALS', description: 'Tubería de revestimiento', amount: 35000, date: '2024-02-15' },
        { code: 'PRY001-EXP-002', type: 'MATERIALS', description: 'Cemento para cementación', amount: 8000, date: '2024-03-10' },
        { code: 'PRY001-EXP-003', type: 'EQUIPMENT', description: 'Alquiler de grúa', amount: 12000, date: '2024-02-20' },
        { code: 'PRY001-EXP-004', type: 'LABOR', description: 'Mano de obra especializada', amount: 25000, date: '2024-03-30' },
        { code: 'PRY001-EXP-005', type: 'TRAVEL', description: 'Transporte de equipos', amount: 5500, date: '2024-01-25' },
        { code: 'PRY001-EXP-006', type: 'SERVICES', description: 'Servicios de wireline', amount: 18000, date: '2024-04-15' },
      ];

      for (const expData of expensesData) {
        await ProjectExpense.findOrCreate({
          where: { code: expData.code },
          defaults: {
            code: expData.code,
            projectId: project1.id,
            expenseType: expData.type,
            description: expData.description,
            amount: expData.amount,
            currency: 'USD',
            expenseDate: expData.date,
            status: 'APPROVED',
            approvedBy: createdById,
            createdBy: createdById
          }
        });
      }
    }
    console.log(`   ✅ Gastos de proyectos creados`);

    // ========================================
    // 9. ÓRDENES DE COMPRA Y COTIZACIONES
    // ========================================
    console.log('\n🛒 Creando órdenes de compra y cotizaciones...');

    // Solicitudes de cotización
    const quoteRequestsData = [
      { code: 'SOL-2024-001', title: 'Tubería para proyecto PRY-2024-002', projectCode: 'PRY-2024-002', status: 'AWARDED' },
      { code: 'SOL-2024-002', title: 'EPP para personal de campo', projectCode: null, status: 'AWARDED' },
      { code: 'SOL-2024-003', title: 'Válvulas para estación de bombeo', projectCode: 'PRY-2024-003', status: 'QUOTING' },
    ];

    const quoteRequests = {};
    for (const qrData of quoteRequestsData) {
      const project = qrData.projectCode ? projectsMap[qrData.projectCode] : null;
      const [qr] = await QuoteRequest.findOrCreate({
        where: { code: qrData.code },
        defaults: {
          code: qrData.code,
          requestType: 'PURCHASE',
          title: qrData.title,
          description: `Solicitud: ${qrData.title}`,
          projectId: project?.id,
          requestDate: '2024-10-01',
          requiredDate: '2024-12-15',
          quotesDeadline: '2024-10-15',
          status: qrData.status,
          requestedBy: createdById,
          createdBy: createdById
        }
      });
      quoteRequests[qrData.code] = qr;
    }
    console.log(`   ✅ ${Object.keys(quoteRequests).length} solicitudes de cotización creadas`);

    // Cotizaciones
    const quotesData = [
      { code: 'COT-2024-001', requestCode: 'SOL-2024-001', contractorCode: 'PROV-001', amount: 45000, status: 'APPROVED' },
      { code: 'COT-2024-002', requestCode: 'SOL-2024-001', contractorCode: 'PROV-002', amount: 48000, status: 'REJECTED' },
      { code: 'COT-2024-003', requestCode: 'SOL-2024-002', contractorCode: 'PROV-001', amount: 8500, status: 'APPROVED' },
      { code: 'COT-2024-004', requestCode: 'SOL-2024-003', contractorCode: 'PROV-001', amount: 32000, status: 'RECEIVED' },
      { code: 'COT-2024-005', requestCode: 'SOL-2024-003', contractorCode: 'PROV-002', amount: 35000, status: 'UNDER_REVIEW' },
    ];

    const quotes = {};
    for (const qData of quotesData) {
      const qr = quoteRequests[qData.requestCode];
      const contractor = contractorsMap[qData.contractorCode];
      if (!qr || !contractor) continue;

      const taxAmount = qData.amount * 0.16;
      const [quote] = await Quote.findOrCreate({
        where: { code: qData.code },
        defaults: {
          code: qData.code,
          quoteType: 'PURCHASE',
          title: qr.title,
          quoteRequestId: qr.id,
          contractorId: contractor.id,
          quoteDate: '2024-11-01',
          validUntil: '2024-12-31',
          subtotal: qData.amount,
          taxAmount: taxAmount,
          total: qData.amount + taxAmount,
          currency: 'USD',
          deliveryTime: '15 días',
          paymentTerms: '50% anticipo, 50% contra entrega',
          status: qData.status,
          createdBy: createdById
        }
      });
      quotes[qData.code] = quote;
    }
    console.log(`   ✅ ${Object.keys(quotes).length} cotizaciones creadas`);

    // Órdenes de compra
    const purchaseOrdersData = [
      { code: 'OC-2024-001', quoteCode: 'COT-2024-001', contractorCode: 'PROV-001', amount: 45000, status: 'COMPLETED' },
      { code: 'OC-2024-002', quoteCode: 'COT-2024-003', contractorCode: 'PROV-001', amount: 8500, status: 'COMPLETED' },
    ];

    for (const poData of purchaseOrdersData) {
      const contractor = contractorsMap[poData.contractorCode];
      const quote = quotes[poData.quoteCode];
      if (!contractor) continue;

      const taxAmount = poData.amount * 0.16;
      const [po] = await PurchaseOrder.findOrCreate({
        where: { code: poData.code },
        defaults: {
          code: poData.code,
          orderType: 'PURCHASE',
          title: quote?.title || 'Orden de compra',
          contractorId: contractor.id,
          orderDate: '2024-11-05',
          deliveryDate: '2024-11-20',
          actualDeliveryDate: poData.status === 'DELIVERED' ? '2024-11-18' : null,
          subtotal: poData.amount,
          taxAmount: taxAmount,
          total: poData.amount + taxAmount,
          currency: 'USD',
          paymentTerms: '50% anticipo, 50% contra entrega',
          status: poData.status,
          approvedBy: createdById,
          createdBy: createdById
        }
      });

      // Items de la orden
      if (po && poData.code === 'OC-2024-001') {
        await PurchaseOrderItem.findOrCreate({
          where: { purchaseOrderId: po.id, itemNumber: 1 },
          defaults: {
            purchaseOrderId: po.id,
            itemNumber: 1,
            description: 'Tubería 6" SCH40',
            quantity: 500,
            unit: 'MTS',
            unitPrice: 90,
            subtotal: 45000
          }
        });
      }
    }
    console.log(`   ✅ ${purchaseOrdersData.length} órdenes de compra creadas`);

    // Facturas y pagos a contratistas - omitido por complejidad de campos
    console.log('\n📄 Facturas de contratistas omitidas (requiere revisión de modelo)');

    // Movimientos de inventario - omitido por complejidad de campos
    console.log('\n📦 Movimientos de inventario omitidos (requiere revisión de modelo)');

    // Vehículos - omitido por complejidad de campos
    console.log('\n🚗 Asignaciones y mantenimientos de vehículos omitidos (requiere revisión de modelo)');

    // HSE - omitido por complejidad de campos
    console.log('\n🦺 Datos HSE omitidos (requiere revisión de modelo)');

    // ========================================
    // RESUMEN FINAL
    // ========================================
    console.log('\n========================================');
    console.log('📊 RESUMEN DE DATOS EXTENDIDOS');
    console.log('========================================');
    
    const counts = {
      'Períodos de Nómina': await PayrollPeriod.count(),
      'Entradas de Nómina': await PayrollEntry.count(),
      'Préstamos': await EmployeeLoan.count(),
      'Pagos de Préstamos': await LoanPayment.count(),
      'Transacciones Bancarias': await Transaction.count(),
      'Movimientos Caja Chica': await PettyCashEntry.count(),
      'Miembros de Proyecto': await ProjectMember.count(),
      'Hitos de Proyecto': await ProjectMilestone.count(),
      'Valuaciones': await ProjectValuation.count(),
      'Gastos de Proyecto': await ProjectExpense.count(),
      'Solicitudes de Cotización': await QuoteRequest.count(),
      'Cotizaciones': await Quote.count(),
      'Órdenes de Compra': await PurchaseOrder.count(),
      'Facturas Contratistas': await ContractorInvoice.count(),
      'Pagos a Contratistas': await ContractorPayment.count(),
      'Movimientos Inventario': await InventoryMovement.count(),
      'Asignaciones Vehículos': await VehicleAssignment.count(),
      'Mantenimientos': await VehicleMaintenance.count(),
      'Registros Combustible': await FuelLog.count(),
      'Incidentes HSE': await Incident.count(),
      'Inspecciones HSE': await Inspection.count(),
      'Asistencias Capacitación': await TrainingAttendance.count(),
    };

    for (const [key, value] of Object.entries(counts)) {
      console.log(`   ${key}: ${value}`);
    }

    console.log('\n🎉 Seed extendido ejecutado exitosamente!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed extendido:', error);
    process.exit(1);
  }
};

seedExtended();
