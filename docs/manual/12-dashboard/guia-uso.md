# 📊 Panel Principal (Dashboard) - Guía de Uso

## Cómo Acceder al Dashboard

El Dashboard es la **pantalla de inicio** del sistema. Hay varias formas de acceder:

1. **Al iniciar sesión**: Se muestra automáticamente
2. **Desde cualquier pantalla**: Haga clic en el logo o en "Inicio" en el menú
3. **Desde el menú lateral**: Seleccione la primera opción "Dashboard"

---

## Elementos del Dashboard

### Encabezado

| Elemento | Descripción |
|----------|-------------|
| **Título** | "Panel Principal" o "Dashboard" |
| **Saludo** | Bienvenida con su nombre |
| **Botón Actualizar** | Ícono 🔄 para refrescar datos |

---

### Tarjetas de Indicadores (KPIs)

El Dashboard muestra 6 tarjetas principales:

#### 1. Empleados Activos
- **Valor**: Cantidad de empleados activos
- **Subtítulo**: Total de empleados
- **Clic**: Navega a lista de empleados

#### 2. Proyectos Activos
- **Valor**: Proyectos en planificación o progreso
- **Subtítulo**: Proyectos atrasados o completados
- **Clic**: Navega a lista de proyectos

#### 3. Balance General
- **Valor**: Balance neto del mes (ingresos - gastos)
- **Subtítulo**: Total de ingresos
- **Color**: Verde si positivo, rojo si negativo
- **Clic**: Navega a transacciones

#### 4. Artículos en Inventario
- **Valor**: Total de artículos registrados
- **Subtítulo**: Artículos con stock bajo (si hay)
- **Clic**: Navega a inventario

#### 5. Vehículos
- **Valor**: Vehículos activos
- **Subtítulo**: Vehículos en mantenimiento (si hay)
- **Clic**: Navega a flota

#### 6. Transacciones Pendientes
- **Valor**: Transacciones por conciliar
- **Subtítulo**: "Transacciones"
- **Clic**: Navega a transacciones

---

### Gráfico de Flujo de Caja

Ubicado debajo de las tarjetas, muestra:

| Elemento | Descripción |
|----------|-------------|
| **Barras verdes** | Ingresos por mes |
| **Barras rojas** | Gastos por mes |
| **Eje horizontal** | Meses del año |
| **Eje vertical** | Montos en miles de dólares |

#### Interacción
- **Hover**: Muestra el valor exacto al pasar el mouse
- **Leyenda**: Indica qué color es ingreso y cuál gasto

---

### Panel de Alertas

A la derecha del gráfico (o debajo en móvil):

| Elemento | Descripción |
|----------|-------------|
| **Título** | "Alertas" |
| **Contador** | Número total de alertas |
| **Lista** | Alertas ordenadas por importancia |

#### Tipos de Alerta

| Ícono | Tipo | Significado |
|-------|------|-------------|
| 🔴 | Error | Requiere atención inmediata |
| 🟡 | Advertencia | Requiere atención pronto |
| 🔵 | Información | Notificación general |

#### Interacción
- **Clic en alerta**: Navega al módulo relacionado

---

### Gráficos Adicionales

#### Proyectos por Estado
- **Tipo**: Gráfico de pastel
- **Muestra**: Distribución de proyectos por estado
- **Colores**: Cada estado tiene un color diferente

#### Gastos por Categoría
- **Tipo**: Gráfico de pastel
- **Muestra**: Distribución de gastos por categoría
- **Colores**: Cada categoría tiene un color diferente

---

## Acciones Disponibles

### Actualizar Datos

1. Haga clic en el botón de **actualizar** (🔄) en la esquina superior derecha
2. Los datos se recargan desde el servidor
3. Útil para ver información más reciente

### Navegar a Módulos

1. Haga clic en cualquier **tarjeta de KPI**
2. Se abre el módulo correspondiente
3. Ejemplo: Clic en "Empleados Activos" → Lista de empleados

### Ver Detalle de Alertas

1. Haga clic en cualquier **alerta** de la lista
2. Se abre el módulo relacionado con la alerta
3. Ejemplo: Clic en "Proyectos atrasados" → Lista de proyectos

---

## Vista en Dispositivos Móviles

En celulares y tablets, el Dashboard se adapta:

| Elemento | Cambio |
|----------|--------|
| **Tarjetas** | Se muestran en 2 columnas |
| **Gráficos** | Se apilan verticalmente |
| **Alertas** | Se muestran debajo de los gráficos |
| **Texto** | Tamaño reducido para mejor lectura |

---

## Consejos Útiles

### Para Gerentes
- ✅ Revise el Dashboard al inicio del día
- ✅ Preste atención a las alertas rojas
- ✅ Compare el flujo de caja mes a mes
- ✅ Verifique proyectos atrasados

### Para Supervisores
- ✅ Monitoree los indicadores de su área
- ✅ Atienda las alertas de advertencia
- ✅ Use las tarjetas para navegar rápido

### Para Todos
- ✅ Actualice los datos si lleva tiempo en la pantalla
- ✅ Haga clic en las tarjetas para ver más detalle
- ✅ Revise las alertas regularmente

---

## Preguntas Frecuentes

### ¿Por qué no veo todos los indicadores?
Solo ve los indicadores de los módulos a los que tiene acceso según sus permisos.

### ¿Cada cuánto se actualizan los datos?
Los datos se cargan al entrar al Dashboard. Use el botón de actualizar para refrescar.

### ¿Puedo personalizar qué indicadores ver?
Actualmente no. El Dashboard muestra los indicadores estándar según su rol.

### ¿Por qué el balance está en rojo?
El balance se muestra en rojo cuando los gastos superan los ingresos del mes.

### ¿Qué hago si tengo muchas alertas?
Priorice las alertas rojas (errores), luego las amarillas (advertencias). Haga clic en cada una para resolverla.

### ¿Puedo ver datos de otros años?
El flujo de caja muestra el año actual. Para ver históricos, vaya al módulo de Finanzas.
