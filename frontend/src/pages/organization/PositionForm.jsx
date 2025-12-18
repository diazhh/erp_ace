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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import organizationService from '../../services/organizationService';

const getLevelLabels = (t) => ({
  0: t('organization.levelExecutive'),
  1: t('organization.levelDirector'),
  2: t('organization.levelManager'),
  3: t('organization.levelCoordinator'),
  4: t('organization.levelAnalyst'),
  5: t('organization.levelAssistant'),
  6: t('organization.levelOperative'),
});

const initialFormData = {
  code: '',
  name: '',
  description: '',
  departmentId: '',
  level: 4,
  minSalary: '',
  maxSalary: '',
  salaryCurrency: 'USD',
  maxHeadcount: 1,
  requirements: '',
  responsibilities: '',
  isSupervisory: false,
  status: 'ACTIVE',
};

const PositionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});

  const isEdit = !!id;

  useEffect(() => {
    loadDepartments();
    if (isEdit) {
      loadPosition();
    }
  }, [id]);

  const loadPosition = async () => {
    try {
      setLoading(true);
      const response = await organizationService.getPositionById(id);
      const pos = response.data;
      setFormData({
        code: pos.code || '',
        name: pos.name || '',
        description: pos.description || '',
        departmentId: pos.departmentId || '',
        level: pos.level ?? 4,
        minSalary: pos.minSalary || '',
        maxSalary: pos.maxSalary || '',
        salaryCurrency: pos.salaryCurrency || 'USD',
        maxHeadcount: pos.maxHeadcount || 1,
        requirements: pos.requirements || '',
        responsibilities: pos.responsibilities || '',
        isSupervisory: pos.isSupervisory || false,
        status: pos.status || 'ACTIVE',
      });
    } catch (error) {
      toast.error(t('common.error'));
      navigate('/organization/positions');
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
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
      if (!dataToSend.departmentId) dataToSend.departmentId = null;
      if (!dataToSend.minSalary) dataToSend.minSalary = null;
      if (!dataToSend.maxSalary) dataToSend.maxSalary = null;

      if (isEdit) {
        await organizationService.updatePosition(id, dataToSend);
        toast.success(t('organization.positionUpdated'));
      } else {
        await organizationService.createPosition(dataToSend);
        toast.success(t('organization.positionCreated'));
      }
      navigate('/organization/positions');
    } catch (error) {
      toast.error(error.response?.data?.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const levelLabels = getLevelLabels(t);

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
          onClick={() => navigate('/organization/positions')}
        >
          {t('common.back')}
        </Button>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? t('organization.editPosition') : t('organization.newPosition')}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={8}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                name="departmentId"
                label={t('employees.department')}
                value={formData.departmentId}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">{t('organization.notAssigned')}</MenuItem>
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
                label={t('organization.level')}
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
                label={t('common.description')}
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
                label={t('organization.minSalary')}
                type="number"
                value={formData.minSalary}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="maxSalary"
                label={t('organization.maxSalary')}
                type="number"
                value={formData.maxSalary}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="salaryCurrency"
                label={t('finance.currency')}
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
                label={t('organization.maxHeadcount')}
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
                name="requirements"
                label={t('organization.requirements')}
                value={formData.requirements}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder={t('organization.requirementsPlaceholder')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="responsibilities"
                label={t('organization.responsibilities')}
                value={formData.responsibilities}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder={t('organization.responsibilitiesPlaceholder')}
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
              onClick={() => navigate('/organization/positions')}
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

export default PositionForm;
