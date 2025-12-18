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
import { createQuality, updateQuality, fetchQualityById, clearCurrentQuality } from '../../../store/slices/logisticsSlice';
import { fetchTanks } from '../../../store/slices/logisticsSlice';
import { fetchFields } from '../../../store/slices/productionSlice';

const QUALITY_STATUSES = ['PENDING', 'ANALYZED', 'APPROVED', 'REJECTED'];

const QualityForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = Boolean(id);

  const { currentQuality, tanks, loading, error } = useSelector((state) => state.logistics);
  const { fields } = useSelector((state) => state.production);

  const [formData, setFormData] = useState({
    field_id: '',
    tank_id: '',
    sample_date: new Date().toISOString().split('T')[0],
    sample_time: '',
    sample_point: '',
    api_gravity: '',
    bsw: '',
    sulfur_content: '',
    viscosity: '',
    pour_point: '',
    salt_content: '',
    h2s_content: '',
    reid_vapor_pressure: '',
    flash_point: '',
    lab_report_number: '',
    lab_name: '',
    analyzed_by: '',
    status: 'PENDING',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
    dispatch(fetchTanks({ limit: 100 }));
    if (isEdit) {
      dispatch(fetchQualityById(id));
    }
    return () => {
      dispatch(clearCurrentQuality());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentQuality) {
      setFormData({
        field_id: currentQuality.field_id || '',
        tank_id: currentQuality.tank_id || '',
        sample_date: currentQuality.sample_date || '',
        sample_time: currentQuality.sample_time || '',
        sample_point: currentQuality.sample_point || '',
        api_gravity: currentQuality.api_gravity || '',
        bsw: currentQuality.bsw || '',
        sulfur_content: currentQuality.sulfur_content || '',
        viscosity: currentQuality.viscosity || '',
        pour_point: currentQuality.pour_point || '',
        salt_content: currentQuality.salt_content || '',
        h2s_content: currentQuality.h2s_content || '',
        reid_vapor_pressure: currentQuality.reid_vapor_pressure || '',
        flash_point: currentQuality.flash_point || '',
        lab_report_number: currentQuality.lab_report_number || '',
        lab_name: currentQuality.lab_name || '',
        analyzed_by: currentQuality.analyzed_by || '',
        status: currentQuality.status || 'PENDING',
        notes: currentQuality.notes || '',
      });
    }
  }, [isEdit, currentQuality]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.sample_date) errors.sample_date = t('validation.required');
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
        field_id: formData.field_id || null,
        tank_id: formData.tank_id || null,
        api_gravity: formData.api_gravity ? parseFloat(formData.api_gravity) : null,
        bsw: formData.bsw ? parseFloat(formData.bsw) : null,
        sulfur_content: formData.sulfur_content ? parseFloat(formData.sulfur_content) : null,
        viscosity: formData.viscosity ? parseFloat(formData.viscosity) : null,
        pour_point: formData.pour_point ? parseFloat(formData.pour_point) : null,
        salt_content: formData.salt_content ? parseFloat(formData.salt_content) : null,
        h2s_content: formData.h2s_content ? parseFloat(formData.h2s_content) : null,
        reid_vapor_pressure: formData.reid_vapor_pressure ? parseFloat(formData.reid_vapor_pressure) : null,
        flash_point: formData.flash_point ? parseFloat(formData.flash_point) : null,
      };

      if (isEdit) {
        await dispatch(updateQuality({ id, data })).unwrap();
      } else {
        await dispatch(createQuality(data)).unwrap();
      }
      navigate('/logistics/quality');
    } catch (err) {
      console.error('Error saving quality:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading && !currentQuality) {
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
        <Button startIcon={<BackIcon />} onClick={() => navigate('/logistics/quality')} fullWidth={isMobile}>
          {t('common.back')}
        </Button>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
          {isEdit ? t('logistics.editQualitySample') : t('logistics.newQualitySample')}
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
              {t('logistics.sampleInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label={t('logistics.sampleDate')}
                  value={formData.sample_date}
                  onChange={handleChange('sample_date')}
                  error={Boolean(formErrors.sample_date)}
                  helperText={formErrors.sample_date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="time"
                  label={t('logistics.sampleTime')}
                  value={formData.sample_time}
                  onChange={handleChange('sample_time')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label={t('common.status')}
                  value={formData.status}
                  onChange={handleChange('status')}
                >
                  {QUALITY_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </TextField>
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
                  label={t('logistics.tank')}
                  value={formData.tank_id}
                  onChange={handleChange('tank_id')}
                >
                  <MenuItem value="">{t('common.none')}</MenuItem>
                  {tanks?.map((tank) => (
                    <MenuItem key={tank.id} value={tank.id}>
                      {tank.code} - {tank.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('logistics.samplePoint')}
                  value={formData.sample_point}
                  onChange={handleChange('sample_point')}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              {t('logistics.qualityParameters')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.apiGravity')}
                  value={formData.api_gravity}
                  onChange={handleChange('api_gravity')}
                  inputProps={{ step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.bswPercent')}
                  value={formData.bsw}
                  onChange={handleChange('bsw')}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.sulfurPercent')}
                  value={formData.sulfur_content}
                  onChange={handleChange('sulfur_content')}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.viscosityCst')}
                  value={formData.viscosity}
                  onChange={handleChange('viscosity')}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.pourPointF')}
                  value={formData.pour_point}
                  onChange={handleChange('pour_point')}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.saltContentPtb')}
                  value={formData.salt_content}
                  onChange={handleChange('salt_content')}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.h2sContentPpm')}
                  value={formData.h2s_content}
                  onChange={handleChange('h2s_content')}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.rvpPsi')}
                  value={formData.reid_vapor_pressure}
                  onChange={handleChange('reid_vapor_pressure')}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('logistics.flashPointF')}
                  value={formData.flash_point}
                  onChange={handleChange('flash_point')}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              {t('logistics.labInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t('logistics.labReportNumber')}
                  value={formData.lab_report_number}
                  onChange={handleChange('lab_report_number')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t('logistics.labName')}
                  value={formData.lab_name}
                  onChange={handleChange('lab_name')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t('logistics.analyzedBy')}
                  value={formData.analyzed_by}
                  onChange={handleChange('analyzed_by')}
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
          <Button variant="outlined" onClick={() => navigate('/logistics/quality')} fullWidth={isMobile}>
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

export default QualityForm;
