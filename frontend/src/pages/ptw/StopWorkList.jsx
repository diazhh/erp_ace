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
  CheckCircle as ResolveIcon,
  PlayArrow as ResumeIcon,
} from '@mui/icons-material';
import { fetchStopWork } from '../../store/slices/ptwSlice';

const REASONS = ['UNSAFE_CONDITION', 'UNSAFE_ACT', 'EQUIPMENT_FAILURE', 'WEATHER', 'PERMIT_VIOLATION', 'EMERGENCY', 'OTHER'];
const STATUSES = ['OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'];
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const StopWorkList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const { stopWorkList, stopWorkPagination, stopWorkLoading } = useSelector((state) => state.ptw);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    reason: searchParams.get('reason') || '',
    severity: searchParams.get('severity') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
  });

  useEffect(() => {
    dispatch(fetchStopWork(filters));
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

  const getStatusColor = (status) => {
    const colors = {
      OPEN: 'error',
      INVESTIGATING: 'warning',
      RESOLVED: 'info',
      CLOSED: 'success',
    };
    return colors[status] || 'default';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      LOW: 'default',
      MEDIUM: 'warning',
      HIGH: 'error',
      CRITICAL: 'error',
    };
    return colors[severity] || 'default';
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  const renderMobileCard = (swa) => (
    <Card key={swa.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {swa.code}
          </Typography>
          <Chip
            label={t(`ptw.swaStatus.${swa.status}`, swa.status)}
            size="small"
            color={getStatusColor(swa.status)}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip 
            label={t(`ptw.reason.${swa.reason}`, swa.reason)} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            label={t(`ptw.severity.${swa.severity}`, swa.severity)} 
            size="small" 
            color={getSeverityColor(swa.severity)}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {swa.location}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDateTime(swa.reported_at)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton size="small" onClick={() => navigate(`/ptw/stop-work/${swa.id}`)} color="primary">
          <ViewIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('ptw.stopWork.title', 'Stop Work Authority')}
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={() => navigate('/ptw/stop-work/new')}
          fullWidth={isMobile}
        >
          {t('ptw.stopWork.report', 'Reportar Stop Work')}
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label={t('common.search', 'Buscar')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label={t('ptw.status.label', 'Estado')}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">{t('common.all', 'Todos')}</MenuItem>
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`ptw.swaStatus.${status}`, status)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label={t('ptw.reason.label', 'Razón')}
              value={filters.reason}
              onChange={(e) => handleFilterChange('reason', e.target.value)}
            >
              <MenuItem value="">{t('common.all', 'Todos')}</MenuItem>
              {REASONS.map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {t(`ptw.reason.${reason}`, reason)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label={t('ptw.severity.label', 'Severidad')}
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
            >
              <MenuItem value="">{t('common.all', 'Todos')}</MenuItem>
              {SEVERITIES.map((severity) => (
                <MenuItem key={severity} value={severity}>
                  {t(`ptw.severity.${severity}`, severity)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {stopWorkLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Box>
          {stopWorkList.map(renderMobileCard)}
          {stopWorkList.length === 0 && (
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              {t('ptw.noStopWork', 'No se encontraron registros de Stop Work')}
            </Typography>
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('ptw.code', 'Código')}</TableCell>
                <TableCell>{t('ptw.reason.label', 'Razón')}</TableCell>
                <TableCell>{t('ptw.severity.label', 'Severidad')}</TableCell>
                <TableCell>{t('ptw.location', 'Ubicación')}</TableCell>
                <TableCell>{t('ptw.reportedAt', 'Reportado')}</TableCell>
                <TableCell>{t('ptw.status.label', 'Estado')}</TableCell>
                <TableCell align="center">{t('common.actions', 'Acciones')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stopWorkList.map((swa) => (
                <TableRow key={swa.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {swa.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={t(`ptw.reason.${swa.reason}`, swa.reason)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={t(`ptw.severity.${swa.severity}`, swa.severity)} 
                      size="small" 
                      color={getSeverityColor(swa.severity)}
                    />
                  </TableCell>
                  <TableCell>{swa.location}</TableCell>
                  <TableCell>{formatDateTime(swa.reported_at)}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`ptw.swaStatus.${swa.status}`, swa.status)}
                      size="small"
                      color={getStatusColor(swa.status)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={t('common.view', 'Ver')}>
                      <IconButton size="small" onClick={() => navigate(`/ptw/stop-work/${swa.id}`)} color="primary">
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {stopWorkList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {t('ptw.noStopWork', 'No se encontraron registros de Stop Work')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={stopWorkPagination.total}
            page={stopWorkPagination.page - 1}
            rowsPerPage={stopWorkPagination.limit}
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

export default StopWorkList;
