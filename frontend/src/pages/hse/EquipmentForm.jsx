import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  fetchHSECatalogs,
  createEquipment,
  updateEquipment,
} from '../../store/slices/hseSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import api from '../../services/api';

const equipmentTypes = [
  { code: 'HELMET', name: 'Casco' },
  { code: 'SAFETY_GLASSES', name: 'Lentes de Seguridad' },
  { code: 'FACE_SHIELD', name: 'Careta' },
  { code: 'EAR_PLUGS', name: 'Tapones Auditivos' },
  { code: 'EAR_MUFFS', name: 'Orejeras' },
  { code: 'RESPIRATOR', name: 'Respirador' },
  { code: 'DUST_MASK', name: 'Mascarilla' },
  { code: 'GLOVES', name: 'Guantes' },
  { code: 'SAFETY_BOOTS', name: 'Botas de Seguridad' },
  { code: 'SAFETY_VEST', name: 'Chaleco Reflectivo' },
  { code: 'HARNESS', name: 'Arnés' },
  { code: 'LANYARD', name: 'Línea de Vida' },
  { code: 'FIRE_EXTINGUISHER', name: 'Extintor' },
  { code: 'FIRST_AID_KIT', name: 'Botiquín' },
  { code: 'SAFETY_CONE', name: 'Cono de Seguridad' },
  { code: 'SAFETY_TAPE', name: 'Cinta de Seguridad' },
  { code: 'EMERGENCY_LIGHT', name: 'Luz de Emergencia' },
  { code: 'SPILL_KIT', name: 'Kit de Derrames' },
  { code: 'OTHER', name: 'Otro' },
];

const conditions = [
  { code: 'NEW', name: 'Nuevo' },
  { code: 'GOOD', name: 'Bueno' },
  { code: 'FAIR', name: 'Regular' },
  { code: 'POOR', name: 'Malo' },
];

const statuses = [
  { code: 'AVAILABLE', name: 'Disponible' },
  { code: 'ASSIGNED', name: 'Asignado' },
  { code: 'IN_USE', name: 'En Uso' },
  { code: 'MAINTENANCE', name: 'Mantenimiento' },
  { code: 'EXPIRED', name: 'Vencido' },
  { code: 'DAMAGED', name: 'Dañado' },
  { code: 'DISPOSED', name: 'Descartado' },
];

const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = !!id;

  const { catalogs } = useSelector((state) => state.hse);
  const { employees } = useSelector((state) => state.employees);
  const { projects } = useSelector((state) => state.projects);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    equipmentType: 'HELMET',
    name: '',
    description: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    expiryDate: '',
    lastInspectionDate: '',
    nextInspectionDate: '',
    assignedToId: '',
    assignedDate: '',
    location: '',
    projectId: '',
    status: 'AVAILABLE',
    condition: 'NEW',
    quantity: 1,
    certificationRequired: false,
    certificationNumber: '',
    certificationExpiryDate: '',
    cost: 0,
    currency: 'USD',
    notes: '',
  });

  useEffect(() => {
    if (!catalogs) dispatch(fetchHSECatalogs());
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
    dispatch(fetchProjects({ limit: 100 }));

    if (isEdit) {
      loadEquipment();
    }
  }, [dispatch, id]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hse/equipment/${id}`);
      const item = response.data.data;
      setFormData({
        equipmentType: item.equipmentType,
        name: item.name,
        description: item.description || '',
        brand: item.brand || '',
        model: item.model || '',
        serialNumber: item.serialNumber || '',
        purchaseDate: item.purchaseDate?.slice(0, 10) || '',
        expiryDate: item.expiryDate?.slice(0, 10) || '',
        lastInspectionDate: item.lastInspectionDate?.slice(0, 10) || '',
        nextInspectionDate: item.nextInspectionDate?.slice(0, 10) || '',
        assignedToId: item.assignedToId || '',
        assignedDate: item.assignedDate?.slice(0, 10) || '',
        location: item.location || '',
        projectId: item.projectId || '',
        status: item.status,
        condition: item.condition,
        quantity: item.quantity || 1,
        certificationRequired: item.certificationRequired || false,
        certificationNumber: item.certificationNumber || '',
        certificationExpiryDate: item.certificationExpiryDate?.slice(0, 10) || '',
        cost: item.cost || 0,
        currency: item.currency || 'USD',
        notes: item.notes || '',
      });
    } catch (error) {
      toast.error('Error al cargar el equipo');
      navigate('/hse/equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error('Ingrese un nombre');
      return;
    }

    try {
      setLoading(true);
      const data = { ...formData };

      if (isEdit) {
        await dispatch(updateEquipment({ id, data })).unwrap();
        toast.success('Equipo actualizado');
      } else {
        await dispatch(createEquipment(data)).unwrap();
        toast.success('Equipo registrado');
      }
      navigate('/hse/equipment');
    } catch (error) {
      toast.error(error || 'Error al guardar el equipo');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/hse/equipment')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? 'Editar Equipo' : 'Registrar Equipo'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Información General */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Información General
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Equipo"
                  name="equipmentType"
                  value={formData.equipmentType}
                  onChange={handleChange}
                  required
                >
                  {equipmentTypes.map((type) => (
                    <MenuItem key={type.code} value={type.code}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Cantidad"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Casco de seguridad 3M"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Marca"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Modelo"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Número de Serie"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Estado y Condición */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Estado y Condición
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Estado"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {statuses.map((s) => (
                    <MenuItem key={s.code} value={s.code}>
                      {s.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Condición"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  {conditions.map((c) => (
                    <MenuItem key={c.code} value={c.code}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ej: Almacén principal"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Fechas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Fechas Importantes
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Compra"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Vencimiento"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Última Inspección"
                  name="lastInspectionDate"
                  value={formData.lastInspectionDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Próxima Inspección"
                  name="nextInspectionDate"
                  value={formData.nextInspectionDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Asignación */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Asignación
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Asignado a"
                  name="assignedToId"
                  value={formData.assignedToId}
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin asignar</MenuItem>
                  {employees?.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} - {emp.employeeCode}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Asignación"
                  name="assignedDate"
                  value={formData.assignedDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  disabled={!formData.assignedToId}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Proyecto"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  {projects?.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.code} - {project.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Certificación */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Certificación
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.certificationRequired}
                      onChange={handleChange}
                      name="certificationRequired"
                    />
                  }
                  label="Requiere certificación"
                />
              </Grid>
              {formData.certificationRequired && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Número de Certificación"
                      name="certificationNumber"
                      value={formData.certificationNumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Vencimiento Certificación"
                      name="certificationExpiryDate"
                      value={formData.certificationExpiryDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Costo */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Costo y Notas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Costo"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  select
                  fullWidth
                  label="Moneda"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="VES">VES</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Notas"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/hse/equipment')}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : isEdit ? 'Actualizar' : 'Registrar'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EquipmentForm;
