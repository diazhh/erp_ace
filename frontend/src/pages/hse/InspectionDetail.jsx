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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as CompleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Assignment as ProjectIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';

const statusColors = {
  SCHEDULED: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'default',
};

const statusLabels = {
  SCHEDULED: 'Programada',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const typeLabels = {
  WORKPLACE: 'Lugar de Trabajo',
  EQUIPMENT: 'Equipos',
  VEHICLE: 'Vehículos',
  FIRE_SAFETY: 'Seguridad Contra Incendios',
  ELECTRICAL: 'Eléctrica',
  PPE: 'EPP',
  ENVIRONMENTAL: 'Ambiental',
  ERGONOMIC: 'Ergonómica',
  HOUSEKEEPING: 'Orden y Limpieza',
  WAREHOUSE: 'Almacén',
  PROJECT_SITE: 'Sitio de Proyecto',
  OTHER: 'Otra',
};

const resultColors = {
  SATISFACTORY: 'success',
  NEEDS_IMPROVEMENT: 'warning',
  UNSATISFACTORY: 'error',
};

const resultLabels = {
  SATISFACTORY: 'Satisfactorio',
  NEEDS_IMPROVEMENT: 'Necesita Mejoras',
  UNSATISFACTORY: 'No Satisfactorio',
};

const InspectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [completeDialog, setCompleteDialog] = useState(false);
  const [completeData, setCompleteData] = useState({
    result: 'SATISFACTORY',
    findings: '',
    nonConformities: 0,
    recommendations: '',
  });

  useEffect(() => {
    loadInspection();
  }, [id]);

  const loadInspection = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hse/inspections/${id}`);
      setInspection(response.data.data);
    } catch (error) {
      toast.error('Error al cargar la inspección');
      navigate('/hse/inspections');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await api.post(`/hse/inspections/${id}/complete`, completeData);
      toast.success('Inspección completada');
      setCompleteDialog(false);
      loadInspection();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al completar inspección');
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

  if (!inspection) return null;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <IconButton onClick={() => navigate('/hse/inspections')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {inspection.code}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {typeLabels[inspection.inspectionType] || inspection.inspectionType}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={statusLabels[inspection.status] || inspection.status}
            color={statusColors[inspection.status]}
            size="medium"
          />
          {inspection.result && (
            <Chip
              label={resultLabels[inspection.result] || inspection.result}
              color={resultColors[inspection.result]}
              size="medium"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/hse/inspections/${id}/edit`)}
          disabled={inspection.status === 'COMPLETED'}
        >
          Editar
        </Button>
        {['SCHEDULED', 'IN_PROGRESS'].includes(inspection.status) && (
          <Button
            variant="contained"
            color="success"
            startIcon={<CompleteIcon />}
            onClick={() => setCompleteDialog(true)}
          >
            Completar Inspección
          </Button>
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
          <Tab label="Checklist" />
          <Tab label="Resultados" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Main Info */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {inspection.title}
              </Typography>
              {inspection.description && (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {inspection.description}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Fecha Programada
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(inspection.scheduledDate)}
                        {inspection.scheduledTime && ` - ${inspection.scheduledTime}`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {inspection.location && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Ubicación
                        </Typography>
                        <Typography variant="body2">{inspection.location}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Inspector */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Inspector
                </Typography>
                {inspection.inspector ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="action" />
                    <Typography>
                      {inspection.inspector.firstName} {inspection.inspector.lastName}
                    </Typography>
                  </Box>
                ) : (
                  <Typography color="text.secondary">No asignado</Typography>
                )}
              </CardContent>
            </Card>

            {/* Project */}
            {inspection.project && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Proyecto Relacionado
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/projects/${inspection.project.id}`)}
                  >
                    <ProjectIcon color="action" />
                    <Box>
                      <Typography variant="body2">{inspection.project.code}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {inspection.project.name}
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
                      secondary={formatDateTime(inspection.createdAt)}
                    />
                  </ListItem>
                  {inspection.completedAt && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Completada"
                        secondary={formatDateTime(inspection.completedAt)}
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
            Lista de Verificación
          </Typography>
          {inspection.checklistItems && inspection.checklistItems.length > 0 ? (
            <List>
              {inspection.checklistItems.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    {item.checked ? (
                      <CheckIcon color="success" />
                    ) : (
                      <CloseIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.item || item.name || `Item ${index + 1}`}
                    secondary={item.notes}
                  />
                  {item.required && (
                    <Chip label="Requerido" size="small" color="primary" variant="outlined" />
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              No hay items de checklist definidos para esta inspección.
            </Typography>
          )}
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Resultados de la Inspección
          </Typography>
          {inspection.status === 'COMPLETED' ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Resultado General
                </Typography>
                <Chip
                  label={resultLabels[inspection.result] || inspection.result}
                  color={resultColors[inspection.result]}
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  No Conformidades
                </Typography>
                <Typography variant="h4" color={inspection.nonConformities > 0 ? 'error.main' : 'success.main'}>
                  {inspection.nonConformities || 0}
                </Typography>
              </Grid>
              {inspection.findings && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Hallazgos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {inspection.findings}
                  </Typography>
                </Grid>
              )}
              {inspection.recommendations && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Recomendaciones
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {inspection.recommendations}
                  </Typography>
                </Grid>
              )}
            </Grid>
          ) : (
            <Typography color="text.secondary">
              La inspección aún no ha sido completada.
            </Typography>
          )}
        </Paper>
      )}

      {/* Complete Dialog */}
      <Dialog
        open={completeDialog}
        onClose={() => setCompleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Completar Inspección</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Resultado"
                value={completeData.result}
                onChange={(e) =>
                  setCompleteData({ ...completeData, result: e.target.value })
                }
              >
                {Object.entries(resultLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="No Conformidades"
                value={completeData.nonConformities}
                onChange={(e) =>
                  setCompleteData({
                    ...completeData,
                    nonConformities: parseInt(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hallazgos"
                value={completeData.findings}
                onChange={(e) =>
                  setCompleteData({ ...completeData, findings: e.target.value })
                }
                multiline
                rows={3}
                placeholder="Describa los hallazgos de la inspección..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recomendaciones"
                value={completeData.recommendations}
                onChange={(e) =>
                  setCompleteData({ ...completeData, recommendations: e.target.value })
                }
                multiline
                rows={3}
                placeholder="Recomendaciones para mejora..."
              />
            </Grid>
          </Grid>
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

export default InspectionDetail;
