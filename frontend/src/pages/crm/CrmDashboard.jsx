import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Business as ClientIcon,
  TrendingUp as OpportunityIcon,
  Description as QuoteIcon,
  Add as AddIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { fetchCrmStats, fetchClients, fetchOpportunities } from '../../store/slices/crmSlice';

const stageLabels = {
  LEAD: 'Prospecto',
  QUALIFIED: 'Calificado',
  PROPOSAL: 'Propuesta',
  NEGOTIATION: 'Negociación',
  WON: 'Ganada',
  LOST: 'Perdida',
};

const stageColors = {
  LEAD: '#9e9e9e',
  QUALIFIED: '#2196f3',
  PROPOSAL: '#3f51b5',
  NEGOTIATION: '#ff9800',
  WON: '#4caf50',
  LOST: '#f44336',
};

const CrmDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { stats, clients, opportunities, loading, error } = useSelector((state) => state.crm);

  useEffect(() => {
    dispatch(fetchCrmStats());
    dispatch(fetchClients({ limit: 5 }));
    dispatch(fetchOpportunities({ limit: 5 }));
  }, [dispatch]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          CRM - Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/crm/clients/new')}>
            Nuevo Cliente
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/crm/opportunities/new')}>
            Nueva Oportunidad
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ClientIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats?.totalClients || 0}</Typography>
                  <Typography variant="body2">Clientes Totales</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats?.activeClients || 0} activos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <OpportunityIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats?.totalOpportunities || 0}</Typography>
                  <Typography variant="body2">Oportunidades</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats?.openOpportunities || 0} abiertas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <QuoteIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats?.totalQuotes || 0}</Typography>
                  <Typography variant="body2">Cotizaciones</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats?.pendingQuotes || 0} pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Pipeline por Etapa</Typography>
              {stats?.pipelineByStage?.map((stage) => (
                <Box key={stage.stage} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{stageLabels[stage.stage] || stage.stage}</Typography>
                  <Typography variant="body2" fontWeight="bold">{stage.count}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pipeline Visual */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pipeline de Ventas
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'].map((stage) => {
            const stageData = stats?.pipelineByStage?.find(s => s.stage === stage) || { count: 0, value: 0 };
            return (
              <Paper
                key={stage}
                sx={{
                  minWidth: 150,
                  p: 2,
                  textAlign: 'center',
                  bgcolor: `${stageColors[stage]}15`,
                  borderTop: `4px solid ${stageColors[stage]}`,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {stageLabels[stage]}
                </Typography>
                <Typography variant="h4" sx={{ color: stageColors[stage] }}>
                  {stageData.count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(stageData.value)}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Paper>

      {/* Listas recientes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Clientes Recientes</Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/crm/clients')}>
                Ver todos
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {clients.slice(0, 5).map((client) => (
              <Box
                key={client.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => navigate(`/crm/clients/${client.id}`)}
              >
                <Box>
                  <Typography fontWeight="bold">{client.code}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {client.companyName || client.tradeName || `${client.firstName} ${client.lastName}`}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {client.status}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Oportunidades Recientes</Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/crm/opportunities')}>
                Ver todas
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {opportunities.slice(0, 5).map((opp) => (
              <Box
                key={opp.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => navigate(`/crm/opportunities/${opp.id}`)}
              >
                <Box>
                  <Typography fontWeight="bold">{opp.code}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {opp.title}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ color: stageColors[opp.stage] }}>
                    {stageLabels[opp.stage]}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(opp.estimatedValue)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CrmDashboard;
