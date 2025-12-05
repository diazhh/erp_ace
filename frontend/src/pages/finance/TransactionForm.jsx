import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  SwapHoriz as TransferIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  createTransaction, 
  createTransfer, 
  fetchAccounts,
} from '../../store/slices/financeSlice';

const categories = {
  INCOME: [
    'SALES', 'SERVICES', 'INTEREST', 'REFUND', 'OTHER_INCOME',
  ],
  EXPENSE: [
    'PAYROLL', 'RENT', 'UTILITIES', 'SUPPLIES', 'EQUIPMENT', 
    'TRANSPORT', 'FUEL', 'MAINTENANCE', 'TAXES', 'INSURANCE',
    'PROFESSIONAL_SERVICES', 'MARKETING', 'TRAVEL', 'FOOD', 'OTHER_EXPENSE',
  ],
};

const typeIcons = {
  INCOME: <IncomeIcon />,
  EXPENSE: <ExpenseIcon />,
  TRANSFER: <TransferIcon />,
};

const typeColors = {
  INCOME: 'success',
  EXPENSE: 'error',
  TRANSFER: 'info',
};

const TransactionForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { accounts, loading } = useSelector((state) => state.finance);
  
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const type = searchParams.get('type') || 'EXPENSE';
  const isTransfer = type === 'TRANSFER';
  const isEdit = !!id;

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      transactionType: type,
      accountId: '',
      destinationAccountId: '',
      category: '',
      amount: '',
      currency: 'USD',
      exchangeRate: 1,
      transactionDate: today,
      description: '',
      reference: '',
      counterparty: '',
      counterpartyDocument: '',
      paymentMethod: 'BANK_TRANSFER',
      notes: '',
    });
    setErrors({});
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Auto-set currency based on account
    if (name === 'accountId') {
      const account = accounts.find(a => a.id === value);
      if (account) {
        setFormData((prev) => ({ ...prev, currency: account.currency }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.accountId) newErrors.accountId = t('validation.required');
    if (isTransfer && !formData.destinationAccountId) newErrors.destinationAccountId = t('validation.required');
    if (!isTransfer && !formData.category) newErrors.category = t('validation.required');
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = t('validation.required');
    if (!formData.transactionDate) newErrors.transactionDate = t('validation.required');
    if (!formData.description.trim()) newErrors.description = t('validation.required');
    
    if (isTransfer && formData.accountId === formData.destinationAccountId) {
      newErrors.destinationAccountId = t('finance.sameAccountError');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isTransfer) {
        await dispatch(createTransfer({
          fromAccountId: formData.accountId,
          toAccountId: formData.destinationAccountId,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          exchangeRate: parseFloat(formData.exchangeRate) || 1,
          transactionDate: formData.transactionDate,
          description: formData.description,
          reference: formData.reference,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        })).unwrap();
        toast.success(t('finance.transferCreated'));
      } else {
        await dispatch(createTransaction({
          ...formData,
          amount: parseFloat(formData.amount),
        })).unwrap();
        toast.success(t('finance.transactionCreated'));
      }
      navigate('/finance/transactions');
    } catch (error) {
      toast.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/finance/transactions');
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

  const getTypeLabel = () => {
    const labels = {
      INCOME: t('finance.newIncome'),
      EXPENSE: t('finance.newExpense'),
      TRANSFER: t('finance.newTransfer'),
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={handleBack}>
          <BackIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {typeIcons[type]}
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
            {getTypeLabel()}
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Account Selection */}
            <Grid item xs={12} md={6}>
              <TextField
                name="accountId"
                label={isTransfer ? t('finance.fromAccount') : t('finance.account')}
                value={formData.accountId}
                onChange={handleChange}
                select
                fullWidth
                required
                error={!!errors.accountId}
                helperText={errors.accountId}
              >
                {accounts.filter(a => a.isActive).map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} ({account.currency})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Destination Account for Transfers */}
            {isTransfer && (
              <Grid item xs={12} md={6}>
                <TextField
                  name="destinationAccountId"
                  label={t('finance.toAccount')}
                  value={formData.destinationAccountId}
                  onChange={handleChange}
                  select
                  fullWidth
                  required
                  error={!!errors.destinationAccountId}
                  helperText={errors.destinationAccountId}
                >
                  {accounts.filter(a => a.isActive && a.id !== formData.accountId).map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name} ({account.currency})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* Category for non-transfers */}
            {!isTransfer && (
              <Grid item xs={12} md={6}>
                <TextField
                  name="category"
                  label={t('finance.category')}
                  value={formData.category}
                  onChange={handleChange}
                  select
                  fullWidth
                  required
                  error={!!errors.category}
                  helperText={errors.category}
                >
                  {categories[type]?.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {getCategoryLabel(cat)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* Amount and Currency */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="amount"
                label={t('finance.amount')}
                type="number"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.amount}
                helperText={errors.amount}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="currency"
                label={t('finance.currency')}
                value={formData.currency}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="VES">VES</MenuItem>
                <MenuItem value="USDT">USDT</MenuItem>
              </TextField>
            </Grid>

            {/* Exchange Rate for transfers between different currencies */}
            {isTransfer && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="exchangeRate"
                  label={t('finance.exchangeRate')}
                  type="number"
                  value={formData.exchangeRate}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0, step: 0.000001 }}
                />
              </Grid>
            )}

            {/* Date */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="transactionDate"
                label={t('finance.date')}
                type="date"
                value={formData.transactionDate}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.transactionDate}
                helperText={errors.transactionDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label={t('finance.description')}
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                {t('finance.additionalInfo')}
              </Typography>
            </Grid>

            {/* Reference */}
            <Grid item xs={12} md={6}>
              <TextField
                name="reference"
                label={t('finance.reference')}
                value={formData.reference}
                onChange={handleChange}
                fullWidth
                placeholder={t('finance.referencePlaceholder')}
              />
            </Grid>

            {/* Payment Method */}
            <Grid item xs={12} md={6}>
              <TextField
                name="paymentMethod"
                label={t('finance.paymentMethod')}
                value={formData.paymentMethod}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="BANK_TRANSFER">{t('finance.methodBankTransfer')}</MenuItem>
                <MenuItem value="CASH">{t('finance.methodCash')}</MenuItem>
                <MenuItem value="BINANCE">{t('finance.methodBinance')}</MenuItem>
                <MenuItem value="PAGO_MOVIL">{t('finance.methodPagoMovil')}</MenuItem>
                <MenuItem value="ZELLE">{t('finance.methodZelle')}</MenuItem>
                <MenuItem value="CHECK">{t('finance.methodCheck')}</MenuItem>
              </TextField>
            </Grid>

            {/* Counterparty (for non-transfers) */}
            {!isTransfer && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="counterparty"
                    label={type === 'INCOME' ? t('finance.payer') : t('finance.beneficiary')}
                    value={formData.counterparty}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="counterpartyDocument"
                    label={t('finance.document')}
                    value={formData.counterpartyDocument}
                    onChange={handleChange}
                    fullWidth
                    placeholder="RIF/CI"
                  />
                </Grid>
              </>
            )}

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                name="notes"
                label={t('common.notes')}
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 3,
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            justifyContent: 'flex-end',
          }}>
            <Button 
              variant="outlined" 
              onClick={handleBack}
              fullWidth={isMobile}
              disabled={saving}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              fullWidth={isMobile}
              disabled={saving}
              color={typeColors[type]}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {t('common.save')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default TransactionForm;
