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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  FindInPage as InspectionIcon,
} from '@mui/icons-material';
import {
  fetchInspectionById,
  createInspection,
  updateInspection,
  clearCurrentInspection,
  fetchPlans,
} from '../../store/slices/qualitySlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';

const InspectionForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentInspection, plans, loading, error } = useSelector((state) => state.quality);
  const { projects } = useSelector((state) => state.projects);
  const { employees } = useSelector((state) => state.employees);

  const [formData, setFormData] = useState({
    projectId: '',
    qualityPlanId: '',
    inspectorId: '',
    title: '',
    inspectionType: 'IN_PROCESS',
    inspectionDate: new Date().toISOString().split('T')[0],
    location: '',
    itemInspected: '',
    specification: '',
    acceptanceCriteria: '',
    result: 'PENDING',
    findings: '',
    recommendations: '',
    notes: '',
  });
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects({}));
    dispatch(fetchEmployees({}));
    dispatch(fetchPlans({}));
    if (isEdit) {
      dispatch(fetchInspectionById(id));
    }
    return () => {
      dispatch(clearCurrentInspection());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentInspection) {
      setFormData({
        projectId: currentInspection.projectId || '',
        qualityPlanId: currentInspection.qualityPlanId || '',
        inspectorId: currentInspection.inspectorId || '',
        title: currentInspection.title || '',
        inspectionType: currentInspection.inspectionType || 'IN_PROCESS',
        inspectionDate: currentInspection.inspectionDate
          ? currentInspection.inspectionDate.split('T')[0]
          : '',
        location: currentInspection.location || '',
        itemInspected: currentInspection.itemInspected || '',
        specification: currentInspection.specification || '',
        acceptanceCriteria: currentInspection.acceptanceCriteria || '',
        result: currentInspection.result || 'PENDING',
        findings: currentInspection.findings || '',
        recommendations: currentInspection.recommendations || '',
        notes: currentInspection.notes || '',
      });
    }
  }, [isEdit, currentInspection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      if (isEdit) {
        await dispatch(updateInspection({ id, data: formData })).unwrap();
      } else {
        await dispatch(createInspection(formData)).unwrap();
      }
      navigate('/quality/inspections');
    } catch (err) {
      setSubmitError(err.message || 'Error al guardar la inspección');
    }
  };

  if (isEdit && loading && !currentInspection) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const selectedProject = projects.find((p) => p.id === formData.projectId) || null;
  const selectedPlan = plans.find((p) => p.id === formData.qualityPlanId) || null;
  const selectedInspector = employees.find((e) => e.id === formData.inspectorId) || null;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/quality/inspections')}>
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          <InspectionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEdit ? 'Editar Inspección' : 'Nueva Inspección'}
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
                options={plans}
                getOptionLabel={(option) => `${option.code} - ${option.title}`}
                value={selectedPlan}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, qualityPlanId: newValue?.id || '' }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Plan de Calidad" />
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
                <InputLabel>Tipo de Inspección</InputLabel>
                <Select
                  name="inspectionType"
                  value={formData.inspectionType}
                  label="Tipo de Inspección"
                  onChange={handleChange}
                >
                  <MenuItem value="RECEIVING">Recepción</MenuItem>
                  <MenuItem value="IN_PROCESS">En Proceso</MenuItem>
                  <MenuItem value="FINAL">Final</MenuItem>
                  <MenuItem value="DIMENSIONAL">Dimensional</MenuItem>
                  <MenuItem value="VISUAL">Visual</MenuItem>
                  <MenuItem value="FUNCTIONAL">Funcional</MenuItem>
                  <MenuItem value="DESTRUCTIVE">Destructiva</MenuItem>
                  <MenuItem value="NON_DESTRUCTIVE">No Destructiva</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Detalles de Inspección */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Detalles de Inspección
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Fecha de Inspección"
                name="inspectionDate"
                type="date"
                value={formData.inspectionDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={selectedInspector}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, inspectorId: newValue?.id || '' }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Inspector" />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
            </Grid>

            <Grid item xs={12} md={4}>
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
                label="Elemento Inspeccionado"
                name="itemInspected"
                value={formData.itemInspected}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Especificación / Norma"
                name="specification"
                value={formData.specification}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Criterios de Aceptación"
                name="acceptanceCriteria"
                value={formData.acceptanceCriteria}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            {/* Resultado */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Resultado
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Resultado</InputLabel>
                <Select
                  name="result"
                  value={formData.result}
                  label="Resultado"
                  onChange={handleChange}
                >
                  <MenuItem value="PENDING">Pendiente</MenuItem>
                  <MenuItem value="PASS">Aprobada</MenuItem>
                  <MenuItem value="FAIL">Fallida</MenuItem>
                  <MenuItem value="CONDITIONAL">Condicional</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hallazgos"
                name="findings"
                value={formData.findings}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recomendaciones"
                name="recommendations"
                value={formData.recommendations}
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
                <Button variant="outlined" onClick={() => navigate('/quality/inspections')}>
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

export default InspectionForm;
