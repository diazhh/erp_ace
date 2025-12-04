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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { toast } from 'react-toastify';

import { createAccount, updateAccount } from '../../store/slices/financeSlice';

const initialFormData = {
  name: '',
  accountType: 'CHECKING',
  bankName: '',
  accountNumber: '',
  accountHolder: '',
  rif: '',
  phone: '',
  walletAddress: '',
  network: '',
  currency: 'USD',
  currentBalance: 0,
  isActive: true,
  isDefault: false,
  notes: '',
};

const BankAccountFormDialog = ({ open, onClose, account }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!account;

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        accountType: account.accountType || 'CHECKING',
        bankName: account.bankName || '',
        accountNumber: account.accountNumber || '',
        accountHolder: account.accountHolder || '',
        rif: account.rif || '',
        phone: account.phone || '',
        walletAddress: account.walletAddress || '',
        network: account.network || '',
        currency: account.currency || 'USD',
        currentBalance: account.currentBalance || 0,
        isActive: account.isActive !== false,
        isDefault: account.isDefault || false,
        notes: account.notes || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [account, open]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('validation.required');
    if (!formData.accountType) newErrors.accountType = t('validation.required');
    if (!formData.currency) newErrors.currency = t('validation.required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await dispatch(updateAccount({ id: account.id, data: formData })).unwrap();
        toast.success(t('finance.accountUpdated'));
      } else {
        await dispatch(createAccount(formData)).unwrap();
        toast.success(t('finance.accountCreated'));
      }
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showBankFields = ['CHECKING', 'SAVINGS'].includes(formData.accountType);
  const showCryptoFields = formData.accountType === 'CRYPTO_WALLET';
  const showMobileFields = formData.accountType === 'PAGO_MOVIL';

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? t('finance.editAccount') : t('finance.newAccount')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label={t('finance.accountName')}
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="accountType"
              label={t('finance.accountType')}
              value={formData.accountType}
              onChange={handleChange}
              select
              fullWidth
              required
            >
              <MenuItem value="CHECKING">{t('finance.accountTypeChecking')}</MenuItem>
              <MenuItem value="SAVINGS">{t('finance.accountTypeSavings')}</MenuItem>
              <MenuItem value="CRYPTO_WALLET">{t('finance.accountTypeCrypto')}</MenuItem>
              <MenuItem value="CASH">{t('finance.accountTypeCash')}</MenuItem>
              <MenuItem value="PAGO_MOVIL">{t('finance.accountTypePagoMovil')}</MenuItem>
              <MenuItem value="ZELLE">{t('finance.accountTypeZelle')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="currency"
              label={t('finance.currency')}
              value={formData.currency}
              onChange={handleChange}
              select
              fullWidth
              required
            >
              <MenuItem value="USD">USD - Dólar</MenuItem>
              <MenuItem value="VES">VES - Bolívar</MenuItem>
              <MenuItem value="USDT">USDT - Tether</MenuItem>
            </TextField>
          </Grid>

          {/* Bank Fields */}
          {showBankFields && (
            <>
              <Grid item xs={12}>
                <TextField
                  name="bankName"
                  label={t('finance.bankName')}
                  value={formData.bankName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="accountNumber"
                  label={t('finance.accountNumber')}
                  value={formData.accountNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="accountHolder"
                  label={t('finance.accountHolder')}
                  value={formData.accountHolder}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="rif"
                  label={t('finance.rif')}
                  value={formData.rif}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </>
          )}

          {/* Crypto Fields */}
          {showCryptoFields && (
            <>
              <Grid item xs={12}>
                <TextField
                  name="walletAddress"
                  label={t('finance.walletAddress')}
                  value={formData.walletAddress}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="network"
                  label={t('finance.network')}
                  value={formData.network}
                  onChange={handleChange}
                  select
                  fullWidth
                >
                  <MenuItem value="BSC">BSC (BEP20)</MenuItem>
                  <MenuItem value="TRC20">TRC20</MenuItem>
                  <MenuItem value="ERC20">ERC20</MenuItem>
                </TextField>
              </Grid>
            </>
          )}

          {/* Pago Movil Fields */}
          {showMobileFields && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label={t('finance.phone')}
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  placeholder="0412-1234567"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="rif"
                  label={t('finance.rif')}
                  value={formData.rif}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="bankName"
                  label={t('finance.bankName')}
                  value={formData.bankName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </>
          )}

          {!isEdit && (
            <Grid item xs={12} sm={6}>
              <TextField
                name="currentBalance"
                label={t('finance.initialBalance')}
                type="number"
                value={formData.currentBalance}
                onChange={handleChange}
                fullWidth
                inputProps={{ step: 0.01 }}
              />
            </Grid>
          )}

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

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
              }
              label={t('common.active')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />
              }
              label={t('finance.defaultAccount')}
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
        >
          {loading ? <CircularProgress size={24} /> : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BankAccountFormDialog;
