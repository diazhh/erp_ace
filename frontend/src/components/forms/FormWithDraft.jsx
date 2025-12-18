import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Alert,
  Snackbar,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Save as SaveIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import useFormDraft from '../../hooks/useFormDraft';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';

const FormWithDraft = ({
  formId,
  children,
  initialValues,
  values,
  onValuesChange,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  showDraftIndicator = true,
  enableKeyboardShortcuts = true,
}) => {
  const { t } = useTranslation();
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const {
    hasDraft,
    draftData,
    lastSaved,
    isSaving,
    saveDraftData,
    restoreDraft,
    discardDraft,
    clearFormDraft,
  } = useFormDraft(formId, {
    onRestore: (data) => {
      if (onValuesChange) {
        onValuesChange(data);
      }
    },
    showToast: false,
  });

  // Auto-save on value changes
  useEffect(() => {
    if (values && Object.keys(values).length > 0) {
      // Don't save if values match initial values (new form)
      const hasChanges = JSON.stringify(values) !== JSON.stringify(initialValues);
      if (hasChanges) {
        saveDraftData(values);
      }
    }
  }, [values, initialValues, saveDraftData]);

  // Show restore dialog when draft exists on mount
  useEffect(() => {
    if (hasDraft && draftData) {
      // Only show if current values are empty or match initial
      const isEmptyOrInitial = !values || 
        Object.keys(values).length === 0 || 
        JSON.stringify(values) === JSON.stringify(initialValues);
      
      if (isEmptyOrInitial) {
        setShowRestoreDialog(true);
      }
    }
  }, [hasDraft, draftData]); // Only run on mount

  // Handle form submit
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    if (onSubmit) {
      const success = await onSubmit(values);
      if (success !== false) {
        clearFormDraft();
      }
    }
  }, [onSubmit, values, clearFormDraft]);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    enableKeyboardShortcuts ? [
      {
        key: 's',
        ctrl: true,
        action: handleSubmit,
      },
    ] : [],
    { enabled: enableKeyboardShortcuts }
  );

  // Handle restore
  const handleRestore = () => {
    restoreDraft();
    setShowRestoreDialog(false);
  };

  // Handle discard
  const handleDiscard = () => {
    discardDraft();
    setShowRestoreDialog(false);
    setShowDiscardDialog(false);
  };

  // Format last saved time
  const formatLastSaved = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
      return t('forms.justNow', 'hace un momento');
    } else if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return t('forms.minutesAgo', 'hace {{count}} min', { count: mins });
    } else {
      return date.toLocaleTimeString();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Draft indicator */}
      {showDraftIndicator && (hasDraft || isSaving) && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 2,
            p: 1,
            bgcolor: 'action.hover',
            borderRadius: 1,
          }}
        >
          <ScheduleIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {isSaving 
              ? t('forms.saving', 'Guardando borrador...')
              : t('forms.lastSaved', 'Último guardado: {{time}}', { time: formatLastSaved(lastSaved) })
            }
          </Typography>
          {hasDraft && (
            <Chip
              label={t('forms.hasDraft', 'Borrador')}
              size="small"
              color="info"
              variant="outlined"
            />
          )}
          {hasDraft && (
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setShowDiscardDialog(true)}
            >
              {t('forms.discardDraft', 'Descartar')}
            </Button>
          )}
        </Box>
      )}

      {/* Form content */}
      {children}

      {/* Keyboard shortcut hint */}
      {enableKeyboardShortcuts && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {t('forms.keyboardHint', 'Presiona Ctrl+S para guardar')}
        </Typography>
      )}

      {/* Restore draft dialog */}
      <Dialog open={showRestoreDialog} onClose={() => setShowRestoreDialog(false)}>
        <DialogTitle>
          {t('forms.restoreDraftTitle', 'Borrador encontrado')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('forms.restoreDraftMessage', 'Se encontró un borrador guardado anteriormente. ¿Deseas restaurarlo?')}
          </DialogContentText>
          {lastSaved && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {t('forms.savedAt', 'Guardado: {{time}}', { time: lastSaved.toLocaleString() })}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscard} color="error" startIcon={<DeleteIcon />}>
            {t('forms.discardDraft', 'Descartar')}
          </Button>
          <Button onClick={() => setShowRestoreDialog(false)}>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button onClick={handleRestore} variant="contained" startIcon={<RestoreIcon />}>
            {t('forms.restore', 'Restaurar')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Discard confirmation dialog */}
      <Dialog open={showDiscardDialog} onClose={() => setShowDiscardDialog(false)}>
        <DialogTitle>
          {t('forms.discardDraftTitle', 'Descartar borrador')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('forms.discardDraftMessage', '¿Estás seguro de que deseas descartar el borrador? Esta acción no se puede deshacer.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDiscardDialog(false)}>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button onClick={handleDiscard} color="error" variant="contained">
            {t('forms.discardDraft', 'Descartar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormWithDraft;
