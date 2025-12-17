/**
 * Seeder: Datos de AFE (Authorization for Expenditure)
 * 
 * Crea datos de prueba para el módulo de AFE
 */

const seedAFE = async (models) => {
  const { AFE, AFECategory, AFEApproval, AFEExpense, AFEVariance, User, Field, Well, Project, Contractor } = models;

  console.log('💰 Iniciando seeder de AFE...');

  // Obtener usuario admin para created_by
  const admin = await User.findOne({ where: { username: 'admin' } });
  const userId = admin?.id;

  // Verificar si ya existen AFEs
  const existingAFEs = await AFE.count();
  if (existingAFEs > 0) {
    console.log('ℹ️  Ya existen datos de AFE, saltando seeder');
    return;
  }

  // Obtener datos relacionados
  const fields = await Field.findAll({ limit: 3 });
  const wells = await Well.findAll({ limit: 5 });
  const projects = await Project.findAll({ limit: 3 });
  const contractors = await Contractor.findAll({ limit: 3 });

  if (fields.length === 0) {
    console.log('⚠️  No hay campos disponibles, ejecute primero el seeder de producción');
    return;
  }

  // ==================== AFEs ====================
  const afesData = [
    {
      code: 'AFE-2024-0001',
      title: 'Workover Pozo MOR-15',
      description: 'Trabajos de reacondicionamiento para mejorar producción del pozo MOR-15',
      type: 'WORKOVER',
      field_id: fields[0]?.id,
      well_id: wells[0]?.id,
      project_id: projects[0]?.id,
      estimated_cost: 85000.00,
      currency: 'USD',
      start_date: '2024-01-15',
      end_date: '2024-02-28',
      status: 'APPROVED',
      justification: 'El pozo MOR-15 ha mostrado una declinación del 30% en los últimos 6 meses. Se requiere workover para restaurar producción.',
      priority: 'HIGH',
      approval_level: 2,
      current_approval_level: 2,
      submitted_at: new Date('2024-01-10'),
      approved_at: new Date('2024-01-12'),
      created_by: userId,
      approved_by: userId,
    },
    {
      code: 'AFE-2024-0002',
      title: 'Perforación Pozo Exploratorio SUR-X1',
      description: 'Perforación de pozo exploratorio en el área sur del campo',
      type: 'DRILLING',
      field_id: fields[0]?.id,
      project_id: projects[1]?.id,
      estimated_cost: 2500000.00,
      currency: 'USD',
      start_date: '2024-03-01',
      end_date: '2024-06-30',
      status: 'IN_PROGRESS',
      justification: 'Estudios sísmicos indican potencial de 5 MMBBL en el área sur. Perforación exploratoria para confirmar reservas.',
      priority: 'CRITICAL',
      approval_level: 4,
      current_approval_level: 4,
      submitted_at: new Date('2024-02-01'),
      approved_at: new Date('2024-02-15'),
      created_by: userId,
      approved_by: userId,
    },
    {
      code: 'AFE-2024-0003',
      title: 'Instalación Sistema de Bombeo ESP',
      description: 'Instalación de sistema de bombeo electrosumergible en pozos de baja presión',
      type: 'FACILITIES',
      field_id: fields[1]?.id || fields[0]?.id,
      estimated_cost: 350000.00,
      currency: 'USD',
      start_date: '2024-04-01',
      end_date: '2024-05-15',
      status: 'PENDING',
      justification: 'Tres pozos del campo requieren sistemas ESP para mantener producción ante la declinación de presión del yacimiento.',
      priority: 'HIGH',
      approval_level: 3,
      current_approval_level: 1,
      submitted_at: new Date('2024-03-15'),
      created_by: userId,
    },
    {
      code: 'AFE-2024-0004',
      title: 'Mantenimiento Preventivo Líneas de Flujo',
      description: 'Mantenimiento preventivo de líneas de flujo y manifolds del campo',
      type: 'MAINTENANCE',
      field_id: fields[0]?.id,
      estimated_cost: 45000.00,
      currency: 'USD',
      start_date: '2024-02-01',
      end_date: '2024-02-15',
      status: 'CLOSED',
      justification: 'Mantenimiento programado según plan anual de integridad mecánica.',
      priority: 'MEDIUM',
      approval_level: 1,
      current_approval_level: 1,
      submitted_at: new Date('2024-01-20'),
      approved_at: new Date('2024-01-21'),
      closed_at: new Date('2024-02-20'),
      final_cost: 42500.00,
      variance: -2500.00,
      variance_percentage: -5.56,
      created_by: userId,
      approved_by: userId,
    },
    {
      code: 'AFE-2024-0005',
      title: 'Estudio Sísmico 3D Área Norte',
      description: 'Adquisición y procesamiento de sísmica 3D en el área norte del campo',
      type: 'EXPLORATION',
      field_id: fields[0]?.id,
      estimated_cost: 1200000.00,
      currency: 'USD',
      start_date: '2024-06-01',
      end_date: '2024-09-30',
      status: 'DRAFT',
      justification: 'Se requiere actualizar modelo geológico del área norte para planificar desarrollo futuro.',
      priority: 'MEDIUM',
      approval_level: 4,
      current_approval_level: 0,
      created_by: userId,
    },
  ];

  const afes = await AFE.bulkCreate(afesData);
  console.log(`✅ Creados ${afes.length} AFEs`);

  // ==================== CATEGORÍAS ====================
  const categoriesData = [];
  
  // Categorías para AFE-2024-0001 (Workover)
  categoriesData.push(
    { afe_id: afes[0].id, category: 'SERVICES', description: 'Servicios de workover', estimated_amount: 45000, actual_amount: 43000 },
    { afe_id: afes[0].id, category: 'EQUIPMENT', description: 'Alquiler de equipo', estimated_amount: 25000, actual_amount: 24500 },
    { afe_id: afes[0].id, category: 'MATERIALS', description: 'Materiales y consumibles', estimated_amount: 10000, actual_amount: 9800 },
    { afe_id: afes[0].id, category: 'CONTINGENCY', description: 'Contingencia 10%', estimated_amount: 5000, actual_amount: 0 }
  );

  // Categorías para AFE-2024-0002 (Drilling)
  categoriesData.push(
    { afe_id: afes[1].id, category: 'DRILLING', description: 'Servicios de perforación', estimated_amount: 1500000, actual_amount: 800000 },
    { afe_id: afes[1].id, category: 'COMPLETION', description: 'Completación del pozo', estimated_amount: 400000, actual_amount: 0 },
    { afe_id: afes[1].id, category: 'SERVICES', description: 'Servicios de soporte', estimated_amount: 300000, actual_amount: 150000 },
    { afe_id: afes[1].id, category: 'MATERIALS', description: 'Tubería y materiales', estimated_amount: 200000, actual_amount: 120000 },
    { afe_id: afes[1].id, category: 'CONTINGENCY', description: 'Contingencia 10%', estimated_amount: 100000, actual_amount: 0 }
  );

  // Categorías para AFE-2024-0003 (Facilities)
  categoriesData.push(
    { afe_id: afes[2].id, category: 'EQUIPMENT', description: 'Bombas ESP', estimated_amount: 200000, actual_amount: 0 },
    { afe_id: afes[2].id, category: 'SERVICES', description: 'Instalación', estimated_amount: 100000, actual_amount: 0 },
    { afe_id: afes[2].id, category: 'MATERIALS', description: 'Cables y accesorios', estimated_amount: 35000, actual_amount: 0 },
    { afe_id: afes[2].id, category: 'CONTINGENCY', description: 'Contingencia', estimated_amount: 15000, actual_amount: 0 }
  );

  const categories = await AFECategory.bulkCreate(categoriesData);
  console.log(`✅ Creadas ${categories.length} categorías de AFE`);

  // ==================== APROBACIONES ====================
  const approvalsData = [
    // Aprobaciones AFE-2024-0001
    { afe_id: afes[0].id, approver_id: userId, approval_level: 1, status: 'APPROVED', comments: 'Aprobado - Presupuesto adecuado', approved_at: new Date('2024-01-11') },
    { afe_id: afes[0].id, approver_id: userId, approval_level: 2, status: 'APPROVED', comments: 'Aprobado por Gerencia', approved_at: new Date('2024-01-12') },
    // Aprobaciones AFE-2024-0002
    { afe_id: afes[1].id, approver_id: userId, approval_level: 1, status: 'APPROVED', comments: 'Aprobado', approved_at: new Date('2024-02-05') },
    { afe_id: afes[1].id, approver_id: userId, approval_level: 2, status: 'APPROVED', comments: 'Aprobado', approved_at: new Date('2024-02-08') },
    { afe_id: afes[1].id, approver_id: userId, approval_level: 3, status: 'APPROVED', comments: 'Aprobado por Dirección', approved_at: new Date('2024-02-12') },
    { afe_id: afes[1].id, approver_id: userId, approval_level: 4, status: 'APPROVED', comments: 'Aprobado por VP', approved_at: new Date('2024-02-15') },
    // Aprobaciones AFE-2024-0003 (pendiente)
    { afe_id: afes[2].id, approver_id: userId, approval_level: 1, status: 'APPROVED', comments: 'Aprobado', approved_at: new Date('2024-03-16') },
    { afe_id: afes[2].id, approver_id: userId, approval_level: 2, status: 'PENDING', comments: null, approved_at: null },
  ];

  await AFEApproval.bulkCreate(approvalsData);
  console.log(`✅ Creadas ${approvalsData.length} aprobaciones de AFE`);

  // ==================== GASTOS ====================
  const expensesData = [];
  const contractor = contractors[0];

  // Gastos AFE-2024-0001 (Workover - cerrado)
  if (contractor) {
    expensesData.push(
      { afe_id: afes[0].id, category_id: categories[0].id, description: 'Servicio de workover - Fase 1', vendor: 'Servicios Petroleros SA', contractor_id: contractor.id, amount: 25000, currency: 'USD', exchange_rate: 1, amount_usd: 25000, expense_date: '2024-01-20', invoice_number: 'INV-2024-001', invoice_date: '2024-01-25', status: 'APPROVED', created_by: userId, approved_by: userId, approved_at: new Date('2024-01-26') },
      { afe_id: afes[0].id, category_id: categories[0].id, description: 'Servicio de workover - Fase 2', vendor: 'Servicios Petroleros SA', contractor_id: contractor.id, amount: 18000, currency: 'USD', exchange_rate: 1, amount_usd: 18000, expense_date: '2024-02-05', invoice_number: 'INV-2024-015', invoice_date: '2024-02-10', status: 'APPROVED', created_by: userId, approved_by: userId, approved_at: new Date('2024-02-11') },
      { afe_id: afes[0].id, category_id: categories[1].id, description: 'Alquiler equipo de workover', vendor: 'Equipos del Oriente', amount: 24500, currency: 'USD', exchange_rate: 1, amount_usd: 24500, expense_date: '2024-01-18', invoice_number: 'INV-EQ-2024-008', invoice_date: '2024-01-20', status: 'APPROVED', created_by: userId, approved_by: userId, approved_at: new Date('2024-01-21') },
      { afe_id: afes[0].id, category_id: categories[2].id, description: 'Materiales y consumibles', vendor: 'Suministros Industriales', amount: 9800, currency: 'USD', exchange_rate: 1, amount_usd: 9800, expense_date: '2024-01-22', invoice_number: 'INV-SI-2024-045', invoice_date: '2024-01-25', status: 'APPROVED', created_by: userId, approved_by: userId, approved_at: new Date('2024-01-26') }
    );

    // Gastos AFE-2024-0002 (Drilling - en progreso)
    expensesData.push(
      { afe_id: afes[1].id, category_id: categories[4].id, description: 'Servicios de perforación - Mes 1', vendor: 'Drilling Services Inc', contractor_id: contractor.id, amount: 400000, currency: 'USD', exchange_rate: 1, amount_usd: 400000, expense_date: '2024-03-31', invoice_number: 'DS-2024-0125', invoice_date: '2024-04-05', status: 'APPROVED', created_by: userId, approved_by: userId, approved_at: new Date('2024-04-06') },
      { afe_id: afes[1].id, category_id: categories[4].id, description: 'Servicios de perforación - Mes 2', vendor: 'Drilling Services Inc', contractor_id: contractor.id, amount: 400000, currency: 'USD', exchange_rate: 1, amount_usd: 400000, expense_date: '2024-04-30', invoice_number: 'DS-2024-0189', invoice_date: '2024-05-05', status: 'APPROVED', created_by: userId, approved_by: userId, approved_at: new Date('2024-05-06') },
      { afe_id: afes[1].id, category_id: categories[6].id, description: 'Servicios de logging', vendor: 'Schlumberger', amount: 150000, currency: 'USD', exchange_rate: 1, amount_usd: 150000, expense_date: '2024-04-15', invoice_number: 'SLB-2024-4521', invoice_date: '2024-04-20', status: 'APPROVED', created_by: userId, approved_by: userId, approved_at: new Date('2024-04-21') },
      { afe_id: afes[1].id, category_id: categories[7].id, description: 'Tubería de revestimiento', vendor: 'Tenaris', amount: 120000, currency: 'USD', exchange_rate: 1, amount_usd: 120000, expense_date: '2024-03-10', invoice_number: 'TEN-2024-0892', invoice_date: '2024-03-15', status: 'APPROVED', created_by: userId, approved_by: userId, approved_at: new Date('2024-03-16') }
    );
  }

  if (expensesData.length > 0) {
    await AFEExpense.bulkCreate(expensesData);
    console.log(`✅ Creados ${expensesData.length} gastos de AFE`);
  }

  // ==================== VARIACIONES ====================
  const variancesData = [
    {
      afe_id: afes[1].id,
      variance_type: 'COST',
      description: 'Incremento por condiciones geológicas inesperadas',
      original_value: 2500000,
      new_value: 2750000,
      amount: 250000,
      percentage: 10,
      justification: 'Se encontraron formaciones más duras de lo esperado, requiriendo más tiempo de perforación y brocas adicionales.',
      status: 'PENDING',
      requested_by: userId,
    },
    {
      afe_id: afes[1].id,
      variance_type: 'SCHEDULE',
      description: 'Extensión de plazo por condiciones climáticas',
      original_value: 120, // días
      new_value: 135,
      amount: 15,
      percentage: 12.5,
      justification: 'Lluvias intensas causaron retrasos en las operaciones durante 15 días.',
      status: 'APPROVED',
      requested_by: userId,
      approved_by: userId,
      approved_at: new Date('2024-04-20'),
    },
  ];

  await AFEVariance.bulkCreate(variancesData);
  console.log(`✅ Creadas ${variancesData.length} variaciones de AFE`);

  console.log('✅ Seeder de AFE completado');
};

module.exports = seedAFE;
