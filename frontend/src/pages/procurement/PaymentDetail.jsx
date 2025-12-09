import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  PlayArrow as ProcessIcon,
  PictureAsPdf as PdfIcon,
  Payment as PaymentIcon,
  Business as ContractorIcon,
  Receipt as InvoiceIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AttachmentSection from '../../components/common/AttachmentSection';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const statusColors = {
  PENDING: 'warning',
  PROCESSING: 'info',
  COMPLETED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

const statusLabels = {
  PENDING: 'Pendiente',
  PROCESSING: 'En Proceso',
  COMPLETED: 'Completado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

const paymentMethodLabels = {
  TRANSFER: 'Transferencia Bancaria',
  CHECK: 'Cheque',
  CASH: 'Efectivo',
  CRYPTO: 'Criptomoneda',
  MOBILE_PAYMENT: 'Pago Móvil',
};

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayment();
  }, [id]);

  const loadPayment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contractors/payments/${id}`);
      setPayment(response.data.data);
    } catch (error) {
      toast.error('Error al cargar el pago');
      navigate('/procurement/payments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('¿Está seguro de aprobar este pago?')) return;
    try {
      await api.post(`/contractors/payments/${id}/approve`);
      toast.success('Pago aprobado');
      loadPayment();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al aprobar');
    }
  };

  const handleProcess = async () => {
    if (!window.confirm('¿Marcar este pago como procesado?')) return;
    try {
      await api.post(`/contractors/payments/${id}/process`);
      toast.success('Pago procesado');
      loadPayment();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(`/contractors/payments/${id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pago-${payment.code}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // If PDF endpoint doesn't exist, use print
      handlePrint();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Comprobante de Pago ${payment.code}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { margin: 0; color: #1976d2; }
          .header p { margin: 5px 0; color: #666; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info-box { width: 48%; }
          .info-box h3 { margin: 0 0 10px 0; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .info-box p { margin: 5px 0; font-size: 14px; }
          .info-box .label { color: #666; }
          .amount-box { text-align: center; margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 8px; }
          .amount-box .amount { font-size: 32px; font-weight: bold; color: #2e7d32; }
          .amount-box .label { color: #666; margin-bottom: 10px; }
          .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
          .status-PENDING { background: #fff3e0; color: #e65100; }
          .status-PROCESSING { background: #e3f2fd; color: #1565c0; }
          .status-COMPLETED { background: #e8f5e9; color: #2e7d32; }
          .status-REJECTED { background: #ffebee; color: #c62828; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 60px; }
          .signature-box { width: 40%; text-align: center; }
          .signature-line { border-top: 1px solid #333; margin-top: 50px; padding-top: 10px; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>COMPROBANTE DE PAGO</h1>
          <p><strong>${payment.code}</strong></p>
          <span class="status status-${payment.status}">${statusLabels[payment.status]}</span>
        </div>
        
        <div class="info-section">
          <div class="info-box">
            <h3>Beneficiario</h3>
            <p><strong>${payment.contractor?.companyName || '-'}</strong></p>
            <p><span class="label">RIF:</span> ${payment.contractor?.taxId || '-'}</p>
            <p><span class="label">Banco:</span> ${payment.contractor?.bankName || '-'}</p>
            <p><span class="label">Cuenta:</span> ${payment.contractor?.bankAccount || '-'}</p>
          </div>
          <div class="info-box">
            <h3>Información del Pago</h3>
            <p><span class="label">Fecha:</span> ${formatDate(payment.paymentDate)}</p>
            <p><span class="label">Método:</span> ${paymentMethodLabels[payment.paymentMethod]}</p>
            <p><span class="label">Referencia:</span> ${payment.referenceNumber || '-'}</p>
            ${payment.invoice ? `<p><span class="label">Factura:</span> ${payment.invoice.code}</p>` : ''}
          </div>
        </div>
        
        <div class="amount-box">
          <div class="label">MONTO DEL PAGO</div>
          <div class="amount">${formatCurrency(payment.amount, payment.currency)}</div>
        </div>
        
        ${payment.concept ? `
        <div style="margin-top: 30px;">
          <h3>Concepto</h3>
          <p>${payment.concept}</p>
        </div>
        ` : ''}
        
        ${payment.notes ? `
        <div style="margin-top: 20px;">
          <h3>Notas</h3>
          <p>${payment.notes}</p>
        </div>
        ` : ''}
        
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line">Elaborado por</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Autorizado por</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Documento generado el ${new Date().toLocaleString('es-VE')}</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency === 'USDT' ? 'USD' : currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!payment) return null;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <IconButton onClick={() => navigate('/procurement/payments')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon color="primary" />
            <Typography variant="h5" fontWeight="bold">
              {payment.code}
            </Typography>
            <Chip
              label={statusLabels[payment.status]}
              color={statusColors[payment.status]}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {paymentMethodLabels[payment.paymentMethod]} {payment.referenceNumber && `| Ref: ${payment.referenceNumber}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <DownloadPDFButton
            endpoint={`/reports/contractor-payments/${id}`}
            filename={`pago-${payment.code}.pdf`}
          />
          {payment.status === 'PENDING' && (
            <Button variant="contained" color="success" startIcon={<ApproveIcon />} onClick={handleApprove}>
              Aprobar
            </Button>
          )}
          {payment.status === 'PROCESSING' && (
            <Button variant="contained" color="primary" startIcon={<ProcessIcon />} onClick={handleProcess}>
              Procesar
            </Button>
          )}
          {['PENDING'].includes(payment.status) && (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/procurement/payments/${id}/edit`)}>
              Editar
            </Button>
          )}
        </Box>
      </Box>

      {/* Amount Card */}
      <Card sx={{ mb: 3, bgcolor: 'success.light' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="success.contrastText" variant="body1" gutterBottom>
            Monto del Pago
          </Typography>
          <Typography variant="h3" fontWeight="bold" color="success.contrastText">
            {formatCurrency(payment.amount, payment.currency)}
          </Typography>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información del Pago
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Código</Typography>
                <Typography>{payment.code}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Fecha de Pago</Typography>
                <Typography>{formatDate(payment.paymentDate)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Método de Pago</Typography>
                <Typography>{paymentMethodLabels[payment.paymentMethod]}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Nº Referencia</Typography>
                <Typography>{payment.referenceNumber || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Moneda</Typography>
                <Typography>{payment.currency}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Monto</Typography>
                <Typography fontWeight="bold" color="success.main">
                  {formatCurrency(payment.amount, payment.currency)}
                </Typography>
              </Grid>
              {payment.concept && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Concepto</Typography>
                  <Typography>{payment.concept}</Typography>
                </Grid>
              )}
              {payment.notes && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Notas</Typography>
                  <Typography>{payment.notes}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Beneficiario
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {payment.contractor ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ContractorIcon color="primary" />
                  <Box>
                    <Typography fontWeight="medium">{payment.contractor.companyName}</Typography>
                    <Typography variant="body2" color="text.secondary">{payment.contractor.code}</Typography>
                  </Box>
                </Box>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">RIF</Typography>
                    <Typography>{payment.contractor.taxId || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Banco</Typography>
                    <Typography>{payment.contractor.bankName || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Cuenta Bancaria</Typography>
                    <Typography>{payment.contractor.bankAccount || '-'}</Typography>
                  </Grid>
                </Grid>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/contractors/${payment.contractor.id}`)}
                >
                  Ver Contratista
                </Button>
              </Box>
            ) : (
              <Typography color="text.secondary">Sin contratista asignado</Typography>
            )}
          </Paper>
        </Grid>

        {payment.invoice && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Factura Asociada
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <InvoiceIcon color="primary" />
                <Box>
                  <Typography fontWeight="medium">{payment.invoice.code}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nº {payment.invoice.invoiceNumber}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Total Factura</Typography>
                  <Typography>{formatCurrency(payment.invoice.total, payment.invoice.currency)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Estado</Typography>
                  <Chip label={payment.invoice.status} size="small" sx={{ mt: 0.5 }} />
                </Grid>
              </Grid>
              <Button 
                variant="outlined" 
                size="small"
                sx={{ mt: 2 }}
                onClick={() => navigate(`/procurement/invoices/${payment.invoice.id}`)}
              >
                Ver Factura
              </Button>
            </Paper>
          </Grid>
        )}

        {payment.purchaseOrder && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Orden de Compra
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <Typography fontWeight="medium">{payment.purchaseOrder.code}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {payment.purchaseOrder.title}
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small"
                sx={{ mt: 2 }}
                onClick={() => navigate(`/procurement/purchase-orders/${payment.purchaseOrder.id}`)}
              >
                Ver Orden
              </Button>
            </Paper>
          </Grid>
        )}

        {/* Archivos Adjuntos */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <AttachmentSection
              entityType="contractor_payment"
              entityId={id}
              title="Comprobantes de Pago"
              defaultCategory="RECEIPT"
              variant="inline"
            />
          </Paper>
        </Grid>

        {/* Audit Info */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de Auditoría
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Creado</Typography>
                <Typography>{formatDate(payment.createdAt)}</Typography>
              </Grid>
              {payment.approvedAt && (
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Aprobado</Typography>
                  <Typography>{formatDate(payment.approvedAt)}</Typography>
                </Grid>
              )}
              {payment.processedAt && (
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Procesado</Typography>
                  <Typography>{formatDate(payment.processedAt)}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentDetail;
