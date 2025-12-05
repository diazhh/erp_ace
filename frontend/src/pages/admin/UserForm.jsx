import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Autocomplete,
  Alert,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { createUser, updateUser, fetchUserById, clearError, clearSuccess, clearCurrentUser } from '../../store/slices/usersSlice';
import { fetchRoles } from '../../store/slices/rolesSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';

const UserForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentUser, loading, error, success } = useSelector(state => state.users);
  const { roles } = useSelector(state => state.roles);
  const { employees } = useSelector(state => state.employees);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    employeeId: null,
    roleIds: [],
    mustChangePassword: true,
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    dispatch(fetchRoles({ limit: 100 }));
    dispatch(fetchEmployees({ limit: 500 }));
    
    if (isEdit) {
      dispatch(fetchUserById(id));
    }

    return () => {
      dispatch(clearCurrentUser());
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [id]);

  useEffect(() => {
    if (isEdit && currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: '',
        confirmPassword: '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        employeeId: currentUser.employeeId || null,
        roleIds: currentUser.roles?.map(r => r.id) || [],
        mustChangePassword: currentUser.mustChangePassword || false,
        isActive: currentUser.isActive ?? true,
      });
      
      if (currentUser.employee) {
        setSelectedEmployee(currentUser.employee);
      }
      
      if (currentUser.roles) {
        setSelectedRoles(currentUser.roles);
      }
    }
  }, [currentUser, isEdit]);

  useEffect(() => {
    if (success) {
      navigate('/admin/users');
    }
  }, [success]);

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Mínimo 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!isEdit && !formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleEmployeeChange = (event, newValue) => {
    setSelectedEmployee(newValue);
    setFormData(prev => ({
      ...prev,
      employeeId: newValue?.id || null,
    }));

    // Auto-fill name if employee selected
    if (newValue && !formData.firstName && !formData.lastName) {
      setFormData(prev => ({
        ...prev,
        firstName: newValue.firstName || '',
        lastName: newValue.lastName || '',
        email: newValue.email || prev.email,
      }));
    }
  };

  const handleRolesChange = (event, newValue) => {
    setSelectedRoles(newValue);
    setFormData(prev => ({
      ...prev,
      roleIds: newValue.map(r => r.id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const submitData = {
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      employeeId: formData.employeeId,
      roleIds: formData.roleIds,
      mustChangePassword: formData.mustChangePassword,
    };

    if (!isEdit) {
      submitData.password = formData.password;
    } else {
      submitData.isActive = formData.isActive;
      if (formData.password) {
        submitData.password = formData.password;
      }
    }

    if (isEdit) {
      dispatch(updateUser({ id, data: submitData }));
    } else {
      dispatch(createUser(submitData));
    }
  };

  // Filter employees that don't have a user account yet (except current one in edit mode)
  const availableEmployees = employees.filter(emp => {
    if (isEdit && currentUser?.employeeId === emp.id) return true;
    return !emp.userId;
  });

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/admin/users')}>
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
        </Typography>
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Account Info */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información de la Cuenta
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
                required
                disabled={isEdit}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={isEdit ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password || (isEdit ? '' : 'Mínimo 8 caracteres')}
                required={!isEdit}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                required={!isEdit && formData.password}
              />
            </Grid>

            {/* Personal Info */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Información Personal
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
                required
              />
            </Grid>

            {/* Employee Link */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Vinculación con Empleado
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                options={availableEmployees}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.idNumber})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empleado Vinculado (Opcional)"
                    helperText="Vincular este usuario a un empleado existente"
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
            </Grid>

            {/* Roles */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Roles y Permisos
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                value={selectedRoles}
                onChange={handleRolesChange}
                options={roles}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Roles"
                    helperText="Seleccione uno o más roles para el usuario"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
            </Grid>

            {/* Options */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Opciones
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.mustChangePassword}
                    onChange={handleChange}
                    name="mustChangePassword"
                  />
                }
                label="Debe cambiar contraseña al iniciar sesión"
              />
            </Grid>

            {isEdit && (
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleChange}
                      name="isActive"
                    />
                  }
                  label="Usuario Activo"
                />
              </Grid>
            )}

            {/* Submit */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button onClick={() => navigate('/admin/users')}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  {isEdit ? 'Guardar Cambios' : 'Crear Usuario'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UserForm;
