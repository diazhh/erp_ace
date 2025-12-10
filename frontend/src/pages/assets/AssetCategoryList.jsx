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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import {
  fetchAssetCategories,
  createAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
  fetchAssetCatalogs,
} from '../../store/slices/assetSlice';

const AssetCategoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { categories, categoriesPagination, catalogs, loading, error } = useSelector(
    (state) => state.assets
  );

  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    parentId: '',
    defaultDepreciationMethod: 'STRAIGHT_LINE',
    defaultUsefulLifeYears: 5,
    defaultSalvageValuePercent: 10,
    isActive: true,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAssetCatalogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAssetCategories(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', isActive: '' });
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      parentId: '',
      defaultDepreciationMethod: 'STRAIGHT_LINE',
      defaultUsefulLifeYears: 5,
      defaultSalvageValuePercent: 10,
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setFormData({
      code: category.code,
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || '',
      defaultDepreciationMethod: category.defaultDepreciationMethod,
      defaultUsefulLifeYears: category.defaultUsefulLifeYears || 5,
      defaultSalvageValuePercent: category.defaultSalvageValuePercent || 10,
      isActive: category.isActive,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        parentId: formData.parentId || null,
        defaultUsefulLifeYears: parseInt(formData.defaultUsefulLifeYears),
        defaultSalvageValuePercent: parseFloat(formData.defaultSalvageValuePercent),
      };

      if (editingCategory) {
        await dispatch(updateAssetCategory({ id: editingCategory.id, data })).unwrap();
      } else {
        await dispatch(createAssetCategory(data)).unwrap();
      }
      setDialogOpen(false);
      dispatch(fetchAssetCategories(filters));
    } catch (err) {
      console.error('Error saving category:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteAssetCategory(categoryToDelete.id)).unwrap();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const renderFilters = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por código o nombre..."
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
              value={filters.isActive}
              label="Estado"
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Activas</MenuItem>
              <MenuItem value="false">Inactivas</MenuItem>
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
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            fullWidth
          >
            Nueva Categoría
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderMobileCard = (category) => (
    <Card key={category.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {category.code}
            </Typography>
            <Typography variant="body1">{category.name}</Typography>
          </Box>
          <Chip
            label={category.isActive ? 'Activa' : 'Inactiva'}
            color={category.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>
        {category.description && (
          <Typography variant="body2" color="text.secondary">
            {category.description}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 1 }}>
          Vida útil: {category.defaultUsefulLifeYears} años | Residual: {category.defaultSalvageValuePercent}%
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<EditIcon />} onClick={() => openEditDialog(category)}>
          Editar
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => {
            setCategoryToDelete(category);
            setDeleteDialogOpen(true);
          }}
        >
          Eliminar
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
            <TableCell>Categoría Padre</TableCell>
            <TableCell>Método Deprec.</TableCell>
            <TableCell align="center">Vida Útil</TableCell>
            <TableCell align="center">% Residual</TableCell>
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
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography color="text.secondary" sx={{ py: 3 }}>
                  No se encontraron categorías
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {category.code}
                  </Typography>
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.parent?.name || '-'}</TableCell>
                <TableCell>
                  {catalogs?.depreciationMethods?.find((m) => m.value === category.defaultDepreciationMethod)?.label}
                </TableCell>
                <TableCell align="center">{category.defaultUsefulLifeYears} años</TableCell>
                <TableCell align="center">{category.defaultSalvageValuePercent}%</TableCell>
                <TableCell>
                  <Chip
                    label={category.isActive ? 'Activa' : 'Inactiva'}
                    color={category.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => openEditDialog(category)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setCategoryToDelete(category);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
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
          <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Categorías de Activos
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
                  </CardContent>
                </Card>
              ))
            : categories.map(renderMobileCard)}
        </Box>
      ) : (
        renderTable()
      )}

      {/* Dialog para crear/editar categoría */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Código"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={!!editingCategory}
                helperText={!editingCategory ? 'Se genera automáticamente si se deja vacío' : ''}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                required
                label="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Categoría Padre</InputLabel>
                <Select
                  value={formData.parentId}
                  label="Categoría Padre"
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                >
                  <MenuItem value="">Sin padre (categoría raíz)</MenuItem>
                  {categories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Método de Depreciación</InputLabel>
                <Select
                  value={formData.defaultDepreciationMethod}
                  label="Método de Depreciación"
                  onChange={(e) => setFormData({ ...formData, defaultDepreciationMethod: e.target.value })}
                >
                  {catalogs?.depreciationMethods?.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Vida Útil (años)"
                value={formData.defaultUsefulLifeYears}
                onChange={(e) => setFormData({ ...formData, defaultUsefulLifeYears: e.target.value })}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="% Residual"
                value={formData.defaultSalvageValuePercent}
                onChange={(e) => setFormData({ ...formData, defaultSalvageValuePercent: e.target.value })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.isActive}
                  label="Estado"
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                >
                  <MenuItem value={true}>Activa</MenuItem>
                  <MenuItem value={false}>Inactiva</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingCategory ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar la categoría "{categoryToDelete?.name}"?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer. La categoría no debe tener activos ni subcategorías asociadas.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetCategoryList;
