# 📊 Facturación Conjunta (JIB)

## ¿Qué es este módulo?

El módulo de **JIB** (Joint Interest Billing - Facturación de Interés Conjunto) permite gestionar la facturación entre socios en operaciones petroleras conjuntas. Cuando varias empresas participan en un contrato, los costos se distribuyen según las participaciones de cada socio.

Piense en este módulo como su "sistema de facturación entre socios": calcula cuánto debe pagar cada socio según su participación y genera las facturas correspondientes.

## ¿Para quién es útil?

- **Finanzas**: Para generar y controlar facturación a socios
- **Contabilidad**: Para registrar cuentas por cobrar/pagar
- **Operaciones**: Para verificar costos facturados
- **Socios**: Para revisar y aprobar facturas

## ¿Qué puedo hacer aquí?

### Facturación JIB
- **Generar JIBs** mensuales por contrato
- **Calcular participaciones** automáticamente
- **Enviar a socios** para revisión
- **Controlar pagos** recibidos

### Cash Calls
- **Generar llamadas de capital** anticipadas
- **Solicitar fondos** a socios
- **Controlar aportes** recibidos

### Dashboard
- **JIBs pendientes**: Por enviar o pagar
- **Montos por cobrar**: Total pendiente
- **Disputas**: JIBs en disputa

## Conceptos Importantes

### ¿Qué es un JIB?

Un JIB es una factura que el operador envía a los socios no operadores para cobrar su participación en los costos de operación.

Ejemplo:
- Costos del mes: $100,000
- Socio A (operador): 50% → $50,000 (asume)
- Socio B: 30% → $30,000 (JIB)
- Socio C: 20% → $20,000 (JIB)

### Estados del JIB

| Estado | Descripción | Color |
|--------|-------------|-------|
| **Borrador** | En elaboración | Gris |
| **Enviado** | Enviado a socios | Azul |
| **Parcialmente Pagado** | Pago parcial recibido | Amarillo |
| **Pagado** | Totalmente pagado | Verde |
| **Disputado** | Socio objeta cargos | Rojo |
| **Cancelado** | Anulado | Gris |

### Período de Facturación

Los JIBs se generan por período:
- **Mes**: Mes de los costos
- **Año**: Año de los costos
- **Fecha de Vencimiento**: Cuándo debe pagarse

### ¿Qué es un Cash Call?

Un Cash Call es una solicitud anticipada de fondos a los socios para cubrir gastos futuros (antes de que ocurran).

### Componentes del JIB

Un JIB típico incluye:
- **Contrato**: Contrato de operación conjunta
- **Período**: Mes y año
- **Costos**: Desglose por categoría
- **Participaciones**: % de cada socio
- **Montos**: Cuánto debe cada socio

## Relación con Otros Módulos

El módulo de JIB se conecta con:

- **Contratos**: Las participaciones vienen del contrato.

- **AFE**: Los costos de AFEs se incluyen en JIBs.

- **Finanzas**: Los JIBs generan cuentas por cobrar.

- **Producción**: Los costos de producción se facturan vía JIB.
