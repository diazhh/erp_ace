const request = require('supertest');
const app = require('../../../app');
const db = require('../../../database/models');
const { setupTestDatabase, teardownTestDatabase, createTestEmployee } = require('../../../../tests/helpers/db.helper');
const { loginAs, authHeader, expectErrorResponse } = require('../../../../tests/helpers/auth.helper');

describe('Payroll API Tests', () => {
  let tokens = {};
  let testEmployee;

  beforeAll(async () => {
    await setupTestDatabase();

    // Login usuarios de prueba
    tokens.superadmin = await loginAs('superadmin');
    tokens.gerenteGeneral = await loginAs('gerente.general');
    tokens.contador = await loginAs('contador');
    tokens.jefeRRHH = await loginAs('jefe.rrhh');
    tokens.gerenteOps = await loginAs('gerente.ops');
    tokens.supervisor = await loginAs('supervisor.proyecto');
    tokens.empleado = await loginAs('empleado.regular');
    tokens.sinPermisos = await loginAs('sin.permisos');

    // Crear empleado de prueba
    testEmployee = await createTestEmployee({
      firstName: 'Juan',
      lastName: 'Test',
      idType: 'V',
      idNumber: '99999999',
      baseSalary: 2000,
      bonuses: 300
    });
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await db.PayrollEntry.destroy({ where: {}, force: true });
    await db.PayrollPeriod.destroy({ where: {}, force: true });
    await db.EmployeeLoan.destroy({ where: {}, force: true });
  });

  // ==================== POST /api/payroll/periods ====================

  describe('POST /api/payroll/periods', () => {
    it('debe crear período de nómina (superadmin)', async () => {
      const response = await request(app)
        .post('/api/payroll/periods')
        .set(authHeader(tokens.superadmin))
        .send({
          periodCode: 'NOM-2025-01',
          periodType: 'MONTHLY',
          startDate: '2025-01-01',
          endDate: '2025-01-31'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.periodCode).toBe('NOM-2025-01');
    });

    it('debe crear período de nómina (jefe RRHH)', async () => {
      const response = await request(app)
        .post('/api/payroll/periods')
        .set(authHeader(tokens.jefeRRHH))
        .send({
          periodCode: 'NOM-2025-02',
          periodType: 'MONTHLY',
          startDate: '2025-02-01',
          endDate: '2025-02-28'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('debe crear período quincenal con código correcto', async () => {
      const response = await request(app)
        .post('/api/payroll/periods')
        .set(authHeader(tokens.superadmin))
        .send({
          periodCode: 'NOM-2025-01-Q1',
          periodType: 'BIWEEKLY',
          startDate: '2025-01-01',
          endDate: '2025-01-15'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.periodType).toBe('BIWEEKLY');
      expect(response.body.data.periodCode).toBe('NOM-2025-01-Q1');
    });

    it('debe rechazar período con datos inválidos', async () => {
      const response = await request(app)
        .post('/api/payroll/periods')
        .set(authHeader(tokens.superadmin))
        .send({
          periodCode: '', // Vacío
          periodType: 'MONTHLY',
          startDate: '2025-01-01',
          endDate: '2025-01-31'
        });

      expectErrorResponse(response, 400);
    });

    it('debe rechazar período con fecha fin anterior a inicio', async () => {
      const response = await request(app)
        .post('/api/payroll/periods')
        .set(authHeader(tokens.superadmin))
        .send({
          periodCode: 'NOM-2025-01',
          periodType: 'MONTHLY',
          startDate: '2025-01-31',
          endDate: '2025-01-01' // Fin antes de inicio
        });

      expectErrorResponse(response, 400);
    });

    it('NO debe permitir crear (empleado regular)', async () => {
      const response = await request(app)
        .post('/api/payroll/periods')
        .set(authHeader(tokens.empleado))
        .send({
          periodCode: 'NOM-2025-01',
          periodType: 'MONTHLY',
          startDate: '2025-01-01',
          endDate: '2025-01-31'
        });

      expectErrorResponse(response, 403);
    });

    it('NO debe permitir crear (sin permisos)', async () => {
      const response = await request(app)
        .post('/api/payroll/periods')
        .set(authHeader(tokens.sinPermisos))
        .send({
          periodCode: 'NOM-2025-01',
          periodType: 'MONTHLY',
          startDate: '2025-01-01',
          endDate: '2025-01-31'
        });

      expectErrorResponse(response, 403);
    });
  });

  // ==================== GET /api/payroll/periods ====================

  describe('GET /api/payroll/periods', () => {
    beforeEach(async () => {
      await db.PayrollPeriod.bulkCreate([
        {
          periodCode: 'NOM-2025-01',
          periodType: 'MONTHLY',
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-31'),
          status: 'DRAFT'
        },
        {
          periodCode: 'NOM-2025-02',
          periodType: 'MONTHLY',
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-02-28'),
          status: 'APPROVED'
        },
        {
          periodCode: 'NOM-2025-03',
          periodType: 'MONTHLY',
          startDate: new Date('2025-03-01'),
          endDate: new Date('2025-03-31'),
          status: 'PAID'
        }
      ]);
    });

    it('debe listar todos los períodos (superadmin)', async () => {
      const response = await request(app)
        .get('/api/payroll/periods')
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.periods).toHaveLength(3);
    });

    it('debe listar períodos (contador)', async () => {
      const response = await request(app)
        .get('/api/payroll/periods')
        .set(authHeader(tokens.contador));

      expect(response.status).toBe(200);
      expect(response.body.data.periods.length).toBeGreaterThan(0);
    });

    it('debe filtrar por estado DRAFT', async () => {
      const response = await request(app)
        .get('/api/payroll/periods?status=DRAFT')
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      const draftPeriods = response.body.data.periods.filter(p => p.status === 'DRAFT');
      expect(draftPeriods).toHaveLength(1);
    });

    it('debe filtrar por tipo MONTHLY', async () => {
      const response = await request(app)
        .get('/api/payroll/periods?periodType=MONTHLY')
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      response.body.data.periods.forEach(period => {
        expect(period.periodType).toBe('MONTHLY');
      });
    });

    it('debe paginar resultados', async () => {
      const response = await request(app)
        .get('/api/payroll/periods?page=1&limit=2')
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      expect(response.body.data.periods.length).toBeLessThanOrEqual(2);
    });

    it('NO debe permitir listar (sin permisos)', async () => {
      const response = await request(app)
        .get('/api/payroll/periods')
        .set(authHeader(tokens.sinPermisos));

      expectErrorResponse(response, 403);
    });
  });

  // ==================== GET /api/payroll/periods/:id ====================

  describe('GET /api/payroll/periods/:id', () => {
    let periodId;

    beforeEach(async () => {
      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });
      periodId = period.id;
    });

    it('debe obtener período por ID (superadmin)', async () => {
      const response = await request(app)
        .get(`/api/payroll/periods/${periodId}`)
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(periodId);
      expect(response.body.data.periodCode).toBe('NOM-2025-01');
    });

    it('debe obtener período por ID (jefe RRHH)', async () => {
      const response = await request(app)
        .get(`/api/payroll/periods/${periodId}`)
        .set(authHeader(tokens.jefeRRHH));

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(periodId);
    });

    it('debe retornar 404 si período no existe', async () => {
      const response = await request(app)
        .get('/api/payroll/periods/99999')
        .set(authHeader(tokens.superadmin));

      expectErrorResponse(response, 404);
    });

    it('NO debe permitir ver (sin permisos)', async () => {
      const response = await request(app)
        .get(`/api/payroll/periods/${periodId}`)
        .set(authHeader(tokens.sinPermisos));

      expectErrorResponse(response, 403);
    });
  });

  // ==================== POST /api/payroll/periods/:id/generate ====================

  describe('POST /api/payroll/periods/:id/generate', () => {
    let periodId;

    beforeEach(async () => {
      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });
      periodId = period.id;
    });

    it('debe generar entradas de nómina (superadmin)', async () => {
      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/generate`)
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.entriesGenerated).toBeGreaterThan(0);
    });

    it('debe generar entradas de nómina (jefe RRHH)', async () => {
      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/generate`)
        .set(authHeader(tokens.jefeRRHH));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('NO debe permitir generar (empleado)', async () => {
      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/generate`)
        .set(authHeader(tokens.empleado));

      expectErrorResponse(response, 403);
    });
  });

  // ==================== POST /api/payroll/periods/:id/approve ====================

  describe('POST /api/payroll/periods/:id/approve', () => {
    let periodId;

    beforeEach(async () => {
      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });
      periodId = period.id;
    });

    it('debe aprobar período (superadmin)', async () => {
      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/approve`)
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('APPROVED');
    });

    it('debe aprobar período (gerente general)', async () => {
      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/approve`)
        .set(authHeader(tokens.gerenteGeneral));

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('APPROVED');
    });

    it('NO debe aprobar período ya aprobado', async () => {
      await db.PayrollPeriod.update(
        { status: 'APPROVED' },
        { where: { id: periodId } }
      );

      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/approve`)
        .set(authHeader(tokens.superadmin));

      expectErrorResponse(response, 400);
    });

    it('NO debe permitir aprobar (empleado)', async () => {
      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/approve`)
        .set(authHeader(tokens.empleado));

      expectErrorResponse(response, 403);
    });

    it('NO debe permitir aprobar (sin permiso payroll:approve)', async () => {
      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/approve`)
        .set(authHeader(tokens.sinPermisos));

      expectErrorResponse(response, 403);
    });
  });

  // ==================== POST /api/payroll/periods/:id/pay ====================

  describe('POST /api/payroll/periods/:id/pay', () => {
    let periodId;

    beforeEach(async () => {
      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'APPROVED'
      });
      periodId = period.id;
    });

    it('debe marcar como pagado (superadmin)', async () => {
      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/pay`)
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('PAID');
    });

    it('debe marcar como pagado (contador)', async () => {
      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/pay`)
        .set(authHeader(tokens.contador));

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('PAID');
    });

    it('NO debe marcar como pagado si no está aprobado', async () => {
      await db.PayrollPeriod.update(
        { status: 'DRAFT' },
        { where: { id: periodId } }
      );

      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/pay`)
        .set(authHeader(tokens.superadmin));

      expectErrorResponse(response, 400);
    });

    it('NO debe permitir marcar como pagado (empleado)', async () => {
      const response = await request(app)
        .post(`/api/payroll/periods/${periodId}/pay`)
        .set(authHeader(tokens.empleado));

      expectErrorResponse(response, 403);
    });
  });

  // ==================== PUT /api/payroll/periods/:id ====================

  describe('PUT /api/payroll/periods/:id', () => {
    let periodId;

    beforeEach(async () => {
      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });
      periodId = period.id;
    });

    it('debe actualizar período (superadmin)', async () => {
      const response = await request(app)
        .put(`/api/payroll/periods/${periodId}`)
        .set(authHeader(tokens.superadmin))
        .send({
          periodCode: 'NOM-2025-01-UPDATED'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.periodCode).toBe('NOM-2025-01-UPDATED');
    });

    it('debe actualizar período (jefe RRHH)', async () => {
      const response = await request(app)
        .put(`/api/payroll/periods/${periodId}`)
        .set(authHeader(tokens.jefeRRHH))
        .send({
          periodCode: 'NOM-2025-01-MOD'
        });

      expect(response.status).toBe(200);
    });

    it('NO debe permitir actualizar (empleado)', async () => {
      const response = await request(app)
        .put(`/api/payroll/periods/${periodId}`)
        .set(authHeader(tokens.empleado))
        .send({
          periodCode: 'NOM-2025-01-HACK'
        });

      expectErrorResponse(response, 403);
    });
  });

  // ==================== DELETE /api/payroll/periods/:id ====================

  describe('DELETE /api/payroll/periods/:id', () => {
    let periodId;

    beforeEach(async () => {
      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });
      periodId = period.id;
    });

    it('debe eliminar período (superadmin)', async () => {
      const response = await request(app)
        .delete(`/api/payroll/periods/${periodId}`)
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
    });

    it('NO debe eliminar período aprobado', async () => {
      await db.PayrollPeriod.update(
        { status: 'APPROVED' },
        { where: { id: periodId } }
      );

      const response = await request(app)
        .delete(`/api/payroll/periods/${periodId}`)
        .set(authHeader(tokens.superadmin));

      expectErrorResponse(response, 400);
    });

    it('NO debe permitir eliminar (empleado)', async () => {
      const response = await request(app)
        .delete(`/api/payroll/periods/${periodId}`)
        .set(authHeader(tokens.empleado));

      expectErrorResponse(response, 403);
    });
  });

  // ==================== EMPLOYEE LOANS ====================

  describe('POST /api/payroll/loans', () => {
    it('debe crear préstamo (superadmin)', async () => {
      const response = await request(app)
        .post('/api/payroll/loans')
        .set(authHeader(tokens.superadmin))
        .send({
          employeeId: testEmployee.id,
          loanAmount: 1000,
          interestRate: 10,
          installments: 10,
          description: 'Préstamo personal'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.loanAmount).toBe(1000);
      expect(response.body.data.status).toBe('PENDING');
    });

    it('debe crear préstamo (jefe RRHH)', async () => {
      const response = await request(app)
        .post('/api/payroll/loans')
        .set(authHeader(tokens.jefeRRHH))
        .send({
          employeeId: testEmployee.id,
          loanAmount: 500,
          interestRate: 0,
          installments: 5,
          description: 'Anticipo'
        });

      expect(response.status).toBe(201);
    });

    it('NO debe permitir crear préstamo (empleado)', async () => {
      const response = await request(app)
        .post('/api/payroll/loans')
        .set(authHeader(tokens.empleado))
        .send({
          employeeId: testEmployee.id,
          loanAmount: 1000,
          interestRate: 10,
          installments: 10
        });

      expectErrorResponse(response, 403);
    });
  });

  describe('GET /api/payroll/loans', () => {
    beforeEach(async () => {
      await db.EmployeeLoan.bulkCreate([
        {
          employeeId: testEmployee.id,
          loanAmount: 1000,
          interestRate: 10,
          installments: 10,
          installmentAmount: 110,
          paidAmount: 0,
          remainingBalance: 1100,
          status: 'PENDING'
        },
        {
          employeeId: testEmployee.id,
          loanAmount: 500,
          interestRate: 0,
          installments: 5,
          installmentAmount: 100,
          paidAmount: 0,
          remainingBalance: 500,
          status: 'ACTIVE'
        }
      ]);
    });

    it('debe listar préstamos (superadmin)', async () => {
      const response = await request(app)
        .get('/api/payroll/loans')
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      expect(response.body.data.loans).toHaveLength(2);
    });

    it('debe filtrar por estado ACTIVE', async () => {
      const response = await request(app)
        .get('/api/payroll/loans?status=ACTIVE')
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      const activeLoans = response.body.data.loans.filter(l => l.status === 'ACTIVE');
      expect(activeLoans.length).toBeGreaterThan(0);
    });

    it('NO debe permitir listar (sin permisos)', async () => {
      const response = await request(app)
        .get('/api/payroll/loans')
        .set(authHeader(tokens.sinPermisos));

      expectErrorResponse(response, 403);
    });
  });

  describe('POST /api/payroll/loans/:id/approve', () => {
    let loanId;

    beforeEach(async () => {
      const loan = await db.EmployeeLoan.create({
        employeeId: testEmployee.id,
        loanAmount: 1000,
        interestRate: 10,
        installments: 10,
        installmentAmount: 110,
        paidAmount: 0,
        remainingBalance: 1100,
        status: 'PENDING'
      });
      loanId = loan.id;
    });

    it('debe aprobar préstamo (superadmin)', async () => {
      const response = await request(app)
        .post(`/api/payroll/loans/${loanId}/approve`)
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('ACTIVE');
    });

    it('debe aprobar préstamo (gerente general)', async () => {
      const response = await request(app)
        .post(`/api/payroll/loans/${loanId}/approve`)
        .set(authHeader(tokens.gerenteGeneral));

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('ACTIVE');
    });

    it('NO debe permitir aprobar (empleado)', async () => {
      const response = await request(app)
        .post(`/api/payroll/loans/${loanId}/approve`)
        .set(authHeader(tokens.empleado));

      expectErrorResponse(response, 403);
    });
  });

  describe('POST /api/payroll/loans/:id/cancel', () => {
    let loanId;

    beforeEach(async () => {
      const loan = await db.EmployeeLoan.create({
        employeeId: testEmployee.id,
        loanAmount: 1000,
        interestRate: 10,
        installments: 10,
        installmentAmount: 110,
        paidAmount: 0,
        remainingBalance: 1100,
        status: 'PENDING'
      });
      loanId = loan.id;
    });

    it('debe cancelar préstamo (superadmin)', async () => {
      const response = await request(app)
        .post(`/api/payroll/loans/${loanId}/cancel`)
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('CANCELLED');
    });

    it('debe cancelar préstamo (jefe RRHH)', async () => {
      const response = await request(app)
        .post(`/api/payroll/loans/${loanId}/cancel`)
        .set(authHeader(tokens.jefeRRHH));

      expect(response.status).toBe(200);
    });

    it('NO debe permitir cancelar (empleado)', async () => {
      const response = await request(app)
        .post(`/api/payroll/loans/${loanId}/cancel`)
        .set(authHeader(tokens.empleado));

      expectErrorResponse(response, 403);
    });
  });

  // ==================== STATS ====================

  describe('GET /api/payroll/stats', () => {
    it('debe obtener estadísticas de nómina (superadmin)', async () => {
      const response = await request(app)
        .get('/api/payroll/stats')
        .set(authHeader(tokens.superadmin));

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('totalPeriods');
      expect(response.body.data).toHaveProperty('totalPayrollAmount');
    });

    it('debe obtener estadísticas (contador)', async () => {
      const response = await request(app)
        .get('/api/payroll/stats')
        .set(authHeader(tokens.contador));

      expect(response.status).toBe(200);
    });

    it('NO debe permitir ver stats (sin permisos)', async () => {
      const response = await request(app)
        .get('/api/payroll/stats')
        .set(authHeader(tokens.sinPermisos));

      expectErrorResponse(response, 403);
    });
  });
});
