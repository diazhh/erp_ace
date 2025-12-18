import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';

import { fetchAccounts } from '../../store/slices/financeSlice';
import { updatePettyCash } from '../../store/slices/pettyCashSlice';

const PettyCashBankAccountDialog = ({ open, onClose, pettyCash }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { accounts } = useSelector((state) => state.finance);
  
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(fetchAccounts());
      setSelectedAccountId(pettyCash?.bankAccountId || '');
    }
  }, [open, dispatch, pettyCash]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(updatePettyCash({
        id: pettyCash.id,
        data: { bankAccountId: selectedAccountId || null }
      })).unwrap();
      toast.success(t('pettyCash.bankAccountUpdated'));
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    try {
      await dispatch(updatePettyCash({
        id: pettyCash.id,
        data: { bankAccountId: null }
      })).unwrap();
      toast.success(t('pettyCash.bankAccountRemoved'));
      onClose(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setSaving(false);
    }
  };

  const compatibleAccounts = accounts?.filter(
    (acc) => acc.isActive && acc.currency === pettyCash?.currency
  ) || [];

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{t('pettyCash.associateBankAccount')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {compatibleAccounts.length === 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {t('pettyCash.noCompatibleAccounts', { currency: pettyCash?.currency })}
            </Alert>
          ) : (
            <TextField
              select
              fullWidth
              label={t('pettyCash.selectBankAccount')}
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              helperText={t('pettyCash.bankAccountHelperText')}
            >
              <MenuItem value="">
                <em>{t('common.none')}</em>
              </MenuItem>
              {compatibleAccounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name} - {account.bankName || t('finance.noBank')} ({account.currency})
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {pettyCash?.bankAccountId && (
          <Button
            onClick={handleRemove}
            color="error"
            disabled={saving}
          >
            {t('pettyCash.removeBankAccount')}
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={() => onClose(false)} disabled={saving}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || compatibleAccounts.length === 0}
          startIcon={saving && <CircularProgress size={20} />}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PettyCashBankAccountDialog;
