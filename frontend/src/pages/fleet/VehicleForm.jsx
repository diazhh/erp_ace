import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';
import {
  fetchVehicleById,
  createVehicle,
  updateVehicle,
  fetchFleetCatalogs,
  clearCurrentVehicle,
} from '../../store/slices/fleetSlice';

const VehicleForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { currentVehicle, catalogs, loading, error } = useSelector((state) => state.fleet);

  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    vehicleType: 'PICKUP',
    vin: '',
    engineNumber: '',
    fuelType: 'GASOLINE',
    tankCapacity: '',
    mileage: 0,
    transmission: '',
    engineCapacity: '',
    passengers: '',
    loadCapacity: '',
    ownershipType: 'OWNED',
    acquisitionDate: '',
    acquisitionCost: '',
    currency: 'USD',
    insurancePolicy: '',
    insuranceExpiry: '',
    registrationExpiry: '',
    technicalReviewExpiry: '',
    maintenanceIntervalKm: 5000,
    currentLocation: '',
    gpsDeviceId: '',
    description: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFleetCatalogs());
    if (isEdit) {
      dispatch(fetchVehicleById(id));
    }
    return () => dispatch(clearCurrentVehicle());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentVehicle) {
      setFormData({
        plate: currentVehicle.plate || '',
        brand: currentVehicle.brand || '',
        model: currentVehicle.model || '',
        year: currentVehicle.year || new Date().getFullYear(),
        color: currentVehicle.color || '',
        vehicleType: currentVehicle.vehicleType || 'PICKUP',
        vin: currentVehicle.vin || '',
        engineNumber: currentVehicle.engineNumber || '',
        fuelType: currentVehicle.fuelType || 'GASOLINE',
        tankCapacity: currentVehicle.tankCapacity || '',
        mileage: currentVehicle.mileage || 0,
        transmission: currentVehicle.transmission || '',
        engineCapacity: currentVehicle.engineCapacity || '',
        passengers: currentVehicle.passengers || '',
        loadCapacity: currentVehicle.loadCapacity || '',
        ownershipType: currentVehicle.ownershipType || 'OWNED',
        acquisitionDate: currentVehicle.acquisitionDate || '',
        acquisitionCost: currentVehicle.acquisitionCost || '',
        currency: currentVehicle.currency || 'USD',
        insurancePolicy: currentVehicle.insurancePolicy || '',
        insuranceExpiry: currentVehicle.insuranceExpiry || '',
        registrationExpiry: currentVehicle.registrationExpiry || '',
        technicalReviewExpiry: currentVehicle.technicalReviewExpiry || '',
        maintenanceIntervalKm: currentVehicle.maintenanceIntervalKm || 5000,
        currentLocation: currentVehicle.currentLocation || '',
        gpsDeviceId: currentVehicle.gpsDeviceId || '',
        description: currentVehicle.description || '',
        notes: currentVehicle.notes || '',
      });
    }
  }, [isEdit, currentVehicle]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.plate.trim()) errors.plate = 'La placa es requerida';
    if (!formData.brand.trim()) errors.brand = 'La marca es requerida';
    if (!formData.model.trim()) errors.model = 'El modelo es requerido';
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      errors.year = 'Año inválido';
    }
    if (!formData.vehicleType) errors.vehicleType = 'El tipo es requerido';
    if (!formData.fuelType) errors.fuelType = 'El tipo de combustible es requerido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = { ...formData };
      // Limpiar campos vacíos
      Object.keys(data).forEach((key) => {
        if (data[key] === '') data[key] = null;
      });
      // Convertir números
      if (data.tankCapacity) data.tankCapacity = parseFloat(data.tankCapacity);
      if (data.mileage) data.mileage = parseInt(data.mileage);
      if (data.passengers) data.passengers = parseInt(data.passengers);
      if (data.loadCapacity) data.loadCapacity = parseFloat(data.loadCapacity);
      if (data.acquisitionCost) data.acquisitionCost = parseFloat(data.acquisitionCost);
      if (data.maintenanceIntervalKm) data.maintenanceIntervalKm = parseInt(data.maintenanceIntervalKm);

      if (isEdit) {
        await dispatch(updateVehicle({ id, data })).unwrap();
      } else {
        await dispatch(createVehicle(data)).unwrap();
      }
      navigate('/fleet');
    } catch (err) {
      console.error('Error saving vehicle:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEdit && !currentVehicle) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/fleet')}>
          Volver
        </Button>
        <Typography variant="h4" component="h1" sx={{ mt: 1 }}>
          <CarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEdit ? 'Editar Vehículo' : 'Nuevo Vehículo'}
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
            Información Básica
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                required
                label="Placa"
                value={formData.plate}
                onChange={handleChange('plate')}
                error={!!formErrors.plate}
                helperText={formErrors.plate}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                required
                label="Marca"
                value={formData.brand}
                onChange={handleChange('brand')}
                error={!!formErrors.brand}
                helperText={formErrors.brand}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                required
                label="Modelo"
                value={formData.model}
                onChange={handleChange('model')}
                error={!!formErrors.model}
                helperText={formErrors.model}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                required
                type="number"
                label="Año"
                value={formData.year}
                onChange={handleChange('year')}
                error={!!formErrors.year}
                helperText={formErrors.year}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Color"
                value={formData.color}
                onChange={handleChange('color')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                required
                select
                label="Tipo de Vehículo"
                value={formData.vehicleType}
                onChange={handleChange('vehicleType')}
                error={!!formErrors.vehicleType}
                helperText={formErrors.vehicleType}
              >
                {catalogs?.vehicleTypes?.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="VIN"
                value={formData.vin}
                onChange={handleChange('vin')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Número de Motor"
                value={formData.engineNumber}
                onChange={handleChange('engineNumber')}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Especificaciones Técnicas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                required
                select
                label="Tipo de Combustible"
                value={formData.fuelType}
                onChange={handleChange('fuelType')}
              >
                {catalogs?.fuelTypes?.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Transmisión"
                value={formData.transmission}
                onChange={handleChange('transmission')}
              >
                <MenuItem value="">Seleccionar...</MenuItem>
                {catalogs?.transmissions?.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Capacidad Tanque (L)"
                value={formData.tankCapacity}
                onChange={handleChange('tankCapacity')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Cilindraje"
                value={formData.engineCapacity}
                onChange={handleChange('engineCapacity')}
                placeholder="Ej: 2.0L"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Pasajeros"
                value={formData.passengers}
                onChange={handleChange('passengers')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Capacidad de Carga (kg)"
                value={formData.loadCapacity}
                onChange={handleChange('loadCapacity')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Kilometraje Actual"
                value={formData.mileage}
                onChange={handleChange('mileage')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Intervalo Mantenimiento (km)"
                value={formData.maintenanceIntervalKm}
                onChange={handleChange('maintenanceIntervalKm')}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Propiedad y Adquisición
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Tipo de Propiedad"
                value={formData.ownershipType}
                onChange={handleChange('ownershipType')}
              >
                {catalogs?.ownershipTypes?.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Adquisición"
                value={formData.acquisitionDate}
                onChange={handleChange('acquisitionDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Costo de Adquisición"
                value={formData.acquisitionCost}
                onChange={handleChange('acquisitionCost')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Moneda"
                value={formData.currency}
                onChange={handleChange('currency')}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="PEN">PEN</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Documentos y Vencimientos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Póliza de Seguro"
                value={formData.insurancePolicy}
                onChange={handleChange('insurancePolicy')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Vencimiento Seguro"
                value={formData.insuranceExpiry}
                onChange={handleChange('insuranceExpiry')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Vencimiento Matrícula"
                value={formData.registrationExpiry}
                onChange={handleChange('registrationExpiry')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Vencimiento Rev. Técnica"
                value={formData.technicalReviewExpiry}
                onChange={handleChange('technicalReviewExpiry')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Información Adicional
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ubicación Actual"
                value={formData.currentLocation}
                onChange={handleChange('currentLocation')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID Dispositivo GPS"
                value={formData.gpsDeviceId}
                onChange={handleChange('gpsDeviceId')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Descripción"
                value={formData.description}
                onChange={handleChange('description')}
              />
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
          <Button variant="outlined" onClick={() => navigate('/fleet')}>
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

export default VehicleForm;
