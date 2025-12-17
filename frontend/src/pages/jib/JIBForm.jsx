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
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createJIB, updateJIB, fetchJIBById, clearCurrentJIB } from '../../store/slices/jibSlice';
import { fetchContracts } from '../../store/slices/contractSlice';

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const JIBForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentJIB, loading, error } = useSelector((state) => state.jib);
  const { contracts } = useSelector((state) => state.contracts);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [formData, setFormData] = useState({
    contract_id: '',
    billing_period_month: currentMonth,
    billing_period_year: currentYear,
    description: '',
    due_date: '',
    currency: 'USD',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchContracts({ limit: 100 }));
    if (isEdit) {
      dispatch(fetchJIBById(id));
    }
    return () => {
      dispatch(clearCurrentJIB());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentJIB) {
      setFormData({
        contract_id: currentJIB.contract_id || '',
        billing_period_month: currentJIB.billing_period_month || currentMonth,
        billing_period_year: currentJIB.billing_period_year || currentYear,
        description: currentJIB.description || '',
        due_date: currentJIB.due_date || '',
        currency: currentJIB.currency || 'USD',
        notes: currentJIB.notes || '',
      });
    }
  }, [currentJIB, isEdit, currentMonth, currentYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await dispatch(updateJIB({ id, data: formData })).unwrap();
      } else {
        await dispatch(createJIB(formData)).unwrap();
      }
      navigate('/jib/billings');
    } catch (err) {
      console.error('Error saving JIB:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (isEdit && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/jib/billings')}>
          {t('common.back', 'Volver')}
        </Button>
        <Typography variant="h4" fontWeight="bold">
          {isEdit ? t('jib.billing.edit', 'Editar JIB') : t('jib.billing.new', 'Nuevo JIB')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                select
                name="contract_id"
                label={t('jib.contract', 'Contrato')}
                value={formData.contract_id}
                onChange={handleChange}
              >
                {(contracts?.data || []).map((contract) => (
                  <MenuItem key={contract.id} value={contract.id}>
                    {contract.code} - {contract.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                select
                name="billing_period_month"
                label={t('jib.billingMonth', 'Mes de Facturación')}
                value={formData.billing_period_month}
                onChange={handleChange}
              >
                {MONTHS.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {t(`common.months.${month.value}`, month.label)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                select
                name="billing_period_year"
                label={t('jib.billingYear', 'Año de Facturación')}
                value={formData.billing_period_year}
                onChange={handleChange}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="description"
                label={t('jib.description', 'Descripción')}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                name="due_date"
                label={t('jib.dueDate', 'Fecha de Vencimiento')}
                value={formData.due_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="currency"
                label={t('jib.currency', 'Moneda')}
                value={formData.currency}
                onChange={handleChange}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="VES">VES</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="notes"
                label={t('jib.notes', 'Notas')}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate('/jib/billings')}>
                  {t('common.cancel', 'Cancelar')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={submitting}
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

export default JIBForm;
