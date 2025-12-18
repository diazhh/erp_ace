# 📄 Gestión Documental - Guía de Uso

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Documentos"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores
   - **Documentos**: Lista de documentos
   - **Categorías**: Gestión de categorías

---

## Dashboard de Documentos

### Acceder al Dashboard

1. En el menú, seleccione **"Documentos"** → **"Dashboard"**
2. Verá el panel principal con indicadores

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **Total Documentos** | Cantidad de documentos registrados |
| **Aprobados** | Documentos vigentes |
| **Pendientes** | Esperando aprobación |
| **Vencidos** | Documentos expirados |

### Alertas

El dashboard muestra:
- Documentos próximos a vencer
- Documentos pendientes de aprobación
- Documentos recientes

---

## Lista de Documentos

### Ver Todos los Documentos

1. En el menú, seleccione **"Documentos"** → **"Documentos"**
2. Verá la tabla/tarjetas de documentos

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código, título o descripción |
| **Estado** | Borrador, Pendiente, Aprobado, etc. |
| **Tipo** | Política, Procedimiento, Manual, etc. |
| **Categoría** | Categorías registradas |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Título** | Nombre del documento |
| **Tipo** | Tipo de documento |
| **Categoría** | Clasificación |
| **Estado** | Estado actual |
| **Vencimiento** | Fecha de expiración |
| **Acciones** | Ver, Editar, Más opciones |

---

### Crear un Nuevo Documento

1. Haga clic en el botón **"+ Nuevo Documento"**
2. Se abrirá una página con el formulario

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único (ej: "POL-001") |
| **Título** | ✅ Sí | Nombre del documento |
| **Tipo** | ✅ Sí | Política, Procedimiento, etc. |
| **Categoría** | ❌ No | Clasificación |
| **Descripción** | ❌ No | Resumen del contenido |
| **Versión** | ❌ No | Número de versión |
| **Fecha de Emisión** | ❌ No | Cuándo se creó |
| **Fecha de Vencimiento** | ❌ No | Cuándo expira |
| **Archivo** | ❌ No | Archivo adjunto (PDF, Word, etc.) |
| **Estado** | ✅ Sí | Estado inicial |

3. Adjunte el archivo si es necesario
4. Haga clic en **"Guardar"**

---

### Ver Detalle de un Documento

1. En la lista, haga clic en el ícono de **ojo** (👁) o doble clic en la fila
2. Verá:
   - Información completa del documento
   - Archivo adjunto (con opción de descargar)
   - Historial de versiones
   - Historial de cambios

---

### Editar un Documento

1. En la lista o detalle, haga clic en el ícono de **lápiz** (✏️)
2. Modifique los campos necesarios
3. Si sube un nuevo archivo, se crea una nueva versión
4. Haga clic en **"Guardar"**

---

### Flujo de Aprobación

```
1. BORRADOR → Documento en elaboración
   ↓
2. PENDIENTE → Enviado para aprobación
   ↓
3. APROBADO → Documento vigente
   (o RECHAZADO → Requiere correcciones)
```

### Aprobar un Documento

1. En el detalle del documento en estado "Pendiente"
2. Revise el contenido
3. Haga clic en **"Aprobar"** o **"Rechazar"**
4. Agregue comentarios si es necesario

---

### Archivar un Documento

1. En el detalle del documento
2. Haga clic en el menú de opciones (⋮)
3. Seleccione **"Archivar"**
4. El documento pasa a estado "Archivado"

> Los documentos archivados no se eliminan, solo se marcan como no vigentes.

---

## Categorías

### Ver Lista de Categorías

1. En el menú, seleccione **"Documentos"** → **"Categorías"**
2. Verá la lista de categorías

### Crear una Categoría

1. Haga clic en **"+ Nueva Categoría"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único |
| **Nombre** | ✅ Sí | Nombre de la categoría |
| **Descripción** | ❌ No | Descripción |
| **Categoría Padre** | ❌ No | Para subcategorías |
| **Color** | ❌ No | Color de identificación |
| **Estado** | ✅ Sí | Activa o Inactiva |

3. Haga clic en **"Guardar"**

---

## Descargar Documentos

1. En el detalle del documento
2. Haga clic en el botón **"Descargar"**
3. El archivo se descarga a su computadora

---

## Consejos Útiles

### Para Organización
- ✅ Use códigos consistentes (POL-001, PROC-001, etc.)
- ✅ Cree categorías lógicas
- ✅ Agregue descripciones claras
- ✅ Defina fechas de vencimiento cuando aplique

### Para Control de Versiones
- ✅ Incremente la versión en cada cambio
- ✅ Documente los cambios realizados
- ✅ Mantenga el historial de versiones

### Para Aprobaciones
- ✅ Revise bien antes de aprobar
- ✅ Agregue comentarios al rechazar
- ✅ Notifique a los interesados

---

## Preguntas Frecuentes

### ¿Qué tipos de archivo puedo subir?
PDF, Word, Excel, PowerPoint, imágenes y otros formatos comunes. El tamaño máximo depende de la configuración del sistema.

### ¿Puedo tener varias versiones del mismo documento?
Sí. Cada vez que sube un nuevo archivo, se crea una nueva versión. El historial se mantiene.

### ¿Qué pasa cuando un documento vence?
El estado cambia automáticamente a "Vencido" y aparece en las alertas del dashboard.

### ¿Puedo eliminar un documento?
Sí, pero se recomienda archivar en lugar de eliminar para mantener el historial.

### ¿Cómo busco un documento específico?
Use el campo de búsqueda para buscar por código, título o descripción. También puede filtrar por tipo, categoría o estado.

### ¿Quién puede aprobar documentos?
Depende de los permisos configurados. Generalmente supervisores o administradores.
