import { useEffect, useState } from 'react';
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
  CircularProgress,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  CheckCircle as ResolveIcon,
  PlayArrow as ResumeIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { fetchStopWorkById, resolveStopWork, resumeWork, clearCurrentStopWork } from '../../store/slices/ptwSlice';

const StopWorkDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentStopWork, loading } = useSelector((state) => state.ptw);

  const [resolveDialog, setResolveDialog] = useState({
    open: false,
    resolution_notes: '',
    lessons_learned: '',
  });

  useEffect(() => {
    dispatch(fetchStopWorkById(id));
    return () => {
      dispatch(clearCurrentStopWork());
    };
  }, [dispatch, id]);

  const getStatusColor = (status) => {
    const colors = {
      OPEN: 'error',
      INVESTIGATING: 'warning',
      RESOLVED: 'info',
      CLOSED: 'success',
    };
    return colors[status] || 'default';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      LOW: 'default',
      MEDIUM: 'warning',
      HIGH: 'error',
      CRITICAL: 'error',
    };
    return colors[severity] || 'default';
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  const handleResolve = async () => {
    await dispatch(resolveStopWork({
      id,
      data: {
        resolution_notes: resolveDialog.resolution_notes,
        lessons_learned: resolveDialog.lessons_learned,
      },
    }));
    setResolveDialog({ open: false, resolution_notes: '', lessons_learned: '' });
    dispatch(fetchStopWorkById(id));
  };

  const handleResume = async () => {
    if (window.confirm(t('ptw.stopWork.confirmResume', '¿Confirma que es seguro reanudar el trabajo?'))) {
      await dispatch(resumeWork(id));
      dispatch(fetchStopWorkById(id));
    }
  };

  if (loading || !currentStopWork) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const correctiveActions = typeof currentStopWork.corrective_actions === 'string'
    ? JSON.parse(currentStopWork.corrective_actions)
    : currentStopWork.corrective_actions || [];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/ptw/stop-work')} fullWidth={isMobile}>
            {t('common.back', 'Volver')}
          </Button>
          <WarningIcon color="error" />
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
            {currentStopWork.code}
          </Typography>
          <Chip
            label={t(`ptw.swaStatus.${currentStopWork.status}`, currentStopWork.status)}
            color={getStatusColor(currentStopWork.status)}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
          {['OPEN', 'INVESTIGATING'].includes(currentStopWork.status) && (
            <Button
              variant="contained"
              startIcon={<ResolveIcon />}
              onClick={() => setResolveDialog({ open: true, resolution_notes: '', lessons_learned: '' })}
              fullWidth={isMobile}
            >
              {t('ptw.stopWork.resolve', 'Resolver')}
            </Button>
          )}
          {currentStopWork.status === 'RESOLVED' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<ResumeIcon />}
              onClick={handleResume}
              fullWidth={isMobile}
            >
              {t('ptw.stopWork.resumeWork', 'Reanudar Trabajo')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('ptw.reason.label', 'Razón')}</Typography>
              <Typography variant="h6" fontWeight="bold">
                {t(`ptw.reason.${currentStopWork.reason}`, currentStopWork.reason)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('ptw.severity.label', 'Severidad')}</Typography>
              <Chip
                label={t(`ptw.severity.${currentStopWork.severity}`, currentStopWork.severity)}
                color={getSeverityColor(currentStopWork.severity)}
                sx={{ mt: 0.5 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('ptw.location', 'Ubicación')}</Typography>
              <Typography variant="h6" fontWeight="bold">{currentStopWork.location}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('ptw.reportedAt', 'Reportado')}</Typography>
              <Typography variant="h6" fontWeight="bold">{formatDateTime(currentStopWork.reported_at)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Details */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>{t('ptw.stopWork.details', 'Detalles del Stop Work')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">{t('ptw.description', 'Descripción')}</Typography>
            <Typography variant="body1">{currentStopWork.description}</Typography>
          </Grid>
          {currentStopWork.immediate_actions && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">{t('ptw.stopWork.immediateActions', 'Acciones Inmediatas')}</Typography>
              <Typography variant="body1">{currentStopWork.immediate_actions}</Typography>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">{t('ptw.reportedBy', 'Reportado por')}</Typography>
            <Typography variant="body1">{currentStopWork.reporter?.username || '-'}</Typography>
          </Grid>
          {currentStopWork.permit && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">{t('ptw.relatedPermit', 'Permiso Relacionado')}</Typography>
              <Button
                size="small"
                onClick={() => navigate(`/ptw/permits/${currentStopWork.permit.id}`)}
              >
                {currentStopWork.permit.code} - {currentStopWork.permit.title}
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Resolution Details */}
      {['RESOLVED', 'CLOSED'].includes(currentStopWork.status) && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>{t('ptw.stopWork.resolution', 'Resolución')}</Typography>
          <Grid container spacing={2}>
            {currentStopWork.resolution_notes && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">{t('ptw.stopWork.resolutionNotes', 'Notas de Resolución')}</Typography>
                <Typography variant="body1">{currentStopWork.resolution_notes}</Typography>
              </Grid>
            )}
            {currentStopWork.lessons_learned && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">{t('ptw.stopWork.lessonsLearned', 'Lecciones Aprendidas')}</Typography>
                <Typography variant="body1">{currentStopWork.lessons_learned}</Typography>
              </Grid>
            )}
            {correctiveActions.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">{t('ptw.stopWork.correctiveActions', 'Acciones Correctivas')}</Typography>
                <List dense>
                  {correctiveActions.map((action, index) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ minWidth: 32 }}>•</ListItemIcon>
                      <ListItemText primary={action} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">{t('ptw.resolvedBy', 'Resuelto por')}</Typography>
              <Typography variant="body1">
                {currentStopWork.resolver?.username || '-'} ({formatDateTime(currentStopWork.resolved_at)})
              </Typography>
            </Grid>
            {currentStopWork.work_resumed_at && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">{t('ptw.workResumedAt', 'Trabajo Reanudado')}</Typography>
                <Typography variant="body1">
                  {currentStopWork.workResumer?.username || '-'} ({formatDateTime(currentStopWork.work_resumed_at)})
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* Resolve Dialog */}
      <Dialog open={resolveDialog.open} onClose={() => setResolveDialog({ open: false, resolution_notes: '', lessons_learned: '' })} maxWidth="md" fullWidth>
        <DialogTitle>{t('ptw.stopWork.resolveTitle', 'Resolver Stop Work')}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            {t('ptw.stopWork.resolveInfo', 'Documente la resolución del Stop Work antes de permitir la reanudación del trabajo.')}
          </Alert>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label={t('ptw.stopWork.resolutionNotes', 'Notas de Resolución')}
                value={resolveDialog.resolution_notes}
                onChange={(e) => setResolveDialog({ ...resolveDialog, resolution_notes: e.target.value })}
                placeholder={t('ptw.stopWork.resolutionPlaceholder', 'Describa cómo se resolvió la situación...')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('ptw.stopWork.lessonsLearned', 'Lecciones Aprendidas')}
                value={resolveDialog.lessons_learned}
                onChange={(e) => setResolveDialog({ ...resolveDialog, lessons_learned: e.target.value })}
                placeholder={t('ptw.stopWork.lessonsPlaceholder', '¿Qué aprendimos de esta situación?')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveDialog({ open: false, resolution_notes: '', lessons_learned: '' })}>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button variant="contained" onClick={handleResolve} disabled={!resolveDialog.resolution_notes}>
            {t('ptw.stopWork.resolve', 'Resolver')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StopWorkDetail;
