const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:5173';
const CREDENTIALS = { username: 'admin', password: 'Admin123!' };
const VIEWPORT = { width: 2560, height: 1600 };
const WAIT_TIME = 2500;

// Helper functions
const wait = (ms) => new Promise(r => setTimeout(r, ms));

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const screenshot = async (page, dir, filename) => {
  ensureDir(dir);
  const filepath = path.join(dir, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`  ✓ ${filename}`);
};

// Login function
const login = async (page) => {
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(1000);
  await page.type('input[name="username"]', CREDENTIALS.username);
  await page.type('input[name="password"]', CREDENTIALS.password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
  await wait(WAIT_TIME);
};

// Click tab by index (0-based)
const clickTab = async (page, index) => {
  try {
    const tabs = await page.$$('[role="tab"]');
    if (tabs[index]) {
      await tabs[index].click();
      await wait(1500);
      return true;
    }
  } catch (e) {
    console.log(`    ⚠ Could not click tab ${index}`);
  }
  return false;
};

// Navigate to URL and wait
const navigateTo = async (page, url) => {
  try {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(WAIT_TIME);
  } catch (e) {
    console.log(`    ⚠ Navigation timeout for ${url}, continuing...`);
    await wait(1000);
  }
};

// Module screenshot functions
const modules = {
  // 01 - Empleados
  '01-empleados': async (page) => {
    const dir = path.join(__dirname, '01-empleados/images');
    console.log('\n📸 Módulo 01: Empleados');
    
    await navigateTo(page, '/employees');
    await screenshot(page, dir, '01-empleados-lista.png');
    
    // Filtro activo
    await clickSafe(page, '[data-testid="status-filter"], .MuiSelect-select', { wait: 500 });
    await clickSafe(page, '[data-value="active"], li:contains("Activo")', { wait: 1000 });
    await screenshot(page, dir, '01-empleados-lista-filtrada.png');
    
    // Detalle
    await navigateTo(page, '/employees/1');
    await screenshot(page, dir, '01-empleados-detalle-info.png');
    
    // Tab Trabajo
    await clickSafe(page, 'button:has-text("Trabajo"), [role="tab"]:nth-child(2)', { wait: 1000 });
    await screenshot(page, dir, '01-empleados-detalle-trabajo.png');
    
    // Tab Cuentas
    await clickSafe(page, 'button:has-text("Cuentas"), [role="tab"]:nth-child(3)', { wait: 1000 });
    await screenshot(page, dir, '01-empleados-detalle-cuentas.png');
    
    // Tab Jerarquía
    await clickSafe(page, 'button:has-text("Jerarquía"), [role="tab"]:nth-child(4)', { wait: 1000 });
    await screenshot(page, dir, '01-empleados-detalle-jerarquia.png');
    
    // Nuevo empleado
    await navigateTo(page, '/employees/new');
    await screenshot(page, dir, '01-empleados-formulario-nuevo.png');
    
    // Editar empleado
    await navigateTo(page, '/employees/1/edit');
    await screenshot(page, dir, '01-empleados-formulario-editar.png');
  },

  // 02 - Organización
  '02-organizacion': async (page) => {
    const dir = path.join(__dirname, '02-organizacion/images');
    console.log('\n📸 Módulo 02: Organización');
    
    await navigateTo(page, '/departments');
    await screenshot(page, dir, '02-organizacion-departamentos-lista.png');
    
    await navigateTo(page, '/departments/new');
    await screenshot(page, dir, '02-organizacion-departamentos-nuevo.png');
    
    await navigateTo(page, '/departments/1');
    await screenshot(page, dir, '02-organizacion-departamentos-detalle.png');
    
    await navigateTo(page, '/positions');
    await screenshot(page, dir, '02-organizacion-cargos-lista.png');
    
    await navigateTo(page, '/positions/new');
    await screenshot(page, dir, '02-organizacion-cargos-nuevo.png');
    
    await navigateTo(page, '/organization/chart');
    await screenshot(page, dir, '02-organizacion-organigrama-departamentos.png');
    
    await navigateTo(page, '/directory');
    await screenshot(page, dir, '02-organizacion-directorio-grid.png');
  },

  // 03 - Nómina
  '03-nomina': async (page) => {
    const dir = path.join(__dirname, '03-nomina/images');
    console.log('\n📸 Módulo 03: Nómina');
    
    await navigateTo(page, '/payroll/periods');
    await screenshot(page, dir, '03-nomina-periodos-lista.png');
    
    await navigateTo(page, '/payroll/periods/new');
    await screenshot(page, dir, '03-nomina-periodos-nuevo.png');
    
    await navigateTo(page, '/payroll/periods/1');
    await screenshot(page, dir, '03-nomina-periodos-detalle.png');
    
    await navigateTo(page, '/payroll/loans');
    await screenshot(page, dir, '03-nomina-prestamos-lista.png');
    
    await navigateTo(page, '/payroll/loans/new');
    await screenshot(page, dir, '03-nomina-prestamos-nuevo.png');
    
    await navigateTo(page, '/payroll/loans/1');
    await screenshot(page, dir, '03-nomina-prestamos-detalle.png');
  },

  // 04 - Finanzas
  '04-finanzas': async (page) => {
    const dir = path.join(__dirname, '04-finanzas/images');
    console.log('\n📸 Módulo 04: Finanzas');
    
    await navigateTo(page, '/finance/dashboard');
    await screenshot(page, dir, '04-finanzas-dashboard.png');
    
    await page.evaluate(() => window.scrollBy(0, 600));
    await wait(500);
    await screenshot(page, dir, '04-finanzas-flujo-caja.png');
    
    await navigateTo(page, '/finance/accounts');
    await screenshot(page, dir, '04-finanzas-cuentas-lista.png');
    
    await navigateTo(page, '/finance/accounts/new');
    await screenshot(page, dir, '04-finanzas-cuentas-nueva.png');
    
    await navigateTo(page, '/finance/accounts/1');
    await screenshot(page, dir, '04-finanzas-cuentas-detalle.png');
    
    await navigateTo(page, '/finance/transactions');
    await screenshot(page, dir, '04-finanzas-transacciones-lista.png');
    
    await navigateTo(page, '/finance/transactions/new?type=income');
    await screenshot(page, dir, '04-finanzas-transacciones-ingreso.png');
    
    await navigateTo(page, '/finance/transactions/new?type=expense');
    await screenshot(page, dir, '04-finanzas-transacciones-gasto.png');
    
    await navigateTo(page, '/finance/transactions/new?type=transfer');
    await screenshot(page, dir, '04-finanzas-transacciones-transferencia.png');
    
    await navigateTo(page, '/finance/transactions/1');
    await screenshot(page, dir, '04-finanzas-transacciones-detalle.png');
  },

  // 05 - Caja Chica
  '05-caja-chica': async (page) => {
    const dir = path.join(__dirname, '05-caja-chica/images');
    console.log('\n📸 Módulo 05: Caja Chica');
    
    await navigateTo(page, '/petty-cash');
    await screenshot(page, dir, '05-caja-chica-lista.png');
    
    await navigateTo(page, '/petty-cash/new');
    await screenshot(page, dir, '05-caja-chica-nueva.png');
    
    await navigateTo(page, '/petty-cash/1');
    await screenshot(page, dir, '05-caja-chica-detalle.png');
    await screenshot(page, dir, '05-caja-chica-movimientos.png');
  },

  // 06 - Proyectos
  '06-proyectos': async (page) => {
    const dir = path.join(__dirname, '06-proyectos/images');
    console.log('\n📸 Módulo 06: Proyectos');
    
    await navigateTo(page, '/projects/dashboard');
    await screenshot(page, dir, '06-proyectos-dashboard.png');
    
    await page.evaluate(() => window.scrollBy(0, 600));
    await wait(500);
    await screenshot(page, dir, '06-proyectos-graficos.png');
    
    await navigateTo(page, '/projects');
    await screenshot(page, dir, '06-proyectos-lista.png');
    
    await navigateTo(page, '/projects/new');
    await screenshot(page, dir, '06-proyectos-nuevo.png');
    
    await navigateTo(page, '/projects/1');
    await screenshot(page, dir, '06-proyectos-detalle.png');
    
    await clickSafe(page, 'button:has-text("Equipo"), [role="tab"]:nth-child(2)', { wait: 1000 });
    await screenshot(page, dir, '06-proyectos-equipo.png');
    
    await clickSafe(page, 'button:has-text("Tareas"), [role="tab"]:nth-child(3)', { wait: 1000 });
    await screenshot(page, dir, '06-proyectos-tareas.png');
  },

  // 07 - Inventario
  '07-inventario': async (page) => {
    const dir = path.join(__dirname, '07-inventario/images');
    console.log('\n📸 Módulo 07: Inventario');
    
    await navigateTo(page, '/inventory/dashboard');
    await screenshot(page, dir, '07-inventario-dashboard.png');
    
    await navigateTo(page, '/inventory/items');
    await screenshot(page, dir, '07-inventario-articulos-lista.png');
    
    await navigateTo(page, '/inventory/items/new');
    await screenshot(page, dir, '07-inventario-articulos-nuevo.png');
    
    await navigateTo(page, '/inventory/items/1');
    await screenshot(page, dir, '07-inventario-articulos-detalle.png');
    
    await navigateTo(page, '/inventory/warehouses');
    await screenshot(page, dir, '07-inventario-almacenes-lista.png');
    
    await navigateTo(page, '/inventory/warehouses/new');
    await screenshot(page, dir, '07-inventario-almacenes-nuevo.png');
    
    await navigateTo(page, '/inventory/warehouses/1');
    await screenshot(page, dir, '07-inventario-almacenes-detalle.png');
    
    await navigateTo(page, '/inventory/movements');
    await screenshot(page, dir, '07-inventario-movimientos-lista.png');
    
    await navigateTo(page, '/inventory/movements/new');
    await screenshot(page, dir, '07-inventario-movimientos-nuevo.png');
  },

  // 08 - Flota
  '08-flota': async (page) => {
    const dir = path.join(__dirname, '08-flota/images');
    console.log('\n📸 Módulo 08: Flota');
    
    await navigateTo(page, '/fleet/dashboard');
    await screenshot(page, dir, '08-flota-dashboard.png');
    
    await navigateTo(page, '/fleet/vehicles');
    await screenshot(page, dir, '08-flota-vehiculos-lista.png');
    
    await navigateTo(page, '/fleet/vehicles/new');
    await screenshot(page, dir, '08-flota-vehiculos-nuevo.png');
    
    await navigateTo(page, '/fleet/vehicles/1');
    await screenshot(page, dir, '08-flota-vehiculos-detalle.png');
    
    await navigateTo(page, '/fleet/maintenance');
    await screenshot(page, dir, '08-flota-mantenimientos-lista.png');
    
    await navigateTo(page, '/fleet/maintenance/new');
    await screenshot(page, dir, '08-flota-mantenimientos-nuevo.png');
    
    await navigateTo(page, '/fleet/fuel');
    await screenshot(page, dir, '08-flota-combustible-lista.png');
    
    await navigateTo(page, '/fleet/fuel/new');
    await screenshot(page, dir, '08-flota-combustible-nuevo.png');
  },

  // 09 - Procura
  '09-procura': async (page) => {
    const dir = path.join(__dirname, '09-procura/images');
    console.log('\n📸 Módulo 09: Procura');
    
    await navigateTo(page, '/procurement/orders');
    await screenshot(page, dir, '09-procura-ordenes-lista.png');
    
    await navigateTo(page, '/procurement/orders/new');
    await screenshot(page, dir, '09-procura-ordenes-nueva.png');
    
    await navigateTo(page, '/procurement/orders/1');
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

  // 10 - HSE
  '10-hse': async (page) => {
    const dir = path.join(__dirname, '10-hse/images');
    console.log('\n📸 Módulo 10: HSE');
    
    await navigateTo(page, '/hse/dashboard');
    await screenshot(page, dir, '10-hse-dashboard.png');
    
    await navigateTo(page, '/hse/incidents');
    await screenshot(page, dir, '10-hse-incidentes-lista.png');
    
    await navigateTo(page, '/hse/incidents/new');
    await screenshot(page, dir, '10-hse-incidentes-nuevo.png');
    
    await navigateTo(page, '/hse/incidents/1');
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

  // 11 - Documentos
  '11-documentos': async (page) => {
    const dir = path.join(__dirname, '11-documentos/images');
    console.log('\n📸 Módulo 11: Documentos');
    
    await navigateTo(page, '/documents/dashboard');
    await screenshot(page, dir, '11-documentos-dashboard.png');
    
    await navigateTo(page, '/documents');
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

  // 12 - Dashboard
  '12-dashboard': async (page) => {
    const dir = path.join(__dirname, '12-dashboard/images');
    console.log('\n📸 Módulo 12: Dashboard');
    
    await navigateTo(page, '/dashboard');
    await screenshot(page, dir, '12-dashboard-kpis.png');
    
    await page.evaluate(() => window.scrollBy(0, 600));
    await wait(500);
    await screenshot(page, dir, '12-dashboard-graficos.png');
    
    await page.evaluate(() => window.scrollBy(0, 600));
    await wait(500);
    await screenshot(page, dir, '12-dashboard-graficos-adicionales.png');
    
    // Mobile view
    await page.setViewport({ width: 375, height: 812 });
    await navigateTo(page, '/dashboard');
    await screenshot(page, dir, '12-dashboard-mobile.png');
    await page.setViewport(VIEWPORT);
  },

  // 13 - Usuarios
  '13-usuarios': async (page) => {
    const dir = path.join(__dirname, '13-usuarios/images');
    console.log('\n📸 Módulo 13: Usuarios');
    
    await navigateTo(page, '/admin/users');
    await screenshot(page, dir, '13-usuarios-lista.png');
    
    await navigateTo(page, '/admin/users/new');
    await screenshot(page, dir, '13-usuarios-nuevo.png');
    
    await navigateTo(page, '/admin/users/1');
    await screenshot(page, dir, '13-usuarios-detalle.png');
    
    await navigateTo(page, '/admin/roles');
    await screenshot(page, dir, '13-usuarios-roles-lista.png');
    
    await navigateTo(page, '/admin/roles/new');
    await screenshot(page, dir, '13-usuarios-roles-nuevo.png');
  },

  // 14 - Activos
  '14-activos': async (page) => {
    const dir = path.join(__dirname, '14-activos/images');
    console.log('\n📸 Módulo 14: Activos');
    
    await navigateTo(page, '/assets');
    await screenshot(page, dir, '14-activos-lista.png');
    
    await navigateTo(page, '/assets/new');
    await screenshot(page, dir, '14-activos-nuevo.png');
    
    await navigateTo(page, '/assets/1');
    await screenshot(page, dir, '14-activos-detalle.png');
    
    await navigateTo(page, '/assets/categories');
    await screenshot(page, dir, '14-activos-categorias.png');
    
    await navigateTo(page, '/assets/categories/new');
    await screenshot(page, dir, '14-activos-categoria-nueva.png');
  },

  // 15 - CRM
  '15-crm': async (page) => {
    const dir = path.join(__dirname, '15-crm/images');
    console.log('\n📸 Módulo 15: CRM');
    
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

  // 16 - Calidad
  '16-calidad': async (page) => {
    const dir = path.join(__dirname, '16-calidad/images');
    console.log('\n📸 Módulo 16: Calidad');
    
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

  // 17 - Producción
  '17-produccion': async (page) => {
    const dir = path.join(__dirname, '17-produccion/images');
    console.log('\n📸 Módulo 17: Producción');
    
    await navigateTo(page, '/production/dashboard');
    await screenshot(page, dir, '17-produccion-dashboard.png');
    
    await navigateTo(page, '/production/fields');
    await screenshot(page, dir, '17-produccion-campos-lista.png');
    
    await navigateTo(page, '/production/fields/new');
    await screenshot(page, dir, '17-produccion-campos-nuevo.png');
    
    await navigateTo(page, '/production/wells');
    await screenshot(page, dir, '17-produccion-pozos-lista.png');
    
    await navigateTo(page, '/production/wells/new');
    await screenshot(page, dir, '17-produccion-pozos-nuevo.png');
    
    await navigateTo(page, '/production/wells/1');
    await screenshot(page, dir, '17-produccion-pozos-detalle.png');
    
    await navigateTo(page, '/production/daily');
    await screenshot(page, dir, '17-produccion-diaria-lista.png');
    
    await navigateTo(page, '/production/daily/new');
    await screenshot(page, dir, '17-produccion-diaria-nueva.png');
  },

  // 18 - AFE
  '18-afe': async (page) => {
    const dir = path.join(__dirname, '18-afe/images');
    console.log('\n📸 Módulo 18: AFE');
    
    await navigateTo(page, '/afe/dashboard');
    await screenshot(page, dir, '18-afe-dashboard.png');
    
    await navigateTo(page, '/afe');
    await screenshot(page, dir, '18-afe-lista.png');
    
    await navigateTo(page, '/afe/new');
    await screenshot(page, dir, '18-afe-nuevo.png');
    
    await navigateTo(page, '/afe/1');
    await screenshot(page, dir, '18-afe-detalle.png');
  },

  // 19 - Contratos
  '19-contratos': async (page) => {
    const dir = path.join(__dirname, '19-contratos/images');
    console.log('\n📸 Módulo 19: Contratos');
    
    await navigateTo(page, '/contracts/dashboard');
    await screenshot(page, dir, '19-contratos-dashboard.png');
    
    await navigateTo(page, '/contracts');
    await screenshot(page, dir, '19-contratos-lista.png');
    
    await navigateTo(page, '/contracts/new');
    await screenshot(page, dir, '19-contratos-nuevo.png');
    
    await navigateTo(page, '/contracts/1');
    await screenshot(page, dir, '19-contratos-detalle.png');
    
    await navigateTo(page, '/contracts/concessions');
    await screenshot(page, dir, '19-contratos-concesiones.png');
  },

  // 20 - Compliance
  '20-compliance': async (page) => {
    const dir = path.join(__dirname, '20-compliance/images');
    console.log('\n📸 Módulo 20: Compliance');
    
    await navigateTo(page, '/compliance/dashboard');
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

  // 21 - JIB
  '21-jib': async (page) => {
    const dir = path.join(__dirname, '21-jib/images');
    console.log('\n📸 Módulo 21: JIB');
    
    await navigateTo(page, '/jib/dashboard');
    await screenshot(page, dir, '21-jib-dashboard.png');
    
    await navigateTo(page, '/jib');
    await screenshot(page, dir, '21-jib-lista.png');
    
    await navigateTo(page, '/jib/new');
    await screenshot(page, dir, '21-jib-nuevo.png');
    
    await navigateTo(page, '/jib/1');
    await screenshot(page, dir, '21-jib-detalle.png');
    
    await navigateTo(page, '/jib/cash-calls');
    await screenshot(page, dir, '21-jib-cashcalls-lista.png');
  },

  // 22 - Permisos de Trabajo
  '22-permisos-trabajo': async (page) => {
    const dir = path.join(__dirname, '22-permisos-trabajo/images');
    console.log('\n📸 Módulo 22: Permisos de Trabajo');
    
    await navigateTo(page, '/ptw/dashboard');
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

  // 23 - Notificaciones
  '23-notificaciones': async (page) => {
    const dir = path.join(__dirname, '23-notificaciones/images');
    console.log('\n📸 Módulo 23: Notificaciones');
    
    await navigateTo(page, '/dashboard');
    // Click notification bell
    await clickSafe(page, '[data-testid="notifications-button"], .MuiBadge-root button, [aria-label*="notification"]', { wait: 1000 });
    await screenshot(page, dir, '23-notificaciones-panel.png');
    
    await navigateTo(page, '/notifications');
    await screenshot(page, dir, '23-notificaciones-historial.png');
    
    await navigateTo(page, '/settings');
    await screenshot(page, dir, '23-notificaciones-configuracion.png');
  },

  // 24 - Reportes
  '24-reportes': async (page) => {
    const dir = path.join(__dirname, '24-reportes/images');
    console.log('\n📸 Módulo 24: Reportes');
    
    await navigateTo(page, '/reports');
    await screenshot(page, dir, '24-reportes-empleados.png');
    
    await clickSafe(page, 'button:has-text("Finanzas"), [role="tab"]:nth-child(2)', { wait: 1000 });
    await screenshot(page, dir, '24-reportes-finanzas.png');
    
    await clickSafe(page, 'button:has-text("Inventario"), [role="tab"]:nth-child(3)', { wait: 1000 });
    await screenshot(page, dir, '24-reportes-inventario.png');
    
    await clickSafe(page, 'button:has-text("Flota"), [role="tab"]:nth-child(4)', { wait: 1000 });
    await screenshot(page, dir, '24-reportes-flota.png');
  },

  // 25 - Configuración
  '25-configuracion': async (page) => {
    const dir = path.join(__dirname, '25-configuracion/images');
    console.log('\n📸 Módulo 25: Configuración');
    
    await navigateTo(page, '/settings');
    await screenshot(page, dir, '25-configuracion-general.png');
    
    await page.evaluate(() => window.scrollBy(0, 400));
    await wait(500);
    await screenshot(page, dir, '25-configuracion-whatsapp.png');
    
    await page.evaluate(() => window.scrollBy(0, 400));
    await wait(500);
    await screenshot(page, dir, '25-configuracion-email.png');
    
    await page.evaluate(() => window.scrollBy(0, 400));
    await wait(500);
    await screenshot(page, dir, '25-configuracion-tema.png');
  },
};

// Main execution
async function main() {
  console.log('🚀 Iniciando capturas de pantalla para todos los módulos...\n');
  console.log('Configuración:');
  console.log(`  - URL: ${BASE_URL}`);
  console.log(`  - Viewport: ${VIEWPORT.width}x${VIEWPORT.height}`);
  console.log(`  - Usuario: ${CREDENTIALS.username}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  
  try {
    // Login
    console.log('\n🔐 Iniciando sesión...');
    await login(page);
    console.log('✓ Sesión iniciada correctamente\n');
    
    // Get modules to process from command line args or all
    const args = process.argv.slice(2);
    const modulesToRun = args.length > 0 
      ? args.filter(m => modules[m])
      : Object.keys(modules);
    
    if (args.length > 0 && modulesToRun.length === 0) {
      console.log('Módulos disponibles:', Object.keys(modules).join(', '));
      process.exit(1);
    }
    
    // Run each module
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
