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

const accountTypes = [
  { value: 'CHECKING', label: 'Cuenta Corriente' },
  { value: 'SAVINGS', label: 'Cuenta de Ahorro' },
  { value: 'CRYPTO_WALLET', label: 'Wallet Crypto' },
  { value: 'CASH', label: 'Efectivo' },
  { value: 'PAGO_MOVIL', label: 'Pago Móvil' },
  { value: 'ZELLE', label: 'Zelle' },
];

const currencies = [
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'VES', label: 'Bolívar (VES)' },
  { value: 'EUR', label: 'Euro (EUR)' },
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
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    
    if (['CHECKING', 'SAVINGS'].includes(formData.accountType)) {
      if (!formData.bankName?.trim()) newErrors.bankName = 'Banco es requerido';
    }
    
    if (formData.accountType === 'CRYPTO_WALLET') {
      if (!formData.walletAddress?.trim()) newErrors.walletAddress = 'Dirección de wallet es requerida';
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
        toast.success('Cuenta actualizada exitosamente');
      } else {
        const result = await dispatch(createAccount(formData)).unwrap();
        toast.success('Cuenta creada exitosamente');
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
          {isEdit ? 'Editar Cuenta Bancaria' : 'Nueva Cuenta Bancaria'}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Nombre */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de la Cuenta"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Ej: Cuenta Principal, Nómina, etc."
              />
            </Grid>

            {/* Tipo */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Tipo de Cuenta"
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
                label="Moneda"
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
                  label="Saldo Inicial"
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
                    label="Banco"
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
                    label="Número de Cuenta"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Titular"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="RIF"
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
                  label="Teléfono"
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
                    label="Red/Network"
                    name="network"
                    value={formData.network}
                    onChange={handleChange}
                    placeholder="Ej: TRC20, ERC20, BEP20"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección de Wallet"
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
                label="Cuenta Activa"
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
                label="Cuenta por Defecto"
              />
            </Grid>

            {/* Notas */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
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
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              fullWidth={isMobile}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {isEdit ? 'Guardar Cambios' : 'Crear Cuenta'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default BankAccountForm;
