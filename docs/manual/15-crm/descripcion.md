# 🤝 Módulo de CRM - Descripción

## ¿Qué hace este módulo?

El módulo de **CRM** (Customer Relationship Management) gestiona las relaciones con clientes. Permite administrar clientes, contactos, oportunidades de venta, cotizaciones y actividades comerciales.

## Funcionalidades Principales

### 1. Gestión de Clientes
- **Registrar** clientes (empresas o personas)
- **Categorizar** por tipo y segmento
- **Gestionar** contactos múltiples
- **Historial** de interacciones

### 2. Oportunidades de Venta
- **Crear** oportunidades comerciales
- **Pipeline** de ventas
- **Seguimiento** de etapas
- **Probabilidad** de cierre

### 3. Cotizaciones
- **Generar** cotizaciones
- **Items** con precios
- **Enviar** a clientes
- **Convertir** a proyectos/órdenes

### 4. Actividades
- **Registrar** llamadas, reuniones, emails
- **Programar** seguimientos
- **Historial** de interacciones

### 5. Dashboard CRM
- **Pipeline** de oportunidades
- **KPIs** de ventas
- **Actividades** pendientes

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Client` | Clientes |
| `ClientContact` | Contactos del cliente |
| `Opportunity` | Oportunidades de venta |
| `CrmQuote` | Cotizaciones |
| `CrmQuoteItem` | Items de cotización |
| `CrmActivity` | Actividades comerciales |

## Estados del Cliente

| Estado | Color | Descripción |
|--------|-------|-------------|
| **PROSPECT** | Azul | Prospecto |
| **ACTIVE** | Verde | Cliente activo |
| **INACTIVE** | Gris | Cliente inactivo |
| **SUSPENDED** | Rojo | Cliente suspendido |

## Categorías de Cliente

| Categoría | Descripción |
|-----------|-------------|
| **A** | Premium - Alto valor |
| **B** | Regular - Valor medio |
| **C** | Ocasional - Bajo valor |
| **D** | Nuevo - Sin historial |

## Tipos de Cliente

| Tipo | Descripción |
|------|-------------|
| **COMPANY** | Empresa/Organización |
| **INDIVIDUAL** | Persona natural |

## Estados de Oportunidad

| Estado | Color | Descripción |
|--------|-------|-------------|
| **NEW** | Azul | Nueva oportunidad |
| **QUALIFIED** | Celeste | Calificada |
| **PROPOSAL** | Naranja | En propuesta |
| **NEGOTIATION** | Morado | En negociación |
| **WON** | Verde | Ganada |
| **LOST** | Rojo | Perdida |

## Campos del Cliente

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `name` | String | Nombre/Razón social |
| `clientType` | Enum | COMPANY, INDIVIDUAL |
| `taxId` | String | RIF/Cédula |
| `email` | String | Email principal |
| `phone` | String | Teléfono |
| `address` | String | Dirección |
| `category` | Enum | A, B, C, D |
| `status` | Enum | Estado |
| `industry` | String | Industria/Sector |
| `website` | String | Sitio web |
| `notes` | Text | Notas |

## Campos de Oportunidad

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `name` | String | Nombre de la oportunidad |
| `clientId` | UUID | Cliente |
| `value` | Decimal | Valor estimado |
| `currency` | String | Moneda |
| `probability` | Integer | Probabilidad (0-100) |
| `expectedCloseDate` | Date | Fecha esperada de cierre |
| `stage` | Enum | Etapa del pipeline |
| `status` | Enum | Estado |
| `assignedToId` | UUID | Responsable |
| `source` | String | Origen del lead |
| `description` | Text | Descripción |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                           CRM                                │
│  (Clientes, Oportunidades, Cotizaciones, Actividades)       │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  PROYECTOS    │    │   PROCURA     │    │   FINANZAS    │
│ - Proyectos   │    │ - Órdenes de  │    │ - Facturación │
│   del cliente │    │   venta       │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/crm` | Dashboard | Dashboard CRM |
| `/crm/clients` | Lista | Lista de clientes |
| `/crm/clients/new` | Formulario | Crear cliente |
| `/crm/clients/:id` | Detalle | Detalle del cliente |
| `/crm/clients/:id/edit` | Formulario | Editar cliente |
| `/crm/opportunities` | Lista | Lista de oportunidades |
| `/crm/opportunities/new` | Formulario | Crear oportunidad |
| `/crm/opportunities/:id` | Detalle | Detalle de oportunidad |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `crm:read` | Ver clientes y oportunidades |
| `crm:create` | Crear clientes y oportunidades |
| `crm:update` | Editar clientes y oportunidades |
| `crm:delete` | Eliminar registros |

## Ejemplos de Uso

### Caso 1: Registrar Nuevo Cliente
1. Ir a CRM → Clientes → Nuevo
2. Seleccionar tipo (Empresa/Persona)
3. Completar datos de contacto
4. Asignar categoría
5. Guardar

### Caso 2: Crear Oportunidad
1. Ir a CRM → Oportunidades → Nueva
2. Seleccionar cliente
3. Definir valor y probabilidad
4. Asignar responsable
5. Guardar

### Caso 3: Seguimiento de Pipeline
1. Ir al Dashboard CRM
2. Ver oportunidades por etapa
3. Actualizar etapas según avance
4. Registrar actividades

## Screenshots

- `screenshots/dashboard.png` - Dashboard CRM
- `screenshots/clientes-lista.png` - Lista de clientes
- `screenshots/cliente-detalle.png` - Detalle del cliente
- `screenshots/oportunidades.png` - Pipeline de oportunidades
