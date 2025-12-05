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
  FormControlLabel,
  Switch,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  fetchItemById,
  createItem,
  updateItem,
  fetchCategories,
  fetchItemTypes,
  fetchUnits,
  clearCurrentItem,
} from '../../store/slices/inventorySlice';

const ItemForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const isEdit = !!id;
  
  const { currentItem, categories, itemTypes, units, loading } = useSelector((state) => state.inventory);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    itemType: 'MATERIAL',
    unit: 'UND',
    currency: 'USD',
    unitCost: '',
    unitPrice: '',
    minStock: '',
    maxStock: '',
    reorderPoint: '',
    reorderQuantity: '',
    brand: '',
    model: '',
    sku: '',
    barcode: '',
    isSerialTracked: false,
    isLotTracked: false,
    notes: '',
  });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories({ status: 'ACTIVE' }));
    dispatch(fetchItemTypes());
    dispatch(fetchUnits());
    
    if (isEdit) {
      dispatch(fetchItemById(id));
    }
    
    return () => {
      dispatch(clearCurrentItem());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentItem) {
      setFormData({
        name: currentItem.name || '',
        description: currentItem.description || '',
        categoryId: currentItem.categoryId || '',
        itemType: currentItem.itemType || 'MATERIAL',
        unit: currentItem.unit || 'UND',
        currency: currentItem.currency || 'USD',
        unitCost: currentItem.unitCost || '',
        unitPrice: currentItem.unitPrice || '',
        minStock: currentItem.minStock || '',
        maxStock: currentItem.maxStock || '',
        reorderPoint: currentItem.reorderPoint || '',
        reorderQuantity: currentItem.reorderQuantity || '',
        brand: currentItem.brand || '',
        model: currentItem.model || '',
        sku: currentItem.sku || '',
        barcode: currentItem.barcode || '',
        isSerialTracked: currentItem.isSerialTracked || false,
        isLotTracked: currentItem.isLotTracked || false,
        notes: currentItem.notes || '',
      });
    }
  }, [currentItem, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
        unitCost: formData.unitCost ? parseFloat(formData.unitCost) : 0,
        unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : null,
        minStock: formData.minStock ? parseFloat(formData.minStock) : null,
        maxStock: formData.maxStock ? parseFloat(formData.maxStock) : null,
        reorderPoint: formData.reorderPoint ? parseFloat(formData.reorderPoint) : null,
        reorderQuantity: formData.reorderQuantity ? parseFloat(formData.reorderQuantity) : null,
        categoryId: formData.categoryId || null,
      };
      
      if (isEdit) {
        await dispatch(updateItem({ id, data: dataToSend })).unwrap();
        toast.success('Item actualizado exitosamente');
      } else {
        await dispatch(createItem(dataToSend)).unwrap();
        toast.success('Item creado exitosamente');
      }
      
      navigate('/inventory');
    } catch (error) {
      toast.error(error || 'Error al guardar item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEdit && !currentItem) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? 'Editar Item' : 'Nuevo Item'}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          {/* Información Básica */}
          <Typography variant="h6" gutterBottom>
            Información Básica
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Categoría"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <MenuItem value="">Sin categoría</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                required
                label="Tipo"
                name="itemType"
                value={formData.itemType}
                onChange={handleChange}
              >
                {(itemTypes.length > 0 ? itemTypes : [
                  { code: 'PRODUCT', name: 'Producto' },
                  { code: 'MATERIAL', name: 'Material' },
                  { code: 'TOOL', name: 'Herramienta' },
                  { code: 'EQUIPMENT', name: 'Equipo' },
                  { code: 'CONSUMABLE', name: 'Consumible' },
                  { code: 'SPARE_PART', name: 'Repuesto' },
                ]).map((type) => (
                  <MenuItem key={type.code} value={type.code}>{type.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                required
                label="Unidad de Medida"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                {(units.length > 0 ? units : [
                  { code: 'UND', name: 'Unidad' },
                  { code: 'KG', name: 'Kilogramo' },
                  { code: 'M', name: 'Metro' },
                  { code: 'L', name: 'Litro' },
                  { code: 'PZA', name: 'Pieza' },
                ]).map((unit) => (
                  <MenuItem key={unit.code} value={unit.code}>{unit.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
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
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Precios */}
          <Typography variant="h6" gutterBottom>
            Precios
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Costo Unitario"
                name="unitCost"
                value={formData.unitCost}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Precio de Venta"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Niveles de Stock */}
          <Typography variant="h6" gutterBottom>
            Niveles de Stock
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Stock Mínimo"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                helperText="Alerta de reposición"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Stock Máximo"
                name="maxStock"
                value={formData.maxStock}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Punto de Reorden"
                name="reorderPoint"
                value={formData.reorderPoint}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad a Pedir"
                name="reorderQuantity"
                value={formData.reorderQuantity}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Identificación */}
          <Typography variant="h6" gutterBottom>
            Identificación
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Código de Barras"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Marca"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Modelo"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Trazabilidad */}
          <Typography variant="h6" gutterBottom>
            Trazabilidad
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isSerialTracked}
                    onChange={handleChange}
                    name="isSerialTracked"
                  />
                }
                label="Seguimiento por Número de Serie"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isLotTracked}
                    onChange={handleChange}
                    name="isLotTracked"
                  />
                }
                label="Seguimiento por Lote"
              />
            </Grid>
          </Grid>

          {/* Notas */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notas"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Botones */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 3,
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            justifyContent: 'flex-end',
          }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate(-1)}
              fullWidth={isMobile}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              fullWidth={isMobile}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : (isEdit ? 'Guardar Cambios' : 'Crear Item')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ItemForm;
