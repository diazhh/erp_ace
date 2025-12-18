import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  OilBarrel as OilBarrelIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ReservesDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reserves/dashboard');
      setDashboard(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || t('reserves.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
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
      </Box>
    );
  }

  const { reservesByCategory, estimatesByStatus, npvSummary, recentEstimates, latestValuations } = dashboard || {};

  return (
    <Box p={isMobile ? 2 : 3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1">
          {t('reserves.dashboard.title')}
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate('/reserves/estimates')}
          >
            {t('reserves.estimates.list')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/reserves/estimates/new')}
          >
            {t('reserves.estimates.new')}
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <OilBarrelIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('reserves.dashboard.totalNpv1P')}
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(npvSummary?.total_npv_1p)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('reserves.dashboard.totalNpv2P')}
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(npvSummary?.total_npv_2p)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AssessmentIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('reserves.dashboard.totalNpv3P')}
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(npvSummary?.total_npv_3p)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <OilBarrelIcon color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('reserves.dashboard.estimatesCount')}
                  </Typography>
                  <Typography variant="h5">
                    {estimatesByStatus?.reduce((sum, s) => sum + parseInt(s.count), 0) || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={3}>
        {/* Reserves by Category */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('reserves.dashboard.reservesByCategory')}
              </Typography>
              {reservesByCategory && reservesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reservesByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_oil" name={t('reserves.fields.oilVolume')} fill="#8884d8" />
                    <Bar dataKey="total_gas" name={t('reserves.fields.gasVolume')} fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography color="text.secondary">{t('common.noData')}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Estimates by Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('reserves.dashboard.estimatesByStatus')}
              </Typography>
              {estimatesByStatus && estimatesByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={estimatesByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ status, count }) => `${t(`reserves.status.${status}`)} (${count})`}
                    >
                      {estimatesByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography color="text.secondary">{t('common.noData')}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Estimates Table */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('reserves.dashboard.recentEstimates')}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('reserves.fields.code')}</TableCell>
                      <TableCell>{t('reserves.fields.field')}</TableCell>
                      <TableCell>{t('reserves.fields.standard')}</TableCell>
                      <TableCell>{t('reserves.fields.status')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentEstimates && recentEstimates.length > 0 ? (
                      recentEstimates.map((estimate) => (
                        <TableRow 
                          key={estimate.id} 
                          hover 
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/reserves/estimates/${estimate.id}`)}
                        >
                          <TableCell>{estimate.code}</TableCell>
                          <TableCell>{estimate.field?.name || '-'}</TableCell>
                          <TableCell>{estimate.standard}</TableCell>
                          <TableCell>
                            <Chip 
                              label={t(`reserves.status.${estimate.status}`)} 
                              color={getStatusColor(estimate.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          {t('common.noData')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Latest Valuations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('reserves.dashboard.latestValuations')}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('reserves.fields.code')}</TableCell>
                      <TableCell>{t('reserves.fields.field')}</TableCell>
                      <TableCell align="right">{t('reserves.fields.npv2p')}</TableCell>
                      <TableCell>{t('reserves.fields.status')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {latestValuations && latestValuations.length > 0 ? (
                      latestValuations.map((valuation) => (
                        <TableRow 
                          key={valuation.id} 
                          hover 
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/reserves/valuations/${valuation.id}`)}
                        >
                          <TableCell>{valuation.code}</TableCell>
                          <TableCell>{valuation.estimate?.field?.name || '-'}</TableCell>
                          <TableCell align="right">{formatCurrency(valuation.npv_2p)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={t(`reserves.status.${valuation.status}`)} 
                              color={getStatusColor(valuation.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          {t('common.noData')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReservesDashboard;
