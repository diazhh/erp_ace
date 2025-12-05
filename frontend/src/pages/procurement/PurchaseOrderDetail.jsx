import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Send as SendIcon,
  Done as ConfirmIcon,
  ShoppingCart as PurchaseIcon,
  Engineering as ServiceIcon,
  Construction as WorkIcon,
  Receipt as InvoiceIcon,
  Business as ContractorIcon,
  Assignment as ProjectIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AttachmentSection from '../../components/common/AttachmentSection';

const statusColors = {
  DRAFT: 'default',
  PENDING: 'warning',
  APPROVED: 'info',
  SENT: 'primary',
  CONFIRMED: 'primary',
  IN_PROGRESS: 'info',
  PARTIAL: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const statusLabels = {
  DRAFT: 'Borrador',
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  SENT: 'Enviada',
  CONFIRMED: 'Confirmada',
  IN_PROGRESS: 'En Progreso',
  PARTIAL: 'Parcial',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const orderTypeIcons = {
  PURCHASE: <PurchaseIcon />,
  SERVICE: <ServiceIcon />,
  WORK: <WorkIcon />,
};

const orderTypeLabels = {
  PURCHASE: 'Orden de Compra',
  SERVICE: 'Orden de Servicio',
  WORK: 'Orden de Obra',
};

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [progressDialog, setProgressDialog] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contractors/purchase-orders/${id}`);
      setOrder(response.data.data);
      setNewProgress(response.data.data.progress);
    } catch (error) {
      toast.error('Error al cargar la orden');
      navigate('/procurement/purchase-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('¿Está seguro de aprobar esta orden?')) return;
    try {
      await api.post(`/contractors/purchase-orders/${id}/approve`);
      toast.success('Orden aprobada');
      loadOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al aprobar');
    }
  };

  const handleSend = async () => {
    if (!window.confirm('¿Marcar como enviada al contratista?')) return;
    try {
      await api.post(`/contractors/purchase-orders/${id}/send`);
      toast.success('Orden marcada como enviada');
      loadOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al enviar');
    }
  };

  const handleConfirm = async () => {
    if (!window.confirm('¿Confirmar recepción por el contratista?')) return;
    try {
      await api.post(`/contractors/purchase-orders/${id}/confirm`);
      toast.success('Orden confirmada');
      loadOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al confirmar');
    }
  };

  const handleUpdateProgress = async () => {
    try {
      await api.post(`/contractors/purchase-orders/${id}/progress`, { progress: newProgress });
      toast.success('Progreso actualizado');
      setProgressDialog(false);
      loadOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar progreso');
    }
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

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(`/contractors/purchase-orders/${id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orden-${order.code}.pdf`);
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
        <title>${orderTypeLabels[order.orderType]} ${order.code}</title>
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
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 60px; }
          .signature-box { width: 30%; text-align: center; }
          .signature-line { border-top: 1px solid #333; margin-top: 50px; padding-top: 10px; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${orderTypeLabels[order.orderType].toUpperCase()}</h1>
          <p><strong>${order.code}</strong></p>
          <p>${order.title}</p>
          <span class="status">${statusLabels[order.status]}</span>
        </div>
        
        <div class="info-section">
          <div class="info-box">
            <h3>Contratista</h3>
            <p><strong>${order.contractor?.companyName || '-'}</strong></p>
            <p><span class="label">RIF:</span> ${order.contractor?.taxId || '-'}</p>
            <p><span class="label">Dirección:</span> ${order.contractor?.address || '-'}</p>
          </div>
          <div class="info-box">
            <h3>Información de la Orden</h3>
            <p><span class="label">Fecha:</span> ${formatDate(order.orderDate)}</p>
            <p><span class="label">Entrega:</span> ${formatDate(order.deliveryDate)}</p>
            <p><span class="label">Moneda:</span> ${order.currency}</p>
            ${order.project ? `<p><span class="label">Proyecto:</span> ${order.project.name}</p>` : ''}
          </div>
        </div>
        
        ${order.items && order.items.length > 0 ? `
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
            ${order.items.map((item) => `
              <tr>
                <td>${item.itemNumber}</td>
                <td>${item.description}</td>
                <td>${item.unit || '-'}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${formatCurrency(item.unitPrice, order.currency)}</td>
                <td class="text-right">${formatCurrency(item.subtotal, order.currency)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}
        
        <div class="totals">
          <table>
            <tr>
              <td class="label">Subtotal:</td>
              <td class="text-right">${formatCurrency(order.subtotal, order.currency)}</td>
            </tr>
            <tr>
              <td class="label">IVA (${order.taxRate}%):</td>
              <td class="text-right">${formatCurrency(order.taxAmount, order.currency)}</td>
            </tr>
            <tr class="total-row">
              <td>TOTAL:</td>
              <td class="text-right">${formatCurrency(order.total, order.currency)}</td>
            </tr>
          </table>
        </div>
        
        ${order.paymentTerms || order.deliveryTerms || order.warranty ? `
        <div style="margin-top: 30px;">
          <h3>Términos y Condiciones</h3>
          ${order.paymentTerms ? `<p><strong>Condiciones de Pago:</strong> ${order.paymentTerms}</p>` : ''}
          ${order.deliveryTerms ? `<p><strong>Condiciones de Entrega:</strong> ${order.deliveryTerms}</p>` : ''}
          ${order.warranty ? `<p><strong>Garantía:</strong> ${order.warranty}</p>` : ''}
        </div>
        ` : ''}
        
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line">Elaborado por</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Autorizado por</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Recibido por</div>
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) return null;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <IconButton onClick={() => navigate('/procurement/purchase-orders')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {orderTypeIcons[order.orderType]}
            <Typography variant="h5" fontWeight="bold">
              {order.code}
            </Typography>
            <Chip
              label={statusLabels[order.status]}
              color={statusColors[order.status]}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {orderTypeLabels[order.orderType]} - {order.title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<PdfIcon />} onClick={handleDownloadPDF}>
            Descargar PDF
          </Button>
          {order.status === 'PENDING' && (
            <Button variant="contained" color="success" startIcon={<ApproveIcon />} onClick={handleApprove}>
              Aprobar
            </Button>
          )}
          {order.status === 'APPROVED' && (
            <Button variant="contained" startIcon={<SendIcon />} onClick={handleSend}>
              Enviar
            </Button>
          )}
          {order.status === 'SENT' && (
            <Button variant="contained" startIcon={<ConfirmIcon />} onClick={handleConfirm}>
              Confirmar
            </Button>
          )}
          {['CONFIRMED', 'IN_PROGRESS'].includes(order.status) && (
            <Button variant="outlined" onClick={() => setProgressDialog(true)}>
              Actualizar Progreso
            </Button>
          )}
          {['DRAFT', 'PENDING'].includes(order.status) && (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/procurement/purchase-orders/${id}/edit`)}>
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
                Total
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {formatCurrency(order.total, order.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Facturado
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="info.main">
                {formatCurrency(order.invoicedAmount, order.currency)}
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
                {formatCurrency(order.paidAmount, order.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Progreso
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {order.progress}%
              </Typography>
              <LinearProgress variant="determinate" value={order.progress} sx={{ mt: 1 }} />
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
          <Tab label="Facturas" />
          <Tab label="Archivos" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información General
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Código</Typography>
                  <Typography>{order.code}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Tipo</Typography>
                  <Typography>{orderTypeLabels[order.orderType]}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Título</Typography>
                  <Typography>{order.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Descripción</Typography>
                  <Typography>{order.description || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Fecha de Orden</Typography>
                  <Typography>{formatDate(order.orderDate)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Fecha de Entrega</Typography>
                  <Typography>{formatDate(order.deliveryDate)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contratista
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {order.contractor ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ContractorIcon color="primary" />
                    <Box>
                      <Typography fontWeight="medium">{order.contractor.companyName}</Typography>
                      <Typography variant="body2" color="text.secondary">{order.contractor.code}</Typography>
                    </Box>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => navigate(`/contractors/${order.contractor.id}`)}
                  >
                    Ver Contratista
                  </Button>
                </Box>
              ) : (
                <Typography color="text.secondary">Sin contratista asignado</Typography>
              )}

              {order.project && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Proyecto
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ProjectIcon color="primary" />
                    <Box>
                      <Typography fontWeight="medium">{order.project.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{order.project.code}</Typography>
                    </Box>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => navigate(`/projects/${order.project.id}`)}
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
                  <Typography>{formatCurrency(order.subtotal, order.currency)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">IVA ({order.taxRate}%)</Typography>
                  <Typography>{formatCurrency(order.taxAmount, order.currency)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                  <Typography variant="h6" color="primary">{formatCurrency(order.total, order.currency)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Términos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Condiciones de Pago</Typography>
                  <Typography>{order.paymentTerms || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Condiciones de Entrega</Typography>
                  <Typography>{order.deliveryTerms || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Garantía</Typography>
                  <Typography>{order.warranty || '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Items de la Orden
          </Typography>
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
                {order.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.itemNumber}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(item.unitPrice, order.currency)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.subtotal, order.currency)}</TableCell>
                  </TableRow>
                ))}
                {(!order.items || order.items.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">No hay items registrados</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Facturas Asociadas
            </Typography>
            <Button 
              variant="contained" 
              size="small"
              startIcon={<InvoiceIcon />}
              onClick={() => navigate('/procurement/invoices/new', { state: { purchaseOrderId: order.id } })}
            >
              Registrar Factura
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nº Factura</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.invoices?.map((invoice) => (
                  <TableRow key={invoice.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/procurement/invoices/${invoice.id}`)}>
                    <TableCell>{invoice.code}</TableCell>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell align="right">{formatCurrency(invoice.total)}</TableCell>
                    <TableCell>
                      <Chip label={invoice.status} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
                {(!order.invoices || order.invoices.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="text.secondary">No hay facturas asociadas</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <AttachmentSection
            entityType="purchase_order"
            entityId={id}
            title="Documentos de la Orden de Compra"
            defaultCategory="DOCUMENT"
            variant="inline"
          />
        </Paper>
      )}

      {/* Progress Dialog */}
      <Dialog open={progressDialog} onClose={() => setProgressDialog(false)}>
        <DialogTitle>Actualizar Progreso</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="number"
            label="Progreso (%)"
            value={newProgress}
            onChange={(e) => setNewProgress(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
            inputProps={{ min: 0, max: 100 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProgressDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdateProgress}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrderDetail;
