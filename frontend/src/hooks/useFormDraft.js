import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveDraft, loadDraft, clearDraft } from '../store/slices/uiSlice';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const DEFAULT_DEBOUNCE_MS = 2000;
const DRAFT_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const useFormDraft = (formId, options = {}) => {
  const {
    debounceMs = DEFAULT_DEBOUNCE_MS,
    onRestore = null,
    showToast = true,
    expiryMs = DRAFT_EXPIRY_MS,
  } = options;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { formDrafts } = useSelector((state) => state.ui);
  
  const [hasDraft, setHasDraft] = useState(false);
  const [draftData, setDraftData] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const debounceTimerRef = useRef(null);
  const lastDataRef = useRef(null);

  // Load draft on mount
  useEffect(() => {
    dispatch(loadDraft(formId));
  }, [dispatch, formId]);

  // Check for existing draft
  useEffect(() => {
    const draft = formDrafts[formId];
    if (draft) {
      const isExpired = Date.now() - draft.timestamp > expiryMs;
      if (isExpired) {
        dispatch(clearDraft(formId));
        setHasDraft(false);
        setDraftData(null);
      } else {
        setHasDraft(true);
        setDraftData(draft.data);
        setLastSaved(new Date(draft.timestamp));
      }
    } else {
      setHasDraft(false);
      setDraftData(null);
    }
  }, [formDrafts, formId, expiryMs, dispatch]);

  // Save draft with debounce
  const saveDraftData = useCallback((data) => {
    // Skip if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(lastDataRef.current)) {
      return;
    }
    
    lastDataRef.current = data;
    setIsSaving(true);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      dispatch(saveDraft({ formId, data }));
      setLastSaved(new Date());
      setIsSaving(false);
      setHasDraft(true);
      
      if (showToast) {
        toast.info(t('forms.draftSaved', 'Borrador guardado'), {
          autoClose: 1500,
          hideProgressBar: true,
        });
      }
    }, debounceMs);
  }, [dispatch, formId, debounceMs, showToast, t]);

  // Restore draft
  const restoreDraft = useCallback(() => {
    if (draftData && onRestore) {
      onRestore(draftData);
      if (showToast) {
        toast.success(t('forms.draftRestored', 'Borrador restaurado'));
      }
    }
    return draftData;
  }, [draftData, onRestore, showToast, t]);

  // Discard draft
  const discardDraft = useCallback(() => {
    dispatch(clearDraft(formId));
    setHasDraft(false);
    setDraftData(null);
    lastDataRef.current = null;
    
    if (showToast) {
      toast.info(t('forms.draftDiscarded', 'Borrador descartado'));
    }
  }, [dispatch, formId, showToast, t]);

  // Clear draft (on successful submit)
  const clearFormDraft = useCallback(() => {
    dispatch(clearDraft(formId));
    setHasDraft(false);
    setDraftData(null);
    lastDataRef.current = null;
  }, [dispatch, formId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    hasDraft,
    draftData,
    lastSaved,
    isSaving,
    saveDraftData,
    restoreDraft,
    discardDraft,
    clearFormDraft,
  };
};

export default useFormDraft;
