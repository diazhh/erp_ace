import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';

import { createEmployee, updateEmployee } from '../../store/slices/employeeSlice';

const initialFormData = {
  firstName: '',
  lastName: '',
  idType: 'V',
  idNumber: '',
  email: '',
  phone: '',
  mobilePhone: '',
  position: '',
  department: '',
  hireDate: '',
  baseSalary: '',
  salaryCurrency: 'USD',
  status: 'ACTIVE',
  address: '',
  city: '',
  state: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
};

const EmployeeFormDialog = ({ open, onClose, employee }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!employee;

  useEffect(() => {
    if (employee) {
      setFormData({
        ...initialFormData,
        ...employee,
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [employee, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = t('validation.required');
    if (!formData.lastName.trim()) newErrors.lastName = t('validation.required');
    if (!formData.idNumber.trim()) newErrors.idNumber = t('validation.required');
    if (!formData.position.trim()) newErrors.position = t('validation.required');
    if (!formData.hireDate) newErrors.hireDate = t('validation.required');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.email');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await dispatch(updateEmployee({ id: employee.id, data: formData })).unwrap();
        toast.success(t('employees.employeeUpdated'));
      } else {
        await dispatch(createEmployee(formData)).unwrap();
        toast.success(t('employees.employeeCreated'));
      }
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? t('employees.editEmployee') : t('employees.newEmployee')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Datos personales */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              label={t('employees.firstName')}
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              label={t('employees.lastName')}
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="idType"
              label="Tipo ID"
              value={formData.idType}
              onChange={handleChange}
              select
              fullWidth
            >
              <MenuItem value="V">V - Venezolano</MenuItem>
              <MenuItem value="E">E - Extranjero</MenuItem>
              <MenuItem value="P">P - Pasaporte</MenuItem>
              <MenuItem value="J">J - Jurídico</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              name="idNumber"
              label={t('employees.idNumber')}
              value={formData.idNumber}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.idNumber}
              helperText={errors.idNumber}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          {/* Datos laborales */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="position"
              label={t('employees.position')}
              value={formData.position}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.position}
              helperText={errors.position}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="department"
              label={t('employees.department')}
              value={formData.department}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="hireDate"
              label={t('employees.hireDate')}
              type="date"
              value={formData.hireDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.hireDate}
              helperText={errors.hireDate}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="baseSalary"
              label={t('employees.salary')}
              type="number"
              value={formData.baseSalary}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
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
              <MenuItem value="ON_LEAVE">En licencia</MenuItem>
            </TextField>
          </Grid>

          {/* Contacto */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label={t('employees.phone')}
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="mobilePhone"
              label="Celular"
              value={formData.mobilePhone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="address"
              label={t('employees.address')}
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>

          {/* Contacto de emergencia */}
          <Grid item xs={12} sm={5}>
            <TextField
              name="emergencyContactName"
              label={t('employees.emergencyContact')}
              value={formData.emergencyContactName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="emergencyContactPhone"
              label="Teléfono emergencia"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="emergencyContactRelation"
              label="Parentesco"
              value={formData.emergencyContactRelation}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeFormDialog;
