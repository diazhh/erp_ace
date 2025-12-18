# 📸 Prompt para Capturas de Pantalla - Usuarios y Accesos

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Lista de Usuarios
- **Navegación**: Menú lateral → Administración → Usuarios
- **Nombre archivo**: `13-usuarios-lista.png`
- **Descripción**: KPIs, filtros y tabla de usuarios

### Captura 2: Formulario de Nuevo Usuario
- **Navegación**: En lista → Clic en "+ Nuevo Usuario"
- **Nombre archivo**: `13-usuarios-nuevo.png`
- **Descripción**: Formulario para crear usuario

### Captura 3: Detalle de Usuario
- **Navegación**: En lista → Clic en ícono de ojo de un usuario
- **Nombre archivo**: `13-usuarios-detalle.png`
- **Descripción**: Detalle con roles y permisos

### Captura 4: Lista de Roles
- **Navegación**: Menú lateral → Administración → Roles
- **Nombre archivo**: `13-usuarios-roles-lista.png`
- **Descripción**: Lista de roles disponibles

### Captura 5: Formulario de Nuevo Rol
- **Navegación**: En lista → Clic en "+ Nuevo Rol"
- **Nombre archivo**: `13-usuarios-roles-nuevo.png`
- **Descripción**: Formulario con selección de permisos

### Captura 6: Diálogo de Contraseña Temporal
- **Navegación**: En lista → Clic en ícono de llave de un usuario
- **Nombre archivo**: `13-usuarios-password.png`
- **Descripción**: Diálogo mostrando contraseña temporal

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Usuarios del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **13-usuarios-lista.png**
   - En el menú lateral, expande "Administración"
   - Haz clic en "Usuarios"
   - Captura mostrando KPIs, filtros y tabla

3. **13-usuarios-nuevo.png**
   - Haz clic en "+ Nuevo Usuario"
   - Captura el formulario

4. **13-usuarios-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un usuario
   - Captura el detalle

5. **13-usuarios-roles-lista.png**
   - En el menú, haz clic en "Roles"
   - Captura la lista de roles

6. **13-usuarios-roles-nuevo.png**
   - Haz clic en "+ Nuevo Rol"
   - Captura el formulario con permisos

7. **13-usuarios-password.png**
   - Vuelve a la lista de usuarios
   - Haz clic en el ícono de llave de un usuario (no el admin)
   - Captura el diálogo de contraseña temporal

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya varios usuarios con diferentes roles
- Debe haber roles predefinidos (Administrador, Supervisor, Usuario)
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
- No restablecer la contraseña del usuario admin
