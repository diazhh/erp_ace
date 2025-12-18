# 👥 Módulo de Empleados - Descripción

## ¿Qué hace este módulo?

El módulo de **Empleados** es el núcleo de la gestión de recursos humanos del ERP. Permite administrar toda la información del personal de la empresa, desde datos personales hasta información laboral, bancaria y documental.

## Funcionalidades Principales

### 1. Gestión de Empleados
- **Crear** nuevos empleados con información completa
- **Editar** datos de empleados existentes
- **Desactivar** empleados (soft delete)
- **Buscar** empleados por nombre, cédula o código

### 2. Información Personal
- Nombre completo
- Tipo y número de identificación (V, E, J, P)
- Fecha de nacimiento
- Género
- Estado civil
- Nacionalidad
- Datos de contacto (teléfono, celular, email)
- Dirección completa
- Contacto de emergencia

### 3. Información Laboral
- Código de empleado (generado automáticamente: EMP-XXXXX)
- Cargo y departamento
- Tipo de contrato (Tiempo completo, Medio tiempo, Contratado, Pasante)
- Fecha de ingreso
- Supervisor directo
- Ubicación/Oficina
- Horario de trabajo
- Estado (Activo, Inactivo, Licencia, Terminado)

### 4. Información Bancaria
- Salario base
- Moneda de pago (USD, VES, etc.)
- Frecuencia de pago (Mensual, Quincenal, Semanal)
- Cuentas bancarias múltiples

### 5. Cuentas Bancarias del Empleado
- Múltiples cuentas por empleado
- Tipos: Corriente, Ahorro, Pago Móvil, Zelle, Crypto
- Cuenta primaria para pagos de nómina
- Porcentaje de pago por cuenta

### 6. Documentos del Empleado
- Documentos con fecha de vencimiento
- Alertas de vencimiento
- Tipos: Cédula, Pasaporte, Licencia, Certificados, etc.

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Employee` | Datos principales del empleado |
| `EmployeeDocument` | Documentos asociados al empleado |
| `EmployeeBankAccount` | Cuentas bancarias del empleado |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                        EMPLEADO                              │
└─────────────────────────────────────────────────────────────┘
                              │
    ┌─────────────┬───────────┼───────────┬─────────────┐
    │             │           │           │             │
    ▼             ▼           ▼           ▼             ▼
┌────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐  ┌─────────┐
│ Nómina │  │Préstamos│  │Proyectos│  │ Flota  │  │Caja     │
│        │  │         │  │(Miembro)│  │(Asign.)│  │Chica    │
└────────┘  └─────────┘  └─────────┘  └────────┘  └─────────┘
    │             │           │           │             │
    ▼             ▼           ▼           ▼             ▼
 Pagos de      Pagos de   Gastos del  Vehículo    Gastos
 nómina        préstamo   proyecto    asignado    registrados
```

### Módulos Relacionados:
- **Organización**: Departamento y cargo del empleado
- **Nómina**: Historial de pagos, deducciones
- **Préstamos**: Préstamos activos y pagos
- **Proyectos**: Asignación a proyectos como miembro del equipo
- **Flota**: Vehículos asignados al empleado
- **Caja Chica**: Gastos realizados por el empleado
- **HSE**: Capacitaciones, EPP asignado
- **Documentos**: Documentos del empleado

## Ejemplos de Uso

### Caso 1: Nuevo Ingreso
1. RRHH crea el empleado con datos personales
2. Asigna departamento y cargo
3. Registra cuentas bancarias para pago de nómina
4. Sube documentos (cédula, certificados)
5. El empleado aparece en la siguiente nómina

### Caso 2: Consulta de Empleado
1. Supervisor busca empleado por nombre
2. Ve detalle con todas las pestañas
3. Revisa historial de nómina
4. Verifica préstamos activos
5. Consulta proyectos asignados

### Caso 3: Baja de Empleado
1. RRHH cambia estado a "Terminado"
2. Sistema calcula liquidación pendiente
3. Empleado no aparece en próximas nóminas
4. Historial se mantiene para auditoría

## Estados del Empleado

| Estado | Descripción | Incluido en Nómina |
|--------|-------------|-------------------|
| **Activo** | Empleado trabajando normalmente | ✅ Sí |
| **Inactivo** | Suspendido temporalmente | ❌ No |
| **Licencia** | Permiso temporal (maternidad, etc.) | ⚠️ Según tipo |
| **Terminado** | Relación laboral finalizada | ❌ No |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `employees:read` | Ver lista y detalle de empleados |
| `employees:create` | Crear nuevos empleados |
| `employees:update` | Editar empleados existentes |
| `employees:delete` | Eliminar/desactivar empleados |

## Screenshots

- `screenshots/lista.png` - Lista de empleados
- `screenshots/formulario-crear.png` - Formulario de nuevo empleado
- `screenshots/detalle.png` - Vista de detalle con tabs
- `screenshots/detalle-laboral.png` - Tab de datos laborales
- `screenshots/detalle-nomina.png` - Tab de historial de nómina
