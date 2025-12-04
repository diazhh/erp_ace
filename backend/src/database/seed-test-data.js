require('dotenv').config();
const { sequelize } = require('./index');
const bcrypt = require('bcrypt');

const seedTestData = async () => {
  try {
    const models = require('./models');
    const { User, Role, Permission, Employee, EmployeeDocument } = models;

    console.log('🌱 Creando datos de prueba...\n');

    // ========================================
    // 1. OBTENER ROLES EXISTENTES
    // ========================================
    const roles = await Role.findAll();
    const roleMap = {};
    roles.forEach(r => { roleMap[r.name] = r; });

    console.log('✅ Roles disponibles:', Object.keys(roleMap).join(', '));

    // ========================================
    // 2. CREAR USUARIOS DE PRUEBA
    // ========================================
    console.log('\n📝 Creando usuarios de prueba...');

    const usersData = [
      {
        username: 'gerente',
        email: 'gerente@erp.local',
        password: 'Gerente123!',
        firstName: 'Carlos',
        lastName: 'Mendoza',
        roleName: 'Gerente General',
      },
      {
        username: 'contador',
        email: 'contador@erp.local',
        password: 'Contador123!',
        firstName: 'María',
        lastName: 'González',
        roleName: 'Contador',
      },
      {
        username: 'rrhh',
        email: 'rrhh@erp.local',
        password: 'Rrhh1234!',
        firstName: 'Ana',
        lastName: 'Rodríguez',
        roleName: 'Jefe de RRHH',
      },
      {
        username: 'supervisor',
        email: 'supervisor@erp.local',
        password: 'Super123!',
        firstName: 'Pedro',
        lastName: 'Martínez',
        roleName: 'Supervisor de Operaciones',
      },
      {
        username: 'empleado1',
        email: 'empleado1@erp.local',
        password: 'Empleado1!',
        firstName: 'Luis',
        lastName: 'Pérez',
        roleName: 'Empleado',
      },
    ];

    for (const userData of usersData) {
      const existing = await User.findOne({ where: { username: userData.username } });
      if (!existing) {
        const user = await User.create({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isActive: true,
        });

        if (roleMap[userData.roleName]) {
          await user.addRole(roleMap[userData.roleName]);
        }

        console.log(`   ✅ Usuario creado: ${userData.username} (${userData.roleName})`);
      } else {
        console.log(`   ℹ️  Usuario ya existe: ${userData.username}`);
      }
    }

    // ========================================
    // 3. CREAR EMPLEADOS DE PRUEBA
    // ========================================
    console.log('\n👥 Creando empleados de prueba...');

    const employeesData = [
      {
        firstName: 'Roberto',
        lastName: 'Hernández',
        idType: 'V',
        idNumber: '15234567',
        email: 'roberto.hernandez@empresa.com',
        phone: '0212-5551234',
        mobilePhone: '0414-1234567',
        position: 'Ingeniero de Proyectos',
        department: 'Operaciones',
        hireDate: '2020-03-15',
        baseSalary: 2500.00,
        salaryCurrency: 'USD',
        status: 'ACTIVE',
        address: 'Av. Principal, Edificio Torre Norte, Piso 5',
        city: 'Caracas',
        state: 'Distrito Capital',
        emergencyContactName: 'María Hernández',
        emergencyContactPhone: '0412-9876543',
        emergencyContactRelation: 'Esposa',
        bankName: 'Banco Mercantil',
        bankAccountType: 'CHECKING',
        bankAccountNumber: '01050012345678901234',
      },
      {
        firstName: 'Carmen',
        lastName: 'López',
        idType: 'V',
        idNumber: '18765432',
        email: 'carmen.lopez@empresa.com',
        phone: '0212-5559876',
        mobilePhone: '0424-7654321',
        position: 'Analista Contable',
        department: 'Finanzas',
        hireDate: '2021-06-01',
        baseSalary: 1800.00,
        salaryCurrency: 'USD',
        status: 'ACTIVE',
        address: 'Calle Los Cedros, Casa 45',
        city: 'Maracaibo',
        state: 'Zulia',
        emergencyContactName: 'José López',
        emergencyContactPhone: '0414-1112233',
        emergencyContactRelation: 'Padre',
        bankName: 'Banco Provincial',
        bankAccountType: 'SAVINGS',
        bankAccountNumber: '01080098765432109876',
      },
      {
        firstName: 'Miguel',
        lastName: 'Torres',
        idType: 'V',
        idNumber: '20123456',
        email: 'miguel.torres@empresa.com',
        mobilePhone: '0416-3334455',
        position: 'Técnico de Campo',
        department: 'Operaciones',
        hireDate: '2022-01-10',
        baseSalary: 1200.00,
        salaryCurrency: 'USD',
        status: 'ACTIVE',
        city: 'Punto Fijo',
        state: 'Falcón',
        emergencyContactName: 'Rosa Torres',
        emergencyContactPhone: '0426-5556677',
        emergencyContactRelation: 'Madre',
      },
      {
        firstName: 'Sofía',
        lastName: 'Ramírez',
        idType: 'V',
        idNumber: '22345678',
        email: 'sofia.ramirez@empresa.com',
        mobilePhone: '0412-8889900',
        position: 'Asistente Administrativo',
        department: 'Administración',
        hireDate: '2023-03-20',
        baseSalary: 900.00,
        salaryCurrency: 'USD',
        status: 'ACTIVE',
        city: 'Caracas',
        state: 'Distrito Capital',
      },
      {
        firstName: 'Andrés',
        lastName: 'Vargas',
        idType: 'V',
        idNumber: '16789012',
        email: 'andres.vargas@empresa.com',
        mobilePhone: '0424-1122334',
        position: 'Supervisor de Planta',
        department: 'Operaciones',
        hireDate: '2019-08-05',
        baseSalary: 2200.00,
        salaryCurrency: 'USD',
        status: 'ACTIVE',
        city: 'Puerto La Cruz',
        state: 'Anzoátegui',
      },
      {
        firstName: 'Elena',
        lastName: 'Morales',
        idType: 'V',
        idNumber: '19876543',
        email: 'elena.morales@empresa.com',
        mobilePhone: '0414-5566778',
        position: 'Coordinadora de RRHH',
        department: 'Recursos Humanos',
        hireDate: '2021-11-15',
        baseSalary: 1600.00,
        salaryCurrency: 'USD',
        status: 'ACTIVE',
        city: 'Caracas',
        state: 'Distrito Capital',
      },
      {
        firstName: 'Fernando',
        lastName: 'Castro',
        idType: 'V',
        idNumber: '14567890',
        email: 'fernando.castro@empresa.com',
        mobilePhone: '0416-9900112',
        position: 'Gerente de Operaciones',
        department: 'Operaciones',
        hireDate: '2018-02-01',
        baseSalary: 3500.00,
        salaryCurrency: 'USD',
        status: 'ACTIVE',
        city: 'Maracaibo',
        state: 'Zulia',
      },
      {
        firstName: 'Patricia',
        lastName: 'Díaz',
        idType: 'V',
        idNumber: '21234567',
        email: 'patricia.diaz@empresa.com',
        mobilePhone: '0424-3344556',
        position: 'Analista de Compras',
        department: 'Procura',
        hireDate: '2022-07-18',
        baseSalary: 1400.00,
        salaryCurrency: 'USD',
        status: 'ON_LEAVE',
        city: 'Valencia',
        state: 'Carabobo',
      },
      {
        firstName: 'Ricardo',
        lastName: 'Jiménez',
        idType: 'E',
        idNumber: '85432109',
        email: 'ricardo.jimenez@empresa.com',
        mobilePhone: '0412-7788990',
        position: 'Especialista HSE',
        department: 'HSE',
        hireDate: '2020-09-01',
        baseSalary: 2800.00,
        salaryCurrency: 'USD',
        status: 'ACTIVE',
        nationality: 'Colombiana',
        city: 'Caracas',
        state: 'Distrito Capital',
      },
      {
        firstName: 'Gabriela',
        lastName: 'Mendoza',
        idType: 'V',
        idNumber: '17654321',
        email: 'gabriela.mendoza@empresa.com',
        mobilePhone: '0426-1234567',
        position: 'Contador Senior',
        department: 'Finanzas',
        hireDate: '2019-04-10',
        baseSalary: 2400.00,
        salaryCurrency: 'USD',
        status: 'ACTIVE',
        city: 'Caracas',
        state: 'Distrito Capital',
      },
    ];

    let employeeCount = await Employee.count();
    
    for (const empData of employeesData) {
      const existing = await Employee.findOne({ where: { idNumber: empData.idNumber } });
      if (!existing) {
        employeeCount++;
        const employee = await Employee.create({
          ...empData,
          employeeCode: `EMP-${String(employeeCount).padStart(5, '0')}`,
        });
        console.log(`   ✅ Empleado creado: ${empData.firstName} ${empData.lastName} (${empData.position})`);

        // Crear documentos para algunos empleados
        if (['15234567', '18765432', '16789012'].includes(empData.idNumber)) {
          const docs = [
            {
              employeeId: employee.id,
              documentType: 'ID_CARD',
              documentName: 'Cédula de Identidad',
              documentNumber: empData.idNumber,
              issueDate: '2015-01-15',
              expirationDate: '2025-01-15',
              status: 'VALID',
            },
            {
              employeeId: employee.id,
              documentType: 'MEDICAL_CERT',
              documentName: 'Certificado Médico Ocupacional',
              issueDate: '2024-06-01',
              expirationDate: '2025-06-01',
              status: 'VALID',
              alertDaysBefore: 60,
            },
          ];

          // Agregar licencia de conducir para algunos
          if (empData.idNumber === '15234567') {
            docs.push({
              employeeId: employee.id,
              documentType: 'DRIVER_LICENSE',
              documentName: 'Licencia de Conducir',
              documentNumber: 'LIC-' + empData.idNumber,
              issueDate: '2022-03-10',
              expirationDate: '2025-03-10',
              status: 'VALID',
              alertDaysBefore: 90,
            });
          }

          for (const doc of docs) {
            await EmployeeDocument.create(doc);
          }
          console.log(`      📄 Documentos creados para ${empData.firstName}`);
        }
      } else {
        console.log(`   ℹ️  Empleado ya existe: ${empData.firstName} ${empData.lastName}`);
      }
    }

    // ========================================
    // 4. RESUMEN
    // ========================================
    const totalUsers = await User.count();
    const totalEmployees = await Employee.count();
    const totalDocs = await EmployeeDocument.count();

    console.log('\n========================================');
    console.log('📊 RESUMEN DE DATOS DE PRUEBA');
    console.log('========================================');
    console.log(`   Usuarios totales: ${totalUsers}`);
    console.log(`   Empleados totales: ${totalEmployees}`);
    console.log(`   Documentos totales: ${totalDocs}`);
    console.log('\n👤 CREDENCIALES DE USUARIOS:');
    console.log('   ┌─────────────┬───────────────┬──────────────────────────┐');
    console.log('   │ Usuario     │ Contraseña    │ Rol                      │');
    console.log('   ├─────────────┼───────────────┼──────────────────────────┤');
    console.log('   │ admin       │ Admin123!     │ Super Administrador      │');
    console.log('   │ gerente     │ Gerente123!   │ Gerente General          │');
    console.log('   │ contador    │ Contador123!  │ Contador                 │');
    console.log('   │ rrhh        │ Rrhh1234!     │ Jefe de RRHH             │');
    console.log('   │ supervisor  │ Super123!     │ Supervisor de Operaciones│');
    console.log('   │ empleado1   │ Empleado1!    │ Empleado                 │');
    console.log('   └─────────────┴───────────────┴──────────────────────────┘');

    console.log('\n🎉 Datos de prueba creados exitosamente!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedTestData();
