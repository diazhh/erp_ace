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
  useMediaQuery,
  useTheme,
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
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const getAccountTypeLabels = (t) => ({
  CHECKING: t('finance.accountTypeChecking'),
  SAVINGS: t('finance.accountTypeSavings'),
  CRYPTO_WALLET: t('finance.accountTypeCrypto'),
  CASH: t('finance.accountTypeCash'),
  PAGO_MOVIL: t('finance.accountTypePagoMovil'),
  ZELLE: t('finance.accountTypeZelle'),
});

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentAccount: account, loading, error } = useSelector((state) => state.finance);
  const accountTypeLabels = getAccountTypeLabels(t);

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
      INCOME: t('finance.income'),
      EXPENSE: t('finance.expense'),
      TRANSFER: t('finance.transfer'),
      ADJUSTMENT: t('finance.adjustment'),
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
          {t('common.back')}
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
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'flex-start' }, 
          gap: { xs: 2, md: 3 } 
        }}>
          {/* Back button row for mobile */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: { xs: '100%', md: 'auto' }
          }}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/finance/accounts')}
              sx={{ minWidth: 'auto' }}
            >
              {t('common.back')}
            </Button>
            {/* Mobile balance */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                {t('finance.currentBalance')}
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {formatCurrency(account.currentBalance, account.currency)}
              </Typography>
            </Box>
          </Box>

          {/* Icon and info */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 2,
            flex: 1,
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Box
              sx={{
                width: { xs: 48, md: 64 },
                height: { xs: 48, md: 64 },
                borderRadius: 2,
                bgcolor: `${accountTypeColors[account.accountType]}.light`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BankIcon sx={{ fontSize: { xs: 24, md: 32 }, color: `${accountTypeColors[account.accountType]}.main` }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'center' }, 
                gap: 1, 
                mb: 1,
                flexWrap: 'wrap'
              }}>
                <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
                  {account.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Chip
                    label={accountTypeLabels[account.accountType] || account.accountType}
                    color={accountTypeColors[account.accountType]}
                    size="small"
                  />
                  <Chip
                    label={account.isActive ? t('finance.isActive') : t('finance.isInactive')}
                    color={account.isActive ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Typography variant="subtitle1" color="text.secondary">
                {account.bankName || t('finance.noBank', 'Sin banco')} {account.accountNumber && `• ${account.accountNumber}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('finance.accountHolder')}: {account.accountHolder || '-'} • {t('finance.currency')}: {account.currency}
              </Typography>
            </Box>
          </Box>

          {/* Desktop balance */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
            <Typography variant="overline" color="text.secondary">
              {t('finance.currentBalance')}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {formatCurrency(account.currentBalance, account.currency)}
            </Typography>
            <DownloadPDFButton
              endpoint={`/reports/bank-accounts/${id}`}
              filename={`cuenta-${account.accountNumber || account.name}.pdf`}
              size="small"
              sx={{ mt: 1 }}
            />
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
                    {t('finance.pendingReconciliation')}
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
          allowScrollButtonsMobile
        >
          <Tab icon={<BankIcon />} label={t('finance.accountInfo')} iconPosition="start" />
          <Tab icon={<TransactionIcon />} label={t('finance.transactions')} iconPosition="start" />
          <Tab icon={<TransferIcon />} label={t('finance.transfer')} iconPosition="start" />
          <Tab icon={<AuditIcon />} label={t('finance.auditInfo')} iconPosition="start" />
        </Tabs>
        <Divider />

        <Box sx={{ p: { xs: 1, md: 2 } }}>
          {/* Tab: Información */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>{t('finance.accountInfo')}</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('common.name')}</TableCell>
                        <TableCell>{account.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('finance.accountType')}</TableCell>
                        <TableCell>{accountTypeLabels[account.accountType] || account.accountType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('finance.bankName')}</TableCell>
                        <TableCell>{account.bankName || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('finance.accountNumber')}</TableCell>
                        <TableCell>{account.accountNumber || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('finance.accountHolder')}</TableCell>
                        <TableCell>{account.accountHolder || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('finance.currency')}</TableCell>
                        <TableCell>{account.currency}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('common.status')}</TableCell>
                        <TableCell>
                          <Chip
                            label={account.isActive ? t('finance.isActive') : t('finance.isInactive')}
                            color={account.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('finance.defaultAccount')}</TableCell>
                        <TableCell>{account.isDefault ? t('common.yes') : t('common.no')}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                {account.accountType === 'PAGO_MOVIL' && (
                  <>
                    <Typography variant="h6" gutterBottom>{t('finance.accountTypePagoMovil')}</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('finance.rif')}</TableCell>
                            <TableCell>{account.rif || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('finance.phone')}</TableCell>
                            <TableCell>{account.phone || '-'}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}

                {account.accountType === 'CRYPTO_WALLET' && (
                  <>
                    <Typography variant="h6" gutterBottom>{t('finance.accountTypeCrypto')}</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('finance.walletAddress')}</TableCell>
                            <TableCell sx={{ wordBreak: 'break-all' }}>{account.walletAddress || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('finance.network')}</TableCell>
                            <TableCell>{account.network || '-'}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}

                {account.notes && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>{t('common.notes')}</Typography>
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
            <Typography variant="h6" gutterBottom>{t('finance.transactions')}</Typography>
            {account.transactions?.length > 0 ? (
              <>
                {isMobile ? (
                  // Mobile: Cards view
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {account.transactions.map((tx) => (
                      <Card key={tx.id} variant="outlined">
                        <CardContent sx={{ pb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <EntityLink type="transaction" id={tx.id} label={tx.code} />
                              <Typography variant="caption" color="text.secondary" display="block">
                                {formatDate(tx.transactionDate)}
                              </Typography>
                            </Box>
                            <Chip
                              label={tx.status}
                              size="small"
                              color={
                                tx.status === 'CONFIRMED' ? 'success' :
                                tx.status === 'PENDING' ? 'warning' :
                                tx.status === 'CANCELLED' ? 'error' : 'default'
                              }
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            {getTransactionTypeIcon(tx.transactionType)}
                            <Typography variant="body2">{getTransactionTypeLabel(tx.transactionType)}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {tx.description || tx.category || '-'}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold"
                            color={tx.transactionType === 'INCOME' ? 'success.main' : tx.transactionType === 'EXPENSE' ? 'error.main' : 'inherit'}
                            sx={{ mt: 1 }}
                          >
                            {tx.transactionType === 'INCOME' ? '+' : tx.transactionType === 'EXPENSE' ? '-' : ''}
                            {formatCurrency(tx.amount, tx.currency)}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  // Desktop: Table view
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('finance.date')}</TableCell>
                          <TableCell>{t('finance.code')}</TableCell>
                          <TableCell>{t('finance.type')}</TableCell>
                          <TableCell>{t('finance.category')}</TableCell>
                          <TableCell>{t('finance.description')}</TableCell>
                          <TableCell align="right">{t('finance.amount')}</TableCell>
                          <TableCell>{t('common.status')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {account.transactions.map((tx) => (
                          <TableRow key={tx.id} hover>
                            <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                            <TableCell>
                              <EntityLink type="transaction" id={tx.id} label={tx.code} />
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
                )}
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
                    labelRowsPerPage={t('common.rowsPerPage')}
                  />
                )}
              </>
            ) : (
              <Alert severity="info">{t('finance.noTransactions')}</Alert>
            )}
          </TabPanel>

          {/* Tab: Transferencias */}
          <TabPanel value={activeTab} index={2}>
            {/* Transferencias Entrantes */}
            <Typography variant="h6" gutterBottom>{t('finance.incomingTransfers')}</Typography>
            {account.incomingTransfers?.length > 0 ? (
              isMobile ? (
                // Mobile: Cards view
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  {account.incomingTransfers.map((tx) => (
                    <Card key={tx.id} variant="outlined">
                      <CardContent sx={{ pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{tx.code}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(tx.transactionDate)}
                            </Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                            +{formatCurrency(tx.amount, tx.currency)}
                          </Typography>
                        </Box>
                        {tx.account && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {t('finance.fromAccount')}: <EntityLink type="account" id={tx.account.id} label={tx.account.name} />
                          </Typography>
                        )}
                        {tx.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {tx.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                // Desktop: Table view
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('finance.date')}</TableCell>
                        <TableCell>{t('finance.code')}</TableCell>
                        <TableCell>{t('finance.fromAccount')}</TableCell>
                        <TableCell>{t('finance.description')}</TableCell>
                        <TableCell align="right">{t('finance.amount')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {account.incomingTransfers.map((tx) => (
                        <TableRow key={tx.id} hover>
                          <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                          <TableCell>{tx.code}</TableCell>
                          <TableCell>
                            {tx.account && (
                              <EntityLink type="account" id={tx.account.id} label={tx.account.name} />
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
              )
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>{t('finance.noIncomingTransfers')}</Alert>
            )}

            {/* Transferencias Salientes */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>{t('finance.outgoingTransfers')}</Typography>
            {account.outgoingTransfers?.length > 0 ? (
              isMobile ? (
                // Mobile: Cards view
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  {account.outgoingTransfers.map((tx) => (
                    <Card key={tx.id} variant="outlined">
                      <CardContent sx={{ pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{tx.code}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(tx.transactionDate)}
                            </Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                            -{formatCurrency(tx.amount, tx.currency)}
                          </Typography>
                        </Box>
                        {tx.destinationAccount && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {t('finance.toAccount')}: <EntityLink type="account" id={tx.destinationAccount.id} label={tx.destinationAccount.name} />
                          </Typography>
                        )}
                        {tx.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {tx.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                // Desktop: Table view
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('finance.date')}</TableCell>
                        <TableCell>{t('finance.code')}</TableCell>
                        <TableCell>{t('finance.toAccount')}</TableCell>
                        <TableCell>{t('finance.description')}</TableCell>
                        <TableCell align="right">{t('finance.amount')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {account.outgoingTransfers.map((tx) => (
                        <TableRow key={tx.id} hover>
                          <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                          <TableCell>{tx.code}</TableCell>
                          <TableCell>
                            {tx.destinationAccount && (
                              <EntityLink type="account" id={tx.destinationAccount.id} label={tx.destinationAccount.name} />
                            )}
                          </TableCell>
                          <TableCell>{tx.description || '-'}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                            -{formatCurrency(tx.amount, tx.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>{t('finance.noOutgoingTransfers')}</Alert>
            )}
          </TabPanel>

          {/* Tab: Auditoría */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom>{t('finance.auditInfo')}</Typography>
            {account.auditLogs?.length > 0 ? (
              isMobile ? (
                // Mobile: Cards view
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {account.auditLogs.map((log) => (
                    <Card key={log.id} variant="outlined">
                      <CardContent sx={{ pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {log.user?.username || '-'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                            </Typography>
                          </Box>
                          <Chip
                            label={log.action}
                            size="small"
                            color={
                              log.action === 'CREATE' ? 'success' :
                              log.action === 'UPDATE' ? 'info' :
                              log.action === 'DELETE' ? 'error' : 'default'
                            }
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                // Desktop: Table view
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('common.createdAt')}</TableCell>
                        <TableCell>{t('auth.username')}</TableCell>
                        <TableCell>{t('common.actions')}</TableCell>
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
              )
            ) : (
              <Alert severity="info">{t('common.noData')}</Alert>
            )}
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default BankAccountDetail;
