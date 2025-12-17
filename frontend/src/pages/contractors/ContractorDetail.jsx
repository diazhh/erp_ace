import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccountBalance as BankIcon,
  Description as DocumentIcon,
  Receipt as InvoiceIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Star as StarIcon,
  Engineering as ContractorIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  fetchContractorFull, 
  clearCurrentContractor,
  fetchBankAccounts,
  createBankAccount,
  fetchDocuments,
  createDocument,
  fetchInvoices,
  fetchPayments,
} from '../../store/slices/contractorSlice';
import ResponsiveTabs from '../../components/common/ResponsiveTabs';
import AttachmentSection from '../../components/common/AttachmentSection';
import { AttachFile as AttachIcon } from '@mui/icons-material';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  SUSPENDED: 'error',
  PENDING: 'warning',
};

const getStatusLabel = (status, t) => {
  const labels = {
    ACTIVE: t('common.active'),
    INACTIVE: t('common.inactive'),
    SUSPENDED: t('contractors.suspended', 'Suspendido'),
    PENDING: t('contractors.pending', 'Pendiente'),
  };
  return labels[status] || status;
};

// TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const ContractorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { currentContractor, bankAccounts, documents, invoices, payments, loading } = useSelector((state) => state.contractors);
  
  const [tabValue, setTabValue] = useState(0);
  const [bankDialog, setBankDialog] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountType: 'CHECKING',
    accountNumber: '',
    accountHolder: '',
    currency: 'USD',
  });

  useEffect(() => {
    dispatch(fetchContractorFull(id));
    dispatch(fetchInvoices({ contractorId: id }));
    dispatch(fetchPayments({ contractorId: id }));
    
    return () => {
      dispatch(clearCurrentContractor());
    };
  }, [dispatch, id]);

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

  const handleAddBankAccount = async () => {
    if (!bankForm.bankName || !bankForm.accountNumber) {
      toast.error('Banco y número de cuenta son requeridos');
      return;
    }
    try {
      await dispatch(createBankAccount({ contractorId: id, data: bankForm })).unwrap();
      toast.success('Cuenta bancaria agregada');
      setBankDialog(false);
      setBankForm({ bankName: '', accountType: 'CHECKING', accountNumber: '', accountHolder: '', currency: 'USD' });
      dispatch(fetchContractorFull(id));
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading || !currentContractor) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const contractor = currentContractor;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' }, 
        mb: 3, 
        gap: 2 
      }}>
        {/* Back button row */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: { xs: '100%', md: 'auto' }
        }}>
          <IconButton onClick={() => navigate('/contractors')}>
            <BackIcon />
          </IconButton>
          {/* Mobile edit button */}
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/contractors/${id}/edit`)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            size="small"
          >
            {t('common.edit')}
          </Button>
        </Box>
        
        {/* Avatar and info */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: 2,
          flex: 1,
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 } }}>
            <ContractorIcon fontSize={isMobile ? 'medium' : 'large'} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'center' }, 
              gap: 1, 
              flexWrap: 'wrap'
            }}>
              <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
                {contractor.companyName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Chip label={getStatusLabel(contractor.status, t)} color={statusColors[contractor.status]} size="small" />
                {contractor.rating && (
                  <Chip 
                    icon={<StarIcon />} 
                    label={contractor.rating.toFixed(1)} 
                    variant="outlined" 
                    color="warning"
                    size="small"
                  />
                )}
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {contractor.code} {contractor.rif && `• RIF: ${contractor.rif}`}
            </Typography>
          </Box>
        </Box>
        
        {/* Desktop edit button */}
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/contractors/${id}/edit`)}
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          {t('common.edit')}
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
              <Typography color="text.secondary" variant="caption" gutterBottom display="block">
                {t('projects.title')}
              </Typography>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="primary">
                {contractor.projects?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
              <Typography color="text.secondary" variant="caption" gutterBottom display="block">
                {t('procurement.invoices')}
              </Typography>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="info.main">
                {invoices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
              <Typography color="text.secondary" variant="caption" gutterBottom display="block">
                {t('contractors.totalPaid', 'Total Pagado')}
              </Typography>
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" color="success.main">
                {formatCurrency(contractor.totalPaid)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
              <Typography color="text.secondary" variant="caption" gutterBottom display="block">
                {t('contractors.pending', 'Pendiente')}
              </Typography>
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" color="warning.main">
                {formatCurrency(contractor.totalPending)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ p: isMobile ? 1 : 0, mb: 3 }}>
        <ResponsiveTabs
          tabs={[
            { label: t('contractors.info', 'Información'), icon: <BusinessIcon /> },
            { label: `${t('contractors.accounts', 'Cuentas')} (${bankAccounts.length})`, icon: <BankIcon /> },
            { label: `${t('contractors.documents', 'Documentos')} (${documents.length})`, icon: <DocumentIcon /> },
            { label: `${t('procurement.invoices')} (${invoices.length})`, icon: <InvoiceIcon /> },
            { label: `${t('procurement.payments')} (${payments.length})`, icon: <PaymentIcon /> },
            { label: t('attachments.title'), icon: <AttachIcon /> },
          ]}
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          ariaLabel="contractor-tabs"
        />
      </Paper>

      {/* Tab: Información */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{t('contractors.companyInfo', 'Información de la Empresa')}</Typography>
              <List dense>
                {contractor.tradeName && (
                  <ListItem>
                    <ListItemIcon><BusinessIcon /></ListItemIcon>
                    <ListItemText primary={t('contractors.tradeName', 'Nombre Comercial')} secondary={contractor.tradeName} />
                  </ListItem>
                )}
                {contractor.specialty && (
                  <ListItem>
                    <ListItemIcon><ContractorIcon /></ListItemIcon>
                    <ListItemText primary={t('contractors.specialty', 'Especialidad')} secondary={contractor.specialty} />
                  </ListItem>
                )}
                {contractor.phone && (
                  <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary={t('employees.phone')} secondary={contractor.phone} />
                  </ListItem>
                )}
                {contractor.email && (
                  <ListItem>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText primary={t('auth.email')} secondary={contractor.email} />
                  </ListItem>
                )}
                {contractor.website && (
                  <ListItem>
                    <ListItemIcon><WebIcon /></ListItemIcon>
                    <ListItemText primary={t('contractors.website', 'Sitio Web')} secondary={contractor.website} />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{t('employees.address')}</Typography>
              <List dense>
                {contractor.address && (
                  <ListItem>
                    <ListItemIcon><LocationIcon /></ListItemIcon>
                    <ListItemText 
                      primary={t('employees.address')} 
                      secondary={`${contractor.address}${contractor.city ? `, ${contractor.city}` : ''}${contractor.state ? `, ${contractor.state}` : ''}`} 
                    />
                  </ListItem>
                )}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>{t('contractors.contactPerson', 'Persona de Contacto')}</Typography>
              <List dense>
                {contractor.contactName && (
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary={t('common.name')} secondary={contractor.contactName} />
                  </ListItem>
                )}
                {contractor.contactPhone && (
                  <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary={t('employees.phone')} secondary={contractor.contactPhone} />
                  </ListItem>
                )}
                {contractor.contactEmail && (
                  <ListItem>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText primary={t('auth.email')} secondary={contractor.contactEmail} />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
          {contractor.notes && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>{t('common.notes')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {contractor.notes}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Tab: Cuentas Bancarias */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setBankDialog(true)} fullWidth={isMobile}>
            {t('contractors.addAccount', 'Agregar Cuenta')}
          </Button>
        </Box>
        {isMobile ? (
          // Mobile: Cards view
          bankAccounts.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('finance.noAccounts')}</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {bankAccounts.map((account) => (
                <Card key={account.id} variant="outlined">
                  <CardContent sx={{ pb: '16px !important' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">{account.bankName}</Typography>
                      <Chip 
                        label={account.isVerified ? t('contractors.verified', 'Verificada') : t('contractors.pendingVerification', 'Pendiente')} 
                        color={account.isVerified ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </Box>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('finance.accountType')}</Typography>
                        <Typography variant="body2">{account.accountType}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('finance.currency')}</Typography>
                        <Typography variant="body2">{account.currency}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">{t('finance.accountNumber')}</Typography>
                        <Typography variant="body2">{account.accountNumber}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )
        ) : (
          // Desktop: Table view
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('finance.bankName')}</TableCell>
                  <TableCell>{t('finance.accountType')}</TableCell>
                  <TableCell>{t('finance.accountNumber')}</TableCell>
                  <TableCell>{t('finance.accountHolder')}</TableCell>
                  <TableCell>{t('finance.currency')}</TableCell>
                  <TableCell>{t('common.status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bankAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.bankName}</TableCell>
                    <TableCell>{account.accountType}</TableCell>
                    <TableCell>{account.accountNumber}</TableCell>
                    <TableCell>{account.accountHolder || '-'}</TableCell>
                    <TableCell>{account.currency}</TableCell>
                    <TableCell>
                      <Chip 
                        label={account.isVerified ? t('contractors.verified', 'Verificada') : t('contractors.pendingVerification', 'Pendiente')} 
                        color={account.isVerified ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {bankAccounts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">{t('finance.noAccounts')}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Tab: Documentos */}
      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Número</TableCell>
                <TableCell>Fecha Emisión</TableCell>
                <TableCell>Fecha Vencimiento</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.documentType}</TableCell>
                  <TableCell>{doc.documentNumber || '-'}</TableCell>
                  <TableCell>{formatDate(doc.issueDate)}</TableCell>
                  <TableCell>{formatDate(doc.expiryDate)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={doc.status} 
                      color={doc.status === 'VERIFIED' ? 'success' : 'warning'} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
              {documents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">No hay documentos registrados</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Facturas */}
      <TabPanel value={tabValue} index={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Número Factura</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Pagado</TableCell>
                <TableCell>Pendiente</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.code}</TableCell>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                  <TableCell>{formatCurrency(invoice.total, invoice.currency)}</TableCell>
                  <TableCell>{formatCurrency(invoice.paidAmount, invoice.currency)}</TableCell>
                  <TableCell>{formatCurrency(invoice.pendingAmount, invoice.currency)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={invoice.status} 
                      color={invoice.status === 'PAID' ? 'success' : invoice.status === 'PARTIAL' ? 'warning' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">No hay facturas registradas</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Pagos */}
      <TabPanel value={tabValue} index={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Referencia</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.code}</TableCell>
                  <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                  <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>{payment.referenceNumber || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.status} 
                      color={payment.status === 'PROCESSED' ? 'success' : payment.status === 'APPROVED' ? 'info' : 'warning'} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">No hay pagos registrados</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Archivos */}
      <TabPanel value={tabValue} index={5}>
        <Paper sx={{ p: 3 }}>
          <AttachmentSection
            entityType="contractor"
            entityId={id}
            title="Documentos y Archivos del Contratista"
            defaultExpanded={true}
            canUpload={true}
            canDelete={true}
            showCategory={true}
            defaultCategory="DOCUMENT"
            variant="inline"
          />
        </Paper>
      </TabPanel>

      {/* Dialog: Agregar Cuenta Bancaria */}
      <Dialog open={bankDialog} onClose={() => setBankDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('contractors.addAccount', 'Agregar Cuenta Bancaria')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('finance.bankName')}
                value={bankForm.bankName}
                onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label={t('finance.accountType')}
                value={bankForm.accountType}
                onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}
              >
                <MenuItem value="CHECKING">{t('finance.accountTypeChecking')}</MenuItem>
                <MenuItem value="SAVINGS">{t('finance.accountTypeSavings')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label={t('finance.currency')}
                value={bankForm.currency}
                onChange={(e) => setBankForm({ ...bankForm, currency: e.target.value })}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="VES">VES</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('finance.accountNumber')}
                value={bankForm.accountNumber}
                onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('finance.accountHolder')}
                value={bankForm.accountHolder}
                onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBankDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleAddBankAccount}>{t('common.save')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContractorDetail;
