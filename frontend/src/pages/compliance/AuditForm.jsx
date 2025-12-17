import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Button, TextField, MenuItem, Grid, CircularProgress, Alert, Divider } from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createAudit, updateAudit, fetchAuditById, clearCurrentAudit } from '../../store/slices/complianceSlice';

const AUDIT_TYPES = ['INTERNAL', 'EXTERNAL', 'REGULATORY', 'CERTIFICATION', 'SURVEILLANCE'];

const AuditForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { currentAudit, loading, error } = useSelector((state) => state.compliance);

  const [formData, setFormData] = useState({
    title: '', type: 'INTERNAL', auditor_name: '', auditor_company: '',
    scope: '', objectives: '', criteria: '', start_date: '', end_date: '',
    recommendations: '', notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) dispatch(fetchAuditById(id));
    return () => { dispatch(clearCurrentAudit()); };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentAudit) {
      const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
      setFormData({
        title: currentAudit.title || '', type: currentAudit.type || 'INTERNAL',
        auditor_name: currentAudit.auditor_name || '', auditor_company: currentAudit.auditor_company || '',
        scope: currentAudit.scope || '', objectives: currentAudit.objectives || '',
        criteria: currentAudit.criteria || '', start_date: formatDate(currentAudit.start_date),
        end_date: formatDate(currentAudit.end_date), recommendations: currentAudit.recommendations || '',
        notes: currentAudit.notes || '',
      });
    }
  }, [isEdit, currentAudit]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = t('validation.required');
    if (!formData.start_date) errors.start_date = t('validation.required');
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isEdit) await dispatch(updateAudit({ id, data: formData })).unwrap();
      else await dispatch(createAudit(formData)).unwrap();
      navigate('/compliance/audits');
    } catch (err) { console.error('Error saving audit:', err); }
    finally { setSubmitting(false); }
  };

  if (isEdit && loading && !currentAudit) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/compliance/audits')}>{t('common.back')}</Button>
        <Typography variant="h5" fontWeight="bold">{isEdit ? t('compliance.editAudit') : t('compliance.newAudit')}</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h6" gutterBottom>{t('compliance.basicInfo')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12}><TextField fullWidth required label={t('compliance.title')} value={formData.title} onChange={handleChange('title')} error={Boolean(formErrors.title)} helperText={formErrors.title} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth required select label={t('compliance.type')} value={formData.type} onChange={handleChange('type')}>
              {AUDIT_TYPES.map((type) => <MenuItem key={type} value={type}>{t(`compliance.auditType.${type.toLowerCase()}`)}</MenuItem>)}
            </TextField></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label={t('compliance.auditorName')} value={formData.auditor_name} onChange={handleChange('auditor_name')} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label={t('compliance.auditorCompany')} value={formData.auditor_company} onChange={handleChange('auditor_company')} /></Grid>
            
            <Grid item xs={12}><Typography variant="h6" gutterBottom sx={{ mt: 2 }}>{t('compliance.auditScope')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label={t('compliance.scope')} value={formData.scope} onChange={handleChange('scope')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label={t('compliance.objectives')} value={formData.objectives} onChange={handleChange('objectives')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label={t('compliance.criteria')} value={formData.criteria} onChange={handleChange('criteria')} /></Grid>
            
            <Grid item xs={12}><Typography variant="h6" gutterBottom sx={{ mt: 2 }}>{t('compliance.dates')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth required type="date" label={t('compliance.startDate')} value={formData.start_date} onChange={handleChange('start_date')} InputLabelProps={{ shrink: true }} error={Boolean(formErrors.start_date)} helperText={formErrors.start_date} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="date" label={t('compliance.endDate')} value={formData.end_date} onChange={handleChange('end_date')} InputLabelProps={{ shrink: true }} /></Grid>
            
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label={t('compliance.recommendations')} value={formData.recommendations} onChange={handleChange('recommendations')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label={t('compliance.notes')} value={formData.notes} onChange={handleChange('notes')} /></Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/compliance/audits')}>{t('common.cancel')}</Button>
                <Button type="submit" variant="contained" startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />} disabled={submitting}>{t('common.save')}</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AuditForm;
