# 💼 Clientes y Ventas (CRM) - Guía de Uso

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"CRM"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores
   - **Clientes**: Gestión de clientes
   - **Oportunidades**: Pipeline de ventas

---

## Dashboard de CRM

### Acceder al Dashboard

1. En el menú, seleccione **"CRM"** → **"Dashboard"**
2. Verá el panel principal con indicadores de ventas

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **Total Clientes** | Cantidad de clientes registrados |
| **Clientes Activos** | Clientes con actividad reciente |
| **Oportunidades Abiertas** | Oportunidades en proceso |
| **Valor del Pipeline** | Suma de oportunidades abiertas |

---

## Clientes

### Ver Lista de Clientes

1. En el menú, seleccione **"CRM"** → **"Clientes"**
2. Verá la tabla/tarjetas de clientes

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por nombre, código o email |
| **Estado** | Prospecto, Activo, Inactivo, Suspendido |
| **Categoría** | A, B, C, D |
| **Tipo** | Empresa, Persona |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre o razón social |
| **Tipo** | Empresa o Persona |
| **Industria** | Sector del cliente |
| **Email** | Correo de contacto |
| **Teléfono** | Teléfono de contacto |
| **Categoría** | Clasificación A-D |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar, Eliminar |

---

### Registrar un Nuevo Cliente

1. Haga clic en el botón **"+ Nuevo Cliente"**
2. Se abrirá una página con el formulario

#### Campos para Empresa

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único |
| **Tipo** | ✅ Sí | Seleccione "Empresa" |
| **Razón Social** | ✅ Sí | Nombre legal |
| **Nombre Comercial** | ❌ No | Nombre de fantasía |
| **RIF** | ❌ No | Registro fiscal |
| **Industria** | ❌ No | Sector de actividad |
| **Email** | ❌ No | Correo principal |
| **Teléfono** | ❌ No | Teléfono principal |
| **Dirección** | ❌ No | Dirección fiscal |
| **Categoría** | ❌ No | A, B, C, D |
| **Estado** | ✅ Sí | Prospecto, Activo, etc. |

#### Campos para Persona

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único |
| **Tipo** | ✅ Sí | Seleccione "Persona" |
| **Nombre** | ✅ Sí | Nombre |
| **Apellido** | ✅ Sí | Apellido |
| **Cédula** | ❌ No | Documento de identidad |
| **Email** | ❌ No | Correo |
| **Teléfono** | ❌ No | Teléfono |

3. Complete los campos requeridos
4. Haga clic en **"Guardar"**

---

### Ver Detalle de un Cliente

1. En la lista, haga clic en el ícono de **ojo** (👁)
2. Verá:
   - Información completa del cliente
   - Contactos asociados
   - Oportunidades relacionadas
   - Historial de actividades
   - Documentos adjuntos

---

### Agregar Contactos a un Cliente

1. En el detalle del cliente, vaya a la pestaña **"Contactos"**
2. Haga clic en **"+ Agregar Contacto"**
3. Complete:
   - Nombre y apellido
   - Cargo
   - Email y teléfono
   - Si es contacto principal
4. Haga clic en **"Guardar"**

---

## Oportunidades

### Ver Lista de Oportunidades

1. En el menú, seleccione **"CRM"** → **"Oportunidades"**
2. Verá la lista de oportunidades de venta

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por título o código |
| **Etapa** | Prospecto, Calificado, Propuesta, etc. |
| **Prioridad** | Baja, Media, Alta, Crítica |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Título** | Nombre de la oportunidad |
| **Cliente** | Cliente asociado |
| **Valor Estimado** | Monto potencial |
| **Probabilidad** | % de cierre |
| **Cierre Esperado** | Fecha estimada |
| **Etapa** | Estado actual |
| **Acciones** | Ver, Editar, Eliminar |

---

### Crear una Oportunidad

1. Haga clic en el botón **"+ Nueva Oportunidad"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único |
| **Título** | ✅ Sí | Nombre descriptivo |
| **Cliente** | ✅ Sí | Seleccione cliente |
| **Valor Estimado** | ❌ No | Monto potencial |
| **Moneda** | ✅ Sí | USD, VES |
| **Probabilidad** | ❌ No | % de cierre (0-100) |
| **Cierre Esperado** | ❌ No | Fecha estimada |
| **Etapa** | ✅ Sí | Prospecto, Calificado, etc. |
| **Prioridad** | ❌ No | Baja, Media, Alta |
| **Descripción** | ❌ No | Detalles de la oportunidad |
| **Responsable** | ❌ No | Empleado asignado |

3. Haga clic en **"Guardar"**

---

### Avanzar una Oportunidad

1. En el detalle de la oportunidad
2. Cambie la **etapa** según el progreso:
   - Prospecto → Calificado (cliente confirmó interés)
   - Calificado → Propuesta (envió cotización)
   - Propuesta → Negociación (discutiendo términos)
   - Negociación → Ganada/Perdida (resultado final)
3. Actualice la **probabilidad** según corresponda
4. Haga clic en **"Guardar"**

---

### Cerrar una Oportunidad

#### Como Ganada
1. Cambie la etapa a **"Ganada"**
2. Registre el valor final
3. Agregue notas del cierre
4. Guarde los cambios

#### Como Perdida
1. Cambie la etapa a **"Perdida"**
2. Seleccione el motivo de pérdida
3. Agregue notas explicativas
4. Guarde los cambios

---

## Consejos Útiles

### Para Clientes
- ✅ Clasifique correctamente por categoría
- ✅ Mantenga actualizada la información de contacto
- ✅ Registre todos los contactos relevantes
- ✅ Documente las interacciones importantes

### Para Oportunidades
- ✅ Actualice la etapa regularmente
- ✅ Sea realista con la probabilidad
- ✅ Defina fechas de cierre alcanzables
- ✅ Registre actividades de seguimiento

---

## Preguntas Frecuentes

### ¿Cuál es la diferencia entre prospecto y cliente activo?
El prospecto es un cliente potencial que aún no ha comprado. El cliente activo ya tiene historial de compras.

### ¿Puedo tener múltiples oportunidades con el mismo cliente?
Sí. Un cliente puede tener varias oportunidades simultáneas o sucesivas.

### ¿Cómo convierto una oportunidad en proyecto?
Al marcar la oportunidad como "Ganada", puede crear un proyecto asociado desde el detalle.

### ¿Puedo reabrir una oportunidad perdida?
No directamente. Debe crear una nueva oportunidad si el cliente vuelve a mostrar interés.

### ¿Cómo veo el historial de un cliente?
En el detalle del cliente, las pestañas muestran oportunidades, actividades y documentos históricos.
