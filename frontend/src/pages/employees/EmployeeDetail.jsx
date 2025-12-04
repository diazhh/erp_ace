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

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  ON_LEAVE: 'warning',
  TERMINATED: 'error',
};

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentEmployee: employee, loading, error } = useSelector((state) => state.employees);

  const [activeTab, setActiveTab] = useState(0);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState({ open: false, account: null });

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
      ACTIVE: t('common.active'),
      INACTIVE: t('common.inactive'),
      ON_LEAVE: 'En licencia',
      TERMINATED: 'Terminado',
    };
    return labels[status] || status;
  };

  const calculateSeniority = (hireDate) => {
    if (!hireDate) return '-';
    const years = differenceInYears(new Date(), new Date(hireDate));
    if (years < 1) {
      const days = differenceInDays(new Date(), new Date(hireDate));
      return `${days} días`;
    }
    return `${years} año${years > 1 ? 's' : ''}`;
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
          Volver a Empleados
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
            Volver
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
              Código: {employee.employeeCode} • {employee.idType}-{employee.idNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingreso: {formatDate(employee.hireDate)} • Antigüedad: {calculateSeniority(employee.hireDate)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/employees/${id}/edit`)}
            >
              Editar
            </Button>
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
                    Nóminas
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
                    Préstamos Activos
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
                    Saldo Préstamos
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
                    Docs. por Vencer
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
          <Tab icon={<PersonIcon />} label="Información" iconPosition="start" />
          <Tab icon={<WorkIcon />} label="Laboral" iconPosition="start" />
          <Tab icon={<BankIcon />} label="Cuentas" iconPosition="start" />
          <Tab icon={<HierarchyIcon />} label="Jerarquía" iconPosition="start" />
          <Tab icon={<MoneyIcon />} label="Nómina" iconPosition="start" />
          <Tab icon={<LoanIcon />} label="Préstamos" iconPosition="start" />
          <Tab icon={<DocumentIcon />} label="Documentos" iconPosition="start" />
          <Tab icon={<AuditIcon />} label="Auditoría" iconPosition="start" />
        </Tabs>
        <Divider />

        <Box sx={{ p: 2 }}>
          {/* Tab: Información Personal */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Datos Personales</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Nombre Completo</TableCell>
                        <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Identificación</TableCell>
                        <TableCell>{employee.idType}-{employee.idNumber}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Nacimiento</TableCell>
                        <TableCell>{formatDate(employee.birthDate)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Género</TableCell>
                        <TableCell>
                          {employee.gender === 'M' ? 'Masculino' : employee.gender === 'F' ? 'Femenino' : 'Otro'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Estado Civil</TableCell>
                        <TableCell>
                          {{
                            S: 'Soltero/a',
                            C: 'Casado/a',
                            D: 'Divorciado/a',
                            V: 'Viudo/a',
                            U: 'Unión libre',
                          }[employee.maritalStatus] || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nacionalidad</TableCell>
                        <TableCell>{employee.nationality || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Contacto</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Email</TableCell>
                        <TableCell>{employee.email || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                        <TableCell>{employee.phone || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Celular</TableCell>
                        <TableCell>{employee.mobilePhone || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Dirección</TableCell>
                        <TableCell>{employee.address || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Ciudad</TableCell>
                        <TableCell>{employee.city || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                        <TableCell>{employee.state || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Contacto de Emergencia</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Nombre</TableCell>
                        <TableCell>{employee.emergencyContactName || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                        <TableCell>{employee.emergencyContactPhone || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Relación</TableCell>
                        <TableCell>{employee.emergencyContactRelation || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab: Información Laboral */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Datos Laborales</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Código</TableCell>
                        <TableCell>{employee.employeeCode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Cargo</TableCell>
                        <TableCell>{employee.position}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                        <TableCell>{employee.department || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tipo de Contrato</TableCell>
                        <TableCell>
                          {{
                            FULL_TIME: 'Tiempo Completo',
                            PART_TIME: 'Medio Tiempo',
                            CONTRACT: 'Contrato',
                            TEMPORARY: 'Temporal',
                          }[employee.employmentType] || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Ingreso</TableCell>
                        <TableCell>{formatDate(employee.hireDate)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Horario</TableCell>
                        <TableCell>{employee.workSchedule || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Datos Bancarios</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Banco</TableCell>
                        <TableCell>{employee.bankName || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tipo de Cuenta</TableCell>
                        <TableCell>
                          {employee.bankAccountType === 'CHECKING' ? 'Corriente' : 
                           employee.bankAccountType === 'SAVINGS' ? 'Ahorro' : '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Número de Cuenta</TableCell>
                        <TableCell>{employee.bankAccountNumber || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Salario Base</TableCell>
                        <TableCell>{formatCurrency(employee.baseSalary, employee.salaryCurrency)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Frecuencia de Pago</TableCell>
                        <TableCell>
                          {{
                            WEEKLY: 'Semanal',
                            BIWEEKLY: 'Quincenal',
                            MONTHLY: 'Mensual',
                          }[employee.paymentFrequency] || '-'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Seguridad Social</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>N° Seguro Social</TableCell>
                        <TableCell>{employee.socialSecurityNumber || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>RIF</TableCell>
                        <TableCell>{employee.taxId || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab: Cuentas Bancarias */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Cuentas Bancarias</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAccount}
                size="small"
              >
                Agregar Cuenta
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
                              <Chip label="Principal" size="small" color="primary" />
                            ) : (
                              <Tooltip title="Establecer como principal">
                                <IconButton size="small" onClick={() => handleSetPrimary(account.id)}>
                                  <StarBorderIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Chip
                              label={account.status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
                              size="small"
                              color={account.status === 'ACTIVE' ? 'success' : 'default'}
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Tipo: {{
                            CHECKING: 'Corriente',
                            SAVINGS: 'Ahorro',
                            PAGO_MOVIL: 'Pago Móvil',
                            ZELLE: 'Zelle',
                            CRYPTO: 'Crypto',
                          }[account.accountType] || account.accountType}
                        </Typography>
                        {account.accountNumber && (
                          <Typography variant="body2">
                            Número: {account.accountNumber}
                          </Typography>
                        )}
                        {account.phoneNumber && (
                          <Typography variant="body2">
                            Teléfono: {account.phoneNumber}
                          </Typography>
                        )}
                        {account.zelleEmail && (
                          <Typography variant="body2">
                            Email Zelle: {account.zelleEmail}
                          </Typography>
                        )}
                        {account.walletAddress && (
                          <Typography variant="body2" noWrap>
                            Wallet: {account.walletAddress}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Moneda: {account.currency} | Porcentaje: {account.paymentPercentage}%
                        </Typography>
                        
                        {/* Acciones */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditAccount(account.id)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteAccountDialog({ open: true, account })}
                          >
                            Eliminar
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
                    Agregar
                  </Button>
                }
              >
                No hay cuentas bancarias registradas
              </Alert>
            )}
          </TabPanel>

          {/* Tab: Jerarquía */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              {/* Supervisor */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Supervisor Directo</Typography>
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
                  <Alert severity="info">Sin supervisor asignado</Alert>
                )}
              </Grid>

              {/* Subordinados */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Subordinados ({employee.subordinates?.length || 0})
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
                              label={sub.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                              size="small"
                              color={sub.status === 'ACTIVE' ? 'success' : 'default'}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Alert severity="info">Sin subordinados directos</Alert>
                )}
              </Grid>

              {/* Departamento y Posición */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Ubicación Organizacional</Typography>
                <Grid container spacing={2}>
                  {employee.departmentRef && (
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">Departamento</Typography>
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
                          <Typography variant="subtitle2" color="text.secondary">Cargo (Estructura)</Typography>
                          <Typography variant="h6">{employee.positionRef.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.positionRef.code} | Nivel {employee.positionRef.level}
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
          <TabPanel value={activeTab} index={4}>
            <Typography variant="h6" gutterBottom>Historial de Nóminas</Typography>
            {employee.payrollEntries?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Período</TableCell>
                      <TableCell>Fechas</TableCell>
                      <TableCell align="right">Salario Bruto</TableCell>
                      <TableCell align="right">Deducciones</TableCell>
                      <TableCell align="right">Salario Neto</TableCell>
                      <TableCell>Estado</TableCell>
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
              <Alert severity="info">No hay registros de nómina</Alert>
            )}
          </TabPanel>

          {/* Tab: Préstamos */}
          <TabPanel value={activeTab} index={5}>
            <Typography variant="h6" gutterBottom>Préstamos</Typography>
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
                            <Typography variant="body2">Monto: {formatCurrency(loan.amount)}</Typography>
                            <Typography variant="body2">Cuota: {formatCurrency(loan.installmentAmount)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Pagado: {formatCurrency(loan.amount - loan.remainingAmount)}</Typography>
                            <Typography variant="body2" color="error.main">
                              Pendiente: {formatCurrency(loan.remainingAmount)}
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {loan.paidInstallments || 0} de {loan.totalInstallments} cuotas
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Alert severity="info">No hay préstamos registrados</Alert>
            )}
          </TabPanel>

          {/* Tab: Documentos */}
          <TabPanel value={activeTab} index={6}>
            <Typography variant="h6" gutterBottom>Documentos del Empleado</Typography>
            {employee.documents?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Fecha de Vencimiento</TableCell>
                      <TableCell>Estado</TableCell>
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
                                <Tooltip title="Próximo a vencer">
                                  <WarningIcon color="warning" fontSize="small" />
                                </Tooltip>
                              )}
                              {isExpired && (
                                <Tooltip title="Vencido">
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
              <Alert severity="info">No hay documentos registrados</Alert>
            )}
          </TabPanel>

          {/* Tab: Auditoría */}
          <TabPanel value={activeTab} index={7}>
            <Typography variant="h6" gutterBottom>Historial de Cambios</Typography>
            {employee.auditLogs?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Acción</TableCell>
                      <TableCell>Detalles</TableCell>
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
                              Campos modificados
                            </Typography>
                          )}
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

      {/* Confirm Delete Account Dialog */}
      <ConfirmDialog
        open={deleteAccountDialog.open}
        title="Eliminar Cuenta Bancaria"
        message={`¿Está seguro de eliminar la cuenta ${deleteAccountDialog.account?.bankName || ''}? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteAccountDialog({ open: false, account: null })}
      />
    </Box>
  );
};

export default EmployeeDetail;
