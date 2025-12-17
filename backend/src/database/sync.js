require('dotenv').config();
const { sequelize } = require('./index');

const sync = async () => {
  try {
    // Importar modelos para que se registren
    const models = require('./models');

    console.log('🔄 Sincronizando base de datos...');
    
    // Solo sincronizar modelos de producción (nuevos)
    const productionModels = ['Field', 'Well', 'WellProduction', 'ProductionAllocation', 'MorningReport'];
    
    for (const modelName of productionModels) {
      if (models[modelName]) {
        console.log(`  Sincronizando ${modelName}...`);
        await models[modelName].sync({ alter: true });
      }
    }
    
    console.log('✅ Base de datos sincronizada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
    process.exit(1);
  }
};

sync();
