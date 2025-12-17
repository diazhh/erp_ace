import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  OilBarrel as OilIcon,
  LocalGasStation as GasIcon,
  Water as WaterIcon,
  Terrain as FieldIcon,
  Timeline as TrendIcon,
  Warning as WarningIcon,
  CheckCircle as ActiveIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { fetchProductionDashboard, fetchProductionTrend, fetchFields } from '../../store/slices/productionSlice';

const ProductionDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { dashboard, trend, fields, loading } = useSelector((state) => state.production);
  const [selectedField, setSelectedField] = useState('');

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
    dispatch(fetchProductionDashboard());
    dispatch(fetchProductionTrend({ days: 30 }));
  }, [dispatch]);

  const handleFieldChange = (e) => {
    const fieldId = e.target.value;
    setSelectedField(fieldId);
    dispatch(fetchProductionDashboard(fieldId || null));
    dispatch(fetchProductionTrend({ fieldId: fieldId || null, days: 30 }));
  };

  const handleRefresh = () => {
    dispatch(fetchProductionDashboard(selectedField || null));
    dispatch(fetchProductionTrend({ fieldId: selectedField || null, days: 30 }));
  };

  const formatNumber = (num, decimals = 0) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const KPICard = ({ title, value, unit, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              borderRadius: 1,
              p: 1,
              mr: 2,
              display: 'flex',
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: `${color}.main` }}>
          {value}
          <Typography component="span" variant="body2" sx={{ ml: 1 }}>
            {unit}
          </Typography>
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t('production.dashboard.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('production.dashboard.subtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            select
            size="small"
            value={selectedField}
            onChange={handleFieldChange}
            sx={{ minWidth: 200 }}
            label={t('production.selectField')}
          >
            <MenuItem value="">{t('production.allFields')}</MenuItem>
            {fields.map((field) => (
              <MenuItem key={field.id} value={field.id}>
                {field.code} - {field.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
            {t('common.refresh')}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/production/daily/new')}>
            {t('production.registerProduction')}
          </Button>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* KPIs Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <KPICard
            title={t('production.dashboard.totalFields')}
            value={formatNumber(dashboard?.summary?.totalFields)}
            unit=""
            icon={<FieldIcon sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <KPICard
            title={t('production.dashboard.activeWells')}
            value={formatNumber(dashboard?.summary?.wellsActive)}
            unit=""
            icon={<ActiveIcon sx={{ color: 'success.main' }} />}
            color="success"
            subtitle={`${formatNumber(dashboard?.summary?.wellsShutIn)} ${t('production.shutIn')}`}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <KPICard
            title={t('production.dashboard.yesterdayOil')}
            value={formatNumber(dashboard?.yesterday?.oilBbl)}
            unit="bbl"
            icon={<OilIcon sx={{ color: 'warning.main' }} />}
            color="warning"
            subtitle={dashboard?.yesterday?.date}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <KPICard
            title={t('production.dashboard.yesterdayGas')}
            value={formatNumber(dashboard?.yesterday?.gasMcf)}
            unit="mcf"
            icon={<GasIcon sx={{ color: 'info.main' }} />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* MTD & YTD */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('production.dashboard.mtdProduction')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(dashboard?.mtd?.oilBbl)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('production.oilBbl')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="info.main" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(dashboard?.mtd?.gasMcf)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('production.gasMcf')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(dashboard?.mtd?.avgOilBopd)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('production.avgBopd')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('production.dashboard.ytdProduction')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(dashboard?.ytd?.oilBbl)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('production.oilBbl')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="info.main" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(dashboard?.ytd?.gasMcf)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('production.gasMcf')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(dashboard?.ytd?.waterBbl)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('production.waterBbl')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Production Trend Chart */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('production.dashboard.productionTrend')}
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                formatter={(value, name) => [formatNumber(value, 1), name]}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="oilBbl"
                name={t('production.oilBbl')}
                stroke={theme.palette.warning.main}
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="gasMcf"
                name={t('production.gasMcf')}
                stroke={theme.palette.info.main}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Top Wells & Downtime */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('production.dashboard.topWells')}
            </Typography>
            {dashboard?.topWells?.length > 0 ? (
              <Box>
                {dashboard.topWells.map((well, index) => (
                  <Box
                    key={well.wellId}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index < dashboard.topWells.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {well.wellCode}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {well.wellName}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'bold' }}>
                        {formatNumber(well.oilBbl)} bbl
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatNumber(well.gasMcf)} mcf
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('common.noData')}
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="error" />
              {t('production.dashboard.wellsWithDowntime')}
            </Typography>
            {dashboard?.wellsWithDowntime?.length > 0 ? (
              <Box>
                {dashboard.wellsWithDowntime.map((well, index) => (
                  <Box
                    key={well.wellId}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index < dashboard.wellsWithDowntime.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {well.wellCode}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {well.reason || t('production.noReason')}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${formatNumber(well.downtimeHours, 1)} hrs`}
                      color="error"
                      size="small"
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('production.noDowntime')}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('production.quickActions')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/production/fields')}
              sx={{ py: 2 }}
            >
              {t('production.viewFields')}
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/production/wells')}
              sx={{ py: 2 }}
            >
              {t('production.viewWells')}
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/production/daily')}
              sx={{ py: 2 }}
            >
              {t('production.dailyProduction')}
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/production/morning-reports')}
              sx={{ py: 2 }}
            >
              {t('production.morningReports')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProductionDashboard;
