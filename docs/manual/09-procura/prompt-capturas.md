# 📸 Prompt para Capturas de Pantalla - Compras y Procura

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Lista de Órdenes de Compra
- **Navegación**: Menú lateral → Procura → Órdenes de Compra
- **Nombre archivo**: `09-procura-ordenes-lista.png`
- **Descripción**: Filtros y tabla de órdenes con estados y progreso

### Captura 2: Formulario de Nueva Orden
- **Navegación**: En lista → Clic en "+ Nueva Orden"
- **Nombre archivo**: `09-procura-ordenes-nueva.png`
- **Descripción**: Formulario para crear orden de compra

### Captura 3: Detalle de Orden de Compra
- **Navegación**: En lista → Clic en ícono de ojo de una orden
- **Nombre archivo**: `09-procura-ordenes-detalle.png`
- **Descripción**: Detalle con ítems, entregas y facturas

### Captura 4: Lista de Facturas
- **Navegación**: Menú lateral → Procura → Facturas
- **Nombre archivo**: `09-procura-facturas-lista.png`
- **Descripción**: Tabla de facturas con estados y montos

### Captura 5: Formulario de Nueva Factura
- **Navegación**: En lista → Clic en "+ Nueva Factura"
- **Nombre archivo**: `09-procura-facturas-nueva.png`
- **Descripción**: Formulario para registrar factura

### Captura 6: Detalle de Factura
- **Navegación**: En lista → Clic en ícono de ojo de una factura
- **Nombre archivo**: `09-procura-facturas-detalle.png`
- **Descripción**: Detalle con pagos asociados

### Captura 7: Lista de Pagos
- **Navegación**: Menú lateral → Procura → Pagos
- **Nombre archivo**: `09-procura-pagos-lista.png`
- **Descripción**: Historial de pagos realizados

### Captura 8: Formulario de Nuevo Pago
- **Navegación**: En lista → Clic en "+ Nuevo Pago"
- **Nombre archivo**: `09-procura-pagos-nuevo.png`
- **Descripción**: Formulario para registrar pago

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Procura del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **09-procura-ordenes-lista.png**
   - En el menú lateral, expande "Procura"
   - Haz clic en "Órdenes de Compra"
   - Captura mostrando filtros y tabla

3. **09-procura-ordenes-nueva.png**
   - Haz clic en "+ Nueva Orden"
   - Captura el formulario vacío

4. **09-procura-ordenes-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de una orden
   - Captura el detalle con ítems

5. **09-procura-facturas-lista.png**
   - En el menú, haz clic en "Facturas"
   - Captura la lista de facturas

6. **09-procura-facturas-nueva.png**
   - Haz clic en "+ Nueva Factura"
   - Captura el formulario

7. **09-procura-facturas-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de una factura
   - Captura el detalle

8. **09-procura-pagos-lista.png**
   - En el menú, haz clic en "Pagos"
   - Captura la lista de pagos

9. **09-procura-pagos-nuevo.png**
   - Haz clic en "+ Nuevo Pago"
   - Captura el formulario

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (órdenes, facturas, pagos)
- Las órdenes deben tener diferentes estados y tipos
- Debe haber facturas en diferentes estados (pendiente, aprobada, pagada)
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
