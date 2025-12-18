# 📸 Prompt para Capturas de Pantalla - Finanzas y Contabilidad

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard Financiero
- **Navegación**: Menú lateral → Finanzas → Dashboard
- **Nombre archivo**: `04-finanzas-dashboard.png`
- **Descripción**: Panel principal con KPIs, saldos por moneda y gráficos

### Captura 2: Gráfico de Flujo de Caja
- **Navegación**: En el dashboard, scroll al gráfico de flujo de caja
- **Nombre archivo**: `04-finanzas-flujo-caja.png`
- **Descripción**: Gráfico de área mostrando ingresos vs gastos por mes

### Captura 3: Lista de Cuentas Bancarias
- **Navegación**: Menú lateral → Finanzas → Cuentas
- **Nombre archivo**: `04-finanzas-cuentas-lista.png`
- **Descripción**: Tarjetas de cuentas con saldos y tipos

### Captura 4: Formulario de Nueva Cuenta
- **Navegación**: En lista de cuentas → Clic en "+ Nueva Cuenta"
- **Nombre archivo**: `04-finanzas-cuentas-nueva.png`
- **Descripción**: Formulario para crear nueva cuenta bancaria

### Captura 5: Detalle de Cuenta
- **Navegación**: En lista → Clic en ícono de ojo de una cuenta
- **Nombre archivo**: `04-finanzas-cuentas-detalle.png`
- **Descripción**: Detalle de cuenta con historial de transacciones

### Captura 6: Lista de Transacciones
- **Navegación**: Menú lateral → Finanzas → Transacciones
- **Nombre archivo**: `04-finanzas-transacciones-lista.png`
- **Descripción**: KPIs, filtros y tabla de transacciones

### Captura 7: Formulario de Nuevo Ingreso
- **Navegación**: En lista → Clic en "+ Nuevo Ingreso"
- **Nombre archivo**: `04-finanzas-transacciones-ingreso.png`
- **Descripción**: Formulario para registrar un ingreso

### Captura 8: Formulario de Nuevo Gasto
- **Navegación**: En lista → Clic en "+ Nuevo Gasto"
- **Nombre archivo**: `04-finanzas-transacciones-gasto.png`
- **Descripción**: Formulario para registrar un gasto

### Captura 9: Formulario de Transferencia
- **Navegación**: En lista → Clic en "+ Nueva Transferencia"
- **Nombre archivo**: `04-finanzas-transacciones-transferencia.png`
- **Descripción**: Formulario para transferencia entre cuentas

### Captura 10: Detalle de Transacción
- **Navegación**: En lista → Clic en una transacción
- **Nombre archivo**: `04-finanzas-transacciones-detalle.png`
- **Descripción**: Detalle completo de una transacción

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Finanzas del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **04-finanzas-dashboard.png**
   - En el menú lateral, expande "Finanzas"
   - Haz clic en "Dashboard"
   - Espera a que carguen los gráficos
   - Captura mostrando: KPIs, saldos por moneda, inicio de gráficos

3. **04-finanzas-flujo-caja.png**
   - En el mismo dashboard, haz scroll hacia abajo
   - Captura el gráfico de flujo de caja mensual

4. **04-finanzas-cuentas-lista.png**
   - En el menú lateral, haz clic en "Cuentas"
   - Espera a que carguen las tarjetas
   - Captura mostrando las cuentas con sus saldos

5. **04-finanzas-cuentas-nueva.png**
   - Haz clic en el botón "+ Nueva Cuenta"
   - Captura el formulario vacío

6. **04-finanzas-cuentas-detalle.png**
   - Vuelve a la lista de cuentas
   - Haz clic en el ícono de ojo de una cuenta
   - Captura el detalle con historial

7. **04-finanzas-transacciones-lista.png**
   - En el menú lateral, haz clic en "Transacciones"
   - Espera a que cargue la tabla
   - Captura mostrando KPIs, filtros y tabla

8. **04-finanzas-transacciones-ingreso.png**
   - Haz clic en el botón "+ Nuevo Ingreso"
   - Captura el formulario

9. **04-finanzas-transacciones-gasto.png**
   - Cierra el formulario anterior
   - Haz clic en el botón "+ Nuevo Gasto"
   - Captura el formulario

10. **04-finanzas-transacciones-transferencia.png**
    - Cierra el formulario anterior
    - Haz clic en el botón "+ Nueva Transferencia"
    - Captura el formulario

11. **04-finanzas-transacciones-detalle.png**
    - Vuelve a la lista de transacciones
    - Haz clic en una transacción para ver su detalle
    - Captura la página de detalle

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (cuentas, transacciones)
- Los gráficos deben tener datos para mostrar tendencias
- Al menos una cuenta debe tener transacciones para mostrar el historial
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla y gráfico cargue completamente antes de capturar
