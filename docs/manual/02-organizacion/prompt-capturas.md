# 📸 Prompt para Capturas de Pantalla - Estructura Organizacional

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Lista de Departamentos
- **Navegación**: Menú lateral → Organización → Departamentos
- **Nombre archivo**: `02-organizacion-departamentos-lista.png`
- **Descripción**: Pantalla principal mostrando la tabla de departamentos con columnas, filtros y botón de nuevo

### Captura 2: Formulario de Nuevo Departamento
- **Navegación**: En lista de departamentos → Clic en "+ Nuevo Departamento"
- **Nombre archivo**: `02-organizacion-departamentos-nuevo.png`
- **Descripción**: Formulario vacío para crear nuevo departamento

### Captura 3: Detalle de Departamento
- **Navegación**: En lista → Clic en ícono de edificio de un departamento
- **Nombre archivo**: `02-organizacion-departamentos-detalle.png`
- **Descripción**: Página de detalle mostrando información del departamento

### Captura 4: Lista de Cargos
- **Navegación**: Menú lateral → Organización → Cargos
- **Nombre archivo**: `02-organizacion-cargos-lista.png`
- **Descripción**: Tabla de cargos mostrando niveles, departamentos y rangos salariales

### Captura 5: Formulario de Nuevo Cargo
- **Navegación**: En lista de cargos → Clic en "+ Nuevo Cargo"
- **Nombre archivo**: `02-organizacion-cargos-nuevo.png`
- **Descripción**: Formulario para crear nuevo cargo

### Captura 6: Organigrama - Vista por Departamentos
- **Navegación**: Menú lateral → Organización → Organigrama
- **Nombre archivo**: `02-organizacion-organigrama-departamentos.png`
- **Descripción**: Organigrama visual mostrando estructura de departamentos

### Captura 7: Organigrama - Vista por Jerarquía
- **Navegación**: En organigrama → Clic en botón de árbol (vista por jerarquía)
- **Nombre archivo**: `02-organizacion-organigrama-jerarquia.png`
- **Descripción**: Organigrama mostrando cadena de supervisión

### Captura 8: Directorio de Empleados - Vista Cuadrícula
- **Navegación**: Menú lateral → Organización → Directorio
- **Nombre archivo**: `02-organizacion-directorio-grid.png`
- **Descripción**: Directorio mostrando tarjetas de empleados con fotos y datos de contacto

### Captura 9: Directorio con Filtro Alfabético
- **Navegación**: En directorio → Clic en letra "A" del filtro alfabético
- **Nombre archivo**: `02-organizacion-directorio-filtro.png`
- **Descripción**: Directorio filtrado por letra inicial del apellido

### Captura 10: Directorio - Vista Lista
- **Navegación**: En directorio → Clic en botón de vista lista
- **Nombre archivo**: `02-organizacion-directorio-lista.png`
- **Descripción**: Directorio en formato de lista compacta

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Estructura Organizacional del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **02-organizacion-departamentos-lista.png**
   - En el menú lateral, expande "Organización"
   - Haz clic en "Departamentos"
   - Espera a que cargue la tabla
   - Captura mostrando: título, botón nuevo, tabla con departamentos

3. **02-organizacion-departamentos-nuevo.png**
   - Haz clic en el botón "+ Nuevo Departamento"
   - Espera a que cargue el formulario
   - Captura el formulario vacío

4. **02-organizacion-departamentos-detalle.png**
   - Vuelve a la lista de departamentos
   - Haz clic en el ícono de edificio de un departamento
   - Captura la página de detalle

5. **02-organizacion-cargos-lista.png**
   - En el menú lateral, haz clic en "Cargos"
   - Espera a que cargue la tabla
   - Captura mostrando la lista de cargos

6. **02-organizacion-cargos-nuevo.png**
   - Haz clic en el botón "+ Nuevo Cargo"
   - Captura el formulario vacío

7. **02-organizacion-organigrama-departamentos.png**
   - En el menú lateral, haz clic en "Organigrama"
   - Asegúrate de que esté en vista "Por Departamentos"
   - Captura el organigrama visual

8. **02-organizacion-organigrama-jerarquia.png**
   - Haz clic en el botón de árbol para cambiar a vista "Por Jerarquía"
   - Captura el organigrama por jerarquía

9. **02-organizacion-directorio-grid.png**
   - En el menú lateral, haz clic en "Directorio"
   - Asegúrate de que esté en vista de cuadrícula
   - Captura mostrando las tarjetas de empleados

10. **02-organizacion-directorio-filtro.png**
    - Haz clic en la letra "A" del filtro alfabético
    - Captura mostrando el filtro aplicado

11. **02-organizacion-directorio-lista.png**
    - Haz clic en el botón de vista lista
    - Captura el directorio en formato lista

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (departamentos, cargos, empleados)
- El organigrama debe tener al menos 2-3 niveles de profundidad para mostrar la estructura
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en todas las capturas
- Esperar a que cada pantalla cargue completamente antes de capturar
