import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Divider,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  AttachFile as AttachFileIcon,
  CloudUpload as UploadIcon,
  Collections as GalleryIcon,
} from '@mui/icons-material';
import FileUpload from './FileUpload';
import AttachmentGallery from './AttachmentGallery';
import {
  fetchAttachments,
  selectAttachmentsByEntity,
  selectAttachmentLoading,
} from '../../store/slices/attachmentSlice';

/**
 * Componente combinado que muestra galería de archivos y permite subir nuevos
 * Ideal para usar en vistas de detalle de entidades
 */
const AttachmentSection = ({
  entityType,
  entityId,
  title,
  defaultExpanded = true,
  canUpload = true,
  canDelete = true,
  showCategory = true,
  defaultCategory = 'OTHER',
  accept,
  maxFiles = 10,
  variant = 'accordion', // 'accordion' | 'tabs' | 'inline'
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const attachments = useSelector((state) =>
    selectAttachmentsByEntity(state, entityType, entityId)
  );
  const loading = useSelector(selectAttachmentLoading);

  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState(0);

  // Cargar attachments al montar
  useEffect(() => {
    if (entityType && entityId) {
      dispatch(fetchAttachments({ entityType, entityId }));
    }
  }, [dispatch, entityType, entityId]);

  const handleUploadComplete = () => {
    // Recargar attachments después de subir
    dispatch(fetchAttachments({ entityType, entityId }));
  };

  const sectionTitle = title || t('attachments.title', 'Archivos Adjuntos');

  // Variante: Accordion
  if (variant === 'accordion') {
    return (
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{ mt: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachFileIcon color="action" />
            <Typography variant="subtitle1">{sectionTitle}</Typography>
            {attachments.length > 0 && (
              <Badge badgeContent={attachments.length} color="primary" sx={{ ml: 1 }} />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* Galería de archivos existentes */}
          {attachments.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom color="textSecondary">
                {t('attachments.existingFiles', 'Archivos existentes')}
              </Typography>
              <AttachmentGallery
                entityType={entityType}
                entityId={entityId}
                attachments={attachments}
                canDelete={canDelete}
                showCategory={showCategory}
                viewMode={isMobile ? 'list' : 'grid'}
              />
            </Box>
          )}

          {/* Separador si hay archivos y se puede subir */}
          {attachments.length > 0 && canUpload && <Divider sx={{ my: 2 }} />}

          {/* Zona de upload */}
          {canUpload && (
            <Box>
              <Typography variant="subtitle2" gutterBottom color="textSecondary">
                {t('attachments.uploadNew', 'Subir nuevos archivos')}
              </Typography>
              <FileUpload
                entityType={entityType}
                entityId={entityId}
                onUploadComplete={handleUploadComplete}
                maxFiles={maxFiles}
                accept={accept}
                defaultCategory={defaultCategory}
                showCategorySelect={showCategory}
                compact
              />
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  }

  // Variante: Tabs
  if (variant === 'tabs') {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachFileIcon color="action" />
          {sectionTitle}
          {attachments.length > 0 && (
            <Badge badgeContent={attachments.length} color="primary" sx={{ ml: 1 }} />
          )}
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab
            icon={<GalleryIcon />}
            iconPosition="start"
            label={t('attachments.gallery', 'Galería')}
          />
          {canUpload && (
            <Tab
              icon={<UploadIcon />}
              iconPosition="start"
              label={t('attachments.upload', 'Subir')}
            />
          )}
        </Tabs>

        {activeTab === 0 && (
          <AttachmentGallery
            entityType={entityType}
            entityId={entityId}
            attachments={attachments}
            canDelete={canDelete}
            showCategory={showCategory}
            viewMode={isMobile ? 'list' : 'grid'}
            emptyMessage={t('attachments.noFilesYet', 'Aún no hay archivos. Sube el primero.')}
          />
        )}

        {activeTab === 1 && canUpload && (
          <FileUpload
            entityType={entityType}
            entityId={entityId}
            onUploadComplete={() => {
              handleUploadComplete();
              setActiveTab(0); // Volver a galería después de subir
            }}
            maxFiles={maxFiles}
            accept={accept}
            defaultCategory={defaultCategory}
            showCategorySelect={showCategory}
          />
        )}
      </Box>
    );
  }

  // Variante: Inline (sin contenedor)
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AttachFileIcon color="action" />
        {sectionTitle}
        {attachments.length > 0 && (
          <Badge badgeContent={attachments.length} color="primary" sx={{ ml: 1 }} />
        )}
      </Typography>

      {/* Galería */}
      <AttachmentGallery
        entityType={entityType}
        entityId={entityId}
        attachments={attachments}
        canDelete={canDelete}
        showCategory={showCategory}
        viewMode={isMobile ? 'list' : 'grid'}
      />

      {/* Upload */}
      {canUpload && (
        <Box sx={{ mt: 2 }}>
          <FileUpload
            entityType={entityType}
            entityId={entityId}
            onUploadComplete={handleUploadComplete}
            maxFiles={maxFiles}
            accept={accept}
            defaultCategory={defaultCategory}
            showCategorySelect={showCategory}
            compact
          />
        </Box>
      )}
    </Box>
  );
};

export default AttachmentSection;
