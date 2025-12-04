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
  Autocomplete,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { createPettyCash, updatePettyCash, fetchPettyCashById } from '../../store/slices/pettyCashSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';

const currencies = [
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'VES', label: 'Bolívar (VES)' },
];

const initialFormData = {
  name: '',
  code: '',
  custodianId: '',
  initialAmount: '',
  minimumBalance: '',
  currency: 'USD',
  description: '',
  status: 'ACTIVE',
};

const PettyCashForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { currentPettyCash, loading } = useSelector((state) => state.pettyCash);
  const { employees } = useSelector((state) => state.employees);
  
  const [formData, setFormData] = useState(initialFormData);
  const [selectedCustodian, setSelectedCustodian] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!id;

  useEffect(() => {
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
    if (isEdit) {
      dispatch(fetchPettyCashById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (currentPettyCash && isEdit) {
      setFormData({
        ...initialFormData,
        ...currentPettyCash,
      });
      if (currentPettyCash.custodian) {
        setSelectedCustodian(currentPettyCash.custodian);
      }
    }
  }, [currentPettyCash, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCustodianChange = (event, newValue) => {
    setSelectedCustodian(newValue);
    setFormData((prev) => ({ ...prev, custodianId: newValue?.id || '' }));
    if (errors.custodianId) {
      setErrors((prev) => ({ ...prev, custodianId: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.code.trim()) newErrors.code = 'Código es requerido';
    if (!formData.custodianId) newErrors.custodianId = 'Custodio es requerido';
    if (!formData.initialAmount || formData.initialAmount <= 0) {
      newErrors.initialAmount = 'Monto inicial es requerido';
    }
    if (!formData.minimumBalance || formData.minimumBalance < 0) {
      newErrors.minimumBalance = 'Saldo mínimo es requerido';
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
        await dispatch(updatePettyCash({ id, data: formData })).unwrap();
        toast.success('Caja chica actualizada exitosamente');
      } else {
        const result = await dispatch(createPettyCash(formData)).unwrap();
        toast.success('Caja chica creada exitosamente');
      }
      navigate('/petty-cash');
    } catch (error) {
      toast.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/petty-cash');
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
          {isEdit ? 'Editar Caja Chica' : 'Nueva Caja Chica'}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Nombre y Código */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Ej: Caja Chica Oficina Principal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                error={!!errors.code}
                helperText={errors.code}
                placeholder="Ej: PC-001"
                disabled={isEdit}
              />
            </Grid>

            {/* Custodio */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={selectedCustodian}
                onChange={handleCustodianChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Custodio"
                    required
                    error={!!errors.custodianId}
                    helperText={errors.custodianId || 'Empleado responsable de la caja'}
                  />
                )}
              />
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
                disabled={isEdit}
              >
                {currencies.map((curr) => (
                  <MenuItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Montos */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monto Inicial"
                name="initialAmount"
                type="number"
                value={formData.initialAmount}
                onChange={handleChange}
                required
                error={!!errors.initialAmount}
                helperText={errors.initialAmount}
                inputProps={{ min: 0, step: 0.01 }}
                disabled={isEdit}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Saldo Mínimo"
                name="minimumBalance"
                type="number"
                value={formData.minimumBalance}
                onChange={handleChange}
                required
                error={!!errors.minimumBalance}
                helperText={errors.minimumBalance || 'Saldo mínimo antes de reposición'}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Estado (solo en edición) */}
            {isEdit && (
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Estado"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="ACTIVE">Activa</MenuItem>
                  <MenuItem value="INACTIVE">Inactiva</MenuItem>
                  <MenuItem value="SUSPENDED">Suspendida</MenuItem>
                </TextField>
              </Grid>
            )}

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={formData.description}
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
              {isEdit ? 'Guardar Cambios' : 'Crear Caja Chica'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default PettyCashForm;
