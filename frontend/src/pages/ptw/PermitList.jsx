import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  CheckCircle as ApproveIcon,
  PlayArrow as ActivateIcon,
} from '@mui/icons-material';
import { fetchPermits, deletePermit, submitPermit, approvePermit, activatePermit } from '../../store/slices/ptwSlice';

const PERMIT_TYPES = ['HOT_WORK', 'CONFINED_SPACE', 'ELECTRICAL', 'EXCAVATION', 'LIFTING', 'WORKING_AT_HEIGHT', 'LOCKOUT_TAGOUT', 'GENERAL'];
const PERMIT_STATUSES = ['DRAFT', 'PENDING', 'APPROVED', 'ACTIVE', 'SUSPENDED', 'CLOSED', 'CANCELLED'];

const PermitList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const { permits, permitsPagination, permitsLoading } = useSelector((state) => state.ptw);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    type: searchParams.get('type') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
  });

  useEffect(() => {
    dispatch(fetchPermits(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value, page: 1 };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const handlePageChange = (event, newPage) => {
    handleFilterChange('page', newPage + 1);
  };

  const handleRowsPerPageChange = (event) => {
    handleFilterChange('limit', parseInt(event.target.value));
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('ptw.confirmDelete', '¿Está seguro de eliminar este permiso?'))) {
      await dispatch(deletePermit(id));
      dispatch(fetchPermits(filters));
    }
  };

  const handleSubmit = async (id) => {
    if (window.confirm(t('ptw.confirmSubmit', '¿Enviar permiso para aprobación?'))) {
      await dispatch(submitPermit(id));
      dispatch(fetchPermits(filters));
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm(t('ptw.confirmApprove', '¿Aprobar este permiso de trabajo?'))) {
      await dispatch(approvePermit(id));
      dispatch(fetchPermits(filters));
    }
  };

  const handleActivate = async (id) => {
    if (window.confirm(t('ptw.confirmActivate', '¿Activar este permiso de trabajo?'))) {
      await dispatch(activatePermit(id));
      dispatch(fetchPermits(filters));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PENDING: 'warning',
      APPROVED: 'info',
      ACTIVE: 'success',
      SUSPENDED: 'error',
      CLOSED: 'default',
      CANCELLED: 'default',
      EXPIRED: 'error',
    };
    return colors[status] || 'default';
  };

  const getTypeLabel = (type) => t(`ptw.type.${type}`, type);

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  const renderMobileCard = (permit) => (
    <Card key={permit.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {permit.code}
          </Typography>
          <Chip
            label={t(`ptw.status.${permit.status}`, permit.status)}
            size="small"
            color={getStatusColor(permit.status)}
          />
        </Box>
        <Typography variant="body2" fontWeight="medium" gutterBottom>
          {permit.title}
        </Typography>
        <Chip label={getTypeLabel(permit.type)} size="small" variant="outlined" sx={{ mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {permit.location}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDateTime(permit.start_datetime)} - {formatDateTime(permit.end_datetime)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {permit.status === 'DRAFT' && (
          <>
            <IconButton size="small" onClick={() => handleSubmit(permit.id)} color="primary">
              <SendIcon />
            </IconButton>
            <IconButton size="small" onClick={() => navigate(`/ptw/permits/${permit.id}/edit`)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => handleDelete(permit.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </>
        )}
        {permit.status === 'PENDING' && (
          <IconButton size="small" onClick={() => handleApprove(permit.id)} color="success">
            <ApproveIcon />
          </IconButton>
        )}
        {permit.status === 'APPROVED' && (
          <IconButton size="small" onClick={() => handleActivate(permit.id)} color="success">
            <ActivateIcon />
          </IconButton>
        )}
        <IconButton size="small" onClick={() => navigate(`/ptw/permits/${permit.id}`)} color="primary">
          <ViewIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('ptw.permits.title', 'Permisos de Trabajo')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/ptw/permits/new')}
          fullWidth={isMobile}
        >
          {t('ptw.permit.new', 'Nuevo Permiso')}
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              label={t('common.search', 'Buscar')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label={t('ptw.status.label', 'Estado')}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">{t('common.all', 'Todos')}</MenuItem>
              {PERMIT_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`ptw.status.${status}`, status)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label={t('ptw.type.label', 'Tipo')}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <MenuItem value="">{t('common.all', 'Todos')}</MenuItem>
              {PERMIT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`ptw.type.${type}`, type)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {permitsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Box>
          {permits.map(renderMobileCard)}
          {permits.length === 0 && (
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              {t('ptw.noPermits', 'No se encontraron permisos')}
            </Typography>
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('ptw.code', 'Código')}</TableCell>
                <TableCell>{t('ptw.type.label', 'Tipo')}</TableCell>
                <TableCell>{t('ptw.title', 'Título')}</TableCell>
                <TableCell>{t('ptw.location', 'Ubicación')}</TableCell>
                <TableCell>{t('ptw.startDate', 'Inicio')}</TableCell>
                <TableCell>{t('ptw.status.label', 'Estado')}</TableCell>
                <TableCell align="center">{t('common.actions', 'Acciones')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permits.map((permit) => (
                <TableRow key={permit.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {permit.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getTypeLabel(permit.type)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{permit.title}</TableCell>
                  <TableCell>{permit.location}</TableCell>
                  <TableCell>{formatDateTime(permit.start_datetime)}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`ptw.status.${permit.status}`, permit.status)}
                      size="small"
                      color={getStatusColor(permit.status)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {permit.status === 'DRAFT' && (
                        <>
                          <Tooltip title={t('ptw.submit', 'Enviar')}>
                            <IconButton size="small" onClick={() => handleSubmit(permit.id)} color="primary">
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.edit', 'Editar')}>
                            <IconButton size="small" onClick={() => navigate(`/ptw/permits/${permit.id}/edit`)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete', 'Eliminar')}>
                            <IconButton size="small" onClick={() => handleDelete(permit.id)} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {permit.status === 'PENDING' && (
                        <Tooltip title={t('ptw.approve', 'Aprobar')}>
                          <IconButton size="small" onClick={() => handleApprove(permit.id)} color="success">
                            <ApproveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {permit.status === 'APPROVED' && (
                        <Tooltip title={t('ptw.activate', 'Activar')}>
                          <IconButton size="small" onClick={() => handleActivate(permit.id)} color="success">
                            <ActivateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t('common.view', 'Ver')}>
                        <IconButton size="small" onClick={() => navigate(`/ptw/permits/${permit.id}`)} color="primary">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {permits.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {t('ptw.noPermits', 'No se encontraron permisos')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={permitsPagination.total}
            page={permitsPagination.page - 1}
            rowsPerPage={permitsPagination.limit}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={t('common.rowsPerPage', 'Filas por página')}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default PermitList;
