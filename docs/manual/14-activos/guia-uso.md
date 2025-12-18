# 🏢 Activos Fijos - Guía de Uso

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Activos"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Activos**: Lista de activos fijos
   - **Categorías**: Gestión de categorías

---

## Lista de Activos

### Ver Todos los Activos

1. En el menú, seleccione **"Activos"** → **"Activos"**
2. Verá indicadores y la tabla/tarjetas de activos

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **Total Activos** | Cantidad de activos registrados |
| **En Uso** | Activos en estado activo |
| **Valor en Libros** | Suma del valor actual de todos los activos |
| **Mant. Pendientes** | Mantenimientos programados |

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código, nombre o número de serie |
| **Estado** | Activo, En Mantenimiento, Almacenado, etc. |
| **Categoría** | Categorías registradas |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre del activo |
| **Categoría** | Clasificación |
| **Marca/Modelo** | Fabricante y modelo |
| **Valor** | Valor en libros |
| **Condición** | Estado físico |
| **Estado** | Estado operativo |
| **Asignado a** | Empleado responsable |
| **Acciones** | Ver, Editar |

---

### Registrar un Nuevo Activo

1. Haga clic en el botón **"+ Nuevo"**
2. Se abrirá una página con el formulario

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único (ej: "ACT-001") |
| **Nombre** | ✅ Sí | Nombre descriptivo |
| **Categoría** | ✅ Sí | Seleccione categoría |
| **Marca** | ❌ No | Fabricante |
| **Modelo** | ❌ No | Modelo específico |
| **Número de Serie** | ❌ No | Serial del fabricante |
| **Fecha de Adquisición** | ✅ Sí | Cuándo se compró |
| **Costo de Adquisición** | ✅ Sí | Precio de compra |
| **Moneda** | ✅ Sí | USD, VES |
| **Vida Útil (años)** | ❌ No | Años de uso estimado |
| **Valor Residual** | ❌ No | Valor al final de vida útil |
| **Condición** | ✅ Sí | Excelente, Bueno, Regular, Malo |
| **Estado** | ✅ Sí | Activo, Almacenado, etc. |
| **Ubicación** | ❌ No | Dónde está físicamente |
| **Asignado a** | ❌ No | Empleado responsable |
| **Descripción** | ❌ No | Detalles adicionales |

3. Complete los campos requeridos
4. Haga clic en **"Guardar"**

---

### Ver Detalle de un Activo

1. En la lista, haga clic en el ícono de **ojo** (👁)
2. Verá:
   - Información completa del activo
   - Cálculo de depreciación
   - Historial de asignaciones
   - Historial de mantenimientos
   - Documentos adjuntos

---

### Editar un Activo

1. En la lista o detalle, haga clic en el ícono de **lápiz** (✏️)
2. Modifique los campos necesarios
3. Haga clic en **"Guardar"**

---

### Asignar un Activo

1. En el detalle del activo, busque la sección de asignación
2. Haga clic en **"Asignar"** o **"Transferir"**
3. Seleccione el empleado
4. Agregue notas si es necesario
5. Confirme la asignación

---

### Dar de Baja un Activo

1. En el detalle del activo
2. Haga clic en **"Dar de Baja"**
3. Seleccione el motivo:
   - Obsoleto
   - Dañado irreparable
   - Vendido
   - Perdido
4. Agregue notas explicativas
5. Confirme la baja

> ⚠️ **Importante**: Los activos dados de baja no pueden reactivarse. Verifique bien antes de confirmar.

---

## Categorías de Activos

### Ver Lista de Categorías

1. En el menú, seleccione **"Activos"** → **"Categorías"**
2. Verá la lista de categorías

### Crear una Categoría

1. Haga clic en **"+ Nueva Categoría"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único |
| **Nombre** | ✅ Sí | Nombre de la categoría |
| **Descripción** | ❌ No | Descripción |
| **Vida Útil (años)** | ❌ No | Vida útil predeterminada |
| **Método de Depreciación** | ❌ No | Línea recta, etc. |
| **Cuenta Contable** | ❌ No | Para integración contable |

3. Haga clic en **"Guardar"**

---

## Depreciación

### Cómo Funciona

El sistema calcula automáticamente la depreciación:

1. **Depreciación Mensual** = (Costo - Valor Residual) / (Vida Útil × 12)
2. **Depreciación Acumulada** = Depreciación Mensual × Meses transcurridos
3. **Valor en Libros** = Costo - Depreciación Acumulada

### Ver Depreciación

1. En el detalle del activo
2. La sección de depreciación muestra:
   - Costo original
   - Depreciación acumulada
   - Valor en libros actual
   - Porcentaje depreciado

---

## Consejos Útiles

### Para Registrar Activos
- ✅ Use códigos consistentes (ACT-001, EQP-001)
- ✅ Registre el número de serie
- ✅ Tome fotos del activo
- ✅ Defina la vida útil correctamente

### Para Asignaciones
- ✅ Siempre asigne un responsable
- ✅ Documente las transferencias
- ✅ Verifique la condición al transferir

### Para Depreciación
- ✅ Revise los valores periódicamente
- ✅ Ajuste la vida útil si es necesario
- ✅ Considere el valor residual

---

## Preguntas Frecuentes

### ¿Cuál es la diferencia entre activo e inventario?
Los activos fijos son bienes de larga duración que se deprecian (equipos, maquinaria). El inventario son bienes para consumo o venta.

### ¿Puedo cambiar el costo de adquisición?
No se recomienda. Si hay un error, documente el ajuste con una nota.

### ¿Qué pasa cuando un activo se deprecia completamente?
El activo sigue existiendo pero su valor en libros es igual al valor residual. Puede seguir usándose.

### ¿Cómo registro la venta de un activo?
Dé de baja el activo con motivo "Vendido" y registre el ingreso en el módulo de Finanzas.

### ¿Puedo tener activos sin asignar?
Sí. Los activos pueden estar en estado "Almacenado" sin asignación.

### ¿Cómo hago un inventario físico de activos?
Exporte la lista de activos y verifique físicamente cada uno. Actualice la condición y ubicación según corresponda.
