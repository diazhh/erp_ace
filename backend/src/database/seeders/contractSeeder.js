const { v4: uuidv4 } = require('uuid');

const seedContracts = async (models, adminUser, clients) => {
  console.log('🔄 Seeding Contracts...');
  
  const { OGContract, ContractParty, WorkingInterest, RoyaltyPayment, Concession, Field } = models;
  
  // Get existing fields for linking
  const fields = await Field.findAll({ limit: 3 });
  
  // Create Concessions
  const concessions = await Concession.bulkCreate([
    {
      id: uuidv4(),
      code: 'BLK-2024-0001',
      name: 'Bloque Orinoco Norte',
      location: 'Faja Petrolífera del Orinoco',
      state: 'Anzoátegui',
      country: 'Venezuela',
      area_km2: 450.00,
      area_acres: 111200.00,
      type: 'PRODUCTION',
      basin: 'Cuenca Oriental',
      award_date: '2020-01-15',
      expiry_date: '2045-01-15',
      exploration_period_years: 3,
      development_period_years: 5,
      production_period_years: 25,
      status: 'ACTIVE',
      work_commitments: JSON.stringify({
        wells: 10,
        seismic_2d_km: 200,
        seismic_3d_km2: 100,
        minimum_investment: 50000000,
      }),
      minimum_expenditure: 50000000.00,
      wells_committed: 10,
      wells_drilled: 7,
      seismic_km_committed: 200.00,
      seismic_km_acquired: 180.00,
      surface_fee: 250000.00,
      notes: 'Bloque principal de producción de crudo pesado',
      created_by: adminUser.id,
    },
    {
      id: uuidv4(),
      code: 'BLK-2024-0002',
      name: 'Bloque Maracaibo Sur',
      location: 'Lago de Maracaibo',
      state: 'Zulia',
      country: 'Venezuela',
      area_km2: 280.00,
      area_acres: 69200.00,
      type: 'DEVELOPMENT',
      basin: 'Cuenca de Maracaibo',
      award_date: '2021-06-01',
      expiry_date: '2046-06-01',
      exploration_period_years: 2,
      development_period_years: 4,
      production_period_years: 25,
      status: 'ACTIVE',
      work_commitments: JSON.stringify({
        wells: 5,
        seismic_3d_km2: 50,
        minimum_investment: 30000000,
      }),
      minimum_expenditure: 30000000.00,
      wells_committed: 5,
      wells_drilled: 3,
      seismic_km_committed: 50.00,
      seismic_km_acquired: 50.00,
      surface_fee: 180000.00,
      notes: 'Bloque en fase de desarrollo',
      created_by: adminUser.id,
    },
    {
      id: uuidv4(),
      code: 'BLK-2024-0003',
      name: 'Bloque Delta Exploratorio',
      location: 'Delta del Orinoco',
      state: 'Delta Amacuro',
      country: 'Venezuela',
      area_km2: 800.00,
      area_acres: 197680.00,
      type: 'EXPLORATION',
      basin: 'Cuenca Oriental',
      award_date: '2023-03-01',
      expiry_date: '2033-03-01',
      exploration_period_years: 5,
      development_period_years: 5,
      production_period_years: 20,
      status: 'ACTIVE',
      work_commitments: JSON.stringify({
        wells: 3,
        seismic_2d_km: 500,
        seismic_3d_km2: 200,
        minimum_investment: 25000000,
      }),
      minimum_expenditure: 25000000.00,
      wells_committed: 3,
      wells_drilled: 1,
      seismic_km_committed: 500.00,
      seismic_km_acquired: 150.00,
      surface_fee: 100000.00,
      notes: 'Bloque exploratorio con alto potencial',
      created_by: adminUser.id,
    },
  ]);
  
  console.log(`  ✅ Created ${concessions.length} concessions`);
  
  // Create Contracts
  const contracts = await OGContract.bulkCreate([
    {
      id: uuidv4(),
      code: 'PSA-2024-0001',
      name: 'Acuerdo de Producción Compartida - Orinoco Norte',
      type: 'PSA',
      description: 'Contrato de producción compartida para el desarrollo del Bloque Orinoco Norte',
      start_date: '2020-01-15',
      end_date: '2045-01-15',
      renewal_date: '2040-01-15',
      status: 'ACTIVE',
      operator_id: clients?.[0]?.id || null,
      government_entity: 'MENPET / PDVSA',
      royalty_rate: 30.00,
      cost_recovery_limit: 50.00,
      profit_oil_split: 40.00,
      signature_bonus: 5000000.00,
      currency: 'USD',
      total_value: 500000000.00,
      terms_summary: 'Contrato PSA estándar con participación gubernamental del 60%',
      special_conditions: 'Obligación de contenido nacional mínimo del 30%',
      termination_clause: 'Terminación por incumplimiento con 90 días de notificación',
      dispute_resolution: 'Arbitraje ICC París',
      governing_law: 'Leyes de Venezuela',
      signed_date: '2020-01-10',
      effective_date: '2020-01-15',
      notes: 'Contrato principal de operaciones en la Faja',
      created_by: adminUser.id,
    },
    {
      id: uuidv4(),
      code: 'JOA-2024-0001',
      name: 'Acuerdo de Operación Conjunta - Maracaibo',
      type: 'JOA',
      description: 'Joint Operating Agreement para operaciones en el Lago de Maracaibo',
      start_date: '2021-06-01',
      end_date: '2046-06-01',
      renewal_date: null,
      status: 'ACTIVE',
      operator_id: clients?.[1]?.id || null,
      government_entity: 'PDVSA',
      royalty_rate: 25.00,
      cost_recovery_limit: 60.00,
      profit_oil_split: 45.00,
      signature_bonus: 2000000.00,
      currency: 'USD',
      total_value: 200000000.00,
      terms_summary: 'JOA con tres socios y operador designado',
      special_conditions: 'Transferencia de tecnología requerida',
      termination_clause: 'Cláusula de salida con derecho de preferencia',
      dispute_resolution: 'Arbitraje ICSID',
      governing_law: 'Leyes de Venezuela',
      signed_date: '2021-05-25',
      effective_date: '2021-06-01',
      notes: 'Operación conjunta con múltiples socios',
      created_by: adminUser.id,
    },
    {
      id: uuidv4(),
      code: 'CTR-2024-0001',
      name: 'Contrato de Servicios - Delta Exploratorio',
      type: 'SERVICE',
      description: 'Contrato de servicios para exploración en el Delta',
      start_date: '2023-03-01',
      end_date: '2028-03-01',
      renewal_date: '2027-03-01',
      status: 'ACTIVE',
      operator_id: clients?.[0]?.id || null,
      government_entity: 'PDVSA',
      royalty_rate: 20.00,
      cost_recovery_limit: 70.00,
      profit_oil_split: 35.00,
      signature_bonus: 1000000.00,
      currency: 'USD',
      total_value: 75000000.00,
      terms_summary: 'Contrato de servicios con compensación por barril',
      special_conditions: 'Bonificación por descubrimiento comercial',
      termination_clause: 'Terminación automática si no hay descubrimiento en 5 años',
      dispute_resolution: 'Arbitraje ICC',
      governing_law: 'Leyes de Venezuela',
      signed_date: '2023-02-20',
      effective_date: '2023-03-01',
      notes: 'Contrato exploratorio de alto riesgo',
      created_by: adminUser.id,
    },
    {
      id: uuidv4(),
      code: 'CTR-2024-0002',
      name: 'Concesión Histórica - Campo Tradicional',
      type: 'CONCESSION',
      description: 'Concesión histórica para campo maduro',
      start_date: '2015-01-01',
      end_date: '2035-01-01',
      renewal_date: null,
      status: 'ACTIVE',
      operator_id: null,
      government_entity: 'MENPET',
      royalty_rate: 33.33,
      cost_recovery_limit: 40.00,
      profit_oil_split: 30.00,
      signature_bonus: 0,
      currency: 'USD',
      total_value: 100000000.00,
      terms_summary: 'Concesión tradicional con términos estándar',
      special_conditions: 'Obligación de mantener producción mínima',
      termination_clause: 'Reversión al estado al vencimiento',
      dispute_resolution: 'Tribunales venezolanos',
      governing_law: 'Leyes de Venezuela',
      signed_date: '2014-12-15',
      effective_date: '2015-01-01',
      notes: 'Campo maduro con producción estable',
      created_by: adminUser.id,
    },
  ]);
  
  console.log(`  ✅ Created ${contracts.length} contracts`);
  
  // Link concessions to contracts
  await concessions[0].update({ contract_id: contracts[0].id });
  await concessions[1].update({ contract_id: contracts[1].id });
  await concessions[2].update({ contract_id: contracts[2].id });
  
  // Create Contract Parties
  const parties = await ContractParty.bulkCreate([
    // PSA Contract parties
    {
      id: uuidv4(),
      contract_id: contracts[0].id,
      party_type: 'OPERATOR',
      party_name: 'Petrolera Nacional S.A.',
      client_id: clients?.[0]?.id || null,
      working_interest: 40.00,
      cost_bearing_interest: 40.00,
      revenue_interest: 40.00,
      is_operator: true,
      contact_name: 'Carlos Mendoza',
      contact_email: 'cmendoza@petroleranacional.com',
      contact_phone: '+58 212 555 1234',
      tax_id: 'J-12345678-9',
      effective_date: '2020-01-15',
      status: 'ACTIVE',
    },
    {
      id: uuidv4(),
      contract_id: contracts[0].id,
      party_type: 'GOVERNMENT',
      party_name: 'PDVSA',
      working_interest: 60.00,
      cost_bearing_interest: 60.00,
      revenue_interest: 60.00,
      is_operator: false,
      contact_name: 'María González',
      contact_email: 'mgonzalez@pdvsa.com',
      contact_phone: '+58 212 555 5678',
      tax_id: 'G-20000001-0',
      effective_date: '2020-01-15',
      status: 'ACTIVE',
    },
    // JOA Contract parties
    {
      id: uuidv4(),
      contract_id: contracts[1].id,
      party_type: 'OPERATOR',
      party_name: 'Operadora del Lago C.A.',
      client_id: clients?.[1]?.id || null,
      working_interest: 35.00,
      cost_bearing_interest: 35.00,
      revenue_interest: 35.00,
      is_operator: true,
      contact_name: 'Roberto Pérez',
      contact_email: 'rperez@operadoralago.com',
      contact_phone: '+58 261 555 9999',
      tax_id: 'J-98765432-1',
      effective_date: '2021-06-01',
      status: 'ACTIVE',
    },
    {
      id: uuidv4(),
      contract_id: contracts[1].id,
      party_type: 'PARTNER',
      party_name: 'Energy Partners International',
      working_interest: 25.00,
      cost_bearing_interest: 25.00,
      revenue_interest: 25.00,
      is_operator: false,
      contact_name: 'John Smith',
      contact_email: 'jsmith@energypartners.com',
      contact_phone: '+1 713 555 1234',
      tax_id: 'US-123456789',
      effective_date: '2021-06-01',
      status: 'ACTIVE',
    },
    {
      id: uuidv4(),
      contract_id: contracts[1].id,
      party_type: 'NOC',
      party_name: 'CVP (Corporación Venezolana del Petróleo)',
      working_interest: 40.00,
      cost_bearing_interest: 40.00,
      revenue_interest: 40.00,
      is_operator: false,
      contact_name: 'Ana Rodríguez',
      contact_email: 'arodriguez@cvp.gob.ve',
      contact_phone: '+58 212 555 4321',
      tax_id: 'G-20000002-0',
      effective_date: '2021-06-01',
      status: 'ACTIVE',
    },
  ]);
  
  console.log(`  ✅ Created ${parties.length} contract parties`);
  
  // Create Working Interests for specific assets
  if (fields.length > 0) {
    const workingInterests = await WorkingInterest.bulkCreate([
      {
        id: uuidv4(),
        contract_id: contracts[0].id,
        party_id: parties[0].id,
        asset_type: 'FIELD',
        field_id: fields[0].id,
        working_interest: 40.00,
        net_revenue_interest: 28.00,
        cost_bearing_interest: 40.00,
        effective_date: '2020-01-15',
        status: 'ACTIVE',
        created_by: adminUser.id,
      },
      {
        id: uuidv4(),
        contract_id: contracts[0].id,
        party_id: parties[1].id,
        asset_type: 'FIELD',
        field_id: fields[0].id,
        working_interest: 60.00,
        net_revenue_interest: 42.00,
        cost_bearing_interest: 60.00,
        effective_date: '2020-01-15',
        status: 'ACTIVE',
        created_by: adminUser.id,
      },
    ]);
    
    console.log(`  ✅ Created ${workingInterests.length} working interests`);
  }
  
  // Create Royalty Payments
  const currentYear = new Date().getFullYear();
  const royaltyPayments = [];
  
  for (let month = 1; month <= 12; month++) {
    const oilProduction = Math.floor(Math.random() * 50000) + 100000;
    const gasProduction = Math.floor(Math.random() * 100000) + 200000;
    const oilPrice = 70 + Math.random() * 20;
    const gasPrice = 3 + Math.random() * 2;
    const productionValue = (oilProduction * oilPrice) + (gasProduction * gasPrice);
    const royaltyAmount = productionValue * 0.30;
    
    royaltyPayments.push({
      id: uuidv4(),
      contract_id: contracts[0].id,
      period_month: month,
      period_year: currentYear,
      field_id: fields[0]?.id || null,
      production_oil_bbl: oilProduction,
      production_gas_mcf: gasProduction,
      oil_price: oilPrice.toFixed(2),
      gas_price: gasPrice.toFixed(2),
      production_value: productionValue.toFixed(2),
      royalty_rate: 30.00,
      royalty_amount: royaltyAmount.toFixed(2),
      currency: 'USD',
      due_date: new Date(currentYear, month, 15),
      payment_date: month <= new Date().getMonth() ? new Date(currentYear, month - 1, 20) : null,
      payment_reference: month <= new Date().getMonth() ? `PAY-${currentYear}-${String(month).padStart(2, '0')}` : null,
      government_receipt: month <= new Date().getMonth() ? `REC-MENPET-${currentYear}-${String(month).padStart(2, '0')}` : null,
      status: month <= new Date().getMonth() ? 'PAID' : (month === new Date().getMonth() + 1 ? 'PENDING' : 'CALCULATED'),
      calculated_by: adminUser.id,
      paid_by: month <= new Date().getMonth() ? adminUser.id : null,
    });
  }
  
  await RoyaltyPayment.bulkCreate(royaltyPayments);
  console.log(`  ✅ Created ${royaltyPayments.length} royalty payments`);
  
  console.log('✅ Contracts seeding completed');
  
  return { contracts, concessions, parties };
};

module.exports = { seedContracts };
