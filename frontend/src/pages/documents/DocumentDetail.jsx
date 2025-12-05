import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Archive as ArchiveIcon,
  History as VersionIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  OpenInNew as OpenIcon,
  Person as PersonIcon,
  Folder as CategoryIcon,
  CalendarToday as DateIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';

import { 
  fetchDocument, 
  deleteDocument, 
  submitForReview, 
  approveDocument, 
  rejectDocument, 
  archiveDocument,
  clearCurrentDocument 
} from '../../store/slices/documentSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const statusColors = {
  DRAFT: 'default',
  PENDING_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  EXPIRED: 'error',
  ARCHIVED: 'info',
  CANCELLED: 'default',
};

const statusLabels = {
  DRAFT: 'Borrador',
  PENDING_REVIEW: 'Pendiente de Revisión',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  EXPIRED: 'Vencido',
  ARCHIVED: 'Archivado',
  CANCELLED: 'Cancelado',
};

const confidentialityColors = {
  PUBLIC: 'success',
  INTERNAL: 'info',
  CONFIDENTIAL: 'warning',
  RESTRICTED: 'error',
};

const DocumentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { currentDocument: document, currentDocumentLoading: loading } = useSelector((state) => state.documents);

  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    dispatch(fetchDocument(id));
    return () => {
      dispatch(clearCurrentDocument());
    };
  }, [dispatch, id]);

  const handleAction = async () => {
    switch (actionType) {
      case 'submit':
        await dispatch(submitForReview(id));
        break;
      case 'approve':
        await dispatch(approveDocument(id));
        break;
      case 'reject':
        await dispatch(rejectDocument({ id, reason: '' }));
        break;
      case 'archive':
        await dispatch(archiveDocument(id));
        break;
      default:
        break;
    }
    setActionDialogOpen(false);
    dispatch(fetchDocument(id));
  };

  const handleDelete = async () => {
    await dispatch(deleteDocument(id));
    navigate('/documents');
  };

  const openActionDialog = (type) => {
    setActionType(type);
    setActionDialogOpen(true);
  };

  const getActionDialogContent = () => {
    switch (actionType) {
      case 'submit':
        return { title: 'Enviar a Revisión', message: '¿Desea enviar este documento a revisión?' };
      case 'approve':
        return { title: 'Aprobar Documento', message: '¿Desea aprobar este documento?' };
      case 'reject':
        return { title: 'Rechazar Documento', message: '¿Desea rechazar este documento?' };
      case 'archive':
        return { title: 'Archivar Documento', message: '¿Desea archivar este documento?' };
      default:
        return { title: '', message: '' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!document) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Documento no encontrado</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/documents')} sx={{ mt: 2 }}>
          Volver a Documentos
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/documents')}
          sx={{ mb: 2 }}
        >
          Volver a Documentos
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {document.title}
              </Typography>
              <Chip 
                label={statusLabels[document.status]} 
                color={statusColors[document.status]} 
              />
            </Box>
            <Typography variant="body1" color="text.secondary">
              {document.code} • Versión {document.version}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {/* Workflow Actions */}
            {document.status === 'DRAFT' && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                onClick={() => openActionDialog('submit')}
              >
                Enviar a Revisión
              </Button>
            )}
            {document.status === 'PENDING_REVIEW' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={() => openActionDialog('approve')}
                >
                  Aprobar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={() => openActionDialog('reject')}
                >
                  Rechazar
                </Button>
              </>
            )}
            {document.status === 'APPROVED' && (
              <Button
                variant="outlined"
                startIcon={<ArchiveIcon />}
                onClick={() => openActionDialog('archive')}
              >
                Archivar
              </Button>
            )}

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/documents/${id}/edit`)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab label="Información" />
          <Tab label={`Versiones (${document.versions?.length || 0})`} />
          <Tab label={`Compartido (${document.shares?.length || 0})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Main Info */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información del Documento
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {document.description && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descripción
                  </Typography>
                  <Typography variant="body1">
                    {document.description}
                  </Typography>
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tipo de Documento
                  </Typography>
                  <Typography variant="body1">
                    {document.document_type?.replace(/_/g, ' ')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Categoría
                  </Typography>
                  <Typography variant="body1">
                    {document.category?.name || 'Sin categoría'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Entidad Relacionada
                  </Typography>
                  <Typography variant="body1">
                    {document.entity_type?.replace(/_/g, ' ') || 'General'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Confidencialidad
                  </Typography>
                  <Chip 
                    label={document.confidentiality_level} 
                    color={confidentialityColors[document.confidentiality_level]} 
                    size="small"
                  />
                </Grid>
                {document.external_number && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Número Externo
                    </Typography>
                    <Typography variant="body1">
                      {document.external_number}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de Emisión
                  </Typography>
                  <Typography variant="body1">
                    {document.issue_date ? new Date(document.issue_date).toLocaleDateString() : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de Vencimiento
                  </Typography>
                  <Typography 
                    variant="body1"
                    color={document.expiry_date && new Date(document.expiry_date) < new Date() ? 'error' : 'text.primary'}
                  >
                    {document.expiry_date ? new Date(document.expiry_date).toLocaleDateString() : 'Sin vencimiento'}
                  </Typography>
                </Grid>
              </Grid>

              {/* File Info */}
              {(document.file_name || document.external_url) && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Archivo
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Card variant="outlined">
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DocumentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {document.file_name || 'Enlace externo'}
                          </Typography>
                          {document.file_type && (
                            <Typography variant="caption" color="text.secondary">
                              {document.file_type} • {document.file_size ? `${(document.file_size / 1024).toFixed(2)} KB` : ''}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      {document.external_url && (
                        <Button
                          variant="outlined"
                          startIcon={<OpenIcon />}
                          href={document.external_url}
                          target="_blank"
                        >
                          Abrir
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* Tags */}
              {document.tags && document.tags.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Etiquetas
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {document.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Notes */}
              {document.notes && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Notas
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {document.notes}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Audit Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Auditoría
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                <ListItem>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Creado por" 
                    secondary={document.creator?.username || '-'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DateIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Fecha de creación" 
                    secondary={new Date(document.createdAt).toLocaleString()}
                  />
                </ListItem>
                {document.approver && (
                  <ListItem>
                    <ListItemIcon><ApproveIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Aprobado por" 
                      secondary={`${document.approver.username} - ${new Date(document.approved_at).toLocaleString()}`}
                    />
                  </ListItem>
                )}
                {document.archiver && (
                  <ListItem>
                    <ListItemIcon><ArchiveIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Archivado por" 
                      secondary={`${document.archiver.username} - ${new Date(document.archived_at).toLocaleString()}`}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>

            {/* Quick Actions */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Acciones
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<VersionIcon />}
                  onClick={() => setTabValue(1)}
                >
                  Ver Versiones
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() => setTabValue(2)}
                >
                  Compartir
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Versions Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Historial de Versiones
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {document.versions?.map((version) => (
              <ListItem key={version.id} divider>
                <ListItemIcon>
                  <Chip 
                    label={`v${version.version_number}`} 
                    color={version.is_current ? 'primary' : 'default'}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={version.file_name || 'Sin archivo'}
                  secondary={
                    <>
                      {version.change_description && <span>{version.change_description} • </span>}
                      {version.creator?.username} • {new Date(version.createdAt).toLocaleString()}
                    </>
                  }
                />
                {version.is_current && (
                  <Chip label="Actual" color="success" size="small" />
                )}
              </ListItem>
            ))}
            {(!document.versions || document.versions.length === 0) && (
              <ListItem>
                <ListItemText primary="Sin versiones registradas" />
              </ListItem>
            )}
          </List>
        </Paper>
      )}

      {/* Shares Tab */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Compartido con
            </Typography>
            <Button variant="contained" startIcon={<ShareIcon />}>
              Compartir
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {document.shares?.map((share) => (
              <ListItem key={share.id} divider>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary={share.sharedWithUser?.username || share.sharedWithDepartment?.name || 'Desconocido'}
                  secondary={
                    <>
                      Acceso: {share.access_level} • 
                      Compartido por: {share.sharer?.username} • 
                      {share.expires_at ? `Expira: ${new Date(share.expires_at).toLocaleDateString()}` : 'Sin expiración'}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {(!document.shares || document.shares.length === 0) && (
              <ListItem>
                <ListItemText 
                  primary="No compartido" 
                  secondary="Este documento no ha sido compartido con nadie"
                />
              </ListItem>
            )}
          </List>
        </Paper>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Documento"
        message={`¿Está seguro de eliminar el documento "${document.title}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Eliminar"
        confirmColor="error"
      />

      {/* Action Confirmation */}
      <ConfirmDialog
        open={actionDialogOpen}
        title={getActionDialogContent().title}
        message={getActionDialogContent().message}
        onConfirm={handleAction}
        onCancel={() => setActionDialogOpen(false)}
        confirmText="Confirmar"
      />
    </Box>
  );
};

export default DocumentDetail;
