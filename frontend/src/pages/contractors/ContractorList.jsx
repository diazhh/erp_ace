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
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Engineering as ContractorIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchContractors, fetchContractorStats, deleteContractor } from '../../store/slices/contractorSlice';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  SUSPENDED: 'error',
  PENDING: 'warning',
};

const statusLabels = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  SUSPENDED: 'Suspendido',
  PENDING: 'Pendiente',
};

const ContractorList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { contractors, contractorsPagination, stats, loading } = useSelector((state) => state.contractors);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    specialty: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadContractors();
    dispatch(fetchContractorStats());
  }, [dispatch, page, rowsPerPage, filters.status, filters.specialty]);

  const loadContractors = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
      ...(filters.specialty && { specialty: filters.specialty }),
    };
    dispatch(fetchContractors(params));
  };

  const handleSearch = () => {
    setPage(0);
    loadContractors();
  };

  const handleNewContractor = () => {
    navigate('/contractors/new');
  };

  const handleViewContractor = (contractor) => {
    navigate(`/contractors/${contractor.id}`);
  };

  const handleEditContractor = (contractor) => {
    navigate(`/contractors/${contractor.id}/edit`);
  };

  const handleDeleteContractor = async (contractor) => {
    if (window.confirm(`¿Está seguro de eliminar al contratista "${contractor.companyName}"?`)) {
      try {
        await dispatch(deleteContractor(contractor.id)).unwrap();
        toast.success('Contratista eliminado');
        loadContractors();
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency === 'USDT' ? 'USD' : currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Card view for mobile
  const renderCards = () => (
    <Grid container spacing={2}>
      {contractors.map((contractor) => (
        <Grid item xs={12} sm={6} key={contractor.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ContractorIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="medium">
                      {contractor.companyName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {contractor.code}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={statusLabels[contractor.status]}
                  color={statusColors[contractor.status]}
                  size="small"
                />
              </Box>

              {contractor.contactName && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {contractor.contactName}
                  </Typography>
                </Box>
              )}

              {contractor.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {contractor.phone}
                  </Typography>
                </Box>
              )}

              {contractor.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {contractor.email}
                  </Typography>
                </Box>
              )}

              {contractor.specialty && (
                <Chip 
                  label={contractor.specialty} 
                  size="small" 
                  variant="outlined" 
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewContractor(contractor)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton 
                  size="small"
                  onClick={() => handleEditContractor(contractor)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              {contractor.status === 'PENDING' && (
                <Tooltip title="Eliminar">
                  <IconButton 
                    size="small"
                    color="error"
                    onClick={() => handleDeleteContractor(contractor)}
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
            <TableCell>Empresa</TableCell>
            <TableCell>Contacto</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Especialidad</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contractors.map((contractor) => (
            <TableRow key={contractor.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {contractor.code}
                </Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {contractor.companyName}
                  </Typography>
                  {contractor.rif && (
                    <Typography variant="caption" color="text.secondary">
                      RIF: {contractor.rif}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">
                    {contractor.contactName || '-'}
                  </Typography>
                  {contractor.email && (
                    <Typography variant="caption" color="text.secondary">
                      {contractor.email}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell>{contractor.phone || '-'}</TableCell>
              <TableCell>
                {contractor.specialty ? (
                  <Chip label={contractor.specialty} size="small" variant="outlined" />
                ) : '-'}
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[contractor.status]}
                  color={statusColors[contractor.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewContractor(contractor)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton 
                    size="small"
                    onClick={() => handleEditContractor(contractor)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                {contractor.status === 'PENDING' && (
                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small"
                      color="error"
                      onClick={() => handleDeleteContractor(contractor)}
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
      <TablePagination
        component="div"
        count={contractorsPagination.total}
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

  if (loading && contractors.length === 0) {
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
          Contratistas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewContractor}
        >
          Nuevo Contratista
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Activos
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.active || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total Pagado
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="info.main">
                {formatCurrency(stats.totalPaid)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Pendiente
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {formatCurrency(stats.totalPending)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nombre, código o RIF..."
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
            <Button fullWidth variant="outlined" onClick={handleSearch}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Contractors List */}
      {isMobile ? renderCards() : renderTable()}

      {contractors.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ContractorIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay contratistas registrados
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewContractor}
            sx={{ mt: 2 }}
          >
            Registrar Primer Contratista
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ContractorList;
