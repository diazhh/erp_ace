require('dotenv').config();
const { sequelize } = require('./index');

const sync = async () => {
  try {
    // Importar modelos para que se registren (esto carga todas las asociaciones)
    require('./models');

    console.log('🔄 Sincronizando base de datos...');
    console.log('   Creando tablas faltantes (sin modificar existentes)...');
    
    // Solo crear tablas que no existen (no modifica las existentes)
    await sequelize.sync({ force: false });
    
    console.log('✅ Base de datos sincronizada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
    process.exit(1);
  }
};

sync();
