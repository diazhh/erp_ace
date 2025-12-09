# 🤖 Contexto para Windsurf AI - ERP System

**Usa este archivo al inicio de cada conversación para dar contexto al asistente.**

---

## 📁 Archivos a Leer para Contexto

```
docs/ROADMAP.md                    # Plan de desarrollo y progreso actual
docs/ARQUITECTURA_TRAZABILIDAD.md  # Diseño de vistas, UI/UX y relaciones
README.md                          # Visión general del proyecto
```

## ⚠️ REGLAS CRÍTICAS DE UI/UX

### 1. NO usar modales para edición
- **Crear/Editar** → Página completa (`/entity/new`, `/entity/:id/edit`)
- **Modales solo para**: Confirmaciones, alertas, previews rápidos
- Razón: Mejor UX, más espacio, responsive nativo

### 2. 100% Responsive
- Mobile-first design
- Usar Grid con breakpoints: `xs`, `sm`, `md`, `lg`
- Tablas → Cards en mobile
- Sidebar colapsable en mobile
- Formularios en columna única en mobile

### 3. Patrón de Páginas
```
/entity              → Lista (tabla/cards)
/entity/new          → Formulario de creación (página completa)
/entity/:id          → Vista detalle con tabs
/entity/:id/edit     → Formulario de edición (página completa)
```

### 4. Componentes Responsive
```jsx
// Grid responsive
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>...</Grid>
</Grid>

// Tabla → Cards en mobile
{isMobile ? <CardList data={data} /> : <DataTable data={data} />}

// useMediaQuery
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
```

## 🔑 Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | Admin123! | Administrador (todos los permisos) |

## 🌐 URLs de Desarrollo

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| PostgreSQL | localhost:5433 |

## 🧪 Ejecutar Pruebas

```bash
cd backend && bash tests/api-tests.sh
```

## 📊 Estado Actual del Proyecto

- **Versión**: 0.13.0
- **Módulos completados**: Setup, Empleados, Nómina, Finanzas, Caja Chica, Proyectos, Inventario, Flota, Procura, HSE, Documentos, Dashboard, Usuarios/Permisos
- **Nuevo**: Sistema de Archivos Adjuntos (Attachments)

### Sistema de Archivos Adjuntos (v0.13.0)
- **Modelo centralizado**: `Attachment` con relación polimórfica
- **Tipos de entidad soportados**: transaction, petty_cash_entry, vehicle_maintenance, fuel_log, contractor_payment, project_expense, project, incident, inspection, quote, purchase_order, contractor_invoice, inventory_movement, loan_payment, employee_document, training
- **Categorías**: RECEIPT, INVOICE, PHOTO, BEFORE, AFTER, PROGRESS, EVIDENCE, DOCUMENT, CONTRACT, REPORT, OTHER
- **Características**:
  - Upload con drag & drop (react-dropzone)
  - Thumbnails automáticos para imágenes (sharp)
  - Galería con lightbox
  - Máximo 10MB por archivo, 10 archivos por request
- **Componentes Frontend**:
  - `FileUpload` - Zona de drop con preview
  - `AttachmentGallery` - Galería de archivos
  - `AttachmentSection` - Componente combinado para vistas de detalle
- **API Endpoints**:
  - `POST /api/attachments/:entityType/:entityId` - Subir archivos
  - `GET /api/attachments/:entityType/:entityId` - Listar archivos
  - `DELETE /api/attachments/:id` - Eliminar archivo
  - `GET /api/attachments/catalogs` - Catálogos

### Módulo de Inventario (v0.8.0)
- **Almacenes**: MAIN, SECONDARY, TRANSIT, PROJECT
- **Items**: Productos, Materiales, Herramientas, Equipos, Consumibles, Repuestos
- **Movimientos**: Entrada, Salida, Transferencia, Ajustes, Devolución
- **Integración con Finanzas**: Compras generan transacciones automáticas
- **Rutas Frontend**:
  - `/inventory` → Lista de items
  - `/inventory/warehouses` → Lista de almacenes
  - `/inventory/movements` → Lista de movimientos

---

## 🎯 Principios de Desarrollo

### 1. Trazabilidad Total
Cada entidad debe mostrar todas sus relaciones. Ejemplo:
- Empleado → ver nómina, préstamos, proyectos, vehículo
- Proyecto → ver equipo, finanzas, inventario, vehículos

### 2. Vistas de Detalle
Cada entidad principal tiene página `/entity/:id` con:
- Header con información clave y estado
- Tabs para cada relación
- Enlaces navegables a otras entidades

### 3. Dashboards con KPIs
Cada módulo tiene dashboard con:
- Cards de KPIs (métricas clave)
- Gráficos (Recharts o MUI X Charts)
- Widgets de alertas y actividad

### 4. Multi-idioma
- Idioma por defecto: **Español (es)**
- Soportados: ES, EN, PT
- Usuario puede cambiar en `/settings`
- Preferencia guardada en BD y localStorage

### 5. Pruebas Obligatorias
Cada endpoint debe probarse antes de considerar completo:
```bash
# Autenticación para pruebas
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Ejemplo de prueba
curl http://localhost:5000/api/employees -H "Authorization: Bearer $TOKEN"
```

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite + Material UI + Redux Toolkit |
| Backend | Node.js + Express + Sequelize |
| Base de Datos | PostgreSQL 16 (Docker) |
| Autenticación | JWT + RBAC |
| i18n | i18next |

---

## 📂 Estructura del Proyecto

```
erp/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/        # Autenticación y usuarios
│   │   │   ├── employees/   # Gestión de empleados
│   │   │   ├── payroll/     # Nómina y préstamos
│   │   │   ├── finance/     # Cuentas y transacciones
│   │   │   ├── petty-cash/  # Caja chica
│   │   │   ├── projects/    # Proyectos y contratistas
│   │   │   └── inventory/   # Inventario y almacenes
│   │   └── database/
│   │       └── models/      # Modelos Sequelize
│   └── tests/
│       └── api-tests.sh     # Script de pruebas
├── frontend/
│   ├── src/
│   │   ├── pages/           # Páginas por módulo
│   │   ├── components/      # Componentes reutilizables
│   │   ├── store/slices/    # Redux slices por módulo
│   │   └── i18n/locales/    # Traducciones (es, en, pt)
└── docs/
    ├── ROADMAP.md
    └── ARQUITECTURA_TRAZABILIDAD.md
```

---

## 🔄 Flujo de Trabajo

1. **Leer ROADMAP.md** para ver qué sigue
2. **Implementar backend** (modelo, servicio, controlador, rutas)
3. **Probar endpoints** con curl o script
4. **Implementar frontend** (slice, páginas, componentes)
5. **Agregar traducciones** en es.json, en.json, pt.json
6. **Actualizar ROADMAP.md** con progreso

---

## ⚠️ Reglas Importantes

1. **Siempre probar endpoints** antes de pasar al frontend
2. **Siempre agregar traducciones** para textos nuevos
3. **Seguir patrón de trazabilidad** en vistas de detalle
4. **Usar componentes existentes** antes de crear nuevos
5. **Mantener consistencia** con el código existente
6. **Actualizar documentación** al completar funcionalidades
7. **NO MODALES para crear/editar** → usar páginas completas
8. **100% RESPONSIVE** → probar en mobile antes de commit
9. **Leer ARQUITECTURA_TRAZABILIDAD.md** para diseño de interfaces

---

## 🚀 Comandos Útiles

```bash
# Iniciar desarrollo
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2

# Ver logs
tail -f backend/logs/combined.log

# Reiniciar BD (⚠️ borra datos)
docker-compose down -v && docker-compose up -d
cd backend && node src/database/seed.js

# Ejecutar pruebas
cd backend && bash tests/api-tests.sh
```

---

## 🚀 Deploy a Producción

### Servidor de Producción
| Parámetro | Valor |
|-----------|-------|
| IP | 144.126.150.120 |
| Hostname | vmi1759824.contaboserver.net |
| SSH Alias | `ssh 144` |
| Ruta Proyecto | `/var/proyectos/erp_ace` |
| Backend Port | 5003 |
| Frontend Port | 5004 |

### URLs de Producción
- **Backend**: http://144.126.150.120:5003
- **Frontend**: http://144.126.150.120:5004

### Comando de Deploy
```bash
# Deploy completo (git pull + build + restart PM2)
bash scripts/deploy-production.sh
```

### ⚠️ REGLA DE DEPLOY PARA WINDSURF
**Cuando el usuario pida hacer deploy a producción, ejecutar:**
```bash
bash scripts/deploy-production.sh
```

Este script automáticamente:
1. Conecta vía SSH al servidor 144
2. Hace `git pull origin main`
3. Instala dependencias del backend (`npm install --production`)
4. Compila el frontend (`npm install && npm run build`)
5. Reinicia PM2 backend (`pm2 restart erp-backend`)
6. Reinicia PM2 frontend (`pm2 restart erp-frontend`)

### PM2 en Producción
```bash
# Ver estado
ssh 144 "pm2 list | grep erp"

# Ver logs
ssh 144 "pm2 logs erp-backend --lines 50"
ssh 144 "pm2 logs erp-frontend --lines 50"

# Reiniciar manualmente
ssh 144 "pm2 restart erp-backend erp-frontend"
```

---

## 📝 Al Continuar una Conversación

Menciona:
1. Qué módulo/funcionalidad estabas trabajando
2. Si hubo algún error pendiente
3. Qué quieres hacer ahora

Ejemplo:
> "Continúa con el módulo de Caja Chica. En la conversación anterior completamos Finanzas."
