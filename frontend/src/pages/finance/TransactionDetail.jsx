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
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  SwapHoriz as TransferIcon,
  Cancel as CancelIcon,
  CheckCircle as ReconcileIcon,
  AccountBalance as AccountIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  fetchTransactionById, 
  cancelTransaction, 
  reconcileTransaction,
  clearCurrentTransaction,
  fetchAccounts,
  fetchFinanceStats,
} from '../../store/slices/financeSlice';
import ConfirmDialog from '../../components/ConfirmDialog';
import AttachmentSection from '../../components/common/AttachmentSection';

const typeColors = {
  INCOME: 'success',
  EXPENSE: 'error',
  TRANSFER: 'info',
  ADJUSTMENT: 'warning',
};

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'primary',
  CANCELLED: 'error',
  RECONCILED: 'success',
};

const typeIcons = {
  INCOME: <IncomeIcon />,
  EXPENSE: <ExpenseIcon />,
  TRANSFER: <TransferIcon />,
};

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { currentTransaction: transaction, loading } = useSelector((state) => state.finance);
  
  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });

  useEffect(() => {
    dispatch(fetchTransactionById(id));
    return () => {
      dispatch(clearCurrentTransaction());
    };
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/finance/transactions');
  };

  const handleCancelClick = () => {
    setConfirmDialog({ open: true, action: 'cancel' });
  };

  const handleReconcileClick = () => {
    setConfirmDialog({ open: true, action: 'reconcile' });
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmDialog.action === 'cancel') {
        await dispatch(cancelTransaction(id)).unwrap();
        toast.success(t('finance.transactionCancelled'));
      } else if (confirmDialog.action === 'reconcile') {
        await dispatch(reconcileTransaction(id)).unwrap();
        toast.success(t('finance.transactionReconciled'));
      }
      dispatch(fetchTransactionById(id));
      dispatch(fetchFinanceStats());
      dispatch(fetchAccounts());
    } catch (error) {
      toast.error(error);
    } finally {
      setConfirmDialog({ open: false, action: null });
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

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-VE');
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

  const getPaymentMethodLabel = (method) => {
    const labels = {
      BANK_TRANSFER: t('finance.methodBankTransfer'),
      CASH: t('finance.methodCash'),
      BINANCE: t('finance.methodBinance'),
      PAGO_MOVIL: t('finance.methodPagoMovil'),
      ZELLE: t('finance.methodZelle'),
      CHECK: t('finance.methodCheck'),
      CRYPTO: t('finance.methodCrypto'),
    };
    return labels[method] || method;
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      SALES: t('finance.categorySales'),
      SERVICES: t('finance.categoryServices'),
      INTEREST: t('finance.categoryInterest'),
      REFUND: t('finance.categoryRefund'),
      OTHER_INCOME: t('finance.categoryOtherIncome'),
      PAYROLL: t('finance.categoryPayroll'),
      RENT: t('finance.categoryRent'),
      UTILITIES: t('finance.categoryUtilities'),
      SUPPLIES: t('finance.categorySupplies'),
      EQUIPMENT: t('finance.categoryEquipment'),
      TRANSPORT: t('finance.categoryTransport'),
      FUEL: t('finance.categoryFuel'),
      MAINTENANCE: t('finance.categoryMaintenance'),
      TAXES: t('finance.categoryTaxes'),
      INSURANCE: t('finance.categoryInsurance'),
      PROFESSIONAL_SERVICES: t('finance.categoryProfessionalServices'),
      MARKETING: t('finance.categoryMarketing'),
      TRAVEL: t('finance.categoryTravel'),
      FOOD: t('finance.categoryFood'),
      OTHER_EXPENSE: t('finance.categoryOtherExpense'),
    };
    return labels[cat] || cat;
  };

  if (loading || !transaction) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const canModify = transaction.status === 'CONFIRMED' && !transaction.isReconciled;

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
          <IconButton onClick={handleBack}>
            <BackIcon />
          </IconButton>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {typeIcons[transaction.transactionType]}
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
                {transaction.code}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip
                label={getTypeLabel(transaction.transactionType)}
                color={typeColors[transaction.transactionType]}
                size="small"
              />
              <Chip
                label={getStatusLabel(transaction.status)}
                color={statusColors[transaction.status]}
                size="small"
              />
            </Box>
          </Box>
        </Box>
        
        {canModify && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' },
          }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<ReconcileIcon />}
              onClick={handleReconcileClick}
              fullWidth={isMobile}
            >
              {t('finance.reconcile')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancelClick}
              fullWidth={isMobile}
            >
              {t('common.cancel')}
            </Button>
          </Box>
        )}
      </Box>

      {/* Summary Card */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              {t('finance.amount')}
            </Typography>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              color={transaction.transactionType === 'INCOME' ? 'success.main' : transaction.transactionType === 'EXPENSE' ? 'error.main' : 'text.primary'}
              sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
            >
              {transaction.transactionType === 'INCOME' ? '+' : transaction.transactionType === 'EXPENSE' ? '-' : ''}
              {formatCurrency(transaction.amount, transaction.currency)}
            </Typography>
            {transaction.amountInUsd && transaction.currency !== 'USD' && (
              <Typography variant="body2" color="text.secondary">
                ≈ {formatCurrency(transaction.amountInUsd, 'USD')}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="body2" color="text.secondary">
              {t('finance.date')}
            </Typography>
            <Typography fontWeight="medium">
              {formatDate(transaction.transactionDate)}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              {t('finance.account')}
            </Typography>
            <Typography fontWeight="medium">
              {transaction.account?.name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              {t('finance.category')}
            </Typography>
            <Typography fontWeight="medium">
              {getCategoryLabel(transaction.category)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab icon={<ReceiptIcon />} label={t('finance.transactionInfo')} iconPosition="start" />
          <Tab icon={<AccountIcon />} label={t('finance.accountInfo')} iconPosition="start" />
          <Tab icon={<HistoryIcon />} label={t('finance.auditInfo')} iconPosition="start" />
          <Tab icon={<ReceiptIcon />} label={t('attachments.title', 'Archivos')} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" gutterBottom>
            {t('finance.transactionInfo')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {t('finance.description')}
              </Typography>
              <Typography fontWeight="medium">
                {transaction.description}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                {t('finance.paymentMethod')}
              </Typography>
              <Typography fontWeight="medium">
                {getPaymentMethodLabel(transaction.paymentMethod)}
              </Typography>
            </Grid>
            
            {transaction.reference && (
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  {t('finance.reference')}
                </Typography>
                <Typography fontWeight="medium">
                  {transaction.reference}
                </Typography>
              </Grid>
            )}
            
            {transaction.exchangeRate && transaction.exchangeRate !== 1 && (
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  {t('finance.exchangeRate')}
                </Typography>
                <Typography fontWeight="medium">
                  {transaction.exchangeRate}
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* Counterparty Info */}
          {(transaction.counterparty || transaction.counterpartyDocument) && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                {transaction.transactionType === 'INCOME' ? t('finance.payerInfo') : t('finance.beneficiaryInfo')}
              </Typography>
              <Grid container spacing={3}>
                {transaction.counterparty && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('common.name')}
                    </Typography>
                    <Typography fontWeight="medium">
                      {transaction.counterparty}
                    </Typography>
                  </Grid>
                )}
                {transaction.counterpartyDocument && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('finance.document')}
                    </Typography>
                    <Typography fontWeight="medium">
                      {transaction.counterpartyDocument}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {/* Notes */}
          {transaction.notes && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                {t('common.notes')}
              </Typography>
              <Typography>
                {transaction.notes}
              </Typography>
            </>
          )}
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" gutterBottom>
            {t('finance.accountInfo')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {transaction.transactionType === 'TRANSFER' ? t('finance.fromAccount') : t('finance.account')}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {transaction.account?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.account?.bankName} - {transaction.account?.accountNumber}
                  </Typography>
                  <Chip 
                    label={transaction.account?.currency} 
                    size="small" 
                    sx={{ mt: 1 }} 
                  />
                </CardContent>
              </Card>
            </Grid>
            
            {transaction.destinationAccount && (
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t('finance.toAccount')}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {transaction.destinationAccount?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.destinationAccount?.bankName} - {transaction.destinationAccount?.accountNumber}
                    </Typography>
                    <Chip 
                      label={transaction.destinationAccount?.currency} 
                      size="small" 
                      sx={{ mt: 1 }} 
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" gutterBottom>
            {t('finance.auditInfo')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                {t('common.createdBy')}
              </Typography>
              <Typography fontWeight="medium">
                {transaction.creator ? `${transaction.creator.firstName} ${transaction.creator.lastName}` : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                {t('common.createdAt')}
              </Typography>
              <Typography fontWeight="medium">
                {formatDateTime(transaction.createdAt)}
              </Typography>
            </Grid>
            
            {transaction.isReconciled && (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('finance.reconciledBy')}
                  </Typography>
                  <Typography fontWeight="medium">
                    {transaction.reconciler ? `${transaction.reconciler.firstName} ${transaction.reconciler.lastName}` : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('finance.reconciledAt')}
                  </Typography>
                  <Typography fontWeight="medium">
                    {formatDateTime(transaction.reconciledAt)}
                  </Typography>
                </Grid>
              </>
            )}
            
            {transaction.status === 'CANCELLED' && (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Chip 
                    label={t('finance.statusCancelled')} 
                    color="error" 
                    icon={<CancelIcon />}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <AttachmentSection
            entityType="transaction"
            entityId={id}
            title={t('attachments.title', 'Archivos Adjuntos')}
            defaultCategory="RECEIPT"
            variant="inline"
          />
        </Paper>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.action === 'cancel' ? t('finance.cancelTransaction') : t('finance.reconcileTransaction')}
        message={confirmDialog.action === 'cancel' ? t('finance.cancelTransactionConfirm') : t('finance.reconcileTransactionConfirm')}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ open: false, action: null })}
      />
    </Box>
  );
};

export default TransactionDetail;
