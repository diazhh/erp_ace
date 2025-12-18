# 📸 Prompt para Capturas de Pantalla - Producción y Pozos

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de Producción
- **Navegación**: Menú lateral → Producción → Dashboard
- **Nombre archivo**: `17-produccion-dashboard.png`
- **Descripción**: Panel con KPIs de producción

### Captura 2: Lista de Campos
- **Navegación**: Menú lateral → Producción → Campos
- **Nombre archivo**: `17-produccion-campos-lista.png`
- **Descripción**: Tabla de campos petroleros

### Captura 3: Formulario de Nuevo Campo
- **Navegación**: En lista → Clic en "+ Nuevo Campo"
- **Nombre archivo**: `17-produccion-campos-nuevo.png`
- **Descripción**: Formulario para registrar campo

### Captura 4: Lista de Pozos
- **Navegación**: Menú lateral → Producción → Pozos
- **Nombre archivo**: `17-produccion-pozos-lista.png`
- **Descripción**: Tabla de pozos con estados

### Captura 5: Formulario de Nuevo Pozo
- **Navegación**: En lista → Clic en "+ Nuevo Pozo"
- **Nombre archivo**: `17-produccion-pozos-nuevo.png`
- **Descripción**: Formulario para registrar pozo

### Captura 6: Detalle de Pozo
- **Navegación**: En lista → Clic en ícono de ojo de un pozo
- **Nombre archivo**: `17-produccion-pozos-detalle.png`
- **Descripción**: Detalle con historial de producción

### Captura 7: Lista de Producción Diaria
- **Navegación**: Menú lateral → Producción → Producción Diaria
- **Nombre archivo**: `17-produccion-diaria-lista.png`
- **Descripción**: Registros de producción

### Captura 8: Formulario de Producción Diaria
- **Navegación**: En lista → Clic en "+ Nueva Producción"
- **Nombre archivo**: `17-produccion-diaria-nueva.png`
- **Descripción**: Formulario para registrar producción

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Producción del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **17-produccion-dashboard.png**
   - En el menú lateral, expande "Producción"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs

3. **17-produccion-campos-lista.png**
   - Haz clic en "Campos"
   - Captura la lista

4. **17-produccion-campos-nuevo.png**
   - Haz clic en "+ Nuevo Campo"
   - Captura el formulario

5. **17-produccion-pozos-lista.png**
   - En el menú, haz clic en "Pozos"
   - Captura la lista

6. **17-produccion-pozos-nuevo.png**
   - Haz clic en "+ Nuevo Pozo"
   - Captura el formulario

7. **17-produccion-pozos-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un pozo
   - Captura el detalle

8. **17-produccion-diaria-lista.png**
   - En el menú, haz clic en "Producción Diaria"
   - Captura la lista

9. **17-produccion-diaria-nueva.png**
   - Haz clic en "+ Nueva Producción"
   - Captura el formulario

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (campos, pozos, producción)
- Los pozos deben tener diferentes tipos y estados
- Debe haber registros de producción diaria
- Las capturas deben mostrar información realista
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
