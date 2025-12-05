require('dotenv').config();
const { sequelize } = require('./index');

const seedFleet = async () => {
  try {
    const models = require('./models');
    const { 
      Vehicle, VehicleAssignment, VehicleMaintenance, FuelLog,
      Employee, Project, Department 
    } = models;

    console.log('🚗 Iniciando seed de datos de Flota...');
    
    // Eliminar tablas y ENUMs existentes para recrear
    console.log('📦 Limpiando tablas de flota existentes...');
    await sequelize.query('DROP TABLE IF EXISTS fuel_logs CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS vehicle_maintenances CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS vehicle_assignments CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS vehicles CASCADE');
    
    // Eliminar ENUMs existentes
    await sequelize.query('DROP TYPE IF EXISTS "enum_vehicles_vehicle_type" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_vehicles_fuel_type" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_vehicles_transmission" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_vehicles_ownership_type" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_vehicles_status" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_vehicle_assignments_assignment_type" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_vehicle_assignments_status" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_vehicle_maintenances_maintenance_type" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_vehicle_maintenances_status" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_fuel_logs_fuel_type" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_fuel_logs_payment_method" CASCADE');
    
    // Sincronizar tablas de flota
    console.log('📦 Creando tablas de flota...');
    await Vehicle.sync({ force: true });
    await VehicleAssignment.sync({ force: true });
    await VehicleMaintenance.sync({ force: true });
    await FuelLog.sync({ force: true });
    console.log('✅ Tablas sincronizadas');

    // Obtener empleados y proyectos existentes para asignaciones
    const employees = await Employee.findAll({ limit: 5 });
    const projects = await Project.findAll({ limit: 3 });
    const departments = await Department.findAll({ limit: 3 });

    // Crear vehículos
    const vehiclesData = [
      {
        code: 'VEH-0001',
        plate: 'ABC-123',
        brand: 'Toyota',
        model: 'Hilux',
        year: 2022,
        color: 'Blanco',
        vehicleType: 'PICKUP',
        vin: '1HGBH41JXMN109186',
        engineNumber: 'ENG-2022-001',
        fuelType: 'DIESEL',
        tankCapacity: 80,
        mileage: 45000,
        transmission: 'AUTOMATIC',
        engineCapacity: '2.8L',
        passengers: 5,
        loadCapacity: 1000,
        ownershipType: 'OWNED',
        acquisitionDate: '2022-03-15',
        acquisitionCost: 45000,
        currency: 'USD',
        insurancePolicy: 'POL-2024-001',
        insuranceExpiry: '2025-03-15',
        registrationExpiry: '2025-06-30',
        technicalReviewExpiry: '2025-04-20',
        maintenanceIntervalKm: 10000,
        currentLocation: 'Oficina Central',
        status: 'ASSIGNED',
        description: 'Vehículo para supervisión de proyectos',
      },
      {
        code: 'VEH-0002',
        plate: 'DEF-456',
        brand: 'Ford',
        model: 'Ranger',
        year: 2021,
        color: 'Gris',
        vehicleType: 'PICKUP',
        vin: '2FMDK3GC5BBA12345',
        engineNumber: 'ENG-2021-002',
        fuelType: 'DIESEL',
        tankCapacity: 76,
        mileage: 68000,
        transmission: 'MANUAL',
        engineCapacity: '3.2L',
        passengers: 5,
        loadCapacity: 1200,
        ownershipType: 'OWNED',
        acquisitionDate: '2021-08-20',
        acquisitionCost: 42000,
        currency: 'USD',
        insurancePolicy: 'POL-2024-002',
        insuranceExpiry: '2025-08-20',
        registrationExpiry: '2025-09-15',
        technicalReviewExpiry: '2025-02-10',
        maintenanceIntervalKm: 10000,
        currentLocation: 'Proyecto Norte',
        status: 'ASSIGNED',
        description: 'Vehículo de carga para proyectos',
      },
      {
        code: 'VEH-0003',
        plate: 'GHI-789',
        brand: 'Chevrolet',
        model: 'N300',
        year: 2023,
        color: 'Blanco',
        vehicleType: 'VAN',
        vin: '3GCUKREC4JG123456',
        engineNumber: 'ENG-2023-003',
        fuelType: 'GASOLINE',
        tankCapacity: 45,
        mileage: 15000,
        transmission: 'MANUAL',
        engineCapacity: '1.2L',
        passengers: 2,
        loadCapacity: 800,
        ownershipType: 'OWNED',
        acquisitionDate: '2023-01-10',
        acquisitionCost: 18000,
        currency: 'USD',
        insurancePolicy: 'POL-2024-003',
        insuranceExpiry: '2025-01-10',
        registrationExpiry: '2025-12-01',
        technicalReviewExpiry: '2025-06-15',
        maintenanceIntervalKm: 5000,
        currentLocation: 'Almacén Central',
        status: 'ASSIGNED',
        description: 'Van para transporte de materiales',
      },
      {
        code: 'VEH-0004',
        plate: 'JKL-012',
        brand: 'Hyundai',
        model: 'Tucson',
        year: 2022,
        color: 'Negro',
        vehicleType: 'SUV',
        vin: '5NPE24AF1FH123789',
        engineNumber: 'ENG-2022-004',
        fuelType: 'GASOLINE',
        tankCapacity: 62,
        mileage: 32000,
        transmission: 'AUTOMATIC',
        engineCapacity: '2.0L',
        passengers: 5,
        loadCapacity: 500,
        ownershipType: 'LEASED',
        acquisitionDate: '2022-06-01',
        acquisitionCost: 35000,
        currency: 'USD',
        insurancePolicy: 'POL-2024-004',
        insuranceExpiry: '2025-06-01',
        registrationExpiry: '2025-07-20',
        technicalReviewExpiry: '2025-05-10',
        maintenanceIntervalKm: 10000,
        currentLocation: 'Oficina Central',
        status: 'ASSIGNED',
        description: 'Vehículo ejecutivo para gerencia',
      },
      {
        code: 'VEH-0005',
        plate: 'MNO-345',
        brand: 'Mitsubishi',
        model: 'L200',
        year: 2020,
        color: 'Rojo',
        vehicleType: 'PICKUP',
        vin: 'MMBJNKB40FD012345',
        engineNumber: 'ENG-2020-005',
        fuelType: 'DIESEL',
        tankCapacity: 75,
        mileage: 95000,
        transmission: 'MANUAL',
        engineCapacity: '2.5L',
        passengers: 5,
        loadCapacity: 1100,
        ownershipType: 'OWNED',
        acquisitionDate: '2020-04-15',
        acquisitionCost: 38000,
        currency: 'USD',
        insurancePolicy: 'POL-2024-005',
        insuranceExpiry: '2024-12-20', // Próximo a vencer
        registrationExpiry: '2025-04-15',
        technicalReviewExpiry: '2024-12-30', // Próximo a vencer
        maintenanceIntervalKm: 10000,
        currentLocation: 'Proyecto Sur',
        status: 'AVAILABLE',
        description: 'Vehículo de trabajo pesado',
      },
      {
        code: 'VEH-0006',
        plate: 'PQR-678',
        brand: 'Nissan',
        model: 'Frontier',
        year: 2019,
        color: 'Azul',
        vehicleType: 'PICKUP',
        vin: '1N6AD0EV5KC123456',
        engineNumber: 'ENG-2019-006',
        fuelType: 'DIESEL',
        tankCapacity: 80,
        mileage: 120000,
        transmission: 'AUTOMATIC',
        engineCapacity: '2.3L',
        passengers: 5,
        loadCapacity: 1000,
        ownershipType: 'OWNED',
        acquisitionDate: '2019-09-10',
        acquisitionCost: 35000,
        currency: 'USD',
        insurancePolicy: 'POL-2024-006',
        insuranceExpiry: '2025-09-10',
        registrationExpiry: '2025-10-05',
        technicalReviewExpiry: '2025-08-20',
        maintenanceIntervalKm: 10000,
        currentLocation: 'Taller',
        status: 'IN_MAINTENANCE',
        description: 'Vehículo en mantenimiento mayor',
      },
    ];

    const vehicles = await Vehicle.bulkCreate(vehiclesData, { 
      ignoreDuplicates: true,
      returning: true 
    });
    console.log(`✅ ${vehicles.length} vehículos creados`);

    // Crear asignaciones si hay empleados
    if (employees.length > 0 && vehicles.length > 0) {
      const assignmentsData = [];
      
      // Asignar vehículos a empleados
      if (employees[0]) {
        assignmentsData.push({
          vehicleId: vehicles[0].id,
          assignmentType: 'EMPLOYEE',
          employeeId: employees[0].id,
          startDate: '2024-01-15',
          startMileage: 40000,
          status: 'ACTIVE',
          notes: 'Asignación para supervisión de proyectos',
        });
      }
      
      if (employees[1] && vehicles[1]) {
        assignmentsData.push({
          vehicleId: vehicles[1].id,
          assignmentType: 'EMPLOYEE',
          employeeId: employees[1].id,
          startDate: '2024-03-01',
          startMileage: 60000,
          status: 'ACTIVE',
          notes: 'Asignación para trabajo de campo',
        });
      }

      // Asignar a proyectos
      if (projects[0] && vehicles[2]) {
        assignmentsData.push({
          vehicleId: vehicles[2].id,
          assignmentType: 'PROJECT',
          projectId: projects[0].id,
          startDate: '2024-02-01',
          startMileage: 10000,
          status: 'ACTIVE',
          notes: 'Van asignada para transporte de materiales del proyecto',
        });
      }

      // Asignar a departamento
      if (departments[0] && vehicles[3]) {
        assignmentsData.push({
          vehicleId: vehicles[3].id,
          assignmentType: 'DEPARTMENT',
          departmentId: departments[0].id,
          startDate: '2024-01-01',
          startMileage: 28000,
          status: 'ACTIVE',
          notes: 'Vehículo de uso compartido del departamento',
        });
      }

      if (assignmentsData.length > 0) {
        await VehicleAssignment.bulkCreate(assignmentsData, { ignoreDuplicates: true });
        console.log(`✅ ${assignmentsData.length} asignaciones creadas`);
      }
    }

    // Crear mantenimientos
    const maintenancesData = [
      {
        code: 'MNT-0001',
        vehicleId: vehicles[0].id,
        maintenanceType: 'PREVENTIVE',
        description: 'Cambio de aceite y filtros',
        scheduledDate: '2024-10-15',
        completedDate: '2024-10-15',
        mileageAtService: 40000,
        serviceProvider: 'Toyota Service Center',
        laborCost: 50,
        partsCost: 120,
        totalCost: 170,
        status: 'COMPLETED',
        notes: 'Mantenimiento de rutina completado',
      },
      {
        code: 'MNT-0002',
        vehicleId: vehicles[0].id,
        maintenanceType: 'PREVENTIVE',
        description: 'Cambio de aceite, filtros y revisión de frenos',
        scheduledDate: '2025-01-15',
        mileageAtService: 50000,
        serviceProvider: 'Toyota Service Center',
        laborCost: 80,
        partsCost: 200,
        totalCost: 280,
        status: 'SCHEDULED',
        notes: 'Próximo mantenimiento programado',
      },
      {
        code: 'MNT-0003',
        vehicleId: vehicles[1].id,
        maintenanceType: 'CORRECTIVE',
        description: 'Reparación de suspensión delantera',
        scheduledDate: '2024-09-20',
        startDate: '2024-09-20',
        completedDate: '2024-09-22',
        mileageAtService: 65000,
        serviceProvider: 'Taller Mecánico Central',
        laborCost: 150,
        partsCost: 450,
        totalCost: 600,
        status: 'COMPLETED',
        notes: 'Reparación por desgaste de amortiguadores',
      },
      {
        code: 'MNT-0004',
        vehicleId: vehicles[2].id,
        maintenanceType: 'PREVENTIVE',
        description: 'Servicio de 15,000 km',
        scheduledDate: '2024-11-01',
        completedDate: '2024-11-01',
        mileageAtService: 15000,
        serviceProvider: 'Chevrolet Dealer',
        laborCost: 60,
        partsCost: 100,
        totalCost: 160,
        status: 'COMPLETED',
      },
      {
        code: 'MNT-0005',
        vehicleId: vehicles[4].id,
        maintenanceType: 'PREVENTIVE',
        description: 'Cambio de aceite y revisión general',
        scheduledDate: '2024-12-10',
        status: 'SCHEDULED',
        notes: 'Mantenimiento próximo',
      },
      {
        code: 'MNT-0006',
        vehicleId: vehicles[5].id,
        maintenanceType: 'CORRECTIVE',
        description: 'Reparación de motor - cambio de inyectores',
        scheduledDate: '2024-11-25',
        startDate: '2024-11-25',
        mileageAtService: 120000,
        serviceProvider: 'Nissan Service',
        laborCost: 300,
        partsCost: 800,
        totalCost: 1100,
        status: 'IN_PROGRESS',
        notes: 'Vehículo en taller, esperando repuestos',
      },
    ];

    await VehicleMaintenance.bulkCreate(maintenancesData, { ignoreDuplicates: true });
    console.log(`✅ ${maintenancesData.length} mantenimientos creados`);

    // Crear registros de combustible
    const fuelLogsData = [];
    const today = new Date();
    
    // Generar registros de combustible para los últimos 3 meses
    let fuelLogCounter = 1;
    for (let i = 0; i < vehicles.length - 1; i++) { // Excluir el que está en mantenimiento
      const vehicle = vehicles[i];
      let currentMileage = vehicle.mileage - 5000;
      
      for (let month = 2; month >= 0; month--) {
        for (let week = 0; week < 4; week++) {
          const fuelDate = new Date(today);
          fuelDate.setMonth(fuelDate.getMonth() - month);
          fuelDate.setDate(fuelDate.getDate() - (week * 7));
          
          currentMileage += Math.floor(Math.random() * 400) + 200;
          const quantity = Math.floor(Math.random() * 30) + 30;
          const unitPrice = vehicle.fuelType === 'DIESEL' ? 4.50 : 4.80;
          
          fuelLogsData.push({
            code: `FUEL-${String(fuelLogCounter++).padStart(4, '0')}`,
            vehicleId: vehicle.id,
            fuelDate: fuelDate.toISOString().split('T')[0],
            fuelType: vehicle.fuelType === 'DIESEL' ? 'DIESEL' : 'GASOLINE_95',
            quantity: quantity,
            unitPrice: unitPrice,
            totalCost: quantity * unitPrice,
            mileage: currentMileage,
            fullTank: Math.random() > 0.3,
            station: ['Primax', 'Repsol', 'Pecsa', 'Petroperú'][Math.floor(Math.random() * 4)],
            location: ['Lima Centro', 'Lima Norte', 'Callao', 'San Isidro'][Math.floor(Math.random() * 4)],
            paymentMethod: ['CASH', 'CARD', 'FLEET_CARD'][Math.floor(Math.random() * 3)],
            driverId: employees.length > 0 ? employees[Math.floor(Math.random() * employees.length)]?.id : null,
          });
        }
      }
    }

    await FuelLog.bulkCreate(fuelLogsData, { ignoreDuplicates: true });
    console.log(`✅ ${fuelLogsData.length} registros de combustible creados`);

    console.log('\n🎉 Seed de Flota completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - Vehículos: ${vehicles.length}`);
    console.log(`   - Mantenimientos: ${maintenancesData.length}`);
    console.log(`   - Registros de combustible: ${fuelLogsData.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed de Flota:', error);
    process.exit(1);
  }
};

seedFleet();
