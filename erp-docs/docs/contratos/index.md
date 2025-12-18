# 📜 Contratos Petroleros

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Contratos"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores
   - **Contratos**: Lista de contratos
   - **Concesiones**: Gestión de concesiones

---

## Dashboard de Contratos

![Dashboard de Contratos](./images/19-contratos-dashboard.png)

### Acceder al Dashboard

1. En el menú, seleccione **"Contratos"** → **"Dashboard"**
2. Verá el panel principal con indicadores

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **Contratos Activos** | Contratos vigentes |
| **Por Vencer** | Próximos a expirar |
| **Por Tipo** | Distribución por tipo |
| **Participaciones** | Resumen por socio |

---

## Lista de Contratos

![Lista de Contratos](./images/19-contratos-lista.png)

### Ver Todos los Contratos

1. En el menú, seleccione **"Contratos"** → **"Contratos"**
2. Verá la tabla/tarjetas de contratos

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o nombre |
| **Tipo** | PSA, Service, JOA, etc. |
| **Estado** | Borrador, Activo, Suspendido, etc. |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre del contrato |
| **Tipo** | PSA, JOA, Service, etc. |
| **Operador** | Empresa operadora |
| **Partes** | Socios y participaciones |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar, Eliminar |

---

### Crear un Contrato

1. Haga clic en el botón **"+ Nuevo Contrato"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único |
| **Nombre** | ✅ Sí | Nombre del contrato |
| **Tipo** | ✅ Sí | PSA, JOA, Service, etc. |
| **Estado** | ✅ Sí | Estado inicial |
| **Operador** | ❌ No | Empresa operadora |
| **Fecha Efectiva** | ❌ No | Inicio de vigencia |
| **Fecha Vencimiento** | ❌ No | Fin de vigencia |
| **Área Contractual** | ❌ No | Territorio cubierto |
| **Descripción** | ❌ No | Detalles del contrato |

3. Haga clic en **"Guardar"**

---

### Agregar Partes al Contrato

1. En el detalle del contrato, vaya a la sección de partes
2. Haga clic en **"+ Agregar Parte"**
3. Complete:
   - Empresa o entidad
   - Tipo de participación
   - Porcentaje de participación (Working Interest)
   - Rol (operador, socio, etc.)
4. Haga clic en **"Guardar"**

> **Nota**: La suma de participaciones debe ser 100%.

---

### Ver Detalle de un Contrato

![Detalle de Contrato](./images/19-contratos-detalle.png)

1. En la lista, haga clic en el ícono de **ojo** (👁)
2. Verá:
   - Información general del contrato
   - Partes y participaciones
   - Campos asociados
   - AFEs relacionados
   - Documentos adjuntos

---

## Concesiones

### Ver Lista de Concesiones

1. En el menú, seleccione **"Contratos"** → **"Concesiones"**
2. Verá la lista de concesiones petroleras

### Crear una Concesión

1. Haga clic en **"+ Nueva Concesión"**
2. Complete:
   - Código y nombre
   - Área geográfica
   - Fechas de vigencia
   - Campos asociados
3. Haga clic en **"Guardar"**

---

## Flujo de Estados

```
1. BORRADOR → Contrato en elaboración
   ↓
2. ACTIVO → Contrato vigente
   ↓
3. SUSPENDIDO → Temporalmente inactivo (opcional)
   ↓
4. EXPIRADO/TERMINADO → Contrato finalizado
```

---

## Consejos Útiles

### Para Crear Contratos
- ✅ Use códigos estándar de la industria
- ✅ Verifique que las participaciones sumen 100%
- ✅ Adjunte el documento legal
- ✅ Defina fechas de vencimiento

### Para Gestionar Partes
- ✅ Mantenga actualizada la información de contacto
- ✅ Registre cambios de participación
- ✅ Documente cesiones (farmouts)

### Para Vencimientos
- ✅ Revise el dashboard regularmente
- ✅ Inicie renovaciones con anticipación
- ✅ Configure alertas de vencimiento

---

## Preguntas Frecuentes

### ¿Puedo modificar un contrato activo?
Sí, pero los cambios deben documentarse. Considere crear una adenda en lugar de modificar el original.

### ¿Cómo registro un cambio de participación?
Edite las partes del contrato y actualice los porcentajes. El historial se mantiene.

### ¿Qué pasa cuando un contrato vence?
El estado cambia a "Expirado" y aparece en las alertas. Debe renovar o terminar formalmente.

### ¿Puedo asociar múltiples campos a un contrato?
Sí. En el detalle del contrato puede asociar todos los campos cubiertos.

### ¿Cómo afectan las participaciones a la facturación?
Las participaciones del contrato se usan en el módulo JIB para calcular la facturación conjunta.
