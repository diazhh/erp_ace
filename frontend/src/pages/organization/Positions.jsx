import { useState, useEffect } from 'react';
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
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import organizationService from '../../services/organizationService';
import ConfirmDialog from '../../components/ConfirmDialog';

const levelLabels = {
  0: 'Ejecutivo',
  1: 'Director',
  2: 'Gerente',
  3: 'Coordinador',
  4: 'Analista',
  5: 'Asistente',
  6: 'Operativo',
};

const initialFormData = {
  code: '',
  name: '',
  description: '',
  departmentId: '',
  level: 4,
  minSalary: '',
  maxSalary: '',
  salaryCurrency: 'USD',
  requirements: '',
  responsibilities: '',
  isSupervisory: false,
  maxHeadcount: 1,
  status: 'ACTIVE',
};

const Positions = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPositions();
    loadDepartments();
  }, []);

  const loadPositions = async () => {
    try {
      setLoading(true);
      const response = await organizationService.listPositions();
      setPositions(response.data || []);
    } catch (error) {
      toast.error('Error al cargar posiciones');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await organizationService.listDepartments({ status: 'ACTIVE' });
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const handleOpenForm = (position = null) => {
    if (position) {
      setFormData({
        ...initialFormData,
        ...position,
        departmentId: position.departmentId || '',
        minSalary: position.minSalary || '',
        maxSalary: position.maxSalary || '',
      });
      setEditingId(position.id);
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Código y nombre son requeridos');
      return;
    }

    setSaving(true);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.departmentId) dataToSend.departmentId = null;
      if (!dataToSend.minSalary) dataToSend.minSalary = null;
      if (!dataToSend.maxSalary) dataToSend.maxSalary = null;

      if (editingId) {
        await organizationService.updatePosition(editingId, dataToSend);
        toast.success('Posición actualizada');
      } else {
        await organizationService.createPosition(dataToSend);
        toast.success('Posición creada');
      }
      handleCloseForm();
      loadPositions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await organizationService.deletePosition(positionToDelete.id);
      toast.success('Posición eliminada');
      setDeleteDialogOpen(false);
      setPositionToDelete(null);
      loadPositions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const getLevelChip = (level) => {
    const colors = ['error', 'warning', 'info', 'primary', 'default', 'default', 'default'];
    return (
      <Chip
        label={levelLabels[level] || `Nivel ${level}`}
        color={colors[level] || 'default'}
        size="small"
      />
    );
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
          Cargos / Posiciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Nueva Posición
        </Button>
      </Box>

      {isMobile ? (
        <Grid container spacing={2}>
          {positions.map((pos) => (
            <Grid item xs={12} key={pos.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{pos.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {pos.code}
                      </Typography>
                    </Box>
                    {getLevelChip(pos.level)}
                  </Box>
                  {pos.department && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Departamento: {pos.department.name}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Empleados: {pos.employeeCount || 0} / {pos.maxHeadcount}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleOpenForm(pos)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setPositionToDelete(pos);
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Nivel</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Empleados</TableCell>
                <TableCell>Rango Salarial</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No hay posiciones registradas
                  </TableCell>
                </TableRow>
              ) : (
                positions.map((pos) => (
                  <TableRow key={pos.id} hover>
                    <TableCell>{pos.code}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{pos.name}</Typography>
                        {pos.isSupervisory && (
                          <Chip label="Supervisión" size="small" color="secondary" sx={{ mt: 0.5 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{getLevelChip(pos.level)}</TableCell>
                    <TableCell>{pos.department?.name || '-'}</TableCell>
                    <TableCell>
                      {pos.employeeCount || 0} / {pos.maxHeadcount}
                    </TableCell>
                    <TableCell>
                      {pos.minSalary || pos.maxSalary
                        ? `${pos.minSalary || '?'} - ${pos.maxSalary || '?'} ${pos.salaryCurrency}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pos.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                        color={pos.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleOpenForm(pos)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setPositionToDelete(pos);
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
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Posición' : 'Nueva Posición'}
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
                name="departmentId"
                label="Departamento"
                value={formData.departmentId}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="level"
                label="Nivel Jerárquico"
                value={formData.level}
                onChange={handleChange}
                select
                fullWidth
              >
                {Object.entries(levelLabels).map(([key, label]) => (
                  <MenuItem key={key} value={parseInt(key)}>
                    {key} - {label}
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
            <Grid item xs={12} sm={4}>
              <TextField
                name="minSalary"
                label="Salario Mínimo"
                type="number"
                value={formData.minSalary}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="maxSalary"
                label="Salario Máximo"
                type="number"
                value={formData.maxSalary}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="salaryCurrency"
                label="Moneda"
                value={formData.salaryCurrency}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="VES">VES</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="maxHeadcount"
                label="Cantidad Máxima"
                type="number"
                value={formData.maxHeadcount}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 1 }}
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
            <Grid item xs={12}>
              <TextField
                name="requirements"
                label="Requisitos"
                value={formData.requirements}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Educación, experiencia, certificaciones..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="responsibilities"
                label="Responsabilidades"
                value={formData.responsibilities}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Principales funciones del cargo..."
              />
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
        title="Eliminar Posición"
        message={`¿Está seguro de eliminar la posición "${positionToDelete?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default Positions;
