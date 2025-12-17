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
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { 
  fetchFields, 
  fetchWells, 
  fetchProductionById,
  createProduction, 
  updateProduction,
  clearCurrentProduction,
} from '../../store/slices/productionSlice';

const DailyProductionForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { fields, wells, currentProduction, loading } = useSelector((state) => state.production);

  const [formData, setFormData] = useState({
    well_id: '',
    production_date: new Date().toISOString().split('T')[0],
    oil_volume: '',
    gas_volume: '',
    water_volume: '',
    oil_rate: '',
    gas_rate: '',
    water_rate: '',
    choke_size: '',
    tubing_pressure: '',
    casing_pressure: '',
    hours_on: '24',
    downtime_hours: '0',
    downtime_reason: '',
    bsw: '',
    api_gravity: '',
    notes: '',
  });
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
    return () => {
      dispatch(clearCurrentProduction());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchProductionById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (selectedFieldId) {
      dispatch(fetchWells({ fieldId: selectedFieldId, status: 'ACTIVE', limit: 100 }));
    }
  }, [dispatch, selectedFieldId]);

  useEffect(() => {
    if (isEdit && currentProduction) {
      setFormData({
        well_id: currentProduction.well_id || '',
        production_date: currentProduction.production_date?.split('T')[0] || '',
        oil_volume: currentProduction.oil_volume || '',
        gas_volume: currentProduction.gas_volume || '',
        water_volume: currentProduction.water_volume || '',
        oil_rate: currentProduction.oil_rate || '',
        gas_rate: currentProduction.gas_rate || '',
        water_rate: currentProduction.water_rate || '',
        choke_size: currentProduction.choke_size || '',
        tubing_pressure: currentProduction.tubing_pressure || '',
        casing_pressure: currentProduction.casing_pressure || '',
        hours_on: currentProduction.hours_on || '24',
        downtime_hours: currentProduction.downtime_hours || '0',
        downtime_reason: currentProduction.downtime_reason || '',
        bsw: currentProduction.bsw || '',
        api_gravity: currentProduction.api_gravity || '',
        notes: currentProduction.notes || '',
      });
      if (currentProduction.well?.field_id) {
        setSelectedFieldId(currentProduction.well.field_id);
      }
    }
  }, [isEdit, currentProduction]);

  const handleFieldChange = (e) => {
    const fieldId = e.target.value;
    setSelectedFieldId(fieldId);
    setFormData((prev) => ({ ...prev, well_id: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.well_id) newErrors.well_id = t('validation.required');
    if (!formData.production_date) newErrors.production_date = t('validation.required');
    if (formData.oil_volume === '' || formData.oil_volume < 0) {
      newErrors.oil_volume = t('validation.required');
    }
    if (formData.gas_volume === '' || formData.gas_volume < 0) {
      newErrors.gas_volume = t('validation.required');
    }
    if (formData.water_volume === '' || formData.water_volume < 0) {
      newErrors.water_volume = t('validation.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const dataToSubmit = {
        ...formData,
        oil_volume: parseFloat(formData.oil_volume) || 0,
        gas_volume: parseFloat(formData.gas_volume) || 0,
        water_volume: parseFloat(formData.water_volume) || 0,
        oil_rate: formData.oil_rate ? parseFloat(formData.oil_rate) : null,
        gas_rate: formData.gas_rate ? parseFloat(formData.gas_rate) : null,
        water_rate: formData.water_rate ? parseFloat(formData.water_rate) : null,
        choke_size: formData.choke_size ? parseFloat(formData.choke_size) : null,
        tubing_pressure: formData.tubing_pressure ? parseFloat(formData.tubing_pressure) : null,
        casing_pressure: formData.casing_pressure ? parseFloat(formData.casing_pressure) : null,
        hours_on: parseFloat(formData.hours_on) || 24,
        downtime_hours: parseFloat(formData.downtime_hours) || 0,
        bsw: formData.bsw ? parseFloat(formData.bsw) : null,
        api_gravity: formData.api_gravity ? parseFloat(formData.api_gravity) : null,
      };

      if (isEdit) {
        await dispatch(updateProduction({ id, data: dataToSubmit })).unwrap();
      } else {
        await dispatch(createProduction(dataToSubmit)).unwrap();
      }
      navigate('/production/daily');
    } catch (error) {
      setSubmitError(error.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading && !currentProduction) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/production/daily')}>
          {t('common.back')}
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? t('production.daily.edit') : t('production.daily.new')}
        </Typography>
      </Box>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('production.daily.basicInfo')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label={t('production.field')}
                value={selectedFieldId}
                onChange={handleFieldChange}
                required
              >
                <MenuItem value="">{t('production.selectField')}</MenuItem>
                {fields.map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                name="well_id"
                label={t('production.well')}
                value={formData.well_id}
                onChange={handleChange}
                error={!!errors.well_id}
                helperText={errors.well_id}
                required
                disabled={!selectedFieldId}
              >
                <MenuItem value="">{t('production.selectWell')}</MenuItem>
                {wells.map((well) => (
                  <MenuItem key={well.id} value={well.id}>
                    {well.code} - {well.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                name="production_date"
                label={t('production.productionDate')}
                value={formData.production_date}
                onChange={handleChange}
                error={!!errors.production_date}
                helperText={errors.production_date}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('production.daily.volumes')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                name="oil_volume"
                label={t('production.oilBbl')}
                value={formData.oil_volume}
                onChange={handleChange}
                error={!!errors.oil_volume}
                helperText={errors.oil_volume}
                required
                InputProps={{
                  endAdornment: <InputAdornment position="end">bbl</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                name="gas_volume"
                label={t('production.gasMcf')}
                value={formData.gas_volume}
                onChange={handleChange}
                error={!!errors.gas_volume}
                helperText={errors.gas_volume}
                required
                InputProps={{
                  endAdornment: <InputAdornment position="end">mcf</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                name="water_volume"
                label={t('production.waterBbl')}
                value={formData.water_volume}
                onChange={handleChange}
                error={!!errors.water_volume}
                helperText={errors.water_volume}
                required
                InputProps={{
                  endAdornment: <InputAdornment position="end">bbl</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                name="oil_rate"
                label={t('production.daily.oilRate')}
                value={formData.oil_rate}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">bopd</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                name="gas_rate"
                label={t('production.daily.gasRate')}
                value={formData.gas_rate}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">mcfd</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                name="water_rate"
                label={t('production.daily.waterRate')}
                value={formData.water_rate}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">bwpd</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('production.daily.pressures')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                name="choke_size"
                label={t('production.chokeSize')}
                value={formData.choke_size}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">/64"</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                name="tubing_pressure"
                label={t('production.tubingPressure')}
                value={formData.tubing_pressure}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">psi</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                name="casing_pressure"
                label={t('production.casingPressure')}
                value={formData.casing_pressure}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">psi</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                name="bsw"
                label={t('production.bsw')}
                value={formData.bsw}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('production.daily.operationalInfo')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                name="hours_on"
                label={t('production.hoursOn')}
                value={formData.hours_on}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">h</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 24, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                name="downtime_hours"
                label={t('production.daily.downtimeHours')}
                value={formData.downtime_hours}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">h</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 24, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                name="api_gravity"
                label={t('production.apiGravity')}
                value={formData.api_gravity}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">°API</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 70, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="downtime_reason"
                label={t('production.daily.downtimeReason')}
                value={formData.downtime_reason}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="notes"
                label={t('common.notes')}
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate('/production/daily')}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={submitting}
            >
              {t('common.save')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default DailyProductionForm;
