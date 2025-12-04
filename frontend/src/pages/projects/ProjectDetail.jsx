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
} from '../../store/slices/projectSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';

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
  
  const { currentProject, members, milestones, expenses, memberRoles, expenseTypes, loading } = useSelector((state) => state.projects);
  const { employees } = useSelector((state) => state.employees);
  
  const [tabValue, setTabValue] = useState(0);
  
  // Dialogs
  const [memberDialog, setMemberDialog] = useState(false);
  const [milestoneDialog, setMilestoneDialog] = useState(false);
  const [expenseDialog, setExpenseDialog] = useState(false);
  
  // Form data
  const [memberForm, setMemberForm] = useState({ employeeId: '', role: '', allocation: 100 });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({ name: '', description: '', dueDate: '', weight: 1 });
  const [expenseForm, setExpenseForm] = useState({ 
    expenseType: '', description: '', amount: '', expenseDate: '', vendor: '' 
  });

  useEffect(() => {
    dispatch(fetchProjectFull(id));
    dispatch(fetchEmployees({ limit: 200, status: 'ACTIVE' }));
    dispatch(fetchMemberRoles());
    dispatch(fetchExpenseTypes());
    
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

  if (loading || !currentProject) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const project = currentProject;
  const stats = project.stats || {};

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <IconButton onClick={() => navigate('/projects')}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {project.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {project.code}
          </Typography>
        </Box>
        <Chip label={statusLabels[project.status]} color={statusColors[project.status]} />
        <Chip label={priorityLabels[project.priority]} color={priorityColors[project.priority]} variant="outlined" />
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/projects/${id}/edit`)}
        >
          Editar
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Progreso</Typography>
              <Typography variant="h5" fontWeight="bold" color={`${getProgressColor(project.progress)}.main`}>
                {project.progress}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Equipo</Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {stats.team?.activeMembers || members.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Hitos</Typography>
              <Typography variant="h5" fontWeight="bold">
                {stats.milestones?.total || milestones.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Presupuesto</Typography>
              <Typography variant="h6" fontWeight="bold" color="info.main">
                {formatCurrency(project.budget, project.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Costo Real</Typography>
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {formatCurrency(project.actualCost, project.currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Uso Presup.</Typography>
              <Typography variant="h6" fontWeight="bold" color={stats.financial?.budgetUsage > 100 ? 'error.main' : 'success.main'}>
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
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab icon={<BusinessIcon />} label="Información" iconPosition="start" />
          <Tab icon={<TeamIcon />} label={`Equipo (${members.length})`} iconPosition="start" />
          <Tab icon={<MilestoneIcon />} label={`Hitos (${milestones.length})`} iconPosition="start" />
          <Tab icon={<ExpenseIcon />} label={`Gastos (${expenses.length})`} iconPosition="start" />
          <Tab icon={<HistoryIcon />} label="Auditoría" iconPosition="start" />
        </Tabs>
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
                  <ListItemText primary="Tipo" secondary={project.projectType || 'No especificado'} />
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
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Cliente</Typography>
              {project.clientName ? (
                <List dense>
                  <ListItem>
                    <ListItemIcon><BusinessIcon /></ListItemIcon>
                    <ListItemText primary="Nombre" secondary={project.clientName} />
                  </ListItem>
                  {project.clientContact && (
                    <ListItem>
                      <ListItemIcon><PersonIcon /></ListItemIcon>
                      <ListItemText primary="Contacto" secondary={project.clientContact} />
                    </ListItem>
                  )}
                  {project.clientEmail && (
                    <ListItem>
                      <ListItemIcon><EmailIcon /></ListItemIcon>
                      <ListItemText primary="Email" secondary={project.clientEmail} />
                    </ListItem>
                  )}
                  {project.clientPhone && (
                    <ListItem>
                      <ListItemIcon><PhoneIcon /></ListItemIcon>
                      <ListItemText primary="Teléfono" secondary={project.clientPhone} />
                    </ListItem>
                  )}
                </List>
              ) : (
                <Typography color="text.secondary">Sin información de cliente</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab: Equipo */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setMemberDialog(true)}>
            Agregar Miembro
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Empleado</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Dedicación</TableCell>
                <TableCell>Desde</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
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
                      label={member.status === 'ACTIVE' ? 'Activo' : 'Inactivo'} 
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
              {members.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">No hay miembros asignados</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Hitos */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setMilestoneDialog(true)}>
            Nuevo Hito
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setExpenseDialog(true)}>
            Registrar Gasto
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
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
                        <Tooltip title="Aprobar">
                          <IconButton size="small" color="success" onClick={() => handleApproveExpense(expense.id)}>
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar">
                          <IconButton size="small" color="error" onClick={() => handleRejectExpense(expense.id)}>
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">No hay gastos registrados</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Auditoría */}
      <TabPanel value={tabValue} index={4}>
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
    </Box>
  );
};

export default ProjectDetail;
