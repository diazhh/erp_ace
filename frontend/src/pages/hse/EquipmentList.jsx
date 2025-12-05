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
  Security as EquipmentIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

import { fetchEquipment, fetchHSECatalogs } from '../../store/slices/hseSlice';

const statusColors = {
  AVAILABLE: 'success',
  ASSIGNED: 'primary',
  IN_USE: 'info',
  MAINTENANCE: 'warning',
  EXPIRED: 'error',
  DAMAGED: 'error',
  DISPOSED: 'default',
};

const statusLabels = {
  AVAILABLE: 'Disponible',
  ASSIGNED: 'Asignado',
  IN_USE: 'En Uso',
  MAINTENANCE: 'Mantenimiento',
  EXPIRED: 'Vencido',
  DAMAGED: 'Dañado',
  DISPOSED: 'Descartado',
};

const typeLabels = {
  HELMET: 'Casco',
  SAFETY_GLASSES: 'Lentes de Seguridad',
  FACE_SHIELD: 'Careta',
  EAR_PLUGS: 'Tapones Auditivos',
  EAR_MUFFS: 'Orejeras',
  RESPIRATOR: 'Respirador',
  DUST_MASK: 'Mascarilla',
  GLOVES: 'Guantes',
  SAFETY_BOOTS: 'Botas de Seguridad',
  SAFETY_VEST: 'Chaleco Reflectivo',
  HARNESS: 'Arnés',
  LANYARD: 'Línea de Vida',
  FIRE_EXTINGUISHER: 'Extintor',
  FIRST_AID_KIT: 'Botiquín',
  SAFETY_CONE: 'Cono de Seguridad',
  SAFETY_TAPE: 'Cinta de Seguridad',
  EMERGENCY_LIGHT: 'Luz de Emergencia',
  SPILL_KIT: 'Kit de Derrames',
  OTHER: 'Otro',
};

const conditionColors = {
  NEW: 'success',
  GOOD: 'info',
  FAIR: 'warning',
  POOR: 'error',
};

const conditionLabels = {
  NEW: 'Nuevo',
  GOOD: 'Bueno',
  FAIR: 'Regular',
  POOR: 'Malo',
};

const EquipmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { equipment, equipmentPagination, equipmentLoading, catalogs } = useSelector(
    (state) => state.hse
  );

  const [filters, setFilters] = useState({
    equipmentType: '',
    status: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (!catalogs) dispatch(fetchHSECatalogs());
    loadEquipment();
  }, [dispatch, page, rowsPerPage, filters.equipmentType, filters.status]);

  const loadEquipment = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(filters.equipmentType && { equipmentType: filters.equipmentType }),
      ...(filters.status && { status: filters.status }),
    };
    dispatch(fetchEquipment(params));
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const expiryDate = new Date(date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  // Card view for mobile
  const renderCards = () => (
    <Grid container spacing={2}>
      {equipment.map((item) => (
        <Grid item xs={12} sm={6} key={item.id}>
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
                    {item.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {typeLabels[item.equipmentType] || item.equipmentType}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
                  <Chip
                    label={statusLabels[item.status] || item.status}
                    color={statusColors[item.status]}
                    size="small"
                  />
                  {isExpired(item.expiryDate) && (
                    <Chip
                      icon={<WarningIcon />}
                      label="Vencido"
                      color="error"
                      size="small"
                    />
                  )}
                  {isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate) && (
                    <Chip
                      icon={<WarningIcon />}
                      label="Por vencer"
                      color="warning"
                      size="small"
                    />
                  )}
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 1 }}>
                {item.name}
              </Typography>

              {item.assignedTo && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  👤 {item.assignedTo.firstName} {item.assignedTo.lastName}
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip
                  label={conditionLabels[item.condition] || item.condition}
                  color={conditionColors[item.condition]}
                  size="small"
                  variant="outlined"
                />
                {item.expiryDate && (
                  <Typography variant="caption" color="text.secondary">
                    Vence: {formatDate(item.expiryDate)}
                  </Typography>
                )}
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Tooltip title="Ver detalle">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/hse/equipment/${item.id}`)}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={() => navigate(`/hse/equipment/${item.id}/edit`)}
                >
                  <EditIcon />
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
            <TableCell>Nombre</TableCell>
            <TableCell>Asignado a</TableCell>
            <TableCell>Condición</TableCell>
            <TableCell>Vencimiento</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {item.code}
                </Typography>
              </TableCell>
              <TableCell>{typeLabels[item.equipmentType] || item.equipmentType}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {item.assignedTo
                  ? `${item.assignedTo.firstName} ${item.assignedTo.lastName}`
                  : '-'}
              </TableCell>
              <TableCell>
                <Chip
                  label={conditionLabels[item.condition] || item.condition}
                  color={conditionColors[item.condition]}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {formatDate(item.expiryDate)}
                  {isExpired(item.expiryDate) && (
                    <WarningIcon color="error" fontSize="small" />
                  )}
                  {isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate) && (
                    <WarningIcon color="warning" fontSize="small" />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[item.status] || item.status}
                  color={statusColors[item.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalle">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/hse/equipment/${item.id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => navigate(`/hse/equipment/${item.id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={equipmentPagination?.total || 0}
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
            Equipos de Seguridad
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión de EPP y equipos de seguridad
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/hse/equipment/new')}
        >
          Nuevo Equipo
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
              value={filters.equipmentType}
              onChange={(e) => setFilters({ ...filters, equipmentType: e.target.value })}
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
      {equipmentLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : equipment.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <EquipmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay equipos registrados
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/hse/equipment/new')}
            sx={{ mt: 2 }}
          >
            Registrar Primer Equipo
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

export default EquipmentList;
