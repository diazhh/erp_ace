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
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';

import { updateEntry } from '../../store/slices/payrollSlice';

const PayrollEntryEditDialog = ({ open, onClose, entry }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setFormData({
        daysWorked: entry.daysWorked || 0,
        overtime: entry.overtime || 0,
        overtimeHours: entry.overtimeHours || 0,
        bonus: entry.bonus || 0,
        commission: entry.commission || 0,
        foodAllowance: entry.foodAllowance || 0,
        transportAllowance: entry.transportAllowance || 0,
        otherIncome: entry.otherIncome || 0,
        otherIncomeDescription: entry.otherIncomeDescription || '',
        otherDeductions: entry.otherDeductions || 0,
        otherDeductionsDescription: entry.otherDeductionsDescription || '',
        paymentMethod: entry.paymentMethod || 'BANK_TRANSFER',
        notes: entry.notes || '',
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await dispatch(updateEntry({ id: entry.id, data: formData })).unwrap();
      toast.success(t('payroll.entryUpdated'));
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('payroll.editEntry')} - {entry.employee?.firstName} {entry.employee?.lastName}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Employee Info */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('payroll.employeeInfo')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">{t('payroll.baseSalary')}</Typography>
              <Typography fontWeight="medium">${entry.baseSalary}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">{t('payroll.totalDays')}</Typography>
              <Typography fontWeight="medium">{entry.totalDays}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Days Worked */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('payroll.workInfo')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                name="daysWorked"
                label={t('payroll.daysWorked')}
                type="number"
                value={formData.daysWorked}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 0, max: entry.totalDays }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="overtimeHours"
                label={t('payroll.overtimeHours')}
                type="number"
                value={formData.overtimeHours}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="overtime"
                label={t('payroll.overtimeAmount')}
                type="number"
                value={formData.overtime}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Additional Income */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('payroll.additionalIncome')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                name="bonus"
                label={t('payroll.bonus')}
                type="number"
                value={formData.bonus}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="commission"
                label={t('payroll.commission')}
                type="number"
                value={formData.commission}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="foodAllowance"
                label={t('payroll.foodAllowance')}
                type="number"
                value={formData.foodAllowance}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="transportAllowance"
                label={t('payroll.transportAllowance')}
                type="number"
                value={formData.transportAllowance}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="otherIncome"
                label={t('payroll.otherIncome')}
                type="number"
                value={formData.otherIncome}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="otherIncomeDescription"
                label={t('payroll.otherIncomeDescription')}
                value={formData.otherIncomeDescription}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Additional Deductions */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('payroll.additionalDeductions')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="otherDeductions"
                label={t('payroll.otherDeductions')}
                type="number"
                value={formData.otherDeductions}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="otherDeductionsDescription"
                label={t('payroll.otherDeductionsDescription')}
                value={formData.otherDeductionsDescription}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Payment Method */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="paymentMethod"
                label={t('payroll.paymentMethod')}
                value={formData.paymentMethod}
                onChange={handleChange}
                select
                fullWidth
                size="small"
              >
                <MenuItem value="BANK_TRANSFER">{t('payroll.bankTransfer')}</MenuItem>
                <MenuItem value="CASH">{t('payroll.cash')}</MenuItem>
                <MenuItem value="BINANCE">Binance</MenuItem>
                <MenuItem value="PAGO_MOVIL">Pago Móvil</MenuItem>
                <MenuItem value="ZELLE">Zelle</MenuItem>
                <MenuItem value="CHECK">{t('payroll.check')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label={t('common.notes')}
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                size="small"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </Box>
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

export default PayrollEntryEditDialog;
