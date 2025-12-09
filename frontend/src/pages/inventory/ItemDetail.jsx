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
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  SwapHoriz as MovementIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

import { fetchItemFull, clearCurrentItem } from '../../store/slices/inventorySlice';
import ResponsiveTabs from '../../components/common/ResponsiveTabs';
import AttachmentSection from '../../components/common/AttachmentSection';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  DISCONTINUED: 'error',
};

const statusLabels = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  DISCONTINUED: 'Descontinuado',
};

const itemTypeLabels = {
  PRODUCT: 'Producto',
  MATERIAL: 'Material',
  TOOL: 'Herramienta',
  EQUIPMENT: 'Equipo',
  CONSUMABLE: 'Consumible',
  SPARE_PART: 'Repuesto',
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

const ItemDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { currentItem, loading } = useSelector((state) => state.inventory);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchItemFull(id));
    
    return () => {
      dispatch(clearCurrentItem());
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

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-VE');
  };

  const isLowStock = () => {
    return currentItem?.minStock && parseFloat(currentItem.totalStock) <= parseFloat(currentItem.minStock);
  };

  const isOutOfStock = () => {
    return parseFloat(currentItem?.totalStock || 0) === 0;
  };

  if (loading || !currentItem) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/inventory')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {currentItem.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentItem.code}
              {currentItem.sku && ` • SKU: ${currentItem.sku}`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <DownloadPDFButton
            endpoint={`/reports/inventory/items/${id}`}
            filename={`item-${currentItem.code || currentItem.sku}.pdf`}
          />
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/inventory/items/${id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            startIcon={<MovementIcon />}
            onClick={() => navigate(`/inventory/movements/new?itemId=${id}`)}
          >
            Registrar Movimiento
          </Button>
        </Box>
      </Box>

      {/* Alertas */}
      {isOutOfStock() && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<WarningIcon />}>
          Este item está sin stock
        </Alert>
      )}
      {isLowStock() && !isOutOfStock() && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
          Stock bajo - Mínimo: {formatNumber(currentItem.minStock)} {currentItem.unit}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Stock Total
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color={isOutOfStock() ? 'error.main' : isLowStock() ? 'warning.main' : 'success.main'}
              >
                {formatNumber(currentItem.totalStock)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentItem.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Disponible
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {formatNumber(currentItem.availableStock)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentItem.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Reservado
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {formatNumber(currentItem.reservedStock)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentItem.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Costo Unit.
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {formatCurrency(currentItem.unitCost, currentItem.currency)}
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
              <Typography variant="h5" fontWeight="bold" color="info.main">
                {formatCurrency(parseFloat(currentItem.totalStock) * parseFloat(currentItem.unitCost), currentItem.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Almacenes
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">
                {currentItem.warehouseStocks?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ p: isMobile ? 2 : 0, mb: 3 }}>
        <ResponsiveTabs
          tabs={[
            { label: 'Información', icon: <InventoryIcon /> },
            { label: 'Stock por Almacén', icon: <WarehouseIcon /> },
            { label: 'Movimientos', icon: <MovementIcon /> },
            { label: 'Fotos', icon: <CategoryIcon /> },
          ]}
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          ariaLabel="item-tabs"
        />
      </Paper>

      {/* Tab: Información */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Datos Generales
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Código</Typography>
                  <Typography fontWeight="medium">{currentItem.code}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">SKU</Typography>
                  <Typography fontWeight="medium">{currentItem.sku || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Tipo</Typography>
                  <Typography>
                    <Chip 
                      label={itemTypeLabels[currentItem.itemType] || currentItem.itemType} 
                      size="small" 
                      variant="outlined"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Estado</Typography>
                  <Typography>
                    <Chip 
                      label={statusLabels[currentItem.status]} 
                      color={statusColors[currentItem.status]}
                      size="small"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Categoría</Typography>
                  <Typography fontWeight="medium">
                    {currentItem.category?.name || 'Sin categoría'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Unidad</Typography>
                  <Typography fontWeight="medium">{currentItem.unit}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Marca</Typography>
                  <Typography fontWeight="medium">{currentItem.brand || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Modelo</Typography>
                  <Typography fontWeight="medium">{currentItem.model || '-'}</Typography>
                </Grid>
                {currentItem.barcode && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Código de Barras</Typography>
                    <Typography fontWeight="medium">{currentItem.barcode}</Typography>
                  </Grid>
                )}
                {currentItem.description && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Descripción</Typography>
                    <Typography>{currentItem.description}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Niveles de Stock
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Stock Mínimo</Typography>
                  <Typography fontWeight="medium" color={isLowStock() ? 'warning.main' : 'inherit'}>
                    {currentItem.minStock ? `${formatNumber(currentItem.minStock)} ${currentItem.unit}` : 'No definido'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Stock Máximo</Typography>
                  <Typography fontWeight="medium">
                    {currentItem.maxStock ? `${formatNumber(currentItem.maxStock)} ${currentItem.unit}` : 'No definido'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Punto de Reorden</Typography>
                  <Typography fontWeight="medium">
                    {currentItem.reorderPoint ? `${formatNumber(currentItem.reorderPoint)} ${currentItem.unit}` : 'No definido'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Cantidad a Pedir</Typography>
                  <Typography fontWeight="medium">
                    {currentItem.reorderQuantity ? `${formatNumber(currentItem.reorderQuantity)} ${currentItem.unit}` : 'No definido'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trazabilidad
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Seguimiento por Serie</Typography>
                  <Typography fontWeight="medium">
                    {currentItem.isSerialTracked ? 'Sí' : 'No'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Seguimiento por Lote</Typography>
                  <Typography fontWeight="medium">
                    {currentItem.isLotTracked ? 'Sí' : 'No'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab: Stock por Almacén */}
      <TabPanel value={activeTab} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Almacén</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Reservado</TableCell>
                <TableCell align="right">Disponible</TableCell>
                <TableCell align="right">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItem.warehouseStocks?.map((stock) => (
                <TableRow key={stock.id} hover>
                  <TableCell>
                    <Typography 
                      fontWeight="medium" 
                      sx={{ cursor: 'pointer', color: 'primary.main' }}
                      onClick={() => navigate(`/inventory/warehouses/${stock.warehouse?.id}`)}
                    >
                      {stock.warehouse?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stock.warehouse?.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={stock.warehouse?.warehouseType} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{stock.location || '-'}</TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">
                      {formatNumber(stock.quantity)}
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
                    {formatCurrency(parseFloat(stock.quantity) * parseFloat(currentItem.unitCost), currentItem.currency)}
                  </TableCell>
                </TableRow>
              ))}
              {(!currentItem.warehouseStocks || currentItem.warehouseStocks.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No hay stock en ningún almacén
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Movimientos */}
      <TabPanel value={activeTab} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Origen</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItem.recentMovements?.map((mov) => (
                <TableRow key={mov.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {mov.code}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(mov.movementDate)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={movementTypeLabels[mov.movementType] || mov.movementType}
                      color={movementTypeColors[mov.movementType] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {mov.sourceWarehouse?.name || '-'}
                  </TableCell>
                  <TableCell>
                    {mov.destinationWarehouse?.name || '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">
                      {formatNumber(mov.quantity)} {currentItem.unit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {mov.description || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {(!currentItem.recentMovements || currentItem.recentMovements.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No hay movimientos registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Fotos */}
      <TabPanel value={activeTab} index={3}>
        <Paper sx={{ p: 3 }}>
          <AttachmentSection
            entityType="inventory_item"
            entityId={id}
            title="Fotos del Producto"
            defaultExpanded={true}
            canUpload={true}
            canDelete={true}
            showCategory={true}
            defaultCategory="PHOTO"
            variant="inline"
          />
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default ItemDetail;
