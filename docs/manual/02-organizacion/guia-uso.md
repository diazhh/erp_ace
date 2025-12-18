# 🏢 Estructura Organizacional - Guía de Uso

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Organización"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Departamentos**: Gestión de departamentos
   - **Cargos**: Gestión de posiciones/cargos
   - **Organigrama**: Vista gráfica de la estructura
   - **Directorio**: Búsqueda de empleados

---

## Departamentos

### Ver Lista de Departamentos

1. En el menú, seleccione **"Organización"** → **"Departamentos"**
2. Verá una tabla con todos los departamentos de la empresa

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único del departamento |
| **Nombre** | Nombre del departamento con indicador de color |
| **Tipo** | Nivel jerárquico (Dirección, Gerencia, etc.) |
| **Pertenece a** | Departamento padre (si tiene) |
| **Gerente** | Persona responsable del departamento |
| **Estado** | Activo o Inactivo |
| **Acciones** | Botones para ver, editar o eliminar |

#### Vista en Dispositivos Móviles
En celulares y tablets, la información se muestra en tarjetas en lugar de tabla para facilitar la lectura.

---

### Crear un Nuevo Departamento

1. En la lista de departamentos, haga clic en el botón **"+ Nuevo Departamento"** (esquina superior derecha)
2. Se abrirá una página con el formulario de creación

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único (ej: "DEP-001", "GER-OPS") |
| **Nombre** | ✅ Sí | Nombre descriptivo del departamento |
| **Tipo** | ✅ Sí | Seleccione: Dirección, Gerencia, Departamento, Área o Unidad |
| **Pertenece a** | ❌ No | Seleccione el departamento padre (si aplica) |
| **Descripción** | ❌ No | Descripción de las funciones del departamento |
| **Gerente** | ❌ No | Seleccione el empleado responsable |
| **Ubicación** | ❌ No | Ubicación física del departamento |
| **Centro de Costo** | ❌ No | Código para control financiero |
| **Color** | ❌ No | Color para identificar en el organigrama |
| **Estado** | ❌ No | Activo (predeterminado) o Inactivo |

3. Complete los campos requeridos
4. Haga clic en **"Guardar"**
5. Verá un mensaje de confirmación y volverá a la lista

---

### Ver Detalle de un Departamento

1. En la lista de departamentos, haga clic en el ícono de **edificio** (🏢) en la columna de acciones
2. Se abrirá la página de detalle mostrando:
   - Información general del departamento
   - Gerente asignado
   - Empleados que pertenecen al departamento
   - Subdepartamentos (si tiene)

---

### Editar un Departamento

1. En la lista de departamentos, haga clic en el ícono de **lápiz** (✏️) en la columna de acciones
2. Modifique los campos necesarios
3. Haga clic en **"Guardar"**

---

### Eliminar un Departamento

1. En la lista de departamentos, haga clic en el ícono de **papelera** (🗑️) en la columna de acciones
2. Aparecerá un diálogo de confirmación
3. Haga clic en **"Confirmar"** para eliminar

> ⚠️ **Importante**: No puede eliminar un departamento que tenga empleados asignados o subdepartamentos. Primero debe reasignar los empleados y eliminar los subdepartamentos.

---

## Cargos (Posiciones)

### Ver Lista de Cargos

1. En el menú, seleccione **"Organización"** → **"Cargos"**
2. Verá una tabla con todos los cargos de la empresa

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único del cargo |
| **Nombre** | Nombre del cargo |
| **Nivel** | Nivel jerárquico (Ejecutivo, Director, etc.) |
| **Departamento** | Departamento al que pertenece |
| **Empleados** | Cantidad actual / Máximo permitido |
| **Rango Salarial** | Salario mínimo - máximo |
| **Estado** | Activo o Inactivo |
| **Acciones** | Botones para ver, editar o eliminar |

---

### Crear un Nuevo Cargo

1. En la lista de cargos, haga clic en el botón **"+ Nuevo Cargo"**
2. Se abrirá una página con el formulario de creación

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único (ej: "POS-001", "GER-001") |
| **Nombre** | ✅ Sí | Nombre del cargo (ej: "Gerente de Operaciones") |
| **Departamento** | ❌ No | Departamento al que pertenece el cargo |
| **Nivel** | ✅ Sí | Nivel jerárquico (0-Ejecutivo hasta 6-Operativo) |
| **Descripción** | ❌ No | Descripción general del cargo |
| **Salario Mínimo** | ❌ No | Salario mínimo para este cargo |
| **Salario Máximo** | ❌ No | Salario máximo para este cargo |
| **Moneda** | ❌ No | USD, VES o EUR |
| **Máximo de Empleados** | ❌ No | Cantidad máxima de personas en este cargo |
| **Requisitos** | ❌ No | Requisitos para ocupar el cargo |
| **Responsabilidades** | ❌ No | Responsabilidades del cargo |
| **Estado** | ❌ No | Activo o Inactivo |

3. Complete los campos requeridos
4. Haga clic en **"Guardar"**

---

### Ver Detalle de un Cargo

1. En la lista de cargos, haga clic en el ícono de **maletín** (💼) en la columna de acciones
2. Verá información detallada del cargo incluyendo:
   - Datos generales
   - Requisitos y responsabilidades
   - Lista de empleados que ocupan este cargo

---

### Editar un Cargo

1. En la lista de cargos, haga clic en el ícono de **lápiz** (✏️)
2. Modifique los campos necesarios
3. Haga clic en **"Guardar"**

---

### Eliminar un Cargo

1. En la lista de cargos, haga clic en el ícono de **papelera** (🗑️)
2. Confirme la eliminación

> ⚠️ **Importante**: No puede eliminar un cargo que tenga empleados asignados.

---

## Organigrama

### Ver el Organigrama

1. En el menú, seleccione **"Organización"** → **"Organigrama"**
2. También puede acceder desde la lista de departamentos haciendo clic en el botón **"Organigrama"**

### Estadísticas Generales

En la parte superior verá indicadores con:
- **Total de Empleados**
- **Total de Departamentos**
- **Total de Cargos**
- **Empleados Activos**

### Modos de Visualización

Puede cambiar entre dos vistas usando los botones en la esquina superior derecha:

| Modo | Descripción |
|------|-------------|
| **Por Departamentos** (🏢) | Muestra la estructura de departamentos con sus empleados |
| **Por Jerarquía** (🌳) | Muestra la cadena de supervisión (quién reporta a quién) |

### Navegar por el Organigrama

- **Expandir/Colapsar**: Haga clic en el ícono de flecha (▼/▲) debajo de cada nodo para mostrar u ocultar los niveles inferiores
- **Ver Departamento**: Haga clic en la tarjeta del departamento para ir a su detalle
- **Ver Empleado**: Haga clic en la tarjeta del empleado para ir a su ficha
- **Contactar**: Use los íconos de email (📧) o teléfono (📞) para contactar directamente

### Vista en Dispositivos Móviles

En celulares, el organigrama se muestra como una lista jerárquica con indentación para facilitar la navegación.

---

## Directorio de Empleados

### Acceder al Directorio

1. En el menú, seleccione **"Organización"** → **"Directorio"**
2. También puede acceder desde el organigrama haciendo clic en **"Ver Directorio"**

### Buscar Empleados

#### Por Nombre
1. Escriba el nombre o apellido en el campo de búsqueda
2. Los resultados se filtran automáticamente mientras escribe

#### Por Letra Inicial
1. Haga clic en una letra del alfabeto (A-Z) que aparece debajo del buscador
2. Se mostrarán solo los empleados cuyo apellido comienza con esa letra
3. Haga clic en **"Limpiar"** para quitar el filtro

#### Por Departamento
1. Use el selector **"Departamento"** para filtrar por área
2. Seleccione el departamento deseado
3. Seleccione **"Todos"** para ver todos los departamentos

### Modos de Vista

En pantallas grandes puede alternar entre:
- **Vista de Cuadrícula** (🔲): Tarjetas con foto y datos de contacto
- **Vista de Lista** (📋): Lista compacta con información básica

### Información de Cada Empleado

Cada tarjeta muestra:
- **Foto** del empleado (o iniciales si no tiene foto)
- **Nombre completo**
- **Cargo**
- **Departamento**
- **Botones de contacto**: Email y teléfono
- **Extensión** (si tiene)
- **Ubicación de oficina** (si está registrada)

### Contactar a un Empleado

- Haga clic en el ícono de **email** (📧) para abrir su cliente de correo con la dirección del empleado
- Haga clic en el ícono de **teléfono** (📞) para iniciar una llamada (en dispositivos móviles)

### Exportar Directorio

1. Haga clic en el botón **"Descargar PDF"** en la esquina superior derecha
2. Se generará un PDF con la lista de empleados (respetando los filtros aplicados)

### Ver Detalle del Empleado

Haga clic en cualquier parte de la tarjeta del empleado para ir a su ficha completa en el módulo de Empleados.

---

## Consejos Útiles

### Para Departamentos
- ✅ Use códigos consistentes (ej: "DIR-001", "GER-OPS", "DEP-PROD")
- ✅ Asigne colores distintos a cada departamento principal para facilitar la identificación en el organigrama
- ✅ Mantenga actualizado el gerente de cada departamento
- ✅ Use centros de costo para vincular con el sistema financiero

### Para Cargos
- ✅ Defina rangos salariales realistas para cada cargo
- ✅ Documente los requisitos y responsabilidades
- ✅ Establezca el máximo de empleados según la estructura planificada
- ✅ Use niveles jerárquicos consistentes

### Para el Organigrama
- ✅ Revise periódicamente que la estructura esté actualizada
- ✅ Use la vista por departamentos para ver la estructura formal
- ✅ Use la vista por jerarquía para ver las líneas de reporte

---

## Preguntas Frecuentes

### ¿Por qué no puedo eliminar un departamento?
Probablemente tiene empleados asignados o subdepartamentos. Primero debe reasignar los empleados a otro departamento y eliminar los subdepartamentos.

### ¿Cómo cambio el gerente de un departamento?
Vaya a editar el departamento y seleccione un nuevo empleado en el campo "Gerente".

### ¿Por qué un empleado no aparece en el directorio?
Verifique que el empleado tenga estado "Activo" en el módulo de Empleados.

### ¿Cómo veo quién reporta a quién?
Use el organigrama en modo "Por Jerarquía". Esta vista muestra la cadena de supervisión basada en el campo "Supervisor" de cada empleado.

### ¿Puedo tener un cargo sin departamento?
Sí, el campo departamento es opcional. Esto es útil para cargos que aplican a toda la organización.

### ¿Cómo exporto el organigrama?
Actualmente puede exportar el directorio de empleados a PDF. Para el organigrama visual, use la función de captura de pantalla de su navegador.
