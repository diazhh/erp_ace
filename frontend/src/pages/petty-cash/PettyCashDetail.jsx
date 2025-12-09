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
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  AccountBalanceWallet as WalletIcon,
  Receipt as ExpenseIcon,
  AddCircle as ReplenishIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  History as AuditIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  fetchPettyCashFull,
  fetchEntries,
  approveEntry,
  rejectEntry,
  clearCurrentPettyCash,
  clearEntries,
} from '../../store/slices/pettyCashSlice';
import EntityLink from '../../components/common/EntityLink';
import PettyCashFormDialog from '../../components/petty-cash/PettyCashFormDialog';
import PettyCashEntryDialog from '../../components/petty-cash/PettyCashEntryDialog';
import PettyCashReplenishDialog from '../../components/petty-cash/PettyCashReplenishDialog';
import ConfirmDialog from '../../components/ConfirmDialog';
import AttachmentSection from '../../components/common/AttachmentSection';
import ResponsiveTabs from '../../components/common/ResponsiveTabs';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  SUSPENDED: 'warning',
  CLOSED: 'error',
};

const entryStatusColors = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
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

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const PettyCashDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { currentPettyCash: pettyCash, entries, entriesPagination, loading, error } = useSelector((state) => state.pettyCash);

  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [replenishDialogOpen, setReplenishDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, entry: null, action: null });

  useEffect(() => {
    dispatch(fetchPettyCashFull(id));
    return () => {
      dispatch(clearCurrentPettyCash());
      dispatch(clearEntries());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchEntries({ pettyCashId: id, params: { page: page + 1, limit } }));
    }
  }, [dispatch, id, page, limit]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    dispatch(fetchPettyCashFull(id));
    dispatch(fetchEntries({ pettyCashId: id, params: { page: page + 1, limit } }));
  };

  const handleEditClose = (refresh) => {
    setEditDialogOpen(false);
    if (refresh) handleRefresh();
  };

  const handleEntryClose = (refresh) => {
    setEntryDialogOpen(false);
    if (refresh) handleRefresh();
  };

  const handleReplenishClose = (refresh) => {
    setReplenishDialogOpen(false);
    if (refresh) handleRefresh();
  };

  const handleApprove = async (entry) => {
    try {
      await dispatch(approveEntry({ pettyCashId: id, entryId: entry.id })).unwrap();
      toast.success('Movimiento aprobado');
      handleRefresh();
    } catch (error) {
      toast.error(error);
    }
    setConfirmDialog({ open: false, entry: null, action: null });
  };

  const handleReject = async (entry) => {
    try {
      await dispatch(rejectEntry({ pettyCashId: id, entryId: entry.id, reason: 'Rechazado' })).unwrap();
      toast.success('Movimiento rechazado');
      handleRefresh();
    } catch (error) {
      toast.error(error);
    }
    setConfirmDialog({ open: false, entry: null, action: null });
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

  const getBalancePercentage = (current, initial) => {
    if (!initial || initial === 0) return 0;
    return Math.min(100, Math.max(0, (current / initial) * 100));
  };

  if (loading && !pettyCash) {
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
        <Button startIcon={<BackIcon />} onClick={() => navigate('/petty-cash')} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  if (!pettyCash) {
    return null;
  }

  const balancePercent = getBalancePercentage(pettyCash.currentBalance, pettyCash.initialAmount);
  const needsReplenishment = parseFloat(pettyCash.currentBalance) <= parseFloat(pettyCash.minimumBalance);

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        {/* Mobile: Back button on top */}
        {isMobile && (
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/petty-cash')}
            sx={{ mb: 2 }}
            size="small"
          >
            Volver
          </Button>
        )}

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'flex-start' }, 
          gap: { xs: 2, md: 3 } 
        }}>
          {/* Desktop: Back button inline */}
          {!isMobile && (
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/petty-cash')}
              sx={{ minWidth: 'auto' }}
            >
              Volver
            </Button>
          )}

          {/* Icon - hidden on mobile */}
          {!isMobile && (
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WalletIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
          )}

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
                {pettyCash.name}
              </Typography>
              <Chip
                label={pettyCash.status}
                color={statusColors[pettyCash.status]}
                size="small"
              />
              {needsReplenishment && (
                <Chip
                  icon={<WarningIcon />}
                  label={isMobile ? 'Reponer' : 'Necesita Reposición'}
                  color="error"
                  size="small"
                />
              )}
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {pettyCash.code} • {pettyCash.currency}
            </Typography>
            {pettyCash.custodian && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Responsable: 
                  <EntityLink
                    type="employee"
                    id={pettyCash.custodian.id}
                    label={` ${pettyCash.custodian.firstName} ${pettyCash.custodian.lastName}`}
                  />
                </Typography>
              </Box>
            )}
          </Box>

          {/* Balance section */}
          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="overline" color="text.secondary">
              Saldo Actual
            </Typography>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color={needsReplenishment ? 'error.main' : 'success.main'}>
              {formatCurrency(pettyCash.currentBalance, pettyCash.currency)}
            </Typography>
            <Box sx={{ width: { xs: '100%', md: 200 }, mt: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={balancePercent} 
                color={needsReplenishment ? 'error' : 'success'}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {balancePercent.toFixed(0)}% del monto inicial
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons - Stack on mobile */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={1} 
          sx={{ mt: 3 }}
        >
          <Button
            variant="contained"
            color="error"
            startIcon={<ExpenseIcon />}
            onClick={() => setEntryDialogOpen(true)}
            disabled={pettyCash.status !== 'ACTIVE'}
            fullWidth={isMobile}
            size={isMobile ? 'medium' : 'medium'}
          >
            Registrar Gasto
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<ReplenishIcon />}
            onClick={() => setReplenishDialogOpen(true)}
            disabled={pettyCash.status !== 'ACTIVE'}
            fullWidth={isMobile}
          >
            Reponer
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
            fullWidth={isMobile}
          >
            Editar
          </Button>
          <DownloadPDFButton
            endpoint={`/reports/petty-cash/${id}`}
            filename={`caja-chica-${pettyCash.code || id}.pdf`}
            fullWidth={isMobile}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            fullWidth={isMobile}
          >
            Actualizar
          </Button>
        </Stack>

        {/* Stats Cards */}
        {pettyCash.stats && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="h5" color="error.main">
                    {formatCurrency(pettyCash.stats.totalExpenses, pettyCash.currency)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Gastos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="h5" color="success.main">
                    {formatCurrency(pettyCash.stats.totalReplenishments, pettyCash.currency)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reposiciones
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="h5" color="warning.main">
                    {pettyCash.stats.pendingApproval}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes Aprobación
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="h5" color="info.main">
                    {formatCurrency(pettyCash.stats.suggestedReplenishment, pettyCash.currency)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reposición Sugerida
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Tabs */}
      <Paper sx={{ p: isMobile ? 2 : 0 }}>
        <ResponsiveTabs
          tabs={[
            { label: 'Movimientos', icon: <ExpenseIcon /> },
            { label: 'Información', icon: <WalletIcon /> },
            { label: 'Auditoría', icon: <AuditIcon /> },
            { label: 'Archivos' },
          ]}
          value={activeTab}
          onChange={handleTabChange}
          ariaLabel="petty-cash-tabs"
        />
        {!isMobile && <Divider />}

        <Box sx={{ p: { xs: 0, md: 2 } }}>
          {/* Tab: Movimientos */}
          <TabPanel value={activeTab} index={0}>
            {entries.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No hay movimientos registrados</Typography>
              </Paper>
            ) : isMobile ? (
              <Box>
                {entries.map((entry) => (
                  <Card key={entry.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/petty-cash/${id}/entries/${entry.id}`)}>
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">{entry.code}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(entry.entryDate)} • {entry.category || 'Sin categoría'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                          <Chip
                            label={entryTypeLabels[entry.entryType]}
                            color={entryTypeColors[entry.entryType]}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={entry.status}
                            color={entryStatusColors[entry.status]}
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {entry.description?.substring(0, 80)}...
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {entry.beneficiary 
                            ? `${entry.beneficiary.firstName} ${entry.beneficiary.lastName}`
                            : entry.beneficiaryName || '-'}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          fontWeight="bold" 
                          color={entry.entryType === 'EXPENSE' ? 'error.main' : 'success.main'}
                        >
                          {entry.entryType === 'EXPENSE' ? '-' : '+'}
                          {formatCurrency(entry.amount, entry.currency)}
                        </Typography>
                      </Box>
                    </CardContent>
                    {entry.status === 'PENDING' && (
                      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                        <Button
                          size="small"
                          color="success"
                          startIcon={<ApproveIcon />}
                          onClick={(e) => { e.stopPropagation(); setConfirmDialog({ open: true, entry, action: 'approve' }); }}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<RejectIcon />}
                          onClick={(e) => { e.stopPropagation(); setConfirmDialog({ open: true, entry, action: 'reject' }); }}
                        >
                          Rechazar
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                ))}
              </Box>
            ) : (
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Código</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Beneficiario</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id} hover>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(entry.entryDate)}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{entry.code}</TableCell>
                        <TableCell>
                          <Chip
                            label={entryTypeLabels[entry.entryType]}
                            color={entryTypeColors[entry.entryType]}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{entry.category || '-'}</TableCell>
                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {entry.description}
                        </TableCell>
                        <TableCell>
                          {entry.beneficiary ? (
                            <EntityLink
                              type="employee"
                              id={entry.beneficiary.id}
                              label={`${entry.beneficiary.firstName} ${entry.beneficiary.lastName}`}
                            />
                          ) : entry.beneficiaryName || '-'}
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          fontWeight: 'bold',
                          color: entry.entryType === 'EXPENSE' ? 'error.main' : 'success.main',
                          whiteSpace: 'nowrap',
                        }}>
                          {entry.entryType === 'EXPENSE' ? '-' : '+'}
                          {formatCurrency(entry.amount, entry.currency)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entry.status}
                            color={entryStatusColors[entry.status]}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Ver detalle">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/petty-cash/${id}/entries/${entry.id}`)}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {entry.status === 'PENDING' && (
                            <>
                              <Tooltip title="Aprobar">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => setConfirmDialog({ open: true, entry, action: 'approve' })}
                                >
                                  <ApproveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Rechazar">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => setConfirmDialog({ open: true, entry, action: 'reject' })}
                                >
                                  <RejectIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <TablePagination
              component={Paper}
              count={entriesPagination.total}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={limit}
              onRowsPerPageChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage={isMobile ? '' : 'Filas por página'}
              sx={{ mt: 2 }}
            />
          </TabPanel>

          {/* Tab: Información */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Configuración</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Código</TableCell>
                        <TableCell>{pettyCash.code}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Moneda</TableCell>
                        <TableCell>{pettyCash.currency}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Monto Inicial</TableCell>
                        <TableCell>{formatCurrency(pettyCash.initialAmount, pettyCash.currency)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Saldo Mínimo</TableCell>
                        <TableCell>{formatCurrency(pettyCash.minimumBalance, pettyCash.currency)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Gasto Máximo</TableCell>
                        <TableCell>{pettyCash.maximumExpense ? formatCurrency(pettyCash.maximumExpense, pettyCash.currency) : 'Sin límite'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Requiere Aprobación</TableCell>
                        <TableCell>{pettyCash.requiresApproval ? 'Sí' : 'No'}</TableCell>
                      </TableRow>
                      {pettyCash.approvalThreshold && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Umbral de Aprobación</TableCell>
                          <TableCell>{formatCurrency(pettyCash.approvalThreshold, pettyCash.currency)}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Cuenta Asociada</Typography>
                {pettyCash.bankAccount ? (
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Cuenta</TableCell>
                          <TableCell>
                            <EntityLink
                              type="account"
                              id={pettyCash.bankAccount.id}
                              label={pettyCash.bankAccount.name}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Banco</TableCell>
                          <TableCell>{pettyCash.bankAccount.bankName || '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Saldo Cuenta</TableCell>
                          <TableCell>{formatCurrency(pettyCash.bankAccount.currentBalance, pettyCash.bankAccount.currency)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">No hay cuenta bancaria asociada para reposiciones</Alert>
                )}

                {pettyCash.description && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Descripción</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pettyCash.description}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab: Auditoría */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>Historial de Cambios</Typography>
            {pettyCash.auditLogs?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pettyCash.auditLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          {new Date(log.createdAt).toLocaleString('es-VE')}
                        </TableCell>
                        <TableCell>{log.user?.username || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.action}
                            size="small"
                            color={
                              log.action === 'CREATE' ? 'success' :
                              log.action === 'UPDATE' ? 'info' :
                              log.action === 'DELETE' ? 'error' : 'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">No hay registros de auditoría</Alert>
            )}
          </TabPanel>

          {/* Tab: Archivos */}
          <TabPanel value={activeTab} index={3}>
            <AttachmentSection
              entityType="petty_cash_entry"
              entityId={id}
              title="Recibos y Comprobantes"
              defaultCategory="RECEIPT"
              variant="inline"
            />
          </TabPanel>
        </Box>
      </Paper>

      {/* Dialogs */}
      <PettyCashFormDialog
        open={editDialogOpen}
        onClose={handleEditClose}
        pettyCash={pettyCash}
      />

      <PettyCashEntryDialog
        open={entryDialogOpen}
        onClose={handleEntryClose}
        pettyCash={pettyCash}
      />

      <PettyCashReplenishDialog
        open={replenishDialogOpen}
        onClose={handleReplenishClose}
        pettyCash={pettyCash}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.action === 'approve' ? 'Aprobar Movimiento' : 'Rechazar Movimiento'}
        message={confirmDialog.action === 'approve' 
          ? `¿Está seguro de aprobar el movimiento ${confirmDialog.entry?.code}?`
          : `¿Está seguro de rechazar el movimiento ${confirmDialog.entry?.code}?`
        }
        onConfirm={() => confirmDialog.action === 'approve' 
          ? handleApprove(confirmDialog.entry) 
          : handleReject(confirmDialog.entry)
        }
        onCancel={() => setConfirmDialog({ open: false, entry: null, action: null })}
      />
    </Box>
  );
};

export default PettyCashDetail;
