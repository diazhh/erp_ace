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
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Payment as PaymentIcon,
  CheckCircle as ApproveIcon,
  PlayArrow as ProcessIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchPayments, approvePayment, processPayment } from '../../store/slices/contractorSlice';

const statusColors = {
  PENDING: 'warning',
  PROCESSING: 'info',
  COMPLETED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

const statusLabels = {
  PENDING: 'Pendiente',
  PROCESSING: 'En Proceso',
  COMPLETED: 'Completado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

const paymentMethodLabels = {
  TRANSFER: 'Transferencia',
  CHECK: 'Cheque',
  CASH: 'Efectivo',
  CRYPTO: 'Criptomoneda',
  MOBILE_PAYMENT: 'Pago Móvil',
};

const PaymentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { payments, paymentsPagination, loading } = useSelector((state) => state.contractors);
  
  const [filters, setFilters] = useState({
    status: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadPayments();
  }, [dispatch, page, rowsPerPage, filters.status]);

  const loadPayments = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.status && { status: filters.status }),
    };
    dispatch(fetchPayments(params));
  };

  const handleApprove = async (payment) => {
    if (!window.confirm('¿Aprobar este pago?')) return;
    try {
      await dispatch(approvePayment(payment.id)).unwrap();
      toast.success('Pago aprobado');
      loadPayments();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleProcess = async (payment) => {
    if (!window.confirm('¿Marcar como procesado?')) return;
    try {
      await dispatch(processPayment({ paymentId: payment.id, data: {} })).unwrap();
      toast.success('Pago procesado');
      loadPayments();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleViewPayment = (payment) => {
    navigate(`/procurement/payments/${payment.id}`);
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
      {payments.map((payment) => (
        <Grid item xs={12} sm={6} key={payment.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {payment.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {paymentMethodLabels[payment.paymentMethod]}
                  </Typography>
                </Box>
                <Chip
                  label={statusLabels[payment.status]}
                  color={statusColors[payment.status]}
                  size="small"
                />
              </Box>

              {payment.contractor && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {payment.contractor.companyName}
                </Typography>
              )}

              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                {formatCurrency(payment.amount, payment.currency)}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Fecha: {formatDate(payment.paymentDate)}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewPayment(payment)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              {payment.status === 'PENDING' && (
                <Tooltip title="Aprobar">
                  <IconButton 
                    size="small"
                    color="success"
                    onClick={() => handleApprove(payment)}
                  >
                    <ApproveIcon />
                  </IconButton>
                </Tooltip>
              )}
              {payment.status === 'PROCESSING' && (
                <Tooltip title="Procesar">
                  <IconButton 
                    size="small"
                    color="primary"
                    onClick={() => handleProcess(payment)}
                  >
                    <ProcessIcon />
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
            <TableCell>Contratista</TableCell>
            <TableCell>Factura</TableCell>
            <TableCell>Método</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell align="right">Monto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {payment.code}
                </Typography>
              </TableCell>
              <TableCell>{payment.contractor?.companyName || '-'}</TableCell>
              <TableCell>{payment.invoice?.invoiceNumber || '-'}</TableCell>
              <TableCell>{paymentMethodLabels[payment.paymentMethod]}</TableCell>
              <TableCell>{formatDate(payment.paymentDate)}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium" color="primary">
                  {formatCurrency(payment.amount, payment.currency)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[payment.status]}
                  color={statusColors[payment.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewPayment(payment)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                {payment.status === 'PENDING' && (
                  <Tooltip title="Aprobar">
                    <IconButton 
                      size="small"
                      color="success"
                      onClick={() => handleApprove(payment)}
                    >
                      <ApproveIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {payment.status === 'PROCESSING' && (
                  <Tooltip title="Procesar">
                    <IconButton 
                      size="small"
                      color="primary"
                      onClick={() => handleProcess(payment)}
                    >
                      <ProcessIcon />
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
        count={paymentsPagination.total}
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

  if (loading && payments.length === 0) {
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
          Pagos a Contratistas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/procurement/payments/new')}
        >
          Registrar Pago
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por código o referencia..."
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
          <Grid item xs={6} sm={3} md={2}>
            <Button fullWidth variant="outlined" onClick={loadPayments}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Payments List */}
      {isMobile ? renderCards() : renderTable()}

      {payments.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PaymentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay pagos registrados
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/procurement/payments/new')}
            sx={{ mt: 2 }}
          >
            Registrar Primer Pago
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PaymentList;
