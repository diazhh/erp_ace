import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Warning as NCIcon,
  Build as CAIcon,
  Folder as ProjectIcon,
  FindInPage as InspectionIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { fetchNonConformanceById, clearCurrentNonConformance } from '../../store/slices/qualitySlice';

const statusColors = {
  OPEN: 'error',
  UNDER_ANALYSIS: 'warning',
  ACTION_PENDING: 'info',
  IN_PROGRESS: 'primary',
  VERIFICATION: 'secondary',
  CLOSED: 'success',
  CANCELLED: 'default',
};

const statusLabels = {
  OPEN: 'Abierta',
  UNDER_ANALYSIS: 'En Análisis',
  ACTION_PENDING: 'Acción Pendiente',
  IN_PROGRESS: 'En Progreso',
  VERIFICATION: 'En Verificación',
  CLOSED: 'Cerrada',
  CANCELLED: 'Cancelada',
};

const typeColors = {
  MINOR: 'success',
  MAJOR: 'warning',
  CRITICAL: 'error',
};

const typeLabels = {
  MINOR: 'Menor',
  MAJOR: 'Mayor',
  CRITICAL: 'Crítica',
};

const categoryLabels = {
  MATERIAL: 'Material',
  WORKMANSHIP: 'Mano de Obra',
  DOCUMENTATION: 'Documentación',
  PROCESS: 'Proceso',
  EQUIPMENT: 'Equipo',
  DESIGN: 'Diseño',
  OTHER: 'Otro',
};

const dispositionLabels = {
  USE_AS_IS: 'Usar como está',
  REWORK: 'Retrabajo',
  REPAIR: 'Reparar',
  SCRAP: 'Desechar',
  RETURN: 'Devolver',
  DOWNGRADE: 'Degradar',
};

const caStatusLabels = {
  PLANNED: 'Planificada',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completada',
  VERIFIED: 'Verificada',
  EFFECTIVE: 'Efectiva',
  NOT_EFFECTIVE: 'No Efectiva',
  CANCELLED: 'Cancelada',
};

const caTypeLabels = {
  CORRECTION: 'Corrección',
  CORRECTIVE: 'Correctiva',
  PREVENTIVE: 'Preventiva',
};

const NonConformanceDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentNonConformance, loading, error } = useSelector((state) => state.quality);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchNonConformanceById(id));
    return () => {
      dispatch(clearCurrentNonConformance());
    };
  }, [dispatch, id]);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading || !currentNonConformance) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderInfoTab = () => (
    <Grid container spacing={3}>
      {/* Información General */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <NCIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Información General
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={4}><Typography color="text.secondary">Código:</Typography></Grid>
              <Grid item xs={8}><Typography fontWeight="bold">{currentNonConformance.code}</Typography></Grid>

              <Grid item xs={4}><Typography color="text.secondary">Título:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentNonConformance.title}</Typography></Grid>

              <Grid item xs={4}><Typography color="text.secondary">Tipo:</Typography></Grid>
              <Grid item xs={8}>
                <Chip
                  label={typeLabels[currentNonConformance.ncType]}
                  color={typeColors[currentNonConformance.ncType]}
                  size="small"
                />
              </Grid>

              <Grid item xs={4}><Typography color="text.secondary">Categoría:</Typography></Grid>
              <Grid item xs={8}>
                <Typography>{categoryLabels[currentNonConformance.category] || currentNonConformance.category}</Typography>
              </Grid>

              <Grid item xs={4}><Typography color="text.secondary">Estado:</Typography></Grid>
              <Grid item xs={8}>
                <Chip
                  label={statusLabels[currentNonConformance.status]}
                  color={statusColors[currentNonConformance.status]}
                  size="small"
                />
              </Grid>

              <Grid item xs={4}><Typography color="text.secondary">Disposición:</Typography></Grid>
              <Grid item xs={8}>
                <Typography>
                  {currentNonConformance.disposition
                    ? dispositionLabels[currentNonConformance.disposition]
                    : '-'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Fechas y Costos */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Fechas y Costos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={5}><Typography color="text.secondary">Detectada:</Typography></Grid>
              <Grid item xs={7}><Typography>{formatDate(currentNonConformance.detectedDate)}</Typography></Grid>

              <Grid item xs={5}><Typography color="text.secondary">Fecha Límite:</Typography></Grid>
              <Grid item xs={7}>
                <Typography
                  color={currentNonConformance.dueDate && new Date(currentNonConformance.dueDate) < new Date() ? 'error.main' : 'inherit'}
                >
                  {formatDate(currentNonConformance.dueDate)}
                </Typography>
              </Grid>

              {currentNonConformance.closedDate && (
                <>
                  <Grid item xs={5}><Typography color="text.secondary">Cerrada:</Typography></Grid>
                  <Grid item xs={7}><Typography>{formatDate(currentNonConformance.closedDate)}</Typography></Grid>
                </>
              )}

              <Grid item xs={5}><Typography color="text.secondary">Costo Estimado:</Typography></Grid>
              <Grid item xs={7}><Typography>{formatCurrency(currentNonConformance.estimatedCost)}</Typography></Grid>

              <Grid item xs={5}><Typography color="text.secondary">Costo Real:</Typography></Grid>
              <Grid item xs={7}><Typography>{formatCurrency(currentNonConformance.actualCost)}</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Proyecto e Inspección */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <ProjectIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Proyecto e Inspección
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {currentNonConformance.project && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Proyecto:</Typography></Grid>
                  <Grid item xs={8}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/projects/${currentNonConformance.project.id}`)}
                    >
                      {currentNonConformance.project.code} - {currentNonConformance.project.name}
                    </Button>
                  </Grid>
                </>
              )}

              {currentNonConformance.inspection && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Inspección:</Typography></Grid>
                  <Grid item xs={8}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/quality/inspections/${currentNonConformance.inspection.id}`)}
                    >
                      {currentNonConformance.inspection.code}
                    </Button>
                  </Grid>
                </>
              )}

              <Grid item xs={4}><Typography color="text.secondary">Ubicación:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentNonConformance.location || '-'}</Typography></Grid>

              <Grid item xs={4}><Typography color="text.secondary">Elemento:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentNonConformance.affectedItem || '-'}</Typography></Grid>

              <Grid item xs={4}><Typography color="text.secondary">Requisito:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentNonConformance.requirementReference || '-'}</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Responsables */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Responsables
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {currentNonConformance.detectedBy && (
                <>
                  <Grid item xs={5}><Typography color="text.secondary">Detectada por:</Typography></Grid>
                  <Grid item xs={7}>
                    <Typography>
                      {currentNonConformance.detectedBy.firstName} {currentNonConformance.detectedBy.lastName}
                    </Typography>
                  </Grid>
                </>
              )}

              {currentNonConformance.responsible && (
                <>
                  <Grid item xs={5}><Typography color="text.secondary">Responsable:</Typography></Grid>
                  <Grid item xs={7}>
                    <Typography>
                      {currentNonConformance.responsible.firstName} {currentNonConformance.responsible.lastName}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Descripción */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Descripción y Acciones
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography color="text.secondary" gutterBottom>Descripción:</Typography>
              <Typography>{currentNonConformance.description}</Typography>
            </Box>
            {currentNonConformance.immediateAction && (
              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" gutterBottom>Acción Inmediata:</Typography>
                <Typography>{currentNonConformance.immediateAction}</Typography>
              </Box>
            )}
            {currentNonConformance.rootCauseAnalysis && (
              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" gutterBottom>
                  Análisis de Causa Raíz ({currentNonConformance.rootCauseMethod || 'N/A'}):
                </Typography>
                <Typography>{currentNonConformance.rootCauseAnalysis}</Typography>
              </Box>
            )}
            {currentNonConformance.notes && (
              <Box>
                <Typography color="text.secondary" gutterBottom>Notas:</Typography>
                <Typography>{currentNonConformance.notes}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCorrectiveActionsTab = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Responsable</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha Límite</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentNonConformance.correctiveActions?.length > 0 ? (
            currentNonConformance.correctiveActions.map((ca) => (
              <TableRow key={ca.id}>
                <TableCell>{ca.code}</TableCell>
                <TableCell>{caTypeLabels[ca.actionType] || ca.actionType}</TableCell>
                <TableCell>{ca.description}</TableCell>
                <TableCell>
                  {ca.responsible
                    ? `${ca.responsible.firstName} ${ca.responsible.lastName}`
                    : '-'}
                </TableCell>
                <TableCell>
                  <Chip label={caStatusLabels[ca.status]} size="small" />
                </TableCell>
                <TableCell>{formatDate(ca.dueDate)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No hay acciones correctivas registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/quality/non-conformances')}>
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            <NCIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {currentNonConformance.code}
          </Typography>
          <Chip
            label={typeLabels[currentNonConformance.ncType]}
            color={typeColors[currentNonConformance.ncType]}
          />
          <Chip
            label={statusLabels[currentNonConformance.status]}
            color={statusColors[currentNonConformance.status]}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/quality/non-conformances/${id}/edit`)}
        >
          Editar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Información" />
          <Tab label={`Acciones Correctivas (${currentNonConformance.correctiveActions?.length || 0})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && renderInfoTab()}
      {activeTab === 1 && renderCorrectiveActionsTab()}
    </Box>
  );
};

export default NonConformanceDetail;
