import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  Verified as VerifiedIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import {
  fetchUserWhatsAppConfig,
  requestVerification,
  verifyCode,
  updateNotifications,
  removeUserWhatsApp,
  clearSuccess,
  clearError,
} from '../store/slices/whatsappSlice';

const COUNTRY_CODES = [
  { code: '+58', country: 'Venezuela' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+57', country: 'Colombia' },
  { code: '+52', country: 'México' },
  { code: '+54', country: 'Argentina' },
  { code: '+55', country: 'Brasil' },
  { code: '+56', country: 'Chile' },
  { code: '+51', country: 'Perú' },
  { code: '+593', country: 'Ecuador' },
  { code: '+34', country: 'España' },
];

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    userConfig,
    verificationPending,
    verificationExpires,
    loading,
    error,
    success,
  } = useSelector((state) => state.whatsapp);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+58');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  // Load user WhatsApp config
  useEffect(() => {
    dispatch(fetchUserWhatsAppConfig());
  }, [dispatch]);

  // Update local state when config loads
  useEffect(() => {
    if (userConfig) {
      setPhoneNumber(userConfig.phoneNumber || '');
      setCountryCode(userConfig.countryCode || '+58');
    }
  }, [userConfig]);

  // Show verification input when pending
  useEffect(() => {
    if (verificationPending) {
      setShowVerificationInput(true);
    }
  }, [verificationPending]);

  // Clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRequestVerification = async () => {
    if (!phoneNumber) return;
    try {
      await dispatch(requestVerification({ phoneNumber, countryCode })).unwrap();
      setShowVerificationInput(true);
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCodeInput || verificationCodeInput.length !== 6) return;
    try {
      await dispatch(verifyCode(verificationCodeInput)).unwrap();
      setShowVerificationInput(false);
      setVerificationCodeInput('');
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleToggleNotifications = async (event) => {
    await dispatch(updateNotifications(event.target.checked));
  };

  const handleRemoveWhatsApp = async () => {
    if (window.confirm('¿Estás seguro de eliminar la configuración de WhatsApp?')) {
      await dispatch(removeUserWhatsApp());
      setPhoneNumber('');
      setShowVerificationInput(false);
      setVerificationCodeInput('');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Configuración
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configura tus preferencias personales
          </Typography>
        </Box>
      </Box>

      {/* Alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información de Usuario
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">
                  <strong>Usuario:</strong> {user?.username}
                </Typography>
                <Typography variant="body1">
                  <strong>Nombre:</strong> {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user?.email}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* WhatsApp Configuration Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WhatsAppIcon sx={{ color: '#25D366' }} />
                <Typography variant="h6">
                  Notificaciones WhatsApp
                </Typography>
                {userConfig?.isVerified && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verificado"
                    color="success"
                    size="small"
                  />
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />

              {userConfig?.isVerified ? (
                // Verified state
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" />
                    <Typography variant="body1">
                      {userConfig.countryCode} {userConfig.phoneNumber}
                    </Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={userConfig.notificationsEnabled}
                        onChange={handleToggleNotifications}
                        color="primary"
                      />
                    }
                    label="Recibir notificaciones por WhatsApp"
                  />

                  <Typography variant="caption" color="text.secondary">
                    Verificado el: {new Date(userConfig.verifiedAt).toLocaleDateString()}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveWhatsApp}
                    size="small"
                  >
                    Eliminar configuración
                  </Button>
                </Box>
              ) : showVerificationInput ? (
                // Verification code input
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Alert severity="info">
                    Se ha enviado un código de verificación a tu WhatsApp ({countryCode} {phoneNumber})
                  </Alert>

                  <TextField
                    label="Código de verificación"
                    value={verificationCodeInput}
                    onChange={(e) => setVerificationCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    fullWidth
                    inputProps={{ maxLength: 6 }}
                    helperText="Ingresa el código de 6 dígitos enviado a tu WhatsApp"
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleVerifyCode}
                      disabled={loading || verificationCodeInput.length !== 6}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VerifiedIcon />}
                    >
                      Verificar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setShowVerificationInput(false);
                        setVerificationCodeInput('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>

                  <Button
                    variant="text"
                    size="small"
                    onClick={handleRequestVerification}
                    disabled={loading}
                  >
                    Reenviar código
                  </Button>
                </Box>
              ) : (
                // Phone number input
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Configura tu número de WhatsApp para recibir notificaciones del sistema
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>País</InputLabel>
                        <Select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          label="País"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <MenuItem key={c.code} value={c.code}>
                              {c.code} ({c.country})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        label="Número de teléfono"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="4121234567"
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon />
                            </InputAdornment>
                          ),
                        }}
                        helperText="Sin código de país, solo el número"
                      />
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleRequestVerification}
                    disabled={loading || !phoneNumber}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  >
                    Enviar código de verificación
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Info Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'info.lighter' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <NotificationsIcon color="info" />
              <Typography variant="h6" color="info.main">
                Sobre las notificaciones de WhatsApp
              </Typography>
            </Box>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <li>
                <Typography variant="body2">
                  Recibirás notificaciones sobre aprobaciones pendientes, recordatorios y alertas importantes.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Tu número de teléfono debe tener WhatsApp activo para recibir los mensajes.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Puedes desactivar las notificaciones en cualquier momento sin eliminar tu configuración.
                </Typography>
              </li>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
