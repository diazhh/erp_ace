'use strict';
const { v4: uuidv4 } = require('uuid');

const roles = [
  { id: uuidv4(), name: 'Super Administrador', description: 'Acceso total al sistema', is_system_role: true },
  { id: uuidv4(), name: 'Gerente General', description: 'Acceso gerencial completo', is_system_role: true },
  { id: uuidv4(), name: 'Gerente Administrativo', description: 'Gestión administrativa', is_system_role: true },
  { id: uuidv4(), name: 'Contador', description: 'Acceso a módulos financieros', is_system_role: true },
  { id: uuidv4(), name: 'Jefe de RRHH', description: 'Gestión de recursos humanos', is_system_role: true },
  { id: uuidv4(), name: 'Supervisor de Operaciones', description: 'Supervisión de proyectos y operaciones', is_system_role: true },
  { id: uuidv4(), name: 'Empleado', description: 'Acceso básico al sistema', is_system_role: true },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('roles', roles.map(role => ({
      ...role,
      created_at: now,
      updated_at: now,
    })));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
