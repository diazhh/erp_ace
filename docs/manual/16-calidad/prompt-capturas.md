# 📸 Prompt para Capturas de Pantalla - Control de Calidad

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de Calidad
- **Navegación**: Menú lateral → Calidad → Dashboard
- **Nombre archivo**: `16-calidad-dashboard.png`
- **Descripción**: Panel con KPIs de calidad

### Captura 2: Lista de Inspecciones
- **Navegación**: Menú lateral → Calidad → Inspecciones
- **Nombre archivo**: `16-calidad-inspecciones-lista.png`
- **Descripción**: Filtros y tabla de inspecciones

### Captura 3: Formulario de Nueva Inspección
- **Navegación**: En lista → Clic en "+ Nueva Inspección"
- **Nombre archivo**: `16-calidad-inspecciones-nueva.png`
- **Descripción**: Formulario para crear inspección

### Captura 4: Detalle de Inspección
- **Navegación**: En lista → Clic en ícono de ojo de una inspección
- **Nombre archivo**: `16-calidad-inspecciones-detalle.png`
- **Descripción**: Detalle con resultado y hallazgos

### Captura 5: Lista de No Conformidades
- **Navegación**: Menú lateral → Calidad → No Conformidades
- **Nombre archivo**: `16-calidad-nc-lista.png`
- **Descripción**: Tabla de NC con estados y tipos

### Captura 6: Formulario de Nueva NC
- **Navegación**: En lista → Clic en "+ Nueva NC"
- **Nombre archivo**: `16-calidad-nc-nueva.png`
- **Descripción**: Formulario para registrar NC

### Captura 7: Detalle de NC
- **Navegación**: En lista → Clic en ícono de ojo de una NC
- **Nombre archivo**: `16-calidad-nc-detalle.png`
- **Descripción**: Detalle con análisis y acciones

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Control de Calidad del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **16-calidad-dashboard.png**
   - En el menú lateral, expande "Calidad"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs

3. **16-calidad-inspecciones-lista.png**
   - Haz clic en "Inspecciones"
   - Captura mostrando filtros y tabla

4. **16-calidad-inspecciones-nueva.png**
   - Haz clic en "+ Nueva Inspección"
   - Captura el formulario

5. **16-calidad-inspecciones-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de una inspección
   - Captura el detalle

6. **16-calidad-nc-lista.png**
   - En el menú, haz clic en "No Conformidades"
   - Captura la lista

7. **16-calidad-nc-nueva.png**
   - Haz clic en "+ Nueva NC"
   - Captura el formulario

8. **16-calidad-nc-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de una NC
   - Captura el detalle

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (inspecciones, NC)
- Las inspecciones deben tener diferentes resultados
- Las NC deben estar en diferentes estados y tipos
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
