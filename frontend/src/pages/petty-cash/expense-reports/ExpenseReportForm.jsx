import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Autocomplete,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  fetchExpenseReportById,
  createExpenseReport,
  updateExpenseReport,
  submitExpenseReport,
  fetchExpenseReportCatalogs,
  clearError,
  clearSuccess,
  clearCurrentReport,
} from '../../../store/slices/expenseReportSlice';
import api from '../../../services/api';

const emptyItem = {
  itemType: 'OTHER',
  description: '',
  quantity: 1,
  unit: 'UNIT',
  unitPrice: 0,
  amount: 0,
  receiptNumber: '',
  receiptDate: '',
  vendor: '',
  vendorRif: '',
  notes: '',
};

export default function ExpenseReportForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isEdit = Boolean(id);

  const { currentReport, catalogs, loading, error, success } = useSelector((state) => state.expenseReports);

  const [formData, setFormData] = useState({
    pettyCashEntryId: '',
    employeeId: '',
    reportDate: new Date().toISOString().split('T')[0],
    changeReturned: 0,
    projectId: '',
    notes: '',
    items: [{ ...emptyItem }],
  });

  const [pettyCashEntries, setPettyCashEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Load catalogs
  useEffect(() => {
    dispatch(fetchExpenseReportCatalogs());
    loadPettyCashEntries();
    loadEmployees();
    loadProjects();
    
    return () => {
      dispatch(clearCurrentReport());
    };
  }, [dispatch]);

  // Load report for edit
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchExpenseReportById(id));
    }
  }, [dispatch, id, isEdit]);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && currentReport) {
      setFormData({
        pettyCashEntryId: currentReport.pettyCashEntryId || '',
        employeeId: currentReport.employeeId || '',
        reportDate: currentReport.reportDate?.split('T')[0] || '',
        changeReturned: currentReport.changeReturned || 0,
        projectId: currentReport.projectId || '',
        notes: currentReport.notes || '',
        items: currentReport.items?.length > 0 
          ? currentReport.items.map(item => ({
              itemType: item.itemType,
              description: item.description,
              quantity: parseFloat(item.quantity),
              unit: item.unit || 'UNIT',
              unitPrice: parseFloat(item.unitPrice),
              amount: parseFloat(item.amount),
              receiptNumber: item.receiptNumber || '',
              receiptDate: item.receiptDate?.split('T')[0] || '',
              vendor: item.vendor || '',
              vendorRif: item.vendorRif || '',
              notes: item.notes || '',
            }))
          : [{ ...emptyItem }],
      });
      setSelectedEntry(currentReport.pettyCashEntry);
    }
  }, [currentReport, isEdit]);

  // Success redirect
  useEffect(() => {
    if (success && !isEdit) {
      const timer = setTimeout(() => {
        navigate('/petty-cash/expense-reports');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, isEdit, navigate]);

  const loadPettyCashEntries = async () => {
    try {
      // Get entries that are PAID and don't have expense report yet
      const response = await api.get('/petty-cash/entries', {
        params: { status: 'PAID', hasExpenseReport: false, limit: 100 },
      });
      setPettyCashEntries(response.data.data || []);
    } catch (err) {
      console.error('Error loading petty cash entries:', err);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await api.get('/employees', { params: { limit: 500, status: 'ACTIVE' } });
      setEmployees(response.data.data || []);
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects', { params: { limit: 500 } });
      setProjects(response.data.data || []);
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (field === 'pettyCashEntryId') {
      const entry = pettyCashEntries.find(e => e.id === value);
      setSelectedEntry(entry);
      if (entry) {
        setFormData((prev) => ({
          ...prev,
          pettyCashEntryId: value,
          employeeId: entry.requestedById || prev.employeeId,
          projectId: entry.projectId || prev.projectId,
        }));
      }
    }
  };

  const handleItemChange = (index, field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Auto-calculate amount
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(newItems[index].quantity) || 0;
        const price = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(newItems[index].unitPrice) || 0;
        newItems[index].amount = qty * price;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyItem }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const calculateTotalSpent = () => {
    return formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!isEdit && !formData.pettyCashEntryId) {
      errors.pettyCashEntryId = 'Seleccione un movimiento de caja chica';
    }
    if (!formData.employeeId) {
      errors.employeeId = 'Seleccione un empleado';
    }
    if (!formData.reportDate) {
      errors.reportDate = 'Ingrese la fecha del reporte';
    }
    
    const validItems = formData.items.filter(item => item.description.trim());
    if (validItems.length === 0) {
      errors.items = 'Agregue al menos un item';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (andSend = false) => {
    if (!validateForm()) return;
    
    const validItems = formData.items.filter(item => item.description.trim());
    const data = {
      ...formData,
      items: validItems,
    };
    
    try {
      if (isEdit) {
        await dispatch(updateExpenseReport({ id, data })).unwrap();
        if (andSend) {
          await dispatch(submitExpenseReport(id)).unwrap();
        }
      } else {
        const result = await dispatch(createExpenseReport(data)).unwrap();
        if (andSend && result.data?.id) {
          await dispatch(submitExpenseReport(result.data.id)).unwrap();
        }
      }
    } catch (err) {
      console.error('Error saving report:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (loading && isEdit && !currentReport) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/petty-cash/expense-reports')}
          sx={{ mb: 1 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? `Editar Reporte ${currentReport?.code}` : 'Nuevo Reporte de Gastos'}
        </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* General Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Información General</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {!isEdit && (
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Movimiento de Caja Chica *"
                    value={formData.pettyCashEntryId}
                    onChange={handleChange('pettyCashEntryId')}
                    error={!!formErrors.pettyCashEntryId}
                    helperText={formErrors.pettyCashEntryId}
                  >
                    <MenuItem value="">Seleccione...</MenuItem>
                    {pettyCashEntries.map((entry) => (
                      <MenuItem key={entry.id} value={entry.id}>
                        {entry.code} - {entry.description} ({formatCurrency(entry.amount)})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Empleado *"
                  value={formData.employeeId}
                  onChange={handleChange('employeeId')}
                  error={!!formErrors.employeeId}
                  helperText={formErrors.employeeId}
                >
                  <MenuItem value="">Seleccione...</MenuItem>
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeCode})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha del Reporte *"
                  value={formData.reportDate}
                  onChange={handleChange('reportDate')}
                  InputLabelProps={{ shrink: true }}
                  error={!!formErrors.reportDate}
                  helperText={formErrors.reportDate}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Proyecto"
                  value={formData.projectId}
                  onChange={handleChange('projectId')}
                >
                  <MenuItem value="">Sin proyecto</MenuItem>
                  {projects.map((proj) => (
                    <MenuItem key={proj.id} value={proj.id}>
                      {proj.code} - {proj.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Notas"
                  value={formData.notes}
                  onChange={handleChange('notes')}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Financial Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Resumen Financiero</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Monto Recibido</Typography>
                <Typography fontWeight="medium">
                  {formatCurrency(selectedEntry?.amount || currentReport?.amountReceived || 0)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Total Gastado</Typography>
                <Typography fontWeight="medium">{formatCurrency(calculateTotalSpent())}</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                label="Vuelto Devuelto"
                value={formData.changeReturned}
                onChange={handleChange('changeReturned')}
                inputProps={{ min: 0, step: 0.01 }}
              />
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="bold">Diferencia</Typography>
                <Typography
                  fontWeight="bold"
                  color={
                    calculateTotalSpent() - (selectedEntry?.amount || currentReport?.amountReceived || 0) + parseFloat(formData.changeReturned || 0) > 0
                      ? 'error.main'
                      : 'success.main'
                  }
                >
                  {formatCurrency(
                    calculateTotalSpent() - (selectedEntry?.amount || currentReport?.amountReceived || 0) + parseFloat(formData.changeReturned || 0)
                  )}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Items */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Detalle de Gastos</Typography>
              <Button startIcon={<AddIcon />} onClick={addItem}>
                Agregar Item
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {formErrors.items && (
              <Alert severity="error" sx={{ mb: 2 }}>{formErrors.items}</Alert>
            )}

            {isMobile ? (
              // Mobile view - Cards
              <Stack spacing={2}>
                {formData.items.map((item, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">Item {index + 1}</Typography>
                            {formData.items.length > 1 && (
                              <IconButton size="small" color="error" onClick={() => removeItem(index)}>
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            label="Tipo"
                            value={item.itemType}
                            onChange={handleItemChange(index, 'itemType')}
                          >
                            {catalogs?.itemTypes?.map((type) => (
                              <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Descripción *"
                            value={item.description}
                            onChange={handleItemChange(index, 'description')}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Cantidad"
                            value={item.quantity}
                            onChange={handleItemChange(index, 'quantity')}
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Precio Unit."
                            value={item.unitPrice}
                            onChange={handleItemChange(index, 'unitPrice')}
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" textAlign="right">
                            Monto: <strong>{formatCurrency(item.amount)}</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="N° Factura"
                            value={item.receiptNumber}
                            onChange={handleItemChange(index, 'receiptNumber')}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Proveedor"
                            value={item.vendor}
                            onChange={handleItemChange(index, 'vendor')}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              // Desktop view - Table
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width={120}>Tipo</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell width={80}>Cant.</TableCell>
                      <TableCell width={100}>Precio</TableCell>
                      <TableCell width={100}>Monto</TableCell>
                      <TableCell width={100}>Factura</TableCell>
                      <TableCell width={150}>Proveedor</TableCell>
                      <TableCell width={50}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            value={item.itemType}
                            onChange={handleItemChange(index, 'itemType')}
                          >
                            {catalogs?.itemTypes?.map((type) => (
                              <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={item.description}
                            onChange={handleItemChange(index, 'description')}
                            placeholder="Descripción *"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={handleItemChange(index, 'quantity')}
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={item.unitPrice}
                            onChange={handleItemChange(index, 'unitPrice')}
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography>{formatCurrency(item.amount)}</Typography>
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={item.receiptNumber}
                            onChange={handleItemChange(index, 'receiptNumber')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={item.vendor}
                            onChange={handleItemChange(index, 'vendor')}
                          />
                        </TableCell>
                        <TableCell>
                          {formData.items.length > 1 && (
                            <IconButton size="small" color="error" onClick={() => removeItem(index)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/petty-cash/expense-reports')}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => handleSubmit(false)}
              disabled={loading}
            >
              Guardar Borrador
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<SendIcon />}
              onClick={() => handleSubmit(true)}
              disabled={loading}
            >
              Guardar y Enviar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
