import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  InputAdornment,
  CircularProgress,
  Alert,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { createReplenishment } from '../../store/slices/pettyCashSlice';

const PettyCashReplenishDialog = ({ open, onClose, pettyCash }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    notes: '',
    createTransaction: true,
  });

  useEffect(() => {
    if (open && pettyCash) {
      // Calcular monto sugerido
      const initial = parseFloat(pettyCash.initialAmount) || 0;
      const current = parseFloat(pettyCash.currentBalance) || 0;
      const suggested = Math.max(0, initial - current);
      
      setReceiptFile(null);
      setReceiptPreview(null);
      setFormData({
        amount: suggested > 0 ? suggested.toFixed(2) : '',
        description: 'Reposición de caja chica',
        notes: '',
        createTransaction: !!pettyCash.bankAccountId,
      });
    }
  }, [open, pettyCash]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
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
        amount: parseFloat(formData.amount),
        description: formData.description,
        notes: formData.notes,
        createTransaction: formData.createTransaction,
      };

      await dispatch(createReplenishment({ pettyCashId: pettyCash.id, data })).unwrap();
      toast.success('Reposición registrada');
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentBalance = pettyCash?.currentBalance ? parseFloat(pettyCash.currentBalance) : 0;
  const initialAmount = pettyCash?.initialAmount ? parseFloat(pettyCash.initialAmount) : 0;
  const amount = formData.amount ? parseFloat(formData.amount) : 0;
  const newBalance = currentBalance + amount;

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(false)} 
      maxWidth="sm" 
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: { maxHeight: fullScreen ? '100%' : '90vh' }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Reponer Caja Chica</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Saldo Actual</Typography>
                <Typography variant="h6" color="error.main">
                  {pettyCash?.currency} {currentBalance.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Monto Inicial</Typography>
                <Typography variant="h6">
                  {pettyCash?.currency} {initialAmount.toFixed(2)}
                </Typography>
              </Grid>
              {amount > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Nuevo Saldo</Typography>
                  <Typography variant="h5" color="success.main">
                    {pettyCash?.currency} {newBalance.toFixed(2)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="amount"
                label="Monto a Reponer"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">{pettyCash?.currency}</InputAdornment>,
                }}
                inputProps={{ min: 0.01, step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {pettyCash?.bankAccountId && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="createTransaction"
                      checked={formData.createTransaction}
                      onChange={handleChange}
                    />
                  }
                  label="Registrar egreso en cuenta bancaria asociada"
                />
                {formData.createTransaction && pettyCash?.bankAccount && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Se registrará un egreso en la cuenta "{pettyCash.bankAccount.name}"
                  </Alert>
                )}
              </Grid>
            )}

            {!pettyCash?.bankAccountId && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  No hay cuenta bancaria asociada. La reposición se registrará solo en la caja chica.
                </Alert>
              </Grid>
            )}

            {/* Comprobante (opcional) */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Comprobante de transferencia (opcional)
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                id="replenish-receipt-input"
              />
              {!receiptFile ? (
                <Button
                  variant="outlined"
                  component="label"
                  htmlFor="replenish-receipt-input"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{ py: 1.5, borderStyle: 'dashed' }}
                >
                  Subir comprobante
                </Button>
              ) : (
                <Box sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: 1, 
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}>
                  {receiptPreview ? (
                    <Box
                      component="img"
                      src={receiptPreview}
                      alt="Preview"
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                    />
                  ) : (
                    <Box sx={{ 
                      width: 60, height: 60, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: 'grey.100', borderRadius: 1,
                    }}>
                      {receiptFile.type === 'application/pdf' ? (
                        <PdfIcon sx={{ fontSize: 30, color: 'error.main' }} />
                      ) : (
                        <ImageIcon sx={{ fontSize: 30, color: 'grey.400' }} />
                      )}
                    </Box>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap>{receiptFile.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(receiptFile.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Box>
                  <IconButton color="error" onClick={handleRemoveFile} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notas"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                size={fullScreen ? 'small' : 'medium'}
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
            color="success"
            disabled={loading || !formData.amount}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Reponer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PettyCashReplenishDialog;
