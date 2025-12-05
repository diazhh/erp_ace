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
  MenuItem,
  InputAdornment,
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
  CheckCircle as InspectionIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { fetchInspections, fetchHSECatalogs } from '../../store/slices/hseSlice';

const statusColors = {
  SCHEDULED: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'default',
};

const statusLabels = {
  SCHEDULED: 'Programada',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const typeLabels = {
  WORKPLACE: 'Lugar de Trabajo',
  EQUIPMENT: 'Equipos',
  VEHICLE: 'Vehículos',
  FIRE_SAFETY: 'Seguridad Contra Incendios',
  ELECTRICAL: 'Eléctrica',
  PPE: 'EPP',
  ENVIRONMENTAL: 'Ambiental',
  ERGONOMIC: 'Ergonómica',
  HOUSEKEEPING: 'Orden y Limpieza',
  WAREHOUSE: 'Almacén',
  PROJECT_SITE: 'Sitio de Proyecto',
  OTHER: 'Otra',
};

const resultColors = {
  SATISFACTORY: 'success',
  NEEDS_IMPROVEMENT: 'warning',
  UNSATISFACTORY: 'error',
};

const resultLabels = {
  SATISFACTORY: 'Satisfactorio',
  NEEDS_IMPROVEMENT: 'Necesita Mejoras',
  UNSATISFACTORY: 'No Satisfactorio',
};

const InspectionList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { inspections, inspectionsPagination, inspectionsLoading, catalogs } = useSelector(
    (state) => state.hse
  );

  const [filters, setFilters] = useState({
    inspectionType: '',
    status: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (!catalogs) dispatch(fetchHSECatalogs());
    loadInspections();
  }, [dispatch, page, rowsPerPage, filters.inspectionType, filters.status]);

  const loadInspections = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.inspectionType && { inspectionType: filters.inspectionType }),
      ...(filters.status && { status: filters.status }),
    };
    dispatch(fetchInspections(params));
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  // Card view for mobile
  const renderCards = () => (
    <Grid container spacing={2}>
      {inspections.map((inspection) => (
        <Grid item xs={12} sm={6} key={inspection.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {inspection.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {typeLabels[inspection.inspectionType] || inspection.inspectionType}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <Chip
                    label={statusLabels[inspection.status] || inspection.status}
                    color={statusColors[inspection.status]}
                    size="small"
                  />
                  {inspection.result && (
                    <Chip
                      label={resultLabels[inspection.result] || inspection.result}
                      color={resultColors[inspection.result]}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 1 }}>
                {inspection.title}
              </Typography>

              {inspection.inspector && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  👤 {inspection.inspector.firstName} {inspection.inspector.lastName}
                </Typography>
              )}

              <Typography variant="caption" color="text.secondary">
                Fecha: {formatDate(inspection.scheduledDate)}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/hse/inspections/${inspection.id}`)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              {inspection.status !== 'COMPLETED' && (
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => navigate(`/hse/inspections/${inspection.id}/edit`)}
                  >
                    <EditIcon />
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
            <TableCell>Inspector</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Resultado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inspections.map((inspection) => (
            <TableRow key={inspection.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {inspection.code}
                </Typography>
              </TableCell>
              <TableCell>
                {typeLabels[inspection.inspectionType] || inspection.inspectionType}
              </TableCell>
              <TableCell>{inspection.title}</TableCell>
              <TableCell>
                {inspection.inspector
                  ? `${inspection.inspector.firstName} ${inspection.inspector.lastName}`
                  : '-'}
              </TableCell>
              <TableCell>{formatDate(inspection.scheduledDate)}</TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[inspection.status] || inspection.status}
                  color={statusColors[inspection.status]}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {inspection.result ? (
                  <Chip
                    label={resultLabels[inspection.result] || inspection.result}
                    color={resultColors[inspection.result]}
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/hse/inspections/${inspection.id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                {inspection.status !== 'COMPLETED' && (
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => navigate(`/hse/inspections/${inspection.id}/edit`)}
                    >
                      <EditIcon />
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
        count={inspectionsPagination?.total || 0}
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

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Inspecciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión de inspecciones de seguridad
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/hse/inspections/new')}
        >
          Nueva Inspección
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Tipo"
              value={filters.inspectionType}
              onChange={(e) => setFilters({ ...filters, inspectionType: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(typeLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Estado"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {inspectionsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : inspections.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <InspectionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay inspecciones registradas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/hse/inspections/new')}
            sx={{ mt: 2 }}
          >
            Programar Primera Inspección
          </Button>
        </Paper>
      ) : isMobile ? (
        renderCards()
      ) : (
        renderTable()
      )}
    </Box>
  );
};

export default InspectionList;
