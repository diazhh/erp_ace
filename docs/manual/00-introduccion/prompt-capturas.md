# 📸 Prompt para Capturas de Pantalla - Introducción al Sistema

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Pantalla de Login
- **Navegación**: Ir a la página principal sin autenticar
- **Nombre archivo**: `00-login.png`
- **Descripción**: Pantalla de inicio de sesión mostrando campos de usuario y contraseña

### Captura 2: Dashboard Principal
- **Navegación**: Iniciar sesión y esperar a que cargue el dashboard
- **Nombre archivo**: `00-dashboard-principal.png`
- **Descripción**: Panel principal con KPIs, gráficos y alertas visibles

### Captura 3: Menú Lateral Expandido
- **Navegación**: En el dashboard, expandir varios módulos del menú lateral
- **Nombre archivo**: `00-menu-lateral.png`
- **Descripción**: Menú lateral mostrando la estructura de navegación

### Captura 4: Ejemplo de Lista con Filtros
- **Navegación**: Ir a Empleados > Lista de Empleados
- **Nombre archivo**: `00-ejemplo-lista.png`
- **Descripción**: Ejemplo de pantalla de lista mostrando tabla, filtros y botón de nuevo

### Captura 5: Ejemplo de Detalle con Tabs
- **Navegación**: Ir al detalle de un empleado
- **Nombre archivo**: `00-ejemplo-detalle.png`
- **Descripción**: Ejemplo de pantalla de detalle mostrando información y pestañas

### Captura 6: Ejemplo de Formulario
- **Navegación**: Ir a crear nuevo empleado (sin guardar)
- **Nombre archivo**: `00-ejemplo-formulario.png`
- **Descripción**: Ejemplo de formulario mostrando campos y botones

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

CAPTURAS A TOMAR:

1. **00-login.png**
   - Navega a http://localhost:5173 (sin autenticar)
   - Captura la pantalla de login

2. **00-dashboard-principal.png**
   - Inicia sesión con las credenciales
   - Espera a que cargue completamente el dashboard
   - Captura mostrando KPIs, gráficos y menú lateral

3. **00-menu-lateral.png**
   - En el dashboard, haz clic en varios módulos del menú para expandirlos
   - Captura mostrando la estructura del menú

4. **00-ejemplo-lista.png**
   - Navega a la sección de Empleados
   - Captura la lista mostrando tabla, filtros y botón de nuevo

5. **00-ejemplo-detalle.png**
   - Haz clic en un empleado para ver su detalle
   - Captura mostrando la información y las pestañas disponibles

6. **00-ejemplo-formulario.png**
   - Navega a crear nuevo empleado
   - Captura el formulario vacío mostrando los campos

Guarda todas las capturas con los nombres indicados.
```

---

## Notas Adicionales

- Las capturas deben mostrar el sistema con datos de ejemplo
- Evitar capturar información sensible o datos reales
- Asegurarse de que el menú lateral sea visible en las capturas
- Las capturas deben estar en español (idioma por defecto del sistema)
