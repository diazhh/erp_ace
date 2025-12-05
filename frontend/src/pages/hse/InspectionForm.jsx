import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  fetchHSECatalogs,
  createInspection,
  updateInspection,
} from '../../store/slices/hseSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import api from '../../services/api';

const inspectionTypes = [
  { code: 'WORKPLACE', name: 'Lugar de Trabajo' },
  { code: 'EQUIPMENT', name: 'Equipos' },
  { code: 'VEHICLE', name: 'Vehículos' },
  { code: 'FIRE_SAFETY', name: 'Seguridad Contra Incendios' },
  { code: 'ELECTRICAL', name: 'Eléctrica' },
  { code: 'PPE', name: 'EPP' },
  { code: 'ENVIRONMENTAL', name: 'Ambiental' },
  { code: 'ERGONOMIC', name: 'Ergonómica' },
  { code: 'HOUSEKEEPING', name: 'Orden y Limpieza' },
  { code: 'WAREHOUSE', name: 'Almacén' },
  { code: 'PROJECT_SITE', name: 'Sitio de Proyecto' },
  { code: 'OTHER', name: 'Otra' },
];

const InspectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = !!id;

  const { catalogs } = useSelector((state) => state.hse);
  const { employees } = useSelector((state) => state.employees);
  const { projects } = useSelector((state) => state.projects);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    inspectionType: 'WORKPLACE',
    title: '',
    description: '',
    scheduledDate: new Date().toISOString().slice(0, 10),
    scheduledTime: '09:00',
    inspectorId: '',
    projectId: '',
    location: '',
    checklistItems: '',
    notes: '',
  });

  useEffect(() => {
    if (!catalogs) dispatch(fetchHSECatalogs());
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
    dispatch(fetchProjects({ limit: 100 }));

    if (isEdit) {
      loadInspection();
    }
  }, [dispatch, id]);

  const loadInspection = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hse/inspections/${id}`);
      const inspection = response.data.data;
      setFormData({
        inspectionType: inspection.inspectionType,
        title: inspection.title,
        description: inspection.description || '',
        scheduledDate: inspection.scheduledDate?.slice(0, 10) || '',
        scheduledTime: inspection.scheduledTime || '09:00',
        inspectorId: inspection.inspectorId || '',
        projectId: inspection.projectId || '',
        location: inspection.location || '',
        checklistItems: inspection.checklistItems
          ? JSON.stringify(inspection.checklistItems, null, 2)
          : '',
        notes: inspection.notes || '',
      });
    } catch (error) {
      toast.error('Error al cargar la inspección');
      navigate('/hse/inspections');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error('Ingrese un título');
      return;
    }
    if (!formData.inspectorId) {
      toast.error('Seleccione un inspector');
      return;
    }
    if (!formData.scheduledDate) {
      toast.error('Seleccione una fecha');
      return;
    }

    try {
      setLoading(true);
      const data = {
        ...formData,
        checklistItems: formData.checklistItems
          ? JSON.parse(formData.checklistItems)
          : null,
      };

      if (isEdit) {
        await dispatch(updateInspection({ id, data })).unwrap();
        toast.success('Inspección actualizada');
      } else {
        await dispatch(createInspection(data)).unwrap();
        toast.success('Inspección programada');
      }
      navigate('/hse/inspections');
    } catch (error) {
      if (error.includes && error.includes('JSON')) {
        toast.error('El formato del checklist no es válido');
      } else {
        toast.error(error || 'Error al guardar la inspección');
      }
    } finally {
      setLoading(false);
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
    <Box component="form" onSubmit={handleSubmit}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/hse/inspections')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? 'Editar Inspección' : 'Programar Inspección'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Información General */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Información General
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Inspección"
                  name="inspectionType"
                  value={formData.inspectionType}
                  onChange={handleChange}
                  required
                >
                  {inspectionTypes.map((type) => (
                    <MenuItem key={type.code} value={type.code}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Inspector"
                  name="inspectorId"
                  value={formData.inspectorId}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">Seleccionar...</MenuItem>
                  {employees?.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} - {emp.employeeCode}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Inspección mensual de extintores"
                />
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
                  placeholder="Descripción detallada de la inspección..."
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Programación */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Programación
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Programada"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Hora"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ej: Almacén principal, Oficina central..."
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Proyecto Relacionado */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Proyecto Relacionado (Opcional)
            </Typography>
            <TextField
              select
              fullWidth
              label="Proyecto"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
            >
              <MenuItem value="">Ninguno</MenuItem>
              {projects?.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.code} - {project.name}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
        </Grid>

        {/* Checklist */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Lista de Verificación (JSON)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ingrese los items del checklist en formato JSON. Ejemplo:
              {' [{"item": "Extintores cargados", "required": true}, {"item": "Señalización visible"}]'}
            </Typography>
            <TextField
              fullWidth
              label="Checklist Items (JSON)"
              name="checklistItems"
              value={formData.checklistItems}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder='[{"item": "Item 1", "required": true}, {"item": "Item 2"}]'
            />
          </Paper>
        </Grid>

        {/* Notas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Notas Adicionales
            </Typography>
            <TextField
              fullWidth
              label="Notas"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Notas adicionales sobre la inspección..."
            />
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/hse/inspections')}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : isEdit ? 'Actualizar' : 'Programar'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InspectionForm;
