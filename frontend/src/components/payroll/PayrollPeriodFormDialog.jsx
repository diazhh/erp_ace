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
} from '@mui/material';
import { toast } from 'react-toastify';

import { createPeriod, updatePeriod } from '../../store/slices/payrollSlice';

const initialFormData = {
  name: '',
  periodType: 'BIWEEKLY',
  startDate: '',
  endDate: '',
  paymentDate: '',
  currency: 'USD',
  exchangeRate: 1,
  notes: '',
};

const PayrollPeriodFormDialog = ({ open, onClose, period }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!period;

  useEffect(() => {
    if (period) {
      setFormData({
        name: period.name || '',
        periodType: period.periodType || 'BIWEEKLY',
        startDate: period.startDate?.split('T')[0] || '',
        endDate: period.endDate?.split('T')[0] || '',
        paymentDate: period.paymentDate?.split('T')[0] || '',
        currency: period.currency || 'USD',
        exchangeRate: period.exchangeRate || 1,
        notes: period.notes || '',
      });
    } else {
      // Set default dates for new period
      const today = new Date();
      const day = today.getDate();
      let startDate, endDate, paymentDate;
      
      if (day <= 15) {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 15);
        paymentDate = new Date(today.getFullYear(), today.getMonth(), 15);
      } else {
        startDate = new Date(today.getFullYear(), today.getMonth(), 16);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        paymentDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      }
      
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const quincena = day <= 15 ? '1' : '2';
      
      setFormData({
        ...initialFormData,
        name: `Nómina ${monthNames[today.getMonth()]} ${today.getFullYear()} - Quincena ${quincena}`,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        paymentDate: paymentDate.toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [period, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('validation.required');
    if (!formData.startDate) newErrors.startDate = t('validation.required');
    if (!formData.endDate) newErrors.endDate = t('validation.required');
    if (!formData.paymentDate) newErrors.paymentDate = t('validation.required');
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = t('payroll.endDateAfterStart');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await dispatch(updatePeriod({ id: period.id, data: formData })).unwrap();
        toast.success(t('payroll.periodUpdated'));
      } else {
        await dispatch(createPeriod(formData)).unwrap();
        toast.success(t('payroll.periodCreated'));
      }
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? t('payroll.editPeriod') : t('payroll.newPeriod')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label={t('payroll.periodName')}
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
              name="periodType"
              label={t('payroll.periodType')}
              value={formData.periodType}
              onChange={handleChange}
              select
              fullWidth
            >
              <MenuItem value="WEEKLY">{t('payroll.weekly')}</MenuItem>
              <MenuItem value="BIWEEKLY">{t('payroll.biweekly')}</MenuItem>
              <MenuItem value="MONTHLY">{t('payroll.monthly')}</MenuItem>
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
            <TextField
              name="endDate"
              label={t('payroll.endDate')}
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.endDate}
              helperText={errors.endDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="paymentDate"
              label={t('payroll.paymentDate')}
              type="date"
              value={formData.paymentDate}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.paymentDate}
              helperText={errors.paymentDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="exchangeRate"
              label={t('payroll.exchangeRate')}
              type="number"
              value={formData.exchangeRate}
              onChange={handleChange}
              fullWidth
              inputProps={{ step: 0.0001, min: 0 }}
            />
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

export default PayrollPeriodFormDialog;
