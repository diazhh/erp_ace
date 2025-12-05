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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchContractors, createPurchaseOrder } from '../../store/slices/contractorSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import api from '../../services/api';

const orderTypes = [
  { code: 'PURCHASE', name: 'Orden de Compra' },
  { code: 'SERVICE', name: 'Orden de Servicio' },
  { code: 'WORK', name: 'Orden de Obra' },
];

const units = ['UND', 'M', 'M2', 'M3', 'KG', 'LT', 'HR', 'DIA', 'SEM', 'MES', 'GLB'];

const PurchaseOrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = !!id;

  const { contractors } = useSelector((state) => state.contractors);
  const { projects } = useSelector((state) => state.projects);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractorId: '',
    projectId: '',
    orderType: 'SERVICE',
    title: '',
    description: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    currency: 'USD',
    taxRate: 16,
    paymentTerms: '',
    deliveryTerms: '',
    warranty: '',
    deliveryAddress: '',
    notes: '',
  });
  const [items, setItems] = useState([
    { description: '', unit: 'UND', quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    dispatch(fetchContractors({ limit: 100 }));
    dispatch(fetchProjects({ limit: 100 }));
    
    if (isEdit) {
      loadOrder();
    }
  }, [dispatch, id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contractors/purchase-orders/${id}`);
      const order = response.data.data;
      setFormData({
        contractorId: order.contractorId,
        projectId: order.projectId || '',
        orderType: order.orderType,
        title: order.title,
        description: order.description || '',
        orderDate: order.orderDate,
        deliveryDate: order.deliveryDate || '',
        currency: order.currency,
        taxRate: order.taxRate,
        paymentTerms: order.paymentTerms || '',
        deliveryTerms: order.deliveryTerms || '',
        warranty: order.warranty || '',
        deliveryAddress: order.deliveryAddress || '',
        notes: order.notes || '',
      });
      if (order.items && order.items.length > 0) {
        setItems(order.items.map(item => ({
          description: item.description,
          unit: item.unit,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })));
      }
    } catch (error) {
      toast.error('Error al cargar la orden');
      navigate('/procurement/purchase-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', unit: 'UND', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (formData.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.contractorId) {
      toast.error('Seleccione un contratista');
      return;
    }
    if (!formData.title) {
      toast.error('Ingrese un título');
      return;
    }
    if (items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error('Complete todos los items correctamente');
      return;
    }

    try {
      setLoading(true);
      const data = {
        ...formData,
        subtotal: calculateSubtotal(),
        taxAmount: calculateTax(),
        total: calculateTotal(),
        items,
      };

      if (isEdit) {
        await api.put(`/contractors/purchase-orders/${id}`, data);
        toast.success('Orden actualizada');
      } else {
        await dispatch(createPurchaseOrder(data)).unwrap();
        toast.success('Orden creada');
      }
      navigate('/procurement/purchase-orders');
    } catch (error) {
      toast.error(error.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: formData.currency === 'USDT' ? 'USD' : formData.currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (loading && isEdit) {
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
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ ml: 1 }}>
          {isEdit ? 'Editar Orden' : 'Nueva Orden de Compra'}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Información General */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Información General
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Contratista *"
                    name="contractorId"
                    value={formData.contractorId}
                    onChange={handleChange}
                    required
                  >
                    {contractors.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.code} - {c.companyName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Proyecto (opcional)"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                  >
                    <MenuItem value="">Sin proyecto</MenuItem>
                    {projects.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.code} - {p.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Tipo de Orden *"
                    name="orderType"
                    value={formData.orderType}
                    onChange={handleChange}
                    required
                  >
                    {orderTypes.map((t) => (
                      <MenuItem key={t.code} value={t.code}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
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
                    <MenuItem value="USDT">USDT</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Título *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descripción"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha de Orden"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha de Entrega"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="IVA (%)"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Términos */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Términos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Condiciones de Pago"
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    placeholder="Ej: 50% anticipo, 50% contra entrega"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Condiciones de Entrega"
                    name="deliveryTerms"
                    value={formData.deliveryTerms}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Garantía"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Dirección de Entrega"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Items */}
          <Grid item xs={12}>
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Items
                </Typography>
                <Button startIcon={<AddIcon />} onClick={addItem}>
                  Agregar Item
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Unidad</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Precio Unit.</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Descripción del item"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            select
                            size="small"
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            sx={{ minWidth: 80 }}
                          >
                            {units.map((u) => (
                              <MenuItem key={u} value={u}>{u}</MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            size="small"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.01 }}
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            size="small"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.01 }}
                            sx={{ width: 120 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="medium">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Totals */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ minWidth: 250 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>{formatCurrency(calculateSubtotal())}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>IVA ({formData.taxRate}%):</Typography>
                    <Typography>{formatCurrency(calculateTax())}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">{formatCurrency(calculateTotal())}</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notas"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Paper>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
            }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate(-1)}
                fullWidth={isMobile}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                variant="contained" 
                type="submit"
                fullWidth={isMobile}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (isEdit ? 'Guardar Cambios' : 'Crear Orden')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PurchaseOrderForm;
