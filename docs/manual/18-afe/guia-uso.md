# 💰 Módulo de AFE - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Autorizaciones de Gasto (AFE)"**
2. Se despliegan las opciones:
   - Dashboard
   - Lista de AFEs

---

## Dashboard AFE

**Ruta:** `/afe`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **AFEs Activos** | En ejecución |
| **Presupuesto Total** | Suma de AFEs aprobados |
| **Gastado** | Total ejecutado |
| **Pendientes** | AFEs por aprobar |

### Gráficos
- **AFEs por Tipo**: Distribución
- **Presupuesto vs Gastado**: Comparación
- **AFEs por Estado**: Pipeline

---

## Lista de AFEs

**Ruta:** `/afe/list`

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o título |
| **Estado** | Borrador, Pendiente, Aprobado, etc. |
| **Tipo** | Perforación, Workover, Facilidades, etc. |
| **Campo** | Todos los campos |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | AFE-XXXXX |
| **Título** | Descripción breve |
| **Tipo** | Tipo de AFE |
| **Campo** | Campo asociado |
| **Presupuesto** | Monto aprobado |
| **Gastado** | Monto ejecutado |
| **% Ejecución** | Porcentaje gastado |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar, Eliminar |

---

## Crear AFE

**Ruta:** `/afe/new`

### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Título** | ✅ | Descripción del AFE |
| **Tipo** | ✅ | Perforación, Workover, etc. |
| **Campo** | ✅ | Campo asociado |
| **Pozo** | ❌ | Pozo específico |
| **Presupuesto Estimado** | ✅ | Monto estimado |
| **Moneda** | ✅ | USD (default) |
| **Fecha Inicio** | ❌ | Fecha de inicio |
| **Fecha Fin** | ❌ | Fecha de fin |
| **Descripción** | ❌ | Detalles del proyecto |

### Items del Presupuesto
Agregar líneas de presupuesto:
- Categoría
- Descripción
- Cantidad
- Precio unitario
- Total

### Pasos
1. Hacer clic en **"+ Nuevo AFE"**
2. Completar información general
3. Agregar items de presupuesto
4. Guardar como borrador
5. Enviar para aprobación cuando esté listo

---

## Detalle del AFE

**Ruta:** `/afe/:id`

### Información del AFE
- Código y título
- Tipo y estado
- Campo y pozo
- Presupuesto aprobado
- Gastado y disponible
- Fechas

### Barra de Progreso
Muestra porcentaje de ejecución del presupuesto.

### Tabs Disponibles

#### Tab: Información
Datos generales del AFE.

#### Tab: Presupuesto
Items del presupuesto:
- Categoría
- Descripción
- Monto presupuestado
- Monto gastado
- Variación

#### Tab: Gastos
Gastos registrados contra el AFE:
- Fecha
- Descripción
- Monto
- Categoría
- Estado

#### Tab: Documentos
Archivos adjuntos.

#### Tab: Aprobaciones
Historial de aprobaciones:
- Fecha
- Usuario
- Acción
- Comentarios

#### Tab: Auditoría
Historial de cambios.

---

## Flujo de Aprobación

```
DRAFT → PENDING → APPROVED → IN_PROGRESS → CLOSED
                ↘ REJECTED
```

### Enviar para Aprobación
1. Desde AFE en estado DRAFT
2. Verificar que esté completo
3. Clic en **"Enviar para Aprobación"**
4. Estado cambia a PENDING

### Aprobar AFE
1. Revisar AFE pendiente
2. Verificar presupuesto y justificación
3. Clic en **"Aprobar"**
4. Ingresar presupuesto aprobado (puede diferir del estimado)
5. Agregar comentarios
6. Confirmar

### Rechazar AFE
1. Revisar AFE pendiente
2. Clic en **"Rechazar"**
3. Ingresar motivo del rechazo
4. Confirmar

---

## Registro de Gastos

### Registrar Gasto
1. Desde el detalle del AFE
2. Tab "Gastos" → "Nuevo Gasto"
3. Seleccionar categoría
4. Ingresar monto y descripción
5. Adjuntar comprobante
6. Guardar

### Control de Presupuesto
- El sistema alerta cuando se supera el 80% del presupuesto
- Alerta crítica al superar el 100%
- Se puede solicitar ampliación de presupuesto

---

## Tips y Mejores Prácticas

### Para Crear AFEs
- ✅ Detallar bien los items de presupuesto
- ✅ Incluir contingencias
- ✅ Documentar justificación
- ✅ Asociar correctamente a campo/pozo

### Para Aprobaciones
- ✅ Revisar detalle del presupuesto
- ✅ Verificar disponibilidad de fondos
- ✅ Documentar decisiones

### Para Control
- ✅ Registrar gastos oportunamente
- ✅ Monitorear ejecución vs presupuesto
- ✅ Solicitar ampliación antes de exceder

---

## Solución de Problemas

### "No puedo enviar para aprobación"
- Verificar que tenga items de presupuesto
- Verificar que esté en estado DRAFT
- Verificar permisos de usuario

### "AFE sobre presupuesto"
- Revisar gastos registrados
- Solicitar ampliación de presupuesto
- Documentar motivos del exceso

### "No puedo registrar gastos"
- Verificar que el AFE esté aprobado
- Verificar que esté en estado IN_PROGRESS
- Verificar permisos de usuario
