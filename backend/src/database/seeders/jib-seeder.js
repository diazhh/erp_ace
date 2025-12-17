const { v4: uuidv4 } = require('uuid');

const seedJIB = async (models) => {
  const { 
    JointInterestBilling, JIBLineItem, JIBPartnerShare, CashCall, CashCallResponse,
    OGContract, ContractParty, AFE, User
  } = models;

  console.log('🔄 Seeding JIB module...');

  // Get references
  const adminUser = await User.findOne({ where: { username: 'admin' } });
  const contracts = await OGContract.findAll({ limit: 3 });
  const afes = await AFE.findAll({ limit: 3 });

  if (!contracts.length) {
    console.log('  ⚠️ No contracts found, skipping JIB seeder');
    return;
  }

  const userId = adminUser?.id;
  const contractId = contracts[0]?.id;

  // Get parties for this contract
  const parties = await ContractParty.findAll({ where: { contract_id: contractId } });

  // Helper for dates
  const today = new Date();
  const addDays = (days) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };
  const subtractDays = (days) => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date;
  };

  // ========== JOINT INTEREST BILLINGS ==========
  const jibs = [
    {
      id: uuidv4(),
      code: 'JIB-2025-01-0001',
      contract_id: contractId,
      billing_period_month: 1,
      billing_period_year: 2025,
      description: 'Facturación de costos operativos enero 2025',
      status: 'DRAFT',
      total_costs: 150000.00,
      operator_share: 60000.00,
      partners_share: 90000.00,
      currency: 'USD',
      due_date: addDays(30),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'JIB-2024-12-0001',
      contract_id: contractId,
      billing_period_month: 12,
      billing_period_year: 2024,
      description: 'Facturación de costos operativos diciembre 2024',
      status: 'SENT',
      total_costs: 185000.00,
      operator_share: 74000.00,
      partners_share: 111000.00,
      currency: 'USD',
      due_date: subtractDays(5),
      sent_date: subtractDays(25),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'JIB-2024-11-0001',
      contract_id: contractId,
      billing_period_month: 11,
      billing_period_year: 2024,
      description: 'Facturación de costos operativos noviembre 2024',
      status: 'PAID',
      total_costs: 142000.00,
      operator_share: 56800.00,
      partners_share: 85200.00,
      currency: 'USD',
      due_date: subtractDays(35),
      sent_date: subtractDays(55),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'JIB-2024-10-0001',
      contract_id: contractId,
      billing_period_month: 10,
      billing_period_year: 2024,
      description: 'Facturación de costos operativos octubre 2024 - Incluye workover',
      status: 'PARTIALLY_PAID',
      total_costs: 320000.00,
      operator_share: 128000.00,
      partners_share: 192000.00,
      currency: 'USD',
      due_date: subtractDays(65),
      sent_date: subtractDays(85),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'JIB-2024-09-0001',
      contract_id: contractId,
      billing_period_month: 9,
      billing_period_year: 2024,
      description: 'Facturación de costos operativos septiembre 2024',
      status: 'DISPUTED',
      total_costs: 175000.00,
      operator_share: 70000.00,
      partners_share: 105000.00,
      currency: 'USD',
      due_date: subtractDays(95),
      sent_date: subtractDays(115),
      created_by: userId,
    },
  ];

  const createdJIBs = [];
  for (const jib of jibs) {
    const [created] = await JointInterestBilling.findOrCreate({ 
      where: { code: jib.code }, 
      defaults: jib 
    });
    createdJIBs.push(created);
  }
  console.log(`  ✅ ${jibs.length} JIBs created`);

  // ========== JIB LINE ITEMS ==========
  const costCategories = ['DRILLING', 'COMPLETION', 'OPERATIONS', 'PRODUCTION', 'MAINTENANCE', 'G&A', 'TRANSPORTATION'];
  
  for (const jib of createdJIBs) {
    const itemCount = Math.floor(Math.random() * 5) + 3; // 3-7 items per JIB
    
    for (let i = 0; i < itemCount; i++) {
      const category = costCategories[Math.floor(Math.random() * costCategories.length)];
      const amount = Math.floor(Math.random() * 50000) + 5000;
      
      await JIBLineItem.findOrCreate({
        where: { jib_id: jib.id, description: `${category} - Item ${i + 1}` },
        defaults: {
          id: uuidv4(),
          jib_id: jib.id,
          cost_category: category,
          description: `${category} - Costo operativo ${i + 1}`,
          amount: amount,
          quantity: Math.floor(Math.random() * 10) + 1,
          unit_price: amount / (Math.floor(Math.random() * 10) + 1),
          afe_id: afes[0]?.id || null,
          invoice_reference: `INV-${jib.billing_period_year}-${String(jib.billing_period_month).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
          invoice_date: subtractDays(Math.floor(Math.random() * 30)),
          vendor_name: ['Schlumberger', 'Halliburton', 'Baker Hughes', 'Weatherford', 'NOV'][Math.floor(Math.random() * 5)],
          is_billable: true,
        },
      });
    }
  }
  console.log(`  ✅ JIB line items created`);

  // ========== JIB PARTNER SHARES ==========
  if (parties.length > 0) {
    for (const jib of createdJIBs) {
      for (const party of parties) {
        const shareAmount = (parseFloat(party.working_interest || 25) / 100) * parseFloat(jib.total_costs);
        const isPaid = ['PAID'].includes(jib.status);
        const isPartiallyPaid = ['PARTIALLY_PAID'].includes(jib.status);
        const isDisputed = ['DISPUTED'].includes(jib.status);
        
        let status = 'PENDING';
        if (jib.status === 'SENT') status = 'INVOICED';
        if (isPaid) status = 'PAID';
        if (isPartiallyPaid) status = Math.random() > 0.5 ? 'PAID' : 'INVOICED';
        if (isDisputed && Math.random() > 0.7) status = 'DISPUTED';

        await JIBPartnerShare.findOrCreate({
          where: { jib_id: jib.id, party_id: party.id },
          defaults: {
            id: uuidv4(),
            jib_id: jib.id,
            party_id: party.id,
            working_interest: party.working_interest || 25,
            share_amount: shareAmount,
            status: status,
            invoice_number: status !== 'PENDING' ? `INV-JIB-${jib.code.split('-').slice(1).join('-')}-${party.party_name?.substring(0, 3).toUpperCase() || 'PTY'}` : null,
            invoice_date: status !== 'PENDING' ? subtractDays(Math.floor(Math.random() * 20)) : null,
            payment_date: status === 'PAID' ? subtractDays(Math.floor(Math.random() * 10)) : null,
            payment_reference: status === 'PAID' ? `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}` : null,
            payment_amount: status === 'PAID' ? shareAmount : null,
            dispute_reason: status === 'DISPUTED' ? 'Discrepancia en costos de G&A - Solicita documentación soporte' : null,
            dispute_date: status === 'DISPUTED' ? subtractDays(Math.floor(Math.random() * 30)) : null,
          },
        });
      }
    }
    console.log(`  ✅ JIB partner shares created`);
  }

  // ========== CASH CALLS ==========
  const cashCalls = [
    {
      id: uuidv4(),
      code: 'CC-2025-0001',
      contract_id: contractId,
      purpose: 'OPERATIONS',
      title: 'Cash Call Q1 2025 - Operaciones',
      description: 'Solicitud de fondos para operaciones del primer trimestre 2025',
      afe_id: afes[0]?.id || null,
      total_amount: 500000.00,
      funded_amount: 0,
      currency: 'USD',
      call_date: today,
      due_date: addDays(30),
      status: 'DRAFT',
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'CC-2024-0012',
      contract_id: contractId,
      purpose: 'AFE',
      title: 'Cash Call AFE Workover Pozo-15',
      description: 'Solicitud de fondos para workover aprobado en AFE-2024-0045',
      afe_id: afes[0]?.id || null,
      total_amount: 750000.00,
      funded_amount: 450000.00,
      currency: 'USD',
      call_date: subtractDays(45),
      due_date: subtractDays(15),
      status: 'PARTIALLY_FUNDED',
      sent_date: subtractDays(40),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'CC-2024-0011',
      contract_id: contractId,
      purpose: 'OPERATIONS',
      title: 'Cash Call Q4 2024 - Operaciones',
      description: 'Solicitud de fondos para operaciones del cuarto trimestre 2024',
      total_amount: 450000.00,
      funded_amount: 450000.00,
      currency: 'USD',
      call_date: subtractDays(90),
      due_date: subtractDays(60),
      status: 'FUNDED',
      sent_date: subtractDays(85),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'CC-2024-0010',
      contract_id: contractId,
      purpose: 'CAPITAL',
      title: 'Cash Call Facilidades de Superficie',
      description: 'Solicitud de fondos para mejoras en facilidades de superficie',
      total_amount: 1200000.00,
      funded_amount: 1200000.00,
      currency: 'USD',
      call_date: subtractDays(180),
      due_date: subtractDays(150),
      status: 'FUNDED',
      sent_date: subtractDays(175),
      created_by: userId,
    },
    {
      id: uuidv4(),
      code: 'CC-2024-0009',
      contract_id: contractId,
      purpose: 'EMERGENCY',
      title: 'Cash Call Emergencia - Reparación Línea de Flujo',
      description: 'Solicitud urgente de fondos para reparación de línea de flujo dañada',
      total_amount: 180000.00,
      funded_amount: 180000.00,
      currency: 'USD',
      call_date: subtractDays(120),
      due_date: subtractDays(113),
      status: 'FUNDED',
      sent_date: subtractDays(119),
      created_by: userId,
    },
  ];

  const createdCashCalls = [];
  for (const cc of cashCalls) {
    const [created] = await CashCall.findOrCreate({ 
      where: { code: cc.code }, 
      defaults: cc 
    });
    createdCashCalls.push(created);
  }
  console.log(`  ✅ ${cashCalls.length} Cash Calls created`);

  // ========== CASH CALL RESPONSES ==========
  if (parties.length > 0) {
    for (const cc of createdCashCalls) {
      for (const party of parties) {
        const requestedAmount = (parseFloat(party.working_interest || 25) / 100) * parseFloat(cc.total_amount);
        const isFunded = cc.status === 'FUNDED';
        const isPartiallyFunded = cc.status === 'PARTIALLY_FUNDED';
        
        let status = 'PENDING';
        let fundedAmount = 0;
        
        if (isFunded) {
          status = 'FUNDED';
          fundedAmount = requestedAmount;
        } else if (isPartiallyFunded) {
          // Some parties funded, some not
          if (Math.random() > 0.4) {
            status = 'FUNDED';
            fundedAmount = requestedAmount;
          } else if (Math.random() > 0.5) {
            status = 'PARTIAL';
            fundedAmount = requestedAmount * 0.6;
          }
        }

        await CashCallResponse.findOrCreate({
          where: { cash_call_id: cc.id, party_id: party.id },
          defaults: {
            id: uuidv4(),
            cash_call_id: cc.id,
            party_id: party.id,
            working_interest: party.working_interest || 25,
            requested_amount: requestedAmount,
            funded_amount: fundedAmount,
            funded_date: fundedAmount > 0 ? subtractDays(Math.floor(Math.random() * 20)) : null,
            payment_reference: fundedAmount > 0 ? `WIRE-${Date.now()}-${Math.floor(Math.random() * 1000)}` : null,
            bank_reference: fundedAmount > 0 ? `BNK-REF-${Math.floor(Math.random() * 100000)}` : null,
            status: status,
          },
        });
      }
    }
    console.log(`  ✅ Cash Call responses created`);
  }

  console.log('✅ JIB module seeded successfully!');
};

module.exports = seedJIB;
