/**
 * Seeder: Permisos Granulares
 * 
 * Este archivo define todos los permisos del sistema organizados por módulo.
 * Formato: modulo:accion[:campo]
 */

const PERMISSIONS = {
  // ========== SUPER ADMIN ==========
  system: [
    { code: '*:*', name: 'Super Administrador', description: 'Acceso total a todas las funciones', action: '*', permissionType: 'module' },
  ],

  // ========== USUARIOS ==========
  users: [
    { code: 'users:*', name: 'Usuarios - Acceso Completo', description: 'Acceso completo al módulo de usuarios', action: '*', permissionType: 'module' },
    { code: 'users:read', name: 'Ver Usuarios', description: 'Ver lista de usuarios', action: 'read', permissionType: 'action' },
    { code: 'users:create', name: 'Crear Usuario', description: 'Crear nuevos usuarios', action: 'create', permissionType: 'action' },
    { code: 'users:update', name: 'Editar Usuario', description: 'Editar usuarios existentes', action: 'update', permissionType: 'action' },
    { code: 'users:delete', name: 'Eliminar Usuario', description: 'Eliminar usuarios', action: 'delete', permissionType: 'action' },
    { code: 'users:reset_password', name: 'Resetear Contraseña', description: 'Resetear contraseña de usuarios', action: 'reset_password', permissionType: 'action' },
  ],

  // ========== ROLES ==========
  roles: [
    { code: 'roles:*', name: 'Roles - Acceso Completo', description: 'Acceso completo al módulo de roles', action: '*', permissionType: 'module' },
    { code: 'roles:read', name: 'Ver Roles', description: 'Ver lista de roles', action: 'read', permissionType: 'action' },
    { code: 'roles:create', name: 'Crear Rol', description: 'Crear nuevos roles', action: 'create', permissionType: 'action' },
    { code: 'roles:update', name: 'Editar Rol', description: 'Editar roles existentes', action: 'update', permissionType: 'action' },
    { code: 'roles:delete', name: 'Eliminar Rol', description: 'Eliminar roles', action: 'delete', permissionType: 'action' },
  ],

  // ========== EMPLEADOS ==========
  employees: [
    { code: 'employees:*', name: 'Empleados - Acceso Completo', description: 'Acceso completo al módulo de empleados', action: '*', permissionType: 'module' },
    { code: 'employees:read', name: 'Ver Empleados', description: 'Ver lista de empleados', action: 'read', permissionType: 'action' },
    { code: 'employees:read:personal', name: 'Ver Datos Personales', description: 'Ver tab de datos personales', action: 'read', field: 'personal', permissionType: 'field' },
    { code: 'employees:read:work', name: 'Ver Datos Laborales', description: 'Ver tab de datos laborales', action: 'read', field: 'work', permissionType: 'field' },
    { code: 'employees:read:payroll', name: 'Ver Historial Nómina', description: 'Ver tab de historial de nómina', action: 'read', field: 'payroll', permissionType: 'field' },
    { code: 'employees:read:loans', name: 'Ver Préstamos', description: 'Ver tab de préstamos', action: 'read', field: 'loans', permissionType: 'field' },
    { code: 'employees:read:accounts', name: 'Ver Cuentas Bancarias', description: 'Ver tab de cuentas bancarias', action: 'read', field: 'accounts', permissionType: 'field' },
    { code: 'employees:read:documents', name: 'Ver Documentos', description: 'Ver tab de documentos', action: 'read', field: 'documents', permissionType: 'field' },
    { code: 'employees:read:hierarchy', name: 'Ver Jerarquía', description: 'Ver tab de jerarquía', action: 'read', field: 'hierarchy', permissionType: 'field' },
    { code: 'employees:create', name: 'Crear Empleado', description: 'Crear nuevos empleados', action: 'create', permissionType: 'action' },
    { code: 'employees:update', name: 'Editar Empleado', description: 'Editar empleados existentes', action: 'update', permissionType: 'action' },
    { code: 'employees:delete', name: 'Eliminar Empleado', description: 'Eliminar empleados', action: 'delete', permissionType: 'action' },
    { code: 'employees:export', name: 'Exportar Empleados', description: 'Exportar datos de empleados', action: 'export', permissionType: 'action' },
  ],

  // ========== PRÉSTAMOS ==========
  loans: [
    { code: 'loans:*', name: 'Préstamos - Acceso Completo', description: 'Acceso completo al módulo de préstamos', action: '*', permissionType: 'module' },
    { code: 'loans:read', name: 'Ver Préstamos', description: 'Ver lista de préstamos', action: 'read', permissionType: 'action' },
    { code: 'loans:create', name: 'Solicitar Préstamo', description: 'Crear solicitud de préstamo', action: 'create', permissionType: 'action' },
    { code: 'loans:update', name: 'Editar Préstamo', description: 'Editar préstamos existentes', action: 'update', permissionType: 'action' },
    { code: 'loans:approve', name: 'Aprobar Préstamo', description: 'Aprobar solicitudes de préstamo', action: 'approve', permissionType: 'action' },
    { code: 'loans:reject', name: 'Rechazar Préstamo', description: 'Rechazar solicitudes de préstamo', action: 'reject', permissionType: 'action' },
    { code: 'loans:cancel', name: 'Cancelar Préstamo', description: 'Cancelar préstamos activos', action: 'cancel', permissionType: 'action' },
    { code: 'loans:pay', name: 'Registrar Pago', description: 'Registrar pago anticipado de préstamo', action: 'pay', permissionType: 'action' },
  ],

  // ========== NÓMINA ==========
  payroll: [
    { code: 'payroll:*', name: 'Nómina - Acceso Completo', description: 'Acceso completo al módulo de nómina', action: '*', permissionType: 'module' },
    { code: 'payroll:read', name: 'Ver Nómina', description: 'Ver períodos de nómina', action: 'read', permissionType: 'action' },
    { code: 'payroll:create', name: 'Crear Período', description: 'Crear período de nómina', action: 'create', permissionType: 'action' },
    { code: 'payroll:generate', name: 'Generar Nómina', description: 'Generar cálculo de nómina', action: 'generate', permissionType: 'action' },
    { code: 'payroll:approve', name: 'Aprobar Nómina', description: 'Aprobar nómina generada', action: 'approve', permissionType: 'action' },
    { code: 'payroll:pay', name: 'Marcar como Pagada', description: 'Marcar nómina como pagada', action: 'pay', permissionType: 'action' },
    { code: 'payroll:export', name: 'Exportar Nómina', description: 'Exportar datos de nómina', action: 'export', permissionType: 'action' },
  ],

  // ========== FINANZAS ==========
  finance: [
    { code: 'finance:*', name: 'Finanzas - Acceso Completo', description: 'Acceso completo al módulo de finanzas', action: '*', permissionType: 'module' },
    { code: 'finance:read', name: 'Ver Finanzas', description: 'Ver cuentas y transacciones', action: 'read', permissionType: 'action' },
    { code: 'finance:create', name: 'Crear Transacción', description: 'Crear transacciones', action: 'create', permissionType: 'action' },
    { code: 'finance:update', name: 'Editar Transacción', description: 'Editar transacciones', action: 'update', permissionType: 'action' },
    { code: 'finance:delete', name: 'Eliminar Transacción', description: 'Eliminar transacciones', action: 'delete', permissionType: 'action' },
    { code: 'finance:transfer', name: 'Realizar Transferencia', description: 'Realizar transferencias entre cuentas', action: 'transfer', permissionType: 'action' },
    { code: 'finance:export', name: 'Exportar Finanzas', description: 'Exportar datos financieros', action: 'export', permissionType: 'action' },
  ],

  // ========== CAJA CHICA ==========
  petty_cash: [
    { code: 'petty_cash:*', name: 'Caja Chica - Acceso Completo', description: 'Acceso completo al módulo de caja chica', action: '*', permissionType: 'module' },
    { code: 'petty_cash:read', name: 'Ver Caja Chica', description: 'Ver cajas chicas', action: 'read', permissionType: 'action' },
    { code: 'petty_cash:create', name: 'Crear Caja Chica', description: 'Crear nueva caja chica', action: 'create', permissionType: 'action' },
    { code: 'petty_cash:update', name: 'Editar Caja Chica', description: 'Editar caja chica existente', action: 'update', permissionType: 'action' },
    { code: 'petty_cash:expense', name: 'Registrar Gasto', description: 'Registrar gasto de caja chica', action: 'expense', permissionType: 'action' },
    { code: 'petty_cash:approve', name: 'Aprobar Gasto', description: 'Aprobar gastos de caja chica', action: 'approve', permissionType: 'action' },
    { code: 'petty_cash:reject', name: 'Rechazar Gasto', description: 'Rechazar gastos de caja chica', action: 'reject', permissionType: 'action' },
    { code: 'petty_cash:pay', name: 'Pagar Gasto', description: 'Marcar gasto como pagado', action: 'pay', permissionType: 'action' },
    { code: 'petty_cash:replenish', name: 'Reponer Caja', description: 'Reponer fondos de caja chica', action: 'replenish', permissionType: 'action' },
  ],

  // ========== PROYECTOS ==========
  projects: [
    { code: 'projects:*', name: 'Proyectos - Acceso Completo', description: 'Acceso completo al módulo de proyectos', action: '*', permissionType: 'module' },
    { code: 'projects:read', name: 'Ver Proyectos', description: 'Ver lista de proyectos', action: 'read', permissionType: 'action' },
    { code: 'projects:read:team', name: 'Ver Equipo', description: 'Ver tab de equipo del proyecto', action: 'read', field: 'team', permissionType: 'field' },
    { code: 'projects:read:milestones', name: 'Ver Hitos', description: 'Ver tab de hitos del proyecto', action: 'read', field: 'milestones', permissionType: 'field' },
    { code: 'projects:read:expenses', name: 'Ver Gastos', description: 'Ver tab de gastos del proyecto', action: 'read', field: 'expenses', permissionType: 'field' },
    { code: 'projects:read:updates', name: 'Ver Seguimiento', description: 'Ver tab de seguimiento del proyecto', action: 'read', field: 'updates', permissionType: 'field' },
    { code: 'projects:read:photos', name: 'Ver Fotos', description: 'Ver tab de fotos del proyecto', action: 'read', field: 'photos', permissionType: 'field' },
    { code: 'projects:read:valuations', name: 'Ver Valuaciones', description: 'Ver tab de valuaciones del proyecto', action: 'read', field: 'valuations', permissionType: 'field' },
    { code: 'projects:create', name: 'Crear Proyecto', description: 'Crear nuevos proyectos', action: 'create', permissionType: 'action' },
    { code: 'projects:update', name: 'Editar Proyecto', description: 'Editar proyectos existentes', action: 'update', permissionType: 'action' },
    { code: 'projects:delete', name: 'Eliminar Proyecto', description: 'Eliminar proyectos', action: 'delete', permissionType: 'action' },
    { code: 'projects:approve_expense', name: 'Aprobar Gastos', description: 'Aprobar gastos del proyecto', action: 'approve_expense', permissionType: 'action' },
  ],

  // ========== CONTRATISTAS ==========
  contractors: [
    { code: 'contractors:*', name: 'Contratistas - Acceso Completo', description: 'Acceso completo al módulo de contratistas', action: '*', permissionType: 'module' },
    { code: 'contractors:read', name: 'Ver Contratistas', description: 'Ver lista de contratistas', action: 'read', permissionType: 'action' },
    { code: 'contractors:create', name: 'Crear Contratista', description: 'Crear nuevos contratistas', action: 'create', permissionType: 'action' },
    { code: 'contractors:update', name: 'Editar Contratista', description: 'Editar contratistas existentes', action: 'update', permissionType: 'action' },
    { code: 'contractors:delete', name: 'Eliminar Contratista', description: 'Eliminar contratistas', action: 'delete', permissionType: 'action' },
    { code: 'contractors:pay', name: 'Registrar Pago', description: 'Registrar pago a contratista', action: 'pay', permissionType: 'action' },
  ],

  // ========== INVENTARIO ==========
  inventory: [
    { code: 'inventory:*', name: 'Inventario - Acceso Completo', description: 'Acceso completo al módulo de inventario', action: '*', permissionType: 'module' },
    { code: 'inventory:read', name: 'Ver Inventario', description: 'Ver items de inventario', action: 'read', permissionType: 'action' },
    { code: 'inventory:create', name: 'Crear Item', description: 'Crear items de inventario', action: 'create', permissionType: 'action' },
    { code: 'inventory:update', name: 'Editar Item', description: 'Editar items de inventario', action: 'update', permissionType: 'action' },
    { code: 'inventory:delete', name: 'Eliminar Item', description: 'Eliminar items de inventario', action: 'delete', permissionType: 'action' },
    { code: 'inventory:movement', name: 'Registrar Movimiento', description: 'Registrar movimientos de inventario', action: 'movement', permissionType: 'action' },
    { code: 'inventory:adjust', name: 'Ajustar Stock', description: 'Realizar ajustes de inventario', action: 'adjust', permissionType: 'action' },
    { code: 'inventory:transfer', name: 'Transferir', description: 'Transferir entre almacenes', action: 'transfer', permissionType: 'action' },
  ],

  // ========== FLOTA ==========
  fleet: [
    { code: 'fleet:*', name: 'Flota - Acceso Completo', description: 'Acceso completo al módulo de flota', action: '*', permissionType: 'module' },
    { code: 'fleet:read', name: 'Ver Vehículos', description: 'Ver lista de vehículos', action: 'read', permissionType: 'action' },
    { code: 'fleet:read:assignments', name: 'Ver Asignaciones', description: 'Ver tab de asignaciones', action: 'read', field: 'assignments', permissionType: 'field' },
    { code: 'fleet:read:maintenance', name: 'Ver Mantenimientos', description: 'Ver tab de mantenimientos', action: 'read', field: 'maintenance', permissionType: 'field' },
    { code: 'fleet:read:fuel', name: 'Ver Combustible', description: 'Ver tab de combustible', action: 'read', field: 'fuel', permissionType: 'field' },
    { code: 'fleet:read:costs', name: 'Ver Costos', description: 'Ver tab de costos', action: 'read', field: 'costs', permissionType: 'field' },
    { code: 'fleet:create', name: 'Agregar Vehículo', description: 'Agregar nuevos vehículos', action: 'create', permissionType: 'action' },
    { code: 'fleet:update', name: 'Editar Vehículo', description: 'Editar vehículos existentes', action: 'update', permissionType: 'action' },
    { code: 'fleet:delete', name: 'Eliminar Vehículo', description: 'Eliminar vehículos', action: 'delete', permissionType: 'action' },
    { code: 'fleet:assign', name: 'Asignar Vehículo', description: 'Asignar vehículo a empleado/proyecto', action: 'assign', permissionType: 'action' },
    { code: 'fleet:maintenance', name: 'Registrar Mantenimiento', description: 'Registrar mantenimiento de vehículo', action: 'maintenance', permissionType: 'action' },
    { code: 'fleet:fuel', name: 'Registrar Combustible', description: 'Registrar carga de combustible', action: 'fuel', permissionType: 'action' },
    { code: 'fleet:fuel_approve', name: 'Aprobar Combustible', description: 'Aprobar solicitudes de pago de combustible', action: 'fuel_approve', permissionType: 'action' },
    { code: 'fleet:fuel_pay', name: 'Pagar Combustible', description: 'Marcar pago de combustible como realizado', action: 'fuel_pay', permissionType: 'action' },
  ],

  // ========== PROCURA ==========
  procurement: [
    { code: 'procurement:*', name: 'Procura - Acceso Completo', description: 'Acceso completo al módulo de procura', action: '*', permissionType: 'module' },
    { code: 'procurement:read', name: 'Ver Procura', description: 'Ver órdenes y proveedores', action: 'read', permissionType: 'action' },
    { code: 'procurement:create', name: 'Crear Solicitud', description: 'Crear solicitud de compra', action: 'create', permissionType: 'action' },
    { code: 'procurement:approve', name: 'Aprobar Solicitud', description: 'Aprobar solicitudes de compra', action: 'approve', permissionType: 'action' },
    { code: 'procurement:order', name: 'Generar Orden', description: 'Generar orden de compra', action: 'order', permissionType: 'action' },
    { code: 'procurement:receive', name: 'Registrar Recepción', description: 'Registrar recepción de materiales', action: 'receive', permissionType: 'action' },
  ],

  // ========== HSE ==========
  hse: [
    { code: 'hse:*', name: 'HSE - Acceso Completo', description: 'Acceso completo al módulo de HSE', action: '*', permissionType: 'module' },
    { code: 'hse:read', name: 'Ver HSE', description: 'Ver incidentes e inspecciones', action: 'read', permissionType: 'action' },
    { code: 'hse:create', name: 'Registrar Incidente', description: 'Registrar incidente de seguridad', action: 'create', permissionType: 'action' },
    { code: 'hse:update', name: 'Editar Registro', description: 'Editar registros de HSE', action: 'update', permissionType: 'action' },
    { code: 'hse:close', name: 'Cerrar Incidente', description: 'Cerrar incidente de seguridad', action: 'close', permissionType: 'action' },
  ],

  // ========== DOCUMENTOS ==========
  documents: [
    { code: 'documents:*', name: 'Documentos - Acceso Completo', description: 'Acceso completo al módulo de documentos', action: '*', permissionType: 'module' },
    { code: 'documents:read', name: 'Ver Documentos', description: 'Ver documentos', action: 'read', permissionType: 'action' },
    { code: 'documents:create', name: 'Subir Documento', description: 'Subir nuevos documentos', action: 'create', permissionType: 'action' },
    { code: 'documents:update', name: 'Editar Documento', description: 'Editar documentos existentes', action: 'update', permissionType: 'action' },
    { code: 'documents:delete', name: 'Eliminar Documento', description: 'Eliminar documentos', action: 'delete', permissionType: 'action' },
    { code: 'documents:approve', name: 'Aprobar Documento', description: 'Aprobar documentos', action: 'approve', permissionType: 'action' },
    { code: 'documents:share', name: 'Compartir Documento', description: 'Compartir documentos', action: 'share', permissionType: 'action' },
  ],

  // ========== ORGANIZACIÓN ==========
  organization: [
    { code: 'organization:*', name: 'Organización - Acceso Completo', description: 'Acceso completo al módulo de organización', action: '*', permissionType: 'module' },
    { code: 'organization:read', name: 'Ver Organización', description: 'Ver departamentos y posiciones', action: 'read', permissionType: 'action' },
    { code: 'organization:create', name: 'Crear Departamento/Posición', description: 'Crear departamentos y posiciones', action: 'create', permissionType: 'action' },
    { code: 'organization:update', name: 'Editar Departamento/Posición', description: 'Editar departamentos y posiciones', action: 'update', permissionType: 'action' },
    { code: 'organization:delete', name: 'Eliminar Departamento/Posición', description: 'Eliminar departamentos y posiciones', action: 'delete', permissionType: 'action' },
  ],

  // ========== AUDITORÍA ==========
  audit: [
    { code: 'audit:read', name: 'Ver Auditoría', description: 'Ver logs de auditoría', action: 'read', permissionType: 'action' },
    { code: 'audit:export', name: 'Exportar Auditoría', description: 'Exportar logs de auditoría', action: 'export', permissionType: 'action' },
  ],

  // ========== REPORTES ==========
  reports: [
    { code: 'reports:*', name: 'Reportes - Acceso Completo', description: 'Acceso completo a todos los reportes', action: '*', permissionType: 'module' },
    { code: 'reports:dashboard', name: 'Ver Dashboard', description: 'Ver dashboard principal', action: 'dashboard', permissionType: 'action' },
    { code: 'reports:finance', name: 'Reportes Financieros', description: 'Ver reportes financieros', action: 'finance', permissionType: 'action' },
    { code: 'reports:payroll', name: 'Reportes de Nómina', description: 'Ver reportes de nómina', action: 'payroll', permissionType: 'action' },
    { code: 'reports:projects', name: 'Reportes de Proyectos', description: 'Ver reportes de proyectos', action: 'projects', permissionType: 'action' },
    { code: 'reports:inventory', name: 'Reportes de Inventario', description: 'Ver reportes de inventario', action: 'inventory', permissionType: 'action' },
    { code: 'reports:fleet', name: 'Reportes de Flota', description: 'Ver reportes de flota', action: 'fleet', permissionType: 'action' },
  ],

  // ========== WHATSAPP ==========
  whatsapp: [
    { code: 'whatsapp:*', name: 'WhatsApp - Acceso Completo', description: 'Acceso completo al módulo de WhatsApp', action: '*', permissionType: 'module' },
    { code: 'whatsapp:read', name: 'Ver Estado WhatsApp', description: 'Ver estado de conexión de WhatsApp', action: 'read', permissionType: 'action' },
    { code: 'whatsapp:manage', name: 'Gestionar WhatsApp', description: 'Conectar, desconectar y enviar mensajes de prueba', action: 'manage', permissionType: 'action' },
  ],

  // ========== EMAIL ==========
  email: [
    { code: 'email:*', name: 'Email - Acceso Completo', description: 'Acceso completo al módulo de Email', action: '*', permissionType: 'module' },
    { code: 'email:read', name: 'Ver Configuración Email', description: 'Ver configuración SMTP y plantillas', action: 'read', permissionType: 'action' },
    { code: 'email:manage', name: 'Gestionar Email', description: 'Configurar SMTP, editar plantillas y enviar correos de prueba', action: 'manage', permissionType: 'action' },
  ],
};

// Roles predefinidos con sus permisos
const ROLES = {
  'Super Administrador': {
    description: 'Acceso total al sistema',
    isSystemRole: true,
    permissions: ['*:*'],
  },
  'Gerente General': {
    description: 'Supervisión estratégica y aprobaciones',
    isSystemRole: true,
    permissions: [
      'employees:read', 'employees:read:personal', 'employees:read:work', 'employees:read:payroll',
      'employees:read:loans', 'employees:read:accounts', 'employees:read:documents', 'employees:read:hierarchy',
      'loans:read', 'loans:approve', 'loans:reject',
      'payroll:read', 'payroll:approve',
      'finance:read', 'finance:export',
      'petty_cash:read', 'petty_cash:approve',
      'projects:*',
      'contractors:read', 'contractors:pay',
      'inventory:read',
      'fleet:read', 'fleet:read:assignments', 'fleet:read:maintenance', 'fleet:read:fuel', 'fleet:read:costs',
      'procurement:read', 'procurement:approve',
      'hse:read',
      'documents:read', 'documents:approve',
      'organization:read',
      'reports:*',
      'audit:read',
    ],
  },
  'Gerente Administrativo': {
    description: 'Gestión administrativa y financiera',
    isSystemRole: true,
    permissions: [
      'employees:*',
      'loans:*',
      'payroll:*',
      'finance:*',
      'petty_cash:*',
      'documents:*',
      'organization:*',
      'users:read',
      'reports:finance', 'reports:payroll',
    ],
  },
  'Gerente de Operaciones': {
    description: 'Gestión de proyectos, inventario y flota',
    isSystemRole: true,
    permissions: [
      'employees:read', 'employees:read:personal', 'employees:read:work',
      'projects:*',
      'contractors:*',
      'inventory:*',
      'fleet:*',
      'hse:*',
      'procurement:create', 'procurement:read',
      'reports:projects', 'reports:inventory', 'reports:fleet',
    ],
  },
  'Contador': {
    description: 'Gestión contable y financiera',
    isSystemRole: true,
    permissions: [
      'employees:read:payroll', 'employees:read:accounts',
      'payroll:read', 'payroll:pay', 'payroll:export',
      'finance:*',
      'petty_cash:read', 'petty_cash:approve', 'petty_cash:pay',
      'fleet:read', 'fleet:fuel_approve', 'fleet:fuel_pay',
      'reports:finance', 'reports:payroll',
    ],
  },
  'Jefe de RRHH': {
    description: 'Gestión de recursos humanos',
    isSystemRole: true,
    permissions: [
      'employees:*',
      'loans:*',
      'payroll:*',
      'organization:*',
      'documents:read', 'documents:create',
      'reports:payroll',
    ],
  },
  'Supervisor de Proyecto': {
    description: 'Supervisión de proyectos asignados',
    isSystemRole: true,
    permissions: [
      'employees:read:personal', 'employees:read:work',
      'projects:read', 'projects:update',
      'projects:read:team', 'projects:read:milestones', 'projects:read:expenses',
      'projects:read:updates', 'projects:read:photos', 'projects:read:valuations',
      'inventory:read', 'inventory:movement',
      'fleet:read', 'fleet:fuel',
      'petty_cash:expense',
      'hse:create', 'hse:read',
    ],
  },
  'Empleado': {
    description: 'Acceso básico al sistema',
    isSystemRole: true,
    permissions: [
      'employees:read:personal', // Solo su propio perfil
      'loans:read', 'loans:create', // Solo sus préstamos
      'petty_cash:expense', // Registrar gastos
      'documents:read', // Solo sus documentos
      'reports:dashboard',
    ],
  },
};

/**
 * Función para ejecutar el seeder
 */
async function seedPermissions(models) {
  const { Permission, Role } = models;
  
  console.log('🔐 Iniciando seeder de permisos granulares...');
  
  // 1. Crear todos los permisos
  const allPermissions = [];
  for (const [moduleName, permissions] of Object.entries(PERMISSIONS)) {
    for (const perm of permissions) {
      allPermissions.push({
        ...perm,
        module: moduleName,
      });
    }
  }
  
  // Insertar permisos (ignorar duplicados)
  for (const perm of allPermissions) {
    await Permission.findOrCreate({
      where: { code: perm.code },
      defaults: perm,
    });
  }
  console.log(`✅ ${allPermissions.length} permisos creados/verificados`);
  
  // 2. Crear roles y asignar permisos
  for (const [roleName, roleData] of Object.entries(ROLES)) {
    const [role] = await Role.findOrCreate({
      where: { name: roleName },
      defaults: {
        name: roleName,
        description: roleData.description,
        isSystemRole: roleData.isSystemRole,
      },
    });
    
    // Obtener permisos del rol
    const permissions = await Permission.findAll({
      where: {
        code: roleData.permissions,
      },
    });
    
    // Asignar permisos al rol
    await role.setPermissions(permissions);
    console.log(`✅ Rol "${roleName}" configurado con ${permissions.length} permisos`);
  }
  
  console.log('🎉 Seeder de permisos completado');
}

module.exports = {
  PERMISSIONS,
  ROLES,
  seedPermissions,
};
