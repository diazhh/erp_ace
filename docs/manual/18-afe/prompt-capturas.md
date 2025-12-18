# 📸 Prompt para Capturas de Pantalla - Autorizaciones de Gasto (AFE)

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de AFE
- **Navegación**: Menú lateral → AFE → Dashboard
- **Nombre archivo**: `18-afe-dashboard.png`
- **Descripción**: Panel con KPIs de AFEs

### Captura 2: Lista de AFEs
- **Navegación**: Menú lateral → AFE → AFEs
- **Nombre archivo**: `18-afe-lista.png`
- **Descripción**: Tabla de AFEs con estados

### Captura 3: Formulario de Nuevo AFE
- **Navegación**: En lista → Clic en "+ Nuevo AFE"
- **Nombre archivo**: `18-afe-nuevo.png`
- **Descripción**: Formulario para crear AFE

### Captura 4: Detalle de AFE
- **Navegación**: En lista → Clic en ícono de ojo de un AFE
- **Nombre archivo**: `18-afe-detalle.png`
- **Descripción**: Detalle con desglose y aprobaciones

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de AFE del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **18-afe-dashboard.png**
   - En el menú lateral, expande "AFE"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs

3. **18-afe-lista.png**
   - Haz clic en "AFEs"
   - Captura la lista

4. **18-afe-nuevo.png**
   - Haz clic en "+ Nuevo AFE"
   - Captura el formulario

5. **18-afe-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un AFE
   - Captura el detalle

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (AFEs en diferentes estados)
- Los AFEs deben tener diferentes tipos y montos
- Las capturas deben mostrar información realista
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
