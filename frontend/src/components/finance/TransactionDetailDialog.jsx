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
  Box,
} from '@mui/material';
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  SwapHoriz as TransferIcon,
} from '@mui/icons-material';

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

const TransactionDetailDialog = ({ open, onClose, transaction }) => {
  const { t } = useTranslation();

  if (!transaction) return null;

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

  const typeIcons = {
    INCOME: <IncomeIcon />,
    EXPENSE: <ExpenseIcon />,
    TRANSFER: <TransferIcon />,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {typeIcons[transaction.transactionType]}
            <Typography variant="h6">
              {t('finance.transactionDetail')} - {transaction.code}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
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
      </DialogTitle>
      <DialogContent>
        {/* Main Info */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t('finance.transactionInfo')}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">{t('finance.date')}</Typography>
            <Typography fontWeight="medium">{formatDate(transaction.transactionDate)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">{t('finance.category')}</Typography>
            <Typography fontWeight="medium">{transaction.category}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">{t('finance.description')}</Typography>
            <Typography fontWeight="medium">{transaction.description}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Amount Info */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t('finance.amountInfo')}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">{t('finance.amount')}</Typography>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              color={transaction.transactionType === 'INCOME' ? 'success.main' : transaction.transactionType === 'EXPENSE' ? 'error.main' : 'text.primary'}
            >
              {transaction.transactionType === 'INCOME' ? '+' : transaction.transactionType === 'EXPENSE' ? '-' : ''}
              {formatCurrency(transaction.amount, transaction.currency)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">{t('finance.currency')}</Typography>
            <Typography fontWeight="medium">{transaction.currency}</Typography>
          </Grid>
          {transaction.amountInUsd && transaction.currency !== 'USD' && (
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">{t('finance.amountInUsd')}</Typography>
              <Typography fontWeight="medium">{formatCurrency(transaction.amountInUsd, 'USD')}</Typography>
            </Grid>
          )}
          {transaction.exchangeRate && transaction.exchangeRate !== 1 && (
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">{t('finance.exchangeRate')}</Typography>
              <Typography fontWeight="medium">{transaction.exchangeRate}</Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Account Info */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t('finance.accountInfo')}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {transaction.transactionType === 'TRANSFER' ? t('finance.fromAccount') : t('finance.account')}
            </Typography>
            <Typography fontWeight="medium">{transaction.account?.name}</Typography>
          </Grid>
          {transaction.destinationAccount && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">{t('finance.toAccount')}</Typography>
              <Typography fontWeight="medium">{transaction.destinationAccount?.name}</Typography>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">{t('finance.paymentMethod')}</Typography>
            <Typography fontWeight="medium">{getPaymentMethodLabel(transaction.paymentMethod)}</Typography>
          </Grid>
          {transaction.reference && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">{t('finance.reference')}</Typography>
              <Typography fontWeight="medium">{transaction.reference}</Typography>
            </Grid>
          )}
        </Grid>

        {/* Counterparty Info */}
        {(transaction.counterparty || transaction.counterpartyDocument) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {transaction.transactionType === 'INCOME' ? t('finance.payerInfo') : t('finance.beneficiaryInfo')}
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {transaction.counterparty && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">{t('common.name')}</Typography>
                  <Typography fontWeight="medium">{transaction.counterparty}</Typography>
                </Grid>
              )}
              {transaction.counterpartyDocument && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">{t('finance.document')}</Typography>
                  <Typography fontWeight="medium">{transaction.counterpartyDocument}</Typography>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* Notes */}
        {transaction.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('common.notes')}
            </Typography>
            <Typography>{transaction.notes}</Typography>
          </>
        )}

        {/* Audit Info */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t('finance.auditInfo')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">{t('common.createdBy')}</Typography>
            <Typography fontWeight="medium">
              {transaction.creator ? `${transaction.creator.firstName} ${transaction.creator.lastName}` : '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">{t('common.createdAt')}</Typography>
            <Typography fontWeight="medium">{formatDateTime(transaction.createdAt)}</Typography>
          </Grid>
          {transaction.isReconciled && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">{t('finance.reconciledBy')}</Typography>
                <Typography fontWeight="medium">
                  {transaction.reconciler ? `${transaction.reconciler.firstName} ${transaction.reconciler.lastName}` : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">{t('finance.reconciledAt')}</Typography>
                <Typography fontWeight="medium">{formatDateTime(transaction.reconciledAt)}</Typography>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailDialog;
