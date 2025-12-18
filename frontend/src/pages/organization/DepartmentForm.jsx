import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Autocomplete,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import organizationService from '../../services/organizationService';

const departmentTypes = ['DIRECTION', 'MANAGEMENT', 'DEPARTMENT', 'AREA', 'UNIT'];

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

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [errors, setErrors] = useState({});

  const isEdit = !!id;

  useEffect(() => {
    loadDepartments();
    loadEmployees();
    if (isEdit) {
      loadDepartment();
    }
  }, [id]);

  const loadDepartment = async () => {
    try {
      setLoading(true);
      const response = await organizationService.getDepartmentById(id);
      const dept = response.data;
      setFormData({
        code: dept.code || '',
        name: dept.name || '',
        description: dept.description || '',
        type: dept.type || 'DEPARTMENT',
        parentId: dept.parentId || '',
        managerId: dept.managerId || '',
        location: dept.location || '',
        costCenter: dept.costCenter || '',
        color: dept.color || '#1976d2',
        status: dept.status || 'ACTIVE',
      });
      if (dept.manager) {
        setSelectedManager(dept.manager);
      }
    } catch (error) {
      toast.error(t('common.error'));
      navigate('/organization/departments');
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

  const loadEmployees = async () => {
    try {
      const response = await organizationService.getDirectory({ limit: 200 });
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleManagerChange = (event, newValue) => {
    setSelectedManager(newValue);
    setFormData((prev) => ({ ...prev, managerId: newValue?.id || '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = t('validation.required');
    if (!formData.name.trim()) newErrors.name = t('validation.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.parentId) dataToSend.parentId = null;
      if (!dataToSend.managerId) dataToSend.managerId = null;

      if (isEdit) {
        await organizationService.updateDepartment(id, dataToSend);
        toast.success(t('organization.departmentUpdated'));
      } else {
        await organizationService.createDepartment(dataToSend);
        toast.success(t('organization.departmentCreated'));
      }
      navigate('/organization/departments');
    } catch (error) {
      toast.error(error.response?.data?.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      DIRECTION: t('organization.typeDirection'),
      MANAGEMENT: t('organization.typeManagement'),
      DEPARTMENT: t('organization.typeDepartment'),
      AREA: t('organization.typeArea'),
      UNIT: t('organization.typeUnit'),
    };
    return labels[type] || type;
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
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/organization/departments')}
        >
          {t('common.back')}
        </Button>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? t('organization.editDepartment') : t('organization.newDepartment')}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                name="code"
                label={t('employees.code')}
                value={formData.code}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.code}
                helperText={errors.code}
                disabled={isEdit}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                name="name"
                label={t('common.name')}
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="type"
                label={t('organization.level')}
                value={formData.type}
                onChange={handleChange}
                select
                fullWidth
              >
                {departmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {getTypeLabel(type)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="parentId"
                label={t('organization.belongsTo')}
                value={formData.parentId}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">{t('organization.topLevel')}</MenuItem>
                {departments
                  .filter((d) => d.id !== id)
                  .map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={selectedManager}
                onChange={handleManagerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('organization.manager')}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="costCenter"
                label={t('organization.costCenter')}
                value={formData.costCenter}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="location"
                label={t('pettyCash.location') || 'Ubicación'}
                value={formData.location}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                name="color"
                label={t('organization.color')}
                type="color"
                value={formData.color}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                name="status"
                label={t('common.status')}
                value={formData.status}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="ACTIVE">{t('common.active')}</MenuItem>
                <MenuItem value="INACTIVE">{t('common.inactive')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label={t('common.description')}
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 3,
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            justifyContent: 'flex-end',
          }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/organization/departments')}
              fullWidth={isMobile}
              disabled={saving}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              fullWidth={isMobile}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {t('common.save')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default DepartmentForm;
