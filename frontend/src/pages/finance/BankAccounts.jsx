import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AccountBalance as BankIcon,
  Wallet as WalletIcon,
  CurrencyExchange as CryptoIcon,
  LocalAtm as CashIcon,
  PhoneAndroid as MobileIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchAccounts, deleteAccount } from '../../store/slices/financeSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const accountTypeIcons = {
  CHECKING: <BankIcon />,
  SAVINGS: <BankIcon />,
  CRYPTO_WALLET: <CryptoIcon />,
  CASH: <CashIcon />,
  PAGO_MOVIL: <MobileIcon />,
  ZELLE: <WalletIcon />,
};

const accountTypeColors = {
  CHECKING: 'primary',
  SAVINGS: 'success',
  CRYPTO_WALLET: 'warning',
  CASH: 'default',
  PAGO_MOVIL: 'info',
  ZELLE: 'secondary',
};

const BankAccounts = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accounts, loading } = useSelector((state) => state.finance);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleNewAccount = () => {
    navigate('/finance/accounts/new');
  };

  const handleEditAccount = (account) => {
    navigate(`/finance/accounts/${account.id}/edit`);
  };

  const handleDeleteClick = (account) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteAccount(accountToDelete.id)).unwrap();
      toast.success(t('finance.accountDeleted'));
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    } catch (error) {
      toast.error(error);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency === 'USDT' ? 'USD' : currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getAccountTypeLabel = (type) => {
    const labels = {
      CHECKING: t('finance.accountTypeChecking'),
      SAVINGS: t('finance.accountTypeSavings'),
      CRYPTO_WALLET: t('finance.accountTypeCrypto'),
      CASH: t('finance.accountTypeCash'),
      PAGO_MOVIL: t('finance.accountTypePagoMovil'),
      ZELLE: t('finance.accountTypeZelle'),
    };
    return labels[type] || type;
  };

  // Calcular totales por moneda
  const totalsByurrency = accounts.reduce((acc, account) => {
    if (account.isActive) {
      acc[account.currency] = (acc[account.currency] || 0) + parseFloat(account.currentBalance || 0);
    }
    return acc;
  }, {});

  if (loading && accounts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('finance.bankAccounts')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewAccount}
        >
          {t('finance.newAccount')}
        </Button>
      </Box>

      {/* Totals by Currency */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(totalsByurrency).map(([currency, total]) => (
          <Grid item xs={12} sm={6} md={3} key={currency}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {t('finance.totalIn')} {currency}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {formatCurrency(total, currency)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Accounts Grid */}
      <Grid container spacing={2}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <Card 
              sx={{ 
                height: '100%',
                opacity: account.isActive ? 1 : 0.6,
                border: account.isDefault ? '2px solid' : 'none',
                borderColor: 'primary.main',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {accountTypeIcons[account.accountType]}
                    <Typography variant="h6" fontWeight="medium">
                      {account.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title="Ver detalle">
                      <IconButton size="small" color="primary" onClick={() => navigate(`/finance/accounts/${account.id}`)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" onClick={() => handleEditAccount(account)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(account)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={getAccountTypeLabel(account.accountType)}
                    color={accountTypeColors[account.accountType]}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={account.currency}
                    variant="outlined"
                    size="small"
                  />
                  {account.isDefault && (
                    <Chip
                      label={t('finance.default')}
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>

                {account.bankName && (
                  <Typography variant="body2" color="text.secondary">
                    {account.bankName}
                  </Typography>
                )}
                {account.accountNumber && (
                  <Typography variant="body2" color="text.secondary">
                    {account.accountNumber}
                  </Typography>
                )}

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('finance.currentBalance')}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color={parseFloat(account.currentBalance) >= 0 ? 'success.main' : 'error.main'}>
                    {formatCurrency(account.currentBalance, account.currency)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {accounts.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            {t('finance.noAccounts')}
          </Typography>
        </Paper>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('finance.deleteAccount')}
        message={t('finance.deleteAccountConfirm')}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setAccountToDelete(null);
        }}
      />
    </Box>
  );
};

export default BankAccounts;
