import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon, Warning as WarningIcon } from '@mui/icons-material';
import { createStopWork } from '../../store/slices/ptwSlice';
import { fetchFields } from '../../store/slices/productionSlice';

const REASONS = [
  { value: 'UNSAFE_CONDITION', label: 'Condición Insegura' },
  { value: 'UNSAFE_ACT', label: 'Acto Inseguro' },
  { value: 'EQUIPMENT_FAILURE', label: 'Falla de Equipo' },
  { value: 'WEATHER', label: 'Clima' },
  { value: 'PERMIT_VIOLATION', label: 'Violación de Permiso' },
  { value: 'EMERGENCY', label: 'Emergencia' },
  { value: 'OTHER', label: 'Otro' },
];

const SEVERITIES = [
  { value: 'LOW', label: 'Baja' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'CRITICAL', label: 'Crítica' },
];

const StopWorkForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { error } = useSelector((state) => state.ptw);
  const { fields } = useSelector((state) => state.production);

  const [formData, setFormData] = useState({
    permit_id: searchParams.get('permitId') || '',
    location: '',
    field_id: '',
    description: '',
    reason: 'UNSAFE_CONDITION',
    severity: 'MEDIUM',
    immediate_actions: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await dispatch(createStopWork(formData)).unwrap();
      navigate('/ptw/stop-work');
    } catch (err) {
      console.error('Error creating stop work:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: 3, 
        gap: 2 
      }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/ptw/stop-work')} fullWidth={isMobile}>
          {t('common.back', 'Volver')}
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" sx={{ fontSize: isMobile ? 24 : 32 }} />
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="error.main">
            {t('ptw.stopWork.report', 'Reportar Stop Work')}
          </Typography>
        </Box>
      </Box>

      <Alert severity="warning" sx={{ mb: 3 }}>
        {t('ptw.stopWork.warning', 'El Stop Work Authority es un derecho y responsabilidad de todos los trabajadores. Cualquier persona puede detener el trabajo si identifica una condición o acto inseguro.')}
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                select
                name="reason"
                label={t('ptw.reason.label', 'Razón del Stop Work')}
                value={formData.reason}
                onChange={handleChange}
              >
                {REASONS.map((reason) => (
                  <MenuItem key={reason.value} value={reason.value}>
                    {t(`ptw.reason.${reason.value}`, reason.label)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                select
                name="severity"
                label={t('ptw.severity.label', 'Severidad')}
                value={formData.severity}
                onChange={handleChange}
              >
                {SEVERITIES.map((severity) => (
                  <MenuItem key={severity.value} value={severity.value}>
                    {t(`ptw.severity.${severity.value}`, severity.label)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="location"
                label={t('ptw.location', 'Ubicación')}
                value={formData.location}
                onChange={handleChange}
                placeholder={t('ptw.locationPlaceholder', 'Ej: Pozo A-01, Área de soldadura')}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                name="description"
                label={t('ptw.stopWork.description', 'Descripción de la Situación')}
                value={formData.description}
                onChange={handleChange}
                placeholder={t('ptw.stopWork.descriptionPlaceholder', 'Describa detalladamente la condición o acto inseguro observado...')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="immediate_actions"
                label={t('ptw.stopWork.immediateActions', 'Acciones Inmediatas Tomadas')}
                value={formData.immediate_actions}
                onChange={handleChange}
                placeholder={t('ptw.stopWork.immediateActionsPlaceholder', 'Describa las acciones que tomó inmediatamente (evacuación, notificación, etc.)...')}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2, 
                justifyContent: 'flex-end' 
              }}>
                <Button variant="outlined" onClick={() => navigate('/ptw/stop-work')} fullWidth={isMobile}>
                  {t('common.cancel', 'Cancelar')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={submitting}
                  fullWidth={isMobile}
                >
                  {t('ptw.stopWork.submit', 'Reportar Stop Work')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default StopWorkForm;
