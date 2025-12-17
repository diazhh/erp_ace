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
import { createWell, updateWell, fetchWellById, fetchFields, clearCurrentWell } from '../../store/slices/productionSlice';

const WellForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentWell, fields, loading } = useSelector((state) => state.production);
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    field_id: '',
    type: 'PRODUCER',
    status: 'ACTIVE',
    classification: 'OIL',
    spud_date: '',
    completion_date: '',
    first_production_date: '',
    total_depth_ft: '',
    current_depth_ft: '',
    perforation_top_ft: '',
    perforation_bottom_ft: '',
    api_gravity: '',
    formation: '',
    latitude: '',
    longitude: '',
    elevation_ft: '',
    artificial_lift: 'NONE',
    pump_model: '',
    pump_depth_ft: '',
    motor_hp: '',
    strokes_per_minute: '',
    gas_injection_rate: '',
    casing_size: '',
    tubing_size: '',
    last_workover_date: '',
    last_maintenance_date: '',
    next_maintenance_date: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
    if (isEdit) {
      dispatch(fetchWellById(id));
    }
    return () => {
      dispatch(clearCurrentWell());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (currentWell && isEdit) {
      setFormData({
        code: currentWell.code || '',
        name: currentWell.name || '',
        field_id: currentWell.field_id || '',
        type: currentWell.type || 'PRODUCER',
        status: currentWell.status || 'ACTIVE',
        classification: currentWell.classification || 'OIL',
        spud_date: currentWell.spud_date || '',
        completion_date: currentWell.completion_date || '',
        first_production_date: currentWell.first_production_date || '',
        total_depth_ft: currentWell.total_depth_ft || '',
        current_depth_ft: currentWell.current_depth_ft || '',
        perforation_top_ft: currentWell.perforation_top_ft || '',
        perforation_bottom_ft: currentWell.perforation_bottom_ft || '',
        api_gravity: currentWell.api_gravity || '',
        formation: currentWell.formation || '',
        latitude: currentWell.latitude || '',
        longitude: currentWell.longitude || '',
        elevation_ft: currentWell.elevation_ft || '',
        artificial_lift: currentWell.artificial_lift || 'NONE',
        pump_model: currentWell.pump_model || '',
        pump_depth_ft: currentWell.pump_depth_ft || '',
        motor_hp: currentWell.motor_hp || '',
        strokes_per_minute: currentWell.strokes_per_minute || '',
        gas_injection_rate: currentWell.gas_injection_rate || '',
        casing_size: currentWell.casing_size || '',
        tubing_size: currentWell.tubing_size || '',
        last_workover_date: currentWell.last_workover_date || '',
        last_maintenance_date: currentWell.last_maintenance_date || '',
        next_maintenance_date: currentWell.next_maintenance_date || '',
        notes: currentWell.notes || '',
      });
    }
  }, [currentWell, isEdit]);

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
    if (!formData.field_id) newErrors.field_id = t('validation.required');
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
        await dispatch(updateWell({ id, data })).unwrap();
      } else {
        await dispatch(createWell(data)).unwrap();
      }
      navigate('/production/wells');
    } catch (error) {
      console.error('Error saving well:', error);
    }
  };

  if (loading && isEdit && !currentWell) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const wellTypes = ['PRODUCER', 'INJECTOR', 'OBSERVATION', 'DISPOSAL', 'EXPLORATION'];
  const wellStatuses = ['ACTIVE', 'INACTIVE', 'SHUT_IN', 'ABANDONED', 'DRILLING', 'COMPLETING', 'WORKOVER'];
  const classifications = ['OIL', 'GAS', 'OIL_GAS', 'WATER'];
  const liftMethods = ['NONE', 'ESP', 'ROD_PUMP', 'GAS_LIFT', 'PCP', 'JET_PUMP', 'PLUNGER', 'HYDRAULIC_PUMP', 'BCP'];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/production/wells')}>
          {t('common.back')}
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {isEdit ? t('production.wells.edit') : t('production.wells.new')}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          {/* Información Básica */}
          <Typography variant="h6" gutterBottom>{t('production.basicInfo')}</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                name="code"
                label={t('production.wellCode')}
                value={formData.code}
                onChange={handleChange}
                error={!!errors.code}
                helperText={errors.code}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                name="name"
                label={t('production.wellName')}
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                select
                name="field_id"
                label={t('production.field')}
                value={formData.field_id}
                onChange={handleChange}
                error={!!errors.field_id}
                helperText={errors.field_id}
              >
                {fields.map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.code} - {field.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                name="type"
                label={t('production.wellType.label')}
                value={formData.type}
                onChange={handleChange}
              >
                {wellTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`production.wellType.${type}`)}
                  </MenuItem>
                ))}
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
                {wellStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {t(`production.wellStatus.${status}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                name="classification"
                label={t('production.classification.label')}
                value={formData.classification}
                onChange={handleChange}
              >
                {classifications.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {t(`production.classification.${cls}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Fechas */}
          <Typography variant="h6" gutterBottom>{t('production.dates')}</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                name="spud_date"
                label={t('production.spudDate')}
                value={formData.spud_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                name="completion_date"
                label={t('production.completionDate')}
                value={formData.completion_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                name="first_production_date"
                label={t('production.firstProductionDate')}
                value={formData.first_production_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                name="last_workover_date"
                label={t('production.lastWorkoverDate')}
                value={formData.last_workover_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                name="last_maintenance_date"
                label={t('production.lastMaintenanceDate')}
                value={formData.last_maintenance_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                name="next_maintenance_date"
                label={t('production.nextMaintenanceDate')}
                value={formData.next_maintenance_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Información Técnica */}
          <Typography variant="h6" gutterBottom>{t('production.technicalInfo')}</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                name="total_depth_ft"
                label={t('production.totalDepth')}
                value={formData.total_depth_ft}
                onChange={handleChange}
                InputProps={{ endAdornment: 'ft' }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                name="current_depth_ft"
                label={t('production.currentDepth')}
                value={formData.current_depth_ft}
                onChange={handleChange}
                InputProps={{ endAdornment: 'ft' }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                name="perforation_top_ft"
                label={t('production.perforationTop')}
                value={formData.perforation_top_ft}
                onChange={handleChange}
                InputProps={{ endAdornment: 'ft' }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                name="perforation_bottom_ft"
                label={t('production.perforationBottom')}
                value={formData.perforation_bottom_ft}
                onChange={handleChange}
                InputProps={{ endAdornment: 'ft' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="formation"
                label={t('production.formation')}
                value={formData.formation}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                name="api_gravity"
                label={t('production.apiGravity')}
                value={formData.api_gravity}
                onChange={handleChange}
                InputProps={{ endAdornment: '°' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="casing_size"
                label={t('production.casingSize')}
                value={formData.casing_size}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="tubing_size"
                label={t('production.tubingSize')}
                value={formData.tubing_size}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Sistema de Levantamiento */}
          <Typography variant="h6" gutterBottom>{t('production.liftSystem')}</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                name="artificial_lift"
                label={t('production.artificialLift')}
                value={formData.artificial_lift}
                onChange={handleChange}
              >
                {liftMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {t(`production.liftMethod.${method}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="pump_model"
                label={t('production.pumpModel')}
                value={formData.pump_model}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                name="pump_depth_ft"
                label={t('production.pumpDepth')}
                value={formData.pump_depth_ft}
                onChange={handleChange}
                InputProps={{ endAdornment: 'ft' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                name="motor_hp"
                label={t('production.motorHp')}
                value={formData.motor_hp}
                onChange={handleChange}
                InputProps={{ endAdornment: 'HP' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                name="strokes_per_minute"
                label={t('production.strokesPerMinute')}
                value={formData.strokes_per_minute}
                onChange={handleChange}
                InputProps={{ endAdornment: 'SPM' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                name="gas_injection_rate"
                label={t('production.gasInjectionRate')}
                value={formData.gas_injection_rate}
                onChange={handleChange}
                InputProps={{ endAdornment: 'mcf/d' }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Ubicación */}
          <Typography variant="h6" gutterBottom>{t('production.location')}</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                name="latitude"
                label={t('production.latitude')}
                value={formData.latitude}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                name="longitude"
                label={t('production.longitude')}
                value={formData.longitude}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                name="elevation_ft"
                label={t('production.elevation')}
                value={formData.elevation_ft}
                onChange={handleChange}
                InputProps={{ endAdornment: 'ft' }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Notas */}
          <Typography variant="h6" gutterBottom>{t('common.notes')}</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="notes"
                label={t('common.notes')}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Botones */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/production/wells')}>
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

export default WellForm;
