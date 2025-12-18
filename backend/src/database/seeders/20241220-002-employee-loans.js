'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Get employees
    const [employees] = await queryInterface.sequelize.query(
      `SELECT id, first_name, last_name, base_salary FROM employees WHERE status = 'ACTIVE' LIMIT 10`
    );

    // Get admin user
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE username = 'admin' LIMIT 1`
    );
    const adminId = users.length > 0 ? users[0].id : null;

    if (employees.length === 0) {
      console.log('No employees found, skipping loans seeder');
      return;
    }

    const loans = [];
    const loanPayments = [];

    const loanTypes = ['PERSONAL', 'ADVANCE', 'EMERGENCY', 'OTHER'];
    const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'PAID', 'PAUSED'];

    employees.slice(0, 5).forEach((emp, index) => {
      const loanId = uuidv4();
      const loanType = loanTypes[index % loanTypes.length];
      const status = statuses[index % statuses.length];
      const amount = (index + 1) * 500; // 500, 1000, 1500, 2000, 2500
      const installments = (index + 1) * 3; // 3, 6, 9, 12, 15
      const installmentAmount = Math.round((amount / installments) * 100) / 100;
      const paidInstallments = status === 'PAID' ? installments : Math.floor(installments / 2);
      const remainingAmount = status === 'PAID' ? 0 : amount - (paidInstallments * installmentAmount);

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - paidInstallments);
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + installments);

      loans.push({
        id: loanId,
        code: `LOAN-${String(index + 1).padStart(4, '0')}`,
        employee_id: emp.id,
        loan_type: loanType,
        description: `${loanType === 'PERSONAL' ? 'Préstamo personal para gastos varios' : 
                  loanType === 'ADVANCE' ? 'Adelanto de nómina' :
                  loanType === 'EMERGENCY' ? 'Emergencia médica familiar' :
                  'Otros gastos'}`,
        amount: amount,
        currency: 'USD',
        total_installments: installments,
        installment_amount: installmentAmount,
        paid_installments: paidInstallments,
        remaining_amount: remainingAmount,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: status,
        approved_by: status !== 'PAUSED' ? adminId : null,
        approved_at: status !== 'PAUSED' ? now : null,
        notes: null,
        created_by: adminId,
        created_at: now,
        updated_at: now,
      });

      // Create payment records for paid installments
      if (status !== 'PAUSED' && paidInstallments > 0) {
        for (let i = 0; i < paidInstallments; i++) {
          const paymentDate = new Date(startDate);
          paymentDate.setMonth(paymentDate.getMonth() + i);

          loanPayments.push({
            id: uuidv4(),
            loan_id: loanId,
            installment_number: i + 1,
            amount: installmentAmount,
            currency: 'USD',
            payment_date: paymentDate.toISOString().split('T')[0],
            payment_method: 'PAYROLL_DEDUCTION',
            reference: null,
            notes: `Cuota ${i + 1} de ${installments}`,
            created_at: now,
            updated_at: now,
          });
        }
      }
    });

    if (loans.length > 0) {
      await queryInterface.bulkInsert('employee_loans', loans);
      console.log(`Created ${loans.length} employee loans`);
    }

    if (loanPayments.length > 0) {
      await queryInterface.bulkInsert('loan_payments', loanPayments);
      console.log(`Created ${loanPayments.length} loan payments`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('loan_payments', null, {});
    await queryInterface.bulkDelete('employee_loans', null, {});
  }
};
