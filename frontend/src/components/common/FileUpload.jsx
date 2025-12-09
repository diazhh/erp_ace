import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  TableChart as ExcelIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import {
  uploadFiles,
  selectAttachmentUploading,
  selectAttachmentError,
} from '../../store/slices/attachmentSlice';

// Iconos por tipo de archivo
const getFileIcon = (mimeType) => {
  if (mimeType?.startsWith('image/')) return <ImageIcon color="primary" />;
  if (mimeType === 'application/pdf') return <PdfIcon color="error" />;
  if (mimeType?.includes('word')) return <DocIcon color="info" />;
  if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return <ExcelIcon color="success" />;
  return <FileIcon color="action" />;
};

// Formatear tamaño de archivo
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUpload = ({
  entityType,
  entityId,
  onUploadComplete,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  },
  showCategorySelect = true,
  defaultCategory = 'OTHER',
  disabled = false,
  compact = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const uploading = useSelector(selectAttachmentUploading);
  const uploadError = useSelector(selectAttachmentError);
  
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState(defaultCategory);
  const [description, setDescription] = useState('');
  const [uploadStatus, setUploadStatus] = useState({}); // { fileName: 'pending' | 'success' | 'error' }
  const [localError, setLocalError] = useState(null);

  const categories = [
    { value: 'RECEIPT', label: t('attachments.categories.receipt', 'Recibo') },
    { value: 'INVOICE', label: t('attachments.categories.invoice', 'Factura') },
    { value: 'PHOTO', label: t('attachments.categories.photo', 'Foto') },
    { value: 'BEFORE', label: t('attachments.categories.before', 'Foto Antes') },
    { value: 'AFTER', label: t('attachments.categories.after', 'Foto Después') },
    { value: 'PROGRESS', label: t('attachments.categories.progress', 'Foto de Avance') },
    { value: 'EVIDENCE', label: t('attachments.categories.evidence', 'Evidencia') },
    { value: 'DOCUMENT', label: t('attachments.categories.document', 'Documento') },
    { value: 'CONTRACT', label: t('attachments.categories.contract', 'Contrato') },
    { value: 'REPORT', label: t('attachments.categories.report', 'Informe') },
    { value: 'PROFILE', label: t('attachments.categories.profile', 'Foto de Perfil') },
    { value: 'ID_DOCUMENT', label: t('attachments.categories.idDocument', 'Documento de Identidad') },
    { value: 'CERTIFICATE', label: t('attachments.categories.certificate', 'Certificado') },
    { value: 'WARRANTY', label: t('attachments.categories.warranty', 'Garantía') },
    { value: 'MANUAL', label: t('attachments.categories.manual', 'Manual') },
    { value: 'OTHER', label: t('attachments.categories.other', 'Otro') },
  ];

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setLocalError(null);
    
    // Manejar archivos rechazados
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map((f) => {
        const error = f.errors[0];
        if (error.code === 'file-too-large') {
          return `${f.file.name}: ${t('attachments.errors.fileTooLarge', 'Archivo muy grande')}`;
        }
        if (error.code === 'file-invalid-type') {
          return `${f.file.name}: ${t('attachments.errors.invalidType', 'Tipo no permitido')}`;
        }
        return `${f.file.name}: ${error.message}`;
      });
      setLocalError(errors.join(', '));
    }

    // Agregar archivos aceptados
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      }));
      
      setFiles((prev) => {
        const combined = [...prev, ...newFiles];
        // Limitar a maxFiles
        return combined.slice(0, maxFiles);
      });
    }
  }, [maxFiles, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: maxFiles - files.length,
    disabled: disabled || uploading,
  });

  const removeFile = (index) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      // Revocar URL de preview si existe
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0 || !entityType || !entityId) return;

    setLocalError(null);
    const filesToUpload = files.map((f) => f.file);

    try {
      const result = await dispatch(
        uploadFiles({
          entityType,
          entityId,
          files: filesToUpload,
          category,
          description: description || undefined,
        })
      ).unwrap();

      // Limpiar archivos después de subir
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      setFiles([]);
      setDescription('');

      // Callback de éxito
      if (onUploadComplete) {
        onUploadComplete(result.data);
      }
    } catch (error) {
      setLocalError(error.message || t('attachments.errors.uploadFailed', 'Error al subir archivos'));
    }
  };

  const clearAll = () => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
    setLocalError(null);
  };

  return (
    <Box>
      {/* Zona de drop */}
      <Paper
        {...getRootProps()}
        sx={{
          p: compact ? 2 : 3,
          border: '2px dashed',
          borderColor: isDragActive
            ? 'primary.main'
            : disabled
            ? 'grey.300'
            : 'grey.400',
          borderRadius: 2,
          bgcolor: isDragActive
            ? alpha(theme.palette.primary.main, 0.05)
            : disabled
            ? 'grey.100'
            : 'background.paper',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: disabled ? 'grey.300' : 'primary.main',
            bgcolor: disabled ? 'grey.100' : alpha(theme.palette.primary.main, 0.02),
          },
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CloudUploadIcon
            sx={{
              fontSize: compact ? 40 : 48,
              color: isDragActive ? 'primary.main' : 'grey.500',
            }}
          />
          <Typography
            variant={compact ? 'body2' : 'body1'}
            color="textSecondary"
            textAlign="center"
          >
            {isDragActive
              ? t('attachments.dropHere', 'Suelta los archivos aquí')
              : t('attachments.dragOrClick', 'Arrastra archivos aquí o haz clic para seleccionar')}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {t('attachments.maxSize', 'Máximo')}: {formatFileSize(maxSize)} | {t('attachments.maxFiles', 'Máx. archivos')}: {maxFiles}
          </Typography>
        </Box>
      </Paper>

      {/* Error */}
      {(localError || uploadError) && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setLocalError(null)}>
          {localError || uploadError}
        </Alert>
      )}

      {/* Lista de archivos seleccionados */}
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">
              {t('attachments.selectedFiles', 'Archivos seleccionados')} ({files.length})
            </Typography>
            <Button size="small" onClick={clearAll} color="error">
              {t('common.clearAll', 'Limpiar todo')}
            </Button>
          </Box>

          <List dense>
            {files.map((fileObj, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {fileObj.preview ? (
                    <Box
                      component="img"
                      src={fileObj.preview}
                      sx={{
                        width: 32,
                        height: 32,
                        objectFit: 'cover',
                        borderRadius: 0.5,
                      }}
                    />
                  ) : (
                    getFileIcon(fileObj.file.type)
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={fileObj.file.name}
                  secondary={formatFileSize(fileObj.file.size)}
                  primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {/* Opciones de categoría y descripción */}
          {showCategorySelect && (
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>{t('attachments.category', 'Categoría')}</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label={t('attachments.category', 'Categoría')}
                  disabled={uploading}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label={t('attachments.description', 'Descripción')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                sx={{ flexGrow: 1, minWidth: 200 }}
              />
            </Box>
          )}

          {/* Progreso de carga */}
          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                {t('attachments.uploading', 'Subiendo archivos...')}
              </Typography>
            </Box>
          )}

          {/* Botón de subir */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={uploading || files.length === 0 || !entityId}
              startIcon={<CloudUploadIcon />}
            >
              {uploading
                ? t('attachments.uploading', 'Subiendo...')
                : t('attachments.upload', 'Subir archivos')}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
