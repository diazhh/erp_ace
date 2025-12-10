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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { fetchClientById, createClient, updateClient, clearCurrentClient } from '../../store/slices/crmSlice';

const ClientForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentClient, loading, error } = useSelector((state) => state.crm);

  const [formData, setFormData] = useState({
    clientType: 'COMPANY',
    companyName: '',
    tradeName: '',
    taxId: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    industry: '',
    contactName: '',
    contactPosition: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: 'Venezuela',
    postalCode: '',
    category: '',
    source: '',
    status: 'PROSPECT',
    creditLimit: '',
    paymentTerms: '',
    currency: 'USD',
    notes: '',
  });
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchClientById(id));
    }
    return () => {
      dispatch(clearCurrentClient());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentClient) {
      setFormData({
        clientType: currentClient.clientType || 'COMPANY',
        companyName: currentClient.companyName || '',
        tradeName: currentClient.tradeName || '',
        taxId: currentClient.taxId || '',
        firstName: currentClient.firstName || '',
        lastName: currentClient.lastName || '',
        idNumber: currentClient.idNumber || '',
        industry: currentClient.industry || '',
        contactName: currentClient.contactName || '',
        contactPosition: currentClient.contactPosition || '',
        email: currentClient.email || '',
        phone: currentClient.phone || '',
        mobile: currentClient.mobile || '',
        website: currentClient.website || '',
        address: currentClient.address || '',
        city: currentClient.city || '',
        state: currentClient.state || '',
        country: currentClient.country || 'Venezuela',
        postalCode: currentClient.postalCode || '',
        category: currentClient.category || '',
        source: currentClient.source || '',
        status: currentClient.status || 'PROSPECT',
        creditLimit: currentClient.creditLimit || '',
        paymentTerms: currentClient.paymentTerms || '',
        currency: currentClient.currency || 'USD',
        notes: currentClient.notes || '',
      });
    }
  }, [isEdit, currentClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      if (isEdit) {
        await dispatch(updateClient({ id, data: formData })).unwrap();
      } else {
        await dispatch(createClient(formData)).unwrap();
      }
      navigate('/crm/clients');
    } catch (err) {
      setSubmitError(err.message || 'Error al guardar el cliente');
    }
  };

  if (isEdit && loading && !currentClient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/crm/clients')}>
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
        </Typography>
      </Box>

      {(error || submitError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || submitError}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Tipo de Cliente */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Tipo de Cliente
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="clientType"
                  value={formData.clientType}
                  label="Tipo"
                  onChange={handleChange}
                >
                  <MenuItem value="COMPANY">Empresa</MenuItem>
                  <MenuItem value="INDIVIDUAL">Persona Natural</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Estado"
                  onChange={handleChange}
                >
                  <MenuItem value="PROSPECT">Prospecto</MenuItem>
                  <MenuItem value="ACTIVE">Activo</MenuItem>
                  <MenuItem value="INACTIVE">Inactivo</MenuItem>
                  <MenuItem value="SUSPENDED">Suspendido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Categoría"
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin categoría</MenuItem>
                  <MenuItem value="A">A - Premium</MenuItem>
                  <MenuItem value="B">B - Regular</MenuItem>
                  <MenuItem value="C">C - Ocasional</MenuItem>
                  <MenuItem value="D">D - Nuevo</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Información de Empresa */}
            {formData.clientType === 'COMPANY' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Información de Empresa
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Razón Social"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
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
                    label="RIF / ID Fiscal"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Industria / Sector"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Origen"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="Referido, Web, Evento..."
                  />
                </Grid>
              </>
            )}

            {/* Información de Persona */}
            {formData.clientType === 'INDIVIDUAL' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Información Personal
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Nombre"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Cédula"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            {/* Contacto */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Información de Contacto
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            {formData.clientType === 'COMPANY' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre del Contacto"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cargo del Contacto"
                    name="contactPosition"
                    value={formData.contactPosition}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
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
                label="Móvil"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sitio Web"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Dirección
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Ciudad"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="País"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Código Postal"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </Grid>

            {/* Condiciones Comerciales */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Condiciones Comerciales
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Límite de Crédito"
                name="creditLimit"
                type="number"
                value={formData.creditLimit}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Días de Crédito"
                name="paymentTerms"
                type="number"
                value={formData.paymentTerms}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  label="Moneda"
                  onChange={handleChange}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="VES">VES</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Notas */}
            <Grid item xs={12}>
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

            {/* Botones */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/crm/clients')}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ClientForm;
