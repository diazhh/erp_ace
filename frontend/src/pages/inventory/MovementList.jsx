import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Tooltip,
  TextField,
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
  ArrowBack as ArrowBackIcon,
  SwapHoriz as MovementIcon,
  Cancel as CancelIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  fetchMovements, 
  fetchMovementTypes,
  fetchMovementReasons,
  fetchWarehouses,
  cancelMovement,
} from '../../store/slices/inventorySlice';

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

const movementTypeIcons = {
  ENTRY: <ArrowDownIcon color="success" />,
  EXIT: <ArrowUpIcon color="error" />,
  TRANSFER: <ArrowForwardIcon color="info" />,
  ADJUSTMENT_IN: <ArrowDownIcon color="success" />,
  ADJUSTMENT_OUT: <ArrowUpIcon color="warning" />,
  RETURN: <ArrowDownIcon color="secondary" />,
  RESERVATION: <MovementIcon />,
  RELEASE: <MovementIcon />,
};

const reasonLabels = {
  PURCHASE: 'Compra',
  PROJECT_USE: 'Uso en Proyecto',
  SALE: 'Venta',
  DAMAGE: 'Daño',
  LOSS: 'Pérdida',
  THEFT: 'Robo',
  EXPIRY: 'Vencimiento',
  COUNT_ADJUSTMENT: 'Ajuste por Conteo',
  TRANSFER: 'Transferencia',
  RETURN_SUPPLIER: 'Devolución a Proveedor',
  RETURN_PROJECT: 'Devolución de Proyecto',
  DONATION: 'Donación',
  OTHER: 'Otro',
};

const statusColors = {
  PENDING: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const statusLabels = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const MovementList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { movements, movementsPagination, warehouses, loading } = useSelector((state) => state.inventory);
  
  const [filters, setFilters] = useState({
    movementType: '',
    reason: '',
    warehouseId: searchParams.get('warehouseId') || '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    dispatch(fetchMovementTypes());
    dispatch(fetchMovementReasons());
    dispatch(fetchWarehouses({ status: 'ACTIVE', limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    loadMovements();
  }, [dispatch, page, rowsPerPage, filters.movementType, filters.reason, filters.warehouseId, filters.status]);

  const loadMovements = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.movementType && { movementType: filters.movementType }),
      ...(filters.reason && { reason: filters.reason }),
      ...(filters.warehouseId && { warehouseId: filters.warehouseId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    };
    dispatch(fetchMovements(params));
  };

  const handleSearch = () => {
    setPage(0);
    loadMovements();
  };

  const handleNewMovement = () => {
    const params = filters.warehouseId ? `?warehouseId=${filters.warehouseId}` : '';
    navigate(`/inventory/movements/new${params}`);
  };

  const handleCancelMovement = async (movement) => {
    if (movement.status !== 'COMPLETED') {
      toast.error('Solo se pueden cancelar movimientos completados');
      return;
    }
    if (window.confirm(`¿Está seguro de cancelar el movimiento "${movement.code}"? Esto revertirá los cambios de stock.`)) {
      try {
        await dispatch(cancelMovement(movement.id)).unwrap();
        toast.success('Movimiento cancelado');
        loadMovements();
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

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  // Card view for mobile
  const renderCards = () => (
    <Grid container spacing={2}>
      {movements.map((movement) => (
        <Grid item xs={12} key={movement.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {movementTypeIcons[movement.movementType]}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {movement.code}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(movement.movementDate)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
                  <Chip
                    label={movementTypeLabels[movement.movementType]}
                    color={movementTypeColors[movement.movementType]}
                    size="small"
                  />
                  <Chip
                    label={statusLabels[movement.status]}
                    color={statusColors[movement.status]}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                {movement.item?.name}
              </Typography>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Cantidad
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatNumber(movement.quantity)} {movement.item?.unit}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Costo Total
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    {formatCurrency(movement.totalCost, movement.currency)}
                  </Typography>
                </Grid>
              </Grid>

              {movement.movementType === 'TRANSFER' ? (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption">
                    {movement.sourceWarehouse?.name} → {movement.destinationWarehouse?.name}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {movement.sourceWarehouse?.name || movement.destinationWarehouse?.name}
                </Typography>
              )}

              {movement.status === 'COMPLETED' && (
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Tooltip title="Cancelar movimiento">
                    <IconButton 
                      size="small"
                      color="error"
                      onClick={() => handleCancelMovement(movement)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Table view for desktop
  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Razón</TableCell>
            <TableCell>Item</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell>Origen</TableCell>
            <TableCell>Destino</TableCell>
            <TableCell align="right">Costo Total</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {movement.code}
                </Typography>
              </TableCell>
              <TableCell>
                {formatDate(movement.movementDate)}
              </TableCell>
              <TableCell>
                <Chip
                  icon={movementTypeIcons[movement.movementType]}
                  label={movementTypeLabels[movement.movementType]}
                  color={movementTypeColors[movement.movementType]}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="caption">
                  {reasonLabels[movement.reason] || movement.reason}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2"
                  sx={{ cursor: 'pointer', color: 'primary.main' }}
                  onClick={() => navigate(`/inventory/items/${movement.item?.id}`)}
                >
                  {movement.item?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {movement.item?.code}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold">
                  {formatNumber(movement.quantity)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {movement.item?.unit}
                </Typography>
              </TableCell>
              <TableCell>
                {movement.sourceWarehouse ? (
                  <Chip 
                    label={movement.sourceWarehouse.name} 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigate(`/inventory/warehouses/${movement.sourceWarehouse.id}`)}
                  />
                ) : '-'}
              </TableCell>
              <TableCell>
                {movement.destinationWarehouse ? (
                  <Chip 
                    label={movement.destinationWarehouse.name} 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigate(`/inventory/warehouses/${movement.destinationWarehouse.id}`)}
                  />
                ) : '-'}
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold" color="primary">
                  {formatCurrency(movement.totalCost, movement.currency)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[movement.status]}
                  color={statusColors[movement.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                {movement.status === 'COMPLETED' && (
                  <Tooltip title="Cancelar movimiento">
                    <IconButton 
                      size="small"
                      color="error"
                      onClick={() => handleCancelMovement(movement)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {movementsPagination && (
        <TablePagination
          component="div"
          count={movementsPagination.total}
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

  if (loading && movements.length === 0) {
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
            Movimientos de Inventario
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewMovement}
        >
          Nuevo Movimiento
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Tipo"
              value={filters.movementType}
              onChange={(e) => setFilters({ ...filters, movementType: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(movementTypeLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Razón"
              value={filters.reason}
              onChange={(e) => setFilters({ ...filters, reason: e.target.value })}
            >
              <MenuItem value="">Todas</MenuItem>
              {Object.entries(reasonLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Almacén"
              value={filters.warehouseId}
              onChange={(e) => setFilters({ ...filters, warehouseId: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {warehouses.map((wh) => (
                <MenuItem key={wh.id} value={wh.id}>{wh.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
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
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Desde"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button fullWidth variant="outlined" onClick={handleSearch}>
              Filtrar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Movements List */}
      {isMobile ? renderCards() : renderTable()}

      {movements.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <MovementIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay movimientos registrados
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewMovement}
            sx={{ mt: 2 }}
          >
            Registrar Primer Movimiento
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default MovementList;
