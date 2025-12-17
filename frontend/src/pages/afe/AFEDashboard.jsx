import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  Pending as PendingIcon,
  CheckCircle as ApprovedIcon,
  PlayArrow as InProgressIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fetchAFEDashboard } from '../../store/slices/afeSlice';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28'];

const AFEDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { dashboard, dashboardLoading } = useSelector((state) => state.afe);

  useEffect(() => {
    dispatch(fetchAFEDashboard());
  }, [dispatch]);

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
      IN_PROGRESS: 'info',
      CLOSED: 'secondary',
    };
    return colors[status] || 'default';
  };

  if (dashboardLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const statusData = dashboard?.statusCounts?.map((s) => ({
    name: t(`afe.status.${s.status}`),
    value: parseInt(s.count),
    total: parseFloat(s.total_estimated) || 0,
  })) || [];

  const typeData = dashboard?.byType?.map((t_) => ({
    name: t(`afe.type.${t_.type}`),
    count: parseInt(t_.count),
    total: parseFloat(t_.total) || 0,
  })) || [];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          {t('afe.dashboard')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ListIcon />}
            onClick={() => navigate('/afe/list')}
          >
            {t('afe.viewAll')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/afe/new')}
          >
            {t('afe.new')}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MoneyIcon />
                <Typography variant="body2">{t('afe.activeBudget')}</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(dashboard?.activeAFEs?.total_budget)}
              </Typography>
              <Typography variant="body2">
                {dashboard?.activeAFEs?.count || 0} {t('afe.activeAfes')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InProgressIcon />
                <Typography variant="body2">{t('afe.totalExpenses')}</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(dashboard?.totalExpenses)}
              </Typography>
              <Typography variant="body2">{t('afe.approvedExpenses')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PendingIcon />
                <Typography variant="body2">{t('afe.pendingApprovals')}</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {dashboard?.pendingApprovals || 0}
              </Typography>
              <Typography variant="body2">{t('afe.awaitingReview')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ApprovedIcon />
                <Typography variant="body2">{t('afe.approved')}</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {statusData.find((s) => s.name === t('afe.status.APPROVED'))?.value || 0}
              </Typography>
              <Typography variant="body2">{t('afe.readyToExecute')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              {t('afe.byStatus')}
            </Typography>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              {t('afe.byType')}
            </Typography>
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={typeData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'count' ? value : formatCurrency(value),
                      name === 'count' ? t('afe.count') : t('afe.total'),
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name={t('afe.count')} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('afe.recentAfes')}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('afe.code')}</TableCell>
                    <TableCell>{t('afe.titleField')}</TableCell>
                    <TableCell align="right">{t('afe.estimatedCost')}</TableCell>
                    <TableCell>{t('common.status')}</TableCell>
                    <TableCell>{t('common.date')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboard?.recentAFEs?.map((afe) => (
                    <TableRow
                      key={afe.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/afe/${afe.id}`)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {afe.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{afe.title}</TableCell>
                      <TableCell align="right">{formatCurrency(afe.estimated_cost)}</TableCell>
                      <TableCell>
                        <Chip
                          label={t(`afe.status.${afe.status}`)}
                          color={getStatusColor(afe.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(afe.created_at).toLocaleDateString('es-VE')}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!dashboard?.recentAFEs || dashboard.recentAFEs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          {t('common.noData')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AFEDashboard;
