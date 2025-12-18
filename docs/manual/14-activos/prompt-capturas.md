# 📸 Prompt para Capturas de Pantalla - Activos Fijos

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Lista de Activos
- **Navegación**: Menú lateral → Activos → Activos
- **Nombre archivo**: `14-activos-lista.png`
- **Descripción**: KPIs, filtros y tabla de activos

### Captura 2: Formulario de Nuevo Activo
- **Navegación**: En lista → Clic en "+ Nuevo"
- **Nombre archivo**: `14-activos-nuevo.png`
- **Descripción**: Formulario para registrar activo

### Captura 3: Detalle de Activo
- **Navegación**: En lista → Clic en ícono de ojo de un activo
- **Nombre archivo**: `14-activos-detalle.png`
- **Descripción**: Detalle con depreciación y asignaciones

### Captura 4: Lista de Categorías
- **Navegación**: Menú lateral → Activos → Categorías
- **Nombre archivo**: `14-activos-categorias.png`
- **Descripción**: Lista de categorías de activos

### Captura 5: Formulario de Nueva Categoría
- **Navegación**: En lista → Clic en "+ Nueva Categoría"
- **Nombre archivo**: `14-activos-categoria-nueva.png`
- **Descripción**: Formulario para crear categoría

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Activos Fijos del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **14-activos-lista.png**
   - En el menú lateral, expande "Activos"
   - Haz clic en "Activos"
   - Captura mostrando KPIs, filtros y tabla

3. **14-activos-nuevo.png**
   - Haz clic en "+ Nuevo"
   - Captura el formulario

4. **14-activos-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un activo
   - Captura el detalle con depreciación

5. **14-activos-categorias.png**
   - En el menú, haz clic en "Categorías"
   - Captura la lista

6. **14-activos-categoria-nueva.png**
   - Haz clic en "+ Nueva Categoría"
   - Captura el formulario

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (activos, categorías)
- Los activos deben tener diferentes estados y condiciones
- Debe haber activos con depreciación calculada
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
