import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Assignment as PlanIcon,
  Search as InspectionIcon,
  Warning as NCIcon,
  Build as CAIcon,
  VerifiedUser as CertIcon,
  Add as AddIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { fetchQualityStats, fetchNonConformances, fetchInspections } from '../../store/slices/qualitySlice';

const ncTypeLabels = {
  MINOR: 'Menor',
  MAJOR: 'Mayor',
  CRITICAL: 'Crítica',
};

const ncTypeColors = {
  MINOR: '#4caf50',
  MAJOR: '#ff9800',
  CRITICAL: '#f44336',
};

const QualityDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { stats, nonConformances, inspections, loading, error } = useSelector((state) => state.quality);

  useEffect(() => {
    dispatch(fetchQualityStats());
    dispatch(fetchNonConformances({ limit: 5 }));
    dispatch(fetchInspections({ limit: 5 }));
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Control de Calidad - Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/quality/inspections/new')}>
            Nueva Inspección
          </Button>
          <Button variant="contained" color="warning" startIcon={<AddIcon />} onClick={() => navigate('/quality/non-conformances/new')}>
            Nueva NC
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlanIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats?.totalPlans || 0}</Typography>
                  <Typography variant="body2">Planes</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats?.activePlans || 0} activos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InspectionIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats?.totalInspections || 0}</Typography>
                  <Typography variant="body2">Inspecciones</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats?.inspectionPassRate || 0}% aprobadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NCIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats?.totalNCs || 0}</Typography>
                  <Typography variant="body2">No Conformidades</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats?.openNCs || 0} abiertas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CAIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats?.totalCAs || 0}</Typography>
                  <Typography variant="body2">Acciones Correctivas</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats?.pendingCAs || 0} pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CertIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats?.totalCertificates || 0}</Typography>
                  <Typography variant="body2">Certificados</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tasa de Aprobación */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tasa de Aprobación de Inspecciones
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={parseFloat(stats?.inspectionPassRate) || 0}
              sx={{ height: 20, borderRadius: 2 }}
              color={parseFloat(stats?.inspectionPassRate) >= 80 ? 'success' : parseFloat(stats?.inspectionPassRate) >= 60 ? 'warning' : 'error'}
            />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            {stats?.inspectionPassRate || 0}%
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
          <Typography variant="body2" color="success.main">
            Aprobadas: {stats?.passedInspections || 0}
          </Typography>
          <Typography variant="body2" color="error.main">
            Fallidas: {stats?.failedInspections || 0}
          </Typography>
        </Box>
      </Paper>

      {/* NC por Tipo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              No Conformidades por Tipo
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats?.ncsByType?.map((nc) => (
              <Box key={nc.ncType} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 100 }}>
                  <Typography variant="body2">{ncTypeLabels[nc.ncType] || nc.ncType}</Typography>
                </Box>
                <Box sx={{ flexGrow: 1, mx: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(nc.count / (stats?.totalNCs || 1)) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 1,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': { bgcolor: ncTypeColors[nc.ncType] },
                    }}
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold" sx={{ width: 30 }}>
                  {nc.count}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              No Conformidades por Categoría
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats?.ncsByCategory?.map((nc) => (
              <Box key={nc.category} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2">{nc.category}</Typography>
                <Typography variant="body2" fontWeight="bold">{nc.count}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Listas recientes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Inspecciones Recientes</Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/quality/inspections')}>
                Ver todas
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {inspections.slice(0, 5).map((insp) => (
              <Box
                key={insp.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => navigate(`/quality/inspections/${insp.id}`)}
              >
                <Box>
                  <Typography fontWeight="bold">{insp.code}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {insp.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: insp.result === 'PASS' ? 'success.main' : insp.result === 'FAIL' ? 'error.main' : 'text.secondary',
                  }}
                >
                  {insp.result}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">No Conformidades Abiertas</Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/quality/non-conformances')}>
                Ver todas
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {nonConformances.filter(nc => nc.status !== 'CLOSED' && nc.status !== 'CANCELLED').slice(0, 5).map((nc) => (
              <Box
                key={nc.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => navigate(`/quality/non-conformances/${nc.id}`)}
              >
                <Box>
                  <Typography fontWeight="bold">{nc.code}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {nc.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: ncTypeColors[nc.ncType] }}
                >
                  {ncTypeLabels[nc.ncType]}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QualityDashboard;
