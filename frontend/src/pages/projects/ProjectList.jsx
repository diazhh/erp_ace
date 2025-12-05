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
  LinearProgress,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FolderOpen as ProjectIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchProjects, fetchProjectStats, deleteProject } from '../../store/slices/projectSlice';

const statusColors = {
  PLANNING: 'info',
  IN_PROGRESS: 'primary',
  ON_HOLD: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const statusLabels = {
  PLANNING: 'Planificación',
  IN_PROGRESS: 'En Progreso',
  ON_HOLD: 'En Espera',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const priorityColors = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'error',
};

const priorityLabels = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

const executionTypeLabels = {
  INTERNAL: 'Interno',
  OUTSOURCED: 'Contratado',
};

const executionTypeColors = {
  INTERNAL: 'info',
  OUTSOURCED: 'secondary',
};

const ProjectList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { projects, projectsPagination, stats, loading } = useSelector((state) => state.projects);
  
  const [filters, setFilters] = useState({
    search: '',
    executionType: '',
    status: '',
    priority: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadProjects();
    dispatch(fetchProjectStats());
  }, [dispatch, page, rowsPerPage, filters.executionType, filters.status, filters.priority]);

  const loadProjects = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.search && { search: filters.search }),
      ...(filters.executionType && { executionType: filters.executionType }),
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
    };
    dispatch(fetchProjects(params));
  };

  const handleSearch = () => {
    setPage(0);
    loadProjects();
  };

  const handleNewProject = () => {
    navigate('/projects/new');
  };

  const handleViewProject = (project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleEditProject = (project) => {
    navigate(`/projects/${project.id}/edit`);
  };

  const handleDeleteProject = async (project) => {
    if (window.confirm(`¿Está seguro de eliminar el proyecto "${project.name}"?`)) {
      try {
        await dispatch(deleteProject(project.id)).unwrap();
        toast.success('Proyecto eliminado');
        loadProjects();
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

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'error';
  };

  // Card view for mobile
  const renderCards = () => (
    <Grid container spacing={2}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} key={project.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ProjectIcon color="primary" />
                  <Box>
                    <Typography variant="h6" fontWeight="medium">
                      {project.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {project.code}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
                  <Chip
                    label={executionTypeLabels[project.executionType] || 'Interno'}
                    color={executionTypeColors[project.executionType] || 'info'}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={statusLabels[project.status]}
                    color={statusColors[project.status]}
                    size="small"
                  />
                  <Chip
                    label={priorityLabels[project.priority]}
                    color={priorityColors[project.priority]}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              {project.clientName && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {project.clientName}
                  </Typography>
                </Box>
              )}

              {project.manager && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {project.manager.firstName} {project.manager.lastName}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ScheduleIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Progreso
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={project.progress} 
                  color={getProgressColor(project.progress)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {project.budget && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Presupuesto
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {formatCurrency(project.budget, project.currency)}
                  </Typography>
                </Box>
              )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewProject(project)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton 
                  size="small"
                  onClick={() => handleEditProject(project)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              {project.status === 'PLANNING' && (
                <Tooltip title="Eliminar">
                  <IconButton 
                    size="small"
                    color="error"
                    onClick={() => handleDeleteProject(project)}
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
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Prioridad</TableCell>
            <TableCell>Progreso</TableCell>
            <TableCell>Presupuesto</TableCell>
            <TableCell>Fechas</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {project.code}
                </Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {project.name}
                  </Typography>
                  {project.manager && (
                    <Typography variant="caption" color="text.secondary">
                      {project.manager.firstName} {project.manager.lastName}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={executionTypeLabels[project.executionType] || 'Interno'}
                  color={executionTypeColors[project.executionType] || 'info'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{project.clientName || '-'}</TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[project.status]}
                  color={statusColors[project.status]}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={priorityLabels[project.priority]}
                  color={priorityColors[project.priority]}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={project.progress} 
                    color={getProgressColor(project.progress)}
                    sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" sx={{ minWidth: 35 }}>
                    {project.progress}%
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {project.budget ? formatCurrency(project.budget, project.currency) : '-'}
              </TableCell>
              <TableCell>
                <Typography variant="caption">
                  {formatDate(project.startDate)}
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(project.endDate)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewProject(project)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton 
                    size="small"
                    onClick={() => handleEditProject(project)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                {project.status === 'PLANNING' && (
                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small"
                      color="error"
                      onClick={() => handleDeleteProject(project)}
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
        count={projectsPagination.total}
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

  if (loading && projects.length === 0) {
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
          Proyectos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewProject}
        >
          Nuevo Proyecto
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Activos
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Atrasados
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={stats.delayed > 0 ? 'error.main' : 'text.primary'}>
                {stats.delayed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Presupuesto
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="info.main">
                {formatCurrency(stats.financial?.totalBudget)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Costo Real
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {formatCurrency(stats.financial?.totalActualCost)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Ganancia
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={stats.financial?.totalProfit >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(stats.financial?.totalProfit)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nombre, código o cliente..."
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
              label="Tipo"
              value={filters.executionType}
              onChange={(e) => setFilters({ ...filters, executionType: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(executionTypeLabels).map(([key, label]) => (
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
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Prioridad"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <MenuItem value="">Todas</MenuItem>
              {Object.entries(priorityLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={1}>
            <Button fullWidth variant="outlined" onClick={handleSearch}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Projects List */}
      {isMobile ? renderCards() : renderTable()}

      {projects.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ProjectIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay proyectos registrados
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewProject}
            sx={{ mt: 2 }}
          >
            Crear Primer Proyecto
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ProjectList;
