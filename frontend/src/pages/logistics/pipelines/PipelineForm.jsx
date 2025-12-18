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
import { createPipeline, updatePipeline, fetchPipelineById, clearCurrentPipeline } from '../../../store/slices/logisticsSlice';
import { fetchFields } from '../../../store/slices/productionSlice';

const PIPELINE_TYPES = ['CRUDE', 'GAS', 'WATER', 'MULTIPHASE', 'CONDENSATE', 'DIESEL'];
const PIPELINE_STATUSES = ['ACTIVE', 'MAINTENANCE', 'SHUTDOWN', 'DECOMMISSIONED'];

const PipelineForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = Boolean(id);

  const { currentPipeline, loading, error } = useSelector((state) => state.logistics);
  const { fields } = useSelector((state) => state.production);

  const [formData, setFormData] = useState({
    name: '',
    type: 'CRUDE',
    origin: '',
    origin_field_id: '',
    destination: '',
    destination_field_id: '',
    length_km: '',
    diameter_inches: '',
    wall_thickness_inches: '',
    material: '',
    capacity_bpd: '',
    max_pressure_psi: '',
    installation_date: '',
    operator: '',
    status: 'ACTIVE',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
    if (isEdit) {
      dispatch(fetchPipelineById(id));
    }
    return () => {
      dispatch(clearCurrentPipeline());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentPipeline) {
      setFormData({
        name: currentPipeline.name || '',
        type: currentPipeline.type || 'CRUDE',
        origin: currentPipeline.origin || '',
        origin_field_id: currentPipeline.origin_field_id || '',
        destination: currentPipeline.destination || '',
        destination_field_id: currentPipeline.destination_field_id || '',
        length_km: currentPipeline.length_km || '',
        diameter_inches: currentPipeline.diameter_inches || '',
        wall_thickness_inches: currentPipeline.wall_thickness_inches || '',
        material: currentPipeline.material || '',
        capacity_bpd: currentPipeline.capacity_bpd || '',
        max_pressure_psi: currentPipeline.max_pressure_psi || '',
        installation_date: currentPipeline.installation_date || '',
        operator: currentPipeline.operator || '',
        status: currentPipeline.status || 'ACTIVE',
        notes: currentPipeline.notes || '',
      });
    }
  }, [isEdit, currentPipeline]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('validation.required');
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
        origin_field_id: formData.origin_field_id || null,
        destination_field_id: formData.destination_field_id || null,
        length_km: formData.length_km ? parseFloat(formData.length_km) : null,
        diameter_inches: formData.diameter_inches ? parseFloat(formData.diameter_inches) : null,
        wall_thickness_inches: formData.wall_thickness_inches ? parseFloat(formData.wall_thickness_inches) : null,
        capacity_bpd: formData.capacity_bpd ? parseFloat(formData.capacity_bpd) : null,
        max_pressure_psi: formData.max_pressure_psi ? parseFloat(formData.max_pressure_psi) : null,
      };

      if (isEdit) {
        await dispatch(updatePipeline({ id, data })).unwrap();
      } else {
        await dispatch(createPipeline(data)).unwrap();
      }
      navigate('/logistics/pipelines');
    } catch (err) {
      console.error('Error saving pipeline:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading && !currentPipeline) {
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
        <Button startIcon={<BackIcon />} onClick={() => navigate('/logistics/pipelines')} fullWidth={isMobile}>
          {t('common.back')}
        </Button>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
          {isEdit ? t('logistics.editPipeline') : t('logistics.newPipeline')}
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
              {t('logistics.pipelineInfo')}
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
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label={t('logistics.type')}
                  value={formData.type}
                  onChange={handleChange('type')}
                >
                  {PIPELINE_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label={t('common.status')}
                  value={formData.status}
                  onChange={handleChange('status')}
                >
                  {PIPELINE_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              {t('logistics.routeInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('logistics.origin')}
                  value={formData.origin}
                  onChange={handleChange('origin')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label={t('logistics.originField')}
                  value={formData.origin_field_id}
                  onChange={handleChange('origin_field_id')}
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
                  label={t('logistics.destination')}
                  value={formData.destination}
                  onChange={handleChange('destination')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label={t('logistics.destinationField')}
                  value={formData.destination_field_id}
                  onChange={handleChange('destination_field_id')}
                >
                  <MenuItem value="">{t('common.none')}</MenuItem>
                  {fields?.map((field) => (
                    <MenuItem key={field.id} value={field.id}>
                      {field.code} - {field.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              {t('logistics.technicalSpecs')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.lengthKm')}
                  value={formData.length_km}
                  onChange={handleChange('length_km')}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.diameterInches')}
                  value={formData.diameter_inches}
                  onChange={handleChange('diameter_inches')}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.wallThicknessInches')}
                  value={formData.wall_thickness_inches}
                  onChange={handleChange('wall_thickness_inches')}
                  inputProps={{ min: 0, step: 0.001 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label={t('logistics.material')}
                  value={formData.material}
                  onChange={handleChange('material')}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.capacityBpd')}
                  value={formData.capacity_bpd}
                  onChange={handleChange('capacity_bpd')}
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.maxPressurePsi')}
                  value={formData.max_pressure_psi}
                  onChange={handleChange('max_pressure_psi')}
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('logistics.installationDate')}
                  value={formData.installation_date}
                  onChange={handleChange('installation_date')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label={t('logistics.operator')}
                  value={formData.operator}
                  onChange={handleChange('operator')}
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
          <Button variant="outlined" onClick={() => navigate('/logistics/pipelines')} fullWidth={isMobile}>
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

export default PipelineForm;
