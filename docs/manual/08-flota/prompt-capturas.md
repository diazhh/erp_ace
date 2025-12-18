# 📸 Prompt para Capturas de Pantalla - Gestión de Flota

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de Flota
- **Navegación**: Menú lateral → Flota → Dashboard
- **Nombre archivo**: `08-flota-dashboard.png`
- **Descripción**: Panel con KPIs y alertas

### Captura 2: Lista de Vehículos
- **Navegación**: Menú lateral → Flota → Vehículos
- **Nombre archivo**: `08-flota-vehiculos-lista.png`
- **Descripción**: KPIs, filtros y tabla de vehículos

### Captura 3: Formulario de Nuevo Vehículo
- **Navegación**: En lista → Clic en "+ Nuevo"
- **Nombre archivo**: `08-flota-vehiculos-nuevo.png`
- **Descripción**: Formulario para registrar vehículo

### Captura 4: Detalle de Vehículo
- **Navegación**: En lista → Clic en ícono de ojo de un vehículo
- **Nombre archivo**: `08-flota-vehiculos-detalle.png`
- **Descripción**: Detalle con información y pestañas

### Captura 5: Lista de Mantenimientos
- **Navegación**: Menú lateral → Flota → Mantenimientos
- **Nombre archivo**: `08-flota-mantenimientos-lista.png`
- **Descripción**: Filtros y tabla de mantenimientos

### Captura 6: Formulario de Nuevo Mantenimiento
- **Navegación**: En lista → Clic en "+ Nuevo"
- **Nombre archivo**: `08-flota-mantenimientos-nuevo.png`
- **Descripción**: Formulario para programar mantenimiento

### Captura 7: Lista de Combustible
- **Navegación**: Menú lateral → Flota → Combustible
- **Nombre archivo**: `08-flota-combustible-lista.png`
- **Descripción**: Filtros y tabla de cargas de combustible

### Captura 8: Formulario de Carga de Combustible
- **Navegación**: En lista → Clic en "+ Nuevo"
- **Nombre archivo**: `08-flota-combustible-nuevo.png`
- **Descripción**: Formulario para registrar carga

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Flota del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **08-flota-dashboard.png**
   - En el menú lateral, expande "Flota"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs y alertas

3. **08-flota-vehiculos-lista.png**
   - Haz clic en "Vehículos"
   - Espera a que cargue la tabla
   - Captura mostrando KPIs, filtros y tabla

4. **08-flota-vehiculos-nuevo.png**
   - Haz clic en "+ Nuevo"
   - Captura el formulario vacío

5. **08-flota-vehiculos-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un vehículo
   - Captura el detalle con pestañas

6. **08-flota-mantenimientos-lista.png**
   - En el menú, haz clic en "Mantenimientos"
   - Captura la lista con filtros

7. **08-flota-mantenimientos-nuevo.png**
   - Haz clic en "+ Nuevo"
   - Captura el formulario

8. **08-flota-combustible-lista.png**
   - En el menú, haz clic en "Combustible"
   - Captura la lista con filtros

9. **08-flota-combustible-nuevo.png**
   - Haz clic en "+ Nuevo"
   - Captura el formulario

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (vehículos, mantenimientos, cargas)
- Los vehículos deben tener diferentes estados para mostrar variedad
- Debe haber mantenimientos en diferentes estados
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
