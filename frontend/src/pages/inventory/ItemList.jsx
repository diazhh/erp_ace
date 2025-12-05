import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  fetchItems, 
  fetchInventoryStats, 
  fetchCategories,
  fetchItemTypes,
  deleteItem 
} from '../../store/slices/inventorySlice';

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

const ItemList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { items, itemsPagination, stats, categories, itemTypes, loading } = useSelector((state) => state.inventory);
  
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    itemType: '',
    status: 'ACTIVE',
    lowStock: false,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchInventoryStats());
    dispatch(fetchCategories({ status: 'ACTIVE' }));
    dispatch(fetchItemTypes());
  }, [dispatch]);

  useEffect(() => {
    loadItems();
  }, [dispatch, page, rowsPerPage, filters.categoryId, filters.itemType, filters.status, filters.lowStock]);

  const loadItems = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.search && { search: filters.search }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.itemType && { itemType: filters.itemType }),
      ...(filters.status && { status: filters.status }),
      ...(filters.lowStock && { lowStock: 'true' }),
    };
    dispatch(fetchItems(params));
  };

  const handleSearch = () => {
    setPage(0);
    loadItems();
  };

  const handleNewItem = () => {
    navigate('/inventory/items/new');
  };

  const handleViewItem = (item) => {
    navigate(`/inventory/items/${item.id}`);
  };

  const handleEditItem = (item) => {
    navigate(`/inventory/items/${item.id}/edit`);
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar el item "${item.name}"?`)) {
      try {
        await dispatch(deleteItem(item.id)).unwrap();
        toast.success('Item eliminado');
        loadItems();
      } catch (error) {
        toast.error(error);
      }
    }
  };

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

  const isLowStock = (item) => {
    return item.minStock && parseFloat(item.totalStock) <= parseFloat(item.minStock);
  };

  const isOutOfStock = (item) => {
    return parseFloat(item.totalStock) === 0;
  };

  // Card view for mobile
  const renderCards = () => (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} key={item.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon color="primary" />
                  <Box>
                    <Typography variant="h6" fontWeight="medium">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.code}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
                  <Chip
                    label={itemTypeLabels[item.itemType] || item.itemType}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={statusLabels[item.status]}
                    color={statusColors[item.status]}
                    size="small"
                  />
                </Box>
              </Box>

              {item.category && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CategoryIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {item.category.name}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Stock
                  </Typography>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color={isOutOfStock(item) ? 'error.main' : isLowStock(item) ? 'warning.main' : 'success.main'}
                  >
                    {formatNumber(item.totalStock)} {item.unit}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">
                    Costo Unit.
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatCurrency(item.unitCost, item.currency)}
                  </Typography>
                </Box>
              </Box>

              {isLowStock(item) && (
                <Alert severity="warning" sx={{ mt: 2 }} icon={<WarningIcon />}>
                  Stock bajo (Mín: {formatNumber(item.minStock)})
                </Alert>
              )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewItem(item)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton 
                  size="small"
                  onClick={() => handleEditItem(item)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              {parseFloat(item.totalStock) === 0 && (
                <Tooltip title="Eliminar">
                  <IconButton 
                    size="small"
                    color="error"
                    onClick={() => handleDeleteItem(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Table view for desktop
  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell align="right">Disponible</TableCell>
            <TableCell align="right">Costo Unit.</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {item.code}
                </Typography>
                {item.sku && (
                  <Typography variant="caption" color="text.secondary">
                    SKU: {item.sku}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {(isOutOfStock(item) || isLowStock(item)) && (
                    <Tooltip title={isOutOfStock(item) ? 'Sin stock' : 'Stock bajo'}>
                      <WarningIcon color={isOutOfStock(item) ? 'error' : 'warning'} fontSize="small" />
                    </Tooltip>
                  )}
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name}
                    </Typography>
                    {item.brand && (
                      <Typography variant="caption" color="text.secondary">
                        {item.brand}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                {item.category ? (
                  <Chip 
                    label={item.category.name} 
                    size="small" 
                    sx={{ 
                      bgcolor: item.category.color || undefined,
                      color: item.category.color ? 'white' : undefined,
                    }}
                  />
                ) : '-'}
              </TableCell>
              <TableCell>
                <Chip
                  label={itemTypeLabels[item.itemType] || item.itemType}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <Typography 
                  fontWeight="bold"
                  color={isOutOfStock(item) ? 'error.main' : isLowStock(item) ? 'warning.main' : 'inherit'}
                >
                  {formatNumber(item.totalStock)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.unit}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="success.main">
                  {formatNumber(item.availableStock)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {formatCurrency(item.unitCost, item.currency)}
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[item.status]}
                  color={statusColors[item.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewItem(item)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton 
                    size="small"
                    onClick={() => handleEditItem(item)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                {parseFloat(item.totalStock) === 0 && (
                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small"
                      color="error"
                      onClick={() => handleDeleteItem(item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {itemsPagination && (
        <TablePagination
          component="div"
          count={itemsPagination.total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Filas por página"
        />
      )}
    </TableContainer>
  );

  if (loading && items.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Inventario
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/inventory/warehouses')}
          >
            Almacenes
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/inventory/movements')}
          >
            Movimientos
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewItem}
          >
            Nuevo Item
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  Items
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {stats.items?.total || 0}
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
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {stats.warehouses?.active || 0}
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
                <Typography variant="h4" fontWeight="bold" color={stats.items?.lowStock > 0 ? 'warning.main' : 'text.primary'}>
                  {stats.items?.lowStock || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  Sin Stock
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={stats.items?.outOfStock > 0 ? 'error.main' : 'text.primary'}>
                  {stats.items?.outOfStock || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  Categorías
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="secondary.main">
                  {stats.categories?.total || 0}
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
                  {formatCurrency(stats.value?.total)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nombre, código, SKU..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Categoría"
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Tipo"
              value={filters.itemType}
              onChange={(e) => setFilters({ ...filters, itemType: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(itemTypeLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Estado"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={1}>
            <Button 
              fullWidth 
              variant={filters.lowStock ? 'contained' : 'outlined'}
              color="warning"
              onClick={() => setFilters({ ...filters, lowStock: !filters.lowStock })}
              size="small"
            >
              Stock Bajo
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={1}>
            <Button fullWidth variant="outlined" onClick={handleSearch}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Items List */}
      {isMobile ? renderCards() : renderTable()}

      {items.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <InventoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay items registrados
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewItem}
            sx={{ mt: 2 }}
          >
            Crear Primer Item
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ItemList;
