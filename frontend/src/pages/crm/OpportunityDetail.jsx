import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  TrendingUp as OpportunityIcon,
  Business as ClientIcon,
  Description as QuoteIcon,
  Event as ActivityIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { fetchOpportunityById, clearCurrentOpportunity } from '../../store/slices/crmSlice';

const stageColors = {
  LEAD: 'default',
  QUALIFIED: 'info',
  PROPOSAL: 'primary',
  NEGOTIATION: 'warning',
  WON: 'success',
  LOST: 'error',
};

const stageLabels = {
  LEAD: 'Prospecto',
  QUALIFIED: 'Calificado',
  PROPOSAL: 'Propuesta',
  NEGOTIATION: 'Negociación',
  WON: 'Ganada',
  LOST: 'Perdida',
};

const priorityColors = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'error',
};

const priorityLabels = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

const quoteStatusLabels = {
  DRAFT: 'Borrador',
  SENT: 'Enviada',
  VIEWED: 'Vista',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
  EXPIRED: 'Expirada',
  REVISED: 'Revisada',
};

const activityTypeLabels = {
  CALL: 'Llamada',
  EMAIL: 'Email',
  MEETING: 'Reunión',
  TASK: 'Tarea',
  NOTE: 'Nota',
  FOLLOW_UP: 'Seguimiento',
};

const OpportunityDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentOpportunity, loading, error } = useSelector((state) => state.crm);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchOpportunityById(id));
    return () => {
      dispatch(clearCurrentOpportunity());
    };
  }, [dispatch, id]);

  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-VE');
  };

  if (loading || !currentOpportunity) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const getClientName = () => {
    const client = currentOpportunity.client;
    if (!client) return '-';
    if (client.clientType === 'COMPANY') {
      return client.companyName || client.tradeName || '-';
    }
    return `${client.firstName || ''} ${client.lastName || ''}`.trim() || '-';
  };

  const renderInfoTab = () => (
    <Grid container spacing={3}>
      {/* Información General */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <OpportunityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Información General
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={4}><Typography color="text.secondary">Código:</Typography></Grid>
              <Grid item xs={8}><Typography fontWeight="bold">{currentOpportunity.code}</Typography></Grid>

              <Grid item xs={4}><Typography color="text.secondary">Título:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentOpportunity.title}</Typography></Grid>

              <Grid item xs={4}><Typography color="text.secondary">Etapa:</Typography></Grid>
              <Grid item xs={8}>
                <Chip
                  label={stageLabels[currentOpportunity.stage]}
                  color={stageColors[currentOpportunity.stage]}
                  size="small"
                />
              </Grid>

              <Grid item xs={4}><Typography color="text.secondary">Prioridad:</Typography></Grid>
              <Grid item xs={8}>
                <Chip
                  label={priorityLabels[currentOpportunity.priority]}
                  color={priorityColors[currentOpportunity.priority]}
                  size="small"
                />
              </Grid>

              <Grid item xs={4}><Typography color="text.secondary">Origen:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentOpportunity.source || '-'}</Typography></Grid>

              <Grid item xs={4}><Typography color="text.secondary">Competidor:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentOpportunity.competitor || '-'}</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Valor y Probabilidad */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Valor y Probabilidad
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={5}><Typography color="text.secondary">Valor Estimado:</Typography></Grid>
              <Grid item xs={7}>
                <Typography variant="h5" color="primary">
                  {formatCurrency(currentOpportunity.estimatedValue, currentOpportunity.currency)}
                </Typography>
              </Grid>

              <Grid item xs={5}><Typography color="text.secondary">Probabilidad:</Typography></Grid>
              <Grid item xs={7}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={currentOpportunity.probability || 0}
                    sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                  />
                  <Typography>{currentOpportunity.probability || 0}%</Typography>
                </Box>
              </Grid>

              <Grid item xs={5}><Typography color="text.secondary">Valor Ponderado:</Typography></Grid>
              <Grid item xs={7}>
                <Typography fontWeight="bold">
                  {formatCurrency(
                    (currentOpportunity.estimatedValue || 0) * (currentOpportunity.probability || 0) / 100,
                    currentOpportunity.currency
                  )}
                </Typography>
              </Grid>

              <Grid item xs={5}><Typography color="text.secondary">Cierre Esperado:</Typography></Grid>
              <Grid item xs={7}><Typography>{formatDate(currentOpportunity.expectedCloseDate)}</Typography></Grid>

              {currentOpportunity.actualCloseDate && (
                <>
                  <Grid item xs={5}><Typography color="text.secondary">Cierre Real:</Typography></Grid>
                  <Grid item xs={7}><Typography>{formatDate(currentOpportunity.actualCloseDate)}</Typography></Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Cliente */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <ClientIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Cliente
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {currentOpportunity.client ? (
              <Grid container spacing={1}>
                <Grid item xs={4}><Typography color="text.secondary">Código:</Typography></Grid>
                <Grid item xs={8}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/crm/clients/${currentOpportunity.client.id}`)}
                  >
                    {currentOpportunity.client.code}
                  </Button>
                </Grid>

                <Grid item xs={4}><Typography color="text.secondary">Nombre:</Typography></Grid>
                <Grid item xs={8}><Typography>{getClientName()}</Typography></Grid>

                <Grid item xs={4}><Typography color="text.secondary">Email:</Typography></Grid>
                <Grid item xs={8}><Typography>{currentOpportunity.client.email || '-'}</Typography></Grid>

                <Grid item xs={4}><Typography color="text.secondary">Teléfono:</Typography></Grid>
                <Grid item xs={8}><Typography>{currentOpportunity.client.phone || '-'}</Typography></Grid>
              </Grid>
            ) : (
              <Typography color="text.secondary">Sin cliente asignado</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Descripción y Notas */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Descripción y Notas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {currentOpportunity.description && (
              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" gutterBottom>Descripción:</Typography>
                <Typography>{currentOpportunity.description}</Typography>
              </Box>
            )}
            {currentOpportunity.notes && (
              <Box>
                <Typography color="text.secondary" gutterBottom>Notas:</Typography>
                <Typography>{currentOpportunity.notes}</Typography>
              </Box>
            )}
            {currentOpportunity.lostReason && (
              <Box sx={{ mt: 2 }}>
                <Typography color="error" gutterBottom>Razón de Pérdida:</Typography>
                <Typography>{currentOpportunity.lostReason}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderQuotesTab = () => (
    currentOpportunity.quotes?.length === 0 ? (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No hay cotizaciones para esta oportunidad</Typography>
      </Paper>
    ) : isMobile ? (
      <Box>
        {currentOpportunity.quotes?.map((quote) => (
          <Card key={quote.id} variant="outlined" sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/crm/quotes/${quote.id}`)}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">{quote.code}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(quote.quoteDate)}
                  </Typography>
                </Box>
                <Chip label={quoteStatusLabels[quote.status]} size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Válida: {formatDate(quote.validUntil)}
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatCurrency(quote.totalAmount, quote.currency)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Válida Hasta</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOpportunity.quotes?.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{quote.code}</TableCell>
                <TableCell>{formatDate(quote.quoteDate)}</TableCell>
                <TableCell>
                  <Chip label={quoteStatusLabels[quote.status]} size="small" />
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(quote.totalAmount, quote.currency)}
                </TableCell>
                <TableCell>{formatDate(quote.validUntil)}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => navigate(`/crm/quotes/${quote.id}`)}>
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );

  const renderActivitiesTab = () => (
    currentOpportunity.activities?.length === 0 ? (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No hay actividades registradas</Typography>
      </Paper>
    ) : isMobile ? (
      <Box>
        {currentOpportunity.activities?.map((activity) => (
          <Card key={activity.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {activityTypeLabels[activity.activityType] || activity.activityType}
                  </Typography>
                  <Typography variant="body2">{activity.subject}</Typography>
                </Box>
                <Chip
                  label={activity.status === 'COMPLETED' ? 'Completada' : 'Pendiente'}
                  color={activity.status === 'COMPLETED' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(activity.scheduledAt)}
              </Typography>
              {activity.outcome && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Resultado: {activity.outcome}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Asunto</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Resultado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOpportunity.activities?.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activityTypeLabels[activity.activityType] || activity.activityType}</TableCell>
                <TableCell>{activity.subject}</TableCell>
                <TableCell>{formatDateTime(activity.scheduledAt)}</TableCell>
                <TableCell>
                  <Chip
                    label={activity.status === 'COMPLETED' ? 'Completada' : 'Pendiente'}
                    color={activity.status === 'COMPLETED' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{activity.outcome || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/crm/opportunities')}>
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            <OpportunityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {currentOpportunity.code} - {currentOpportunity.title}
          </Typography>
          <Chip
            label={stageLabels[currentOpportunity.stage]}
            color={stageColors[currentOpportunity.stage]}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/crm/opportunities/${id}/edit`)}
        >
          Editar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Información" />
          <Tab label={`Cotizaciones (${currentOpportunity.quotes?.length || 0})`} />
          <Tab label={`Actividades (${currentOpportunity.activities?.length || 0})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && renderInfoTab()}
      {activeTab === 1 && renderQuotesTab()}
      {activeTab === 2 && renderActivitiesTab()}
    </Box>
  );
};

export default OpportunityDetail;
