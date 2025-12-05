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
  Grid,
  Card,
  CardContent,
  CardActions,
  Pagination,
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalGasStation as FuelIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { fetchFuelLogs, deleteFuelLog } from '../../store/slices/fleetSlice';

const FuelLogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { fuelLogs, fuelLogsPagination, loading, error } = useSelector((state) => state.fleet);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchFuelLogs(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', page: 1 });
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('fleet.fuelLog.deleteConfirm'))) {
      await dispatch(deleteFuelLog(id));
      dispatch(fetchFuelLogs(filters));
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const renderFilters = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label={t('fleet.fuelLog.from')}
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label={t('fleet.fuelLog.to')}
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            fullWidth
          >
            {t('fleet.clear')}
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/fleet/fuel-logs/new')}
            fullWidth
          >
            {t('fleet.new')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderMobileCard = (fuelLog) => (
    <Card key={fuelLog.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {fuelLog.code}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {fuelLog.vehicle?.plate} - {fuelLog.vehicle?.brand} {fuelLog.vehicle?.model}
            </Typography>
          </Box>
          <Typography variant="h6" color="primary">
            {formatCurrency(fuelLog.totalCost)}
          </Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">{t('fleet.fuelLog.date')}</Typography>
            <Typography variant="body2">{formatDate(fuelLog.fuelDate)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">{t('fleet.fuelLog.quantity')}</Typography>
            <Typography variant="body2">{fuelLog.quantity} L</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">{t('fleet.fuelLog.mileage')}</Typography>
            <Typography variant="body2">{fuelLog.mileage?.toLocaleString()} km</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">{t('fleet.fuelLog.driver')}</Typography>
            <Typography variant="body2">
              {fuelLog.driver ? `${fuelLog.driver.firstName} ${fuelLog.driver.lastName}` : '-'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/fleet/fuel-logs/${fuelLog.id}/edit`)}>
          {t('fleet.edit')}
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(fuelLog.id)}>
          {t('fleet.delete')}
        </Button>
      </CardActions>
    </Card>
  );

  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('fleet.fuelLog.code')}</TableCell>
            <TableCell>{t('fleet.fuelLog.vehicle')}</TableCell>
            <TableCell>{t('fleet.fuelLog.date')}</TableCell>
            <TableCell>{t('fleet.fuelLog.type')}</TableCell>
            <TableCell align="right">{t('fleet.fuelLog.quantity')}</TableCell>
            <TableCell align="right">{t('fleet.fuelLog.unitPrice')}</TableCell>
            <TableCell align="right">{t('fleet.fuelLog.total')}</TableCell>
            <TableCell>{t('fleet.fuelLog.km')}</TableCell>
            <TableCell>{t('fleet.fuelLog.driver')}</TableCell>
            <TableCell align="center">{t('fleet.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(10)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : fuelLogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center">
                <Typography color="text.secondary" sx={{ py: 3 }}>
                  {t('fleet.fuelLog.noRecords')}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            fuelLogs.map((f) => (
              <TableRow key={f.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {f.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  {f.vehicle?.plate} - {f.vehicle?.brand}
                </TableCell>
                <TableCell>{formatDate(f.fuelDate)}</TableCell>
                <TableCell>{f.fuelType}</TableCell>
                <TableCell align="right">{f.quantity} L</TableCell>
                <TableCell align="right">{formatCurrency(f.unitPrice)}</TableCell>
                <TableCell align="right">{formatCurrency(f.totalCost)}</TableCell>
                <TableCell>{f.mileage?.toLocaleString()}</TableCell>
                <TableCell>
                  {f.driver ? `${f.driver.firstName} ${f.driver.lastName}` : '-'}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={t('fleet.edit')}>
                    <IconButton size="small" onClick={() => navigate(`/fleet/fuel-logs/${f.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('fleet.delete')}>
                    <IconButton size="small" color="error" onClick={() => handleDelete(f.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <FuelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {t('fleet.fuelLog.title')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {renderFilters()}

      {isMobile ? (
        <Box>
          {loading
            ? [...Array(3)].map((_, i) => (
                <Card key={i} sx={{ mb: 2 }}>
                  <CardContent>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="80%" />
                  </CardContent>
                </Card>
              ))
            : fuelLogs.map(renderMobileCard)}
        </Box>
      ) : (
        renderTable()
      )}

      {fuelLogsPagination && fuelLogsPagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={fuelLogsPagination.totalPages}
            page={filters.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default FuelLogList;
