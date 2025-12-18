# 🤝 Módulo de CRM - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"CRM"**
2. Se despliegan las opciones:
   - Dashboard
   - Clientes
   - Oportunidades

---

## Dashboard CRM

**Ruta:** `/crm`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Total Clientes** | Cantidad de clientes |
| **Clientes Activos** | Clientes con estado activo |
| **Oportunidades Abiertas** | En proceso |
| **Valor Pipeline** | Suma de oportunidades |

### Pipeline Visual
Muestra oportunidades por etapa:
- Nueva → Calificada → Propuesta → Negociación → Ganada/Perdida

### Actividades Pendientes
Lista de seguimientos programados.

---

## Clientes

### Lista de Clientes

**Ruta:** `/crm/clients`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por nombre o código |
| **Estado** | Prospecto, Activo, Inactivo, Suspendido |
| **Categoría** | A, B, C, D |
| **Tipo** | Empresa, Persona |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre/Razón social |
| **Tipo** | Empresa/Persona |
| **Categoría** | A, B, C, D |
| **Email** | Email principal |
| **Teléfono** | Teléfono principal |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar, Eliminar |

---

### Crear Cliente

**Ruta:** `/crm/clients/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ | Empresa o Persona |
| **Nombre** | ✅ | Nombre o razón social |
| **RIF/Cédula** | ❌ | Identificación fiscal |
| **Email** | ❌ | Correo electrónico |
| **Teléfono** | ❌ | Teléfono principal |
| **Dirección** | ❌ | Dirección física |
| **Categoría** | ❌ | A, B, C, D |
| **Industria** | ❌ | Sector/Industria |
| **Sitio Web** | ❌ | URL del sitio web |
| **Notas** | ❌ | Observaciones |

#### Pasos
1. Hacer clic en **"+ Nuevo Cliente"**
2. Seleccionar tipo (Empresa/Persona)
3. Completar nombre
4. Agregar datos de contacto
5. Asignar categoría
6. Hacer clic en **"Guardar"**

---

### Detalle del Cliente

**Ruta:** `/crm/clients/:id`

#### Información del Cliente
- Nombre y código
- Tipo y categoría
- Datos de contacto
- Estado

#### Tabs Disponibles

##### Tab: Información
Datos generales del cliente.

##### Tab: Contactos
Lista de contactos del cliente:
- Nombre
- Cargo
- Email
- Teléfono
- Es contacto principal

**Agregar Contacto:**
1. Clic en "Agregar Contacto"
2. Completar datos
3. Marcar si es principal
4. Guardar

##### Tab: Oportunidades
Oportunidades asociadas al cliente.

##### Tab: Cotizaciones
Cotizaciones enviadas al cliente.

##### Tab: Actividades
Historial de interacciones:
- Llamadas
- Reuniones
- Emails
- Notas

##### Tab: Documentos
Archivos adjuntos.

##### Tab: Auditoría
Historial de cambios.

---

## Oportunidades

### Lista de Oportunidades

**Ruta:** `/crm/opportunities`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por nombre o código |
| **Etapa** | Nueva, Calificada, Propuesta, etc. |
| **Estado** | Abierta, Ganada, Perdida |
| **Responsable** | Empleados |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre de la oportunidad |
| **Cliente** | Cliente asociado |
| **Valor** | Valor estimado |
| **Probabilidad** | % de cierre |
| **Etapa** | Etapa actual |
| **Fecha Cierre** | Fecha esperada |
| **Responsable** | Quien gestiona |
| **Acciones** | Ver, Editar |

---

### Crear Oportunidad

**Ruta:** `/crm/opportunities/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Nombre** | ✅ | Nombre descriptivo |
| **Cliente** | ✅ | Cliente asociado |
| **Valor** | ✅ | Valor estimado |
| **Moneda** | ✅ | USD, VES |
| **Probabilidad** | ❌ | % de cierre (0-100) |
| **Fecha Cierre Esperada** | ❌ | Cuándo se espera cerrar |
| **Etapa** | ✅ | Etapa inicial |
| **Responsable** | ❌ | Quien gestiona |
| **Origen** | ❌ | Cómo llegó el lead |
| **Descripción** | ❌ | Detalles |

#### Pasos
1. Hacer clic en **"+ Nueva Oportunidad"**
2. Seleccionar cliente
3. Ingresar nombre y valor
4. Definir probabilidad
5. Asignar responsable
6. Hacer clic en **"Guardar"**

---

### Detalle de Oportunidad

**Ruta:** `/crm/opportunities/:id`

#### Información
- Nombre y código
- Cliente (enlace)
- Valor y probabilidad
- Etapa actual
- Fecha esperada de cierre
- Responsable

#### Acciones

| Acción | Descripción |
|--------|-------------|
| **Avanzar Etapa** | Mover a siguiente etapa |
| **Marcar Ganada** | Cerrar como ganada |
| **Marcar Perdida** | Cerrar como perdida |
| **Crear Cotización** | Generar cotización |

#### Tabs
- **Información**: Datos generales
- **Cotizaciones**: Cotizaciones generadas
- **Actividades**: Historial de seguimiento
- **Documentos**: Archivos adjuntos

---

## Pipeline de Ventas

### Etapas del Pipeline

```
NUEVA → CALIFICADA → PROPUESTA → NEGOCIACIÓN → GANADA
                                            ↘ PERDIDA
```

### Avanzar Oportunidad
1. Ir al detalle de la oportunidad
2. Clic en **"Avanzar Etapa"**
3. Confirmar el cambio
4. La oportunidad pasa a la siguiente etapa

### Cerrar Oportunidad
- **Ganada**: Se concretó la venta
- **Perdida**: No se concretó (registrar motivo)

---

## Cotizaciones

### Crear Cotización
1. Desde la oportunidad, clic en **"Crear Cotización"**
2. Agregar items con precios
3. Definir validez
4. Guardar
5. Enviar al cliente

### Items de Cotización
- Descripción
- Cantidad
- Precio unitario
- Descuento
- Total

---

## Actividades

### Tipos de Actividad
- **Llamada**: Llamada telefónica
- **Reunión**: Reunión presencial o virtual
- **Email**: Correo electrónico
- **Nota**: Nota interna

### Registrar Actividad
1. Desde el cliente u oportunidad
2. Clic en **"Nueva Actividad"**
3. Seleccionar tipo
4. Completar descripción
5. Programar seguimiento (opcional)
6. Guardar

---

## Tips y Mejores Prácticas

### Para Clientes
- ✅ Mantener datos de contacto actualizados
- ✅ Categorizar correctamente
- ✅ Registrar todas las interacciones

### Para Oportunidades
- ✅ Actualizar etapas regularmente
- ✅ Mantener probabilidad realista
- ✅ Documentar motivos de pérdida

### Para Seguimiento
- ✅ Registrar todas las actividades
- ✅ Programar seguimientos
- ✅ No dejar oportunidades sin atender

---

## Solución de Problemas

### "No puedo eliminar el cliente"
- Verificar que no tenga oportunidades activas
- Verificar permisos de usuario

### "Oportunidad no avanza de etapa"
- Verificar que no esté cerrada
- Verificar permisos de usuario

### "No veo las cotizaciones"
- Verificar que se hayan creado desde la oportunidad
- Verificar permisos de lectura
