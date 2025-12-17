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
  ListItemIcon,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Description as ContractIcon,
  Business as BusinessIcon,
  Map as MapIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fetchContractDashboard } from '../../store/slices/contractSlice';

const COLORS = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'];

const STATUS_COLORS = {
  DRAFT: 'default',
  ACTIVE: 'success',
  SUSPENDED: 'warning',
  EXPIRED: 'error',
  TERMINATED: 'error',
};

const ContractDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { dashboard, dashboardLoading } = useSelector((state) => state.contracts);

  useEffect(() => {
    dispatch(fetchContractDashboard());
  }, [dispatch]);

  if (dashboardLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const contractsByStatusData = dashboard?.contractsByStatus?.map((item) => ({
    name: t(`contracts.status.${item.status?.toLowerCase()}`),
    value: parseInt(item.count),
  })) || [];

  const contractsByTypeData = dashboard?.contractsByType?.map((item) => ({
    name: t(`contracts.types.${item.type?.toLowerCase()}`),
    count: parseInt(item.count),
    total: parseFloat(item.total) || 0,
  })) || [];

  const royaltiesSummary = dashboard?.royaltiesSummary || [];
  const totalRoyaltiesPaid = royaltiesSummary.find(r => r.status === 'PAID')?.total || 0;
  const totalRoyaltiesPending = royaltiesSummary.find(r => r.status === 'PENDING')?.total || 0;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" component="h1">
          {t('contracts.dashboard.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/contracts/new')}
            fullWidth={isMobile}
          >
            {t('contracts.actions.newContract')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<MapIcon />}
            onClick={() => navigate('/contracts/concessions')}
            fullWidth={isMobile}
          >
            {t('contracts.concessions.title')}
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ContractIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  {t('contracts.dashboard.totalContracts')}
                </Typography>
              </Box>
              <Typography variant="h4">{dashboard?.totalContracts || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  {t('contracts.dashboard.activeContracts')}
                </Typography>
              </Box>
              <Typography variant="h4" color="success.main">{dashboard?.activeContracts || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MoneyIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  {t('contracts.dashboard.royaltiesPaid')}
                </Typography>
              </Box>
              <Typography variant="h5">${Number(totalRoyaltiesPaid).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  {t('contracts.dashboard.royaltiesPending')}
                </Typography>
              </Box>
              <Typography variant="h5" color="warning.main">${Number(totalRoyaltiesPending).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Contracts by Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('contracts.dashboard.byStatus')}
            </Typography>
            {contractsByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={contractsByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contractsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height={250}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Contracts by Type */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('contracts.dashboard.byType')}
            </Typography>
            {contractsByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={contractsByTypeData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#2196f3" name={t('contracts.dashboard.count')} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height={250}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Expiring Contracts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WarningIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t('contracts.dashboard.expiringContracts')}
              </Typography>
            </Box>
            {dashboard?.expiringContracts?.length > 0 ? (
              <List dense>
                {dashboard.expiringContracts.map((contract) => (
                  <ListItem
                    key={contract.id}
                    button
                    onClick={() => navigate(`/contracts/${contract.id}`)}
                  >
                    <ListItemIcon>
                      <ContractIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={contract.name}
                      secondary={`${contract.code} - ${t('contracts.fields.endDate')}: ${new Date(contract.end_date).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                {t('contracts.dashboard.noExpiringContracts')}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Contracts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('contracts.dashboard.recentContracts')}
            </Typography>
            {dashboard?.recentContracts?.length > 0 ? (
              <List dense>
                {dashboard.recentContracts.map((contract) => (
                  <ListItem
                    key={contract.id}
                    button
                    onClick={() => navigate(`/contracts/${contract.id}`)}
                  >
                    <ListItemIcon>
                      <ContractIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={contract.name}
                      secondary={contract.code}
                    />
                    <Chip
                      label={t(`contracts.status.${contract.status?.toLowerCase()}`)}
                      color={STATUS_COLORS[contract.status] || 'default'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                {t('common.noData')}
              </Typography>
            )}
            <Divider sx={{ my: 1 }} />
            <Button fullWidth onClick={() => navigate('/contracts/list')}>
              {t('contracts.actions.viewAll')}
            </Button>
          </Paper>
        </Grid>

        {/* Concessions Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MapIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {t('contracts.dashboard.concessionsSummary')}
                </Typography>
              </Box>
              <Button onClick={() => navigate('/contracts/concessions')}>
                {t('contracts.actions.viewAll')}
              </Button>
            </Box>
            <Grid container spacing={2}>
              {dashboard?.concessionsByStatus?.map((item, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                      <Typography variant="h5">{item.count}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t(`contracts.status.${item.status?.toLowerCase()}`)}
                      </Typography>
                      {item.total_area && (
                        <Typography variant="body2">
                          {Number(item.total_area).toLocaleString()} km²
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractDashboard;
