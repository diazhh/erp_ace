# 📸 Prompt para Capturas de Pantalla - Seguridad y Salud (HSE)

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de HSE
- **Navegación**: Menú lateral → HSE → Dashboard
- **Nombre archivo**: `10-hse-dashboard.png`
- **Descripción**: Panel con KPIs de seguridad

### Captura 2: Lista de Incidentes
- **Navegación**: Menú lateral → HSE → Incidentes
- **Nombre archivo**: `10-hse-incidentes-lista.png`
- **Descripción**: Filtros y tabla de incidentes

### Captura 3: Formulario de Nuevo Incidente
- **Navegación**: En lista → Clic en "+ Nuevo Incidente"
- **Nombre archivo**: `10-hse-incidentes-nuevo.png`
- **Descripción**: Formulario para reportar incidente

### Captura 4: Detalle de Incidente
- **Navegación**: En lista → Clic en ícono de ojo de un incidente
- **Nombre archivo**: `10-hse-incidentes-detalle.png`
- **Descripción**: Detalle con investigación y acciones

### Captura 5: Lista de Inspecciones
- **Navegación**: Menú lateral → HSE → Inspecciones
- **Nombre archivo**: `10-hse-inspecciones-lista.png`
- **Descripción**: Tabla de inspecciones con estados

### Captura 6: Formulario de Nueva Inspección
- **Navegación**: En lista → Clic en "+ Nueva Inspección"
- **Nombre archivo**: `10-hse-inspecciones-nueva.png`
- **Descripción**: Formulario para programar inspección

### Captura 7: Lista de Capacitaciones
- **Navegación**: Menú lateral → HSE → Capacitaciones
- **Nombre archivo**: `10-hse-capacitaciones-lista.png`
- **Descripción**: Tabla de entrenamientos

### Captura 8: Formulario de Nueva Capacitación
- **Navegación**: En lista → Clic en "+ Nueva Capacitación"
- **Nombre archivo**: `10-hse-capacitaciones-nueva.png`
- **Descripción**: Formulario para programar capacitación

### Captura 9: Lista de Equipos EPP
- **Navegación**: Menú lateral → HSE → Equipos
- **Nombre archivo**: `10-hse-equipos-lista.png`
- **Descripción**: Inventario de equipos de protección

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de HSE del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **10-hse-dashboard.png**
   - En el menú lateral, expande "HSE"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs de seguridad

3. **10-hse-incidentes-lista.png**
   - Haz clic en "Incidentes"
   - Captura mostrando filtros y tabla

4. **10-hse-incidentes-nuevo.png**
   - Haz clic en "+ Nuevo Incidente"
   - Captura el formulario

5. **10-hse-incidentes-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un incidente
   - Captura el detalle

6. **10-hse-inspecciones-lista.png**
   - En el menú, haz clic en "Inspecciones"
   - Captura la lista

7. **10-hse-inspecciones-nueva.png**
   - Haz clic en "+ Nueva Inspección"
   - Captura el formulario

8. **10-hse-capacitaciones-lista.png**
   - En el menú, haz clic en "Capacitaciones"
   - Captura la lista

9. **10-hse-capacitaciones-nueva.png**
   - Haz clic en "+ Nueva Capacitación"
   - Captura el formulario

10. **10-hse-equipos-lista.png**
    - En el menú, haz clic en "Equipos"
    - Captura el inventario

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (incidentes, inspecciones, capacitaciones)
- Los incidentes deben tener diferentes severidades y estados
- Las inspecciones deben tener diferentes resultados
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
