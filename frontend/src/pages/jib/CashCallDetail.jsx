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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
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
  Warning as WarningIcon,
} from '@mui/icons-material';
import { fetchCashCallById, sendCashCall, recordCashCallFunding, markPartnerDefault, clearCurrentCashCall } from '../../store/slices/jibSlice';

const CashCallDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentCashCall, loading } = useSelector((state) => state.jib);

  const [fundingDialog, setFundingDialog] = useState({ open: false, response: null });
  const [defaultDialog, setDefaultDialog] = useState({ open: false, response: null });
  const [fundingData, setFundingData] = useState({ amount: '', funded_date: '', payment_reference: '', bank_reference: '' });
  const [penaltyAmount, setPenaltyAmount] = useState('');

  useEffect(() => {
    dispatch(fetchCashCallById(id));
    return () => {
      dispatch(clearCurrentCashCall());
    };
  }, [dispatch, id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCashCall?.currency || 'USD',
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      SENT: 'info',
      PARTIALLY_FUNDED: 'warning',
      FUNDED: 'success',
      OVERDUE: 'error',
      PENDING: 'default',
      PARTIAL: 'warning',
      DEFAULTED: 'error',
    };
    return colors[status] || 'default';
  };

  const getFundingProgress = () => {
    if (!currentCashCall?.total_amount) return 0;
    return Math.min((currentCashCall.funded_amount / currentCashCall.total_amount) * 100, 100);
  };

  const handleSend = async () => {
    if (window.confirm(t('jib.confirmSendCashCall', '¿Está seguro de enviar este Cash Call a los socios?'))) {
      await dispatch(sendCashCall(id));
      dispatch(fetchCashCallById(id));
    }
  };

  const handleFunding = async () => {
    await dispatch(recordCashCallFunding({
      cashCallId: id,
      responseId: fundingDialog.response.id,
      data: fundingData,
    }));
    setFundingDialog({ open: false, response: null });
    setFundingData({ amount: '', funded_date: '', payment_reference: '', bank_reference: '' });
    dispatch(fetchCashCallById(id));
  };

  const handleDefault = async () => {
    await dispatch(markPartnerDefault({
      cashCallId: id,
      responseId: defaultDialog.response.id,
      penaltyAmount: penaltyAmount || null,
    }));
    setDefaultDialog({ open: false, response: null });
    setPenaltyAmount('');
    dispatch(fetchCashCallById(id));
  };

  if (loading || !currentCashCall) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const progress = getFundingProgress();

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/jib/cash-calls')}>
            {t('common.back', 'Volver')}
          </Button>
          <Typography variant="h4" fontWeight="bold">
            {currentCashCall.code}
          </Typography>
          <Chip
            label={t(`jib.status.${currentCashCall.status}`, currentCashCall.status)}
            color={getStatusColor(currentCashCall.status)}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {currentCashCall.status === 'DRAFT' && (
            <>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/jib/cash-calls/${id}/edit`)}>
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
              <Typography variant="body2" color="text.secondary">{t('jib.totalAmount', 'Total Solicitado')}</Typography>
              <Typography variant="h5" fontWeight="bold">{formatCurrency(currentCashCall.total_amount)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('jib.funded', 'Fondeado')}</Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">{formatCurrency(currentCashCall.funded_amount)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('jib.pending', 'Pendiente')}</Typography>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {formatCurrency(currentCashCall.total_amount - currentCashCall.funded_amount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('jib.progress', 'Progreso')}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress variant="determinate" value={progress} sx={{ flexGrow: 1, height: 10, borderRadius: 1 }} />
                <Typography variant="h6" fontWeight="bold">{progress.toFixed(0)}%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Details */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>{currentCashCall.title}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">{t('jib.contract', 'Contrato')}</Typography>
            <Typography variant="body1">{currentCashCall.contract?.name || currentCashCall.contract?.code || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">{t('jib.purpose.label', 'Propósito')}</Typography>
            <Chip label={t(`jib.purpose.${currentCashCall.purpose}`, currentCashCall.purpose)} size="small" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">{t('jib.dueDate', 'Vencimiento')}</Typography>
            <Typography variant="body1">{currentCashCall.due_date ? new Date(currentCashCall.due_date).toLocaleDateString() : '-'}</Typography>
          </Grid>
          {currentCashCall.afe && (
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">{t('jib.afe', 'AFE')}</Typography>
              <Typography variant="body1">{currentCashCall.afe.code} - {currentCashCall.afe.title}</Typography>
            </Grid>
          )}
          {currentCashCall.description && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">{t('jib.description', 'Descripción')}</Typography>
              <Typography variant="body1">{currentCashCall.description}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Partner Responses */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>{t('jib.partnerResponses', 'Respuestas de Socios')}</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('jib.partner', 'Socio')}</TableCell>
                <TableCell align="right">{t('jib.workingInterest', 'WI %')}</TableCell>
                <TableCell align="right">{t('jib.requested', 'Solicitado')}</TableCell>
                <TableCell align="right">{t('jib.funded', 'Fondeado')}</TableCell>
                <TableCell>{t('jib.status.label', 'Estado')}</TableCell>
                <TableCell>{t('jib.fundedDate', 'Fecha Fondeo')}</TableCell>
                <TableCell align="center">{t('common.actions', 'Acciones')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(currentCashCall.responses || []).map((response) => (
                <TableRow key={response.id}>
                  <TableCell>{response.party?.party_name || '-'}</TableCell>
                  <TableCell align="right">{response.working_interest}%</TableCell>
                  <TableCell align="right">{formatCurrency(response.requested_amount)}</TableCell>
                  <TableCell align="right">{formatCurrency(response.funded_amount)}</TableCell>
                  <TableCell>
                    <Chip label={t(`jib.responseStatus.${response.status}`, response.status)} size="small" color={getStatusColor(response.status)} />
                  </TableCell>
                  <TableCell>{response.funded_date ? new Date(response.funded_date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell align="center">
                    {['PENDING', 'PARTIAL'].includes(response.status) && currentCashCall.status !== 'DRAFT' && (
                      <>
                        <Tooltip title={t('jib.recordFunding', 'Registrar Fondeo')}>
                          <IconButton size="small" onClick={() => {
                            setFundingData({ ...fundingData, amount: response.requested_amount - response.funded_amount });
                            setFundingDialog({ open: true, response });
                          }}>
                            <PaymentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('jib.markDefault', 'Marcar Default')}>
                          <IconButton size="small" color="error" onClick={() => setDefaultDialog({ open: true, response })}>
                            <WarningIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!currentCashCall.responses || currentCashCall.responses.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">{t('jib.noResponses', 'No hay respuestas de socios')}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Funding Dialog */}
      <Dialog open={fundingDialog.open} onClose={() => setFundingDialog({ open: false, response: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('jib.recordFunding', 'Registrar Fondeo')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label={t('jib.amount', 'Monto')}
                value={fundingData.amount}
                onChange={(e) => setFundingData({ ...fundingData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label={t('jib.fundedDate', 'Fecha de Fondeo')}
                value={fundingData.funded_date}
                onChange={(e) => setFundingData({ ...fundingData, funded_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('jib.paymentReference', 'Referencia de Pago')}
                value={fundingData.payment_reference}
                onChange={(e) => setFundingData({ ...fundingData, payment_reference: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('jib.bankReference', 'Referencia Bancaria')}
                value={fundingData.bank_reference}
                onChange={(e) => setFundingData({ ...fundingData, bank_reference: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFundingDialog({ open: false, response: null })}>{t('common.cancel', 'Cancelar')}</Button>
          <Button variant="contained" onClick={handleFunding}>{t('common.save', 'Guardar')}</Button>
        </DialogActions>
      </Dialog>

      {/* Default Dialog */}
      <Dialog open={defaultDialog.open} onClose={() => setDefaultDialog({ open: false, response: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('jib.markDefault', 'Marcar como Default')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('jib.defaultWarning', 'Esta acción marcará al socio como en default por no cumplir con el fondeo requerido.')}
          </Typography>
          <TextField
            fullWidth
            type="number"
            label={t('jib.penaltyAmount', 'Monto de Penalidad (opcional)')}
            value={penaltyAmount}
            onChange={(e) => setPenaltyAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDefaultDialog({ open: false, response: null })}>{t('common.cancel', 'Cancelar')}</Button>
          <Button variant="contained" color="error" onClick={handleDefault}>{t('jib.markDefault', 'Marcar Default')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CashCallDetail;
