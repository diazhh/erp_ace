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
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warehouse as WarehouseIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  fetchWarehouses, 
  fetchWarehouseTypes,
  deleteWarehouse 
} from '../../store/slices/inventorySlice';

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

const WarehouseList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { warehouses, warehousesPagination, warehouseTypes, loading } = useSelector((state) => state.inventory);
  
  const [filters, setFilters] = useState({
    search: '',
    warehouseType: '',
    status: 'ACTIVE',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchWarehouseTypes());
  }, [dispatch]);

  useEffect(() => {
    loadWarehouses();
  }, [dispatch, page, rowsPerPage, filters.warehouseType, filters.status]);

  const loadWarehouses = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.search && { search: filters.search }),
      ...(filters.warehouseType && { warehouseType: filters.warehouseType }),
      ...(filters.status && { status: filters.status }),
    };
    dispatch(fetchWarehouses(params));
  };

  const handleSearch = () => {
    setPage(0);
    loadWarehouses();
  };

  const handleNewWarehouse = () => {
    navigate('/inventory/warehouses/new');
  };

  const handleViewWarehouse = (warehouse) => {
    navigate(`/inventory/warehouses/${warehouse.id}`);
  };

  const handleEditWarehouse = (warehouse) => {
    navigate(`/inventory/warehouses/${warehouse.id}/edit`);
  };

  const handleDeleteWarehouse = async (warehouse) => {
    if (window.confirm(`¿Está seguro de eliminar el almacén "${warehouse.name}"?`)) {
      try {
        await dispatch(deleteWarehouse(warehouse.id)).unwrap();
        toast.success('Almacén eliminado');
        loadWarehouses();
      } catch (error) {
        toast.error(error);
      }
    }
  };

  // Card view for mobile
  const renderCards = () => (
    <Grid container spacing={2}>
      {warehouses.map((warehouse) => (
        <Grid item xs={12} sm={6} key={warehouse.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarehouseIcon color="primary" />
                  <Box>
                    <Typography variant="h6" fontWeight="medium">
                      {warehouse.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {warehouse.code}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
                  <Chip
                    label={warehouseTypeLabels[warehouse.warehouseType] || warehouse.warehouseType}
                    color={warehouseTypeColors[warehouse.warehouseType] || 'default'}
                    size="small"
                  />
                  <Chip
                    label={statusLabels[warehouse.status]}
                    color={statusColors[warehouse.status]}
                    size="small"
                  />
                </Box>
              </Box>

              {warehouse.location && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  📍 {warehouse.location}
                </Typography>
              )}

              {warehouse.manager && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {warehouse.manager.firstName} {warehouse.manager.lastName}
                  </Typography>
                </Box>
              )}

              {warehouse.project && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Proyecto: {warehouse.project.name}
                  </Typography>
                </Box>
              )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewWarehouse(warehouse)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton 
                  size="small"
                  onClick={() => handleEditWarehouse(warehouse)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton 
                  size="small"
                  color="error"
                  onClick={() => handleDeleteWarehouse(warehouse)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
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
            <TableCell>Tipo</TableCell>
            <TableCell>Ubicación</TableCell>
            <TableCell>Encargado</TableCell>
            <TableCell>Proyecto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {warehouses.map((warehouse) => (
            <TableRow key={warehouse.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {warehouse.code}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarehouseIcon color="action" fontSize="small" />
                  <Typography variant="body2" fontWeight="medium">
                    {warehouse.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={warehouseTypeLabels[warehouse.warehouseType] || warehouse.warehouseType}
                  color={warehouseTypeColors[warehouse.warehouseType] || 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {warehouse.location || '-'}
              </TableCell>
              <TableCell>
                {warehouse.manager ? (
                  `${warehouse.manager.firstName} ${warehouse.manager.lastName}`
                ) : '-'}
              </TableCell>
              <TableCell>
                {warehouse.project ? (
                  <Chip 
                    label={warehouse.project.code} 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigate(`/projects/${warehouse.project.id}`)}
                  />
                ) : '-'}
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[warehouse.status]}
                  color={statusColors[warehouse.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewWarehouse(warehouse)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton 
                    size="small"
                    onClick={() => handleEditWarehouse(warehouse)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton 
                    size="small"
                    color="error"
                    onClick={() => handleDeleteWarehouse(warehouse)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {warehousesPagination && (
        <TablePagination
          component="div"
          count={warehousesPagination.total}
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

  if (loading && warehouses.length === 0) {
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/inventory')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Almacenes
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewWarehouse}
        >
          Nuevo Almacén
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nombre, código, ubicación..."
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
              label="Tipo"
              value={filters.warehouseType}
              onChange={(e) => setFilters({ ...filters, warehouseType: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(warehouseTypeLabels).map(([key, label]) => (
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
          <Grid item xs={12} sm={6} md={2}>
            <Button fullWidth variant="outlined" onClick={handleSearch}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Warehouses List */}
      {isMobile ? renderCards() : renderTable()}

      {warehouses.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <WarehouseIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay almacenes registrados
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewWarehouse}
            sx={{ mt: 2 }}
          >
            Crear Primer Almacén
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default WarehouseList;
