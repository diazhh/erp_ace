const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:5173';
const CREDENTIALS = { username: 'admin', password: 'Admin123!' };
const VIEWPORT = { width: 2560, height: 1600 };
const WAIT_TIME = 3000;

// IDs reales de la base de datos
const IDS = {
  employee: '9d950398-67d2-490b-b929-b7405d103c2c',
  payrollPeriod: 'a22863aa-be7f-45ed-bdf1-0e283531b500',
  loan: 'c292769b-d1e8-4bde-8ddb-97ba69da28cf',
  bankAccount: 'aea5e5de-6043-4482-b56b-d2eecb2e16a6',
  transaction: '19066c1e-0871-4170-9f3f-285bf9d5accc',
  pettyCash: '95a7cb13-8e70-4321-b277-c267e943163f',
  project: '1b23d58e-c5f4-47dd-b74a-b961a4ddf81f',
  item: '873cf864-9571-4e30-826d-bf0243b4ef94',
  warehouse: '5eafdf06-9680-4e45-8834-96ddaaa84518',
  vehicle: '416995c5-c05b-4864-a225-18e25d83ee02',
  purchaseOrder: '2fbdafe8-10ff-485f-b714-8b3772c178b4',
  incident: '8c2c818e-554b-46b5-a573-f2d34b9805b6',
  user: '9700b308-f841-4193-96e5-42e665c4b969',
  well: 'c205afac-3007-40c4-b720-57e03a84e95d',
  afe: '4e59e489-c33c-43c4-b83e-2a8315f4b8ba',
  contract: '7d123fe5-a94b-4d37-90ae-06b782202687',
};

const wait = (ms) => new Promise(r => setTimeout(r, ms));

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const screenshot = async (page, dir, filename) => {
  ensureDir(dir);
  const filepath = path.join(dir, filename);
  await page.screenshot({ path: filepath });
  console.log(`  ✓ ${filename}`);
};

const login = async (page) => {
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(1000);
  await page.type('input[name="username"]', CREDENTIALS.username);
  await page.type('input[name="password"]', CREDENTIALS.password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
  await wait(WAIT_TIME);
};

const clickTab = async (page, index) => {
  try {
    const tabs = await page.$$('[role="tab"]');
    if (tabs[index]) {
      await tabs[index].click();
      await wait(2000);
      return true;
    }
  } catch (e) {}
  return false;
};

const navigateTo = async (page, url) => {
  try {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(WAIT_TIME);
  } catch (e) {
    console.log(`    ⚠ Timeout: ${url}`);
    await wait(1000);
  }
};

// RUTAS CORRECTAS basadas en App.jsx
const modules = {
  '01-empleados': async (page) => {
    const dir = path.join(__dirname, '01-empleados/images');
    console.log('\n📸 01: Empleados');
    
    await navigateTo(page, '/employees');
    await screenshot(page, dir, '01-empleados-lista.png');
    
    await navigateTo(page, `/employees/${IDS.employee}`);
    await screenshot(page, dir, '01-empleados-detalle-info.png');
    await clickTab(page, 1);
    await screenshot(page, dir, '01-empleados-detalle-trabajo.png');
    await clickTab(page, 2);
    await screenshot(page, dir, '01-empleados-detalle-cuentas.png');
    await clickTab(page, 3);
    await screenshot(page, dir, '01-empleados-detalle-jerarquia.png');
    
    await navigateTo(page, '/employees/new');
    await screenshot(page, dir, '01-empleados-formulario-nuevo.png');
    
    await navigateTo(page, `/employees/${IDS.employee}/edit`);
    await screenshot(page, dir, '01-empleados-formulario-editar.png');
  },

  '02-organizacion': async (page) => {
    const dir = path.join(__dirname, '02-organizacion/images');
    console.log('\n📸 02: Organización');
    
    await navigateTo(page, '/organization/departments');
    await screenshot(page, dir, '02-organizacion-departamentos-lista.png');
    
    await navigateTo(page, '/organization/departments/new');
    await screenshot(page, dir, '02-organizacion-departamentos-nuevo.png');
    
    await navigateTo(page, '/organization/departments/1');
    await screenshot(page, dir, '02-organizacion-departamentos-detalle.png');
    
    await navigateTo(page, '/organization/positions');
    await screenshot(page, dir, '02-organizacion-cargos-lista.png');
    
    await navigateTo(page, '/organization/positions/new');
    await screenshot(page, dir, '02-organizacion-cargos-nuevo.png');
    
    await navigateTo(page, '/organization/chart');
    await screenshot(page, dir, '02-organizacion-organigrama.png');
    
    await navigateTo(page, '/organization/directory');
    await screenshot(page, dir, '02-organizacion-directorio.png');
  },

  '03-nomina': async (page) => {
    const dir = path.join(__dirname, '03-nomina/images');
    console.log('\n📸 03: Nómina');
    
    await navigateTo(page, '/payroll');
    await screenshot(page, dir, '03-nomina-periodos-lista.png');
    
    await navigateTo(page, `/payroll/periods/${IDS.payrollPeriod}`);
    await screenshot(page, dir, '03-nomina-periodos-detalle.png');
    
    await navigateTo(page, '/payroll/loans');
    await screenshot(page, dir, '03-nomina-prestamos-lista.png');
    
    await navigateTo(page, '/payroll/loans/new');
    await screenshot(page, dir, '03-nomina-prestamos-nuevo.png');
    
    await navigateTo(page, `/payroll/loans/${IDS.loan}`);
    await screenshot(page, dir, '03-nomina-prestamos-detalle.png');
  },

  '04-finanzas': async (page) => {
    const dir = path.join(__dirname, '04-finanzas/images');
    console.log('\n📸 04: Finanzas');
    
    await navigateTo(page, '/finance');
    await screenshot(page, dir, '04-finanzas-dashboard.png');
    
    await page.evaluate(() => window.scrollBy(0, 600));
    await wait(500);
    await screenshot(page, dir, '04-finanzas-flujo-caja.png');
    
    await navigateTo(page, '/finance/accounts');
    await screenshot(page, dir, '04-finanzas-cuentas-lista.png');
    
    await navigateTo(page, '/finance/accounts/new');
    await screenshot(page, dir, '04-finanzas-cuentas-nueva.png');
    
    await navigateTo(page, `/finance/accounts/${IDS.bankAccount}`);
    await screenshot(page, dir, '04-finanzas-cuentas-detalle.png');
    
    await navigateTo(page, '/finance/transactions');
    await screenshot(page, dir, '04-finanzas-transacciones-lista.png');
    
    await navigateTo(page, '/finance/transactions/new');
    await screenshot(page, dir, '04-finanzas-transacciones-nuevo.png');
    
    await navigateTo(page, `/finance/transactions/${IDS.transaction}`);
    await screenshot(page, dir, '04-finanzas-transacciones-detalle.png');
  },

  '05-caja-chica': async (page) => {
    const dir = path.join(__dirname, '05-caja-chica/images');
    console.log('\n📸 05: Caja Chica');
    
    await navigateTo(page, '/petty-cash');
    await screenshot(page, dir, '05-caja-chica-lista.png');
    
    await navigateTo(page, '/petty-cash/new');
    await screenshot(page, dir, '05-caja-chica-nueva.png');
    
    await navigateTo(page, `/petty-cash/${IDS.pettyCash}`);
    await screenshot(page, dir, '05-caja-chica-detalle.png');
  },

  '06-proyectos': async (page) => {
    const dir = path.join(__dirname, '06-proyectos/images');
    console.log('\n📸 06: Proyectos');
    
    await navigateTo(page, '/projects');
    await screenshot(page, dir, '06-proyectos-dashboard.png');
    
    await navigateTo(page, '/projects/list');
    await screenshot(page, dir, '06-proyectos-lista.png');
    
    await navigateTo(page, '/projects/new');
    await screenshot(page, dir, '06-proyectos-nuevo.png');
    
    await navigateTo(page, `/projects/${IDS.project}`);
    await screenshot(page, dir, '06-proyectos-detalle.png');
    await clickTab(page, 1);
    await screenshot(page, dir, '06-proyectos-equipo.png');
    await clickTab(page, 2);
    await screenshot(page, dir, '06-proyectos-tareas.png');
  },

  '07-inventario': async (page) => {
    const dir = path.join(__dirname, '07-inventario/images');
    console.log('\n📸 07: Inventario');
    
    await navigateTo(page, '/inventory');
    await screenshot(page, dir, '07-inventario-dashboard.png');
    
    await navigateTo(page, '/inventory/items');
    await screenshot(page, dir, '07-inventario-articulos-lista.png');
    
    await navigateTo(page, '/inventory/items/new');
    await screenshot(page, dir, '07-inventario-articulos-nuevo.png');
    
    await navigateTo(page, `/inventory/items/${IDS.item}`);
    await screenshot(page, dir, '07-inventario-articulos-detalle.png');
    
    await navigateTo(page, '/inventory/warehouses');
    await screenshot(page, dir, '07-inventario-almacenes-lista.png');
    
    await navigateTo(page, '/inventory/warehouses/new');
    await screenshot(page, dir, '07-inventario-almacenes-nuevo.png');
    
    await navigateTo(page, `/inventory/warehouses/${IDS.warehouse}`);
    await screenshot(page, dir, '07-inventario-almacenes-detalle.png');
    
    await navigateTo(page, '/inventory/movements');
    await screenshot(page, dir, '07-inventario-movimientos-lista.png');
    
    await navigateTo(page, '/inventory/movements/new');
    await screenshot(page, dir, '07-inventario-movimientos-nuevo.png');
  },

  '08-flota': async (page) => {
    const dir = path.join(__dirname, '08-flota/images');
    console.log('\n📸 08: Flota');
    
    await navigateTo(page, '/fleet');
    await screenshot(page, dir, '08-flota-dashboard.png');
    
    await navigateTo(page, '/fleet/vehicles');
    await screenshot(page, dir, '08-flota-vehiculos-lista.png');
    
    await navigateTo(page, '/fleet/vehicles/new');
    await screenshot(page, dir, '08-flota-vehiculos-nuevo.png');
    
    await navigateTo(page, `/fleet/vehicles/${IDS.vehicle}`);
    await screenshot(page, dir, '08-flota-vehiculos-detalle.png');
    
    await navigateTo(page, '/fleet/maintenances');
    await screenshot(page, dir, '08-flota-mantenimientos-lista.png');
    
    await navigateTo(page, '/fleet/maintenances/new');
    await screenshot(page, dir, '08-flota-mantenimientos-nuevo.png');
    
    await navigateTo(page, '/fleet/fuel-logs');
    await screenshot(page, dir, '08-flota-combustible-lista.png');
    
    await navigateTo(page, '/fleet/fuel-logs/new');
    await screenshot(page, dir, '08-flota-combustible-nuevo.png');
  },

  '09-procura': async (page) => {
    const dir = path.join(__dirname, '09-procura/images');
    console.log('\n📸 09: Procura');
    
    await navigateTo(page, '/procurement/purchase-orders');
    await screenshot(page, dir, '09-procura-ordenes-lista.png');
    
    await navigateTo(page, '/procurement/purchase-orders/new');
    await screenshot(page, dir, '09-procura-ordenes-nueva.png');
    
    await navigateTo(page, `/procurement/purchase-orders/${IDS.purchaseOrder}`);
    await screenshot(page, dir, '09-procura-ordenes-detalle.png');
    
    await navigateTo(page, '/procurement/invoices');
    await screenshot(page, dir, '09-procura-facturas-lista.png');
    
    await navigateTo(page, '/procurement/invoices/new');
    await screenshot(page, dir, '09-procura-facturas-nueva.png');
    
    await navigateTo(page, '/procurement/invoices/1');
    await screenshot(page, dir, '09-procura-facturas-detalle.png');
    
    await navigateTo(page, '/procurement/payments');
    await screenshot(page, dir, '09-procura-pagos-lista.png');
    
    await navigateTo(page, '/procurement/payments/new');
    await screenshot(page, dir, '09-procura-pagos-nuevo.png');
  },

  '10-hse': async (page) => {
    const dir = path.join(__dirname, '10-hse/images');
    console.log('\n📸 10: HSE');
    
    await navigateTo(page, '/hse');
    await screenshot(page, dir, '10-hse-dashboard.png');
    
    await navigateTo(page, '/hse/incidents');
    await screenshot(page, dir, '10-hse-incidentes-lista.png');
    
    await navigateTo(page, '/hse/incidents/new');
    await screenshot(page, dir, '10-hse-incidentes-nuevo.png');
    
    await navigateTo(page, `/hse/incidents/${IDS.incident}`);
    await screenshot(page, dir, '10-hse-incidentes-detalle.png');
    
    await navigateTo(page, '/hse/inspections');
    await screenshot(page, dir, '10-hse-inspecciones-lista.png');
    
    await navigateTo(page, '/hse/inspections/new');
    await screenshot(page, dir, '10-hse-inspecciones-nueva.png');
    
    await navigateTo(page, '/hse/trainings');
    await screenshot(page, dir, '10-hse-capacitaciones-lista.png');
    
    await navigateTo(page, '/hse/trainings/new');
    await screenshot(page, dir, '10-hse-capacitaciones-nueva.png');
    
    await navigateTo(page, '/hse/equipment');
    await screenshot(page, dir, '10-hse-equipos-lista.png');
  },

  '11-documentos': async (page) => {
    const dir = path.join(__dirname, '11-documentos/images');
    console.log('\n📸 11: Documentos');
    
    await navigateTo(page, '/documents');
    await screenshot(page, dir, '11-documentos-dashboard.png');
    
    await navigateTo(page, '/documents/list');
    await screenshot(page, dir, '11-documentos-lista.png');
    
    await navigateTo(page, '/documents/new');
    await screenshot(page, dir, '11-documentos-nuevo.png');
    
    await navigateTo(page, '/documents/1');
    await screenshot(page, dir, '11-documentos-detalle.png');
    
    await navigateTo(page, '/documents/categories');
    await screenshot(page, dir, '11-documentos-categorias.png');
    
    await navigateTo(page, '/documents/categories/new');
    await screenshot(page, dir, '11-documentos-categoria-nueva.png');
  },

  '12-dashboard': async (page) => {
    const dir = path.join(__dirname, '12-dashboard/images');
    console.log('\n📸 12: Dashboard');
    
    await navigateTo(page, '/dashboard');
    await screenshot(page, dir, '12-dashboard-kpis.png');
    
    await page.evaluate(() => window.scrollBy(0, 600));
    await wait(500);
    await screenshot(page, dir, '12-dashboard-graficos.png');
    
    await page.evaluate(() => window.scrollBy(0, 600));
    await wait(500);
    await screenshot(page, dir, '12-dashboard-graficos-adicionales.png');
    
    await page.setViewport({ width: 375, height: 812 });
    await navigateTo(page, '/dashboard');
    await screenshot(page, dir, '12-dashboard-mobile.png');
    await page.setViewport(VIEWPORT);
  },

  '13-usuarios': async (page) => {
    const dir = path.join(__dirname, '13-usuarios/images');
    console.log('\n📸 13: Usuarios');
    
    await navigateTo(page, '/admin/users');
    await screenshot(page, dir, '13-usuarios-lista.png');
    
    await navigateTo(page, '/admin/users/new');
    await screenshot(page, dir, '13-usuarios-nuevo.png');
    
    await navigateTo(page, `/admin/users/${IDS.user}`);
    await screenshot(page, dir, '13-usuarios-detalle.png');
    
    await navigateTo(page, '/admin/roles');
    await screenshot(page, dir, '13-usuarios-roles-lista.png');
    
    await navigateTo(page, '/admin/roles/new');
    await screenshot(page, dir, '13-usuarios-roles-nuevo.png');
  },

  '14-activos': async (page) => {
    const dir = path.join(__dirname, '14-activos/images');
    console.log('\n📸 14: Activos');
    
    await navigateTo(page, '/assets');
    await screenshot(page, dir, '14-activos-lista.png');
    
    await navigateTo(page, '/assets/new');
    await screenshot(page, dir, '14-activos-nuevo.png');
    
    await navigateTo(page, '/assets/1');
    await screenshot(page, dir, '14-activos-detalle.png');
    
    await navigateTo(page, '/assets/categories');
    await screenshot(page, dir, '14-activos-categorias.png');
  },

  '15-crm': async (page) => {
    const dir = path.join(__dirname, '15-crm/images');
    console.log('\n📸 15: CRM');
    
    await navigateTo(page, '/crm');
    await screenshot(page, dir, '15-crm-dashboard.png');
    
    await navigateTo(page, '/crm/clients');
    await screenshot(page, dir, '15-crm-clientes-lista.png');
    
    await navigateTo(page, '/crm/clients/new');
    await screenshot(page, dir, '15-crm-clientes-nuevo.png');
    
    await navigateTo(page, '/crm/clients/1');
    await screenshot(page, dir, '15-crm-clientes-detalle.png');
    
    await navigateTo(page, '/crm/opportunities');
    await screenshot(page, dir, '15-crm-oportunidades-lista.png');
    
    await navigateTo(page, '/crm/opportunities/new');
    await screenshot(page, dir, '15-crm-oportunidades-nueva.png');
    
    await navigateTo(page, '/crm/opportunities/1');
    await screenshot(page, dir, '15-crm-oportunidades-detalle.png');
  },

  '16-calidad': async (page) => {
    const dir = path.join(__dirname, '16-calidad/images');
    console.log('\n📸 16: Calidad');
    
    await navigateTo(page, '/quality');
    await screenshot(page, dir, '16-calidad-dashboard.png');
    
    await navigateTo(page, '/quality/inspections');
    await screenshot(page, dir, '16-calidad-inspecciones-lista.png');
    
    await navigateTo(page, '/quality/inspections/new');
    await screenshot(page, dir, '16-calidad-inspecciones-nueva.png');
    
    await navigateTo(page, '/quality/inspections/1');
    await screenshot(page, dir, '16-calidad-inspecciones-detalle.png');
    
    await navigateTo(page, '/quality/non-conformances');
    await screenshot(page, dir, '16-calidad-nc-lista.png');
    
    await navigateTo(page, '/quality/non-conformances/new');
    await screenshot(page, dir, '16-calidad-nc-nueva.png');
    
    await navigateTo(page, '/quality/non-conformances/1');
    await screenshot(page, dir, '16-calidad-nc-detalle.png');
  },

  '17-produccion': async (page) => {
    const dir = path.join(__dirname, '17-produccion/images');
    console.log('\n📸 17: Producción');
    
    await navigateTo(page, '/production');
    await screenshot(page, dir, '17-produccion-dashboard.png');
    
    await navigateTo(page, '/production/fields');
    await screenshot(page, dir, '17-produccion-campos-lista.png');
    
    await navigateTo(page, '/production/fields/new');
    await screenshot(page, dir, '17-produccion-campos-nuevo.png');
    
    await navigateTo(page, '/production/wells');
    await screenshot(page, dir, '17-produccion-pozos-lista.png');
    
    await navigateTo(page, '/production/wells/new');
    await screenshot(page, dir, '17-produccion-pozos-nuevo.png');
    
    await navigateTo(page, `/production/wells/${IDS.well}`);
    await screenshot(page, dir, '17-produccion-pozos-detalle.png');
    
    await navigateTo(page, '/production/daily');
    await screenshot(page, dir, '17-produccion-diaria-lista.png');
    
    await navigateTo(page, '/production/daily/new');
    await screenshot(page, dir, '17-produccion-diaria-nueva.png');
  },

  '18-afe': async (page) => {
    const dir = path.join(__dirname, '18-afe/images');
    console.log('\n📸 18: AFE');
    
    await navigateTo(page, '/afe');
    await screenshot(page, dir, '18-afe-dashboard.png');
    
    await navigateTo(page, '/afe/list');
    await screenshot(page, dir, '18-afe-lista.png');
    
    await navigateTo(page, '/afe/new');
    await screenshot(page, dir, '18-afe-nuevo.png');
    
    await navigateTo(page, `/afe/${IDS.afe}`);
    await screenshot(page, dir, '18-afe-detalle.png');
  },

  '19-contratos': async (page) => {
    const dir = path.join(__dirname, '19-contratos/images');
    console.log('\n📸 19: Contratos');
    
    await navigateTo(page, '/contracts');
    await screenshot(page, dir, '19-contratos-dashboard.png');
    
    await navigateTo(page, '/contracts/list');
    await screenshot(page, dir, '19-contratos-lista.png');
    
    await navigateTo(page, '/contracts/new');
    await screenshot(page, dir, '19-contratos-nuevo.png');
    
    await navigateTo(page, `/contracts/${IDS.contract}`);
    await screenshot(page, dir, '19-contratos-detalle.png');
    
    await navigateTo(page, '/contracts/concessions');
    await screenshot(page, dir, '19-contratos-concesiones.png');
  },

  '20-compliance': async (page) => {
    const dir = path.join(__dirname, '20-compliance/images');
    console.log('\n📸 20: Compliance');
    
    await navigateTo(page, '/compliance');
    await screenshot(page, dir, '20-compliance-dashboard.png');
    
    await navigateTo(page, '/compliance/policies');
    await screenshot(page, dir, '20-compliance-politicas-lista.png');
    
    await navigateTo(page, '/compliance/permits');
    await screenshot(page, dir, '20-compliance-permisos-lista.png');
    
    await navigateTo(page, '/compliance/certifications');
    await screenshot(page, dir, '20-compliance-certificaciones-lista.png');
    
    await navigateTo(page, '/compliance/audits');
    await screenshot(page, dir, '20-compliance-auditorias-lista.png');
    
    await navigateTo(page, '/compliance/reports');
    await screenshot(page, dir, '20-compliance-reportes-lista.png');
  },

  '21-jib': async (page) => {
    const dir = path.join(__dirname, '21-jib/images');
    console.log('\n📸 21: JIB');
    
    await navigateTo(page, '/jib');
    await screenshot(page, dir, '21-jib-dashboard.png');
    
    await navigateTo(page, '/jib/billings');
    await screenshot(page, dir, '21-jib-lista.png');
    
    await navigateTo(page, '/jib/billings/new');
    await screenshot(page, dir, '21-jib-nuevo.png');
    
    await navigateTo(page, '/jib/billings/1');
    await screenshot(page, dir, '21-jib-detalle.png');
    
    await navigateTo(page, '/jib/cash-calls');
    await screenshot(page, dir, '21-jib-cashcalls-lista.png');
  },

  '22-permisos-trabajo': async (page) => {
    const dir = path.join(__dirname, '22-permisos-trabajo/images');
    console.log('\n📸 22: PTW');
    
    await navigateTo(page, '/ptw');
    await screenshot(page, dir, '22-ptw-dashboard.png');
    
    await navigateTo(page, '/ptw/permits');
    await screenshot(page, dir, '22-ptw-permisos-lista.png');
    
    await navigateTo(page, '/ptw/permits/new');
    await screenshot(page, dir, '22-ptw-permisos-nuevo.png');
    
    await navigateTo(page, '/ptw/permits/1');
    await screenshot(page, dir, '22-ptw-permisos-detalle.png');
    
    await navigateTo(page, '/ptw/stop-work');
    await screenshot(page, dir, '22-ptw-stopwork-lista.png');
  },

  '23-notificaciones': async (page) => {
    const dir = path.join(__dirname, '23-notificaciones/images');
    console.log('\n📸 23: Notificaciones');
    
    await navigateTo(page, '/settings');
    await screenshot(page, dir, '23-notificaciones-configuracion.png');
  },

  '24-reportes': async (page) => {
    const dir = path.join(__dirname, '24-reportes/images');
    console.log('\n📸 24: Reportes');
    
    await navigateTo(page, '/reports');
    await screenshot(page, dir, '24-reportes-empleados.png');
    
    await clickTab(page, 1);
    await screenshot(page, dir, '24-reportes-finanzas.png');
    
    await clickTab(page, 2);
    await screenshot(page, dir, '24-reportes-inventario.png');
    
    await clickTab(page, 3);
    await screenshot(page, dir, '24-reportes-flota.png');
  },

  '25-configuracion': async (page) => {
    const dir = path.join(__dirname, '25-configuracion/images');
    console.log('\n📸 25: Configuración');
    
    await navigateTo(page, '/settings');
    await screenshot(page, dir, '25-configuracion-general.png');
    
    await page.evaluate(() => window.scrollBy(0, 400));
    await wait(500);
    await screenshot(page, dir, '25-configuracion-tema.png');
  },
};

async function main() {
  console.log('🚀 Iniciando capturas de pantalla...\n');
  console.log(`URL: ${BASE_URL}`);
  console.log(`Viewport: ${VIEWPORT.width}x${VIEWPORT.height}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  
  try {
    console.log('\n🔐 Iniciando sesión...');
    await login(page);
    console.log('✓ Sesión iniciada\n');
    
    const args = process.argv.slice(2);
    const modulesToRun = args.length > 0 
      ? args.filter(m => modules[m])
      : Object.keys(modules);
    
    if (args.length > 0 && modulesToRun.length === 0) {
      console.log('Módulos disponibles:', Object.keys(modules).join(', '));
      process.exit(1);
    }
    
    for (const moduleName of modulesToRun) {
      try {
        await modules[moduleName](page);
      } catch (error) {
        console.error(`  ❌ Error en ${moduleName}: ${error.message}`);
      }
    }
    
    console.log('\n✅ Capturas completadas!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
