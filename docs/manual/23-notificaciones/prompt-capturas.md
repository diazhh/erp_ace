# 📸 Prompt para Capturas de Pantalla - Notificaciones (WhatsApp/Email)

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Panel de Notificaciones
- **Navegación**: Clic en ícono de campana en barra superior
- **Nombre archivo**: `23-notificaciones-panel.png`
- **Descripción**: Panel desplegable con notificaciones

### Captura 2: Historial de Notificaciones
- **Navegación**: En panel → Clic en "Ver todas"
- **Nombre archivo**: `23-notificaciones-historial.png`
- **Descripción**: Lista completa de notificaciones

### Captura 3: Configuración de Notificaciones
- **Navegación**: Avatar → Configuración → Notificaciones
- **Nombre archivo**: `23-notificaciones-configuracion.png`
- **Descripción**: Preferencias de notificaciones

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del sistema de Notificaciones del ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **23-notificaciones-panel.png**
   - En la barra superior, haz clic en el ícono de campana
   - Captura el panel desplegable con notificaciones

3. **23-notificaciones-historial.png**
   - En el panel, haz clic en "Ver todas"
   - Captura la lista completa

4. **23-notificaciones-configuracion.png**
   - Haz clic en tu avatar (esquina superior derecha)
   - Selecciona "Configuración" o "Preferencias"
   - Ve a la sección de Notificaciones
   - Captura las opciones de configuración

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya notificaciones de ejemplo
- Las notificaciones deben ser de diferentes tipos
- Las capturas deben mostrar información realista
- Esperar a que cada pantalla cargue completamente antes de capturar
