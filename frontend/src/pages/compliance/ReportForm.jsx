import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createReport, updateReport, fetchReportById, clearCurrentReport } from '../../store/slices/complianceSlice';

const REPORT_TYPES = ['PRODUCTION', 'ENVIRONMENTAL', 'FISCAL', 'SAFETY', 'OPERATIONAL', 'FINANCIAL', 'OTHER'];
const REPORT_ENTITIES = ['MENPET', 'SENIAT', 'INEA', 'MINEA', 'PDVSA', 'ANH', 'OTHER'];

const ReportForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentReport, loading, error } = useSelector((state) => state.compliance);

  const [formData, setFormData] = useState({
    title: '',
    type: 'OTHER',
    entity: 'OTHER',
    entity_name: '',
    description: '',
    period_start: '',
    period_end: '',
    due_date: '',
    field_id: '',
    project_id: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchReportById(id));
    }
    return () => {
      dispatch(clearCurrentReport());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentReport) {
      const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
      setFormData({
        title: currentReport.title || '',
        type: currentReport.type || 'OTHER',
        entity: currentReport.entity || 'OTHER',
        entity_name: currentReport.entity_name || '',
        description: currentReport.description || '',
        period_start: formatDate(currentReport.period_start),
        period_end: formatDate(currentReport.period_end),
        due_date: formatDate(currentReport.due_date),
        field_id: currentReport.field_id || '',
        project_id: currentReport.project_id || '',
        notes: currentReport.notes || '',
      });
    }
  }, [isEdit, currentReport]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = t('validation.required');
    if (!formData.type) errors.type = t('validation.required');
    if (!formData.entity) errors.entity = t('validation.required');
    if (!formData.due_date) errors.due_date = t('validation.required');
    if (formData.entity === 'OTHER' && !formData.entity_name.trim()) {
      errors.entity_name = t('validation.required');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const dataToSend = { ...formData };
      if (dataToSend.field_id === '') delete dataToSend.field_id;
      if (dataToSend.project_id === '') delete dataToSend.project_id;

      if (isEdit) {
        await dispatch(updateReport({ id, data: dataToSend })).unwrap();
      } else {
        await dispatch(createReport(dataToSend)).unwrap();
      }
      navigate('/compliance/reports');
    } catch (err) {
      console.error('Error saving report:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading && !currentReport) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/compliance/reports')}>
          {t('common.back')}
        </Button>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? t('compliance.editReport') : t('compliance.newReport')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {t('compliance.basicInfo')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={t('compliance.title')}
                value={formData.title}
                onChange={handleChange('title')}
                error={Boolean(formErrors.title)}
                helperText={formErrors.title}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                select
                label={t('compliance.type')}
                value={formData.type}
                onChange={handleChange('type')}
                error={Boolean(formErrors.type)}
                helperText={formErrors.type}
              >
                {REPORT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`compliance.reportType.${type.toLowerCase()}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                select
                label={t('compliance.entity')}
                value={formData.entity}
                onChange={handleChange('entity')}
                error={Boolean(formErrors.entity)}
                helperText={formErrors.entity}
              >
                {REPORT_ENTITIES.map((entity) => (
                  <MenuItem key={entity} value={entity}>{entity}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {formData.entity === 'OTHER' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t('compliance.entityName')}
                  value={formData.entity_name}
                  onChange={handleChange('entity_name')}
                  error={Boolean(formErrors.entity_name)}
                  helperText={formErrors.entity_name}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('compliance.description')}
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('compliance.dates')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label={t('compliance.periodStart')}
                value={formData.period_start}
                onChange={handleChange('period_start')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label={t('compliance.periodEnd')}
                value={formData.period_end}
                onChange={handleChange('period_end')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                type="date"
                label={t('compliance.dueDate')}
                value={formData.due_date}
                onChange={handleChange('due_date')}
                InputLabelProps={{ shrink: true }}
                error={Boolean(formErrors.due_date)}
                helperText={formErrors.due_date}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('compliance.additionalInfo')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('compliance.notes')}
                value={formData.notes}
                onChange={handleChange('notes')}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/compliance/reports')}>
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
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ReportForm;
