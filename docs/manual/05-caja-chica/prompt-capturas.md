# 📸 Prompt para Capturas de Pantalla - Caja Chica

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Lista de Cajas Chicas
- **Navegación**: Menú lateral → Caja Chica
- **Nombre archivo**: `05-caja-chica-lista.png`
- **Descripción**: Pantalla principal con KPIs y tarjetas de cajas chicas

### Captura 2: Formulario de Nueva Caja Chica
- **Navegación**: En lista → Clic en "+ Nueva Caja Chica"
- **Nombre archivo**: `05-caja-chica-nueva.png`
- **Descripción**: Formulario para crear nueva caja chica

### Captura 3: Detalle de Caja Chica - Encabezado
- **Navegación**: En lista → Clic en ícono de ojo de una caja
- **Nombre archivo**: `05-caja-chica-detalle.png`
- **Descripción**: Encabezado con información, saldo y botones de acción

### Captura 4: Detalle - Lista de Movimientos
- **Navegación**: En el detalle, pestaña "Movimientos"
- **Nombre archivo**: `05-caja-chica-movimientos.png`
- **Descripción**: Tabla de movimientos con tipos, montos y estados

### Captura 5: Formulario de Registro de Gasto
- **Navegación**: En detalle → Clic en "Registrar Gasto"
- **Nombre archivo**: `05-caja-chica-gasto.png`
- **Descripción**: Formulario para registrar un gasto

### Captura 6: Formulario de Reposición
- **Navegación**: En detalle → Clic en "Reponer"
- **Nombre archivo**: `05-caja-chica-reposicion.png`
- **Descripción**: Formulario para solicitar reposición

### Captura 7: Caja con Alerta de Reposición
- **Navegación**: En lista, mostrar una caja con saldo bajo
- **Nombre archivo**: `05-caja-chica-alerta.png`
- **Descripción**: Tarjeta de caja con borde rojo y alerta de reposición

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Caja Chica del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **05-caja-chica-lista.png**
   - En el menú lateral, haz clic en "Caja Chica"
   - Espera a que carguen las tarjetas
   - Captura mostrando: KPIs superiores y tarjetas de cajas

3. **05-caja-chica-nueva.png**
   - Haz clic en el botón "+ Nueva Caja Chica"
   - Captura el formulario vacío

4. **05-caja-chica-detalle.png**
   - Vuelve a la lista de cajas
   - Haz clic en el ícono de ojo de una caja activa
   - Captura el encabezado con información y botones

5. **05-caja-chica-movimientos.png**
   - En el mismo detalle, asegúrate de estar en la pestaña "Movimientos"
   - Captura la tabla de movimientos

6. **05-caja-chica-gasto.png**
   - Haz clic en el botón "Registrar Gasto" (rojo)
   - Captura el formulario de gasto

7. **05-caja-chica-reposicion.png**
   - Cierra el formulario anterior
   - Haz clic en el botón "Reponer" (verde)
   - Captura el formulario de reposición

8. **05-caja-chica-alerta.png**
   - Vuelve a la lista de cajas
   - Si hay una caja con saldo bajo (borde rojo), captúrala
   - Si no hay, captura cualquier caja mostrando la barra de saldo

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (cajas chicas con movimientos)
- Al menos una caja debe tener saldo bajo para mostrar la alerta
- Los movimientos deben incluir gastos y reposiciones
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
