# 📸 Prompt para Capturas de Pantalla - Cumplimiento Regulatorio (Compliance)

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de Compliance
- **Navegación**: Menú lateral → Compliance → Dashboard
- **Nombre archivo**: `20-compliance-dashboard.png`
- **Descripción**: Panel con KPIs de cumplimiento

### Captura 2: Lista de Políticas
- **Navegación**: Menú lateral → Compliance → Políticas
- **Nombre archivo**: `20-compliance-politicas-lista.png`
- **Descripción**: Tabla de políticas

### Captura 3: Lista de Permisos
- **Navegación**: Menú lateral → Compliance → Permisos
- **Nombre archivo**: `20-compliance-permisos-lista.png`
- **Descripción**: Lista de permisos y licencias

### Captura 4: Lista de Certificaciones
- **Navegación**: Menú lateral → Compliance → Certificaciones
- **Nombre archivo**: `20-compliance-certificaciones-lista.png`
- **Descripción**: Lista de certificaciones

### Captura 5: Lista de Auditorías
- **Navegación**: Menú lateral → Compliance → Auditorías
- **Nombre archivo**: `20-compliance-auditorias-lista.png`
- **Descripción**: Lista de auditorías

### Captura 6: Lista de Reportes
- **Navegación**: Menú lateral → Compliance → Reportes
- **Nombre archivo**: `20-compliance-reportes-lista.png`
- **Descripción**: Lista de reportes regulatorios

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Compliance del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **20-compliance-dashboard.png**
   - En el menú lateral, expande "Compliance"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs

3. **20-compliance-politicas-lista.png**
   - Haz clic en "Políticas"
   - Captura la lista

4. **20-compliance-permisos-lista.png**
   - Haz clic en "Permisos"
   - Captura la lista

5. **20-compliance-certificaciones-lista.png**
   - Haz clic en "Certificaciones"
   - Captura la lista

6. **20-compliance-auditorias-lista.png**
   - Haz clic en "Auditorías"
   - Captura la lista

7. **20-compliance-reportes-lista.png**
   - Haz clic en "Reportes"
   - Captura la lista

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo en todas las secciones
- Los permisos deben tener diferentes estados de vencimiento
- Las capturas deben mostrar información realista
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
