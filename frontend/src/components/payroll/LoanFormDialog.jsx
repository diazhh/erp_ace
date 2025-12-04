import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Autocomplete,
  Typography,
} from '@mui/material';
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

const LoanFormDialog = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employees);
  
  const [formData, setFormData] = useState(initialFormData);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      dispatch(fetchEmployees({ limit: 100, status: 'ACTIVE' }));
      // Set default start date to next month
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      setFormData({
        ...initialFormData,
        startDate: nextMonth.toISOString().split('T')[0],
      });
      setSelectedEmployee(null);
      setErrors({});
    }
  }, [open, dispatch]);

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

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await dispatch(createLoan(formData)).unwrap();
      toast.success(t('payroll.loanCreated'));
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const installmentAmount = formData.amount && formData.totalInstallments
    ? (parseFloat(formData.amount) / parseInt(formData.totalInstallments)).toFixed(2)
    : 0;

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{t('payroll.newLoan')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Autocomplete
              options={employees}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.idNumber}`}
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
          <Grid item xs={12} sm={6}>
            <TextField
              name="loanType"
              label={t('payroll.loanType')}
              value={formData.loanType}
              onChange={handleChange}
              select
              fullWidth
            >
              <MenuItem value="PERSONAL">{t('payroll.loanTypePersonal')}</MenuItem>
              <MenuItem value="ADVANCE">{t('payroll.loanTypeAdvance')}</MenuItem>
              <MenuItem value="EMERGENCY">{t('payroll.loanTypeEmergency')}</MenuItem>
              <MenuItem value="OTHER">{t('payroll.loanTypeOther')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="currency"
              label={t('payroll.currency')}
              value={formData.currency}
              onChange={handleChange}
              select
              fullWidth
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="VES">VES</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label={t('common.description')}
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="amount"
              label={t('payroll.amount')}
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
              name="totalInstallments"
              label={t('payroll.totalInstallments')}
              type="number"
              value={formData.totalInstallments}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.totalInstallments}
              helperText={errors.totalInstallments}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="startDate"
              label={t('payroll.startDate')}
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {t('payroll.installmentAmount')}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              ${installmentAmount}
            </Typography>
          </Grid>
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
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoanFormDialog;
