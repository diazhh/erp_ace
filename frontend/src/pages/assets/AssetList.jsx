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
  Inventory as AssetIcon,
  Build as MaintenanceIcon,
  SwapHoriz as TransferIcon,
  TrendingDown as DepreciationIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { fetchAssets, fetchAssetCatalogs, fetchAssetStats, fetchAssetCategories } from '../../store/slices/assetSlice';

const statusColors = {
  ACTIVE: 'success',
  IN_MAINTENANCE: 'warning',
  STORED: 'info',
  DISPOSED: 'default',
  SOLD: 'default',
  LOST: 'error',
  DAMAGED: 'error',
};

const statusLabels = {
  ACTIVE: 'Activo',
  IN_MAINTENANCE: 'En Mantenimiento',
  STORED: 'Almacenado',
  DISPOSED: 'Dado de Baja',
  SOLD: 'Vendido',
  LOST: 'Perdido',
  DAMAGED: 'Dañado',
};

const conditionLabels = {
  EXCELLENT: 'Excelente',
  GOOD: 'Bueno',
  FAIR: 'Regular',
  POOR: 'Malo',
};

const AssetList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { assets, assetsPagination, catalogs, stats, categories, loading, error } = useSelector(
    (state) => state.assets
  );

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    categoryId: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchAssetCatalogs());
    dispatch(fetchAssetStats());
    dispatch(fetchAssetCategories({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAssets(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', status: '', categoryId: '', page: 1 });
  };

  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const renderStatsCards = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <AssetIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.totalAssets || 0}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Activos
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Chip label="Activos" color="success" size="small" sx={{ mb: 1 }} />
            <Typography variant="h4">{stats?.activeAssets || 0}</Typography>
            <Typography variant="body2" color="text.secondary">
              En Uso
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <DepreciationIcon color="info" sx={{ fontSize: 32 }} />
            <Typography variant="h6">{formatCurrency(stats?.totalBookValue)}</Typography>
            <Typography variant="body2" color="text.secondary">
              Valor en Libros
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
    </Grid>
  );

  const renderFilters = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por código, nombre, serie..."
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
              {catalogs?.assetStatuses?.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Categoría</InputLabel>
            <Select
              value={filters.categoryId}
              label="Categoría"
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories?.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
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
            onClick={() => navigate('/assets/new')}
            fullWidth
          >
            Nuevo
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderMobileCard = (asset) => (
    <Card key={asset.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {asset.code}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {asset.category?.name}
            </Typography>
          </Box>
          <Chip
            label={statusLabels[asset.status]}
            color={statusColors[asset.status]}
            size="small"
          />
        </Box>
        <Typography variant="body1">{asset.name}</Typography>
        {asset.brand && (
          <Typography variant="body2" color="text.secondary">
            {asset.brand} {asset.model}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">
            Valor: {formatCurrency(asset.bookValue, asset.currency)}
          </Typography>
          <Chip label={conditionLabels[asset.condition]} size="small" variant="outlined" />
        </Box>
        {asset.assignedToEmployee && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            Asignado a: {asset.assignedToEmployee.firstName} {asset.assignedToEmployee.lastName}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/assets/${asset.id}`)}>
          Ver
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/assets/${asset.id}/edit`)}>
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
            <TableCell>Nombre</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Marca/Modelo</TableCell>
            <TableCell align="right">Valor en Libros</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Condición</TableCell>
            <TableCell>Asignado a</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(9)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : assets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography color="text.secondary" sx={{ py: 3 }}>
                  No se encontraron activos
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            assets.map((asset) => (
              <TableRow key={asset.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {asset.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{asset.name}</Typography>
                  {asset.serialNumber && (
                    <Typography variant="caption" color="text.secondary">
                      S/N: {asset.serialNumber}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{asset.category?.name}</TableCell>
                <TableCell>
                  {asset.brand} {asset.model}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(asset.bookValue, asset.currency)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[asset.status]}
                    color={statusColors[asset.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip label={conditionLabels[asset.condition]} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  {asset.assignedToEmployee ? (
                    <Typography variant="body2">
                      {asset.assignedToEmployee.firstName} {asset.assignedToEmployee.lastName}
                    </Typography>
                  ) : asset.assignedToProject ? (
                    <Typography variant="body2">{asset.assignedToProject.name}</Typography>
                  ) : asset.assignedToDepartment ? (
                    <Typography variant="body2">{asset.assignedToDepartment.name}</Typography>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver detalle">
                    <IconButton size="small" onClick={() => navigate(`/assets/${asset.id}`)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => navigate(`/assets/${asset.id}/edit`)}>
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
          <AssetIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Activos Fijos
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
            : assets.map(renderMobileCard)}
        </Box>
      ) : (
        renderTable()
      )}

      {assetsPagination && assetsPagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={assetsPagination.totalPages}
            page={filters.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default AssetList;
