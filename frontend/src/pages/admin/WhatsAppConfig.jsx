import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  TextField,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  QrCode as QrCodeIcon,
  LinkOff as DisconnectIcon,
  Link as ConnectIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  CheckCircle as ConnectedIcon,
  Cancel as DisconnectedIcon,
  HourglassEmpty as PendingIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import QRCode from 'qrcode';
import {
  fetchWhatsAppStatus,
  connectWhatsApp,
  disconnectWhatsApp,
  sendTestMessage,
  clearSuccess,
  clearError,
} from '../../store/slices/whatsappSlice';

const WhatsAppConfig = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    status,
    qrCode,
    phoneNumber,
    name,
    isConnected,
    loading,
    error,
    success,
  } = useSelector((state) => state.whatsapp);

  const [qrImage, setQrImage] = useState(null);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [polling, setPolling] = useState(false);

  // Load initial status
  useEffect(() => {
    dispatch(fetchWhatsAppStatus());
  }, [dispatch]);

  // Generate QR image when qrCode changes
  useEffect(() => {
    if (qrCode) {
      QRCode.toDataURL(qrCode, { width: 300, margin: 2 })
        .then(setQrImage)
        .catch(console.error);
    } else {
      setQrImage(null);
    }
  }, [qrCode]);

  // Poll for status when waiting for QR scan
  useEffect(() => {
    let interval;
    if (status === 'qr_pending' || status === 'connecting') {
      setPolling(true);
      interval = setInterval(() => {
        dispatch(fetchWhatsAppStatus());
      }, 3000);
    } else {
      setPolling(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, dispatch]);

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

  const handleConnect = useCallback(() => {
    dispatch(connectWhatsApp());
  }, [dispatch]);

  const handleDisconnect = useCallback(() => {
    dispatch(disconnectWhatsApp());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchWhatsAppStatus());
  }, [dispatch]);

  const handleSendTest = useCallback(async () => {
    if (!testPhone || !testMessage) return;
    setSendingTest(true);
    try {
      await dispatch(sendTestMessage({ phoneNumber: testPhone, message: testMessage })).unwrap();
      setTestMessage('');
    } catch (err) {
      // Error handled by slice
    } finally {
      setSendingTest(false);
    }
  }, [dispatch, testPhone, testMessage]);

  const getStatusChip = () => {
    switch (status) {
      case 'connected':
        return (
          <Chip
            icon={<ConnectedIcon />}
            label="Conectado"
            color="success"
            size="medium"
          />
        );
      case 'connecting':
        return (
          <Chip
            icon={<CircularProgress size={16} />}
            label="Conectando..."
            color="warning"
            size="medium"
          />
        );
      case 'qr_pending':
        return (
          <Chip
            icon={<QrCodeIcon />}
            label="Esperando escaneo QR"
            color="info"
            size="medium"
          />
        );
      default:
        return (
          <Chip
            icon={<DisconnectedIcon />}
            label="Desconectado"
            color="error"
            size="medium"
          />
        );
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <WhatsAppIcon sx={{ fontSize: 40, color: '#25D366' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Configuración de WhatsApp
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona la conexión de WhatsApp para notificaciones del sistema
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
        {/* Status Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Estado de Conexión</Typography>
                <Tooltip title="Actualizar estado">
                  <IconButton onClick={handleRefresh} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Estado:
                  </Typography>
                  {getStatusChip()}
                </Box>

                {isConnected && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PhoneIcon color="action" />
                      <Typography variant="body1">
                        <strong>Número:</strong> {phoneNumber || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <WhatsAppIcon color="action" />
                      <Typography variant="body1">
                        <strong>Nombre:</strong> {name || 'N/A'}
                      </Typography>
                    </Box>
                  </>
                )}

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {!isConnected ? (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ConnectIcon />}
                      onClick={handleConnect}
                      disabled={loading || status === 'connecting' || status === 'qr_pending'}
                      fullWidth
                    >
                      {status === 'connecting' || status === 'qr_pending' ? 'Conectando...' : 'Conectar WhatsApp'}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DisconnectIcon />}
                      onClick={handleDisconnect}
                      disabled={loading}
                      fullWidth
                    >
                      Desconectar
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* QR Code Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Código QR
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                {qrImage ? (
                  <>
                    <img
                      src={qrImage}
                      alt="WhatsApp QR Code"
                      style={{ maxWidth: '100%', borderRadius: 8 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      Escanea este código con WhatsApp en tu teléfono
                    </Typography>
                    {polling && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="caption" color="text.secondary">
                          Esperando conexión...
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : isConnected ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <ConnectedIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="body1" color="success.main">
                      WhatsApp conectado exitosamente
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <QrCodeIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Haz clic en "Conectar WhatsApp" para generar el código QR
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Message Card */}
        {isConnected && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Enviar Mensaje de Prueba
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Envía un mensaje de prueba para verificar que la conexión funciona correctamente
                </Typography>

                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Número de teléfono"
                      placeholder="+584121234567"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      fullWidth
                      size="small"
                      helperText="Incluye código de país (ej: +58)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Mensaje"
                      placeholder="Mensaje de prueba desde ERP"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={sendingTest ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                      onClick={handleSendTest}
                      disabled={sendingTest || !testPhone || !testMessage}
                      fullWidth
                    >
                      Enviar
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Info Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'info.lighter' }}>
            <Typography variant="h6" gutterBottom color="info.main">
              Información Importante
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <li>
                <Typography variant="body2">
                  Esta conexión utiliza WhatsApp Web. El teléfono debe permanecer conectado a internet.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  La sesión puede cerrarse si WhatsApp Web se desconecta en el teléfono.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Se recomienda usar un número dedicado para el sistema, no un número personal.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Los usuarios pueden configurar su número de WhatsApp en la sección de configuración personal.
                </Typography>
              </li>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WhatsAppConfig;
