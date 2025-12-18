import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Divider,
  TextField,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  OilBarrel as WellIcon,
  Terrain as FieldIcon,
  Timeline as TrendIcon,
  Assignment as ProjectIcon,
  ShoppingCart as PurchaseIcon,
  Description as LogIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import api from '../../services/api';

const FieldDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [productionData, setProductionData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadFieldDetail();
  }, [id]);

  useEffect(() => {
    if (field) {
      loadProductionData();
    }
  }, [field, dateRange]);

  const loadFieldDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/production/fields/${id}/detail`);
      setField(response.data);
    } catch (error) {
      console.error('Error loading field:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductionData = async () => {
    try {
      const response = await api.get(`/production/fields/${id}/production`, {
        params: dateRange,
      });
      setProductionData(response.data);
    } catch (error) {
      console.error('Error loading production data:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = (field) => (e) => {
    setDateRange((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      INACTIVE: 'default',
      ABANDONED: 'error',
      UNDER_DEVELOPMENT: 'warning',
      SHUT_IN: 'warning',
      WORKOVER: 'info',
    };
    return colors[status] || 'default';
  };

  const getLiftColor = (lift) => {
    const colors = {
      NONE: 'default',
      ESP: 'primary',
      ROD_PUMP: 'secondary',
      GAS_LIFT: 'info',
      PCP: 'warning',
    };
    return colors[lift] || 'default';
  };

  const formatNumber = (num, decimals = 0) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!field) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{t('production.fieldNotFound')}</Typography>
      </Box>
    );
  }

  const TabPanel = ({ children, value, index }) => (
    <Box role="tabpanel" hidden={value !== index} sx={{ py: 2 }}>
      {value === index && children}
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', mb: 3, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/production/fields')}>
            <BackIcon />
          </IconButton>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FieldIcon color="primary" />
              <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
                {field.code}
              </Typography>
              <Chip label={t(`production.status.${field.status}`)} color={getStatusColor(field.status)} size="small" />
            </Box>
            <Typography variant="h6" color="text.secondary">
              {field.name}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadFieldDetail} fullWidth={isMobile}>
            {t('common.refresh')}
          </Button>
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/production/fields/${id}/edit`)} fullWidth={isMobile}>
            {t('common.edit')}
          </Button>
        </Box>
      </Box>

      {/* KPIs Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h4" color="primary.main">{field.stats?.wellsTotal || 0}</Typography>
              <Typography variant="caption">{t('production.totalWells')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h4" color="success.main">{field.stats?.wellsActive || 0}</Typography>
              <Typography variant="caption">{t('production.activeWells')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h4" color="warning.main">{field.stats?.wellsShutIn || 0}</Typography>
              <Typography variant="caption">{t('production.shutInWells')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h4" color="info.main">{formatNumber(field.stats?.last30Days?.avgOilBopd, 0)}</Typography>
              <Typography variant="caption">{t('production.avgBopd')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h4">{field.stats?.projectsCount || 0}</Typography>
              <Typography variant="caption">{t('production.projects')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h4">{field.stats?.logsCount || 0}</Typography>
              <Typography variant="caption">{t('production.logs')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs - Select en mobile, Tabs en desktop */}
      {isMobile ? (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('common.section')}</InputLabel>
          <Select
            value={tabValue}
            label={t('common.section')}
            onChange={(e) => setTabValue(e.target.value)}
          >
            <MenuItem value={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendIcon fontSize="small" /> {t('production.productionTab')}
              </Box>
            </MenuItem>
            <MenuItem value={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WellIcon fontSize="small" /> {t('production.wellsTab')}
              </Box>
            </MenuItem>
            <MenuItem value={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FieldIcon fontSize="small" /> {t('production.infoTab')}
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      ) : (
        <Paper sx={{ mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="standard"
          >
            <Tab icon={<TrendIcon />} label={t('production.productionTab')} iconPosition="start" />
            <Tab icon={<WellIcon />} label={t('production.wellsTab')} iconPosition="start" />
            <Tab icon={<FieldIcon />} label={t('production.infoTab')} iconPosition="start" />
          </Tabs>
        </Paper>
      )}

      {/* Tab: Producción */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 2, alignItems: 'center' }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {t('production.productionChart')}
            </Typography>
            <TextField
              type="date"
              label={t('common.startDate')}
              value={dateRange.startDate}
              onChange={handleDateChange('startDate')}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label={t('common.endDate')}
              value={dateRange.endDate}
              onChange={handleDateChange('endDate')}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <ChartTooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="oilBbl" name={t('production.oilBbl')} stroke="#4caf50" strokeWidth={2} dot={false} />
                <Line yAxisId="left" type="monotone" dataKey="waterBbl" name={t('production.waterBbl')} stroke="#2196f3" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="gasMcf" name={t('production.gasMcf')} stroke="#ff9800" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Totales del período */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">{t('production.totalOil30Days')}</Typography>
                <Typography variant="h5" color="success.main">
                  {formatNumber(field.stats?.last30Days?.totalOil, 0)} bbl
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">{t('production.totalGas30Days')}</Typography>
                <Typography variant="h5" color="warning.main">
                  {formatNumber(field.stats?.last30Days?.totalGas, 0)} mcf
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">{t('production.totalWater30Days')}</Typography>
                <Typography variant="h5" color="info.main">
                  {formatNumber(field.stats?.last30Days?.totalWater, 0)} bbl
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab: Pozos */}
      <TabPanel value={tabValue} index={1}>
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('production.wellCode')}</TableCell>
                  <TableCell>{t('production.wellName')}</TableCell>
                  <TableCell>{t('production.wellType.label')}</TableCell>
                  <TableCell>{t('common.status')}</TableCell>
                  <TableCell>{t('production.artificialLift')}</TableCell>
                  <TableCell>{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {field.wells?.map((well) => (
                  <TableRow key={well.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{well.code}</Typography>
                    </TableCell>
                    <TableCell>{well.name}</TableCell>
                    <TableCell>
                      <Chip label={t(`production.wellType.${well.type}`)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={t(`production.wellStatus.${well.status}`)} color={getStatusColor(well.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={t(`production.liftMethod.${well.artificial_lift || 'NONE'}`)} color={getLiftColor(well.artificial_lift)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => navigate(`/production/wells/${well.id}`)}>
                        {t('common.view')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* Tab: Información */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{t('production.basicInfo')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.code')}</Typography>
                  <Typography variant="body1">{field.code}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.name')}</Typography>
                  <Typography variant="body1">{field.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.type.label')}</Typography>
                  <Typography variant="body1">{t(`production.type.${field.type}`)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('common.status')}</Typography>
                  <Typography variant="body1">{t(`production.status.${field.status}`)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.location')}</Typography>
                  <Typography variant="body1">{field.location || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.state')}</Typography>
                  <Typography variant="body1">{field.state || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.country')}</Typography>
                  <Typography variant="body1">{field.country || '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{t('production.technicalInfo')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.basin')}</Typography>
                  <Typography variant="body1">{field.basin || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.formation')}</Typography>
                  <Typography variant="body1">{field.formation || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.areaKm2')}</Typography>
                  <Typography variant="body1">{field.area_km2 ? `${formatNumber(field.area_km2, 2)} km²` : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.apiGravity')}</Typography>
                  <Typography variant="body1">{field.api_gravity_avg ? `${formatNumber(field.api_gravity_avg, 1)}°` : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.discoveryDate')}</Typography>
                  <Typography variant="body1">{field.discovery_date || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.productionStartDate')}</Typography>
                  <Typography variant="body1">{field.production_start_date || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.workingInterest')}</Typography>
                  <Typography variant="body1">{field.working_interest ? `${formatNumber(field.working_interest, 2)}%` : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.fields.estimatedReserves')}</Typography>
                  <Typography variant="body1">{field.estimated_reserves_mmbbl ? `${formatNumber(field.estimated_reserves_mmbbl, 2)} MMbbl` : '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {field.notes && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>{t('common.notes')}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">{field.notes}</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default FieldDetail;
