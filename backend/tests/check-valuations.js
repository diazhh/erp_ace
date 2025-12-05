const { sequelize } = require('../src/database');
const models = require('../src/database/models');

async function checkValuations() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a BD exitosa');
    
    const valuations = await models.ProjectValuation.findAll({
      include: [
        { model: models.Project, as: 'project', attributes: ['code', 'name'] },
        { model: models.Contractor, as: 'contractor', attributes: ['companyName'] },
      ],
      order: [['createdAt', 'ASC']],
    });
    
    console.log(`\n📊 Valuaciones encontradas: ${valuations.length}`);
    valuations.forEach(v => {
      console.log(`  - ${v.code} | ${v.currentPercent}% | ${v.status} | ${v.project?.name || 'N/A'}`);
    });
    
    const projects = await models.Project.findAll({
      where: { executionType: 'OUTSOURCED' },
      include: [{ model: models.Contractor, as: 'contractor' }],
    });
    
    console.log(`\n🏗️ Proyectos contratados: ${projects.length}`);
    projects.forEach(p => {
      console.log(`  - ${p.code} | ${p.name} | Contrato: $${p.contractAmount} | Progreso: ${p.progress}%`);
      console.log(`    Contratista: ${p.contractor?.companyName || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkValuations();
