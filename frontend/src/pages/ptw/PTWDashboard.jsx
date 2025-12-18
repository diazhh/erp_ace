import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Assignment as PermitIcon,
  Warning as WarningIcon,
  CheckCircle as ActiveIcon,
  PendingActions as PendingIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  ReportProblem as StopWorkIcon,
  Schedule as ExpiredIcon,
} from '@mui/icons-material';
import { fetchPTWDashboard } from '../../store/slices/ptwSlice';

const StatCard = ({ title, value, subtitle, icon, color = 'primary', onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: 4 } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const PTWDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { dashboard, dashboardLoading } = useSelector((state) => state.ptw);

  useEffect(() => {
    dispatch(fetchPTWDashboard());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PENDING: 'warning',
      APPROVED: 'info',
      ACTIVE: 'success',
      SUSPENDED: 'error',
      CLOSED: 'default',
      CANCELLED: 'default',
      OPEN: 'error',
      INVESTIGATING: 'warning',
      RESOLVED: 'info',
    };
    return colors[status] || 'default';
  };

  const getTypeLabel = (type) => {
    const labels = {
      HOT_WORK: t('ptw.type.HOT_WORK', 'Trabajo en Caliente'),
      CONFINED_SPACE: t('ptw.type.CONFINED_SPACE', 'Espacio Confinado'),
      ELECTRICAL: t('ptw.type.ELECTRICAL', 'Eléctrico'),
      EXCAVATION: t('ptw.type.EXCAVATION', 'Excavación'),
      LIFTING: t('ptw.type.LIFTING', 'Izaje'),
      WORKING_AT_HEIGHT: t('ptw.type.WORKING_AT_HEIGHT', 'Trabajo en Altura'),
      LOCKOUT_TAGOUT: t('ptw.type.LOCKOUT_TAGOUT', 'LOTO'),
      GENERAL: t('ptw.type.GENERAL', 'General'),
    };
    return labels[type] || type;
  };

  if (dashboardLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const permitStats = dashboard?.permits || {};
  const stopWorkStats = dashboard?.stopWork || {};

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('ptw.dashboard.title', 'Permisos de Trabajo')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<StopWorkIcon />}
            onClick={() => navigate('/ptw/stop-work/new')}
            fullWidth={isMobile}
          >
            {t('ptw.stopWork.report', 'Reportar Stop Work')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/ptw/permits/new')}
            fullWidth={isMobile}
          >
            {t('ptw.permit.new', 'Nuevo Permiso')}
          </Button>
        </Box>
      </Box>

      {/* Permit Stats */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        {t('ptw.dashboard.permitsSection', 'Permisos de Trabajo')}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('ptw.dashboard.activePermits', 'Permisos Activos')}
            value={permitStats.active || 0}
            icon={<ActiveIcon sx={{ color: 'success.main' }} />}
            color="success"
            onClick={() => navigate('/ptw/permits?status=ACTIVE')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('ptw.dashboard.pendingApproval', 'Pendientes Aprobación')}
            value={permitStats.pendingApproval || 0}
            icon={<PendingIcon sx={{ color: 'warning.main' }} />}
            color="warning"
            onClick={() => navigate('/ptw/permits?status=PENDING')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('ptw.dashboard.expiredPermits', 'Permisos Vencidos')}
            value={permitStats.expired || 0}
            icon={<ExpiredIcon sx={{ color: 'error.main' }} />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('ptw.dashboard.openStopWork', 'Stop Work Abiertos')}
            value={stopWorkStats.open || 0}
            icon={<StopWorkIcon sx={{ color: 'error.main' }} />}
            color="error"
            onClick={() => navigate('/ptw/stop-work?status=OPEN')}
          />
        </Grid>
      </Grid>

      {/* Recent Items */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('ptw.dashboard.recentPermits', 'Permisos Recientes')}
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/ptw/permits')}
              >
                {t('common.viewAll', 'Ver todos')}
              </Button>
            </Box>
            <List>
              {(dashboard?.recentPermits || []).map((permit, index) => (
                <Box key={permit.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    button
                    onClick={() => navigate(`/ptw/permits/${permit.id}`)}
                    sx={{ px: 0 }}
                  >
                    <ListItemText
                      primary={permit.code}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span">
                            {permit.title}
                          </Typography>
                          <br />
                          <Chip 
                            label={getTypeLabel(permit.type)} 
                            size="small" 
                            variant="outlined" 
                            sx={{ mt: 0.5, mr: 1 }}
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={t(`ptw.status.${permit.status}`, permit.status)}
                        size="small"
                        color={getStatusColor(permit.status)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </Box>
              ))}
              {(!dashboard?.recentPermits || dashboard.recentPermits.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  {t('ptw.dashboard.noRecentPermits', 'No hay permisos recientes')}
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('ptw.dashboard.recentStopWork', 'Stop Work Recientes')}
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/ptw/stop-work')}
              >
                {t('common.viewAll', 'Ver todos')}
              </Button>
            </Box>
            <List>
              {(dashboard?.recentStopWork || []).map((swa, index) => (
                <Box key={swa.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    button
                    onClick={() => navigate(`/ptw/stop-work/${swa.id}`)}
                    sx={{ px: 0 }}
                  >
                    <ListItemText
                      primary={swa.code}
                      secondary={
                        <Box>
                          <Chip 
                            label={t(`ptw.reason.${swa.reason}`, swa.reason)} 
                            size="small" 
                            color={swa.severity === 'CRITICAL' ? 'error' : swa.severity === 'HIGH' ? 'warning' : 'default'}
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(swa.reported_at).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={t(`ptw.swaStatus.${swa.status}`, swa.status)}
                        size="small"
                        color={getStatusColor(swa.status)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </Box>
              ))}
              {(!dashboard?.recentStopWork || dashboard.recentStopWork.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  {t('ptw.dashboard.noRecentStopWork', 'No hay Stop Work recientes')}
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PTWDashboard;
