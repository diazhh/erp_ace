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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Warning as NCIcon,
} from '@mui/icons-material';
import {
  fetchNonConformanceById,
  createNonConformance,
  updateNonConformance,
  clearCurrentNonConformance,
  fetchInspections,
} from '../../store/slices/qualitySlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';

const NonConformanceForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentNonConformance, inspections, loading, error } = useSelector((state) => state.quality);
  const { projects } = useSelector((state) => state.projects);
  const { employees } = useSelector((state) => state.employees);

  const [formData, setFormData] = useState({
    projectId: '',
    inspectionId: '',
    ncType: 'MINOR',
    category: 'PROCESS',
    title: '',
    description: '',
    affectedItem: '',
    location: '',
    requirementReference: '',
    detectedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'OPEN',
    detectedById: '',
    responsibleId: '',
    immediateAction: '',
    disposition: '',
    estimatedCost: '',
    notes: '',
  });
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects({}));
    dispatch(fetchEmployees({}));
    dispatch(fetchInspections({}));
    if (isEdit) {
      dispatch(fetchNonConformanceById(id));
    }
    return () => {
      dispatch(clearCurrentNonConformance());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentNonConformance) {
      setFormData({
        projectId: currentNonConformance.projectId || '',
        inspectionId: currentNonConformance.inspectionId || '',
        ncType: currentNonConformance.ncType || 'MINOR',
        category: currentNonConformance.category || 'PROCESS',
        title: currentNonConformance.title || '',
        description: currentNonConformance.description || '',
        affectedItem: currentNonConformance.affectedItem || '',
        location: currentNonConformance.location || '',
        requirementReference: currentNonConformance.requirementReference || '',
        detectedDate: currentNonConformance.detectedDate
          ? currentNonConformance.detectedDate.split('T')[0]
          : '',
        dueDate: currentNonConformance.dueDate
          ? currentNonConformance.dueDate.split('T')[0]
          : '',
        status: currentNonConformance.status || 'OPEN',
        detectedById: currentNonConformance.detectedById || '',
        responsibleId: currentNonConformance.responsibleId || '',
        immediateAction: currentNonConformance.immediateAction || '',
        disposition: currentNonConformance.disposition || '',
        estimatedCost: currentNonConformance.estimatedCost || '',
        notes: currentNonConformance.notes || '',
      });
    }
  }, [isEdit, currentNonConformance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const dataToSend = {
        ...formData,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null,
      };

      if (isEdit) {
        await dispatch(updateNonConformance({ id, data: dataToSend })).unwrap();
      } else {
        await dispatch(createNonConformance(dataToSend)).unwrap();
      }
      navigate('/quality/non-conformances');
    } catch (err) {
      setSubmitError(err.message || 'Error al guardar la no conformidad');
    }
  };

  if (isEdit && loading && !currentNonConformance) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const selectedProject = projects.find((p) => p.id === formData.projectId) || null;
  const selectedInspection = inspections.find((i) => i.id === formData.inspectionId) || null;
  const selectedDetectedBy = employees.find((e) => e.id === formData.detectedById) || null;
  const selectedResponsible = employees.find((e) => e.id === formData.responsibleId) || null;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/quality/non-conformances')}>
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          <NCIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEdit ? 'Editar No Conformidad' : 'Nueva No Conformidad'}
        </Typography>
      </Box>

      {(error || submitError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || submitError}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Información General */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información General
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={projects}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                value={selectedProject}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, projectId: newValue?.id || '' }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Proyecto" required />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={inspections}
                getOptionLabel={(option) => `${option.code} - ${option.title}`}
                value={selectedInspection}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, inspectionId: newValue?.id || '' }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Inspección (opcional)" />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                required
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="ncType"
                  value={formData.ncType}
                  label="Tipo"
                  onChange={handleChange}
                >
                  <MenuItem value="MINOR">Menor</MenuItem>
                  <MenuItem value="MAJOR">Mayor</MenuItem>
                  <MenuItem value="CRITICAL">Crítica</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Categoría"
                  onChange={handleChange}
                >
                  <MenuItem value="MATERIAL">Material</MenuItem>
                  <MenuItem value="WORKMANSHIP">Mano de Obra</MenuItem>
                  <MenuItem value="DOCUMENTATION">Documentación</MenuItem>
                  <MenuItem value="PROCESS">Proceso</MenuItem>
                  <MenuItem value="EQUIPMENT">Equipo</MenuItem>
                  <MenuItem value="DESIGN">Diseño</MenuItem>
                  <MenuItem value="OTHER">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Estado"
                  onChange={handleChange}
                >
                  <MenuItem value="OPEN">Abierta</MenuItem>
                  <MenuItem value="UNDER_ANALYSIS">En Análisis</MenuItem>
                  <MenuItem value="ACTION_PENDING">Acción Pendiente</MenuItem>
                  <MenuItem value="IN_PROGRESS">En Progreso</MenuItem>
                  <MenuItem value="VERIFICATION">En Verificación</MenuItem>
                  <MenuItem value="CLOSED">Cerrada</MenuItem>
                  <MenuItem value="CANCELLED">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Disposición</InputLabel>
                <Select
                  name="disposition"
                  value={formData.disposition}
                  label="Disposición"
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin definir</MenuItem>
                  <MenuItem value="USE_AS_IS">Usar como está</MenuItem>
                  <MenuItem value="REWORK">Retrabajo</MenuItem>
                  <MenuItem value="REPAIR">Reparar</MenuItem>
                  <MenuItem value="SCRAP">Desechar</MenuItem>
                  <MenuItem value="RETURN">Devolver</MenuItem>
                  <MenuItem value="DOWNGRADE">Degradar</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            {/* Detalles */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Detalles
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Elemento Afectado"
                name="affectedItem"
                value={formData.affectedItem}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Requisito Incumplido"
                name="requirementReference"
                value={formData.requirementReference}
                onChange={handleChange}
                placeholder="Norma, especificación..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Costo Estimado"
                name="estimatedCost"
                type="number"
                value={formData.estimatedCost}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            {/* Fechas y Responsables */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Fechas y Responsables
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                required
                label="Fecha Detectada"
                name="detectedDate"
                type="date"
                value={formData.detectedDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Fecha Límite"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={selectedDetectedBy}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, detectedById: newValue?.id || '' }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Detectada por" />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={selectedResponsible}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, responsibleId: newValue?.id || '' }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Responsable" />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
            </Grid>

            {/* Acciones */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Acciones Inmediatas
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Acción Inmediata"
                name="immediateAction"
                value={formData.immediateAction}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            {/* Botones */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/quality/non-conformances')}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default NonConformanceForm;
