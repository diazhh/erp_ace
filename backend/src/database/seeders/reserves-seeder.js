const models = require('../models');

async function seedReserves() {
  const { ReserveEstimate, ReserveCategory, ReserveValuation, Field, User } = models;

  console.log('🛢️  Seeding Reserves module...');

  // Get existing fields and admin user
  const fields = await Field.findAll({ limit: 3 });
  const admin = await User.findOne({ where: { username: 'admin' } });

  if (fields.length === 0) {
    console.log('⚠️  No fields found. Please run production seeder first.');
    return;
  }

  if (!admin) {
    console.log('⚠️  Admin user not found.');
    return;
  }

  // Create Reserve Estimates
  const estimates = [];
  
  // Estimate 1 - Campo Morichal (Approved)
  const estimate1 = await ReserveEstimate.findOrCreate({
    where: { code: 'RES-2024-0001' },
    defaults: {
      field_id: fields[0].id,
      estimate_date: '2024-12-01',
      effective_date: '2024-12-31',
      standard: 'PRMS',
      evaluator: 'EXTERNAL',
      evaluator_company: 'DeGolyer and MacNaughton',
      evaluator_name: 'John Smith, P.E.',
      report_number: 'DM-2024-VEN-001',
      methodology: 'Volumetric and decline curve analysis with material balance verification',
      assumptions: {
        oil_price: 75.00,
        gas_price: 3.50,
        discount_rate: 10,
        inflation_rate: 2.5,
      },
      status: 'APPROVED',
      approved_by: admin.id,
      approved_at: new Date('2024-12-15'),
      notes: 'Annual reserve certification for Campo Morichal',
      created_by: admin.id,
    },
  });
  estimates.push(estimate1[0]);

  // Estimate 2 - Campo Temblador (Approved)
  const estimate2 = await ReserveEstimate.findOrCreate({
    where: { code: 'RES-2024-0002' },
    defaults: {
      field_id: fields[1] ? fields[1].id : fields[0].id,
      estimate_date: '2024-11-15',
      effective_date: '2024-12-31',
      standard: 'SEC',
      evaluator: 'EXTERNAL',
      evaluator_company: 'Ryder Scott Company',
      evaluator_name: 'Maria Garcia, P.G.',
      report_number: 'RS-2024-0456',
      methodology: 'Probabilistic analysis using Monte Carlo simulation',
      assumptions: {
        oil_price: 72.00,
        gas_price: 3.25,
        discount_rate: 10,
        inflation_rate: 2.0,
      },
      status: 'APPROVED',
      approved_by: admin.id,
      approved_at: new Date('2024-12-01'),
      notes: 'SEC compliant reserve report for Campo Temblador',
      created_by: admin.id,
    },
  });
  estimates.push(estimate2[0]);

  // Estimate 3 - Draft
  const estimate3 = await ReserveEstimate.findOrCreate({
    where: { code: 'RES-2025-0001' },
    defaults: {
      field_id: fields[0].id,
      estimate_date: '2025-01-10',
      effective_date: '2025-01-01',
      standard: 'PRMS',
      evaluator: 'INTERNAL',
      evaluator_company: null,
      evaluator_name: 'Internal Reservoir Engineering Team',
      report_number: null,
      methodology: 'Preliminary volumetric estimate pending external certification',
      assumptions: {
        oil_price: 78.00,
        gas_price: 3.75,
        discount_rate: 10,
      },
      status: 'DRAFT',
      notes: 'Q1 2025 preliminary estimate - pending external review',
      created_by: admin.id,
    },
  });
  estimates.push(estimate3[0]);

  console.log(`   ✅ Created ${estimates.length} reserve estimates`);

  // Create Reserve Categories for each estimate
  const categoryData = [
    // Estimate 1 - Campo Morichal
    { estimate_id: estimates[0].id, category: '1P', sub_category: 'DEVELOPED_PRODUCING', oil_volume: 45.5, gas_volume: 120.0, condensate_volume: 2.5, ngl_volume: 1.2, recovery_factor: 25.5, ooip: 180.0, ogip: 500.0 },
    { estimate_id: estimates[0].id, category: '1P', sub_category: 'DEVELOPED_NON_PRODUCING', oil_volume: 8.2, gas_volume: 25.0, condensate_volume: 0.5, ngl_volume: 0.3, recovery_factor: 22.0, ooip: 40.0, ogip: 120.0 },
    { estimate_id: estimates[0].id, category: '1P', sub_category: 'UNDEVELOPED', oil_volume: 15.8, gas_volume: 45.0, condensate_volume: 1.0, ngl_volume: 0.5, recovery_factor: 20.0, ooip: 80.0, ogip: 230.0 },
    { estimate_id: estimates[0].id, category: '2P', sub_category: 'N/A', oil_volume: 95.0, gas_volume: 280.0, condensate_volume: 5.5, ngl_volume: 2.8, recovery_factor: 28.0, ooip: 340.0, ogip: 1000.0 },
    { estimate_id: estimates[0].id, category: '3P', sub_category: 'N/A', oil_volume: 135.0, gas_volume: 400.0, condensate_volume: 8.0, ngl_volume: 4.0, recovery_factor: 32.0, ooip: 420.0, ogip: 1250.0 },
    
    // Estimate 2 - Campo Temblador
    { estimate_id: estimates[1].id, category: '1P', sub_category: 'DEVELOPED_PRODUCING', oil_volume: 32.0, gas_volume: 85.0, condensate_volume: 1.8, ngl_volume: 0.9, recovery_factor: 24.0, ooip: 135.0, ogip: 360.0 },
    { estimate_id: estimates[1].id, category: '1P', sub_category: 'UNDEVELOPED', oil_volume: 12.5, gas_volume: 35.0, condensate_volume: 0.7, ngl_volume: 0.4, recovery_factor: 21.0, ooip: 60.0, ogip: 170.0 },
    { estimate_id: estimates[1].id, category: '2P', sub_category: 'N/A', oil_volume: 68.0, gas_volume: 195.0, condensate_volume: 4.0, ngl_volume: 2.0, recovery_factor: 27.0, ooip: 250.0, ogip: 720.0 },
    { estimate_id: estimates[1].id, category: '3P', sub_category: 'N/A', oil_volume: 95.0, gas_volume: 275.0, condensate_volume: 5.5, ngl_volume: 2.8, recovery_factor: 30.0, ooip: 320.0, ogip: 920.0 },
    
    // Estimate 3 - Draft
    { estimate_id: estimates[2].id, category: '1P', sub_category: 'DEVELOPED_PRODUCING', oil_volume: 48.0, gas_volume: 125.0, condensate_volume: 2.6, ngl_volume: 1.3, recovery_factor: 26.0, ooip: 185.0, ogip: 480.0 },
    { estimate_id: estimates[2].id, category: '2P', sub_category: 'N/A', oil_volume: 98.0, gas_volume: 290.0, condensate_volume: 5.8, ngl_volume: 2.9, recovery_factor: 29.0, ooip: 340.0, ogip: 1000.0 },
  ];

  for (const cat of categoryData) {
    // Calculate BOE
    const boe = (parseFloat(cat.oil_volume) || 0) + 
                ((parseFloat(cat.gas_volume) || 0) / 6) + 
                (parseFloat(cat.condensate_volume) || 0) + 
                (parseFloat(cat.ngl_volume) || 0);
    
    await ReserveCategory.findOrCreate({
      where: { 
        estimate_id: cat.estimate_id, 
        category: cat.category,
        sub_category: cat.sub_category,
      },
      defaults: {
        ...cat,
        boe_volume: boe,
        notes: `${cat.category} reserves - ${cat.sub_category}`,
      },
    });
  }

  console.log(`   ✅ Created ${categoryData.length} reserve categories`);

  // Create Reserve Valuations
  const valuations = [
    {
      code: 'VAL-2024-0001',
      estimate_id: estimates[0].id,
      valuation_date: '2024-12-15',
      oil_price: 75.00,
      gas_price: 3.50,
      condensate_price: 70.00,
      price_scenario: 'BASE',
      discount_rate: 10.00,
      npv_1p: 850.5,
      npv_2p: 1450.2,
      npv_3p: 1980.8,
      pv10_1p: 780.0,
      pv10_2p: 1320.0,
      pv10_3p: 1800.0,
      undiscounted_cashflow: 2500.0,
      capex_required: 180.0,
      opex_per_boe: 12.50,
      royalty_rate: 16.67,
      tax_rate: 50.00,
      methodology: 'DCF',
      assumptions: {
        production_decline: 8.5,
        operating_cost_escalation: 2.0,
        abandonment_cost: 25.0,
      },
      sensitivity_analysis: {
        oil_price_minus_10: { npv_2p: 1150.0 },
        oil_price_plus_10: { npv_2p: 1750.0 },
        discount_rate_15: { npv_2p: 1100.0 },
      },
      status: 'APPROVED',
      approved_by: admin.id,
      approved_at: new Date('2024-12-20'),
      notes: 'Year-end 2024 valuation for Campo Morichal',
      created_by: admin.id,
    },
    {
      code: 'VAL-2024-0002',
      estimate_id: estimates[1].id,
      valuation_date: '2024-12-01',
      oil_price: 72.00,
      gas_price: 3.25,
      condensate_price: 68.00,
      price_scenario: 'BASE',
      discount_rate: 10.00,
      npv_1p: 520.3,
      npv_2p: 890.5,
      npv_3p: 1250.0,
      pv10_1p: 480.0,
      pv10_2p: 820.0,
      pv10_3p: 1150.0,
      undiscounted_cashflow: 1600.0,
      capex_required: 120.0,
      opex_per_boe: 14.00,
      royalty_rate: 16.67,
      tax_rate: 50.00,
      methodology: 'DCF',
      assumptions: {
        production_decline: 9.0,
        operating_cost_escalation: 2.5,
        abandonment_cost: 18.0,
      },
      status: 'APPROVED',
      approved_by: admin.id,
      approved_at: new Date('2024-12-10'),
      notes: 'SEC valuation for Campo Temblador',
      created_by: admin.id,
    },
    {
      code: 'VAL-2024-0003',
      estimate_id: estimates[0].id,
      valuation_date: '2024-12-15',
      oil_price: 65.00,
      gas_price: 3.00,
      condensate_price: 60.00,
      price_scenario: 'LOW',
      discount_rate: 10.00,
      npv_1p: 650.0,
      npv_2p: 1100.0,
      npv_3p: 1500.0,
      pv10_1p: 600.0,
      pv10_2p: 1000.0,
      pv10_3p: 1380.0,
      undiscounted_cashflow: 1900.0,
      capex_required: 180.0,
      opex_per_boe: 12.50,
      royalty_rate: 16.67,
      tax_rate: 50.00,
      methodology: 'DCF',
      status: 'APPROVED',
      approved_by: admin.id,
      approved_at: new Date('2024-12-20'),
      notes: 'Low price scenario sensitivity for Campo Morichal',
      created_by: admin.id,
    },
  ];

  for (const val of valuations) {
    await ReserveValuation.findOrCreate({
      where: { code: val.code },
      defaults: val,
    });
  }

  console.log(`   ✅ Created ${valuations.length} reserve valuations`);

  console.log('🛢️  Reserves module seeding completed!');
}

module.exports = seedReserves;
