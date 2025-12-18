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
  TextField,
  MenuItem,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createTicket, updateTicket, fetchTicketById, clearCurrentTicket } from '../../../store/slices/logisticsSlice';
import { fetchTanks } from '../../../store/slices/logisticsSlice';

const TICKET_TYPES = ['LOADING', 'UNLOADING', 'TRANSFER'];
const PRODUCT_TYPES = ['CRUDE', 'DIESEL', 'GASOLINE', 'WATER', 'CHEMICALS', 'CONDENSATE'];

const TicketForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = Boolean(id);

  const { currentTicket, tanks, loading, error } = useSelector((state) => state.logistics);

  const [formData, setFormData] = useState({
    type: 'LOADING',
    source_tank_id: '',
    destination_tank_id: '',
    destination: '',
    vehicle_plate: '',
    driver_name: '',
    driver_id_number: '',
    carrier_company: '',
    product_type: 'CRUDE',
    api_gravity: '',
    bsw: '',
    temperature: '',
    gross_volume: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTanks({ limit: 100, status: 'ACTIVE' }));
    if (isEdit) {
      dispatch(fetchTicketById(id));
    }
    return () => {
      dispatch(clearCurrentTicket());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentTicket) {
      setFormData({
        type: currentTicket.type || 'LOADING',
        source_tank_id: currentTicket.source_tank_id || '',
        destination_tank_id: currentTicket.destination_tank_id || '',
        destination: currentTicket.destination || '',
        vehicle_plate: currentTicket.vehicle_plate || '',
        driver_name: currentTicket.driver_name || '',
        driver_id_number: currentTicket.driver_id_number || '',
        carrier_company: currentTicket.carrier_company || '',
        product_type: currentTicket.product_type || 'CRUDE',
        api_gravity: currentTicket.api_gravity || '',
        bsw: currentTicket.bsw || '',
        temperature: currentTicket.temperature || '',
        gross_volume: currentTicket.gross_volume || '',
        notes: currentTicket.notes || '',
      });
    }
  }, [isEdit, currentTicket]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.source_tank_id) errors.source_tank_id = t('validation.required');
    if (!formData.gross_volume || parseFloat(formData.gross_volume) <= 0) {
      errors.gross_volume = t('validation.positiveNumber');
    }
    if (formData.type !== 'TRANSFER' && !formData.destination) {
      errors.destination = t('validation.required');
    }
    if (formData.type === 'TRANSFER' && !formData.destination_tank_id) {
      errors.destination_tank_id = t('validation.required');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = {
        ...formData,
        gross_volume: parseFloat(formData.gross_volume) || 0,
        api_gravity: formData.api_gravity ? parseFloat(formData.api_gravity) : null,
        bsw: formData.bsw ? parseFloat(formData.bsw) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        source_tank_id: formData.source_tank_id || null,
        destination_tank_id: formData.destination_tank_id || null,
      };

      if (isEdit) {
        await dispatch(updateTicket({ id, data })).unwrap();
      } else {
        await dispatch(createTicket(data)).unwrap();
      }
      navigate('/logistics/tickets');
    } catch (err) {
      console.error('Error saving ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading && !currentTicket) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center', 
        gap: 2, 
        mb: 3 
      }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/logistics/tickets')} fullWidth={isMobile}>
          {t('common.back')}
        </Button>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
          {isEdit ? t('logistics.editTicket') : t('logistics.newTicket')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('logistics.ticketInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label={t('logistics.type')}
                  value={formData.type}
                  onChange={handleChange('type')}
                >
                  {TICKET_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label={t('logistics.product')}
                  value={formData.product_type}
                  onChange={handleChange('product_type')}
                >
                  {PRODUCT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  select
                  label={t('logistics.sourceTank')}
                  value={formData.source_tank_id}
                  onChange={handleChange('source_tank_id')}
                  error={Boolean(formErrors.source_tank_id)}
                  helperText={formErrors.source_tank_id}
                >
                  <MenuItem value="">{t('common.select')}</MenuItem>
                  {tanks?.map((tank) => (
                    <MenuItem key={tank.id} value={tank.id}>
                      {tank.code} - {tank.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {formData.type === 'TRANSFER' ? (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    select
                    label={t('logistics.destinationTank')}
                    value={formData.destination_tank_id}
                    onChange={handleChange('destination_tank_id')}
                    error={Boolean(formErrors.destination_tank_id)}
                    helperText={formErrors.destination_tank_id}
                  >
                    <MenuItem value="">{t('common.select')}</MenuItem>
                    {tanks?.filter(t => t.id !== formData.source_tank_id).map((tank) => (
                      <MenuItem key={tank.id} value={tank.id}>
                        {tank.code} - {tank.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ) : (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label={t('logistics.destination')}
                    value={formData.destination}
                    onChange={handleChange('destination')}
                    error={Boolean(formErrors.destination)}
                    helperText={formErrors.destination}
                    placeholder={t('logistics.destinationPlaceholder')}
                  />
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              {t('logistics.transportInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label={t('logistics.vehiclePlate')}
                  value={formData.vehicle_plate}
                  onChange={handleChange('vehicle_plate')}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label={t('logistics.driverName')}
                  value={formData.driver_name}
                  onChange={handleChange('driver_name')}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label={t('logistics.driverIdNumber')}
                  value={formData.driver_id_number}
                  onChange={handleChange('driver_id_number')}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label={t('logistics.carrierCompany')}
                  value={formData.carrier_company}
                  onChange={handleChange('carrier_company')}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              {t('logistics.productDetails')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label={t('logistics.grossVolumeBbl')}
                  value={formData.gross_volume}
                  onChange={handleChange('gross_volume')}
                  error={Boolean(formErrors.gross_volume)}
                  helperText={formErrors.gross_volume}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.apiGravity')}
                  value={formData.api_gravity}
                  onChange={handleChange('api_gravity')}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.bswPercent')}
                  value={formData.bsw}
                  onChange={handleChange('bsw')}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.temperatureF')}
                  value={formData.temperature}
                  onChange={handleChange('temperature')}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('common.notes')}
                  value={formData.notes}
                  onChange={handleChange('notes')}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'flex-end', 
          gap: 2, 
          mt: 3 
        }}>
          <Button variant="outlined" onClick={() => navigate('/logistics/tickets')} fullWidth={isMobile}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={submitting}
            fullWidth={isMobile}
          >
            {isEdit ? t('common.save') : t('common.create')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default TicketForm;
