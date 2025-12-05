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
  Chip,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
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

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  SUSPENDED: 'error',
  PENDING: 'warning',
};

const statusLabels = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  SUSPENDED: 'Suspendido',
  PENDING: 'Pendiente',
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <IconButton onClick={() => navigate('/contractors')}>
          <BackIcon />
        </IconButton>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <ContractorIcon fontSize="large" />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {contractor.companyName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {contractor.code} {contractor.rif && `• RIF: ${contractor.rif}`}
          </Typography>
        </Box>
        <Chip label={statusLabels[contractor.status]} color={statusColors[contractor.status]} />
        {contractor.rating && (
          <Chip 
            icon={<StarIcon />} 
            label={contractor.rating.toFixed(1)} 
            variant="outlined" 
            color="warning"
          />
        )}
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/contractors/${id}/edit`)}
        >
          Editar
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Proyectos
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {contractor.projects?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Facturas
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {invoices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total Pagado
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {formatCurrency(contractor.totalPaid)}
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
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {formatCurrency(contractor.totalPending)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<BusinessIcon />} label="Información" iconPosition="start" />
          <Tab icon={<BankIcon />} label={`Cuentas (${bankAccounts.length})`} iconPosition="start" />
          <Tab icon={<DocumentIcon />} label={`Documentos (${documents.length})`} iconPosition="start" />
          <Tab icon={<InvoiceIcon />} label={`Facturas (${invoices.length})`} iconPosition="start" />
          <Tab icon={<PaymentIcon />} label={`Pagos (${payments.length})`} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab: Información */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Información de la Empresa</Typography>
              <List dense>
                {contractor.tradeName && (
                  <ListItem>
                    <ListItemIcon><BusinessIcon /></ListItemIcon>
                    <ListItemText primary="Nombre Comercial" secondary={contractor.tradeName} />
                  </ListItem>
                )}
                {contractor.specialty && (
                  <ListItem>
                    <ListItemIcon><ContractorIcon /></ListItemIcon>
                    <ListItemText primary="Especialidad" secondary={contractor.specialty} />
                  </ListItem>
                )}
                {contractor.phone && (
                  <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary="Teléfono" secondary={contractor.phone} />
                  </ListItem>
                )}
                {contractor.email && (
                  <ListItem>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText primary="Email" secondary={contractor.email} />
                  </ListItem>
                )}
                {contractor.website && (
                  <ListItem>
                    <ListItemIcon><WebIcon /></ListItemIcon>
                    <ListItemText primary="Sitio Web" secondary={contractor.website} />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Dirección</Typography>
              <List dense>
                {contractor.address && (
                  <ListItem>
                    <ListItemIcon><LocationIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Dirección" 
                      secondary={`${contractor.address}${contractor.city ? `, ${contractor.city}` : ''}${contractor.state ? `, ${contractor.state}` : ''}`} 
                    />
                  </ListItem>
                )}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Persona de Contacto</Typography>
              <List dense>
                {contractor.contactName && (
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Nombre" secondary={contractor.contactName} />
                  </ListItem>
                )}
                {contractor.contactPhone && (
                  <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary="Teléfono" secondary={contractor.contactPhone} />
                  </ListItem>
                )}
                {contractor.contactEmail && (
                  <ListItem>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText primary="Email" secondary={contractor.contactEmail} />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
          {contractor.notes && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Notas</Typography>
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
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setBankDialog(true)}>
            Agregar Cuenta
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Banco</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Número</TableCell>
                <TableCell>Titular</TableCell>
                <TableCell>Moneda</TableCell>
                <TableCell>Estado</TableCell>
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
                      label={account.isVerified ? 'Verificada' : 'Pendiente'} 
                      color={account.isVerified ? 'success' : 'warning'} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
              {bankAccounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">No hay cuentas bancarias registradas</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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

      {/* Dialog: Agregar Cuenta Bancaria */}
      <Dialog open={bankDialog} onClose={() => setBankDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Cuenta Bancaria</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Banco"
                value={bankForm.bankName}
                onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo de Cuenta"
                value={bankForm.accountType}
                onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}
              >
                <MenuItem value="CHECKING">Corriente</MenuItem>
                <MenuItem value="SAVINGS">Ahorro</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Moneda"
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
                label="Número de Cuenta"
                value={bankForm.accountNumber}
                onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titular de la Cuenta"
                value={bankForm.accountHolder}
                onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBankDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddBankAccount}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContractorDetail;
