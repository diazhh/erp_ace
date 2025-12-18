# 📸 Prompt para Capturas de Pantalla - Panel Principal (Dashboard)

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard Completo - Parte Superior
- **Navegación**: Iniciar sesión (se abre automáticamente)
- **Nombre archivo**: `12-dashboard-kpis.png`
- **Descripción**: Encabezado con saludo y tarjetas de KPIs

### Captura 2: Dashboard - Gráficos
- **Navegación**: En el dashboard, scroll hacia abajo
- **Nombre archivo**: `12-dashboard-graficos.png`
- **Descripción**: Gráfico de flujo de caja y panel de alertas

### Captura 3: Dashboard - Gráficos Adicionales
- **Navegación**: Continuar scroll si hay más gráficos
- **Nombre archivo**: `12-dashboard-graficos-adicionales.png`
- **Descripción**: Gráficos de proyectos por estado y gastos por categoría

### Captura 4: Dashboard en Móvil
- **Navegación**: Reducir viewport a 375x812 (iPhone)
- **Nombre archivo**: `12-dashboard-mobile.png`
- **Descripción**: Vista responsive del dashboard

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del Dashboard principal del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema
   - El Dashboard se abre automáticamente

2. **12-dashboard-kpis.png**
   - Captura la parte superior del dashboard
   - Debe mostrar: encabezado con saludo y las 6 tarjetas de KPIs

3. **12-dashboard-graficos.png**
   - Haz scroll hacia abajo
   - Captura mostrando: gráfico de flujo de caja y panel de alertas

4. **12-dashboard-graficos-adicionales.png**
   - Si hay más gráficos visibles (proyectos por estado, gastos por categoría)
   - Captura esos gráficos adicionales

5. **12-dashboard-mobile.png**
   - Cambia el viewport a 375x812 (tamaño iPhone)
   - Vuelve al inicio del dashboard
   - Captura la vista móvil mostrando las tarjetas apiladas

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos en todos los módulos para que los KPIs muestren valores
- El gráfico de flujo de caja debe tener datos de varios meses
- Debe haber alertas para mostrar en el panel
- Las capturas deben mostrar información realista
- El menú lateral puede estar visible u oculto según la captura
- Esperar a que todos los gráficos carguen completamente antes de capturar
