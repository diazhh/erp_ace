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
import { createTank, updateTank, fetchTankById, clearCurrentTank } from '../../../store/slices/logisticsSlice';
import { fetchFields } from '../../../store/slices/productionSlice';

const TANK_TYPES = ['CRUDE', 'WATER', 'DIESEL', 'CHEMICALS', 'GAS', 'CONDENSATE'];
const TANK_STATUSES = ['ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE', 'DECOMMISSIONED'];

const TankForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = Boolean(id);

  const { currentTank, loading, error } = useSelector((state) => state.logistics);
  const { fields } = useSelector((state) => state.production);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    field_id: '',
    type: 'CRUDE',
    capacity: '',
    current_volume: '',
    diameter_ft: '',
    height_ft: '',
    status: 'ACTIVE',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
    if (isEdit) {
      dispatch(fetchTankById(id));
    }
    return () => {
      dispatch(clearCurrentTank());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentTank) {
      setFormData({
        name: currentTank.name || '',
        location: currentTank.location || '',
        field_id: currentTank.field_id || '',
        type: currentTank.type || 'CRUDE',
        capacity: currentTank.capacity || '',
        current_volume: currentTank.current_volume || '',
        diameter_ft: currentTank.diameter_ft || '',
        height_ft: currentTank.height_ft || '',
        status: currentTank.status || 'ACTIVE',
        notes: currentTank.notes || '',
      });
    }
  }, [isEdit, currentTank]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('validation.required');
    if (!formData.capacity || parseFloat(formData.capacity) <= 0) {
      errors.capacity = t('validation.positiveNumber');
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
        capacity: parseFloat(formData.capacity) || 0,
        current_volume: parseFloat(formData.current_volume) || 0,
        diameter_ft: formData.diameter_ft ? parseFloat(formData.diameter_ft) : null,
        height_ft: formData.height_ft ? parseFloat(formData.height_ft) : null,
        field_id: formData.field_id || null,
      };

      if (isEdit) {
        await dispatch(updateTank({ id, data })).unwrap();
      } else {
        await dispatch(createTank(data)).unwrap();
      }
      navigate('/logistics/tanks');
    } catch (err) {
      console.error('Error saving tank:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading && !currentTank) {
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
        <Button startIcon={<BackIcon />} onClick={() => navigate('/logistics/tanks')} fullWidth={isMobile}>
          {t('common.back')}
        </Button>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
          {isEdit ? t('logistics.editTank') : t('logistics.newTank')}
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
              {t('logistics.tankInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t('logistics.name')}
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={Boolean(formErrors.name)}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label={t('logistics.type')}
                  value={formData.type}
                  onChange={handleChange('type')}
                >
                  {TANK_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('logistics.location')}
                  value={formData.location}
                  onChange={handleChange('location')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label={t('logistics.field')}
                  value={formData.field_id}
                  onChange={handleChange('field_id')}
                >
                  <MenuItem value="">{t('common.none')}</MenuItem>
                  {fields?.map((field) => (
                    <MenuItem key={field.id} value={field.id}>
                      {field.code} - {field.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label={t('common.status')}
                  value={formData.status}
                  onChange={handleChange('status')}
                >
                  {TANK_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              {t('logistics.dimensions')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label={t('logistics.capacityBbl')}
                  value={formData.capacity}
                  onChange={handleChange('capacity')}
                  error={Boolean(formErrors.capacity)}
                  helperText={formErrors.capacity}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.currentVolumeBbl')}
                  value={formData.current_volume}
                  onChange={handleChange('current_volume')}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.diameterFt')}
                  value={formData.diameter_ft}
                  onChange={handleChange('diameter_ft')}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.heightFt')}
                  value={formData.height_ft}
                  onChange={handleChange('height_ft')}
                  inputProps={{ min: 0, step: 0.01 }}
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
          <Button variant="outlined" onClick={() => navigate('/logistics/tanks')} fullWidth={isMobile}>
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

export default TankForm;
