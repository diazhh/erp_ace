import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Calculate as CalculateIcon,
  CheckCircle as ApproveIcon,
  Payment as PayIcon,
  Edit as EditIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  fetchPeriodFull,
  generateEntries,
  approvePeriod,
  markPeriodAsPaid,
  clearCurrentPeriod,
} from '../../store/slices/payrollSlice';
import EntityLink from '../../components/common/EntityLink';
import PayrollEntryEditDialog from '../../components/payroll/PayrollEntryEditDialog';
import ConfirmDialog from '../../components/ConfirmDialog';

const statusColors = {
  DRAFT: 'default',
  CALCULATING: 'info',
  PENDING_APPROVAL: 'warning',
  APPROVED: 'primary',
  PAID: 'success',
  CANCELLED: 'error',
};

const PayrollPeriodDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPeriod, loading } = useSelector((state) => state.payroll);

  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPeriodFull(id));
    return () => {
      dispatch(clearCurrentPeriod());
    };
  }, [id, dispatch]);

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const getStatusLabel = (status) => {
    const labels = {
      DRAFT: t('payroll.statusDraft'),
      CALCULATING: t('payroll.statusCalculating'),
      PENDING_APPROVAL: t('payroll.statusPendingApproval'),
      APPROVED: t('payroll.statusApproved'),
      PAID: t('payroll.statusPaid'),
      CANCELLED: t('payroll.statusCancelled'),
    };
    return labels[status] || status;
  };

  const handleGenerateEntries = async () => {
    setActionLoading(true);
    try {
      const result = await dispatch(generateEntries({ periodId: id })).unwrap();
      toast.success(result.message);
      dispatch(fetchPeriodFull(id));
    } catch (error) {
      toast.error(error);
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, action: null });
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await dispatch(approvePeriod(id)).unwrap();
      toast.success(t('payroll.periodApproved'));
      dispatch(fetchPeriodFull(id));
    } catch (error) {
      toast.error(error);
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, action: null });
    }
  };

  const handleMarkAsPaid = async () => {
    setActionLoading(true);
    try {
      await dispatch(markPeriodAsPaid(id)).unwrap();
      toast.success(t('payroll.periodPaid'));
      dispatch(fetchPeriodFull(id));
    } catch (error) {
      toast.error(error);
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, action: null });
    }
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setEntryDialogOpen(true);
  };

  const handleCloseEntryDialog = (refresh = false) => {
    setEntryDialogOpen(false);
    setSelectedEntry(null);
    if (refresh) {
      dispatch(fetchPeriodFull(id));
    }
  };

  const handleConfirmAction = () => {
    switch (confirmDialog.action) {
      case 'generate':
        handleGenerateEntries();
        break;
      case 'approve':
        handleApprove();
        break;
      case 'pay':
        handleMarkAsPaid();
        break;
      default:
        setConfirmDialog({ open: false, action: null });
    }
  };

  if (loading || !currentPeriod) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const period = currentPeriod;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/payroll')}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            {period.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {period.code}
          </Typography>
        </Box>
        <Chip
          label={getStatusLabel(period.status)}
          color={statusColors[period.status]}
          size="medium"
        />
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('payroll.totalGross')}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(period.totalGross, period.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('payroll.totalDeductions')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                {formatCurrency(period.totalDeductions, period.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('payroll.totalNet')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {formatCurrency(period.totalNet, period.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('payroll.employees')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {period.totalEmployees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Period Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('payroll.periodInfo')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography color="text.secondary">{t('payroll.periodType')}</Typography>
            <Typography fontWeight="medium">{period.periodType}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="text.secondary">{t('payroll.startDate')}</Typography>
            <Typography fontWeight="medium">{formatDate(period.startDate)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="text.secondary">{t('payroll.endDate')}</Typography>
            <Typography fontWeight="medium">{formatDate(period.endDate)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="text.secondary">{t('payroll.paymentDate')}</Typography>
            <Typography fontWeight="medium">{formatDate(period.paymentDate)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="text.secondary">{t('payroll.currency')}</Typography>
            <Typography fontWeight="medium">{period.currency}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="text.secondary">{t('payroll.exchangeRate')}</Typography>
            <Typography fontWeight="medium">{period.exchangeRate}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {period.status === 'DRAFT' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CalculateIcon />}
              onClick={() => setConfirmDialog({ open: true, action: 'generate' })}
              disabled={actionLoading}
            >
              {t('payroll.generateEntries')}
            </Button>
          )}
          {['CALCULATING', 'PENDING_APPROVAL'].includes(period.status) && (
            <Button
              variant="contained"
              color="success"
              startIcon={<ApproveIcon />}
              onClick={() => setConfirmDialog({ open: true, action: 'approve' })}
              disabled={actionLoading}
            >
              {t('payroll.approve')}
            </Button>
          )}
          {period.status === 'APPROVED' && (
            <Button
              variant="contained"
              color="warning"
              startIcon={<PayIcon />}
              onClick={() => setConfirmDialog({ open: true, action: 'pay' })}
              disabled={actionLoading}
            >
              {t('payroll.markAsPaid')}
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            disabled={!period.entries?.length}
          >
            {t('payroll.printPayroll')}
          </Button>
        </Box>
      </Paper>

      {/* Entries Table */}
      <Paper>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">
            {t('payroll.entries')}
          </Typography>
        </Box>
        <Divider />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('employees.firstName')}</TableCell>
                <TableCell>{t('employees.lastName')}</TableCell>
                <TableCell>{t('employees.position')}</TableCell>
                <TableCell align="right">{t('payroll.baseSalary')}</TableCell>
                <TableCell align="right">{t('payroll.grossPay')}</TableCell>
                <TableCell align="right">{t('payroll.deductions')}</TableCell>
                <TableCell align="right">{t('payroll.netPay')}</TableCell>
                <TableCell>{t('payroll.paymentStatus')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!period.entries?.length ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    {t('payroll.noEntries')}
                  </TableCell>
                </TableRow>
              ) : (
                period.entries.map((entry) => (
                  <TableRow key={entry.id} hover>
                    <TableCell>
                      <EntityLink
                        type="employee"
                        id={entry.employee?.id}
                        label={entry.employee?.firstName}
                      />
                    </TableCell>
                    <TableCell>{entry.employee?.lastName}</TableCell>
                    <TableCell>{entry.employee?.position}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(entry.baseSalary, entry.currency)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(entry.grossPay, entry.currency)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'error.main' }}>
                      {formatCurrency(entry.totalDeductions, entry.currency)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {formatCurrency(entry.netPay, entry.currency)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={entry.paymentStatus}
                        color={entry.paymentStatus === 'PAID' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {period.status !== 'PAID' && (
                        <Tooltip title={t('common.edit')}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditEntry(entry)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Entry Edit Dialog */}
      <PayrollEntryEditDialog
        open={entryDialogOpen}
        onClose={handleCloseEntryDialog}
        entry={selectedEntry}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={
          confirmDialog.action === 'generate' ? t('payroll.generateEntriesTitle') :
          confirmDialog.action === 'approve' ? t('payroll.approveTitle') :
          t('payroll.markAsPaidTitle')
        }
        message={
          confirmDialog.action === 'generate' ? t('payroll.generateEntriesConfirm') :
          confirmDialog.action === 'approve' ? t('payroll.approveConfirm') :
          t('payroll.markAsPaidConfirm')
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ open: false, action: null })}
        loading={actionLoading}
      />
    </Box>
  );
};

export default PayrollPeriodDetail;
