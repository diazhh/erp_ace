import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CardActions,
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
  Build as MaintenanceIcon,
  Warning as IncidentIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  Add as AddIcon,
  PlaylistAdd as AddProductionIcon,
  Folder as FolderIcon,
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
  AreaChart,
  Area,
} from 'recharts';
import api from '../../services/api';

const WellDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Permisos
  const canCreateProduction = usePermission('production:create');
  const canCreateProject = usePermission('projects:create');
  const canReadProjects = usePermission('projects:read');
  const canCreatePurchaseOrder = usePermission('procurement:create');
  const canReadPurchaseOrders = usePermission('procurement:read');

  const [well, setWell] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [productionData, setProductionData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingPurchaseOrders, setLoadingPurchaseOrders] = useState(false);
  const [productionDialog, setProductionDialog] = useState(false);
  const [productionForm, setProductionForm] = useState({
    production_date: new Date().toISOString().split('T')[0],
    oil_volume_bbl: '',
    gas_volume_mcf: '',
    water_volume_bbl: '',
    hours_on: '24',
    choke_size: '',
    tubing_pressure_psi: '',
    casing_pressure_psi: '',
    notes: '',
  });
  const [savingProduction, setSavingProduction] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadWellDetail();
    loadLogs();
    if (canReadProjects) {
      loadProjects();
    }
    if (canReadPurchaseOrders) {
      loadPurchaseOrders();
    }
  }, [id, canReadProjects, canReadPurchaseOrders]);

  useEffect(() => {
    if (well) {
      loadProductionData();
    }
  }, [well, dateRange]);

  const loadWellDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/production/wells/${id}/detail`);
      setWell(response.data);
    } catch (error) {
      console.error('Error loading well:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductionData = async () => {
    try {
      const response = await api.get(`/production/wells/${id}/production-chart`, {
        params: dateRange,
      });
      setProductionData(response.data);
    } catch (error) {
      console.error('Error loading production data:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const response = await api.get('/production/logs', {
        params: { wellId: id, limit: 20 },
      });
      setLogs(response.data.data || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await api.get('/projects', {
        params: { wellId: id, limit: 50 },
      });
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadPurchaseOrders = async () => {
    try {
      setLoadingPurchaseOrders(true);
      const response = await api.get('/procurement/purchase-orders', {
        params: { wellId: id, limit: 50 },
      });
      setPurchaseOrders(response.data.data || []);
    } catch (error) {
      console.error('Error loading purchase orders:', error);
    } finally {
      setLoadingPurchaseOrders(false);
    }
  };

  const getPurchaseOrderStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PENDING: 'warning',
      APPROVED: 'info',
      SENT: 'primary',
      PARTIAL: 'secondary',
      COMPLETED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  const handleProductionFormChange = (e) => {
    const { name, value } = e.target;
    setProductionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProduction = async () => {
    try {
      setSavingProduction(true);
      await api.post('/production/daily', {
        well_id: id,
        ...productionForm,
      });
      setSnackbar({ open: true, message: t('production.productionSaved'), severity: 'success' });
      setProductionDialog(false);
      setProductionForm({
        production_date: new Date().toISOString().split('T')[0],
        oil_volume_bbl: '',
        gas_volume_mcf: '',
        water_volume_bbl: '',
        hours_on: '24',
        choke_size: '',
        tubing_pressure_psi: '',
        casing_pressure_psi: '',
        notes: '',
      });
      loadWellDetail();
      loadProductionData();
    } catch (error) {
      console.error('Error saving production:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || t('common.error'), 
        severity: 'error' 
      });
    } finally {
      setSavingProduction(false);
    }
  };

  const getProjectStatusColor = (status) => {
    const colors = {
      PLANNING: 'default',
      IN_PROGRESS: 'primary',
      ON_HOLD: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
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
      SHUT_IN: 'warning',
      DRILLING: 'info',
      COMPLETING: 'info',
      WORKOVER: 'secondary',
    };
    return colors[status] || 'default';
  };

  const getLogTypeIcon = (type) => {
    switch (type) {
      case 'MAINTENANCE': return <MaintenanceIcon color="primary" />;
      case 'WORKOVER': return <MaintenanceIcon color="secondary" />;
      case 'INCIDENT': return <IncidentIcon color="error" />;
      case 'INSPECTION': return <LogIcon color="info" />;
      default: return <LogIcon />;
    }
  };

  const getLogStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CompletedIcon color="success" fontSize="small" />;
      case 'IN_PROGRESS': return <PendingIcon color="warning" fontSize="small" />;
      default: return <PendingIcon color="default" fontSize="small" />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: 'default',
      MEDIUM: 'info',
      HIGH: 'warning',
      CRITICAL: 'error',
    };
    return colors[priority] || 'default';
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

  if (!well) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{t('production.wellNotFound')}</Typography>
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
          <IconButton onClick={() => navigate('/production/wells')}>
            <BackIcon />
          </IconButton>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <WellIcon color="primary" />
              <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
                {well.code}
              </Typography>
              <Chip label={t(`production.wellStatus.${well.status}`)} color={getStatusColor(well.status)} size="small" />
              <Chip label={t(`production.wellType.${well.type}`)} variant="outlined" size="small" />
            </Box>
            <Typography variant="h6" color="text.secondary">
              {well.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('production.field')}: <strong>{well.field?.name}</strong> ({well.field?.code})
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadWellDetail} fullWidth={isMobile}>
            {t('common.refresh')}
          </Button>
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/production/wells/${id}/edit`)} fullWidth={isMobile}>
            {t('common.edit')}
          </Button>
        </Box>
      </Box>

      {/* KPIs Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h5" color="success.main">{formatNumber(well.stats?.avgOilBopd, 0)}</Typography>
              <Typography variant="caption">{t('production.avgOilBopd')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h5" color="warning.main">{formatNumber(well.stats?.avgGasMcfd, 0)}</Typography>
              <Typography variant="caption">{t('production.avgGasMcfd')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h5" color="info.main">{formatNumber(well.stats?.last30Days?.totalOil, 0)}</Typography>
              <Typography variant="caption">{t('production.totalOil30Days')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h5">{well.stats?.logsCount || 0}</Typography>
              <Typography variant="caption">{t('production.logs')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h5">{well.stats?.projectsCount || 0}</Typography>
              <Typography variant="caption">{t('production.projects')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h5">{well.stats?.purchaseOrdersCount || 0}</Typography>
              <Typography variant="caption">{t('production.purchaseOrders')}</Typography>
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
                <LogIcon fontSize="small" /> {t('production.logsTab')}
              </Box>
            </MenuItem>
            <MenuItem value={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ProjectIcon fontSize="small" /> {t('production.projectsTab')}
              </Box>
            </MenuItem>
            <MenuItem value={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PurchaseIcon fontSize="small" /> {t('production.purchaseOrdersTab')}
              </Box>
            </MenuItem>
            <MenuItem value={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WellIcon fontSize="small" /> {t('production.technicalTab')}
              </Box>
            </MenuItem>
            <MenuItem value={5}>
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
            <Tab icon={<LogIcon />} label={t('production.logsTab')} iconPosition="start" />
            <Tab icon={<ProjectIcon />} label={t('production.projectsTab')} iconPosition="start" />
            <Tab icon={<PurchaseIcon />} label={t('production.purchaseOrdersTab')} iconPosition="start" />
            <Tab icon={<WellIcon />} label={t('production.technicalTab')} iconPosition="start" />
            <Tab icon={<FieldIcon />} label={t('production.infoTab')} iconPosition="start" />
          </Tabs>
        </Paper>
      )}

      {/* Tab: Producción */}
      <TabPanel value={tabValue} index={0}>
        {/* Botón para agregar producción */}
        {canCreateProduction && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddProductionIcon />}
              onClick={() => setProductionDialog(true)}
            >
              {t('production.addProduction')}
            </Button>
          </Box>
        )}

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
              <AreaChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <ChartTooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="oilBbl" name={t('production.oilBbl')} fill="#4caf50" stroke="#4caf50" fillOpacity={0.3} />
                <Area yAxisId="left" type="monotone" dataKey="waterBbl" name={t('production.waterBbl')} fill="#2196f3" stroke="#2196f3" fillOpacity={0.3} />
                <Line yAxisId="right" type="monotone" dataKey="gasMcf" name={t('production.gasMcf')} stroke="#ff9800" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Tabla de producción reciente */}
        {well.recentProduction?.length > 0 && (
          <Paper>
            <Typography variant="h6" sx={{ p: 2 }}>{t('production.recentProduction')}</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('common.date')}</TableCell>
                    <TableCell align="right">{t('production.oilBbl')}</TableCell>
                    <TableCell align="right">{t('production.gasMcf')}</TableCell>
                    <TableCell align="right">{t('production.waterBbl')}</TableCell>
                    <TableCell align="right">{t('production.hoursOn')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {well.recentProduction.slice(0, 10).map((prod, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{prod.production_date}</TableCell>
                      <TableCell align="right">{formatNumber(prod.oil_volume_bbl, 1)}</TableCell>
                      <TableCell align="right">{formatNumber(prod.gas_volume_mcf, 1)}</TableCell>
                      <TableCell align="right">{formatNumber(prod.water_volume_bbl, 1)}</TableCell>
                      <TableCell align="right">{formatNumber(prod.hours_on, 1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </TabPanel>

      {/* Tab: Bitácoras */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" startIcon={<LogIcon />} onClick={() => navigate(`/production/logs/new?wellId=${id}`)}>
            {t('production.newLog')}
          </Button>
        </Box>
        <Paper>
          {logs.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('production.noLogs')}</Typography>
            </Box>
          ) : (
            <List>
              {logs.map((log) => (
                <ListItem
                  key={log.id}
                  divider
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={t(`production.logPriority.${log.priority}`)} color={getPriorityColor(log.priority)} size="small" />
                      {getLogStatusIcon(log.status)}
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {getLogTypeIcon(log.log_type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">{log.title}</Typography>
                        <Chip label={t(`production.logType.${log.log_type}`)} size="small" variant="outlined" />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" display="block">{log.log_date}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {log.description?.substring(0, 100)}{log.description?.length > 100 ? '...' : ''}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </TabPanel>

      {/* Tab: Proyectos */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6">{t('production.wellProjects')}</Typography>
          {canCreateProject && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/projects/new?wellId=${id}&fieldId=${well.field_id}`)}
            >
              {t('production.newProject')}
            </Button>
          )}
        </Box>

        {loadingProjects ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary">{t('production.noProjects')}</Typography>
            {canCreateProject && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                onClick={() => navigate(`/projects/new?wellId=${id}&fieldId=${well.field_id}`)}
              >
                {t('production.createFirstProject')}
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {project.code}
                      </Typography>
                      <Chip
                        label={t(`projects.status.${project.status}`)}
                        color={getProjectStatusColor(project.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {project.description?.substring(0, 80)}{project.description?.length > 80 ? '...' : ''}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {project.start_date && (
                        <Chip
                          label={`${t('common.start')}: ${project.start_date}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {project.end_date && (
                        <Chip
                          label={`${t('common.end')}: ${project.end_date}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/projects/${project.id}`)}>
                      {t('common.view')}
                    </Button>
                    <Button size="small" onClick={() => navigate(`/projects/${project.id}/edit`)}>
                      {t('common.edit')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Tab: Órdenes de Compra */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6">{t('production.wellPurchaseOrders')}</Typography>
          {canCreatePurchaseOrder && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/procurement/purchase-orders/new?wellId=${id}&fieldId=${well.field_id}`)}
            >
              {t('production.newPurchaseOrder')}
            </Button>
          )}
        </Box>

        {loadingPurchaseOrders ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : purchaseOrders.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <PurchaseIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary">{t('production.noPurchaseOrders')}</Typography>
            {canCreatePurchaseOrder && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                onClick={() => navigate(`/procurement/purchase-orders/new?wellId=${id}&fieldId=${well.field_id}`)}
              >
                {t('production.createFirstPurchaseOrder')}
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {purchaseOrders.map((po) => (
              <Grid item xs={12} sm={6} md={4} key={po.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {po.code}
                      </Typography>
                      <Chip
                        label={t(`procurement.status.${po.status}`)}
                        color={getPurchaseOrderStatusColor(po.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {po.title || po.description?.substring(0, 50)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {po.supplier?.name || po.contractor?.companyName || '-'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      <Chip
                        label={`$${formatNumber(po.total || po.totalAmount || 0, 2)}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {po.createdAt && (
                        <Chip
                          label={new Date(po.createdAt).toLocaleDateString()}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/procurement/purchase-orders/${po.id}`)}>
                      {t('common.view')}
                    </Button>
                    <Button size="small" onClick={() => navigate(`/procurement/purchase-orders/${po.id}/edit`)}>
                      {t('common.edit')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Tab: Información Técnica */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{t('production.wellInfo')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.totalDepth')}</Typography>
                  <Typography variant="body1">{well.total_depth_ft ? `${formatNumber(well.total_depth_ft, 0)} ft` : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.currentDepth')}</Typography>
                  <Typography variant="body1">{well.current_depth_ft ? `${formatNumber(well.current_depth_ft, 0)} ft` : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.perforationTop')}</Typography>
                  <Typography variant="body1">{well.perforation_top_ft ? `${formatNumber(well.perforation_top_ft, 0)} ft` : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.perforationBottom')}</Typography>
                  <Typography variant="body1">{well.perforation_bottom_ft ? `${formatNumber(well.perforation_bottom_ft, 0)} ft` : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.formation')}</Typography>
                  <Typography variant="body1">{well.formation || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.apiGravity')}</Typography>
                  <Typography variant="body1">{well.api_gravity ? `${formatNumber(well.api_gravity, 1)}°` : '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{t('production.liftSystem')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.artificialLift')}</Typography>
                  <Typography variant="body1">
                    <Chip label={t(`production.liftMethod.${well.artificial_lift || 'NONE'}`)} color="primary" size="small" />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.pumpModel')}</Typography>
                  <Typography variant="body1">{well.pump_model || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.pumpDepth')}</Typography>
                  <Typography variant="body1">{well.pump_depth_ft ? `${formatNumber(well.pump_depth_ft, 0)} ft` : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.motorHp')}</Typography>
                  <Typography variant="body1">{well.motor_hp ? `${formatNumber(well.motor_hp, 0)} HP` : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.casingSize')}</Typography>
                  <Typography variant="body1">{well.casing_size || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.tubingSize')}</Typography>
                  <Typography variant="body1">{well.tubing_size || '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{t('production.dates')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.spudDate')}</Typography>
                  <Typography variant="body1">{well.spud_date || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.completionDate')}</Typography>
                  <Typography variant="body1">{well.completion_date || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.firstProductionDate')}</Typography>
                  <Typography variant="body1">{well.first_production_date || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.lastWorkoverDate')}</Typography>
                  <Typography variant="body1">{well.last_workover_date || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.lastMaintenanceDate')}</Typography>
                  <Typography variant="body1">{well.last_maintenance_date || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.nextMaintenanceDate')}</Typography>
                  <Typography variant="body1">{well.next_maintenance_date || '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{t('production.location')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.latitude')}</Typography>
                  <Typography variant="body1">{well.latitude ? formatNumber(well.latitude, 6) : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.longitude')}</Typography>
                  <Typography variant="body1">{well.longitude ? formatNumber(well.longitude, 6) : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.elevation')}</Typography>
                  <Typography variant="body1">{well.elevation_ft ? `${formatNumber(well.elevation_ft, 0)} ft` : '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab: Información General */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{t('production.basicInfo')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.wellCode')}</Typography>
                  <Typography variant="body1">{well.code}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.wellName')}</Typography>
                  <Typography variant="body1">{well.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.wellType.label')}</Typography>
                  <Typography variant="body1">{t(`production.wellType.${well.type}`)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('common.status')}</Typography>
                  <Typography variant="body1">{t(`production.wellStatus.${well.status}`)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.classification.label')}</Typography>
                  <Typography variant="body1">{t(`production.classification.${well.classification}`)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">{t('production.field')}</Typography>
                  <Typography variant="body1">{well.field?.name} ({well.field?.code})</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Proyectos relacionados */}
          {well.projects?.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>{t('production.relatedProjects')}</Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  {well.projects.map((project) => (
                    <ListItem key={project.id} button onClick={() => navigate(`/projects/${project.id}`)}>
                      <ListItemIcon><ProjectIcon /></ListItemIcon>
                      <ListItemText
                        primary={`${project.code} - ${project.name}`}
                        secondary={t(`projects.status.${project.status}`)}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {/* Órdenes de compra relacionadas */}
          {well.purchaseOrders?.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>{t('production.relatedPurchaseOrders')}</Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  {well.purchaseOrders.map((po) => (
                    <ListItem key={po.id} button onClick={() => navigate(`/procurement/purchase-orders/${po.id}`)}>
                      <ListItemIcon><PurchaseIcon /></ListItemIcon>
                      <ListItemText
                        primary={po.po_number}
                        secondary={`$${formatNumber(po.total_amount, 2)} - ${t(`procurement.status.${po.status}`)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {well.notes && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>{t('common.notes')}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">{well.notes}</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Diálogo para agregar producción */}
      <Dialog
        open={productionDialog}
        onClose={() => setProductionDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>{t('production.addProduction')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label={t('production.productionDate')}
                name="production_date"
                value={productionForm.production_date}
                onChange={handleProductionFormChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('production.oilBbl')}
                name="oil_volume_bbl"
                value={productionForm.oil_volume_bbl}
                onChange={handleProductionFormChange}
                inputProps={{ min: 0, step: 0.1 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('production.gasMcf')}
                name="gas_volume_mcf"
                value={productionForm.gas_volume_mcf}
                onChange={handleProductionFormChange}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('production.waterBbl')}
                name="water_volume_bbl"
                value={productionForm.water_volume_bbl}
                onChange={handleProductionFormChange}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('production.hoursOn')}
                name="hours_on"
                value={productionForm.hours_on}
                onChange={handleProductionFormChange}
                inputProps={{ min: 0, max: 24, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('production.chokeSize')}
                name="choke_size"
                value={productionForm.choke_size}
                onChange={handleProductionFormChange}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('production.tubingPressure')}
                name="tubing_pressure_psi"
                value={productionForm.tubing_pressure_psi}
                onChange={handleProductionFormChange}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('production.casingPressure')}
                name="casing_pressure_psi"
                value={productionForm.casing_pressure_psi}
                onChange={handleProductionFormChange}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('common.notes')}
                name="notes"
                value={productionForm.notes}
                onChange={handleProductionFormChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductionDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveProduction}
            disabled={savingProduction || !productionForm.oil_volume_bbl}
          >
            {savingProduction ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WellDetail;
