# 📸 Prompt para Capturas de Pantalla - Gestión Documental

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de Documentos
- **Navegación**: Menú lateral → Documentos → Dashboard
- **Nombre archivo**: `11-documentos-dashboard.png`
- **Descripción**: Panel con KPIs y alertas

### Captura 2: Lista de Documentos
- **Navegación**: Menú lateral → Documentos → Documentos
- **Nombre archivo**: `11-documentos-lista.png`
- **Descripción**: Filtros y tabla de documentos

### Captura 3: Formulario de Nuevo Documento
- **Navegación**: En lista → Clic en "+ Nuevo Documento"
- **Nombre archivo**: `11-documentos-nuevo.png`
- **Descripción**: Formulario para crear documento

### Captura 4: Detalle de Documento
- **Navegación**: En lista → Clic en ícono de ojo de un documento
- **Nombre archivo**: `11-documentos-detalle.png`
- **Descripción**: Detalle con archivo y versiones

### Captura 5: Lista de Categorías
- **Navegación**: Menú lateral → Documentos → Categorías
- **Nombre archivo**: `11-documentos-categorias.png`
- **Descripción**: Lista de categorías

### Captura 6: Formulario de Nueva Categoría
- **Navegación**: En lista → Clic en "+ Nueva Categoría"
- **Nombre archivo**: `11-documentos-categoria-nueva.png`
- **Descripción**: Formulario para crear categoría

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Documentos del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **11-documentos-dashboard.png**
   - En el menú lateral, expande "Documentos"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs y alertas

3. **11-documentos-lista.png**
   - Haz clic en "Documentos"
   - Captura mostrando filtros y tabla

4. **11-documentos-nuevo.png**
   - Haz clic en "+ Nuevo Documento"
   - Captura el formulario

5. **11-documentos-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un documento
   - Captura el detalle

6. **11-documentos-categorias.png**
   - En el menú, haz clic en "Categorías"
   - Captura la lista

7. **11-documentos-categoria-nueva.png**
   - Haz clic en "+ Nueva Categoría"
   - Captura el formulario

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (documentos, categorías)
- Los documentos deben tener diferentes estados y tipos
- Debe haber documentos con fechas de vencimiento
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
