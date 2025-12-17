import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
import { fetchContractors } from '../../store/slices/contractorSlice';
import api from '../../services/api';

const currencies = [
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'VES', label: 'Bolívar (VES)' },
];

const executionTypes = [
  { value: 'INTERNAL', label: 'Proyecto Interno', description: 'Ejecutado por personal de la empresa' },
  { value: 'OUTSOURCED', label: 'Proyecto Contratado', description: 'Ejecutado por un contratista externo' },
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
  executionType: 'INTERNAL',
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
  contractorId: '',
  contractAmount: '',
  status: 'PLANNING',
  fieldId: '',
  wellId: '',
  notes: '',
};

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Obtener wellId y fieldId de los query params (para crear desde detalle de pozo)
  const wellIdFromUrl = searchParams.get('wellId');
  const fieldIdFromUrl = searchParams.get('fieldId');
  
  const { currentProject, projectTypes, loading } = useSelector((state) => state.projects);
  const { employees } = useSelector((state) => state.employees);
  const { contractors } = useSelector((state) => state.contractors);
  
  const [formData, setFormData] = useState(initialFormData);
  const [fields, setFields] = useState([]);
  const [wells, setWells] = useState([]);
  const [filteredWells, setFilteredWells] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!id;

  useEffect(() => {
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
    dispatch(fetchProjectTypes());
    dispatch(fetchContractors({ limit: 200, status: 'ACTIVE' }));
    loadFieldsAndWells();
    if (isEdit) {
      dispatch(fetchProjectById(id));
    } else {
      // Si viene desde detalle de pozo, precargar wellId y fieldId
      if (wellIdFromUrl || fieldIdFromUrl) {
        setFormData((prev) => ({
          ...prev,
          wellId: wellIdFromUrl || '',
          fieldId: fieldIdFromUrl || '',
        }));
      }
    }
  }, [dispatch, id, isEdit, wellIdFromUrl, fieldIdFromUrl]);

  // Filtrar pozos cuando cambia el campo seleccionado
  useEffect(() => {
    if (formData.fieldId) {
      setFilteredWells(wells.filter(w => w.field_id === formData.fieldId));
    } else {
      setFilteredWells(wells);
    }
  }, [formData.fieldId, wells]);

  const loadFieldsAndWells = async () => {
    try {
      const [fieldsRes, wellsRes] = await Promise.all([
        api.get('/production/fields', { params: { limit: 100 } }),
        api.get('/production/wells', { params: { limit: 200 } }),
      ]);
      setFields(fieldsRes.data.data || []);
      setWells(wellsRes.data.data || []);
    } catch (error) {
      console.error('Error loading fields/wells:', error);
    }
  };

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
      if (currentProject.contractor) {
        setSelectedContractor(currentProject.contractor);
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

  const handleContractorChange = (event, newValue) => {
    setSelectedContractor(newValue);
    setFormData((prev) => ({ ...prev, contractorId: newValue?.id || '' }));
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
    // Validaciones específicas por tipo
    if (formData.executionType === 'OUTSOURCED' && !formData.contractorId) {
      newErrors.contractorId = 'Debe seleccionar un contratista';
    }
    if (formData.executionType === 'OUTSOURCED' && !formData.contractAmount) {
      newErrors.contractAmount = 'Debe especificar el monto del contrato';
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
      // Navegar de vuelta al pozo si viene desde allí
      if (wellIdFromUrl) {
        navigate(`/production/wells/${wellIdFromUrl}`);
      } else {
        navigate('/projects');
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    // Volver al pozo si viene desde allí
    if (wellIdFromUrl) {
      navigate(`/production/wells/${wellIdFromUrl}`);
    } else {
      navigate('/projects');
    }
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
          {/* Tipo de Ejecución - Solo visible al crear */}
          {!isEdit && (
            <>
              <Typography variant="h6" gutterBottom>
                Tipo de Ejecución
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {executionTypes.map((type) => (
                  <Grid item xs={12} md={6} key={type.value}>
                    <Paper
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: 2,
                        borderColor: formData.executionType === type.value ? 'primary.main' : 'divider',
                        bgcolor: formData.executionType === type.value ? 'primary.lighter' : 'background.paper',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                      onClick={() => setFormData({ ...formData, executionType: type.value })}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {type.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 3 }} />
            </>
          )}

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

          {/* Sección específica según tipo de ejecución */}
          {formData.executionType === 'OUTSOURCED' ? (
            <>
              {/* Contratista - Solo para proyectos contratados */}
              <Typography variant="h6" gutterBottom>
                Contratista
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={contractors}
                    getOptionLabel={(option) => `${option.companyName} (${option.code})`}
                    value={selectedContractor}
                    onChange={handleContractorChange}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Seleccionar Contratista" 
                        required
                        error={!!errors.contractorId}
                        helperText={errors.contractorId}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Monto del Contrato"
                    name="contractAmount"
                    type="number"
                    value={formData.contractAmount}
                    onChange={handleChange}
                    required
                    error={!!errors.contractAmount}
                    helperText={errors.contractAmount}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
            </>
          ) : (
            <>
              {/* Responsable - Solo para proyectos internos */}
              <Typography variant="h6" gutterBottom>
                Responsable del Proyecto
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={employees}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    value={selectedManager}
                    onChange={handleManagerChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Gerente/Responsable" />
                    )}
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
            </>
          )}

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

          {/* Ubicación */}
          <Typography variant="h6" gutterBottom>
            Ubicación del Proyecto
          </Typography>
          <Grid container spacing={2}>
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label={t('production.field')}
                name="fieldId"
                value={formData.fieldId}
                onChange={handleChange}
                disabled={!!wellIdFromUrl}
              >
                <MenuItem value="">{t('common.none')}</MenuItem>
                {fields.map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.code} - {field.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label={t('production.well')}
                name="wellId"
                value={formData.wellId}
                onChange={handleChange}
                disabled={!!wellIdFromUrl}
              >
                <MenuItem value="">{t('common.none')}</MenuItem>
                {filteredWells.map((well) => (
                  <MenuItem key={well.id} value={well.id}>
                    {well.code} - {well.name}
                  </MenuItem>
                ))}
              </TextField>
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
