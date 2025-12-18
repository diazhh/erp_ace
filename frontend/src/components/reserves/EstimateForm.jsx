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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const EstimateForm = () => {
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
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    field_id: '',
    estimate_date: new Date().toISOString().split('T')[0],
    effective_date: '',
    standard: 'PRMS',
    evaluator: 'INTERNAL',
    evaluator_company: '',
    evaluator_name: '',
    report_number: '',
    methodology: '',
    notes: '',
  });

  useEffect(() => {
    fetchFields();
    if (isEdit) {
      fetchEstimate();
    }
  }, [id]);

  const fetchFields = async () => {
    try {
      const response = await api.get('/production/fields');
      setFields(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error fetching fields:', err);
    }
  };

  const fetchEstimate = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reserves/estimates/${id}`);
      const data = response.data;
      setFormData({
        field_id: data.field_id || '',
        estimate_date: data.estimate_date || '',
        effective_date: data.effective_date || '',
        standard: data.standard || 'PRMS',
        evaluator: data.evaluator || 'INTERNAL',
        evaluator_company: data.evaluator_company || '',
        evaluator_name: data.evaluator_name || '',
        report_number: data.report_number || '',
        methodology: data.methodology || '',
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
        await api.put(`/reserves/estimates/${id}`, formData);
      } else {
        await api.post('/reserves/estimates', formData);
      }
      navigate('/reserves/estimates');
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
        <IconButton onClick={() => navigate('/reserves/estimates')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isEdit ? t('reserves.estimates.edit') : t('reserves.estimates.new')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('reserves.sections.estimateInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t('reserves.fields.field')}</InputLabel>
                  <Select
                    name="field_id"
                    value={formData.field_id}
                    label={t('reserves.fields.field')}
                    onChange={handleChange}
                  >
                    {fields.map((field) => (
                      <MenuItem key={field.id} value={field.id}>
                        {field.code} - {field.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t('reserves.fields.standard')}</InputLabel>
                  <Select
                    name="standard"
                    value={formData.standard}
                    label={t('reserves.fields.standard')}
                    onChange={handleChange}
                  >
                    <MenuItem value="PRMS">PRMS</MenuItem>
                    <MenuItem value="SEC">SEC</MenuItem>
                    <MenuItem value="SPE">SPE</MenuItem>
                    <MenuItem value="PDVSA">PDVSA</MenuItem>
                    <MenuItem value="OTHER">{t('common.other')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="estimate_date"
                  label={t('reserves.fields.estimateDate')}
                  value={formData.estimate_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="effective_date"
                  label={t('reserves.fields.effectiveDate')}
                  value={formData.effective_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              {t('reserves.sections.evaluatorInfo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t('reserves.fields.evaluator')}</InputLabel>
                  <Select
                    name="evaluator"
                    value={formData.evaluator}
                    label={t('reserves.fields.evaluator')}
                    onChange={handleChange}
                  >
                    <MenuItem value="INTERNAL">{t('reserves.evaluator.INTERNAL')}</MenuItem>
                    <MenuItem value="EXTERNAL">{t('reserves.evaluator.EXTERNAL')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="evaluator_company"
                  label={t('reserves.fields.evaluatorCompany')}
                  value={formData.evaluator_company}
                  onChange={handleChange}
                  disabled={formData.evaluator === 'INTERNAL'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="evaluator_name"
                  label={t('reserves.fields.evaluatorName')}
                  value={formData.evaluator_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="report_number"
                  label={t('reserves.fields.reportNumber')}
                  value={formData.report_number}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              {t('reserves.sections.details')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="methodology"
                  label={t('reserves.fields.methodology')}
                  value={formData.methodology}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="notes"
                  label={t('reserves.fields.notes')}
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button
            variant="outlined"
            onClick={() => navigate('/reserves/estimates')}
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

export default EstimateForm;
