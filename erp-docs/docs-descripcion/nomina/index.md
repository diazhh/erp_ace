# 💰 Nómina y Pagos

## ¿Qué es este módulo?

El módulo de **Nómina** gestiona todo el proceso de pago de salarios a los empleados de la empresa. Aquí puede crear períodos de nómina, calcular automáticamente los salarios con sus deducciones legales, gestionar préstamos a empleados y llevar un control completo de los pagos realizados.

Piense en este módulo como el "centro de pagos" de su empresa: desde aquí se procesan las quincenas o mensualidades, se calculan las deducciones de ley (SSO, FAOV, etc.), se descuentan los préstamos activos y se genera la documentación necesaria para cada pago.

## ¿Para quién es útil?

- **Personal de Recursos Humanos**: Para crear y procesar períodos de nómina, gestionar préstamos y generar recibos de pago
- **Gerentes y Supervisores**: Para aprobar períodos de nómina antes del pago
- **Contabilidad/Finanzas**: Para revisar los totales de nómina y coordinar los pagos
- **Empleados**: Para consultar sus recibos de pago y estado de préstamos

## ¿Qué puedo hacer aquí?

### Gestión de Períodos de Nómina
- **Crear períodos** de nómina (semanal, quincenal o mensual)
- **Generar entradas** automáticamente para todos los empleados activos
- **Calcular deducciones** legales venezolanas (SSO, RPE, FAOV, ISLR)
- **Revisar y ajustar** entradas individuales antes de aprobar
- **Aprobar períodos** para autorizar el pago
- **Marcar como pagado** una vez procesado el pago
- **Exportar a PDF** el resumen de nómina

### Gestión de Préstamos
- **Crear préstamos** a empleados con cuotas definidas
- **Aprobar o rechazar** solicitudes de préstamo
- **Seguimiento automático** de cuotas pagadas
- **Descuento automático** en cada nómina
- **Pausar o cancelar** préstamos cuando sea necesario

### Reportes y Documentos
- **Recibos de pago** individuales por empleado
- **Resumen de nómina** por período
- **Reporte de préstamos** activos

## Conceptos Importantes

### Período de Nómina
Es el rango de fechas para el cual se calcula el pago. Por ejemplo, "Quincena 1 de Enero 2025" cubre del 1 al 15 de enero.

### Tipos de Período

| Tipo | Descripción |
|------|-------------|
| **Semanal** | Pago cada semana |
| **Quincenal** | Pago cada 15 días |
| **Mensual** | Pago una vez al mes |

### Estados del Período

| Estado | Descripción | Qué puede hacer |
|--------|-------------|-----------------|
| **Borrador** | Período recién creado | Editar, generar entradas, eliminar |
| **Calculando** | Entradas generadas | Revisar, editar entradas, aprobar |
| **Pendiente de Aprobación** | Listo para revisión | Aprobar o rechazar |
| **Aprobado** | Autorizado para pago | Marcar como pagado |
| **Pagado** | Pago completado | Solo consultar |
| **Cancelado** | Período anulado | Solo consultar |

### Deducciones Legales Venezolanas

El sistema calcula automáticamente las siguientes deducciones:

| Deducción | Porcentaje | Descripción |
|-----------|------------|-------------|
| **SSO** | 4% | Seguro Social Obligatorio |
| **RPE** | 0.5% | Régimen Prestacional de Empleo |
| **FAOV** | 1% | Fondo de Ahorro Obligatorio para la Vivienda |
| **ISLR** | Variable | Impuesto Sobre la Renta |

### Préstamos a Empleados

Los préstamos son adelantos o créditos que la empresa otorga a los empleados y que se descuentan automáticamente de su nómina.

| Tipo de Préstamo | Descripción |
|------------------|-------------|
| **Personal** | Préstamo personal general |
| **Adelanto** | Adelanto de salario |
| **Emergencia** | Préstamo por situación de emergencia |
| **Otro** | Otros tipos de préstamo |

### Estados de Préstamo

| Estado | Descripción |
|--------|-------------|
| **Activo** | Se está descontando de la nómina |
| **Pagado** | Préstamo completamente cancelado |
| **Pausado** | Temporalmente sin descuento |
| **Cancelado** | Préstamo anulado |

## Relación con Otros Módulos

El módulo de Nómina se conecta con:

- **Empleados**: Los datos de salario base vienen del registro del empleado. Las entradas de nómina se generan solo para empleados activos.

- **Organización**: Los cargos definen rangos salariales de referencia.

- **Finanzas**: Los pagos de nómina pueden registrarse como transacciones financieras para control contable.

- **Reportes**: Puede generar reportes de nómina y préstamos en formato PDF.
