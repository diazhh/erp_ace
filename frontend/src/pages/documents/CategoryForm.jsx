import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import { 
  fetchCategory, 
  createCategory, 
  updateCategory, 
  fetchCategories,
  fetchDocumentCatalogs,
  clearCurrentCategory 
} from '../../store/slices/documentSlice';

const CategoryForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentCategory, categories, catalogs } = useSelector((state) => state.documents);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    module: 'GENERAL',
    parentId: '',
    requiresExpiry: false,
    expiryAlertDays: 30,
    isMandatory: false,
    sortOrder: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchDocumentCatalogs());
    dispatch(fetchCategories());
    if (isEdit) {
      setLoading(true);
      dispatch(fetchCategory(id)).finally(() => setLoading(false));
    }
    return () => {
      dispatch(clearCurrentCategory());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentCategory) {
      setFormData({
        name: currentCategory.name || '',
        description: currentCategory.description || '',
        module: currentCategory.module || 'GENERAL',
        parentId: currentCategory.parent_id || '',
        requiresExpiry: currentCategory.requires_expiry || false,
        expiryAlertDays: currentCategory.expiry_alert_days || 30,
        isMandatory: currentCategory.is_mandatory || false,
        sortOrder: currentCategory.sort_order || 0,
        isActive: currentCategory.is_active !== false,
      });
    }
  }, [isEdit, currentCategory]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit) {
        await dispatch(updateCategory({ id, data: formData })).unwrap();
      } else {
        await dispatch(createCategory(formData)).unwrap();
      }
      navigate('/documents/categories');
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setSaving(false);
    }
  };

  // Filter out current category from parent options
  const parentOptions = categories.filter((cat) => cat.id !== id);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/documents/categories')}
          sx={{ mb: 2 }}
        >
          Volver a Categorías
        </Button>
        <Typography variant="h4" fontWeight="bold">
          {isEdit ? 'Editar Categoría' : 'Nueva Categoría'}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Main Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información de la Categoría
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    value={formData.description}
                    onChange={handleChange('description')}
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Módulo</InputLabel>
                    <Select
                      value={formData.module}
                      label="Módulo"
                      onChange={handleChange('module')}
                    >
                      {catalogs?.modules?.map((mod) => (
                        <MenuItem key={mod.code} value={mod.code}>
                          {mod.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoría Padre</InputLabel>
                    <Select
                      value={formData.parentId}
                      label="Categoría Padre"
                      onChange={handleChange('parentId')}
                    >
                      <MenuItem value="">Sin padre (categoría raíz)</MenuItem>
                      {parentOptions.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Orden de Visualización"
                    type="number"
                    value={formData.sortOrder}
                    onChange={handleChange('sortOrder')}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Expiry Settings */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Configuración de Vencimiento
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.requiresExpiry}
                        onChange={handleChange('requiresExpiry')}
                      />
                    }
                    label="Los documentos de esta categoría requieren fecha de vencimiento"
                  />
                </Grid>

                {formData.requiresExpiry && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Días de Anticipación para Alerta"
                      type="number"
                      value={formData.expiryAlertDays}
                      onChange={handleChange('expiryAlertDays')}
                      inputProps={{ min: 1 }}
                      helperText="Días antes del vencimiento para mostrar alertas"
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Status */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Estado
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isMandatory}
                        onChange={handleChange('isMandatory')}
                      />
                    }
                    label="Categoría obligatoria"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleChange('isActive')}
                      />
                    }
                    label="Categoría activa"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Acciones
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Categoría')}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/documents/categories')}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </Box>

              {isEdit && currentCategory && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Información
                  </Typography>
                  <Typography variant="body2">
                    Código: {currentCategory.code}
                  </Typography>
                  <Typography variant="body2">
                    Creado: {new Date(currentCategory.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CategoryForm;
