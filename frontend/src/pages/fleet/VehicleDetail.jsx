import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Skeleton,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Build as MaintenanceIcon,
  LocalGasStation as FuelIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  CheckCircle as CompleteIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import {
  fetchVehicleFull,
  createAssignment,
  endAssignment,
  clearCurrentVehicle,
} from '../../store/slices/fleetSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import AttachmentSection from '../../components/common/AttachmentSection';

const statusColors = {
  AVAILABLE: 'success',
  ASSIGNED: 'primary',
  IN_MAINTENANCE: 'warning',
  OUT_OF_SERVICE: 'error',
  SOLD: 'default',
};

const statusLabels = {
  AVAILABLE: 'Disponible',
  ASSIGNED: 'Asignado',
  IN_MAINTENANCE: 'En Mantenimiento',
  OUT_OF_SERVICE: 'Fuera de Servicio',
  SOLD: 'Vendido',
};

const TabPanel = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 2 }}>
    {value === index && children}
  </Box>
);

const VehicleDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { currentVehicle: vehicle, loading, error } = useSelector((state) => state.fleet);
  const { employees } = useSelector((state) => state.employees);
  const { projects } = useSelector((state) => state.projects);

  const [tabValue, setTabValue] = useState(0);
  const [assignDialog, setAssignDialog] = useState(false);
  const [endAssignDialog, setEndAssignDialog] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    assignmentType: 'EMPLOYEE',
    employeeId: '',
    projectId: '',
    startDate: new Date().toISOString().split('T')[0],
    purpose: '',
  });
  const [endAssignmentData, setEndAssignmentData] = useState({
    endDate: new Date().toISOString().split('T')[0],
    endMileage: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchVehicleFull(id));
    dispatch(fetchEmployees({ limit: 100 }));
    dispatch(fetchProjects({ limit: 100 }));
    return () => dispatch(clearCurrentVehicle());
  }, [dispatch, id]);

  const handleAssign = async () => {
    const data = {
      vehicleId: id,
      assignmentType: assignmentData.assignmentType,
      startDate: assignmentData.startDate,
      purpose: assignmentData.purpose,
      startMileage: vehicle?.mileage,
    };
    if (assignmentData.assignmentType === 'EMPLOYEE') {
      data.employeeId = assignmentData.employeeId;
    } else if (assignmentData.assignmentType === 'PROJECT') {
      data.projectId = assignmentData.projectId;
    }
    await dispatch(createAssignment(data));
    setAssignDialog(false);
    dispatch(fetchVehicleFull(id));
  };

  const handleEndAssignment = async () => {
    const activeAssignment = vehicle?.currentAssignment;
    if (activeAssignment) {
      await dispatch(endAssignment({ id: activeAssignment.id, data: endAssignmentData }));
      setEndAssignDialog(false);
      dispatch(fetchVehicleFull(id));
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const isDocumentExpiring = (date) => {
    if (!date) return false;
    const expiry = new Date(date);
    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    return expiry <= thirtyDays && expiry >= today;
  };

  const isDocumentExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (loading && !vehicle) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/fleet')} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  if (!vehicle) return null;

  const renderInfoTab = () => (
    <Grid container spacing={3}>
      {/* Información General */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Información General
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Código</Typography>
              <Typography variant="body1" fontWeight="medium">{vehicle.code}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Placa</Typography>
              <Typography variant="body1" fontWeight="bold">{vehicle.plate}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Marca</Typography>
              <Typography variant="body1">{vehicle.brand}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Modelo</Typography>
              <Typography variant="body1">{vehicle.model}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Año</Typography>
              <Typography variant="body1">{vehicle.year}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Color</Typography>
              <Typography variant="body1">{vehicle.color || '-'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">VIN</Typography>
              <Typography variant="body1">{vehicle.vin || '-'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Tipo</Typography>
              <Typography variant="body1">{vehicle.vehicleType}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Especificaciones Técnicas */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Especificaciones Técnicas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Combustible</Typography>
              <Typography variant="body1">{vehicle.fuelType}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Transmisión</Typography>
              <Typography variant="body1">{vehicle.transmission || '-'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Cilindraje</Typography>
              <Typography variant="body1">{vehicle.engineCapacity || '-'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Cap. Tanque</Typography>
              <Typography variant="body1">{vehicle.tankCapacity ? `${vehicle.tankCapacity} L` : '-'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Pasajeros</Typography>
              <Typography variant="body1">{vehicle.passengers || '-'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Cap. Carga</Typography>
              <Typography variant="body1">{vehicle.loadCapacity ? `${vehicle.loadCapacity} kg` : '-'}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Kilometraje y Mantenimiento */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            <SpeedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Kilometraje y Mantenimiento
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Kilometraje Actual</Typography>
              <Typography variant="h5" color="primary">{vehicle.mileage?.toLocaleString()} km</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Próx. Mantenimiento</Typography>
              <Typography variant="h5" color={vehicle.nextMaintenanceMileage <= vehicle.mileage ? 'error' : 'text.primary'}>
                {vehicle.nextMaintenanceMileage?.toLocaleString() || '-'} km
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Último Mantenimiento</Typography>
              <Typography variant="body1">{formatDate(vehicle.lastMaintenanceDate)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Km Último Mant.</Typography>
              <Typography variant="body1">{vehicle.lastMaintenanceMileage?.toLocaleString() || '-'} km</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Documentos */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Documentos y Vencimientos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            <ListItem>
              <ListItemText
                primary="Seguro"
                secondary={formatDate(vehicle.insuranceExpiry)}
              />
              {isDocumentExpired(vehicle.insuranceExpiry) && (
                <Chip label="Vencido" color="error" size="small" />
              )}
              {isDocumentExpiring(vehicle.insuranceExpiry) && (
                <Chip label="Por vencer" color="warning" size="small" />
              )}
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Matrícula"
                secondary={formatDate(vehicle.registrationExpiry)}
              />
              {isDocumentExpired(vehicle.registrationExpiry) && (
                <Chip label="Vencido" color="error" size="small" />
              )}
              {isDocumentExpiring(vehicle.registrationExpiry) && (
                <Chip label="Por vencer" color="warning" size="small" />
              )}
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Revisión Técnica"
                secondary={formatDate(vehicle.technicalReviewExpiry)}
              />
              {isDocumentExpired(vehicle.technicalReviewExpiry) && (
                <Chip label="Vencido" color="error" size="small" />
              )}
              {isDocumentExpiring(vehicle.technicalReviewExpiry) && (
                <Chip label="Por vencer" color="warning" size="small" />
              )}
            </ListItem>
          </List>
        </Paper>
      </Grid>

      {/* Estadísticas de Costos */}
      {vehicle.stats && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Estadísticas de Costos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <MaintenanceIcon color="warning" />
                    <Typography variant="h6">{formatCurrency(vehicle.stats.totalMaintenanceCost)}</Typography>
                    <Typography variant="body2" color="text.secondary">Mantenimientos</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <FuelIcon color="info" />
                    <Typography variant="h6">{formatCurrency(vehicle.stats.totalFuelCost)}</Typography>
                    <Typography variant="body2" color="text.secondary">Combustible</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{formatCurrency(vehicle.stats.totalCost)}</Typography>
                    <Typography variant="body2" color="text.secondary">Costo Total</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{vehicle.stats.avgConsumption || '-'} km/L</Typography>
                    <Typography variant="body2" color="text.secondary">Consumo Promedio</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  const renderAssignmentsTab = () => (
    <Box>
      {vehicle.currentAssignment && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box>
              <Typography variant="subtitle2">Asignación Activa</Typography>
              <Typography variant="body2">
                {vehicle.currentAssignment.employee
                  ? `${vehicle.currentAssignment.employee.firstName} ${vehicle.currentAssignment.employee.lastName}`
                  : vehicle.currentAssignment.project?.name || vehicle.currentAssignment.department?.name}
                {' - Desde: '}{formatDate(vehicle.currentAssignment.startDate)}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => {
                setEndAssignmentData({
                  endDate: new Date().toISOString().split('T')[0],
                  endMileage: vehicle.mileage,
                  notes: '',
                });
                setEndAssignDialog(true);
              }}
            >
              Finalizar
            </Button>
          </Box>
        </Alert>
      )}

      {!vehicle.currentAssignment && vehicle.status === 'AVAILABLE' && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAssignDialog(true)}
          sx={{ mb: 2 }}
        >
          Nueva Asignación
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Asignado a</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Km Inicio</TableCell>
              <TableCell>Km Fin</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicle.assignments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">Sin asignaciones</Typography>
                </TableCell>
              </TableRow>
            ) : (
              vehicle.assignments?.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.assignmentType}</TableCell>
                  <TableCell>
                    {a.employee
                      ? `${a.employee.firstName} ${a.employee.lastName}`
                      : a.project?.name || a.department?.name || '-'}
                  </TableCell>
                  <TableCell>{formatDate(a.startDate)}</TableCell>
                  <TableCell>{formatDate(a.endDate)}</TableCell>
                  <TableCell>{a.startMileage?.toLocaleString()}</TableCell>
                  <TableCell>{a.endMileage?.toLocaleString() || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={a.status}
                      color={a.status === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderMaintenancesTab = () => (
    <Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate(`/fleet/maintenances/new?vehicleId=${id}`)}
        sx={{ mb: 2 }}
      >
        Nuevo Mantenimiento
      </Button>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Km</TableCell>
              <TableCell align="right">Costo</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicle.maintenances?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">Sin mantenimientos</Typography>
                </TableCell>
              </TableRow>
            ) : (
              vehicle.maintenances?.map((m) => (
                <TableRow key={m.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/fleet/maintenances/${m.id}`)}>
                  <TableCell>{m.code}</TableCell>
                  <TableCell>{m.maintenanceType}</TableCell>
                  <TableCell>{m.description?.substring(0, 50)}...</TableCell>
                  <TableCell>{formatDate(m.completedDate || m.scheduledDate)}</TableCell>
                  <TableCell>{m.mileageAtService?.toLocaleString()}</TableCell>
                  <TableCell align="right">{formatCurrency(m.totalCost)}</TableCell>
                  <TableCell>
                    <Chip
                      label={m.status}
                      color={m.status === 'COMPLETED' ? 'success' : m.status === 'IN_PROGRESS' ? 'warning' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderFuelLogsTab = () => (
    <Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate(`/fleet/fuel-logs/new?vehicleId=${id}`)}
        sx={{ mb: 2 }}
      >
        Registrar Combustible
      </Button>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio Unit.</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Km</TableCell>
              <TableCell>Conductor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicle.fuelLogs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">Sin registros de combustible</Typography>
                </TableCell>
              </TableRow>
            ) : (
              vehicle.fuelLogs?.map((f) => (
                <TableRow key={f.id} hover>
                  <TableCell>{f.code}</TableCell>
                  <TableCell>{formatDate(f.fuelDate)}</TableCell>
                  <TableCell>{f.fuelType}</TableCell>
                  <TableCell align="right">{f.quantity} L</TableCell>
                  <TableCell align="right">{formatCurrency(f.unitPrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(f.totalCost)}</TableCell>
                  <TableCell>{f.mileage?.toLocaleString()}</TableCell>
                  <TableCell>
                    {f.driver ? `${f.driver.firstName} ${f.driver.lastName}` : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/fleet')} sx={{ mb: 1 }}>
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            <CarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {vehicle.plate} - {vehicle.brand} {vehicle.model}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={vehicle.code} variant="outlined" />
            <Chip label={statusLabels[vehicle.status]} color={statusColors[vehicle.status]} />
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/fleet/vehicles/${id}/edit`)}
        >
          Editar
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab icon={<CarIcon />} label="Información" iconPosition="start" />
          <Tab icon={<AssignmentIcon />} label="Asignaciones" iconPosition="start" />
          <Tab icon={<MaintenanceIcon />} label="Mantenimientos" iconPosition="start" />
          <Tab icon={<FuelIcon />} label="Combustible" iconPosition="start" />
          <Tab label="Documentos" iconPosition="start" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>{renderInfoTab()}</TabPanel>
      <TabPanel value={tabValue} index={1}>{renderAssignmentsTab()}</TabPanel>
      <TabPanel value={tabValue} index={2}>{renderMaintenancesTab()}</TabPanel>
      <TabPanel value={tabValue} index={3}>{renderFuelLogsTab()}</TabPanel>
      <TabPanel value={tabValue} index={4}>
        <Paper sx={{ p: 2 }}>
          <AttachmentSection
            entityType="vehicle_maintenance"
            entityId={id}
            title="Documentos del Vehículo"
            defaultCategory="DOCUMENT"
            variant="inline"
          />
        </Paper>
      </TabPanel>

      {/* Dialog Nueva Asignación */}
      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Asignación</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Tipo de Asignación"
                value={assignmentData.assignmentType}
                onChange={(e) => setAssignmentData({ ...assignmentData, assignmentType: e.target.value })}
              >
                <option value="EMPLOYEE">Empleado</option>
                <option value="PROJECT">Proyecto</option>
              </TextField>
            </Grid>
            {assignmentData.assignmentType === 'EMPLOYEE' && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Empleado"
                  value={assignmentData.employeeId}
                  onChange={(e) => setAssignmentData({ ...assignmentData, employeeId: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="">Seleccionar...</option>
                  {employees?.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </TextField>
              </Grid>
            )}
            {assignmentData.assignmentType === 'PROJECT' && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Proyecto"
                  value={assignmentData.projectId}
                  onChange={(e) => setAssignmentData({ ...assignmentData, projectId: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="">Seleccionar...</option>
                  {projects?.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.code} - {proj.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Inicio"
                value={assignmentData.startDate}
                onChange={(e) => setAssignmentData({ ...assignmentData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Propósito"
                value={assignmentData.purpose}
                onChange={(e) => setAssignmentData({ ...assignmentData, purpose: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAssign}>Asignar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Finalizar Asignación */}
      <Dialog open={endAssignDialog} onClose={() => setEndAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Finalizar Asignación</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Fin"
                value={endAssignmentData.endDate}
                onChange={(e) => setEndAssignmentData({ ...endAssignmentData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Kilometraje Final"
                value={endAssignmentData.endMileage}
                onChange={(e) => setEndAssignmentData({ ...endAssignmentData, endMileage: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                value={endAssignmentData.notes}
                onChange={(e) => setEndAssignmentData({ ...endAssignmentData, notes: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEndAssignDialog(false)}>Cancelar</Button>
          <Button variant="contained" color="warning" onClick={handleEndAssignment}>Finalizar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleDetail;
