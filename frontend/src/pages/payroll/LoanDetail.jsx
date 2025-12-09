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
  Chip,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  CheckCircle as ApproveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { fetchLoanById, approveLoan, cancelLoan, clearCurrentLoan } from '../../store/slices/payrollSlice';
import EntityLink from '../../components/common/EntityLink';
import ConfirmDialog from '../../components/ConfirmDialog';
import AttachmentSection from '../../components/common/AttachmentSection';
import ResponsiveTabs from '../../components/common/ResponsiveTabs';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const statusColors = {
  ACTIVE: 'success',
  PAID: 'primary',
  CANCELLED: 'error',
  PAUSED: 'warning',
  PENDING: 'info',
};

const getLoanTypeLabel = (t, type) => {
  const labels = {
    PERSONAL: t('payroll.loanTypePersonal'),
    ADVANCE: t('payroll.loanTypeAdvance'),
    EMERGENCY: t('payroll.loanTypeEmergency'),
    OTHER: t('payroll.loanTypeOther'),
  };
  return labels[type] || type;
};

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const LoanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentLoan: loan, loading, error } = useSelector((state) => state.payroll);

  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });

  useEffect(() => {
    dispatch(fetchLoanById(id));
    return () => {
      dispatch(clearCurrentLoan());
    };
  }, [dispatch, id]);

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
  };

  const handleApprove = async () => {
    try {
      await dispatch(approveLoan(id)).unwrap();
      toast.success(t('payroll.loanApproved'));
      dispatch(fetchLoanById(id));
    } catch (error) {
      toast.error(error);
    }
    setConfirmDialog({ open: false, action: null });
  };

  const handleCancel = async () => {
    try {
      await dispatch(cancelLoan(id)).unwrap();
      toast.success(t('payroll.loanCancelled'));
      navigate('/payroll/loans');
    } catch (error) {
      toast.error(error);
    }
    setConfirmDialog({ open: false, action: null });
  };

  if (loading && !loan) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/payroll/loans')} sx={{ mt: 2 }}>
          {t('common.back')}
        </Button>
      </Box>
    );
  }

  if (!loan) return null;

  const progress = loan.amount > 0 
    ? ((loan.amount - loan.remainingAmount) / loan.amount) * 100 
    : 0;

  const canApprove = loan.status === 'ACTIVE' && !loan.approvedBy;
  const canCancel = loan.status === 'ACTIVE';

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/payroll/loans')}
          >
            {t('common.back')}
          </Button>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {loan.code}
              </Typography>
              <Chip
                label={loan.status}
                color={statusColors[loan.status]}
              />
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {getLoanTypeLabel(t, loan.loanType)} • {loan.description || t('common.noData')}
            </Typography>
            {loan.employee && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <EntityLink
                  type="employee"
                  id={loan.employee.id}
                  label={`${loan.employee.firstName} ${loan.employee.lastName}`}
                />
              </Box>
            )}
          </Box>

          {/* Acciones */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <DownloadPDFButton
              endpoint={`/reports/loans/${id}`}
              filename={`prestamo-${loan.code}.pdf`}
            />
            {canApprove && (
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() => setConfirmDialog({ open: true, action: 'approve' })}
              >
                {t('payroll.approveLoan')}
              </Button>
            )}
            {canCancel && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setConfirmDialog({ open: true, action: 'cancel' })}
              >
                {t('common.cancel')}
              </Button>
            )}
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                <Typography variant="h5" color="primary.main" fontWeight="bold">
                  {formatCurrency(loan.amount, loan.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('payroll.totalAmount')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  {formatCurrency(loan.amount - loan.remainingAmount, loan.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('payroll.paidAmount')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                <Typography variant="h5" color="error.main" fontWeight="bold">
                  {formatCurrency(loan.remainingAmount, loan.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('payroll.pendingAmount')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                <Typography variant="h5" color="info.main" fontWeight="bold">
                  {formatCurrency(loan.installmentAmount, loan.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('payroll.monthlyInstallment')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Barra de progreso */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('payroll.paymentProgress')}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {loan.paidInstallments || 0} {t('payroll.of')} {loan.totalInstallments} {t('payroll.installmentsOf')} ({progress.toFixed(0)}%)
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ p: isMobile ? 2 : 0 }}>
        <ResponsiveTabs
          tabs={[
            { label: t('payroll.loanInfo'), icon: <PaymentIcon /> },
            { label: t('payroll.paymentHistory'), icon: <HistoryIcon /> },
            { label: t('attachments.title', 'Archivos') },
          ]}
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          ariaLabel="loan-tabs"
        />
        {!isMobile && <Divider />}

        <Box sx={{ p: { xs: 0, md: 2 } }}>
          {/* Tab: Información */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>{t('payroll.loanDetail')}</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('payroll.code')}</TableCell>
                        <TableCell>{loan.code}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('payroll.loanType')}</TableCell>
                        <TableCell>{getLoanTypeLabel(t, loan.loanType)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('common.description')}</TableCell>
                        <TableCell>{loan.description || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('payroll.amount')}</TableCell>
                        <TableCell>{formatCurrency(loan.amount, loan.currency)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('payroll.totalInstallments')}</TableCell>
                        <TableCell>{loan.totalInstallments}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('payroll.monthlyInstallment')}</TableCell>
                        <TableCell>{formatCurrency(loan.installmentAmount, loan.currency)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('payroll.startDate')}</TableCell>
                        <TableCell>{formatDate(loan.startDate)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('common.status')}</TableCell>
                        <TableCell>
                          <Chip label={loan.status} color={statusColors[loan.status]} size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>{t('payroll.employee')}</Typography>
                {loan.employee && (
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PersonIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                            onClick={() => navigate(`/employees/${loan.employee.id}`)}
                          >
                            {loan.employee.firstName} {loan.employee.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {loan.employee.idType}-{loan.employee.idNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {loan.employee.position}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>{t('payroll.approvalInfo')}</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('payroll.approvedBy')}</TableCell>
                        <TableCell>
                          {loan.approver ? `${loan.approver.firstName} ${loan.approver.lastName}` : t('payroll.pendingApproval')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('payroll.approvedAt')}</TableCell>
                        <TableCell>{loan.approvedAt ? formatDate(loan.approvedAt) : '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('common.createdAt')}</TableCell>
                        <TableCell>{formatDate(loan.createdAt)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {loan.notes && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>{t('common.notes')}</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body2">{loan.notes}</Typography>
                    </Paper>
                  </>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab: Historial de Pagos */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom>{t('payroll.deductionHistory')}</Typography>
            {loan.deductions?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('payroll.period')}</TableCell>
                      <TableCell>{t('payroll.startDate')}</TableCell>
                      <TableCell align="right">{t('payroll.amount')}</TableCell>
                      <TableCell>{t('common.status')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loan.deductions.map((deduction, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {deduction.period?.code || `Cuota ${index + 1}`}
                        </TableCell>
                        <TableCell>{formatDate(deduction.date)}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(deduction.amount, loan.currency)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={deduction.status || t('payroll.applied')} 
                            size="small" 
                            color="success" 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                {t('payroll.noDeductions')}. {t('payroll.deductionsApplied')}
              </Alert>
            )}
          </TabPanel>

          {/* Tab: Archivos */}
          <TabPanel value={activeTab} index={2}>
            <AttachmentSection
              entityType="loan_payment"
              entityId={id}
              title={t('attachments.title', 'Comprobantes de Pago')}
              defaultCategory="RECEIPT"
              variant="inline"
            />
          </TabPanel>
        </Box>
      </Paper>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={confirmDialog.open && confirmDialog.action === 'approve'}
        title={t('payroll.approveLoan')}
        message={t('payroll.approveLoanConfirm')}
        onConfirm={handleApprove}
        onCancel={() => setConfirmDialog({ open: false, action: null })}
        confirmText={t('payroll.approve')}
        confirmColor="success"
      />

      <ConfirmDialog
        open={confirmDialog.open && confirmDialog.action === 'cancel'}
        title={t('payroll.cancelLoan')}
        message={t('payroll.cancelLoanConfirm')}
        onConfirm={handleCancel}
        onCancel={() => setConfirmDialog({ open: false, action: null })}
        confirmText={t('payroll.cancelLoan')}
        confirmColor="error"
      />
    </Box>
  );
};

export default LoanDetail;
