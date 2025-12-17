import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Button, TextField, MenuItem, Grid, CircularProgress, Alert, Divider } from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createCertification, updateCertification, fetchCertificationById, clearCurrentCertification } from '../../store/slices/complianceSlice';

const CERT_TYPES = ['ISO_9001', 'ISO_14001', 'ISO_45001', 'ISO_27001', 'API', 'ASME', 'OHSAS', 'HACCP', 'OTHER'];
const CERT_STATUSES = ['ACTIVE', 'EXPIRED', 'SUSPENDED', 'WITHDRAWN', 'PENDING'];
const SURVEILLANCE_FREQ = ['ANNUAL', 'SEMI_ANNUAL', 'QUARTERLY', 'OTHER'];

const CertificationForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { currentCertification, loading, error } = useSelector((state) => state.compliance);

  const [formData, setFormData] = useState({
    name: '', type: 'OTHER', type_name: '', issuing_body: '', certificate_number: '',
    description: '', scope: '', issue_date: '', expiry_date: '', last_audit_date: '',
    next_audit_date: '', status: 'PENDING', surveillance_frequency: '',
    cost: '', currency: 'USD', notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) dispatch(fetchCertificationById(id));
    return () => { dispatch(clearCurrentCertification()); };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentCertification) {
      const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
      setFormData({
        name: currentCertification.name || '', type: currentCertification.type || 'OTHER',
        type_name: currentCertification.type_name || '', issuing_body: currentCertification.issuing_body || '',
        certificate_number: currentCertification.certificate_number || '', description: currentCertification.description || '',
        scope: currentCertification.scope || '', issue_date: formatDate(currentCertification.issue_date),
        expiry_date: formatDate(currentCertification.expiry_date), last_audit_date: formatDate(currentCertification.last_audit_date),
        next_audit_date: formatDate(currentCertification.next_audit_date), status: currentCertification.status || 'PENDING',
        surveillance_frequency: currentCertification.surveillance_frequency || '',
        cost: currentCertification.cost || '', currency: currentCertification.currency || 'USD',
        notes: currentCertification.notes || '',
      });
    }
  }, [isEdit, currentCertification]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('validation.required');
    if (!formData.issuing_body.trim()) errors.issuing_body = t('validation.required');
    if (!formData.issue_date) errors.issue_date = t('validation.required');
    if (!formData.expiry_date) errors.expiry_date = t('validation.required');
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const dataToSend = { ...formData };
      if (dataToSend.cost === '') delete dataToSend.cost;
      if (isEdit) await dispatch(updateCertification({ id, data: dataToSend })).unwrap();
      else await dispatch(createCertification(dataToSend)).unwrap();
      navigate('/compliance/certifications');
    } catch (err) { console.error('Error saving certification:', err); }
    finally { setSubmitting(false); }
  };

  if (isEdit && loading && !currentCertification) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/compliance/certifications')}>{t('common.back')}</Button>
        <Typography variant="h5" fontWeight="bold">{isEdit ? t('compliance.editCertification') : t('compliance.newCertification')}</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h6" gutterBottom>{t('compliance.basicInfo')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12}><TextField fullWidth required label={t('compliance.name')} value={formData.name} onChange={handleChange('name')} error={Boolean(formErrors.name)} helperText={formErrors.name} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth required select label={t('compliance.type')} value={formData.type} onChange={handleChange('type')}>
              {CERT_TYPES.map((type) => <MenuItem key={type} value={type}>{type.replace('_', ' ')}</MenuItem>)}
            </TextField></Grid>
            {formData.type === 'OTHER' && (
              <Grid item xs={12} md={6}><TextField fullWidth label={t('compliance.typeName')} value={formData.type_name} onChange={handleChange('type_name')} /></Grid>
            )}
            <Grid item xs={12} md={6}><TextField fullWidth required select label={t('compliance.status')} value={formData.status} onChange={handleChange('status')}>
              {CERT_STATUSES.map((s) => <MenuItem key={s} value={s}>{t(`compliance.certStatus.${s.toLowerCase()}`)}</MenuItem>)}
            </TextField></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth required label={t('compliance.issuingBody')} value={formData.issuing_body} onChange={handleChange('issuing_body')} error={Boolean(formErrors.issuing_body)} helperText={formErrors.issuing_body} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label={t('compliance.certificateNumber')} value={formData.certificate_number} onChange={handleChange('certificate_number')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label={t('compliance.description')} value={formData.description} onChange={handleChange('description')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label={t('compliance.scope')} value={formData.scope} onChange={handleChange('scope')} /></Grid>
            
            <Grid item xs={12}><Typography variant="h6" gutterBottom sx={{ mt: 2 }}>{t('compliance.dates')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth required type="date" label={t('compliance.issueDate')} value={formData.issue_date} onChange={handleChange('issue_date')} InputLabelProps={{ shrink: true }} error={Boolean(formErrors.issue_date)} helperText={formErrors.issue_date} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth required type="date" label={t('compliance.expiryDate')} value={formData.expiry_date} onChange={handleChange('expiry_date')} InputLabelProps={{ shrink: true }} error={Boolean(formErrors.expiry_date)} helperText={formErrors.expiry_date} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="date" label={t('compliance.lastAuditDate')} value={formData.last_audit_date} onChange={handleChange('last_audit_date')} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="date" label={t('compliance.nextAuditDate')} value={formData.next_audit_date} onChange={handleChange('next_audit_date')} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth select label={t('compliance.surveillanceFrequency')} value={formData.surveillance_frequency} onChange={handleChange('surveillance_frequency')}>
              <MenuItem value="">{t('common.none')}</MenuItem>
              {SURVEILLANCE_FREQ.map((f) => <MenuItem key={f} value={f}>{t(`compliance.frequency.${f.toLowerCase()}`)}</MenuItem>)}
            </TextField></Grid>
            
            <Grid item xs={12}><Typography variant="h6" gutterBottom sx={{ mt: 2 }}>{t('compliance.cost')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="number" label={t('compliance.cost')} value={formData.cost} onChange={handleChange('cost')} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth select label={t('compliance.currency')} value={formData.currency} onChange={handleChange('currency')}>
              <MenuItem value="USD">USD</MenuItem><MenuItem value="VES">VES</MenuItem><MenuItem value="EUR">EUR</MenuItem>
            </TextField></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label={t('compliance.notes')} value={formData.notes} onChange={handleChange('notes')} /></Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/compliance/certifications')}>{t('common.cancel')}</Button>
                <Button type="submit" variant="contained" startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />} disabled={submitting}>{t('common.save')}</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CertificationForm;
