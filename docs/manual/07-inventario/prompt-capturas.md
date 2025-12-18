# 📸 Prompt para Capturas de Pantalla - Inventario y Almacén

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de Inventario
- **Navegación**: Menú lateral → Inventario → Dashboard
- **Nombre archivo**: `07-inventario-dashboard.png`
- **Descripción**: Panel con KPIs y alertas de stock bajo

### Captura 2: Lista de Artículos
- **Navegación**: Menú lateral → Inventario → Artículos
- **Nombre archivo**: `07-inventario-articulos-lista.png`
- **Descripción**: Filtros y tabla de artículos con stock

### Captura 3: Formulario de Nuevo Artículo
- **Navegación**: En lista → Clic en "+ Nuevo Artículo"
- **Nombre archivo**: `07-inventario-articulos-nuevo.png`
- **Descripción**: Formulario para crear nuevo artículo

### Captura 4: Detalle de Artículo
- **Navegación**: En lista → Clic en ícono de ojo de un artículo
- **Nombre archivo**: `07-inventario-articulos-detalle.png`
- **Descripción**: Detalle con stock por almacén y movimientos

### Captura 5: Lista de Almacenes
- **Navegación**: Menú lateral → Inventario → Almacenes
- **Nombre archivo**: `07-inventario-almacenes-lista.png`
- **Descripción**: Tabla de almacenes con tipos y estados

### Captura 6: Formulario de Nuevo Almacén
- **Navegación**: En lista → Clic en "+ Nuevo Almacén"
- **Nombre archivo**: `07-inventario-almacenes-nuevo.png`
- **Descripción**: Formulario para crear nuevo almacén

### Captura 7: Detalle de Almacén
- **Navegación**: En lista → Clic en ícono de ojo de un almacén
- **Nombre archivo**: `07-inventario-almacenes-detalle.png`
- **Descripción**: Detalle con inventario del almacén

### Captura 8: Lista de Movimientos
- **Navegación**: Menú lateral → Inventario → Movimientos
- **Nombre archivo**: `07-inventario-movimientos-lista.png`
- **Descripción**: Filtros y tabla de movimientos

### Captura 9: Formulario de Nuevo Movimiento
- **Navegación**: En lista → Clic en "+ Nuevo Movimiento"
- **Nombre archivo**: `07-inventario-movimientos-nuevo.png`
- **Descripción**: Formulario para registrar movimiento

### Captura 10: Artículo con Alerta de Stock Bajo
- **Navegación**: En lista de artículos, mostrar uno con stock bajo
- **Nombre archivo**: `07-inventario-stock-bajo.png`
- **Descripción**: Artículo con indicador de alerta amarillo/rojo

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Inventario del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **07-inventario-dashboard.png**
   - En el menú lateral, expande "Inventario"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs y alertas

3. **07-inventario-articulos-lista.png**
   - Haz clic en "Artículos"
   - Espera a que cargue la tabla
   - Captura mostrando filtros y tabla

4. **07-inventario-articulos-nuevo.png**
   - Haz clic en "+ Nuevo Artículo"
   - Captura el formulario vacío

5. **07-inventario-articulos-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un artículo
   - Captura el detalle

6. **07-inventario-almacenes-lista.png**
   - En el menú, haz clic en "Almacenes"
   - Captura la lista de almacenes

7. **07-inventario-almacenes-nuevo.png**
   - Haz clic en "+ Nuevo Almacén"
   - Captura el formulario

8. **07-inventario-almacenes-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un almacén
   - Captura el detalle con inventario

9. **07-inventario-movimientos-lista.png**
   - En el menú, haz clic en "Movimientos"
   - Captura la lista con filtros

10. **07-inventario-movimientos-nuevo.png**
    - Haz clic en "+ Nuevo Movimiento"
    - Captura el formulario

11. **07-inventario-stock-bajo.png**
    - Vuelve a la lista de artículos
    - Activa el filtro "Stock Bajo"
    - Captura mostrando artículos con alerta

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (artículos, almacenes, movimientos)
- Al menos un artículo debe tener stock bajo para mostrar la alerta
- Los almacenes deben tener inventario para mostrar en el detalle
- Debe haber movimientos de diferentes tipos (entrada, salida, transferencia)
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
