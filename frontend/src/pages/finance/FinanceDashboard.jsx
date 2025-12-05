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
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Alert,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as TransferIcon,
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
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
  AreaChart,
  Area,
} from 'recharts';
import { fetchAccounts, fetchTransactions, fetchFinanceStats } from '../../store/slices/financeSlice';
import { fetchCashFlow } from '../../store/slices/dashboardSlice';

// Colores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const CATEGORY_COLORS = {
  SALES: '#4caf50',
  SERVICES: '#2196f3',
  PAYROLL: '#f44336',
  SUPPLIES: '#ff9800',
  UTILITIES: '#9c27b0',
  TRANSPORT: '#00bcd4',
  MAINTENANCE: '#795548',
  OTHER: '#607d8b',
};

// Formateador de moneda
const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
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

const FinanceDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { accounts, stats, loading } = useSelector((state) => state.finance);
  const { cashFlow } = useSelector((state) => state.dashboard);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchFinanceStats());
    dispatch(fetchCashFlow(selectedYear));
  }, [dispatch, selectedYear]);

  const handleRefresh = () => {
    dispatch(fetchAccounts());
    dispatch(fetchFinanceStats());
    dispatch(fetchCashFlow(selectedYear));
  };

  // Calcular totales por moneda
  const totalsByAccount = accounts?.reduce((acc, account) => {
    if (account.isActive) {
      acc[account.currency] = (acc[account.currency] || 0) + parseFloat(account.currentBalance || 0);
    }
    return acc;
  }, {}) || {};

  // Datos para gráfico de cuentas por tipo
  const accountsByType = accounts?.reduce((acc, account) => {
    if (account.isActive) {
      const type = account.accountType;
      if (!acc[type]) {
        acc[type] = { type, count: 0, balance: 0 };
      }
      acc[type].count++;
      acc[type].balance += parseFloat(account.currentBalance || 0);
    }
    return acc;
  }, {}) || {};

  const accountTypeData = Object.values(accountsByType).map((item, index) => ({
    name: t(`finance.accountType${item.type.charAt(0) + item.type.slice(1).toLowerCase()}`),
    value: item.balance,
    count: item.count,
    color: COLORS[index % COLORS.length],
  }));

  // Datos para gráfico de gastos por categoría
  const expensesByCategoryData = stats?.expensesByCategory?.map((item, index) => ({
    name: t(`finance.category${item.category?.charAt(0) + item.category?.slice(1).toLowerCase().replace(/_/g, '')}`) || item.category,
    value: parseFloat(item.total) || 0,
    color: CATEGORY_COLORS[item.category] || COLORS[index % COLORS.length],
  })) || [];

  // KPIs
  const kpiCards = [
    {
      title: t('finance.totalIncome'),
      value: formatCurrency(stats?.totalIncome || 0),
      subtitle: t('dashboard.monthlyIncome'),
      icon: <TrendingUpIcon sx={{ color: 'success.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'success',
      onClick: () => navigate('/finance/transactions?type=INCOME'),
    },
    {
      title: t('finance.totalExpense'),
      value: formatCurrency(stats?.totalExpense || 0),
      subtitle: t('dashboard.monthlyExpense'),
      icon: <TrendingDownIcon sx={{ color: 'error.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'error',
      onClick: () => navigate('/finance/transactions?type=EXPENSE'),
    },
    {
      title: t('finance.netBalance'),
      value: formatCurrency(stats?.netBalance || 0),
      subtitle: t('finance.income') + ' - ' + t('finance.expense'),
      icon: <AccountBalanceIcon sx={{ color: (stats?.netBalance || 0) >= 0 ? 'success.main' : 'error.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: (stats?.netBalance || 0) >= 0 ? 'success' : 'error',
    },
    {
      title: t('finance.pendingReconciliation'),
      value: stats?.pendingReconciliation?.toString() || '0',
      subtitle: t('finance.transactions'),
      icon: <ReceiptIcon sx={{ color: 'warning.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'warning',
      onClick: () => navigate('/finance/transactions?isReconciled=false'),
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
            {t('finance.dashboard')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('finance.dashboardSubtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>{t('common.year')}</InputLabel>
            <Select
              value={selectedYear}
              label={t('common.year')}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
            onClick={() => navigate('/finance/transactions/new')}
            size={isMobile ? 'small' : 'medium'}
          >
            {isMobile ? t('common.create') : t('finance.newTransaction')}
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

      {/* Saldos por Moneda */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {t('dashboard.accountBalances')}
          </Typography>
          <IconButton size="small" onClick={() => navigate('/finance/accounts')}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        {loading ? (
          <Skeleton variant="rectangular" height={100} />
        ) : Object.keys(totalsByAccount).length > 0 ? (
          <Grid container spacing={2}>
            {Object.entries(totalsByAccount).map(([currency, total], index) => (
              <Grid item xs={12} sm={6} md={4} key={currency}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('finance.totalIn')} {currency}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color={total >= 0 ? 'success.main' : 'error.main'}>
                      {formatCurrency(total, currency)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {accounts?.filter(a => a.currency === currency && a.isActive).length || 0} {t('finance.bankAccounts').toLowerCase()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">{t('common.noData')}</Typography>
        )}
      </Paper>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Flujo de Caja Mensual */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: 350, sm: 400 } }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.cashFlow')} {selectedYear}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="85%" />
            ) : cashFlow?.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={cashFlow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f44336" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f44336" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
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
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    name={t('finance.income')} 
                    stroke="#4caf50" 
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    name={t('finance.expense')} 
                    stroke="#f44336" 
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Cuentas por Tipo */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: 350, sm: 400 } }}>
            <Typography variant="h6" gutterBottom>
              {t('finance.accountsByType')}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="85%" />
            ) : accountTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={accountTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 50}
                    outerRadius={isMobile ? 70 : 80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {accountTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} />
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
              <IconButton size="small" onClick={() => navigate('/finance/transactions?type=EXPENSE')}>
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

        {/* Balance Neto Mensual */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              {t('finance.netBalanceMonthly')}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="85%" />
            ) : cashFlow?.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={cashFlow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  <Line 
                    type="monotone" 
                    dataKey="net" 
                    name={t('finance.netBalance')} 
                    stroke="#2196f3" 
                    strokeWidth={2}
                    dot={{ fill: '#2196f3' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinanceDashboard;
