import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Warehouse as WarehouseIcon,
  Inventory as InventoryIcon,
  SwapHoriz as MovementIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Assignment as ProjectIcon,
} from '@mui/icons-material';

import { fetchWarehouseFull, clearCurrentWarehouse } from '../../store/slices/inventorySlice';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  CLOSED: 'error',
};

const statusLabels = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  CLOSED: 'Cerrado',
};

const warehouseTypeLabels = {
  MAIN: 'Principal',
  SECONDARY: 'Secundario',
  TRANSIT: 'Tránsito',
  PROJECT: 'Proyecto',
};

const warehouseTypeColors = {
  MAIN: 'primary',
  SECONDARY: 'info',
  TRANSIT: 'warning',
  PROJECT: 'secondary',
};

const movementTypeLabels = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
  TRANSFER: 'Transferencia',
  ADJUSTMENT_IN: 'Ajuste (+)',
  ADJUSTMENT_OUT: 'Ajuste (-)',
  RETURN: 'Devolución',
  RESERVATION: 'Reserva',
  RELEASE: 'Liberación',
};

const movementTypeColors = {
  ENTRY: 'success',
  EXIT: 'error',
  TRANSFER: 'info',
  ADJUSTMENT_IN: 'success',
  ADJUSTMENT_OUT: 'warning',
  RETURN: 'secondary',
  RESERVATION: 'default',
  RELEASE: 'default',
};

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const WarehouseDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { currentWarehouse, loading } = useSelector((state) => state.inventory);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchWarehouseFull(id));
    
    return () => {
      dispatch(clearCurrentWarehouse());
    };
  }, [dispatch, id]);

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-VE').format(num || 0);
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-VE');
  };

  if (loading || !currentWarehouse) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { stats, stocks, recentMovements } = currentWarehouse;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/inventory/warehouses')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {currentWarehouse.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentWarehouse.code}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/inventory/warehouses/${id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            startIcon={<MovementIcon />}
            onClick={() => navigate(`/inventory/movements/new?warehouseId=${id}`)}
          >
            Registrar Movimiento
          </Button>
        </Box>
      </Box>

      {/* Info Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Tipo
              </Typography>
              <Chip
                label={warehouseTypeLabels[currentWarehouse.warehouseType]}
                color={warehouseTypeColors[currentWarehouse.warehouseType]}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Estado
              </Typography>
              <Chip
                label={statusLabels[currentWarehouse.status]}
                color={statusColors[currentWarehouse.status]}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Items
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {stats?.totalItems || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Unidades
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="info.main">
                {formatNumber(stats?.totalQuantity)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Valor Total
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {formatCurrency(stats?.totalValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Stock Bajo
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={stats?.lowStockItems > 0 ? 'warning.main' : 'text.primary'}>
                {stats?.lowStockItems || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Details Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {currentWarehouse.location && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ubicación
                  </Typography>
                  <Typography variant="body1">
                    {currentWarehouse.location}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
          {currentWarehouse.address && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">
                Dirección
              </Typography>
              <Typography variant="body1">
                {currentWarehouse.address}
              </Typography>
            </Grid>
          )}
          {currentWarehouse.manager && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Encargado
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ cursor: 'pointer', color: 'primary.main' }}
                    onClick={() => navigate(`/employees/${currentWarehouse.manager.id}`)}
                  >
                    {currentWarehouse.manager.firstName} {currentWarehouse.manager.lastName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
          {currentWarehouse.project && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ProjectIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Proyecto
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ cursor: 'pointer', color: 'primary.main' }}
                    onClick={() => navigate(`/projects/${currentWarehouse.project.id}`)}
                  >
                    {currentWarehouse.project.code} - {currentWarehouse.project.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
          {currentWarehouse.description && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Descripción
              </Typography>
              <Typography variant="body1">
                {currentWarehouse.description}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab label={`Stock (${stocks?.length || 0})`} icon={<InventoryIcon />} iconPosition="start" />
          <Tab label={`Movimientos (${recentMovements?.length || 0})`} icon={<MovementIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab: Stock */}
      <TabPanel value={activeTab} index={0}>
        {stocks && stocks.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Reservado</TableCell>
                  <TableCell align="right">Disponible</TableCell>
                  <TableCell align="right">Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks.map((stock) => (
                  <TableRow 
                    key={stock.id} 
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/inventory/items/${stock.item?.id}`)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {stock.item?.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {stock.item?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {stock.item?.category?.name || '-'}
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">
                        {formatNumber(stock.quantity)} {stock.item?.unit}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="warning.main">
                        {formatNumber(stock.reservedQuantity)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="success.main" fontWeight="bold">
                        {formatNumber(stock.availableQuantity)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(parseFloat(stock.quantity) * parseFloat(stock.item?.unitCost || 0))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">
            No hay items en este almacén
          </Alert>
        )}
      </TabPanel>

      {/* Tab: Movimientos */}
      <TabPanel value={activeTab} index={1}>
        {recentMovements && recentMovements.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Usuario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentMovements.map((movement) => {
                  const isIncoming = movement.destinationWarehouseId === currentWarehouse.id;
                  return (
                    <TableRow key={movement.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {movement.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDateTime(movement.movementDate)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={movementTypeLabels[movement.movementType]}
                          color={movementTypeColors[movement.movementType]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2"
                          sx={{ cursor: 'pointer', color: 'primary.main' }}
                          onClick={() => navigate(`/inventory/items/${movement.item?.id}`)}
                        >
                          {movement.item?.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          fontWeight="bold"
                          color={isIncoming ? 'success.main' : 'error.main'}
                        >
                          {isIncoming ? '+' : '-'}{formatNumber(movement.quantity)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isIncoming ? 'Entrada' : 'Salida'}
                          color={isIncoming ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {movement.creator?.username || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">
            No hay movimientos registrados
          </Alert>
        )}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/inventory/movements?warehouseId=${id}`)}
          >
            Ver Todos los Movimientos
          </Button>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default WarehouseDetail;
