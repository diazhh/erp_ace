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
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Payment as PayIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchPeriods, deletePeriod, fetchPayrollStats } from '../../store/slices/payrollSlice';
import PayrollPeriodFormDialog from '../../components/payroll/PayrollPeriodFormDialog';
import ConfirmDialog from '../../components/ConfirmDialog';

const statusColors = {
  DRAFT: 'default',
  CALCULATING: 'info',
  PENDING_APPROVAL: 'warning',
  APPROVED: 'primary',
  PAID: 'success',
  CANCELLED: 'error',
};

const PayrollPeriods = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { periods, periodsPagination, stats, loading } = useSelector((state) => state.payroll);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState(null);

  useEffect(() => {
    loadPeriods();
    dispatch(fetchPayrollStats());
  }, [page, rowsPerPage, statusFilter, yearFilter]);

  const loadPeriods = () => {
    dispatch(fetchPeriods({
      page: page + 1,
      limit: rowsPerPage,
      status: statusFilter || undefined,
      year: yearFilter || undefined,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenForm = (period = null) => {
    setSelectedPeriod(period);
    setFormOpen(true);
  };

  const handleCloseForm = (refresh = false) => {
    setFormOpen(false);
    setSelectedPeriod(null);
    if (refresh) {
      loadPeriods();
    }
  };

  const handleDeleteClick = (period) => {
    setPeriodToDelete(period);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deletePeriod(periodToDelete.id)).unwrap();
      toast.success(t('payroll.periodDeleted'));
      setDeleteDialogOpen(false);
      setPeriodToDelete(null);
    } catch (error) {
      toast.error(error);
    }
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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
          {t('payroll.periods')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          fullWidth={isMobile}
        >
          {t('payroll.newPeriod')}
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('payroll.yearlyTotal')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {formatCurrency(stats.yearlyTotal)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('payroll.pendingPeriods')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {stats.pendingPeriods}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('payroll.activeLoans')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="info.main">
                {stats.activeLoans}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('payroll.totalLoanAmount')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                {formatCurrency(stats.totalLoanAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={3}>
            <TextField
              select
              label={t('common.status')}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="DRAFT">{t('payroll.statusDraft')}</MenuItem>
              <MenuItem value="CALCULATING">{t('payroll.statusCalculating')}</MenuItem>
              <MenuItem value="PENDING_APPROVAL">{t('payroll.statusPendingApproval')}</MenuItem>
              <MenuItem value="APPROVED">{t('payroll.statusApproved')}</MenuItem>
              <MenuItem value="PAID">{t('payroll.statusPaid')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <TextField
              select
              label={t('common.year')}
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setPage(0); }}
              fullWidth
              size="small"
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </TextField>
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
          {periods.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('common.noData')}</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {periods.map((period) => (
                <Card key={period.id} variant="outlined">
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {period.code}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {period.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusLabel(period.status)}
                        color={statusColors[period.status]}
                        size="small"
                      />
                    </Box>
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('payroll.startDate')}</Typography>
                        <Typography variant="body2">{formatDate(period.startDate)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('payroll.endDate')}</Typography>
                        <Typography variant="body2">{formatDate(period.endDate)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('payroll.totalNet')}</Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {formatCurrency(period.totalNet, period.currency)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('payroll.employees')}</Typography>
                        <Typography variant="body2">{period.totalEmployees}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                    <Button size="small" onClick={() => navigate(`/payroll/periods/${period.id}`)}>
                      {t('common.view')}
                    </Button>
                    {period.status === 'DRAFT' && (
                      <>
                        <Button size="small" onClick={() => handleOpenForm(period)}>
                          {t('common.edit')}
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDeleteClick(period)}>
                          {t('common.delete')}
                        </Button>
                      </>
                    )}
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
          <TablePagination
            component="div"
            count={periodsPagination.total}
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
                <TableCell>{t('payroll.code')}</TableCell>
                <TableCell>{t('payroll.periodName')}</TableCell>
                <TableCell>{t('payroll.startDate')}</TableCell>
                <TableCell>{t('payroll.endDate')}</TableCell>
                <TableCell>{t('payroll.paymentDate')}</TableCell>
                <TableCell align="right">{t('payroll.totalNet')}</TableCell>
                <TableCell>{t('payroll.employees')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {periods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                periods.map((period) => (
                  <TableRow key={period.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {period.code}
                      </Typography>
                    </TableCell>
                    <TableCell>{period.name}</TableCell>
                    <TableCell>{formatDate(period.startDate)}</TableCell>
                    <TableCell>{formatDate(period.endDate)}</TableCell>
                    <TableCell>{formatDate(period.paymentDate)}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="medium">
                        {formatCurrency(period.totalNet, period.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>{period.totalEmployees}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(period.status)}
                        color={statusColors[period.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.view')}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/payroll/periods/${period.id}`)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {period.status === 'DRAFT' && (
                        <>
                          <Tooltip title={t('common.edit')}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenForm(period)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete')}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(period)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={periodsPagination.total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </TableContainer>
      )}

      {/* Form Dialog */}
      <PayrollPeriodFormDialog
        open={formOpen}
        onClose={handleCloseForm}
        period={selectedPeriod}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('payroll.deletePeriod')}
        message={t('payroll.deletePeriodConfirm')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default PayrollPeriods;
