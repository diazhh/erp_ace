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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { createContract, updateContract, fetchContractById, clearCurrentContract } from '../../store/slices/contractSlice';
import { fetchClients } from '../../store/slices/crmSlice';

const CONTRACT_TYPES = ['PSA', 'SERVICE', 'JOA', 'CONCESSION', 'FARMOUT', 'LEASE', 'OTHER'];

const initialFormData = {
  name: '',
  type: 'SERVICE',
  description: '',
  start_date: '',
  end_date: '',
  renewal_date: '',
  operator_id: '',
  government_entity: '',
  royalty_rate: '',
  cost_recovery_limit: '',
  profit_oil_split: '',
  signature_bonus: '',
  currency: 'USD',
  total_value: '',
  terms_summary: '',
  special_conditions: '',
  termination_clause: '',
  dispute_resolution: '',
  governing_law: 'Leyes de Venezuela',
  signed_date: '',
  effective_date: '',
  notes: '',
};

const ContractForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentContract, loading, error } = useSelector((state) => state.contracts);
  const { clients } = useSelector((state) => state.crm);

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchClients({ limit: 100 }));
    if (isEdit) {
      dispatch(fetchContractById(id));
    }
    return () => {
      dispatch(clearCurrentContract());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentContract) {
      setFormData({
        name: currentContract.name || '',
        type: currentContract.type || 'SERVICE',
        description: currentContract.description || '',
        start_date: currentContract.start_date || '',
        end_date: currentContract.end_date || '',
        renewal_date: currentContract.renewal_date || '',
        operator_id: currentContract.operator_id || '',
        government_entity: currentContract.government_entity || '',
        royalty_rate: currentContract.royalty_rate || '',
        cost_recovery_limit: currentContract.cost_recovery_limit || '',
        profit_oil_split: currentContract.profit_oil_split || '',
        signature_bonus: currentContract.signature_bonus || '',
        currency: currentContract.currency || 'USD',
        total_value: currentContract.total_value || '',
        terms_summary: currentContract.terms_summary || '',
        special_conditions: currentContract.special_conditions || '',
        termination_clause: currentContract.termination_clause || '',
        dispute_resolution: currentContract.dispute_resolution || '',
        governing_law: currentContract.governing_law || '',
        signed_date: currentContract.signed_date || '',
        effective_date: currentContract.effective_date || '',
        notes: currentContract.notes || '',
      });
    }
  }, [isEdit, currentContract]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('validation.required');
    if (!formData.type) errors.type = t('validation.required');
    if (!formData.start_date) errors.start_date = t('validation.required');
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { ...formData };
    // Clean empty strings
    Object.keys(data).forEach((key) => {
      if (data[key] === '') data[key] = null;
    });

    try {
      if (isEdit) {
        await dispatch(updateContract({ id, data })).unwrap();
      } else {
        const result = await dispatch(createContract(data)).unwrap();
        navigate(`/contracts/${result.id}`);
        return;
      }
      navigate(`/contracts/${id}`);
    } catch (err) {
      console.error('Error saving contract:', err);
    }
  };

  if (isEdit && loading && !currentContract) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate(-1)}>
          {t('common.back')}
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? t('contracts.form.editTitle') : t('contracts.form.createTitle')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('contracts.form.basicInfo')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label={t('contracts.fields.name')}
                value={formData.name}
                onChange={handleChange('name')}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required error={!!formErrors.type}>
                <InputLabel>{t('contracts.fields.type')}</InputLabel>
                <Select
                  value={formData.type}
                  label={t('contracts.fields.type')}
                  onChange={handleChange('type')}
                >
                  {CONTRACT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`contracts.types.${type.toLowerCase()}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('contracts.fields.description')}
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('contracts.fields.operator')}</InputLabel>
                <Select
                  value={formData.operator_id}
                  label={t('contracts.fields.operator')}
                  onChange={handleChange('operator_id')}
                >
                  <MenuItem value="">{t('common.none')}</MenuItem>
                  {clients?.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name} ({client.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('contracts.fields.governmentEntity')}
                value={formData.government_entity}
                onChange={handleChange('government_entity')}
                placeholder="MENPET, PDVSA, etc."
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('contracts.form.dates')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label={t('contracts.fields.startDate')}
                value={formData.start_date}
                onChange={handleChange('start_date')}
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.start_date}
                helperText={formErrors.start_date}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label={t('contracts.fields.endDate')}
                value={formData.end_date}
                onChange={handleChange('end_date')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label={t('contracts.fields.signedDate')}
                value={formData.signed_date}
                onChange={handleChange('signed_date')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label={t('contracts.fields.effectiveDate')}
                value={formData.effective_date}
                onChange={handleChange('effective_date')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label={t('contracts.fields.renewalDate')}
                value={formData.renewal_date}
                onChange={handleChange('renewal_date')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('contracts.form.financialTerms')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label={t('contracts.fields.royaltyRate')}
                value={formData.royalty_rate}
                onChange={handleChange('royalty_rate')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label={t('contracts.fields.costRecoveryLimit')}
                value={formData.cost_recovery_limit}
                onChange={handleChange('cost_recovery_limit')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label={t('contracts.fields.profitOilSplit')}
                value={formData.profit_oil_split}
                onChange={handleChange('profit_oil_split')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t('contracts.fields.currency')}</InputLabel>
                <Select
                  value={formData.currency}
                  label={t('contracts.fields.currency')}
                  onChange={handleChange('currency')}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="VES">VES</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label={t('contracts.fields.signatureBonus')}
                value={formData.signature_bonus}
                onChange={handleChange('signature_bonus')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label={t('contracts.fields.totalValue')}
                value={formData.total_value}
                onChange={handleChange('total_value')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('contracts.form.legalTerms')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('contracts.fields.termsSummary')}
                value={formData.terms_summary}
                onChange={handleChange('terms_summary')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('contracts.fields.specialConditions')}
                value={formData.special_conditions}
                onChange={handleChange('special_conditions')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('contracts.fields.terminationClause')}
                value={formData.termination_clause}
                onChange={handleChange('termination_clause')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('contracts.fields.disputeResolution')}
                value={formData.dispute_resolution}
                onChange={handleChange('dispute_resolution')}
                placeholder="Arbitraje ICC, ICSID, etc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('contracts.fields.governingLaw')}
                value={formData.governing_law}
                onChange={handleChange('governing_law')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('contracts.fields.notes')}
                value={formData.notes}
                onChange={handleChange('notes')}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ContractForm;
