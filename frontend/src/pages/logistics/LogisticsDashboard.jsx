import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalGasStation as TankIcon,
  LocalShipping as TruckIcon,
  Science as QualityIcon,
  Timeline as PipelineIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { fetchLogisticsDashboard } from '../../store/slices/logisticsSlice';

const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: 6 } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 40, color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const TankCapacityCard = ({ tanks }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!tanks || tanks.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('logistics.tankCapacity')}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {tanks.map((tank, index) => {
            const percentage = tank.total_capacity > 0 
              ? (parseFloat(tank.total_volume) / parseFloat(tank.total_capacity)) * 100 
              : 0;
            const color = percentage > 80 ? 'error' : percentage > 60 ? 'warning' : 'success';
            
            return (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{tank.type}</Typography>
                  <Typography variant="body2">
                    {parseFloat(tank.total_volume || 0).toLocaleString()} / {parseFloat(tank.total_capacity || 0).toLocaleString()} bbl
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(percentage, 100)} 
                  color={color}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

const RecentTicketsCard = ({ tickets, onViewAll }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      IN_PROGRESS: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'error',
      VOID: 'error',
    };
    return colors[status] || 'default';
  };

  if (isMobile) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{t('logistics.recentTickets')}</Typography>
            <Button size="small" onClick={onViewAll}>{t('common.viewAll')}</Button>
          </Box>
          {tickets?.map((ticket) => (
            <Card key={ticket.id} variant="outlined" sx={{ mb: 1 }}>
              <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2">{ticket.code}</Typography>
                  <Chip label={ticket.status} size="small" color={getStatusColor(ticket.status)} />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {ticket.sourceTank?.name || '-'} → {ticket.destination || '-'}
                </Typography>
                <Typography variant="body2">
                  {parseFloat(ticket.gross_volume || 0).toLocaleString()} bbl
                </Typography>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{t('logistics.recentTickets')}</Typography>
          <Button size="small" onClick={onViewAll}>{t('common.viewAll')}</Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('logistics.code')}</TableCell>
                <TableCell>{t('logistics.type')}</TableCell>
                <TableCell>{t('logistics.source')}</TableCell>
                <TableCell>{t('logistics.destination')}</TableCell>
                <TableCell align="right">{t('logistics.volume')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets?.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>{ticket.code}</TableCell>
                  <TableCell>{ticket.type}</TableCell>
                  <TableCell>{ticket.sourceTank?.name || '-'}</TableCell>
                  <TableCell>{ticket.destination || ticket.destinationTank?.name || '-'}</TableCell>
                  <TableCell align="right">{parseFloat(ticket.gross_volume || 0).toLocaleString()} bbl</TableCell>
                  <TableCell>
                    <Chip label={ticket.status} size="small" color={getStatusColor(ticket.status)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

const QualitySummaryCard = ({ avgQuality, recentQuality }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('logistics.qualitySummary')}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <Typography variant="body2" color="textSecondary">{t('logistics.avgApi')}</Typography>
            <Typography variant="h6">{parseFloat(avgQuality?.avg_api || 0).toFixed(1)}°</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="textSecondary">{t('logistics.avgBsw')}</Typography>
            <Typography variant="h6">{parseFloat(avgQuality?.avg_bsw || 0).toFixed(2)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="textSecondary">{t('logistics.avgSulfur')}</Typography>
            <Typography variant="h6">{parseFloat(avgQuality?.avg_sulfur || 0).toFixed(2)}%</Typography>
          </Grid>
        </Grid>
        {recentQuality && recentQuality.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>{t('logistics.recentSamples')}</Typography>
            {recentQuality.slice(0, 3).map((sample) => (
              <Box key={sample.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography variant="body2">{sample.code}</Typography>
                <Typography variant="body2">{sample.field?.name || '-'}</Typography>
                <Typography variant="body2">{parseFloat(sample.api_gravity || 0).toFixed(1)}° API</Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const LogisticsDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { dashboard, loading } = useSelector((state) => state.logistics);

  useEffect(() => {
    dispatch(fetchLogisticsDashboard());
  }, [dispatch]);

  const totalTanks = dashboard?.tanksByStatus?.reduce((acc, t) => acc + parseInt(t.count), 0) || 0;
  const activeTanks = dashboard?.tanksByStatus?.find(t => t.status === 'ACTIVE')?.count || 0;
  const volumeThisMonth = dashboard?.volumeThisMonth?.total_volume || 0;
  const ticketsThisMonth = dashboard?.volumeThisMonth?.ticket_count || 0;
  const activePipelines = dashboard?.pipelinesByStatus?.find(p => p.status === 'ACTIVE')?.count || 0;
  const totalPipelineLength = dashboard?.pipelinesByStatus?.reduce((acc, p) => acc + parseFloat(p.total_length || 0), 0) || 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          {t('logistics.dashboard')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/logistics/tickets/new')}
            fullWidth={isMobile}
          >
            {t('logistics.newTicket')}
          </Button>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title={t('logistics.storageTanks')}
            value={totalTanks}
            subtitle={`${activeTanks} ${t('common.active')}`}
            icon={TankIcon}
            color={theme.palette.primary.main}
            onClick={() => navigate('/logistics/tanks')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title={t('logistics.volumeThisMonth')}
            value={`${parseFloat(volumeThisMonth).toLocaleString()}`}
            subtitle={`${ticketsThisMonth} ${t('logistics.tickets')}`}
            icon={TruckIcon}
            color={theme.palette.success.main}
            onClick={() => navigate('/logistics/tickets')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title={t('logistics.qualitySamples')}
            value={dashboard?.recentQuality?.length || 0}
            subtitle={t('logistics.recentAnalyses')}
            icon={QualityIcon}
            color={theme.palette.warning.main}
            onClick={() => navigate('/logistics/quality')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title={t('logistics.pipelines')}
            value={activePipelines}
            subtitle={`${totalPipelineLength.toFixed(1)} km`}
            icon={PipelineIcon}
            color={theme.palette.info.main}
            onClick={() => navigate('/logistics/pipelines')}
          />
        </Grid>

        {/* Tank Capacity */}
        <Grid item xs={12} md={6}>
          <TankCapacityCard tanks={dashboard?.tanksByType} />
        </Grid>

        {/* Quality Summary */}
        <Grid item xs={12} md={6}>
          <QualitySummaryCard 
            avgQuality={dashboard?.avgQuality} 
            recentQuality={dashboard?.recentQuality}
          />
        </Grid>

        {/* Recent Tickets */}
        <Grid item xs={12}>
          <RecentTicketsCard 
            tickets={dashboard?.recentTickets} 
            onViewAll={() => navigate('/logistics/tickets')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LogisticsDashboard;
