import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
  Tooltip,
  Grid,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

import { fetchLoans } from '../../store/slices/payrollSlice';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const statusColors = {
  ACTIVE: 'success',
  PAID: 'primary',
  CANCELLED: 'error',
  PAUSED: 'warning',
};

const loanTypeLabels = {
  PERSONAL: 'Personal',
  ADVANCE: 'Adelanto',
  EMERGENCY: 'Emergencia',
  OTHER: 'Otro',
};

const Loans = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { loans, loansPagination, loading } = useSelector((state) => state.payroll);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loanTypeFilter, setLoanTypeFilter] = useState('');

  useEffect(() => {
    loadLoans();
  }, [page, rowsPerPage, statusFilter, startDate, endDate, loanTypeFilter]);

  const loadLoans = () => {
    dispatch(fetchLoans({
      page: page + 1,
      limit: rowsPerPage,
      status: statusFilter || undefined,
      loanType: loanTypeFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }));
  };

  const buildPdfQueryParams = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (loanTypeFilter) params.append('loanType', loanTypeFilter);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return params.toString();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNewLoan = () => {
    navigate('/payroll/loans/new');
  };

  const handleViewDetail = (loan) => {
    navigate(`/payroll/loans/${loan.id}`);
  };

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
      ACTIVE: t('payroll.loanActive'),
      PAID: t('payroll.loanPaid'),
      CANCELLED: t('payroll.loanCancelled'),
      PAUSED: t('payroll.loanPaused'),
    };
    return labels[status] || status;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3, 
        gap: 2 
      }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
          {t('payroll.loans')}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <DownloadPDFButton
            endpoint={`/reports/loans?${buildPdfQueryParams()}`}
            filename={`prestamos-${new Date().toISOString().split('T')[0]}.pdf`}
            variant="outlined"
            fullWidth={isMobile}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewLoan}
            fullWidth={isMobile}
          >
            {t('payroll.newLoan')}
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label={t('common.status')}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="ACTIVE">{t('payroll.loanActive')}</MenuItem>
              <MenuItem value="PAID">{t('payroll.loanPaid')}</MenuItem>
              <MenuItem value="CANCELLED">{t('payroll.loanCancelled')}</MenuItem>
              <MenuItem value="PAUSED">{t('payroll.loanPaused')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label={t('payroll.loanType')}
              value={loanTypeFilter}
              onChange={(e) => { setLoanTypeFilter(e.target.value); setPage(0); }}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="PERSONAL">{t('payroll.loanTypePersonal')}</MenuItem>
              <MenuItem value="ADVANCE">{t('payroll.loanTypeAdvance')}</MenuItem>
              <MenuItem value="EMERGENCY">{t('payroll.loanTypeEmergency')}</MenuItem>
              <MenuItem value="OTHER">{t('payroll.loanTypeOther')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              label={t('common.startDate')}
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              label={t('common.endDate')}
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Table / Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        // Mobile: Cards view
        <Box>
          {loans.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('common.noData')}</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {loans.map((loan) => {
                const progress = loan.amount > 0 
                  ? ((loan.amount - loan.remainingAmount) / loan.amount) * 100 
                  : 0;
                return (
                  <Card key={loan.id} variant="outlined">
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {loan.code}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {loan.employee?.firstName} {loan.employee?.lastName}
                          </Typography>
                        </Box>
                        <Chip
                          label={getStatusLabel(loan.status)}
                          color={statusColors[loan.status]}
                          size="small"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {loanTypeLabels[loan.loanType]}
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">{t('payroll.amount')}</Typography>
                          <Typography variant="body2" fontWeight="medium">{formatCurrency(loan.amount, loan.currency)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">{t('payroll.installment')}</Typography>
                          <Typography variant="body2">{formatCurrency(loan.installmentAmount, loan.currency)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">{t('payroll.progress')}</Typography>
                          <Typography variant="body2">{loan.paidInstallments} / {loan.totalInstallments}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">{t('payroll.remaining')}</Typography>
                          <Typography variant="body2" color="error.main" fontWeight="medium">
                            {formatCurrency(loan.remainingAmount, loan.currency)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{ height: 6, borderRadius: 3 }}
                          color={progress >= 100 ? 'success' : 'primary'}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {progress.toFixed(0)}% {t('payroll.loanPaid', 'pagado')}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                      <Button size="small" onClick={() => handleViewDetail(loan)}>
                        {t('common.view')}
                      </Button>
                    </CardActions>
                  </Card>
                );
              })}
            </Box>
          )}
          <TablePagination
            component="div"
            count={loansPagination.total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </Box>
      ) : (
        // Desktop: Table view
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('payroll.loanCode')}</TableCell>
                <TableCell>{t('payroll.employee')}</TableCell>
                <TableCell>{t('payroll.loanType')}</TableCell>
                <TableCell align="right">{t('payroll.amount')}</TableCell>
                <TableCell align="right">{t('payroll.installment')}</TableCell>
                <TableCell>{t('payroll.progress')}</TableCell>
                <TableCell align="right">{t('payroll.remaining')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                loans.map((loan) => (
                  <TableRow key={loan.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {loan.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {loan.employee?.firstName} {loan.employee?.lastName}
                    </TableCell>
                    <TableCell>{loanTypeLabels[loan.loanType]}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(loan.amount, loan.currency)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(loan.installmentAmount, loan.currency)}
                    </TableCell>
                    <TableCell>
                      {loan.paidInstallments} / {loan.totalInstallments}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'error.main' }}>
                      {formatCurrency(loan.remainingAmount, loan.currency)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(loan.status)}
                        color={statusColors[loan.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.view')}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetail(loan)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={loansPagination.total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default Loans;
