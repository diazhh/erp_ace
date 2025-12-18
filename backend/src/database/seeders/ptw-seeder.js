const { v4: uuidv4 } = require('uuid');

async function seedPTW() {
  const models = require('../models');
  const { WorkPermit, WorkPermitChecklist, WorkPermitExtension, StopWorkAuthority, User, Field, Well, Contractor } = models;

  console.log('🔧 Seeding Work Permits (PTW)...');

  // Get admin user
  const adminUser = await User.findOne({ where: { username: 'admin' } });
  if (!adminUser) {
    console.log('⚠️ Admin user not found, skipping PTW seeder');
    return;
  }

  // Get fields and wells
  const fields = await Field.findAll({ limit: 3 });
  const wells = await Well.findAll({ limit: 5 });
  const contractors = await Contractor.findAll({ limit: 2 });

  if (fields.length === 0) {
    console.log('⚠️ No fields found, skipping PTW seeder');
    return;
  }

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Create Work Permits
  const permits = [
    {
      id: uuidv4(),
      code: 'PTW-2025-0001',
      type: 'HOT_WORK',
      title: 'Soldadura en línea de flujo Pozo A-01',
      description: 'Reparación de fuga en línea de flujo mediante soldadura',
      location: 'Pozo A-01, Línea de flujo principal',
      field_id: fields[0]?.id,
      well_id: wells[0]?.id,
      work_description: 'Soldadura de parche en tubería de 4" para reparar fuga detectada. Se requiere corte y soldadura con electrodo 7018.',
      hazards_identified: 'Incendio, explosión, quemaduras, humos de soldadura, trabajo en caliente cerca de hidrocarburos',
      control_measures: JSON.stringify([
        'Prueba de gases antes y durante el trabajo',
        'Extintor ABC de 20 lbs en sitio',
        'Vigía de fuego permanente',
        'Manta ignífuga para protección',
        'Ventilación natural verificada',
      ]),
      ppe_required: JSON.stringify(['Casco', 'Careta de soldador', 'Guantes de cuero', 'Delantal de cuero', 'Botas de seguridad', 'Protección auditiva']),
      start_datetime: now,
      end_datetime: tomorrow,
      status: 'ACTIVE',
      requested_by: adminUser.id,
      approved_by: adminUser.id,
      approved_at: yesterday,
      contractor_id: contractors[0]?.id,
      max_workers: 4,
      actual_workers: 3,
      supervisor_name: 'Carlos Mendez',
      supervisor_phone: '+58 412 555 1234',
      gas_test_required: true,
      gas_test_results: JSON.stringify({ o2: 20.9, lel: 0, h2s: 0, co: 0, timestamp: now.toISOString() }),
      fire_watch_required: true,
      fire_watch_name: 'Pedro Gonzalez',
    },
    {
      id: uuidv4(),
      code: 'PTW-2025-0002',
      type: 'CONFINED_SPACE',
      title: 'Inspección interna de tanque de almacenamiento',
      description: 'Entrada a tanque TK-101 para inspección visual y medición de espesores',
      location: 'Estación de flujo, Tanque TK-101',
      field_id: fields[0]?.id,
      work_description: 'Inspección visual del interior del tanque, medición de espesores con ultrasonido, verificación de corrosión y sedimentos.',
      hazards_identified: 'Atmósfera peligrosa, caídas, atrapamiento, falta de oxígeno, gases tóxicos',
      control_measures: JSON.stringify([
        'Monitoreo continuo de atmósfera',
        'Ventilación forzada',
        'Vigía de entrada permanente',
        'Equipo de rescate en sitio',
        'Comunicación por radio',
      ]),
      ppe_required: JSON.stringify(['Casco', 'Arnés de cuerpo completo', 'Detector de gases personal', 'Linterna intrínseca', 'Botas de seguridad']),
      start_datetime: tomorrow,
      end_datetime: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000),
      status: 'APPROVED',
      requested_by: adminUser.id,
      approved_by: adminUser.id,
      approved_at: now,
      max_workers: 3,
      gas_test_required: true,
    },
    {
      id: uuidv4(),
      code: 'PTW-2025-0003',
      type: 'WORKING_AT_HEIGHT',
      title: 'Mantenimiento de antorcha',
      description: 'Reemplazo de boquilla de antorcha y limpieza de estructura',
      location: 'Antorcha principal, Campo Norte',
      field_id: fields[1]?.id || fields[0]?.id,
      work_description: 'Ascenso a estructura de antorcha (45m) para reemplazo de boquilla dañada y limpieza de acumulación de residuos.',
      hazards_identified: 'Caída de altura, objetos cayendo, quemaduras, exposición a gases',
      control_measures: JSON.stringify([
        'Uso obligatorio de arnés y línea de vida',
        'Área inferior acordonada',
        'Verificación de puntos de anclaje',
        'Herramientas amarradas',
        'Antorcha apagada y purgada',
      ]),
      ppe_required: JSON.stringify(['Casco con barbiquejo', 'Arnés de cuerpo completo', 'Línea de vida retráctil', 'Guantes', 'Botas de seguridad']),
      start_datetime: nextWeek,
      end_datetime: new Date(nextWeek.getTime() + 10 * 60 * 60 * 1000),
      status: 'PENDING',
      requested_by: adminUser.id,
      max_workers: 2,
    },
    {
      id: uuidv4(),
      code: 'PTW-2025-0004',
      type: 'ELECTRICAL',
      title: 'Mantenimiento de VSD bomba ESP',
      description: 'Reemplazo de tarjeta de control en variador de frecuencia',
      location: 'Caseta eléctrica Pozo B-03',
      field_id: fields[0]?.id,
      well_id: wells[2]?.id,
      work_description: 'Desenergización de VSD, reemplazo de tarjeta de control dañada, pruebas de funcionamiento.',
      hazards_identified: 'Electrocución, arco eléctrico, quemaduras eléctricas',
      control_measures: JSON.stringify([
        'Procedimiento LOTO aplicado',
        'Verificación de ausencia de tensión',
        'Uso de herramientas aisladas',
        'Tapetes dieléctricos',
      ]),
      ppe_required: JSON.stringify(['Casco dieléctrico', 'Guantes dieléctricos clase 00', 'Gafas de seguridad', 'Botas dieléctricas']),
      start_datetime: now,
      end_datetime: new Date(now.getTime() + 6 * 60 * 60 * 1000),
      status: 'ACTIVE',
      requested_by: adminUser.id,
      approved_by: adminUser.id,
      approved_at: yesterday,
      isolation_required: true,
      isolation_points: JSON.stringify([
        { point: 'Breaker principal VSD', locked: true, tag: 'LOTO-001' },
        { point: 'Seccionador de campo', locked: true, tag: 'LOTO-002' },
      ]),
      max_workers: 2,
      actual_workers: 2,
    },
    {
      id: uuidv4(),
      code: 'PTW-2025-0005',
      type: 'EXCAVATION',
      title: 'Excavación para reparación de tubería enterrada',
      description: 'Excavación manual para acceder a fuga en línea de agua de inyección',
      location: 'Línea de inyección, Km 2.5',
      field_id: fields[0]?.id,
      work_description: 'Excavación de zanja de 3m x 1.5m x 1.2m de profundidad para exponer tubería con fuga.',
      hazards_identified: 'Derrumbe de excavación, golpes, contacto con servicios subterráneos',
      control_measures: JSON.stringify([
        'Talud 1:1 o entibado',
        'Localización de servicios subterráneos',
        'Barricadas perimetrales',
        'Escalera de acceso',
      ]),
      ppe_required: JSON.stringify(['Casco', 'Chaleco reflectivo', 'Guantes', 'Botas de seguridad']),
      start_datetime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      end_datetime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: 'DRAFT',
      requested_by: adminUser.id,
      max_workers: 5,
    },
  ];

  for (const permit of permits) {
    const [created] = await WorkPermit.findOrCreate({
      where: { code: permit.code },
      defaults: permit,
    });

    // Create checklists for each permit
    const preWorkItems = [
      { id: 1, text: 'Área de trabajo inspeccionada', checked: permit.status === 'ACTIVE' },
      { id: 2, text: 'EPP verificado y en buen estado', checked: permit.status === 'ACTIVE' },
      { id: 3, text: 'Personal informado de los riesgos', checked: permit.status === 'ACTIVE' },
      { id: 4, text: 'Equipos de emergencia disponibles', checked: permit.status === 'ACTIVE' },
      { id: 5, text: 'Comunicaciones establecidas', checked: permit.status === 'ACTIVE' },
    ];

    const postWorkItems = [
      { id: 1, text: 'Área de trabajo limpia y ordenada', checked: false },
      { id: 2, text: 'Equipos y herramientas retirados', checked: false },
      { id: 3, text: 'Sin condiciones inseguras pendientes', checked: false },
    ];

    await WorkPermitChecklist.findOrCreate({
      where: { permit_id: created.id, checklist_type: 'PRE_WORK' },
      defaults: {
        permit_id: created.id,
        checklist_type: 'PRE_WORK',
        items: JSON.stringify(preWorkItems),
        all_passed: permit.status === 'ACTIVE',
        completed_by: permit.status === 'ACTIVE' ? adminUser.id : null,
        completed_at: permit.status === 'ACTIVE' ? now : null,
      },
    });

    await WorkPermitChecklist.findOrCreate({
      where: { permit_id: created.id, checklist_type: 'POST_WORK' },
      defaults: {
        permit_id: created.id,
        checklist_type: 'POST_WORK',
        items: JSON.stringify(postWorkItems),
        all_passed: false,
      },
    });
  }

  console.log(`   ✅ Created ${permits.length} work permits with checklists`);

  // Create Stop Work Authority events
  const stopWorkEvents = [
    {
      id: uuidv4(),
      code: 'SWA-2025-0001',
      location: 'Pozo A-01, Área de soldadura',
      field_id: fields[0]?.id,
      description: 'Se detectó fuga de gas durante prueba atmosférica. Lectura de LEL al 15% en área de trabajo.',
      reason: 'UNSAFE_CONDITION',
      severity: 'HIGH',
      immediate_actions: 'Evacuación inmediata del área. Suspensión de trabajos de soldadura. Notificación a supervisor de campo.',
      reported_by: adminUser.id,
      reported_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      resolved_by: adminUser.id,
      resolved_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      resolution_notes: 'Se identificó válvula de venteo parcialmente abierta. Se cerró válvula y se ventilaron gases. Nueva prueba atmosférica con resultados seguros.',
      status: 'CLOSED',
      lessons_learned: 'Verificar estado de todas las válvulas en área de trabajo antes de iniciar trabajos en caliente.',
      corrective_actions: JSON.stringify([
        'Incluir verificación de válvulas en checklist pre-trabajo',
        'Capacitación adicional sobre identificación de fuentes de gases',
      ]),
      work_resumed_at: new Date(now.getTime() - 30 * 60 * 1000),
      work_resumed_by: adminUser.id,
    },
    {
      id: uuidv4(),
      code: 'SWA-2025-0002',
      location: 'Estación de flujo, Tanque TK-102',
      field_id: fields[0]?.id,
      description: 'Trabajador sin arnés de seguridad trabajando sobre tanque a 8 metros de altura.',
      reason: 'UNSAFE_ACT',
      severity: 'CRITICAL',
      immediate_actions: 'Detención inmediata del trabajo. Descenso seguro del trabajador. Reunión de seguridad con todo el equipo.',
      reported_by: adminUser.id,
      reported_at: yesterday,
      status: 'INVESTIGATING',
    },
    {
      id: uuidv4(),
      code: 'SWA-2025-0003',
      location: 'Caseta eléctrica Campo Sur',
      field_id: fields[1]?.id || fields[0]?.id,
      description: 'Tormenta eléctrica aproximándose al área de trabajo. Rayos detectados a menos de 10 km.',
      reason: 'WEATHER',
      severity: 'MEDIUM',
      immediate_actions: 'Suspensión de todos los trabajos al aire libre. Personal resguardado en áreas seguras.',
      reported_by: adminUser.id,
      reported_at: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      resolved_by: adminUser.id,
      resolved_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      resolution_notes: 'Tormenta pasó sin incidentes. Condiciones climáticas seguras para reanudar trabajos.',
      status: 'RESOLVED',
    },
  ];

  for (const swa of stopWorkEvents) {
    await StopWorkAuthority.findOrCreate({
      where: { code: swa.code },
      defaults: swa,
    });
  }

  console.log(`   ✅ Created ${stopWorkEvents.length} stop work authority events`);
  console.log('✅ PTW seeding completed');
}

module.exports = seedPTW;
