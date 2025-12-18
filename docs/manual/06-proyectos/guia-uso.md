# 📁 Módulo de Proyectos - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Proyectos"**
2. Se despliegan las opciones:
   - Dashboard
   - Lista de Proyectos

---

## Dashboard de Proyectos

**Ruta:** `/projects/dashboard`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Proyectos Activos** | En planificación o en progreso |
| **Presupuesto Total** | Suma de presupuestos |
| **Gastado** | Total gastado en proyectos |
| **Proyectos Atrasados** | Con hitos vencidos |

### Gráficos
- **Proyectos por Estado**: Distribución de estados
- **Presupuesto vs Gastado**: Comparación por proyecto
- **Progreso de Proyectos**: Avance de cada proyecto

---

## Lista de Proyectos

**Ruta:** `/projects`

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por nombre o código |
| **Tipo** | Interno, Contratado |
| **Estado** | Planificación, En Progreso, En Espera, Completado, Cancelado |
| **Prioridad** | Baja, Media, Alta, Crítica |

### Vista Desktop (Tabla)

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre del proyecto |
| **Tipo** | Interno/Contratado |
| **Estado** | Estado actual |
| **Prioridad** | Nivel de prioridad |
| **Progreso** | Barra de avance |
| **Presupuesto** | Monto asignado |
| **Fechas** | Inicio - Fin |
| **Gerente** | Responsable |
| **Acciones** | Ver, Editar, Eliminar |

### Vista Mobile (Tarjetas)
Tarjetas con información resumida y barra de progreso.

---

## Crear Proyecto

**Ruta:** `/projects/new`

### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | Código único (PRJ-XXXXX) |
| **Nombre** | ✅ | Nombre del proyecto |
| **Descripción** | ❌ | Descripción detallada |
| **Tipo de Ejecución** | ✅ | Interno o Contratado |
| **Estado** | ✅ | Estado inicial (default: Planificación) |
| **Prioridad** | ✅ | Nivel de prioridad |
| **Fecha Inicio** | ✅ | Fecha de inicio |
| **Fecha Fin** | ✅ | Fecha de fin planificada |
| **Presupuesto** | ❌ | Monto asignado |
| **Moneda** | ❌ | USD, VES |
| **Gerente** | ❌ | Empleado responsable |
| **Cliente** | ❌ | Cliente del proyecto |
| **Contratista** | ❌ | Solo si es contratado |
| **Ubicación** | ❌ | Ubicación física |

### Pasos
1. Hacer clic en **"+ Nuevo Proyecto"**
2. Completar código y nombre
3. Seleccionar tipo de ejecución
4. Definir fechas y presupuesto
5. Asignar gerente
6. Hacer clic en **"Guardar"**

---

## Detalle del Proyecto

**Ruta:** `/projects/:id`

### Encabezado
- Código y nombre
- Estado y prioridad (chips)
- Tipo de ejecución
- Gerente asignado
- Botones: Editar, Descargar PDF

### KPIs del Proyecto

| KPI | Descripción |
|-----|-------------|
| **Presupuesto** | Monto asignado |
| **Gastado** | Total de gastos aprobados |
| **Disponible** | Presupuesto - Gastado |
| **Progreso** | Porcentaje de avance |

### Barra de Progreso
Muestra el avance del proyecto basado en hitos completados.

### Tabs Disponibles

#### Tab: Información
Datos generales del proyecto:
- Descripción
- Fechas (inicio, fin planificado, fin real)
- Presupuesto y moneda
- Cliente y contratista
- Ubicación

#### Tab: Equipo
Lista de miembros del proyecto:
- Empleado (enlace)
- Rol en el proyecto
- Fecha de inicio y fin
- Acciones: Editar, Eliminar

**Agregar Miembro:**
1. Clic en "Agregar Miembro"
2. Seleccionar empleado
3. Asignar rol
4. Definir fechas de participación
5. Guardar

#### Tab: Hitos
Lista de hitos del proyecto:
- Nombre del hito
- Fecha objetivo
- Peso (% del progreso)
- Estado
- Acciones: Completar, Editar, Eliminar

**Crear Hito:**
1. Clic en "Nuevo Hito"
2. Ingresar nombre y descripción
3. Definir fecha objetivo
4. Asignar peso porcentual
5. Guardar

**Completar Hito:**
1. Clic en ✅ en el hito
2. Confirmar completación
3. El progreso del proyecto se actualiza

#### Tab: Gastos
Lista de gastos del proyecto:
- Fecha
- Categoría
- Descripción
- Monto
- Estado (Pendiente, Aprobado, Rechazado)
- Acciones: Aprobar, Rechazar

**Registrar Gasto:**
1. Clic en "Nuevo Gasto"
2. Seleccionar categoría
3. Ingresar monto y descripción
4. Adjuntar comprobante
5. Guardar (queda pendiente)

**Aprobar/Rechazar Gasto:**
1. Revisar gasto pendiente
2. Verificar comprobante
3. Clic en ✅ para aprobar o ❌ para rechazar

#### Tab: Actualizaciones
Historial de actualizaciones:
- Fecha
- Tipo (Avance, Problema, Decisión, etc.)
- Descripción
- Usuario que registró

**Agregar Actualización:**
1. Clic en "Nueva Actualización"
2. Seleccionar tipo
3. Escribir descripción
4. Guardar

#### Tab: Fotos
Galería de fotos del proyecto:
- Miniaturas de fotos
- Categoría
- Fecha de carga
- Descripción

**Subir Foto:**
1. Clic en "Agregar Foto"
2. Seleccionar archivo
3. Asignar categoría
4. Agregar descripción
5. Subir

#### Tab: Valuaciones (solo proyectos contratados)
Lista de valuaciones:
- Número de valuación
- Período
- Monto
- Estado
- Acciones: Ver, Aprobar, Rechazar, Facturar

**Crear Valuación:**
1. Clic en "Nueva Valuación"
2. Definir período
3. Ingresar monto y descripción
4. Guardar como borrador

**Flujo de Valuación:**
```
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → INVOICED → PAID
                                 ↘ REJECTED
```

#### Tab: Documentos
Archivos adjuntos del proyecto.

#### Tab: Auditoría
Historial de cambios del proyecto.

---

## Gestión de Hitos

### Crear Hito
1. Ir al detalle del proyecto
2. Tab "Hitos" → "Nuevo Hito"
3. Completar:
   - Nombre
   - Descripción
   - Fecha objetivo
   - Peso (% del progreso total)
4. Guardar

### Completar Hito
1. En la lista de hitos, clic en ✅
2. Confirmar completación
3. Se registra fecha de completación
4. El progreso del proyecto aumenta según el peso

### Hitos Atrasados
- Se marcan automáticamente como DELAYED
- Aparecen en alertas del dashboard
- Afectan el indicador de salud del proyecto

---

## Gestión de Gastos

### Registrar Gasto
1. Tab "Gastos" → "Nuevo Gasto"
2. Seleccionar categoría
3. Ingresar monto
4. Agregar descripción
5. Adjuntar comprobante (recomendado)
6. Guardar

### Aprobar Gasto
1. Revisar gasto pendiente
2. Verificar que está dentro del presupuesto
3. Verificar comprobante
4. Clic en ✅ Aprobar
5. El gasto se suma al total gastado

### Rechazar Gasto
1. Revisar gasto pendiente
2. Clic en ❌ Rechazar
3. Agregar motivo de rechazo
4. El gasto no afecta el presupuesto

---

## Valuaciones (Proyectos Contratados)

### Crear Valuación
1. Tab "Valuaciones" → "Nueva Valuación"
2. Definir período (fecha inicio - fin)
3. Ingresar monto de la valuación
4. Agregar descripción del avance
5. Guardar como borrador

### Enviar Valuación
1. Desde el detalle de la valuación
2. Clic en "Enviar para Revisión"
3. Estado cambia a SUBMITTED

### Aprobar Valuación
1. Revisar valuación enviada
2. Verificar avance reportado
3. Clic en "Aprobar"
4. Estado cambia a APPROVED

### Generar Factura
1. Desde valuación aprobada
2. Clic en "Generar Factura"
3. Se crea factura en módulo de Finanzas
4. Estado cambia a INVOICED

---

## Tips y Mejores Prácticas

### Al Crear Proyectos
- ✅ Definir presupuesto realista
- ✅ Establecer hitos claros y medibles
- ✅ Asignar gerente responsable
- ✅ Documentar alcance en descripción

### Para Seguimiento
- ✅ Actualizar progreso regularmente
- ✅ Registrar actualizaciones semanales
- ✅ Subir fotos de avance
- ✅ Revisar hitos atrasados

### Para Gastos
- ✅ Registrar gastos inmediatamente
- ✅ Adjuntar siempre comprobantes
- ✅ Aprobar gastos oportunamente
- ✅ Monitorear presupuesto vs gastado

### Para Valuaciones
- ✅ Crear valuaciones según contrato
- ✅ Documentar avance claramente
- ✅ Adjuntar evidencia de avance
- ✅ Procesar aprobaciones rápidamente

---

## Solución de Problemas

### "El progreso no se actualiza"
- Verificar que los hitos tengan peso asignado
- Verificar que los hitos estén marcados como completados
- El progreso se calcula: Σ(peso de hitos completados)

### "No puedo aprobar gastos"
- Verificar permiso `projects:approve`
- Verificar que el gasto esté en estado PENDING

### "La valuación fue rechazada"
- Revisar motivo de rechazo
- Corregir y crear nueva valuación
- Las valuaciones rechazadas no se pueden editar

### "Presupuesto excedido"
- El sistema permite registrar gastos sobre el presupuesto
- Se muestra alerta visual
- Revisar gastos y ajustar presupuesto si necesario
