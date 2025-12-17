require('dotenv').config();
const { sequelize } = require('./index');

const sync = async () => {
  try {
    // Importar modelos para que se registren
    const models = require('./models');

    console.log('🔄 Sincronizando base de datos...');
    
    // Modelos nuevos que necesitan sincronización (no tienen migraciones)
    const newModels = [
      // Production
      'Field', 'Well', 'WellProduction', 'ProductionAllocation', 'MorningReport', 'WellLog',
      // AFE
      'AFE', 'AFECategory', 'AFEApproval', 'AFEExpense', 'AFEVariance',
      // Contracts
      'OGContract', 'ContractParty', 'WorkingInterest', 'RoyaltyPayment', 'Concession',
      // Compliance
      'RegulatoryReport', 'EnvironmentalPermit', 'ComplianceAudit', 'Policy', 'Certification',
      // JIB
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
