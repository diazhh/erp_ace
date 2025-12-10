import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Inventory as AssetIcon,
} from '@mui/icons-material';
import {
  fetchAssetById,
  createAsset,
  updateAsset,
  fetchAssetCatalogs,
  fetchAssetCategories,
  clearCurrentAsset,
} from '../../store/slices/assetSlice';
import api from '../../services/api';

const AssetForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentAsset, catalogs, categories, loading, error } = useSelector((state) => state.assets);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    serialNumber: '',
    model: '',
    brand: '',
    acquisitionDate: '',
    acquisitionCost: '',
    currency: 'USD',
    supplierId: '',
    invoiceNumber: '',
    depreciationMethod: 'STRAIGHT_LINE',
    usefulLifeYears: 5,
    salvageValue: '',
    depreciationStartDate: '',
    locationId: '',
    locationDescription: '',
    assignedToEmployeeId: '',
    assignedToProjectId: '',
    assignedToDepartmentId: '',
    status: 'ACTIVE',
    condition: 'GOOD',
    warrantyExpiry: '',
    warrantyNotes: '',
    notes: '',
  });

  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(fetchAssetCatalogs());
    dispatch(fetchAssetCategories({ limit: 100 }));
    loadRelatedData();

    if (isEdit) {
      dispatch(fetchAssetById(id));
    }

    return () => {
      dispatch(clearCurrentAsset());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentAsset) {
      setFormData({
        name: currentAsset.name || '',
        description: currentAsset.description || '',
        categoryId: currentAsset.categoryId || '',
        serialNumber: currentAsset.serialNumber || '',
        model: currentAsset.model || '',
        brand: currentAsset.brand || '',
        acquisitionDate: currentAsset.acquisitionDate || '',
        acquisitionCost: currentAsset.acquisitionCost || '',
        currency: currentAsset.currency || 'USD',
        supplierId: currentAsset.supplierId || '',
        invoiceNumber: currentAsset.invoiceNumber || '',
        depreciationMethod: currentAsset.depreciationMethod || 'STRAIGHT_LINE',
        usefulLifeYears: currentAsset.usefulLifeYears || 5,
        salvageValue: currentAsset.salvageValue || '',
        depreciationStartDate: currentAsset.depreciationStartDate || '',
        locationId: currentAsset.locationId || '',
        locationDescription: currentAsset.locationDescription || '',
        assignedToEmployeeId: currentAsset.assignedToEmployeeId || '',
        assignedToProjectId: currentAsset.assignedToProjectId || '',
        assignedToDepartmentId: currentAsset.assignedToDepartmentId || '',
        status: currentAsset.status || 'ACTIVE',
        condition: currentAsset.condition || 'GOOD',
        warrantyExpiry: currentAsset.warrantyExpiry || '',
        warrantyNotes: currentAsset.warrantyNotes || '',
        notes: currentAsset.notes || '',
      });
    }
  }, [currentAsset, isEdit]);

  const loadRelatedData = async () => {
    try {
      const [suppliersRes, warehousesRes, employeesRes, projectsRes, departmentsRes] = await Promise.all([
        api.get('/contractors', { params: { limit: 100 } }),
        api.get('/inventory/warehouses', { params: { limit: 100 } }),
        api.get('/employees', { params: { limit: 200, status: 'ACTIVE' } }),
        api.get('/projects', { params: { limit: 100, status: 'IN_PROGRESS' } }),
        api.get('/organization/departments', { params: { limit: 100 } }),
      ]);
      setSuppliers(suppliersRes.data.data.items || suppliersRes.data.data.contractors || []);
      setWarehouses(warehousesRes.data.data.items || warehousesRes.data.data.warehouses || []);
      setEmployees(employeesRes.data.data.items || employeesRes.data.data.employees || []);
      setProjects(projectsRes.data.data.items || projectsRes.data.data.projects || []);
      setDepartments(departmentsRes.data.data.items || departmentsRes.data.data.departments || []);
    } catch (err) {
      console.error('Error loading related data:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      // Preparar datos
      const data = {
        ...formData,
        acquisitionCost: parseFloat(formData.acquisitionCost) || 0,
        salvageValue: parseFloat(formData.salvageValue) || 0,
        usefulLifeYears: parseInt(formData.usefulLifeYears) || 5,
        supplierId: formData.supplierId || null,
        locationId: formData.locationId || null,
        assignedToEmployeeId: formData.assignedToEmployeeId || null,
        assignedToProjectId: formData.assignedToProjectId || null,
        assignedToDepartmentId: formData.assignedToDepartmentId || null,
      };

      if (isEdit) {
        await dispatch(updateAsset({ id, data })).unwrap();
      } else {
        await dispatch(createAsset(data)).unwrap();
      }

      navigate('/assets');
    } catch (err) {
      setFormError(err.message || 'Error al guardar el activo');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/assets')} sx={{ mr: 2 }}>
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          <AssetIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEdit ? 'Editar Activo' : 'Nuevo Activo'}
        </Typography>
      </Box>

      {(error || formError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || formError}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Información Básica
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Nombre del Activo"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  label="Categoría"
                  onChange={handleChange}
                >
                  {categories?.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
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

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Adquisición
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                type="date"
                label="Fecha de Adquisición"
                name="acquisitionDate"
                value={formData.acquisitionDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                type="number"
                label="Costo de Adquisición"
                name="acquisitionCost"
                value={formData.acquisitionCost}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  label="Moneda"
                  onChange={handleChange}
                >
                  {catalogs?.currencies?.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Proveedor</InputLabel>
                <Select
                  name="supplierId"
                  value={formData.supplierId}
                  label="Proveedor"
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin proveedor</MenuItem>
                  {suppliers.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número de Factura"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Depreciación
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Método de Depreciación</InputLabel>
                <Select
                  name="depreciationMethod"
                  value={formData.depreciationMethod}
                  label="Método de Depreciación"
                  onChange={handleChange}
                >
                  {catalogs?.depreciationMethods?.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                type="number"
                label="Vida Útil (años)"
                name="usefulLifeYears"
                value={formData.usefulLifeYears}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Valor Residual"
                name="salvageValue"
                value={formData.salvageValue}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Inicio de Depreciación"
                name="depreciationStartDate"
                value={formData.depreciationStartDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                helperText="Por defecto usa la fecha de adquisición"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Ubicación y Asignación
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Ubicación (Almacén)</InputLabel>
                <Select
                  name="locationId"
                  value={formData.locationId}
                  label="Ubicación (Almacén)"
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin ubicación</MenuItem>
                  {warehouses.map((w) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.code} - {w.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descripción de Ubicación"
                name="locationDescription"
                value={formData.locationDescription}
                onChange={handleChange}
                placeholder="Ej: Oficina 201, Estante A3"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Asignado a Empleado</InputLabel>
                <Select
                  name="assignedToEmployeeId"
                  value={formData.assignedToEmployeeId}
                  label="Asignado a Empleado"
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin asignar</MenuItem>
                  {employees.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.firstName} {e.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Asignado a Proyecto</InputLabel>
                <Select
                  name="assignedToProjectId"
                  value={formData.assignedToProjectId}
                  label="Asignado a Proyecto"
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin asignar</MenuItem>
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Asignado a Departamento</InputLabel>
                <Select
                  name="assignedToDepartmentId"
                  value={formData.assignedToDepartmentId}
                  label="Asignado a Departamento"
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin asignar</MenuItem>
                  {departments.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Estado y Garantía
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Estado"
                  onChange={handleChange}
                >
                  {catalogs?.assetStatuses?.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Condición</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  label="Condición"
                  onChange={handleChange}
                >
                  {catalogs?.conditions?.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Vencimiento de Garantía"
                name="warrantyExpiry"
                value={formData.warrantyExpiry}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notas de Garantía"
                name="warrantyNotes"
                value={formData.warrantyNotes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notas Generales"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/assets')}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={submitting}
            >
              {isEdit ? 'Actualizar' : 'Crear'} Activo
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AssetForm;
