import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Timeline as PipelineIcon,
} from '@mui/icons-material';
import { fetchPipelineById, clearCurrentPipeline } from '../../../store/slices/logisticsSlice';
import DownloadPDFButton from '../../../components/common/DownloadPDFButton';

const PipelineDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentPipeline, loading } = useSelector((state) => state.logistics);

  useEffect(() => {
    dispatch(fetchPipelineById(id));
    return () => {
      dispatch(clearCurrentPipeline());
    };
  }, [dispatch, id]);

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      MAINTENANCE: 'warning',
      SHUTDOWN: 'error',
      DECOMMISSIONED: 'default',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      CRUDE: 'primary',
      GAS: 'secondary',
      WATER: 'info',
      MULTIPHASE: 'warning',
      CONDENSATE: 'success',
      DIESEL: 'error',
    };
    return colors[type] || 'default';
  };

  if (loading && !currentPipeline) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentPipeline) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t('common.notFound')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3, 
        flexWrap: 'wrap', 
        gap: 2,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/logistics/pipelines')} fullWidth={isMobile}>
            {t('common.back')}
          </Button>
          <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
            {currentPipeline.code}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={currentPipeline.type} color={getTypeColor(currentPipeline.type)} size={isMobile ? 'small' : 'medium'} />
            <Chip label={currentPipeline.status} color={getStatusColor(currentPipeline.status)} size={isMobile ? 'small' : 'medium'} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
          <DownloadPDFButton
            endpoint={`/reports/logistics/pipeline/${id}`}
            filename={`pipeline-${currentPipeline.code}.pdf`}
            label={t('common.exportPDF')}
            fullWidth={isMobile}
          />
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/logistics/pipelines/${id}/edit`)}
            fullWidth={isMobile}
          >
            {t('common.edit')}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <PipelineIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="h5">{currentPipeline.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {currentPipeline.operator || t('logistics.noOperator')}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>{t('logistics.routeInfo')}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.origin')}</Typography>
                  <Typography variant="body1">
                    {currentPipeline.origin || currentPipeline.originField?.name || '-'}
                  </Typography>
                  {currentPipeline.originField && (
                    <Typography variant="caption" color="textSecondary">
                      {currentPipeline.originField.code}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.destination')}</Typography>
                  <Typography variant="body1">
                    {currentPipeline.destination || currentPipeline.destinationField?.name || '-'}
                  </Typography>
                  {currentPipeline.destinationField && (
                    <Typography variant="caption" color="textSecondary">
                      {currentPipeline.destinationField.code}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>{t('logistics.technicalSpecs')}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.length')}</Typography>
                  <Typography variant="h6">{currentPipeline.length_km ? `${currentPipeline.length_km} km` : '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.diameter')}</Typography>
                  <Typography variant="h6">{currentPipeline.diameter_inches ? `${currentPipeline.diameter_inches}"` : '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.wallThicknessInches')}</Typography>
                  <Typography variant="h6">{currentPipeline.wall_thickness_inches ? `${currentPipeline.wall_thickness_inches}"` : '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.capacity')}</Typography>
                  <Typography variant="h6">
                    {currentPipeline.capacity_bpd ? `${parseFloat(currentPipeline.capacity_bpd).toLocaleString()} bpd` : '-'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>{t('logistics.materialAndPressure')}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.material')}</Typography>
                  <Typography variant="body1">{currentPipeline.material || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.maxPressurePsi')}</Typography>
                  <Typography variant="body1">
                    {currentPipeline.max_pressure_psi ? `${currentPipeline.max_pressure_psi} psi` : '-'}
                  </Typography>
                </Grid>
              </Grid>

              {currentPipeline.notes && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>{t('common.notes')}</Typography>
                  <Typography variant="body1">{currentPipeline.notes}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Side Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('logistics.inspectionInfo')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.installationDate')}</Typography>
                  <Typography variant="body1">
                    {currentPipeline.installation_date 
                      ? new Date(currentPipeline.installation_date).toLocaleDateString() 
                      : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.lastInspectionDate')}</Typography>
                  <Typography variant="body1">
                    {currentPipeline.last_inspection_date 
                      ? new Date(currentPipeline.last_inspection_date).toLocaleDateString() 
                      : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.nextInspectionDate')}</Typography>
                  <Typography variant="body1">
                    {currentPipeline.next_inspection_date 
                      ? new Date(currentPipeline.next_inspection_date).toLocaleDateString() 
                      : '-'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('logistics.auditInfo')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('common.createdAt')}</Typography>
                  <Typography variant="body1">
                    {new Date(currentPipeline.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('common.createdBy')}</Typography>
                  <Typography variant="body1">
                    {currentPipeline.creator?.firstName 
                      ? `${currentPipeline.creator.firstName} ${currentPipeline.creator.lastName || ''}`
                      : currentPipeline.creator?.username || '-'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PipelineDetail;
