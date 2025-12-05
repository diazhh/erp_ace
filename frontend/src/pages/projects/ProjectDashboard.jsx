import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Skeleton,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Assignment as ProjectIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { fetchProjects } from '../../store/slices/projectSlice';

// Colores para estados
const STATUS_COLORS = {
  PLANNING: '#2196f3',
  IN_PROGRESS: '#4caf50',
  ON_HOLD: '#ff9800',
  COMPLETED: '#9c27b0',
  CANCELLED: '#f44336',
};

const PRIORITY_COLORS = {
  LOW: '#4caf50',
  MEDIUM: '#ff9800',
  HIGH: '#f44336',
  CRITICAL: '#9c27b0',
};

// Formateador de moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Componente de tarjeta de estadística
const StatCard = ({ title, value, subtitle, icon, color, loading, onClick }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" height={40} />
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                color="text.secondary" 
                variant="body2" 
                gutterBottom
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {title}
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight="bold"
                color={color ? `${color}.main` : 'text.primary'}
                sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem' } }}
              >
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
                bgcolor: `${color || 'primary'}.light`,
                borderRadius: 2,
                p: { xs: 1, sm: 1.5 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const ProjectDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { projects, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects({ limit: 100 }));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchProjects({ limit: 100 }));
  };

  // Calcular estadísticas
  const projectList = projects?.data || projects || [];
  const totalProjects = projectList.length;
  const activeProjects = projectList.filter(p => ['PLANNING', 'IN_PROGRESS'].includes(p.status)).length;
  const completedProjects = projectList.filter(p => p.status === 'COMPLETED').length;
  const delayedProjects = projectList.filter(p => {
    if (['COMPLETED', 'CANCELLED'].includes(p.status)) return false;
    return p.endDate && new Date(p.endDate) < new Date();
  }).length;

  // Proyectos por estado
  const projectsByStatus = projectList.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(projectsByStatus).map(([status, count]) => ({
    name: t(`projects.status${status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, '')}`),
    value: count,
    color: STATUS_COLORS[status] || '#999',
  }));

  // Proyectos por prioridad
  const projectsByPriority = projectList.reduce((acc, project) => {
    acc[project.priority] = (acc[project.priority] || 0) + 1;
    return acc;
  }, {});

  const priorityData = Object.entries(projectsByPriority).map(([priority, count]) => ({
    name: t(`projects.priority${priority.charAt(0) + priority.slice(1).toLowerCase()}`),
    value: count,
    color: PRIORITY_COLORS[priority] || '#999',
  }));

  // Presupuesto total
  const totalBudget = projectList.reduce((acc, p) => acc + parseFloat(p.budget || 0), 0);
  const totalSpent = projectList.reduce((acc, p) => acc + parseFloat(p.actualCost || 0), 0);
  const budgetUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Proyectos recientes o atrasados
  const recentProjects = [...projectList]
    .filter(p => !['COMPLETED', 'CANCELLED'].includes(p.status))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  // KPIs
  const kpiCards = [
    {
      title: t('projects.total'),
      value: totalProjects.toString(),
      subtitle: t('projects.title'),
      icon: <ProjectIcon sx={{ color: 'primary.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'primary',
    },
    {
      title: t('projects.active'),
      value: activeProjects.toString(),
      subtitle: `${((activeProjects / totalProjects) * 100 || 0).toFixed(0)}% ${t('common.total').toLowerCase()}`,
      icon: <TrendingUpIcon sx={{ color: 'success.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'success',
    },
    {
      title: t('projects.statusCompleted'),
      value: completedProjects.toString(),
      subtitle: `${((completedProjects / totalProjects) * 100 || 0).toFixed(0)}% ${t('common.total').toLowerCase()}`,
      icon: <CheckCircleIcon sx={{ color: 'info.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: 'info',
    },
    {
      title: t('projects.delayed'),
      value: delayedProjects.toString(),
      subtitle: delayedProjects > 0 ? t('dashboard.alerts') : t('common.status'),
      icon: <WarningIcon sx={{ color: delayedProjects > 0 ? 'error.main' : 'success.main', fontSize: { xs: 24, sm: 32 } }} />,
      color: delayedProjects > 0 ? 'error' : 'success',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3,
        gap: 2,
      }}>
        <Box>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
            {t('projects.dashboard')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('projects.dashboardSubtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title={t('dashboard.refresh')}>
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
            size={isMobile ? 'small' : 'medium'}
          >
            {isMobile ? t('common.create') : t('projects.newProject')}
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
        {kpiCards.map((card, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Presupuesto General */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('dashboard.projectBudget')}
        </Typography>
        {loading ? (
          <Skeleton variant="rectangular" height={80} />
        ) : (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('projects.budget')}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatCurrency(totalBudget)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('projects.actualCost')}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={budgetUsage > 100 ? 'error.main' : 'success.main'}>
                  {formatCurrency(totalSpent)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('dashboard.remaining')}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={totalBudget - totalSpent >= 0 ? 'success.main' : 'error.main'}>
                  {formatCurrency(totalBudget - totalSpent)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('projects.budgetUsage')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {budgetUsage.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(budgetUsage, 100)}
                sx={{ height: 10, borderRadius: 5 }}
                color={budgetUsage > 90 ? 'error' : budgetUsage > 70 ? 'warning' : 'success'}
              />
            </Box>
          </Box>
        )}
      </Paper>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Proyectos por Estado */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.projectsByStatus')}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="85%" />
            ) : statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 50}
                    outerRadius={isMobile ? 70 : 80}
                    paddingAngle={2}
                    dataKey="value"
                    label={!isMobile}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Proyectos por Prioridad */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              {t('projects.byPriority')}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="85%" />
            ) : priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={priorityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="value" name={t('projects.title')}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Proyectos Activos */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('projects.activeProjects')}
              </Typography>
              <IconButton size="small" onClick={() => navigate('/projects')}>
                <ArrowForwardIcon />
              </IconButton>
            </Box>
            {loading ? (
              <>
                <Skeleton variant="text" height={60} />
                <Skeleton variant="text" height={60} />
                <Skeleton variant="text" height={60} />
              </>
            ) : recentProjects.length > 0 ? (
              <List disablePadding>
                {recentProjects.map((project, index) => (
                  <Box key={project.id}>
                    <ListItem 
                      sx={{ px: 0, cursor: 'pointer' }}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: STATUS_COLORS[project.status] || 'grey.500' }}>
                          <ProjectIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {project.name}
                            </Typography>
                            <Chip 
                              label={t(`projects.status${project.status.charAt(0) + project.status.slice(1).toLowerCase().replace(/_/g, '')}`)}
                              size="small"
                              sx={{ 
                                bgcolor: STATUS_COLORS[project.status],
                                color: 'white',
                              }}
                            />
                            {project.endDate && new Date(project.endDate) < new Date() && project.status !== 'COMPLETED' && (
                              <Chip label={t('projects.delayed')} size="small" color="error" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {t('projects.code')}: {project.code}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t('projects.budget')}: {formatCurrency(project.budget || 0)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t('projects.progress')}: {project.progress || 0}%
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentProjects.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                {t('projects.noProjects')}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDashboard;
