# 📊 Facturación Conjunta (JIB)

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"JIB"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores
   - **JIBs**: Lista de facturaciones
   - **Cash Calls**: Llamadas de capital

---

## Dashboard de JIB

![Dashboard de JIB](./images/21-jib-dashboard.png)

### Acceder al Dashboard

1. En el menú, seleccione **"JIB"** → **"Dashboard"**
2. Verá el panel principal con indicadores

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **JIBs Pendientes** | Por enviar a socios |
| **Por Cobrar** | Monto total pendiente |
| **Disputados** | JIBs en disputa |
| **Cash Calls Activos** | Solicitudes de fondos |

---

## Lista de JIBs

### Ver Todos los JIBs

1. En el menú, seleccione **"JIB"** → **"JIBs"**
2. Verá la tabla/tarjetas de JIBs

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código |
| **Estado** | Borrador, Enviado, Pagado, etc. |
| **Año** | Año de facturación |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Contrato** | Contrato asociado |
| **Período** | Mes y año |
| **Total** | Monto total de costos |
| **Vencimiento** | Fecha límite de pago |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar, Enviar, Eliminar |

---

### Crear un JIB

1. Haga clic en el botón **"+ Nuevo JIB"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único |
| **Contrato** | ✅ Sí | Contrato de operación |
| **Mes** | ✅ Sí | Mes de facturación |
| **Año** | ✅ Sí | Año de facturación |
| **Fecha Vencimiento** | ❌ No | Cuándo debe pagarse |
| **Descripción** | ❌ No | Notas adicionales |

3. Haga clic en **"Guardar"**
4. El JIB queda en estado "Borrador"

---

### Agregar Costos al JIB

1. En el detalle del JIB, vaya a la sección de costos
2. Agregue líneas de costo:
   - Categoría (operación, mantenimiento, etc.)
   - Descripción
   - Monto
   - AFE asociado (si aplica)
3. El sistema calcula automáticamente las participaciones

---

### Enviar JIB a Socios

1. En el detalle del JIB en estado "Borrador"
2. Verifique que todos los costos estén correctos
3. Haga clic en **"Enviar a Socios"**
4. El estado cambia a "Enviado"
5. Los socios reciben notificación

---

### Registrar Pago

1. En el detalle del JIB enviado
2. Vaya a la sección de pagos
3. Registre el pago recibido:
   - Socio que paga
   - Monto
   - Fecha de pago
   - Referencia
4. El estado cambia según los pagos:
   - Parcialmente Pagado: Si falta por cobrar
   - Pagado: Si está completo

---

### Gestionar Disputas

1. Si un socio objeta cargos, cambie el estado a "Disputado"
2. Documente la razón de la disputa
3. Resuelva con el socio
4. Ajuste el JIB si es necesario
5. Cambie el estado cuando se resuelva

---

## Cash Calls

### Ver Lista de Cash Calls

1. En el menú, seleccione **"JIB"** → **"Cash Calls"**
2. Verá las solicitudes de fondos

### Crear un Cash Call

1. Haga clic en **"+ Nuevo Cash Call"**
2. Complete:
   - Contrato
   - Monto solicitado
   - Fecha límite
   - Propósito (AFE, operación, etc.)
3. Haga clic en **"Guardar"**

### Registrar Aportes

1. En el detalle del Cash Call
2. Registre los aportes recibidos de cada socio
3. El sistema muestra el saldo pendiente

---

## Consejos Útiles

### Para Crear JIBs
- ✅ Verifique los costos antes de enviar
- ✅ Use categorías consistentes
- ✅ Asocie costos a AFEs cuando corresponda
- ✅ Establezca fechas de vencimiento razonables

### Para Cobros
- ✅ Haga seguimiento a pagos vencidos
- ✅ Documente disputas claramente
- ✅ Mantenga comunicación con socios

### Para Cash Calls
- ✅ Solicite fondos con anticipación
- ✅ Justifique claramente el propósito
- ✅ Concilie aportes regularmente

---

## Preguntas Frecuentes

### ¿Puedo modificar un JIB enviado?
No directamente. Debe crear un JIB de ajuste o cancelar y recrear.

### ¿Cómo calcula el sistema las participaciones?
Usa las participaciones definidas en el contrato asociado.

### ¿Qué pasa si un socio no paga?
El JIB queda en estado "Enviado" o "Parcialmente Pagado". Debe hacer seguimiento.

### ¿Puedo facturar costos de varios meses juntos?
Se recomienda un JIB por mes para mejor control, pero puede incluir ajustes de meses anteriores.

### ¿Cómo relaciono un JIB con un AFE?
Al agregar costos, puede seleccionar el AFE asociado para cada línea.
