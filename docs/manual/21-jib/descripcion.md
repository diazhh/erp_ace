# 📊 Módulo de JIB - Descripción

## ¿Qué hace este módulo?

El módulo de **JIB** (Joint Interest Billing) gestiona la facturación y distribución de costos entre socios de operaciones conjuntas petroleras. Permite calcular y distribuir gastos según porcentajes de participación.

## Funcionalidades Principales

### 1. Distribución de Costos
- **Calcular** distribución por socio
- **Porcentajes** de participación
- **Categorías** de costos
- **Períodos** de facturación

### 2. Facturación a Socios
- **Generar** facturas JIB
- **Detalle** de costos
- **Seguimiento** de pagos

### 3. Reportes JIB
- **Resumen** por período
- **Detalle** por categoría
- **Histórico** de distribuciones

## Estados de Factura JIB

| Estado | Color | Descripción |
|--------|-------|-------------|
| **DRAFT** | Gris | Borrador |
| **SENT** | Azul | Enviada |
| **PARTIAL** | Naranja | Pago parcial |
| **PAID** | Verde | Pagada |

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/jib` | Dashboard | Dashboard JIB |
| `/jib/billings` | Lista | Facturaciones |
| `/jib/distributions` | Lista | Distribuciones |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `jib:read` | Ver distribuciones |
| `jib:create` | Crear facturaciones |
| `jib:update` | Editar facturaciones |
