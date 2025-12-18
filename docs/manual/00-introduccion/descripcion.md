# 📖 Introducción al ERP - Descripción

## ¿Qué es el ERP?

El **ERP Corporación ACE** es un sistema integral de gestión empresarial diseñado específicamente para empresas del sector petrolero (upstream/midstream). Permite administrar todos los procesos operativos, financieros y administrativos desde una única plataforma.

## ¿Para quién es?

Este sistema está diseñado para:

- **Empresas petroleras medianas** con operaciones de exploración y producción
- **Gerentes y supervisores** que necesitan visibilidad de todas las operaciones
- **Personal administrativo** que gestiona empleados, nómina y finanzas
- **Personal operativo** que registra producción, mantenimientos e incidentes
- **Equipos de HSE** que controlan seguridad industrial y cumplimiento

## Funcionalidades Principales

### Módulos Core ERP
| Módulo | Descripción |
|--------|-------------|
| **Empleados** | Gestión de personal, documentos, cuentas bancarias |
| **Organización** | Departamentos, cargos, organigrama |
| **Nómina** | Períodos de pago, deducciones, préstamos |
| **Finanzas** | Cuentas bancarias, transacciones, tasas de cambio |
| **Caja Chica** | Fondos menores, gastos, reembolsos |
| **Proyectos** | Gestión de proyectos, contratistas, valuaciones |
| **Inventario** | Almacenes, items, movimientos de stock |
| **Flota** | Vehículos, mantenimientos, combustible |
| **Procura** | Cotizaciones, órdenes de compra |
| **HSE** | Incidentes, inspecciones, capacitaciones |
| **Documentos** | Gestión documental con versionamiento |
| **Activos Fijos** | Equipos, depreciación, transferencias |
| **CRM** | Clientes, oportunidades, cotizaciones |
| **Control de Calidad** | Inspecciones, no conformidades, CAPA |

### Módulos Específicos Oil & Gas
| Módulo | Descripción |
|--------|-------------|
| **Producción** | Campos, pozos, producción diaria, allocations |
| **AFE** | Autorizaciones de gasto de capital |
| **Contratos O&G** | Contratos petroleros, working interest, regalías |
| **Compliance** | Reportes regulatorios, permisos ambientales |
| **JIB** | Joint Interest Billing, cash calls |
| **Permisos de Trabajo** | Permisos en caliente, altura, espacios confinados |

## Características del Sistema

### Multi-idioma
El sistema soporta 3 idiomas:
- 🇪🇸 **Español** (idioma por defecto)
- 🇺🇸 **Inglés**
- 🇧🇷 **Portugués**

### Responsive
- Funciona en **desktop**, **tablet** y **móvil**
- Las tablas se convierten en tarjetas en pantallas pequeñas
- Menú lateral colapsable

### Seguridad
- Autenticación con **JWT**
- Sistema de **roles y permisos** granulares
- Auditoría de acciones

### Trazabilidad Total
Cada entidad muestra todas sus relaciones:
- Desde un empleado: ver su nómina, préstamos, proyectos, vehículos
- Desde un proyecto: ver equipo, gastos, hitos, documentos
- Desde un vehículo: ver asignaciones, mantenimientos, combustible

## Requisitos del Sistema

### Para usar el sistema
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet
- Credenciales de acceso proporcionadas por el administrador

### Resolución recomendada
- **Desktop**: 1920x1080 o superior
- **Tablet**: 768x1024 o superior
- **Móvil**: 375x667 o superior

## Relación entre Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                        DASHBOARD                             │
│  (Vista consolidada de KPIs de todos los módulos)           │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   EMPLEADOS   │◄──►│   PROYECTOS   │◄──►│  PRODUCCIÓN   │
│   - Nómina    │    │   - Gastos    │    │   - Campos    │
│   - Préstamos │    │   - Hitos     │    │   - Pozos     │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   FINANZAS    │◄──►│  INVENTARIO   │◄──►│     AFE       │
│   - Cuentas   │    │   - Items     │    │   - Gastos    │
│   - Transacc. │    │   - Almacenes │    │   - Aprob.    │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌───────────────┐
                    │   REPORTES    │
                    │   - PDF/Excel │
                    │   - Dashboard │
                    └───────────────┘
```

## Screenshots

- `screenshots/login.png` - Página de inicio de sesión
- `screenshots/dashboard.png` - Dashboard principal
- `screenshots/menu-lateral.png` - Menú de navegación
