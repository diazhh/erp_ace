'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Crear usuario admin
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    await queryInterface.bulkInsert('users', [{
      id: adminId,
      username: 'admin',
      email: 'admin@erp.local',
      password: hashedPassword,
      first_name: 'Administrador',
      last_name: 'Sistema',
      is_active: true,
      created_at: now,
      updated_at: now,
    }]);

    // Obtener rol de Super Administrador
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Super Administrador' LIMIT 1`
    );
    
    if (roles.length > 0) {
      await queryInterface.bulkInsert('user_roles', [{
        user_id: adminId,
        role_id: roles[0].id,
        created_at: now,
        updated_at: now,
      }]);
    }

    // Obtener permiso de super admin y asignarlo al rol
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id FROM permissions WHERE code = '*:*' LIMIT 1`
    );

    if (roles.length > 0 && permissions.length > 0) {
      await queryInterface.bulkInsert('role_permissions', [{
        role_id: roles[0].id,
        permission_id: permissions[0].id,
        created_at: now,
        updated_at: now,
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('users', { username: 'admin' }, {});
  }
};
