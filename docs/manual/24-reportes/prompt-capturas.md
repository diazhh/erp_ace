# 📸 Prompt para Capturas de Pantalla - Reportes y Exportación

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Centro de Reportes - Empleados
- **Navegación**: Menú lateral → Reportes
- **Nombre archivo**: `24-reportes-empleados.png`
- **Descripción**: Pestaña de reportes de empleados

### Captura 2: Centro de Reportes - Finanzas
- **Navegación**: Clic en pestaña "Finanzas"
- **Nombre archivo**: `24-reportes-finanzas.png`
- **Descripción**: Pestaña de reportes financieros

### Captura 3: Centro de Reportes - Inventario
- **Navegación**: Clic en pestaña "Inventario"
- **Nombre archivo**: `24-reportes-inventario.png`
- **Descripción**: Pestaña de reportes de inventario

### Captura 4: Centro de Reportes - Flota
- **Navegación**: Clic en pestaña "Flota"
- **Nombre archivo**: `24-reportes-flota.png`
- **Descripción**: Pestaña de reportes de flota

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Reportes del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **24-reportes-empleados.png**
   - En el menú lateral, haz clic en "Reportes"
   - Captura la pestaña de Empleados (primera pestaña)

3. **24-reportes-finanzas.png**
   - Haz clic en la pestaña "Finanzas"
   - Captura mostrando los reportes financieros

4. **24-reportes-inventario.png**
   - Haz clic en la pestaña "Inventario"
   - Captura mostrando los reportes de inventario

5. **24-reportes-flota.png**
   - Haz clic en la pestaña "Flota"
   - Captura mostrando los reportes de flota

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo para los selectores
- Las capturas deben mostrar los filtros y botones de descarga
- El menú lateral debe ser visible en las capturas
- Esperar a que cada pantalla cargue completamente antes de capturar
