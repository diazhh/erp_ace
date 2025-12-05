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
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchContractors } from '../../store/slices/contractorSlice';
import api from '../../services/api';

const paymentMethods = [
  { code: 'TRANSFER', name: 'Transferencia Bancaria' },
  { code: 'CHECK', name: 'Cheque' },
  { code: 'CASH', name: 'Efectivo' },
  { code: 'CRYPTO', name: 'Criptomoneda' },
  { code: 'MOBILE_PAYMENT', name: 'Pago Móvil' },
];

const PaymentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = !!id;

  const { contractors } = useSelector((state) => state.contractors);

  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    contractorId: '',
    invoiceId: location.state?.invoiceId || '',
    purchaseOrderId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'TRANSFER',
    currency: 'USD',
    amount: '',
    referenceNumber: '',
    concept: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchContractors({ limit: 100 }));
    
    if (isEdit) {
      loadPayment();
    } else if (location.state?.invoiceId) {
      loadInvoice(location.state.invoiceId);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (formData.contractorId) {
      loadContractorInvoices(formData.contractorId);
    }
  }, [formData.contractorId]);

  const loadPayment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contractors/payments/${id}`);
      const payment = response.data.data;
      setFormData({
        contractorId: payment.contractorId,
        invoiceId: payment.invoiceId || '',
        purchaseOrderId: payment.purchaseOrderId || '',
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        currency: payment.currency,
        amount: payment.amount,
        referenceNumber: payment.referenceNumber || '',
        concept: payment.concept || '',
        notes: payment.notes || '',
      });
      if (payment.invoice) {
        setSelectedInvoice(payment.invoice);
      }
    } catch (error) {
      toast.error('Error al cargar el pago');
      navigate('/procurement/payments');
    } finally {
      setLoading(false);
    }
  };

  const loadInvoice = async (invoiceId) => {
    try {
      const response = await api.get(`/contractors/invoices/${invoiceId}`);
      const invoice = response.data.data;
      setSelectedInvoice(invoice);
      const pendingAmount = (invoice.netPayable || invoice.total) - (invoice.paidAmount || 0);
      setFormData(prev => ({
        ...prev,
        contractorId: invoice.contractorId,
        invoiceId: invoice.id,
        purchaseOrderId: invoice.purchaseOrderId || '',
        currency: invoice.currency,
        amount: pendingAmount > 0 ? pendingAmount : '',
        concept: `Pago factura ${invoice.invoiceNumber}`,
      }));
    } catch (error) {
      console.error('Error loading invoice:', error);
    }
  };

  const loadContractorInvoices = async (contractorId) => {
    try {
      const response = await api.get(`/contractors/invoices`, {
        params: { contractorId, status: 'APPROVED,PARTIAL', limit: 100 }
      });
      setInvoices(response.data.data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvoiceChange = (e) => {
    const invoiceId = e.target.value;
    handleChange(e);
    
    if (invoiceId) {
      const invoice = invoices.find(i => i.id === invoiceId);
      if (invoice) {
        setSelectedInvoice(invoice);
        const pendingAmount = (invoice.netPayable || invoice.total) - (invoice.paidAmount || 0);
        setFormData(prev => ({
          ...prev,
          invoiceId,
          purchaseOrderId: invoice.purchaseOrderId || '',
          currency: invoice.currency,
          amount: pendingAmount > 0 ? pendingAmount : prev.amount,
          concept: `Pago factura ${invoice.invoiceNumber}`,
        }));
      }
    } else {
      setSelectedInvoice(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.contractorId) {
      toast.error('Seleccione un contratista');
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Ingrese un monto válido');
      return;
    }
    if (!formData.paymentDate) {
      toast.error('Ingrese la fecha de pago');
      return;
    }

    try {
      setLoading(true);
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (isEdit) {
        await api.put(`/contractors/payments/${id}`, data);
        toast.success('Pago actualizado');
      } else {
        await api.post('/contractors/payments', data);
        toast.success('Pago registrado');
      }
      navigate('/procurement/payments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el pago');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency === 'USDT' ? 'USD' : currency,
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
        <IconButton onClick={() => navigate('/procurement/payments')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? 'Editar Pago' : 'Registrar Pago'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Invoice Summary Card */}
        {selectedInvoice && (
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'info.light' }}>
              <CardContent>
                <Typography variant="h6" color="info.contrastText" gutterBottom>
                  Factura Seleccionada: {selectedInvoice.code}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="info.contrastText">Total Factura</Typography>
                    <Typography color="info.contrastText" fontWeight="bold">
                      {formatCurrency(selectedInvoice.total, selectedInvoice.currency)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="info.contrastText">Neto a Pagar</Typography>
                    <Typography color="info.contrastText" fontWeight="bold">
                      {formatCurrency(selectedInvoice.netPayable || selectedInvoice.total, selectedInvoice.currency)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="info.contrastText">Pagado</Typography>
                    <Typography color="info.contrastText" fontWeight="bold">
                      {formatCurrency(selectedInvoice.paidAmount, selectedInvoice.currency)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="info.contrastText">Pendiente</Typography>
                    <Typography color="info.contrastText" fontWeight="bold">
                      {formatCurrency((selectedInvoice.netPayable || selectedInvoice.total) - (selectedInvoice.paidAmount || 0), selectedInvoice.currency)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Información General */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información del Pago
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
                  label="Factura"
                  name="invoiceId"
                  value={formData.invoiceId}
                  onChange={handleInvoiceChange}
                >
                  <MenuItem value="">Sin factura asociada</MenuItem>
                  {invoices.map((inv) => (
                    <MenuItem key={inv.id} value={inv.id}>
                      {inv.code} - Nº {inv.invoiceNumber} ({formatCurrency(inv.total, inv.currency)})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Pago *"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Método de Pago *"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  {paymentMethods.map((m) => (
                    <MenuItem key={m.code} value={m.code}>
                      {m.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Monto *"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Referencia y Concepto */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detalles Adicionales
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Referencia"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  placeholder="Ej: 123456789"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Concepto"
                  name="concept"
                  value={formData.concept}
                  onChange={handleChange}
                  placeholder="Concepto del pago"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notas"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Notas adicionales..."
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Amount Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'success.light' }}>
            <Typography variant="h6" color="success.contrastText" gutterBottom>
              Resumen del Pago
            </Typography>
            <Divider sx={{ mb: 2, borderColor: 'success.main' }} />
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body1" color="success.contrastText">
                Monto a Pagar
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="success.contrastText">
                {formatCurrency(formData.amount || 0, formData.currency)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/procurement/payments')}>
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

export default PaymentForm;
