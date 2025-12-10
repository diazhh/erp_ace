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
  Switch,
  FormControlLabel,
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
} from '@mui/material';
import {
  Email as EmailIcon,
  Settings as SettingsIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  CheckCircle as SuccessIcon,
  Cancel as ErrorIcon,
  Description as TemplateIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import EmailTemplateEditor from '../../components/email/EmailTemplateEditor';
import {
  fetchEmailConfig,
  saveEmailConfig,
  testEmailConnection,
  sendTestEmail,
  fetchEmailTemplates,
  fetchEmailLogs,
  fetchEmailStats,
  updateEmailTemplate,
  clearSuccess,
  clearError,
} from '../../store/slices/emailSlice';

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const EmailConfig = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    config,
    configured,
    templates,
    logs,
    logsPagination,
    stats,
    loading,
    error,
    success,
  } = useSelector((state) => state.email);

  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'ERP System',
  });
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [logsPage, setLogsPage] = useState(0);
  const [logsRowsPerPage, setLogsRowsPerPage] = useState(10);
  
  // Template edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    bodyHtml: '',
    isActive: true,
  });

  // Load initial data
  useEffect(() => {
    dispatch(fetchEmailConfig());
    dispatch(fetchEmailTemplates());
    dispatch(fetchEmailStats());
  }, [dispatch]);

  // Load config into form
  useEffect(() => {
    if (config) {
      setFormData({
        smtpHost: config.smtpHost || '',
        smtpPort: config.smtpPort || 587,
        smtpSecure: config.smtpSecure || false,
        smtpUser: config.smtpUser || '',
        smtpPassword: config.smtpPassword || '',
        fromEmail: config.fromEmail || '',
        fromName: config.fromName || 'ERP System',
      });
    }
  }, [config]);

  // Load logs when tab changes
  useEffect(() => {
    if (tabValue === 2) {
      dispatch(fetchEmailLogs({ page: logsPage + 1, limit: logsRowsPerPage }));
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

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveConfig = useCallback(async () => {
    await dispatch(saveEmailConfig(formData));
    dispatch(fetchEmailConfig());
  }, [dispatch, formData]);

  const handleTestConnection = useCallback(async () => {
    setTestingConnection(true);
    try {
      await dispatch(testEmailConnection()).unwrap();
    } catch (err) {
      // Error handled by slice
    } finally {
      setTestingConnection(false);
    }
  }, [dispatch]);

  const handleSendTestEmail = useCallback(async () => {
    if (!testEmail) return;
    setSendingTest(true);
    try {
      await dispatch(sendTestEmail(testEmail)).unwrap();
      setTestEmail('');
    } catch (err) {
      // Error handled by slice
    } finally {
      setSendingTest(false);
    }
  }, [dispatch, testEmail]);

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      bodyHtml: template.bodyHtml,
      isActive: template.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleSaveTemplate = async () => {
    await dispatch(updateEmailTemplate({
      id: editingTemplate.id,
      data: templateForm,
    }));
    setEditDialogOpen(false);
    dispatch(fetchEmailTemplates());
  };

  const handleLogsPageChange = (event, newPage) => {
    setLogsPage(newPage);
  };

  const handleLogsRowsPerPageChange = (event) => {
    setLogsRowsPerPage(parseInt(event.target.value, 10));
    setLogsPage(0);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'SENT':
        return <Chip icon={<SuccessIcon />} label="Enviado" color="success" size="small" />;
      case 'FAILED':
        return <Chip icon={<ErrorIcon />} label="Fallido" color="error" size="small" />;
      default:
        return <Chip label="Pendiente" color="warning" size="small" />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1">
            {t('email.config.title', 'Configuración de Email')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('email.config.subtitle', 'Configura el servidor SMTP y plantillas de correo')}
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
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main">{stats.totalSent}</Typography>
                <Typography variant="body2" color="text.secondary">Enviados</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="error.main">{stats.totalFailed}</Typography>
                <Typography variant="body2" color="text.secondary">Fallidos</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="info.main">{stats.sentToday}</Typography>
                <Typography variant="body2" color="text.secondary">Hoy</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary.main">{stats.successRate}%</Typography>
                <Typography variant="body2" color="text.secondary">Éxito</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab icon={<SettingsIcon />} label="Configuración" iconPosition="start" />
          <Tab icon={<TemplateIcon />} label="Plantillas" iconPosition="start" />
          <Tab icon={<HistoryIcon />} label="Historial" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab: Configuration */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* SMTP Config */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Configuración SMTP
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Servidor SMTP"
                    name="smtpHost"
                    value={formData.smtpHost}
                    onChange={handleFormChange}
                    placeholder="smtp.gmail.com"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Puerto"
                    name="smtpPort"
                    type="number"
                    value={formData.smtpPort}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Usuario SMTP"
                    name="smtpUser"
                    value={formData.smtpUser}
                    onChange={handleFormChange}
                    placeholder="tu@email.com"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contraseña SMTP"
                    name="smtpPassword"
                    type="password"
                    value={formData.smtpPassword}
                    onChange={handleFormChange}
                    placeholder="••••••••"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email de Origen"
                    name="fromEmail"
                    value={formData.fromEmail}
                    onChange={handleFormChange}
                    placeholder="noreply@tuempresa.com"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre de Origen"
                    name="fromName"
                    value={formData.fromName}
                    onChange={handleFormChange}
                    placeholder="ERP System"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.smtpSecure}
                        onChange={handleFormChange}
                        name="smtpSecure"
                      />
                    }
                    label="Usar SSL/TLS (puerto 465)"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handleSaveConfig}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  Guardar Configuración
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleTestConnection}
                  disabled={!configured || testingConnection}
                  startIcon={testingConnection ? <CircularProgress size={20} /> : <RefreshIcon />}
                >
                  Probar Conexión
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Test Email */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <SendIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Enviar Correo de Prueba
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="Email de destino"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@email.com"
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleSendTestEmail}
                disabled={!configured || !testEmail || sendingTest}
                startIcon={sendingTest ? <CircularProgress size={20} /> : <SendIcon />}
              >
                Enviar Prueba
              </Button>

              {!configured && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Configura el servidor SMTP primero
                </Alert>
              )}
            </Paper>

            {/* Status Card */}
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom>Estado</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {configured ? (
                  <>
                    <SuccessIcon color="success" />
                    <Typography color="success.main">Configurado</Typography>
                  </>
                ) : (
                  <>
                    <ErrorIcon color="error" />
                    <Typography color="error.main">No configurado</Typography>
                  </>
                )}
              </Box>
              {config?.lastTestedAt && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Última prueba: {new Date(config.lastTestedAt).toLocaleString()}
                  {config.lastTestResult ? ' ✓' : ' ✗'}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab: Templates */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <TemplateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Plantillas de Correo
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Asunto</TableCell>
                  <TableCell>Sistema</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <Chip label={template.code} size="small" />
                    </TableCell>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.subject}</TableCell>
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
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditTemplate(template)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
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
              Historial de Correos
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => dispatch(fetchEmailLogs({ page: logsPage + 1, limit: logsRowsPerPage }))}
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
                  <TableCell>Asunto</TableCell>
                  <TableCell>Plantilla</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{log.toEmail}</TableCell>
                    <TableCell>{log.subject}</TableCell>
                    <TableCell>
                      {log.templateCode && <Chip label={log.templateCode} size="small" />}
                    </TableCell>
                    <TableCell>{getStatusChip(log.status)}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay registros
                    </TableCell>
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

      {/* Edit Template Dialog - Full Screen for WYSIWYG */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="xl" 
        fullWidth
        PaperProps={{
          sx: { 
            height: '90vh',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TemplateIcon color="primary" />
            <Box>
              <Typography variant="h6">
                Editar Plantilla: {editingTemplate?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Código: {editingTemplate?.code}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={templateForm.isActive}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, isActive: e.target.checked }))}
                />
              }
              label="Activa"
            />
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de la plantilla"
                value={templateForm.name}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Asunto del correo"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                size="small"
                helperText="Puedes usar variables Mustache: {{userName}}, {{appName}}, etc."
              />
            </Grid>
          </Grid>
          
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <EmailTemplateEditor
              template={editingTemplate}
              value={templateForm.bodyHtml}
              onChange={(html) => setTemplateForm(prev => ({ ...prev, bodyHtml: html }))}
              variables={editingTemplate?.variables || [
                { name: 'appName', description: 'Nombre de la aplicación', example: 'ERP Atilax' },
                { name: 'userName', description: 'Nombre del usuario', example: 'Juan Pérez' },
                { name: 'userEmail', description: 'Email del usuario', example: 'juan@empresa.com' },
                { name: 'verificationCode', description: 'Código de verificación', example: '123456' },
                { name: 'verificationUrl', description: 'URL de verificación' },
                { name: 'resetUrl', description: 'URL para resetear contraseña' },
                { name: 'companyName', description: 'Nombre de la empresa' },
                { name: 'currentYear', description: 'Año actual', example: '2024' },
                { name: 'supportEmail', description: 'Email de soporte' },
              ]}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveTemplate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            Guardar Plantilla
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailConfig;
