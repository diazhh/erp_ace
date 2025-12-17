import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Button, TextField, MenuItem, Grid, CircularProgress, Alert, Divider } from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createPermit, updatePermit, fetchPermitById, clearCurrentPermit } from '../../store/slices/complianceSlice';

const PERMIT_TYPES = ['EIA', 'WATER', 'EMISSIONS', 'WASTE', 'DRILLING', 'CONSTRUCTION', 'OPERATION', 'DISCHARGE', 'OTHER'];
const PERMIT_STATUSES = ['ACTIVE', 'EXPIRED', 'PENDING_RENEWAL', 'REVOKED', 'SUSPENDED', 'PENDING_APPROVAL'];

const PermitForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { currentPermit, loading, error } = useSelector((state) => state.compliance);

  const [formData, setFormData] = useState({
    name: '', type: 'OTHER', issuing_authority: '', permit_number: '', description: '',
    issue_date: '', expiry_date: '', renewal_date: '', status: 'PENDING_APPROVAL',
    cost: '', currency: 'USD', notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) dispatch(fetchPermitById(id));
    return () => { dispatch(clearCurrentPermit()); };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentPermit) {
      const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
      setFormData({
        name: currentPermit.name || '', type: currentPermit.type || 'OTHER',
        issuing_authority: currentPermit.issuing_authority || '', permit_number: currentPermit.permit_number || '',
        description: currentPermit.description || '', issue_date: formatDate(currentPermit.issue_date),
        expiry_date: formatDate(currentPermit.expiry_date), renewal_date: formatDate(currentPermit.renewal_date),
        status: currentPermit.status || 'PENDING_APPROVAL', cost: currentPermit.cost || '',
        currency: currentPermit.currency || 'USD', notes: currentPermit.notes || '',
      });
    }
  }, [isEdit, currentPermit]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('validation.required');
    if (!formData.issuing_authority.trim()) errors.issuing_authority = t('validation.required');
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
      if (isEdit) await dispatch(updatePermit({ id, data: dataToSend })).unwrap();
      else await dispatch(createPermit(dataToSend)).unwrap();
      navigate('/compliance/permits');
    } catch (err) { console.error('Error saving permit:', err); }
    finally { setSubmitting(false); }
  };

  if (isEdit && loading && !currentPermit) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/compliance/permits')}>{t('common.back')}</Button>
        <Typography variant="h5" fontWeight="bold">{isEdit ? t('compliance.editPermit') : t('compliance.newPermit')}</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h6" gutterBottom>{t('compliance.basicInfo')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12}><TextField fullWidth required label={t('compliance.name')} value={formData.name} onChange={handleChange('name')} error={Boolean(formErrors.name)} helperText={formErrors.name} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth required select label={t('compliance.type')} value={formData.type} onChange={handleChange('type')}>
              {PERMIT_TYPES.map((type) => <MenuItem key={type} value={type}>{t(`compliance.permitType.${type.toLowerCase()}`)}</MenuItem>)}
            </TextField></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth required select label={t('compliance.status')} value={formData.status} onChange={handleChange('status')}>
              {PERMIT_STATUSES.map((s) => <MenuItem key={s} value={s}>{t(`compliance.permitStatus.${s.toLowerCase()}`)}</MenuItem>)}
            </TextField></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth required label={t('compliance.issuingAuthority')} value={formData.issuing_authority} onChange={handleChange('issuing_authority')} error={Boolean(formErrors.issuing_authority)} helperText={formErrors.issuing_authority} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label={t('compliance.permitNumber')} value={formData.permit_number} onChange={handleChange('permit_number')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label={t('compliance.description')} value={formData.description} onChange={handleChange('description')} /></Grid>
            
            <Grid item xs={12}><Typography variant="h6" gutterBottom sx={{ mt: 2 }}>{t('compliance.dates')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth type="date" label={t('compliance.issueDate')} value={formData.issue_date} onChange={handleChange('issue_date')} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth required type="date" label={t('compliance.expiryDate')} value={formData.expiry_date} onChange={handleChange('expiry_date')} InputLabelProps={{ shrink: true }} error={Boolean(formErrors.expiry_date)} helperText={formErrors.expiry_date} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth type="date" label={t('compliance.renewalDate')} value={formData.renewal_date} onChange={handleChange('renewal_date')} InputLabelProps={{ shrink: true }} /></Grid>
            
            <Grid item xs={12}><Typography variant="h6" gutterBottom sx={{ mt: 2 }}>{t('compliance.cost')}</Typography><Divider sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="number" label={t('compliance.cost')} value={formData.cost} onChange={handleChange('cost')} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth select label={t('compliance.currency')} value={formData.currency} onChange={handleChange('currency')}>
              <MenuItem value="USD">USD</MenuItem><MenuItem value="VES">VES</MenuItem><MenuItem value="EUR">EUR</MenuItem>
            </TextField></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label={t('compliance.notes')} value={formData.notes} onChange={handleChange('notes')} /></Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/compliance/permits')}>{t('common.cancel')}</Button>
                <Button type="submit" variant="contained" startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />} disabled={submitting}>{t('common.save')}</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default PermitForm;
