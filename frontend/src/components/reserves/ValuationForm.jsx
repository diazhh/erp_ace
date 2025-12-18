import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const ValuationForm = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [formData, setFormData] = useState({
    estimate_id: location.state?.estimateId || '',
    valuation_date: new Date().toISOString().split('T')[0],
    oil_price: '',
    gas_price: '',
    condensate_price: '',
    price_scenario: 'BASE',
    discount_rate: '10',
    npv_1p: '',
    npv_2p: '',
    npv_3p: '',
    pv10_1p: '',
    pv10_2p: '',
    pv10_3p: '',
    undiscounted_cashflow: '',
    capex_required: '',
    opex_per_boe: '',
    royalty_rate: '',
    tax_rate: '',
    methodology: 'DCF',
    notes: '',
  });

  useEffect(() => {
    fetchEstimates();
    if (isEdit) {
      fetchValuation();
    }
  }, [id]);

  const fetchEstimates = async () => {
    try {
      const response = await api.get('/reserves/estimates', { params: { status: 'APPROVED', limit: 100 } });
      setEstimates(response.data.data || []);
    } catch (err) {
      console.error('Error fetching estimates:', err);
    }
  };

  const fetchValuation = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reserves/valuations/${id}`);
      const data = response.data;
      setFormData({
        estimate_id: data.estimate_id || '',
        valuation_date: data.valuation_date || '',
        oil_price: data.oil_price || '',
        gas_price: data.gas_price || '',
        condensate_price: data.condensate_price || '',
        price_scenario: data.price_scenario || 'BASE',
        discount_rate: data.discount_rate || '10',
        npv_1p: data.npv_1p || '',
        npv_2p: data.npv_2p || '',
        npv_3p: data.npv_3p || '',
        pv10_1p: data.pv10_1p || '',
        pv10_2p: data.pv10_2p || '',
        pv10_3p: data.pv10_3p || '',
        undiscounted_cashflow: data.undiscounted_cashflow || '',
        capex_required: data.capex_required || '',
        opex_per_boe: data.opex_per_boe || '',
        royalty_rate: data.royalty_rate || '',
        tax_rate: data.tax_rate || '',
        methodology: data.methodology || 'DCF',
        notes: data.notes || '',
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || t('reserves.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isEdit) {
        await api.put(`/reserves/valuations/${id}`, formData);
      } else {
        await api.post('/reserves/valuations', formData);
      }
      navigate('/reserves/valuations');
    } catch (err) {
      setError(err.response?.data?.message || t('reserves.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={isMobile ? 2 : 3}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate('/reserves/valuations')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isEdit ? t('reserves.valuations.edit') : t('reserves.valuations.new')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('reserves.sections.valuationInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t('reserves.fields.estimate')}</InputLabel>
                  <Select
                    name="estimate_id"
                    value={formData.estimate_id}
                    label={t('reserves.fields.estimate')}
                    onChange={handleChange}
                  >
                    {estimates.map((est) => (
                      <MenuItem key={est.id} value={est.id}>
                        {est.code} - {est.field?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="valuation_date"
                  label={t('reserves.fields.valuationDate')}
                  value={formData.valuation_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t('reserves.fields.priceScenario')}</InputLabel>
                  <Select
                    name="price_scenario"
                    value={formData.price_scenario}
                    label={t('reserves.fields.priceScenario')}
                    onChange={handleChange}
                  >
                    <MenuItem value="LOW">{t('reserves.priceScenario.LOW')}</MenuItem>
                    <MenuItem value="BASE">{t('reserves.priceScenario.BASE')}</MenuItem>
                    <MenuItem value="HIGH">{t('reserves.priceScenario.HIGH')}</MenuItem>
                    <MenuItem value="STRIP">{t('reserves.priceScenario.STRIP')}</MenuItem>
                    <MenuItem value="CUSTOM">{t('reserves.priceScenario.CUSTOM')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t('reserves.fields.methodology')}</InputLabel>
                  <Select
                    name="methodology"
                    value={formData.methodology}
                    label={t('reserves.fields.methodology')}
                    onChange={handleChange}
                  >
                    <MenuItem value="DCF">DCF</MenuItem>
                    <MenuItem value="COMPARABLE">Comparable</MenuItem>
                    <MenuItem value="COST">Cost</MenuItem>
                    <MenuItem value="OPTION">Option</MenuItem>
                    <MenuItem value="HYBRID">Hybrid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('reserves.sections.priceAssumptions')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  name="oil_price"
                  label={t('reserves.fields.oilPrice')}
                  value={formData.oil_price}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/bbl</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="gas_price"
                  label={t('reserves.fields.gasPrice')}
                  value={formData.gas_price}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/Mcf</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="condensate_price"
                  label={t('reserves.fields.condensatePrice')}
                  value={formData.condensate_price}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/bbl</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  name="discount_rate"
                  label={t('reserves.fields.discountRate')}
                  value={formData.discount_rate}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  name="royalty_rate"
                  label={t('reserves.fields.royaltyRate')}
                  value={formData.royalty_rate}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  name="tax_rate"
                  label={t('reserves.fields.taxRate')}
                  value={formData.tax_rate}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  name="opex_per_boe"
                  label={t('reserves.fields.opexPerBoe')}
                  value={formData.opex_per_boe}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/BOE</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('reserves.sections.valuationResults')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="npv_1p"
                  label={t('reserves.fields.npv1p')}
                  value={formData.npv_1p}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">MM</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="npv_2p"
                  label={t('reserves.fields.npv2p')}
                  value={formData.npv_2p}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">MM</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="npv_3p"
                  label={t('reserves.fields.npv3p')}
                  value={formData.npv_3p}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">MM</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="undiscounted_cashflow"
                  label={t('reserves.fields.undiscountedCashflow')}
                  value={formData.undiscounted_cashflow}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">MM</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="capex_required"
                  label={t('reserves.fields.capexRequired')}
                  value={formData.capex_required}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">MM</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('reserves.fields.notes')}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button
            variant="outlined"
            onClick={() => navigate('/reserves/valuations')}
          >
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
      </form>
    </Box>
  );
};

export default ValuationForm;
