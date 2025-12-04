import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as ProjectsIcon,
  AccountBalance as FinanceIcon,
  Inventory as InventoryIcon,
  DirectionsCar as FleetIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: `${color}.light`,
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

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats: employeeStats } = useSelector((state) => state.employees);

  useEffect(() => {
    // Cargar estadísticas de empleados
    import('../store/slices/employeeSlice').then(({ fetchEmployeeStats }) => {
      dispatch(fetchEmployeeStats());
    });
  }, [dispatch]);

  const stats = [
    {
      title: t('dashboard.activeEmployees'),
      value: employeeStats?.active?.toString() || '0',
      icon: <PeopleIcon sx={{ color: 'primary.main', fontSize: 32 }} />,
      color: 'primary',
    },
    {
      title: t('dashboard.activeProjects'),
      value: '0',
      icon: <ProjectsIcon sx={{ color: 'success.main', fontSize: 32 }} />,
      color: 'success',
    },
    {
      title: t('dashboard.generalBalance'),
      value: '$0.00',
      icon: <FinanceIcon sx={{ color: 'warning.main', fontSize: 32 }} />,
      color: 'warning',
    },
    {
      title: t('dashboard.inventoryItems'),
      value: '0',
      icon: <InventoryIcon sx={{ color: 'info.main', fontSize: 32 }} />,
      color: 'info',
    },
    {
      title: t('dashboard.vehicles'),
      value: '0',
      icon: <FleetIcon sx={{ color: 'secondary.main', fontSize: 32 }} />,
      color: 'secondary',
    },
    {
      title: t('dashboard.performance'),
      value: '0%',
      icon: <TrendingUpIcon sx={{ color: 'error.main', fontSize: 32 }} />,
      color: 'error',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {t('dashboard.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.welcome')}, {user?.firstName} {user?.lastName}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.recentActivity')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80%',
                color: 'text.secondary',
              }}
            >
              <Typography>{t('dashboard.noRecentActivity')}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.alerts')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80%',
                color: 'text.secondary',
              }}
            >
              <Typography>{t('dashboard.noPendingAlerts')}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
