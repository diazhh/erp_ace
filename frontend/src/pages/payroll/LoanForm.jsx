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
  Autocomplete,
  IconButton,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { createLoan } from '../../store/slices/payrollSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';

const initialFormData = {
  employeeId: '',
  loanType: 'PERSONAL',
  description: '',
  amount: '',
  currency: 'USD',
  totalInstallments: 1,
  startDate: '',
  notes: '',
};

const LoanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { employees } = useSelector((state) => state.employees);
  
  const [formData, setFormData] = useState(initialFormData);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!id;

  useEffect(() => {
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
    
    // Set default start date to next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    setFormData((prev) => ({
      ...prev,
      startDate: nextMonth.toISOString().split('T')[0],
    }));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleEmployeeChange = (event, newValue) => {
    setSelectedEmployee(newValue);
    setFormData((prev) => ({ ...prev, employeeId: newValue?.id || '' }));
    if (errors.employeeId) {
      setErrors((prev) => ({ ...prev, employeeId: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = t('validation.required');
    if (!formData.amount || formData.amount <= 0) newErrors.amount = t('validation.required');
    if (!formData.totalInstallments || formData.totalInstallments < 1) {
      newErrors.totalInstallments = t('validation.required');
    }
    if (!formData.startDate) newErrors.startDate = t('validation.required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await dispatch(createLoan(formData)).unwrap();
      toast.success(t('payroll.loanCreated'));
      navigate(`/payroll/loans/${result.id}`);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/payroll/loans');
  };

  const installmentAmount = formData.amount && formData.totalInstallments
    ? (parseFloat(formData.amount) / parseInt(formData.totalInstallments)).toFixed(2)
    : 0;

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
    }).format(amount || 0);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={handleBack}>
          <BackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? t('payroll.editLoan') : t('payroll.newLoan')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Formulario */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Empleado */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={employees}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.idType}${option.idNumber}`}
                    value={selectedEmployee}
                    onChange={handleEmployeeChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('payroll.employee')}
                        required
                        error={!!errors.employeeId}
                        helperText={errors.employeeId}
                      />
                    )}
                  />
                </Grid>

                {/* Tipo y Moneda */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label={t('payroll.loanType')}
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleChange}
                  >
                    <MenuItem value="PERSONAL">{t('payroll.loanTypePersonal')}</MenuItem>
                    <MenuItem value="ADVANCE">{t('payroll.loanTypeAdvance')}</MenuItem>
                    <MenuItem value="EMERGENCY">{t('payroll.loanTypeEmergency')}</MenuItem>
                    <MenuItem value="OTHER">{t('payroll.loanTypeOther')}</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label={t('payroll.currency')}
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <MenuItem value="USD">USD - Dólar</MenuItem>
                    <MenuItem value="VES">VES - Bolívar</MenuItem>
                  </TextField>
                </Grid>

                {/* Descripción */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('common.description')}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t('payroll.loanReasonPlaceholder')}
                  />
                </Grid>

                {/* Monto y Cuotas */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('payroll.totalAmount')}
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    error={!!errors.amount}
                    helperText={errors.amount}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('payroll.numberOfInstallments')}
                    name="totalInstallments"
                    type="number"
                    value={formData.totalInstallments}
                    onChange={handleChange}
                    required
                    error={!!errors.totalInstallments}
                    helperText={errors.totalInstallments}
                    inputProps={{ min: 1, max: 60 }}
                  />
                </Grid>

                {/* Fecha de inicio */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('payroll.startDate')}
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    error={!!errors.startDate}
                    helperText={errors.startDate || t('payroll.firstDeductionDate')}
                    InputLabelProps={{ shrink: true }}
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
                  disabled={loading}
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  variant="contained" 
                  type="submit"
                  fullWidth={isMobile}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {isEdit ? t('common.save') : t('payroll.createLoan')}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Resumen */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalculateIcon color="primary" />
                <Typography variant="h6">{t('payroll.summary')}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('payroll.totalAmount')}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {formatCurrency(formData.amount || 0, formData.currency)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('payroll.numberOfInstallments')}
                </Typography>
                <Typography variant="h6">
                  {formData.totalInstallments || 0} {t('payroll.installments')}
                </Typography>
              </Box>

              <Box sx={{ mb: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('payroll.monthlyInstallment')}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {formatCurrency(installmentAmount, formData.currency)}
                </Typography>
              </Box>

              {selectedEmployee && (
                <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('payroll.selectedEmployee')}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEmployee.position}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoanForm;
