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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  FindInPage as InspectionIcon,
  Assignment as PlanIcon,
  Warning as NCIcon,
  Folder as ProjectIcon,
} from '@mui/icons-material';
import { fetchInspectionById, clearCurrentInspection } from '../../store/slices/qualitySlice';

const resultColors = {
  PENDING: 'default',
  PASS: 'success',
  FAIL: 'error',
  CONDITIONAL: 'warning',
};

const resultLabels = {
  PENDING: 'Pendiente',
  PASS: 'Aprobada',
  FAIL: 'Fallida',
  CONDITIONAL: 'Condicional',
};

const typeLabels = {
  RECEIVING: 'Recepción',
  IN_PROCESS: 'En Proceso',
  FINAL: 'Final',
  DIMENSIONAL: 'Dimensional',
  VISUAL: 'Visual',
  FUNCTIONAL: 'Funcional',
  DESTRUCTIVE: 'Destructiva',
  NON_DESTRUCTIVE: 'No Destructiva',
};

const ncStatusLabels = {
  OPEN: 'Abierta',
  UNDER_ANALYSIS: 'En Análisis',
  ACTION_PENDING: 'Acción Pendiente',
  IN_PROGRESS: 'En Progreso',
  VERIFICATION: 'En Verificación',
  CLOSED: 'Cerrada',
  CANCELLED: 'Cancelada',
};

const ncTypeColors = {
  MINOR: 'success',
  MAJOR: 'warning',
  CRITICAL: 'error',
};

const ncTypeLabels = {
  MINOR: 'Menor',
  MAJOR: 'Mayor',
  CRITICAL: 'Crítica',
};

const InspectionDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentInspection, loading, error } = useSelector((state) => state.quality);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchInspectionById(id));
    return () => {
      dispatch(clearCurrentInspection());
    };
  }, [dispatch, id]);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  if (loading || !currentInspection) {
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
              <InspectionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Información General
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={4}><Typography color="text.secondary">Código:</Typography></Grid>
              <Grid item xs={8}><Typography fontWeight="bold">{currentInspection.code}</Typography></Grid>

              <Grid item xs={4}><Typography color="text.secondary">Título:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentInspection.title}</Typography></Grid>

              <Grid item xs={4}><Typography color="text.secondary">Tipo:</Typography></Grid>
              <Grid item xs={8}>
                <Typography>{typeLabels[currentInspection.inspectionType] || currentInspection.inspectionType}</Typography>
              </Grid>

              <Grid item xs={4}><Typography color="text.secondary">Resultado:</Typography></Grid>
              <Grid item xs={8}>
                <Chip
                  label={resultLabels[currentInspection.result]}
                  color={resultColors[currentInspection.result]}
                  size="small"
                />
              </Grid>

              <Grid item xs={4}><Typography color="text.secondary">Fecha:</Typography></Grid>
              <Grid item xs={8}><Typography>{formatDate(currentInspection.inspectionDate)}</Typography></Grid>

              <Grid item xs={4}><Typography color="text.secondary">Ubicación:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentInspection.location || '-'}</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Proyecto y Plan */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <ProjectIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Proyecto y Plan
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {currentInspection.project && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Proyecto:</Typography></Grid>
                  <Grid item xs={8}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/projects/${currentInspection.project.id}`)}
                    >
                      {currentInspection.project.code} - {currentInspection.project.name}
                    </Button>
                  </Grid>
                </>
              )}

              {currentInspection.qualityPlan && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Plan de Calidad:</Typography></Grid>
                  <Grid item xs={8}>
                    <Typography>{currentInspection.qualityPlan.code} - {currentInspection.qualityPlan.title}</Typography>
                  </Grid>
                </>
              )}

              {currentInspection.inspector && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Inspector:</Typography></Grid>
                  <Grid item xs={8}>
                    <Typography>
                      {currentInspection.inspector.firstName} {currentInspection.inspector.lastName}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Detalles de Inspección */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Detalles de Inspección
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={5}><Typography color="text.secondary">Elemento:</Typography></Grid>
              <Grid item xs={7}><Typography>{currentInspection.itemInspected || '-'}</Typography></Grid>

              <Grid item xs={5}><Typography color="text.secondary">Especificación:</Typography></Grid>
              <Grid item xs={7}><Typography>{currentInspection.specification || '-'}</Typography></Grid>

              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography color="text.secondary" gutterBottom>Criterios de Aceptación:</Typography>
                <Typography>{currentInspection.acceptanceCriteria || '-'}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Hallazgos y Recomendaciones */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Hallazgos y Recomendaciones
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {currentInspection.findings && (
              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" gutterBottom>Hallazgos:</Typography>
                <Typography>{currentInspection.findings}</Typography>
              </Box>
            )}
            {currentInspection.recommendations && (
              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" gutterBottom>Recomendaciones:</Typography>
                <Typography>{currentInspection.recommendations}</Typography>
              </Box>
            )}
            {currentInspection.notes && (
              <Box>
                <Typography color="text.secondary" gutterBottom>Notas:</Typography>
                <Typography>{currentInspection.notes}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderNCsTab = () => (
    currentInspection.nonConformances?.length === 0 ? (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No hay no conformidades registradas para esta inspección</Typography>
      </Paper>
    ) : isMobile ? (
      <Box>
        {currentInspection.nonConformances?.map((nc) => (
          <Card key={nc.id} variant="outlined" sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/quality/non-conformances/${nc.id}`)}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">{nc.code}</Typography>
                  <Typography variant="body2">{nc.title}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
                  <Chip label={ncTypeLabels[nc.ncType]} color={ncTypeColors[nc.ncType]} size="small" />
                  <Chip label={ncStatusLabels[nc.status]} size="small" variant="outlined" />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Detectada: {formatDate(nc.detectedDate)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Detectada</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentInspection.nonConformances?.map((nc) => (
              <TableRow key={nc.id}>
                <TableCell>{nc.code}</TableCell>
                <TableCell>{nc.title}</TableCell>
                <TableCell>
                  <Chip label={ncTypeLabels[nc.ncType]} color={ncTypeColors[nc.ncType]} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={ncStatusLabels[nc.status]} size="small" />
                </TableCell>
                <TableCell>{formatDate(nc.detectedDate)}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => navigate(`/quality/non-conformances/${nc.id}`)}>
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/quality/inspections')}>
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            <InspectionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {currentInspection.code}
          </Typography>
          <Chip
            label={resultLabels[currentInspection.result]}
            color={resultColors[currentInspection.result]}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/quality/inspections/${id}/edit`)}
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
          <Tab label={`No Conformidades (${currentInspection.nonConformances?.length || 0})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && renderInfoTab()}
      {activeTab === 1 && renderNCsTab()}
    </Box>
  );
};

export default InspectionDetail;
