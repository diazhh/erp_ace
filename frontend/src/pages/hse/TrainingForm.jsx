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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  fetchHSECatalogs,
  createTraining,
  updateTraining,
} from '../../store/slices/hseSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import api from '../../services/api';

const trainingTypes = [
  { code: 'INDUCTION', name: 'Inducción' },
  { code: 'SAFETY', name: 'Seguridad General' },
  { code: 'FIRE_SAFETY', name: 'Seguridad Contra Incendios' },
  { code: 'FIRST_AID', name: 'Primeros Auxilios' },
  { code: 'PPE', name: 'Uso de EPP' },
  { code: 'HAZMAT', name: 'Materiales Peligrosos' },
  { code: 'HEIGHTS', name: 'Trabajo en Alturas' },
  { code: 'CONFINED_SPACES', name: 'Espacios Confinados' },
  { code: 'ELECTRICAL', name: 'Seguridad Eléctrica' },
  { code: 'ERGONOMICS', name: 'Ergonomía' },
  { code: 'ENVIRONMENTAL', name: 'Ambiental' },
  { code: 'DEFENSIVE_DRIVING', name: 'Manejo Defensivo' },
  { code: 'EQUIPMENT_OPERATION', name: 'Operación de Equipos' },
  { code: 'EMERGENCY_RESPONSE', name: 'Respuesta a Emergencias' },
  { code: 'OTHER', name: 'Otra' },
];

const TrainingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = !!id;

  const { catalogs } = useSelector((state) => state.hse);
  const { employees } = useSelector((state) => state.employees);
  const { projects } = useSelector((state) => state.projects);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    trainingType: 'SAFETY',
    title: '',
    description: '',
    objectives: '',
    content: '',
    scheduledDate: new Date().toISOString().slice(0, 10),
    startTime: '09:00',
    endTime: '12:00',
    durationHours: 3,
    location: '',
    isOnline: false,
    onlineLink: '',
    instructorId: '',
    externalInstructor: '',
    provider: '',
    projectId: '',
    maxParticipants: '',
    hasEvaluation: false,
    passingScore: 70,
    hasCertificate: false,
    certificateValidityMonths: 12,
    cost: 0,
    currency: 'USD',
    notes: '',
  });

  useEffect(() => {
    if (!catalogs) dispatch(fetchHSECatalogs());
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
    dispatch(fetchProjects({ limit: 100 }));

    if (isEdit) {
      loadTraining();
    }
  }, [dispatch, id]);

  const loadTraining = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hse/trainings/${id}`);
      const training = response.data.data;
      setFormData({
        trainingType: training.trainingType,
        title: training.title,
        description: training.description || '',
        objectives: training.objectives || '',
        content: training.content || '',
        scheduledDate: training.scheduledDate?.slice(0, 10) || '',
        startTime: training.startTime || '09:00',
        endTime: training.endTime || '12:00',
        durationHours: training.durationHours || 0,
        location: training.location || '',
        isOnline: training.isOnline || false,
        onlineLink: training.onlineLink || '',
        instructorId: training.instructorId || '',
        externalInstructor: training.externalInstructor || '',
        provider: training.provider || '',
        projectId: training.projectId || '',
        maxParticipants: training.maxParticipants || '',
        hasEvaluation: training.hasEvaluation || false,
        passingScore: training.passingScore || 70,
        hasCertificate: training.hasCertificate || false,
        certificateValidityMonths: training.certificateValidityMonths || 12,
        cost: training.cost || 0,
        currency: training.currency || 'USD',
        notes: training.notes || '',
      });
    } catch (error) {
      toast.error('Error al cargar la capacitación');
      navigate('/hse/trainings');
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
    if (!formData.scheduledDate) {
      toast.error('Seleccione una fecha');
      return;
    }
    if (!formData.instructorId && !formData.externalInstructor) {
      toast.error('Seleccione un instructor o ingrese un instructor externo');
      return;
    }

    try {
      setLoading(true);
      const data = {
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      };

      if (isEdit) {
        await dispatch(updateTraining({ id, data })).unwrap();
        toast.success('Capacitación actualizada');
      } else {
        await dispatch(createTraining(data)).unwrap();
        toast.success('Capacitación programada');
      }
      navigate('/hse/trainings');
    } catch (error) {
      toast.error(error || 'Error al guardar la capacitación');
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
        <IconButton onClick={() => navigate('/hse/trainings')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? 'Editar Capacitación' : 'Programar Capacitación'}
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
                  label="Tipo de Capacitación"
                  name="trainingType"
                  value={formData.trainingType}
                  onChange={handleChange}
                  required
                >
                  {trainingTypes.map((type) => (
                    <MenuItem key={type.code} value={type.code}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Máximo de Participantes"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Capacitación en uso de extintores"
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
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Objetivos"
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contenido/Temario"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  multiline
                  rows={2}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Hora Inicio"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Hora Fin"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duración (horas)"
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.5 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isOnline}
                      onChange={handleChange}
                      name="isOnline"
                    />
                  }
                  label="Capacitación en línea"
                />
              </Grid>
              {formData.isOnline ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Enlace de la reunión"
                    name="onlineLink"
                    value={formData.onlineLink}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/..."
                  />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ubicación"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ej: Sala de conferencias"
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Instructor */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Instructor
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Instructor Interno"
                  name="instructorId"
                  value={formData.instructorId}
                  onChange={handleChange}
                >
                  <MenuItem value="">Ninguno (usar externo)</MenuItem>
                  {employees?.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructor Externo"
                  name="externalInstructor"
                  value={formData.externalInstructor}
                  onChange={handleChange}
                  disabled={!!formData.instructorId}
                  placeholder="Nombre del instructor externo"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Proveedor"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  placeholder="Empresa proveedora de la capacitación"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Evaluación y Certificación */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Evaluación y Certificación
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.hasEvaluation}
                      onChange={handleChange}
                      name="hasEvaluation"
                    />
                  }
                  label="Incluye evaluación"
                />
              </Grid>
              {formData.hasEvaluation && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Puntuación mínima para aprobar (%)"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleChange}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.hasCertificate}
                      onChange={handleChange}
                      name="hasCertificate"
                    />
                  }
                  label="Emite certificado"
                />
              </Grid>
              {formData.hasCertificate && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Validez del certificado (meses)"
                    name="certificateValidityMonths"
                    value={formData.certificateValidityMonths}
                    onChange={handleChange}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Costo y Proyecto */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Costo y Proyecto
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  type="number"
                  label="Costo"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  select
                  fullWidth
                  label="Moneda"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="VES">VES</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Proyecto Relacionado"
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
              </Grid>
            </Grid>
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
            />
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/hse/trainings')}>
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

export default TrainingForm;
