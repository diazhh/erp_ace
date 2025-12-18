# 📊 Módulo de Dashboard - Guía de Uso

## Acceder al Dashboard

El dashboard es la página principal del sistema. Se accede automáticamente al iniciar sesión o haciendo clic en **"Dashboard"** en el menú lateral.

**Ruta:** `/` o `/dashboard`

---

## Secciones del Dashboard

### 1. Tarjetas de KPIs

En la parte superior se muestran tarjetas con métricas clave:

| Tarjeta | Información | Acción al Click |
|---------|-------------|-----------------|
| **Empleados** | Total activos | Ir a lista de empleados |
| **Proyectos** | Activos/Total | Ir a lista de proyectos |
| **Finanzas** | Saldo total | Ir a dashboard financiero |
| **Inventario** | Valor total | Ir a dashboard de inventario |

#### Indicadores de Tendencia
- ⬆️ Verde: Aumento respecto al período anterior
- ⬇️ Rojo: Disminución respecto al período anterior

---

### 2. Gráfico de Flujo de Caja

Muestra ingresos vs gastos por mes del año actual.

- **Barras verdes**: Ingresos
- **Barras rojas**: Gastos
- **Eje X**: Meses del año
- **Eje Y**: Monto en USD

#### Interacción
- Pasar el mouse sobre las barras para ver valores exactos
- Hacer clic en la leyenda para ocultar/mostrar series

---

### 3. Gráfico de Proyectos por Estado

Gráfico circular que muestra la distribución de proyectos:

| Color | Estado |
|-------|--------|
| Azul | Planificación |
| Verde | En Progreso |
| Naranja | En Espera |
| Morado | Completado |
| Rojo | Cancelado |

#### Interacción
- Pasar el mouse para ver cantidad y porcentaje
- Hacer clic en una sección para filtrar proyectos

---

### 4. Gráfico de Empleados por Departamento

Gráfico de barras horizontales mostrando cantidad de empleados por departamento.

#### Interacción
- Pasar el mouse para ver cantidad exacta
- Hacer clic en una barra para ir al departamento

---

### 5. Panel de Alertas

Lista de situaciones que requieren atención:

| Tipo | Icono | Ejemplos |
|------|-------|----------|
| **Error** | 🔴 | Proyectos muy atrasados, stock agotado |
| **Warning** | 🟡 | Documentos por vencer, stock bajo |
| **Info** | 🔵 | Recordatorios, información general |

#### Acciones
- Hacer clic en una alerta para ir al detalle
- Las alertas se actualizan automáticamente

---

### 6. Actividad Reciente

Lista de las últimas acciones en el sistema:
- Documentos subidos
- Proyectos creados
- Empleados agregados
- Transacciones registradas

---

## Controles del Dashboard

### Botón Refrescar
En la esquina superior derecha, permite actualizar todos los datos del dashboard.

### Selector de Período
Algunos gráficos permiten cambiar el período de visualización:
- Mes actual
- Trimestre
- Año

---

## Navegación desde el Dashboard

### Tarjetas Clickeables
Todas las tarjetas de KPIs son clickeables y llevan al módulo correspondiente.

### Enlaces en Alertas
Cada alerta tiene un enlace directo al elemento que requiere atención.

### Gráficos Interactivos
Los gráficos permiten navegar a datos específicos al hacer clic.

---

## Personalización

### Según Permisos
El dashboard muestra solo la información de los módulos a los que el usuario tiene acceso.

### Según Rol
- **Administrador**: Ve todos los KPIs y alertas
- **Gerente**: Ve KPIs de su área
- **Usuario**: Ve información básica

---

## Tips y Mejores Prácticas

### Para Revisión Diaria
- ✅ Revisar alertas al inicio del día
- ✅ Verificar KPIs principales
- ✅ Atender items críticos primero

### Para Análisis
- ✅ Usar gráficos para identificar tendencias
- ✅ Comparar períodos anteriores
- ✅ Exportar datos si necesita análisis detallado

### Para Presentaciones
- ✅ El dashboard es ideal para mostrar estado general
- ✅ Los gráficos son claros y profesionales
- ✅ Puede tomar screenshots para reportes

---

## Solución de Problemas

### "Los datos no se actualizan"
- Hacer clic en el botón Refrescar
- Verificar conexión a internet
- Cerrar sesión y volver a entrar

### "No veo todos los KPIs"
- Verificar permisos de usuario
- Algunos KPIs requieren permisos específicos
- Contactar al administrador

### "Los gráficos no cargan"
- Esperar unos segundos (carga asíncrona)
- Refrescar la página
- Verificar que hay datos en el sistema

### "Las alertas no desaparecen"
- Las alertas se resuelven atendiendo el problema
- Ir al detalle y resolver la situación
- La alerta desaparecerá automáticamente
