# 💰 Autorizaciones de Gasto (AFE)

## ¿Qué es este módulo?

El módulo de **AFE** (Authorization for Expenditure - Autorización para Gastos) permite gestionar las solicitudes de autorización de gastos para proyectos petroleros. Es un proceso formal para aprobar inversiones en perforación, workover, instalaciones y otros gastos mayores.

Piense en este módulo como su "sistema de aprobación de inversiones": antes de gastar en un proyecto mayor, se debe crear un AFE, obtener aprobaciones y luego ejecutar el gasto.

## ¿Para quién es útil?

- **Ingenieros de Proyecto**: Para crear solicitudes de AFE
- **Gerencia de Operaciones**: Para revisar y aprobar AFEs
- **Finanzas**: Para controlar presupuestos y gastos
- **Socios/Partners**: Para aprobar su participación

## ¿Qué puedo hacer aquí?

### Gestión de AFEs
- **Crear AFEs** para diferentes tipos de proyectos
- **Estimar costos** detallados
- **Enviar para aprobación**
- **Dar seguimiento** al estado

### Flujo de Aprobación
- **Revisión interna** por gerencia
- **Aprobación de socios** según participación
- **Control de cambios** si hay modificaciones

### Control de Ejecución
- **Registrar gastos** reales vs estimados
- **Monitorear desviaciones**
- **Cerrar AFE** al completar

## Conceptos Importantes

### Tipos de AFE

| Tipo | Descripción | Color |
|------|-------------|-------|
| **Perforación** | Perforación de pozos nuevos | Rojo |
| **Workover** | Intervención de pozos existentes | Amarillo |
| **Instalaciones** | Construcción de facilidades | Azul |
| **Exploración** | Actividades exploratorias | Púrpura |
| **Mantenimiento** | Mantenimiento mayor | Verde |
| **Otro** | Otros gastos mayores | Gris |

### Estados del AFE

| Estado | Descripción | Color |
|--------|-------------|-------|
| **Borrador** | En elaboración | Gris |
| **Pendiente** | Enviado para aprobación | Amarillo |
| **Aprobado** | Autorizado para ejecutar | Verde |
| **Rechazado** | No autorizado | Rojo |
| **En Progreso** | En ejecución | Azul |
| **Cerrado** | Completado | Púrpura |
| **Cancelado** | Anulado | Gris |

### Componentes del AFE

Un AFE típico incluye:
- **Información general**: Código, título, descripción
- **Campo/Pozo**: Ubicación del proyecto
- **Tipo**: Perforación, Workover, etc.
- **Costo estimado**: Presupuesto total
- **Desglose**: Detalle por categoría de gasto
- **Justificación**: Razón del proyecto
- **Cronograma**: Fechas estimadas

### Participación de Socios

En operaciones conjuntas (JV):
- Cada socio aprueba según su participación
- El operador coordina las aprobaciones
- Se registra la aprobación de cada parte

## Relación con Otros Módulos

El módulo de AFE se conecta con:

- **Producción**: Los AFEs se asocian a campos y pozos.

- **Proyectos**: Un AFE aprobado puede generar un proyecto.

- **Finanzas**: Los gastos del AFE se registran en finanzas.

- **Contratos**: Los AFEs se relacionan con contratos de operación.

- **JIB**: La facturación conjunta se basa en los AFEs.
