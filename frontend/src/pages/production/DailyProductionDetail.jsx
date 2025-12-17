import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  CheckCircle as VerifyIcon,
  Approval as ApproveIcon,
  OilBarrel as OilIcon,
  LocalGasStation as GasIcon,
  WaterDrop as WaterIcon,
} from '@mui/icons-material';
import { fetchProductionById, verifyProduction, approveProduction, clearCurrentProduction } from '../../store/slices/productionSlice';

const DailyProductionDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentProduction: production, loading } = useSelector((state) => state.production);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductionById(id));
    }
    return () => {
      dispatch(clearCurrentProduction());
    };
  }, [dispatch, id]);

  const handleVerify = async () => {
    await dispatch(verifyProduction(id));
    dispatch(fetchProductionById(id));
  };

  const handleApprove = async () => {
    await dispatch(approveProduction(id));
    dispatch(fetchProductionById(id));
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      VERIFIED: 'info',
      APPROVED: 'success',
      REJECTED: 'error',
    };
    return colors[status] || 'default';
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('es-VE', { maximumFractionDigits: 2 }).format(num);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-VE');
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-VE');
  };

  if (loading || !production) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/production/daily')}>
            {t('common.back')}
          </Button>
          <Typography variant="h4" component="h1">
            {t('production.daily.detail')}
          </Typography>
          <Chip 
            label={t(`production.daily.status.${production.status}`)} 
            color={getStatusColor(production.status)} 
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {production.status === 'DRAFT' && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/production/daily/${id}/edit`)}
              >
                {t('common.edit')}
              </Button>
              <Button
                variant="contained"
                color="info"
                startIcon={<VerifyIcon />}
                onClick={handleVerify}
              >
                {t('production.daily.verify')}
              </Button>
            </>
          )}
          {production.status === 'VERIFIED' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<ApproveIcon />}
              onClick={handleApprove}
            >
              {t('production.daily.approve')}
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <OilIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {formatNumber(production.oil_volume)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('production.oilBbl')}
              </Typography>
              {production.oil_rate && (
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(production.oil_rate)} bopd
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <GasIcon sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {formatNumber(production.gas_volume)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('production.gasMcf')}
              </Typography>
              {production.gas_rate && (
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(production.gas_rate)} mcfd
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WaterIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {formatNumber(production.water_volume)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('production.waterBbl')}
              </Typography>
              {production.water_rate && (
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(production.water_rate)} bwpd
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('production.daily.basicInfo')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.productionDate')}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {formatDate(production.production_date)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.well')}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {production.well?.code} - {production.well?.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.field')}
            </Typography>
            <Typography variant="body1">
              {production.well?.field?.name || '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.hoursOn')}
            </Typography>
            <Typography variant="body1">
              {production.hours_on || 24} h
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('production.daily.pressures')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.chokeSize')}
            </Typography>
            <Typography variant="body1">
              {production.choke_size ? `${production.choke_size}/64"` : '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.tubingPressure')}
            </Typography>
            <Typography variant="body1">
              {production.tubing_pressure ? `${formatNumber(production.tubing_pressure)} psi` : '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.casingPressure')}
            </Typography>
            <Typography variant="body1">
              {production.casing_pressure ? `${formatNumber(production.casing_pressure)} psi` : '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.bsw')}
            </Typography>
            <Typography variant="body1">
              {production.bsw ? `${production.bsw}%` : '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.apiGravity')}
            </Typography>
            <Typography variant="body1">
              {production.api_gravity ? `${production.api_gravity}°API` : '-'}
            </Typography>
          </Grid>
        </Grid>

        {(production.downtime_hours > 0 || production.downtime_reason) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('production.daily.downtime')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  {t('production.daily.downtimeHours')}
                </Typography>
                <Typography variant="body1" color="error">
                  {production.downtime_hours || 0} h
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={9}>
                <Typography variant="caption" color="text.secondary">
                  {t('production.daily.downtimeReason')}
                </Typography>
                <Typography variant="body1">
                  {production.downtime_reason || '-'}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}

        {production.notes && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('common.notes')}
            </Typography>
            <Typography variant="body1">
              {production.notes}
            </Typography>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('production.daily.auditInfo')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('common.createdBy')}
            </Typography>
            <Typography variant="body1">
              {production.reportedBy?.full_name || production.reported_by || '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('common.createdAt')}
            </Typography>
            <Typography variant="body1">
              {formatDateTime(production.created_at)}
            </Typography>
          </Grid>
          {production.verified_by && (
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                {t('production.daily.verifiedBy')}
              </Typography>
              <Typography variant="body1">
                {production.verifiedBy?.full_name || production.verified_by}
              </Typography>
            </Grid>
          )}
          {production.verified_at && (
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                {t('production.daily.verifiedAt')}
              </Typography>
              <Typography variant="body1">
                {formatDateTime(production.verified_at)}
              </Typography>
            </Grid>
          )}
          {production.approved_by && (
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                {t('production.daily.approvedBy')}
              </Typography>
              <Typography variant="body1">
                {production.approvedBy?.full_name || production.approved_by}
              </Typography>
            </Grid>
          )}
          {production.approved_at && (
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                {t('production.daily.approvedAt')}
              </Typography>
              <Typography variant="body1">
                {formatDateTime(production.approved_at)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default DailyProductionDetail;
