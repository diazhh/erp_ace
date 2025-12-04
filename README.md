# ERP - Sistema de Gestión Empresarial

Sistema ERP completo para empresa de servicios petroleros en Venezuela.

**Versión:** 0.3.0  
**Última actualización:** 2025-12-04

## 📊 Progreso del Proyecto

| Módulo | Estado |
|--------|--------|
| Setup & Fundamentos | ✅ 100% |
| Empleados | ✅ 100% |
| Nómina | ✅ 100% |
| Finanzas | ✅ 100% |
| Caja Chica | 🔲 0% |
| Proyectos | 🔲 0% |
| Inventario | 🔲 0% |
| Flota | 🔲 0% |

Ver [ROADMAP.md](docs/ROADMAP.md) para detalles completos.

## Stack Tecnológico

- **Backend:** Node.js + Express + Sequelize
- **Frontend:** React + Vite + Material UI + Redux Toolkit
- **Base de Datos:** PostgreSQL 16 (Docker)
- **Autenticación:** JWT + RBAC
- **Internacionalización:** i18next (Español, English, Português)

## Requisitos

- Node.js >= 18
- Docker y Docker Compose
- npm o yarn

## Inicio Rápido

### 1. Levantar PostgreSQL con Docker

```bash
docker-compose up -d
```

> **Nota:** PostgreSQL corre en el puerto **5433** (el 5432 estaba ocupado)

### 2. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Iniciar el Backend

```bash
cd backend
npm run dev
```

El servidor estará en: http://localhost:5000

### 4. Iniciar el Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará en: http://localhost:5173

## Credenciales por Defecto

- **Usuario:** admin
- **Contraseña:** Admin123!

## Estructura del Proyecto

```
erp/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración
│   │   ├── database/        # Modelos, migraciones, seeders
│   │   ├── modules/         # Módulos del sistema
│   │   │   ├── auth/        # Autenticación
│   │   │   ├── audit/       # Auditoría
│   │   │   ├── employees/   # Gestión de empleados
│   │   │   ├── payroll/     # Nómina y préstamos
│   │   │   └── finance/     # Finanzas (cuentas, transacciones)
│   │   └── shared/          # Utilidades compartidas
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── i18n/            # Internacionalización
│   │   │   └── locales/     # Traducciones (es, en, pt)
│   │   ├── pages/           # Páginas
│   │   ├── services/        # Servicios API
│   │   └── store/           # Redux store
│   └── package.json
├── docker-compose.yml
└── docs/                    # Documentación del proyecto
```

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/auth/me | Obtener usuario actual |
| POST | /api/auth/logout | Cerrar sesión |
| POST | /api/auth/change-password | Cambiar contraseña |

### Empleados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/employees | Listar empleados |
| POST | /api/employees | Crear empleado |
| GET | /api/employees/:id | Obtener empleado |
| PUT | /api/employees/:id | Actualizar empleado |
| DELETE | /api/employees/:id | Eliminar empleado |
| GET | /api/employees/stats | Estadísticas de empleados |

### Nómina

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/payroll/stats | Estadísticas de nómina |
| GET | /api/payroll/periods | Listar períodos |
| POST | /api/payroll/periods | Crear período |
| GET | /api/payroll/periods/:id | Obtener período con entradas |
| PUT | /api/payroll/periods/:id | Actualizar período |
| DELETE | /api/payroll/periods/:id | Eliminar período (solo borrador) |
| POST | /api/payroll/periods/:id/generate | Generar entradas de nómina |
| POST | /api/payroll/periods/:id/approve | Aprobar período |
| POST | /api/payroll/periods/:id/pay | Marcar como pagado |
| PUT | /api/payroll/entries/:id | Editar entrada de nómina |

### Préstamos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/payroll/loans | Listar préstamos |
| POST | /api/payroll/loans | Crear préstamo |
| GET | /api/payroll/loans/:id | Obtener préstamo con pagos |
| POST | /api/payroll/loans/:id/approve | Aprobar préstamo |
| POST | /api/payroll/loans/:id/cancel | Cancelar préstamo |

### Finanzas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/finance/stats | Estadísticas financieras |
| GET | /api/finance/accounts | Listar cuentas bancarias |
| POST | /api/finance/accounts | Crear cuenta |
| GET | /api/finance/accounts/:id | Obtener cuenta con transacciones |
| PUT | /api/finance/accounts/:id | Actualizar cuenta |
| DELETE | /api/finance/accounts/:id | Eliminar cuenta |
| GET | /api/finance/transactions | Listar transacciones |
| POST | /api/finance/transactions | Crear transacción (ingreso/gasto) |
| GET | /api/finance/transactions/:id | Obtener transacción |
| POST | /api/finance/transactions/:id/cancel | Cancelar transacción |
| POST | /api/finance/transactions/:id/reconcile | Conciliar transacción |
| POST | /api/finance/transfers | Crear transferencia entre cuentas |
| GET | /api/finance/exchange-rates | Listar tasas de cambio |
| POST | /api/finance/exchange-rates | Crear tasa de cambio |
| GET | /api/finance/categories | Listar categorías |

## Variables de Entorno

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=erp_db
DB_USER=erp_user
DB_PASSWORD=erp_password_dev_2024
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=8h
```

## Comandos Útiles

```bash
# Ver logs de PostgreSQL
docker-compose logs -f postgres

# Reiniciar base de datos
docker-compose down -v
docker-compose up -d

# Ejecutar seeders
cd backend
node src/database/seed.js
```

## Idiomas Soportados

El sistema soporta los siguientes idiomas:

| Código | Idioma | Bandera |
|--------|--------|---------|
| es | Español | 🇪🇸 |
| en | English | 🇺🇸 |
| pt | Português | 🇧🇷 |

El idioma se puede cambiar desde el selector en la barra superior o en la página de login. La preferencia se guarda en localStorage.

### Agregar traducciones

Los archivos de traducción están en `frontend/src/i18n/locales/`:
- `es.json` - Español
- `en.json` - English  
- `pt.json` - Português

## 🧪 Pruebas

Ejecutar pruebas de API:

```bash
cd backend
bash tests/api-tests.sh
```

## 📚 Documentación

- [ROADMAP.md](docs/ROADMAP.md) - Plan de desarrollo y progreso
- [ARQUITECTURA_TRAZABILIDAD.md](docs/ARQUITECTURA_TRAZABILIDAD.md) - Diseño de trazabilidad
- [PLANIFICACION_ERP_COMPLETA.md](docs/PLANIFICACION_ERP_COMPLETA.md) - Planificación técnica
- [WINDSURF_CONTEXT.md](WINDSURF_CONTEXT.md) - Contexto para asistente AI

## 🔗 Principio de Trazabilidad

El sistema está diseñado para que **cada entidad tenga visibilidad completa de sus relaciones**:

- Desde un **Empleado** se puede ver: nómina, préstamos, proyectos, vehículo asignado
- Desde un **Proyecto** se puede ver: equipo, finanzas, vehículos, inventario
- Desde una **Cuenta** se puede ver: transacciones, pagos de nómina, gastos de proyectos

Ver [ARQUITECTURA_TRAZABILIDAD.md](docs/ARQUITECTURA_TRAZABILIDAD.md) para más detalles.
