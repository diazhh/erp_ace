# 🚗 Gestión de Flota

## ¿Qué es este módulo?

El módulo de **Flota** permite gestionar todos los vehículos de la empresa: automóviles, camiones, camionetas, motocicletas y maquinaria. Puede controlar asignaciones a empleados o proyectos, programar mantenimientos, registrar cargas de combustible y monitorear documentos por vencer.

Piense en este módulo como su "administrador de vehículos": sabe dónde está cada vehículo, quién lo usa, cuándo necesita mantenimiento, y cuánto combustible consume.

## ¿Para quién es útil?

- **Administradores de Flota**: Para gestionar vehículos, asignaciones y mantenimientos
- **Conductores**: Para reportar cargas de combustible y kilometraje
- **Gerentes de Proyecto**: Para solicitar vehículos para sus proyectos
- **Finanzas**: Para controlar costos de combustible y mantenimiento

## ¿Qué puedo hacer aquí?

### Gestión de Vehículos
- **Registrar vehículos** con todos sus datos (marca, modelo, placa, año)
- **Asignar a empleados** o proyectos
- **Controlar kilometraje** y estado
- **Monitorear documentos** (seguro, revisión técnica, etc.)
- **Recibir alertas** de documentos por vencer

### Mantenimientos
- **Programar mantenimientos** preventivos y correctivos
- **Registrar costos** de reparaciones
- **Dar seguimiento** al estado de cada mantenimiento
- **Historial completo** por vehículo

### Registro de Combustible
- **Registrar cargas** de combustible
- **Controlar consumo** por vehículo
- **Analizar rendimiento** (km/litro)
- **Exportar reportes** de consumo

### Dashboard
- **Ver indicadores**: Total de vehículos, disponibles, en mantenimiento
- **Alertas**: Documentos por vencer, mantenimientos pendientes
- **Estadísticas**: Consumo de combustible, costos

## Conceptos Importantes

### Estados del Vehículo

| Estado | Descripción | Color |
|--------|-------------|-------|
| **Disponible** | Listo para usar | Verde |
| **Asignado** | En uso por empleado o proyecto | Azul |
| **En Mantenimiento** | En taller | Naranja |
| **Fuera de Servicio** | No operativo | Rojo |
| **Vendido** | Ya no pertenece a la empresa | Gris |

### Tipos de Vehículo

| Tipo | Descripción |
|------|-------------|
| **Automóvil** | Vehículo de pasajeros |
| **Camioneta** | Pick-up o SUV |
| **Camión** | Vehículo de carga |
| **Motocicleta** | Moto |
| **Maquinaria** | Equipo pesado |

### Tipos de Mantenimiento

| Tipo | Descripción |
|------|-------------|
| **Preventivo** | Mantenimiento programado (cambio de aceite, filtros) |
| **Correctivo** | Reparación de fallas |
| **Inspección** | Revisión general |

### Estados del Mantenimiento

| Estado | Descripción |
|--------|-------------|
| **Programado** | Pendiente de realizar |
| **En Progreso** | En ejecución |
| **Completado** | Finalizado |
| **Cancelado** | No se realizó |

### Registro de Combustible

Cada carga de combustible registra:
- **Vehículo**: Cuál vehículo se cargó
- **Fecha**: Cuándo se realizó la carga
- **Cantidad**: Litros cargados
- **Costo**: Monto pagado
- **Kilometraje**: Odómetro al momento de cargar
- **Conductor**: Quién realizó la carga

### Documentos del Vehículo

El sistema puede alertar sobre documentos por vencer:
- Póliza de seguro
- Revisión técnica
- Permiso de circulación
- Licencia del conductor asignado

## Relación con Otros Módulos

El módulo de Flota se conecta con:

- **Empleados**: Los vehículos se asignan a empleados. Los conductores son empleados del sistema.

- **Proyectos**: Los vehículos pueden asignarse a proyectos específicos para control de costos.

- **Inventario**: Los repuestos y consumibles de vehículos pueden gestionarse en inventario.

- **Finanzas**: Los gastos de combustible y mantenimiento pueden registrarse como transacciones financieras.
