require('dotenv').config();
const { sequelize } = require('./index');

const sync = async () => {
  try {
    // Importar modelos para que se registren (esto carga todas las asociaciones)
    require('./models');

    console.log('🔄 Sincronizando base de datos...');
    console.log('   Usando sequelize.sync({ alter: true }) para manejar dependencias...');
    
    // Usar sync global que maneja dependencias automáticamente
    await sequelize.sync({ alter: true });
    
    console.log('✅ Base de datos sincronizada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
    process.exit(1);
  }
};

sync();
