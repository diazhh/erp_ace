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
  FindInPage as InspectionIcon,
} from '@mui/icons-material';
import { fetchInspections, deleteInspection } from '../../store/slices/qualitySlice';
import ConfirmDialog from "../../components/ConfirmDialog";

const resultColors = {
  PENDING: 'default',
  PASS: 'success',
  FAIL: 'error',
  CONDITIONAL: 'warning',
};

const resultLabels = {
  PENDING: 'Pendiente',
  PASS: 'Aprobada',
  FAIL: 'Fallida',
  CONDITIONAL: 'Condicional',
};

const typeLabels = {
  RECEIVING: 'Recepción',
  IN_PROCESS: 'En Proceso',
  FINAL: 'Final',
  DIMENSIONAL: 'Dimensional',
  VISUAL: 'Visual',
  FUNCTIONAL: 'Funcional',
  DESTRUCTIVE: 'Destructiva',
  NON_DESTRUCTIVE: 'No Destructiva',
};

const InspectionList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { inspections, loading, error } = useSelector((state) => state.quality);

  const [filters, setFilters] = useState({
    search: '',
    result: '',
    inspectionType: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchInspections(filters));
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
      await dispatch(deleteInspection(itemToDelete.id));
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
          <Typography variant="subtitle1" fontWeight="bold">
            {item.code}
          </Typography>
          <Chip label={resultLabels[item.result]} color={resultColors[item.result]} size="small" />
        </Box>
        <Typography variant="body1" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tipo: {typeLabels[item.inspectionType] || item.inspectionType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Proyecto: {item.project?.name || '-'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fecha: {formatDate(item.inspectionDate)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/quality/inspections/${item.id}`)}>
          Ver
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/quality/inspections/${item.id}/edit`)}>
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
          <InspectionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Inspecciones de Calidad
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/quality/inspections/new')}>
          Nueva Inspección
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
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
              <InputLabel>Resultado</InputLabel>
              <Select
                value={filters.result}
                label="Resultado"
                onChange={(e) => handleFilterChange('result', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="PASS">Aprobada</MenuItem>
                <MenuItem value="FAIL">Fallida</MenuItem>
                <MenuItem value="CONDITIONAL">Condicional</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.inspectionType}
                label="Tipo"
                onChange={(e) => handleFilterChange('inspectionType', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="RECEIVING">Recepción</MenuItem>
                <MenuItem value="IN_PROCESS">En Proceso</MenuItem>
                <MenuItem value="FINAL">Final</MenuItem>
                <MenuItem value="VISUAL">Visual</MenuItem>
                <MenuItem value="DIMENSIONAL">Dimensional</MenuItem>
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
          {inspections.length === 0 ? (
            <Alert severity="info">No se encontraron inspecciones</Alert>
          ) : (
            inspections.map(renderMobileCard)
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
                <TableCell>Proyecto</TableCell>
                <TableCell>Resultado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Inspector</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inspections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">No se encontraron inspecciones</TableCell>
                </TableRow>
              ) : (
                inspections.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell><Typography fontWeight="bold">{item.code}</Typography></TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{typeLabels[item.inspectionType] || item.inspectionType}</TableCell>
                    <TableCell>{item.project?.name || '-'}</TableCell>
                    <TableCell><Chip label={resultLabels[item.result]} color={resultColors[item.result]} size="small" /></TableCell>
                    <TableCell>{formatDate(item.inspectionDate)}</TableCell>
                    <TableCell>{item.inspector ? `${item.inspector.firstName} ${item.inspector.lastName}` : '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => navigate(`/quality/inspections/${item.id}`)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => navigate(`/quality/inspections/${item.id}/edit`)}>
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
        title="Eliminar Inspección"
        message={`¿Está seguro de eliminar la inspección "${itemToDelete?.code}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default InspectionList;
