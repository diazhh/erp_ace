import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  TableChart as ExcelIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';
import {
  fetchAttachments,
  deleteAttachment,
  selectAttachmentsByEntity,
  selectAttachmentLoading,
} from '../../store/slices/attachmentSlice';

// Iconos por tipo de archivo
const getFileIcon = (mimeType, size = 'medium') => {
  const fontSize = size === 'large' ? 64 : size === 'medium' ? 40 : 24;
  if (mimeType?.startsWith('image/')) return <ImageIcon sx={{ fontSize }} color="primary" />;
  if (mimeType === 'application/pdf') return <PdfIcon sx={{ fontSize }} color="error" />;
  if (mimeType?.includes('word')) return <DocIcon sx={{ fontSize }} color="info" />;
  if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return <ExcelIcon sx={{ fontSize }} color="success" />;
  return <FileIcon sx={{ fontSize }} color="action" />;
};

// Formatear tamaño de archivo
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Categorías con colores
const categoryColors = {
  RECEIPT: 'success',
  INVOICE: 'primary',
  PHOTO: 'info',
  BEFORE: 'warning',
  AFTER: 'secondary',
  PROGRESS: 'info',
  EVIDENCE: 'error',
  DOCUMENT: 'default',
  CONTRACT: 'primary',
  REPORT: 'secondary',
  OTHER: 'default',
};

const AttachmentGallery = ({
  entityType,
  entityId,
  attachments: propAttachments,
  onDelete,
  canDelete = true,
  showCategory = true,
  viewMode = 'grid', // 'grid' | 'list'
  columns = { xs: 2, sm: 3, md: 4 },
  emptyMessage,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Si se pasan attachments como prop, usarlos; si no, obtener del store
  const storeAttachments = useSelector((state) =>
    selectAttachmentsByEntity(state, entityType, entityId)
  );
  const loading = useSelector(selectAttachmentLoading);

  const attachments = propAttachments || storeAttachments;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [zoom, setZoom] = useState(1);

  // Cargar attachments si no se pasan como prop
  useEffect(() => {
    if (!propAttachments && entityType && entityId) {
      dispatch(fetchAttachments({ entityType, entityId }));
    }
  }, [dispatch, entityType, entityId, propAttachments]);

  // Filtrar solo imágenes para el lightbox
  const imageAttachments = attachments.filter((att) =>
    att.mimeType?.startsWith('image/')
  );

  const handleOpenLightbox = (attachment) => {
    const index = imageAttachments.findIndex((img) => img.id === attachment.id);
    if (index !== -1) {
      setCurrentIndex(index);
      setZoom(1);
      setLightboxOpen(true);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setZoom(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imageAttachments.length - 1));
    setZoom(1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < imageAttachments.length - 1 ? prev + 1 : 0));
    setZoom(1);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));

  const handleDeleteClick = (attachment) => {
    setAttachmentToDelete(attachment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (attachmentToDelete) {
      if (onDelete) {
        onDelete(attachmentToDelete);
      } else {
        await dispatch(deleteAttachment({ id: attachmentToDelete.id }));
      }
    }
    setDeleteDialogOpen(false);
    setAttachmentToDelete(null);
  };

  const handleDownload = (attachment) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const url = `${baseUrl}${attachment.fileUrl}`;
    window.open(url, '_blank');
  };

  const handleView = (attachment) => {
    if (attachment.mimeType?.startsWith('image/')) {
      handleOpenLightbox(attachment);
    } else {
      handleDownload(attachment);
    }
  };

  if (loading && attachments.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (attachments.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        {emptyMessage || t('attachments.noFiles', 'No hay archivos adjuntos')}
      </Alert>
    );
  }

  // Vista de lista
  if (viewMode === 'list' || isMobile) {
    return (
      <>
        <List dense>
          {attachments.map((attachment) => (
            <ListItem
              key={attachment.id}
              sx={{
                bgcolor: 'grey.50',
                borderRadius: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                {attachment.thumbnailUrl ? (
                  <Box
                    component="img"
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${attachment.thumbnailUrl}`}
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: 'cover',
                      borderRadius: 0.5,
                      cursor: 'pointer',
                    }}
                    onClick={() => handleView(attachment)}
                  />
                ) : (
                  getFileIcon(attachment.mimeType, 'small')
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {attachment.originalName}
                    </Typography>
                    {showCategory && (
                      <Chip
                        label={t(`attachments.categories.${attachment.category?.toLowerCase()}`, attachment.category)}
                        size="small"
                        color={categoryColors[attachment.category] || 'default'}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                }
                secondary={attachment.fileSizeFormatted || formatFileSize(attachment.fileSize)}
              />
              <ListItemSecondaryAction>
                <Tooltip title={t('common.view', 'Ver')}>
                  <IconButton size="small" onClick={() => handleView(attachment)}>
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('common.download', 'Descargar')}>
                  <IconButton size="small" onClick={() => handleDownload(attachment)}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {canDelete && (
                  <Tooltip title={t('common.delete', 'Eliminar')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(attachment)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {/* Diálogo de confirmación de eliminación */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>{t('attachments.deleteConfirm', '¿Eliminar archivo?')}</DialogTitle>
          <DialogContent>
            <Typography>
              {t('attachments.deleteMessage', '¿Estás seguro de que deseas eliminar')} "{attachmentToDelete?.originalName}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel', 'Cancelar')}</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              {t('common.delete', 'Eliminar')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Vista de grid
  return (
    <>
      <Grid container spacing={2}>
        {attachments.map((attachment) => (
          <Grid item {...columns} key={attachment.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              {/* Preview */}
              <Box
                sx={{
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  cursor: 'pointer',
                }}
                onClick={() => handleView(attachment)}
              >
                {attachment.thumbnailUrl || attachment.mimeType?.startsWith('image/') ? (
                  <CardMedia
                    component="img"
                    image={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${attachment.thumbnailUrl || attachment.fileUrl}`}
                    alt={attachment.originalName}
                    sx={{
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  getFileIcon(attachment.mimeType, 'large')
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, py: 1, px: 1.5 }}>
                <Tooltip title={attachment.originalName}>
                  <Typography variant="body2" noWrap>
                    {attachment.originalName}
                  </Typography>
                </Tooltip>
                <Typography variant="caption" color="textSecondary">
                  {attachment.fileSizeFormatted || formatFileSize(attachment.fileSize)}
                </Typography>
                {showCategory && (
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={t(`attachments.categories.${attachment.category?.toLowerCase()}`, attachment.category)}
                      size="small"
                      color={categoryColors[attachment.category] || 'default'}
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <Tooltip title={t('common.download', 'Descargar')}>
                  <IconButton size="small" onClick={() => handleDownload(attachment)}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {canDelete && (
                  <Tooltip title={t('common.delete', 'Eliminar')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(attachment)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox para imágenes */}
      <Dialog
        open={lightboxOpen}
        onClose={handleCloseLightbox}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { bgcolor: 'black', color: 'white' },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" noWrap sx={{ maxWidth: '70%' }}>
            {imageAttachments[currentIndex]?.originalName}
          </Typography>
          <Box>
            <IconButton onClick={handleZoomOut} color="inherit" size="small">
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={handleZoomIn} color="inherit" size="small">
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={handleCloseLightbox} color="inherit" size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            position: 'relative',
            overflow: 'auto',
          }}
        >
          {imageAttachments.length > 1 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 8,
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              <PrevIcon />
            </IconButton>
          )}

          {imageAttachments[currentIndex] && (
            <Box
              component="img"
              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imageAttachments[currentIndex].fileUrl}`}
              alt={imageAttachments[currentIndex].originalName}
              sx={{
                maxWidth: '100%',
                maxHeight: '70vh',
                transform: `scale(${zoom})`,
                transition: 'transform 0.2s',
              }}
            />
          )}

          {imageAttachments.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              <NextIcon />
            </IconButton>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Typography variant="caption" color="grey.500">
            {currentIndex + 1} / {imageAttachments.length}
          </Typography>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('attachments.deleteConfirm', '¿Eliminar archivo?')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('attachments.deleteMessage', '¿Estás seguro de que deseas eliminar')} "{attachmentToDelete?.originalName}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel', 'Cancelar')}</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            {t('common.delete', 'Eliminar')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AttachmentGallery;
