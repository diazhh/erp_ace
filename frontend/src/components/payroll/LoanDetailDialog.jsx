import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  LinearProgress,
} from '@mui/material';

const statusColors = {
  ACTIVE: 'success',
  PAID: 'primary',
  CANCELLED: 'error',
  PAUSED: 'warning',
};

const LoanDetailDialog = ({ open, onClose, loan }) => {
  const { t } = useTranslation();

  if (!loan) return null;

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

  const progress = (loan.paidInstallments / loan.totalInstallments) * 100;

  const loanTypeLabels = {
    PERSONAL: t('payroll.loanTypePersonal'),
    ADVANCE: t('payroll.loanTypeAdvance'),
    EMERGENCY: t('payroll.loanTypeEmergency'),
    OTHER: t('payroll.loanTypeOther'),
  };

  const getStatusLabel = (status) => {
    const labels = {
      ACTIVE: t('payroll.loanActive'),
      PAID: t('payroll.loanPaid'),
      CANCELLED: t('payroll.loanCancelled'),
      PAUSED: t('payroll.loanPaused'),
    };
    return labels[status] || status;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {t('payroll.loanDetail')} - {loan.code}
          </Typography>
          <Chip
            label={getStatusLabel(loan.status)}
            color={statusColors[loan.status]}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* Employee Info */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t('payroll.employeeInfo')}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">{t('payroll.employee')}</Typography>
            <Typography fontWeight="medium">
              {loan.employee?.firstName} {loan.employee?.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">{t('employees.idNumber')}</Typography>
            <Typography fontWeight="medium">{loan.employee?.idNumber}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Loan Info */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t('payroll.loanInfo')}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">{t('payroll.loanType')}</Typography>
            <Typography fontWeight="medium">{loanTypeLabels[loan.loanType]}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">{t('payroll.amount')}</Typography>
            <Typography fontWeight="medium">{formatCurrency(loan.amount, loan.currency)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">{t('payroll.installment')}</Typography>
            <Typography fontWeight="medium">{formatCurrency(loan.installmentAmount, loan.currency)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">{t('payroll.startDate')}</Typography>
            <Typography fontWeight="medium">{formatDate(loan.startDate)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">{t('payroll.endDate')}</Typography>
            <Typography fontWeight="medium">{formatDate(loan.endDate)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">{t('payroll.remaining')}</Typography>
            <Typography fontWeight="medium" color="error.main">
              {formatCurrency(loan.remainingAmount, loan.currency)}
            </Typography>
          </Grid>
        </Grid>

        {/* Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">{t('payroll.progress')}</Typography>
            <Typography variant="body2">
              {loan.paidInstallments} / {loan.totalInstallments} {t('payroll.installments')}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        {loan.description && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('common.description')}
            </Typography>
            <Typography>{loan.description}</Typography>
          </>
        )}

        {/* Payments History */}
        {loan.payments?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('payroll.paymentHistory')}
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>{t('payroll.paymentDate')}</TableCell>
                    <TableCell align="right">{t('payroll.amount')}</TableCell>
                    <TableCell>{t('payroll.paymentMethod')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loan.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.installmentNumber}</TableCell>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(payment.amount, payment.currency)}
                      </TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Approval Info */}
        {loan.approvedBy && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('payroll.approvalInfo')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">{t('payroll.approvedBy')}</Typography>
                <Typography fontWeight="medium">
                  {loan.approver?.firstName} {loan.approver?.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">{t('payroll.approvedAt')}</Typography>
                <Typography fontWeight="medium">{formatDate(loan.approvedAt)}</Typography>
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoanDetailDialog;
