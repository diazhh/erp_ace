import { useEffect, useState } from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as ProjectsIcon,
  AccountBalance as FinanceIcon,
  Inventory as InventoryIcon,
  DirectionsCar as FleetIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  AttachMoney as MoneyIcon,
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
  LineChart,
  Line,
} from 'recharts';
import {
  fetchDashboardStats,
  fetchCashFlow,
  fetchProjectsByStatus,
  fetchEmployeesByDepartment,
} from '../store/slices/dashboardSlice';

// Colores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const STATUS_COLORS = {
  PLANNING: '#2196f3',
  IN_PROGRESS: '#4caf50',
  ON_HOLD: '#ff9800',
  COMPLETED: '#9c27b0',
  CANCELLED: '#f44336',
};

// Componente de tarjeta de estadística
const StatCard = ({ title, value, subtitle, icon, color, trend, loading, onClick }) => {
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
                sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
              {trend !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  {trend >= 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                  )}
                  <Typography 
                    variant="caption" 
                    color={trend >= 0 ? 'success.main' : 'error.main'}
                  >
                    {trend >= 0 ? '+' : ''}{trend}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                bgcolor: `${color}.light`,
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

// Componente de alerta
const AlertItem = ({ alert, onClick }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'error': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      default: return <InfoIcon color="info" />;
    }
  };

  const getColor = () => {
    switch (alert.type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  return (
    <ListItem 
      sx={{ 
        px: 0, 
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
        borderRadius: 1,
      }}
      onClick={onClick}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        {getIcon()}
      </ListItemIcon>
      <ListItemText 
        primary={alert.message}
        primaryTypographyProps={{ variant: 'body2' }}
      />
      <Chip 
        label={alert.count} 
        size="small" 
        color={getColor()}
        sx={{ minWidth: 32 }}
      />
    </ListItem>
  );
};

// Formateador de moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useSelector((state) => state.auth);
  const { stats, cashFlow, loading, error } = useSelector((state) => state.dashboard);
  
  const [selectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchCashFlow(selectedYear));
    dispatch(fetchProjectsByStatus());
    dispatch(fetchEmployeesByDepartment());
  }, [dispatch, selectedYear]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
    dispatch(fetchCashFlow(selectedYear));
  };

  // Datos para las tarjetas de KPIs
  const kpiCards = [
    {
      title: t('dashboard.activeEmployees'),
      value: stats?.employees?.active?.toString() || '0',
      subtitle: `${stats?.employees?.total || 0} ${t('common.total')}`,
      icon: <PeopleIcon sx={{ color: 'primary.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'primary',
      onClick: () => navigate('/employees'),
    },
    {
      title: t('dashboard.activeProjects'),
      value: stats?.projects?.active?.toString() || '0',
      subtitle: stats?.projects?.delayed > 0 
        ? `${stats.projects.delayed} ${t('projects.delayed')}`
        : `${stats?.projects?.completed || 0} ${t('projects.statusCompleted').toLowerCase()}`,
      icon: <ProjectsIcon sx={{ color: 'success.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'success',
      onClick: () => navigate('/projects'),
    },
    {
      title: t('dashboard.generalBalance'),
      value: formatCurrency(stats?.finance?.monthlyNet || 0),
      subtitle: `${t('finance.income')}: ${formatCurrency(stats?.finance?.monthlyIncome || 0)}`,
      icon: <FinanceIcon sx={{ color: stats?.finance?.monthlyNet >= 0 ? 'success.main' : 'error.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: stats?.finance?.monthlyNet >= 0 ? 'success' : 'error',
      onClick: () => navigate('/finance/transactions'),
    },
    {
      title: t('dashboard.inventoryItems'),
      value: stats?.inventory?.totalItems?.toString() || '0',
      subtitle: stats?.inventory?.lowStock > 0 
        ? `${stats.inventory.lowStock} ${t('inventory.lowStock').toLowerCase()}`
        : t('inventory.statusActive'),
      icon: <InventoryIcon sx={{ color: 'info.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'info',
      onClick: () => navigate('/inventory'),
    },
    {
      title: t('dashboard.vehicles'),
      value: stats?.fleet?.activeVehicles?.toString() || '0',
      subtitle: stats?.fleet?.inMaintenance > 0 
        ? `${stats.fleet.inMaintenance} en mantenimiento`
        : `${stats?.fleet?.totalVehicles || 0} ${t('common.total')}`,
      icon: <FleetIcon sx={{ color: 'secondary.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'secondary',
      onClick: () => navigate('/fleet'),
    },
    {
      title: t('finance.pendingReconciliation'),
      value: stats?.finance?.pendingReconciliation?.toString() || '0',
      subtitle: t('finance.transactions'),
      icon: <MoneyIcon sx={{ color: 'warning.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'warning',
      onClick: () => navigate('/finance/transactions'),
    },
  ];

  // Datos para el gráfico de proyectos por estado
  const projectStatusData = stats?.projects?.byStatus?.map(item => ({
    name: t(`projects.status${item.status.charAt(0) + item.status.slice(1).toLowerCase().replace(/_/g, '')}`),
    value: item.count,
    color: STATUS_COLORS[item.status] || '#999',
  })) || [];

  // Datos para el gráfico de gastos por categoría
  const expensesByCategoryData = stats?.finance?.expensesByCategory?.map((item, index) => ({
    name: t(`finance.category${item.category?.charAt(0) + item.category?.slice(1).toLowerCase().replace(/_/g, '')}`) || item.category,
    value: item.total,
    color: COLORS[index % COLORS.length],
  })) || [];

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
            {t('dashboard.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('dashboard.welcome')}, {user?.firstName} {user?.lastName}
          </Typography>
        </Box>
        <Tooltip title="Actualizar datos">
          <IconButton onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {kpiCards.map((card, index) => (
          <Grid item xs={6} sm={6} md={4} lg={2} key={index}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Flujo de Caja */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: 300, sm: 350 } }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.cashFlow')} {selectedYear}
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </Box>
            ) : cashFlow.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={cashFlow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="monthName" 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelStyle={{ color: theme.palette.text.primary }}
                  />
                  <Legend />
                  <Bar dataKey="income" name={t('finance.income')} fill="#4caf50" />
                  <Bar dataKey="expense" name={t('finance.expense')} fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Alertas */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: 'auto', sm: 350 }, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('dashboard.alerts')}
              </Typography>
              {stats?.alerts?.length > 0 && (
                <Chip 
                  label={stats.alerts.length} 
                  size="small" 
                  color="warning"
                />
              )}
            </Box>
            {loading ? (
              <>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </>
            ) : stats?.alerts?.length > 0 ? (
              <List dense disablePadding>
                {stats.alerts.map((alert, index) => (
                  <Box key={index}>
                    <AlertItem 
                      alert={alert} 
                      onClick={() => {
                        const routes = {
                          employees: '/employees',
                          fleet: '/fleet',
                          payroll: '/payroll/loans',
                          projects: '/projects',
                          inventory: '/inventory',
                          pettyCash: '/petty-cash',
                        };
                        navigate(routes[alert.module] || '/');
                      }}
                    />
                    {index < stats.alerts.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '70%',
                flexDirection: 'column',
                gap: 1,
              }}>
                <InfoIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                <Typography color="text.secondary">
                  {t('dashboard.noPendingAlerts')}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Proyectos por Estado */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: 350 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('dashboard.projectsByStatus')}
              </Typography>
              <IconButton size="small" onClick={() => navigate('/projects')}>
                <ArrowForwardIcon />
              </IconButton>
            </Box>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="80%" />
            ) : projectStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 60}
                    outerRadius={isMobile ? 70 : 90}
                    paddingAngle={2}
                    dataKey="value"
                    label={!isMobile}
                  >
                    {projectStatusData.map((entry, index) => (
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

        {/* Gastos por Categoría */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: 350 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('dashboard.expensesByCategory')}
              </Typography>
              <IconButton size="small" onClick={() => navigate('/finance/transactions')}>
                <ArrowForwardIcon />
              </IconButton>
            </Box>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="80%" />
            ) : expensesByCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart 
                  data={expensesByCategoryData} 
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="value" name={t('finance.amount')}>
                    {expensesByCategoryData.map((entry, index) => (
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

        {/* Resumen de Saldos por Moneda */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.accountBalances')}
            </Typography>
            {loading ? (
              <>
                <Skeleton variant="text" height={60} />
                <Skeleton variant="text" height={60} />
              </>
            ) : stats?.finance?.accountBalances?.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {stats.finance.accountBalances.map((balance, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {balance.currency}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {new Intl.NumberFormat('es-VE', {
                          style: 'currency',
                          currency: balance.currency,
                        }).format(balance.total)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((balance.total / (stats.finance.accountBalances.reduce((acc, b) => acc + b.total, 0) || 1)) * 100, 100)}
                      sx={{ height: 8, borderRadius: 4 }}
                      color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'info'}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">{t('common.noData')}</Typography>
            )}
          </Paper>
        </Grid>

        {/* Resumen de Presupuesto de Proyectos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.projectBudget')}
            </Typography>
            {loading ? (
              <>
                <Skeleton variant="text" height={60} />
                <Skeleton variant="text" height={60} />
              </>
            ) : stats?.projects?.budget ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('projects.budget')}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(stats.projects.budget.total)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('projects.actualCost')}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color={
                      stats.projects.budget.spent > stats.projects.budget.total ? 'error.main' : 'success.main'
                    }>
                      {formatCurrency(stats.projects.budget.spent)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('projects.budgetUsage')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.projects.budget.total > 0 
                        ? `${((stats.projects.budget.spent / stats.projects.budget.total) * 100).toFixed(1)}%`
                        : '0%'}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((stats.projects.budget.spent / (stats.projects.budget.total || 1)) * 100, 100)}
                    sx={{ height: 10, borderRadius: 5 }}
                    color={
                      (stats.projects.budget.spent / (stats.projects.budget.total || 1)) > 0.9 
                        ? 'error' 
                        : (stats.projects.budget.spent / (stats.projects.budget.total || 1)) > 0.7 
                          ? 'warning' 
                          : 'success'
                    }
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {t('dashboard.remaining')}: {formatCurrency(stats.projects.budget.total - stats.projects.budget.spent)}
                </Typography>
              </Box>
            ) : (
              <Typography color="text.secondary">{t('common.noData')}</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
