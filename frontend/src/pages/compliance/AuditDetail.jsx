import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Button, Chip, Grid, CircularProgress, Alert, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack as BackIcon, Edit as EditIcon, Delete as DeleteIcon, PlayArrow as StartIcon, CheckCircle as CompleteIcon, Lock as CloseIcon } from '@mui/icons-material';
import { fetchAuditById, clearCurrentAudit, deleteAudit, startAudit, completeAudit, closeAudit } from '../../store/slices/complianceSlice';

const getStatusColor = (status) => {
  switch (status) {
    case 'PLANNED': return 'info';
    case 'IN_PROGRESS': return 'warning';
    case 'COMPLETED': return 'success';
    case 'CLOSED': return 'default';
    case 'CANCELLED': return 'error';
    default: return 'default';
  }
};

const AuditDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentAudit: audit, loading, error } = useSelector((state) => state.compliance);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState({ open: false, action: null });

  useEffect(() => {
    dispatch(fetchAuditById(id));
    return () => { dispatch(clearCurrentAudit()); };
  }, [dispatch, id]);

  const handleAction = async () => {
    try {
      switch (actionDialog.action) {
        case 'start': await dispatch(startAudit(id)).unwrap(); break;
        case 'complete': await dispatch(completeAudit({ id, data: {} })).unwrap(); break;
        case 'close': await dispatch(closeAudit(id)).unwrap(); break;
      }
      setActionDialog({ open: false, action: null });
    } catch (err) { console.error('Error:', err); }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteAudit(id)).unwrap();
      navigate('/compliance/audits');
    } catch (err) { console.error('Error deleting audit:', err); }
  };

  if (loading && !audit) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
  }

  if (!audit) {
    return <Box sx={{ p: 3 }}><Alert severity="error">{t('compliance.auditNotFound')}</Alert></Box>;
  }

  const canEdit = ['PLANNED', 'IN_PROGRESS'].includes(audit.status);
  const canStart = audit.status === 'PLANNED';
  const canComplete = audit.status === 'IN_PROGRESS';
  const canClose = audit.status === 'COMPLETED';
  const canDelete = ['PLANNED', 'CANCELLED'].includes(audit.status);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/compliance/audits')}>{t('common.back')}</Button>
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">{audit.code}</Typography>
            <Typography variant="body2" color="text.secondary">{audit.title}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {canEdit && <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/compliance/audits/${id}/edit`)}>{t('common.edit')}</Button>}
          {canStart && <Button variant="contained" color="primary" startIcon={<StartIcon />} onClick={() => setActionDialog({ open: true, action: 'start' })}>{t('compliance.startAudit')}</Button>}
          {canComplete && <Button variant="contained" color="success" startIcon={<CompleteIcon />} onClick={() => setActionDialog({ open: true, action: 'complete' })}>{t('compliance.completeAudit')}</Button>}
          {canClose && <Button variant="contained" startIcon={<CloseIcon />} onClick={() => setActionDialog({ open: true, action: 'close' })}>{t('compliance.closeAudit')}</Button>}
          {canDelete && <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialog(true)}>{t('common.delete')}</Button>}
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}><Chip label={t(`compliance.auditStatus.${audit.status?.toLowerCase()}`)} color={getStatusColor(audit.status)} size="medium" /></Box>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }} variant={isMobile ? 'scrollable' : 'standard'} scrollButtons="auto">
        <Tab label={t('compliance.details')} />
        <Tab label={t('compliance.findings')} />
        <Tab label={t('compliance.followUp')} />
      </Tabs>

      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.type')}</Typography>
              <Typography variant="body1">{t(`compliance.auditType.${audit.type?.toLowerCase()}`)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.auditorName')}</Typography>
              <Typography variant="body1">{audit.auditor_name || audit.leadAuditor ? `${audit.leadAuditor?.firstName} ${audit.leadAuditor?.lastName}` : '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.auditorCompany')}</Typography>
              <Typography variant="body1">{audit.auditor_company || '-'}</Typography>
            </Grid>
            <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.startDate')}</Typography>
              <Typography variant="body1">{new Date(audit.start_date).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.endDate')}</Typography>
              <Typography variant="body1">{audit.end_date ? new Date(audit.end_date).toLocaleDateString() : '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.department')}</Typography>
              <Typography variant="body1">{audit.department?.name || '-'}</Typography>
            </Grid>
            <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.scope')}</Typography>
              <Typography variant="body1">{audit.scope || '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.objectives')}</Typography>
              <Typography variant="body1">{audit.objectives || '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.criteria')}</Typography>
              <Typography variant="body1">{audit.criteria || '-'}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                <Typography variant="h4" fontWeight="bold" color="error.dark">{audit.major_findings || 0}</Typography>
                <Typography variant="body2">{t('compliance.majorFindings')}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                <Typography variant="h4" fontWeight="bold" color="warning.dark">{audit.minor_findings || 0}</Typography>
                <Typography variant="body2">{t('compliance.minorFindings')}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                <Typography variant="h4" fontWeight="bold" color="info.dark">{audit.observations || 0}</Typography>
                <Typography variant="body2">{t('compliance.observations')}</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Typography variant="subtitle2" color="text.secondary">{t('compliance.conclusion')}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{audit.conclusion || '-'}</Typography>
          <Typography variant="subtitle2" color="text.secondary">{t('compliance.recommendations')}</Typography>
          <Typography variant="body1">{audit.recommendations || '-'}</Typography>
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.followUpDate')}</Typography>
              <Typography variant="body1">{audit.follow_up_date ? new Date(audit.follow_up_date).toLocaleDateString() : '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.followUpStatus')}</Typography>
              <Typography variant="body1">{audit.follow_up_status ? t(`compliance.followUpStatus.${audit.follow_up_status.toLowerCase()}`) : '-'}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, action: null })}>
        <DialogTitle>{t(`compliance.${actionDialog.action}AuditTitle`)}</DialogTitle>
        <DialogContent><Typography>{t(`compliance.${actionDialog.action}AuditConfirm`)}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, action: null })}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleAction}>{t('common.confirm')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
        <DialogContent><Typography>{t('compliance.deleteAuditConfirm')}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditDetail;
