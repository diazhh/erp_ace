'use strict';
const { v4: uuidv4 } = require('uuid');

const logisticsPermissions = [
  { code: 'logistics:*', name: 'Logística - Acceso Total', description: 'Acceso total al módulo de logística' },
  { code: 'logistics:read', name: 'Logística - Ver', description: 'Ver información de logística' },
  { code: 'logistics:create', name: 'Logística - Crear', description: 'Crear registros de logística' },
  { code: 'logistics:update', name: 'Logística - Editar', description: 'Editar registros de logística' },
  { code: 'logistics:delete', name: 'Logística - Eliminar', description: 'Eliminar registros de logística' },
  { code: 'logistics:approve', name: 'Logística - Aprobar', description: 'Aprobar registros de logística' },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Insert permissions
    await queryInterface.bulkInsert('permissions', logisticsPermissions.map(perm => ({
      id: uuidv4(),
      ...perm,
      module: 'logistics',
      created_at: now,
      updated_at: now,
    })));

    // Get admin role
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Super Administrador' LIMIT 1`
    );

    if (adminRole.length > 0) {
      const adminRoleId = adminRole[0].id;

      // Get logistics permissions
      const [permissions] = await queryInterface.sequelize.query(
        `SELECT id FROM permissions WHERE code LIKE 'logistics:%'`
      );

      // Assign all logistics permissions to admin role
      const rolePermissions = permissions.map(perm => ({
        role_id: adminRoleId,
        permission_id: perm.id,
      }));

      if (rolePermissions.length > 0) {
        await queryInterface.bulkInsert('role_permissions', rolePermissions);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove role_permissions first
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id FROM permissions WHERE code LIKE 'logistics:%'`
    );
    
    const permissionIds = permissions.map(p => `'${p.id}'`).join(',');
    
    if (permissionIds) {
      await queryInterface.sequelize.query(
        `DELETE FROM role_permissions WHERE permission_id IN (${permissionIds})`
      );
    }

    // Remove permissions
    await queryInterface.bulkDelete('permissions', {
      code: {
        [Sequelize.Op.like]: 'logistics:%'
      }
    });
  }
};
