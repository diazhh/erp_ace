import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmColor = 'error',
  loading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title || t('common.confirm')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          {cancelText || t('common.cancel')}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (confirmText || t('common.confirm'))}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
