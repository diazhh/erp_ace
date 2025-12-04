import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  AccountBalanceWallet as WalletIcon,
  Warning as WarningIcon,
  TrendingDown as ExpenseIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchPettyCashes, fetchPettyCashStats } from '../../store/slices/pettyCashSlice';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  SUSPENDED: 'warning',
  CLOSED: 'error',
};

const statusLabels = {
  ACTIVE: 'Activa',
  INACTIVE: 'Inactiva',
  SUSPENDED: 'Suspendida',
  CLOSED: 'Cerrada',
};

const PettyCashList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pettyCashes, stats, loading } = useSelector((state) => state.pettyCash);

  useEffect(() => {
    dispatch(fetchPettyCashes());
    dispatch(fetchPettyCashStats());
  }, [dispatch]);

  const handleNewPettyCash = () => {
    navigate('/petty-cash/new');
  };

  const handleEditPettyCash = (pettyCash) => {
    navigate(`/petty-cash/${pettyCash.id}/edit`);
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency === 'USDT' ? 'USD' : currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getBalancePercentage = (current, initial) => {
    if (!initial || initial === 0) return 0;
    return Math.min(100, Math.max(0, (current / initial) * 100));
  };

  const getBalanceColor = (current, minimum) => {
    if (current <= minimum) return 'error';
    if (current <= minimum * 1.5) return 'warning';
    return 'success';
  };

  if (loading && pettyCashes.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Caja Chica
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewPettyCash}
        >
          Nueva Caja Chica
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Cajas Activas
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.activeCashes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Saldo Total
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {formatCurrency(stats.totalBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Necesitan Reposición
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={stats.cashesNeedingReplenishment > 0 ? 'error.main' : 'text.primary'}>
                {stats.cashesNeedingReplenishment}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Pendientes Aprobación
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={stats.pendingApproval > 0 ? 'warning.main' : 'text.primary'}>
                {stats.pendingApproval}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Gastos del Mes
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                {formatCurrency(stats.monthlyExpenses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Petty Cash Cards */}
      <Grid container spacing={2}>
        {pettyCashes.map((pettyCash) => {
          const balancePercent = getBalancePercentage(pettyCash.currentBalance, pettyCash.initialAmount);
          const balanceColor = getBalanceColor(pettyCash.currentBalance, pettyCash.minimumBalance);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={pettyCash.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: pettyCash.status === 'ACTIVE' ? 1 : 0.7,
                  border: pettyCash.needsReplenishment ? '2px solid' : 'none',
                  borderColor: 'error.main',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WalletIcon color="primary" />
                      <Box>
                        <Typography variant="h6" fontWeight="medium">
                          {pettyCash.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pettyCash.code}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={statusLabels[pettyCash.status]}
                      color={statusColors[pettyCash.status]}
                      size="small"
                    />
                  </Box>

                  {pettyCash.needsReplenishment && (
                    <Alert severity="warning" sx={{ mb: 2, py: 0 }} icon={<WarningIcon fontSize="small" />}>
                      Necesita reposición
                    </Alert>
                  )}

                  {pettyCash.custodian && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {pettyCash.custodian.firstName} {pettyCash.custodian.lastName}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Saldo
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {balancePercent.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={balancePercent} 
                      color={balanceColor}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography variant="body2" color="text.secondary">
                      Actual
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color={`${balanceColor}.main`}>
                      {formatCurrency(pettyCash.currentBalance, pettyCash.currency)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Inicial: {formatCurrency(pettyCash.initialAmount, pettyCash.currency)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Mínimo: {formatCurrency(pettyCash.minimumBalance, pettyCash.currency)}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                  <Tooltip title="Ver detalle">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => navigate(`/petty-cash/${pettyCash.id}`)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton 
                      size="small"
                      onClick={() => handleEditPettyCash(pettyCash)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {pettyCashes.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <WalletIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No hay cajas chicas registradas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewPettyCash}
            sx={{ mt: 2 }}
          >
            Crear Primera Caja Chica
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PettyCashList;
