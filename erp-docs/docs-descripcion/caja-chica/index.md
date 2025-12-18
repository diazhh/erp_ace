# 💵 Caja Chica

## ¿Qué es este módulo?

El módulo de **Caja Chica** permite gestionar fondos pequeños para gastos menores del día a día. Cada caja chica tiene un custodio responsable, un monto inicial y un saldo mínimo que indica cuándo necesita reposición.

Piense en este módulo como la administración de las "cajas menores" de su empresa: dinero en efectivo o fondos asignados para compras pequeñas como suministros de oficina, refrigerios, transporte local, etc. El sistema controla los gastos, las reposiciones y mantiene un historial completo de movimientos.

## ¿Para quién es útil?

- **Custodios de Caja Chica**: Para registrar gastos diarios y solicitar reposiciones cuando el saldo está bajo
- **Supervisores y Gerentes**: Para aprobar gastos y reposiciones
- **Contabilidad**: Para controlar los fondos asignados y generar reportes
- **Administración**: Para crear y configurar nuevas cajas chicas

## ¿Qué puedo hacer aquí?

### Gestión de Cajas Chicas
- **Crear cajas chicas** con monto inicial y saldo mínimo
- **Asignar custodios** responsables de cada caja
- **Monitorear saldos** en tiempo real
- **Recibir alertas** cuando una caja necesita reposición
- **Activar/desactivar** cajas según necesidad

### Registro de Gastos
- **Registrar gastos** con categoría y descripción
- **Adjuntar comprobantes** (facturas, recibos)
- **Aprobar o rechazar** gastos pendientes
- **Ver historial** completo de movimientos

### Reposiciones
- **Solicitar reposición** cuando el saldo está bajo
- **Aprobar reposiciones** pendientes
- **Registrar el ingreso** de fondos

### Reportes
- **Exportar movimientos** a PDF
- **Ver estadísticas** de gastos por período

## Conceptos Importantes

### Custodio
Es el empleado responsable de la caja chica. Esta persona registra los gastos y custodia el dinero físico.

### Monto Inicial
Es la cantidad de dinero con la que se crea la caja chica. Sirve como referencia para calcular el porcentaje de saldo disponible.

### Saldo Mínimo
Es el monto por debajo del cual el sistema alerta que la caja necesita reposición. Cuando el saldo actual es menor o igual al mínimo, aparece una alerta.

### Estados de la Caja Chica

| Estado | Descripción |
|--------|-------------|
| **Activa** | Caja operativa, puede registrar gastos |
| **Inactiva** | Caja temporalmente sin uso |
| **Suspendida** | Caja bloqueada por alguna razón |
| **Cerrada** | Caja definitivamente cerrada |

### Tipos de Movimiento

| Tipo | Descripción | Efecto en Saldo |
|------|-------------|-----------------|
| **Gasto** | Dinero que sale de la caja | Disminuye |
| **Reposición** | Dinero que entra a la caja | Aumenta |
| **Ajuste** | Corrección de saldo | Puede aumentar o disminuir |
| **Inicial** | Monto de apertura | Establece el saldo |

### Estados de Movimiento

| Estado | Descripción |
|--------|-------------|
| **Pendiente** | Movimiento registrado, esperando aprobación |
| **Aprobado** | Movimiento verificado y aplicado al saldo |
| **Rechazado** | Movimiento no aprobado |
| **Cancelado** | Movimiento anulado |

### Indicador de Saldo

El sistema muestra una barra de progreso que indica el porcentaje de saldo disponible:
- **Verde**: Saldo saludable (más del 150% del mínimo)
- **Naranja**: Saldo bajo (entre 100% y 150% del mínimo)
- **Rojo**: Necesita reposición (igual o menor al mínimo)

## Relación con Otros Módulos

El módulo de Caja Chica se conecta con:

- **Empleados**: Los custodios son empleados del sistema. Puede ver el detalle del custodio desde la caja chica.

- **Finanzas**: Las reposiciones pueden registrarse como transacciones financieras para control contable.

- **Documentos**: Los comprobantes adjuntos se almacenan en el sistema de documentos.

- **Reportes**: Puede generar reportes de movimientos en PDF.
