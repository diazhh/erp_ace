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
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { 
  createContractor, 
  updateContractor, 
  fetchContractorById, 
  fetchSpecialties 
} from '../../store/slices/contractorSlice';

const statusOptions = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
  { value: 'SUSPENDED', label: 'Suspendido' },
  { value: 'PENDING', label: 'Pendiente' },
];

const initialFormData = {
  companyName: '',
  tradeName: '',
  rif: '',
  address: '',
  city: '',
  state: '',
  country: 'Venezuela',
  phone: '',
  email: '',
  website: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  specialty: '',
  rating: '',
  status: 'ACTIVE',
  notes: '',
};

const ContractorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { currentContractor, specialties, loading } = useSelector((state) => state.contractors);
  
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!id;

  useEffect(() => {
    dispatch(fetchSpecialties());
    if (isEdit) {
      dispatch(fetchContractorById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentContractor) {
      setFormData({
        companyName: currentContractor.companyName || '',
        tradeName: currentContractor.tradeName || '',
        rif: currentContractor.rif || '',
        address: currentContractor.address || '',
        city: currentContractor.city || '',
        state: currentContractor.state || '',
        country: currentContractor.country || 'Venezuela',
        phone: currentContractor.phone || '',
        email: currentContractor.email || '',
        website: currentContractor.website || '',
        contactName: currentContractor.contactName || '',
        contactPhone: currentContractor.contactPhone || '',
        contactEmail: currentContractor.contactEmail || '',
        specialty: currentContractor.specialty || '',
        rating: currentContractor.rating || '',
        status: currentContractor.status || 'ACTIVE',
        notes: currentContractor.notes || '',
      });
    }
  }, [currentContractor, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = 'El nombre de la empresa es requerido';
    if (!formData.rif) newErrors.rif = 'El RIF es requerido';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const dataToSend = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : null,
      };

      if (isEdit) {
        await dispatch(updateContractor({ id, data: dataToSend })).unwrap();
        toast.success('Contratista actualizado');
      } else {
        await dispatch(createContractor(dataToSend)).unwrap();
        toast.success('Contratista creado');
      }
      navigate('/contractors');
    } catch (error) {
      toast.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading && isEdit && !currentContractor) {
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
        <IconButton onClick={() => navigate('/contractors')}>
          <BackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? 'Editar Contratista' : 'Nuevo Contratista'}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          {/* Información de la Empresa */}
          <Typography variant="h6" gutterBottom>
            Información de la Empresa
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de la Empresa"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                error={!!errors.companyName}
                helperText={errors.companyName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre Comercial"
                name="tradeName"
                value={formData.tradeName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="RIF"
                name="rif"
                value={formData.rif}
                onChange={handleChange}
                required
                error={!!errors.rif}
                helperText={errors.rif}
                placeholder="J-12345678-9"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Especialidad"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
              >
                <MenuItem value="">Sin especificar</MenuItem>
                {specialties.map((spec) => (
                  <MenuItem key={spec.code} value={spec.code}>
                    {spec.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Estado"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Dirección */}
          <Typography variant="h6" gutterBottom>
            Dirección
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ciudad"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="País"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Contacto de la Empresa */}
          <Typography variant="h6" gutterBottom>
            Contacto de la Empresa
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sitio Web"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Persona de Contacto */}
          <Typography variant="h6" gutterBottom>
            Persona de Contacto
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nombre del Contacto"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Teléfono del Contacto"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Email del Contacto"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Notas */}
          <Typography variant="h6" gutterBottom>
            Notas Adicionales
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Calificación (1-5)"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleChange}
                inputProps={{ min: 1, max: 5, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Notas"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          {/* Botones */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/contractors')}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={saving}
            >
              {isEdit ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ContractorForm;
