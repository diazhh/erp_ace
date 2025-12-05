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
  School as TrainingIcon,
  Edit as EditIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

import { fetchTrainings, fetchHSECatalogs } from '../../store/slices/hseSlice';

const statusColors = {
  SCHEDULED: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'default',
  POSTPONED: 'secondary',
};

const statusLabels = {
  SCHEDULED: 'Programada',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  POSTPONED: 'Pospuesta',
};

const typeLabels = {
  INDUCTION: 'Inducción',
  SAFETY: 'Seguridad General',
  FIRE_SAFETY: 'Seguridad Contra Incendios',
  FIRST_AID: 'Primeros Auxilios',
  PPE: 'Uso de EPP',
  HAZMAT: 'Materiales Peligrosos',
  HEIGHTS: 'Trabajo en Alturas',
  CONFINED_SPACES: 'Espacios Confinados',
  ELECTRICAL: 'Seguridad Eléctrica',
  ERGONOMICS: 'Ergonomía',
  ENVIRONMENTAL: 'Ambiental',
  DEFENSIVE_DRIVING: 'Manejo Defensivo',
  EQUIPMENT_OPERATION: 'Operación de Equipos',
  EMERGENCY_RESPONSE: 'Respuesta a Emergencias',
  OTHER: 'Otra',
};

const TrainingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { trainings, trainingsPagination, trainingsLoading, catalogs } = useSelector(
    (state) => state.hse
  );

  const [filters, setFilters] = useState({
    trainingType: '',
    status: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (!catalogs) dispatch(fetchHSECatalogs());
    loadTrainings();
  }, [dispatch, page, rowsPerPage, filters.trainingType, filters.status]);

  const loadTrainings = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.trainingType && { trainingType: filters.trainingType }),
      ...(filters.status && { status: filters.status }),
    };
    dispatch(fetchTrainings(params));
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  // Card view for mobile
  const renderCards = () => (
    <Grid container spacing={2}>
      {trainings.map((training) => (
        <Grid item xs={12} sm={6} key={training.id}>
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
                    {training.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {typeLabels[training.trainingType] || training.trainingType}
                  </Typography>
                </Box>
                <Chip
                  label={statusLabels[training.status] || training.status}
                  color={statusColors[training.status]}
                  size="small"
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 1 }}>
                {training.title}
              </Typography>

              {training.instructor && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  👨‍🏫 {training.instructor.firstName} {training.instructor.lastName}
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  📅 {formatDate(training.scheduledDate)}
                </Typography>
                {training.durationHours && (
                  <Typography variant="caption" color="text.secondary">
                    ⏱️ {training.durationHours}h
                  </Typography>
                )}
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/hse/trainings/${training.id}`)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              {training.status !== 'COMPLETED' && (
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => navigate(`/hse/trainings/${training.id}/edit`)}
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
            <TableCell>Instructor</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Duración</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trainings.map((training) => (
            <TableRow key={training.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {training.code}
                </Typography>
              </TableCell>
              <TableCell>
                {typeLabels[training.trainingType] || training.trainingType}
              </TableCell>
              <TableCell>{training.title}</TableCell>
              <TableCell>
                {training.instructor
                  ? `${training.instructor.firstName} ${training.instructor.lastName}`
                  : training.externalInstructor || '-'}
              </TableCell>
              <TableCell>{formatDate(training.scheduledDate)}</TableCell>
              <TableCell>{training.durationHours ? `${training.durationHours}h` : '-'}</TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[training.status] || training.status}
                  color={statusColors[training.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/hse/trainings/${training.id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                {training.status !== 'COMPLETED' && (
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => navigate(`/hse/trainings/${training.id}/edit`)}
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
        count={trainingsPagination?.total || 0}
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
            Capacitaciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión de capacitaciones de seguridad
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/hse/trainings/new')}
        >
          Nueva Capacitación
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
              value={filters.trainingType}
              onChange={(e) => setFilters({ ...filters, trainingType: e.target.value })}
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
      {trainingsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : trainings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <TrainingIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay capacitaciones registradas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/hse/trainings/new')}
            sx={{ mt: 2 }}
          >
            Programar Primera Capacitación
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

export default TrainingList;
