import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  LocalGasStation as FuelIcon,
} from '@mui/icons-material';
import {
  fetchFuelLogById,
  createFuelLog,
  updateFuelLog,
  fetchFleetCatalogs,
  fetchVehicles,
  clearCurrentFuelLog,
} from '../../store/slices/fleetSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchProjects } from '../../store/slices/projectSlice';

const FuelLogForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const vehicleIdParam = searchParams.get('vehicleId');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { currentFuelLog, vehicles, catalogs, loading, error } = useSelector((state) => state.fleet);
  const { employees } = useSelector((state) => state.employees);
  const { projects } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    vehicleId: vehicleIdParam || '',
    fuelDate: new Date().toISOString().split('T')[0],
    fuelTime: '',
    fuelType: 'GASOLINE_95',
    quantity: '',
    unitPrice: '',
    mileage: '',
    fullTank: true,
    station: '',
    location: '',
    receiptNumber: '',
    paymentMethod: 'CASH',
    driverId: '',
    projectId: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFleetCatalogs());
    dispatch(fetchVehicles({ limit: 100 }));
    dispatch(fetchEmployees({ limit: 100 }));
    dispatch(fetchProjects({ limit: 100 }));
    if (isEdit) {
      dispatch(fetchFuelLogById(id));
    }
    return () => dispatch(clearCurrentFuelLog());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentFuelLog) {
      setFormData({
        vehicleId: currentFuelLog.vehicleId || '',
        fuelDate: currentFuelLog.fuelDate || '',
        fuelTime: currentFuelLog.fuelTime || '',
        fuelType: currentFuelLog.fuelType || 'GASOLINE_95',
        quantity: currentFuelLog.quantity || '',
        unitPrice: currentFuelLog.unitPrice || '',
        mileage: currentFuelLog.mileage || '',
        fullTank: currentFuelLog.fullTank ?? true,
        station: currentFuelLog.station || '',
        location: currentFuelLog.location || '',
        receiptNumber: currentFuelLog.receiptNumber || '',
        paymentMethod: currentFuelLog.paymentMethod || 'CASH',
        driverId: currentFuelLog.driverId || '',
        projectId: currentFuelLog.projectId || '',
        notes: currentFuelLog.notes || '',
      });
    }
  }, [isEdit, currentFuelLog]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.vehicleId) errors.vehicleId = 'Seleccione un vehículo';
    if (!formData.fuelDate) errors.fuelDate = 'La fecha es requerida';
    if (!formData.fuelType) errors.fuelType = 'Seleccione el tipo de combustible';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      errors.quantity = 'Ingrese una cantidad válida';
    }
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      errors.unitPrice = 'Ingrese un precio válido';
    }
    if (!formData.mileage || parseInt(formData.mileage) <= 0) {
      errors.mileage = 'Ingrese el kilometraje';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotal = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.unitPrice) || 0;
    return qty * price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = { ...formData };
      Object.keys(data).forEach((key) => {
        if (data[key] === '') data[key] = null;
      });
      data.quantity = parseFloat(data.quantity);
      data.unitPrice = parseFloat(data.unitPrice);
      data.mileage = parseInt(data.mileage);

      if (isEdit) {
        await dispatch(updateFuelLog({ id, data })).unwrap();
      } else {
        await dispatch(createFuelLog(data)).unwrap();
      }
      
      if (vehicleIdParam) {
        navigate(`/fleet/vehicles/${vehicleIdParam}`);
      } else {
        navigate('/fleet/fuel-logs');
      }
    } catch (err) {
      console.error('Error saving fuel log:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate(-1)}>
          Volver
        </Button>
        <Typography variant="h4" component="h1" sx={{ mt: 1 }}>
          <FuelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEdit ? 'Editar Registro de Combustible' : 'Registrar Combustible'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Información de la Carga
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                required
                select
                label="Vehículo"
                value={formData.vehicleId}
                onChange={handleChange('vehicleId')}
                error={!!formErrors.vehicleId}
                helperText={formErrors.vehicleId}
                disabled={!!vehicleIdParam}
              >
                {vehicles?.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.plate} - {v.brand} {v.model}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                required
                type="date"
                label="Fecha"
                value={formData.fuelDate}
                onChange={handleChange('fuelDate')}
                error={!!formErrors.fuelDate}
                helperText={formErrors.fuelDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="time"
                label="Hora"
                value={formData.fuelTime}
                onChange={handleChange('fuelTime')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                required
                select
                label="Tipo de Combustible"
                value={formData.fuelType}
                onChange={handleChange('fuelType')}
                error={!!formErrors.fuelType}
                helperText={formErrors.fuelType}
              >
                {catalogs?.fuelLogTypes?.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                required
                type="number"
                label="Cantidad (Litros)"
                value={formData.quantity}
                onChange={handleChange('quantity')}
                error={!!formErrors.quantity}
                helperText={formErrors.quantity}
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                required
                type="number"
                label="Precio Unitario"
                value={formData.unitPrice}
                onChange={handleChange('unitPrice')}
                error={!!formErrors.unitPrice}
                helperText={formErrors.unitPrice}
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Total"
                value={`$ ${calculateTotal().toFixed(2)}`}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                required
                type="number"
                label="Kilometraje"
                value={formData.mileage}
                onChange={handleChange('mileage')}
                error={!!formErrors.mileage}
                helperText={formErrors.mileage}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.fullTank}
                    onChange={handleChange('fullTank')}
                  />
                }
                label="Tanque Lleno"
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Estación y Pago
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estación de Servicio"
                value={formData.station}
                onChange={handleChange('station')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ubicación"
                value={formData.location}
                onChange={handleChange('location')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Recibo"
                value={formData.receiptNumber}
                onChange={handleChange('receiptNumber')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Método de Pago"
                value={formData.paymentMethod}
                onChange={handleChange('paymentMethod')}
              >
                {catalogs?.paymentMethods?.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Asignación (Opcional)
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Conductor"
                value={formData.driverId}
                onChange={handleChange('driverId')}
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {employees?.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Proyecto"
                value={formData.projectId}
                onChange={handleChange('projectId')}
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {projects?.map((proj) => (
                  <MenuItem key={proj.id} value={proj.id}>
                    {proj.code} - {proj.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notas"
                value={formData.notes}
                onChange={handleChange('notes')}
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={submitting}
          >
            {isEdit ? 'Actualizar' : 'Guardar'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default FuelLogForm;
