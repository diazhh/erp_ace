# 📸 Prompt para Capturas de Pantalla - Nómina y Pagos

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Lista de Períodos de Nómina
- **Navegación**: Menú lateral → Nómina → Períodos
- **Nombre archivo**: `03-nomina-periodos-lista.png`
- **Descripción**: Pantalla principal mostrando KPIs, filtros y tabla de períodos

### Captura 2: Formulario de Nuevo Período
- **Navegación**: En lista de períodos → Clic en "+ Nuevo Período"
- **Nombre archivo**: `03-nomina-periodos-nuevo.png`
- **Descripción**: Formulario para crear nuevo período de nómina

### Captura 3: Detalle de Período - Resumen
- **Navegación**: En lista → Clic en ícono de ojo de un período
- **Nombre archivo**: `03-nomina-periodos-detalle.png`
- **Descripción**: Página de detalle mostrando KPIs, información y botones de acción

### Captura 4: Detalle de Período - Tabla de Entradas
- **Navegación**: En el detalle del período, scroll hacia la tabla de entradas
- **Nombre archivo**: `03-nomina-periodos-entradas.png`
- **Descripción**: Tabla mostrando las entradas de nómina por empleado

### Captura 5: Lista de Préstamos
- **Navegación**: Menú lateral → Nómina → Préstamos
- **Nombre archivo**: `03-nomina-prestamos-lista.png`
- **Descripción**: Lista de préstamos con filtros, tabla y barra de progreso

### Captura 6: Formulario de Nuevo Préstamo
- **Navegación**: En lista de préstamos → Clic en "+ Nuevo Préstamo"
- **Nombre archivo**: `03-nomina-prestamos-nuevo.png`
- **Descripción**: Formulario para crear nuevo préstamo

### Captura 7: Detalle de Préstamo
- **Navegación**: En lista → Clic en ícono de ojo de un préstamo
- **Nombre archivo**: `03-nomina-prestamos-detalle.png`
- **Descripción**: Detalle del préstamo con progreso e historial de pagos

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Nómina del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **03-nomina-periodos-lista.png**
   - En el menú lateral, expande "Nómina"
   - Haz clic en "Períodos"
   - Espera a que cargue la tabla
   - Captura mostrando: KPIs superiores, filtros, tabla de períodos

3. **03-nomina-periodos-nuevo.png**
   - Haz clic en el botón "+ Nuevo Período"
   - Espera a que se abra el formulario/diálogo
   - Captura el formulario vacío

4. **03-nomina-periodos-detalle.png**
   - Cierra el formulario si está abierto
   - Haz clic en el ícono de ojo de un período existente
   - Captura la parte superior con KPIs y botones de acción

5. **03-nomina-periodos-entradas.png**
   - En el mismo detalle, haz scroll hacia abajo
   - Captura la tabla de entradas de nómina

6. **03-nomina-prestamos-lista.png**
   - En el menú lateral, haz clic en "Préstamos"
   - Espera a que cargue la tabla
   - Captura mostrando filtros y lista de préstamos

7. **03-nomina-prestamos-nuevo.png**
   - Haz clic en el botón "+ Nuevo Préstamo"
   - Captura el formulario de nuevo préstamo

8. **03-nomina-prestamos-detalle.png**
   - Vuelve a la lista de préstamos
   - Haz clic en el ícono de ojo de un préstamo
   - Captura el detalle con progreso e historial

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (períodos de nómina, préstamos)
- Al menos un período debe tener entradas generadas para mostrar la tabla
- Al menos un préstamo debe tener pagos registrados para mostrar el historial
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
