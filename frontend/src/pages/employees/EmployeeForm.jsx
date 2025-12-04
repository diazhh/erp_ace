import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Divider,
  Alert,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  AccountBalance as BankIcon,
  ContactPhone as ContactIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { createEmployee, updateEmployee, fetchEmployeeById, clearCurrentEmployee } from '../../store/slices/employeeSlice';
import organizationService from '../../services/organizationService';

const initialFormData = {
  // Datos personales
  firstName: '',
  lastName: '',
  idType: 'V',
  idNumber: '',
  birthDate: '',
  gender: '',
  maritalStatus: '',
  nationality: 'Venezolana',
  email: '',
  phone: '',
  mobilePhone: '',
  address: '',
  city: '',
  state: '',
  // Contacto de emergencia
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
  // Datos laborales
  position: '',
  department: '',
  departmentId: '',
  positionId: '',
  supervisorId: '',
  hireDate: '',
  employmentType: 'FULL_TIME',
  workSchedule: '',
  baseSalary: '',
  salaryCurrency: 'USD',
  paymentFrequency: 'MONTHLY',
  status: 'ACTIVE',
  // Otros
  extension: '',
  officeLocation: '',
  notes: '',
};

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { currentEmployee, loading: employeeLoading } = useSelector((state) => state.employees);
  
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]);

  const isEdit = !!id;

  useEffect(() => {
    loadDepartments();
    loadPositions();
    loadEmployees();
    
    if (isEdit) {
      dispatch(fetchEmployeeById(id));
    }
    
    return () => {
      dispatch(clearCurrentEmployee());
    };
  }, [id]);

  useEffect(() => {
    if (currentEmployee && isEdit) {
      setFormData({
        ...initialFormData,
        ...currentEmployee,
        birthDate: currentEmployee.birthDate ? currentEmployee.birthDate.split('T')[0] : '',
        hireDate: currentEmployee.hireDate ? currentEmployee.hireDate.split('T')[0] : '',
        baseSalary: currentEmployee.baseSalary || '',
      });
    }
  }, [currentEmployee, isEdit]);

  const loadDepartments = async () => {
    try {
      const response = await organizationService.listDepartments({ status: 'ACTIVE' });
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadPositions = async () => {
    try {
      const response = await organizationService.listPositions({ status: 'ACTIVE' });
      setPositions(response.data || []);
    } catch (error) {
      console.error('Error loading positions:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await organizationService.getDirectory({ limit: 100 });
      setEmployees(response.data?.employees || []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Limpiar campos vacíos
      const dataToSend = { ...formData };
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === '') {
          dataToSend[key] = null;
        }
      });

      if (isEdit) {
        await dispatch(updateEmployee({ id, data: dataToSend })).unwrap();
        toast.success(t('employees.employeeUpdated'));
      } else {
        await dispatch(createEmployee(dataToSend)).unwrap();
        toast.success(t('employees.employeeCreated'));
      }
      navigate('/employees');
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && employeeLoading && !currentEmployee) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const SectionTitle = ({ icon: Icon, title }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 3 }}>
      <Icon color="primary" />
      <Typography variant="h6" color="primary">
        {title}
      </Typography>
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/employees')}
          >
            {t('common.back')}
          </Button>
          <Typography variant="h4" fontWeight="bold">
            {isEdit ? t('employees.editEmployee') : t('employees.newEmployee')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSubmit}
          disabled={loading}
        >
          {t('common.save')}
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          {/* Datos Personales */}
          <SectionTitle icon={PersonIcon} title="Datos Personales" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} sm={4} md={2}>
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
            <Grid item xs={12} sm={8} md={4}>
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
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="birthDate"
                label="Fecha de Nacimiento"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="gender"
                label="Género"
                value={formData.gender}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Sin especificar</MenuItem>
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Femenino</MenuItem>
                <MenuItem value="O">Otro</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="maritalStatus"
                label="Estado Civil"
                value={formData.maritalStatus}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Sin especificar</MenuItem>
                <MenuItem value="S">Soltero/a</MenuItem>
                <MenuItem value="C">Casado/a</MenuItem>
                <MenuItem value="D">Divorciado/a</MenuItem>
                <MenuItem value="V">Viudo/a</MenuItem>
                <MenuItem value="U">Unión libre</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="nationality"
                label="Nacionalidad"
                value={formData.nationality}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Datos de Contacto */}
          <SectionTitle icon={ContactIcon} title="Contacto" />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="phone"
                label={t('employees.phone')}
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="mobilePhone"
                label="Celular"
                value={formData.mobilePhone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="extension"
                label="Extensión"
                value={formData.extension}
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
            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="Ciudad"
                value={formData.city}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="state"
                label="Estado"
                value={formData.state}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Contacto de Emergencia */}
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
            Contacto de Emergencia
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={5}>
              <TextField
                name="emergencyContactName"
                label={t('employees.emergencyContact')}
                value={formData.emergencyContactName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="emergencyContactPhone"
                label="Teléfono emergencia"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="emergencyContactRelation"
                label="Parentesco"
                value={formData.emergencyContactRelation}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Datos Laborales */}
          <SectionTitle icon={WorkIcon} title="Datos Laborales" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
              <TextField
                name="department"
                label={t('employees.department')}
                value={formData.department}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="departmentId"
                label="Departamento (Estructura)"
                value={formData.departmentId || ''}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name} ({dept.type})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="positionId"
                label="Cargo (Estructura)"
                value={formData.positionId || ''}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {positions.map((pos) => (
                  <MenuItem key={pos.id} value={pos.id}>
                    {pos.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="supervisorId"
                label="Supervisor Directo"
                value={formData.supervisorId || ''}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Sin supervisor</MenuItem>
                {employees
                  .filter(emp => emp.id !== id)
                  .map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} - {emp.position}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="employmentType"
                label="Tipo de Contrato"
                value={formData.employmentType}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="FULL_TIME">Tiempo Completo</MenuItem>
                <MenuItem value="PART_TIME">Medio Tiempo</MenuItem>
                <MenuItem value="CONTRACT">Contrato</MenuItem>
                <MenuItem value="TEMPORARY">Temporal</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                <MenuItem value="TERMINATED">Terminado</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="officeLocation"
                label="Ubicación/Oficina"
                value={formData.officeLocation}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="workSchedule"
                label="Horario de Trabajo"
                value={formData.workSchedule}
                onChange={handleChange}
                fullWidth
                placeholder="Ej: Lunes a Viernes 8:00-17:00"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Datos de Nómina */}
          <SectionTitle icon={BankIcon} title="Datos de Nómina" />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="baseSalary"
                label={t('employees.salary')}
                type="number"
                value={formData.baseSalary}
                onChange={handleChange}
                fullWidth
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="salaryCurrency"
                label="Moneda"
                value={formData.salaryCurrency}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="USD">USD - Dólar</MenuItem>
                <MenuItem value="VES">VES - Bolívar</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="paymentFrequency"
                label="Frecuencia de Pago"
                value={formData.paymentFrequency}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="WEEKLY">Semanal</MenuItem>
                <MenuItem value="BIWEEKLY">Quincenal</MenuItem>
                <MenuItem value="MONTHLY">Mensual</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Notas */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label={t('common.notes')}
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          {/* Botones de acción (mobile) */}
          {isMobile && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/employees')}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : t('common.save')}
              </Button>
            </Box>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default EmployeeForm;
