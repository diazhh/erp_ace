import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Tooltip,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Build as MaintenanceIcon,
  Clear as ClearIcon,
  CheckCircle as CompleteIcon,
} from '@mui/icons-material';
import { fetchMaintenances, fetchFleetCatalogs, completeMaintenance } from '../../store/slices/fleetSlice';

const statusColors = {
  SCHEDULED: 'default',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const statusLabels = {
  SCHEDULED: 'Programado',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const MaintenanceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { maintenances, maintenancesPagination, catalogs, loading, error } = useSelector(
    (state) => state.fleet
  );

  const [filters, setFilters] = useState({
    status: '',
    maintenanceType: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchFleetCatalogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMaintenances(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', maintenanceType: '', page: 1 });
  };

  const handleComplete = async (id) => {
    if (window.confirm('¿Marcar este mantenimiento como completado?')) {
      await dispatch(completeMaintenance({ id, data: { completedDate: new Date().toISOString().split('T')[0] } }));
      dispatch(fetchMaintenances(filters));
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const renderFilters = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.status}
              label="Estado"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {catalogs?.maintenanceStatuses?.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={filters.maintenanceType}
              label="Tipo"
              onChange={(e) => handleFilterChange('maintenanceType', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {catalogs?.maintenanceTypes?.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            fullWidth
          >
            Limpiar
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/fleet/maintenances/new')}
            fullWidth
          >
            Nuevo
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderMobileCard = (maintenance) => (
    <Card key={maintenance.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {maintenance.code}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {maintenance.vehicle?.plate} - {maintenance.vehicle?.brand} {maintenance.vehicle?.model}
            </Typography>
          </Box>
          <Chip
            label={statusLabels[maintenance.status]}
            color={statusColors[maintenance.status]}
            size="small"
          />
        </Box>
        <Typography variant="body2">{maintenance.description?.substring(0, 80)}...</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {formatDate(maintenance.scheduledDate)}
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {formatCurrency(maintenance.totalCost)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/fleet/maintenances/${maintenance.id}`)}>
          Ver
        </Button>
        {maintenance.status !== 'COMPLETED' && maintenance.status !== 'CANCELLED' && (
          <Button size="small" color="success" startIcon={<CompleteIcon />} onClick={() => handleComplete(maintenance.id)}>
            Completar
          </Button>
        )}
      </CardActions>
    </Card>
  );

  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Vehículo</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell align="right">Costo</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(8)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : maintenances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography color="text.secondary" sx={{ py: 3 }}>
                  No se encontraron mantenimientos
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            maintenances.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {m.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  {m.vehicle?.plate} - {m.vehicle?.brand} {m.vehicle?.model}
                </TableCell>
                <TableCell>
                  {catalogs?.maintenanceTypes?.find((t) => t.value === m.maintenanceType)?.label || m.maintenanceType}
                </TableCell>
                <TableCell>{m.description?.substring(0, 40)}...</TableCell>
                <TableCell>{formatDate(m.completedDate || m.scheduledDate)}</TableCell>
                <TableCell align="right">{formatCurrency(m.totalCost)}</TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[m.status]}
                    color={statusColors[m.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver detalle">
                    <IconButton size="small" onClick={() => navigate(`/fleet/maintenances/${m.id}`)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => navigate(`/fleet/maintenances/${m.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {m.status !== 'COMPLETED' && m.status !== 'CANCELLED' && (
                    <Tooltip title="Completar">
                      <IconButton size="small" color="success" onClick={() => handleComplete(m.id)}>
                        <CompleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <MaintenanceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Mantenimientos
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {renderFilters()}

      {isMobile ? (
        <Box>
          {loading
            ? [...Array(3)].map((_, i) => (
                <Card key={i} sx={{ mb: 2 }}>
                  <CardContent>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="80%" />
                  </CardContent>
                </Card>
              ))
            : maintenances.map(renderMobileCard)}
        </Box>
      ) : (
        renderTable()
      )}

      {maintenancesPagination && maintenancesPagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={maintenancesPagination.totalPages}
            page={filters.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default MaintenanceList;
