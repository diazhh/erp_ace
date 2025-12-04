import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Alert,
  FormControlLabel,
  Switch,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import organizationService from '../../services/organizationService';
import employeeService from '../../services/employeeService';

const accountTypes = [
  { value: 'CHECKING', label: 'Cuenta Corriente' },
  { value: 'SAVINGS', label: 'Cuenta de Ahorro' },
  { value: 'PAGO_MOVIL', label: 'Pago Móvil' },
  { value: 'ZELLE', label: 'Zelle' },
  { value: 'CRYPTO', label: 'Crypto Wallet' },
];

const currencies = [
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'VES', label: 'Bolívar (VES)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USDT', label: 'USDT' },
];

const banks = [
  'Banco de Venezuela',
  'Banesco',
  'Banco Mercantil',
  'BBVA Provincial',
  'Banco Nacional de Crédito (BNC)',
  'Banco Exterior',
  'Banco del Tesoro',
  'Banco Bicentenario',
  'Banco Caroní',
  'Banco Sofitasa',
  'Bancrecer',
  'Banco Plaza',
  'Banco Activo',
  'Banplus',
  'Banco Fondo Común (BFC)',
  'Mi Banco',
  '100% Banco',
  'Banco Agrícola de Venezuela',
  'Bancamiga',
  'Bancaribe',
  'Otro',
];

const initialFormData = {
  accountType: 'CHECKING',
  bankName: '',
  bankCode: '',
  accountNumber: '',
  accountHolder: '',
  holderIdType: 'V',
  holderIdNumber: '',
  phoneNumber: '',
  zelleEmail: '',
  walletAddress: '',
  network: '',
  currency: 'USD',
  isPrimary: false,
  paymentPercentage: 100,
  notes: '',
  status: 'ACTIVE',
};

const EmployeeBankAccountForm = () => {
  const { employeeId, accountId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [errors, setErrors] = useState({});

  const isEdit = !!accountId;

  useEffect(() => {
    loadEmployee();
    if (isEdit) {
      loadAccount();
    }
  }, [employeeId, accountId]);

  const loadEmployee = async () => {
    try {
      const response = await employeeService.getById(employeeId);
      setEmployee(response.data);
    } catch (error) {
      toast.error('Error al cargar empleado');
      navigate('/employees');
    }
  };

  const loadAccount = async () => {
    try {
      setLoadingData(true);
      const response = await organizationService.getBankAccountById(accountId);
      setFormData({
        ...initialFormData,
        ...response.data,
      });
    } catch (error) {
      toast.error('Error al cargar cuenta bancaria');
      navigate(`/employees/${employeeId}`);
    } finally {
      setLoadingData(false);
    }
  };

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
    if (!formData.bankName.trim()) newErrors.bankName = 'Banco es requerido';
    
    if (formData.accountType === 'CHECKING' || formData.accountType === 'SAVINGS') {
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Número de cuenta es requerido';
    }
    
    if (formData.accountType === 'PAGO_MOVIL') {
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Teléfono es requerido';
    }
    
    if (formData.accountType === 'ZELLE') {
      if (!formData.zelleEmail.trim()) newErrors.zelleEmail = 'Email de Zelle es requerido';
    }
    
    if (formData.accountType === 'CRYPTO') {
      if (!formData.walletAddress.trim()) newErrors.walletAddress = 'Dirección de wallet es requerida';
    }

    if (formData.paymentPercentage < 0 || formData.paymentPercentage > 100) {
      newErrors.paymentPercentage = 'Porcentaje debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        employeeId,
      };

      if (isEdit) {
        await organizationService.updateBankAccount(accountId, dataToSend);
        toast.success('Cuenta bancaria actualizada');
      } else {
        await organizationService.createBankAccount(dataToSend);
        toast.success('Cuenta bancaria creada');
      }
      navigate(`/employees/${employeeId}`, { state: { tab: 2 } }); // Tab de Cuentas
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/employees/${employeeId}`);
  };

  if (loadingData) {
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
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {isEdit ? 'Editar Cuenta Bancaria' : 'Nueva Cuenta Bancaria'}
          </Typography>
          {employee && (
            <Typography variant="body2" color="text.secondary">
              Empleado: {employee.firstName} {employee.lastName} ({employee.employeeCode})
            </Typography>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Tipo de cuenta */}
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

            {/* Banco - para cuentas tradicionales y pago móvil */}
            {['CHECKING', 'SAVINGS', 'PAGO_MOVIL'].includes(formData.accountType) && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Banco"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    error={!!errors.bankName}
                    helperText={errors.bankName}
                    required
                  >
                    {banks.map((bank) => (
                      <MenuItem key={bank} value={bank}>
                        {bank}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Código del Banco"
                    name="bankCode"
                    value={formData.bankCode}
                    onChange={handleChange}
                    placeholder="Ej: 0102"
                  />
                </Grid>
              </>
            )}

            {/* Número de cuenta - para cuentas tradicionales */}
            {['CHECKING', 'SAVINGS'].includes(formData.accountType) && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Número de Cuenta"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Titular de la Cuenta"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Tipo ID"
                    name="holderIdType"
                    value={formData.holderIdType}
                    onChange={handleChange}
                  >
                    <MenuItem value="V">V</MenuItem>
                    <MenuItem value="E">E</MenuItem>
                    <MenuItem value="J">J</MenuItem>
                    <MenuItem value="P">P</MenuItem>
                    <MenuItem value="G">G</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Número ID"
                    name="holderIdNumber"
                    value={formData.holderIdNumber}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            {/* Pago Móvil */}
            {formData.accountType === 'PAGO_MOVIL' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    placeholder="04XX-XXXXXXX"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Tipo ID"
                    name="holderIdType"
                    value={formData.holderIdType}
                    onChange={handleChange}
                  >
                    <MenuItem value="V">V</MenuItem>
                    <MenuItem value="E">E</MenuItem>
                    <MenuItem value="J">J</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Cédula"
                    name="holderIdNumber"
                    value={formData.holderIdNumber}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            {/* Zelle */}
            {formData.accountType === 'ZELLE' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Banco/Institución"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    error={!!errors.bankName}
                    helperText={errors.bankName}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email de Zelle"
                    name="zelleEmail"
                    value={formData.zelleEmail}
                    onChange={handleChange}
                    error={!!errors.zelleEmail}
                    helperText={errors.zelleEmail}
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre del Titular"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            {/* Crypto */}
            {formData.accountType === 'CRYPTO' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Plataforma/Exchange"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    error={!!errors.bankName}
                    helperText={errors.bankName}
                    placeholder="Ej: Binance, Coinbase"
                    required
                  />
                </Grid>
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

            {/* Porcentaje y primaria */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Porcentaje de Pago"
                name="paymentPercentage"
                type="number"
                value={formData.paymentPercentage}
                onChange={handleChange}
                error={!!errors.paymentPercentage}
                helperText={errors.paymentPercentage || 'Porcentaje del salario a depositar en esta cuenta'}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPrimary}
                    onChange={handleChange}
                    name="isPrimary"
                  />
                }
                label="Cuenta Principal"
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
                rows={2}
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
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              fullWidth={isMobile}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {isEdit ? 'Guardar Cambios' : 'Crear Cuenta'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EmployeeBankAccountForm;
