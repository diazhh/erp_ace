# 📸 Prompt para Capturas de Pantalla - Configuración del Sistema

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Página de Configuración
- **Navegación**: Avatar (esquina superior derecha) → Configuración
- **Nombre archivo**: `25-configuracion-general.png`
- **Descripción**: Vista general de configuración

### Captura 2: Configuración de WhatsApp
- **Navegación**: En página de configuración, sección WhatsApp
- **Nombre archivo**: `25-configuracion-whatsapp.png`
- **Descripción**: Sección de configuración de WhatsApp

### Captura 3: Configuración de Email
- **Navegación**: En página de configuración, sección Email
- **Nombre archivo**: `25-configuracion-email.png`
- **Descripción**: Sección de configuración de Email

### Captura 4: Configuración de Tema
- **Navegación**: En página de configuración, sección Tema/Apariencia
- **Nombre archivo**: `25-configuracion-tema.png`
- **Descripción**: Opciones de tema claro/oscuro

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Configuración del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **25-configuracion-general.png**
   - Haz clic en tu avatar (esquina superior derecha)
   - Selecciona "Configuración" o "Settings"
   - Captura la vista general

3. **25-configuracion-whatsapp.png**
   - Desplázate a la sección de WhatsApp
   - Captura mostrando el campo de teléfono y opciones

4. **25-configuracion-email.png**
   - Desplázate a la sección de Email
   - Captura mostrando el campo de correo y opciones

5. **25-configuracion-tema.png**
   - Desplázate a la sección de Tema/Apariencia
   - Captura mostrando las opciones de tema

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Las capturas deben mostrar las secciones claramente
- Si hay configuración existente, mostrarla
- Esperar a que cada pantalla cargue completamente antes de capturar
