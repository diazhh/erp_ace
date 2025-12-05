import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as CompleteIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Assignment as ProjectIcon,
  School as TrainingIcon,
  Link as LinkIcon,
  PersonAdd as AddAttendeeIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import api from '../../services/api';

const statusColors = {
  SCHEDULED: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'default',
  POSTPONED: 'secondary',
};

const statusLabels = {
  SCHEDULED: 'Programada',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  POSTPONED: 'Pospuesta',
};

const typeLabels = {
  INDUCTION: 'Inducción',
  SAFETY: 'Seguridad General',
  FIRE_SAFETY: 'Seguridad Contra Incendios',
  FIRST_AID: 'Primeros Auxilios',
  PPE: 'Uso de EPP',
  HAZMAT: 'Materiales Peligrosos',
  HEIGHTS: 'Trabajo en Alturas',
  CONFINED_SPACES: 'Espacios Confinados',
  ELECTRICAL: 'Seguridad Eléctrica',
  ERGONOMICS: 'Ergonomía',
  ENVIRONMENTAL: 'Ambiental',
  DEFENSIVE_DRIVING: 'Manejo Defensivo',
  EQUIPMENT_OPERATION: 'Operación de Equipos',
  EMERGENCY_RESPONSE: 'Respuesta a Emergencias',
  OTHER: 'Otra',
};

const attendanceStatusColors = {
  REGISTERED: 'default',
  ATTENDED: 'success',
  ABSENT: 'error',
  PASSED: 'success',
  FAILED: 'error',
};

const attendanceStatusLabels = {
  REGISTERED: 'Registrado',
  ATTENDED: 'Asistió',
  ABSENT: 'Ausente',
  PASSED: 'Aprobado',
  FAILED: 'Reprobado',
};

const TrainingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { employees } = useSelector((state) => state.employees);

  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [attendanceDialog, setAttendanceDialog] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [completeDialog, setCompleteDialog] = useState(false);

  useEffect(() => {
    loadTraining();
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
  }, [id, dispatch]);

  const loadTraining = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hse/trainings/${id}`);
      setTraining(response.data.data);
    } catch (error) {
      toast.error('Error al cargar la capacitación');
      navigate('/hse/trainings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendees = async () => {
    if (selectedEmployees.length === 0) {
      toast.error('Seleccione al menos un empleado');
      return;
    }
    try {
      await api.post(`/hse/trainings/${id}/attendances`, {
        employeeIds: selectedEmployees,
      });
      toast.success('Participantes agregados');
      setAttendanceDialog(false);
      setSelectedEmployees([]);
      loadTraining();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al agregar participantes');
    }
  };

  const handleUpdateAttendance = async (attendanceId, status, score = null) => {
    try {
      await api.put(`/hse/trainings/${id}/attendances/${attendanceId}`, {
        status,
        score,
      });
      toast.success('Asistencia actualizada');
      loadTraining();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar asistencia');
    }
  };

  const handleComplete = async () => {
    try {
      await api.post(`/hse/trainings/${id}/complete`);
      toast.success('Capacitación completada');
      setCompleteDialog(false);
      loadTraining();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al completar capacitación');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
    }).format(amount || 0);
  };

  // Get employees not already registered
  const availableEmployees = employees?.filter(
    (emp) => !training?.attendances?.some((att) => att.employeeId === emp.id)
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!training) return null;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <IconButton onClick={() => navigate('/hse/trainings')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {training.code}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {typeLabels[training.trainingType] || training.trainingType}
          </Typography>
        </Box>
        <Chip
          label={statusLabels[training.status] || training.status}
          color={statusColors[training.status]}
          size="medium"
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/hse/trainings/${id}/edit`)}
          disabled={training.status === 'COMPLETED'}
        >
          Editar
        </Button>
        {['SCHEDULED', 'IN_PROGRESS'].includes(training.status) && (
          <>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddAttendeeIcon />}
              onClick={() => setAttendanceDialog(true)}
            >
              Agregar Participantes
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CompleteIcon />}
              onClick={() => setCompleteDialog(true)}
            >
              Completar
            </Button>
          </>
        )}
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab label="Información General" />
          <Tab label={`Participantes (${training.attendances?.length || 0})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Main Info */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {training.title}
              </Typography>
              {training.description && (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {training.description}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Fecha y Hora
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(training.scheduledDate)}
                        {training.startTime && ` - ${training.startTime}`}
                        {training.endTime && ` a ${training.endTime}`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {training.isOnline ? <LinkIcon color="action" /> : <LocationIcon color="action" />}
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {training.isOnline ? 'Enlace' : 'Ubicación'}
                      </Typography>
                      <Typography variant="body2">
                        {training.isOnline ? (
                          <a href={training.onlineLink} target="_blank" rel="noopener noreferrer">
                            {training.onlineLink || 'Sin enlace'}
                          </a>
                        ) : (
                          training.location || '-'
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {(training.objectives || training.content) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    {training.objectives && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                          Objetivos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {training.objectives}
                        </Typography>
                      </Grid>
                    )}
                    {training.content && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                          Contenido
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {training.content}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
            </Paper>

            {/* Evaluation & Certification */}
            {(training.hasEvaluation || training.hasCertificate) && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Evaluación y Certificación
                </Typography>
                <Grid container spacing={2}>
                  {training.hasEvaluation && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Puntuación mínima
                      </Typography>
                      <Typography variant="body1">{training.passingScore}%</Typography>
                    </Grid>
                  )}
                  {training.hasCertificate && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Validez del certificado
                      </Typography>
                      <Typography variant="body1">
                        {training.certificateValidityMonths} meses
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Instructor */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Instructor
                </Typography>
                {training.instructor ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="action" />
                    <Box>
                      <Typography>
                        {training.instructor.firstName} {training.instructor.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Interno
                      </Typography>
                    </Box>
                  </Box>
                ) : training.externalInstructor ? (
                  <Box>
                    <Typography>{training.externalInstructor}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Externo {training.provider && `- ${training.provider}`}
                    </Typography>
                  </Box>
                ) : (
                  <Typography color="text.secondary">No asignado</Typography>
                )}
              </CardContent>
            </Card>

            {/* Details */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Detalles
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Duración"
                      secondary={training.durationHours ? `${training.durationHours} horas` : '-'}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Máx. Participantes"
                      secondary={training.maxParticipants || 'Sin límite'}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Costo"
                      secondary={formatCurrency(training.cost, training.currency)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Project */}
            {training.project && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Proyecto
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                    onClick={() => navigate(`/projects/${training.project.id}`)}
                  >
                    <ProjectIcon color="action" />
                    <Box>
                      <Typography variant="body2">{training.project.code}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {training.project.name}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Historial
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Creada"
                      secondary={formatDateTime(training.createdAt)}
                    />
                  </ListItem>
                  {training.completedAt && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Completada"
                        secondary={formatDateTime(training.completedAt)}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Participantes
            </Typography>
            {training.status !== 'COMPLETED' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddAttendeeIcon />}
                onClick={() => setAttendanceDialog(true)}
              >
                Agregar
              </Button>
            )}
          </Box>

          {training.attendances && training.attendances.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Empleado</TableCell>
                    <TableCell>Estado</TableCell>
                    {training.hasEvaluation && <TableCell>Puntuación</TableCell>}
                    {training.status !== 'COMPLETED' && <TableCell align="right">Acciones</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {training.attendances.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell>
                        {attendance.employee
                          ? `${attendance.employee.firstName} ${attendance.employee.lastName}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={attendanceStatusLabels[attendance.status] || attendance.status}
                          color={attendanceStatusColors[attendance.status]}
                          size="small"
                        />
                      </TableCell>
                      {training.hasEvaluation && (
                        <TableCell>{attendance.score !== null ? `${attendance.score}%` : '-'}</TableCell>
                      )}
                      {training.status !== 'COMPLETED' && (
                        <TableCell align="right">
                          <Button
                            size="small"
                            onClick={() => handleUpdateAttendance(attendance.id, 'ATTENDED')}
                            disabled={attendance.status === 'ATTENDED'}
                          >
                            Asistió
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleUpdateAttendance(attendance.id, 'ABSENT')}
                            disabled={attendance.status === 'ABSENT'}
                          >
                            Ausente
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No hay participantes registrados
            </Typography>
          )}
        </Paper>
      )}

      {/* Add Attendees Dialog */}
      <Dialog
        open={attendanceDialog}
        onClose={() => setAttendanceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Agregar Participantes</DialogTitle>
        <DialogContent>
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {availableEmployees?.map((emp) => (
              <ListItem
                key={emp.id}
                button
                onClick={() => {
                  setSelectedEmployees((prev) =>
                    prev.includes(emp.id)
                      ? prev.filter((id) => id !== emp.id)
                      : [...prev, emp.id]
                  );
                }}
              >
                <ListItemIcon>
                  <Checkbox checked={selectedEmployees.includes(emp.id)} />
                </ListItemIcon>
                <ListItemText
                  primary={`${emp.firstName} ${emp.lastName}`}
                  secondary={emp.employeeCode}
                />
              </ListItem>
            ))}
          </List>
          {availableEmployees?.length === 0 && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Todos los empleados ya están registrados
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendanceDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleAddAttendees}
            variant="contained"
            disabled={selectedEmployees.length === 0}
          >
            Agregar ({selectedEmployees.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={completeDialog} onClose={() => setCompleteDialog(false)}>
        <DialogTitle>Completar Capacitación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de marcar esta capacitación como completada?
          </Typography>
          {training.attendances?.some((a) => a.status === 'REGISTERED') && (
            <Typography color="warning.main" sx={{ mt: 2 }}>
              Hay participantes sin marcar asistencia.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleComplete} variant="contained" color="success">
            Completar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainingDetail;
