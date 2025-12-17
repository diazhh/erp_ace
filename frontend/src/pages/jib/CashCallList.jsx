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
  LinearProgress,
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
} from '@mui/icons-material';
import { fetchCashCalls, deleteCashCall, sendCashCall } from '../../store/slices/jibSlice';

const CASH_CALL_STATUSES = ['DRAFT', 'SENT', 'PARTIALLY_FUNDED', 'FUNDED', 'OVERDUE', 'CANCELLED'];
const CASH_CALL_PURPOSES = ['OPERATIONS', 'AFE', 'EMERGENCY', 'CAPITAL', 'ABANDONMENT', 'OTHER'];

const CashCallList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const { cashCalls, cashCallsPagination, cashCallsLoading } = useSelector((state) => state.jib);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    purpose: searchParams.get('purpose') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
  });

  useEffect(() => {
    dispatch(fetchCashCalls(filters));
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
    if (window.confirm(t('jib.confirmDeleteCashCall', '¿Está seguro de eliminar este Cash Call?'))) {
      await dispatch(deleteCashCall(id));
      dispatch(fetchCashCalls(filters));
    }
  };

  const handleSend = async (id) => {
    if (window.confirm(t('jib.confirmSendCashCall', '¿Está seguro de enviar este Cash Call a los socios?'))) {
      await dispatch(sendCashCall(id));
      dispatch(fetchCashCalls(filters));
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
      PARTIALLY_FUNDED: 'warning',
      FUNDED: 'success',
      OVERDUE: 'error',
      CANCELLED: 'default',
    };
    return colors[status] || 'default';
  };

  const getFundingProgress = (funded, total) => {
    if (!total || total === 0) return 0;
    return Math.min((funded / total) * 100, 100);
  };

  const renderMobileCard = (cc) => {
    const progress = getFundingProgress(cc.funded_amount, cc.total_amount);
    
    return (
      <Card key={cc.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {cc.code}
            </Typography>
            <Chip
              label={t(`jib.status.${cc.status}`, cc.status)}
              size="small"
              color={getStatusColor(cc.status)}
            />
          </Box>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            {cc.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {cc.contract?.name || cc.contract?.code}
          </Typography>
          <Chip
            label={t(`jib.purpose.${cc.purpose}`, cc.purpose)}
            size="small"
            variant="outlined"
            sx={{ mb: 1 }}
          />
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">{t('jib.funded', 'Fondeado')}</Typography>
              <Typography variant="body2">{progress.toFixed(0)}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {formatCurrency(cc.funded_amount)} / {formatCurrency(cc.total_amount)}
            </Typography>
          </Box>
          {cc.due_date && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {t('jib.dueDate', 'Vence')}: {new Date(cc.due_date).toLocaleDateString()}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {cc.status === 'DRAFT' && (
            <>
              <IconButton size="small" onClick={() => handleSend(cc.id)} color="primary">
                <SendIcon />
              </IconButton>
              <IconButton size="small" onClick={() => navigate(`/jib/cash-calls/${cc.id}/edit`)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(cc.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </>
          )}
          <IconButton size="small" onClick={() => navigate(`/jib/cash-calls/${cc.id}`)} color="primary">
            <ViewIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('jib.cashCalls.title', 'Cash Calls')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/jib/cash-calls/new')}
          fullWidth={isMobile}
        >
          {t('jib.cashCall.new', 'Nuevo Cash Call')}
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
              {CASH_CALL_STATUSES.map((status) => (
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
              label={t('jib.purpose.label', 'Propósito')}
              value={filters.purpose}
              onChange={(e) => handleFilterChange('purpose', e.target.value)}
            >
              <MenuItem value="">{t('common.all', 'Todos')}</MenuItem>
              {CASH_CALL_PURPOSES.map((purpose) => (
                <MenuItem key={purpose} value={purpose}>
                  {t(`jib.purpose.${purpose}`, purpose)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {cashCallsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Box>
          {cashCalls.map(renderMobileCard)}
          {cashCalls.length === 0 && (
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              {t('jib.noCashCalls', 'No se encontraron Cash Calls')}
            </Typography>
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('jib.code', 'Código')}</TableCell>
                <TableCell>{t('jib.title', 'Título')}</TableCell>
                <TableCell>{t('jib.purpose.label', 'Propósito')}</TableCell>
                <TableCell align="right">{t('jib.totalAmount', 'Total')}</TableCell>
                <TableCell>{t('jib.progress', 'Progreso')}</TableCell>
                <TableCell>{t('jib.dueDate', 'Vencimiento')}</TableCell>
                <TableCell>{t('jib.status.label', 'Estado')}</TableCell>
                <TableCell align="center">{t('common.actions', 'Acciones')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cashCalls.map((cc) => {
                const progress = getFundingProgress(cc.funded_amount, cc.total_amount);
                return (
                  <TableRow key={cc.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {cc.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {cc.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t(`jib.purpose.${cc.purpose}`, cc.purpose)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(cc.total_amount)}</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                        />
                        <Typography variant="caption" sx={{ minWidth: 35 }}>
                          {progress.toFixed(0)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {cc.due_date ? new Date(cc.due_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t(`jib.status.${cc.status}`, cc.status)}
                        size="small"
                        color={getStatusColor(cc.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        {cc.status === 'DRAFT' && (
                          <>
                            <Tooltip title={t('jib.send', 'Enviar')}>
                              <IconButton size="small" onClick={() => handleSend(cc.id)} color="primary">
                                <SendIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('common.edit', 'Editar')}>
                              <IconButton size="small" onClick={() => navigate(`/jib/cash-calls/${cc.id}/edit`)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('common.delete', 'Eliminar')}>
                              <IconButton size="small" onClick={() => handleDelete(cc.id)} color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title={t('common.view', 'Ver')}>
                          <IconButton size="small" onClick={() => navigate(`/jib/cash-calls/${cc.id}`)} color="primary">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {cashCalls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {t('jib.noCashCalls', 'No se encontraron Cash Calls')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={cashCallsPagination.total}
            page={cashCallsPagination.page - 1}
            rowsPerPage={cashCallsPagination.limit}
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

export default CashCallList;
