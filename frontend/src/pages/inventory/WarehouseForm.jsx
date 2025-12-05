import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  fetchWarehouseById,
  createWarehouse,
  updateWarehouse,
  fetchWarehouseTypes,
  clearCurrentWarehouse,
} from '../../store/slices/inventorySlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchProjects } from '../../store/slices/projectSlice';

const WarehouseForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const isEdit = !!id;
  
  const { currentWarehouse, warehouseTypes, loading } = useSelector((state) => state.inventory);
  const { employees } = useSelector((state) => state.employees);
  const { projects } = useSelector((state) => state.projects);
  
  const [formData, setFormData] = useState({
    name: '',
    warehouseType: 'SECONDARY',
    location: '',
    address: '',
    managerId: '',
    projectId: '',
    description: '',
    status: 'ACTIVE',
  });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchWarehouseTypes());
    dispatch(fetchEmployees({ status: 'ACTIVE', limit: 100 }));
    dispatch(fetchProjects({ status: 'IN_PROGRESS', limit: 100 }));
    
    if (isEdit) {
      dispatch(fetchWarehouseById(id));
    }
    
    return () => {
      dispatch(clearCurrentWarehouse());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentWarehouse) {
      setFormData({
        name: currentWarehouse.name || '',
        warehouseType: currentWarehouse.warehouseType || 'SECONDARY',
        location: currentWarehouse.location || '',
        address: currentWarehouse.address || '',
        managerId: currentWarehouse.managerId || '',
        projectId: currentWarehouse.projectId || '',
        description: currentWarehouse.description || '',
        status: currentWarehouse.status || 'ACTIVE',
      });
    }
  }, [currentWarehouse, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const dataToSend = {
        ...formData,
        managerId: formData.managerId || null,
        projectId: formData.projectId || null,
      };
      
      if (isEdit) {
        await dispatch(updateWarehouse({ id, data: dataToSend })).unwrap();
        toast.success('Almacén actualizado exitosamente');
      } else {
        await dispatch(createWarehouse(dataToSend)).unwrap();
        toast.success('Almacén creado exitosamente');
      }
      
      navigate('/inventory/warehouses');
    } catch (error) {
      toast.error(error || 'Error al guardar almacén');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEdit && !currentWarehouse) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const warehouseTypeLabels = {
    MAIN: 'Principal',
    SECONDARY: 'Secundario',
    TRANSIT: 'Tránsito',
    PROJECT: 'Proyecto',
  };

  const statusLabels = {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    CLOSED: 'Cerrado',
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? 'Editar Almacén' : 'Nuevo Almacén'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Información Básica */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Información Básica
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Nombre del Almacén"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Almacén Central, Depósito Norte"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                required
                label="Tipo de Almacén"
                name="warehouseType"
                value={formData.warehouseType}
                onChange={handleChange}
              >
                {Object.entries(warehouseTypeLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej: Zona Industrial, Planta A"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Estado"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {Object.entries(statusLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección Completa"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="Dirección física del almacén"
              />
            </Grid>

            {/* Asignaciones */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Asignaciones
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Encargado"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Proyecto Asociado"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                helperText="Solo para almacenes tipo Proyecto"
                disabled={formData.warehouseType !== 'PROJECT'}
              >
                <MenuItem value="">Ninguno</MenuItem>
                {projects.map((proj) => (
                  <MenuItem key={proj.id} value={proj.id}>
                    {proj.code} - {proj.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Descripción
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción / Notas"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Información adicional sobre el almacén"
              />
            </Grid>

            {/* Botones */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : (isEdit ? 'Actualizar' : 'Crear Almacén')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default WarehouseForm;
