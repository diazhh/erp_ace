import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  PersonAdd as AssignIcon,
  PersonRemove as ReturnIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Assignment as ProjectIcon,
  Security as EquipmentIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import api from '../../services/api';

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

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { employees } = useSelector((state) => state.employees);

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignDialog, setAssignDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [returnDialog, setReturnDialog] = useState(false);
  const [returnNotes, setReturnNotes] = useState('');

  useEffect(() => {
    loadEquipment();
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
  }, [id, dispatch]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hse/equipment/${id}`);
      setEquipment(response.data.data);
    } catch (error) {
      toast.error('Error al cargar el equipo');
      navigate('/hse/equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedEmployee) {
      toast.error('Seleccione un empleado');
      return;
    }
    try {
      await api.post(`/hse/equipment/${id}/assign`, {
        employeeId: selectedEmployee,
      });
      toast.success('Equipo asignado');
      setAssignDialog(false);
      setSelectedEmployee('');
      loadEquipment();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al asignar equipo');
    }
  };

  const handleReturn = async () => {
    try {
      await api.post(`/hse/equipment/${id}/return`, {
        notes: returnNotes,
      });
      toast.success('Equipo devuelto');
      setReturnDialog(false);
      setReturnNotes('');
      loadEquipment();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al devolver equipo');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
    }).format(amount || 0);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!equipment) return null;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <IconButton onClick={() => navigate('/hse/equipment')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {equipment.code}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {typeLabels[equipment.equipmentType] || equipment.equipmentType}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={statusLabels[equipment.status] || equipment.status}
            color={statusColors[equipment.status]}
            size="medium"
          />
          <Chip
            label={conditionLabels[equipment.condition] || equipment.condition}
            color={conditionColors[equipment.condition]}
            size="medium"
            variant="outlined"
          />
          {isExpired(equipment.expiryDate) && (
            <Chip icon={<WarningIcon />} label="Vencido" color="error" size="medium" />
          )}
          {isExpiringSoon(equipment.expiryDate) && !isExpired(equipment.expiryDate) && (
            <Chip icon={<WarningIcon />} label="Por vencer" color="warning" size="medium" />
          )}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/hse/equipment/${id}/edit`)}
        >
          Editar
        </Button>
        {equipment.status === 'AVAILABLE' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AssignIcon />}
            onClick={() => setAssignDialog(true)}
          >
            Asignar
          </Button>
        )}
        {['ASSIGNED', 'IN_USE'].includes(equipment.status) && (
          <Button
            variant="contained"
            color="warning"
            startIcon={<ReturnIcon />}
            onClick={() => setReturnDialog(true)}
          >
            Devolver
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {equipment.name}
            </Typography>
            {equipment.description && (
              <Typography variant="body1" color="text.secondary" paragraph>
                {equipment.description}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              {equipment.brand && (
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">
                    Marca
                  </Typography>
                  <Typography variant="body2">{equipment.brand}</Typography>
                </Grid>
              )}
              {equipment.model && (
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">
                    Modelo
                  </Typography>
                  <Typography variant="body2">{equipment.model}</Typography>
                </Grid>
              )}
              {equipment.serialNumber && (
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">
                    Número de Serie
                  </Typography>
                  <Typography variant="body2">{equipment.serialNumber}</Typography>
                </Grid>
              )}
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Cantidad
                </Typography>
                <Typography variant="body2">{equipment.quantity}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Costo
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(equipment.cost, equipment.currency)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Dates */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Fechas Importantes
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Fecha de Compra
                </Typography>
                <Typography variant="body2">{formatDate(equipment.purchaseDate)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Vencimiento
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        isExpired(equipment.expiryDate)
                          ? 'error.main'
                          : isExpiringSoon(equipment.expiryDate)
                          ? 'warning.main'
                          : 'text.primary'
                      }
                    >
                      {formatDate(equipment.expiryDate)}
                    </Typography>
                  </Box>
                  {(isExpired(equipment.expiryDate) || isExpiringSoon(equipment.expiryDate)) && (
                    <WarningIcon
                      color={isExpired(equipment.expiryDate) ? 'error' : 'warning'}
                      fontSize="small"
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Última Inspección
                </Typography>
                <Typography variant="body2">
                  {formatDate(equipment.lastInspectionDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Próxima Inspección
                </Typography>
                <Typography variant="body2">
                  {formatDate(equipment.nextInspectionDate)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Certification */}
          {equipment.certificationRequired && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Certificación
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Número de Certificación
                  </Typography>
                  <Typography variant="body2">
                    {equipment.certificationNumber || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Vencimiento Certificación
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(equipment.certificationExpiryDate)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Assignment */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Asignación
              </Typography>
              {equipment.assignedTo ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PersonIcon color="action" />
                    <Typography>
                      {equipment.assignedTo.firstName} {equipment.assignedTo.lastName}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Asignado desde: {formatDate(equipment.assignedDate)}
                  </Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">No asignado</Typography>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          {equipment.location && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Ubicación
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="action" />
                  <Typography>{equipment.location}</Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Project */}
          {equipment.project && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Proyecto
                </Typography>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                  onClick={() => navigate(`/projects/${equipment.project.id}`)}
                >
                  <ProjectIcon color="action" />
                  <Box>
                    <Typography variant="body2">{equipment.project.code}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {equipment.project.name}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {equipment.notes && (
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Notas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {equipment.notes}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Assign Dialog */}
      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Equipo</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Empleado"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="">Seleccionar...</MenuItem>
            {employees?.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} - {emp.employeeCode}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(false)}>Cancelar</Button>
          <Button onClick={handleAssign} variant="contained" disabled={!selectedEmployee}>
            Asignar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={returnDialog} onClose={() => setReturnDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Devolver Equipo</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            ¿Confirma la devolución del equipo asignado a{' '}
            <strong>
              {equipment.assignedTo?.firstName} {equipment.assignedTo?.lastName}
            </strong>
            ?
          </Typography>
          <TextField
            fullWidth
            label="Notas de devolución"
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
            multiline
            rows={3}
            placeholder="Condición del equipo, observaciones..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialog(false)}>Cancelar</Button>
          <Button onClick={handleReturn} variant="contained" color="warning">
            Confirmar Devolución
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipmentDetail;
