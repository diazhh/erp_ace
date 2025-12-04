# 🔗 Arquitectura de Trazabilidad y UI/UX - ERP System

## Principio Fundamental

> **"Cada entidad del sistema debe ser navegable y mostrar todas sus relaciones de forma intuitiva"**

Este documento define cómo implementar la trazabilidad completa en el ERP, permitiendo a los usuarios:
- Ver el contexto completo de cualquier registro
- Navegar entre entidades relacionadas con un clic
- Auditar cualquier cambio en el sistema
- Generar reportes cruzados

---

## 📱 REGLAS DE UI/UX (OBLIGATORIAS)

### ⚠️ NO USAR MODALES PARA CREAR/EDITAR

**PROHIBIDO**: Modales/Dialogs para formularios de creación o edición
**PERMITIDO**: Modales solo para:
- Confirmaciones (eliminar, aprobar, etc.)
- Alertas y notificaciones
- Previews rápidos de información
- Selección simple (ej: seleccionar empleado de lista)

**Razones**:
1. Los modales no son responsive en mobile
2. Limitan el espacio para formularios complejos
3. Dificultan la navegación con el botón "atrás"
4. No permiten guardar estado en URL

### Patrón de Rutas para CRUD

```
/entity              → Lista (tabla en desktop, cards en mobile)
/entity/new          → Página de creación (formulario completo)
/entity/:id          → Vista detalle con tabs
/entity/:id/edit     → Página de edición (formulario completo)
```

### 100% Responsive - Mobile First

**Breakpoints MUI**:
- `xs`: 0-599px (móvil)
- `sm`: 600-899px (tablet)
- `md`: 900-1199px (laptop)
- `lg`: 1200-1535px (desktop)
- `xl`: 1536px+ (pantallas grandes)

**Reglas de Responsive**:

```jsx
// ✅ CORRECTO: Grid responsive
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <Card>...</Card>
  </Grid>
</Grid>

// ✅ CORRECTO: Tabla → Cards en mobile
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
{isMobile ? (
  <Stack spacing={2}>
    {data.map(item => <ItemCard key={item.id} item={item} />)}
  </Stack>
) : (
  <DataTable data={data} columns={columns} />
)}

// ✅ CORRECTO: Formulario responsive
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <TextField fullWidth label="Nombre" />
  </Grid>
  <Grid item xs={12} md={6}>
    <TextField fullWidth label="Apellido" />
  </Grid>
  <Grid item xs={12}>
    <TextField fullWidth multiline rows={4} label="Descripción" />
  </Grid>
</Grid>

// ✅ CORRECTO: Tabs scrollables en mobile
<Tabs
  value={activeTab}
  onChange={handleChange}
  variant="scrollable"
  scrollButtons="auto"
  allowScrollButtonsMobile
>
  <Tab label="Info" />
  <Tab label="Nómina" />
  <Tab label="Préstamos" />
</Tabs>
```

### Componentes Responsive Requeridos

```jsx
// Hook para detectar mobile
import { useMediaQuery, useTheme } from '@mui/material';

const MyComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },  // Padding responsive
      flexDirection: { xs: 'column', md: 'row' },  // Stack en mobile
    }}>
      {/* contenido */}
    </Box>
  );
};
```

### Estructura de Página de Formulario (Crear/Editar)

```jsx
// /entity/new o /entity/:id/edit
const EntityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  return (
    <Box>
      {/* Header con botón volver */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ ml: 1 }}>
          {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
        </Typography>
      </Box>
      
      {/* Formulario en Paper */}
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={2}>
          {/* Campos del formulario */}
        </Grid>
        
        {/* Botones de acción */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mt: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'flex-end',
        }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
            fullWidth={isMobile}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            type="submit"
            fullWidth={isMobile}
          >
            {isEdit ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
```

---

## 📐 Patrón de Vista Detalle

Cada entidad principal debe tener una **Vista Detalle** que siga este patrón:

### Estructura de Página de Detalle

```
┌─────────────────────────────────────────────────────────────┐
│  ← Volver    [Título de la Entidad]    [Acciones: Editar]   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │  RESUMEN / HEADER                                    │    │
│  │  - Información principal                             │    │
│  │  - Estado con badge de color                         │    │
│  │  - Métricas clave                                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  TABS DE NAVEGACIÓN                                  │    │
│  │  [Info] [Relación1] [Relación2] [Documentos] [Audit] │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  CONTENIDO DEL TAB ACTIVO                            │    │
│  │  - Tablas con enlaces a otras entidades              │    │
│  │  - Cards con información resumida                    │    │
│  │  - Gráficos cuando aplique                           │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 👤 Empleado - Vista Detalle

### Ruta: `/employees/:id`

### Header
- Foto del empleado (o avatar con iniciales)
- Nombre completo
- Cargo y Departamento
- Estado (badge: Activo/Inactivo/Licencia)
- Fecha de ingreso y antigüedad

### Tabs

#### 1. Información Personal
- Datos personales (cédula, fecha nacimiento, género, etc.)
- Datos de contacto (email, teléfono, dirección)
- Contacto de emergencia
- Datos bancarios

#### 2. Información Laboral
- Cargo actual
- Departamento
- Tipo de contrato
- Horario de trabajo
- Historial de cargos (si aplica)

#### 3. Nómina
- **Salario actual**: Base + beneficios
- **Historial de pagos**: Tabla con últimos períodos
  - Cada fila enlaza a `/payroll/periods/:id`
- **Gráfico**: Evolución de ingresos últimos 12 meses
- **Totales del año**: Bruto, Deducciones, Neto

#### 4. Préstamos
- **Préstamos activos**: Cards con progreso
  - Cada card enlaza a `/payroll/loans/:id`
- **Historial de préstamos**: Tabla completa
- **Total adeudado**: Suma de saldos pendientes

#### 5. Proyectos
- **Proyectos actuales**: Cards con rol y fechas
  - Cada card enlaza a `/projects/:id`
- **Historial de proyectos**: Tabla con participación

#### 6. Vehículo
- **Vehículo asignado** (si tiene): Card con info
  - Enlaza a `/fleet/:id`
- **Historial de asignaciones**: Tabla

#### 7. Caja Chica
- **Gastos realizados**: Tabla con últimos movimientos
  - Cada fila enlaza a `/petty-cash/entries/:id`
- **Reembolsos pendientes**: Lista
- **Total gastado**: Por período

#### 8. Documentos
- **Documentos del empleado**: Lista con vencimientos
- **Alertas**: Documentos próximos a vencer
- **Acciones**: Subir nuevo documento

#### 9. Auditoría
- **Timeline de cambios**: Quién, qué, cuándo
- **Filtros**: Por fecha, por tipo de cambio

### API Endpoint
```
GET /api/employees/:id/full
```
Retorna el empleado con todas sus relaciones cargadas.

---

## 💰 Cuenta Bancaria - Vista Detalle

### Ruta: `/finance/accounts/:id`

### Header
- Nombre de la cuenta
- Tipo (badge con icono)
- Banco / Plataforma
- Moneda
- **Saldo actual** (destacado)

### Tabs

#### 1. Información
- Datos de la cuenta
- Titular
- Número de cuenta / Wallet
- Estado (activa/inactiva)

#### 2. Transacciones
- **Filtros**: Fecha, tipo, categoría
- **Tabla de transacciones**:
  - Fecha, Código, Tipo, Descripción, Monto
  - Cada fila enlaza a detalle de transacción
- **Paginación**

#### 3. Evolución
- **Gráfico de línea**: Saldo en el tiempo
- **Selector de período**: 7d, 30d, 90d, 1y

#### 4. Conciliación
- **Transacciones pendientes**: Lista para conciliar
- **Acciones masivas**: Conciliar seleccionadas
- **Historial de conciliaciones**

#### 5. Relaciones
- **Pagos de nómina**: Desde esta cuenta
- **Gastos de proyectos**: Pagados desde aquí
- **Transferencias**: Entradas y salidas

---

## 📋 Proyecto - Vista Detalle

### Ruta: `/projects/:id`

### Header
- Nombre del proyecto
- Cliente
- Estado (badge)
- Fechas: Inicio - Fin
- **Progreso** (barra de porcentaje)

### Tabs

#### 1. Información General
- Descripción
- Objetivos
- Presupuesto
- Ubicación

#### 2. Equipo
- **Miembros actuales**: Cards con rol
  - Cada card enlaza a `/employees/:id`
- **Historial de asignaciones**
- **Acciones**: Agregar/Quitar miembro

#### 3. Finanzas
- **Resumen**: Presupuesto vs Gastado vs Facturado
- **Ingresos**: Facturas emitidas
  - Enlaza a transacciones
- **Gastos**: Por categoría
  - Enlaza a transacciones
- **Rentabilidad**: Gráfico

#### 4. Vehículos
- **Vehículos asignados**: Cards
  - Enlaza a `/fleet/:id`
- **Costos de flota**: Combustible, mantenimiento

#### 5. Inventario
- **Materiales utilizados**: Tabla
  - Enlaza a `/inventory/:id`
- **Costos de materiales**

#### 6. Caja Chica
- **Gastos menores**: Tabla
- **Total gastado**

#### 7. Hitos
- **Timeline/Kanban**: Hitos del proyecto
- **Estado de cada hito**

#### 8. Documentos
- Contratos
- Informes
- Entregables

---

## 🚗 Vehículo - Vista Detalle

### Ruta: `/fleet/:id`

### Header
- Foto del vehículo
- Marca, Modelo, Año
- Placa
- Estado (badge)
- **Asignación actual** (empleado o proyecto)

### Tabs

#### 1. Información
- Datos técnicos
- Documentos (seguro, revisión)
- Alertas de vencimiento

#### 2. Asignación
- **Asignación actual**: Card con enlace
- **Historial de asignaciones**: Timeline

#### 3. Mantenimientos
- **Próximo mantenimiento**: Alerta
- **Historial**: Tabla con costos
- **Programar**: Formulario

#### 4. Combustible
- **Consumo promedio**
- **Historial de cargas**: Tabla
- **Gráfico de consumo**

#### 5. Costos
- **Total de costos**: Por período
- **Desglose**: Mantenimiento, combustible, otros
- **Gráfico comparativo**

---

## 📄 Período de Nómina - Vista Detalle

### Ruta: `/payroll/periods/:id`

### Header
- Código del período
- Nombre
- Fechas: Inicio - Fin - Pago
- Estado (badge)
- **Totales**: Bruto, Deducciones, Neto

### Tabs

#### 1. Resumen
- Estadísticas generales
- Gráfico de distribución

#### 2. Entradas
- **Tabla de empleados**:
  - Nombre (enlaza a `/employees/:id`)
  - Salario base
  - Deducciones
  - Neto
- **Acciones**: Editar entrada individual

#### 3. Deducciones
- **Por tipo**: SSO, RPE, FAOV, ISLR, Préstamos
- **Préstamos descontados**: Lista con enlaces

#### 4. Pagos
- **Transacciones generadas**: Tabla
  - Enlaza a `/finance/transactions/:id`
- **Estado de pagos**

#### 5. Aprobaciones
- **Historial de aprobaciones**
- **Quién aprobó y cuándo**

---

## 🔄 Implementación Técnica

### Backend - Endpoints de Detalle

Cada entidad debe tener un endpoint `/full` o usar query params:

```javascript
// Opción 1: Endpoint específico
GET /api/employees/:id/full

// Opción 2: Query params
GET /api/employees/:id?include=payroll,loans,projects,vehicle
```

### Backend - Eager Loading

```javascript
// Ejemplo en controlador
const employee = await Employee.findByPk(id, {
  include: [
    { model: PayrollEntry, as: 'payrollEntries', limit: 10 },
    { model: EmployeeLoan, as: 'loans', where: { status: 'ACTIVE' } },
    { model: ProjectMember, as: 'projectAssignments', include: ['project'] },
    { model: VehicleAssignment, as: 'vehicleAssignment', include: ['vehicle'] },
    { model: EmployeeDocument, as: 'documents' },
  ],
});
```

### Frontend - Componente de Detalle

```jsx
// Patrón de componente de detalle
const EmployeeDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const { employee, loading } = useSelector(state => state.employees);
  
  useEffect(() => {
    dispatch(fetchEmployeeFull(id));
  }, [id]);
  
  return (
    <Box>
      <DetailHeader entity={employee} onBack={() => navigate(-1)} />
      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
        <Tab label="Información" />
        <Tab label="Nómina" />
        <Tab label="Préstamos" />
        {/* ... más tabs */}
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <EmployeeInfoTab employee={employee} />
      </TabPanel>
      {/* ... más panels */}
    </Box>
  );
};
```

### Frontend - Enlaces entre Entidades

```jsx
// Componente reutilizable para enlaces
const EntityLink = ({ type, id, label }) => {
  const routes = {
    employee: '/employees',
    project: '/projects',
    vehicle: '/fleet',
    account: '/finance/accounts',
    transaction: '/finance/transactions',
    loan: '/payroll/loans',
    period: '/payroll/periods',
  };
  
  return (
    <Link to={`${routes[type]}/${id}`}>
      {label}
    </Link>
  );
};

// Uso
<EntityLink type="employee" id={entry.employeeId} label={entry.employee.fullName} />
```

---

## 📊 Auditoría

### Modelo AuditLog

```javascript
{
  id: UUID,
  entityType: 'EMPLOYEE' | 'PROJECT' | 'TRANSACTION' | ...,
  entityId: UUID,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | ...,
  changes: JSONB, // { field: { old: value, new: value } }
  userId: UUID,
  ipAddress: STRING,
  userAgent: STRING,
  createdAt: TIMESTAMP,
}
```

### Hook de Auditoría

```javascript
// Middleware de Sequelize
Model.afterCreate((instance, options) => {
  AuditLog.create({
    entityType: Model.name.toUpperCase(),
    entityId: instance.id,
    action: 'CREATE',
    changes: instance.toJSON(),
    userId: options.userId,
  });
});

Model.afterUpdate((instance, options) => {
  const changes = {};
  instance.changed().forEach(field => {
    changes[field] = {
      old: instance.previous(field),
      new: instance.get(field),
    };
  });
  
  AuditLog.create({
    entityType: Model.name.toUpperCase(),
    entityId: instance.id,
    action: 'UPDATE',
    changes,
    userId: options.userId,
  });
});
```

---

## ✅ Checklist de Implementación

### Por cada entidad principal:

- [ ] Crear página de detalle (`/entity/:id`)
- [ ] Implementar header con información clave
- [ ] Implementar tabs con relaciones
- [ ] Agregar enlaces a entidades relacionadas
- [ ] Implementar tab de auditoría
- [ ] Crear endpoint `/full` o con includes
- [ ] Agregar pruebas del endpoint
- [ ] Documentar en ROADMAP

### Entidades principales:
- [x] Empleado
- [ ] Proyecto
- [ ] Vehículo
- [x] Cuenta Bancaria
- [x] Período de Nómina
- [ ] Préstamo
- [ ] Item de Inventario
- [x] Caja Chica

---

## 📱 Componentes Responsive Reutilizables

### ResponsiveTable - Tabla que se convierte en Cards

```jsx
// components/common/ResponsiveTable.jsx
import { useMediaQuery, useTheme, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Paper, Card, 
         CardContent, Stack, Typography, Box } from '@mui/material';

const ResponsiveTable = ({ columns, data, onRowClick, renderMobileCard }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (isMobile) {
    return (
      <Stack spacing={2}>
        {data.map((row, index) => (
          renderMobileCard ? renderMobileCard(row) : (
            <Card key={index} onClick={() => onRowClick?.(row)}>
              <CardContent>
                {columns.map((col) => (
                  <Box key={col.field} sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {col.headerName}
                    </Typography>
                    <Typography>
                      {col.renderCell ? col.renderCell(row) : row[col.field]}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )
        ))}
      </Stack>
    );
  }
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field}>{col.headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow 
              key={index} 
              hover 
              onClick={() => onRowClick?.(row)}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col) => (
                <TableCell key={col.field}>
                  {col.renderCell ? col.renderCell(row) : row[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
```

### PageHeader - Header responsive con acciones

```jsx
// components/common/PageHeader.jsx
const PageHeader = ({ title, subtitle, onBack, actions, breadcrumbs }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ mb: 3 }}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {breadcrumbs.map((crumb, i) => (
            <Link key={i} to={crumb.path}>{crumb.label}</Link>
          ))}
        </Breadcrumbs>
      )}
      
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {onBack && (
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        {/* Actions */}
        {actions && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            width: { xs: '100%', sm: 'auto' },
            flexDirection: { xs: 'column', sm: 'row' },
          }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
};
```

### StatsCards - KPIs responsive

```jsx
// components/common/StatsCards.jsx
const StatsCards = ({ stats }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={6} sm={6} md={3} key={index}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                {stat.label}
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color={stat.color || 'text.primary'}
                sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
              >
                {stat.value}
              </Typography>
              {stat.subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Uso
<StatsCards stats={[
  { label: 'Total Ingresos', value: '$5,000', color: 'success.main' },
  { label: 'Total Gastos', value: '$3,200', color: 'error.main' },
  { label: 'Balance', value: '$1,800', color: 'primary.main' },
  { label: 'Pendientes', value: '5', color: 'warning.main' },
]} />
```

### FormPage - Página de formulario completa

```jsx
// components/common/FormPage.jsx
const FormPage = ({ 
  title, 
  onSubmit, 
  onCancel, 
  loading, 
  children,
  submitLabel = 'Guardar',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  return (
    <Box>
      <PageHeader 
        title={title}
        onBack={onCancel || (() => navigate(-1))}
      />
      
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <form onSubmit={onSubmit}>
          {children}
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 3,
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            justifyContent: 'flex-end',
          }}>
            <Button 
              variant="outlined" 
              onClick={onCancel || (() => navigate(-1))}
              fullWidth={isMobile}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              fullWidth={isMobile}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : submitLabel}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

// Uso
<FormPage title="Nuevo Empleado" onSubmit={handleSubmit} loading={loading}>
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <TextField fullWidth label="Nombre" name="firstName" />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField fullWidth label="Apellido" name="lastName" />
    </Grid>
  </Grid>
</FormPage>
```

---

## 🎨 Estilos Responsive Comunes

```jsx
// Padding responsive
sx={{ p: { xs: 1, sm: 2, md: 3 } }}

// Margin responsive
sx={{ m: { xs: 1, sm: 2 }, mb: { xs: 2, md: 4 } }}

// Flex direction responsive
sx={{ flexDirection: { xs: 'column', md: 'row' } }}

// Display responsive
sx={{ display: { xs: 'none', md: 'block' } }}  // Ocultar en mobile
sx={{ display: { xs: 'block', md: 'none' } }}  // Solo en mobile

// Font size responsive
sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}

// Width responsive
sx={{ width: { xs: '100%', sm: 'auto' } }}

// Gap responsive
sx={{ gap: { xs: 1, sm: 2 } }}
```
