import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  DirectionsCar as CarIcon,
  LocalGasStation as FuelIcon,
  Build as MaintenanceIcon,
  Warning as WarningIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { fetchVehicles, fetchFleetCatalogs, fetchFleetStats } from '../../store/slices/fleetSlice';

const statusColors = {
  AVAILABLE: 'success',
  ASSIGNED: 'primary',
  IN_MAINTENANCE: 'warning',
  OUT_OF_SERVICE: 'error',
  SOLD: 'default',
};

const statusLabels = {
  AVAILABLE: 'Disponible',
  ASSIGNED: 'Asignado',
  IN_MAINTENANCE: 'En Mantenimiento',
  OUT_OF_SERVICE: 'Fuera de Servicio',
  SOLD: 'Vendido',
};

const VehicleList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { vehicles, vehiclesPagination, catalogs, stats, loading, error } = useSelector(
    (state) => state.fleet
  );

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    vehicleType: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchFleetCatalogs());
    dispatch(fetchFleetStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchVehicles(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', status: '', vehicleType: '', page: 1 });
  };

  const renderStatsCards = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <CarIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.totalVehicles || 0}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Vehículos
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Chip label="Disponible" color="success" size="small" sx={{ mb: 1 }} />
            <Typography variant="h4">{stats?.availableVehicles || 0}</Typography>
            <Typography variant="body2" color="text.secondary">
              Disponibles
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <MaintenanceIcon color="warning" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.pendingMaintenances || 0}</Typography>
            <Typography variant="body2" color="text.secondary">
              Mant. Pendientes
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <WarningIcon color="error" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.expiringDocuments || 0}</Typography>
            <Typography variant="body2" color="text.secondary">
              Doc. por Vencer
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderFilters = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por código, placa, marca..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.status}
              label="Estado"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {catalogs?.vehicleStatuses?.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={filters.vehicleType}
              label="Tipo"
              onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {catalogs?.vehicleTypes?.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            fullWidth
          >
            Limpiar
          </Button>
        </Grid>
        <Grid item xs={6} md={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/fleet/vehicles/new')}
            fullWidth
          >
            Nuevo
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderMobileCard = (vehicle) => (
    <Card key={vehicle.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {vehicle.plate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {vehicle.code}
            </Typography>
          </Box>
          <Chip
            label={statusLabels[vehicle.status]}
            color={statusColors[vehicle.status]}
            size="small"
          />
        </Box>
        <Typography variant="body1">
          {vehicle.brand} {vehicle.model} ({vehicle.year})
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FuelIcon fontSize="small" color="action" />
            <Typography variant="body2">{vehicle.mileage?.toLocaleString()} km</Typography>
          </Box>
        </Box>
        {vehicle.assignments?.[0]?.employee && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            Asignado a: {vehicle.assignments[0].employee.firstName} {vehicle.assignments[0].employee.lastName}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/fleet/vehicles/${vehicle.id}`)}>
          Ver
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/fleet/vehicles/${vehicle.id}/edit`)}>
          Editar
        </Button>
      </CardActions>
    </Card>
  );

  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Placa</TableCell>
            <TableCell>Vehículo</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="right">Kilometraje</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Asignado a</TableCell>
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
          ) : vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography color="text.secondary" sx={{ py: 3 }}>
                  No se encontraron vehículos
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {vehicle.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {vehicle.plate}
                  </Typography>
                </TableCell>
                <TableCell>
                  {vehicle.brand} {vehicle.model} ({vehicle.year})
                </TableCell>
                <TableCell>
                  {catalogs?.vehicleTypes?.find((t) => t.value === vehicle.vehicleType)?.label || vehicle.vehicleType}
                </TableCell>
                <TableCell align="right">{vehicle.mileage?.toLocaleString()} km</TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[vehicle.status]}
                    color={statusColors[vehicle.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {vehicle.assignments?.[0]?.employee ? (
                    <Typography variant="body2">
                      {vehicle.assignments[0].employee.firstName} {vehicle.assignments[0].employee.lastName}
                    </Typography>
                  ) : vehicle.assignments?.[0]?.project ? (
                    <Typography variant="body2">{vehicle.assignments[0].project.name}</Typography>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver detalle">
                    <IconButton size="small" onClick={() => navigate(`/fleet/vehicles/${vehicle.id}`)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => navigate(`/fleet/vehicles/${vehicle.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
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
          <CarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Flota de Vehículos
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {renderStatsCards()}
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
            : vehicles.map(renderMobileCard)}
        </Box>
      ) : (
        renderTable()
      )}

      {vehiclesPagination && vehiclesPagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={vehiclesPagination.totalPages}
            page={filters.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default VehicleList;
