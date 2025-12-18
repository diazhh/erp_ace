# 📄 Módulo de Documentos - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Documentos"**
2. Se despliegan las opciones:
   - Dashboard
   - Lista de Documentos
   - Categorías

---

## Dashboard de Documentos

**Ruta:** `/documents`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Total Documentos** | Cantidad de documentos |
| **Pendientes de Revisión** | Documentos por aprobar |
| **Vencidos** | Documentos expirados |
| **Por Vencer** | Próximos a expirar |

### Alertas
- Documentos pendientes de revisión
- Documentos por vencer (próximos 30 días)
- Documentos vencidos

### Actividad Reciente
Lista de últimos documentos subidos o modificados.

---

## Lista de Documentos

**Ruta:** `/documents/list`

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por título o código |
| **Estado** | Borrador, Pendiente, Aprobado, etc. |
| **Tipo** | Política, Procedimiento, Manual, etc. |
| **Categoría** | Todas las categorías |

### Vista de Documentos
Tarjetas con:
- Ícono según tipo de archivo
- Título y código
- Categoría
- Estado (chip de color)
- Fecha de vencimiento
- Acciones: Ver, Editar, Eliminar

---

## Subir Documento

**Ruta:** `/documents/new`

### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Archivo** | ✅ | Seleccionar archivo |
| **Título** | ✅ | Título del documento |
| **Código** | ❌ | Código único (auto-generado) |
| **Descripción** | ❌ | Descripción del contenido |
| **Tipo** | ✅ | Tipo de documento |
| **Categoría** | ❌ | Categoría |
| **Fecha Vigencia** | ❌ | Desde cuándo es válido |
| **Fecha Vencimiento** | ❌ | Hasta cuándo es válido |
| **Propietario** | ❌ | Responsable del documento |
| **Tags** | ❌ | Etiquetas para búsqueda |

### Tipos de Archivo Permitidos
- PDF
- Word (doc, docx)
- Excel (xls, xlsx)
- PowerPoint (ppt, pptx)
- Imágenes (jpg, png)
- Texto (txt)

### Pasos
1. Hacer clic en **"+ Nuevo Documento"**
2. Seleccionar archivo a subir
3. Completar título
4. Seleccionar tipo de documento
5. Asignar categoría
6. Definir fechas de vigencia (si aplica)
7. Hacer clic en **"Guardar"**

---

## Detalle del Documento

**Ruta:** `/documents/:id`

### Información del Documento
- Título y código
- Tipo y categoría
- Estado (chip de color)
- Versión actual
- Fechas de vigencia
- Propietario
- Tamaño del archivo

### Acciones Disponibles

| Estado | Acciones |
|--------|----------|
| **DRAFT** | Editar, Enviar a Revisión, Eliminar |
| **PENDING_REVIEW** | Aprobar, Rechazar |
| **APPROVED** | Descargar, Nueva Versión, Archivar |
| **REJECTED** | Editar, Reenviar |
| **EXPIRED** | Renovar |

### Tabs Disponibles

#### Tab: Información
Datos generales del documento.

#### Tab: Versiones
Historial de versiones:
- Número de versión
- Fecha de subida
- Usuario que subió
- Descargar versión

#### Tab: Revisiones
Historial de aprobaciones:
- Fecha
- Revisor
- Acción (Aprobado/Rechazado)
- Comentarios

#### Tab: Auditoría
Historial de cambios.

---

## Flujo de Aprobación

### Enviar a Revisión
1. Desde documento en estado DRAFT
2. Clic en **"Enviar a Revisión"**
3. Estado cambia a PENDING_REVIEW

### Aprobar Documento
1. Ir a documento pendiente
2. Revisar contenido
3. Clic en **"Aprobar"**
4. Agregar comentarios (opcional)
5. Estado cambia a APPROVED

### Rechazar Documento
1. Ir a documento pendiente
2. Revisar contenido
3. Clic en **"Rechazar"**
4. Agregar motivo del rechazo
5. Estado cambia a REJECTED

---

## Versiones

### Subir Nueva Versión
1. Ir al detalle del documento
2. Clic en **"Nueva Versión"**
3. Seleccionar nuevo archivo
4. Agregar notas de cambios
5. Guardar
6. La versión se incrementa automáticamente

### Ver Versiones Anteriores
1. Tab "Versiones"
2. Ver lista de todas las versiones
3. Descargar cualquier versión anterior

---

## Categorías

### Lista de Categorías

**Ruta:** `/documents/categories`

Muestra estructura jerárquica de categorías.

### Crear Categoría

**Ruta:** `/documents/categories/new`

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | Código único |
| **Nombre** | ✅ | Nombre de la categoría |
| **Descripción** | ❌ | Descripción |
| **Categoría Padre** | ❌ | Para subcategorías |
| **Estado** | ❌ | Activa (default) |

---

## Control de Vencimientos

### Documentos por Vencer
- El sistema alerta 30 días antes del vencimiento
- Se muestran en el dashboard
- Se pueden filtrar en la lista

### Renovar Documento
1. Ir al documento vencido o por vencer
2. Clic en **"Renovar"**
3. Subir nueva versión del documento
4. Actualizar fecha de vencimiento
5. Enviar para aprobación

---

## Tips y Mejores Prácticas

### Para Documentos
- ✅ Usar títulos descriptivos
- ✅ Categorizar correctamente
- ✅ Definir fechas de vencimiento
- ✅ Mantener versiones actualizadas

### Para Categorías
- ✅ Crear estructura lógica
- ✅ No crear demasiados niveles
- ✅ Usar nombres claros

### Para Aprobaciones
- ✅ Revisar contenido antes de aprobar
- ✅ Documentar motivos de rechazo
- ✅ Procesar pendientes oportunamente

---

## Solución de Problemas

### "No puedo subir el archivo"
- Verificar tamaño del archivo (máximo 50MB)
- Verificar tipo de archivo permitido
- Verificar conexión a internet

### "Documento no aparece en búsqueda"
- Verificar filtros aplicados
- Verificar estado del documento
- Usar términos más específicos

### "No puedo aprobar el documento"
- Verificar permiso `documents:approve`
- Verificar que esté en estado PENDING_REVIEW

### "Documento vencido"
- Subir nueva versión
- Actualizar fecha de vencimiento
- Enviar para nueva aprobación
