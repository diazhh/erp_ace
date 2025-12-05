import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Warning as IncidentIcon,
  CheckCircle as InspectionIcon,
  School as TrainingIcon,
  Security as EquipmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccessTime as PendingIcon,
  Error as AlertIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

import { fetchHSEStats, fetchHSEAlerts } from '../../store/slices/hseSlice';

const severityColors = {
  high: 'error',
  medium: 'warning',
  low: 'info',
};

const HSEDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const { stats, statsLoading, alerts, alertsLoading } = useSelector((state) => state.hse);

  useEffect(() => {
    dispatch(fetchHSEStats());
    dispatch(fetchHSEAlerts());
  }, [dispatch]);

  if (statsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          HSE - Higiene, Seguridad y Ambiente
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Panel de control de seguridad industrial
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Days Without Accident */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight="bold">
                {stats?.incidents?.daysSinceLastAccident ?? '-'}
              </Typography>
              <Typography variant="body1">
                Días sin accidentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Open Incidents */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color={stats?.incidents?.open > 0 ? 'error.main' : 'success.main'}>
                    {stats?.incidents?.open || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Incidentes abiertos
                  </Typography>
                </Box>
                <IncidentIcon sx={{ fontSize: 48, color: 'error.light' }} />
              </Box>
              {stats?.incidents?.critical > 0 && (
                <Chip 
                  label={`${stats.incidents.critical} críticos`} 
                  color="error" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/hse/incidents')}>
                Ver incidentes
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Pending Inspections */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color={stats?.inspections?.overdue > 0 ? 'warning.main' : 'primary.main'}>
                    {stats?.inspections?.pending || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inspecciones pendientes
                  </Typography>
                </Box>
                <InspectionIcon sx={{ fontSize: 48, color: 'primary.light' }} />
              </Box>
              {stats?.inspections?.overdue > 0 && (
                <Chip 
                  label={`${stats.inspections.overdue} vencidas`} 
                  color="warning" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/hse/inspections')}>
                Ver inspecciones
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Upcoming Trainings */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {stats?.trainings?.upcoming || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacitaciones próximas
                  </Typography>
                </Box>
                <TrainingIcon sx={{ fontSize: 48, color: 'info.light' }} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {stats?.trainings?.completed || 0} completadas este año
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/hse/trainings')}>
                Ver capacitaciones
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Second Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Equipment Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.equipment?.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Equipos de seguridad
                  </Typography>
                </Box>
                <EquipmentIcon sx={{ fontSize: 48, color: 'secondary.light' }} />
              </Box>
              {stats?.equipment?.expired > 0 && (
                <Chip 
                  label={`${stats.equipment.expired} vencidos`} 
                  color="error" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/hse/equipment')}>
                Ver equipos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Incidents This Year */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {stats?.incidents?.thisYear || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Incidentes este año
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats?.incidents?.daysLostThisYear || 0} días perdidos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Inspections This Month */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {stats?.inspections?.thisMonth || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inspecciones este mes
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats?.inspections?.withNonConformities || 0} con hallazgos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Training Pass Rate */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats?.trainings?.passRate || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasa de aprobación
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats?.trainings?.totalAttendances || 0} asistencias totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts and Quick Actions */}
      <Grid container spacing={3}>
        {/* Alerts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Alertas y Notificaciones
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {alertsLoading ? (
              <CircularProgress size={24} />
            ) : alerts.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No hay alertas pendientes
              </Typography>
            ) : (
              <List>
                {alerts.slice(0, 10).map((alert, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      bgcolor: alert.severity === 'high' ? 'error.light' : alert.severity === 'medium' ? 'warning.light' : 'info.light',
                      mb: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (alert.entityType === 'incident') navigate(`/hse/incidents/${alert.entityId}`);
                      else if (alert.entityType === 'inspection') navigate(`/hse/inspections/${alert.entityId}`);
                      else if (alert.entityType === 'training') navigate(`/hse/trainings/${alert.entityId}`);
                      else if (alert.entityType === 'equipment') navigate(`/hse/equipment/${alert.entityId}`);
                    }}
                  >
                    <ListItemIcon>
                      <AlertIcon color={severityColors[alert.severity]} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={alert.message}
                      secondary={
                        <Chip 
                          label={alert.type.replace(/_/g, ' ')} 
                          size="small" 
                          color={severityColors[alert.severity]}
                          sx={{ mt: 0.5 }}
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<IncidentIcon />}
                fullWidth
                onClick={() => navigate('/hse/incidents/new')}
              >
                Reportar Incidente
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<InspectionIcon />}
                fullWidth
                onClick={() => navigate('/hse/inspections/new')}
              >
                Programar Inspección
              </Button>
              <Button 
                variant="contained" 
                color="info"
                startIcon={<TrainingIcon />}
                fullWidth
                onClick={() => navigate('/hse/trainings/new')}
              >
                Programar Capacitación
              </Button>
              <Button 
                variant="outlined"
                startIcon={<EquipmentIcon />}
                fullWidth
                onClick={() => navigate('/hse/equipment/new')}
              >
                Registrar Equipo
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HSEDashboard;
