import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Payment as PaymentIcon,
  Gavel as DisputeIcon,
} from '@mui/icons-material';
import { fetchJIBById, sendJIB, recordPartnerPayment, disputePartnerShare, clearCurrentJIB } from '../../store/slices/jibSlice';

const JIBDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { currentJIB, loading } = useSelector((state) => state.jib);

  const [tabValue, setTabValue] = useState(0);
  const [paymentDialog, setPaymentDialog] = useState({ open: false, share: null });
  const [disputeDialog, setDisputeDialog] = useState({ open: false, share: null });
  const [paymentData, setPaymentData] = useState({ payment_date: '', payment_reference: '', payment_amount: '' });
  const [disputeReason, setDisputeReason] = useState('');

  useEffect(() => {
    dispatch(fetchJIBById(id));
    return () => {
      dispatch(clearCurrentJIB());
    };
  }, [dispatch, id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentJIB?.currency || 'USD',
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      SENT: 'info',
      PARTIALLY_PAID: 'warning',
      PAID: 'success',
      DISPUTED: 'error',
      PENDING: 'default',
      INVOICED: 'info',
    };
    return colors[status] || 'default';
  };

  const formatPeriod = (month, year) => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${monthNames[month - 1]} ${year}`;
  };

  const handleSend = async () => {
    if (window.confirm(t('jib.confirmSend', '¿Está seguro de enviar este JIB a los socios?'))) {
      await dispatch(sendJIB(id));
      dispatch(fetchJIBById(id));
    }
  };

  const handlePayment = async () => {
    await dispatch(recordPartnerPayment({
      jibId: id,
      shareId: paymentDialog.share.id,
      data: paymentData,
    }));
    setPaymentDialog({ open: false, share: null });
    setPaymentData({ payment_date: '', payment_reference: '', payment_amount: '' });
    dispatch(fetchJIBById(id));
  };

  const handleDispute = async () => {
    await dispatch(disputePartnerShare({
      jibId: id,
      shareId: disputeDialog.share.id,
      reason: disputeReason,
    }));
    setDisputeDialog({ open: false, share: null });
    setDisputeReason('');
    dispatch(fetchJIBById(id));
  };

  if (loading || !currentJIB) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/jib/billings')}>
            {t('common.back', 'Volver')}
          </Button>
          <Typography variant="h4" fontWeight="bold">
            {currentJIB.code}
          </Typography>
          <Chip
            label={t(`jib.status.${currentJIB.status}`, currentJIB.status)}
            color={getStatusColor(currentJIB.status)}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {currentJIB.status === 'DRAFT' && (
            <>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/jib/billings/${id}/edit`)}>
                {t('common.edit', 'Editar')}
              </Button>
              <Button variant="contained" startIcon={<SendIcon />} onClick={handleSend}>
                {t('jib.send', 'Enviar')}
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('jib.totalCosts', 'Total Costos')}</Typography>
              <Typography variant="h5" fontWeight="bold">{formatCurrency(currentJIB.total_costs)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('jib.operatorShare', 'Porción Operador')}</Typography>
              <Typography variant="h5" fontWeight="bold">{formatCurrency(currentJIB.operator_share)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('jib.partnersShare', 'Porción Socios')}</Typography>
              <Typography variant="h5" fontWeight="bold">{formatCurrency(currentJIB.partners_share)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('jib.period', 'Período')}</Typography>
              <Typography variant="h5" fontWeight="bold">
                {formatPeriod(currentJIB.billing_period_month, currentJIB.billing_period_year)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Details */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">{t('jib.contract', 'Contrato')}</Typography>
            <Typography variant="body1">{currentJIB.contract?.name || currentJIB.contract?.code || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">{t('jib.dueDate', 'Vencimiento')}</Typography>
            <Typography variant="body1">{currentJIB.due_date ? new Date(currentJIB.due_date).toLocaleDateString() : '-'}</Typography>
          </Grid>
          {currentJIB.description && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">{t('jib.description', 'Descripción')}</Typography>
              <Typography variant="body1">{currentJIB.description}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab label={t('jib.lineItems', 'Items de Costo')} />
          <Tab label={t('jib.partnerShares', 'Distribución Socios')} />
        </Tabs>
        <Divider />

        {/* Line Items Tab */}
        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('jib.category', 'Categoría')}</TableCell>
                  <TableCell>{t('jib.description', 'Descripción')}</TableCell>
                  <TableCell>{t('jib.vendor', 'Proveedor')}</TableCell>
                  <TableCell align="right">{t('jib.amount', 'Monto')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(currentJIB.lineItems || []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Chip label={t(`jib.costCategory.${item.cost_category}`, item.cost_category)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.vendor_name || '-'}</TableCell>
                    <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
                {(!currentJIB.lineItems || currentJIB.lineItems.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">{t('jib.noLineItems', 'No hay items de costo')}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Partner Shares Tab */}
        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('jib.partner', 'Socio')}</TableCell>
                  <TableCell align="right">{t('jib.workingInterest', 'WI %')}</TableCell>
                  <TableCell align="right">{t('jib.shareAmount', 'Monto')}</TableCell>
                  <TableCell>{t('jib.status.label', 'Estado')}</TableCell>
                  <TableCell>{t('jib.paymentDate', 'Fecha Pago')}</TableCell>
                  <TableCell align="center">{t('common.actions', 'Acciones')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(currentJIB.partnerShares || []).map((share) => (
                  <TableRow key={share.id}>
                    <TableCell>{share.party?.party_name || '-'}</TableCell>
                    <TableCell align="right">{share.working_interest}%</TableCell>
                    <TableCell align="right">{formatCurrency(share.share_amount)}</TableCell>
                    <TableCell>
                      <Chip label={t(`jib.shareStatus.${share.status}`, share.status)} size="small" color={getStatusColor(share.status)} />
                    </TableCell>
                    <TableCell>{share.payment_date ? new Date(share.payment_date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell align="center">
                      {['INVOICED', 'PARTIALLY_PAID'].includes(share.status) && (
                        <>
                          <Tooltip title={t('jib.recordPayment', 'Registrar Pago')}>
                            <IconButton size="small" onClick={() => {
                              setPaymentData({ ...paymentData, payment_amount: share.share_amount });
                              setPaymentDialog({ open: true, share });
                            }}>
                              <PaymentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('jib.dispute', 'Disputar')}>
                            <IconButton size="small" color="error" onClick={() => setDisputeDialog({ open: true, share })}>
                              <DisputeIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(!currentJIB.partnerShares || currentJIB.partnerShares.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">{t('jib.noPartnerShares', 'No hay distribución de socios')}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog.open} onClose={() => setPaymentDialog({ open: false, share: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('jib.recordPayment', 'Registrar Pago')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label={t('jib.paymentDate', 'Fecha de Pago')}
                value={paymentData.payment_date}
                onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label={t('jib.paymentAmount', 'Monto')}
                value={paymentData.payment_amount}
                onChange={(e) => setPaymentData({ ...paymentData, payment_amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('jib.paymentReference', 'Referencia')}
                value={paymentData.payment_reference}
                onChange={(e) => setPaymentData({ ...paymentData, payment_reference: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog({ open: false, share: null })}>{t('common.cancel', 'Cancelar')}</Button>
          <Button variant="contained" onClick={handlePayment}>{t('common.save', 'Guardar')}</Button>
        </DialogActions>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={disputeDialog.open} onClose={() => setDisputeDialog({ open: false, share: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('jib.disputeShare', 'Disputar Cargo')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('jib.disputeReason', 'Razón de la Disputa')}
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisputeDialog({ open: false, share: null })}>{t('common.cancel', 'Cancelar')}</Button>
          <Button variant="contained" color="error" onClick={handleDispute}>{t('jib.dispute', 'Disputar')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JIBDetail;
