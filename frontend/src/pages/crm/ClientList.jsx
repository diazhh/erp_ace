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
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { fetchClients, deleteClient } from '../../store/slices/crmSlice';
import ConfirmDialog from "../../components/ConfirmDialog";

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

const categoryLabels = {
  A: 'Premium',
  B: 'Regular',
  C: 'Ocasional',
  D: 'Nuevo',
};

const ClientList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { clients, loading, error } = useSelector((state) => state.crm);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    clientType: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchClients(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (clientToDelete) {
      await dispatch(deleteClient(clientToDelete.id));
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const getClientName = (client) => {
    if (client.clientType === 'COMPANY') {
      return client.companyName || client.tradeName || '-';
    }
    return `${client.firstName || ''} ${client.lastName || ''}`.trim() || '-';
  };

  const renderMobileCard = (client) => (
    <Card key={client.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {client.clientType === 'COMPANY' ? (
              <BusinessIcon color="primary" />
            ) : (
              <PersonIcon color="primary" />
            )}
            <Typography variant="subtitle1" fontWeight="bold">
              {client.code}
            </Typography>
          </Box>
          <Chip
            label={statusLabels[client.status]}
            color={statusColors[client.status]}
            size="small"
          />
        </Box>
        <Typography variant="body1" gutterBottom>
          {getClientName(client)}
        </Typography>
        {client.industry && (
          <Typography variant="body2" color="text.secondary">
            {client.industry}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
          {client.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2">{client.email}</Typography>
            </Box>
          )}
          {client.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2">{client.phone}</Typography>
            </Box>
          )}
        </Box>
        {client.category && (
          <Chip
            label={`Cat. ${client.category} - ${categoryLabels[client.category]}`}
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/crm/clients/${client.id}`)}>
          Ver
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/crm/clients/${client.id}/edit`)}>
          Editar
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(client)}>
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
          <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/crm/clients/new')}
        >
          Nuevo Cliente
        </Button>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nombre, código, email..."
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
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.status}
                label="Estado"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="PROSPECT">Prospecto</MenuItem>
                <MenuItem value="ACTIVE">Activo</MenuItem>
                <MenuItem value="INACTIVE">Inactivo</MenuItem>
                <MenuItem value="SUSPENDED">Suspendido</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filters.category}
                label="Categoría"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="A">A - Premium</MenuItem>
                <MenuItem value="B">B - Regular</MenuItem>
                <MenuItem value="C">C - Ocasional</MenuItem>
                <MenuItem value="D">D - Nuevo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.clientType}
                label="Tipo"
                onChange={(e) => handleFilterChange('clientType', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="COMPANY">Empresa</MenuItem>
                <MenuItem value="INDIVIDUAL">Persona</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        // Vista móvil - Cards
        <Box>
          {clients.length === 0 ? (
            <Alert severity="info">No se encontraron clientes</Alert>
          ) : (
            clients.map(renderMobileCard)
          )}
        </Box>
      ) : (
        // Vista desktop - Tabla
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Industria</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Typography fontWeight="bold">{client.code}</Typography>
                    </TableCell>
                    <TableCell>{getClientName(client)}</TableCell>
                    <TableCell>
                      {client.clientType === 'COMPANY' ? (
                        <Chip icon={<BusinessIcon />} label="Empresa" size="small" />
                      ) : (
                        <Chip icon={<PersonIcon />} label="Persona" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{client.industry || '-'}</TableCell>
                    <TableCell>
                      <Box>
                        {client.email && <Typography variant="body2">{client.email}</Typography>}
                        {client.phone && <Typography variant="body2" color="text.secondary">{client.phone}</Typography>}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {client.category ? (
                        <Chip label={`${client.category} - ${categoryLabels[client.category]}`} size="small" />
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[client.status]}
                        color={statusColors[client.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => navigate(`/crm/clients/${client.id}`)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => navigate(`/crm/clients/${client.id}/edit`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(client)}>
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

      {/* Dialog de confirmación de eliminación */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Cliente"
        message={`¿Está seguro de eliminar el cliente "${clientToDelete?.code} - ${getClientName(clientToDelete || {})}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default ClientList;
