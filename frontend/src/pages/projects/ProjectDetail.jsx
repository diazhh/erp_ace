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
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Autocomplete,
  useMediaQuery,
  useTheme,
  Alert,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Flag as FlagIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Group as TeamIcon,
  Timeline as MilestoneIcon,
  Receipt as ExpenseIcon,
  History as HistoryIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Update as UpdateIcon,
  PhotoLibrary as PhotoIcon,
  TrendingUp as ProgressIcon,
  Engineering as ContractorIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  fetchProjectFull, 
  clearCurrentProject,
  addMember,
  removeMember,
  createMilestone,
  updateMilestone,
  completeMilestone,
  deleteMilestone,
  createExpense,
  approveExpense,
  rejectExpense,
  fetchMemberRoles,
  fetchExpenseTypes,
  fetchUpdates,
  createUpdate,
  deleteUpdate,
  fetchPhotos,
  addPhoto,
  deletePhoto,
  fetchUpdateTypes,
  fetchPhotoCategories,
  // Valuations
  fetchValuations,
  createValuation,
  submitValuation,
  approveValuation,
  rejectValuation,
  generateInvoiceFromValuation,
  deleteValuation,
} from '../../store/slices/projectSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import AttachmentSection from '../../components/common/AttachmentSection';
import ResponsiveTabs from '../../components/common/ResponsiveTabs';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const statusColors = {
  PLANNING: 'info',
  IN_PROGRESS: 'primary',
  ON_HOLD: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const statusLabels = {
  PLANNING: 'Planificación',
  IN_PROGRESS: 'En Progreso',
  ON_HOLD: 'En Espera',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const priorityColors = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'error',
};

const priorityLabels = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

const milestoneStatusColors = {
  PENDING: 'default',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success',
  DELAYED: 'error',
  CANCELLED: 'default',
};

const milestoneStatusLabels = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completado',
  DELAYED: 'Atrasado',
  CANCELLED: 'Cancelado',
};

const expenseStatusColors = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  PAID: 'info',
};

const expenseStatusLabels = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  PAID: 'Pagado',
};

const valuationStatusColors = {
  DRAFT: 'default',
  SUBMITTED: 'info',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  INVOICED: 'primary',
  PAID: 'success',
};

const valuationStatusLabels = {
  DRAFT: 'Borrador',
  SUBMITTED: 'Enviada',
  UNDER_REVIEW: 'En Revisión',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  INVOICED: 'Facturada',
  PAID: 'Pagada',
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { currentProject, members, milestones, expenses, updates, photos, valuations, memberRoles, expenseTypes, updateTypes, photoCategories, loading } = useSelector((state) => state.projects);
  const { employees } = useSelector((state) => state.employees);
  
  const [tabValue, setTabValue] = useState(0);
  
  // Dialogs
  const [memberDialog, setMemberDialog] = useState(false);
  const [milestoneDialog, setMilestoneDialog] = useState(false);
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [photoDialog, setPhotoDialog] = useState(false);
  const [valuationDialog, setValuationDialog] = useState(false);
  const [invoiceDialog, setInvoiceDialog] = useState(false);
  const [selectedValuation, setSelectedValuation] = useState(null);
  
  // Form data
  const [memberForm, setMemberForm] = useState({ employeeId: '', role: '', allocation: 100 });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({ name: '', description: '', dueDate: '', weight: 1 });
  const [expenseForm, setExpenseForm] = useState({ 
    expenseType: '', description: '', amount: '', expenseDate: '', vendor: '' 
  });
  const [updateForm, setUpdateForm] = useState({ 
    updateType: 'PROGRESS', title: '', description: '', progressAfter: '' 
  });
  const [photoForm, setPhotoForm] = useState({ 
    photoUrl: '', caption: '', category: 'PROGRESS' 
  });
  const [valuationForm, setValuationForm] = useState({
    periodStart: '', periodEnd: '', currentPercent: '', description: '', inspectionNotes: ''
  });
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: '', controlNumber: '', invoiceDate: '', dueDate: '', taxRate: 16, retentionRate: 2, ivaRetentionRate: 75
  });

  useEffect(() => {
    dispatch(fetchProjectFull(id));
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
    dispatch(fetchMemberRoles());
    dispatch(fetchExpenseTypes());
    dispatch(fetchUpdateTypes());
    dispatch(fetchPhotoCategories());
    dispatch(fetchUpdates({ projectId: id }));
    dispatch(fetchPhotos({ projectId: id }));
    dispatch(fetchValuations({ projectId: id }));
    
    return () => {
      dispatch(clearCurrentProject());
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

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'error';
  };

  // Member handlers
  const handleAddMember = async () => {
    if (!memberForm.employeeId || !memberForm.role) {
      toast.error('Complete los campos requeridos');
      return;
    }
    try {
      await dispatch(addMember({ projectId: id, data: memberForm })).unwrap();
      toast.success('Miembro agregado');
      setMemberDialog(false);
      setMemberForm({ employeeId: '', role: '', allocation: 100 });
      setSelectedEmployee(null);
      dispatch(fetchProjectFull(id));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('¿Está seguro de remover este miembro?')) {
      try {
        await dispatch(removeMember({ projectId: id, memberId })).unwrap();
        toast.success('Miembro removido');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  // Milestone handlers
  const handleCreateMilestone = async () => {
    if (!milestoneForm.name || !milestoneForm.dueDate) {
      toast.error('Complete los campos requeridos');
      return;
    }
    try {
      await dispatch(createMilestone({ projectId: id, data: milestoneForm })).unwrap();
      toast.success('Hito creado');
      setMilestoneDialog(false);
      setMilestoneForm({ name: '', description: '', dueDate: '', weight: 1 });
      dispatch(fetchProjectFull(id));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCompleteMilestone = async (milestoneId) => {
    try {
      await dispatch(completeMilestone({ projectId: id, milestoneId })).unwrap();
      toast.success('Hito completado');
      dispatch(fetchProjectFull(id));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (window.confirm('¿Está seguro de eliminar este hito?')) {
      try {
        await dispatch(deleteMilestone({ projectId: id, milestoneId })).unwrap();
        toast.success('Hito eliminado');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  // Expense handlers
  const handleCreateExpense = async () => {
    if (!expenseForm.expenseType || !expenseForm.description || !expenseForm.amount) {
      toast.error('Complete los campos requeridos');
      return;
    }
    try {
      await dispatch(createExpense({ 
        projectId: id, 
        data: {
          ...expenseForm,
          amount: parseFloat(expenseForm.amount),
          expenseDate: expenseForm.expenseDate || new Date().toISOString().split('T')[0],
        }
      })).unwrap();
      toast.success('Gasto registrado');
      setExpenseDialog(false);
      setExpenseForm({ expenseType: '', description: '', amount: '', expenseDate: '', vendor: '' });
      dispatch(fetchProjectFull(id));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleApproveExpense = async (expenseId) => {
    try {
      await dispatch(approveExpense({ projectId: id, expenseId })).unwrap();
      toast.success('Gasto aprobado');
      dispatch(fetchProjectFull(id));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRejectExpense = async (expenseId) => {
    const reason = window.prompt('Razón del rechazo:');
    if (reason) {
      try {
        await dispatch(rejectExpense({ projectId: id, expenseId, reason })).unwrap();
        toast.success('Gasto rechazado');
        dispatch(fetchProjectFull(id));
      } catch (error) {
        toast.error(error);
      }
    }
  };

  // Update handlers
  const handleCreateUpdate = async () => {
    if (!updateForm.title) {
      toast.error('El título es requerido');
      return;
    }
    try {
      await dispatch(createUpdate({ 
        projectId: id, 
        data: {
          ...updateForm,
          progressAfter: updateForm.progressAfter ? parseInt(updateForm.progressAfter) : null,
        }
      })).unwrap();
      toast.success('Actualización registrada');
      setUpdateDialog(false);
      setUpdateForm({ updateType: 'PROGRESS', title: '', description: '', progressAfter: '' });
      dispatch(fetchProjectFull(id));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    if (window.confirm('¿Está seguro de eliminar esta actualización?')) {
      try {
        await dispatch(deleteUpdate({ projectId: id, updateId })).unwrap();
        toast.success('Actualización eliminada');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  // Photo handlers
  const handleAddPhoto = async () => {
    if (!photoForm.photoUrl) {
      toast.error('La URL de la foto es requerida');
      return;
    }
    try {
      await dispatch(addPhoto({ projectId: id, data: photoForm })).unwrap();
      toast.success('Foto agregada');
      setPhotoDialog(false);
      setPhotoForm({ photoUrl: '', caption: '', category: 'PROGRESS' });
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('¿Está seguro de eliminar esta foto?')) {
      try {
        await dispatch(deletePhoto({ projectId: id, photoId })).unwrap();
        toast.success('Foto eliminada');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  // Valuation handlers
  const handleCreateValuation = async () => {
    if (!valuationForm.periodStart || !valuationForm.periodEnd || !valuationForm.currentPercent) {
      toast.error('Complete los campos requeridos');
      return;
    }
    try {
      await dispatch(createValuation({ projectId: id, data: valuationForm })).unwrap();
      toast.success('Valuación creada');
      setValuationDialog(false);
      setValuationForm({ periodStart: '', periodEnd: '', currentPercent: '', description: '', inspectionNotes: '' });
      dispatch(fetchProjectFull(id));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSubmitValuation = async (valuationId) => {
    try {
      await dispatch(submitValuation({ projectId: id, valuationId })).unwrap();
      toast.success('Valuación enviada para revisión');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleApproveValuation = async (valuationId) => {
    try {
      await dispatch(approveValuation({ projectId: id, valuationId })).unwrap();
      toast.success('Valuación aprobada');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRejectValuation = async (valuationId) => {
    const reason = window.prompt('Razón del rechazo:');
    if (!reason) return;
    try {
      await dispatch(rejectValuation({ projectId: id, valuationId, reason })).unwrap();
      toast.success('Valuación rechazada');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!invoiceForm.invoiceNumber || !invoiceForm.invoiceDate) {
      toast.error('Número de factura y fecha son requeridos');
      return;
    }
    try {
      await dispatch(generateInvoiceFromValuation({ 
        projectId: id, 
        valuationId: selectedValuation.id, 
        data: invoiceForm 
      })).unwrap();
      toast.success('Factura generada exitosamente');
      setInvoiceDialog(false);
      setSelectedValuation(null);
      setInvoiceForm({ invoiceNumber: '', controlNumber: '', invoiceDate: '', dueDate: '', taxRate: 16, retentionRate: 2, ivaRetentionRate: 75 });
      dispatch(fetchValuations({ projectId: id }));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteValuation = async (valuationId) => {
    if (window.confirm('¿Está seguro de eliminar esta valuación?')) {
      try {
        await dispatch(deleteValuation({ projectId: id, valuationId })).unwrap();
        toast.success('Valuación eliminada');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const openInvoiceDialog = (valuation) => {
    setSelectedValuation(valuation);
    setInvoiceDialog(true);
  };

  if (loading || !currentProject) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const project = currentProject;
  const stats = project.stats || {};
  
  // Offset para tabs dinámicos (Valuaciones solo aparece en OUTSOURCED)
  const isOutsourced = project.executionType === 'OUTSOURCED';
  const tabOffset = isOutsourced ? 1 : 0; // +1 si hay tab de Valuaciones

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: { xs: 2, sm: 0 } }}>
          <IconButton onClick={() => navigate('/projects')} sx={{ mt: 0.5 }}>
            <BackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold" noWrap>
              {project.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.code}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }, 
          gap: 1, 
          mt: 2,
          pl: { xs: 0, sm: 6 }
        }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexGrow: 1 }}>
            <Chip label={statusLabels[project.status]} color={statusColors[project.status]} />
            <Chip label={priorityLabels[project.priority]} color={priorityColors[project.priority]} variant="outlined" />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
            <DownloadPDFButton
              endpoint={`/reports/projects/${id}`}
              filename={`proyecto-${project.code}.pdf`}
            />
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/projects/${id}/edit`)}
              fullWidth={isMobile}
            >
              Editar
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={1} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
              <Typography variant="caption" color="text.secondary" noWrap>Progreso</Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold" color={`${getProgressColor(project.progress)}.main`}>
                {project.progress}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
              <Typography variant="caption" color="text.secondary" noWrap>Equipo</Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold" color="primary">
                {stats.team?.activeMembers || members.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
              <Typography variant="caption" color="text.secondary" noWrap>Hitos</Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
                {stats.milestones?.total || milestones.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
              <Typography variant="caption" color="text.secondary" noWrap>Presupuesto</Typography>
              <Typography variant="body1" fontWeight="bold" color="info.main" noWrap sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                {formatCurrency(project.budget, project.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
              <Typography variant="caption" color="text.secondary" noWrap>Costo Real</Typography>
              <Typography variant="body1" fontWeight="bold" color="warning.main" noWrap sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                {formatCurrency(project.actualCost, project.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
              <Typography variant="caption" color="text.secondary" noWrap>Uso Presup.</Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold" color={stats.financial?.budgetUsage > 100 ? 'error.main' : 'success.main'}>
                {(stats.financial?.budgetUsage || 0).toFixed(0)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Progreso del Proyecto</Typography>
          <Typography variant="body2" fontWeight="bold">{project.progress}%</Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={project.progress} 
          color={getProgressColor(project.progress)}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Paper>

      {/* Tabs */}
      <Paper sx={{ p: isMobile ? 2 : 0, mb: 3 }}>
        <ResponsiveTabs
          tabs={[
            { label: 'Información', icon: <BusinessIcon /> },
            { label: `Equipo (${members.length})`, icon: <TeamIcon /> },
            { label: `Hitos (${milestones.length})`, icon: <MilestoneIcon /> },
            { label: `Gastos (${expenses.length})`, icon: <ExpenseIcon /> },
            ...(project.executionType === 'OUTSOURCED' ? [{ label: `Valuaciones (${valuations?.length || 0})`, icon: <MoneyIcon /> }] : []),
            { label: `Seguimiento (${updates.length})`, icon: <UpdateIcon /> },
            { label: `Fotos (${photos.length})`, icon: <PhotoIcon /> },
            { label: 'Auditoría', icon: <HistoryIcon /> },
            { label: 'Documentos' },
          ]}
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          ariaLabel="project-tabs"
        />
      </Paper>

      {/* Tab: Información */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Información General</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><FlagIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Tipo de Ejecución" 
                    secondary={
                      <Chip 
                        label={project.executionType === 'OUTSOURCED' ? 'Contratado' : 'Interno'} 
                        color={project.executionType === 'OUTSOURCED' ? 'secondary' : 'info'}
                        size="small"
                      />
                    } 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ScheduleIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Fechas" 
                    secondary={`${formatDate(project.startDate)} - ${formatDate(project.endDate)}`} 
                  />
                </ListItem>
                {project.manager && (
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Gerente" 
                      secondary={`${project.manager.firstName} ${project.manager.lastName}`} 
                    />
                  </ListItem>
                )}
                {project.location && (
                  <ListItem>
                    <ListItemIcon><LocationIcon /></ListItemIcon>
                    <ListItemText primary="Ubicación" secondary={project.location} />
                  </ListItem>
                )}
              </List>
              {project.description && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {project.description}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            {project.executionType === 'OUTSOURCED' ? (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <ContractorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Contratista
                </Typography>
                {project.contractor ? (
                  <List dense>
                    <ListItem>
                      <ListItemIcon><BusinessIcon /></ListItemIcon>
                      <ListItemText primary="Empresa" secondary={project.contractor.companyName} />
                    </ListItem>
                    {project.contractor.rif && (
                      <ListItem>
                        <ListItemIcon><FlagIcon /></ListItemIcon>
                        <ListItemText primary="RIF" secondary={project.contractor.rif} />
                      </ListItem>
                    )}
                    {project.contractor.contactName && (
                      <ListItem>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary="Contacto" secondary={project.contractor.contactName} />
                      </ListItem>
                    )}
                    {project.contractor.phone && (
                      <ListItem>
                        <ListItemIcon><PhoneIcon /></ListItemIcon>
                        <ListItemText primary="Teléfono" secondary={project.contractor.phone} />
                      </ListItem>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <ListItem>
                      <ListItemIcon><MoneyIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Monto del Contrato" 
                        secondary={formatCurrency(project.contractAmount, project.currency)} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><MoneyIcon color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="Pagado al Contratista" 
                        secondary={formatCurrency(project.paidToContractor, project.currency)} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><MoneyIcon color="warning" /></ListItemIcon>
                      <ListItemText 
                        primary="Pendiente por Pagar" 
                        secondary={formatCurrency((project.contractAmount || 0) - (project.paidToContractor || 0), project.currency)} 
                      />
                    </ListItem>
                  </List>
                ) : (
                  <Typography color="text.secondary">Sin contratista asignado</Typography>
                )}
              </Paper>
            ) : (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Resumen Financiero</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><MoneyIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Presupuesto" 
                      secondary={formatCurrency(project.budget, project.currency)} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MoneyIcon color="warning" /></ListItemIcon>
                    <ListItemText 
                      primary="Costo Real" 
                      secondary={formatCurrency(project.actualCost, project.currency)} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MoneyIcon color={stats.variance >= 0 ? 'success' : 'error'} /></ListItemIcon>
                    <ListItemText 
                      primary="Variación" 
                      secondary={formatCurrency(stats.variance, project.currency)} 
                    />
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem>
                    <ListItemText 
                      primary="Gastos Aprobados" 
                      secondary={`${stats.approvedExpenses || 0} de ${expenses.length}`} 
                    />
                  </ListItem>
                </List>
              </Paper>
            )}
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab: Equipo */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', mb: 2 }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setMemberDialog(true)} fullWidth={isMobile}>
            {t('projects.addMember', 'Agregar Miembro')}
          </Button>
        </Box>
        {members.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">{t('projects.noMembers', 'No hay miembros asignados')}</Typography>
          </Paper>
        ) : isMobile ? (
          <Box>
            {members.map((member) => (
              <Card key={member.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {member.employee?.firstName} {member.employee?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.role}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={member.status === 'ACTIVE' ? t('common.active', 'Activo') : t('common.inactive', 'Inactivo')} 
                        color={member.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                      <IconButton size="small" color="error" onClick={() => handleRemoveMember(member.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('projects.allocation', 'Dedicación')}: {member.allocation}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('common.since', 'Desde')}: {formatDate(member.startDate)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('common.employee', 'Empleado')}</TableCell>
                  <TableCell>{t('projects.role', 'Rol')}</TableCell>
                  <TableCell>{t('projects.allocation', 'Dedicación')}</TableCell>
                  <TableCell>{t('common.since', 'Desde')}</TableCell>
                  <TableCell>{t('common.status', 'Estado')}</TableCell>
                  <TableCell align="right">{t('common.actions', 'Acciones')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.employee?.firstName} {member.employee?.lastName}
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.allocation}%</TableCell>
                    <TableCell>{formatDate(member.startDate)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={member.status === 'ACTIVE' ? t('common.active', 'Activo') : t('common.inactive', 'Inactivo')} 
                        color={member.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => handleRemoveMember(member.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Tab: Hitos */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', mb: 2 }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setMilestoneDialog(true)} fullWidth={isMobile}>
            {t('projects.newMilestone', 'Nuevo Hito')}
          </Button>
        </Box>
        <Grid container spacing={2}>
          {milestones.map((milestone) => (
            <Grid item xs={12} sm={6} md={4} key={milestone.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{milestone.name}</Typography>
                    <Chip 
                      label={milestoneStatusLabels[milestone.status]} 
                      color={milestoneStatusColors[milestone.status]}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {milestone.description || 'Sin descripción'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fecha límite: {formatDate(milestone.dueDate)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {milestone.status !== 'COMPLETED' && (
                      <Button 
                        size="small" 
                        startIcon={<CheckIcon />}
                        onClick={() => handleCompleteMilestone(milestone.id)}
                      >
                        Completar
                      </Button>
                    )}
                    <IconButton size="small" color="error" onClick={() => handleDeleteMilestone(milestone.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {milestones.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No hay hitos definidos</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Tab: Gastos */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', mb: 2 }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setExpenseDialog(true)} fullWidth={isMobile}>
            {t('projects.registerExpense', 'Registrar Gasto')}
          </Button>
        </Box>
        {expenses.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">{t('projects.noExpenses', 'No hay gastos registrados')}</Typography>
          </Paper>
        ) : isMobile ? (
          <Box>
            {expenses.map((expense) => (
              <Card key={expense.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{expense.code}</Typography>
                      <Typography variant="body2" color="text.secondary">{expense.expenseType}</Typography>
                    </Box>
                    <Chip 
                      label={expenseStatusLabels[expense.status]} 
                      color={expenseStatusColors[expense.status]}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>{expense.description}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(expense.expenseDate)}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatCurrency(expense.amount, expense.currency)}
                    </Typography>
                  </Box>
                  {expense.status === 'PENDING' && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
                      <Button size="small" color="success" startIcon={<CheckIcon />} onClick={() => handleApproveExpense(expense.id)}>
                        {t('common.approve', 'Aprobar')}
                      </Button>
                      <Button size="small" color="error" startIcon={<CancelIcon />} onClick={() => handleRejectExpense(expense.id)}>
                        {t('common.reject', 'Rechazar')}
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('common.code', 'Código')}</TableCell>
                  <TableCell>{t('common.type', 'Tipo')}</TableCell>
                  <TableCell>{t('common.description', 'Descripción')}</TableCell>
                  <TableCell>{t('common.amount', 'Monto')}</TableCell>
                  <TableCell>{t('common.date', 'Fecha')}</TableCell>
                  <TableCell>{t('common.status', 'Estado')}</TableCell>
                  <TableCell align="right">{t('common.actions', 'Acciones')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.code}</TableCell>
                    <TableCell>{expense.expenseType}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{formatCurrency(expense.amount, expense.currency)}</TableCell>
                    <TableCell>{formatDate(expense.expenseDate)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={expenseStatusLabels[expense.status]} 
                        color={expenseStatusColors[expense.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {expense.status === 'PENDING' && (
                        <>
                          <Tooltip title={t('common.approve', 'Aprobar')}>
                            <IconButton size="small" color="success" onClick={() => handleApproveExpense(expense.id)}>
                              <CheckIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.reject', 'Rechazar')}>
                            <IconButton size="small" color="error" onClick={() => handleRejectExpense(expense.id)}>
                              <CancelIcon />
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
      </TabPanel>

      {/* Tab: Valuaciones (solo OUTSOURCED) */}
      {isOutsourced && (
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', mb: 2 }}>
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => setValuationDialog(true)} fullWidth={isMobile}>
              {t('projects.newValuation', 'Nueva Valuación')}
            </Button>
          </Box>
          {(!valuations || valuations.length === 0) ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('projects.noValuations', 'No hay valuaciones registradas')}</Typography>
            </Paper>
          ) : isMobile ? (
            <Box>
              {valuations.map((val) => (
                <Card key={val.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{val.code}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(val.periodStart)} - {formatDate(val.periodEnd)}
                        </Typography>
                      </Box>
                      <Chip 
                        label={valuationStatusLabels[val.status] || val.status} 
                        color={valuationStatusColors[val.status] || 'default'}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('projects.progress', 'Avance')}</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">{val.currentPercent}%</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">{t('common.amount', 'Monto')}</Typography>
                        <Typography variant="h6" fontWeight="bold">{formatCurrency(val.currentAmount, val.currency)}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('projects.accumulated', 'Acumulado')}: {val.totalAccumulatedPercent}% ({formatCurrency(val.totalAccumulatedAmount, val.currency)})
                      </Typography>
                    </Box>
                    {val.invoice && (
                      <Chip label={`Factura: ${val.invoice.invoiceNumber}`} size="small" variant="outlined" sx={{ mb: 1 }} />
                    )}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {val.status === 'DRAFT' && (
                        <>
                          <Button size="small" color="info" startIcon={<UpdateIcon />} onClick={() => handleSubmitValuation(val.id)}>
                            {t('common.submit', 'Enviar')}
                          </Button>
                          <IconButton size="small" color="error" onClick={() => handleDeleteValuation(val.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                      {(val.status === 'SUBMITTED' || val.status === 'UNDER_REVIEW') && (
                        <>
                          <Button size="small" color="success" startIcon={<CheckIcon />} onClick={() => handleApproveValuation(val.id)}>
                            {t('common.approve', 'Aprobar')}
                          </Button>
                          <Button size="small" color="error" startIcon={<CancelIcon />} onClick={() => handleRejectValuation(val.id)}>
                            {t('common.reject', 'Rechazar')}
                          </Button>
                        </>
                      )}
                      {val.status === 'APPROVED' && (
                        <Button size="small" color="primary" startIcon={<ExpenseIcon />} onClick={() => openInvoiceDialog(val)}>
                          {t('projects.generateInvoice', 'Generar Factura')}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('common.code', 'Código')}</TableCell>
                    <TableCell>{t('projects.period', 'Período')}</TableCell>
                    <TableCell align="right">{t('projects.progressPercent', '% Avance')}</TableCell>
                    <TableCell align="right">{t('common.amount', 'Monto')}</TableCell>
                    <TableCell align="right">{t('projects.accumulated', 'Acumulado')}</TableCell>
                    <TableCell>{t('common.status', 'Estado')}</TableCell>
                    <TableCell align="center">{t('common.actions', 'Acciones')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {valuations.map((val) => (
                    <TableRow key={val.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">{val.code}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(val.periodStart)} - {formatDate(val.periodEnd)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {val.currentPercent}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(val.currentAmount, val.currency)}
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {val.totalAccumulatedPercent}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(val.totalAccumulatedAmount, val.currency)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={valuationStatusLabels[val.status] || val.status} 
                          color={valuationStatusColors[val.status] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          {val.status === 'DRAFT' && (
                            <>
                              <Tooltip title={t('common.submit', 'Enviar para revisión')}>
                                <IconButton size="small" color="info" onClick={() => handleSubmitValuation(val.id)}>
                                  <UpdateIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.delete', 'Eliminar')}>
                                <IconButton size="small" color="error" onClick={() => handleDeleteValuation(val.id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          {(val.status === 'SUBMITTED' || val.status === 'UNDER_REVIEW') && (
                            <>
                              <Tooltip title={t('common.approve', 'Aprobar')}>
                                <IconButton size="small" color="success" onClick={() => handleApproveValuation(val.id)}>
                                  <CheckIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.reject', 'Rechazar')}>
                                <IconButton size="small" color="error" onClick={() => handleRejectValuation(val.id)}>
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          {val.status === 'APPROVED' && (
                            <Tooltip title={t('projects.generateInvoice', 'Generar Factura')}>
                              <IconButton size="small" color="primary" onClick={() => openInvoiceDialog(val)}>
                                <ExpenseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {val.invoice && (
                            <Tooltip title={`Factura: ${val.invoice.code}`}>
                              <Chip label={val.invoice.invoiceNumber} size="small" variant="outlined" />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      )}

      {/* Tab: Seguimiento */}
      <TabPanel value={tabValue} index={4 + tabOffset}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', mb: 2 }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setUpdateDialog(true)} fullWidth={isMobile}>
            {t('projects.newUpdate', 'Nueva Actualización')}
          </Button>
        </Box>
        <Grid container spacing={2}>
          {updates.map((update) => (
            <Grid item xs={12} key={update.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip 
                          label={updateTypes.find(t => t.code === update.updateType)?.name || update.updateType} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(update.reportedAt).toLocaleString('es-VE')}
                        </Typography>
                      </Box>
                      <Typography variant="h6">{update.title}</Typography>
                      {update.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {update.description}
                        </Typography>
                      )}
                      {update.progressAfter !== null && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <ProgressIcon fontSize="small" color="success" />
                          <Typography variant="body2">
                            Progreso: {update.progressBefore}% → {update.progressAfter}%
                          </Typography>
                        </Box>
                      )}
                      {update.reporter && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Reportado por: {update.reporter.firstName} {update.reporter.lastName}
                        </Typography>
                      )}
                    </Box>
                    <IconButton size="small" color="error" onClick={() => handleDeleteUpdate(update.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  {update.photos && update.photos.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                      {update.photos.map((photo) => (
                        <Box
                          key={photo.id}
                          component="img"
                          src={photo.thumbnailUrl || photo.photoUrl}
                          alt={photo.caption}
                          sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {updates.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No hay actualizaciones registradas</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Tab: Fotos */}
      <TabPanel value={tabValue} index={5 + tabOffset}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', mb: 2 }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setPhotoDialog(true)} fullWidth={isMobile}>
            {t('projects.addPhoto', 'Agregar Foto')}
          </Button>
        </Box>
        <Grid container spacing={2}>
          {photos.map((photo) => (
            <Grid item xs={6} sm={4} md={3} key={photo.id}>
              <Card>
                <Box
                  component="img"
                  src={photo.photoUrl}
                  alt={photo.caption}
                  sx={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
                <CardContent sx={{ py: 1 }}>
                  <Chip 
                    label={photoCategories.find(c => c.code === photo.category)?.name || photo.category} 
                    size="small" 
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  {photo.caption && (
                    <Typography variant="body2" noWrap>
                      {photo.caption}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(photo.createdAt).toLocaleDateString('es-VE')}
                  </Typography>
                </CardContent>
                <CardActions sx={{ pt: 0 }}>
                  <IconButton size="small" color="error" onClick={() => handleDeletePhoto(photo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {photos.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No hay fotos registradas</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Tab: Auditoría */}
      <TabPanel value={tabValue} index={6 + tabOffset}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Historial de Cambios</Typography>
          {project.auditLogs && project.auditLogs.length > 0 ? (
            <List dense>
              {project.auditLogs.map((log, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={log.action}
                    secondary={`${log.user?.username || 'Sistema'} - ${new Date(log.createdAt).toLocaleString('es-VE')}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">Sin registros de auditoría</Typography>
          )}
        </Paper>
      </TabPanel>

      {/* Tab: Documentos */}
      <TabPanel value={tabValue} index={7 + tabOffset}>
        <Paper sx={{ p: 2 }}>
          <AttachmentSection
            entityType="project"
            entityId={id}
            title="Documentos del Proyecto"
            defaultCategory="DOCUMENT"
            variant="inline"
          />
        </Paper>
      </TabPanel>

      {/* Dialog: Agregar Miembro */}
      <Dialog open={memberDialog} onClose={() => setMemberDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Miembro al Proyecto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={employees.filter(e => !members.find(m => m.employeeId === e.id))}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={selectedEmployee}
                onChange={(e, v) => {
                  setSelectedEmployee(v);
                  setMemberForm({ ...memberForm, employeeId: v?.id || '' });
                }}
                renderInput={(params) => <TextField {...params} label="Empleado" required />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Rol"
                value={memberForm.role}
                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                required
              >
                {memberRoles.map((role) => (
                  <MenuItem key={role.code} value={role.code}>{role.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dedicación (%)"
                type="number"
                value={memberForm.allocation}
                onChange={(e) => setMemberForm({ ...memberForm, allocation: parseInt(e.target.value) })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddMember}>Agregar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Nuevo Hito */}
      <Dialog open={milestoneDialog} onClose={() => setMilestoneDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Hito</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Hito"
                value={milestoneForm.name}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha Límite"
                type="date"
                value={milestoneForm.dueDate}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Peso"
                type="number"
                value={milestoneForm.weight}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, weight: parseInt(e.target.value) })}
                inputProps={{ min: 1, max: 100 }}
                helperText="Peso para calcular progreso"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMilestoneDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateMilestone}>Crear</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Nuevo Gasto */}
      <Dialog open={expenseDialog} onClose={() => setExpenseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Gasto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo de Gasto"
                value={expenseForm.expenseType}
                onChange={(e) => setExpenseForm({ ...expenseForm, expenseType: e.target.value })}
                required
              >
                {expenseTypes.map((type) => (
                  <MenuItem key={type.code} value={type.code}>{type.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monto"
                type="number"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha"
                type="date"
                value={expenseForm.expenseDate}
                onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Proveedor"
                value={expenseForm.vendor}
                onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExpenseDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateExpense}>Registrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Nueva Actualización */}
      <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Actualización</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo de Actualización"
                value={updateForm.updateType}
                onChange={(e) => setUpdateForm({ ...updateForm, updateType: e.target.value })}
              >
                {updateTypes.map((type) => (
                  <MenuItem key={type.code} value={type.code}>{type.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nuevo Progreso (%)"
                type="number"
                value={updateForm.progressAfter}
                onChange={(e) => setUpdateForm({ ...updateForm, progressAfter: e.target.value })}
                inputProps={{ min: 0, max: 100 }}
                helperText="Dejar vacío si no cambia"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                value={updateForm.title}
                onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={updateForm.description}
                onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateUpdate}>Registrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Agregar Foto */}
      <Dialog open={photoDialog} onClose={() => setPhotoDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Foto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de la Foto"
                value={photoForm.photoUrl}
                onChange={(e) => setPhotoForm({ ...photoForm, photoUrl: e.target.value })}
                required
                helperText="URL de la imagen (ej: https://...)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={photoForm.caption}
                onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Categoría"
                value={photoForm.category}
                onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
              >
                {photoCategories.map((cat) => (
                  <MenuItem key={cat.code} value={cat.code}>{cat.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddPhoto}>Agregar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Nueva Valuación */}
      <Dialog open={valuationDialog} onClose={() => setValuationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Valuación</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha Inicio Período"
                type="date"
                value={valuationForm.periodStart}
                onChange={(e) => setValuationForm({ ...valuationForm, periodStart: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha Fin Período"
                type="date"
                value={valuationForm.periodEnd}
                onChange={(e) => setValuationForm({ ...valuationForm, periodEnd: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Porcentaje de Avance (%)"
                type="number"
                value={valuationForm.currentPercent}
                onChange={(e) => setValuationForm({ ...valuationForm, currentPercent: e.target.value })}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
                required
                helperText="Porcentaje de avance de esta valuación"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción del Trabajo"
                value={valuationForm.description}
                onChange={(e) => setValuationForm({ ...valuationForm, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas de Inspección"
                value={valuationForm.inspectionNotes}
                onChange={(e) => setValuationForm({ ...valuationForm, inspectionNotes: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValuationDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateValuation}>Crear Valuación</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Generar Factura */}
      <Dialog open={invoiceDialog} onClose={() => setInvoiceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generar Factura desde Valuación</DialogTitle>
        <DialogContent>
          {selectedValuation && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Valuación: <strong>{selectedValuation.code}</strong> - 
              Monto: <strong>{formatCurrency(selectedValuation.currentAmount, selectedValuation.currency)}</strong>
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Factura"
                value={invoiceForm.invoiceNumber}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                required
                helperText="Número de factura del contratista"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Control"
                value={invoiceForm.controlNumber}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, controlNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Factura"
                type="date"
                value={invoiceForm.invoiceDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Vencimiento"
                type="date"
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="IVA (%)"
                type="number"
                value={invoiceForm.taxRate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, taxRate: e.target.value })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Retención ISLR (%)"
                type="number"
                value={invoiceForm.retentionRate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, retentionRate: e.target.value })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Retención IVA (%)"
                type="number"
                value={invoiceForm.ivaRetentionRate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, ivaRetentionRate: e.target.value })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvoiceDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGenerateInvoice}>Generar Factura</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetail;
