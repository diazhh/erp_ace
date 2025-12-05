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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchHSECatalogs, createIncident, updateIncident, fetchIncident } from '../../store/slices/hseSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import api from '../../services/api';

const IncidentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = !!id;

  const { catalogs } = useSelector((state) => state.hse);
  const { employees } = useSelector((state) => state.employees);
  const { projects } = useSelector((state) => state.projects);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    incidentType: 'NEAR_MISS',
    severity: 'LOW',
    title: '',
    description: '',
    incidentDate: new Date().toISOString().slice(0, 16),
    location: '',
    reportedById: '',
    affectedEmployeeId: '',
    projectId: '',
    injuryType: '',
    bodyPartAffected: '',
    daysLost: 0,
    medicalAttention: false,
    immediateActions: '',
    witnesses: '',
    notes: '',
  });

  useEffect(() => {
    if (!catalogs) dispatch(fetchHSECatalogs());
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
    dispatch(fetchProjects({ limit: 100 }));
    
    if (isEdit) {
      loadIncident();
    }
  }, [dispatch, id]);

  const loadIncident = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hse/incidents/${id}`);
      const incident = response.data.data;
      setFormData({
        incidentType: incident.incidentType,
        severity: incident.severity,
        title: incident.title,
        description: incident.description,
        incidentDate: incident.incidentDate?.slice(0, 16) || '',
        location: incident.location,
        reportedById: incident.reportedById || '',
        affectedEmployeeId: incident.affectedEmployeeId || '',
        projectId: incident.projectId || '',
        injuryType: incident.injuryType || '',
        bodyPartAffected: incident.bodyPartAffected || '',
        daysLost: incident.daysLost || 0,
        medicalAttention: incident.medicalAttention || false,
        immediateActions: incident.immediateActions || '',
        witnesses: incident.witnesses || '',
        notes: incident.notes || '',
      });
    } catch (error) {
      toast.error('Error al cargar el incidente');
      navigate('/hse/incidents');
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
    if (!formData.description) {
      toast.error('Ingrese una descripción');
      return;
    }
    if (!formData.location) {
      toast.error('Ingrese la ubicación');
      return;
    }
    if (!formData.reportedById) {
      toast.error('Seleccione quién reporta');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await dispatch(updateIncident({ id, data: formData })).unwrap();
        toast.success('Incidente actualizado');
      } else {
        await dispatch(createIncident(formData)).unwrap();
        toast.success('Incidente reportado');
      }
      navigate('/hse/incidents');
    } catch (error) {
      toast.error(error || 'Error al guardar el incidente');
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
        <IconButton onClick={() => navigate('/hse/incidents')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? 'Editar Incidente' : 'Reportar Incidente'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Información General */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información del Incidente
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Tipo de Incidente *"
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  required
                >
                  {catalogs?.incidentTypes?.map((type) => (
                    <MenuItem key={type.code} value={type.code}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Severidad *"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  required
                >
                  {catalogs?.severities?.map((sev) => (
                    <MenuItem key={sev.code} value={sev.code}>
                      {sev.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Breve descripción del incidente"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción Detallada *"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describa qué ocurrió, cómo ocurrió y las circunstancias"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Fecha y Hora del Incidente *"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ubicación *"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Lugar donde ocurrió el incidente"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Personas Involucradas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personas Involucradas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Reportado por *"
                  name="reportedById"
                  value={formData.reportedById}
                  onChange={handleChange}
                  required
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeCode})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Empleado Afectado"
                  name="affectedEmployeeId"
                  value={formData.affectedEmployeeId}
                  onChange={handleChange}
                >
                  <MenuItem value="">Ninguno / No aplica</MenuItem>
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeCode})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Proyecto Relacionado"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  {projects.map((proj) => (
                    <MenuItem key={proj.id} value={proj.id}>
                      {proj.name} ({proj.code})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Testigos"
                  name="witnesses"
                  value={formData.witnesses}
                  onChange={handleChange}
                  placeholder="Nombres de testigos (separados por coma)"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Lesiones (si aplica) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de Lesiones (si aplica)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tipo de Lesión"
                  name="injuryType"
                  value={formData.injuryType}
                  onChange={handleChange}
                  placeholder="Ej: Corte, contusión, fractura"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parte del Cuerpo Afectada"
                  name="bodyPartAffected"
                  value={formData.bodyPartAffected}
                  onChange={handleChange}
                  placeholder="Ej: Mano derecha, espalda"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Días Perdidos"
                  name="daysLost"
                  value={formData.daysLost}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="¿Requirió Atención Médica?"
                  name="medicalAttention"
                  value={formData.medicalAttention}
                  onChange={(e) => setFormData({ ...formData, medicalAttention: e.target.value === 'true' })}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Sí</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Acciones Inmediatas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acciones Inmediatas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Acciones Inmediatas Tomadas"
                  name="immediateActions"
                  value={formData.immediateActions}
                  onChange={handleChange}
                  placeholder="Describa las acciones que se tomaron inmediatamente después del incidente"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Notas Adicionales"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/hse/incidents')}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="error"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (isEdit ? 'Actualizar' : 'Reportar Incidente')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IncidentForm;
