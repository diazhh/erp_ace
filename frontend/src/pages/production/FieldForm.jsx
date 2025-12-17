import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createField, updateField, fetchFieldById, clearCurrentField } from '../../store/slices/productionSlice';

const FieldForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentField, loading } = useSelector((state) => state.production);
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'ONSHORE',
    status: 'ACTIVE',
    location: '',
    state: '',
    country: 'Venezuela',
    latitude: '',
    longitude: '',
    area_km2: '',
    discovery_date: '',
    production_start_date: '',
    working_interest: '100',
    basin: '',
    formation: '',
    api_gravity_avg: '',
    estimated_reserves_mmbbl: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchFieldById(id));
    }
    return () => {
      dispatch(clearCurrentField());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (currentField && isEdit) {
      setFormData({
        code: currentField.code || '',
        name: currentField.name || '',
        type: currentField.type || 'ONSHORE',
        status: currentField.status || 'ACTIVE',
        location: currentField.location || '',
        state: currentField.state || '',
        country: currentField.country || 'Venezuela',
        latitude: currentField.latitude || '',
        longitude: currentField.longitude || '',
        area_km2: currentField.area_km2 || '',
        discovery_date: currentField.discovery_date || '',
        production_start_date: currentField.production_start_date || '',
        working_interest: currentField.working_interest || '100',
        basin: currentField.basin || '',
        formation: currentField.formation || '',
        api_gravity_avg: currentField.api_gravity_avg || '',
        estimated_reserves_mmbbl: currentField.estimated_reserves_mmbbl || '',
        notes: currentField.notes || '',
      });
    }
  }, [currentField, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = t('validation.required');
    if (!formData.name.trim()) newErrors.name = t('validation.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { ...formData };
    Object.keys(data).forEach((key) => {
      if (data[key] === '') data[key] = null;
    });

    try {
      if (isEdit) {
        await dispatch(updateField({ id, data })).unwrap();
      } else {
        await dispatch(createField(data)).unwrap();
      }
      navigate('/production/fields');
    } catch (error) {
      console.error('Error saving field:', error);
    }
  };

  if (loading && isEdit && !currentField) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/production/fields')}>
          {t('common.back')}
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {isEdit ? t('production.fields.edit') : t('production.fields.new')}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            {t('production.fields.basicInfo')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                name="code"
                label={t('production.fields.code')}
                value={formData.code}
                onChange={handleChange}
                error={Boolean(errors.code)}
                helperText={errors.code}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                required
                name="name"
                label={t('production.fields.name')}
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                name="type"
                label={t('production.type.label')}
                value={formData.type}
                onChange={handleChange}
              >
                <MenuItem value="ONSHORE">{t('production.type.ONSHORE')}</MenuItem>
                <MenuItem value="OFFSHORE">{t('production.type.OFFSHORE')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                name="status"
                label={t('common.status')}
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="ACTIVE">{t('production.status.ACTIVE')}</MenuItem>
                <MenuItem value="INACTIVE">{t('production.status.INACTIVE')}</MenuItem>
                <MenuItem value="ABANDONED">{t('production.status.ABANDONED')}</MenuItem>
                <MenuItem value="UNDER_DEVELOPMENT">{t('production.status.UNDER_DEVELOPMENT')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="working_interest"
                label={t('production.fields.workingInterest')}
                type="number"
                value={formData.working_interest}
                onChange={handleChange}
                InputProps={{ endAdornment: '%' }}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            {t('production.fields.locationInfo')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="location"
                label={t('production.fields.location')}
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                name="state"
                label={t('production.fields.state')}
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                name="country"
                label={t('production.fields.country')}
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="latitude"
                label={t('production.fields.latitude')}
                type="number"
                value={formData.latitude}
                onChange={handleChange}
                inputProps={{ step: 0.0000001 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="longitude"
                label={t('production.fields.longitude')}
                type="number"
                value={formData.longitude}
                onChange={handleChange}
                inputProps={{ step: 0.0000001 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="area_km2"
                label={t('production.fields.areaKm2')}
                type="number"
                value={formData.area_km2}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            {t('production.fields.technicalInfo')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="basin"
                label={t('production.fields.basin')}
                value={formData.basin}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="formation"
                label={t('production.fields.formation')}
                value={formData.formation}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="api_gravity_avg"
                label={t('production.fields.apiGravity')}
                type="number"
                value={formData.api_gravity_avg}
                onChange={handleChange}
                InputProps={{ endAdornment: '°API' }}
                inputProps={{ min: 0, max: 70, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="estimated_reserves_mmbbl"
                label={t('production.fields.estimatedReserves')}
                type="number"
                value={formData.estimated_reserves_mmbbl}
                onChange={handleChange}
                InputProps={{ endAdornment: 'MMbbl' }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="discovery_date"
                label={t('production.fields.discoveryDate')}
                type="date"
                value={formData.discovery_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="production_start_date"
                label={t('production.fields.productionStartDate')}
                type="date"
                value={formData.production_start_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="notes"
                label={t('common.notes')}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/production/fields')}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : t('common.save')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default FieldForm;
