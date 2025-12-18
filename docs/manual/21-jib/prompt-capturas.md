# 📸 Prompt para Capturas de Pantalla - Facturación Conjunta (JIB)

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de JIB
- **Navegación**: Menú lateral → JIB → Dashboard
- **Nombre archivo**: `21-jib-dashboard.png`
- **Descripción**: Panel con KPIs de facturación

### Captura 2: Lista de JIBs
- **Navegación**: Menú lateral → JIB → JIBs
- **Nombre archivo**: `21-jib-lista.png`
- **Descripción**: Tabla de JIBs con estados

### Captura 3: Formulario de Nuevo JIB
- **Navegación**: En lista → Clic en "+ Nuevo JIB"
- **Nombre archivo**: `21-jib-nuevo.png`
- **Descripción**: Formulario para crear JIB

### Captura 4: Detalle de JIB
- **Navegación**: En lista → Clic en ícono de ojo de un JIB
- **Nombre archivo**: `21-jib-detalle.png`
- **Descripción**: Detalle con costos y participaciones

### Captura 5: Lista de Cash Calls
- **Navegación**: Menú lateral → JIB → Cash Calls
- **Nombre archivo**: `21-jib-cashcalls-lista.png`
- **Descripción**: Lista de llamadas de capital

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de JIB del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **21-jib-dashboard.png**
   - En el menú lateral, expande "JIB"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs

3. **21-jib-lista.png**
   - Haz clic en "JIBs"
   - Captura la lista

4. **21-jib-nuevo.png**
   - Haz clic en "+ Nuevo JIB"
   - Captura el formulario

5. **21-jib-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un JIB
   - Captura el detalle

6. **21-jib-cashcalls-lista.png**
   - En el menú, haz clic en "Cash Calls"
   - Captura la lista

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (JIBs, Cash Calls)
- Los JIBs deben tener diferentes estados
- Las capturas deben mostrar información realista
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
