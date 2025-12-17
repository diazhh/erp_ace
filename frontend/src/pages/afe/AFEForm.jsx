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
import { fetchAFEById, createAFE, updateAFE, clearCurrentAFE } from '../../store/slices/afeSlice';
import { fetchFields, fetchWells } from '../../store/slices/productionSlice';
import { fetchProjects } from '../../store/slices/projectSlice';

const AFE_TYPES = ['DRILLING', 'WORKOVER', 'FACILITIES', 'EXPLORATION', 'MAINTENANCE', 'OTHER'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const CURRENCIES = ['USD', 'VES', 'EUR'];

const AFEForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentAFE, loading } = useSelector((state) => state.afe);
  const { fields, wells } = useSelector((state) => state.production);
  const { projects } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'OTHER',
    project_id: '',
    field_id: '',
    well_id: '',
    estimated_cost: '',
    currency: 'USD',
    start_date: '',
    end_date: '',
    justification: '',
    priority: 'MEDIUM',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
    dispatch(fetchProjects({ limit: 100 }));
    return () => {
      dispatch(clearCurrentAFE());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchAFEById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (formData.field_id) {
      dispatch(fetchWells({ fieldId: formData.field_id, limit: 100 }));
    }
  }, [dispatch, formData.field_id]);

  useEffect(() => {
    if (isEdit && currentAFE) {
      setFormData({
        title: currentAFE.title || '',
        description: currentAFE.description || '',
        type: currentAFE.type || 'OTHER',
        project_id: currentAFE.project_id || '',
        field_id: currentAFE.field_id || '',
        well_id: currentAFE.well_id || '',
        estimated_cost: currentAFE.estimated_cost || '',
        currency: currentAFE.currency || 'USD',
        start_date: currentAFE.start_date || '',
        end_date: currentAFE.end_date || '',
        justification: currentAFE.justification || '',
        priority: currentAFE.priority || 'MEDIUM',
        notes: currentAFE.notes || '',
      });
    }
  }, [isEdit, currentAFE]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'field_id') {
        newData.well_id = '';
      }
      return newData;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = t('validation.required');
    if (!formData.type) newErrors.type = t('validation.required');
    if (!formData.estimated_cost || parseFloat(formData.estimated_cost) <= 0) {
      newErrors.estimated_cost = t('validation.required');
    }
    if (!formData.justification.trim()) newErrors.justification = t('validation.required');
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
        estimated_cost: parseFloat(formData.estimated_cost),
        project_id: formData.project_id || null,
        field_id: formData.field_id || null,
        well_id: formData.well_id || null,
      };

      if (isEdit) {
        await dispatch(updateAFE({ id, data: dataToSubmit })).unwrap();
      } else {
        const result = await dispatch(createAFE(dataToSubmit)).unwrap();
        navigate(`/afe/${result.id}`);
        return;
      }
      navigate(`/afe/${id}`);
    } catch (error) {
      setSubmitError(error.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/afe')}>
          {t('common.back')}
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? t('afe.edit') : t('afe.new')}
        </Typography>
      </Box>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('afe.basicInfo')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="title"
                label={t('afe.titleField')}
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="description"
                label={t('common.description')}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                required
                select
                name="type"
                label={t('afe.type.label')}
                value={formData.type}
                onChange={handleChange}
                error={!!errors.type}
                helperText={errors.type}
              >
                {AFE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`afe.type.${type}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                required
                select
                name="priority"
                label={t('afe.priority')}
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {t(`afe.priorities.${priority}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('afe.financialInfo')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                required
                type="number"
                name="estimated_cost"
                label={t('afe.estimatedCost')}
                value={formData.estimated_cost}
                onChange={handleChange}
                error={!!errors.estimated_cost}
                helperText={errors.estimated_cost}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                name="currency"
                label={t('afe.currency')}
                value={formData.currency}
                onChange={handleChange}
              >
                {CURRENCIES.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('afe.locationInfo')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                name="project_id"
                label={t('projects.project')}
                value={formData.project_id}
                onChange={handleChange}
              >
                <MenuItem value="">{t('common.none')}</MenuItem>
                {projects?.data?.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.code} - {project.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                name="field_id"
                label={t('production.field')}
                value={formData.field_id}
                onChange={handleChange}
              >
                <MenuItem value="">{t('common.none')}</MenuItem>
                {fields?.map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                name="well_id"
                label={t('production.well')}
                value={formData.well_id}
                onChange={handleChange}
                disabled={!formData.field_id}
              >
                <MenuItem value="">{t('common.none')}</MenuItem>
                {wells?.map((well) => (
                  <MenuItem key={well.id} value={well.id}>
                    {well.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('afe.schedule')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="start_date"
                label={t('afe.startDate')}
                value={formData.start_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="end_date"
                label={t('afe.endDate')}
                value={formData.end_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('afe.justificationSection')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                name="justification"
                label={t('afe.justification')}
                value={formData.justification}
                onChange={handleChange}
                error={!!errors.justification}
                helperText={errors.justification || t('afe.justificationHelp')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="notes"
                label={t('common.notes')}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/afe')}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={submitting}
            >
              {isEdit ? t('common.save') : t('common.create')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AFEForm;
