import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Button, Chip, Grid, CircularProgress, Alert, Divider, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack as BackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchCertificationById, clearCurrentCertification, deleteCertification } from '../../store/slices/complianceSlice';

const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'EXPIRED': return 'error';
    case 'SUSPENDED': return 'warning';
    case 'WITHDRAWN': return 'error';
    case 'PENDING': return 'info';
    default: return 'default';
  }
};

const CertificationDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentCertification: cert, loading, error } = useSelector((state) => state.compliance);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchCertificationById(id));
    return () => { dispatch(clearCurrentCertification()); };
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteCertification(id)).unwrap();
      navigate('/compliance/certifications');
    } catch (err) { console.error('Error deleting certification:', err); }
  };

  if (loading && !cert) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
  }

  if (!cert) {
    return <Box sx={{ p: 3 }}><Alert severity="error">{t('compliance.certificationNotFound')}</Alert></Box>;
  }

  const isExpired = new Date(cert.expiry_date) < new Date();
  const isAuditDue = cert.next_audit_date && new Date(cert.next_audit_date) < new Date();

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/compliance/certifications')}>{t('common.back')}</Button>
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">{cert.code}</Typography>
            <Typography variant="body2" color="text.secondary">{cert.name}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/compliance/certifications/${id}/edit`)}>{t('common.edit')}</Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialog(true)}>{t('common.delete')}</Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip label={t(`compliance.certStatus.${cert.status?.toLowerCase()}`)} color={getStatusColor(cert.status)} size="medium" />
        <Chip label={cert.type?.replace('_', ' ')} variant="outlined" size="medium" />
        {isExpired && cert.status === 'ACTIVE' && <Chip label={t('compliance.expired')} color="error" size="small" />}
        {isAuditDue && <Chip label={t('compliance.auditDue')} color="warning" size="small" />}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.type')}</Typography>
            <Typography variant="body1">{cert.type?.replace('_', ' ')}{cert.type_name ? ` - ${cert.type_name}` : ''}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.issuingBody')}</Typography>
            <Typography variant="body1">{cert.issuing_body}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.certificateNumber')}</Typography>
            <Typography variant="body1">{cert.certificate_number || '-'}</Typography>
          </Grid>
          <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.issueDate')}</Typography>
            <Typography variant="body1">{new Date(cert.issue_date).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.expiryDate')}</Typography>
            <Typography variant="body1" color={isExpired ? 'error' : 'inherit'}>{new Date(cert.expiry_date).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.lastAuditDate')}</Typography>
            <Typography variant="body1">{cert.last_audit_date ? new Date(cert.last_audit_date).toLocaleDateString() : '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.nextAuditDate')}</Typography>
            <Typography variant="body1" color={isAuditDue ? 'warning.main' : 'inherit'}>
              {cert.next_audit_date ? new Date(cert.next_audit_date).toLocaleDateString() : '-'}
            </Typography>
          </Grid>
          <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.surveillanceFrequency')}</Typography>
            <Typography variant="body1">{cert.surveillance_frequency ? t(`compliance.frequency.${cert.surveillance_frequency.toLowerCase()}`) : '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.cost')}</Typography>
            <Typography variant="body1">{cert.cost ? `${cert.currency} ${parseFloat(cert.cost).toLocaleString()}` : '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.department')}</Typography>
            <Typography variant="body1">{cert.department?.name || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.responsible')}</Typography>
            <Typography variant="body1">{cert.responsible ? `${cert.responsible.firstName} ${cert.responsible.lastName}` : '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.description')}</Typography>
            <Typography variant="body1">{cert.description || '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.scope')}</Typography>
            <Typography variant="body1">{cert.scope || '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.notes')}</Typography>
            <Typography variant="body1">{cert.notes || '-'}</Typography>
          </Grid>
          <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('common.createdBy')}</Typography>
            <Typography variant="body1">{cert.creator?.username || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('common.createdAt')}</Typography>
            <Typography variant="body1">{new Date(cert.createdAt || cert.created_at).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
        <DialogContent><Typography>{t('compliance.deleteCertificationConfirm')}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificationDetail;
