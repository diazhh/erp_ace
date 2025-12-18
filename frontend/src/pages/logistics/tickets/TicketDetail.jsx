import { useEffect, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  CheckCircle as CompleteIcon,
  LocalShipping as TruckIcon,
} from '@mui/icons-material';
import { fetchTicketById, completeTicket, clearCurrentTicket } from '../../../store/slices/logisticsSlice';

const TicketDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentTicket, loading } = useSelector((state) => state.logistics);

  const [completeDialog, setCompleteDialog] = useState(false);
  const [completeForm, setCompleteForm] = useState({
    net_volume: '',
    final_tank_volume: '',
    seal_numbers: '',
    received_by: '',
  });

  useEffect(() => {
    dispatch(fetchTicketById(id));
    return () => {
      dispatch(clearCurrentTicket());
    };
  }, [dispatch, id]);

  const handleComplete = async () => {
    const data = {
      net_volume: parseFloat(completeForm.net_volume) || null,
      final_tank_volume: parseFloat(completeForm.final_tank_volume) || null,
      seal_numbers: completeForm.seal_numbers ? completeForm.seal_numbers.split(',').map(s => s.trim()) : [],
      received_by: completeForm.received_by,
    };
    await dispatch(completeTicket({ id, data }));
    setCompleteDialog(false);
    dispatch(fetchTicketById(id));
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      IN_PROGRESS: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'error',
      VOID: 'error',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      LOADING: 'primary',
      UNLOADING: 'secondary',
      TRANSFER: 'info',
    };
    return colors[type] || 'default';
  };

  if (loading && !currentTicket) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentTicket) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t('common.notFound')}</Typography>
      </Box>
    );
  }

  const sealNumbers = currentTicket.seal_numbers || [];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: 3, 
        gap: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/logistics/tickets')} fullWidth={isMobile}>
            {t('common.back')}
          </Button>
          <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
            {currentTicket.code}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={currentTicket.type} color={getTypeColor(currentTicket.type)} size={isMobile ? 'small' : 'medium'} />
            <Chip label={currentTicket.status} color={getStatusColor(currentTicket.status)} size={isMobile ? 'small' : 'medium'} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: isMobile ? 'column' : 'row' }}>
          {currentTicket.status === 'DRAFT' && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/logistics/tickets/${id}/edit`)}
              fullWidth={isMobile}
            >
              {t('common.edit')}
            </Button>
          )}
          {(currentTicket.status === 'DRAFT' || currentTicket.status === 'IN_PROGRESS') && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CompleteIcon />}
              onClick={() => setCompleteDialog(true)}
              fullWidth={isMobile}
            >
              {t('logistics.completeTicket')}
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TruckIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="h5">{currentTicket.product_type}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {currentTicket.loading_start 
                      ? new Date(currentTicket.loading_start).toLocaleString() 
                      : t('common.notStarted')}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.sourceTank')}</Typography>
                  <Typography variant="body1">
                    {currentTicket.sourceTank?.code} - {currentTicket.sourceTank?.name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.destination')}</Typography>
                  <Typography variant="body1">
                    {currentTicket.destination || currentTicket.destinationTank?.name || '-'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>{t('logistics.volumeInfo')}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.grossVolume')}</Typography>
                  <Typography variant="h6">{parseFloat(currentTicket.gross_volume || 0).toLocaleString()} bbl</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.netVolume')}</Typography>
                  <Typography variant="h6">
                    {currentTicket.net_volume ? `${parseFloat(currentTicket.net_volume).toLocaleString()} bbl` : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.initialTankVolume')}</Typography>
                  <Typography variant="body1">
                    {currentTicket.initial_tank_volume ? `${parseFloat(currentTicket.initial_tank_volume).toLocaleString()} bbl` : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.finalTankVolume')}</Typography>
                  <Typography variant="body1">
                    {currentTicket.final_tank_volume ? `${parseFloat(currentTicket.final_tank_volume).toLocaleString()} bbl` : '-'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>{t('logistics.qualityParameters')}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={4} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.apiGravity')}</Typography>
                  <Typography variant="body1">{currentTicket.api_gravity ? `${currentTicket.api_gravity}°` : '-'}</Typography>
                </Grid>
                <Grid item xs={4} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.bsw')}</Typography>
                  <Typography variant="body1">{currentTicket.bsw ? `${currentTicket.bsw}%` : '-'}</Typography>
                </Grid>
                <Grid item xs={4} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.temperature')}</Typography>
                  <Typography variant="body1">{currentTicket.temperature ? `${currentTicket.temperature}°F` : '-'}</Typography>
                </Grid>
              </Grid>

              {currentTicket.notes && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>{t('common.notes')}</Typography>
                  <Typography variant="body1">{currentTicket.notes}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Side Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('logistics.transportInfo')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.vehiclePlate')}</Typography>
                  <Typography variant="body1">{currentTicket.vehicle_plate || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.driverName')}</Typography>
                  <Typography variant="body1">{currentTicket.driver_name || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.driverIdNumber')}</Typography>
                  <Typography variant="body1">{currentTicket.driver_id_number || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.carrierCompany')}</Typography>
                  <Typography variant="body1">{currentTicket.carrier_company || '-'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('logistics.timestamps')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.loadingStart')}</Typography>
                  <Typography variant="body1">
                    {currentTicket.loading_start ? new Date(currentTicket.loading_start).toLocaleString() : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.loadingEnd')}</Typography>
                  <Typography variant="body1">
                    {currentTicket.loading_end ? new Date(currentTicket.loading_end).toLocaleString() : '-'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {sealNumbers.length > 0 && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{t('logistics.sealNumbers')}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {sealNumbers.map((seal, index) => (
                    <Chip key={index} label={seal} size="small" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('logistics.authorization')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.authorizedBy')}</Typography>
                  <Typography variant="body1">{currentTicket.authorizer?.username || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">{t('logistics.receivedBy')}</Typography>
                  <Typography variant="body1">{currentTicket.received_by || '-'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Complete Dialog */}
      <Dialog open={completeDialog} onClose={() => setCompleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('logistics.completeTicket')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('logistics.netVolumeBbl')}
                value={completeForm.net_volume}
                onChange={(e) => setCompleteForm({ ...completeForm, net_volume: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('logistics.finalTankVolumeBbl')}
                value={completeForm.final_tank_volume}
                onChange={(e) => setCompleteForm({ ...completeForm, final_tank_volume: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('logistics.sealNumbers')}
                value={completeForm.seal_numbers}
                onChange={(e) => setCompleteForm({ ...completeForm, seal_numbers: e.target.value })}
                placeholder={t('logistics.sealNumbersPlaceholder')}
                helperText={t('logistics.sealNumbersHelp')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('logistics.receivedBy')}
                value={completeForm.received_by}
                onChange={(e) => setCompleteForm({ ...completeForm, received_by: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="success" onClick={handleComplete}>
            {t('logistics.complete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketDetail;
