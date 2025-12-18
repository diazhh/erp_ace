# 👥 Módulo de Empleados - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Empleados"**
2. Se abrirá la lista de empleados

---

## Lista de Empleados

![Lista de Empleados](screenshots/lista.png)

### Elementos de la Lista

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único (EMP-XXXXX) |
| **Nombre** | Nombre del empleado |
| **Apellido** | Apellido del empleado |
| **Cédula** | Número de identificación |
| **Cargo** | Posición en la empresa |
| **Departamento** | Área de trabajo |
| **Estado** | Activo, Inactivo, Licencia, Terminado |
| **Acciones** | Botones de Ver, Editar, Eliminar |

### Buscar Empleados

1. Usar el campo de búsqueda en la parte superior
2. Escribir nombre, apellido o cédula
3. Los resultados se filtran automáticamente

### Filtrar por Estado

1. Usar el selector de estado (si está disponible)
2. Seleccionar: Todos, Activo, Inactivo, Licencia, Terminado

---

## Crear Nuevo Empleado

### Paso 1: Abrir formulario
Hacer clic en el botón **"+ Nuevo Empleado"** (esquina superior derecha)

![Formulario de Nuevo Empleado](screenshots/formulario-crear.png)

### Paso 2: Completar Datos Personales

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Nombre** | ✅ | Nombre(s) del empleado |
| **Apellido** | ✅ | Apellido(s) del empleado |
| **Tipo ID** | ✅ | V (Venezolano), E (Extranjero), J (Jurídico), P (Pasaporte) |
| **Cédula** | ✅ | Número de identificación |
| **Fecha de Nacimiento** | ❌ | Formato: dd/mm/aaaa |
| **Género** | ❌ | Masculino, Femenino, Otro |
| **Estado Civil** | ❌ | Soltero, Casado, Divorciado, Viudo |
| **Nacionalidad** | ❌ | País de origen |
| **Email** | ❌ | Correo electrónico |

### Paso 3: Completar Datos de Contacto

| Campo | Descripción |
|-------|-------------|
| **Teléfono** | Teléfono fijo |
| **Celular** | Teléfono móvil |
| **Extensión** | Extensión telefónica en oficina |
| **Dirección** | Dirección de residencia |
| **Ciudad** | Ciudad de residencia |
| **Estado** | Estado/Provincia |

### Paso 4: Contacto de Emergencia

| Campo | Descripción |
|-------|-------------|
| **Contacto de Emergencia** | Nombre de la persona |
| **Teléfono** | Teléfono del contacto |
| **Relación** | Parentesco (Padre, Madre, Cónyuge, etc.) |

### Paso 5: Datos Laborales

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Cargo** | ✅ | Posición en la empresa |
| **Departamento** | ❌ | Área de trabajo |
| **Departamento (Estructura)** | ❌ | Departamento en organigrama |
| **Cargo (Estructura)** | ❌ | Cargo en organigrama |
| **Supervisor Directo** | ❌ | Jefe inmediato |
| **Fecha de Ingreso** | ✅ | Fecha de inicio laboral |
| **Tipo de Contrato** | ❌ | Tiempo Completo, Medio Tiempo, Contratado, Pasante |
| **Estado** | ✅ | Activo (por defecto) |
| **Ubicación/Oficina** | ❌ | Lugar de trabajo |
| **Horario de Trabajo** | ❌ | Horario asignado |

### Paso 6: Datos Bancarios

| Campo | Descripción |
|-------|-------------|
| **Salario** | Salario base mensual |
| **Moneda** | USD, VES, etc. |
| **Frecuencia de Pago** | Mensual, Quincenal, Semanal |

### Paso 7: Notas Adicionales
Campo de texto libre para observaciones.

### Paso 8: Guardar
Hacer clic en el botón **"Guardar"** (esquina superior derecha)

---

## Ver Detalle de Empleado

### Acceder al Detalle
1. En la lista, hacer clic en el botón **👁️ Ver** en la fila del empleado
2. O hacer clic en el nombre/código del empleado

![Detalle de Empleado](screenshots/detalle.png)

### Encabezado del Detalle

- **Avatar**: Iniciales del empleado
- **Nombre completo**: Con badge de estado
- **Cargo y Departamento**
- **Código**: EMP-XXXXX
- **Cédula**
- **Fecha de ingreso y antigüedad**

### KPIs del Empleado

| KPI | Descripción |
|-----|-------------|
| **Nóminas** | Cantidad de períodos de nómina |
| **Préstamos Activos** | Préstamos vigentes |
| **Saldo Préstamos** | Monto pendiente de préstamos |
| **Docs. por Vencer** | Documentos próximos a vencer |

### Tabs Disponibles

#### Tab: Información
Datos personales y de contacto:
- Nombre completo
- Identificación
- Fecha de nacimiento
- Género, Estado civil
- Nacionalidad
- Email, Teléfono, Celular
- Dirección completa
- Contacto de emergencia

#### Tab: Laboral
![Tab Laboral](screenshots/detalle-laboral.png)

Datos laborales y bancarios:
- Código de empleado
- Cargo
- Departamento
- Tipo de contrato
- Fecha de ingreso
- Horario
- Banco, Tipo de cuenta
- Número de cuenta
- Salario base
- Frecuencia de pago
- Seguro Social, RIF

#### Tab: Cuentas
Cuentas bancarias del empleado:
- Lista de cuentas registradas
- Tipo de cuenta
- Banco
- Número de cuenta
- Cuenta primaria (para nómina)
- Porcentaje de pago
- Acciones: Editar, Eliminar, Establecer como primaria

#### Tab: Jerarquía
Estructura organizacional:
- Supervisor directo (con enlace)
- Subordinados directos (lista con enlaces)

#### Tab: Nómina
Historial de pagos de nómina:
- Período
- Salario bruto
- Deducciones
- Salario neto
- Estado del pago

#### Tab: Préstamos
![Tab Préstamos](screenshots/detalle-nomina.png)

Préstamos del empleado:
- Monto del préstamo
- Cuotas totales / pagadas
- Saldo pendiente
- Estado
- Enlace al detalle del préstamo

#### Tab: Documentos
Documentos del empleado:
- Tipo de documento
- Número
- Fecha de emisión
- Fecha de vencimiento
- Estado (Vigente, Por vencer, Vencido)
- Acciones: Ver, Descargar, Eliminar

#### Tab: Auditoría
Historial de cambios:
- Fecha y hora
- Usuario que realizó el cambio
- Acción (Creación, Actualización)
- Campos modificados

---

## Editar Empleado

### Paso 1: Acceder a edición
- Desde la lista: Botón **✏️ Editar** en la fila
- Desde el detalle: Botón **"Editar"** (esquina superior derecha)

### Paso 2: Modificar campos
El formulario es igual al de creación, con los datos actuales precargados.

### Paso 3: Guardar cambios
Hacer clic en **"Guardar"**

---

## Eliminar Empleado

### Paso 1: Iniciar eliminación
- Desde la lista: Botón **🗑️ Eliminar** en la fila
- Desde el detalle: Botón **"Eliminar"**

### Paso 2: Confirmar
Se mostrará un diálogo de confirmación:
> "¿Está seguro de eliminar este empleado?"

### Paso 3: Confirmar o Cancelar
- **Confirmar**: El empleado se desactiva (soft delete)
- **Cancelar**: Se cierra el diálogo sin cambios

> ⚠️ **Nota**: Los empleados no se eliminan físicamente, solo se desactivan para mantener la trazabilidad.

---

## Gestionar Cuentas Bancarias

### Agregar Cuenta Bancaria

1. Ir al detalle del empleado
2. Seleccionar tab **"Cuentas"**
3. Hacer clic en **"+ Nueva Cuenta"**
4. Completar:
   - Banco
   - Tipo de cuenta (Corriente, Ahorro, Pago Móvil, Zelle, Crypto)
   - Número de cuenta
   - Titular
   - Es cuenta primaria (checkbox)
   - Porcentaje de pago (si hay múltiples cuentas)
5. Guardar

### Establecer Cuenta Primaria

1. En la lista de cuentas, hacer clic en **"Establecer como primaria"**
2. Esta cuenta se usará para pagos de nómina

### Eliminar Cuenta

1. Hacer clic en **🗑️ Eliminar** en la cuenta
2. Confirmar eliminación

> ⚠️ **Nota**: No se puede eliminar la cuenta primaria si es la única.

---

## Gestionar Documentos del Empleado

### Agregar Documento

1. Ir al detalle del empleado
2. Seleccionar tab **"Documentos"**
3. Hacer clic en **"+ Nuevo Documento"**
4. Completar:
   - Tipo de documento
   - Número
   - Fecha de emisión
   - Fecha de vencimiento
   - Archivo adjunto (opcional)
5. Guardar

### Alertas de Vencimiento

Los documentos próximos a vencer se muestran con indicadores:
- 🟢 **Verde**: Vigente (más de 30 días)
- 🟡 **Amarillo**: Por vencer (menos de 30 días)
- 🔴 **Rojo**: Vencido

---

## Descargar PDF

1. En el detalle del empleado
2. Hacer clic en **"Descargar PDF"** (esquina superior derecha)
3. Se genera un PDF con toda la información del empleado

---

## Tips y Mejores Prácticas

### Al Crear Empleados
- ✅ Verificar que la cédula no esté duplicada
- ✅ Asignar departamento y cargo correctos
- ✅ Registrar al menos una cuenta bancaria
- ✅ Subir documentos importantes (cédula, certificados)

### Al Editar
- ✅ Documentar el motivo del cambio en notas
- ✅ Verificar que el supervisor esté correcto
- ✅ Actualizar estado si hay cambios laborales

### Mantenimiento
- ✅ Revisar documentos por vencer mensualmente
- ✅ Actualizar información de contacto periódicamente
- ✅ Verificar cuentas bancarias antes de procesar nómina

---

## Solución de Problemas

### "La cédula ya existe"
- Verificar si el empleado ya está registrado
- Buscar por cédula en la lista

### "No se puede eliminar el empleado"
- Verificar que no tenga préstamos activos
- Verificar que no esté asignado a proyectos activos

### "Error al guardar"
- Verificar campos obligatorios (*)
- Verificar formato de cédula
- Verificar formato de fecha
