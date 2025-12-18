# 📸 Prompt para Capturas de Pantalla - Contratos Petroleros

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de Contratos
- **Navegación**: Menú lateral → Contratos → Dashboard
- **Nombre archivo**: `19-contratos-dashboard.png`
- **Descripción**: Panel con KPIs de contratos

### Captura 2: Lista de Contratos
- **Navegación**: Menú lateral → Contratos → Contratos
- **Nombre archivo**: `19-contratos-lista.png`
- **Descripción**: Tabla de contratos con estados

### Captura 3: Formulario de Nuevo Contrato
- **Navegación**: En lista → Clic en "+ Nuevo Contrato"
- **Nombre archivo**: `19-contratos-nuevo.png`
- **Descripción**: Formulario para crear contrato

### Captura 4: Detalle de Contrato
- **Navegación**: En lista → Clic en ícono de ojo de un contrato
- **Nombre archivo**: `19-contratos-detalle.png`
- **Descripción**: Detalle con partes y participaciones

### Captura 5: Lista de Concesiones
- **Navegación**: Menú lateral → Contratos → Concesiones
- **Nombre archivo**: `19-contratos-concesiones.png`
- **Descripción**: Lista de concesiones

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de Contratos del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **19-contratos-dashboard.png**
   - En el menú lateral, expande "Contratos"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs

3. **19-contratos-lista.png**
   - Haz clic en "Contratos"
   - Captura la lista

4. **19-contratos-nuevo.png**
   - Haz clic en "+ Nuevo Contrato"
   - Captura el formulario

5. **19-contratos-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un contrato
   - Captura el detalle

6. **19-contratos-concesiones.png**
   - En el menú, haz clic en "Concesiones"
   - Captura la lista

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (contratos, concesiones)
- Los contratos deben tener diferentes tipos y estados
- Debe haber contratos con múltiples partes
- Las capturas deben mostrar información realista
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
