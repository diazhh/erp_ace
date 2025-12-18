'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Get employees
    const [employees] = await queryInterface.sequelize.query(
      `SELECT id, first_name, last_name, id_number FROM employees WHERE status = 'ACTIVE' LIMIT 10`
    );

    if (employees.length === 0) {
      console.log('No employees found, skipping bank accounts seeder');
      return;
    }

    const bankAccounts = [];

    // Banks list
    const banks = [
      { code: '0102', name: 'Banco de Venezuela' },
      { code: '0134', name: 'Banesco' },
      { code: '0105', name: 'Mercantil' },
      { code: '0108', name: 'Provincial' },
      { code: '0114', name: 'Bancaribe' },
      { code: '0175', name: 'Bicentenario' },
    ];

    employees.forEach((emp, index) => {
      const bank = banks[index % banks.length];
      
      // Primary bank account
      bankAccounts.push({
        id: uuidv4(),
        employee_id: emp.id,
        account_type: index % 2 === 0 ? 'CHECKING' : 'SAVINGS',
        bank_name: bank.name,
        bank_code: bank.code,
        account_number: `${bank.code}${String(Math.floor(Math.random() * 9000000000) + 1000000000).padStart(10, '0')}`,
        account_holder: `${emp.first_name} ${emp.last_name}`,
        holder_id_type: 'V',
        holder_id_number: emp.id_number,
        currency: 'VES',
        is_primary: true,
        status: 'ACTIVE',
        payment_percentage: 100,
        created_at: now,
        updated_at: now,
      });

      // Secondary account (USD) for some employees
      if (index % 3 === 0) {
        bankAccounts.push({
          id: uuidv4(),
          employee_id: emp.id,
          account_type: 'ZELLE',
          bank_name: 'Zelle',
          zelle_email: `${emp.first_name.toLowerCase()}.${emp.last_name.toLowerCase()}@email.com`,
          account_holder: `${emp.first_name} ${emp.last_name}`,
          currency: 'USD',
          is_primary: false,
          status: 'ACTIVE',
          payment_percentage: 0,
          created_at: now,
          updated_at: now,
        });
      }

      // Pago Móvil for some employees
      if (index % 4 === 0) {
        bankAccounts.push({
          id: uuidv4(),
          employee_id: emp.id,
          account_type: 'PAGO_MOVIL',
          bank_name: bank.name,
          bank_code: bank.code,
          phone_number: `0414${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
          account_holder: `${emp.first_name} ${emp.last_name}`,
          holder_id_type: 'V',
          holder_id_number: emp.id_number,
          currency: 'VES',
          is_primary: false,
          status: 'ACTIVE',
          payment_percentage: 0,
          created_at: now,
          updated_at: now,
        });
      }
    });

    if (bankAccounts.length > 0) {
      await queryInterface.bulkInsert('employee_bank_accounts', bankAccounts);
      console.log(`Created ${bankAccounts.length} employee bank accounts`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employee_bank_accounts', null, {});
  }
};
