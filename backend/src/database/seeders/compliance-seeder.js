const { v4: uuidv4 } = require('uuid');

const seedCompliance = async (models) => {
  const { 
    RegulatoryReport, EnvironmentalPermit, ComplianceAudit, Policy, Certification,
    Field, Project, Department, Employee, User
  } = models;

  console.log('🔄 Seeding Compliance module...');

  // Get references
  const adminUser = await User.findOne({ where: { username: 'admin' } });
  const fields = await Field.findAll({ limit: 3 });
  const projects = await Project.findAll({ limit: 3 });
  const departments = await Department.findAll({ limit: 3 });
  const employees = await Employee.findAll({ limit: 5 });

  const userId = adminUser?.id;
  const fieldId = fields[0]?.id;
  const projectId = projects[0]?.id;
  const departmentId = departments[0]?.id;
  const employeeId = employees[0]?.id;

  // Helper for dates
  const today = new Date();
  const addDays = (days) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };
  const subtractDays = (days) => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date;
  };

  // ========== REGULATORY REPORTS ==========
  const reports = [
    {
      id: uuidv4(),
      code: 'REP-2025-0001',
      title: 'Reporte Mensual de Producción - Enero 2025',
      type: 'PRODUCTION',
      entity: 'MENPET',
      description: 'Reporte mensual de producción de hidrocarburos para el Ministerio de Petróleo',
      period_start: new Date('2025-01-01'),
      period_end: new Date('2025-01-31'),
      due_date: addDays(15),
      status: 'DRAFT',
      field_id: fieldId,
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'REP-2025-0002',
      title: 'Declaración Trimestral ISLR Q4-2024',
      type: 'FISCAL',
      entity: 'SENIAT',
      description: 'Declaración de impuesto sobre la renta del cuarto trimestre 2024',
      period_start: new Date('2024-10-01'),
      period_end: new Date('2024-12-31'),
      due_date: addDays(5),
      status: 'PENDING',
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'REP-2025-0003',
      title: 'Informe Ambiental Anual 2024',
      type: 'ENVIRONMENTAL',
      entity: 'MINEA',
      description: 'Informe anual de gestión ambiental y cumplimiento de permisos',
      period_start: new Date('2024-01-01'),
      period_end: new Date('2024-12-31'),
      due_date: subtractDays(5),
      status: 'SUBMITTED',
      submitted_date: subtractDays(10),
      response_reference: 'MINEA-2025-00234',
      field_id: fieldId,
      created_by: userId,
      submitted_by: userId,
    },
    {
      id: uuidv4(),
      code: 'REP-2025-0004',
      title: 'Reporte de Seguridad Industrial Q4-2024',
      type: 'SAFETY',
      entity: 'PDVSA',
      description: 'Estadísticas de seguridad industrial y accidentes laborales',
      period_start: new Date('2024-10-01'),
      period_end: new Date('2024-12-31'),
      due_date: addDays(30),
      status: 'DRAFT',
      project_id: projectId,
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'REP-2024-0010',
      title: 'Reporte Operacional Mensual - Diciembre 2024',
      type: 'OPERATIONAL',
      entity: 'MENPET',
      description: 'Reporte operacional mensual de actividades de campo',
      period_start: new Date('2024-12-01'),
      period_end: new Date('2024-12-31'),
      due_date: subtractDays(15),
      status: 'ACCEPTED',
      submitted_date: subtractDays(20),
      response_date: subtractDays(10),
      response_reference: 'MENPET-2025-00456',
      response_notes: 'Reporte aceptado sin observaciones',
      field_id: fieldId,
      created_by: userId,
      submitted_by: userId,
    },
  ];

  for (const report of reports) {
    await RegulatoryReport.findOrCreate({ where: { code: report.code }, defaults: report });
  }
  console.log(`  ✅ ${reports.length} regulatory reports created`);

  // ========== ENVIRONMENTAL PERMITS ==========
  const permits = [
    {
      id: uuidv4(),
      code: 'PER-2025-0001',
      name: 'Permiso de Operación Campo Norte',
      type: 'OPERATION',
      issuing_authority: 'Ministerio del Ambiente (MINEA)',
      permit_number: 'MINEA-OP-2023-0456',
      description: 'Permiso de operación para actividades de producción de hidrocarburos',
      issue_date: subtractDays(365),
      expiry_date: addDays(365),
      renewal_date: addDays(300),
      status: 'ACTIVE',
      conditions: JSON.stringify([
        { condition: 'Monitoreo mensual de efluentes', frequency: 'MONTHLY' },
        { condition: 'Reporte trimestral de emisiones', frequency: 'QUARTERLY' },
        { condition: 'Inspección anual de instalaciones', frequency: 'ANNUAL' },
      ]),
      field_id: fieldId,
      cost: 15000,
      currency: 'USD',
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'PER-2025-0002',
      name: 'Permiso de Perforación Pozo Exploratorio',
      type: 'DRILLING',
      issuing_authority: 'MENPET',
      permit_number: 'MENPET-DRILL-2024-0089',
      description: 'Permiso para perforación de pozo exploratorio en bloque asignado',
      issue_date: subtractDays(180),
      expiry_date: addDays(185),
      status: 'ACTIVE',
      field_id: fieldId,
      project_id: projectId,
      cost: 25000,
      currency: 'USD',
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'PER-2025-0003',
      name: 'Permiso de Descarga de Aguas',
      type: 'DISCHARGE',
      issuing_authority: 'INEA',
      permit_number: 'INEA-DESC-2022-0234',
      description: 'Permiso para descarga de aguas tratadas al cuerpo receptor',
      issue_date: subtractDays(730),
      expiry_date: addDays(25),
      renewal_date: subtractDays(5),
      status: 'PENDING_RENEWAL',
      conditions: JSON.stringify([
        { condition: 'Análisis de calidad de agua mensual', frequency: 'MONTHLY' },
        { condition: 'Límite de descarga: 500 m3/día', type: 'LIMIT' },
      ]),
      field_id: fieldId,
      cost: 8000,
      currency: 'USD',
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'PER-2025-0004',
      name: 'Estudio de Impacto Ambiental - Proyecto Expansión',
      type: 'EIA',
      issuing_authority: 'MINEA',
      permit_number: 'MINEA-EIA-2024-0567',
      description: 'Aprobación del EIA para proyecto de expansión de facilidades',
      issue_date: subtractDays(90),
      expiry_date: addDays(275),
      status: 'ACTIVE',
      project_id: projectId,
      cost: 50000,
      currency: 'USD',
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'PER-2024-0010',
      name: 'Permiso de Emisiones Atmosféricas',
      type: 'EMISSIONS',
      issuing_authority: 'MINEA',
      permit_number: 'MINEA-EMIS-2021-0123',
      description: 'Permiso para emisiones atmosféricas de planta de procesamiento',
      issue_date: subtractDays(1095),
      expiry_date: subtractDays(30),
      status: 'EXPIRED',
      field_id: fieldId,
      cost: 12000,
      currency: 'USD',
      created_by: userId,
    },
  ];

  for (const permit of permits) {
    await EnvironmentalPermit.findOrCreate({ where: { code: permit.code }, defaults: permit });
  }
  console.log(`  ✅ ${permits.length} environmental permits created`);

  // ========== COMPLIANCE AUDITS ==========
  const audits = [
    {
      id: uuidv4(),
      code: 'AUD-2025-0001',
      title: 'Auditoría Interna ISO 14001',
      type: 'INTERNAL',
      lead_auditor_id: employeeId,
      scope: 'Sistema de Gestión Ambiental - Todas las operaciones',
      objectives: 'Verificar cumplimiento de requisitos ISO 14001:2015',
      criteria: 'ISO 14001:2015, Procedimientos internos SGA',
      start_date: addDays(30),
      end_date: addDays(35),
      status: 'PLANNED',
      department_id: departmentId,
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'AUD-2025-0002',
      title: 'Auditoría de Seguridad Operacional',
      type: 'INTERNAL',
      lead_auditor_id: employeeId,
      scope: 'Operaciones de campo y facilidades de producción',
      objectives: 'Evaluar cumplimiento de normas de seguridad industrial',
      criteria: 'PDVSA SI-S-04, OSHA 1910',
      start_date: subtractDays(5),
      status: 'IN_PROGRESS',
      field_id: fieldId,
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'AUD-2024-0015',
      title: 'Auditoría Externa ISO 9001',
      type: 'EXTERNAL',
      auditor_name: 'Carlos Mendoza',
      auditor_company: 'Bureau Veritas',
      scope: 'Sistema de Gestión de Calidad',
      objectives: 'Auditoría de vigilancia anual',
      criteria: 'ISO 9001:2015',
      start_date: subtractDays(60),
      end_date: subtractDays(58),
      status: 'COMPLETED',
      findings: JSON.stringify([
        { id: 1, severity: 'MINOR', description: 'Falta actualización de procedimiento PR-QA-015', area: 'Calidad' },
        { id: 2, severity: 'OBSERVATION', description: 'Oportunidad de mejora en trazabilidad de calibraciones', area: 'Mantenimiento' },
      ]),
      findings_count: 2,
      major_findings: 0,
      minor_findings: 1,
      observations: 1,
      conclusion: 'Sistema de gestión conforme con requisitos ISO 9001:2015. Se recomienda certificación.',
      recommendations: 'Actualizar procedimiento PR-QA-015 antes de próxima auditoría.',
      follow_up_date: addDays(60),
      follow_up_status: 'PENDING',
      department_id: departmentId,
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'AUD-2024-0012',
      title: 'Auditoría Regulatoria MENPET',
      type: 'REGULATORY',
      auditor_name: 'Inspectores MENPET',
      auditor_company: 'Ministerio de Petróleo',
      scope: 'Cumplimiento de normativas de producción y regalías',
      objectives: 'Verificar cumplimiento de obligaciones contractuales',
      start_date: subtractDays(90),
      end_date: subtractDays(88),
      status: 'CLOSED',
      findings: JSON.stringify([]),
      findings_count: 0,
      major_findings: 0,
      minor_findings: 0,
      observations: 0,
      conclusion: 'Cumplimiento satisfactorio de todas las obligaciones regulatorias.',
      follow_up_status: 'NOT_REQUIRED',
      field_id: fieldId,
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'AUD-2025-0003',
      title: 'Auditoría de Vigilancia ISO 45001',
      type: 'SURVEILLANCE',
      auditor_company: 'SGS',
      scope: 'Sistema de Gestión de Seguridad y Salud Ocupacional',
      objectives: 'Auditoría de vigilancia semestral',
      criteria: 'ISO 45001:2018',
      start_date: addDays(45),
      status: 'PLANNED',
      department_id: departmentId,
      created_by: userId,
    },
  ];

  for (const audit of audits) {
    await ComplianceAudit.findOrCreate({ where: { code: audit.code }, defaults: audit });
  }
  console.log(`  ✅ ${audits.length} compliance audits created`);

  // ========== POLICIES ==========
  const policies = [
    {
      id: uuidv4(),
      code: 'HSE-0001',
      title: 'Política de Seguridad, Salud y Ambiente',
      category: 'HSE',
      version: '3.0',
      effective_date: subtractDays(180),
      status: 'ACTIVE',
      summary: 'Compromiso de la organización con la seguridad, salud ocupacional y protección ambiental.',
      scope: 'Aplica a todos los empleados, contratistas y visitantes en todas las instalaciones.',
      keywords: ['seguridad', 'salud', 'ambiente', 'HSE', 'política'],
      department_id: departmentId,
      owner_id: employeeId,
      approved_by: userId,
      approved_date: subtractDays(185),
      next_review_date: addDays(180),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'OPE-0001',
      title: 'Política de Operaciones de Campo',
      category: 'OPERATIONS',
      version: '2.1',
      effective_date: subtractDays(365),
      status: 'ACTIVE',
      summary: 'Lineamientos para la ejecución segura y eficiente de operaciones de campo.',
      scope: 'Personal de operaciones y contratistas en campo.',
      keywords: ['operaciones', 'campo', 'producción', 'pozos'],
      department_id: departmentId,
      owner_id: employeeId,
      approved_by: userId,
      approved_date: subtractDays(370),
      next_review_date: addDays(10),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'QUA-0001',
      title: 'Política de Calidad',
      category: 'QUALITY',
      version: '4.0',
      effective_date: subtractDays(90),
      status: 'ACTIVE',
      summary: 'Compromiso con la mejora continua y satisfacción del cliente.',
      scope: 'Todos los procesos de la organización.',
      keywords: ['calidad', 'ISO 9001', 'mejora continua'],
      department_id: departmentId,
      owner_id: employeeId,
      approved_by: userId,
      approved_date: subtractDays(95),
      next_review_date: addDays(270),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'ENV-0001',
      title: 'Política Ambiental',
      category: 'ENVIRONMENTAL',
      version: '2.0',
      effective_date: subtractDays(200),
      status: 'ACTIVE',
      summary: 'Compromiso con la protección del medio ambiente y desarrollo sostenible.',
      scope: 'Todas las operaciones y proyectos de la organización.',
      keywords: ['ambiente', 'ISO 14001', 'sostenibilidad', 'emisiones'],
      department_id: departmentId,
      owner_id: employeeId,
      approved_by: userId,
      approved_date: subtractDays(205),
      next_review_date: addDays(160),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'ETH-0001',
      title: 'Código de Ética y Conducta',
      category: 'ETHICS',
      version: '1.5',
      effective_date: subtractDays(500),
      status: 'ACTIVE',
      summary: 'Principios éticos y normas de conducta para todos los colaboradores.',
      scope: 'Todos los empleados y directivos.',
      keywords: ['ética', 'conducta', 'integridad', 'anticorrupción'],
      department_id: departmentId,
      owner_id: employeeId,
      approved_by: userId,
      approved_date: subtractDays(505),
      next_review_date: subtractDays(135),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'SEC-0001',
      title: 'Política de Seguridad de la Información',
      category: 'IT',
      version: '1.0',
      effective_date: addDays(15),
      status: 'UNDER_REVIEW',
      summary: 'Lineamientos para protección de activos de información.',
      scope: 'Todos los sistemas de información y usuarios.',
      keywords: ['seguridad', 'información', 'ciberseguridad', 'datos'],
      department_id: departmentId,
      owner_id: employeeId,
      created_by: userId,
    },
  ];

  for (const policy of policies) {
    await Policy.findOrCreate({ where: { code: policy.code }, defaults: policy });
  }
  console.log(`  ✅ ${policies.length} policies created`);

  // ========== CERTIFICATIONS ==========
  const certifications = [
    {
      id: uuidv4(),
      code: 'ISO-0001',
      name: 'ISO 9001:2015 - Sistema de Gestión de Calidad',
      type: 'ISO_9001',
      issuing_body: 'Bureau Veritas',
      certificate_number: 'BV-QMS-2022-0456',
      description: 'Certificación del sistema de gestión de calidad',
      scope: 'Servicios de producción y procesamiento de hidrocarburos',
      issue_date: subtractDays(365),
      expiry_date: addDays(730),
      last_audit_date: subtractDays(60),
      next_audit_date: addDays(120),
      status: 'ACTIVE',
      surveillance_frequency: 'ANNUAL',
      cost: 15000,
      currency: 'USD',
      responsible_id: employeeId,
      department_id: departmentId,
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'ISO-0002',
      name: 'ISO 14001:2015 - Sistema de Gestión Ambiental',
      type: 'ISO_14001',
      issuing_body: 'SGS',
      certificate_number: 'SGS-EMS-2023-0789',
      description: 'Certificación del sistema de gestión ambiental',
      scope: 'Operaciones de producción y facilidades de superficie',
      issue_date: subtractDays(180),
      expiry_date: addDays(915),
      last_audit_date: subtractDays(30),
      next_audit_date: addDays(150),
      status: 'ACTIVE',
      surveillance_frequency: 'SEMI_ANNUAL',
      cost: 18000,
      currency: 'USD',
      responsible_id: employeeId,
      department_id: departmentId,
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'ISO-0003',
      name: 'ISO 45001:2018 - Sistema de Gestión de SSO',
      type: 'ISO_45001',
      issuing_body: 'Bureau Veritas',
      certificate_number: 'BV-OHSMS-2023-0234',
      description: 'Certificación del sistema de gestión de seguridad y salud ocupacional',
      scope: 'Todas las operaciones de la organización',
      issue_date: subtractDays(270),
      expiry_date: addDays(825),
      last_audit_date: subtractDays(90),
      next_audit_date: addDays(90),
      status: 'ACTIVE',
      surveillance_frequency: 'ANNUAL',
      cost: 16000,
      currency: 'USD',
      responsible_id: employeeId,
      department_id: departmentId,
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'API-0001',
      name: 'API Spec Q1 - Especificación de Calidad',
      type: 'API',
      issuing_body: 'American Petroleum Institute',
      certificate_number: 'API-Q1-2024-00567',
      description: 'Certificación de especificación de calidad para industria petrolera',
      scope: 'Servicios de mantenimiento de pozos',
      issue_date: subtractDays(90),
      expiry_date: addDays(20),
      next_audit_date: addDays(15),
      status: 'ACTIVE',
      surveillance_frequency: 'ANNUAL',
      cost: 25000,
      currency: 'USD',
      responsible_id: employeeId,
      department_id: departmentId,
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'API-0002',
      name: 'API Spec Q2 - Servicios de Campo',
      type: 'API',
      issuing_body: 'American Petroleum Institute',
      certificate_number: 'API-Q2-2021-00234',
      description: 'Certificación para servicios de campo en industria petrolera',
      scope: 'Servicios de wireline y coiled tubing',
      issue_date: subtractDays(1095),
      expiry_date: subtractDays(30),
      status: 'EXPIRED',
      cost: 22000,
      currency: 'USD',
      responsible_id: employeeId,
      department_id: departmentId,
      created_by: userId,
    },
  ];

  for (const cert of certifications) {
    await Certification.findOrCreate({ where: { code: cert.code }, defaults: cert });
  }
  console.log(`  ✅ ${certifications.length} certifications created`);

  console.log('✅ Compliance module seeded successfully!');
};

module.exports = seedCompliance;
