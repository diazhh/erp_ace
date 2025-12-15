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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
  Phone as PhoneIcon,
  Description as TemplateIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';
import QRCode from 'qrcode';
import {
  fetchWhatsAppStatus,
  connectWhatsApp,
  disconnectWhatsApp,
  sendTestMessage,
  fetchWhatsAppTemplates,
  createWhatsAppTemplate,
  updateWhatsAppTemplate,
  deleteWhatsAppTemplate,
  fetchWhatsAppLogs,
  fetchWhatsAppLogStats,
  clearSuccess,
  clearError,
} from '../../store/slices/whatsappSlice';

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const CATEGORIES = [
  { value: 'NOTIFICATION', label: 'Notificación' },
  { value: 'REMINDER', label: 'Recordatorio' },
  { value: 'VERIFICATION', label: 'Verificación' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'TRANSACTIONAL', label: 'Transaccional' },
  { value: 'OTHER', label: 'Otro' },
];

const WhatsAppConfig = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    status,
    qrCode,
    phoneNumber,
    name,
    isConnected,
    templates,
    logs,
    logsPagination,
    logStats,
    loading,
    error,
    success,
  } = useSelector((state) => state.whatsapp);

  const [tabValue, setTabValue] = useState(0);
  const [qrImage, setQrImage] = useState(null);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [polling, setPolling] = useState(false);
  const [logsPage, setLogsPage] = useState(0);
  const [logsRowsPerPage, setLogsRowsPerPage] = useState(10);

  // Template dialog state
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    code: '',
    name: '',
    message: '',
    category: 'NOTIFICATION',
    variables: [],
    isActive: true,
  });
  const [newVariable, setNewVariable] = useState({ name: '', description: '' });

  // Preview dialog state
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewVariables, setPreviewVariables] = useState({});
  const [previewResult, setPreviewResult] = useState('');

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  // Load initial data
  useEffect(() => {
    dispatch(fetchWhatsAppStatus());
    dispatch(fetchWhatsAppTemplates());
    dispatch(fetchWhatsAppLogStats());
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

  // Load logs when tab changes
  useEffect(() => {
    if (tabValue === 2) {
      dispatch(fetchWhatsAppLogs({ page: logsPage + 1, limit: logsRowsPerPage }));
    }
  }, [tabValue, logsPage, logsRowsPerPage, dispatch]);

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

  // Template handlers
  const handleOpenTemplateDialog = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({
        code: template.code,
        name: template.name,
        message: template.message,
        category: template.category,
        variables: template.variables || [],
        isActive: template.isActive,
      });
    } else {
      setEditingTemplate(null);
      setTemplateForm({
        code: '',
        name: '',
        message: '',
        category: 'NOTIFICATION',
        variables: [],
        isActive: true,
      });
    }
    setTemplateDialogOpen(true);
  };

  const handleCloseTemplateDialog = () => {
    setTemplateDialogOpen(false);
    setEditingTemplate(null);
  };

  const handleSaveTemplate = async () => {
    if (editingTemplate) {
      await dispatch(updateWhatsAppTemplate({
        id: editingTemplate.id,
        data: {
          name: templateForm.name,
          message: templateForm.message,
          category: templateForm.category,
          variables: templateForm.variables,
          isActive: templateForm.isActive,
        },
      }));
    } else {
      await dispatch(createWhatsAppTemplate(templateForm));
    }
    handleCloseTemplateDialog();
    dispatch(fetchWhatsAppTemplates());
  };

  const handleAddVariable = () => {
    if (newVariable.name) {
      setTemplateForm(prev => ({
        ...prev,
        variables: [...prev.variables, { ...newVariable }],
      }));
      setNewVariable({ name: '', description: '' });
    }
  };

  const handleRemoveVariable = (index) => {
    setTemplateForm(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteTemplate = async () => {
    if (templateToDelete) {
      await dispatch(deleteWhatsAppTemplate(templateToDelete.id));
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  // Preview handlers
  const handleOpenPreview = (template) => {
    setPreviewTemplate(template);
    const vars = {};
    (template.variables || []).forEach(v => {
      vars[v.name] = '';
    });
    setPreviewVariables(vars);
    setPreviewResult(template.message);
    setPreviewDialogOpen(true);
  };

  const handlePreviewChange = (varName, value) => {
    const newVars = { ...previewVariables, [varName]: value };
    setPreviewVariables(newVars);
    
    // Replace variables in message
    let result = previewTemplate.message;
    Object.keys(newVars).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, newVars[key] || `{{${key}}}`);
    });
    setPreviewResult(result);
  };

  const handleLogsPageChange = (event, newPage) => {
    setLogsPage(newPage);
  };

  const handleLogsRowsPerPageChange = (event) => {
    setLogsRowsPerPage(parseInt(event.target.value, 10));
    setLogsPage(0);
  };

  const getStatusChip = () => {
    switch (status) {
      case 'connected':
        return <Chip icon={<ConnectedIcon />} label="Conectado" color="success" size="medium" />;
      case 'connecting':
        return <Chip icon={<CircularProgress size={16} />} label="Conectando..." color="warning" size="medium" />;
      case 'qr_pending':
        return <Chip icon={<QrCodeIcon />} label="Esperando escaneo QR" color="info" size="medium" />;
      default:
        return <Chip icon={<DisconnectedIcon />} label="Desconectado" color="error" size="medium" />;
    }
  };

  const getLogStatusChip = (logStatus) => {
    switch (logStatus) {
      case 'SENT':
        return <Chip label="Enviado" color="success" size="small" />;
      case 'DELIVERED':
        return <Chip label="Entregado" color="info" size="small" />;
      case 'READ':
        return <Chip label="Leído" color="primary" size="small" />;
      case 'FAILED':
        return <Chip label="Fallido" color="error" size="small" />;
      default:
        return <Chip label="Pendiente" color="warning" size="small" />;
    }
  };

  const getCategoryChip = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return <Chip label={cat?.label || category} size="small" variant="outlined" />;
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
            Gestiona la conexión, plantillas y mensajes de WhatsApp
          </Typography>
        </Box>
      </Box>

      {/* Alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearSuccess())}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {logStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {logStats.byStatus?.map((stat) => (
            <Grid item xs={6} sm={3} key={stat.status}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" color={
                    stat.status === 'SENT' ? 'success.main' :
                    stat.status === 'FAILED' ? 'error.main' :
                    stat.status === 'DELIVERED' ? 'info.main' : 'warning.main'
                  }>
                    {stat.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.status === 'SENT' ? 'Enviados' :
                     stat.status === 'FAILED' ? 'Fallidos' :
                     stat.status === 'DELIVERED' ? 'Entregados' :
                     stat.status === 'READ' ? 'Leídos' : 'Pendientes'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab icon={<SettingsIcon />} label="Conexión" iconPosition="start" />
          <Tab icon={<TemplateIcon />} label="Plantillas" iconPosition="start" />
          <Tab icon={<HistoryIcon />} label="Historial" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab: Connection */}
      <TabPanel value={tabValue} index={0}>
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
                    <Typography variant="body1" color="text.secondary">Estado:</Typography>
                    {getStatusChip()}
                  </Box>

                  {isConnected && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PhoneIcon color="action" />
                        <Typography variant="body1"><strong>Número:</strong> {phoneNumber || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <WhatsAppIcon color="action" />
                        <Typography variant="body1"><strong>Nombre:</strong> {name || 'N/A'}</Typography>
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
                <Typography variant="h6" gutterBottom>Código QR</Typography>
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
                      <img src={qrImage} alt="WhatsApp QR Code" style={{ maxWidth: '100%', borderRadius: 8 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                        Escanea este código con WhatsApp en tu teléfono
                      </Typography>
                      {polling && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <CircularProgress size={16} />
                          <Typography variant="caption" color="text.secondary">Esperando conexión...</Typography>
                        </Box>
                      )}
                    </>
                  ) : isConnected ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <ConnectedIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                      <Typography variant="body1" color="success.main">WhatsApp conectado exitosamente</Typography>
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
                  <Typography variant="h6" gutterBottom>Enviar Mensaje de Prueba</Typography>
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
        </Grid>
      </TabPanel>

      {/* Tab: Templates */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              <TemplateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Plantillas de WhatsApp
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenTemplateDialog()}
            >
              Nueva Plantilla
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Variables</TableCell>
                  <TableCell>Sistema</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <Chip label={template.code} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{getCategoryChip(template.category)}</TableCell>
                    <TableCell>
                      {(template.variables || []).length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {template.variables.slice(0, 3).map((v, i) => (
                            <Chip key={i} label={`{{${v.name}}}`} size="small" variant="outlined" />
                          ))}
                          {template.variables.length > 3 && (
                            <Chip label={`+${template.variables.length - 3}`} size="small" />
                          )}
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {template.isSystem ? (
                        <Chip label="Sistema" size="small" color="primary" />
                      ) : (
                        <Chip label="Personalizada" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {template.isActive ? (
                        <Chip label="Activa" size="small" color="success" />
                      ) : (
                        <Chip label="Inactiva" size="small" color="default" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Previsualizar">
                        <IconButton onClick={() => handleOpenPreview(template)} size="small">
                          <PreviewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleOpenTemplateDialog(template)} size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {!template.isSystem && (
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => {
                              setTemplateToDelete(template);
                              setDeleteDialogOpen(true);
                            }}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {templates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No hay plantillas</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* Tab: Logs */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Historial de Mensajes
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => dispatch(fetchWhatsAppLogs({ page: logsPage + 1, limit: logsRowsPerPage }))}
            >
              Actualizar
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Destinatario</TableCell>
                  <TableCell>Mensaje</TableCell>
                  <TableCell>Plantilla</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{log.toPhone}</Typography>
                        {log.toName && (
                          <Typography variant="caption" color="text.secondary">{log.toName}</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {log.templateCode && <Chip label={log.templateCode} size="small" />}
                    </TableCell>
                    <TableCell>{getLogStatusChip(log.status)}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No hay registros</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={logsPagination.total}
            page={logsPage}
            onPageChange={handleLogsPageChange}
            rowsPerPage={logsRowsPerPage}
            onRowsPerPageChange={handleLogsRowsPerPageChange}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Filas por página"
          />
        </Paper>
      </TabPanel>

      {/* Template Edit/Create Dialog */}
      <Dialog open={templateDialogOpen} onClose={handleCloseTemplateDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTemplate ? `Editar Plantilla: ${editingTemplate.name}` : 'Nueva Plantilla'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código"
                value={templateForm.code}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                disabled={!!editingTemplate}
                placeholder="WELCOME_MESSAGE"
                helperText="Identificador único (sin espacios)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={templateForm.name}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mensaje de Bienvenida"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={templateForm.category}
                  label="Categoría"
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={templateForm.isActive}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Plantilla Activa"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensaje"
                value={templateForm.message}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, message: e.target.value }))}
                multiline
                rows={6}
                placeholder="Hola {{name}}, bienvenido a {{appName}}..."
                helperText="Usa {{variable}} para insertar variables dinámicas"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Variables</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {templateForm.variables.map((v, i) => (
                  <Chip
                    key={i}
                    label={`{{${v.name}}}`}
                    onDelete={() => handleRemoveVariable(i)}
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Nombre"
                  value={newVariable.name}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="userName"
                />
                <TextField
                  size="small"
                  label="Descripción"
                  value={newVariable.description}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Nombre del usuario"
                  sx={{ flexGrow: 1 }}
                />
                <Button variant="outlined" onClick={handleAddVariable} disabled={!newVariable.name}>
                  Agregar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTemplateDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveTemplate}
            disabled={loading || !templateForm.code || !templateForm.name || !templateForm.message}
          >
            {loading ? <CircularProgress size={20} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Previsualizar: {previewTemplate?.name}</DialogTitle>
        <DialogContent>
          {previewTemplate?.variables?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Variables</Typography>
              <Grid container spacing={2}>
                {previewTemplate.variables.map((v, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <TextField
                      fullWidth
                      size="small"
                      label={v.name}
                      helperText={v.description}
                      value={previewVariables[v.name] || ''}
                      onChange={(e) => handlePreviewChange(v.name, e.target.value)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          <Typography variant="subtitle2" gutterBottom>Vista Previa</Typography>
          <Paper
            sx={{
              p: 2,
              bgcolor: '#DCF8C6',
              borderRadius: 2,
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
            }}
          >
            {previewResult}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la plantilla "{templateToDelete?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeleteTemplate}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhatsAppConfig;
