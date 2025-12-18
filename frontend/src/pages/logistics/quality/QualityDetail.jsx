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
  CheckCircle as ApproveIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { fetchQualityById, approveQuality, clearCurrentQuality } from '../../../store/slices/logisticsSlice';
import DownloadPDFButton from '../../../components/common/DownloadPDFButton';

const QualityDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentQuality, loading } = useSelector((state) => state.logistics);

  useEffect(() => {
    dispatch(fetchQualityById(id));
    return () => {
      dispatch(clearCurrentQuality());
    };
  }, [dispatch, id]);

  const handleApprove = async () => {
    await dispatch(approveQuality(id));
    dispatch(fetchQualityById(id));
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      ANALYZED: 'info',
      APPROVED: 'success',
      REJECTED: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading && !currentQuality) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentQuality) {
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
          <Button startIcon={<BackIcon />} onClick={() => navigate('/logistics/quality')} fullWidth={isMobile}>
            {t('common.back')}
          </Button>
          <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
            {currentQuality.code}
          </Typography>
          <Chip label={currentQuality.status} color={getStatusColor(currentQuality.status)} size={isMobile ? 'small' : 'medium'} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
          <DownloadPDFButton
            endpoint={`/reports/logistics/quality/${id}`}
            filename={`quality-${currentQuality.code}.pdf`}
            label={t('common.exportPDF')}
            fullWidth={isMobile}
          />
          {currentQuality.status !== 'APPROVED' && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/logistics/quality/${id}/edit`)}
                fullWidth={isMobile}
              >
                {t('common.edit')}
              </Button>
              {currentQuality.status === 'ANALYZED' && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={handleApprove}
                  fullWidth={isMobile}
                >
                  {t('logistics.approve')}
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <ScienceIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="h5">{t('logistics.sampleInfo')}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(currentQuality.sample_date).toLocaleDateString()} - {currentQuality.sample_time || ''}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.field')}</Typography>
                  <Typography variant="body1">{currentQuality.field?.name || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.tank')}</Typography>
                  <Typography variant="body1">
                    {currentQuality.tank ? `${currentQuality.tank.code} - ${currentQuality.tank.name}` : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.samplePoint')}</Typography>
                  <Typography variant="body1">{currentQuality.sample_point || '-'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>{t('logistics.qualityParameters')}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.apiGravity')}</Typography>
                  <Typography variant="h6">{currentQuality.api_gravity ? `${currentQuality.api_gravity}°` : '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.bsw')}</Typography>
                  <Typography variant="h6">{currentQuality.bsw ? `${currentQuality.bsw}%` : '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.sulfur')}</Typography>
                  <Typography variant="h6">{currentQuality.sulfur_content ? `${currentQuality.sulfur_content}%` : '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.viscosityCst')}</Typography>
                  <Typography variant="h6">{currentQuality.viscosity ? `${currentQuality.viscosity} cSt` : '-'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>{t('logistics.additionalParameters')}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.pourPointF')}</Typography>
                  <Typography variant="body1">{currentQuality.pour_point ? `${currentQuality.pour_point}°F` : '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.saltContentPtb')}</Typography>
                  <Typography variant="body1">{currentQuality.salt_content ? `${currentQuality.salt_content} PTB` : '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.h2sContentPpm')}</Typography>
                  <Typography variant="body1">{currentQuality.h2s_content ? `${currentQuality.h2s_content} ppm` : '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.rvpPsi')}</Typography>
                  <Typography variant="body1">{currentQuality.reid_vapor_pressure ? `${currentQuality.reid_vapor_pressure} psi` : '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.flashPointF')}</Typography>
                  <Typography variant="body1">{currentQuality.flash_point ? `${currentQuality.flash_point}°F` : '-'}</Typography>
                </Grid>
              </Grid>

              {currentQuality.notes && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>{t('common.notes')}</Typography>
                  <Typography variant="body1">{currentQuality.notes}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Side Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('logistics.labInfo')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.labReportNumber')}</Typography>
                  <Typography variant="body1">{currentQuality.lab_report_number || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.labName')}</Typography>
                  <Typography variant="body1">{currentQuality.lab_name || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.analyzedBy')}</Typography>
                  <Typography variant="body1">{currentQuality.analyzed_by || '-'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('logistics.samplingInfo')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.sampledBy')}</Typography>
                  <Typography variant="body1">
                    {currentQuality.sampler?.firstName 
                      ? `${currentQuality.sampler.firstName} ${currentQuality.sampler.lastName || ''}`
                      : currentQuality.sampler?.username || '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('common.createdAt')}</Typography>
                  <Typography variant="body1">
                    {new Date(currentQuality.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('common.createdBy')}</Typography>
                  <Typography variant="body1">
                    {currentQuality.creator?.firstName 
                      ? `${currentQuality.creator.firstName} ${currentQuality.creator.lastName || ''}`
                      : currentQuality.creator?.username || '-'}
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

export default QualityDetail;
