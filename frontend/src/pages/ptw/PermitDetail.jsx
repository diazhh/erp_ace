import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Send as SendIcon,
  CheckCircle as ApproveIcon,
  PlayArrow as ActivateIcon,
  Stop as CloseIcon,
  Cancel as CancelIcon,
  AccessTime as ExtendIcon,
  Warning as StopWorkIcon,
} from '@mui/icons-material';
import {
  fetchPermitById,
  submitPermit,
  approvePermit,
  rejectPermit,
  activatePermit,
  closePermit,
  cancelPermit,
  updateChecklist,
  requestExtension,
  clearCurrentPermit,
} from '../../store/slices/ptwSlice';

const PermitDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentPermit, loading } = useSelector((state) => state.ptw);

  const [tabValue, setTabValue] = useState(0);
  const [rejectDialog, setRejectDialog] = useState({ open: false, reason: '' });
  const [closeDialog, setCloseDialog] = useState({ open: false, notes: '' });
  const [cancelDialog, setCancelDialog] = useState({ open: false, reason: '' });
  const [extensionDialog, setExtensionDialog] = useState({ open: false, new_end: '', reason: '' });
  const [checklistItems, setChecklistItems] = useState([]);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  useEffect(() => {
    dispatch(fetchPermitById(id));
    return () => {
      dispatch(clearCurrentPermit());
    };
  }, [dispatch, id]);

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PENDING: 'warning',
      APPROVED: 'info',
      ACTIVE: 'success',
      SUSPENDED: 'error',
      CLOSED: 'default',
      CANCELLED: 'default',
    };
    return colors[status] || 'default';
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  const handleSubmit = async () => {
    if (window.confirm(t('ptw.confirmSubmit', '¿Enviar permiso para aprobación?'))) {
      await dispatch(submitPermit(id));
      dispatch(fetchPermitById(id));
    }
  };

  const handleApprove = async () => {
    if (window.confirm(t('ptw.confirmApprove', '¿Aprobar este permiso de trabajo?'))) {
      await dispatch(approvePermit(id));
      dispatch(fetchPermitById(id));
    }
  };

  const handleReject = async () => {
    await dispatch(rejectPermit({ id, reason: rejectDialog.reason }));
    setRejectDialog({ open: false, reason: '' });
    dispatch(fetchPermitById(id));
  };

  const handleActivate = async () => {
    await dispatch(activatePermit(id));
    dispatch(fetchPermitById(id));
  };

  const handleClose = async () => {
    await dispatch(closePermit({ id, notes: closeDialog.notes }));
    setCloseDialog({ open: false, notes: '' });
    dispatch(fetchPermitById(id));
  };

  const handleCancel = async () => {
    await dispatch(cancelPermit({ id, reason: cancelDialog.reason }));
    setCancelDialog({ open: false, reason: '' });
    dispatch(fetchPermitById(id));
  };

  const handleRequestExtension = async () => {
    await dispatch(requestExtension({ permitId: id, data: extensionDialog }));
    setExtensionDialog({ open: false, new_end: '', reason: '' });
    dispatch(fetchPermitById(id));
  };

  const openChecklistDialog = (checklist) => {
    setSelectedChecklist(checklist);
    const items = typeof checklist.items === 'string' ? JSON.parse(checklist.items) : checklist.items;
    setChecklistItems(items || []);
  };

  const handleChecklistItemChange = (index) => {
    const newItems = [...checklistItems];
    newItems[index] = { ...newItems[index], checked: !newItems[index].checked };
    setChecklistItems(newItems);
  };

  const handleSaveChecklist = async () => {
    await dispatch(updateChecklist({
      permitId: id,
      checklistId: selectedChecklist.id,
      items: checklistItems,
    }));
    setSelectedChecklist(null);
    dispatch(fetchPermitById(id));
  };

  if (loading || !currentPermit) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const controlMeasures = typeof currentPermit.control_measures === 'string' 
    ? JSON.parse(currentPermit.control_measures) 
    : currentPermit.control_measures || [];
  
  const ppeRequired = typeof currentPermit.ppe_required === 'string'
    ? JSON.parse(currentPermit.ppe_required)
    : currentPermit.ppe_required || [];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/ptw/permits')} fullWidth={isMobile}>
            {t('common.back', 'Volver')}
          </Button>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
            {currentPermit.code}
          </Typography>
          <Chip
            label={t(`ptw.status.${currentPermit.status}`, currentPermit.status)}
            color={getStatusColor(currentPermit.status)}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
          {currentPermit.status === 'DRAFT' && (
            <>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/ptw/permits/${id}/edit`)} fullWidth={isMobile}>
                {t('common.edit', 'Editar')}
              </Button>
              <Button variant="contained" startIcon={<SendIcon />} onClick={handleSubmit} fullWidth={isMobile}>
                {t('ptw.submit', 'Enviar')}
              </Button>
            </>
          )}
          {currentPermit.status === 'PENDING' && (
            <>
              <Button variant="outlined" color="error" onClick={() => setRejectDialog({ open: true, reason: '' })} fullWidth={isMobile}>
                {t('ptw.reject', 'Rechazar')}
              </Button>
              <Button variant="contained" color="success" startIcon={<ApproveIcon />} onClick={handleApprove} fullWidth={isMobile}>
                {t('ptw.approve', 'Aprobar')}
              </Button>
            </>
          )}
          {currentPermit.status === 'APPROVED' && (
            <Button variant="contained" color="success" startIcon={<ActivateIcon />} onClick={handleActivate} fullWidth={isMobile}>
              {t('ptw.activate', 'Activar')}
            </Button>
          )}
          {currentPermit.status === 'ACTIVE' && (
            <>
              <Button variant="outlined" startIcon={<ExtendIcon />} onClick={() => setExtensionDialog({ open: true, new_end: '', reason: '' })} fullWidth={isMobile}>
                {t('ptw.extend', 'Extender')}
              </Button>
              <Button variant="outlined" color="error" startIcon={<StopWorkIcon />} onClick={() => navigate(`/ptw/stop-work/new?permitId=${id}`)} fullWidth={isMobile}>
                {t('ptw.stopWork.report', 'Stop Work')}
              </Button>
              <Button variant="contained" startIcon={<CloseIcon />} onClick={() => setCloseDialog({ open: true, notes: '' })} fullWidth={isMobile}>
                {t('ptw.close', 'Cerrar')}
              </Button>
            </>
          )}
          {!['CLOSED', 'CANCELLED'].includes(currentPermit.status) && (
            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => setCancelDialog({ open: true, reason: '' })} fullWidth={isMobile}>
              {t('ptw.cancel', 'Cancelar')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('ptw.type.label', 'Tipo')}</Typography>
              <Typography variant="h6" fontWeight="bold">{t(`ptw.type.${currentPermit.type}`, currentPermit.type)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('ptw.location', 'Ubicación')}</Typography>
              <Typography variant="h6" fontWeight="bold">{currentPermit.location}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('ptw.startDate', 'Inicio')}</Typography>
              <Typography variant="h6" fontWeight="bold">{formatDateTime(currentPermit.start_datetime)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('ptw.endDate', 'Fin')}</Typography>
              <Typography variant="h6" fontWeight="bold">{formatDateTime(currentPermit.end_datetime)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Details */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>{currentPermit.title}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">{t('ptw.workDescription', 'Descripción del Trabajo')}</Typography>
            <Typography variant="body1">{currentPermit.work_description}</Typography>
          </Grid>
          {currentPermit.hazards_identified && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">{t('ptw.hazards', 'Peligros Identificados')}</Typography>
              <Typography variant="body1">{currentPermit.hazards_identified}</Typography>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">{t('ptw.requester', 'Solicitante')}</Typography>
            <Typography variant="body1">{currentPermit.requester?.username || '-'}</Typography>
          </Grid>
          {currentPermit.approver && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">{t('ptw.approver', 'Aprobador')}</Typography>
              <Typography variant="body1">{currentPermit.approver?.username} ({formatDateTime(currentPermit.approved_at)})</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Tabs - Select en mobile, Tabs en desktop */}
      <Paper sx={{ mb: 3 }}>
        {isMobile ? (
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth>
              <InputLabel>{t('common.section')}</InputLabel>
              <Select
                value={tabValue}
                label={t('common.section')}
                onChange={(e) => setTabValue(e.target.value)}
              >
                <MenuItem value={0}>{t('ptw.checklists', 'Checklists')}</MenuItem>
                <MenuItem value={1}>{t('ptw.controlMeasures', 'Medidas de Control')}</MenuItem>
                <MenuItem value={2}>{t('ptw.extensions', 'Extensiones')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            variant="standard"
          >
            <Tab label={t('ptw.checklists', 'Checklists')} />
            <Tab label={t('ptw.controlMeasures', 'Medidas de Control')} />
            <Tab label={t('ptw.extensions', 'Extensiones')} />
          </Tabs>
        )}
        <Divider />

        {/* Checklists Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {(currentPermit.checklists || []).map((checklist) => {
                const items = typeof checklist.items === 'string' ? JSON.parse(checklist.items) : checklist.items || [];
                const completedCount = items.filter(i => i.checked).length;
                return (
                  <Grid item xs={12} md={6} key={checklist.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {t(`ptw.checklist.${checklist.checklist_type}`, checklist.checklist_type)}
                          </Typography>
                          <Chip
                            label={checklist.all_passed ? t('ptw.completed', 'Completado') : `${completedCount}/${items.length}`}
                            size="small"
                            color={checklist.all_passed ? 'success' : 'default'}
                          />
                        </Box>
                        {checklist.completed_by && (
                          <Typography variant="caption" color="text.secondary">
                            {t('ptw.completedBy', 'Completado por')}: {checklist.completedBy?.username} - {formatDateTime(checklist.completed_at)}
                          </Typography>
                        )}
                        <Button
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => openChecklistDialog(checklist)}
                          disabled={['CLOSED', 'CANCELLED'].includes(currentPermit.status)}
                        >
                          {checklist.all_passed ? t('common.view', 'Ver') : t('ptw.complete', 'Completar')}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* Control Measures Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t('ptw.controlMeasures', 'Medidas de Control')}
                </Typography>
                <List dense>
                  {controlMeasures.map((measure, index) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ minWidth: 32 }}>•</ListItemIcon>
                      <ListItemText primary={measure} />
                    </ListItem>
                  ))}
                  {controlMeasures.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {t('ptw.noControlMeasures', 'No hay medidas de control definidas')}
                    </Typography>
                  )}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t('ptw.ppeRequired', 'EPP Requerido')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ppeRequired.map((ppe, index) => (
                    <Chip key={index} label={ppe} variant="outlined" />
                  ))}
                  {ppeRequired.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {t('ptw.noPPE', 'No hay EPP definido')}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Extensions Tab */}
        {tabValue === 2 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('ptw.originalEnd', 'Fin Original')}</TableCell>
                  <TableCell>{t('ptw.newEnd', 'Nuevo Fin')}</TableCell>
                  <TableCell>{t('ptw.reason', 'Razón')}</TableCell>
                  <TableCell>{t('ptw.status.label', 'Estado')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(currentPermit.extensions || []).map((ext) => (
                  <TableRow key={ext.id}>
                    <TableCell>{formatDateTime(ext.original_end)}</TableCell>
                    <TableCell>{formatDateTime(ext.new_end)}</TableCell>
                    <TableCell>{ext.reason}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`ptw.extensionStatus.${ext.status}`, ext.status)}
                        size="small"
                        color={ext.status === 'APPROVED' ? 'success' : ext.status === 'REJECTED' ? 'error' : 'warning'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {(!currentPermit.extensions || currentPermit.extensions.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">{t('ptw.noExtensions', 'No hay extensiones')}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, reason: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('ptw.rejectPermit', 'Rechazar Permiso')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('ptw.rejectReason', 'Razón del Rechazo')}
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, reason: '' })}>{t('common.cancel', 'Cancelar')}</Button>
          <Button variant="contained" color="error" onClick={handleReject}>{t('ptw.reject', 'Rechazar')}</Button>
        </DialogActions>
      </Dialog>

      {/* Close Dialog */}
      <Dialog open={closeDialog.open} onClose={() => setCloseDialog({ open: false, notes: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('ptw.closePermit', 'Cerrar Permiso')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('ptw.closureNotes', 'Notas de Cierre')}
            value={closeDialog.notes}
            onChange={(e) => setCloseDialog({ ...closeDialog, notes: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseDialog({ open: false, notes: '' })}>{t('common.cancel', 'Cancelar')}</Button>
          <Button variant="contained" onClick={handleClose}>{t('ptw.close', 'Cerrar')}</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, reason: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('ptw.cancelPermit', 'Cancelar Permiso')}</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t('ptw.cancelWarning', 'Esta acción no se puede deshacer.')}
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('ptw.cancelReason', 'Razón de Cancelación')}
            value={cancelDialog.reason}
            onChange={(e) => setCancelDialog({ ...cancelDialog, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, reason: '' })}>{t('common.cancel', 'Cancelar')}</Button>
          <Button variant="contained" color="error" onClick={handleCancel}>{t('ptw.cancelPermit', 'Cancelar Permiso')}</Button>
        </DialogActions>
      </Dialog>

      {/* Extension Dialog */}
      <Dialog open={extensionDialog.open} onClose={() => setExtensionDialog({ open: false, new_end: '', reason: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('ptw.requestExtension', 'Solicitar Extensión')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="datetime-local"
                label={t('ptw.newEndDate', 'Nueva Fecha/Hora de Fin')}
                value={extensionDialog.new_end}
                onChange={(e) => setExtensionDialog({ ...extensionDialog, new_end: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('ptw.extensionReason', 'Razón de la Extensión')}
                value={extensionDialog.reason}
                onChange={(e) => setExtensionDialog({ ...extensionDialog, reason: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExtensionDialog({ open: false, new_end: '', reason: '' })}>{t('common.cancel', 'Cancelar')}</Button>
          <Button variant="contained" onClick={handleRequestExtension}>{t('ptw.request', 'Solicitar')}</Button>
        </DialogActions>
      </Dialog>

      {/* Checklist Dialog */}
      <Dialog open={!!selectedChecklist} onClose={() => setSelectedChecklist(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedChecklist && t(`ptw.checklist.${selectedChecklist.checklist_type}`, selectedChecklist.checklist_type)}
        </DialogTitle>
        <DialogContent>
          <List>
            {checklistItems.map((item, index) => (
              <ListItem key={item.id || index} dense>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.checked || false}
                      onChange={() => handleChecklistItemChange(index)}
                      disabled={selectedChecklist?.all_passed}
                    />
                  }
                  label={item.text}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedChecklist(null)}>{t('common.cancel', 'Cancelar')}</Button>
          {!selectedChecklist?.all_passed && (
            <Button variant="contained" onClick={handleSaveChecklist}>{t('common.save', 'Guardar')}</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PermitDetail;
