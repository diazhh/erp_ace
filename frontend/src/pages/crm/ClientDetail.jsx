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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebIcon,
  LocationOn as LocationIcon,
  TrendingUp as OpportunityIcon,
  Description as QuoteIcon,
  ContactPhone as ContactIcon,
} from '@mui/icons-material';
import { fetchClientById, clearCurrentClient } from '../../store/slices/crmSlice';

const statusColors = {
  PROSPECT: 'info',
  ACTIVE: 'success',
  INACTIVE: 'default',
  SUSPENDED: 'error',
};

const statusLabels = {
  PROSPECT: 'Prospecto',
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  SUSPENDED: 'Suspendido',
};

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

const quoteStatusLabels = {
  DRAFT: 'Borrador',
  SENT: 'Enviada',
  VIEWED: 'Vista',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
  EXPIRED: 'Expirada',
  REVISED: 'Revisada',
};

const ClientDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentClient, loading, error } = useSelector((state) => state.crm);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchClientById(id));
    return () => {
      dispatch(clearCurrentClient());
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

  if (loading || !currentClient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const getClientName = () => {
    if (currentClient.clientType === 'COMPANY') {
      return currentClient.companyName || currentClient.tradeName || '-';
    }
    return `${currentClient.firstName || ''} ${currentClient.lastName || ''}`.trim() || '-';
  };

  const renderInfoTab = () => (
    <Grid container spacing={3}>
      {/* Información General */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {currentClient.clientType === 'COMPANY' ? (
                <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              ) : (
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              )}
              Información General
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={4}><Typography color="text.secondary">Código:</Typography></Grid>
              <Grid item xs={8}><Typography fontWeight="bold">{currentClient.code}</Typography></Grid>
              
              <Grid item xs={4}><Typography color="text.secondary">Nombre:</Typography></Grid>
              <Grid item xs={8}><Typography>{getClientName()}</Typography></Grid>
              
              {currentClient.clientType === 'COMPANY' && currentClient.tradeName && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Nombre Comercial:</Typography></Grid>
                  <Grid item xs={8}><Typography>{currentClient.tradeName}</Typography></Grid>
                </>
              )}
              
              <Grid item xs={4}><Typography color="text.secondary">{currentClient.clientType === 'COMPANY' ? 'RIF:' : 'Cédula:'}</Typography></Grid>
              <Grid item xs={8}><Typography>{currentClient.taxId || currentClient.idNumber || '-'}</Typography></Grid>
              
              {currentClient.industry && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Industria:</Typography></Grid>
                  <Grid item xs={8}><Typography>{currentClient.industry}</Typography></Grid>
                </>
              )}
              
              <Grid item xs={4}><Typography color="text.secondary">Estado:</Typography></Grid>
              <Grid item xs={8}>
                <Chip label={statusLabels[currentClient.status]} color={statusColors[currentClient.status]} size="small" />
              </Grid>
              
              <Grid item xs={4}><Typography color="text.secondary">Categoría:</Typography></Grid>
              <Grid item xs={8}>
                {currentClient.category ? (
                  <Chip label={`${currentClient.category} - ${currentClient.category === 'A' ? 'Premium' : currentClient.category === 'B' ? 'Regular' : currentClient.category === 'C' ? 'Ocasional' : 'Nuevo'}`} size="small" />
                ) : '-'}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Contacto */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <ContactIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Contacto
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {currentClient.contactName && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Contacto:</Typography></Grid>
                  <Grid item xs={8}><Typography>{currentClient.contactName}</Typography></Grid>
                </>
              )}
              {currentClient.contactPosition && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Cargo:</Typography></Grid>
                  <Grid item xs={8}><Typography>{currentClient.contactPosition}</Typography></Grid>
                </>
              )}
              <Grid item xs={4}><Typography color="text.secondary">Email:</Typography></Grid>
              <Grid item xs={8}>
                {currentClient.email ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography>{currentClient.email}</Typography>
                  </Box>
                ) : '-'}
              </Grid>
              <Grid item xs={4}><Typography color="text.secondary">Teléfono:</Typography></Grid>
              <Grid item xs={8}>
                {currentClient.phone ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography>{currentClient.phone}</Typography>
                  </Box>
                ) : '-'}
              </Grid>
              {currentClient.mobile && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Móvil:</Typography></Grid>
                  <Grid item xs={8}><Typography>{currentClient.mobile}</Typography></Grid>
                </>
              )}
              {currentClient.website && (
                <>
                  <Grid item xs={4}><Typography color="text.secondary">Web:</Typography></Grid>
                  <Grid item xs={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <WebIcon fontSize="small" color="action" />
                      <Typography>{currentClient.website}</Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Dirección */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Dirección
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>{currentClient.address || '-'}</Typography>
            <Typography color="text.secondary">
              {[currentClient.city, currentClient.state, currentClient.country].filter(Boolean).join(', ') || '-'}
            </Typography>
            {currentClient.postalCode && (
              <Typography color="text.secondary">CP: {currentClient.postalCode}</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Métricas */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Métricas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={6}><Typography color="text.secondary">Ingresos Totales:</Typography></Grid>
              <Grid item xs={6}><Typography fontWeight="bold">{formatCurrency(currentClient.totalRevenue, currentClient.currency)}</Typography></Grid>
              
              <Grid item xs={6}><Typography color="text.secondary">Total Proyectos:</Typography></Grid>
              <Grid item xs={6}><Typography>{currentClient.totalProjects || 0}</Typography></Grid>
              
              <Grid item xs={6}><Typography color="text.secondary">Último Proyecto:</Typography></Grid>
              <Grid item xs={6}><Typography>{formatDate(currentClient.lastProjectDate)}</Typography></Grid>
              
              <Grid item xs={6}><Typography color="text.secondary">Límite Crédito:</Typography></Grid>
              <Grid item xs={6}><Typography>{currentClient.creditLimit ? formatCurrency(currentClient.creditLimit, currentClient.currency) : '-'}</Typography></Grid>
              
              <Grid item xs={6}><Typography color="text.secondary">Días Crédito:</Typography></Grid>
              <Grid item xs={6}><Typography>{currentClient.paymentTerms || '-'}</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderContactsTab = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Cargo</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Principal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!currentClient.contacts || currentClient.contacts.length === 0) ? (
            <TableRow>
              <TableCell colSpan={6} align="center">No hay contactos registrados</TableCell>
            </TableRow>
          ) : (
            currentClient.contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{`${contact.firstName} ${contact.lastName || ''}`}</TableCell>
                <TableCell>{contact.position || '-'}</TableCell>
                <TableCell>{contact.email || '-'}</TableCell>
                <TableCell>{contact.phone || contact.mobile || '-'}</TableCell>
                <TableCell>{contact.contactType}</TableCell>
                <TableCell>{contact.isPrimary ? <Chip label="Sí" color="primary" size="small" /> : '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderOpportunitiesTab = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Etapa</TableCell>
            <TableCell align="right">Valor Estimado</TableCell>
            <TableCell>Probabilidad</TableCell>
            <TableCell>Fecha Cierre</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!currentClient.opportunities || currentClient.opportunities.length === 0) ? (
            <TableRow>
              <TableCell colSpan={6} align="center">No hay oportunidades registradas</TableCell>
            </TableRow>
          ) : (
            currentClient.opportunities.map((opp) => (
              <TableRow key={opp.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/crm/opportunities/${opp.id}`)}>
                <TableCell><Typography fontWeight="bold">{opp.code}</Typography></TableCell>
                <TableCell>{opp.title}</TableCell>
                <TableCell><Chip label={stageLabels[opp.stage]} color={stageColors[opp.stage]} size="small" /></TableCell>
                <TableCell align="right">{formatCurrency(opp.estimatedValue, opp.currency)}</TableCell>
                <TableCell>{opp.probability ? `${opp.probability}%` : '-'}</TableCell>
                <TableCell>{formatDate(opp.expectedCloseDate)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderQuotesTab = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Válida Hasta</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!currentClient.quotes || currentClient.quotes.length === 0) ? (
            <TableRow>
              <TableCell colSpan={6} align="center">No hay cotizaciones registradas</TableCell>
            </TableRow>
          ) : (
            currentClient.quotes.map((quote) => (
              <TableRow key={quote.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/crm/quotes/${quote.id}`)}>
                <TableCell><Typography fontWeight="bold">{quote.code}</Typography></TableCell>
                <TableCell>{quote.title}</TableCell>
                <TableCell><Chip label={quoteStatusLabels[quote.status]} size="small" /></TableCell>
                <TableCell align="right">{formatCurrency(quote.total, quote.currency)}</TableCell>
                <TableCell>{formatDate(quote.quoteDate)}</TableCell>
                <TableCell>{formatDate(quote.validUntil)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/crm/clients')}>
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            {currentClient.code} - {getClientName()}
          </Typography>
          <Chip label={statusLabels[currentClient.status]} color={statusColors[currentClient.status]} />
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/crm/clients/${id}/edit`)}
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
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab label="Información" icon={<BusinessIcon />} iconPosition="start" />
          <Tab label={`Contactos (${currentClient.contacts?.length || 0})`} icon={<ContactIcon />} iconPosition="start" />
          <Tab label={`Oportunidades (${currentClient.opportunities?.length || 0})`} icon={<OpportunityIcon />} iconPosition="start" />
          <Tab label={`Cotizaciones (${currentClient.quotes?.length || 0})`} icon={<QuoteIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && renderInfoTab()}
      {activeTab === 1 && renderContactsTab()}
      {activeTab === 2 && renderOpportunitiesTab()}
      {activeTab === 3 && renderQuotesTab()}
    </Box>
  );
};

export default ClientDetail;
