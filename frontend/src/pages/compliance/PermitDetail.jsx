import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Button, Chip, Grid, CircularProgress, Alert, Divider, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack as BackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchPermitById, clearCurrentPermit, deletePermit } from '../../store/slices/complianceSlice';

const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'EXPIRED': return 'error';
    case 'PENDING_RENEWAL': return 'warning';
    case 'REVOKED': return 'error';
    case 'SUSPENDED': return 'warning';
    case 'PENDING_APPROVAL': return 'info';
    default: return 'default';
  }
};

const PermitDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentPermit: permit, loading, error } = useSelector((state) => state.compliance);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchPermitById(id));
    return () => { dispatch(clearCurrentPermit()); };
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(deletePermit(id)).unwrap();
      navigate('/compliance/permits');
    } catch (err) { console.error('Error deleting permit:', err); }
  };

  if (loading && !permit) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
  }

  if (!permit) {
    return <Box sx={{ p: 3 }}><Alert severity="error">{t('compliance.permitNotFound')}</Alert></Box>;
  }

  const isExpired = new Date(permit.expiry_date) < new Date();

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/compliance/permits')}>{t('common.back')}</Button>
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">{permit.code}</Typography>
            <Typography variant="body2" color="text.secondary">{permit.name}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/compliance/permits/${id}/edit`)}>{t('common.edit')}</Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialog(true)}>{t('common.delete')}</Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}>
        <Chip label={t(`compliance.permitStatus.${permit.status?.toLowerCase()}`)} color={getStatusColor(permit.status)} size="medium" />
        {isExpired && permit.status === 'ACTIVE' && <Chip label={t('compliance.expired')} color="error" size="small" sx={{ ml: 1 }} />}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.type')}</Typography>
            <Typography variant="body1">{t(`compliance.permitType.${permit.type?.toLowerCase()}`)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.issuingAuthority')}</Typography>
            <Typography variant="body1">{permit.issuing_authority}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.permitNumber')}</Typography>
            <Typography variant="body1">{permit.permit_number || '-'}</Typography>
          </Grid>
          <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.issueDate')}</Typography>
            <Typography variant="body1">{permit.issue_date ? new Date(permit.issue_date).toLocaleDateString() : '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.expiryDate')}</Typography>
            <Typography variant="body1" color={isExpired ? 'error' : 'inherit'}>{new Date(permit.expiry_date).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.renewalDate')}</Typography>
            <Typography variant="body1">{permit.renewal_date ? new Date(permit.renewal_date).toLocaleDateString() : '-'}</Typography>
          </Grid>
          <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.field')}</Typography>
            <Typography variant="body1">{permit.field?.name || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.project')}</Typography>
            <Typography variant="body1">{permit.project?.name || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.well')}</Typography>
            <Typography variant="body1">{permit.well?.name || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.cost')}</Typography>
            <Typography variant="body1">{permit.cost ? `${permit.currency} ${parseFloat(permit.cost).toLocaleString()}` : '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.description')}</Typography>
            <Typography variant="body1">{permit.description || '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">{t('compliance.notes')}</Typography>
            <Typography variant="body1">{permit.notes || '-'}</Typography>
          </Grid>
          <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('common.createdBy')}</Typography>
            <Typography variant="body1">{permit.creator?.username || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">{t('common.createdAt')}</Typography>
            <Typography variant="body1">{new Date(permit.createdAt || permit.created_at).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
        <DialogContent><Typography>{t('compliance.deletePermitConfirm')}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PermitDetail;
