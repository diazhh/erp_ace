require('dotenv').config();
const { sequelize } = require('./src/database');
const models = require('./src/database/models');

const syncDatabase = async () => {
  try {
    console.log('🔄 Sincronizando base de datos (creando tablas)...');
    
    // Sincronizar todos los modelos - force: true recrea las tablas
    await sequelize.sync({ force: true });
    
    console.log('✅ Base de datos sincronizada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar base de datos:', error);
    process.exit(1);
  }
};

syncDatabase();
