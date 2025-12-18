import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  OilBarrel as OilBarrelIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const EstimateDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchEstimate();
  }, [id]);

  const fetchEstimate = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reserves/estimates/${id}`);
      setEstimate(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || t('reserves.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await api.post(`/reserves/estimates/${id}/approve`);
      fetchEstimate();
    } catch (err) {
      setError(err.response?.data?.message || t('reserves.errors.approveFailed'));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      UNDER_REVIEW: 'warning',
      APPROVED: 'success',
      SUPERSEDED: 'info',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const formatNumber = (num, decimals = 2) => {
    if (num === null || num === undefined) return '-';
    return parseFloat(num).toLocaleString('es-VE', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return '-';
    return `$${formatNumber(num, 2)} MM`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/reserves/estimates')} sx={{ mt: 2 }}>
          {t('common.back')}
        </Button>
      </Box>
    );
  }

  if (!estimate) {
    return (
      <Box p={3}>
        <Alert severity="warning">{t('reserves.errors.notFound')}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/reserves/estimates')} sx={{ mt: 2 }}>
          {t('common.back')}
        </Button>
      </Box>
    );
  }

  return (
    <Box p={isMobile ? 2 : 3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate('/reserves/estimates')}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1">
              {estimate.code}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {estimate.field?.name} - {formatDate(estimate.estimate_date)}
            </Typography>
          </Box>
          <Chip 
            label={t(`reserves.status.${estimate.status}`)} 
            color={getStatusColor(estimate.status)}
          />
        </Box>
        <Box display="flex" gap={1} flexWrap="wrap">
          {estimate.status === 'DRAFT' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleApprove}
            >
              {t('common.approve')}
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/reserves/estimates/${id}/edit`)}
          >
            {t('common.edit')}
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab icon={<DescriptionIcon />} label={t('reserves.tabs.general')} iconPosition="start" />
          <Tab icon={<OilBarrelIcon />} label={t('reserves.tabs.categories')} iconPosition="start" />
          <Tab icon={<AssessmentIcon />} label={t('reserves.tabs.valuations')} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* General Info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('reserves.sections.estimateInfo')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {t('reserves.fields.code')}
                    </Typography>
                    <Typography variant="body1">{estimate.code}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {t('reserves.fields.field')}
                    </Typography>
                    <Typography variant="body1">{estimate.field?.name || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {t('reserves.fields.estimateDate')}
                    </Typography>
                    <Typography variant="body1">{formatDate(estimate.estimate_date)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {t('reserves.fields.effectiveDate')}
                    </Typography>
                    <Typography variant="body1">{formatDate(estimate.effective_date)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {t('reserves.fields.standard')}
                    </Typography>
                    <Typography variant="body1">{estimate.standard}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {t('reserves.fields.reportNumber')}
                    </Typography>
                    <Typography variant="body1">{estimate.report_number || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Evaluator Info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('reserves.sections.evaluatorInfo')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {t('reserves.fields.evaluator')}
                    </Typography>
                    <Typography variant="body1">{t(`reserves.evaluator.${estimate.evaluator}`)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {t('reserves.fields.evaluatorCompany')}
                    </Typography>
                    <Typography variant="body1">{estimate.evaluator_company || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      {t('reserves.fields.evaluatorName')}
                    </Typography>
                    <Typography variant="body1">{estimate.evaluator_name || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Methodology */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('reserves.fields.methodology')}
                </Typography>
                <Typography variant="body1">
                  {estimate.methodology || t('common.noData')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Notes */}
          {estimate.notes && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('reserves.fields.notes')}
                  </Typography>
                  <Typography variant="body1">{estimate.notes}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('reserves.tabs.categories')}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('reserves.fields.category')}</TableCell>
                    <TableCell>{t('reserves.fields.subCategory')}</TableCell>
                    <TableCell align="right">{t('reserves.fields.oilVolume')} (MMbbl)</TableCell>
                    <TableCell align="right">{t('reserves.fields.gasVolume')} (Bcf)</TableCell>
                    <TableCell align="right">{t('reserves.fields.condensateVolume')} (MMbbl)</TableCell>
                    <TableCell align="right">{t('reserves.fields.boeVolume')} (MMboe)</TableCell>
                    <TableCell align="right">{t('reserves.fields.recoveryFactor')} (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estimate.categories && estimate.categories.length > 0 ? (
                    estimate.categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell>
                          <Chip label={cat.category} size="small" color="primary" />
                        </TableCell>
                        <TableCell>{cat.sub_category !== 'N/A' ? cat.sub_category : '-'}</TableCell>
                        <TableCell align="right">{formatNumber(cat.oil_volume)}</TableCell>
                        <TableCell align="right">{formatNumber(cat.gas_volume)}</TableCell>
                        <TableCell align="right">{formatNumber(cat.condensate_volume)}</TableCell>
                        <TableCell align="right">{formatNumber(cat.boe_volume)}</TableCell>
                        <TableCell align="right">{formatNumber(cat.recovery_factor)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        {t('common.noData')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                {t('reserves.tabs.valuations')}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/reserves/valuations/new', { state: { estimateId: id } })}
              >
                {t('reserves.valuations.new')}
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('reserves.fields.code')}</TableCell>
                    <TableCell>{t('reserves.fields.valuationDate')}</TableCell>
                    <TableCell>{t('reserves.fields.priceScenario')}</TableCell>
                    <TableCell align="right">{t('reserves.fields.npv1p')}</TableCell>
                    <TableCell align="right">{t('reserves.fields.npv2p')}</TableCell>
                    <TableCell align="right">{t('reserves.fields.npv3p')}</TableCell>
                    <TableCell>{t('reserves.fields.status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estimate.valuations && estimate.valuations.length > 0 ? (
                    estimate.valuations.map((val) => (
                      <TableRow 
                        key={val.id} 
                        hover 
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/reserves/valuations/${val.id}`)}
                      >
                        <TableCell>{val.code}</TableCell>
                        <TableCell>{formatDate(val.valuation_date)}</TableCell>
                        <TableCell>{t(`reserves.priceScenario.${val.price_scenario}`)}</TableCell>
                        <TableCell align="right">{formatCurrency(val.npv_1p)}</TableCell>
                        <TableCell align="right">{formatCurrency(val.npv_2p)}</TableCell>
                        <TableCell align="right">{formatCurrency(val.npv_3p)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={t(`reserves.status.${val.status}`)} 
                            color={getStatusColor(val.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        {t('common.noData')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default EstimateDetail;
