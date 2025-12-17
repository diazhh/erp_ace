require('dotenv').config();
const { sequelize } = require('./index');

const sync = async () => {
  try {
    // Importar modelos para que se registren
    const models = require('./models');

    console.log('🔄 Sincronizando base de datos...');
    
    // Modelos nuevos ordenados por dependencias (primero los que no dependen de otros)
    const newModels = [
      // Contracts (primero - Concession es dependencia de Field)
      'Concession', 'OGContract', 'ContractParty', 'WorkingInterest', 'RoyaltyPayment',
      // AFE (AFECategory primero)
      'AFECategory', 'AFE', 'AFEApproval', 'AFEExpense', 'AFEVariance',
      // Compliance
      'Policy', 'Certification', 'RegulatoryReport', 'EnvironmentalPermit', 'ComplianceAudit',
      // Production (Field depende de Concession)
      'Field', 'Well', 'WellLog', 'WellProduction', 'ProductionAllocation', 'MorningReport',
      // JIB (depende de AFE y otros)
      'JointInterestBilling', 'JIBLineItem', 'JIBPartnerShare', 'CashCall', 'CashCallResponse'
    ];
    
    for (const modelName of newModels) {
      if (models[modelName]) {
        console.log(`  Sincronizando ${modelName}...`);
        await models[modelName].sync({ alter: true });
      } else {
        console.log(`  ⚠️ Modelo ${modelName} no encontrado`);
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
