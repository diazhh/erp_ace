import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  AccountTree as TreeIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import organizationService from '../../services/organizationService';
import ConfirmDialog from '../../components/ConfirmDialog';

const departmentTypes = {
  DIRECTION: { label: 'Dirección', color: 'error' },
  MANAGEMENT: { label: 'Gerencia', color: 'warning' },
  DEPARTMENT: { label: 'Departamento', color: 'primary' },
  AREA: { label: 'Área', color: 'info' },
  UNIT: { label: 'Unidad', color: 'default' },
};

const initialFormData = {
  code: '',
  name: '',
  description: '',
  type: 'DEPARTMENT',
  parentId: '',
  managerId: '',
  location: '',
  costCenter: '',
  color: '#1976d2',
  status: 'ACTIVE',
};

const Departments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDepartments();
    loadEmployees();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await organizationService.listDepartments({ includeChildren: 'true' });
      setDepartments(response.data || []);
    } catch (error) {
      toast.error('Error al cargar departamentos');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await organizationService.getDirectory({ limit: 200 });
      setEmployees(response.data?.employees || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleOpenForm = (department = null) => {
    if (department) {
      setFormData({
        ...initialFormData,
        ...department,
        parentId: department.parentId || '',
        managerId: department.managerId || '',
      });
      setEditingId(department.id);
    } else {
      setFormData(initialFormData);
      setEditingId(null);
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Código y nombre son requeridos');
      return;
    }

    setSaving(true);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.parentId) dataToSend.parentId = null;
      if (!dataToSend.managerId) dataToSend.managerId = null;

      if (editingId) {
        await organizationService.updateDepartment(editingId, dataToSend);
        toast.success('Departamento actualizado');
      } else {
        await organizationService.createDepartment(dataToSend);
        toast.success('Departamento creado');
      }
      handleCloseForm();
      loadDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await organizationService.deleteDepartment(departmentToDelete.id);
      toast.success('Departamento eliminado');
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
      loadDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const getTypeChip = (type) => {
    const config = departmentTypes[type] || departmentTypes.DEPARTMENT;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Departamentos
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<TreeIcon />}
            onClick={() => navigate('/organization/chart')}
          >
            Ver Organigrama
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Nuevo Departamento
          </Button>
        </Box>
      </Box>

      {isMobile ? (
        // Vista de cards para móvil
        <Grid container spacing={2}>
          {departments.map((dept) => (
            <Grid item xs={12} key={dept.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{dept.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dept.code}
                      </Typography>
                    </Box>
                    {getTypeChip(dept.type)}
                  </Box>
                  {dept.manager && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Responsable: {dept.manager.firstName} {dept.manager.lastName}
                    </Typography>
                  )}
                  {dept.parent && (
                    <Typography variant="body2" color="text.secondary">
                      Pertenece a: {dept.parent.name}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleOpenForm(dept)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setDepartmentToDelete(dept);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Vista de tabla para desktop
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Pertenece a</TableCell>
                <TableCell>Responsable</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No hay departamentos registrados
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept) => (
                  <TableRow key={dept.id} hover>
                    <TableCell>{dept.code}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: dept.color || '#1976d2',
                          }}
                        />
                        {dept.name}
                      </Box>
                    </TableCell>
                    <TableCell>{getTypeChip(dept.type)}</TableCell>
                    <TableCell>{dept.parent?.name || '-'}</TableCell>
                    <TableCell>
                      {dept.manager
                        ? `${dept.manager.firstName} ${dept.manager.lastName}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={dept.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                        color={dept.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleOpenForm(dept)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setDepartmentToDelete(dept);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de formulario */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Departamento' : 'Nuevo Departamento'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                name="code"
                label="Código"
                value={formData.code}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                name="name"
                label="Nombre"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="type"
                label="Tipo"
                value={formData.type}
                onChange={handleChange}
                select
                fullWidth
              >
                {Object.entries(departmentTypes).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="parentId"
                label="Pertenece a"
                value={formData.parentId}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Ninguno (Nivel superior)</MenuItem>
                {departments
                  .filter((d) => d.id !== editingId)
                  .map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="managerId"
                label="Responsable"
                value={formData.managerId}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="location"
                label="Ubicación"
                value={formData.location}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="costCenter"
                label="Centro de Costo"
                value={formData.costCenter}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="color"
                label="Color"
                type="color"
                value={formData.color}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="status"
                label="Estado"
                value={formData.status}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="ACTIVE">Activo</MenuItem>
                <MenuItem value="INACTIVE">Inactivo</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Departamento"
        message={`¿Está seguro de eliminar el departamento "${departmentToDelete?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default Departments;
