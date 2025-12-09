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
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Search as InvestigateIcon,
  CheckCircle as CloseIcon,
  Warning as IncidentIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Assignment as ProjectIcon,
  DirectionsCar as VehicleIcon,
  LocalHospital as MedicalIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AttachmentSection from '../../components/common/AttachmentSection';
import ResponsiveTabs from '../../components/common/ResponsiveTabs';

const severityColors = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'error',
  CRITICAL: 'secondary',
};

const severityLabels = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

const statusColors = {
  REPORTED: 'warning',
  INVESTIGATING: 'info',
  PENDING_ACTIONS: 'primary',
  IN_PROGRESS: 'info',
  CLOSED: 'success',
  CANCELLED: 'default',
};

const statusLabels = {
  REPORTED: 'Reportado',
  INVESTIGATING: 'En Investigación',
  PENDING_ACTIONS: 'Acciones Pendientes',
  IN_PROGRESS: 'En Progreso',
  CLOSED: 'Cerrado',
  CANCELLED: 'Cancelado',
};

const typeLabels = {
  NEAR_MISS: 'Casi Accidente',
  ACCIDENT: 'Accidente',
  INJURY: 'Lesión',
  ILLNESS: 'Enfermedad',
  PROPERTY_DAMAGE: 'Daño a Propiedad',
  ENVIRONMENTAL: 'Ambiental',
  FIRE: 'Incendio',
  SPILL: 'Derrame',
  OTHER: 'Otro',
};

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [closeDialog, setCloseDialog] = useState(false);
  const [closureNotes, setClosureNotes] = useState('');

  useEffect(() => {
    loadIncident();
  }, [id]);

  const loadIncident = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hse/incidents/${id}`);
      setIncident(response.data.data);
    } catch (error) {
      toast.error('Error al cargar el incidente');
      navigate('/hse/incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleInvestigate = async () => {
    if (!window.confirm('¿Iniciar investigación de este incidente?')) return;
    try {
      await api.post(`/hse/incidents/${id}/investigate`);
      toast.success('Investigación iniciada');
      loadIncident();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar investigación');
    }
  };

  const handleClose = async () => {
    if (!closureNotes.trim()) {
      toast.error('Ingrese las notas de cierre');
      return;
    }
    try {
      await api.post(`/hse/incidents/${id}/close`, { closureNotes });
      toast.success('Incidente cerrado');
      setCloseDialog(false);
      loadIncident();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al cerrar incidente');
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!incident) return null;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <IconButton onClick={() => navigate('/hse/incidents')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {incident.code}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {typeLabels[incident.incidentType] || incident.incidentType}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={severityLabels[incident.severity] || incident.severity}
            color={severityColors[incident.severity]}
            size="medium"
          />
          <Chip
            label={statusLabels[incident.status] || incident.status}
            color={statusColors[incident.status]}
            size="medium"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/hse/incidents/${id}/edit`)}
          disabled={incident.status === 'CLOSED'}
        >
          Editar
        </Button>
        {incident.status === 'REPORTED' && (
          <Button
            variant="contained"
            color="info"
            startIcon={<InvestigateIcon />}
            onClick={handleInvestigate}
          >
            Iniciar Investigación
          </Button>
        )}
        {['INVESTIGATING', 'PENDING_ACTIONS', 'IN_PROGRESS'].includes(incident.status) && (
          <Button
            variant="contained"
            color="success"
            startIcon={<CloseIcon />}
            onClick={() => setCloseDialog(true)}
          >
            Cerrar Incidente
          </Button>
        )}
      </Box>

      {/* Tabs */}
      <Paper sx={{ p: isMobile ? 2 : 0, mb: 3 }}>
        <ResponsiveTabs
          tabs={[
            { label: 'Información General' },
            { label: 'Investigación' },
            { label: 'Acciones' },
            { label: 'Fotos/Archivos' },
          ]}
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          ariaLabel="incident-tabs"
        />
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Main Info */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {incident.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {incident.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Fecha del Incidente
                      </Typography>
                      <Typography variant="body2">
                        {formatDateTime(incident.incidentDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Ubicación
                      </Typography>
                      <Typography variant="body2">
                        {incident.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {incident.immediateActions && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Acciones Inmediatas Tomadas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {incident.immediateActions}
                  </Typography>
                </>
              )}

              {incident.witnesses && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Testigos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {incident.witnesses}
                  </Typography>
                </>
              )}
            </Paper>

            {/* Injury Details */}
            {(incident.injuryType || incident.bodyPartAffected || incident.medicalAttention) && (
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <MedicalIcon color="error" />
                  <Typography variant="h6" fontWeight="bold">
                    Detalles de Lesión
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {incident.injuryType && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Tipo de Lesión
                      </Typography>
                      <Typography variant="body2">{incident.injuryType}</Typography>
                    </Grid>
                  )}
                  {incident.bodyPartAffected && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Parte del Cuerpo Afectada
                      </Typography>
                      <Typography variant="body2">{incident.bodyPartAffected}</Typography>
                    </Grid>
                  )}
                  {incident.daysLost > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Días Perdidos
                      </Typography>
                      <Typography variant="body2">{incident.daysLost}</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Atención Médica
                    </Typography>
                    <Typography variant="body2">
                      {incident.medicalAttention ? 'Sí' : 'No'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* People Involved */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Personas Involucradas
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Reportado por"
                      secondary={
                        incident.reportedBy
                          ? `${incident.reportedBy.firstName} ${incident.reportedBy.lastName}`
                          : '-'
                      }
                    />
                  </ListItem>
                  {incident.affectedEmployee && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Empleado Afectado"
                        secondary={`${incident.affectedEmployee.firstName} ${incident.affectedEmployee.lastName}`}
                      />
                    </ListItem>
                  )}
                  {incident.investigatedBy && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Investigado por"
                        secondary={`${incident.investigatedBy.firstName} ${incident.investigatedBy.lastName}`}
                      />
                    </ListItem>
                  )}
                  {incident.closedBy && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Cerrado por"
                        secondary={`${incident.closedBy.firstName} ${incident.closedBy.lastName}`}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Related Entities */}
            {(incident.project || incident.vehicle) && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Entidades Relacionadas
                  </Typography>
                  <List dense disablePadding>
                    {incident.project && (
                      <ListItem
                        disableGutters
                        button
                        onClick={() => navigate(`/projects/${incident.project.id}`)}
                      >
                        <ProjectIcon sx={{ mr: 1 }} color="action" />
                        <ListItemText
                          primary="Proyecto"
                          secondary={`${incident.project.code} - ${incident.project.name}`}
                        />
                      </ListItem>
                    )}
                    {incident.vehicle && (
                      <ListItem
                        disableGutters
                        button
                        onClick={() => navigate(`/fleet/vehicles/${incident.vehicle.id}`)}
                      >
                        <VehicleIcon sx={{ mr: 1 }} color="action" />
                        <ListItemText
                          primary="Vehículo"
                          secondary={`${incident.vehicle.plate} - ${incident.vehicle.brand} ${incident.vehicle.model}`}
                        />
                      </ListItem>
                    )}
                  </List>
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
                      primary="Creado"
                      secondary={formatDateTime(incident.createdAt)}
                    />
                  </ListItem>
                  {incident.investigationDate && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Investigación Iniciada"
                        secondary={formatDateTime(incident.investigationDate)}
                      />
                    </ListItem>
                  )}
                  {incident.closedAt && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Cerrado"
                        secondary={formatDateTime(incident.closedAt)}
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
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Investigación
          </Typography>
          {incident.status === 'REPORTED' ? (
            <Typography color="text.secondary">
              La investigación aún no ha sido iniciada.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Causa Raíz
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {incident.rootCause || 'No especificada'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Factores Contribuyentes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {incident.contributingFactors || 'No especificados'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Hallazgos de la Investigación
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {incident.investigationFindings || 'Sin hallazgos registrados'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Acciones Correctivas
          </Typography>
          {incident.correctiveActions ? (
            <Typography variant="body2">{incident.correctiveActions}</Typography>
          ) : (
            <Typography color="text.secondary">
              No hay acciones correctivas registradas.
            </Typography>
          )}

          {incident.preventiveActions && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Acciones Preventivas
              </Typography>
              <Typography variant="body2">{incident.preventiveActions}</Typography>
            </>
          )}

          {incident.closureNotes && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Notas de Cierre
              </Typography>
              <Typography variant="body2">{incident.closureNotes}</Typography>
            </>
          )}
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <AttachmentSection
            entityType="incident"
            entityId={id}
            title="Fotos y Evidencias del Incidente"
            defaultCategory="EVIDENCE"
            variant="inline"
          />
        </Paper>
      )}

      {/* Close Dialog */}
      <Dialog open={closeDialog} onClose={() => setCloseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cerrar Incidente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notas de Cierre"
            fullWidth
            multiline
            rows={4}
            value={closureNotes}
            onChange={(e) => setClosureNotes(e.target.value)}
            placeholder="Describa las conclusiones y acciones tomadas..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseDialog(false)}>Cancelar</Button>
          <Button onClick={handleClose} variant="contained" color="success">
            Cerrar Incidente
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncidentDetail;
