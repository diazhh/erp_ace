// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  descripcionSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Inicio',
    },
    {
      type: 'doc',
      id: 'dashboard/index',
      label: 'Dashboard',
    },
    {
      type: 'doc',
      id: 'empleados/index',
      label: 'Empleados',
    },
    {
      type: 'category',
      label: 'Organización',
      items: [
        { type: 'doc', id: 'organizacion/index', label: 'General' },
      ],
    },
    {
      type: 'category',
      label: 'Nómina',
      items: [
        { type: 'doc', id: 'nomina/index', label: 'Períodos y Préstamos' },
      ],
    },
    {
      type: 'category',
      label: 'Finanzas',
      items: [
        { type: 'doc', id: 'finanzas/index', label: 'Dashboard y Cuentas' },
        { type: 'doc', id: 'caja-chica/index', label: 'Caja Chica' },
      ],
    },
    {
      type: 'category',
      label: 'Proyectos',
      items: [
        { type: 'doc', id: 'proyectos/index', label: 'Dashboard y Lista' },
      ],
    },
    {
      type: 'category',
      label: 'Compras',
      items: [
        { type: 'doc', id: 'procura/index', label: 'Órdenes y Facturas' },
      ],
    },
    {
      type: 'category',
      label: 'Inventario',
      items: [
        { type: 'doc', id: 'inventario/index', label: 'Artículos y Almacenes' },
      ],
    },
    {
      type: 'category',
      label: 'Flota',
      items: [
        { type: 'doc', id: 'flota/index', label: 'Vehículos y Mantenimientos' },
      ],
    },
    {
      type: 'category',
      label: 'HSE',
      items: [
        { type: 'doc', id: 'hse/index', label: 'Incidentes e Inspecciones' },
        { type: 'doc', id: 'permisos-trabajo/index', label: 'Permisos de Trabajo' },
      ],
    },
    {
      type: 'category',
      label: 'Documentos',
      items: [
        { type: 'doc', id: 'documentos/index', label: 'Gestión Documental' },
      ],
    },
    {
      type: 'category',
      label: 'Activos',
      items: [
        { type: 'doc', id: 'activos/index', label: 'Activos Fijos' },
      ],
    },
    {
      type: 'category',
      label: 'CRM',
      items: [
        { type: 'doc', id: 'crm/index', label: 'Clientes y Oportunidades' },
      ],
    },
    {
      type: 'category',
      label: 'Calidad',
      items: [
        { type: 'doc', id: 'calidad/index', label: 'Inspecciones y NC' },
      ],
    },
    {
      type: 'category',
      label: 'Producción',
      items: [
        { type: 'doc', id: 'produccion/index', label: 'Campos y Pozos' },
      ],
    },
    {
      type: 'category',
      label: 'AFE',
      items: [
        { type: 'doc', id: 'afe/index', label: 'Autorizaciones de Gasto' },
      ],
    },
    {
      type: 'category',
      label: 'Contratos',
      items: [
        { type: 'doc', id: 'contratos/index', label: 'Contratos Petroleros' },
      ],
    },
    {
      type: 'category',
      label: 'Compliance',
      items: [
        { type: 'doc', id: 'compliance/index', label: 'Cumplimiento Regulatorio' },
      ],
    },
    {
      type: 'category',
      label: 'JIB',
      items: [
        { type: 'doc', id: 'jib/index', label: 'Facturación Conjunta' },
      ],
    },
    {
      type: 'doc',
      id: 'reportes/index',
      label: 'Reportes',
    },
    {
      type: 'category',
      label: 'Administración',
      items: [
        { type: 'doc', id: 'usuarios/index', label: 'Usuarios y Roles' },
        { type: 'doc', id: 'notificaciones/index', label: 'Notificaciones' },
        { type: 'doc', id: 'configuracion/index', label: 'Configuración' },
      ],
    },
    {
      type: 'doc',
      id: 'introduccion/index',
      label: 'Introducción al Sistema',
    },
  ],
};

module.exports = sidebars;
