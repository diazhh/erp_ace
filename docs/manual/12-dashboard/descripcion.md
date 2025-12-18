# 📊 Módulo de Dashboard - Descripción

## ¿Qué hace este módulo?

El módulo de **Dashboard** proporciona una vista ejecutiva del estado general de la empresa. Muestra KPIs clave, gráficos de tendencias, alertas y accesos rápidos a los módulos más importantes.

## Funcionalidades Principales

### 1. KPIs Ejecutivos
- **Empleados**: Total activos, nuevos del mes
- **Proyectos**: Activos, completados, atrasados
- **Finanzas**: Saldos, ingresos, gastos
- **Inventario**: Valor total, items con stock bajo

### 2. Gráficos Interactivos
- **Flujo de Caja**: Ingresos vs gastos por mes
- **Proyectos por Estado**: Distribución de proyectos
- **Empleados por Departamento**: Distribución organizacional

### 3. Alertas y Notificaciones
- Proyectos atrasados
- Documentos por vencer
- Stock bajo
- Mantenimientos pendientes

### 4. Accesos Rápidos
- Navegación directa a módulos
- Tarjetas clickeables
- Acciones frecuentes

## Secciones del Dashboard

### KPIs Principales

| KPI | Descripción | Módulo |
|-----|-------------|--------|
| **Total Empleados** | Empleados activos | Empleados |
| **Proyectos Activos** | En planificación o progreso | Proyectos |
| **Saldo Total** | Suma de cuentas bancarias | Finanzas |
| **Valor Inventario** | Valor total del stock | Inventario |

### Gráficos

| Gráfico | Tipo | Descripción |
|---------|------|-------------|
| **Flujo de Caja** | Barras | Ingresos vs gastos mensuales |
| **Proyectos por Estado** | Pie | Distribución de estados |
| **Empleados por Depto** | Barras | Cantidad por departamento |
| **Tendencia de Ventas** | Líneas | Evolución de ingresos |

### Alertas

| Tipo | Color | Descripción |
|------|-------|-------------|
| **Error** | Rojo | Requiere atención inmediata |
| **Warning** | Naranja | Requiere atención pronto |
| **Info** | Azul | Información importante |

## Datos que Muestra

### Empleados
- Total de empleados activos
- Nuevos empleados del mes
- Distribución por departamento

### Proyectos
- Proyectos activos
- Proyectos completados
- Proyectos atrasados
- Presupuesto total vs gastado

### Finanzas
- Saldo total por moneda
- Ingresos del mes
- Gastos del mes
- Flujo de caja

### Inventario
- Total de items
- Valor del inventario
- Items con stock bajo

### Flota
- Total de vehículos
- Vehículos disponibles
- Mantenimientos pendientes

### HSE
- Días sin accidentes
- Incidentes abiertos
- Inspecciones pendientes

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                        DASHBOARD                             │
│  (Vista ejecutiva consolidada)                              │
└─────────────────────────────────────────────────────────────┘
                              │
    ┌───────┬───────┬─────────┼─────────┬───────┬───────┐
    │       │       │         │         │       │       │
    ▼       ▼       ▼         ▼         ▼       ▼       ▼
┌──────┐┌──────┐┌──────┐┌──────────┐┌──────┐┌──────┐┌──────┐
│Emplea││Proyec││Finan-││Inventario││Flota ││ HSE  ││Procura│
│dos   ││tos   ││zas   ││          ││      ││      ││      │
└──────┘└──────┘└──────┘└──────────┘└──────┘└──────┘└──────┘
```

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Dashboard | Dashboard principal |
| `/dashboard` | Dashboard | Dashboard principal (alias) |

## Permisos Requeridos

El dashboard muestra información según los permisos del usuario:
- Solo muestra KPIs de módulos a los que tiene acceso
- Las tarjetas son clickeables solo si tiene permiso de lectura

## Características Técnicas

### Actualización de Datos
- Los datos se cargan al entrar al dashboard
- Botón de refrescar para actualizar manualmente
- Datos en tiempo real para alertas críticas

### Responsive
- Tarjetas se reorganizan en mobile
- Gráficos se adaptan al tamaño de pantalla
- Alertas visibles en todas las resoluciones

### Rendimiento
- Carga asíncrona de secciones
- Skeletons mientras carga
- Caché de datos frecuentes

## Ejemplos de Uso

### Caso 1: Revisión Matutina
1. Acceder al dashboard
2. Revisar KPIs principales
3. Verificar alertas pendientes
4. Navegar a módulos que requieren atención

### Caso 2: Presentación Ejecutiva
1. Acceder al dashboard
2. Revisar gráficos de tendencias
3. Analizar flujo de caja
4. Verificar estado de proyectos

### Caso 3: Seguimiento de Alertas
1. Ver sección de alertas
2. Identificar items críticos
3. Hacer clic para ir al detalle
4. Resolver situación

## Screenshots

- `screenshots/dashboard-completo.png` - Vista completa del dashboard
- `screenshots/kpis.png` - Tarjetas de KPIs
- `screenshots/graficos.png` - Sección de gráficos
- `screenshots/alertas.png` - Panel de alertas
