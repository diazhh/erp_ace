/**
 * Seeder: Datos de Producción y Pozos
 * 
 * Crea datos de prueba para el módulo de producción petrolera
 */

const seedProduction = async (models) => {
  const { Field, Well, WellProduction, MorningReport, WellLog, User } = models;

  console.log('🛢️  Iniciando seeder de producción...');

  // Obtener usuario admin para created_by
  const admin = await User.findOne({ where: { username: 'admin' } });
  const userId = admin?.id;

  // Verificar si ya existen pozos (si hay campos pero no pozos, continuar)
  const existingWells = await Well.count();
  if (existingWells > 0) {
    console.log('ℹ️  Ya existen datos de producción, saltando seeder');
    return;
  }
  
  // ==================== CAMPOS ====================
  const existingFields = await Field.count();
  let fields;
  if (existingFields > 0) {
    console.log(`ℹ️  Usando ${existingFields} campos existentes`);
    fields = await Field.findAll();
  } else {
    const fieldsData = [
    {
      code: 'CAMPO-001',
      name: 'Campo Morichal',
      type: 'ONSHORE',
      status: 'ACTIVE',
      location: 'Estado Monagas, Zona Sur',
      state: 'Monagas',
      country: 'Venezuela',
      latitude: 9.1234,
      longitude: -63.4567,
      area_km2: 125.5,
      discovery_date: '1985-03-15',
      production_start_date: '1987-06-01',
      working_interest: 100.00,
      basin: 'Cuenca Oriental',
      formation: 'Oficina',
      api_gravity_avg: 16.5,
      estimated_reserves_mmbbl: 45.2,
      notes: 'Campo maduro con producción estable de crudo pesado',
      created_by: userId,
    },
    {
      code: 'CAMPO-002',
      name: 'Campo Temblador',
      type: 'ONSHORE',
      status: 'ACTIVE',
      location: 'Estado Monagas, Zona Norte',
      state: 'Monagas',
      country: 'Venezuela',
      latitude: 9.5678,
      longitude: -63.1234,
      area_km2: 89.3,
      discovery_date: '1992-07-20',
      production_start_date: '1994-01-15',
      working_interest: 100.00,
      basin: 'Cuenca Oriental',
      formation: 'Merecure',
      api_gravity_avg: 22.3,
      estimated_reserves_mmbbl: 28.7,
      notes: 'Campo con crudo mediano, buena productividad',
      created_by: userId,
    },
    {
      code: 'CAMPO-003',
      name: 'Campo Pirital',
      type: 'ONSHORE',
      status: 'ACTIVE',
      location: 'Estado Anzoátegui',
      state: 'Anzoátegui',
      country: 'Venezuela',
      latitude: 9.8901,
      longitude: -64.2345,
      area_km2: 156.8,
      discovery_date: '1978-11-10',
      production_start_date: '1980-04-22',
      working_interest: 100.00,
      basin: 'Cuenca Oriental',
      formation: 'San Juan',
      api_gravity_avg: 28.5,
      estimated_reserves_mmbbl: 62.1,
      notes: 'Campo principal con crudo liviano de alta calidad',
      created_by: userId,
    },
  ];

    fields = await Field.bulkCreate(fieldsData);
    console.log(`✅ ${fields.length} campos creados`);
  }

  // ==================== POZOS ====================
  const wellsData = [];

  // Pozos para Campo Morichal
  const morichal = fields[0];
  for (let i = 1; i <= 8; i++) {
    wellsData.push({
      code: `MOR-${String(i).padStart(3, '0')}`,
      name: `Morichal ${i}`,
      field_id: morichal.id,
      type: i <= 6 ? 'PRODUCER' : 'INJECTOR',
      status: i <= 5 ? 'ACTIVE' : (i === 6 ? 'SHUT_IN' : 'ACTIVE'),
      classification: 'OIL',
      spud_date: `${1987 + Math.floor(i/3)}-${String((i % 12) + 1).padStart(2, '0')}-15`,
      completion_date: `${1987 + Math.floor(i/3)}-${String((i % 12) + 3).padStart(2, '0')}-20`,
      first_production_date: `${1987 + Math.floor(i/3)}-${String((i % 12) + 4).padStart(2, '0')}-01`,
      total_depth_ft: 8500 + (i * 200),
      current_depth_ft: 8200 + (i * 180),
      perforation_top_ft: 7800 + (i * 150),
      perforation_bottom_ft: 8100 + (i * 170),
      api_gravity: 15.5 + (Math.random() * 2),
      formation: 'Oficina',
      latitude: 9.1234 + (i * 0.002),
      longitude: -63.4567 + (i * 0.003),
      elevation_ft: 450 + (i * 10),
      artificial_lift: i <= 4 ? 'ESP' : 'ROD_PUMP',
      casing_size: '7 5/8"',
      tubing_size: '3 1/2"',
      notes: `Pozo ${i <= 6 ? 'productor' : 'inyector'} del campo Morichal`,
      created_by: userId,
    });
  }

  // Pozos para Campo Temblador
  const temblador = fields[1];
  for (let i = 1; i <= 5; i++) {
    wellsData.push({
      code: `TEM-${String(i).padStart(3, '0')}`,
      name: `Temblador ${i}`,
      field_id: temblador.id,
      type: 'PRODUCER',
      status: i <= 4 ? 'ACTIVE' : 'WORKOVER',
      classification: 'OIL_GAS',
      spud_date: `${1994 + Math.floor(i/2)}-${String((i % 12) + 1).padStart(2, '0')}-10`,
      completion_date: `${1994 + Math.floor(i/2)}-${String((i % 12) + 2).padStart(2, '0')}-25`,
      first_production_date: `${1994 + Math.floor(i/2)}-${String((i % 12) + 3).padStart(2, '0')}-01`,
      total_depth_ft: 7200 + (i * 150),
      current_depth_ft: 7000 + (i * 140),
      perforation_top_ft: 6500 + (i * 120),
      perforation_bottom_ft: 6900 + (i * 130),
      api_gravity: 21.5 + (Math.random() * 2),
      formation: 'Merecure',
      latitude: 9.5678 + (i * 0.002),
      longitude: -63.1234 + (i * 0.003),
      elevation_ft: 380 + (i * 8),
      artificial_lift: 'GAS_LIFT',
      casing_size: '7"',
      tubing_size: '2 7/8"',
      notes: `Pozo productor del campo Temblador`,
      created_by: userId,
    });
  }

  // Pozos para Campo Pirital
  const pirital = fields[2];
  for (let i = 1; i <= 10; i++) {
    wellsData.push({
      code: `PIR-${String(i).padStart(3, '0')}`,
      name: `Pirital ${i}`,
      field_id: pirital.id,
      type: i <= 8 ? 'PRODUCER' : 'OBSERVATION',
      status: i <= 7 ? 'ACTIVE' : (i === 8 ? 'SHUT_IN' : 'ACTIVE'),
      classification: 'OIL',
      spud_date: `${1980 + Math.floor(i/4)}-${String(((i - 1) % 12) + 1).padStart(2, '0')}-05`,
      completion_date: `${1980 + Math.floor(i/4)}-${String(((i - 1) % 12) + 2).padStart(2, '0')}-15`,
      first_production_date: `${1980 + Math.floor(i/4)}-${String(Math.min(((i - 1) % 12) + 3, 12)).padStart(2, '0')}-01`,
      total_depth_ft: 6800 + (i * 100),
      current_depth_ft: 6600 + (i * 90),
      perforation_top_ft: 6200 + (i * 80),
      perforation_bottom_ft: 6500 + (i * 85),
      api_gravity: 27.5 + (Math.random() * 2),
      formation: 'San Juan',
      latitude: 9.8901 + (i * 0.002),
      longitude: -64.2345 + (i * 0.003),
      elevation_ft: 520 + (i * 12),
      artificial_lift: i <= 5 ? 'NONE' : 'ESP',
      casing_size: '9 5/8"',
      tubing_size: '4 1/2"',
      notes: `Pozo ${i <= 8 ? 'productor' : 'observación'} del campo Pirital`,
      created_by: userId,
    });
  }

  const wells = await Well.bulkCreate(wellsData);
  console.log(`✅ ${wells.length} pozos creados`);

  // ==================== PRODUCCIÓN DIARIA ====================
  const productionData = [];
  const today = new Date();

  // Generar 30 días de producción para cada pozo activo
  for (const well of wells) {
    if (well.status !== 'ACTIVE' || well.type !== 'PRODUCER') continue;

    for (let day = 30; day >= 1; day--) {
      const prodDate = new Date(today);
      prodDate.setDate(prodDate.getDate() - day);

      // Valores base según el campo
      let baseOil, baseGas, baseWater;
      if (well.code.startsWith('MOR')) {
        baseOil = 180 + Math.random() * 40;
        baseGas = 25 + Math.random() * 10;
        baseWater = 120 + Math.random() * 30;
      } else if (well.code.startsWith('TEM')) {
        baseOil = 250 + Math.random() * 50;
        baseGas = 80 + Math.random() * 20;
        baseWater = 80 + Math.random() * 20;
      } else {
        baseOil = 350 + Math.random() * 70;
        baseGas = 45 + Math.random() * 15;
        baseWater = 50 + Math.random() * 15;
      }

      // Variación aleatoria de ±10%
      const variation = 0.9 + Math.random() * 0.2;
      const oilVolume = baseOil * variation;
      const gasVolume = baseGas * variation;
      const waterVolume = baseWater * variation;
      const hoursOn = 22 + Math.random() * 2;

      productionData.push({
        well_id: well.id,
        production_date: prodDate.toISOString().split('T')[0],
        oil_volume_bbl: oilVolume.toFixed(2),
        gas_volume_mcf: gasVolume.toFixed(2),
        water_volume_bbl: waterVolume.toFixed(2),
        oil_rate_bopd: ((oilVolume / hoursOn) * 24).toFixed(2),
        gas_rate_mcfd: ((gasVolume / hoursOn) * 24).toFixed(2),
        water_rate_bwpd: ((waterVolume / hoursOn) * 24).toFixed(2),
        gross_volume_bbl: (oilVolume + waterVolume).toFixed(2),
        net_volume_bbl: oilVolume.toFixed(2),
        bsw_percent: ((waterVolume / (oilVolume + waterVolume)) * 100).toFixed(2),
        gor: ((gasVolume * 1000) / oilVolume).toFixed(2),
        choke_size: '24/64',
        tubing_pressure_psi: 180 + Math.random() * 40,
        casing_pressure_psi: 250 + Math.random() * 50,
        hours_on: hoursOn.toFixed(1),
        downtime_hours: (24 - hoursOn).toFixed(1),
        downtime_code: hoursOn < 23 ? 'SCHEDULED' : 'NONE',
        status: day > 3 ? 'APPROVED' : (day > 1 ? 'VERIFIED' : 'DRAFT'),
        reported_by: userId,
        verified_by: day > 1 ? userId : null,
        verified_at: day > 1 ? new Date() : null,
        approved_by: day > 3 ? userId : null,
        approved_at: day > 3 ? new Date() : null,
      });
    }
  }

  // Insertar en lotes para evitar problemas de memoria
  const batchSize = 100;
  for (let i = 0; i < productionData.length; i += batchSize) {
    const batch = productionData.slice(i, i + batchSize);
    await WellProduction.bulkCreate(batch);
  }
  console.log(`✅ ${productionData.length} registros de producción creados`);

  // ==================== REPORTES MATUTINOS ====================
  const morningReportsData = [];

  for (const field of fields) {
    for (let day = 7; day >= 1; day--) {
      const reportDate = new Date(today);
      reportDate.setDate(reportDate.getDate() - day);
      const dateStr = reportDate.toISOString().split('T')[0];

      // Calcular totales del campo para ese día
      const fieldWells = wells.filter(w => w.field_id === field.id && w.status === 'ACTIVE' && w.type === 'PRODUCER');
      const wellsProducing = fieldWells.length;
      const wellsShutIn = wells.filter(w => w.field_id === field.id && w.status === 'SHUT_IN').length;

      // Valores aproximados
      let totalOil, totalGas, totalWater;
      if (field.code === 'CAMPO-001') {
        totalOil = 900 + Math.random() * 100;
        totalGas = 125 + Math.random() * 25;
        totalWater = 600 + Math.random() * 80;
      } else if (field.code === 'CAMPO-002') {
        totalOil = 1000 + Math.random() * 150;
        totalGas = 320 + Math.random() * 50;
        totalWater = 320 + Math.random() * 50;
      } else {
        totalOil = 2450 + Math.random() * 300;
        totalGas = 315 + Math.random() * 60;
        totalWater = 350 + Math.random() * 70;
      }

      morningReportsData.push({
        report_date: dateStr,
        field_id: field.id,
        report_number: `MR-${field.code}-${dateStr.replace(/-/g, '')}`,
        total_oil_bbl: totalOil.toFixed(2),
        total_gas_mcf: totalGas.toFixed(2),
        total_water_bbl: totalWater.toFixed(2),
        wells_producing: wellsProducing,
        wells_shut_in: wellsShutIn,
        wells_drilling: 0,
        wells_workover: field.code === 'CAMPO-002' ? 1 : 0,
        wells_down: 0,
        total_downtime_hours: Math.random() * 8,
        production_vs_target_percent: 95 + Math.random() * 10,
        daily_target_bbl: totalOil * 1.05,
        weather_conditions: 'Despejado',
        safety_incidents: 0,
        environmental_incidents: 0,
        summary: `Operaciones normales en ${field.name}. Producción dentro de parámetros esperados.`,
        issues: day % 3 === 0 ? 'Mantenimiento preventivo programado en separador principal.' : null,
        actions_required: day % 3 === 0 ? 'Coordinar con equipo de mantenimiento.' : null,
        highlights: `Producción total: ${totalOil.toFixed(0)} bbl/d`,
        status: day > 2 ? 'APPROVED' : (day > 1 ? 'SUBMITTED' : 'DRAFT'),
        created_by: userId,
        submitted_by: day > 1 ? userId : null,
        submitted_at: day > 1 ? new Date() : null,
        approved_by: day > 2 ? userId : null,
        approved_at: day > 2 ? new Date() : null,
      });
    }
  }

  await MorningReport.bulkCreate(morningReportsData);
  console.log(`✅ ${morningReportsData.length} reportes matutinos creados`);

  // ==================== BITÁCORAS DE POZOS ====================
  const wellLogsData = [];
  const logTypes = ['MAINTENANCE', 'WORKOVER', 'INCIDENT', 'INSPECTION', 'PRODUCTION_TEST', 'EQUIPMENT_CHANGE'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const statuses = ['OPEN', 'IN_PROGRESS', 'COMPLETED'];

  // Crear bitácoras para algunos pozos
  for (let i = 0; i < Math.min(wells.length, 15); i++) {
    const well = wells[i];
    const numLogs = 2 + Math.floor(Math.random() * 4); // 2-5 logs por pozo

    for (let j = 0; j < numLogs; j++) {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - Math.floor(Math.random() * 90)); // Últimos 90 días
      const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      let title, description, findings, actionsTaken;
      switch (logType) {
        case 'MAINTENANCE':
          title = `Mantenimiento preventivo - ${well.code}`;
          description = 'Mantenimiento programado de equipos de superficie y subsuelo.';
          findings = 'Desgaste normal en sellos de bomba. Presión de cabezal dentro de parámetros.';
          actionsTaken = 'Reemplazo de sellos. Lubricación de válvulas. Verificación de instrumentación.';
          break;
        case 'WORKOVER':
          title = `Intervención de pozo - ${well.code}`;
          description = 'Workover para optimización de producción.';
          findings = 'Daño de formación detectado. Reducción de IP en 15%.';
          actionsTaken = 'Estimulación ácida. Cambio de tubería de producción.';
          break;
        case 'INCIDENT':
          title = `Incidente operacional - ${well.code}`;
          description = 'Reporte de incidente durante operaciones normales.';
          findings = 'Fuga menor en línea de flujo. Sin impacto ambiental.';
          actionsTaken = 'Reparación de línea. Inspección de integridad.';
          break;
        case 'INSPECTION':
          title = `Inspección de integridad - ${well.code}`;
          description = 'Inspección rutinaria de integridad mecánica.';
          findings = 'Condición general satisfactoria. Corrosión leve en cabezal.';
          actionsTaken = 'Aplicación de inhibidor de corrosión. Programar pintura.';
          break;
        case 'PRODUCTION_TEST':
          title = `Prueba de producción - ${well.code}`;
          description = 'Prueba de producción para actualización de parámetros.';
          findings = `IP: ${(1.5 + Math.random()).toFixed(2)} bbl/psi. BSW: ${(15 + Math.random() * 20).toFixed(1)}%`;
          actionsTaken = 'Actualización de curvas de declinación. Ajuste de choke.';
          break;
        case 'EQUIPMENT_CHANGE':
          title = `Cambio de equipo - ${well.code}`;
          description = 'Reemplazo de equipo de levantamiento artificial.';
          findings = 'Bomba ESP con falla eléctrica. Motor quemado.';
          actionsTaken = 'Instalación de nueva bomba ESP. Pruebas de arranque exitosas.';
          break;
        default:
          title = `Registro general - ${well.code}`;
          description = 'Nota general de operaciones.';
          findings = 'Sin hallazgos significativos.';
          actionsTaken = 'Ninguna acción requerida.';
      }

      const startDate = new Date(logDate);
      const endDate = status === 'COMPLETED' ? new Date(startDate.getTime() + (1 + Math.random() * 5) * 24 * 60 * 60 * 1000) : null;

      wellLogsData.push({
        well_id: well.id,
        log_type: logType,
        log_date: logDate.toISOString().split('T')[0],
        title,
        description,
        status,
        priority,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate ? endDate.toISOString().split('T')[0] : null,
        downtime_hours: logType === 'WORKOVER' ? 48 + Math.random() * 72 : (logType === 'MAINTENANCE' ? 4 + Math.random() * 8 : 0),
        cost_estimated: logType === 'WORKOVER' ? 50000 + Math.random() * 100000 : (logType === 'EQUIPMENT_CHANGE' ? 20000 + Math.random() * 30000 : 1000 + Math.random() * 5000),
        cost_actual: status === 'COMPLETED' ? (logType === 'WORKOVER' ? 45000 + Math.random() * 110000 : (logType === 'EQUIPMENT_CHANGE' ? 18000 + Math.random() * 35000 : 800 + Math.random() * 6000)) : null,
        findings,
        actions_taken: actionsTaken,
        recommendations: priority === 'HIGH' || priority === 'CRITICAL' ? 'Programar seguimiento en 30 días.' : null,
        next_action_date: priority === 'HIGH' || priority === 'CRITICAL' ? new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
        created_by: userId,
      });
    }
  }

  await WellLog.bulkCreate(wellLogsData);
  console.log(`✅ ${wellLogsData.length} bitácoras de pozos creadas`);

  console.log('🎉 Seeder de producción completado');
};

module.exports = { seedProduction };
