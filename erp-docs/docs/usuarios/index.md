# 👤 Usuarios y Accesos

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Administración"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Usuarios**: Gestión de cuentas
   - **Roles**: Gestión de roles y permisos

> ⚠️ **Nota**: Solo usuarios con permisos de administración pueden acceder a este módulo.

---

## Lista de Usuarios

![Lista de Usuarios](./images/13-usuarios-lista.png)

### Ver Todos los Usuarios

1. En el menú, seleccione **"Administración"** → **"Usuarios"**
2. Verá indicadores y la tabla/tarjetas de usuarios

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **Total Usuarios** | Cantidad de usuarios registrados |
| **Activos** | Usuarios que pueden iniciar sesión |
| **Inactivos** | Usuarios desactivados |
| **Con Empleado** | Usuarios vinculados a empleados |

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por nombre, usuario o email |
| **Estado** | Activo, Inactivo |
| **Rol** | Filtrar por rol asignado |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Avatar** | Iniciales del usuario |
| **Nombre** | Nombre completo |
| **Usuario** | Nombre de usuario (username) |
| **Email** | Correo electrónico |
| **Empleado** | Empleado vinculado (si hay) |
| **Roles** | Roles asignados |
| **Estado** | Activo o Inactivo |
| **Acciones** | Ver, Editar, Restablecer, Activar/Desactivar |

---

### Crear un Nuevo Usuario

![Nuevo Usuario](./images/13-usuarios-nuevo.png)

1. Haga clic en el botón **"+ Nuevo Usuario"**
2. Se abrirá una página con el formulario

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Nombre** | ✅ Sí | Nombre del usuario |
| **Apellido** | ✅ Sí | Apellido del usuario |
| **Usuario** | ✅ Sí | Nombre de usuario para login |
| **Email** | ✅ Sí | Correo electrónico |
| **Contraseña** | ✅ Sí | Contraseña inicial |
| **Confirmar Contraseña** | ✅ Sí | Repetir contraseña |
| **Empleado** | ❌ No | Vincular a un empleado |
| **Roles** | ✅ Sí | Seleccionar uno o más roles |
| **Activo** | ✅ Sí | Si puede iniciar sesión |

3. Complete los campos requeridos
4. Haga clic en **"Guardar"**

---

### Ver Detalle de un Usuario

1. En la lista, haga clic en el ícono de **ojo** (👁)
2. Verá:
   - Información del usuario
   - Roles asignados
   - Permisos efectivos
   - Empleado vinculado
   - Historial de accesos

---

### Editar un Usuario

1. En la lista o detalle, haga clic en el ícono de **lápiz** (✏️)
2. Modifique los campos necesarios
3. Haga clic en **"Guardar"**

> **Nota**: No puede cambiar el nombre de usuario (username) después de creado.

---

### Activar/Desactivar un Usuario

1. En la lista, haga clic en el ícono de **persona** (activar/desactivar)
2. Confirme la acción
3. El estado cambia inmediatamente

| Acción | Efecto |
|--------|--------|
| **Desactivar** | El usuario no puede iniciar sesión |
| **Activar** | El usuario puede iniciar sesión nuevamente |

---

### Restablecer Contraseña

1. En la lista, haga clic en el ícono de **llave** (🔑)
2. Confirme la acción
3. Se genera una contraseña temporal
4. **Copie la contraseña** y entréguela al usuario
5. El usuario deberá cambiarla en su próximo inicio de sesión

> ⚠️ **Importante**: La contraseña temporal solo se muestra una vez. Cópiela antes de cerrar el diálogo.

---

## Gestión de Roles

### Ver Lista de Roles

![Lista de Roles](./images/13-usuarios-roles-lista.png)

1. En el menú, seleccione **"Administración"** → **"Roles"**
2. Verá la lista de roles disponibles

### Roles Predefinidos

| Rol | Descripción |
|-----|-------------|
| **Administrador** | Acceso total |
| **Supervisor** | Acceso con aprobaciones |
| **Usuario** | Acceso básico |

### Crear un Nuevo Rol

1. Haga clic en **"+ Nuevo Rol"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Nombre** | ✅ Sí | Nombre del rol |
| **Descripción** | ❌ No | Descripción del rol |
| **Permisos** | ✅ Sí | Seleccionar permisos |

3. Marque los permisos que tendrá el rol
4. Haga clic en **"Guardar"**

---

### Asignar Permisos

Los permisos se organizan por módulo:

| Módulo | Permisos Disponibles |
|--------|---------------------|
| **Empleados** | Leer, Crear, Editar, Eliminar |
| **Proyectos** | Leer, Crear, Editar, Eliminar, Aprobar |
| **Finanzas** | Leer, Crear, Editar, Aprobar, Conciliar |
| **Inventario** | Leer, Crear, Editar, Mover |
| **HSE** | Leer, Crear, Editar, Aprobar |
| **Usuarios** | Leer, Crear, Editar, Restablecer |

---

## Consejos Útiles

### Para Crear Usuarios
- ✅ Use nombres de usuario fáciles de recordar
- ✅ Vincule a empleados cuando sea posible
- ✅ Asigne solo los roles necesarios
- ✅ Use contraseñas seguras

### Para Gestionar Accesos
- ✅ Desactive usuarios que ya no necesitan acceso
- ✅ Revise los roles periódicamente
- ✅ No comparta cuentas entre personas
- ✅ Restablezca contraseñas si hay sospecha de compromiso

### Para Roles
- ✅ Cree roles específicos para cada función
- ✅ Siga el principio de mínimo privilegio
- ✅ Documente qué hace cada rol

---

## Preguntas Frecuentes

### ¿Puedo eliminar un usuario?
No se recomienda eliminar usuarios. Es mejor desactivarlos para mantener el historial de auditoría.

### ¿Qué pasa si olvido mi contraseña?
Contacte a un administrador para que restablezca su contraseña.

### ¿Puedo tener varios roles?
Sí. Un usuario puede tener múltiples roles y tendrá todos los permisos combinados.

### ¿Por qué no veo ciertos módulos?
Su rol no tiene permisos para esos módulos. Contacte a un administrador si necesita acceso.

### ¿Cómo cambio mi propia contraseña?
Vaya a Configuración (ícono de engranaje) → Cambiar Contraseña.

### ¿Puedo ver quién hizo qué en el sistema?
Sí, el sistema registra todas las acciones. Consulte el módulo de Auditoría.
