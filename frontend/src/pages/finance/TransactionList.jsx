import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  CardActionArea,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
  CheckCircle as ReconcileIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  SwapHoriz as TransferIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  fetchTransactions, 
  fetchAccounts,
  fetchFinanceStats,
  cancelTransaction,
  reconcileTransaction,
} from '../../store/slices/financeSlice';
import ConfirmDialog from '../../components/ConfirmDialog';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const typeColors = {
  INCOME: 'success',
  EXPENSE: 'error',
  TRANSFER: 'info',
  ADJUSTMENT: 'warning',
};

const typeIcons = {
  INCOME: <IncomeIcon />,
  EXPENSE: <ExpenseIcon />,
  TRANSFER: <TransferIcon />,
};

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'primary',
  CANCELLED: 'error',
  RECONCILED: 'success',
};

const TransactionList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { transactions, transactionsPagination, accounts, stats, loading } = useSelector((state) => state.finance);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [typeFilter, setTypeFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, transaction: null });

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchFinanceStats());
  }, [dispatch]);

  useEffect(() => {
    loadTransactions();
  }, [page, rowsPerPage, typeFilter, accountFilter, statusFilter]);

  const loadTransactions = () => {
    dispatch(fetchTransactions({
      page: page + 1,
      limit: rowsPerPage,
      type: typeFilter || undefined,
      accountId: accountFilter || undefined,
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

  const handleViewDetail = (transaction) => {
    navigate(`/finance/transactions/${transaction.id}`);
  };

  const handleCancelClick = (e, transaction) => {
    e.stopPropagation();
    setConfirmDialog({
      open: true,
      action: 'cancel',
      transaction,
    });
  };

  const handleReconcileClick = (e, transaction) => {
    e.stopPropagation();
    setConfirmDialog({
      open: true,
      action: 'reconcile',
      transaction,
    });
  };

  const handleConfirmAction = async () => {
    const { action, transaction } = confirmDialog;
    try {
      if (action === 'cancel') {
        await dispatch(cancelTransaction(transaction.id)).unwrap();
        toast.success(t('finance.transactionCancelled'));
      } else if (action === 'reconcile') {
        await dispatch(reconcileTransaction(transaction.id)).unwrap();
        toast.success(t('finance.transactionReconciled'));
      }
      dispatch(fetchFinanceStats());
      dispatch(fetchAccounts());
    } catch (error) {
      toast.error(error);
    } finally {
      setConfirmDialog({ open: false, action: null, transaction: null });
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency === 'USDT' ? 'USD' : currency,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const getTypeLabel = (type) => {
    const labels = {
      INCOME: t('finance.income'),
      EXPENSE: t('finance.expense'),
      TRANSFER: t('finance.transfer'),
      ADJUSTMENT: t('finance.adjustment'),
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: t('finance.statusPending'),
      CONFIRMED: t('finance.statusConfirmed'),
      CANCELLED: t('finance.statusCancelled'),
      RECONCILED: t('finance.statusReconciled'),
    };
    return labels[status] || status;
  };

  // Mobile Card Component
  const TransactionCard = ({ transaction }) => (
    <Card sx={{ mb: 2 }}>
      <CardActionArea onClick={() => handleViewDetail(transaction)}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {typeIcons[transaction.transactionType]}
              <Typography variant="body2" fontFamily="monospace">
                {transaction.code}
              </Typography>
            </Box>
            <Chip
              label={getStatusLabel(transaction.status)}
              color={statusColors[transaction.status]}
              size="small"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
            {transaction.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatDate(transaction.transactionDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {transaction.account?.name}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={transaction.transactionType === 'INCOME' ? 'success.main' : transaction.transactionType === 'EXPENSE' ? 'error.main' : 'text.primary'}
            >
              {transaction.transactionType === 'INCOME' ? '+' : transaction.transactionType === 'EXPENSE' ? '-' : ''}
              {formatCurrency(transaction.amount, transaction.currency)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      
      {/* Actions for mobile */}
      {transaction.status === 'CONFIRMED' && !transaction.isReconciled && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, pt: 0, gap: 1 }}>
          <Button
            size="small"
            color="success"
            startIcon={<ReconcileIcon />}
            onClick={(e) => handleReconcileClick(e, transaction)}
          >
            {t('finance.reconcile')}
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<CancelIcon />}
            onClick={(e) => handleCancelClick(e, transaction)}
          >
            {t('common.cancel')}
          </Button>
        </Box>
      )}
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 3,
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/finance')}>
            <BackIcon />
          </IconButton>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
            {t('finance.transactions')}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          width: { xs: '100%', sm: 'auto' },
        }}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<IncomeIcon />}
            onClick={() => navigate('/finance/transactions/new?type=INCOME')}
            fullWidth={isMobile}
          >
            {t('finance.newIncome')}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ExpenseIcon />}
            onClick={() => navigate('/finance/transactions/new?type=EXPENSE')}
            fullWidth={isMobile}
          >
            {t('finance.newExpense')}
          </Button>
          <Button
            variant="outlined"
            color="info"
            startIcon={<TransferIcon />}
            onClick={() => navigate('/finance/transactions/new?type=TRANSFER')}
            fullWidth={isMobile}
          >
            {t('finance.newTransfer')}
          </Button>
          <DownloadPDFButton
            endpoint={`/reports/transactions?type=${typeFilter || ''}&accountId=${accountFilter || ''}`}
            filename={`transacciones-${new Date().toISOString().split('T')[0]}.pdf`}
            variant="outlined"
            fullWidth={isMobile}
          />
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
              >
                {t('finance.totalIncome')}
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color="success.main"
                sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
              >
                {formatCurrency(stats.totalIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
              >
                {t('finance.totalExpense')}
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color="error.main"
                sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
              >
                {formatCurrency(stats.totalExpense)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
              >
                {t('finance.netBalance')}
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color={stats.netBalance >= 0 ? 'success.main' : 'error.main'}
                sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
              >
                {formatCurrency(stats.netBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
              >
                {t('finance.pendingReconciliation')}
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color="warning.main"
                sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
              >
                {stats.pendingReconciliation}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label={t('finance.type')}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="INCOME">{t('finance.income')}</MenuItem>
              <MenuItem value="EXPENSE">{t('finance.expense')}</MenuItem>
              <MenuItem value="TRANSFER">{t('finance.transfer')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label={t('finance.account')}
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label={t('common.status')}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="PENDING">{t('finance.statusPending')}</MenuItem>
              <MenuItem value="CONFIRMED">{t('finance.statusConfirmed')}</MenuItem>
              <MenuItem value="RECONCILED">{t('finance.statusReconciled')}</MenuItem>
              <MenuItem value="CANCELLED">{t('finance.statusCancelled')}</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Mobile: Cards */}
          {isMobile ? (
            <Box>
              {transactions.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    {t('finance.noTransactions')}
                  </Typography>
                </Paper>
              ) : (
                <>
                  {transactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </>
              )}
            </Box>
          ) : (
            /* Desktop: Table */
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('finance.date')}</TableCell>
                    <TableCell>{t('finance.code')}</TableCell>
                    <TableCell>{t('finance.type')}</TableCell>
                    {!isTablet && <TableCell>{t('finance.category')}</TableCell>}
                    <TableCell>{t('finance.description')}</TableCell>
                    <TableCell>{t('finance.account')}</TableCell>
                    <TableCell align="right">{t('finance.amount')}</TableCell>
                    <TableCell>{t('common.status')}</TableCell>
                    <TableCell align="center">{t('common.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id} 
                      hover 
                      onClick={() => handleViewDetail(transaction)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {transaction.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={typeIcons[transaction.transactionType]}
                          label={getTypeLabel(transaction.transactionType)}
                          color={typeColors[transaction.transactionType]}
                          size="small"
                        />
                      </TableCell>
                      {!isTablet && <TableCell>{transaction.category}</TableCell>}
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {transaction.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{transaction.account?.name}</TableCell>
                      <TableCell align="right">
                        <Typography
                          fontWeight="medium"
                          color={transaction.transactionType === 'INCOME' ? 'success.main' : transaction.transactionType === 'EXPENSE' ? 'error.main' : 'text.primary'}
                        >
                          {transaction.transactionType === 'INCOME' ? '+' : transaction.transactionType === 'EXPENSE' ? '-' : ''}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(transaction.status)}
                          color={statusColors[transaction.status]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={t('common.view')}>
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(transaction);
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {transaction.status === 'CONFIRMED' && !transaction.isReconciled && (
                          <>
                            <Tooltip title={t('finance.reconcile')}>
                              <IconButton 
                                size="small" 
                                color="success" 
                                onClick={(e) => handleReconcileClick(e, transaction)}
                              >
                                <ReconcileIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('common.cancel')}>
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={(e) => handleCancelClick(e, transaction)}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography color="text.secondary" sx={{ py: 4 }}>
                          {t('finance.noTransactions')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {/* Pagination */}
          <TablePagination
            component="div"
            count={transactionsPagination.total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage={isMobile ? '' : t('common.rowsPerPage')}
            sx={{ 
              '.MuiTablePagination-selectLabel': { 
                display: { xs: 'none', sm: 'block' } 
              } 
            }}
          />
        </>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.action === 'cancel' ? t('finance.cancelTransaction') : t('finance.reconcileTransaction')}
        message={confirmDialog.action === 'cancel' ? t('finance.cancelTransactionConfirm') : t('finance.reconcileTransactionConfirm')}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ open: false, action: null, transaction: null })}
      />
    </Box>
  );
};

export default TransactionList;
