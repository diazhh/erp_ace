import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';

import { createTransaction, createTransfer } from '../../store/slices/financeSlice';

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

const TransactionFormDialog = ({ open, onClose, type, accounts }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isTransfer = type === 'TRANSFER';

  useEffect(() => {
    if (open) {
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
    }
  }, [open, type]);

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

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
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
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      // Income
      SALES: t('finance.categorySales'),
      SERVICES: t('finance.categoryServices'),
      INTEREST: t('finance.categoryInterest'),
      REFUND: t('finance.categoryRefund'),
      OTHER_INCOME: t('finance.categoryOtherIncome'),
      // Expense
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

  const typeLabel = {
    INCOME: t('finance.newIncome'),
    EXPENSE: t('finance.newExpense'),
    TRANSFER: t('finance.newTransfer'),
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{typeLabel[type]}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Account Selection */}
          <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
              {t('finance.additionalInfo')}
            </Typography>
          </Grid>

          {/* Reference */}
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  name="counterparty"
                  label={type === 'INCOME' ? t('finance.payer') : t('finance.beneficiary')}
                  value={formData.counterparty}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          color={type === 'INCOME' ? 'success' : type === 'EXPENSE' ? 'error' : 'primary'}
        >
          {loading ? <CircularProgress size={24} /> : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionFormDialog;
