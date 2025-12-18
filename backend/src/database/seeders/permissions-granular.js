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
    { code: 'inventory:read:stock', name: 'Ver Stock', description: 'Ver niveles de stock por almacén', action: 'read', field: 'stock', permissionType: 'field' },
    { code: 'inventory:read:movements', name: 'Ver Movimientos', description: 'Ver historial de movimientos', action: 'read', field: 'movements', permissionType: 'field' },
    { code: 'inventory:read:warehouses', name: 'Ver Almacenes', description: 'Ver lista de almacenes', action: 'read', field: 'warehouses', permissionType: 'field' },
    { code: 'inventory:create', name: 'Crear Item', description: 'Crear items de inventario', action: 'create', permissionType: 'action' },
    { code: 'inventory:update', name: 'Editar Item', description: 'Editar items de inventario', action: 'update', permissionType: 'action' },
    { code: 'inventory:delete', name: 'Eliminar Item', description: 'Eliminar items de inventario', action: 'delete', permissionType: 'action' },
    { code: 'inventory:movement', name: 'Registrar Movimiento', description: 'Registrar movimientos de inventario', action: 'movement', permissionType: 'action' },
    { code: 'inventory:adjust', name: 'Ajustar Stock', description: 'Realizar ajustes de inventario', action: 'adjust', permissionType: 'action' },
    { code: 'inventory:transfer', name: 'Transferir', description: 'Transferir entre almacenes', action: 'transfer', permissionType: 'action' },
    { code: 'inventory:approve', name: 'Aprobar Ajustes', description: 'Aprobar ajustes de inventario', action: 'approve', permissionType: 'action' },
    { code: 'inventory:export', name: 'Exportar Inventario', description: 'Exportar datos de inventario', action: 'export', permissionType: 'action' },
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

  // ========== ACTIVOS FIJOS ==========
  assets: [
    { code: 'assets:*', name: 'Activos Fijos - Acceso Completo', description: 'Acceso completo al módulo de activos fijos', action: '*', permissionType: 'module' },
    { code: 'assets:read', name: 'Ver Activos', description: 'Ver lista de activos fijos', action: 'read', permissionType: 'action' },
    { code: 'assets:read:maintenances', name: 'Ver Mantenimientos', description: 'Ver tab de mantenimientos', action: 'read', field: 'maintenances', permissionType: 'field' },
    { code: 'assets:read:transfers', name: 'Ver Transferencias', description: 'Ver tab de transferencias', action: 'read', field: 'transfers', permissionType: 'field' },
    { code: 'assets:read:depreciation', name: 'Ver Depreciación', description: 'Ver tab de depreciación', action: 'read', field: 'depreciation', permissionType: 'field' },
    { code: 'assets:create', name: 'Crear Activo', description: 'Crear nuevos activos fijos', action: 'create', permissionType: 'action' },
    { code: 'assets:update', name: 'Editar Activo', description: 'Editar activos existentes', action: 'update', permissionType: 'action' },
    { code: 'assets:delete', name: 'Eliminar Activo', description: 'Eliminar activos', action: 'delete', permissionType: 'action' },
    { code: 'assets:dispose', name: 'Dar de Baja Activo', description: 'Dar de baja o vender activos', action: 'dispose', permissionType: 'action' },
    { code: 'assets:maintenance', name: 'Gestionar Mantenimientos', description: 'Crear y completar mantenimientos de activos', action: 'maintenance', permissionType: 'action' },
    { code: 'assets:transfer', name: 'Transferir Activo', description: 'Crear y completar transferencias de activos', action: 'transfer', permissionType: 'action' },
    { code: 'assets:transfer_approve', name: 'Aprobar Transferencia', description: 'Aprobar transferencias de activos', action: 'transfer_approve', permissionType: 'action' },
    { code: 'assets:depreciation', name: 'Gestionar Depreciación', description: 'Calcular y ejecutar depreciación de activos', action: 'depreciation', permissionType: 'action' },
  ],

  // ========== CRM ==========
  crm: [
    { code: 'crm:*', name: 'CRM - Acceso Completo', description: 'Acceso completo al módulo de CRM', action: '*', permissionType: 'module' },
    { code: 'crm:read', name: 'Ver CRM', description: 'Ver clientes, oportunidades y cotizaciones', action: 'read', permissionType: 'action' },
    { code: 'crm:create', name: 'Crear en CRM', description: 'Crear clientes, oportunidades y cotizaciones', action: 'create', permissionType: 'action' },
    { code: 'crm:update', name: 'Editar en CRM', description: 'Editar clientes, oportunidades y cotizaciones', action: 'update', permissionType: 'action' },
    { code: 'crm:delete', name: 'Eliminar en CRM', description: 'Eliminar clientes, oportunidades y cotizaciones', action: 'delete', permissionType: 'action' },
  ],

  // ========== CONTROL DE CALIDAD ==========
  quality: [
    { code: 'quality:*', name: 'Calidad - Acceso Completo', description: 'Acceso completo al módulo de control de calidad', action: '*', permissionType: 'module' },
    { code: 'quality:read', name: 'Ver Calidad', description: 'Ver planes, inspecciones y no conformidades', action: 'read', permissionType: 'action' },
    { code: 'quality:create', name: 'Crear en Calidad', description: 'Crear planes, inspecciones y no conformidades', action: 'create', permissionType: 'action' },
    { code: 'quality:update', name: 'Editar en Calidad', description: 'Editar planes, inspecciones y no conformidades', action: 'update', permissionType: 'action' },
    { code: 'quality:delete', name: 'Eliminar en Calidad', description: 'Eliminar registros de calidad', action: 'delete', permissionType: 'action' },
    { code: 'quality:approve', name: 'Aprobar en Calidad', description: 'Aprobar planes, cerrar NC y verificar acciones correctivas', action: 'approve', permissionType: 'action' },
  ],

  // ========== REPORTES DE GASTOS (RENDICIONES) ==========
  expense_reports: [
    { code: 'expense_reports:*', name: 'Reportes de Gastos - Acceso Completo', description: 'Acceso completo al módulo de reportes de gastos', action: '*', permissionType: 'module' },
    { code: 'expense_reports:read', name: 'Ver Reportes de Gastos', description: 'Ver reportes de rendición de gastos', action: 'read', permissionType: 'action' },
    { code: 'expense_reports:create', name: 'Crear Reporte de Gastos', description: 'Crear reportes de rendición de gastos', action: 'create', permissionType: 'action' },
    { code: 'expense_reports:update', name: 'Editar Reporte de Gastos', description: 'Editar reportes de gastos en borrador', action: 'update', permissionType: 'action' },
    { code: 'expense_reports:approve', name: 'Aprobar Reporte de Gastos', description: 'Aprobar o rechazar reportes de gastos', action: 'approve', permissionType: 'action' },
  ],

  // ========== PRODUCCIÓN Y POZOS ==========
  production: [
    { code: 'production:*', name: 'Producción - Acceso Completo', description: 'Acceso completo al módulo de producción', action: '*', permissionType: 'module' },
    { code: 'production:read', name: 'Ver Producción', description: 'Ver campos, pozos y producción diaria', action: 'read', permissionType: 'action' },
    { code: 'production:read:fields', name: 'Ver Campos', description: 'Ver tab de campos petroleros', action: 'read', field: 'fields', permissionType: 'field' },
    { code: 'production:read:wells', name: 'Ver Pozos', description: 'Ver tab de pozos', action: 'read', field: 'wells', permissionType: 'field' },
    { code: 'production:read:daily', name: 'Ver Producción Diaria', description: 'Ver tab de producción diaria', action: 'read', field: 'daily', permissionType: 'field' },
    { code: 'production:read:allocations', name: 'Ver Allocations', description: 'Ver tab de allocations mensuales', action: 'read', field: 'allocations', permissionType: 'field' },
    { code: 'production:read:logs', name: 'Ver Bitácoras', description: 'Ver tab de bitácoras de pozos', action: 'read', field: 'logs', permissionType: 'field' },
    { code: 'production:create', name: 'Registrar Producción', description: 'Crear campos, pozos y registrar producción', action: 'create', permissionType: 'action' },
    { code: 'production:update', name: 'Editar Producción', description: 'Editar registros de producción', action: 'update', permissionType: 'action' },
    { code: 'production:delete', name: 'Eliminar Producción', description: 'Eliminar registros de producción', action: 'delete', permissionType: 'action' },
    { code: 'production:approve', name: 'Aprobar Producción', description: 'Verificar y aprobar registros de producción y allocations', action: 'approve', permissionType: 'action' },
    { code: 'production:verify', name: 'Verificar Producción', description: 'Verificar registros de producción diaria', action: 'verify', permissionType: 'action' },
    { code: 'production:export', name: 'Exportar Producción', description: 'Exportar datos de producción', action: 'export', permissionType: 'action' },
  ],

  // ========== AFE (Authorization for Expenditure) ==========
  afe: [
    { code: 'afe:*', name: 'AFE - Acceso Completo', description: 'Acceso completo al módulo de AFE', action: '*', permissionType: 'module' },
    { code: 'afe:read', name: 'Ver AFE', description: 'Ver autorizaciones de gasto', action: 'read', permissionType: 'action' },
    { code: 'afe:create', name: 'Crear AFE', description: 'Crear nuevas autorizaciones de gasto', action: 'create', permissionType: 'action' },
    { code: 'afe:update', name: 'Editar AFE', description: 'Editar autorizaciones de gasto', action: 'update', permissionType: 'action' },
    { code: 'afe:delete', name: 'Eliminar AFE', description: 'Eliminar autorizaciones de gasto en borrador', action: 'delete', permissionType: 'action' },
    { code: 'afe:approve', name: 'Aprobar AFE', description: 'Aprobar o rechazar autorizaciones de gasto', action: 'approve', permissionType: 'action' },
  ],

  // ========== Contratos O&G ==========
  contracts: [
    { code: 'contracts:*', name: 'Contratos - Acceso Completo', description: 'Acceso completo al módulo de contratos O&G', action: '*', permissionType: 'module' },
    { code: 'contracts:read', name: 'Ver Contratos', description: 'Ver contratos, concesiones y participaciones', action: 'read', permissionType: 'action' },
    { code: 'contracts:create', name: 'Crear Contratos', description: 'Crear nuevos contratos y concesiones', action: 'create', permissionType: 'action' },
    { code: 'contracts:update', name: 'Editar Contratos', description: 'Editar contratos y participaciones', action: 'update', permissionType: 'action' },
    { code: 'contracts:delete', name: 'Eliminar Contratos', description: 'Eliminar contratos en borrador', action: 'delete', permissionType: 'action' },
    { code: 'contracts:approve', name: 'Aprobar Contratos', description: 'Activar, terminar contratos y aprobar regalías', action: 'approve', permissionType: 'action' },
  ],

  // ========== COMPLIANCE REGULATORIO ==========
  compliance: [
    { code: 'compliance:*', name: 'Compliance - Acceso Completo', description: 'Acceso completo al módulo de compliance regulatorio', action: '*', permissionType: 'module' },
    { code: 'compliance:read', name: 'Ver Compliance', description: 'Ver reportes, permisos, auditorías, políticas y certificaciones', action: 'read', permissionType: 'action' },
    { code: 'compliance:create', name: 'Crear en Compliance', description: 'Crear reportes, permisos, auditorías, políticas y certificaciones', action: 'create', permissionType: 'action' },
    { code: 'compliance:update', name: 'Editar en Compliance', description: 'Editar registros de compliance', action: 'update', permissionType: 'action' },
    { code: 'compliance:delete', name: 'Eliminar en Compliance', description: 'Eliminar registros de compliance en borrador', action: 'delete', permissionType: 'action' },
    { code: 'compliance:approve', name: 'Aprobar en Compliance', description: 'Aprobar políticas, cerrar auditorías y validar reportes', action: 'approve', permissionType: 'action' },
  ],

  // ========== JIB (JOINT INTEREST BILLING) ==========
  jib: [
    { code: 'jib:*', name: 'JIB - Acceso Completo', description: 'Acceso completo al módulo de facturación JIB y Cash Calls', action: '*', permissionType: 'module' },
    { code: 'jib:read', name: 'Ver JIB', description: 'Ver JIBs, Cash Calls, distribuciones y estados de cuenta', action: 'read', permissionType: 'action' },
    { code: 'jib:create', name: 'Crear JIB', description: 'Crear nuevos JIBs y Cash Calls', action: 'create', permissionType: 'action' },
    { code: 'jib:update', name: 'Editar JIB', description: 'Editar JIBs, registrar pagos y fondeos', action: 'update', permissionType: 'action' },
    { code: 'jib:delete', name: 'Eliminar JIB', description: 'Eliminar JIBs y Cash Calls en borrador', action: 'delete', permissionType: 'action' },
    { code: 'jib:approve', name: 'Aprobar JIB', description: 'Aprobar y enviar JIBs y Cash Calls', action: 'approve', permissionType: 'action' },
  ],

  // ========== PTW (PERMISOS DE TRABAJO) ==========
  ptw: [
    { code: 'ptw:*', name: 'PTW - Acceso Completo', description: 'Acceso completo al módulo de permisos de trabajo', action: '*', permissionType: 'module' },
    { code: 'ptw:read', name: 'Ver PTW', description: 'Ver permisos de trabajo, checklists y Stop Work', action: 'read', permissionType: 'action' },
    { code: 'ptw:create', name: 'Crear PTW', description: 'Crear nuevos permisos de trabajo y reportar Stop Work', action: 'create', permissionType: 'action' },
    { code: 'ptw:update', name: 'Editar PTW', description: 'Editar permisos, completar checklists, solicitar extensiones', action: 'update', permissionType: 'action' },
    { code: 'ptw:delete', name: 'Eliminar PTW', description: 'Eliminar permisos de trabajo en borrador', action: 'delete', permissionType: 'action' },
    { code: 'ptw:approve', name: 'Aprobar PTW', description: 'Aprobar permisos, extensiones y autorizar reanudación de trabajo', action: 'approve', permissionType: 'action' },
  ],

  // ========== RESERVES (RESERVAS DE HIDROCARBUROS) ==========
  reserves: [
    { code: 'reserves:*', name: 'Reservas - Acceso Completo', description: 'Acceso completo al módulo de reservas de hidrocarburos', action: '*', permissionType: 'module' },
    { code: 'reserves:read', name: 'Ver Reservas', description: 'Ver estimaciones de reservas, categorías y valoraciones', action: 'read', permissionType: 'action' },
    { code: 'reserves:create', name: 'Crear Reservas', description: 'Crear nuevas estimaciones y valoraciones de reservas', action: 'create', permissionType: 'action' },
    { code: 'reserves:update', name: 'Editar Reservas', description: 'Editar estimaciones y valoraciones de reservas', action: 'update', permissionType: 'action' },
    { code: 'reserves:delete', name: 'Eliminar Reservas', description: 'Eliminar estimaciones y valoraciones en borrador', action: 'delete', permissionType: 'action' },
    { code: 'reserves:approve', name: 'Aprobar Reservas', description: 'Aprobar estimaciones y valoraciones de reservas', action: 'approve', permissionType: 'action' },
  ],

  // ========== LOGÍSTICA (TRANSPORTE DE HIDROCARBUROS) ==========
  logistics: [
    { code: 'logistics:*', name: 'Logística - Acceso Completo', description: 'Acceso completo al módulo de logística y transporte', action: '*', permissionType: 'module' },
    { code: 'logistics:read', name: 'Ver Logística', description: 'Ver tanques, tickets de carga, calidad y ductos', action: 'read', permissionType: 'action' },
    { code: 'logistics:read:tanks', name: 'Ver Tanques', description: 'Ver tab de tanques de almacenamiento', action: 'read', field: 'tanks', permissionType: 'field' },
    { code: 'logistics:read:tickets', name: 'Ver Tickets de Carga', description: 'Ver tab de tickets de carga/descarga', action: 'read', field: 'tickets', permissionType: 'field' },
    { code: 'logistics:read:quality', name: 'Ver Calidad de Crudo', description: 'Ver tab de muestras de calidad', action: 'read', field: 'quality', permissionType: 'field' },
    { code: 'logistics:read:pipelines', name: 'Ver Ductos', description: 'Ver tab de ductos', action: 'read', field: 'pipelines', permissionType: 'field' },
    { code: 'logistics:create', name: 'Crear en Logística', description: 'Crear tanques, tickets, muestras y ductos', action: 'create', permissionType: 'action' },
    { code: 'logistics:update', name: 'Editar en Logística', description: 'Editar registros de logística', action: 'update', permissionType: 'action' },
    { code: 'logistics:delete', name: 'Eliminar en Logística', description: 'Eliminar registros de logística', action: 'delete', permissionType: 'action' },
    { code: 'logistics:approve', name: 'Aprobar Calidad', description: 'Aprobar muestras de calidad de crudo', action: 'approve', permissionType: 'action' },
    { code: 'logistics:gauging', name: 'Registrar Mediciones', description: 'Registrar mediciones de tanques', action: 'gauging', permissionType: 'action' },
  ],

  // ========== ATTACHMENTS ==========
  attachments: [
    { code: 'attachments:*', name: 'Adjuntos - Acceso Completo', description: 'Acceso completo a archivos adjuntos', action: '*', permissionType: 'module' },
    { code: 'attachments:read', name: 'Ver Adjuntos', description: 'Ver archivos adjuntos', action: 'read', permissionType: 'action' },
    { code: 'attachments:create', name: 'Subir Adjuntos', description: 'Subir archivos adjuntos', action: 'create', permissionType: 'action' },
    { code: 'attachments:delete', name: 'Eliminar Adjuntos', description: 'Eliminar archivos adjuntos', action: 'delete', permissionType: 'action' },
  ],

  // ========== BACKUP ==========
  backup: [
    { code: 'backup:*', name: 'Backup - Acceso Completo', description: 'Acceso completo a backups del sistema', action: '*', permissionType: 'module' },
    { code: 'backup:read', name: 'Ver Backups', description: 'Ver lista de backups', action: 'read', permissionType: 'action' },
    { code: 'backup:create', name: 'Crear Backup', description: 'Crear backup manual', action: 'create', permissionType: 'action' },
    { code: 'backup:restore', name: 'Restaurar Backup', description: 'Restaurar desde backup', action: 'restore', permissionType: 'action' },
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
      'expense_reports:read', 'expense_reports:approve',
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
      'assets:read', 'assets:read:maintenances', 'assets:read:transfers', 'assets:read:depreciation',
      'assets:dispose', 'assets:transfer_approve', 'assets:depreciation',
      'afe:read', 'afe:approve',
      'contracts:read', 'contracts:approve',
      'compliance:read', 'compliance:approve',
      'jib:read', 'jib:approve',
      'ptw:read', 'ptw:approve',
      'reserves:read', 'reserves:approve',
      'logistics:read', 'logistics:approve',
      'crm:read',
      'quality:read', 'quality:approve',
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
      'expense_reports:*',
      'documents:*',
      'organization:*',
      'users:read',
      'reports:finance', 'reports:payroll',
      'assets:*',
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
      'assets:read', 'assets:create', 'assets:update', 'assets:maintenance', 'assets:transfer',
      'assets:read:maintenances', 'assets:read:transfers',
      'production:*',
      'afe:*',
      'contracts:*',
      'compliance:*',
      'reserves:*',
      'logistics:*',
      'quality:*',
      'ptw:*',
      'jib:read',
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
      'expense_reports:read', 'expense_reports:approve',
      'fleet:read', 'fleet:fuel_approve', 'fleet:fuel_pay',
      'reports:finance', 'reports:payroll',
      'assets:read', 'assets:read:depreciation', 'assets:depreciation',
      'jib:read', 'jib:update',
      'contracts:read',
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
      'expense_reports:create', 'expense_reports:update', 'expense_reports:read',
      'hse:create', 'hse:read',
      'quality:read', 'quality:create',
      'ptw:read', 'ptw:create',
      'production:read',
    ],
  },
  'Empleado': {
    description: 'Acceso básico al sistema',
    isSystemRole: true,
    permissions: [
      'employees:read:personal', // Solo su propio perfil
      'loans:read', 'loans:create', // Solo sus préstamos
      'petty_cash:expense', // Registrar gastos
      'expense_reports:create', 'expense_reports:update', 'expense_reports:read', // Reportar gastos
      'documents:read', // Solo sus documentos
      'reports:dashboard',
    ],
  },

  // ========== NUEVOS ROLES ESPECIALIZADOS O&G ==========

  'Ingeniero de Producción': {
    description: 'Gestión de producción y pozos petroleros',
    isSystemRole: true,
    permissions: [
      'production:*',
      'reserves:read',
      'logistics:read', 'logistics:gauging',
      'hse:read', 'hse:create',
      'ptw:read', 'ptw:create',
      'afe:read',
      'reports:dashboard',
    ],
  },

  'Coordinador HSE': {
    description: 'Seguridad industrial y permisos de trabajo',
    isSystemRole: true,
    permissions: [
      'hse:*',
      'ptw:*',
      'quality:read', 'quality:create',
      'employees:read:personal',
      'projects:read',
      'production:read',
      'compliance:read', 'compliance:create',
      'reports:dashboard',
    ],
  },

  'Coordinador de Logística': {
    description: 'Transporte y almacenamiento de hidrocarburos',
    isSystemRole: true,
    permissions: [
      'logistics:*',
      'production:read',
      'inventory:read', 'inventory:movement',
      'fleet:read', 'fleet:fuel',
      'quality:read',
      'reports:dashboard',
    ],
  },

  'Almacenista': {
    description: 'Gestión de almacén e inventario',
    isSystemRole: true,
    permissions: [
      'inventory:read', 'inventory:movement', 'inventory:transfer',
      'procurement:read', 'procurement:receive',
      'assets:read',
      'reports:dashboard',
    ],
  },

  'Analista de Contratos': {
    description: 'Gestión de contratos O&G y JIB',
    isSystemRole: true,
    permissions: [
      'contracts:*',
      'jib:*',
      'afe:read',
      'crm:read',
      'finance:read',
      'production:read',
      'reports:dashboard',
    ],
  },

  'Analista de Reservas': {
    description: 'Estimación y valoración de reservas',
    isSystemRole: true,
    permissions: [
      'reserves:*',
      'production:read',
      'contracts:read',
      'afe:read',
      'reports:dashboard',
    ],
  },

  'Ejecutivo Comercial': {
    description: 'Gestión comercial y CRM',
    isSystemRole: true,
    permissions: [
      'crm:*',
      'projects:read',
      'contractors:read',
      'documents:read', 'documents:create',
      'reports:dashboard',
    ],
  },

  'Inspector de Calidad': {
    description: 'Control de calidad e inspecciones',
    isSystemRole: true,
    permissions: [
      'quality:*',
      'projects:read',
      'hse:read',
      'production:read',
      'logistics:read:quality',
      'documents:read', 'documents:create',
      'reports:dashboard',
    ],
  },

  'Operador de Campo': {
    description: 'Operaciones de campo y producción diaria',
    isSystemRole: true,
    permissions: [
      'production:read', 'production:create',
      'logistics:read', 'logistics:gauging',
      'hse:read', 'hse:create',
      'ptw:read',
      'inventory:read', 'inventory:movement',
      'fleet:read', 'fleet:fuel',
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
