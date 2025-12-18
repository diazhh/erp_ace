# 📸 Prompt para Capturas de Pantalla - Gestión de Empleados

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Lista de Empleados
- **Navegación**: Menú lateral → Empleados
- **Nombre archivo**: `01-empleados-lista.png`
- **Descripción**: Pantalla principal mostrando la lista de empleados con filtros, tabla y botón de nuevo

### Captura 2: Lista con Filtros Aplicados
- **Navegación**: En la lista, aplicar filtro por estado "Activo"
- **Nombre archivo**: `01-empleados-lista-filtrada.png`
- **Descripción**: Lista mostrando solo empleados activos con el filtro visible

### Captura 3: Detalle del Empleado - Pestaña Información
- **Navegación**: Hacer clic en un empleado → Pestaña "Información"
- **Nombre archivo**: `01-empleados-detalle-info.png`
- **Descripción**: Pantalla de detalle mostrando datos personales del empleado

### Captura 4: Detalle del Empleado - Pestaña Trabajo
- **Navegación**: En el detalle → Clic en pestaña "Trabajo"
- **Nombre archivo**: `01-empleados-detalle-trabajo.png`
- **Descripción**: Pestaña mostrando información laboral (cargo, departamento, salario)

### Captura 5: Detalle del Empleado - Pestaña Cuentas
- **Navegación**: En el detalle → Clic en pestaña "Cuentas"
- **Nombre archivo**: `01-empleados-detalle-cuentas.png`
- **Descripción**: Pestaña mostrando cuentas bancarias del empleado

### Captura 6: Detalle del Empleado - Pestaña Jerarquía
- **Navegación**: En el detalle → Clic en pestaña "Jerarquía"
- **Nombre archivo**: `01-empleados-detalle-jerarquia.png`
- **Descripción**: Pestaña mostrando supervisor y subordinados

### Captura 7: Formulario de Nuevo Empleado
- **Navegación**: Lista → Botón "+ Nuevo Empleado"
- **Nombre archivo**: `01-empleados-formulario-nuevo.png`
- **Descripción**: Formulario vacío para crear nuevo empleado

### Captura 8: Formulario de Edición
- **Navegación**: Detalle de empleado → Botón "Editar"
- **Nombre archivo**: `01-empleados-formulario-editar.png`
- **Descripción**: Formulario con datos del empleado para edición

### Captura 9: Agregar Cuenta Bancaria
- **Navegación**: Detalle → Cuentas → "+ Agregar Cuenta"
- **Nombre archivo**: `01-empleados-nueva-cuenta.png`
- **Descripción**: Formulario para agregar cuenta bancaria

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Empleados del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **01-empleados-lista.png**
   - En el menú lateral, haz clic en "Empleados"
   - Espera a que cargue la lista completa
   - Captura mostrando: título, botón nuevo, filtros, tabla con empleados

3. **01-empleados-lista-filtrada.png**
   - En la lista, haz clic en el filtro de Estado
   - Selecciona "Activo"
   - Captura mostrando el filtro aplicado y los resultados

4. **01-empleados-detalle-info.png**
   - Haz clic en el nombre de un empleado para ver su detalle
   - Asegúrate de estar en la pestaña "Información"
   - Captura mostrando los datos personales

5. **01-empleados-detalle-trabajo.png**
   - En el detalle, haz clic en la pestaña "Trabajo"
   - Captura mostrando información laboral

6. **01-empleados-detalle-cuentas.png**
   - Haz clic en la pestaña "Cuentas"
   - Captura mostrando las cuentas bancarias

7. **01-empleados-detalle-jerarquia.png**
   - Haz clic en la pestaña "Jerarquía"
   - Captura mostrando supervisor y subordinados

8. **01-empleados-formulario-nuevo.png**
   - Vuelve a la lista de empleados
   - Haz clic en el botón "+ Nuevo Empleado"
   - Captura el formulario vacío

9. **01-empleados-formulario-editar.png**
   - Vuelve al detalle de un empleado
   - Haz clic en el botón "Editar"
   - Captura el formulario con datos

10. **01-empleados-nueva-cuenta.png**
    - En el detalle, ve a la pestaña "Cuentas"
    - Haz clic en "+ Agregar Cuenta"
    - Captura el formulario de cuenta bancaria

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo en el sistema
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en todas las capturas
- Esperar a que cada pantalla cargue completamente antes de capturar
