import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Divider,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { createRole, updateRole, fetchRoleById, fetchPermissions, clearError, clearSuccess, clearCurrentRole } from '../../store/slices/rolesSlice';

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

const RoleForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentRole, permissions, loading, error, success } = useSelector(state => state.roles);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissionIds: [],
  });
  const [errors, setErrors] = useState({});
  const [expandedModules, setExpandedModules] = useState([]);

  useEffect(() => {
    dispatch(fetchPermissions());
    
    if (isEdit) {
      dispatch(fetchRoleById(id));
    }

    return () => {
      dispatch(clearCurrentRole());
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [id]);

  useEffect(() => {
    if (isEdit && currentRole) {
      setFormData({
        name: currentRole.name || '',
        description: currentRole.description || '',
        permissionIds: currentRole.permissions?.map(p => p.id) || [],
      });
    }
  }, [currentRole, isEdit]);

  useEffect(() => {
    if (success) {
      navigate('/admin/roles');
    }
  }, [success]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => {
      const newPermissionIds = prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId];
      return { ...prev, permissionIds: newPermissionIds };
    });
  };

  const handleModuleToggle = (moduleName) => {
    const modulePermissions = permissions[moduleName] || [];
    const modulePermissionIds = modulePermissions.map(p => p.id);
    const allSelected = modulePermissionIds.every(id => formData.permissionIds.includes(id));

    setFormData(prev => {
      let newPermissionIds;
      if (allSelected) {
        // Deselect all
        newPermissionIds = prev.permissionIds.filter(id => !modulePermissionIds.includes(id));
      } else {
        // Select all
        newPermissionIds = [...new Set([...prev.permissionIds, ...modulePermissionIds])];
      }
      return { ...prev, permissionIds: newPermissionIds };
    });
  };

  const handleAccordionChange = (moduleName) => (event, isExpanded) => {
    setExpandedModules(prev =>
      isExpanded
        ? [...prev, moduleName]
        : prev.filter(m => m !== moduleName)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (isEdit) {
      dispatch(updateRole({ id, data: formData }));
    } else {
      dispatch(createRole(formData));
    }
  };

  const isModuleFullySelected = (moduleName) => {
    const modulePermissions = permissions[moduleName] || [];
    return modulePermissions.length > 0 && 
           modulePermissions.every(p => formData.permissionIds.includes(p.id));
  };

  const isModulePartiallySelected = (moduleName) => {
    const modulePermissions = permissions[moduleName] || [];
    const selectedCount = modulePermissions.filter(p => formData.permissionIds.includes(p.id)).length;
    return selectedCount > 0 && selectedCount < modulePermissions.length;
  };

  const getModuleSelectedCount = (moduleName) => {
    const modulePermissions = permissions[moduleName] || [];
    return modulePermissions.filter(p => formData.permissionIds.includes(p.id)).length;
  };

  const isSystemRole = isEdit && currentRole?.isSystemRole;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/admin/roles')}>
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? 'Editar Rol' : 'Nuevo Rol'}
        </Typography>
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {isSystemRole && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Este es un rol del sistema. Solo puede modificar los permisos asignados.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información del Rol
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                fullWidth
                label="Nombre del Rol"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                required
                disabled={isSystemRole}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={isSystemRole}
              />

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Permisos seleccionados: <strong>{formData.permissionIds.length}</strong>
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Permissions */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Permisos
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {Object.entries(permissions).map(([moduleName, modulePermissions]) => (
                <Accordion
                  key={moduleName}
                  expanded={expandedModules.includes(moduleName)}
                  onChange={handleAccordionChange(moduleName)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Checkbox
                        checked={isModuleFullySelected(moduleName)}
                        indeterminate={isModulePartiallySelected(moduleName)}
                        onChange={() => handleModuleToggle(moduleName)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Typography sx={{ flexGrow: 1 }}>
                        {MODULE_NAMES[moduleName] || moduleName}
                      </Typography>
                      <Chip
                        label={`${getModuleSelectedCount(moduleName)}/${modulePermissions.length}`}
                        size="small"
                        color={isModuleFullySelected(moduleName) ? 'primary' : 'default'}
                        sx={{ mr: 2 }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      {modulePermissions.map(permission => (
                        <Grid item xs={12} sm={6} md={4} key={permission.id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.permissionIds.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                                size="small"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2">
                                  {permission.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {permission.code}
                                </Typography>
                              </Box>
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => navigate('/admin/roles')}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {isEdit ? 'Guardar Cambios' : 'Crear Rol'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default RoleForm;
