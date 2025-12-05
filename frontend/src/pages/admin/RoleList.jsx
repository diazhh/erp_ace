import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
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
  Delete as DeleteIcon,
  Security as RoleIcon,
  Lock as PermissionIcon,
  People as UsersIcon,
} from '@mui/icons-material';
import { fetchRoles, fetchRoleStats, deleteRole, clearSuccess, clearError } from '../../store/slices/rolesSlice';
import { CanDo } from '../../components/common/PermissionGate';

const RoleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { roles, loading, stats, success, error } = useSelector(state => state.roles);

  const [search, setSearch] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, role: null });

  useEffect(() => {
    dispatch(fetchRoles({ includeUserCount: true }));
    dispatch(fetchRoleStats());
  }, []);

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [success, error]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    role.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (role) => {
    if (role.isSystemRole) return;
    setConfirmDialog({ open: true, role });
  };

  const confirmDelete = () => {
    dispatch(deleteRole(confirmDialog.role.id));
    setConfirmDialog({ open: false, role: null });
  };

  // Stats Cards
  const StatsCards = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <RoleIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.totalRoles || 0}</Typography>
            <Typography variant="body2" color="text.secondary">Total Roles</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <RoleIcon color="info" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.systemRoles || 0}</Typography>
            <Typography variant="body2" color="text.secondary">Roles del Sistema</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <RoleIcon color="success" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.customRoles || 0}</Typography>
            <Typography variant="body2" color="text.secondary">Roles Personalizados</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <PermissionIcon color="warning" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{stats?.totalPermissions || 0}</Typography>
            <Typography variant="body2" color="text.secondary">Total Permisos</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Mobile Card View
  const RoleCard = ({ role }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <RoleIcon color="primary" sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {role.name}
            </Typography>
            {role.isSystemRole && (
              <Chip label="Sistema" size="small" color="info" sx={{ ml: 1 }} />
            )}
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {role.description || 'Sin descripción'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip
            icon={<UsersIcon />}
            label={`${role.userCount || 0} usuarios`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<PermissionIcon />}
            label={`${role.permissions?.length || 0} permisos`}
            size="small"
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <CanDo permission="roles:read">
            <IconButton size="small" onClick={() => navigate(`/admin/roles/${role.id}`)}>
              <ViewIcon />
            </IconButton>
          </CanDo>
          <CanDo permission="roles:update">
            <IconButton size="small" onClick={() => navigate(`/admin/roles/${role.id}/edit`)}>
              <EditIcon />
            </IconButton>
          </CanDo>
          {!role.isSystemRole && (
            <CanDo permission="roles:delete">
              <IconButton size="small" onClick={() => handleDelete(role)} color="error">
                <DeleteIcon />
              </IconButton>
            </CanDo>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Gestión de Roles
        </Typography>
        <CanDo permission="roles:create">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/roles/new')}
          >
            Nuevo Rol
          </Button>
        </CanDo>
      </Box>

      {/* Alerts */}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats */}
      <StatsCards />

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Table / Cards */}
      {isMobile ? (
        <Box>
          {filteredRoles.map(role => (
            <RoleCard key={role.id} role={role} />
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rol</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="center">Usuarios</TableCell>
                <TableCell align="center">Permisos</TableCell>
                <TableCell align="center">Tipo</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.map(role => (
                <TableRow key={role.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RoleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight="bold">
                        {role.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {role.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={role.userCount || 0} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={role.permissions?.length || 0} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    {role.isSystemRole ? (
                      <Chip label="Sistema" size="small" color="info" />
                    ) : (
                      <Chip label="Personalizado" size="small" color="success" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <CanDo permission="roles:read">
                      <Tooltip title="Ver detalle">
                        <IconButton size="small" onClick={() => navigate(`/admin/roles/${role.id}`)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </CanDo>
                    <CanDo permission="roles:update">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => navigate(`/admin/roles/${role.id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </CanDo>
                    {!role.isSystemRole && (
                      <CanDo permission="roles:delete">
                        <Tooltip title="Eliminar">
                          <IconButton size="small" onClick={() => handleDelete(role)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </CanDo>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, role: null })}>
        <DialogTitle>Eliminar Rol</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de eliminar el rol <strong>{confirmDialog.role?.name}</strong>?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, role: null })}>
            Cancelar
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleList;
