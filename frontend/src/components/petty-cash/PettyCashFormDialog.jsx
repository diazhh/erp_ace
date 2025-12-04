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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  CircularProgress,
  Autocomplete,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { toast } from 'react-toastify';

import { createPettyCash, updatePettyCash } from '../../store/slices/pettyCashSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchAccounts } from '../../store/slices/financeSlice';

const currencies = ['USD', 'VES'];

const PettyCashFormDialog = ({ open, onClose, pettyCash }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { employees } = useSelector((state) => state.employees);
  const { accounts } = useSelector((state) => state.finance);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'USD',
    initialAmount: '',
    minimumBalance: '',
    maximumExpense: '',
    custodianId: '',
    bankAccountId: '',
    requiresApproval: true,
    approvalThreshold: '',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchEmployees({ status: 'ACTIVE', limit: 100 }));
      dispatch(fetchAccounts());
      
      if (pettyCash) {
        setFormData({
          name: pettyCash.name || '',
          description: pettyCash.description || '',
          currency: pettyCash.currency || 'USD',
          initialAmount: pettyCash.initialAmount || '',
          minimumBalance: pettyCash.minimumBalance || '',
          maximumExpense: pettyCash.maximumExpense || '',
          custodianId: pettyCash.custodianId || '',
          bankAccountId: pettyCash.bankAccountId || '',
          requiresApproval: pettyCash.requiresApproval !== false,
          approvalThreshold: pettyCash.approvalThreshold || '',
          notes: pettyCash.notes || '',
        });
      } else {
        setFormData({
          name: '',
          description: '',
          currency: 'USD',
          initialAmount: '',
          minimumBalance: '',
          maximumExpense: '',
          custodianId: '',
          bankAccountId: '',
          requiresApproval: true,
          approvalThreshold: '',
          notes: '',
        });
      }
    }
  }, [open, pettyCash, dispatch]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        initialAmount: formData.initialAmount ? parseFloat(formData.initialAmount) : 0,
        minimumBalance: formData.minimumBalance ? parseFloat(formData.minimumBalance) : 0,
        maximumExpense: formData.maximumExpense ? parseFloat(formData.maximumExpense) : null,
        approvalThreshold: formData.approvalThreshold ? parseFloat(formData.approvalThreshold) : null,
        bankAccountId: formData.bankAccountId || null,
      };

      if (pettyCash) {
        await dispatch(updatePettyCash({ id: pettyCash.id, data })).unwrap();
        toast.success('Caja chica actualizada');
      } else {
        await dispatch(createPettyCash(data)).unwrap();
        toast.success('Caja chica creada');
      }
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const activeEmployees = employees.filter(e => e.status === 'ACTIVE');

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(false)} 
      maxWidth="md" 
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: { maxHeight: fullScreen ? '100%' : '90vh' }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {pettyCash ? 'Editar Caja Chica' : 'Nueva Caja Chica'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                name="name"
                label="Nombre"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Ej: Caja Chica Oficina Principal"
                size={fullScreen ? 'small' : 'medium'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required size={fullScreen ? 'small' : 'medium'}>
                <InputLabel>Moneda</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  label="Moneda"
                  disabled={!!pettyCash}
                >
                  {currencies.map((curr) => (
                    <MenuItem key={curr} value={curr}>{curr}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="initialAmount"
                label="Monto Inicial"
                type="number"
                value={formData.initialAmount}
                onChange={handleChange}
                fullWidth
                required={!pettyCash}
                disabled={!!pettyCash}
                size={fullScreen ? 'small' : 'medium'}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="minimumBalance"
                label="Saldo Mínimo"
                type="number"
                value={formData.minimumBalance}
                onChange={handleChange}
                fullWidth
                size={fullScreen ? 'small' : 'medium'}
                helperText="Alerta cuando el saldo llegue a este monto"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="maximumExpense"
                label="Gasto Máximo"
                type="number"
                value={formData.maximumExpense}
                onChange={handleChange}
                fullWidth
                size={fullScreen ? 'small' : 'medium'}
                helperText="Máximo por gasto individual"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required size={fullScreen ? 'small' : 'medium'}>
                <InputLabel>Responsable (Custodio)</InputLabel>
                <Select
                  name="custodianId"
                  value={formData.custodianId}
                  onChange={handleChange}
                  label="Responsable (Custodio)"
                >
                  {activeEmployees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} - {emp.employeeCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size={fullScreen ? 'small' : 'medium'}>
                <InputLabel>Cuenta para Reposiciones</InputLabel>
                <Select
                  name="bankAccountId"
                  value={formData.bankAccountId}
                  onChange={handleChange}
                  label="Cuenta para Reposiciones"
                >
                  <MenuItem value="">Sin cuenta asociada</MenuItem>
                  {accounts.filter(a => a.isActive).map((acc) => (
                    <MenuItem key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="requiresApproval"
                    checked={formData.requiresApproval}
                    onChange={handleChange}
                  />
                }
                label="Requiere aprobación para gastos"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="approvalThreshold"
                label="Umbral de Aprobación"
                type="number"
                value={formData.approvalThreshold}
                onChange={handleChange}
                fullWidth
                disabled={!formData.requiresApproval}
                size={fullScreen ? 'small' : 'medium'}
                helperText="Gastos mayores a este monto requieren aprobación"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notas"
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
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {pettyCash ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PettyCashFormDialog;
