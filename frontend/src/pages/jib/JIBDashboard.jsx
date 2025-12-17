import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  AttachMoney as MoneyIcon,
  Gavel as DisputeIcon,
} from '@mui/icons-material';
import { fetchJIBDashboard } from '../../store/slices/jibSlice';

const StatCard = ({ title, value, subtitle, icon, color = 'primary', onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: 4 } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const JIBDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { dashboard, dashboardLoading } = useSelector((state) => state.jib);

  useEffect(() => {
    dispatch(fetchJIBDashboard());
  }, [dispatch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      SENT: 'info',
      PARTIALLY_PAID: 'warning',
      PAID: 'success',
      DISPUTED: 'error',
      FUNDED: 'success',
      PARTIALLY_FUNDED: 'warning',
      OVERDUE: 'error',
    };
    return colors[status] || 'default';
  };

  if (dashboardLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const jibStats = dashboard?.jib || {};
  const cashCallStats = dashboard?.cashCall || {};

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('jib.dashboard.title', 'Joint Interest Billing')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate('/jib/cash-calls/new')}
            fullWidth={isMobile}
          >
            {t('jib.cashCall.new', 'Nuevo Cash Call')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/jib/billings/new')}
            fullWidth={isMobile}
          >
            {t('jib.billing.new', 'Nuevo JIB')}
          </Button>
        </Box>
      </Box>

      {/* JIB Stats */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        {t('jib.dashboard.jibSection', 'Facturación JIB')}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('jib.dashboard.totalBilled', 'Total Facturado')}
            value={formatCurrency(jibStats.totalBilled)}
            icon={<ReceiptIcon sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('jib.dashboard.totalCollected', 'Total Cobrado')}
            value={formatCurrency(jibStats.totalCollected)}
            subtitle={`${jibStats.collectionRate || 0}% ${t('jib.dashboard.collectionRate', 'tasa cobro')}`}
            icon={<MoneyIcon sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('jib.dashboard.pendingJIBs', 'JIBs Pendientes')}
            value={jibStats.pending || 0}
            subtitle={`${jibStats.overdue || 0} ${t('jib.dashboard.overdue', 'vencidos')}`}
            icon={<WarningIcon sx={{ color: 'warning.main' }} />}
            color="warning"
            onClick={() => navigate('/jib/billings?status=SENT')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('jib.dashboard.disputed', 'En Disputa')}
            value={jibStats.disputed || 0}
            icon={<DisputeIcon sx={{ color: 'error.main' }} />}
            color="error"
            onClick={() => navigate('/jib/billings?status=DISPUTED')}
          />
        </Grid>
      </Grid>

      {/* Cash Call Stats */}
      <Typography variant="h6" gutterBottom>
        {t('jib.dashboard.cashCallSection', 'Cash Calls')}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('jib.dashboard.totalCalled', 'Total Solicitado')}
            value={formatCurrency(cashCallStats.totalCalled)}
            icon={<AccountBalanceIcon sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('jib.dashboard.totalFunded', 'Total Fondeado')}
            value={formatCurrency(cashCallStats.totalFunded)}
            subtitle={`${cashCallStats.fundingRate || 0}% ${t('jib.dashboard.fundingRate', 'tasa fondeo')}`}
            icon={<TrendingUpIcon sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('jib.dashboard.pendingCashCalls', 'Cash Calls Pendientes')}
            value={cashCallStats.pending || 0}
            subtitle={`${cashCallStats.overdue || 0} ${t('jib.dashboard.overdue', 'vencidos')}`}
            icon={<WarningIcon sx={{ color: 'warning.main' }} />}
            color="warning"
            onClick={() => navigate('/jib/cash-calls?status=SENT')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('jib.dashboard.defaulted', 'En Default')}
            value={cashCallStats.defaulted || 0}
            icon={<DisputeIcon sx={{ color: 'error.main' }} />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Recent Items */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('jib.dashboard.recentJIBs', 'JIBs Recientes')}
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/jib/billings')}
              >
                {t('common.viewAll', 'Ver todos')}
              </Button>
            </Box>
            <List>
              {(dashboard?.recentJIBs || []).map((jib, index) => (
                <Box key={jib.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    button
                    onClick={() => navigate(`/jib/billings/${jib.id}`)}
                    sx={{ px: 0 }}
                  >
                    <ListItemText
                      primary={jib.code}
                      secondary={formatCurrency(jib.total_costs)}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={t(`jib.status.${jib.status}`, jib.status)}
                        size="small"
                        color={getStatusColor(jib.status)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </Box>
              ))}
              {(!dashboard?.recentJIBs || dashboard.recentJIBs.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  {t('jib.dashboard.noRecentJIBs', 'No hay JIBs recientes')}
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('jib.dashboard.recentCashCalls', 'Cash Calls Recientes')}
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/jib/cash-calls')}
              >
                {t('common.viewAll', 'Ver todos')}
              </Button>
            </Box>
            <List>
              {(dashboard?.recentCashCalls || []).map((cc, index) => (
                <Box key={cc.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    button
                    onClick={() => navigate(`/jib/cash-calls/${cc.id}`)}
                    sx={{ px: 0 }}
                  >
                    <ListItemText
                      primary={cc.code}
                      secondary={`${cc.title} - ${formatCurrency(cc.total_amount)}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={t(`jib.status.${cc.status}`, cc.status)}
                        size="small"
                        color={getStatusColor(cc.status)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </Box>
              ))}
              {(!dashboard?.recentCashCalls || dashboard.recentCashCalls.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  {t('jib.dashboard.noRecentCashCalls', 'No hay Cash Calls recientes')}
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JIBDashboard;
