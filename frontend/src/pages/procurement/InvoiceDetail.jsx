import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  PictureAsPdf as PdfIcon,
  Receipt as InvoiceIcon,
  Business as ContractorIcon,
  Assignment as ProjectIcon,
  Payment as PaymentIcon,
  ShoppingCart as OrderIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AttachmentSection from '../../components/common/AttachmentSection';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const statusColors = {
  PENDING: 'warning',
  APPROVED: 'info',
  PARTIAL: 'primary',
  PAID: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

const statusLabels = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  PARTIAL: 'Pago Parcial',
  PAID: 'Pagada',
  REJECTED: 'Rechazada',
  CANCELLED: 'Cancelada',
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const printRef = useRef();
  
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contractors/invoices/${id}`);
      setInvoice(response.data.data);
    } catch (error) {
      toast.error('Error al cargar la factura');
      navigate('/procurement/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('¿Está seguro de aprobar esta factura?')) return;
    try {
      await api.post(`/contractors/invoices/${id}/approve`);
      toast.success('Factura aprobada');
      loadInvoice();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al aprobar');
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Motivo del rechazo:');
    if (!reason) return;
    try {
      await api.post(`/contractors/invoices/${id}/reject`, { reason });
      toast.success('Factura rechazada');
      loadInvoice();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al rechazar');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(`/contractors/invoices/${id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `factura-${invoice.code}.pdf`);
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
    const printContent = printRef.current;
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Factura ${invoice.code}</title>
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
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .text-right { text-align: right; }
          .totals { margin-top: 20px; }
          .totals table { width: 300px; margin-left: auto; }
          .totals td { border: none; padding: 5px 10px; }
          .totals .total-row { font-weight: bold; font-size: 16px; border-top: 2px solid #333; }
          .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
          .status-PENDING { background: #fff3e0; color: #e65100; }
          .status-APPROVED { background: #e3f2fd; color: #1565c0; }
          .status-PARTIAL { background: #e8f5e9; color: #2e7d32; }
          .status-PAID { background: #e8f5e9; color: #2e7d32; }
          .status-REJECTED { background: #ffebee; color: #c62828; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FACTURA</h1>
          <p><strong>${invoice.code}</strong></p>
          <p>Nº Factura: ${invoice.invoiceNumber} | Nº Control: ${invoice.controlNumber || '-'}</p>
          <span class="status status-${invoice.status}">${statusLabels[invoice.status]}</span>
        </div>
        
        <div class="info-section">
          <div class="info-box">
            <h3>Contratista</h3>
            <p><strong>${invoice.contractor?.companyName || '-'}</strong></p>
            <p><span class="label">RIF:</span> ${invoice.contractor?.taxId || '-'}</p>
            <p><span class="label">Dirección:</span> ${invoice.contractor?.address || '-'}</p>
          </div>
          <div class="info-box">
            <h3>Información de Factura</h3>
            <p><span class="label">Fecha Factura:</span> ${formatDate(invoice.invoiceDate)}</p>
            <p><span class="label">Fecha Vencimiento:</span> ${formatDate(invoice.dueDate)}</p>
            <p><span class="label">Moneda:</span> ${invoice.currency}</p>
            ${invoice.purchaseOrder ? `<p><span class="label">Orden:</span> ${invoice.purchaseOrder.code}</p>` : ''}
          </div>
        </div>
        
        ${invoice.items && invoice.items.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Descripción</th>
              <th>Unidad</th>
              <th class="text-right">Cantidad</th>
              <th class="text-right">Precio Unit.</th>
              <th class="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${item.description}</td>
                <td>${item.unit || '-'}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${formatCurrency(item.unitPrice, invoice.currency)}</td>
                <td class="text-right">${formatCurrency(item.subtotal, invoice.currency)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}
        
        <div class="totals">
          <table>
            <tr>
              <td class="label">Subtotal:</td>
              <td class="text-right">${formatCurrency(invoice.subtotal, invoice.currency)}</td>
            </tr>
            <tr>
              <td class="label">IVA (${invoice.taxRate}%):</td>
              <td class="text-right">${formatCurrency(invoice.taxAmount, invoice.currency)}</td>
            </tr>
            ${invoice.retentionAmount > 0 ? `
            <tr>
              <td class="label">Retención ISLR (${invoice.retentionRate}%):</td>
              <td class="text-right">-${formatCurrency(invoice.retentionAmount, invoice.currency)}</td>
            </tr>
            ` : ''}
            ${invoice.ivaRetentionAmount > 0 ? `
            <tr>
              <td class="label">Retención IVA (${invoice.ivaRetentionRate}%):</td>
              <td class="text-right">-${formatCurrency(invoice.ivaRetentionAmount, invoice.currency)}</td>
            </tr>
            ` : ''}
            <tr class="total-row">
              <td>TOTAL:</td>
              <td class="text-right">${formatCurrency(invoice.total, invoice.currency)}</td>
            </tr>
            <tr>
              <td class="label">Neto a Pagar:</td>
              <td class="text-right"><strong>${formatCurrency(invoice.netPayable, invoice.currency)}</strong></td>
            </tr>
          </table>
        </div>
        
        ${invoice.notes ? `
        <div style="margin-top: 30px;">
          <h3>Notas</h3>
          <p>${invoice.notes}</p>
        </div>
        ` : ''}
        
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

  if (!invoice) return null;

  const pendingAmount = (invoice.netPayable || invoice.total) - (invoice.paidAmount || 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <IconButton onClick={() => navigate('/procurement/invoices')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InvoiceIcon color="primary" />
            <Typography variant="h5" fontWeight="bold">
              {invoice.code}
            </Typography>
            <Chip
              label={statusLabels[invoice.status]}
              color={statusColors[invoice.status]}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Factura Nº {invoice.invoiceNumber} {invoice.controlNumber && `| Control: ${invoice.controlNumber}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <DownloadPDFButton
            endpoint={`/reports/contractor-invoices/${id}`}
            filename={`factura-${invoice.code}.pdf`}
          />
          {invoice.status === 'PENDING' && (
            <>
              <Button variant="contained" color="success" startIcon={<ApproveIcon />} onClick={handleApprove}>
                Aprobar
              </Button>
              <Button variant="outlined" color="error" startIcon={<RejectIcon />} onClick={handleReject}>
                Rechazar
              </Button>
            </>
          )}
          {['PENDING'].includes(invoice.status) && (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/procurement/invoices/${id}/edit`)}>
              Editar
            </Button>
          )}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total Factura
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {formatCurrency(invoice.total, invoice.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Neto a Pagar
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="info.main">
                {formatCurrency(invoice.netPayable || invoice.total, invoice.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Pagado
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {formatCurrency(invoice.paidAmount, invoice.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Pendiente
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={pendingAmount > 0 ? 'warning.main' : 'success.main'}>
                {formatCurrency(pendingAmount, invoice.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Información" />
          <Tab label="Items" />
          <Tab label="Pagos" />
          <Tab label="Archivos" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3} ref={printRef}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información General
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Código</Typography>
                  <Typography>{invoice.code}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nº Factura</Typography>
                  <Typography>{invoice.invoiceNumber}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nº Control</Typography>
                  <Typography>{invoice.controlNumber || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Moneda</Typography>
                  <Typography>{invoice.currency}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Fecha de Factura</Typography>
                  <Typography>{formatDate(invoice.invoiceDate)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Fecha de Vencimiento</Typography>
                  <Typography>{formatDate(invoice.dueDate)}</Typography>
                </Grid>
                {invoice.notes && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Notas</Typography>
                    <Typography>{invoice.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contratista
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {invoice.contractor ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ContractorIcon color="primary" />
                    <Box>
                      <Typography fontWeight="medium">{invoice.contractor.companyName}</Typography>
                      <Typography variant="body2" color="text.secondary">{invoice.contractor.code}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    RIF: {invoice.contractor.taxId || '-'}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => navigate(`/contractors/${invoice.contractor.id}`)}
                  >
                    Ver Contratista
                  </Button>
                </Box>
              ) : (
                <Typography color="text.secondary">Sin contratista asignado</Typography>
              )}

              {invoice.purchaseOrder && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Orden de Compra
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <OrderIcon color="primary" />
                    <Box>
                      <Typography fontWeight="medium">{invoice.purchaseOrder.code}</Typography>
                      <Typography variant="body2" color="text.secondary">{invoice.purchaseOrder.title}</Typography>
                    </Box>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => navigate(`/procurement/purchase-orders/${invoice.purchaseOrder.id}`)}
                  >
                    Ver Orden
                  </Button>
                </Box>
              )}

              {invoice.project && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Proyecto
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ProjectIcon color="primary" />
                    <Box>
                      <Typography fontWeight="medium">{invoice.project.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{invoice.project.code}</Typography>
                    </Box>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => navigate(`/projects/${invoice.project.id}`)}
                  >
                    Ver Proyecto
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Montos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Subtotal</Typography>
                  <Typography>{formatCurrency(invoice.subtotal, invoice.currency)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">IVA ({invoice.taxRate}%)</Typography>
                  <Typography>{formatCurrency(invoice.taxAmount, invoice.currency)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                  <Typography variant="h6" color="primary">{formatCurrency(invoice.total, invoice.currency)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Retenciones
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Retención ISLR ({invoice.retentionRate || 0}%)</Typography>
                  <Typography color="error.main">-{formatCurrency(invoice.retentionAmount, invoice.currency)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Retención IVA ({invoice.ivaRetentionRate || 0}%)</Typography>
                  <Typography color="error.main">-{formatCurrency(invoice.ivaRetentionAmount, invoice.currency)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Neto a Pagar</Typography>
                  <Typography variant="h6" color="success.main">{formatCurrency(invoice.netPayable || invoice.total, invoice.currency)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" gutterBottom>
            Items de la Factura
          </Typography>
          {isMobile ? (
            // Mobile: Cards
            <Box>
              {invoice.items?.map((item, idx) => (
                <Card key={item.id || idx} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">#{idx + 1}</Typography>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {formatCurrency(item.subtotal, invoice.currency)}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>{item.description}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} {item.unit || 'und'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @ {formatCurrency(item.unitPrice, invoice.currency)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {(!invoice.items || invoice.items.length === 0) && (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                  No hay items registrados
                </Typography>
              )}
            </Box>
          ) : (
            // Desktop: Table
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Unidad</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio Unit.</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoice.items?.map((item, idx) => (
                    <TableRow key={item.id || idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.unit || '-'}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unitPrice, invoice.currency)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.subtotal, invoice.currency)}</TableCell>
                    </TableRow>
                  ))}
                  {(!invoice.items || invoice.items.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">No hay items registrados</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 2 }}>
            <Typography variant="h6">
              Pagos Asociados
            </Typography>
            {['APPROVED', 'PARTIAL'].includes(invoice.status) && pendingAmount > 0 && (
              <Button 
                variant="contained" 
                size="small"
                startIcon={<PaymentIcon />}
                onClick={() => navigate('/procurement/payments/new', { state: { invoiceId: invoice.id } })}
                fullWidth={isMobile}
              >
                Registrar Pago
              </Button>
            )}
          </Box>
          {isMobile ? (
            // Mobile: Cards
            <Box>
              {invoice.payments?.map((payment) => (
                <Card 
                  key={payment.id} 
                  variant="outlined" 
                  sx={{ mb: 2, cursor: 'pointer' }}
                  onClick={() => navigate(`/procurement/payments/${payment.id}`)}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{payment.code}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(payment.paymentDate)}
                        </Typography>
                      </Box>
                      <Chip label={payment.status} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {payment.paymentMethod} {payment.referenceNumber && `• ${payment.referenceNumber}`}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        {formatCurrency(payment.amount, payment.currency)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {(!invoice.payments || invoice.payments.length === 0) && (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                  No hay pagos asociados
                </Typography>
              )}
            </Box>
          ) : (
            // Desktop: Table
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell>Referencia</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoice.payments?.map((payment) => (
                    <TableRow 
                      key={payment.id} 
                      hover 
                      sx={{ cursor: 'pointer' }} 
                      onClick={() => navigate(`/procurement/payments/${payment.id}`)}
                    >
                      <TableCell>{payment.code}</TableCell>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>{payment.referenceNumber || '-'}</TableCell>
                      <TableCell align="right">{formatCurrency(payment.amount, payment.currency)}</TableCell>
                      <TableCell>
                        <Chip label={payment.status} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!invoice.payments || invoice.payments.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">No hay pagos asociados</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <AttachmentSection
            entityType="contractor_invoice"
            entityId={id}
            title="Documentos de la Factura"
            defaultCategory="INVOICE"
            variant="inline"
          />
        </Paper>
      )}
    </Box>
  );
};

export default InvoiceDetail;
