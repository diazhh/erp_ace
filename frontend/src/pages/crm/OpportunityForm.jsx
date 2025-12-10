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
  Slider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  TrendingUp as OpportunityIcon,
} from '@mui/icons-material';
import {
  fetchOpportunityById,
  createOpportunity,
  updateOpportunity,
  clearCurrentOpportunity,
  fetchClients,
} from '../../store/slices/crmSlice';

const OpportunityForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentOpportunity, clients, loading, error } = useSelector((state) => state.crm);

  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    stage: 'LEAD',
    priority: 'MEDIUM',
    estimatedValue: '',
    currency: 'USD',
    probability: 50,
    expectedCloseDate: '',
    source: '',
    competitor: '',
    lostReason: '',
    notes: '',
  });
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    dispatch(fetchClients({}));
    if (isEdit) {
      dispatch(fetchOpportunityById(id));
    }
    return () => {
      dispatch(clearCurrentOpportunity());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentOpportunity) {
      setFormData({
        clientId: currentOpportunity.clientId || '',
        title: currentOpportunity.title || '',
        description: currentOpportunity.description || '',
        stage: currentOpportunity.stage || 'LEAD',
        priority: currentOpportunity.priority || 'MEDIUM',
        estimatedValue: currentOpportunity.estimatedValue || '',
        currency: currentOpportunity.currency || 'USD',
        probability: currentOpportunity.probability || 50,
        expectedCloseDate: currentOpportunity.expectedCloseDate
          ? currentOpportunity.expectedCloseDate.split('T')[0]
          : '',
        source: currentOpportunity.source || '',
        competitor: currentOpportunity.competitor || '',
        lostReason: currentOpportunity.lostReason || '',
        notes: currentOpportunity.notes || '',
      });
    }
  }, [isEdit, currentOpportunity]);

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
        estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : null,
      };

      if (isEdit) {
        await dispatch(updateOpportunity({ id, data: dataToSend })).unwrap();
      } else {
        await dispatch(createOpportunity(dataToSend)).unwrap();
      }
      navigate('/crm/opportunities');
    } catch (err) {
      setSubmitError(err.message || 'Error al guardar la oportunidad');
    }
  };

  const getClientName = (client) => {
    if (!client) return '';
    if (client.clientType === 'COMPANY') {
      return client.companyName || client.tradeName || '';
    }
    return `${client.firstName || ''} ${client.lastName || ''}`.trim();
  };

  if (isEdit && loading && !currentOpportunity) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const selectedClient = clients.find((c) => c.id === formData.clientId) || null;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/crm/opportunities')}>
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          <OpportunityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEdit ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
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
                options={clients}
                getOptionLabel={(option) => `${option.code} - ${getClientName(option)}`}
                value={selectedClient}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, clientId: newValue?.id || '' }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Cliente" required />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
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
              />
            </Grid>

            {/* Estado y Prioridad */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Estado y Prioridad
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Etapa</InputLabel>
                <Select
                  name="stage"
                  value={formData.stage}
                  label="Etapa"
                  onChange={handleChange}
                >
                  <MenuItem value="LEAD">Prospecto</MenuItem>
                  <MenuItem value="QUALIFIED">Calificado</MenuItem>
                  <MenuItem value="PROPOSAL">Propuesta</MenuItem>
                  <MenuItem value="NEGOTIATION">Negociación</MenuItem>
                  <MenuItem value="WON">Ganada</MenuItem>
                  <MenuItem value="LOST">Perdida</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  label="Prioridad"
                  onChange={handleChange}
                >
                  <MenuItem value="LOW">Baja</MenuItem>
                  <MenuItem value="MEDIUM">Media</MenuItem>
                  <MenuItem value="HIGH">Alta</MenuItem>
                  <MenuItem value="CRITICAL">Crítica</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fecha Cierre Esperado"
                name="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Valor y Probabilidad */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Valor y Probabilidad
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Valor Estimado"
                name="estimatedValue"
                type="number"
                value={formData.estimatedValue}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  label="Moneda"
                  onChange={handleChange}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="VES">VES</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography gutterBottom>
                Probabilidad: {formData.probability}%
              </Typography>
              <Slider
                value={formData.probability}
                onChange={(_, value) => setFormData((prev) => ({ ...prev, probability: value }))}
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Información Adicional */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Información Adicional
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Origen"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Referido, Web, Evento..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Competidor"
                name="competitor"
                value={formData.competitor}
                onChange={handleChange}
              />
            </Grid>

            {formData.stage === 'LOST' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Razón de Pérdida"
                  name="lostReason"
                  value={formData.lostReason}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
            )}

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

            {/* Botones */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/crm/opportunities')}>
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

export default OpportunityForm;
