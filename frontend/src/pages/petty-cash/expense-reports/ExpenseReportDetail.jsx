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
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import {
  fetchExpenseReportById,
  submitExpenseReport,
  approveExpenseReport,
  rejectExpenseReport,
  clearError,
  clearSuccess,
} from '../../../store/slices/expenseReportSlice';
import { usePermissions } from '../../../hooks/usePermissions';

const statusColors = {
  DRAFT: 'default',
  SUBMITTED: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

const statusLabels = {
  DRAFT: 'Borrador',
  SUBMITTED: 'Enviado',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

const itemTypeLabels = {
  INVENTORY: 'Inventario',
  ASSET: 'Activo Fijo',
  FUEL: 'Combustible',
  SERVICE: 'Servicio',
  OTHER: 'Otro',
};

export default function ExpenseReportDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { hasPermission } = usePermissions();

  const { currentReport: report, loading, error, success } = useSelector((state) => state.expenseReports);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    dispatch(fetchExpenseReportById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }
  }, [success, dispatch]);

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const handleSubmit = () => {
    dispatch(submitExpenseReport(id));
  };

  const handleApprove = () => {
    dispatch(approveExpenseReport(id));
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      dispatch(rejectExpenseReport({ id, reason: rejectReason }));
      setRejectDialogOpen(false);
      setRejectReason('');
    }
  };

  const canEdit = hasPermission(['expense_reports:update', 'expense_reports:*', 'petty_cash:expense', 'petty_cash:*']);
  const canApprove = hasPermission(['expense_reports:approve', 'expense_reports:*', 'petty_cash:approve', 'petty_cash:*']);

  if (loading && !report) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Reporte no encontrado</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/petty-cash/expense-reports')}
            sx={{ mb: 1 }}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            Reporte {report.code}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {report.status === 'DRAFT' && canEdit && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/petty-cash/expense-reports/${id}/edit`)}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                onClick={handleSubmit}
              >
                Enviar
              </Button>
            </>
          )}
          {report.status === 'SUBMITTED' && canApprove && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={handleApprove}
              >
                Aprobar
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<RejectIcon />}
                onClick={() => setRejectDialogOpen(true)}
              >
                Rechazar
              </Button>
            </>
          )}
        </Box>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Info Cards */}
      <Grid container spacing={3}>
        {/* General Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Información General</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Estado</Typography>
                <Chip
                  label={statusLabels[report.status]}
                  color={statusColors[report.status]}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Fecha del Reporte</Typography>
                <Typography>{formatDate(report.reportDate)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Empleado</Typography>
                <Typography>
                  {report.employee?.firstName} {report.employee?.lastName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Proyecto</Typography>
                <Typography>{report.project?.name || '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Caja Chica</Typography>
                <Typography>
                  {report.pettyCashEntry?.pettyCash?.name || '-'}
                  {report.pettyCashEntry?.code && ` (${report.pettyCashEntry.code})`}
                </Typography>
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
                <Typography fontWeight="medium">{formatCurrency(report.amountReceived)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Total Gastado</Typography>
                <Typography fontWeight="medium">{formatCurrency(report.totalSpent)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Vuelto Devuelto</Typography>
                <Typography fontWeight="medium">{formatCurrency(report.changeReturned)}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="bold">Diferencia</Typography>
                <Typography
                  fontWeight="bold"
                  color={report.difference > 0 ? 'error.main' : report.difference < 0 ? 'success.main' : 'text.primary'}
                >
                  {formatCurrency(report.difference)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Items */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Detalle de Gastos ({report.items?.length || 0} items)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {isMobile ? (
              // Mobile view - Cards
              <Stack spacing={2}>
                {report.items?.map((item, index) => (
                  <Card key={item.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip label={itemTypeLabels[item.itemType]} size="small" />
                        <Typography fontWeight="bold">{formatCurrency(item.amount)}</Typography>
                      </Box>
                      <Typography variant="body2" gutterBottom>{item.description}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </Typography>
                      {item.vendor && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          Proveedor: {item.vendor}
                        </Typography>
                      )}
                      {item.receiptNumber && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          Factura: {item.receiptNumber}
                        </Typography>
                      )}
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
                      <TableCell>Tipo</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Precio Unit.</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      <TableCell>Proveedor</TableCell>
                      <TableCell>Factura</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Chip label={itemTypeLabels[item.itemType]} size="small" />
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity} {item.unit}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                        <TableCell>{item.vendor || '-'}</TableCell>
                        <TableCell>{item.receiptNumber || '-'}</TableCell>
                      </TableRow>
                    ))}
                    {(!report.items || report.items.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography color="text.secondary" py={2}>
                            No hay items en este reporte
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Notes & Rejection */}
        {(report.notes || report.rejectionReason) && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              {report.notes && (
                <>
                  <Typography variant="h6" gutterBottom>Notas</Typography>
                  <Typography color="text.secondary">{report.notes}</Typography>
                </>
              )}
              {report.rejectionReason && (
                <>
                  <Typography variant="h6" gutterBottom color="error">Motivo de Rechazo</Typography>
                  <Alert severity="error">{report.rejectionReason}</Alert>
                </>
              )}
            </Paper>
          </Grid>
        )}

        {/* Audit Info */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Información de Auditoría</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">Creado por</Typography>
                <Typography>{report.creator?.username || '-'}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">Fecha de Creación</Typography>
                <Typography>{formatDate(report.createdAt)}</Typography>
              </Grid>
              {report.approver && (
                <>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      {report.status === 'APPROVED' ? 'Aprobado por' : 'Rechazado por'}
                    </Typography>
                    <Typography>{report.approver.username}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Fecha</Typography>
                    <Typography>{formatDate(report.approvedAt)}</Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rechazar Reporte</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Motivo del rechazo"
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleReject} color="error" variant="contained" disabled={!rejectReason.trim()}>
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
