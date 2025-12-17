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
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { fetchJIBs, deleteJIB, sendJIB } from '../../store/slices/jibSlice';

const JIB_STATUSES = ['DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'DISPUTED', 'CANCELLED'];

const JIBList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const { jibs, jibsPagination, jibsLoading } = useSelector((state) => state.jib);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    year: searchParams.get('year') || new Date().getFullYear(),
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
  });

  useEffect(() => {
    dispatch(fetchJIBs(filters));
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
    if (window.confirm(t('jib.confirmDelete', '¿Está seguro de eliminar este JIB?'))) {
      await dispatch(deleteJIB(id));
      dispatch(fetchJIBs(filters));
    }
  };

  const handleSend = async (id) => {
    if (window.confirm(t('jib.confirmSend', '¿Está seguro de enviar este JIB a los socios?'))) {
      await dispatch(sendJIB(id));
      dispatch(fetchJIBs(filters));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      SENT: 'info',
      PARTIALLY_PAID: 'warning',
      PAID: 'success',
      DISPUTED: 'error',
      CANCELLED: 'default',
    };
    return colors[status] || 'default';
  };

  const formatPeriod = (month, year) => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${monthNames[month - 1]} ${year}`;
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const renderMobileCard = (jib) => (
    <Card key={jib.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {jib.code}
          </Typography>
          <Chip
            label={t(`jib.status.${jib.status}`, jib.status)}
            size="small"
            color={getStatusColor(jib.status)}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {jib.contract?.name || jib.contract?.code}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {t('jib.period', 'Período')}: {formatPeriod(jib.billing_period_month, jib.billing_period_year)}
        </Typography>
        <Typography variant="h6" color="primary.main">
          {formatCurrency(jib.total_costs)}
        </Typography>
        {jib.due_date && (
          <Typography variant="caption" color="text.secondary">
            {t('jib.dueDate', 'Vence')}: {new Date(jib.due_date).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {jib.status === 'DRAFT' && (
          <>
            <IconButton size="small" onClick={() => handleSend(jib.id)} color="primary">
              <SendIcon />
            </IconButton>
            <IconButton size="small" onClick={() => navigate(`/jib/billings/${jib.id}/edit`)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => handleDelete(jib.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </>
        )}
        <IconButton size="small" onClick={() => navigate(`/jib/billings/${jib.id}`)} color="primary">
          <ViewIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('jib.billings.title', 'Facturación JIB')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/jib/billings/new')}
          fullWidth={isMobile}
        >
          {t('jib.billing.new', 'Nuevo JIB')}
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
              label={t('jib.status.label', 'Estado')}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">{t('common.all', 'Todos')}</MenuItem>
              {JIB_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`jib.status.${status}`, status)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label={t('jib.year', 'Año')}
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <MenuItem value="">{t('common.all', 'Todos')}</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {jibsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Box>
          {jibs.map(renderMobileCard)}
          {jibs.length === 0 && (
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              {t('jib.noJIBs', 'No se encontraron JIBs')}
            </Typography>
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('jib.code', 'Código')}</TableCell>
                <TableCell>{t('jib.contract', 'Contrato')}</TableCell>
                <TableCell>{t('jib.period', 'Período')}</TableCell>
                <TableCell align="right">{t('jib.totalCosts', 'Total')}</TableCell>
                <TableCell>{t('jib.dueDate', 'Vencimiento')}</TableCell>
                <TableCell>{t('jib.status.label', 'Estado')}</TableCell>
                <TableCell align="center">{t('common.actions', 'Acciones')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jibs.map((jib) => (
                <TableRow key={jib.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {jib.code}
                    </Typography>
                  </TableCell>
                  <TableCell>{jib.contract?.name || jib.contract?.code || '-'}</TableCell>
                  <TableCell>{formatPeriod(jib.billing_period_month, jib.billing_period_year)}</TableCell>
                  <TableCell align="right">{formatCurrency(jib.total_costs)}</TableCell>
                  <TableCell>
                    {jib.due_date ? new Date(jib.due_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`jib.status.${jib.status}`, jib.status)}
                      size="small"
                      color={getStatusColor(jib.status)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {jib.status === 'DRAFT' && (
                        <>
                          <Tooltip title={t('jib.send', 'Enviar')}>
                            <IconButton size="small" onClick={() => handleSend(jib.id)} color="primary">
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.edit', 'Editar')}>
                            <IconButton size="small" onClick={() => navigate(`/jib/billings/${jib.id}/edit`)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete', 'Eliminar')}>
                            <IconButton size="small" onClick={() => handleDelete(jib.id)} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title={t('common.view', 'Ver')}>
                        <IconButton size="small" onClick={() => navigate(`/jib/billings/${jib.id}`)} color="primary">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {jibs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {t('jib.noJIBs', 'No se encontraron JIBs')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={jibsPagination.total}
            page={jibsPagination.page - 1}
            rowsPerPage={jibsPagination.limit}
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

export default JIBList;
