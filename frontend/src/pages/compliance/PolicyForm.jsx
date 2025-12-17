import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Button, TextField, MenuItem, Grid, CircularProgress, Alert, Divider } from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createPolicy, updatePolicy, fetchPolicyById, clearCurrentPolicy } from '../../store/slices/complianceSlice';

const POLICY_CATEGORIES = ['HSE', 'OPERATIONS', 'HR', 'FINANCE', 'IT', 'QUALITY', 'ENVIRONMENTAL', 'SECURITY', 'ETHICS', 'OTHER'];

const PolicyForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { currentPolicy, loading, error } = useSelector((state) => state.compliance);

  const [formData, setFormData] = useState({
    title: '', category: 'OTHER', version: '1.0', effective_date: '',
    summary: '', content: '', scope: '', next_review_date: '', notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) dispatch(fetchPolicyById(id));
    return () => { dispatch(clearCurrentPolicy()); };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentPolicy) {
      const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
      setFormData({
        title: currentPolicy.title || '', category: currentPolicy.category || 'OTHER',
        version: currentPolicy.version || '1.0', effective_date: formatDate(currentPolicy.effective_date),
        summary: currentPolicy.summary || '', content: currentPolicy.content || '',
        scope: currentPolicy.scope || '', next_review_date: formatDate(currentPolicy.next_review_date),
        notes: currentPolicy.notes || '',
      });
    }
  }, [isEdit, currentPolicy]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = t('validation.required');
    if (!formData.effective_date) errors.effective_date = t('validation.required');
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isEdit) await dispatch(updatePolicy({ id, data: formData })).unwrap();
      else await dispatch(createPolicy(formData)).unwrap();
      navigate('/compliance/policies');
    } catch (err) { console.error('Error saving policy:', err); }
    finally { setSubmitting(false); }
  };

  if (isEdit && loading && !currentPolicy) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/compliance/policies')}>{t('common.back')}</Button>
        <Typography variant="h5" fontWeight="bold">{isEdit ? t('compliance.editPolicy') : t('compliance.newPolicy')}</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h6" gutterBottom>{t('compliance.basicInfo')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12}><TextField fullWidth required label={t('compliance.title')} value={formData.title} onChange={handleChange('title')} error={Boolean(formErrors.title)} helperText={formErrors.title} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth required select label={t('compliance.category')} value={formData.category} onChange={handleChange('category')}>
              {POLICY_CATEGORIES.map((cat) => <MenuItem key={cat} value={cat}>{t(`compliance.policyCategory.${cat.toLowerCase()}`)}</MenuItem>)}
            </TextField></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label={t('compliance.version')} value={formData.version} onChange={handleChange('version')} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth required type="date" label={t('compliance.effectiveDate')} value={formData.effective_date} onChange={handleChange('effective_date')} InputLabelProps={{ shrink: true }} error={Boolean(formErrors.effective_date)} helperText={formErrors.effective_date} /></Grid>
            
            <Grid item xs={12}><Typography variant="h6" gutterBottom sx={{ mt: 2 }}>{t('compliance.policyContent')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label={t('compliance.summary')} value={formData.summary} onChange={handleChange('summary')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={6} label={t('compliance.content')} value={formData.content} onChange={handleChange('content')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label={t('compliance.scope')} value={formData.scope} onChange={handleChange('scope')} /></Grid>
            
            <Grid item xs={12}><Typography variant="h6" gutterBottom sx={{ mt: 2 }}>{t('compliance.review')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="date" label={t('compliance.nextReviewDate')} value={formData.next_review_date} onChange={handleChange('next_review_date')} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label={t('compliance.notes')} value={formData.notes} onChange={handleChange('notes')} /></Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/compliance/policies')}>{t('common.cancel')}</Button>
                <Button type="submit" variant="contained" startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />} disabled={submitting}>{t('common.save')}</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default PolicyForm;
