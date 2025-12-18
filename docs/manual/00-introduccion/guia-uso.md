# 📖 Introducción al ERP - Guía de Uso

## Acceso al Sistema

### URL de Acceso
- **Producción**: (configurar según despliegue)
- **Desarrollo**: http://localhost:5173

### Credenciales por Defecto
- **Usuario**: `admin`
- **Contraseña**: `Admin123!`

> ⚠️ **Importante**: Cambiar la contraseña después del primer inicio de sesión.

---

## Iniciar Sesión

### Paso 1: Abrir la página de login
Navegar a la URL del sistema. Se mostrará la pantalla de inicio de sesión.

![Página de Login](screenshots/login.png)

### Paso 2: Ingresar credenciales
1. Escribir el **nombre de usuario** en el campo "Usuario"
2. Escribir la **contraseña** en el campo "Contraseña"
3. Opcionalmente, hacer clic en el ícono 👁️ para ver la contraseña

### Paso 3: Hacer clic en "Ingresar"
Si las credenciales son correctas, se redirigirá al **Dashboard principal**.

---

## Navegación Básica

### Menú Lateral (Sidebar)

El menú lateral izquierdo contiene todos los módulos del sistema:

![Menú Lateral](screenshots/dashboard.png)

| Sección | Módulos |
|---------|---------|
| **Principal** | Dashboard |
| **RRHH** | Empleados, Organización, Nómina |
| **Finanzas** | Finanzas, Caja Chica |
| **Operaciones** | Proyectos, Compras, Inventario, Flota |
| **Seguridad** | HSE |
| **Documentación** | Documentos |
| **Activos** | Activos Fijos |
| **Comercial** | CRM |
| **Calidad** | Control de Calidad |
| **Oil & Gas** | Producción, AFE, Contratos O&G, Compliance, JIB, Permisos de Trabajo |
| **Sistema** | Reportes, Administración |

### Expandir/Colapsar Submenús
- Hacer clic en la **flecha ▼** junto al nombre del módulo para ver las opciones
- Hacer clic nuevamente para colapsar

### Colapsar Menú Lateral
- En pantallas pequeñas, el menú se colapsa automáticamente
- Hacer clic en el ícono ☰ para mostrar/ocultar el menú

---

## Header (Barra Superior)

### Elementos del Header

| Elemento | Función |
|----------|---------|
| **Logo/Nombre** | Nombre del sistema y empresa |
| **Selector de Idioma** 🌐 | Cambiar entre Español, Inglés y Portugués |
| **Usuario** | Nombre del usuario actual |
| **Avatar** | Menú de usuario (perfil, configuración, cerrar sesión) |

---

## Cambiar Idioma

### Paso 1: Hacer clic en el ícono de idioma 🌐
Se encuentra en la esquina superior derecha.

### Paso 2: Seleccionar el idioma deseado
- 🇪🇸 **Español** (ES)
- 🇺🇸 **English** (EN)
- 🇧🇷 **Português** (PT)

### Paso 3: El sistema se actualiza automáticamente
Todos los textos, menús y mensajes cambiarán al idioma seleccionado.

> 💡 **Tip**: La preferencia de idioma se guarda y se mantiene al volver a iniciar sesión.

---

## Dashboard Principal

El Dashboard muestra un resumen de todos los módulos:

![Dashboard Principal](screenshots/dashboard.png)

### KPIs (Indicadores Clave)

| KPI | Descripción |
|-----|-------------|
| **Empleados Activos** | Número de empleados activos en el sistema |
| **Proyectos Activos** | Proyectos en estado activo |
| **Balance del Mes** | Balance financiero del mes actual |
| **Items en Inventario** | Total de items en stock |
| **Vehículos Activos** | Vehículos operativos |
| **Pendientes de Conciliar** | Transacciones por conciliar |

### Gráficos

- **Flujo de Caja**: Ingresos vs Gastos por mes
- **Proyectos por Estado**: Distribución de proyectos
- **Gastos por Categoría**: Desglose de gastos
- **Saldos por Moneda**: Balance en USD, VES, etc.
- **Presupuesto de Proyectos**: Presupuesto vs Gasto real

### Alertas
Panel de alertas con:
- Proyectos atrasados
- Documentos por vencer
- Mantenimientos pendientes
- Stock bajo

---

## Cerrar Sesión

### Opción 1: Desde el menú de usuario
1. Hacer clic en el **avatar** o nombre de usuario (esquina superior derecha)
2. Seleccionar **"Cerrar Sesión"**

### Opción 2: Desde Configuración
1. Ir a **Administración → Configuración**
2. En la sección de seguridad, hacer clic en **"Cerrar Sesión"**

---

## Patrones de Navegación

### Lista de Elementos
Todas las listas siguen el mismo patrón:

```
/modulo              → Lista de elementos
/modulo/new          → Crear nuevo elemento
/modulo/:id          → Ver detalle del elemento
/modulo/:id/edit     → Editar elemento
```

### Acciones Comunes

| Acción | Cómo hacerlo |
|--------|--------------|
| **Ver lista** | Hacer clic en el módulo en el menú lateral |
| **Crear nuevo** | Botón "Nuevo" o "+" en la parte superior |
| **Ver detalle** | Hacer clic en la fila o en el botón "Ver" |
| **Editar** | Botón "Editar" en el detalle o en la lista |
| **Eliminar** | Botón "Eliminar" (requiere confirmación) |
| **Buscar** | Campo de búsqueda en la parte superior de la lista |
| **Filtrar** | Selectores de filtro según el módulo |

### Tabs en Detalle
Los detalles de entidades tienen **tabs** para organizar la información:

- **Información**: Datos principales
- **Relacionados**: Entidades vinculadas
- **Documentos**: Archivos adjuntos
- **Auditoría**: Historial de cambios

---

## Responsive (Móvil y Tablet)

### En pantallas pequeñas:
- Las **tablas** se convierten en **tarjetas**
- El **menú lateral** se oculta y aparece con el botón ☰
- Los **formularios** se muestran en una sola columna
- Los **tabs** son scrollables horizontalmente

### Tips para móvil:
- Deslizar horizontalmente para ver más columnas en tablas
- Usar el botón de menú para navegar
- Los botones de acción se agrupan en menús desplegables

---

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + K` | Búsqueda global (si está habilitada) |
| `Esc` | Cerrar modal/diálogo |
| `Enter` | Confirmar acción en formularios |

---

## Solución de Problemas

### No puedo iniciar sesión
1. Verificar que el usuario y contraseña sean correctos
2. Verificar que Caps Lock esté desactivado
3. Contactar al administrador si el problema persiste

### La página no carga
1. Verificar conexión a internet
2. Limpiar caché del navegador (Ctrl + Shift + R)
3. Probar en otro navegador

### Error al guardar
1. Verificar que todos los campos obligatorios (*) estén completos
2. Revisar el mensaje de error específico
3. Contactar soporte si el error persiste

---

## Próximos Pasos

Después de familiarizarse con la navegación básica, se recomienda:

1. **Cambiar contraseña** en Configuración
2. **Configurar preferencias** de idioma y tema
3. **Explorar el Dashboard** para ver el estado general
4. **Revisar los módulos** según su rol y permisos
