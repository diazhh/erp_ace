import { useState, useEffect } from 'react';
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
  Description as QuoteIcon,
  CheckCircle as ApproveIcon,
  Star as PreferredIcon,
  Transform as ConvertIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';

const statusColors = {
  DRAFT: 'default',
  RECEIVED: 'info',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  EXPIRED: 'default',
  CONVERTED: 'primary',
};

const statusLabels = {
  DRAFT: 'Borrador',
  RECEIVED: 'Recibida',
  UNDER_REVIEW: 'En Revisión',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  EXPIRED: 'Vencida',
  CONVERTED: 'Convertida',
};

const quoteTypeLabels = {
  PURCHASE: 'Compra',
  SERVICE: 'Servicio',
  WORK: 'Obra',
};

const QuoteList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [quotes, setQuotes] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    quoteType: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadQuotes();
  }, [page, rowsPerPage, filters.status, filters.quoteType]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(filters.status && { status: filters.status }),
        ...(filters.quoteType && { quoteType: filters.quoteType }),
      };
      const response = await api.get('/procurement/quotes', { params });
      setQuotes(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Error al cargar cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (quote) => {
    if (!window.confirm('¿Aprobar esta cotización?')) return;
    try {
      await api.post(`/procurement/quotes/${quote.id}/approve`);
      toast.success('Cotización aprobada');
      loadQuotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al aprobar');
    }
  };

  const handleConvert = async (quote) => {
    if (!window.confirm('¿Convertir esta cotización a orden de compra?')) return;
    try {
      await api.post(`/procurement/quotes/${quote.id}/convert-to-po`);
      toast.success('Cotización convertida a orden de compra');
      loadQuotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al convertir');
    }
  };

  const handleViewQuote = (quote) => {
    navigate(`/procurement/quotes/${quote.id}`);
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
      {quotes.map((quote) => (
        <Grid item xs={12} sm={6} key={quote.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="h6" fontWeight="medium">
                      {quote.code}
                    </Typography>
                    {quote.isPreferred && (
                      <PreferredIcon color="warning" fontSize="small" />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {quoteTypeLabels[quote.quoteType]}
                  </Typography>
                </Box>
                <Chip
                  label={statusLabels[quote.status]}
                  color={statusColors[quote.status]}
                  size="small"
                />
              </Box>

              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                {quote.title}
              </Typography>

              {quote.contractor && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {quote.contractor.companyName}
                </Typography>
              )}

              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                {formatCurrency(quote.total, quote.currency)}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Fecha: {formatDate(quote.quoteDate)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Válida: {formatDate(quote.validUntil)}
                </Typography>
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewQuote(quote)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              {['RECEIVED', 'UNDER_REVIEW'].includes(quote.status) && (
                <Tooltip title="Aprobar">
                  <IconButton 
                    size="small"
                    color="success"
                    onClick={() => handleApprove(quote)}
                  >
                    <ApproveIcon />
                  </IconButton>
                </Tooltip>
              )}
              {quote.status === 'APPROVED' && !quote.purchaseOrderId && (
                <Tooltip title="Convertir a OC">
                  <IconButton 
                    size="small"
                    color="primary"
                    onClick={() => handleConvert(quote)}
                  >
                    <ConvertIcon />
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
            <TableCell>Válida hasta</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {quote.code}
                  </Typography>
                  {quote.isPreferred && (
                    <PreferredIcon color="warning" fontSize="small" />
                  )}
                </Box>
              </TableCell>
              <TableCell>{quoteTypeLabels[quote.quoteType]}</TableCell>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                  {quote.title}
                </Typography>
              </TableCell>
              <TableCell>{quote.contractor?.companyName || '-'}</TableCell>
              <TableCell>{formatDate(quote.quoteDate)}</TableCell>
              <TableCell>{formatDate(quote.validUntil)}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(quote.total, quote.currency)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[quote.status]}
                  color={statusColors[quote.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewQuote(quote)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                {['RECEIVED', 'UNDER_REVIEW'].includes(quote.status) && (
                  <Tooltip title="Aprobar">
                    <IconButton 
                      size="small"
                      color="success"
                      onClick={() => handleApprove(quote)}
                    >
                      <ApproveIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {quote.status === 'APPROVED' && !quote.purchaseOrderId && (
                  <Tooltip title="Convertir a OC">
                    <IconButton 
                      size="small"
                      color="primary"
                      onClick={() => handleConvert(quote)}
                    >
                      <ConvertIcon />
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
        count={pagination.total}
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

  if (loading && quotes.length === 0) {
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
          Cotizaciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/procurement/quotes/new')}
        >
          Registrar Cotización
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por código o título..."
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
              value={filters.quoteType}
              onChange={(e) => setFilters({ ...filters, quoteType: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(quoteTypeLabels).map(([key, label]) => (
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
            <Button fullWidth variant="outlined" onClick={loadQuotes}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Quotes List */}
      {isMobile ? renderCards() : renderTable()}

      {quotes.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <QuoteIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay cotizaciones registradas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/procurement/quotes/new')}
            sx={{ mt: 2 }}
          >
            Registrar Primera Cotización
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default QuoteList;
