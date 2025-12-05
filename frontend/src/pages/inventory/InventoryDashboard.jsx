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
  LinearProgress,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Warehouse as WarehouseIcon,
  SwapHoriz as MovementIcon,
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
} from 'recharts';
import { fetchItems, fetchWarehouses } from '../../store/slices/inventorySlice';

// Colores
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const TYPE_COLORS = {
  PRODUCT: '#2196f3',
  MATERIAL: '#4caf50',
  TOOL: '#ff9800',
  EQUIPMENT: '#9c27b0',
  CONSUMABLE: '#f44336',
  SPARE_PART: '#00bcd4',
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

const InventoryDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { items, warehouses, loading } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(fetchItems({ limit: 100 }));
    dispatch(fetchWarehouses());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchItems({ limit: 100 }));
    dispatch(fetchWarehouses());
  };

  // Calcular estadísticas
  const itemList = items?.data || items || [];
  const warehouseList = warehouses?.data || warehouses || [];
  const totalItems = itemList.length;
  const activeItems = itemList.filter(i => i.status === 'ACTIVE').length;
  const lowStockItems = itemList.filter(i => i.status === 'ACTIVE' && i.totalStock <= i.minStock && i.totalStock > 0).length;
  const outOfStockItems = itemList.filter(i => i.status === 'ACTIVE' && i.totalStock === 0).length;

  // Valor total del inventario
  const totalValue = itemList.reduce((acc, item) => {
    return acc + (parseFloat(item.totalStock || 0) * parseFloat(item.unitCost || 0));
  }, 0);

  // Items por tipo
  const itemsByType = itemList.reduce((acc, item) => {
    if (item.status === 'ACTIVE') {
      acc[item.itemType] = (acc[item.itemType] || 0) + 1;
    }
    return acc;
  }, {});

  const typeData = Object.entries(itemsByType).map(([type, count]) => ({
    name: t(`inventory.type${type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, '')}`),
    value: count,
    color: TYPE_COLORS[type] || '#999',
  }));

  // Stock por almacén
  const stockByWarehouse = warehouseList.map(warehouse => {
    const warehouseItems = itemList.filter(item => 
      item.warehouseStocks?.some(ws => ws.warehouseId === warehouse.id)
    );
    const totalStock = warehouseItems.reduce((acc, item) => {
      const ws = item.warehouseStocks?.find(ws => ws.warehouseId === warehouse.id);
      return acc + (ws?.quantity || 0);
    }, 0);
    return {
      name: warehouse.name,
      stock: totalStock,
    };
  });

  // Items con stock bajo
  const lowStockList = itemList
    .filter(i => i.status === 'ACTIVE' && i.totalStock <= i.minStock)
    .sort((a, b) => a.totalStock - b.totalStock)
    .slice(0, 5);

  // KPIs
  const kpiCards = [
    {
      title: t('inventory.items'),
      value: activeItems.toString(),
      subtitle: `${totalItems} ${t('common.total')}`,
      icon: <InventoryIcon sx={{ color: 'primary.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'primary',
      onClick: () => navigate('/inventory/items'),
    },
    {
      title: t('inventory.warehouses'),
      value: warehouseList.length.toString(),
      subtitle: t('inventory.statusActive'),
      icon: <WarehouseIcon sx={{ color: 'info.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'info',
      onClick: () => navigate('/inventory/warehouses'),
    },
    {
      title: t('inventory.lowStock'),
      value: lowStockItems.toString(),
      subtitle: lowStockItems > 0 ? t('dashboard.alerts') : t('common.status'),
      icon: <WarningIcon sx={{ color: lowStockItems > 0 ? 'warning.main' : 'success.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: lowStockItems > 0 ? 'warning' : 'success',
    },
    {
      title: t('inventory.totalValue'),
      value: formatCurrency(totalValue),
      subtitle: t('inventory.items'),
      icon: <MoneyIcon sx={{ color: 'success.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'success',
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
            {t('inventory.dashboard')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('inventory.dashboardSubtitle')}
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
            onClick={() => navigate('/inventory/items/new')}
            size={isMobile ? 'small' : 'medium'}
          >
            {isMobile ? t('common.create') : t('inventory.newItem')}
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
        {/* Items por Tipo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              {t('inventory.itemsByType')}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="85%" />
            ) : typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 50}
                    outerRadius={isMobile ? 70 : 80}
                    paddingAngle={2}
                    dataKey="value"
                    label={!isMobile}
                  >
                    {typeData.map((entry, index) => (
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

        {/* Stock por Almacén */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              {t('inventory.stockByWarehouse')}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="85%" />
            ) : stockByWarehouse.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={stockByWarehouse} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="stock" name={t('inventory.totalStock')} fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Items con Stock Bajo */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('inventory.lowStockItems')}
              </Typography>
              <IconButton size="small" onClick={() => navigate('/inventory/items')}>
                <ArrowForwardIcon />
              </IconButton>
            </Box>
            {loading ? (
              <>
                <Skeleton variant="text" height={60} />
                <Skeleton variant="text" height={60} />
              </>
            ) : lowStockList.length > 0 ? (
              <List disablePadding>
                {lowStockList.map((item, index) => (
                  <Box key={item.id}>
                    <ListItem 
                      sx={{ px: 0, cursor: 'pointer' }}
                      onClick={() => navigate(`/inventory/items/${item.id}`)}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: item.totalStock === 0 ? 'error.main' : 'warning.main' }}>
                          {item.totalStock === 0 ? <WarningIcon /> : <InventoryIcon />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Chip 
                              label={item.totalStock === 0 ? t('inventory.outOfStock') : t('inventory.lowStock')}
                              size="small"
                              color={item.totalStock === 0 ? 'error' : 'warning'}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {t('inventory.code')}: {item.code}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Stock: {item.totalStock} / Min: {item.minStock}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ width: 100 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min((item.totalStock / (item.minStock || 1)) * 100, 100)}
                          color={item.totalStock === 0 ? 'error' : 'warning'}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </ListItem>
                    {index < lowStockList.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography color="text.secondary">
                  {t('inventory.noLowStock')}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryDashboard;
