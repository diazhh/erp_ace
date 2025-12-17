import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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

// orderTypes will be defined inside component using t()

const units = ['UND', 'M', 'M2', 'M3', 'KG', 'LT', 'HR', 'DIA', 'SEM', 'MES', 'GLB'];

const PurchaseOrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = !!id;

  // Obtener wellId y fieldId de los query params (para crear desde detalle de pozo)
  const wellIdFromUrl = searchParams.get('wellId');
  const fieldIdFromUrl = searchParams.get('fieldId');

  const orderTypes = [
    { code: 'PURCHASE', name: t('procurement.orderTypePurchase') },
    { code: 'SERVICE', name: t('procurement.orderTypeService') },
    { code: 'WORK', name: t('procurement.orderTypeWork') },
  ];

  const { contractors } = useSelector((state) => state.contractors);
  const { projects } = useSelector((state) => state.projects);

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [wells, setWells] = useState([]);
  const [filteredWells, setFilteredWells] = useState([]);
  const [formData, setFormData] = useState({
    contractorId: '',
    projectId: '',
    fieldId: '',
    wellId: '',
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
    loadFieldsAndWells();
    
    if (isEdit) {
      loadOrder();
    } else {
      // Si viene desde detalle de pozo, precargar wellId y fieldId
      if (wellIdFromUrl || fieldIdFromUrl) {
        setFormData((prev) => ({
          ...prev,
          wellId: wellIdFromUrl || '',
          fieldId: fieldIdFromUrl || '',
        }));
      }
    }
  }, [dispatch, id, wellIdFromUrl, fieldIdFromUrl]);

  // Filtrar pozos cuando cambia el campo seleccionado
  useEffect(() => {
    if (formData.fieldId) {
      setFilteredWells(wells.filter(w => w.field_id === formData.fieldId));
    } else {
      setFilteredWells(wells);
    }
  }, [formData.fieldId, wells]);

  const loadFieldsAndWells = async () => {
    try {
      const [fieldsRes, wellsRes] = await Promise.all([
        api.get('/production/fields', { params: { limit: 100 } }),
        api.get('/production/wells', { params: { limit: 200 } }),
      ]);
      setFields(fieldsRes.data.data || []);
      setWells(wellsRes.data.data || []);
    } catch (error) {
      console.error('Error loading fields/wells:', error);
    }
  };

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contractors/purchase-orders/${id}`);
      const order = response.data.data;
      setFormData({
        contractorId: order.contractorId,
        projectId: order.projectId || '',
        fieldId: order.fieldId || '',
        wellId: order.wellId || '',
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
      toast.error(t('procurement.loadError'));
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
      toast.error(t('procurement.selectContractor'));
      return;
    }
    if (!formData.title) {
      toast.error(t('procurement.enterTitle'));
      return;
    }
    if (items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error(t('procurement.completeItems'));
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
        toast.success(t('procurement.orderUpdated'));
      } else {
        await dispatch(createPurchaseOrder(data)).unwrap();
        toast.success(t('procurement.orderCreated'));
      }
      // Navegar de vuelta al pozo si viene desde allí
      if (wellIdFromUrl) {
        navigate(`/production/wells/${wellIdFromUrl}`);
      } else {
        navigate('/procurement/purchase-orders');
      }
    } catch (error) {
      toast.error(error.message || t('procurement.saveError'));
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
          {isEdit ? t('procurement.editOrder') : t('procurement.newPurchaseOrder')}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Información General */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom>
                {t('procurement.generalInfo')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label={`${t('procurement.contractor')} *`}
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
                    label={`${t('procurement.project')} (${t('common.optional')})`}
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                  >
                    <MenuItem value="">{t('procurement.noProject')}</MenuItem>
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
                    label={`${t('procurement.orderType')} *`}
                    name="orderType"
                    value={formData.orderType}
                    onChange={handleChange}
                    required
                  >
                    {orderTypes.map((ot) => (
                      <MenuItem key={ot.code} value={ot.code}>
                        {ot.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label={`${t('production.field')} (${t('common.optional')})`}
                    name="fieldId"
                    value={formData.fieldId}
                    onChange={handleChange}
                    disabled={!!wellIdFromUrl}
                  >
                    <MenuItem value="">{t('common.none')}</MenuItem>
                    {fields.map((field) => (
                      <MenuItem key={field.id} value={field.id}>
                        {field.code} - {field.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label={`${t('production.well')} (${t('common.optional')})`}
                    name="wellId"
                    value={formData.wellId}
                    onChange={handleChange}
                    disabled={!!wellIdFromUrl}
                  >
                    <MenuItem value="">{t('common.none')}</MenuItem>
                    {filteredWells.map((well) => (
                      <MenuItem key={well.id} value={well.id}>
                        {well.code} - {well.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label={t('procurement.currency')}
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
                    label={`${t('procurement.orderTitle')} *`}
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
                    label={t('procurement.description')}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label={t('procurement.orderDate')}
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
                    label={t('procurement.deliveryDate')}
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
                    label={t('procurement.taxRate')}
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
                {t('procurement.terms')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('procurement.paymentTerms')}
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    placeholder="Ej: 50% anticipo, 50% contra entrega"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('procurement.deliveryTerms')}
                    name="deliveryTerms"
                    value={formData.deliveryTerms}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('procurement.warranty')}
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
                    label={t('procurement.deliveryAddress')}
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
                  {t('procurement.items')}
                </Typography>
                <Button startIcon={<AddIcon />} onClick={addItem}>
                  {t('procurement.addItem')}
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('procurement.itemNumber')}</TableCell>
                      <TableCell>{t('procurement.itemDescription')}</TableCell>
                      <TableCell>{t('procurement.unit')}</TableCell>
                      <TableCell align="right">{t('procurement.quantity')}</TableCell>
                      <TableCell align="right">{t('procurement.unitPrice')}</TableCell>
                      <TableCell align="right">{t('procurement.subtotal')}</TableCell>
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
                            placeholder={t('procurement.itemPlaceholder')}
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
                    <Typography>{t('procurement.subtotal')}:</Typography>
                    <Typography>{formatCurrency(calculateSubtotal())}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{t('procurement.taxRate').replace('(%)', '')} ({formData.taxRate}%):</Typography>
                    <Typography>{formatCurrency(calculateTax())}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">{t('procurement.total')}:</Typography>
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
                label={t('procurement.notes')}
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
                {t('common.cancel')}
              </Button>
              <Button 
                variant="contained" 
                type="submit"
                fullWidth={isMobile}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (isEdit ? t('procurement.saveChanges') : t('procurement.createOrder'))}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PurchaseOrderForm;
