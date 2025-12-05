import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Security as RoleIcon,
  Lock as PermissionIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { fetchRoleById, clearCurrentRole } from '../../store/slices/rolesSlice';
import { CanDo } from '../../components/common/PermissionGate';

// Nombres amigables para los módulos
const MODULE_NAMES = {
  system: 'Sistema',
  users: 'Usuarios',
  roles: 'Roles',
  employees: 'Empleados',
  loans: 'Préstamos',
  payroll: 'Nómina',
  finance: 'Finanzas',
  petty_cash: 'Caja Chica',
  projects: 'Proyectos',
  contractors: 'Contratistas',
  inventory: 'Inventario',
  fleet: 'Flota',
  procurement: 'Procura',
  hse: 'HSE',
  documents: 'Documentos',
  organization: 'Organización',
  audit: 'Auditoría',
  reports: 'Reportes',
};

const RoleDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentRole, loading, error } = useSelector(state => state.roles);

  useEffect(() => {
    dispatch(fetchRoleById(id));
    return () => dispatch(clearCurrentRole());
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/admin/roles')} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  if (!currentRole) {
    return null;
  }

  // Group permissions by module
  const permissionsByModule = {};
  currentRole.permissions?.forEach(perm => {
    if (!permissionsByModule[perm.module]) {
      permissionsByModule[perm.module] = [];
    }
    permissionsByModule[perm.module].push(perm);
  });

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/admin/roles')}>
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            Detalle del Rol
          </Typography>
        </Box>
        <CanDo permission="roles:update">
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/admin/roles/${id}/edit`)}
          >
            Editar
          </Button>
        </CanDo>
      </Box>

      <Grid container spacing={3}>
        {/* Role Info Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <RoleIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {currentRole.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {currentRole.description || 'Sin descripción'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {currentRole.isSystemRole ? (
                  <Chip label="Rol del Sistema" color="info" />
                ) : (
                  <Chip label="Rol Personalizado" color="success" />
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {currentRole.users?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Usuarios
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {currentRole.permissions?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Permisos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          {/* Users with this role */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Usuarios con este Rol ({currentRole.users?.length || 0})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {currentRole.users?.length > 0 ? (
              <List>
                {currentRole.users.map(user => (
                  <ListItem
                    key={user.id}
                    button
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: user.isActive ? 'primary.main' : 'grey.400' }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.firstName} ${user.lastName}`}
                      secondary={`@${user.username} - ${user.email}`}
                    />
                    <Chip
                      label={user.isActive ? 'Activo' : 'Inactivo'}
                      size="small"
                      color={user.isActive ? 'success' : 'default'}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No hay usuarios con este rol
              </Typography>
            )}
          </Paper>

          {/* Permissions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Permisos Asignados ({currentRole.permissions?.length || 0})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {Object.keys(permissionsByModule).length > 0 ? (
              Object.entries(permissionsByModule).map(([moduleName, modulePermissions]) => (
                <Accordion key={moduleName} defaultExpanded={modulePermissions.length <= 5}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PermissionIcon color="primary" />
                      <Typography>
                        {MODULE_NAMES[moduleName] || moduleName}
                      </Typography>
                      <Chip label={modulePermissions.length} size="small" />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {modulePermissions.map(perm => (
                        <Chip
                          key={perm.id}
                          label={perm.name}
                          size="small"
                          variant="outlined"
                          title={perm.code}
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography color="text.secondary">
                No hay permisos asignados
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoleDetail;
