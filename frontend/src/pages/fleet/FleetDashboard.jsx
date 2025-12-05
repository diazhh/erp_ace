import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Skeleton,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Warning as WarningIcon,
  Build as MaintenanceIcon,
  LocalGasStation as FuelIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { fetchVehicles, fetchMaintenances } from '../../store/slices/fleetSlice';

// Colores
const STATUS_COLORS = {
  AVAILABLE: '#4caf50',
  ASSIGNED: '#2196f3',
  IN_MAINTENANCE: '#ff9800',
  OUT_OF_SERVICE: '#f44336',
  SOLD: '#9e9e9e',
};

const TYPE_COLORS = {
  SEDAN: '#2196f3',
  SUV: '#4caf50',
  PICKUP: '#ff9800',
  VAN: '#9c27b0',
  TRUCK: '#f44336',
  MOTORCYCLE: '#00bcd4',
  HEAVY_EQUIPMENT: '#795548',
  OTHER: '#607d8b',
};

// Componente de tarjeta de estadística
const StatCard = ({ title, value, subtitle, icon, color, loading, onClick }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" height={40} />
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                color="text.secondary" 
                variant="body2" 
                gutterBottom
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {title}
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight="bold"
                color={color ? `${color}.main` : 'text.primary'}
                sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem' } }}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                bgcolor: `${color || 'primary'}.light`,
                borderRadius: 2,
                p: { xs: 1, sm: 1.5 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const FleetDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { vehicles, maintenances, loading } = useSelector((state) => state.fleet);

  useEffect(() => {
    dispatch(fetchVehicles({ limit: 100 }));
    dispatch(fetchMaintenances({ limit: 50 }));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchVehicles({ limit: 100 }));
    dispatch(fetchMaintenances({ limit: 50 }));
  };

  // Calcular estadísticas
  const vehicleList = vehicles?.data || vehicles || [];
  const maintenanceList = maintenances?.data || maintenances || [];
  const totalVehicles = vehicleList.length;
  const availableVehicles = vehicleList.filter(v => v.status === 'AVAILABLE').length;
  const assignedVehicles = vehicleList.filter(v => v.status === 'ASSIGNED').length;
  const inMaintenance = vehicleList.filter(v => v.status === 'IN_MAINTENANCE').length;

  // Vehículos con documentos por vencer (próximos 30 días)
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringDocs = vehicleList.filter(v => {
    const insurance = v.insuranceExpiry ? new Date(v.insuranceExpiry) : null;
    const techReview = v.technicalReviewExpiry ? new Date(v.technicalReviewExpiry) : null;
    const registration = v.registrationExpiry ? new Date(v.registrationExpiry) : null;
    
    return (insurance && insurance >= today && insurance <= thirtyDaysFromNow) ||
           (techReview && techReview >= today && techReview <= thirtyDaysFromNow) ||
           (registration && registration >= today && registration <= thirtyDaysFromNow);
  }).length;

  // Vehículos por estado
  const vehiclesByStatus = vehicleList.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(vehiclesByStatus).map(([status, count]) => ({
    name: t(`fleet.status${status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, '')}`),
    value: count,
    color: STATUS_COLORS[status] || '#999',
  }));

  // Vehículos por tipo
  const vehiclesByType = vehicleList.reduce((acc, vehicle) => {
    acc[vehicle.vehicleType] = (acc[vehicle.vehicleType] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.entries(vehiclesByType).map(([type, count]) => ({
    name: t(`fleet.type${type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, '')}`),
    value: count,
    color: TYPE_COLORS[type] || '#999',
  }));

  // Mantenimientos pendientes
  const pendingMaintenances = maintenanceList
    .filter(m => m.status === 'SCHEDULED')
    .slice(0, 5);

  // KPIs
  const kpiCards = [
    {
      title: t('fleet.totalVehicles'),
      value: totalVehicles.toString(),
      subtitle: t('fleet.vehicles'),
      icon: <CarIcon sx={{ color: 'primary.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'primary',
      onClick: () => navigate('/fleet/vehicles'),
    },
    {
      title: t('fleet.available'),
      value: (availableVehicles + assignedVehicles).toString(),
      subtitle: `${availableVehicles} ${t('fleet.statusAvailable').toLowerCase()}`,
      icon: <CheckCircleIcon sx={{ color: 'success.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'success',
    },
    {
      title: t('fleet.inMaintenance'),
      value: inMaintenance.toString(),
      subtitle: t('fleet.maintenances'),
      icon: <MaintenanceIcon sx={{ color: inMaintenance > 0 ? 'warning.main' : 'success.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: inMaintenance > 0 ? 'warning' : 'success',
      onClick: () => navigate('/fleet/maintenances'),
    },
    {
      title: t('fleet.expiringDocs'),
      value: expiringDocs.toString(),
      subtitle: expiringDocs > 0 ? t('dashboard.alerts') : t('common.status'),
      icon: <WarningIcon sx={{ color: expiringDocs > 0 ? 'error.main' : 'success.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: expiringDocs > 0 ? 'error' : 'success',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3,
        gap: 2,
      }}>
        <Box>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
            {t('fleet.dashboard')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('fleet.dashboardSubtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title={t('dashboard.refresh')}>
            <span>
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/fleet/vehicles/new')}
            size={isMobile ? 'small' : 'medium'}
          >
            {isMobile ? t('common.create') : t('fleet.newVehicle')}
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
        {kpiCards.map((card, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Vehículos por Estado */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              {t('fleet.vehiclesByStatus')}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="85%" />
            ) : statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 50}
                    outerRadius={isMobile ? 70 : 80}
                    paddingAngle={2}
                    dataKey="value"
                    label={!isMobile}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Vehículos por Tipo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              {t('fleet.vehiclesByType')}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="85%" />
            ) : typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={typeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="value" name={t('fleet.vehicles')}>
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Mantenimientos Programados */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('fleet.scheduledMaintenances')}
              </Typography>
              <IconButton size="small" onClick={() => navigate('/fleet/maintenances')}>
                <ArrowForwardIcon />
              </IconButton>
            </Box>
            {loading ? (
              <>
                <Skeleton variant="text" height={60} />
                <Skeleton variant="text" height={60} />
              </>
            ) : pendingMaintenances.length > 0 ? (
              <List disablePadding>
                {pendingMaintenances.map((maintenance, index) => (
                  <Box key={maintenance.id}>
                    <ListItem 
                      sx={{ px: 0, cursor: 'pointer' }}
                      onClick={() => navigate(`/fleet/maintenances/${maintenance.id}`)}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <MaintenanceIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {maintenance.vehicle?.plate || maintenance.vehicleId}
                            </Typography>
                            <Chip 
                              label={t(`fleet.maintenance${maintenance.maintenanceType?.charAt(0) + maintenance.maintenanceType?.slice(1).toLowerCase().replace(/_/g, '')}`)}
                              size="small"
                              color="info"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {maintenance.description}
                            </Typography>
                            {maintenance.scheduledDate && (
                              <Typography variant="caption" color="text.secondary">
                                <ScheduleIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                                {new Date(maintenance.scheduledDate).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < pendingMaintenances.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography color="text.secondary">
                  {t('fleet.noScheduledMaintenances')}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FleetDashboard;
