require('dotenv').config();
const { sequelize } = require('./index');

const sync = async () => {
  try {
    const models = require('./models');

    console.log('🔄 Sincronizando tablas nuevas...');
    
    // Lista de modelos nuevos que necesitan tablas (módulos Oil & Gas)
    const newModelNames = [
      // Contracts (orden de dependencias)
      'OGContract', 'ContractParty', 'Concession', 'WorkingInterest', 'RoyaltyPayment',
      // AFE
      'AFECategory', 'AFE', 'AFEApproval', 'AFEExpense', 'AFEVariance',
      // Compliance
      'Policy', 'Certification', 'RegulatoryReport', 'EnvironmentalPermit', 'ComplianceAudit',
      // Production
      'Field', 'Well', 'WellLog', 'WellProduction', 'ProductionAllocation', 'MorningReport',
      // JIB
      'JointInterestBilling', 'JIBLineItem', 'JIBPartnerShare', 'CashCall', 'CashCallResponse'
    ];

    // Verificar qué tablas ya existen
    const [existingTables] = await sequelize.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    );
    const existingTableNames = existingTables.map(t => t.tablename);
    console.log(`   Tablas existentes: ${existingTableNames.length}`);

    // Sincronizar solo modelos cuyas tablas no existen
    for (const modelName of newModelNames) {
      const model = models[modelName];
      if (!model) {
        console.log(`   ⚠️ Modelo ${modelName} no encontrado`);
        continue;
      }
      
      const tableName = model.getTableName();
      if (existingTableNames.includes(tableName)) {
        console.log(`   ⏭️ ${modelName} (${tableName}) ya existe`);
      } else {
        console.log(`   ➕ Creando ${modelName} (${tableName})...`);
        await model.sync({ force: false });
      }
    }
    
    console.log('✅ Sincronización completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
    console.error(error.message);
    process.exit(1);
  }
};

sync();
