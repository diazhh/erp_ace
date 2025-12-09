import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  ShoppingCart as PurchaseIcon,
  Engineering as ServiceIcon,
  Construction as WorkIcon,
} from '@mui/icons-material';

import { fetchPurchaseOrders } from '../../store/slices/contractorSlice';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const statusColors = {
  DRAFT: 'default',
  PENDING: 'warning',
  APPROVED: 'info',
  SENT: 'primary',
  CONFIRMED: 'primary',
  IN_PROGRESS: 'info',
  PARTIAL: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const statusLabels = {
  DRAFT: 'Borrador',
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  SENT: 'Enviada',
  CONFIRMED: 'Confirmada',
  IN_PROGRESS: 'En Progreso',
  PARTIAL: 'Parcial',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const orderTypeIcons = {
  PURCHASE: <PurchaseIcon />,
  SERVICE: <ServiceIcon />,
  WORK: <WorkIcon />,
};

const orderTypeLabels = {
  PURCHASE: 'Compra',
  SERVICE: 'Servicio',
  WORK: 'Obra',
};

const PurchaseOrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { purchaseOrders, purchaseOrdersPagination, loading } = useSelector((state) => state.contractors);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    orderType: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadOrders();
  }, [dispatch, page, rowsPerPage, filters.status, filters.orderType]);

  const loadOrders = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.status && { status: filters.status }),
      ...(filters.orderType && { orderType: filters.orderType }),
    };
    dispatch(fetchPurchaseOrders(params));
  };

  const handleSearch = () => {
    setPage(0);
    loadOrders();
  };

  const handleNewOrder = () => {
    navigate('/procurement/purchase-orders/new');
  };

  const handleViewOrder = (order) => {
    navigate(`/procurement/purchase-orders/${order.id}`);
  };

  const handleEditOrder = (order) => {
    navigate(`/procurement/purchase-orders/${order.id}/edit`);
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency === 'USDT' ? 'USD' : currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  // Card view for mobile
  const renderCards = () => (
    <Grid container spacing={2}>
      {purchaseOrders.map((order) => (
        <Grid item xs={12} sm={6} key={order.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {order.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.title}
                  </Typography>
                </Box>
                <Chip
                  label={statusLabels[order.status]}
                  color={statusColors[order.status]}
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {orderTypeIcons[order.orderType]}
                <Typography variant="body2">
                  {orderTypeLabels[order.orderType]}
                </Typography>
              </Box>

              {order.contractor && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {order.contractor.companyName}
                </Typography>
              )}

              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                {formatCurrency(order.total, order.currency)}
              </Typography>

              {order.progress > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Progreso</Typography>
                    <Typography variant="caption">{order.progress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={order.progress} />
                </Box>
              )}

              <Typography variant="caption" color="text.secondary">
                Fecha: {formatDate(order.orderDate)}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewOrder(order)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              {['DRAFT', 'PENDING'].includes(order.status) && (
                <Tooltip title="Editar">
                  <IconButton 
                    size="small"
                    onClick={() => handleEditOrder(order)}
                  >
                    <EditIcon />
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
            <TableCell>Tipo</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Contratista</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Progreso</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {purchaseOrders.map((order) => (
            <TableRow key={order.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {order.code}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {orderTypeIcons[order.orderType]}
                  <Typography variant="body2">
                    {orderTypeLabels[order.orderType]}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                  {order.title}
                </Typography>
              </TableCell>
              <TableCell>
                {order.contractor?.companyName || '-'}
              </TableCell>
              <TableCell>{formatDate(order.orderDate)}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(order.total, order.currency)}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={order.progress} 
                    sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption">{order.progress}%</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[order.status]}
                  color={statusColors[order.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewOrder(order)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                {['DRAFT', 'PENDING'].includes(order.status) && (
                  <Tooltip title="Editar">
                    <IconButton 
                      size="small"
                      onClick={() => handleEditOrder(order)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={purchaseOrdersPagination.total}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Filas por página"
      />
    </TableContainer>
  );

  if (loading && purchaseOrders.length === 0) {
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
          Órdenes de Compra
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <DownloadPDFButton
            endpoint={`/reports/purchase-orders?status=${filters.status || ''}`}
            filename={`ordenes-compra-${new Date().toISOString().split('T')[0]}.pdf`}
            variant="outlined"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewOrder}
          >
            Nueva Orden
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por código o título..."
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
              value={filters.orderType}
              onChange={(e) => setFilters({ ...filters, orderType: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(orderTypeLabels).map(([key, label]) => (
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
          <Grid item xs={12} sm={12} md={2}>
            <Button fullWidth variant="outlined" onClick={handleSearch}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders List */}
      {isMobile ? renderCards() : renderTable()}

      {purchaseOrders.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PurchaseIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay órdenes de compra registradas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewOrder}
            sx={{ mt: 2 }}
          >
            Crear Primera Orden
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PurchaseOrderList;
