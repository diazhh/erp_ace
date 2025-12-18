# 📸 Prompt para Capturas de Pantalla - Clientes y Ventas (CRM)

## Configuración Requerida

```
- Resolución: 2560x1600
- Navegador: Puppeteer con argumentos --no-sandbox --disable-setuid-sandbox
- Usuario: admin
- Contraseña: Admin123!
- URL Base: http://localhost:5173
```

## Capturas Requeridas

### Captura 1: Dashboard de CRM
- **Navegación**: Menú lateral → CRM → Dashboard
- **Nombre archivo**: `15-crm-dashboard.png`
- **Descripción**: Panel con KPIs y pipeline

### Captura 2: Lista de Clientes
- **Navegación**: Menú lateral → CRM → Clientes
- **Nombre archivo**: `15-crm-clientes-lista.png`
- **Descripción**: Filtros y tabla de clientes

### Captura 3: Formulario de Nuevo Cliente
- **Navegación**: En lista → Clic en "+ Nuevo Cliente"
- **Nombre archivo**: `15-crm-clientes-nuevo.png`
- **Descripción**: Formulario para registrar cliente

### Captura 4: Detalle de Cliente
- **Navegación**: En lista → Clic en ícono de ojo de un cliente
- **Nombre archivo**: `15-crm-clientes-detalle.png`
- **Descripción**: Detalle con contactos y oportunidades

### Captura 5: Lista de Oportunidades
- **Navegación**: Menú lateral → CRM → Oportunidades
- **Nombre archivo**: `15-crm-oportunidades-lista.png`
- **Descripción**: Tabla de oportunidades con etapas

### Captura 6: Formulario de Nueva Oportunidad
- **Navegación**: En lista → Clic en "+ Nueva Oportunidad"
- **Nombre archivo**: `15-crm-oportunidades-nueva.png`
- **Descripción**: Formulario para crear oportunidad

### Captura 7: Detalle de Oportunidad
- **Navegación**: En lista → Clic en ícono de ojo de una oportunidad
- **Nombre archivo**: `15-crm-oportunidades-detalle.png`
- **Descripción**: Detalle con actividades

---

## Prompt Completo para Ejecutar

```
Necesito que tomes capturas de pantalla del módulo de CRM del sistema ERP para la documentación de usuario.

CONFIGURACIÓN:
- Usa Puppeteer MCP con resolución 2560x1600
- Argumentos de lanzamiento: --no-sandbox --disable-setuid-sandbox
- URL base: http://localhost:5173
- Credenciales: usuario "admin", contraseña "Admin123!"

INSTRUCCIONES:

1. Inicia sesión en el sistema

2. **15-crm-dashboard.png**
   - En el menú lateral, expande "CRM"
   - Haz clic en "Dashboard"
   - Captura mostrando KPIs y pipeline

3. **15-crm-clientes-lista.png**
   - Haz clic en "Clientes"
   - Captura mostrando filtros y tabla

4. **15-crm-clientes-nuevo.png**
   - Haz clic en "+ Nuevo Cliente"
   - Captura el formulario

5. **15-crm-clientes-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de un cliente
   - Captura el detalle

6. **15-crm-oportunidades-lista.png**
   - En el menú, haz clic en "Oportunidades"
   - Captura la lista

7. **15-crm-oportunidades-nueva.png**
   - Haz clic en "+ Nueva Oportunidad"
   - Captura el formulario

8. **15-crm-oportunidades-detalle.png**
   - Vuelve a la lista
   - Haz clic en el ícono de ojo de una oportunidad
   - Captura el detalle

Guarda todas las capturas con los nombres indicados en formato PNG.
```

---

## Notas Adicionales

- Asegurarse de que haya datos de ejemplo (clientes, oportunidades)
- Los clientes deben ser de diferentes tipos (empresa, persona)
- Las oportunidades deben estar en diferentes etapas
- Las capturas deben mostrar información realista pero no sensible
- El menú lateral debe ser visible en las capturas principales
- Esperar a que cada pantalla cargue completamente antes de capturar
