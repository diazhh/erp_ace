import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { createEntry, fetchCategories } from '../../store/slices/pettyCashSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';

const PettyCashEntryDialog = ({ open, onClose, pettyCash }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const fileInputRef = useRef(null);
  const { categories } = useSelector((state) => state.pettyCash);
  const { employees } = useSelector((state) => state.employees);

  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [formData, setFormData] = useState({
    entryType: 'EXPENSE',
    amount: '',
    category: '',
    description: '',
    receiptNumber: '',
    receiptDate: new Date().toISOString().split('T')[0],
    vendor: '',
    vendorRif: '',
    entryDate: new Date().toISOString().split('T')[0],
    beneficiaryId: '',
    beneficiaryName: '',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchCategories());
      dispatch(fetchEmployees({ status: 'ACTIVE', limit: 100 }));
      setReceiptFile(null);
      setReceiptPreview(null);
      setFormData({
        entryType: 'EXPENSE',
        amount: '',
        category: '',
        description: '',
        receiptNumber: '',
        receiptDate: new Date().toISOString().split('T')[0],
        vendor: '',
        vendorRif: '',
        entryDate: new Date().toISOString().split('T')[0],
        beneficiaryId: '',
        beneficiaryName: '',
        notes: '',
      });
    }
  }, [open, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      // Crear preview si es imagen
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReceiptPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        beneficiaryId: formData.beneficiaryId || null,
      };

      await dispatch(createEntry({ pettyCashId: pettyCash.id, data })).unwrap();
      toast.success('Gasto registrado');
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const maxExpense = pettyCash?.maximumExpense ? parseFloat(pettyCash.maximumExpense) : null;
  const currentBalance = pettyCash?.currentBalance ? parseFloat(pettyCash.currentBalance) : 0;
  const amount = formData.amount ? parseFloat(formData.amount) : 0;

  const exceedsMax = maxExpense && amount > maxExpense;
  const exceedsBalance = amount > currentBalance;

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(false)} 
      maxWidth="md" 
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: { 
          maxHeight: fullScreen ? '100%' : '90vh',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Registrar Gasto</DialogTitle>
        <DialogContent>
          {exceedsBalance && (
            <Alert severity="error" sx={{ mb: 2 }}>
              El monto excede el saldo disponible ({pettyCash?.currency} {currentBalance.toFixed(2)})
            </Alert>
          )}
          {exceedsMax && !exceedsBalance && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              El monto excede el máximo permitido por gasto ({pettyCash?.currency} {maxExpense.toFixed(2)})
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="amount"
                label="Monto"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                required
                error={exceedsBalance || exceedsMax}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{pettyCash?.currency}</InputAdornment>,
                }}
                inputProps={{ min: 0.01, step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="entryDate"
                label="Fecha del Gasto"
                type="date"
                value={formData.entryDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Categoría"
                >
                  <MenuItem value="">Sin categoría</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.code} value={cat.code}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Beneficiario (Empleado)</InputLabel>
                <Select
                  name="beneficiaryId"
                  value={formData.beneficiaryId}
                  onChange={handleChange}
                  label="Beneficiario (Empleado)"
                >
                  <MenuItem value="">Externo</MenuItem>
                  {employees.filter(e => e.status === 'ACTIVE').map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {!formData.beneficiaryId && (
              <Grid item xs={12}>
                <TextField
                  name="beneficiaryName"
                  label="Nombre del Beneficiario"
                  value={formData.beneficiaryName}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Nombre de persona o empresa externa"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={2}
                placeholder="Detalle del gasto realizado"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="vendor"
                label="Proveedor/Comercio"
                value={formData.vendor}
                onChange={handleChange}
                fullWidth
                size={fullScreen ? 'small' : 'medium'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="vendorRif"
                label="RIF Proveedor"
                value={formData.vendorRif}
                onChange={handleChange}
                fullWidth
                placeholder="J-12345678-9"
                size={fullScreen ? 'small' : 'medium'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="receiptNumber"
                label="N° Factura/Recibo"
                value={formData.receiptNumber}
                onChange={handleChange}
                fullWidth
                size={fullScreen ? 'small' : 'medium'}
              />
            </Grid>

            {/* Comprobante (opcional) */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Comprobante (opcional)
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                id="receipt-file-input"
              />
              {!receiptFile ? (
                <Button
                  variant="outlined"
                  component="label"
                  htmlFor="receipt-file-input"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{ py: 2, borderStyle: 'dashed' }}
                >
                  Subir imagen o PDF del recibo
                </Button>
              ) : (
                <Box sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: 1, 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                }}>
                  {receiptPreview ? (
                    <Box
                      component="img"
                      src={receiptPreview}
                      alt="Preview"
                      sx={{ 
                        width: { xs: '100%', sm: 100 }, 
                        height: { xs: 'auto', sm: 100 }, 
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  ) : (
                    <Box sx={{ 
                      width: { xs: '100%', sm: 100 }, 
                      height: 100, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                    }}>
                      <ImageIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                    </Box>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap>
                      {receiptFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(receiptFile.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Box>
                  <IconButton color="error" onClick={handleRemoveFile} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notas adicionales"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={loading || exceedsBalance}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Registrar Gasto
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PettyCashEntryDialog;
