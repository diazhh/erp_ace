import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FormControlLabel,
  Switch,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { createAccount, updateAccount, fetchAccountById } from '../../store/slices/financeSlice';

const getAccountTypes = (t) => [
  { value: 'CHECKING', label: t('finance.accountTypeChecking') },
  { value: 'SAVINGS', label: t('finance.accountTypeSavings') },
  { value: 'CRYPTO_WALLET', label: t('finance.accountTypeCrypto') },
  { value: 'CASH', label: t('finance.accountTypeCash') },
  { value: 'PAGO_MOVIL', label: t('finance.accountTypePagoMovil') },
  { value: 'ZELLE', label: t('finance.accountTypeZelle') },
];

const currencies = [
  { value: 'USD', label: 'USD' },
  { value: 'VES', label: 'VES' },
  { value: 'EUR', label: 'EUR' },
  { value: 'USDT', label: 'USDT' },
];

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

const BankAccountForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { currentAccount, loading } = useSelector((state) => state.finance);
  const accountTypes = getAccountTypes(t);
  
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchAccountById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (currentAccount && isEdit) {
      setFormData({
        ...initialFormData,
        ...currentAccount,
        currentBalance: currentAccount.currentBalance || 0,
      });
    }
  }, [currentAccount, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
    
    if (['CHECKING', 'SAVINGS'].includes(formData.accountType)) {
      if (!formData.bankName?.trim()) newErrors.bankName = t('validation.required');
    }
    
    if (formData.accountType === 'CRYPTO_WALLET') {
      if (!formData.walletAddress?.trim()) newErrors.walletAddress = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit) {
        await dispatch(updateAccount({ id, data: formData })).unwrap();
        toast.success(t('finance.accountUpdated'));
      } else {
        const result = await dispatch(createAccount(formData)).unwrap();
        toast.success(t('finance.accountCreated'));
      }
      navigate('/finance/accounts');
    } catch (error) {
      toast.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/finance/accounts');
  };

  if (loading && isEdit) {
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
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? t('finance.editAccount') : t('finance.newAccount')}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Nombre */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('finance.accountName')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
                placeholder={t('finance.accountName')}
              />
            </Grid>

            {/* Tipo */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label={t('finance.accountType')}
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
              >
                {accountTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Moneda */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label={t('finance.currency')}
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
              >
                {currencies.map((curr) => (
                  <MenuItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Saldo inicial (solo para nuevas cuentas) */}
            {!isEdit && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('finance.initialBalance')}
                  name="currentBalance"
                  type="number"
                  value={formData.currentBalance}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            )}

            {/* Campos para cuentas bancarias tradicionales */}
            {['CHECKING', 'SAVINGS', 'PAGO_MOVIL'].includes(formData.accountType) && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('finance.bankName')}
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    error={!!errors.bankName}
                    helperText={errors.bankName}
                    required={['CHECKING', 'SAVINGS'].includes(formData.accountType)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('finance.accountNumber')}
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('finance.accountHolder')}
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('finance.rif')}
                    name="rif"
                    value={formData.rif}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            {/* Campos para Pago Móvil */}
            {formData.accountType === 'PAGO_MOVIL' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('finance.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="04XX-XXXXXXX"
                />
              </Grid>
            )}

            {/* Campos para Crypto */}
            {formData.accountType === 'CRYPTO_WALLET' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('finance.network')}
                    name="network"
                    value={formData.network}
                    onChange={handleChange}
                    placeholder="Ej: TRC20, ERC20, BEP20"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('finance.walletAddress')}
                    name="walletAddress"
                    value={formData.walletAddress}
                    onChange={handleChange}
                    error={!!errors.walletAddress}
                    helperText={errors.walletAddress}
                    required
                  />
                </Grid>
              </>
            )}

            {/* Switches */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange}
                    name="isActive"
                  />
                }
                label={t('finance.activeAccount')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDefault}
                    onChange={handleChange}
                    name="isDefault"
                  />
                }
                label={t('finance.defaultAccount')}
              />
            </Grid>

            {/* Notas */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('common.notes')}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          {/* Botones */}
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

export default BankAccountForm;
