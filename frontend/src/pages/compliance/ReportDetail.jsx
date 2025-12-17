import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Send as SendIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  fetchReportById,
  clearCurrentReport,
  submitReport,
  markReportSubmitted,
  updateReportResponse,
  deleteReport,
} from '../../store/slices/complianceSlice';

const getStatusColor = (status) => {
  switch (status) {
    case 'DRAFT': return 'default';
    case 'PENDING': return 'warning';
    case 'SUBMITTED': return 'info';
    case 'ACCEPTED': return 'success';
    case 'REJECTED': return 'error';
    case 'REVISION_REQUIRED': return 'warning';
    default: return 'default';
  }
};

const ReportDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { currentReport: report, loading, error } = useSelector((state) => state.compliance);

  const [tabValue, setTabValue] = useState(0);
  const [submitDialog, setSubmitDialog] = useState(false);
  const [responseDialog, setResponseDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [responseData, setResponseData] = useState({
    status: 'ACCEPTED',
    response_date: new Date().toISOString().split('T')[0],
    response_reference: '',
    response_notes: '',
  });
  const [submittedData, setSubmittedData] = useState({
    submitted_date: new Date().toISOString().split('T')[0],
    response_reference: '',
  });

  useEffect(() => {
    dispatch(fetchReportById(id));
    return () => {
      dispatch(clearCurrentReport());
    };
  }, [dispatch, id]);

  const handleSubmitReport = async () => {
    try {
      await dispatch(submitReport(id)).unwrap();
      setSubmitDialog(false);
    } catch (err) {
      console.error('Error submitting report:', err);
    }
  };

  const handleMarkSubmitted = async () => {
    try {
      await dispatch(markReportSubmitted({ id, data: submittedData })).unwrap();
      setSubmitDialog(false);
    } catch (err) {
      console.error('Error marking report as submitted:', err);
    }
  };

  const handleUpdateResponse = async () => {
    try {
      await dispatch(updateReportResponse({ id, data: responseData })).unwrap();
      setResponseDialog(false);
    } catch (err) {
      console.error('Error updating response:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteReport(id)).unwrap();
      navigate('/compliance/reports');
    } catch (err) {
      console.error('Error deleting report:', err);
    }
  };

  if (loading && !report) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t('compliance.reportNotFound')}</Alert>
      </Box>
    );
  }

  const canEdit = ['DRAFT', 'REVISION_REQUIRED'].includes(report.status);
  const canSubmit = ['DRAFT', 'REVISION_REQUIRED'].includes(report.status);
  const canUpdateResponse = report.status === 'SUBMITTED';
  const canDelete = report.status === 'DRAFT';

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/compliance/reports')}>
            {t('common.back')}
          </Button>
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
              {report.code}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {report.title}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {canEdit && (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/compliance/reports/${id}/edit`)}>
              {t('common.edit')}
            </Button>
          )}
          {canSubmit && (
            <Button variant="contained" color="primary" startIcon={<SendIcon />} onClick={() => setSubmitDialog(true)}>
              {t('compliance.submit')}
            </Button>
          )}
          {canUpdateResponse && (
            <Button variant="contained" color="info" startIcon={<AcceptIcon />} onClick={() => setResponseDialog(true)}>
              {t('compliance.updateResponse')}
            </Button>
          )}
          {canDelete && (
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialog(true)}>
              {t('common.delete')}
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Status Chip */}
      <Box sx={{ mb: 3 }}>
        <Chip
          label={t(`compliance.status.${report.status?.toLowerCase()}`)}
          color={getStatusColor(report.status)}
          size="medium"
        />
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons="auto"
      >
        <Tab label={t('compliance.details')} />
        <Tab label={t('compliance.response')} />
      </Tabs>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.type')}</Typography>
              <Typography variant="body1">{t(`compliance.reportType.${report.type?.toLowerCase()}`)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.entity')}</Typography>
              <Typography variant="body1">{report.entity}{report.entity_name ? ` - ${report.entity_name}` : ''}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.periodStart')}</Typography>
              <Typography variant="body1">{report.period_start ? new Date(report.period_start).toLocaleDateString() : '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.periodEnd')}</Typography>
              <Typography variant="body1">{report.period_end ? new Date(report.period_end).toLocaleDateString() : '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.dueDate')}</Typography>
              <Typography
                variant="body1"
                color={new Date(report.due_date) < new Date() && !['SUBMITTED', 'ACCEPTED'].includes(report.status) ? 'error' : 'inherit'}
              >
                {new Date(report.due_date).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.field')}</Typography>
              <Typography variant="body1">{report.field?.name || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.project')}</Typography>
              <Typography variant="body1">{report.project?.name || '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.description')}</Typography>
              <Typography variant="body1">{report.description || '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.notes')}</Typography>
              <Typography variant="body1">{report.notes || '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('common.createdBy')}</Typography>
              <Typography variant="body1">{report.creator?.username || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('common.createdAt')}</Typography>
              <Typography variant="body1">{new Date(report.createdAt || report.created_at).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.submittedDate')}</Typography>
              <Typography variant="body1">{report.submitted_date ? new Date(report.submitted_date).toLocaleDateString() : '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.submittedBy')}</Typography>
              <Typography variant="body1">{report.submitter?.username || '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.responseReference')}</Typography>
              <Typography variant="body1">{report.response_reference || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.responseDate')}</Typography>
              <Typography variant="body1">{report.response_date ? new Date(report.response_date).toLocaleDateString() : '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">{t('compliance.responseNotes')}</Typography>
              <Typography variant="body1">{report.response_notes || '-'}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Submit Dialog */}
      <Dialog open={submitDialog} onClose={() => setSubmitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('compliance.submitReport')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t('compliance.submitReportConfirm')}
          </Typography>
          <TextField
            fullWidth
            type="date"
            label={t('compliance.submittedDate')}
            value={submittedData.submitted_date}
            onChange={(e) => setSubmittedData((prev) => ({ ...prev, submitted_date: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('compliance.responseReference')}
            value={submittedData.response_reference}
            onChange={(e) => setSubmittedData((prev) => ({ ...prev, response_reference: e.target.value }))}
            placeholder={t('compliance.responseReferencePlaceholder')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleMarkSubmitted}>{t('compliance.markAsSubmitted')}</Button>
        </DialogActions>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={responseDialog} onClose={() => setResponseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('compliance.updateResponse')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label={t('compliance.responseStatus')}
            value={responseData.status}
            onChange={(e) => setResponseData((prev) => ({ ...prev, status: e.target.value }))}
            sx={{ mt: 2, mb: 2 }}
          >
            <MenuItem value="ACCEPTED">{t('compliance.status.accepted')}</MenuItem>
            <MenuItem value="REJECTED">{t('compliance.status.rejected')}</MenuItem>
            <MenuItem value="REVISION_REQUIRED">{t('compliance.status.revision_required')}</MenuItem>
          </TextField>
          <TextField
            fullWidth
            type="date"
            label={t('compliance.responseDate')}
            value={responseData.response_date}
            onChange={(e) => setResponseData((prev) => ({ ...prev, response_date: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('compliance.responseReference')}
            value={responseData.response_reference}
            onChange={(e) => setResponseData((prev) => ({ ...prev, response_reference: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('compliance.responseNotes')}
            value={responseData.response_notes}
            onChange={(e) => setResponseData((prev) => ({ ...prev, response_notes: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleUpdateResponse}>{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>{t('compliance.deleteReportConfirm')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportDetail;
