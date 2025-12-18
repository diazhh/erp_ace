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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createCashCall, updateCashCall, fetchCashCallById, clearCurrentCashCall } from '../../store/slices/jibSlice';
import { fetchContracts } from '../../store/slices/contractSlice';
import { fetchAFEs } from '../../store/slices/afeSlice';

const PURPOSES = [
  { value: 'OPERATIONS', label: 'Operaciones' },
  { value: 'AFE', label: 'AFE' },
  { value: 'EMERGENCY', label: 'Emergencia' },
  { value: 'CAPITAL', label: 'Capital' },
  { value: 'ABANDONMENT', label: 'Abandono' },
  { value: 'OTHER', label: 'Otro' },
];

const CashCallForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = Boolean(id);

  const { currentCashCall, loading, error } = useSelector((state) => state.jib);
  const { contracts } = useSelector((state) => state.contracts);
  const { afes } = useSelector((state) => state.afe);

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    contract_id: '',
    purpose: 'OPERATIONS',
    title: '',
    description: '',
    afe_id: '',
    total_amount: '',
    currency: 'USD',
    call_date: today,
    due_date: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchContracts({ limit: 100 }));
    dispatch(fetchAFEs({ limit: 100, status: 'APPROVED' }));
    if (isEdit) {
      dispatch(fetchCashCallById(id));
    }
    return () => {
      dispatch(clearCurrentCashCall());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentCashCall) {
      setFormData({
        contract_id: currentCashCall.contract_id || '',
        purpose: currentCashCall.purpose || 'OPERATIONS',
        title: currentCashCall.title || '',
        description: currentCashCall.description || '',
        afe_id: currentCashCall.afe_id || '',
        total_amount: currentCashCall.total_amount || '',
        currency: currentCashCall.currency || 'USD',
        call_date: currentCashCall.call_date || today,
        due_date: currentCashCall.due_date || '',
        notes: currentCashCall.notes || '',
      });
    }
  }, [currentCashCall, isEdit, today]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.afe_id) delete dataToSubmit.afe_id;
      
      if (isEdit) {
        await dispatch(updateCashCall({ id, data: dataToSubmit })).unwrap();
      } else {
        await dispatch(createCashCall(dataToSubmit)).unwrap();
      }
      navigate('/jib/cash-calls');
    } catch (err) {
      console.error('Error saving Cash Call:', err);
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
        <Button startIcon={<BackIcon />} onClick={() => navigate('/jib/cash-calls')} fullWidth={isMobile}>
          {t('common.back', 'Volver')}
        </Button>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
          {isEdit ? t('jib.cashCall.edit', 'Editar Cash Call') : t('jib.cashCall.new', 'Nuevo Cash Call')}
        </Typography>
      </Box>

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
                name="purpose"
                label={t('jib.purpose.label', 'Propósito')}
                value={formData.purpose}
                onChange={handleChange}
              >
                {PURPOSES.map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                    {t(`jib.purpose.${p.value}`, p.label)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="title"
                label={t('jib.title', 'Título')}
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
                label={t('jib.description', 'Descripción')}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            {formData.purpose === 'AFE' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="afe_id"
                  label={t('jib.afe', 'AFE Relacionado')}
                  value={formData.afe_id}
                  onChange={handleChange}
                >
                  <MenuItem value="">{t('common.none', 'Ninguno')}</MenuItem>
                  {(afes?.data || []).map((afe) => (
                    <MenuItem key={afe.id} value={afe.id}>
                      {afe.code} - {afe.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                name="total_amount"
                label={t('jib.totalAmount', 'Monto Total')}
                value={formData.total_amount}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
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

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="call_date"
                label={t('jib.callDate', 'Fecha de Solicitud')}
                value={formData.call_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="due_date"
                label={t('jib.dueDate', 'Fecha de Vencimiento')}
                value={formData.due_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
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
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2, 
                justifyContent: 'flex-end' 
              }}>
                <Button variant="outlined" onClick={() => navigate('/jib/cash-calls')} fullWidth={isMobile}>
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

export default CashCallForm;
