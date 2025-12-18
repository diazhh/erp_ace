import { useState, useEffect, useCallback } from 'react';
import { TextField, InputAdornment, CircularProgress } from '@mui/material';
import { Check as CheckIcon, Error as ErrorIcon } from '@mui/icons-material';

const ValidatedTextField = ({
  value,
  onChange,
  validate,
  asyncValidate,
  debounceMs = 500,
  showValidationIcon = true,
  helperText,
  error: externalError,
  ...props
}) => {
  const [internalError, setInternalError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);

  // Sync validation
  const runSyncValidation = useCallback((val) => {
    if (!validate) return true;
    
    const result = validate(val);
    if (typeof result === 'string') {
      setInternalError(result);
      setIsValid(false);
      return false;
    } else if (result === false) {
      setInternalError('Valor inválido');
      setIsValid(false);
      return false;
    }
    
    setInternalError('');
    return true;
  }, [validate]);

  // Async validation with debounce
  useEffect(() => {
    if (!asyncValidate || !touched || !value) return;

    const syncValid = runSyncValidation(value);
    if (!syncValid) return;

    setIsValidating(true);
    const timer = setTimeout(async () => {
      try {
        const result = await asyncValidate(value);
        if (typeof result === 'string') {
          setInternalError(result);
          setIsValid(false);
        } else if (result === false) {
          setInternalError('Valor inválido');
          setIsValid(false);
        } else {
          setInternalError('');
          setIsValid(true);
        }
      } catch (err) {
        setInternalError(err.message || 'Error de validación');
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, asyncValidate, debounceMs, touched, runSyncValidation]);

  // Sync validation on change
  useEffect(() => {
    if (touched && validate && !asyncValidate) {
      const valid = runSyncValidation(value);
      setIsValid(valid);
    }
  }, [value, validate, asyncValidate, touched, runSyncValidation]);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = (e) => {
    setTouched(true);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const showError = touched && (externalError || internalError);
  const displayHelperText = showError ? (externalError || internalError) : helperText;

  // Determine end adornment
  let endAdornment = props.InputProps?.endAdornment;
  if (showValidationIcon && touched && value) {
    if (isValidating) {
      endAdornment = (
        <InputAdornment position="end">
          <CircularProgress size={20} />
        </InputAdornment>
      );
    } else if (isValid && !showError) {
      endAdornment = (
        <InputAdornment position="end">
          <CheckIcon color="success" />
        </InputAdornment>
      );
    } else if (showError) {
      endAdornment = (
        <InputAdornment position="end">
          <ErrorIcon color="error" />
        </InputAdornment>
      );
    }
  }

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!showError}
      helperText={displayHelperText}
      InputProps={{
        ...props.InputProps,
        endAdornment,
        'aria-invalid': !!showError,
        'aria-describedby': showError ? `${props.id || props.name}-error` : undefined,
      }}
    />
  );
};

export default ValidatedTextField;
