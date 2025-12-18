import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  FormControlLabel,
  Switch,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createPermit, updatePermit, fetchPermitById, clearCurrentPermit } from '../../store/slices/ptwSlice';
import { fetchFields } from '../../store/slices/productionSlice';

const PERMIT_TYPES = [
  { value: 'HOT_WORK', label: 'Trabajo en Caliente' },
  { value: 'CONFINED_SPACE', label: 'Espacio Confinado' },
  { value: 'ELECTRICAL', label: 'Eléctrico' },
  { value: 'EXCAVATION', label: 'Excavación' },
  { value: 'LIFTING', label: 'Izaje' },
  { value: 'WORKING_AT_HEIGHT', label: 'Trabajo en Altura' },
  { value: 'LOCKOUT_TAGOUT', label: 'LOTO' },
  { value: 'RADIOGRAPHY', label: 'Radiografía' },
  { value: 'DIVING', label: 'Buceo' },
  { value: 'GENERAL', label: 'General' },
];

const PermitForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = Boolean(id);

  const { currentPermit, loading, error } = useSelector((state) => state.ptw);
  const { fields } = useSelector((state) => state.production);

  const [formData, setFormData] = useState({
    type: 'GENERAL',
    title: '',
    description: '',
    location: '',
    field_id: '',
    well_id: '',
    work_description: '',
    hazards_identified: '',
    start_datetime: '',
    end_datetime: '',
    max_workers: '',
    supervisor_name: '',
    supervisor_phone: '',
    emergency_contact: '',
    emergency_phone: '',
    gas_test_required: false,
    isolation_required: false,
    fire_watch_required: false,
    fire_watch_name: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
    if (isEdit) {
      dispatch(fetchPermitById(id));
    }
    return () => {
      dispatch(clearCurrentPermit());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentPermit) {
      setFormData({
        type: currentPermit.type || 'GENERAL',
        title: currentPermit.title || '',
        description: currentPermit.description || '',
        location: currentPermit.location || '',
        field_id: currentPermit.field_id || '',
        well_id: currentPermit.well_id || '',
        work_description: currentPermit.work_description || '',
        hazards_identified: currentPermit.hazards_identified || '',
        start_datetime: currentPermit.start_datetime ? currentPermit.start_datetime.slice(0, 16) : '',
        end_datetime: currentPermit.end_datetime ? currentPermit.end_datetime.slice(0, 16) : '',
        max_workers: currentPermit.max_workers || '',
        supervisor_name: currentPermit.supervisor_name || '',
        supervisor_phone: currentPermit.supervisor_phone || '',
        emergency_contact: currentPermit.emergency_contact || '',
        emergency_phone: currentPermit.emergency_phone || '',
        gas_test_required: currentPermit.gas_test_required || false,
        isolation_required: currentPermit.isolation_required || false,
        fire_watch_required: currentPermit.fire_watch_required || false,
        fire_watch_name: currentPermit.fire_watch_name || '',
        notes: currentPermit.notes || '',
      });
    }
  }, [currentPermit, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        max_workers: formData.max_workers ? parseInt(formData.max_workers) : null,
      };

      if (isEdit) {
        await dispatch(updatePermit({ id, data: dataToSend })).unwrap();
      } else {
        await dispatch(createPermit(dataToSend)).unwrap();
      }
      navigate('/ptw/permits');
    } catch (err) {
      console.error('Error saving permit:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: 3, 
        gap: 2 
      }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/ptw/permits')} fullWidth={isMobile}>
          {t('common.back', 'Volver')}
        </Button>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
          {isEdit ? t('ptw.permit.edit', 'Editar Permiso') : t('ptw.permit.new', 'Nuevo Permiso')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            {t('ptw.form.basicInfo', 'Información Básica')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                select
                name="type"
                label={t('ptw.type.label', 'Tipo de Permiso')}
                value={formData.type}
                onChange={handleChange}
              >
                {PERMIT_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {t(`ptw.type.${type.value}`, type.label)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="title"
                label={t('ptw.title', 'Título')}
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="description"
                label={t('ptw.description', 'Descripción')}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="location"
                label={t('ptw.location', 'Ubicación')}
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="field_id"
                label={t('ptw.field', 'Campo')}
                value={formData.field_id}
                onChange={handleChange}
              >
                <MenuItem value="">{t('common.none', 'Ninguno')}</MenuItem>
                {(fields?.data || []).map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.code} - {field.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            {t('ptw.form.workDetails', 'Detalles del Trabajo')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                name="work_description"
                label={t('ptw.workDescription', 'Descripción del Trabajo')}
                value={formData.work_description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="hazards_identified"
                label={t('ptw.hazards', 'Peligros Identificados')}
                value={formData.hazards_identified}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="datetime-local"
                name="start_datetime"
                label={t('ptw.startDate', 'Fecha/Hora Inicio')}
                value={formData.start_datetime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="datetime-local"
                name="end_datetime"
                label={t('ptw.endDate', 'Fecha/Hora Fin')}
                value={formData.end_datetime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                name="max_workers"
                label={t('ptw.maxWorkers', 'Máximo de Trabajadores')}
                value={formData.max_workers}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            {t('ptw.form.contacts', 'Contactos')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="supervisor_name"
                label={t('ptw.supervisorName', 'Nombre del Supervisor')}
                value={formData.supervisor_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="supervisor_phone"
                label={t('ptw.supervisorPhone', 'Teléfono del Supervisor')}
                value={formData.supervisor_phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="emergency_contact"
                label={t('ptw.emergencyContact', 'Contacto de Emergencia')}
                value={formData.emergency_contact}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="emergency_phone"
                label={t('ptw.emergencyPhone', 'Teléfono de Emergencia')}
                value={formData.emergency_phone}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            {t('ptw.form.requirements', 'Requerimientos Especiales')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.gas_test_required}
                    onChange={handleChange}
                    name="gas_test_required"
                  />
                }
                label={t('ptw.gasTestRequired', 'Prueba de Gases Requerida')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isolation_required}
                    onChange={handleChange}
                    name="isolation_required"
                  />
                }
                label={t('ptw.isolationRequired', 'Aislamiento Requerido')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.fire_watch_required}
                    onChange={handleChange}
                    name="fire_watch_required"
                  />
                }
                label={t('ptw.fireWatchRequired', 'Vigía de Fuego Requerido')}
              />
            </Grid>
            {formData.fire_watch_required && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="fire_watch_name"
                  label={t('ptw.fireWatchName', 'Nombre del Vigía de Fuego')}
                  value={formData.fire_watch_name}
                  onChange={handleChange}
                />
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="notes"
                label={t('ptw.notes', 'Notas')}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2, 
                justifyContent: 'flex-end' 
              }}>
                <Button variant="outlined" onClick={() => navigate('/ptw/permits')} fullWidth={isMobile}>
                  {t('common.cancel', 'Cancelar')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={submitting}
                  fullWidth={isMobile}
                >
                  {t('common.save', 'Guardar')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default PermitForm;
