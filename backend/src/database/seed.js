require('dotenv').config();
const { sequelize } = require('./index');
const { seedPermissions } = require('./seeders/permissions-granular');
const { seedProduction } = require('./seeders/production-seeder');
const seedAFE = require('./seeders/afe-seeder');
const { seedContracts } = require('./seeders/contractSeeder');

const seed = async () => {
  try {
    // Importar modelos
    const models = require('./models');
    const { User, Role } = models;

    console.log('🌱 Iniciando seed de datos...');

    // Ejecutar seeder de permisos granulares
    await seedPermissions(models);

    // Crear usuario admin si no existe
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    if (!existingAdmin) {
      const superAdminRole = await Role.findOne({ where: { name: 'Super Administrador' } });
      
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
      
      // Asegurar que tiene el rol de Super Admin
      const superAdminRole = await Role.findOne({ where: { name: 'Super Administrador' } });
      if (superAdminRole) {
        const hasRole = await existingAdmin.hasRole(superAdminRole);
        if (!hasRole) {
          await existingAdmin.addRole(superAdminRole);
          console.log('✅ Rol Super Administrador asignado al admin existente');
        }
      }
    }

    // Ejecutar seeder de producción
    await seedProduction(models);

    // Ejecutar seeder de AFE
    await seedAFE(models);

    // Ejecutar seeder de Contracts
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    const clients = await models.Client?.findAll({ limit: 3 }) || [];
    await seedContracts(models, adminUser, clients);

    console.log('\n🎉 Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seed();
