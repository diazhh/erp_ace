import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  AccountBalance as BankIcon,
  Receipt as TransactionIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as ReconcileIcon,
  SwapHoriz as TransferIcon,
  History as AuditIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { fetchAccountFull, clearCurrentAccount } from '../../store/slices/financeSlice';
import EntityLink from '../../components/common/EntityLink';

const accountTypeLabels = {
  CHECKING: 'Corriente',
  SAVINGS: 'Ahorro',
  CRYPTO_WALLET: 'Wallet Crypto',
  CASH: 'Efectivo',
  PAGO_MOVIL: 'Pago Móvil',
  ZELLE: 'Zelle',
};

const accountTypeColors = {
  CHECKING: 'primary',
  SAVINGS: 'success',
  CRYPTO_WALLET: 'warning',
  CASH: 'default',
  PAGO_MOVIL: 'info',
  ZELLE: 'secondary',
};

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const BankAccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentAccount: account, loading, error } = useSelector((state) => state.finance);

  const [activeTab, setActiveTab] = useState(0);
  const [transactionPage, setTransactionPage] = useState(0);
  const [transactionLimit, setTransactionLimit] = useState(20);

  useEffect(() => {
    dispatch(fetchAccountFull({ id, params: { page: transactionPage + 1, limit: transactionLimit } }));
    return () => {
      dispatch(clearCurrentAccount());
    };
  }, [dispatch, id, transactionPage, transactionLimit]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'INCOME':
        return <IncomeIcon color="success" fontSize="small" />;
      case 'EXPENSE':
        return <ExpenseIcon color="error" fontSize="small" />;
      case 'TRANSFER':
        return <TransferIcon color="info" fontSize="small" />;
      default:
        return null;
    }
  };

  const getTransactionTypeLabel = (type) => {
    const labels = {
      INCOME: 'Ingreso',
      EXPENSE: 'Gasto',
      TRANSFER: 'Transferencia',
      ADJUSTMENT: 'Ajuste',
    };
    return labels[type] || type;
  };

  if (loading && !account) {
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
        <Button startIcon={<BackIcon />} onClick={() => navigate('/finance/accounts')} sx={{ mt: 2 }}>
          Volver a Cuentas
        </Button>
      </Box>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/finance/accounts')}
            sx={{ minWidth: 'auto' }}
          >
            Volver
          </Button>

          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: `${accountTypeColors[account.accountType]}.light`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BankIcon sx={{ fontSize: 32, color: `${accountTypeColors[account.accountType]}.main` }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {account.name}
              </Typography>
              <Chip
                label={accountTypeLabels[account.accountType] || account.accountType}
                color={accountTypeColors[account.accountType]}
                size="small"
              />
              <Chip
                label={account.isActive ? 'Activa' : 'Inactiva'}
                color={account.isActive ? 'success' : 'default'}
                size="small"
                variant="outlined"
              />
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {account.bankName || 'Sin banco'} {account.accountNumber && `• ${account.accountNumber}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Titular: {account.accountHolder || '-'} • Moneda: {account.currency}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="overline" color="text.secondary">
              Saldo Actual
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {formatCurrency(account.currentBalance, account.currency)}
            </Typography>
          </Box>
        </Box>

        {/* Stats Cards */}
        {account.stats && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {account.stats.byType?.map((stat) => (
              <Grid item xs={12} sm={6} md={3} key={stat.transactionType}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      {getTransactionTypeIcon(stat.transactionType)}
                      <Typography variant="h6">
                        {formatCurrency(stat.total, account.currency)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {getTransactionTypeLabel(stat.transactionType)} ({stat.count})
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="h6" color="warning.main">
                    {account.stats.pendingReconciliation}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes de Conciliar
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Tabs */}
      <Paper>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<BankIcon />} label="Información" iconPosition="start" />
          <Tab icon={<TransactionIcon />} label="Transacciones" iconPosition="start" />
          <Tab icon={<TransferIcon />} label="Transferencias" iconPosition="start" />
          <Tab icon={<AuditIcon />} label="Auditoría" iconPosition="start" />
        </Tabs>
        <Divider />

        <Box sx={{ p: 2 }}>
          {/* Tab: Información */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Datos de la Cuenta</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Nombre</TableCell>
                        <TableCell>{account.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                        <TableCell>{accountTypeLabels[account.accountType] || account.accountType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Banco/Plataforma</TableCell>
                        <TableCell>{account.bankName || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Número de Cuenta</TableCell>
                        <TableCell>{account.accountNumber || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Titular</TableCell>
                        <TableCell>{account.accountHolder || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Moneda</TableCell>
                        <TableCell>{account.currency}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                        <TableCell>
                          <Chip
                            label={account.isActive ? 'Activa' : 'Inactiva'}
                            color={account.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Cuenta por Defecto</TableCell>
                        <TableCell>{account.isDefault ? 'Sí' : 'No'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                {account.accountType === 'PAGO_MOVIL' && (
                  <>
                    <Typography variant="h6" gutterBottom>Datos Pago Móvil</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>RIF</TableCell>
                            <TableCell>{account.rif || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                            <TableCell>{account.phone || '-'}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}

                {account.accountType === 'CRYPTO_WALLET' && (
                  <>
                    <Typography variant="h6" gutterBottom>Datos Wallet</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Dirección</TableCell>
                            <TableCell sx={{ wordBreak: 'break-all' }}>{account.walletAddress || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Red</TableCell>
                            <TableCell>{account.network || '-'}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}

                {account.notes && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Notas</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {account.notes}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab: Transacciones */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom>Historial de Transacciones</Typography>
            {account.transactions?.length > 0 ? (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Código</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell align="right">Monto</TableCell>
                        <TableCell>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {account.transactions.map((tx) => (
                        <TableRow key={tx.id} hover>
                          <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                          <TableCell>
                            <EntityLink
                              type="transaction"
                              id={tx.id}
                              label={tx.code}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getTransactionTypeIcon(tx.transactionType)}
                              {getTransactionTypeLabel(tx.transactionType)}
                            </Box>
                          </TableCell>
                          <TableCell>{tx.category || '-'}</TableCell>
                          <TableCell>{tx.description || '-'}</TableCell>
                          <TableCell align="right" sx={{ 
                            fontWeight: 'bold',
                            color: tx.transactionType === 'INCOME' ? 'success.main' : 
                                   tx.transactionType === 'EXPENSE' ? 'error.main' : 'inherit'
                          }}>
                            {tx.transactionType === 'INCOME' ? '+' : tx.transactionType === 'EXPENSE' ? '-' : ''}
                            {formatCurrency(tx.amount, tx.currency)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={tx.status}
                              size="small"
                              color={
                                tx.status === 'CONFIRMED' ? 'success' :
                                tx.status === 'PENDING' ? 'warning' :
                                tx.status === 'CANCELLED' ? 'error' : 'default'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {account.transactionPagination && (
                  <TablePagination
                    component="div"
                    count={account.transactionPagination.total}
                    page={transactionPage}
                    onPageChange={(e, newPage) => setTransactionPage(newPage)}
                    rowsPerPage={transactionLimit}
                    onRowsPerPageChange={(e) => {
                      setTransactionLimit(parseInt(e.target.value, 10));
                      setTransactionPage(0);
                    }}
                    rowsPerPageOptions={[10, 20, 50]}
                    labelRowsPerPage="Filas por página"
                  />
                )}
              </>
            ) : (
              <Alert severity="info">No hay transacciones registradas</Alert>
            )}
          </TabPanel>

          {/* Tab: Transferencias */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>Transferencias Entrantes</Typography>
            {account.incomingTransfers?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Código</TableCell>
                      <TableCell>Desde</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {account.incomingTransfers.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                        <TableCell>{tx.code}</TableCell>
                        <TableCell>
                          {tx.account && (
                            <EntityLink
                              type="account"
                              id={tx.account.id}
                              label={tx.account.name}
                            />
                          )}
                        </TableCell>
                        <TableCell>{tx.description || '-'}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          +{formatCurrency(tx.amount, tx.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>No hay transferencias entrantes</Alert>
            )}
          </TabPanel>

          {/* Tab: Auditoría */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom>Historial de Cambios</Typography>
            {account.auditLogs?.length > 0 ? (
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
                    {account.auditLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
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
        </Box>
      </Paper>
    </Box>
  );
};

export default BankAccountDetail;
