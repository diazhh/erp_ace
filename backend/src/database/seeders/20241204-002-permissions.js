'use strict';
const { v4: uuidv4 } = require('uuid');

const modules = [
  { module: 'users', name: 'Usuarios' },
  { module: 'roles', name: 'Roles' },
  { module: 'employees', name: 'Empleados' },
  { module: 'payroll', name: 'Nómina' },
  { module: 'projects', name: 'Proyectos' },
  { module: 'finance', name: 'Finanzas' },
  { module: 'petty_cash', name: 'Caja Chica' },
  { module: 'procurement', name: 'Procura' },
  { module: 'inventory', name: 'Inventario' },
  { module: 'fleet', name: 'Flota' },
  { module: 'hse', name: 'HSE' },
  { module: 'documents', name: 'Documentos' },
  { module: 'reports', name: 'Reportes' },
  { module: 'audit', name: 'Auditoría' },
];

const actions = [
  { action: 'create', name: 'Crear' },
  { action: 'read', name: 'Ver' },
  { action: 'update', name: 'Editar' },
  { action: 'delete', name: 'Eliminar' },
  { action: 'approve', name: 'Aprobar' },
  { action: 'export', name: 'Exportar' },
];

const permissions = [];

// Generar permisos para cada módulo
modules.forEach(mod => {
  actions.forEach(act => {
    permissions.push({
      id: uuidv4(),
      code: `${mod.module}:${act.action}`,
      name: `${act.name} ${mod.name}`,
      description: `Permiso para ${act.name.toLowerCase()} en módulo de ${mod.name}`,
      module: mod.module,
    });
  });
});

// Agregar permiso de super admin
permissions.push({
  id: uuidv4(),
  code: '*:*',
  name: 'Super Administrador',
  description: 'Acceso total a todas las funciones del sistema',
  module: 'system',
});

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('permissions', permissions.map(perm => ({
      ...perm,
      created_at: now,
      updated_at: now,
    })));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
