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
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  createProject, 
  updateProject, 
  fetchProjectById, 
  fetchProjectTypes 
} from '../../store/slices/projectSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';

const currencies = [
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'VES', label: 'Bolívar (VES)' },
];

const statusOptions = [
  { value: 'PLANNING', label: 'Planificación' },
  { value: 'IN_PROGRESS', label: 'En Progreso' },
  { value: 'ON_HOLD', label: 'En Espera' },
  { value: 'COMPLETED', label: 'Completado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

const priorityOptions = [
  { value: 'LOW', label: 'Baja' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'CRITICAL', label: 'Crítica' },
];

const initialFormData = {
  name: '',
  description: '',
  clientName: '',
  clientContact: '',
  clientEmail: '',
  clientPhone: '',
  startDate: '',
  endDate: '',
  currency: 'USD',
  budget: '',
  estimatedCost: '',
  priority: 'MEDIUM',
  projectType: '',
  location: '',
  address: '',
  managerId: '',
  status: 'PLANNING',
  notes: '',
};

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { currentProject, projectTypes, loading } = useSelector((state) => state.projects);
  const { employees } = useSelector((state) => state.employees);
  
  const [formData, setFormData] = useState(initialFormData);
  const [selectedManager, setSelectedManager] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!id;

  useEffect(() => {
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
    dispatch(fetchProjectTypes());
    if (isEdit) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (currentProject && isEdit) {
      setFormData({
        ...initialFormData,
        ...currentProject,
        startDate: currentProject.startDate?.split('T')[0] || '',
        endDate: currentProject.endDate?.split('T')[0] || '',
      });
      if (currentProject.manager) {
        setSelectedManager(currentProject.manager);
      }
    }
  }, [currentProject, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleManagerChange = (event, newValue) => {
    setSelectedManager(newValue);
    setFormData((prev) => ({ ...prev, managerId: newValue?.id || '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.startDate) newErrors.startDate = 'Fecha de inicio es requerida';
    if (formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'Fecha fin debe ser posterior a fecha inicio';
    }
    if (formData.budget && formData.budget < 0) {
      newErrors.budget = 'Presupuesto no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const dataToSend = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null,
      };

      if (isEdit) {
        await dispatch(updateProject({ id, data: dataToSend })).unwrap();
        toast.success('Proyecto actualizado exitosamente');
      } else {
        await dispatch(createProject(dataToSend)).unwrap();
        toast.success('Proyecto creado exitosamente');
      }
      navigate('/projects');
    } catch (error) {
      toast.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/projects');
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
          {isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          {/* Información General */}
          <Typography variant="h6" gutterBottom>
            Información General
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Nombre del Proyecto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Tipo de Proyecto"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
              >
                <MenuItem value="">Sin especificar</MenuItem>
                {projectTypes.map((type) => (
                  <MenuItem key={type.code} value={type.code}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
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

          <Divider sx={{ my: 3 }} />

          {/* Cliente */}
          <Typography variant="h6" gutterBottom>
            Información del Cliente
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Cliente"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contacto"
                name="clientContact"
                value={formData.clientContact}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email del Cliente"
                name="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono del Cliente"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Fechas y Estado */}
          <Typography variant="h6" gutterBottom>
            Fechas y Estado
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Fecha de Inicio"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                error={!!errors.startDate}
                helperText={errors.startDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Fecha de Fin Estimada"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Estado"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Prioridad"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {priorityOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Presupuesto */}
          <Typography variant="h6" gutterBottom>
            Presupuesto
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Moneda"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                {currencies.map((curr) => (
                  <MenuItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Presupuesto"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                error={!!errors.budget}
                helperText={errors.budget}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Costo Estimado"
                name="estimatedCost"
                type="number"
                value={formData.estimatedCost}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Responsable y Ubicación */}
          <Typography variant="h6" gutterBottom>
            Responsable y Ubicación
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={selectedManager}
                onChange={handleManagerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Gerente del Proyecto"
                    helperText="Empleado responsable del proyecto"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ciudad, Estado"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Notas */}
          <Typography variant="h6" gutterBottom>
            Notas Adicionales
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
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
              {isEdit ? 'Guardar Cambios' : 'Crear Proyecto'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ProjectForm;
