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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Build as MaintenanceIcon,
} from '@mui/icons-material';
import {
  fetchMaintenanceById,
  createMaintenance,
  updateMaintenance,
  fetchFleetCatalogs,
  fetchVehicles,
  clearCurrentMaintenance,
} from '../../store/slices/fleetSlice';
import AttachmentSection from '../../components/common/AttachmentSection';

const MaintenanceForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const vehicleIdParam = searchParams.get('vehicleId');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { currentMaintenance, vehicles, catalogs, loading, error } = useSelector((state) => state.fleet);

  const [formData, setFormData] = useState({
    vehicleId: vehicleIdParam || '',
    maintenanceType: 'PREVENTIVE',
    description: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    startDate: '',
    mileageAtService: '',
    serviceProvider: '',
    laborCost: '',
    partsCost: '',
    otherCost: '',
    invoiceNumber: '',
    status: 'SCHEDULED',
    nextMaintenanceDate: '',
    nextMaintenanceMileage: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFleetCatalogs());
    dispatch(fetchVehicles({ limit: 100 }));
    if (isEdit) {
      dispatch(fetchMaintenanceById(id));
    }
    return () => dispatch(clearCurrentMaintenance());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentMaintenance) {
      setFormData({
        vehicleId: currentMaintenance.vehicleId || '',
        maintenanceType: currentMaintenance.maintenanceType || 'PREVENTIVE',
        description: currentMaintenance.description || '',
        scheduledDate: currentMaintenance.scheduledDate || '',
        startDate: currentMaintenance.startDate || '',
        mileageAtService: currentMaintenance.mileageAtService || '',
        serviceProvider: currentMaintenance.serviceProvider || '',
        laborCost: currentMaintenance.laborCost || '',
        partsCost: currentMaintenance.partsCost || '',
        otherCost: currentMaintenance.otherCost || '',
        invoiceNumber: currentMaintenance.invoiceNumber || '',
        status: currentMaintenance.status || 'SCHEDULED',
        nextMaintenanceDate: currentMaintenance.nextMaintenanceDate || '',
        nextMaintenanceMileage: currentMaintenance.nextMaintenanceMileage || '',
        notes: currentMaintenance.notes || '',
      });
    }
  }, [isEdit, currentMaintenance]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.vehicleId) errors.vehicleId = 'Seleccione un vehículo';
    if (!formData.maintenanceType) errors.maintenanceType = 'Seleccione el tipo';
    if (!formData.description.trim()) errors.description = 'La descripción es requerida';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotal = () => {
    return (
      parseFloat(formData.laborCost || 0) +
      parseFloat(formData.partsCost || 0) +
      parseFloat(formData.otherCost || 0)
    );
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
      if (data.mileageAtService) data.mileageAtService = parseInt(data.mileageAtService);
      if (data.laborCost) data.laborCost = parseFloat(data.laborCost);
      if (data.partsCost) data.partsCost = parseFloat(data.partsCost);
      if (data.otherCost) data.otherCost = parseFloat(data.otherCost);
      if (data.nextMaintenanceMileage) data.nextMaintenanceMileage = parseInt(data.nextMaintenanceMileage);

      if (isEdit) {
        await dispatch(updateMaintenance({ id, data })).unwrap();
      } else {
        await dispatch(createMaintenance(data)).unwrap();
      }
      
      if (vehicleIdParam) {
        navigate(`/fleet/vehicles/${vehicleIdParam}`);
      } else {
        navigate('/fleet/maintenances');
      }
    } catch (err) {
      console.error('Error saving maintenance:', err);
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
          <MaintenanceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEdit ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
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
            Información del Mantenimiento
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
                select
                label="Tipo de Mantenimiento"
                value={formData.maintenanceType}
                onChange={handleChange('maintenanceType')}
                error={!!formErrors.maintenanceType}
                helperText={formErrors.maintenanceType}
              >
                {catalogs?.maintenanceTypes?.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={formData.status}
                onChange={handleChange('status')}
              >
                {catalogs?.maintenanceStatuses?.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                label="Descripción del Servicio"
                value={formData.description}
                onChange={handleChange('description')}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Fechas y Kilometraje
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Programada"
                value={formData.scheduledDate}
                onChange={handleChange('scheduledDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Inicio"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Kilometraje al Servicio"
                value={formData.mileageAtService}
                onChange={handleChange('mileageAtService')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Proveedor/Taller"
                value={formData.serviceProvider}
                onChange={handleChange('serviceProvider')}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Costos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Mano de Obra"
                value={formData.laborCost}
                onChange={handleChange('laborCost')}
                inputProps={{ step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Repuestos"
                value={formData.partsCost}
                onChange={handleChange('partsCost')}
                inputProps={{ step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Otros Costos"
                value={formData.otherCost}
                onChange={handleChange('otherCost')}
                inputProps={{ step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Total"
                value={`$ ${calculateTotal().toFixed(2)}`}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Factura"
                value={formData.invoiceNumber}
                onChange={handleChange('invoiceNumber')}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Próximo Mantenimiento
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Próximo Mantenimiento"
                value={formData.nextMaintenanceDate}
                onChange={handleChange('nextMaintenanceDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Km Próximo Mantenimiento"
                value={formData.nextMaintenanceMileage}
                onChange={handleChange('nextMaintenanceMileage')}
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

        {/* Archivos Adjuntos - Solo en modo edición */}
        {isEdit && id && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <AttachmentSection
              entityType="vehicle_maintenance"
              entityId={id}
              title="Archivos Adjuntos (Facturas, Fotos)"
              defaultExpanded={true}
              canUpload={true}
              canDelete={true}
              showCategory={true}
              defaultCategory="INVOICE"
              variant="inline"
            />
          </Paper>
        )}

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

export default MaintenanceForm;
