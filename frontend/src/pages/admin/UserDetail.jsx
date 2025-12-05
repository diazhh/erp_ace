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
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
  AccessTime as TimeIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import { fetchUserById, clearCurrentUser } from '../../store/slices/usersSlice';
import { CanDo } from '../../components/common/PermissionGate';

const UserDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentUser, loading, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUserById(id));
    return () => dispatch(clearCurrentUser());
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
        <Button startIcon={<BackIcon />} onClick={() => navigate('/admin/users')} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  if (!currentUser) {
    return null;
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleString('es-VE');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/admin/users')}>
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            Detalle de Usuario
          </Typography>
        </Box>
        <CanDo permission="users:update">
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/admin/users/${id}/edit`)}
          >
            Editar
          </Button>
        </CanDo>
      </Box>

      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: currentUser.isActive ? 'primary.main' : 'grey.400',
                  fontSize: '2rem',
                }}
              >
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {currentUser.firstName} {currentUser.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                @{currentUser.username}
              </Typography>
              <Chip
                icon={currentUser.isActive ? <ActiveIcon /> : <InactiveIcon />}
                label={currentUser.isActive ? 'Activo' : 'Inactivo'}
                color={currentUser.isActive ? 'success' : 'default'}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de la Cuenta
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Nombre de Usuario"
                  secondary={currentUser.username}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={currentUser.email}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Último Acceso"
                  secondary={formatDate(currentUser.lastLogin)}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Fecha de Creación"
                  secondary={formatDate(currentUser.createdAt)}
                />
              </ListItem>
            </List>

            {/* Employee Link */}
            {currentUser.employee && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Empleado Vinculado
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  <ListItem
                    button
                    onClick={() => navigate(`/employees/${currentUser.employee.id}`)}
                  >
                    <ListItemIcon>
                      <BadgeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${currentUser.employee.firstName} ${currentUser.employee.lastName}`}
                      secondary={`${currentUser.employee.idNumber} - ${currentUser.employee.position || 'Sin cargo'}`}
                    />
                  </ListItem>
                </List>
              </>
            )}

            {/* Roles */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Roles Asignados
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {currentUser.roles?.length > 0 ? (
                currentUser.roles.map(role => (
                  <Chip
                    key={role.id}
                    icon={<SecurityIcon />}
                    label={role.name}
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography color="text.secondary">Sin roles asignados</Typography>
              )}
            </Box>

            {/* Consolidated Permissions */}
            {currentUser.consolidatedPermissions?.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Permisos Consolidados ({currentUser.consolidatedPermissions.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {currentUser.consolidatedPermissions.slice(0, 20).map(perm => (
                    <Chip
                      key={perm}
                      label={perm}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {currentUser.consolidatedPermissions.length > 20 && (
                    <Chip
                      label={`+${currentUser.consolidatedPermissions.length - 20} más`}
                      size="small"
                      color="primary"
                    />
                  )}
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetail;
