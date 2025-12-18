# 📸 Prompt para Capturas de Pantalla - Permisos de Trabajo (PTW)

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de PTW
- **Navegación**: Menú lateral → PTW → Dashboard
- **Nombre archivo**: `22-ptw-dashboard.png`
- **Descripción**: Panel con KPIs de permisos

### Captura 2: Lista de Permisos
- **Navegación**: Menú lateral → PTW → Permisos
- **Nombre archivo**: `22-ptw-permisos-lista.png`
- **Descripción**: Tabla de permisos con estados

### Captura 3: Formulario de Nuevo Permiso
- **Navegación**: En lista → Clic en "+ Nuevo Permiso"
- **Nombre archivo**: `22-ptw-permisos-nuevo.png`
- **Descripción**: Formulario para solicitar permiso

### Captura 4: Detalle de Permiso
- **Navegación**: En lista → Clic en ícono de ojo de un permiso
- **Nombre archivo**: `22-ptw-permisos-detalle.png`
- **Descripción**: Detalle con riesgos y medidas

### Captura 5: Lista de Stop Work
- **Navegación**: Menú lateral → PTW → Stop Work
- **Nombre archivo**: `22-ptw-stopwork-lista.png`
- **Descripción**: Lista de paradas de trabajo

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Permisos de Trabajo del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **22-ptw-dashboard.png**
   - En el menú lateral, expande "PTW" o "Permisos de Trabajo"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs

3. **22-ptw-permisos-lista.png**
   - Haz clic en "Permisos"
   - Captura la lista

4. **22-ptw-permisos-nuevo.png**
   - Haz clic en "+ Nuevo Permiso"
   - Captura el formulario

5. **22-ptw-permisos-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un permiso
   - Captura el detalle

6. **22-ptw-stopwork-lista.png**
   - En el menú, haz clic en "Stop Work"
   - Captura la lista

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (permisos, stop works)
- Los permisos deben tener diferentes tipos y estados
- Las capturas deben mostrar información realista
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
