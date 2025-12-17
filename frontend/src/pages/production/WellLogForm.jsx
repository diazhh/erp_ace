import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';

const logTypes = [
  'MAINTENANCE',
  'WORKOVER',
  'INCIDENT',
  'INSPECTION',
  'PRODUCTION_TEST',
  'EQUIPMENT_CHANGE',
  'STIMULATION',
  'COMPLETION',
  'PERFORATION',
  'GENERAL',
];

const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const statuses = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const initialFormData = {
  well_id: '',
  log_type: 'GENERAL',
  log_date: new Date().toISOString().split('T')[0],
  title: '',
  description: '',
  status: 'OPEN',
  priority: 'MEDIUM',
  start_date: '',
  end_date: '',
  downtime_hours: '',
  cost_estimated: '',
  cost_actual: '',
  findings: '',
  actions_taken: '',
  recommendations: '',
  next_action_date: '',
  contractor_id: '',
  project_id: '',
  responsible_id: '',
  notes: '',
};

const WellLogForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const wellIdFromUrl = searchParams.get('wellId');
  const isEdit = !!id;

  const [formData, setFormData] = useState(initialFormData);
  const [well, setWell] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [contractors, setContractors] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadContractors();
    loadEmployees();
    
    if (isEdit) {
      loadLog();
    } else if (wellIdFromUrl) {
      setFormData((prev) => ({ ...prev, well_id: wellIdFromUrl }));
      loadWell(wellIdFromUrl);
    }
  }, [id, wellIdFromUrl, isEdit]);

  const loadLog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/production/logs/${id}`);
      const log = response.data;
      setFormData({
        ...initialFormData,
        ...log,
        log_date: log.log_date?.split('T')[0] || '',
        start_date: log.start_date?.split('T')[0] || '',
        end_date: log.end_date?.split('T')[0] || '',
        next_action_date: log.next_action_date?.split('T')[0] || '',
      });
      if (log.well) {
        setWell(log.well);
      }
    } catch (error) {
      console.error('Error loading log:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const loadWell = async (wellId) => {
    try {
      const response = await api.get(`/production/wells/${wellId}`);
      setWell(response.data);
    } catch (error) {
      console.error('Error loading well:', error);
    }
  };

  const loadContractors = async () => {
    try {
      const response = await api.get('/contractors', { params: { limit: 100, status: 'ACTIVE' } });
      setContractors(response.data.data || []);
    } catch (error) {
      console.error('Error loading contractors:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await api.get('/employees', { params: { limit: 200, status: 'ACTIVE' } });
      setEmployees(response.data.data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.well_id) newErrors.well_id = t('validation.required');
    if (!formData.title.trim()) newErrors.title = t('validation.required');
    if (!formData.log_date) newErrors.log_date = t('validation.required');
    if (!formData.log_type) newErrors.log_type = t('validation.required');
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
        downtime_hours: formData.downtime_hours ? parseFloat(formData.downtime_hours) : null,
        cost_estimated: formData.cost_estimated ? parseFloat(formData.cost_estimated) : null,
        cost_actual: formData.cost_actual ? parseFloat(formData.cost_actual) : null,
      };

      // Limpiar campos vacíos
      Object.keys(dataToSend).forEach((key) => {
        if (dataToSend[key] === '') dataToSend[key] = null;
      });

      if (isEdit) {
        await api.put(`/production/logs/${id}`, dataToSend);
        toast.success(t('production.logUpdated'));
      } else {
        await api.post('/production/logs', dataToSend);
        toast.success(t('production.logCreated'));
      }

      // Volver al pozo
      if (formData.well_id) {
        navigate(`/production/wells/${formData.well_id}`);
      } else {
        navigate('/production/wells');
      }
    } catch (error) {
      console.error('Error saving log:', error);
      toast.error(error.response?.data?.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (formData.well_id) {
      navigate(`/production/wells/${formData.well_id}`);
    } else {
      navigate('/production/wells');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={handleBack}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {isEdit ? t('production.editLog') : t('production.newLog')}
          </Typography>
          {well && (
            <Typography variant="body2" color="text.secondary">
              {t('production.well')}: {well.code} - {well.name}
            </Typography>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Información básica */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {t('production.basicInfo')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label={t('production.logType.label') || t('common.type')}
                name="log_type"
                value={formData.log_type}
                onChange={handleChange}
                required
              >
                {logTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`production.logType.${type}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label={t('production.logDate')}
                name="log_date"
                value={formData.log_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                error={!!errors.log_date}
                helperText={errors.log_date}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('common.title')}
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('common.description')}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label={t('common.status')}
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {t(`production.logStatus.${status}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label={t('common.priority')}
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {t(`production.logPriority.${priority}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Fechas y tiempos */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('production.dates')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label={t('common.startDate')}
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label={t('common.endDate')}
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label={t('production.downtimeHours')}
                name="downtime_hours"
                value={formData.downtime_hours}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.5 }}
              />
            </Grid>

            {/* Costos */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('production.costs')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('production.costEstimated')}
                name="cost_estimated"
                value={formData.cost_estimated}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('production.costActual')}
                name="cost_actual"
                value={formData.cost_actual}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Hallazgos y acciones */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('production.findingsAndActions')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('production.findings')}
                name="findings"
                value={formData.findings}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('production.actionsTaken')}
                name="actions_taken"
                value={formData.actions_taken}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('production.recommendations')}
                name="recommendations"
                value={formData.recommendations}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label={t('production.nextActionDate')}
                name="next_action_date"
                value={formData.next_action_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Responsables */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('production.responsibles')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label={t('production.contractor')}
                name="contractor_id"
                value={formData.contractor_id || ''}
                onChange={handleChange}
              >
                <MenuItem value="">{t('common.none')}</MenuItem>
                {Array.isArray(contractors) && contractors.map((contractor) => (
                  <MenuItem key={contractor.id} value={contractor.id}>
                    {contractor.code} - {contractor.companyName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label={t('production.responsible')}
                name="responsible_id"
                value={formData.responsible_id || ''}
                onChange={handleChange}
              >
                <MenuItem value="">{t('common.none')}</MenuItem>
                {Array.isArray(employees) && employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.employeeCode} - {emp.firstName} {emp.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Notas */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('common.notes')}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>

            {/* Botones */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={handleBack}>
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={saving}
                >
                  {t('common.save')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default WellLogForm;
