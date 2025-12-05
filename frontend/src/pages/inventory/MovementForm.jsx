import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  createMovement,
  fetchMovementTypes,
  fetchMovementReasons,
  fetchWarehouses,
  fetchItems,
} from '../../store/slices/inventorySlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchAccounts } from '../../store/slices/financeSlice';

const movementTypeLabels = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
  TRANSFER: 'Transferencia',
  ADJUSTMENT_IN: 'Ajuste (+)',
  ADJUSTMENT_OUT: 'Ajuste (-)',
  RETURN: 'Devolución',
};

const reasonLabels = {
  PURCHASE: 'Compra',
  PROJECT_USE: 'Uso en Proyecto',
  SALE: 'Venta',
  DAMAGE: 'Daño',
  LOSS: 'Pérdida',
  THEFT: 'Robo',
  EXPIRY: 'Vencimiento',
  COUNT_ADJUSTMENT: 'Ajuste por Conteo',
  TRANSFER: 'Transferencia',
  RETURN_SUPPLIER: 'Devolución a Proveedor',
  RETURN_PROJECT: 'Devolución de Proyecto',
  DONATION: 'Donación',
  OTHER: 'Otro',
};

// Razones válidas por tipo de movimiento
const reasonsByType = {
  ENTRY: ['PURCHASE', 'RETURN_PROJECT', 'DONATION', 'OTHER'],
  EXIT: ['PROJECT_USE', 'SALE', 'DAMAGE', 'LOSS', 'THEFT', 'EXPIRY', 'OTHER'],
  TRANSFER: ['TRANSFER'],
  ADJUSTMENT_IN: ['COUNT_ADJUSTMENT', 'OTHER'],
  ADJUSTMENT_OUT: ['COUNT_ADJUSTMENT', 'DAMAGE', 'LOSS', 'EXPIRY', 'OTHER'],
  RETURN: ['RETURN_SUPPLIER', 'RETURN_PROJECT', 'OTHER'],
};

const MovementForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { warehouses, items, loading } = useSelector((state) => state.inventory);
  const { projects } = useSelector((state) => state.projects);
  const { employees } = useSelector((state) => state.employees);
  const { accounts } = useSelector((state) => state.finance);
  
  const [formData, setFormData] = useState({
    movementType: 'ENTRY',
    reason: 'PURCHASE',
    itemId: searchParams.get('itemId') || '',
    sourceWarehouseId: '',
    destinationWarehouseId: searchParams.get('warehouseId') || '',
    quantity: '',
    unitCost: '',
    currency: 'USD',
    movementDate: new Date().toISOString().split('T')[0],
    projectId: '',
    employeeId: '',
    accountId: '', // Para integración con Finanzas
    description: '',
    lotNumber: '',
    serialNumber: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchMovementTypes());
    dispatch(fetchMovementReasons());
    dispatch(fetchWarehouses({ status: 'ACTIVE', limit: 100 }));
    dispatch(fetchItems({ status: 'ACTIVE', limit: 500 }));
    dispatch(fetchProjects({ status: 'IN_PROGRESS', limit: 100 }));
    dispatch(fetchEmployees({ status: 'ACTIVE', limit: 100 }));
    dispatch(fetchAccounts({ status: 'ACTIVE' }));
  }, [dispatch]);

  useEffect(() => {
    // Actualizar razón cuando cambia el tipo
    const validReasons = reasonsByType[formData.movementType] || [];
    if (!validReasons.includes(formData.reason)) {
      setFormData(prev => ({ ...prev, reason: validReasons[0] || 'OTHER' }));
    }
    
    // Limpiar almacenes según tipo
    if (['ENTRY', 'ADJUSTMENT_IN', 'RETURN'].includes(formData.movementType)) {
      setFormData(prev => ({ ...prev, sourceWarehouseId: '' }));
    } else if (['EXIT', 'ADJUSTMENT_OUT'].includes(formData.movementType)) {
      setFormData(prev => ({ ...prev, destinationWarehouseId: '' }));
    }
  }, [formData.movementType]);

  useEffect(() => {
    // Cargar datos del item seleccionado
    if (formData.itemId) {
      const item = items.find(i => i.id === formData.itemId);
      setSelectedItem(item);
      if (item && !formData.unitCost) {
        setFormData(prev => ({ ...prev, unitCost: item.unitCost || '', currency: item.currency || 'USD' }));
      }
    } else {
      setSelectedItem(null);
    }
  }, [formData.itemId, items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.itemId) {
      toast.error('Debe seleccionar un item');
      return;
    }
    
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }
    
    // Validar almacenes según tipo
    if (['ENTRY', 'ADJUSTMENT_IN', 'RETURN'].includes(formData.movementType) && !formData.destinationWarehouseId) {
      toast.error('Debe seleccionar el almacén destino');
      return;
    }
    
    if (['EXIT', 'ADJUSTMENT_OUT'].includes(formData.movementType) && !formData.sourceWarehouseId) {
      toast.error('Debe seleccionar el almacén origen');
      return;
    }
    
    if (formData.movementType === 'TRANSFER') {
      if (!formData.sourceWarehouseId || !formData.destinationWarehouseId) {
        toast.error('Debe seleccionar almacén origen y destino');
        return;
      }
      if (formData.sourceWarehouseId === formData.destinationWarehouseId) {
        toast.error('El almacén origen y destino deben ser diferentes');
        return;
      }
    }
    
    setSubmitting(true);
    
    try {
      const dataToSend = {
        movementType: formData.movementType,
        reason: formData.reason,
        itemId: formData.itemId,
        quantity: parseFloat(formData.quantity),
        unitCost: formData.unitCost ? parseFloat(formData.unitCost) : null,
        currency: formData.currency,
        movementDate: formData.movementDate,
        description: formData.description || null,
        lotNumber: formData.lotNumber || null,
        serialNumber: formData.serialNumber || null,
        projectId: formData.projectId || null,
        employeeId: formData.employeeId || null,
        // Incluir cuenta bancaria si es compra (para integración con Finanzas)
        accountId: formData.reason === 'PURCHASE' && formData.accountId ? formData.accountId : null,
      };
      
      // Asignar almacenes según tipo
      if (['ENTRY', 'ADJUSTMENT_IN', 'RETURN'].includes(formData.movementType)) {
        dataToSend.destinationWarehouseId = formData.destinationWarehouseId;
      } else if (['EXIT', 'ADJUSTMENT_OUT'].includes(formData.movementType)) {
        dataToSend.sourceWarehouseId = formData.sourceWarehouseId;
      } else if (formData.movementType === 'TRANSFER') {
        dataToSend.sourceWarehouseId = formData.sourceWarehouseId;
        dataToSend.destinationWarehouseId = formData.destinationWarehouseId;
      }
      
      await dispatch(createMovement(dataToSend)).unwrap();
      toast.success('Movimiento registrado exitosamente');
      navigate('/inventory/movements');
    } catch (error) {
      toast.error(error || 'Error al registrar movimiento');
    } finally {
      setSubmitting(false);
    }
  };

  const validReasons = reasonsByType[formData.movementType] || [];
  const needsSource = ['EXIT', 'ADJUSTMENT_OUT', 'TRANSFER'].includes(formData.movementType);
  const needsDestination = ['ENTRY', 'ADJUSTMENT_IN', 'RETURN', 'TRANSFER'].includes(formData.movementType);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Nuevo Movimiento de Inventario
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Tipo de Movimiento */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Tipo de Movimiento
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                required
                label="Tipo de Movimiento"
                name="movementType"
                value={formData.movementType}
                onChange={handleChange}
              >
                {Object.entries(movementTypeLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                required
                label="Razón"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              >
                {validReasons.map((key) => (
                  <MenuItem key={key} value={key}>{reasonLabels[key]}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                type="date"
                label="Fecha del Movimiento"
                name="movementDate"
                value={formData.movementDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Item y Cantidad */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Item y Cantidad
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                required
                label="Item"
                name="itemId"
                value={formData.itemId}
                onChange={handleChange}
              >
                <MenuItem value="">Seleccionar item...</MenuItem>
                {items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.code} - {item.name} ({item.unit})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                required
                type="number"
                label="Cantidad"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                inputProps={{ min: 0.0001, step: 0.0001 }}
                helperText={selectedItem ? `Stock actual: ${selectedItem.totalStock} ${selectedItem.unit}` : ''}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Unidad"
                value={selectedItem?.unit || '-'}
                disabled
              />
            </Grid>

            {/* Costo */}
            {['ENTRY', 'PURCHASE'].includes(formData.movementType) || formData.reason === 'PURCHASE' ? (
              <>
                <Grid item xs={6} md={3}>
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
                <Grid item xs={6} md={3}>
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
              </>
            ) : null}

            {/* Almacenes */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Almacenes
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {needsSource && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Almacén Origen"
                  name="sourceWarehouseId"
                  value={formData.sourceWarehouseId}
                  onChange={handleChange}
                >
                  <MenuItem value="">Seleccionar almacén...</MenuItem>
                  {warehouses.map((wh) => (
                    <MenuItem key={wh.id} value={wh.id}>
                      {wh.code} - {wh.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {needsDestination && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Almacén Destino"
                  name="destinationWarehouseId"
                  value={formData.destinationWarehouseId}
                  onChange={handleChange}
                >
                  <MenuItem value="">Seleccionar almacén...</MenuItem>
                  {warehouses.map((wh) => (
                    <MenuItem key={wh.id} value={wh.id}>
                      {wh.code} - {wh.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* Referencias */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Referencias (Opcional)
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Proyecto Relacionado"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
              >
                <MenuItem value="">Ninguno</MenuItem>
                {projects.map((proj) => (
                  <MenuItem key={proj.id} value={proj.id}>
                    {proj.code} - {proj.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Empleado que Recibe/Entrega"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
              >
                <MenuItem value="">Ninguno</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Integración con Finanzas - Cuenta para compras */}
            {formData.reason === 'PURCHASE' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Integración con Finanzas
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Cuenta Bancaria para Pago"
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    helperText="Si selecciona una cuenta, se registrará automáticamente una transacción de gasto"
                  >
                    <MenuItem value="">No registrar transacción</MenuItem>
                    {accounts?.map((acc) => (
                      <MenuItem key={acc.id} value={acc.id}>
                        {acc.name} ({acc.currency})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </>
            )}

            {/* Trazabilidad */}
            {selectedItem?.isLotTracked && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Lote"
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleChange}
                />
              </Grid>
            )}

            {selectedItem?.isSerialTracked && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Serie"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                />
              </Grid>
            )}

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción / Notas"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="Información adicional sobre el movimiento"
              />
            </Grid>

            {/* Resumen */}
            {formData.quantity && formData.unitCost && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Costo Total:</strong> {new Intl.NumberFormat('es-VE', {
                      style: 'currency',
                      currency: formData.currency,
                    }).format(parseFloat(formData.quantity) * parseFloat(formData.unitCost))}
                  </Typography>
                </Alert>
              </Grid>
            )}

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
                  {submitting ? <CircularProgress size={24} /> : 'Registrar Movimiento'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default MovementForm;
