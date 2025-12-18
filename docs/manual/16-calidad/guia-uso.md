# ✅ Módulo de Control de Calidad - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Control de Calidad"**
2. Se despliegan las opciones:
   - Dashboard
   - Inspecciones
   - No Conformidades

---

## Dashboard de Calidad

**Ruta:** `/quality`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Planes** | Total de planes de calidad |
| **Inspecciones** | Inspecciones del período |
| **NC Abiertas** | No conformidades sin cerrar |
| **Acciones Pendientes** | Acciones correctivas pendientes |
| **Certificados** | Certificados vigentes |

### Distribución de NC
Gráfico por tipo: Menor, Mayor, Crítica.

### Actividad Reciente
- Últimas inspecciones
- Últimas NC registradas

---

## Inspecciones

### Lista de Inspecciones

**Ruta:** `/quality/inspections`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Tipo de inspección |
| **Estado** | Programada, En Progreso, Completada |
| **Resultado** | Aprobada, Rechazada, Condicional |
| **Fecha** | Rango de fechas |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Tipo** | Tipo de inspección |
| **Fecha** | Fecha programada/ejecutada |
| **Inspector** | Quien inspecciona |
| **Resultado** | PASS/FAIL/CONDITIONAL |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar |

---

### Crear Inspección

**Ruta:** `/quality/inspections/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ | Tipo de inspección |
| **Fecha Programada** | ✅ | Cuándo realizar |
| **Inspector** | ✅ | Quien inspecciona |
| **Proyecto** | ❌ | Proyecto asociado |
| **Ubicación** | ❌ | Dónde se realiza |
| **Descripción** | ❌ | Detalles |

#### Pasos
1. Hacer clic en **"+ Nueva Inspección"**
2. Seleccionar tipo
3. Definir fecha
4. Asignar inspector
5. Hacer clic en **"Guardar"**

---

### Ejecutar Inspección

1. Ir al detalle de la inspección
2. Clic en **"Iniciar Inspección"**
3. Completar checklist de verificación
4. Registrar hallazgos
5. Definir resultado:
   - **PASS**: Todo conforme
   - **FAIL**: No conforme (genera NC)
   - **CONDITIONAL**: Aprobación con observaciones
6. Clic en **"Completar"**

---

### Detalle de Inspección

**Ruta:** `/quality/inspections/:id`

#### Información
- Código y tipo
- Fecha programada/ejecutada
- Inspector
- Resultado
- Estado

#### Tabs
- **Información**: Datos generales
- **Checklist**: Puntos verificados
- **Hallazgos**: Observaciones encontradas
- **NC Generadas**: No conformidades creadas
- **Documentos**: Archivos adjuntos

---

## No Conformidades

### Lista de No Conformidades

**Ruta:** `/quality/non-conformances`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Menor, Mayor, Crítica |
| **Estado** | Abierta, En Progreso, Cerrada |
| **Responsable** | Empleados |
| **Fecha** | Rango de fechas |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | NC-XXXXX |
| **Título** | Descripción breve |
| **Tipo** | Menor/Mayor/Crítica |
| **Origen** | Inspección, auditoría, etc. |
| **Responsable** | Quien debe resolver |
| **Estado** | Estado actual |
| **Días Abierta** | Tiempo sin cerrar |
| **Acciones** | Ver, Editar |

---

### Crear No Conformidad

**Ruta:** `/quality/non-conformances/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Título** | ✅ | Descripción breve |
| **Descripción** | ✅ | Detalle de la NC |
| **Tipo** | ✅ | Menor, Mayor, Crítica |
| **Origen** | ✅ | Cómo se detectó |
| **Fecha Detección** | ✅ | Cuándo se encontró |
| **Responsable** | ✅ | Quien debe resolver |
| **Proyecto** | ❌ | Proyecto asociado |
| **Evidencia** | ❌ | Fotos/documentos |

#### Pasos
1. Hacer clic en **"+ Nueva NC"**
2. Ingresar título descriptivo
3. Describir la no conformidad
4. Clasificar severidad
5. Asignar responsable
6. Adjuntar evidencia
7. Hacer clic en **"Guardar"**

---

### Detalle de No Conformidad

**Ruta:** `/quality/non-conformances/:id`

#### Información
- Código y título
- Tipo (chip de color)
- Descripción
- Origen
- Fecha de detección
- Responsable
- Estado
- Días abierta

#### Tabs Disponibles

##### Tab: Información
Datos generales de la NC.

##### Tab: Análisis
- Causa raíz
- Análisis de causas (5 Por qués, Ishikawa, etc.)

##### Tab: Acciones Correctivas
Lista de acciones definidas:
- Descripción
- Responsable
- Fecha límite
- Estado

**Agregar Acción:**
1. Clic en "Nueva Acción"
2. Describir la acción
3. Asignar responsable
4. Definir fecha límite
5. Guardar

##### Tab: Verificación
- Verificación de efectividad
- Evidencia de cierre

##### Tab: Documentos
Evidencias y documentos adjuntos.

##### Tab: Auditoría
Historial de cambios.

---

### Flujo de No Conformidad

```
OPEN → IN_PROGRESS → PENDING_VERIFICATION → CLOSED
                                         ↘ Reabierta si no efectiva
```

### Cerrar No Conformidad

1. Verificar que todas las acciones estén completadas
2. Verificar efectividad de las acciones
3. Documentar verificación
4. Clic en **"Cerrar NC"**
5. Agregar comentarios de cierre
6. Confirmar

---

## Acciones Correctivas

### Estados de Acción

| Estado | Color | Descripción |
|--------|-------|-------------|
| **PENDING** | Naranja | Pendiente |
| **IN_PROGRESS** | Azul | En ejecución |
| **COMPLETED** | Verde | Completada |
| **CANCELLED** | Gris | Cancelada |

### Completar Acción
1. Ir al detalle de la NC
2. Tab "Acciones Correctivas"
3. Clic en la acción
4. Marcar como completada
5. Agregar evidencia de implementación

---

## Tips y Mejores Prácticas

### Para Inspecciones
- ✅ Programar inspecciones con anticipación
- ✅ Usar checklists estandarizados
- ✅ Documentar todos los hallazgos
- ✅ Generar NC cuando corresponda

### Para No Conformidades
- ✅ Clasificar correctamente la severidad
- ✅ Investigar causa raíz
- ✅ Definir acciones efectivas
- ✅ Verificar antes de cerrar

### Para Acciones Correctivas
- ✅ Definir acciones específicas y medibles
- ✅ Asignar responsables claros
- ✅ Establecer fechas realistas
- ✅ Verificar efectividad

---

## Solución de Problemas

### "No puedo cerrar la NC"
- Verificar que todas las acciones estén completadas
- Verificar que se haya documentado la verificación
- Verificar permisos de usuario

### "Inspección sin resultado"
- Completar todos los puntos del checklist
- Definir resultado antes de completar

### "NC sin acciones"
- Toda NC debe tener al menos una acción correctiva
- Agregar acciones antes de avanzar estado
