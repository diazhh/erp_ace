# 🏢 Módulo de Organización - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Organización"**
2. Se despliegan las opciones:
   - Departamentos
   - Posiciones
   - Organigrama
   - Directorio

---

## Departamentos

### Lista de Departamentos

**Ruta:** `/organization/departments`

#### Columnas de la Tabla (Desktop)
| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre con indicador de color |
| **Tipo** | Dirección, Gerencia, Departamento, Área, Unidad |
| **Pertenece a** | Departamento padre |
| **Manager** | Empleado responsable |
| **Estado** | Activo/Inactivo |
| **Acciones** | Ver, Editar, Eliminar |

#### Vista Mobile
En pantallas pequeñas, los departamentos se muestran como **tarjetas** con:
- Nombre y código
- Tipo (chip de color)
- Manager (si tiene)
- Departamento padre
- Botones de acción

#### Acciones Disponibles
- **Ver Organigrama**: Botón en la parte superior
- **Nuevo Departamento**: Botón "+ Nuevo Departamento"

---

### Crear Departamento

**Ruta:** `/organization/departments/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | Código único (ej: DIR-001) |
| **Nombre** | ✅ | Nombre del departamento |
| **Tipo** | ❌ | Dirección, Gerencia, Departamento, Área, Unidad |
| **Pertenece a** | ❌ | Departamento padre (para jerarquía) |
| **Descripción** | ❌ | Descripción del departamento |
| **Manager** | ❌ | Empleado responsable |
| **Ubicación** | ❌ | Ubicación física |
| **Centro de Costo** | ❌ | Código de centro de costo |
| **Color** | ❌ | Color para visualización |
| **Estado** | ❌ | Activo (default) o Inactivo |

#### Pasos
1. Hacer clic en **"+ Nuevo Departamento"**
2. Completar código y nombre (obligatorios)
3. Seleccionar tipo de departamento
4. Si es subdepartamento, seleccionar "Pertenece a"
5. Asignar manager si corresponde
6. Hacer clic en **"Guardar"**

---

### Detalle de Departamento

**Ruta:** `/organization/departments/:id`

#### Encabezado
- Avatar con color del departamento
- Nombre y código
- Chips de tipo y estado
- Botón "Editar"

#### Tabs Disponibles

##### Tab: Información
Datos generales del departamento:
- Código
- Nombre
- Nivel/Tipo
- Pertenece a (departamento padre)
- Manager
- Centro de Costo
- Descripción

##### Tab: Empleados
Lista de empleados que pertenecen al departamento:
- Avatar y nombre
- Cargo
- Estado
- Clic para ir al detalle del empleado

##### Tab: Posiciones
Cargos definidos para este departamento:
- Nombre y código del cargo
- Estado
- Tarjetas clickeables

##### Tab: Departamentos
Subdepartamentos (hijos):
- Avatar con color
- Nombre y código
- Tipo
- Clic para ir al detalle

---

### Editar Departamento

**Ruta:** `/organization/departments/:id/edit`

1. Desde el detalle, hacer clic en **"Editar"**
2. Modificar los campos necesarios
3. Hacer clic en **"Guardar"**

---

### Eliminar Departamento

1. En la lista o detalle, hacer clic en **🗑️ Eliminar**
2. Confirmar en el diálogo
3. El departamento se elimina

> ⚠️ **Nota**: No se puede eliminar un departamento que tenga empleados o subdepartamentos asignados.

---

## Posiciones/Cargos

### Lista de Posiciones

**Ruta:** `/organization/positions`

#### Columnas de la Tabla (Desktop)
| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre del cargo (+ badge si es supervisión) |
| **Nivel** | Ejecutivo, Director, Gerente, etc. |
| **Departamento** | Departamento asociado |
| **Empleados** | Cantidad actual / Máximo permitido |
| **Rango Salarial** | Min - Max en moneda |
| **Estado** | Activo/Inactivo |
| **Acciones** | Ver, Editar, Eliminar |

#### Vista Mobile
Tarjetas con:
- Nombre y código
- Nivel (chip de color)
- Departamento
- Contador de empleados
- Botones de acción

---

### Crear Posición

**Ruta:** `/organization/positions/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | Código único (ej: POS-001) |
| **Nombre** | ✅ | Nombre del cargo |
| **Departamento** | ❌ | Departamento al que pertenece |
| **Nivel** | ❌ | 0-Ejecutivo a 6-Operativo |
| **Descripción** | ❌ | Descripción del cargo |
| **Salario Mínimo** | ❌ | Rango salarial mínimo |
| **Salario Máximo** | ❌ | Rango salarial máximo |
| **Moneda** | ❌ | USD, VES, EUR |
| **Headcount Máximo** | ❌ | Cantidad máxima de empleados |
| **Requisitos** | ❌ | Requisitos del cargo |
| **Responsabilidades** | ❌ | Responsabilidades del cargo |
| **Estado** | ❌ | Activo (default) o Inactivo |

#### Pasos
1. Hacer clic en **"+ Nueva Posición"**
2. Completar código y nombre (obligatorios)
3. Seleccionar departamento y nivel
4. Definir rango salarial si aplica
5. Establecer headcount máximo
6. Hacer clic en **"Guardar"**

---

### Detalle de Posición

**Ruta:** `/organization/positions/:id`

Muestra información completa del cargo:
- Datos generales
- Departamento asociado
- Rango salarial
- Requisitos y responsabilidades
- Empleados con este cargo

---

## Organigrama

**Ruta:** `/organization/chart`

### Modos de Vista

#### Vista por Departamentos
- Muestra la estructura de departamentos
- Cada nodo incluye:
  - Nombre y código del departamento
  - Tipo (chip de color)
  - Manager (si tiene)
  - Contador de empleados
- Nodos expandibles/colapsables
- Líneas de conexión entre niveles

#### Vista por Jerarquía
- Muestra la cadena de mando
- Basado en relación supervisor → subordinados
- Cada nodo incluye:
  - Foto y nombre del empleado
  - Cargo
  - Departamento (chip)
  - Botones de email/teléfono
- Nodos expandibles/colapsables

### Controles

| Control | Función |
|---------|---------|
| **Toggle Departamentos/Jerarquía** | Cambiar modo de vista |
| **Ver Directorio** | Ir al directorio de empleados |
| **Expandir/Colapsar** | Botones +/- en cada nodo |

### Estadísticas
Panel superior con KPIs:
- Total de empleados
- Total de departamentos
- Total de posiciones
- Empleados activos

### Interacción
- **Clic en departamento**: Ir a lista de departamentos
- **Clic en empleado**: Ir al detalle del empleado
- **Clic en manager**: Ir al detalle del empleado

### Vista Mobile
En pantallas pequeñas, el organigrama se muestra como **lista jerárquica** con indentación para mostrar niveles.

---

## Directorio de Empleados

**Ruta:** `/organization/directory`

### Filtros Disponibles

| Filtro | Descripción |
|--------|-------------|
| **Búsqueda** | Por nombre del empleado |
| **Letra** | Filtro alfabético A-Z |
| **Departamento** | Filtrar por departamento |

### Modos de Vista (Desktop)

#### Vista Grid (Tarjetas)
- Avatar grande
- Nombre completo
- Cargo
- Departamento (chip)
- Botones de email/teléfono
- Ubicación

#### Vista Lista
- Avatar pequeño
- Nombre y cargo en línea
- Departamento
- Botones de contacto

### Acciones

| Acción | Descripción |
|--------|-------------|
| **Clic en tarjeta/fila** | Ir al detalle del empleado |
| **Botón Email** | Abrir cliente de correo |
| **Botón Teléfono** | Iniciar llamada |
| **Descargar PDF** | Exportar directorio |
| **Ver Organigrama** | Ir al organigrama |

### Paginación
- 24 empleados por página
- Navegación con números de página

### Vista Mobile
Siempre muestra vista de tarjetas (grid) optimizada para móvil.

---

## Tips y Mejores Prácticas

### Al Crear Departamentos
- ✅ Usar códigos consistentes (DIR-001, GER-001, DEP-001)
- ✅ Crear primero los niveles superiores, luego los inferiores
- ✅ Asignar colores distintivos para mejor visualización
- ✅ Asignar managers para completar el organigrama

### Al Crear Posiciones
- ✅ Definir niveles correctamente para jerarquía
- ✅ Establecer rangos salariales realistas
- ✅ Documentar requisitos y responsabilidades
- ✅ Establecer headcount para control de plantilla

### Para el Organigrama
- ✅ Asegurar que todos los empleados tengan departamento
- ✅ Asignar supervisores para vista por jerarquía
- ✅ Usar colores de departamento para identificación visual

### Para el Directorio
- ✅ Mantener emails y teléfonos actualizados
- ✅ Asignar departamentos a todos los empleados
- ✅ Usar fotos de perfil para mejor identificación

---

## Solución de Problemas

### "No se puede eliminar el departamento"
- Verificar que no tenga empleados asignados
- Verificar que no tenga subdepartamentos
- Reasignar empleados y subdepartamentos primero

### "El organigrama está vacío"
- Verificar que existan departamentos creados
- Verificar que los departamentos tengan managers asignados
- Para vista por jerarquía, verificar que empleados tengan supervisores

### "No aparecen empleados en el directorio"
- Verificar que existan empleados activos
- Limpiar filtros de búsqueda
- Verificar filtro de departamento

### "El headcount está lleno"
- La posición alcanzó el máximo de empleados
- Aumentar maxHeadcount o crear nueva posición
