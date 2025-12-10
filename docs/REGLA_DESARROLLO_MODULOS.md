---
trigger: always
---

# Regla General: Desarrollo de Nuevos Módulos

## Cuándo Aplicar Esta Regla

Cuando el usuario pida:
- Crear un nuevo módulo
- Agregar funcionalidad con cambios en BD
- Modificar estructura de tablas existentes
- Agregar nuevas entidades/modelos

---

## Proceso Obligatorio de Desarrollo

### Fase 1: Diseño y Estructura

1. **Crear modelos en** `/backend/src/modules/[modulo]/models/`
2. **Registrar modelos en** `/backend/src/database/models/index.js`
3. **Definir asociaciones** en el mismo archivo

### Fase 2: Migración de Base de Datos (OBLIGATORIO)

**SIEMPRE crear migración para cambios de BD**, nunca depender solo de `sync()`.

#### Crear archivo de migración:

```bash
# Formato: YYYYMMDD-descripcion.js
touch backend/src/database/migrations/$(date +%Y%m%d)-add-[nombre-modulo].js
```

#### Estructura de migración:

```javascript
'use strict';

/**
 * Migración: [Descripción del cambio]
 * 
 * Cambios:
 * 1. [Listar cambios específicos]
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar si tabla/columna ya existe antes de crear
    const tables = await queryInterface.showAllTables();
    
    if (!tables.includes('nombre_tabla')) {
      await queryInterface.createTable('nombre_tabla', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        // ... más columnas
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
    }
    
    // Para agregar columnas a tablas existentes:
    const columns = await queryInterface.describeTable('tabla_existente');
    if (!columns.nueva_columna) {
      await queryInterface.addColumn('tabla_existente', 'nueva_columna', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
    console.log('✅ Migración completada');
  },

  async down(queryInterface, Sequelize) {
    // Revertir cambios en orden inverso
    await queryInterface.dropTable('nombre_tabla');
    // o
    await queryInterface.removeColumn('tabla_existente', 'nueva_columna');
  }
};
```

#### Ejecutar migración en local:

```bash
cd backend && npx sequelize-cli db:migrate
```

#### Verificar estado:

```bash
cd backend && npx sequelize-cli db:migrate:status
```

---

### Fase 3: Backend - Servicios, Controladores y Rutas

1. **Crear servicio** (si aplica): `/backend/src/modules/[modulo]/services/`
2. **Crear controlador**: `/backend/src/modules/[modulo]/controllers/`
3. **Crear rutas**: `/backend/src/modules/[modulo]/routes/`
4. **Registrar rutas en** `/backend/src/app.js`

---

### Fase 4: Permisos (si el módulo requiere control de acceso)

1. **Agregar permisos en** `/backend/src/database/seeders/permissions-granular.js`:

```javascript
// En el objeto PERMISSIONS agregar:
[modulo]: [
  { code: '[modulo]:*', name: '[Módulo] - Acceso Completo', ... },
  { code: '[modulo]:read', name: 'Ver [Módulo]', ... },
  { code: '[modulo]:create', name: 'Crear [Módulo]', ... },
  { code: '[modulo]:update', name: 'Editar [Módulo]', ... },
  { code: '[modulo]:delete', name: 'Eliminar [Módulo]', ... },
],
```

2. **Ejecutar seed** para crear permisos:

```bash
cd backend && npm run seed
```

---

### Fase 5: Pruebas (⚠️ OBLIGATORIO - NO SALTARSE)

**IMPORTANTE**: Después de cada módulo o característica nueva, se DEBEN ejecutar las 3 tipos de pruebas antes de continuar o hacer deploy.

---

#### 5.1 Pruebas Unitarias

Crear archivo de pruebas unitarias para el módulo:

```bash
# Crear archivo de pruebas
touch backend/src/modules/[modulo]/tests/[modulo].unit.test.js
```

Estructura de prueba unitaria:

```javascript
const { describe, it, expect } = require('@jest/globals');
// Importar funciones/servicios a probar

describe('[Módulo] - Pruebas Unitarias', () => {
  describe('Función X', () => {
    it('debe hacer Y cuando Z', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

Ejecutar:

```bash
cd backend && npm test -- --testPathPattern=[modulo]
```

---

#### 5.2 Pruebas de Integración

Crear archivo de pruebas de integración:

```bash
touch backend/src/modules/[modulo]/tests/[modulo].integration.test.js
```

Estructura:

```javascript
const request = require('supertest');
const app = require('../../../app');

describe('[Módulo] - Pruebas de Integración', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Admin123!' });
    token = res.body.token;
  });

  describe('GET /api/[modulo]', () => {
    it('debe retornar lista', async () => {
      const res = await request(app)
        .get('/api/[modulo]')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/[modulo]', () => {
    it('debe crear registro', async () => {
      const res = await request(app)
        .post('/api/[modulo]')
        .set('Authorization', `Bearer ${token}`)
        .send({ campo: 'valor' });
      expect(res.status).toBe(201);
    });
  });
});
```

Ejecutar:

```bash
cd backend && npm test -- --testPathPattern=integration
```

---

#### 5.3 Pruebas de API (Script de pruebas)

Ejecutar el script completo de pruebas de API:

```bash
cd backend && bash tests/api-tests.sh
```

O probar manualmente con curl:

```bash
# Obtener token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Probar endpoints del módulo
curl -s http://localhost:5000/api/[modulo] \
  -H "Authorization: Bearer $TOKEN" | jq

curl -s -X POST http://localhost:5000/api/[modulo] \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"campo":"valor"}' | jq
```

---

#### 5.4 Ejecutar TODAS las pruebas

```bash
# Ejecutar suite completa de pruebas
cd backend && npm test

# Ver cobertura
cd backend && npm test -- --coverage
```

---

#### 5.5 Verificar que no hay errores

```bash
# Verificar logs del backend
tail -50 backend/logs/combined.log

# Verificar que el servidor responde
curl -s http://localhost:5000/health | jq

# Verificar que no hay errores de sintaxis
cd backend && npm run lint
```

---

#### ⛔ BLOQUEO: No continuar si las pruebas fallan

Si alguna prueba falla:
1. **NO hacer deploy**
2. **NO pasar al frontend**
3. Corregir el error
4. Volver a ejecutar las pruebas
5. Solo continuar cuando TODAS pasen

---

### Fase 6: Frontend (si aplica)

1. **Crear slice Redux**: `/frontend/src/store/slices/[modulo]Slice.js`
2. **Registrar en store**: `/frontend/src/store/index.js`
3. **Crear páginas**: `/frontend/src/pages/[modulo]/`
4. **Agregar rutas**: `/frontend/src/App.jsx`
5. **Agregar al menú**: `/frontend/src/components/Layout.jsx`
6. **Agregar traducciones**: `/frontend/src/i18n/locales/`

---

### Fase 7: Documentación

Actualizar:
- `WINDSURF_CONTEXT.md` - Agregar módulo a la lista
- `docs/ROADMAP.md` - Marcar como completado

---

## Checklist Final Antes de Deploy

```markdown
## Backend
- [ ] Migración creada y ejecutada localmente
- [ ] Modelos registrados en index.js
- [ ] Asociaciones definidas
- [ ] Controladores y rutas creados
- [ ] Rutas registradas en app.js
- [ ] Permisos agregados (si aplica)
- [ ] Seed ejecutado

## Pruebas (⚠️ OBLIGATORIO)
- [ ] ✅ Pruebas unitarias pasando
- [ ] ✅ Pruebas de integración pasando
- [ ] ✅ Pruebas de API pasando (bash tests/api-tests.sh)
- [ ] ✅ Sin errores en logs
- [ ] ✅ Health check respondiendo

## Frontend (si aplica)
- [ ] Slice Redux creado
- [ ] Páginas implementadas
- [ ] Rutas agregadas
- [ ] Menú actualizado

## Documentación
- [ ] WINDSURF_CONTEXT.md actualizado
- [ ] ROADMAP.md actualizado
```

---

## Compatibilidad con Deploy

Este proceso es **100% compatible** con `REGLA_DEPLOY_WINDSURF.md`:

1. **Migraciones** → Se ejecutan automáticamente en Paso 4 del deploy
2. **Seed** → Se ejecuta manualmente si hay nuevos permisos
3. **Código** → Se despliega con git pull + PM2 restart

### Orden de ejecución en producción:

```
1. Backup BD (automático si hay migraciones pendientes)
2. Ejecutar migraciones (npx sequelize-cli db:migrate)
3. Git pull
4. npm install
5. PM2 restart
6. Ejecutar seed (solo si hay nuevos permisos/roles)
```

---

## Comandos Útiles

```bash
# Estado de migraciones
cd backend && npx sequelize-cli db:migrate:status

# Ejecutar migraciones pendientes
cd backend && npx sequelize-cli db:migrate

# Revertir última migración
cd backend && npx sequelize-cli db:migrate:undo

# Ejecutar seed
cd backend && npm run seed

# Probar endpoints
cd backend && bash tests/api-tests.sh

# Ver logs
tail -f backend/logs/combined.log
```

---

## Ejemplo Completo: Módulo WhatsApp

```bash
# 1. Crear estructura
mkdir -p backend/src/modules/whatsapp/{models,services,controllers,routes}

# 2. Crear modelos (WhatsAppSession.js, UserWhatsApp.js)

# 3. Crear migración
touch backend/src/database/migrations/20251209-add-whatsapp-tables.js

# 4. Ejecutar migración
cd backend && npx sequelize-cli db:migrate

# 5. Crear servicio, controlador, rutas

# 6. Registrar en app.js

# 7. Agregar permisos en permissions-granular.js

# 8. Ejecutar seed
npm run seed

# 9. Probar
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -s http://localhost:5000/api/whatsapp/status \
  -H "Authorization: Bearer $TOKEN"

# 10. Frontend (slice, páginas, rutas, menú)

# 11. Documentar
```

---

## ⚠️ Reglas Críticas

1. **NUNCA** depender solo de `sequelize.sync()` para producción
2. **SIEMPRE** crear migración para cambios de BD
3. **SIEMPRE** verificar que migración es idempotente (puede ejecutarse múltiples veces)
4. **SIEMPRE** probar endpoints antes de pasar al frontend
5. **SIEMPRE** ejecutar pruebas antes de deploy
6. **NUNCA** hacer deploy sin verificar estado de migraciones
