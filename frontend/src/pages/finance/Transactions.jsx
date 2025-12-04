import { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
  CheckCircle as ReconcileIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  SwapHoriz as TransferIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  fetchTransactions, 
  fetchAccounts,
  fetchFinanceStats,
  cancelTransaction,
  reconcileTransaction,
} from '../../store/slices/financeSlice';
import TransactionFormDialog from '../../components/finance/TransactionFormDialog';
import TransactionDetailDialog from '../../components/finance/TransactionDetailDialog';
import ConfirmDialog from '../../components/ConfirmDialog';

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

const Transactions = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { transactions, transactionsPagination, accounts, stats, loading } = useSelector((state) => state.finance);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [typeFilter, setTypeFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState('EXPENSE');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, transaction: null });

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchFinanceStats());
  }, [dispatch]);

  useEffect(() => {
    loadTransactions();
  }, [page, rowsPerPage, typeFilter, accountFilter]);

  const loadTransactions = () => {
    dispatch(fetchTransactions({
      page: page + 1,
      limit: rowsPerPage,
      type: typeFilter || undefined,
      accountId: accountFilter || undefined,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenForm = (type = 'EXPENSE') => {
    setFormType(type);
    setFormOpen(true);
  };

  const handleCloseForm = (refresh = false) => {
    setFormOpen(false);
    if (refresh) {
      loadTransactions();
      dispatch(fetchFinanceStats());
      dispatch(fetchAccounts());
    }
  };

  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailOpen(true);
  };

  const handleCancelClick = (transaction) => {
    setConfirmDialog({
      open: true,
      action: 'cancel',
      transaction,
    });
  };

  const handleReconcileClick = (transaction) => {
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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('finance.transactions')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<IncomeIcon />}
            onClick={() => handleOpenForm('INCOME')}
          >
            {t('finance.newIncome')}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ExpenseIcon />}
            onClick={() => handleOpenForm('EXPENSE')}
          >
            {t('finance.newExpense')}
          </Button>
          <Button
            variant="outlined"
            color="info"
            startIcon={<TransferIcon />}
            onClick={() => handleOpenForm('TRANSFER')}
          >
            {t('finance.newTransfer')}
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('finance.totalIncome')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {formatCurrency(stats.totalIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('finance.totalExpense')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                {formatCurrency(stats.totalExpense)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('finance.netBalance')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={stats.netBalance >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(stats.netBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('finance.pendingReconciliation')}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
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
        </Grid>
      </Paper>

      {/* Transactions Table */}
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
                  <TableCell>{t('finance.date')}</TableCell>
                  <TableCell>{t('finance.code')}</TableCell>
                  <TableCell>{t('finance.type')}</TableCell>
                  <TableCell>{t('finance.category')}</TableCell>
                  <TableCell>{t('finance.description')}</TableCell>
                  <TableCell>{t('finance.account')}</TableCell>
                  <TableCell align="right">{t('finance.amount')}</TableCell>
                  <TableCell>{t('common.status')}</TableCell>
                  <TableCell align="center">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
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
                    <TableCell>{transaction.category}</TableCell>
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
                        <IconButton size="small" onClick={() => handleViewDetail(transaction)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {transaction.status === 'CONFIRMED' && !transaction.isReconciled && (
                        <>
                          <Tooltip title={t('finance.reconcile')}>
                            <IconButton size="small" color="success" onClick={() => handleReconcileClick(transaction)}>
                              <ReconcileIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.cancel')}>
                            <IconButton size="small" color="error" onClick={() => handleCancelClick(transaction)}>
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
            <TablePagination
              component="div"
              count={transactionsPagination.total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage={t('common.rowsPerPage')}
            />
          </>
        )}
      </TableContainer>

      {/* Form Dialog */}
      <TransactionFormDialog
        open={formOpen}
        onClose={handleCloseForm}
        type={formType}
        accounts={accounts}
      />

      {/* Detail Dialog */}
      <TransactionDetailDialog
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />

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

export default Transactions;
