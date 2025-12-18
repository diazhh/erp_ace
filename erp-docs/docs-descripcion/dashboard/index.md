# 📊 Panel Principal (Dashboard)

## ¿Qué es este módulo?

El **Dashboard** o Panel Principal es la pantalla de inicio del sistema ERP. Muestra un resumen ejecutivo de toda la empresa: indicadores clave de rendimiento (KPIs), gráficos, alertas y accesos rápidos a las diferentes áreas del sistema.

Piense en el Dashboard como su "centro de control": de un vistazo puede ver el estado de empleados, proyectos, finanzas, inventario y flota, además de recibir alertas importantes.

## ¿Para quién es útil?

- **Gerentes y Directivos**: Para tener una visión general del negocio
- **Supervisores**: Para monitorear sus áreas de responsabilidad
- **Todos los usuarios**: Como punto de partida para navegar el sistema

## ¿Qué puedo ver aquí?

### Indicadores Principales (KPIs)

| Indicador | Descripción |
|-----------|-------------|
| **Empleados Activos** | Cantidad de empleados activos vs total |
| **Proyectos Activos** | Proyectos en curso y atrasados |
| **Balance General** | Ingresos vs gastos del mes |
| **Artículos en Inventario** | Total de artículos y alertas de stock bajo |
| **Vehículos** | Vehículos activos y en mantenimiento |
| **Transacciones Pendientes** | Transacciones por conciliar |

### Gráficos

| Gráfico | Descripción |
|---------|-------------|
| **Flujo de Caja** | Ingresos vs gastos por mes (barras) |
| **Proyectos por Estado** | Distribución de proyectos (pastel) |
| **Gastos por Categoría** | Distribución de gastos (pastel) |

### Alertas

El Dashboard muestra alertas importantes como:
- 🔴 **Errores**: Situaciones críticas que requieren atención inmediata
- 🟡 **Advertencias**: Situaciones que requieren atención pronto
- 🔵 **Información**: Notificaciones generales

### Ejemplos de Alertas

| Alerta | Tipo |
|--------|------|
| Documentos vencidos | Error |
| Proyectos atrasados | Advertencia |
| Stock bajo en inventario | Advertencia |
| Mantenimientos pendientes | Advertencia |
| Facturas por vencer | Información |

## Conceptos Importantes

### Tarjetas de KPI

Cada tarjeta muestra:
- **Título**: Qué se está midiendo
- **Valor principal**: El número más importante
- **Subtítulo**: Información adicional
- **Ícono**: Representación visual del área
- **Tendencia**: Flecha arriba/abajo con porcentaje (si aplica)

Las tarjetas son **clickeables**: al hacer clic, navega al módulo correspondiente.

### Flujo de Caja

El gráfico de flujo de caja muestra:
- **Barras verdes**: Ingresos del mes
- **Barras rojas**: Gastos del mes
- **Eje X**: Meses del año
- **Eje Y**: Montos en dólares

### Actualización de Datos

- Los datos se cargan automáticamente al entrar
- Use el botón de **actualizar** (🔄) para refrescar
- Los datos son en tiempo real

## Navegación desde el Dashboard

Desde el Dashboard puede acceder rápidamente a:

| Clic en... | Navega a... |
|------------|-------------|
| Tarjeta de Empleados | Lista de empleados |
| Tarjeta de Proyectos | Lista de proyectos |
| Tarjeta de Finanzas | Transacciones financieras |
| Tarjeta de Inventario | Lista de artículos |
| Tarjeta de Flota | Lista de vehículos |
| Cualquier alerta | Módulo relacionado |

## Personalización

El Dashboard muestra información según:
- **Permisos del usuario**: Solo ve módulos a los que tiene acceso
- **Rol**: Gerentes ven más información que operadores
- **Idioma**: Se adapta al idioma configurado

## Relación con Otros Módulos

El Dashboard obtiene información de todos los módulos:

- **Empleados**: Cuenta de empleados activos
- **Proyectos**: Proyectos activos, atrasados, completados
- **Finanzas**: Balance mensual, flujo de caja
- **Inventario**: Total de artículos, alertas de stock
- **Flota**: Vehículos activos, en mantenimiento
- **HSE**: Incidentes, inspecciones pendientes
- **Documentos**: Documentos vencidos
