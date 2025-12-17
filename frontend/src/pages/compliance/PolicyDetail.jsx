import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Button, Chip, Grid, CircularProgress, Alert, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack as BackIcon, Edit as EditIcon, Delete as DeleteIcon, Send as SendIcon, CheckCircle as ApproveIcon } from '@mui/icons-material';
import { fetchPolicyById, clearCurrentPolicy, deletePolicy, submitPolicyForReview, approvePolicy } from '../../store/slices/complianceSlice';

const getStatusColor = (status) => {
  switch (status) {
    case 'DRAFT': return 'default';
    case 'UNDER_REVIEW': return 'warning';
    case 'ACTIVE': return 'success';
    case 'SUPERSEDED': return 'info';
    case 'ARCHIVED': return 'default';
    default: return 'default';
  }
};

const PolicyDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentPolicy: policy, loading, error } = useSelector((state) => state.compliance);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState({ open: false, action: null });

  useEffect(() => {
    dispatch(fetchPolicyById(id));
    return () => { dispatch(clearCurrentPolicy()); };
  }, [dispatch, id]);

  const handleAction = async () => {
    try {
      switch (actionDialog.action) {
        case 'submit': await dispatch(submitPolicyForReview(id)).unwrap(); break;
        case 'approve': await dispatch(approvePolicy(id)).unwrap(); break;
      }
      setActionDialog({ open: false, action: null });
    } catch (err) { console.error('Error:', err); }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deletePolicy(id)).unwrap();
      navigate('/compliance/policies');
    } catch (err) { console.error('Error deleting policy:', err); }
  };

  if (loading && !policy) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
  }

  if (!policy) {
    return <Box sx={{ p: 3 }}><Alert severity="error">{t('compliance.policyNotFound')}</Alert></Box>;
  }

  const canEdit = ['DRAFT', 'UNDER_REVIEW'].includes(policy.status);
  const canSubmit = policy.status === 'DRAFT';
  const canApprove = policy.status === 'UNDER_REVIEW';
  const canDelete = policy.status === 'DRAFT';

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/compliance/policies')}>{t('common.back')}</Button>
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">{policy.code}</Typography>
            <Typography variant="body2" color="text.secondary">{policy.title}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {canEdit && <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/compliance/policies/${id}/edit`)}>{t('common.edit')}</Button>}
          {canSubmit && <Button variant="contained" color="primary" startIcon={<SendIcon />} onClick={() => setActionDialog({ open: true, action: 'submit' })}>{t('compliance.submitForReview')}</Button>}
          {canApprove && <Button variant="contained" color="success" startIcon={<ApproveIcon />} onClick={() => setActionDialog({ open: true, action: 'approve' })}>{t('compliance.approvePolicy')}</Button>}
          {canDelete && <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialog(true)}>{t('common.delete')}</Button>}
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Chip label={t(`compliance.policyStatus.${policy.status?.toLowerCase()}`)} color={getStatusColor(policy.status)} size="medium" />
        <Chip label={`v${policy.version}`} variant="outlined" size="medium" />
      </Box>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }} variant={isMobile ? 'scrollable' : 'standard'} scrollButtons="auto">
        <Tab label={t('compliance.details')} />
        <Tab label={t('compliance.content')} />
      </Tabs>

      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.category')}</Typography>
              <Typography variant="body1">{t(`compliance.policyCategory.${policy.category?.toLowerCase()}`)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.effectiveDate')}</Typography>
              <Typography variant="body1">{new Date(policy.effective_date).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.department')}</Typography>
              <Typography variant="body1">{policy.department?.name || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.owner')}</Typography>
              <Typography variant="body1">{policy.owner ? `${policy.owner.firstName} ${policy.owner.lastName}` : '-'}</Typography>
            </Grid>
            <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.approvedBy')}</Typography>
              <Typography variant="body1">{policy.approver?.username || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.approvedDate')}</Typography>
              <Typography variant="body1">{policy.approved_date ? new Date(policy.approved_date).toLocaleDateString() : '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.nextReviewDate')}</Typography>
              <Typography variant="body1" color={policy.next_review_date && new Date(policy.next_review_date) < new Date() ? 'error' : 'inherit'}>
                {policy.next_review_date ? new Date(policy.next_review_date).toLocaleDateString() : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.summary')}</Typography>
              <Typography variant="body1">{policy.summary || '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.scope')}</Typography>
              <Typography variant="body1">{policy.scope || '-'}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{policy.content || t('common.noData')}</Typography>
        </Paper>
      )}

      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, action: null })}>
        <DialogTitle>{t(`compliance.${actionDialog.action}PolicyTitle`)}</DialogTitle>
        <DialogContent><Typography>{t(`compliance.${actionDialog.action}PolicyConfirm`)}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, action: null })}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleAction}>{t('common.confirm')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
        <DialogContent><Typography>{t('compliance.deletePolicyConfirm')}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PolicyDetail;
