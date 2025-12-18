# 💰 Autorizaciones de Gasto (AFE) - Guía de Uso

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"AFE"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores
   - **AFEs**: Lista de autorizaciones

---

## Dashboard de AFE

### Acceder al Dashboard

1. En el menú, seleccione **"AFE"** → **"Dashboard"**
2. Verá el panel principal con indicadores

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **AFEs Pendientes** | Esperando aprobación |
| **AFEs Aprobados** | Listos para ejecutar |
| **En Ejecución** | Proyectos activos |
| **Presupuesto Total** | Suma de AFEs aprobados |

---

## Lista de AFEs

### Ver Todos los AFEs

1. En el menú, seleccione **"AFE"** → **"AFEs"**
2. Verá la tabla/tarjetas de AFEs

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o título |
| **Estado** | Borrador, Pendiente, Aprobado, etc. |
| **Tipo** | Perforación, Workover, Instalaciones, etc. |
| **Campo** | Filtrar por campo |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Título** | Nombre del AFE |
| **Tipo** | Perforación, Workover, etc. |
| **Campo** | Campo asociado |
| **Costo Estimado** | Presupuesto |
| **Estado** | Estado actual |
| **Fecha** | Fecha de creación |
| **Acciones** | Ver, Editar, Eliminar |

---

### Crear un AFE

1. Haga clic en el botón **"+ Nuevo AFE"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único (ej: "AFE-2025-001") |
| **Título** | ✅ Sí | Nombre descriptivo |
| **Tipo** | ✅ Sí | Perforación, Workover, etc. |
| **Campo** | ❌ No | Campo asociado |
| **Pozo** | ❌ No | Pozo asociado (si aplica) |
| **Costo Estimado** | ✅ Sí | Presupuesto total |
| **Moneda** | ✅ Sí | USD |
| **Fecha Inicio** | ❌ No | Inicio estimado |
| **Fecha Fin** | ❌ No | Fin estimado |
| **Descripción** | ❌ No | Detalle del proyecto |
| **Justificación** | ❌ No | Razón del gasto |

3. Haga clic en **"Guardar"**
4. El AFE queda en estado "Borrador"

---

### Agregar Desglose de Costos

1. En el detalle del AFE, vaya a la sección de desglose
2. Agregue líneas de costo:
   - Categoría (perforación, equipos, servicios, etc.)
   - Descripción
   - Monto estimado
3. El sistema suma automáticamente el total

---

### Flujo de Aprobación

```
1. BORRADOR → AFE en elaboración
   ↓
2. PENDIENTE → Enviado para aprobación
   ↓
3. APROBADO → Autorizado (o RECHAZADO)
   ↓
4. EN PROGRESO → En ejecución
   ↓
5. CERRADO → Completado
```

---

### Enviar para Aprobación

1. En el detalle del AFE en estado "Borrador"
2. Verifique que toda la información esté completa
3. Haga clic en **"Enviar para Aprobación"**
4. El estado cambia a "Pendiente"
5. Los aprobadores reciben notificación

---

### Aprobar/Rechazar un AFE

1. En el detalle del AFE en estado "Pendiente"
2. Revise la información y justificación
3. Haga clic en **"Aprobar"** o **"Rechazar"**
4. Agregue comentarios si es necesario
5. El estado cambia según la decisión

---

### Registrar Gastos Reales

1. En el detalle del AFE aprobado
2. Vaya a la sección de ejecución
3. Registre los gastos reales por categoría
4. El sistema compara con el estimado
5. Muestra desviaciones si las hay

---

### Cerrar un AFE

1. Cuando el proyecto esté completado
2. Verifique que todos los gastos estén registrados
3. Haga clic en **"Cerrar AFE"**
4. Agregue notas de cierre
5. El estado cambia a "Cerrado"

---

## Consejos Útiles

### Para Crear AFEs
- ✅ Use códigos estándar de la empresa
- ✅ Sea detallado en la justificación
- ✅ Incluya contingencias en el presupuesto
- ✅ Desglose los costos por categoría

### Para Aprobaciones
- ✅ Revise bien antes de enviar
- ✅ Responda rápido a solicitudes de aprobación
- ✅ Documente razones de rechazo

### Para Ejecución
- ✅ Registre gastos regularmente
- ✅ Investigue desviaciones significativas
- ✅ Solicite suplemento si es necesario

---

## Preguntas Frecuentes

### ¿Puedo modificar un AFE aprobado?
No directamente. Debe solicitar un suplemento o revisión que pasa por nuevo proceso de aprobación.

### ¿Qué pasa si el gasto real supera el estimado?
El sistema muestra la desviación. Debe solicitar un suplemento de AFE para cubrir el exceso.

### ¿Quién puede aprobar AFEs?
Depende del monto y los permisos configurados. Generalmente gerencia y socios según participación.

### ¿Puedo cancelar un AFE aprobado?
Sí, si no se ha ejecutado. Cambie el estado a "Cancelado" con justificación.

### ¿Cómo veo el historial de un AFE?
En el detalle del AFE, la sección de historial muestra todos los cambios y aprobaciones.
