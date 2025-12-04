import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Business as BusinessIcon,
} from '@mui/icons-material';

import { login, clearError } from '../store/slices/authSlice';
import LanguageSelector from '../components/LanguageSelector';

const Login = () => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(credentials));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <LanguageSelector />
          </Box>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <BusinessIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {t('common.appName')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('common.appDescription')}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label={t('auth.username')}
              name="username"
              fullWidth
              margin="normal"
              value={credentials.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
              required
            />
            <TextField
              label={t('auth.password')}
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('auth.loginButton')
              )}
            </Button>
          </form>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 3 }}
          >
            {t('auth.defaultCredentials')}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
