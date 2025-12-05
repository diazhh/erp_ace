import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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

import { fetchContractors } from '../../store/slices/contractorSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import api from '../../services/api';

const units = ['UND', 'M', 'M2', 'M3', 'KG', 'LT', 'HR', 'DIA', 'SEM', 'MES', 'GLB'];

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = !!id;

  const { contractors } = useSelector((state) => state.contractors);
  const { projects } = useSelector((state) => state.projects);

  const [loading, setLoading] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [formData, setFormData] = useState({
    contractorId: '',
    purchaseOrderId: location.state?.purchaseOrderId || '',
    projectId: '',
    invoiceNumber: '',
    controlNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'USD',
    taxRate: 16,
    retentionRate: 0,
    ivaRetentionRate: 0,
    notes: '',
  });
  const [items, setItems] = useState([
    { description: '', unit: 'UND', quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    dispatch(fetchContractors({ limit: 100 }));
    dispatch(fetchProjects({ limit: 100 }));
    
    if (isEdit) {
      loadInvoice();
    } else if (location.state?.purchaseOrderId) {
      loadPurchaseOrder(location.state.purchaseOrderId);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (formData.contractorId) {
      loadContractorPurchaseOrders(formData.contractorId);
    }
  }, [formData.contractorId]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contractors/invoices/${id}`);
      const invoice = response.data.data;
      setFormData({
        contractorId: invoice.contractorId,
        purchaseOrderId: invoice.purchaseOrderId || '',
        projectId: invoice.projectId || '',
        invoiceNumber: invoice.invoiceNumber,
        controlNumber: invoice.controlNumber || '',
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate || '',
        currency: invoice.currency,
        taxRate: invoice.taxRate,
        retentionRate: invoice.retentionRate || 0,
        ivaRetentionRate: invoice.ivaRetentionRate || 0,
        notes: invoice.notes || '',
      });
      if (invoice.items && invoice.items.length > 0) {
        setItems(invoice.items.map(item => ({
          description: item.description,
          unit: item.unit,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })));
      }
    } catch (error) {
      toast.error('Error al cargar la factura');
      navigate('/procurement/invoices');
    } finally {
      setLoading(false);
    }
  };

  const loadPurchaseOrder = async (poId) => {
    try {
      const response = await api.get(`/contractors/purchase-orders/${poId}`);
      const po = response.data.data;
      setFormData(prev => ({
        ...prev,
        contractorId: po.contractorId,
        projectId: po.projectId || '',
        currency: po.currency,
        taxRate: po.taxRate,
      }));
      if (po.items && po.items.length > 0) {
        setItems(po.items.map(item => ({
          description: item.description,
          unit: item.unit,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })));
      }
    } catch (error) {
      console.error('Error loading purchase order:', error);
    }
  };

  const loadContractorPurchaseOrders = async (contractorId) => {
    try {
      const response = await api.get(`/contractors/purchase-orders`, {
        params: { contractorId, status: 'CONFIRMED,IN_PROGRESS', limit: 100 }
      });
      setPurchaseOrders(response.data.data || []);
    } catch (error) {
      console.error('Error loading purchase orders:', error);
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

  const calculateRetention = () => {
    return calculateSubtotal() * (formData.retentionRate / 100);
  };

  const calculateIvaRetention = () => {
    return calculateTax() * (formData.ivaRetentionRate / 100);
  };

  const calculateNetPayable = () => {
    return calculateTotal() - calculateRetention() - calculateIvaRetention();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.contractorId) {
      toast.error('Seleccione un contratista');
      return;
    }
    if (!formData.invoiceNumber) {
      toast.error('Ingrese el número de factura');
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
        retentionAmount: calculateRetention(),
        ivaRetentionAmount: calculateIvaRetention(),
        netPayable: calculateNetPayable(),
        items: items.map((item, index) => ({
          ...item,
          itemNumber: index + 1,
          subtotal: item.quantity * item.unitPrice,
        })),
      };

      if (isEdit) {
        await api.put(`/contractors/invoices/${id}`, data);
        toast.success('Factura actualizada');
      } else {
        await api.post('/contractors/invoices', data);
        toast.success('Factura registrada');
      }
      navigate('/procurement/invoices');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar la factura');
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
    <Box component="form" onSubmit={handleSubmit}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/procurement/invoices')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? 'Editar Factura' : 'Registrar Factura'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Información General */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
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
                      {c.companyName} ({c.code})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Orden de Compra"
                  name="purchaseOrderId"
                  value={formData.purchaseOrderId}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) {
                      loadPurchaseOrder(e.target.value);
                    }
                  }}
                >
                  <MenuItem value="">Sin orden asociada</MenuItem>
                  {purchaseOrders.map((po) => (
                    <MenuItem key={po.id} value={po.id}>
                      {po.code} - {po.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Proyecto"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin proyecto</MenuItem>
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name} ({p.code})
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
            </Grid>
          </Paper>
        </Grid>

        {/* Datos de Factura */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Datos de Factura
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Nº Factura *"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Nº Control"
                  name="controlNumber"
                  value={formData.controlNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Factura *"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Vencimiento"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Items */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Items de la Factura
              </Typography>
              <Button startIcon={<AddIcon />} onClick={addItem}>
                Agregar Item
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Descripción *</TableCell>
                    <TableCell width={100}>Unidad</TableCell>
                    <TableCell width={100}>Cantidad *</TableCell>
                    <TableCell width={120}>Precio Unit. *</TableCell>
                    <TableCell width={120} align="right">Subtotal</TableCell>
                    <TableCell width={50}></TableCell>
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
                          fullWidth
                        >
                          {units.map((u) => (
                            <MenuItem key={u} value={u}>{u}</MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          inputProps={{ min: 0, step: 0.01 }}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          inputProps={{ min: 0, step: 0.01 }}
                          fullWidth
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
          </Paper>
        </Grid>

        {/* Impuestos y Retenciones */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Impuestos y Retenciones
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="IVA (%)"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Retención ISLR (%)"
                  name="retentionRate"
                  value={formData.retentionRate}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Retención IVA (%)"
                  name="ivaRetentionRate"
                  value={formData.ivaRetentionRate}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Totales */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Totales
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal:</Typography>
                <Typography>{formatCurrency(calculateSubtotal())}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">IVA ({formData.taxRate}%):</Typography>
                <Typography>{formatCurrency(calculateTax())}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="bold">Total:</Typography>
                <Typography fontWeight="bold" color="primary">{formatCurrency(calculateTotal())}</Typography>
              </Box>
              {formData.retentionRate > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Retención ISLR ({formData.retentionRate}%):</Typography>
                  <Typography color="error.main">-{formatCurrency(calculateRetention())}</Typography>
                </Box>
              )}
              {formData.ivaRetentionRate > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Retención IVA ({formData.ivaRetentionRate}%):</Typography>
                  <Typography color="error.main">-{formatCurrency(calculateIvaRetention())}</Typography>
                </Box>
              )}
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="bold">Neto a Pagar:</Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {formatCurrency(calculateNetPayable())}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Notas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notas
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notas adicionales..."
            />
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/procurement/invoices')}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (isEdit ? 'Actualizar' : 'Registrar')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceForm;
