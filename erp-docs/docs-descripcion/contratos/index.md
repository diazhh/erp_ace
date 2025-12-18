# 📜 Contratos Petroleros

## ¿Qué es este módulo?

El módulo de **Contratos** permite gestionar los contratos de operación petrolera: contratos de servicios, acuerdos de operación conjunta (JOA), concesiones, farmouts y otros tipos de contratos del sector. Incluye la gestión de partes, participaciones y términos contractuales.

Piense en este módulo como su "archivo legal de operaciones": registra todos los contratos que rigen las operaciones, las partes involucradas y sus participaciones.

## ¿Para quién es útil?

- **Legal**: Para gestionar contratos y términos
- **Finanzas**: Para calcular participaciones y facturación
- **Operaciones**: Para conocer los términos de operación
- **Gerencia**: Para supervisar acuerdos comerciales

## ¿Qué puedo hacer aquí?

### Gestión de Contratos
- **Registrar contratos** de diferentes tipos
- **Definir partes** y participaciones
- **Establecer términos** y condiciones
- **Controlar vigencia** y vencimientos

### Concesiones
- **Registrar concesiones** petroleras
- **Asociar campos** a concesiones
- **Controlar fechas** de vigencia

### Dashboard
- **Contratos activos**: Por tipo y estado
- **Próximos a vencer**: Alertas de vencimiento
- **Participaciones**: Resumen por socio

## Conceptos Importantes

### Tipos de Contrato

| Tipo | Descripción |
|------|-------------|
| **PSA** | Production Sharing Agreement (Acuerdo de Producción Compartida) |
| **Service** | Contrato de Servicios |
| **JOA** | Joint Operating Agreement (Acuerdo de Operación Conjunta) |
| **Concession** | Concesión petrolera |
| **Farmout** | Cesión de participación |
| **Lease** | Arrendamiento |
| **Other** | Otros tipos |

### Estados del Contrato

| Estado | Descripción | Color |
|--------|-------------|-------|
| **Borrador** | En elaboración | Gris |
| **Activo** | Vigente | Verde |
| **Suspendido** | Temporalmente inactivo | Amarillo |
| **Expirado** | Vencido | Rojo |
| **Terminado** | Finalizado | Rojo |

### Partes del Contrato

Cada contrato puede tener múltiples partes:
- **Operador**: Empresa que opera el campo
- **Socios**: Empresas con participación
- **Contratistas**: Proveedores de servicios

### Participaciones (Working Interest)

La participación de cada parte se expresa en porcentaje:
- Suma de participaciones = 100%
- Determina la distribución de costos e ingresos
- Afecta la facturación conjunta (JIB)

### Términos Importantes

| Término | Descripción |
|---------|-------------|
| **Fecha Efectiva** | Cuándo inicia el contrato |
| **Fecha Vencimiento** | Cuándo termina |
| **Área Contractual** | Territorio cubierto |
| **Regalías** | Porcentaje para el Estado |

## Relación con Otros Módulos

El módulo de Contratos se conecta con:

- **Producción**: Los contratos definen qué campos se operan.

- **AFE**: Los AFEs se asocian a contratos para aprobación de socios.

- **JIB**: La facturación conjunta se basa en las participaciones del contrato.

- **Finanzas**: Los ingresos y gastos se distribuyen según participaciones.

- **Compliance**: Cumplimiento de obligaciones contractuales.
