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
  Receipt as InvoiceIcon,
  CheckCircle as ApproveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchInvoices, approveInvoice } from '../../store/slices/contractorSlice';

const statusColors = {
  PENDING: 'warning',
  APPROVED: 'info',
  PARTIAL: 'primary',
  PAID: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

const statusLabels = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  PARTIAL: 'Pago Parcial',
  PAID: 'Pagada',
  REJECTED: 'Rechazada',
  CANCELLED: 'Cancelada',
};

const InvoiceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { invoices, invoicesPagination, loading } = useSelector((state) => state.contractors);
  
  const [filters, setFilters] = useState({
    status: '',
    contractorId: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadInvoices();
  }, [dispatch, page, rowsPerPage, filters.status]);

  const loadInvoices = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.status && { status: filters.status }),
    };
    dispatch(fetchInvoices(params));
  };

  const handleApprove = async (invoice) => {
    if (!window.confirm('¿Aprobar esta factura?')) return;
    try {
      await dispatch(approveInvoice(invoice.id)).unwrap();
      toast.success('Factura aprobada');
      loadInvoices();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleViewInvoice = (invoice) => {
    navigate(`/procurement/invoices/${invoice.id}`);
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
      {invoices.map((invoice) => (
        <Grid item xs={12} sm={6} key={invoice.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {invoice.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nº {invoice.invoiceNumber}
                  </Typography>
                </Box>
                <Chip
                  label={statusLabels[invoice.status]}
                  color={statusColors[invoice.status]}
                  size="small"
                />
              </Box>

              {invoice.contractor && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {invoice.contractor.companyName}
                </Typography>
              )}

              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                {formatCurrency(invoice.total, invoice.currency)}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Fecha: {formatDate(invoice.invoiceDate)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Vence: {formatDate(invoice.dueDate)}
                </Typography>
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewInvoice(invoice)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              {invoice.status === 'PENDING' && (
                <Tooltip title="Aprobar">
                  <IconButton 
                    size="small"
                    color="success"
                    onClick={() => handleApprove(invoice)}
                  >
                    <ApproveIcon />
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
            <TableCell>Nº Factura</TableCell>
            <TableCell>Contratista</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Vencimiento</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Pagado</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {invoice.code}
                </Typography>
              </TableCell>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.contractor?.companyName || '-'}</TableCell>
              <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
              <TableCell>{formatDate(invoice.dueDate)}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(invoice.total, invoice.currency)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="success.main">
                  {formatCurrency(invoice.paidAmount, invoice.currency)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[invoice.status]}
                  color={statusColors[invoice.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewInvoice(invoice)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                {invoice.status === 'PENDING' && (
                  <Tooltip title="Aprobar">
                    <IconButton 
                      size="small"
                      color="success"
                      onClick={() => handleApprove(invoice)}
                    >
                      <ApproveIcon />
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
        count={invoicesPagination.total}
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

  if (loading && invoices.length === 0) {
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
          Facturas de Contratistas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/procurement/invoices/new')}
        >
          Registrar Factura
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por código o número..."
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
            <Button fullWidth variant="outlined" onClick={loadInvoices}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Invoices List */}
      {isMobile ? renderCards() : renderTable()}

      {invoices.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <InvoiceIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay facturas registradas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/procurement/invoices/new')}
            sx={{ mt: 2 }}
          >
            Registrar Primera Factura
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default InvoiceList;
