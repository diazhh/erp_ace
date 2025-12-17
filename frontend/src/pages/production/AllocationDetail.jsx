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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Approval as ApproveIcon,
  OilBarrel as OilIcon,
  LocalGasStation as GasIcon,
  WaterDrop as WaterIcon,
} from '@mui/icons-material';
import { fetchAllocationById, approveAllocation, clearCurrentAllocation } from '../../store/slices/productionSlice';

const MONTHS = [
  { value: 1, label: 'enero' },
  { value: 2, label: 'febrero' },
  { value: 3, label: 'marzo' },
  { value: 4, label: 'abril' },
  { value: 5, label: 'mayo' },
  { value: 6, label: 'junio' },
  { value: 7, label: 'julio' },
  { value: 8, label: 'agosto' },
  { value: 9, label: 'septiembre' },
  { value: 10, label: 'octubre' },
  { value: 11, label: 'noviembre' },
  { value: 12, label: 'diciembre' },
];

const AllocationDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentAllocation: allocation, loading } = useSelector((state) => state.production);

  useEffect(() => {
    if (id) {
      dispatch(fetchAllocationById(id));
    }
    return () => {
      dispatch(clearCurrentAllocation());
    };
  }, [dispatch, id]);

  const handleApprove = async () => {
    await dispatch(approveAllocation(id));
    dispatch(fetchAllocationById(id));
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
    };
    return colors[status] || 'default';
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('es-VE', { maximumFractionDigits: 2 }).format(num);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-VE');
  };

  const getMonthName = (month) => {
    const monthObj = MONTHS.find(m => m.value === month);
    return monthObj ? t(`common.months.${monthObj.label}`) : month;
  };

  if (loading || !allocation) {
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
          <Button startIcon={<BackIcon />} onClick={() => navigate('/production/allocations')}>
            {t('common.back')}
          </Button>
          <Typography variant="h4" component="h1">
            {t('production.allocation.detail')}
          </Typography>
          <Chip 
            label={t(`production.allocation.status.${allocation.status}`)} 
            color={getStatusColor(allocation.status)} 
          />
        </Box>
        {(allocation.status === 'DRAFT' || allocation.status === 'PENDING') && (
          <Button
            variant="contained"
            color="success"
            startIcon={<ApproveIcon />}
            onClick={handleApprove}
          >
            {t('production.allocation.approve')}
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('production.allocation.periodInfo')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.allocation.period')}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {getMonthName(allocation.month)} {allocation.year}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.field')}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {allocation.field?.name || '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.allocation.method')}
            </Typography>
            <Typography variant="body1">
              {allocation.allocation_method || t('production.allocation.methods.WELL_TEST')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('production.allocation.wellsCount')}
            </Typography>
            <Typography variant="body1">
              {allocation.wells_count || allocation.wellAllocations?.length || '-'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <OilIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {formatNumber(allocation.total_oil)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('production.allocation.totalOil')} (bbl)
              </Typography>
              {allocation.allocated_oil && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="success.main">
                    {t('production.allocation.allocated')}: {formatNumber(allocation.allocated_oil)} bbl
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <GasIcon sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {formatNumber(allocation.total_gas)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('production.allocation.totalGas')} (mcf)
              </Typography>
              {allocation.allocated_gas && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="success.main">
                    {t('production.allocation.allocated')}: {formatNumber(allocation.allocated_gas)} mcf
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WaterIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {formatNumber(allocation.total_water)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('production.allocation.totalWater')} (bbl)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {allocation.wellAllocations && allocation.wellAllocations.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('production.allocation.byWell')}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('production.well')}</TableCell>
                  <TableCell align="right">{t('production.oilBbl')}</TableCell>
                  <TableCell align="right">{t('production.gasMcf')}</TableCell>
                  <TableCell align="right">{t('production.waterBbl')}</TableCell>
                  <TableCell align="right">{t('production.allocation.oilPercent')}</TableCell>
                  <TableCell align="right">{t('production.allocation.gasPercent')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allocation.wellAllocations.map((wa) => (
                  <TableRow key={wa.id || wa.well_id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {wa.well?.code || '-'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {wa.well?.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatNumber(wa.oil_volume)}</TableCell>
                    <TableCell align="right">{formatNumber(wa.gas_volume)}</TableCell>
                    <TableCell align="right">{formatNumber(wa.water_volume)}</TableCell>
                    <TableCell align="right">
                      {wa.oil_percent ? `${wa.oil_percent.toFixed(2)}%` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {wa.gas_percent ? `${wa.gas_percent.toFixed(2)}%` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('production.allocation.auditInfo')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('common.createdBy')}
            </Typography>
            <Typography variant="body1">
              {allocation.createdBy?.full_name || allocation.created_by || '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              {t('common.createdAt')}
            </Typography>
            <Typography variant="body1">
              {formatDateTime(allocation.created_at)}
            </Typography>
          </Grid>
          {allocation.approved_by && (
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                {t('production.allocation.approvedBy')}
              </Typography>
              <Typography variant="body1">
                {allocation.approvedBy?.full_name || allocation.approved_by}
              </Typography>
            </Grid>
          )}
          {allocation.approved_at && (
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                {t('production.allocation.approvedAt')}
              </Typography>
              <Typography variant="body1">
                {formatDateTime(allocation.approved_at)}
              </Typography>
            </Grid>
          )}
        </Grid>

        {allocation.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary">
              {t('common.notes')}
            </Typography>
            <Typography variant="body1">
              {allocation.notes}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AllocationDetail;
