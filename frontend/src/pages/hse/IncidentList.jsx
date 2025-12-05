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
  Warning as IncidentIcon,
} from '@mui/icons-material';

import { fetchIncidents, fetchHSECatalogs } from '../../store/slices/hseSlice';

const severityColors = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'error',
  CRITICAL: 'secondary',
};

const statusColors = {
  REPORTED: 'warning',
  INVESTIGATING: 'info',
  PENDING_ACTIONS: 'primary',
  IN_PROGRESS: 'info',
  CLOSED: 'success',
  CANCELLED: 'default',
};

const IncidentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { incidents, incidentsPagination, incidentsLoading, catalogs } = useSelector((state) => state.hse);
  
  const [filters, setFilters] = useState({
    incidentType: '',
    severity: '',
    status: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (!catalogs) dispatch(fetchHSECatalogs());
    loadIncidents();
  }, [dispatch, page, rowsPerPage, filters.incidentType, filters.severity, filters.status]);

  const loadIncidents = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.incidentType && { incidentType: filters.incidentType }),
      ...(filters.severity && { severity: filters.severity }),
      ...(filters.status && { status: filters.status }),
    };
    dispatch(fetchIncidents(params));
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const getTypeName = (code) => {
    return catalogs?.incidentTypes?.find(t => t.code === code)?.name || code;
  };

  const getSeverityName = (code) => {
    return catalogs?.severities?.find(s => s.code === code)?.name || code;
  };

  const getStatusName = (code) => {
    return catalogs?.incidentStatuses?.find(s => s.code === code)?.name || code;
  };

  // Card view for mobile
  const renderCards = () => (
    <Grid container spacing={2}>
      {incidents.map((incident) => (
        <Grid item xs={12} sm={6} key={incident.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {incident.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getTypeName(incident.incidentType)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Chip
                    label={getSeverityName(incident.severity)}
                    color={severityColors[incident.severity]}
                    size="small"
                  />
                  <Chip
                    label={getStatusName(incident.status)}
                    color={statusColors[incident.status]}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 1 }}>
                {incident.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                📍 {incident.location}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Fecha: {formatDate(incident.incidentDate)}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => navigate(`/hse/incidents/${incident.id}`)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
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
            <TableCell>Ubicación</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Severidad</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {incident.code}
                </Typography>
              </TableCell>
              <TableCell>{getTypeName(incident.incidentType)}</TableCell>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                  {incident.title}
                </Typography>
              </TableCell>
              <TableCell>{incident.location}</TableCell>
              <TableCell>{formatDate(incident.incidentDate)}</TableCell>
              <TableCell>
                <Chip
                  label={getSeverityName(incident.severity)}
                  color={severityColors[incident.severity]}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusName(incident.status)}
                  color={statusColors[incident.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => navigate(`/hse/incidents/${incident.id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={incidentsPagination.total}
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

  if (incidentsLoading && incidents.length === 0) {
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
          Incidentes
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={() => navigate('/hse/incidents/new')}
        >
          Reportar Incidente
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              select
              label="Tipo"
              value={filters.incidentType}
              onChange={(e) => setFilters({ ...filters, incidentType: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {catalogs?.incidentTypes?.map((type) => (
                <MenuItem key={type.code} value={type.code}>{type.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Severidad"
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            >
              <MenuItem value="">Todas</MenuItem>
              {catalogs?.severities?.map((sev) => (
                <MenuItem key={sev.code} value={sev.code}>{sev.name}</MenuItem>
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
              {catalogs?.incidentStatuses?.map((status) => (
                <MenuItem key={status.code} value={status.code}>{status.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button fullWidth variant="outlined" onClick={loadIncidents}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Incidents List */}
      {isMobile ? renderCards() : renderTable()}

      {incidents.length === 0 && !incidentsLoading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <IncidentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay incidentes registrados
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<AddIcon />}
            onClick={() => navigate('/hse/incidents/new')}
            sx={{ mt: 2 }}
          >
            Reportar Primer Incidente
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default IncidentList;
