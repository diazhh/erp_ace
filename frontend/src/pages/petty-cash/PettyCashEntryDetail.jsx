import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  CircularProgress,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  AccountBalanceWallet as WalletIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Store as VendorIcon,
  Assignment as ProjectIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  fetchEntryById,
  approveEntry,
  rejectEntry,
  clearCurrentEntry,
} from '../../store/slices/pettyCashSlice';
import EntityLink from '../../components/common/EntityLink';
import AttachmentSection from '../../components/common/AttachmentSection';
import ConfirmDialog from '../../components/ConfirmDialog';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const entryStatusColors = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

const entryStatusLabels = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

const entryTypeLabels = {
  EXPENSE: 'Gasto',
  REPLENISHMENT: 'Reposición',
  ADJUSTMENT: 'Ajuste',
  INITIAL: 'Apertura',
};

const entryTypeColors = {
  EXPENSE: 'error',
  REPLENISHMENT: 'success',
  ADJUSTMENT: 'info',
  INITIAL: 'primary',
};

const PettyCashEntryDetail = () => {
  const { id, entryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentEntry: entry, entryLoading: loading, error } = useSelector((state) => state.pettyCash);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });

  useEffect(() => {
    dispatch(fetchEntryById({ pettyCashId: id, entryId }));
    return () => {
      dispatch(clearCurrentEntry());
    };
  }, [dispatch, id, entryId]);

  const handleApprove = async () => {
    try {
      await dispatch(approveEntry({ pettyCashId: id, entryId })).unwrap();
      toast.success('Movimiento aprobado exitosamente');
      dispatch(fetchEntryById({ pettyCashId: id, entryId }));
    } catch (err) {
      toast.error(err);
    }
    setConfirmDialog({ open: false, action: null });
  };

  const handleReject = async () => {
    try {
      await dispatch(rejectEntry({ pettyCashId: id, entryId, reason: 'Rechazado por el usuario' })).unwrap();
      toast.success('Movimiento rechazado');
      dispatch(fetchEntryById({ pettyCashId: id, entryId }));
    } catch (err) {
      toast.error(err);
    }
    setConfirmDialog({ open: false, action: null });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-VE');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate(`/petty-cash/${id}`)} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  if (!entry) {
    return null;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(`/petty-cash/${id}`)}
          sx={{ mb: 2 }}
          size="small"
        >
          Volver a Caja Chica
        </Button>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'flex-start' }, 
          gap: { xs: 2, md: 3 } 
        }}>
          {/* Icon */}
          {!isMobile && (
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: entry.entryType === 'EXPENSE' ? 'error.light' : 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReceiptIcon sx={{ fontSize: 32, color: entry.entryType === 'EXPENSE' ? 'error.main' : 'success.main' }} />
            </Box>
          )}

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
                {entry.code}
              </Typography>
              <Chip
                label={entryTypeLabels[entry.entryType]}
                color={entryTypeColors[entry.entryType]}
                size="small"
              />
              <Chip
                label={entryStatusLabels[entry.status]}
                color={entryStatusColors[entry.status]}
                size="small"
              />
            </Box>
            <Typography variant="body1" color="text.secondary">
              {entry.description}
            </Typography>
            {entry.pettyCash && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <WalletIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Caja: <EntityLink type="petty-cash" id={entry.pettyCash.id} label={entry.pettyCash.name} />
                </Typography>
              </Box>
            )}
          </Box>

          {/* Amount */}
          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="overline" color="text.secondary">
              Monto
            </Typography>
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              fontWeight="bold" 
              color={entry.entryType === 'EXPENSE' ? 'error.main' : 'success.main'}
            >
              {entry.entryType === 'EXPENSE' ? '-' : '+'}
              {formatCurrency(entry.amount, entry.currency)}
            </Typography>
            {entry.balanceAfter !== null && (
              <Typography variant="body2" color="text.secondary">
                Saldo después: {formatCurrency(entry.balanceAfter, entry.currency)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 3 }}>
          <DownloadPDFButton
            endpoint={`/reports/petty-cash-entries/${entryId}`}
            filename={`movimiento-caja-${entry.code}.pdf`}
            fullWidth={isMobile}
          />
          {entry.status === 'PENDING' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() => setConfirmDialog({ open: true, action: 'approve' })}
                fullWidth={isMobile}
              >
                Aprobar Movimiento
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<RejectIcon />}
                onClick={() => setConfirmDialog({ open: true, action: 'reject' })}
                fullWidth={isMobile}
              >
                Rechazar Movimiento
              </Button>
            </>
          )}
        </Stack>

        {entry.status === 'REJECTED' && entry.rejectionReason && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <strong>Motivo de rechazo:</strong> {entry.rejectionReason}
          </Alert>
        )}
      </Paper>

      {/* Details */}
      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon color="primary" />
              Información del Movimiento
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Código</TableCell>
                    <TableCell>{entry.code}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                    <TableCell>
                      <Chip label={entryTypeLabels[entry.entryType]} color={entryTypeColors[entry.entryType]} size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell>
                      <Chip label={entryStatusLabels[entry.status]} color={entryStatusColors[entry.status]} size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                    <TableCell>{formatDate(entry.entryDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Monto</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: entry.entryType === 'EXPENSE' ? 'error.main' : 'success.main' }}>
                      {formatCurrency(entry.amount, entry.currency)}
                    </TableCell>
                  </TableRow>
                  {entry.category && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                      <TableCell>{entry.category}</TableCell>
                    </TableRow>
                  )}
                  {entry.subcategory && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Subcategoría</TableCell>
                      <TableCell>{entry.subcategory}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                    <TableCell>{entry.description}</TableCell>
                  </TableRow>
                  {entry.notes && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Notas</TableCell>
                      <TableCell>{entry.notes}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Vendor & Receipt Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VendorIcon color="primary" />
              Proveedor y Comprobante
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {entry.vendor && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Proveedor</TableCell>
                      <TableCell>{entry.vendor}</TableCell>
                    </TableRow>
                  )}
                  {entry.vendorRif && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>RIF</TableCell>
                      <TableCell>{entry.vendorRif}</TableCell>
                    </TableRow>
                  )}
                  {entry.receiptNumber && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>N° Comprobante</TableCell>
                      <TableCell>{entry.receiptNumber}</TableCell>
                    </TableRow>
                  )}
                  {entry.receiptDate && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Fecha Comprobante</TableCell>
                      <TableCell>{formatDate(entry.receiptDate)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {!entry.vendor && !entry.receiptNumber && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No hay información de proveedor o comprobante
              </Typography>
            )}
          </Paper>

          {/* Beneficiary */}
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              Beneficiario
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {entry.beneficiary ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonIcon color="action" />
                <Box>
                  <EntityLink
                    type="employee"
                    id={entry.beneficiary.id}
                    label={`${entry.beneficiary.firstName} ${entry.beneficiary.lastName}`}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Empleado
                  </Typography>
                </Box>
              </Box>
            ) : entry.beneficiaryName ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="body1">{entry.beneficiaryName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Beneficiario externo
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No especificado
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Project */}
        {entry.project && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ProjectIcon color="primary" />
                Proyecto Asociado
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ProjectIcon color="action" />
                <Box>
                  <EntityLink
                    type="project"
                    id={entry.project.id}
                    label={`${entry.project.code} - ${entry.project.name}`}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Approval Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="primary" />
              Auditoría
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Creado por</TableCell>
                    <TableCell>{entry.creator?.username || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha creación</TableCell>
                    <TableCell>{formatDateTime(entry.createdAt)}</TableCell>
                  </TableRow>
                  {entry.approver && (
                    <>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          {entry.status === 'APPROVED' ? 'Aprobado por' : 'Procesado por'}
                        </TableCell>
                        <TableCell>{entry.approver.username}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          {entry.status === 'APPROVED' ? 'Fecha aprobación' : 'Fecha proceso'}
                        </TableCell>
                        <TableCell>{formatDateTime(entry.approvedAt)}</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Attachments */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <AttachmentSection
              entityType="petty_cash_entry"
              entityId={entryId}
              title="Recibos y Comprobantes"
              defaultCategory="RECEIPT"
              variant="inline"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.action === 'approve' ? 'Aprobar Movimiento' : 'Rechazar Movimiento'}
        message={
          confirmDialog.action === 'approve'
            ? `¿Está seguro de aprobar el movimiento ${entry.code}? Esta acción actualizará el saldo de la caja chica.`
            : `¿Está seguro de rechazar el movimiento ${entry.code}?`
        }
        onConfirm={confirmDialog.action === 'approve' ? handleApprove : handleReject}
        onCancel={() => setConfirmDialog({ open: false, action: null })}
      />
    </Box>
  );
};

export default PettyCashEntryDetail;
