import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  PersonOff as DeactivateIcon,
  PersonAdd as ActivateIcon,
  VpnKey as ResetPasswordIcon,
  People as UsersIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Badge as EmployeeIcon,
} from '@mui/icons-material';
import { fetchUsers, fetchUserStats, toggleUserActive, resetUserPassword, clearSuccess, clearError, clearTemporaryPassword } from '../../store/slices/usersSlice';
import { fetchRoles } from '../../store/slices/rolesSlice';
import { CanDo } from '../../components/common/PermissionGate';

const UserList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { users, pagination, loading, stats, success, error, temporaryPassword } = useSelector(state => state.users);
  const { roles } = useSelector(state => state.roles);

  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, user: null, action: null });
  const [passwordDialog, setPasswordDialog] = useState({ open: false, password: null });

  useEffect(() => {
    loadUsers();
    dispatch(fetchUserStats());
    dispatch(fetchRoles({ limit: 100 }));
  }, [page, rowsPerPage, search, filterActive, filterRole]);

  useEffect(() => {
    if (temporaryPassword) {
      setPasswordDialog({ open: true, password: temporaryPassword });
    }
  }, [temporaryPassword]);

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [success, error]);

  const loadUsers = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
    };
    // Solo agregar parámetros con valores
    if (search) params.search = search;
    if (filterActive) params.isActive = filterActive;
    if (filterRole) params.roleId = filterRole;
    
    dispatch(fetchUsers(params));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleToggleActive = (user) => {
    setConfirmDialog({
      open: true,
      user,
      action: user.isActive ? 'deactivate' : 'activate',
    });
  };

  const handleResetPassword = (user) => {
    setConfirmDialog({
      open: true,
      user,
      action: 'resetPassword',
    });
  };

  const confirmAction = () => {
    const { user, action } = confirmDialog;
    if (action === 'deactivate' || action === 'activate') {
      dispatch(toggleUserActive(user.id));
    } else if (action === 'resetPassword') {
      dispatch(resetUserPassword(user.id));
    }
    setConfirmDialog({ open: false, user: null, action: null });
  };

  const closePasswordDialog = () => {
    setPasswordDialog({ open: false, password: null });
    dispatch(clearTemporaryPassword());
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Stats Cards
  const StatsCards = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <UsersIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.total || 0}</Typography>
            <Typography variant="body2" color="text.secondary">Total Usuarios</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <ActiveIcon color="success" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.active || 0}</Typography>
            <Typography variant="body2" color="text.secondary">Activos</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <InactiveIcon color="error" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.inactive || 0}</Typography>
            <Typography variant="body2" color="text.secondary">Inactivos</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <EmployeeIcon color="info" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.withEmployee || 0}</Typography>
            <Typography variant="body2" color="text.secondary">Con Empleado</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Mobile Card View
  const UserCard = ({ user }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: user.isActive ? 'primary.main' : 'grey.400' }}>
            {getInitials(user.firstName, user.lastName)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
          <Chip
            label={user.isActive ? 'Activo' : 'Inactivo'}
            color={user.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Email:</strong> {user.email}
        </Typography>
        
        {user.employee && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Empleado:</strong> {user.employee.firstName} {user.employee.lastName}
          </Typography>
        )}
        
        <Box sx={{ mb: 1 }}>
          {user.roles?.map(role => (
            <Chip key={role.id} label={role.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <CanDo permission="users:read">
            <IconButton size="small" onClick={() => navigate(`/admin/users/${user.id}`)}>
              <ViewIcon />
            </IconButton>
          </CanDo>
          <CanDo permission="users:update">
            <IconButton size="small" onClick={() => navigate(`/admin/users/${user.id}/edit`)}>
              <EditIcon />
            </IconButton>
          </CanDo>
          <CanDo permission="users:reset_password">
            <IconButton size="small" onClick={() => handleResetPassword(user)}>
              <ResetPasswordIcon />
            </IconButton>
          </CanDo>
          <CanDo permission="users:update">
            <IconButton size="small" onClick={() => handleToggleActive(user)}>
              {user.isActive ? <DeactivateIcon /> : <ActivateIcon />}
            </IconButton>
          </CanDo>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Gestión de Usuarios
        </Typography>
        <CanDo permission="users:create">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/users/new')}
          >
            Nuevo Usuario
          </Button>
        </CanDo>
      </Box>

      {/* Alerts */}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats */}
      <StatsCards />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nombre, usuario o email..."
              value={search}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filterActive}
                label="Estado"
                onChange={(e) => { setFilterActive(e.target.value); setPage(0); }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Activos</MenuItem>
                <MenuItem value="false">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Rol</InputLabel>
              <Select
                value={filterRole}
                label="Rol"
                onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}
              >
                <MenuItem value="">Todos</MenuItem>
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table / Cards */}
      {isMobile ? (
        <Box>
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Empleado</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: user.isActive ? 'primary.main' : 'grey.400', width: 32, height: 32 }}>
                        {getInitials(user.firstName, user.lastName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.employee ? (
                      <Chip
                        label={`${user.employee.firstName} ${user.employee.lastName}`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.roles?.map(role => (
                      <Chip key={role.id} label={role.name} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Activo' : 'Inactivo'}
                      color={user.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <CanDo permission="users:read">
                      <Tooltip title="Ver detalle">
                        <IconButton size="small" onClick={() => navigate(`/admin/users/${user.id}`)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </CanDo>
                    <CanDo permission="users:update">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => navigate(`/admin/users/${user.id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </CanDo>
                    <CanDo permission="users:reset_password">
                      <Tooltip title="Resetear contraseña">
                        <IconButton size="small" onClick={() => handleResetPassword(user)}>
                          <ResetPasswordIcon />
                        </IconButton>
                      </Tooltip>
                    </CanDo>
                    <CanDo permission="users:update">
                      <Tooltip title={user.isActive ? 'Desactivar' : 'Activar'}>
                        <IconButton size="small" onClick={() => handleToggleActive(user)}>
                          {user.isActive ? <DeactivateIcon /> : <ActivateIcon />}
                        </IconButton>
                      </Tooltip>
                    </CanDo>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={pagination.total}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            labelRowsPerPage="Filas por página"
          />
        </TableContainer>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, user: null, action: null })}>
        <DialogTitle>
          {confirmDialog.action === 'deactivate' && 'Desactivar Usuario'}
          {confirmDialog.action === 'activate' && 'Activar Usuario'}
          {confirmDialog.action === 'resetPassword' && 'Resetear Contraseña'}
        </DialogTitle>
        <DialogContent>
          {confirmDialog.action === 'deactivate' && (
            <Typography>
              ¿Está seguro de desactivar al usuario <strong>{confirmDialog.user?.username}</strong>?
              El usuario no podrá acceder al sistema.
            </Typography>
          )}
          {confirmDialog.action === 'activate' && (
            <Typography>
              ¿Está seguro de activar al usuario <strong>{confirmDialog.user?.username}</strong>?
            </Typography>
          )}
          {confirmDialog.action === 'resetPassword' && (
            <Typography>
              ¿Está seguro de resetear la contraseña del usuario <strong>{confirmDialog.user?.username}</strong>?
              Se generará una contraseña temporal.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, user: null, action: null })}>
            Cancelar
          </Button>
          <Button onClick={confirmAction} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={passwordDialog.open} onClose={closePasswordDialog}>
        <DialogTitle>Contraseña Temporal Generada</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Guarde esta contraseña. No se mostrará nuevamente.
          </Alert>
          <TextField
            fullWidth
            label="Contraseña Temporal"
            value={passwordDialog.password || ''}
            InputProps={{ readOnly: true }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closePasswordDialog} variant="contained">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
