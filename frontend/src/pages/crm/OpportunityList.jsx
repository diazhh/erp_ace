import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as OpportunityIcon,
} from '@mui/icons-material';
import { fetchOpportunities, deleteOpportunity } from '../../store/slices/crmSlice';
import ConfirmDialog from "../../components/ConfirmDialog";

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

const OpportunityList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { opportunities, loading, error } = useSelector((state) => state.crm);

  const [filters, setFilters] = useState({
    search: '',
    stage: '',
    priority: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [oppToDelete, setOppToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchOpportunities(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteClick = (opp) => {
    setOppToDelete(opp);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (oppToDelete) {
      await dispatch(deleteOpportunity(oppToDelete.id));
      setDeleteDialogOpen(false);
      setOppToDelete(null);
    }
  };

  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const getClientName = (client) => {
    if (!client) return '-';
    return client.companyName || client.tradeName || `${client.firstName || ''} ${client.lastName || ''}`.trim() || '-';
  };

  const renderMobileCard = (opp) => (
    <Card key={opp.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {opp.code}
          </Typography>
          <Chip label={stageLabels[opp.stage]} color={stageColors[opp.stage]} size="small" />
        </Box>
        <Typography variant="body1" gutterBottom>
          {opp.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {getClientName(opp.client)}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="h6" color="primary">
            {formatCurrency(opp.estimatedValue, opp.currency)}
          </Typography>
          {opp.probability && (
            <Chip label={`${opp.probability}%`} size="small" variant="outlined" />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Cierre esperado: {formatDate(opp.expectedCloseDate)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/crm/opportunities/${opp.id}`)}>
          Ver
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/crm/opportunities/${opp.id}/edit`)}>
          Editar
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(opp)}>
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          <OpportunityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Oportunidades
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/crm/opportunities/new')}
        >
          Nueva Oportunidad
        </Button>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por título, código..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Etapa</InputLabel>
              <Select
                value={filters.stage}
                label="Etapa"
                onChange={(e) => handleFilterChange('stage', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="LEAD">Prospecto</MenuItem>
                <MenuItem value="QUALIFIED">Calificado</MenuItem>
                <MenuItem value="PROPOSAL">Propuesta</MenuItem>
                <MenuItem value="NEGOTIATION">Negociación</MenuItem>
                <MenuItem value="WON">Ganada</MenuItem>
                <MenuItem value="LOST">Perdida</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={filters.priority}
                label="Prioridad"
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="LOW">Baja</MenuItem>
                <MenuItem value="MEDIUM">Media</MenuItem>
                <MenuItem value="HIGH">Alta</MenuItem>
                <MenuItem value="CRITICAL">Crítica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Box>
          {opportunities.length === 0 ? (
            <Alert severity="info">No se encontraron oportunidades</Alert>
          ) : (
            opportunities.map(renderMobileCard)
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Etapa</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell>Prob.</TableCell>
                <TableCell>Cierre</TableCell>
                <TableCell>Prioridad</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {opportunities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No se encontraron oportunidades
                  </TableCell>
                </TableRow>
              ) : (
                opportunities.map((opp) => (
                  <TableRow key={opp.id} hover>
                    <TableCell>
                      <Typography fontWeight="bold">{opp.code}</Typography>
                    </TableCell>
                    <TableCell>{opp.title}</TableCell>
                    <TableCell>{getClientName(opp.client)}</TableCell>
                    <TableCell>
                      <Chip label={stageLabels[opp.stage]} color={stageColors[opp.stage]} size="small" />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(opp.estimatedValue, opp.currency)}</TableCell>
                    <TableCell>{opp.probability ? `${opp.probability}%` : '-'}</TableCell>
                    <TableCell>{formatDate(opp.expectedCloseDate)}</TableCell>
                    <TableCell>
                      <Chip label={opp.priority} color={priorityColors[opp.priority]} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => navigate(`/crm/opportunities/${opp.id}`)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => navigate(`/crm/opportunities/${opp.id}/edit`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(opp)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Oportunidad"
        message={`¿Está seguro de eliminar la oportunidad "${oppToDelete?.code} - ${oppToDelete?.title}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default OpportunityList;
