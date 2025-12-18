# 📸 Prompt para Capturas de Pantalla - Gestión de Proyectos

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de Proyectos
- **Navegación**: Menú lateral → Proyectos → Dashboard
- **Nombre archivo**: `06-proyectos-dashboard.png`
- **Descripción**: Panel con KPIs, presupuesto y gráficos

### Captura 2: Gráficos del Dashboard
- **Navegación**: En el dashboard, scroll a los gráficos
- **Nombre archivo**: `06-proyectos-graficos.png`
- **Descripción**: Gráficos de proyectos por estado y prioridad

### Captura 3: Lista de Proyectos
- **Navegación**: Menú lateral → Proyectos → Lista
- **Nombre archivo**: `06-proyectos-lista.png`
- **Descripción**: KPIs, filtros y tabla de proyectos

### Captura 4: Formulario de Nuevo Proyecto
- **Navegación**: En lista → Clic en "+ Nuevo Proyecto"
- **Nombre archivo**: `06-proyectos-nuevo.png`
- **Descripción**: Formulario para crear nuevo proyecto

### Captura 5: Detalle de Proyecto - Resumen
- **Navegación**: En lista → Clic en ícono de ojo de un proyecto
- **Nombre archivo**: `06-proyectos-detalle.png`
- **Descripción**: Encabezado y resumen del proyecto

### Captura 6: Detalle - Pestaña Equipo
- **Navegación**: En detalle → Pestaña "Equipo"
- **Nombre archivo**: `06-proyectos-equipo.png`
- **Descripción**: Lista de miembros del equipo

### Captura 7: Detalle - Pestaña Tareas
- **Navegación**: En detalle → Pestaña "Tareas"
- **Nombre archivo**: `06-proyectos-tareas.png`
- **Descripción**: Lista de tareas del proyecto

### Captura 8: Proyecto con Alerta de Atraso
- **Navegación**: En lista, mostrar un proyecto atrasado
- **Nombre archivo**: `06-proyectos-atrasado.png`
- **Descripción**: Proyecto con indicador de atraso visible

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Proyectos del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **06-proyectos-dashboard.png**
   - En el menú lateral, expande "Proyectos"
   - Haz clic en "Dashboard"
   - Espera a que carguen los gráficos
   - Captura mostrando: KPIs y sección de presupuesto

3. **06-proyectos-graficos.png**
   - En el mismo dashboard, haz scroll hacia abajo
   - Captura los gráficos de estado y prioridad

4. **06-proyectos-lista.png**
   - En el menú lateral, haz clic en "Lista"
   - Espera a que cargue la tabla
   - Captura mostrando: KPIs, filtros y tabla de proyectos

5. **06-proyectos-nuevo.png**
   - Haz clic en el botón "+ Nuevo Proyecto"
   - Captura el formulario vacío

6. **06-proyectos-detalle.png**
   - Vuelve a la lista de proyectos
   - Haz clic en el ícono de ojo de un proyecto
   - Captura el encabezado y resumen

7. **06-proyectos-equipo.png**
   - En el detalle, haz clic en la pestaña "Equipo"
   - Captura la lista de miembros

8. **06-proyectos-tareas.png**
   - Haz clic en la pestaña "Tareas"
   - Captura la lista de tareas

9. **06-proyectos-atrasado.png**
   - Vuelve a la lista de proyectos
   - Si hay un proyecto atrasado (con alerta roja), captúralo
   - Si no hay, captura cualquier proyecto mostrando la barra de progreso

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (proyectos con diferentes estados)
- Al menos un proyecto debe estar atrasado para mostrar la alerta
- Los proyectos deben tener equipo y tareas asignadas
- Los gráficos deben tener datos para mostrar distribuciones
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla y gráfico cargue completamente antes de capturar
