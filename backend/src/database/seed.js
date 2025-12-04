require('dotenv').config();
const { sequelize } = require('./index');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    // Importar modelos
    const models = require('./models');
    const { User, Role, Permission } = models;

    console.log('🌱 Iniciando seed de datos...');

    // Crear roles
    const roles = await Role.bulkCreate([
      { name: 'Super Administrador', description: 'Acceso total al sistema', isSystemRole: true },
      { name: 'Gerente General', description: 'Acceso gerencial completo', isSystemRole: true },
      { name: 'Gerente Administrativo', description: 'Gestión administrativa', isSystemRole: true },
      { name: 'Contador', description: 'Acceso a módulos financieros', isSystemRole: true },
      { name: 'Jefe de RRHH', description: 'Gestión de recursos humanos', isSystemRole: true },
      { name: 'Supervisor de Operaciones', description: 'Supervisión de proyectos y operaciones', isSystemRole: true },
      { name: 'Empleado', description: 'Acceso básico al sistema', isSystemRole: true },
    ], { ignoreDuplicates: true });

    console.log('✅ Roles creados');

    // Crear permisos
    const modules = [
      'users', 'roles', 'employees', 'payroll', 'projects',
      'finance', 'petty_cash', 'procurement', 'inventory',
      'fleet', 'hse', 'documents', 'reports', 'audit'
    ];
    const actions = ['create', 'read', 'update', 'delete', 'approve', 'export', 'pay'];

    const permissionsData = [];
    modules.forEach(mod => {
      actions.forEach(action => {
        permissionsData.push({
          code: `${mod}:${action}`,
          name: `${action} ${mod}`,
          description: `Permiso para ${action} en módulo ${mod}`,
          module: mod,
        });
      });
    });

    // Agregar permiso super admin
    permissionsData.push({
      code: '*:*',
      name: 'Super Administrador',
      description: 'Acceso total a todas las funciones',
      module: 'system',
    });

    await Permission.bulkCreate(permissionsData, { ignoreDuplicates: true });
    console.log('✅ Permisos creados');

    // Obtener rol de Super Admin y permiso *:*
    const superAdminRole = await Role.findOne({ where: { name: 'Super Administrador' } });
    const superAdminPermission = await Permission.findOne({ where: { code: '*:*' } });

    // Asignar permiso al rol
    if (superAdminRole && superAdminPermission) {
      await superAdminRole.addPermission(superAdminPermission);
      console.log('✅ Permiso asignado al rol Super Administrador');
    }

    // Crear usuario admin
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    if (!existingAdmin) {
      const admin = await User.create({
        username: 'admin',
        email: 'admin@erp.local',
        password: 'Admin123!',
        firstName: 'Administrador',
        lastName: 'Sistema',
        isActive: true,
      });

      // Asignar rol
      if (superAdminRole) {
        await admin.addRole(superAdminRole);
      }

      console.log('✅ Usuario admin creado');
      console.log('   Usuario: admin');
      console.log('   Contraseña: Admin123!');
    } else {
      console.log('ℹ️  Usuario admin ya existe');
    }

    console.log('\n🎉 Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seed();
