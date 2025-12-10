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
  Email as EmailIcon,
} from '@mui/icons-material';
import {
  fetchUserWhatsAppConfig,
  requestVerification,
  verifyCode,
  updateNotifications,
  removeUserWhatsApp,
  clearSuccess as clearWhatsAppSuccess,
  clearError as clearWhatsAppError,
} from '../store/slices/whatsappSlice';
import {
  fetchUserEmailConfig,
  setUserEmail,
  verifyUserEmail,
  resendVerificationCode,
  updateEmailNotifications,
  removeUserEmail,
  clearSuccess as clearEmailSuccess,
  clearError as clearEmailError,
} from '../store/slices/emailSlice';

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
    userConfig: whatsappConfig,
    verificationPending: waVerificationPending,
    loading: waLoading,
    error: waError,
    success: waSuccess,
  } = useSelector((state) => state.whatsapp);
  
  const {
    userConfig: emailConfig,
    verificationPending: emailVerificationPending,
    loading: emailLoading,
    error: emailError,
    success: emailSuccess,
  } = useSelector((state) => state.email);

  // WhatsApp state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+58');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  
  // Email state
  const [emailInput, setEmailInput] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  // Load user configs
  useEffect(() => {
    dispatch(fetchUserWhatsAppConfig());
    dispatch(fetchUserEmailConfig());
  }, [dispatch]);

  // Update local state when WhatsApp config loads
  useEffect(() => {
    if (whatsappConfig) {
      setPhoneNumber(whatsappConfig.phoneNumber || '');
      setCountryCode(whatsappConfig.countryCode || '+58');
    }
  }, [whatsappConfig]);

  // Update local state when Email config loads
  useEffect(() => {
    if (emailConfig?.email) {
      setEmailInput(emailConfig.email || '');
    }
  }, [emailConfig]);

  // Show verification input when pending
  useEffect(() => {
    if (waVerificationPending) {
      setShowVerificationInput(true);
    }
  }, [waVerificationPending]);

  useEffect(() => {
    if (emailVerificationPending) {
      setShowEmailVerification(true);
    }
  }, [emailVerificationPending]);

  // Clear WhatsApp messages
  useEffect(() => {
    if (waSuccess) {
      const timer = setTimeout(() => dispatch(clearWhatsAppSuccess()), 5000);
      return () => clearTimeout(timer);
    }
  }, [waSuccess, dispatch]);

  useEffect(() => {
    if (waError) {
      const timer = setTimeout(() => dispatch(clearWhatsAppError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [waError, dispatch]);

  // Clear Email messages
  useEffect(() => {
    if (emailSuccess) {
      const timer = setTimeout(() => dispatch(clearEmailSuccess()), 5000);
      return () => clearTimeout(timer);
    }
  }, [emailSuccess, dispatch]);

  useEffect(() => {
    if (emailError) {
      const timer = setTimeout(() => dispatch(clearEmailError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [emailError, dispatch]);

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

  // Email handlers
  const handleSetEmail = async () => {
    if (!emailInput) return;
    try {
      await dispatch(setUserEmail(emailInput)).unwrap();
      setShowEmailVerification(true);
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailVerificationCode || emailVerificationCode.length !== 6) return;
    try {
      await dispatch(verifyUserEmail(emailVerificationCode)).unwrap();
      setShowEmailVerification(false);
      setEmailVerificationCode('');
      dispatch(fetchUserEmailConfig());
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleResendEmailCode = async () => {
    await dispatch(resendVerificationCode());
  };

  const handleToggleEmailNotifications = async (event) => {
    await dispatch(updateEmailNotifications(event.target.checked));
  };

  const handleRemoveEmail = async () => {
    if (window.confirm('¿Estás seguro de eliminar la configuración de Email?')) {
      await dispatch(removeUserEmail());
      setEmailInput('');
      setShowEmailVerification(false);
      setEmailVerificationCode('');
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
      {(waSuccess || emailSuccess) && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {waSuccess || emailSuccess}
        </Alert>
      )}
      {(waError || emailError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {waError || emailError}
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
                {whatsappConfig?.isVerified && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verificado"
                    color="success"
                    size="small"
                  />
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />

              {whatsappConfig?.isVerified ? (
                // Verified state
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" />
                    <Typography variant="body1">
                      {whatsappConfig.countryCode} {whatsappConfig.phoneNumber}
                    </Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={whatsappConfig.notificationsEnabled}
                        onChange={handleToggleNotifications}
                        color="primary"
                      />
                    }
                    label="Recibir notificaciones por WhatsApp"
                  />

                  <Typography variant="caption" color="text.secondary">
                    Verificado el: {new Date(whatsappConfig.verifiedAt).toLocaleDateString()}
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
                      disabled={waLoading || verificationCodeInput.length !== 6}
                      startIcon={waLoading ? <CircularProgress size={20} color="inherit" /> : <VerifiedIcon />}
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
                    disabled={waLoading}
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
                    disabled={waLoading || !phoneNumber}
                    startIcon={waLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  >
                    Enviar código de verificación
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Email Configuration Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmailIcon sx={{ color: '#1976d2' }} />
                <Typography variant="h6">
                  Notificaciones por Email
                </Typography>
                {emailConfig?.isVerified && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verificado"
                    color="success"
                    size="small"
                  />
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />

              {emailConfig?.isVerified ? (
                // Verified state
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="action" />
                    <Typography variant="body1">
                      {emailConfig.email}
                    </Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailConfig.notificationsEnabled}
                        onChange={handleToggleEmailNotifications}
                        color="primary"
                      />
                    }
                    label="Recibir notificaciones por Email"
                  />

                  <Typography variant="caption" color="text.secondary">
                    Verificado el: {new Date(emailConfig.verifiedAt).toLocaleDateString()}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveEmail}
                    size="small"
                  >
                    Eliminar configuración
                  </Button>
                </Box>
              ) : showEmailVerification ? (
                // Verification code input
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Alert severity="info">
                    Se ha enviado un código de verificación a tu correo ({emailInput})
                  </Alert>

                  <TextField
                    label="Código de verificación"
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    fullWidth
                    inputProps={{ maxLength: 6 }}
                    helperText="Ingresa el código de 6 dígitos enviado a tu correo"
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleVerifyEmail}
                      disabled={emailLoading || emailVerificationCode.length !== 6}
                      startIcon={emailLoading ? <CircularProgress size={20} color="inherit" /> : <VerifiedIcon />}
                    >
                      Verificar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setShowEmailVerification(false);
                        setEmailVerificationCode('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>

                  <Button
                    variant="text"
                    size="small"
                    onClick={handleResendEmailCode}
                    disabled={emailLoading}
                  >
                    Reenviar código
                  </Button>
                </Box>
              ) : (
                // Email input
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Configura tu correo electrónico para recibir notificaciones del sistema
                  </Typography>

                  <TextField
                    label="Correo electrónico"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="tu@email.com"
                    fullWidth
                    size="small"
                    type="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSetEmail}
                    disabled={emailLoading || !emailInput}
                    startIcon={emailLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
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
                Sobre las notificaciones
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
                  Puedes configurar tanto WhatsApp como Email para recibir notificaciones.
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
