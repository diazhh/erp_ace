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
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

import { fetchLoans } from '../../store/slices/payrollSlice';

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
  const { loans, loansPagination, loading } = useSelector((state) => state.payroll);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadLoans();
  }, [page, rowsPerPage, statusFilter]);

  const loadLoans = () => {
    dispatch(fetchLoans({
      page: page + 1,
      limit: rowsPerPage,
      status: statusFilter || undefined,
    }));
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('payroll.loans')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewLoan}
        >
          {t('payroll.newLoan')}
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
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
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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
          </>
        )}
      </TableContainer>
    </Box>
  );
};

export default Loans;
