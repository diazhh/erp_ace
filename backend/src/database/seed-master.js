#!/usr/bin/env node
/**
 * Script maestro para ejecutar todos los seeders del sistema ERP
 * Ejecuta los seeders en el orden correcto para poblar la base de datos
 * 
 * Uso: node src/database/seed-master.js
 */

require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

const seeders = [
  { name: 'Permisos y Roles', script: 'seed.js' },
  { name: 'Datos de Prueba (Usuarios y Empleados)', script: 'seed-test-data.js' },
  { name: 'Datos Completos del Sistema', script: 'seed-all.js' },
];

const runSeeders = async () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       SEED MAESTRO - SISTEMA ERP PETROLERO                 ║');
  console.log('║       Poblando base de datos con datos de prueba           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;

  for (const seeder of seeders) {
    console.log(`\n▶ Ejecutando: ${seeder.name}...`);
    console.log('─'.repeat(60));
    
    try {
      const scriptPath = path.join(__dirname, seeder.script);
      execSync(`node ${scriptPath}`, { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..', '..')
      });
      successCount++;
      console.log(`✅ ${seeder.name} completado\n`);
    } catch (error) {
      failCount++;
      console.error(`❌ Error en ${seeder.name}: ${error.message}\n`);
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    RESUMEN FINAL                           ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  Seeders exitosos: ${successCount}                                        ║`);
  console.log(`║  Seeders fallidos: ${failCount}                                        ║`);
  console.log(`║  Tiempo total: ${duration}s                                      ║`);
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('📋 CREDENCIALES DE ACCESO:');
  console.log('┌─────────────┬───────────────┬──────────────────────────┐');
  console.log('│ Usuario     │ Contraseña    │ Rol                      │');
  console.log('├─────────────┼───────────────┼──────────────────────────┤');
  console.log('│ admin       │ Admin123!     │ Super Administrador      │');
  console.log('│ gerente     │ Gerente123!   │ Gerente General          │');
  console.log('│ contador    │ Contador123!  │ Contador                 │');
  console.log('│ rrhh        │ Rrhh1234!     │ Jefe de RRHH             │');
  console.log('│ supervisor  │ Super123!     │ Supervisor de Operaciones│');
  console.log('│ empleado1   │ Empleado1!    │ Empleado                 │');
  console.log('└─────────────┴───────────────┴──────────────────────────┘\n');

  if (failCount > 0) {
    process.exit(1);
  }
};

runSeeders();
