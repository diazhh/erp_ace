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
  Avatar,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  CreditCard as LoanIcon,
  Folder as ProjectIcon,
  DirectionsCar as VehicleIcon,
  Description as DocumentIcon,
  History as AuditIcon,
  Warning as WarningIcon,
  AccountBalance as BankIcon,
  SupervisorAccount as HierarchyIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { format, differenceInYears, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

import { fetchEmployeeFull, clearCurrentEmployee } from '../../store/slices/employeeSlice';
import EntityLink from '../../components/common/EntityLink';
import organizationService from '../../services/organizationService';
import ConfirmDialog from '../../components/ConfirmDialog';
import { usePermission } from '../../hooks/usePermission';
import { CanDo } from '../../components/common/PermissionGate';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  ON_LEAVE: 'warning',
  TERMINATED: 'error',
};

const TabPanel = ({ children, value, tabId, visibleTabs, ...other }) => {
  // Encontrar el índice del tab actual basado en su ID
  const currentTabId = visibleTabs[value]?.id;
  const isActive = currentTabId === tabId;
  
  return (
    <div role="tabpanel" hidden={!isActive} {...other}>
      {isActive && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentEmployee: employee, loading, error } = useSelector((state) => state.employees);

  const [activeTab, setActiveTab] = useState(0);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState({ open: false, account: null });

  // Permisos para tabs
  const canViewAccounts = usePermission('employees:read:accounts');
  const canViewHierarchy = usePermission('employees:read:hierarchy');
  const canViewPayroll = usePermission('employees:read:payroll');
  const canViewLoans = usePermission('employees:read:loans');
  const canViewDocuments = usePermission('employees:read:documents');
  const canEdit = usePermission('employees:update');

  // Construir lista de tabs visibles
  const visibleTabs = [
    { id: 'info', icon: <PersonIcon />, label: t('employees.tabs.info'), visible: true },
    { id: 'work', icon: <WorkIcon />, label: t('employees.tabs.work'), visible: true },
    { id: 'accounts', icon: <BankIcon />, label: t('employees.tabs.accounts'), visible: canViewAccounts },
    { id: 'hierarchy', icon: <HierarchyIcon />, label: t('employees.tabs.hierarchy'), visible: canViewHierarchy },
    { id: 'payroll', icon: <MoneyIcon />, label: t('employees.tabs.payroll'), visible: canViewPayroll },
    { id: 'loans', icon: <LoanIcon />, label: t('employees.tabs.loans'), visible: canViewLoans },
    { id: 'documents', icon: <DocumentIcon />, label: t('employees.tabs.documents'), visible: canViewDocuments },
    { id: 'audit', icon: <AuditIcon />, label: t('employees.tabs.audit'), visible: true },
  ].filter(tab => tab.visible);

  // Obtener el ID del tab activo basado en el índice
  const getActiveTabId = () => visibleTabs[activeTab]?.id || 'info';

  useEffect(() => {
    dispatch(fetchEmployeeFull(id));
    return () => {
      dispatch(clearCurrentEmployee());
    };
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Gestión de cuentas bancarias
  const handleAddAccount = () => {
    navigate(`/employees/${id}/accounts/new`);
  };

  const handleEditAccount = (accountId) => {
    navigate(`/employees/${id}/accounts/${accountId}/edit`);
  };

  const handleDeleteAccount = async () => {
    try {
      await organizationService.deleteBankAccount(deleteAccountDialog.account.id);
      dispatch(fetchEmployeeFull(id)); // Recargar datos
      setDeleteAccountDialog({ open: false, account: null });
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleSetPrimary = async (accountId) => {
    try {
      await organizationService.setBankAccountPrimary(accountId);
      dispatch(fetchEmployeeFull(id)); // Recargar datos
    } catch (error) {
      console.error('Error setting primary:', error);
    }
  };


  const formatDate = (date) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getStatusLabel = (status) => {
    const labels = {
      ACTIVE: t('employees.status.active'),
      INACTIVE: t('employees.status.inactive'),
      ON_LEAVE: t('employees.status.onLeave'),
      TERMINATED: t('employees.status.terminated'),
    };
    return labels[status] || status;
  };

  const calculateSeniority = (hireDate) => {
    if (!hireDate) return '-';
    const years = differenceInYears(new Date(), new Date(hireDate));
    if (years < 1) {
      const days = differenceInDays(new Date(), new Date(hireDate));
      return `${days} ${t('employees.time.days')}`;
    }
    return `${years} ${years > 1 ? t('employees.time.years') : t('employees.time.year')}`;
  };

  if (loading && !employee) {
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
        <Button startIcon={<BackIcon />} onClick={() => navigate('/employees')} sx={{ mt: 2 }}>
          {t('employees.backToEmployees')}
        </Button>
      </Box>
    );
  }

  if (!employee) {
    return null;
  }

  const getInitials = () => {
    return `${employee.firstName?.[0] || ''}${employee.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/employees')}
            sx={{ minWidth: 'auto' }}
          >
            {t('employees.back')}
          </Button>

          <Avatar
            src={employee.photoUrl}
            sx={{ width: 80, height: 80, fontSize: 32, bgcolor: 'primary.main' }}
          >
            {getInitials()}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {employee.firstName} {employee.lastName}
              </Typography>
              <Chip
                label={getStatusLabel(employee.status)}
                color={statusColors[employee.status]}
                size="small"
              />
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {employee.position} {employee.department && `• ${employee.department}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('employees.code')}: {employee.employeeCode} • {employee.idType}-{employee.idNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('employees.entry')}: {formatDate(employee.hireDate)} • {t('employees.seniority')}: {calculateSeniority(employee.hireDate)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <CanDo permission="employees:update">
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/employees/${id}/edit`)}
              >
                {t('employees.edit')}
              </Button>
            </CanDo>
          </Box>
        </Box>

        {/* Stats Cards */}
        {employee.stats && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="h5" color="primary.main">
                    {employee.stats.payrollEntriesCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('employees.stats.payrolls')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="h5" color="warning.main">
                    {employee.stats.activeLoans}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('employees.stats.activeLoans')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="h5" color="error.main">
                    {formatCurrency(employee.stats.pendingLoanBalance)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('employees.stats.loanBalance')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="h5" color={employee.stats.documentsExpiringSoon > 0 ? 'error.main' : 'success.main'}>
                    {employee.stats.documentsExpiringSoon}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('employees.stats.expiringDocs')}
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
          {visibleTabs.map((tab) => (
            <Tab key={tab.id} icon={tab.icon} label={tab.label} iconPosition="start" />
          ))}
        </Tabs>
        <Divider />

        <Box sx={{ p: 2 }}>
          {/* Tab: Información Personal */}
          <TabPanel value={activeTab} tabId="info" visibleTabs={visibleTabs}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>{t('employees.personal.title')}</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('employees.personal.fullName')}</TableCell>
                        <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.personal.identification')}</TableCell>
                        <TableCell>{employee.idType}-{employee.idNumber}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.personal.birthDate')}</TableCell>
                        <TableCell>{formatDate(employee.birthDate)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.personal.gender')}</TableCell>
                        <TableCell>
                          {employee.gender === 'M' ? t('employees.personal.genderMale') : employee.gender === 'F' ? t('employees.personal.genderFemale') : t('employees.personal.genderOther')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.personal.maritalStatus')}</TableCell>
                        <TableCell>
                          {{
                            S: t('employees.personal.single'),
                            C: t('employees.personal.married'),
                            D: t('employees.personal.divorced'),
                            V: t('employees.personal.widowed'),
                            U: t('employees.personal.commonLaw'),
                          }[employee.maritalStatus] || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.personal.nationality')}</TableCell>
                        <TableCell>{employee.nationality || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>{t('employees.contact.title')}</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('employees.contact.email')}</TableCell>
                        <TableCell>{employee.email || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.contact.phone')}</TableCell>
                        <TableCell>{employee.phone || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.contact.mobile')}</TableCell>
                        <TableCell>{employee.mobilePhone || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.contact.address')}</TableCell>
                        <TableCell>{employee.address || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.contact.city')}</TableCell>
                        <TableCell>{employee.city || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.contact.state')}</TableCell>
                        <TableCell>{employee.state || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>{t('employees.emergency.title')}</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('employees.emergency.name')}</TableCell>
                        <TableCell>{employee.emergencyContactName || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.emergency.phone')}</TableCell>
                        <TableCell>{employee.emergencyContactPhone || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.emergency.relation')}</TableCell>
                        <TableCell>{employee.emergencyContactRelation || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab: Información Laboral */}
          <TabPanel value={activeTab} tabId="work" visibleTabs={visibleTabs}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>{t('employees.work.title')}</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('employees.work.code')}</TableCell>
                        <TableCell>{employee.employeeCode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.work.position')}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.work.department')}</TableCell>
                        <TableCell>{employee.department || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.work.contractType')}</TableCell>
                        <TableCell>
                          {{
                            FULL_TIME: t('employees.work.fullTime'),
                            PART_TIME: t('employees.work.partTime'),
                            CONTRACT: t('employees.work.contract'),
                            TEMPORARY: t('employees.work.temporary'),
                          }[employee.employmentType] || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.work.hireDate')}</TableCell>
                        <TableCell>{formatDate(employee.hireDate)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.work.schedule')}</TableCell>
                        <TableCell>{employee.workSchedule || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>{t('employees.banking.title')}</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('employees.banking.bank')}</TableCell>
                        <TableCell>{employee.bankName || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.banking.accountType')}</TableCell>
                        <TableCell>
                          {employee.bankAccountType === 'CHECKING' ? t('employees.banking.checking') : 
                           employee.bankAccountType === 'SAVINGS' ? t('employees.banking.savings') : '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.banking.accountNumber')}</TableCell>
                        <TableCell>{employee.bankAccountNumber || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.banking.baseSalary')}</TableCell>
                        <TableCell>{formatCurrency(employee.baseSalary, employee.salaryCurrency)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.banking.paymentFrequency')}</TableCell>
                        <TableCell>
                          {{
                            WEEKLY: t('employees.banking.weekly'),
                            BIWEEKLY: t('employees.banking.biweekly'),
                            MONTHLY: t('employees.banking.monthly'),
                          }[employee.paymentFrequency] || '-'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>{t('employees.socialSecurity.title')}</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('employees.socialSecurity.ssn')}</TableCell>
                        <TableCell>{employee.socialSecurityNumber || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('employees.socialSecurity.taxId')}</TableCell>
                        <TableCell>{employee.taxId || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab: Cuentas Bancarias */}
          <TabPanel value={activeTab} tabId="accounts" visibleTabs={visibleTabs}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('employees.accounts.title')}</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAccount}
                size="small"
              >
                {t('employees.accounts.add')}
              </Button>
            </Box>
            {employee.bankAccounts?.length > 0 ? (
              <Grid container spacing={2}>
                {employee.bankAccounts.map((account) => (
                  <Grid item xs={12} md={6} key={account.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {account.bankName}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            {account.isPrimary ? (
                              <Chip label={t('employees.accounts.primary')} size="small" color="primary" />
                            ) : (
                              <Tooltip title={t('employees.accounts.setPrimary')}>
                                <IconButton size="small" onClick={() => handleSetPrimary(account.id)}>
                                  <StarBorderIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Chip
                              label={account.status === 'ACTIVE' ? t('employees.accounts.active') : t('employees.accounts.inactive')}
                              size="small"
                              color={account.status === 'ACTIVE' ? 'success' : 'default'}
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('employees.accounts.type')}: {{
                            CHECKING: t('employees.banking.checking'),
                            SAVINGS: t('employees.banking.savings'),
                            PAGO_MOVIL: t('employees.accounts.pagoMovil'),
                            ZELLE: t('employees.accounts.zelle'),
                            CRYPTO: t('employees.accounts.crypto'),
                          }[account.accountType] || account.accountType}
                        </Typography>
                        {account.accountNumber && (
                          <Typography variant="body2">
                            {t('employees.accounts.number')}: {account.accountNumber}
                          </Typography>
                        )}
                        {account.phoneNumber && (
                          <Typography variant="body2">
                            {t('employees.accounts.phoneNumber')}: {account.phoneNumber}
                          </Typography>
                        )}
                        {account.zelleEmail && (
                          <Typography variant="body2">
                            {t('employees.accounts.zelleEmail')}: {account.zelleEmail}
                          </Typography>
                        )}
                        {account.walletAddress && (
                          <Typography variant="body2" noWrap>
                            {t('employees.accounts.wallet')}: {account.walletAddress}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {t('employees.accounts.currency')}: {account.currency} | {t('employees.accounts.percentage')}: {account.paymentPercentage}%
                        </Typography>
                        
                        {/* Acciones */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditAccount(account.id)}
                          >
                            {t('employees.accounts.edit')}
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteAccountDialog({ open: true, account })}
                          >
                            {t('employees.accounts.delete')}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert 
                severity="info" 
                action={
                  <Button color="inherit" size="small" onClick={handleAddAccount}>
                    {t('employees.accounts.addFirst')}
                  </Button>
                }
              >
                {t('employees.accounts.noAccounts')}
              </Alert>
            )}
          </TabPanel>

          {/* Tab: Jerarquía */}
          <TabPanel value={activeTab} tabId="hierarchy" visibleTabs={visibleTabs}>
            <Grid container spacing={3}>
              {/* Supervisor */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>{t('employees.hierarchy.directSupervisor')}</Typography>
                {employee.supervisor ? (
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={employee.supervisor.photoUrl}
                          sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
                        >
                          {employee.supervisor.firstName?.[0]}{employee.supervisor.lastName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                            onClick={() => navigate(`/employees/${employee.supervisor.id}`)}
                          >
                            {employee.supervisor.firstName} {employee.supervisor.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.supervisor.position}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {employee.supervisor.employeeCode}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ) : (
                  <Alert severity="info">{t('employees.hierarchy.noSupervisor')}</Alert>
                )}
              </Grid>

              {/* Subordinados */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  {t('employees.hierarchy.subordinates')} ({employee.subordinates?.length || 0})
                </Typography>
                {employee.subordinates?.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {employee.subordinates.map((sub) => (
                      <Card key={sub.id} variant="outlined">
                        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={sub.photoUrl}
                              sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}
                            >
                              {sub.firstName?.[0]}{sub.lastName?.[0]}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body1"
                                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                onClick={() => navigate(`/employees/${sub.id}`)}
                              >
                                {sub.firstName} {sub.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {sub.position} | {sub.employeeCode}
                              </Typography>
                            </Box>
                            <Chip
                              label={sub.status === 'ACTIVE' ? t('employees.status.active') : t('employees.status.inactive')}
                              size="small"
                              color={sub.status === 'ACTIVE' ? 'success' : 'default'}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Alert severity="info">{t('employees.hierarchy.noSubordinates')}</Alert>
                )}
              </Grid>

              {/* Departamento y Posición */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{t('employees.hierarchy.orgLocation')}</Typography>
                <Grid container spacing={2}>
                  {employee.departmentRef && (
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">{t('employees.hierarchy.department')}</Typography>
                          <Typography variant="h6">{employee.departmentRef.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.departmentRef.code} | {employee.departmentRef.type}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {employee.positionRef && (
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">{t('employees.hierarchy.positionStructure')}</Typography>
                          <Typography variant="h6">{employee.positionRef.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.positionRef.code} | {t('employees.hierarchy.level')} {employee.positionRef.level}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab: Nómina */}
          <TabPanel value={activeTab} tabId="payroll" visibleTabs={visibleTabs}>
            <Typography variant="h6" gutterBottom>{t('employees.payrollHistory.title')}</Typography>
            {employee.payrollEntries?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('employees.payrollHistory.period')}</TableCell>
                      <TableCell>{t('employees.payrollHistory.dates')}</TableCell>
                      <TableCell align="right">{t('employees.payrollHistory.grossSalary')}</TableCell>
                      <TableCell align="right">{t('employees.payrollHistory.deductions')}</TableCell>
                      <TableCell align="right">{t('employees.payrollHistory.netSalary')}</TableCell>
                      <TableCell>{t('employees.payrollHistory.status')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.payrollEntries.map((entry) => (
                      <TableRow key={entry.id} hover>
                        <TableCell>
                          <EntityLink
                            type="period"
                            id={entry.period?.id}
                            label={entry.period?.code || '-'}
                          />
                        </TableCell>
                        <TableCell>
                          {entry.period && `${formatDate(entry.period.startDate)} - ${formatDate(entry.period.endDate)}`}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(entry.grossSalary)}</TableCell>
                        <TableCell align="right">{formatCurrency(entry.totalDeductions)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(entry.netSalary)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entry.period?.status || '-'}
                            size="small"
                            color={entry.period?.status === 'PAID' ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">{t('employees.payrollHistory.noRecords')}</Alert>
            )}
          </TabPanel>

          {/* Tab: Préstamos */}
          <TabPanel value={activeTab} tabId="loans" visibleTabs={visibleTabs}>
            <Typography variant="h6" gutterBottom>{t('employees.loansSection.title')}</Typography>
            {employee.loans?.length > 0 ? (
              <Grid container spacing={2}>
                {employee.loans.map((loan) => {
                  const progress = loan.amount > 0 
                    ? ((loan.amount - loan.remainingAmount) / loan.amount) * 100 
                    : 0;
                  return (
                    <Grid item xs={12} md={6} key={loan.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <EntityLink
                              type="loan"
                              id={loan.id}
                              label={loan.code}
                              showIcon
                            />
                            <Chip
                              label={loan.status}
                              size="small"
                              color={loan.status === 'ACTIVE' ? 'warning' : loan.status === 'PAID' ? 'success' : 'default'}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {loan.description || loan.loanType}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{t('employees.loansSection.amount')}: {formatCurrency(loan.amount)}</Typography>
                            <Typography variant="body2">{t('employees.loansSection.installment')}: {formatCurrency(loan.installmentAmount)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{t('employees.loansSection.paid')}: {formatCurrency(loan.amount - loan.remainingAmount)}</Typography>
                            <Typography variant="body2" color="error.main">
                              {t('employees.loansSection.pending')}: {formatCurrency(loan.remainingAmount)}
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {loan.paidInstallments || 0} {t('employees.loansSection.installmentsOf')} {loan.totalInstallments} {t('employees.loansSection.installments')}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Alert severity="info">{t('employees.loansSection.noLoans')}</Alert>
            )}
          </TabPanel>

          {/* Tab: Documentos */}
          <TabPanel value={activeTab} tabId="documents" visibleTabs={visibleTabs}>
            <Typography variant="h6" gutterBottom>{t('employees.documentsSection.title')}</Typography>
            {employee.documents?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('employees.documentsSection.type')}</TableCell>
                      <TableCell>{t('employees.documentsSection.name')}</TableCell>
                      <TableCell>{t('employees.documentsSection.expirationDate')}</TableCell>
                      <TableCell>{t('employees.documentsSection.status')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.documents.map((doc) => {
                      const isExpiringSoon = doc.expirationDate && 
                        differenceInDays(new Date(doc.expirationDate), new Date()) <= 30 &&
                        differenceInDays(new Date(doc.expirationDate), new Date()) > 0;
                      const isExpired = doc.expirationDate && 
                        differenceInDays(new Date(doc.expirationDate), new Date()) <= 0;
                      
                      return (
                        <TableRow key={doc.id} hover>
                          <TableCell>{doc.documentType}</TableCell>
                          <TableCell>{doc.documentName}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {formatDate(doc.expirationDate)}
                              {isExpiringSoon && (
                                <Tooltip title={t('employees.documentsSection.expiringSoon')}>
                                  <WarningIcon color="warning" fontSize="small" />
                                </Tooltip>
                              )}
                              {isExpired && (
                                <Tooltip title={t('employees.documentsSection.expired')}>
                                  <WarningIcon color="error" fontSize="small" />
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={doc.status}
                              size="small"
                              color={doc.status === 'VALID' ? 'success' : doc.status === 'EXPIRED' ? 'error' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">{t('employees.documentsSection.noDocuments')}</Alert>
            )}
          </TabPanel>

          {/* Tab: Auditoría */}
          <TabPanel value={activeTab} tabId="audit" visibleTabs={visibleTabs}>
            <Typography variant="h6" gutterBottom>{t('employees.audit.title')}</Typography>
            {employee.auditLogs?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('employees.audit.date')}</TableCell>
                      <TableCell>{t('employees.audit.user')}</TableCell>
                      <TableCell>{t('employees.audit.action')}</TableCell>
                      <TableCell>{t('employees.audit.details')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.auditLogs.map((log) => (
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
                        <TableCell>
                          {log.action === 'UPDATE' && log.oldValues && log.newValues && (
                            <Typography variant="caption" color="text.secondary">
                              {t('employees.audit.fieldsModified')}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">{t('employees.audit.noRecords')}</Alert>
            )}
          </TabPanel>
        </Box>
      </Paper>

      {/* Confirm Delete Account Dialog */}
      <ConfirmDialog
        open={deleteAccountDialog.open}
        title={t('employees.accounts.deleteTitle')}
        message={t('employees.accounts.deleteConfirm', { bank: deleteAccountDialog.account?.bankName || '' })}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteAccountDialog({ open: false, account: null })}
      />
    </Box>
  );
};

export default EmployeeDetail;
