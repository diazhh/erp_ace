# 🗺️ ROADMAP - ERP Sistema de Gestión Empresarial

**Última actualización:** 2025-12-04  
**Versión actual:** 0.2.0

---

## 📊 Resumen de Progreso General

| Sprint | Módulo | Estado | Progreso |
|--------|--------|--------|----------|
| Sprint 0 | Setup & Fundamentos | ✅ Completado | 100% |
| Sprint 1 | Empleados | ✅ Completado | 100% |
| Sprint 2 | Nómina | ✅ Completado | 100% |
| Sprint 3 | Finanzas | 🔲 Pendiente | 0% |
| Sprint 4 | Caja Chica | 🔲 Pendiente | 0% |
| Sprint 5 | Proyectos | 🔲 Pendiente | 0% |
| Sprint 6 | Inventario | 🔲 Pendiente | 0% |
| Sprint 7 | Flota | 🔲 Pendiente | 0% |
| Sprint 8 | Procura | 🔲 Pendiente | 0% |
| Sprint 9 | HSE | 🔲 Pendiente | 0% |
| Sprint 10 | Documentos | 🔲 Pendiente | 0% |
| Sprint 11 | Reportes | 🔲 Pendiente | 0% |

**Progreso Total del Proyecto: ~25%**

```
[████████░░░░░░░░░░░░░░░░░░░░░░] 25%
```

---

## ✅ SPRINT 0 - Setup y Fundamentos (100%)

### Infraestructura
- [x] Docker Compose con PostgreSQL 16 (puerto 5433)
- [x] Estructura de proyecto backend (Node.js + Express)
- [x] Estructura de proyecto frontend (React + Vite + MUI)
- [x] Configuración de variables de entorno

### Backend Base
- [x] Conexión a base de datos con Sequelize
- [x] Sistema de logging (Winston)
- [x] Manejo de errores centralizado
- [x] Middleware de autenticación JWT
- [x] Middleware de autorización RBAC

### Frontend Base
- [x] Configuración de Redux Toolkit
- [x] Configuración de React Router
- [x] Tema Material UI personalizado
- [x] Layout principal con sidebar
- [x] Página de Login
- [x] Dashboard inicial

### Autenticación y Seguridad
- [x] Modelo de Usuario
- [x] Modelo de Rol
- [x] Modelo de Permiso
- [x] Relaciones many-to-many (User-Role, Role-Permission)
- [x] Login con JWT
- [x] Endpoint /me para obtener usuario actual
- [x] Logout
- [x] Cambio de contraseña
- [x] Seeders con roles y permisos iniciales

### Internacionalización
- [x] Configuración i18next
- [x] Traducciones en Español
- [x] Traducciones en Inglés
- [x] Traducciones en Portugués
- [x] Selector de idioma en UI
- [x] Persistencia de preferencia en localStorage

### Auditoría
- [x] Modelo AuditLog
- [x] Registro de login/logout
- [x] Registro de cambios de contraseña

---

## ✅ SPRINT 1 - Módulo de Empleados (100%)

### Backend
- [x] Modelo Employee (datos personales, laborales, bancarios)
- [x] Modelo EmployeeDocument (documentos con vencimiento)
- [x] Controlador CRUD completo
- [x] Rutas protegidas con permisos
- [x] Endpoint de estadísticas
- [x] Paginación y búsqueda
- [x] Soft delete (paranoid)

### Frontend
- [x] Página de listado de empleados
- [x] Tabla con paginación
- [x] Búsqueda por nombre/cédula
- [x] Formulario de creación/edición
- [x] Diálogo de confirmación de eliminación
- [x] Integración con Redux
- [x] Traducciones del módulo

### Campos del Empleado
- [x] Datos personales (nombre, cédula, fecha nacimiento, género, etc.)
- [x] Datos de contacto (email, teléfono, dirección)
- [x] Contacto de emergencia
- [x] Datos laborales (cargo, departamento, fecha ingreso, tipo contrato)
- [x] Datos bancarios (banco, cuenta, tipo cuenta)
- [x] Datos de nómina (salario base, moneda, frecuencia de pago)
- [x] Seguridad social (SSO, RIF)
- [x] Estado (activo, inactivo, licencia, terminado)

---

## ✅ SPRINT 2 - Módulo de Nómina (100%)

### Backend - Modelos
- [x] PayrollPeriod (períodos de nómina)
- [x] PayrollEntry (entradas por empleado)
- [x] EmployeeLoan (préstamos a empleados)
- [x] LoanPayment (pagos de préstamos)
- [x] Asociaciones entre modelos

### Backend - Lógica de Negocio
- [x] Servicio de cálculo de nómina
- [x] Generación automática de código de período
- [x] Cálculo de deducciones legales venezolanas:
  - [x] SSO (4%)
  - [x] RPE (0.5%)
  - [x] FAOV (1%)
  - [x] ISLR (simplificado)
- [x] Cálculo proporcional por días trabajados
- [x] Gestión de préstamos con cuotas
- [x] Descuento automático de préstamos al pagar

### Backend - API
- [x] CRUD de períodos de nómina
- [x] Generar entradas de nómina
- [x] Aprobar período
- [x] Marcar período como pagado
- [x] Editar entradas individuales
- [x] CRUD de préstamos
- [x] Aprobar/cancelar préstamos
- [x] Estadísticas de nómina

### Frontend - Períodos
- [x] Página de listado de períodos
- [x] Tarjetas de estadísticas
- [x] Filtros por estado y año
- [x] Formulario de creación/edición
- [x] Página de detalle de período
- [x] Tabla de entradas por empleado
- [x] Acciones: Generar, Aprobar, Pagar

### Frontend - Préstamos
- [x] Página de listado de préstamos
- [x] Formulario de creación
- [x] Diálogo de detalle con historial de pagos
- [x] Barra de progreso de pago
- [x] Acciones: Aprobar, Cancelar

### Frontend - Edición de Entradas
- [x] Diálogo de edición de entrada
- [x] Campos de días trabajados
- [x] Campos de ingresos adicionales (horas extra, bonos, comisiones)
- [x] Campos de deducciones adicionales
- [x] Selección de método de pago

### Traducciones
- [x] Español completo
- [x] Inglés completo
- [x] Portugués completo

---

## 🔲 SPRINT 3 - Módulo de Finanzas (0%)

### Backend - Por hacer
- [ ] Modelo BankAccount (cuentas bancarias)
- [ ] Modelo CryptoWallet (wallets de criptomonedas)
- [ ] Modelo Transaction (transacciones)
- [ ] Modelo TransactionCategory (categorías)
- [ ] Controlador de cuentas bancarias
- [ ] Controlador de transacciones
- [ ] Conciliación bancaria
- [ ] Soporte multi-moneda (USD, VES, USDT)

### Frontend - Por hacer
- [ ] Página de cuentas bancarias
- [ ] Página de wallets crypto
- [ ] Página de transacciones
- [ ] Formularios CRUD
- [ ] Dashboard financiero
- [ ] Gráficos de ingresos/egresos

### Funcionalidades Clave
- [ ] Registro de ingresos con comprobante
- [ ] Registro de egresos con comprobante
- [ ] Transferencias entre cuentas
- [ ] Conciliación bancaria
- [ ] Tasas de cambio
- [ ] Reportes financieros

---

## 🔲 SPRINT 4 - Módulo de Caja Chica (0%)

### Backend - Por hacer
- [ ] Modelo PettyCashEntry (entradas de caja chica)
- [ ] Modelo PettyCashExpense (gastos/compras)
- [ ] Modelo EmployeeBalance (balance por empleado)
- [ ] Flujo de aprobación de gastos
- [ ] Conciliación de caja chica

### Frontend - Por hacer
- [ ] Dashboard de caja chica
- [ ] Registro de entradas
- [ ] Registro de compras por empleados
- [ ] Aprobación de gastos
- [ ] Pagos a empleados
- [ ] Conciliación

### Funcionalidades Clave
- [ ] Registro de fondos de caja chica
- [ ] Compras menores por empleados
- [ ] Aprobación de reembolsos
- [ ] Balance por empleado
- [ ] Conciliación física vs teórica
- [ ] Alertas de discrepancias

---

## 🔲 SPRINT 5 - Módulo de Proyectos (0%)

### Backend - Por hacer
- [ ] Modelo Project
- [ ] Modelo ProjectMilestone (hitos)
- [ ] Modelo ProjectCost (costos)
- [ ] Modelo ProjectPayment (pagos)
- [ ] Modelo ProjectDocument (documentos)
- [ ] Modelo ProjectProgress (avances con fotos)

### Frontend - Por hacer
- [ ] Listado de proyectos
- [ ] Detalle de proyecto con dashboard
- [ ] Registro de avances con fotos
- [ ] Gestión de costos
- [ ] Gestión de pagos
- [ ] Timeline de hitos

### Funcionalidades Clave
- [ ] Creación de proyectos con contratistas
- [ ] Registro de avance con evidencia fotográfica
- [ ] Comparación presupuesto vs real
- [ ] Pagos a contratistas
- [ ] Pagos de clientes
- [ ] Documentación versionada
- [ ] Alertas de sobrecostos

---

## 🔲 SPRINT 6 - Módulo de Inventario (0%)

### Por hacer
- [ ] Modelo Warehouse (almacenes)
- [ ] Modelo Product (productos)
- [ ] Modelo InventoryMovement (movimientos)
- [ ] Modelo StockLevel (niveles de stock)
- [ ] Entradas y salidas de inventario
- [ ] Transferencias entre almacenes
- [ ] Alertas de stock mínimo

---

## 🔲 SPRINT 7 - Módulo de Flota (0%)

### Por hacer
- [ ] Modelo Vehicle (vehículos)
- [ ] Modelo VehicleMaintenance (mantenimientos)
- [ ] Modelo FuelLog (registro de combustible)
- [ ] Modelo VehicleAssignment (asignaciones)
- [ ] Programación de mantenimientos
- [ ] Costos operativos por vehículo
- [ ] Alertas de vencimientos

---

## 🔲 SPRINT 8 - Módulo de Procura (0%)

### Por hacer
- [ ] Modelo Supplier (proveedores)
- [ ] Modelo PurchaseRequest (solicitudes)
- [ ] Modelo PurchaseOrder (órdenes de compra)
- [ ] Modelo SupplierEvaluation (evaluaciones)
- [ ] Flujo de aprobación de compras
- [ ] Comparación de cotizaciones
- [ ] Recepción de mercancía

---

## 🔲 SPRINT 9 - Módulo HSE (0%)

### Por hacer
- [ ] Modelo Incident (incidentes)
- [ ] Modelo SafetyInspection (inspecciones)
- [ ] Modelo Training (capacitaciones)
- [ ] Modelo PPE (equipos de protección)
- [ ] Registro de incidentes
- [ ] Inspecciones de seguridad
- [ ] Control de EPP
- [ ] Capacitaciones

---

## 🔲 SPRINT 10 - Módulo de Documentos (0%)

### Por hacer
- [ ] Modelo Document (documentos)
- [ ] Modelo DocumentVersion (versiones)
- [ ] Modelo DocumentCategory (categorías)
- [ ] Almacenamiento de archivos
- [ ] Versionamiento de documentos
- [ ] Búsqueda de documentos
- [ ] Permisos por documento

---

## 🔲 SPRINT 11 - Reportes y Dashboard (0%)

### Por hacer
- [ ] Dashboard ejecutivo
- [ ] Reportes de nómina (PDF, Excel)
- [ ] Reportes financieros
- [ ] Reportes de proyectos
- [ ] Reportes de inventario
- [ ] Exportación a PDF/Excel
- [ ] Gráficos y visualizaciones

---

## 🔧 Mejoras Técnicas Pendientes

### Seguridad
- [ ] Rate limiting
- [ ] Encriptación de datos sensibles (AES-256)
- [ ] Auditoría completa de acciones
- [ ] Bloqueo por intentos fallidos

### Performance
- [ ] Caché con Redis
- [ ] Optimización de consultas
- [ ] Lazy loading de componentes
- [ ] Compresión de imágenes

### DevOps
- [ ] CI/CD Pipeline
- [ ] Docker para producción
- [ ] Backups automáticos
- [ ] Monitoreo con Sentry

### UX/UI
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Accesibilidad (WCAG)

---

## 📅 Historial de Versiones

### v0.2.0 (2025-12-04)
- ✅ Módulo de Nómina completo
- ✅ Gestión de préstamos a empleados
- ✅ Cálculos de deducciones venezolanas

### v0.1.0 (2025-12-04)
- ✅ Setup inicial del proyecto
- ✅ Autenticación y autorización
- ✅ Sistema multi-idioma
- ✅ Módulo de Empleados

---

## 📝 Notas

### Servicios Activos
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173
- **PostgreSQL:** localhost:5433

### Credenciales de Desarrollo
- **Usuario:** admin
- **Contraseña:** Admin123!

### Comandos Útiles
```bash
# Iniciar PostgreSQL
docker-compose up -d

# Iniciar Backend
cd backend && npm run dev

# Iniciar Frontend
cd frontend && npm run dev

# Ejecutar seeders
cd backend && node src/database/seed.js
```
