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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as NCIcon,
} from '@mui/icons-material';
import { fetchNonConformances, deleteNonConformance } from '../../store/slices/qualitySlice';
import ConfirmDialog from "../../components/ConfirmDialog";

const statusColors = {
  OPEN: 'error',
  UNDER_ANALYSIS: 'warning',
  ACTION_PENDING: 'info',
  IN_PROGRESS: 'primary',
  VERIFICATION: 'secondary',
  CLOSED: 'success',
  CANCELLED: 'default',
};

const statusLabels = {
  OPEN: 'Abierta',
  UNDER_ANALYSIS: 'En Análisis',
  ACTION_PENDING: 'Acción Pendiente',
  IN_PROGRESS: 'En Progreso',
  VERIFICATION: 'En Verificación',
  CLOSED: 'Cerrada',
  CANCELLED: 'Cancelada',
};

const typeColors = {
  MINOR: 'success',
  MAJOR: 'warning',
  CRITICAL: 'error',
};

const typeLabels = {
  MINOR: 'Menor',
  MAJOR: 'Mayor',
  CRITICAL: 'Crítica',
};

const categoryLabels = {
  MATERIAL: 'Material',
  WORKMANSHIP: 'Mano de Obra',
  DOCUMENTATION: 'Documentación',
  PROCESS: 'Proceso',
  EQUIPMENT: 'Equipo',
  DESIGN: 'Diseño',
  OTHER: 'Otro',
};

const NonConformanceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { nonConformances, loading, error } = useSelector((state) => state.quality);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    ncType: '',
    category: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchNonConformances(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      await dispatch(deleteNonConformance(itemToDelete.id));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const renderMobileCard = (item) => (
    <Card key={item.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {item.code}
            </Typography>
            <Chip label={typeLabels[item.ncType]} color={typeColors[item.ncType]} size="small" />
          </Box>
          <Chip label={statusLabels[item.status]} color={statusColors[item.status]} size="small" />
        </Box>
        <Typography variant="body1" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Categoría: {categoryLabels[item.category] || item.category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Proyecto: {item.project?.name || '-'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Detectada: {formatDate(item.detectedDate)}
        </Typography>
        {item.dueDate && (
          <Typography variant="body2" color={new Date(item.dueDate) < new Date() ? 'error.main' : 'text.secondary'}>
            Vence: {formatDate(item.dueDate)}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/quality/non-conformances/${item.id}`)}>
          Ver
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/quality/non-conformances/${item.id}/edit`)}>
          Editar
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(item)}>
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          <NCIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          No Conformidades
        </Typography>
        <Button variant="contained" color="warning" startIcon={<AddIcon />} onClick={() => navigate('/quality/non-conformances/new')}>
          Nueva NC
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por título, código..."
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
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.status}
                label="Estado"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="OPEN">Abierta</MenuItem>
                <MenuItem value="UNDER_ANALYSIS">En Análisis</MenuItem>
                <MenuItem value="ACTION_PENDING">Acción Pendiente</MenuItem>
                <MenuItem value="IN_PROGRESS">En Progreso</MenuItem>
                <MenuItem value="VERIFICATION">En Verificación</MenuItem>
                <MenuItem value="CLOSED">Cerrada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.ncType}
                label="Tipo"
                onChange={(e) => handleFilterChange('ncType', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="MINOR">Menor</MenuItem>
                <MenuItem value="MAJOR">Mayor</MenuItem>
                <MenuItem value="CRITICAL">Crítica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filters.category}
                label="Categoría"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="MATERIAL">Material</MenuItem>
                <MenuItem value="WORKMANSHIP">Mano de Obra</MenuItem>
                <MenuItem value="DOCUMENTATION">Documentación</MenuItem>
                <MenuItem value="PROCESS">Proceso</MenuItem>
                <MenuItem value="EQUIPMENT">Equipo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Box>
          {nonConformances.length === 0 ? (
            <Alert severity="info">No se encontraron no conformidades</Alert>
          ) : (
            nonConformances.map(renderMobileCard)
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Proyecto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Detectada</TableCell>
                <TableCell>Vence</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nonConformances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">No se encontraron no conformidades</TableCell>
                </TableRow>
              ) : (
                nonConformances.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell><Typography fontWeight="bold">{item.code}</Typography></TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell><Chip label={typeLabels[item.ncType]} color={typeColors[item.ncType]} size="small" /></TableCell>
                    <TableCell>{categoryLabels[item.category] || item.category}</TableCell>
                    <TableCell>{item.project?.name || '-'}</TableCell>
                    <TableCell><Chip label={statusLabels[item.status]} color={statusColors[item.status]} size="small" /></TableCell>
                    <TableCell>{formatDate(item.detectedDate)}</TableCell>
                    <TableCell sx={{ color: item.dueDate && new Date(item.dueDate) < new Date() ? 'error.main' : 'inherit' }}>
                      {formatDate(item.dueDate)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => navigate(`/quality/non-conformances/${item.id}`)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => navigate(`/quality/non-conformances/${item.id}/edit`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(item)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar No Conformidad"
        message={`¿Está seguro de eliminar la no conformidad "${itemToDelete?.code}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default NonConformanceList;
