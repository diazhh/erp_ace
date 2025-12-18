import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  MenuItem,
  Grid,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { fetchTanks, deleteTank } from '../../../store/slices/logisticsSlice';
import ConfirmDialog from '../../../components/ConfirmDialog';

const TANK_TYPES = ['CRUDE', 'WATER', 'DIESEL', 'CHEMICALS', 'GAS', 'CONDENSATE'];
const TANK_STATUSES = ['ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE', 'DECOMMISSIONED'];

const TankList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { tanks, tanksPagination, loading } = useSelector((state) => state.logistics);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, tank: null });

  useEffect(() => {
    dispatch(fetchTanks(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters((prev) => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleDelete = async () => {
    if (deleteDialog.tank) {
      await dispatch(deleteTank(deleteDialog.tank.id));
      setDeleteDialog({ open: false, tank: null });
      dispatch(fetchTanks(filters));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      MAINTENANCE: 'warning',
      OUT_OF_SERVICE: 'error',
      DECOMMISSIONED: 'default',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      CRUDE: 'primary',
      WATER: 'info',
      DIESEL: 'warning',
      CHEMICALS: 'error',
      GAS: 'secondary',
      CONDENSATE: 'success',
    };
    return colors[type] || 'default';
  };

  const getCapacityPercentage = (tank) => {
    if (!tank.capacity || tank.capacity === 0) return 0;
    return (parseFloat(tank.current_volume || 0) / parseFloat(tank.capacity)) * 100;
  };

  const renderMobileCard = (tank) => (
    <Card key={tank.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{tank.code}</Typography>
            <Typography variant="body2" color="textSecondary">{tank.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip label={tank.type} size="small" color={getTypeColor(tank.type)} />
            <Chip label={tank.status} size="small" color={getStatusColor(tank.status)} />
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {tank.location || '-'}
        </Typography>
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{t('logistics.capacity')}</Typography>
            <Typography variant="body2">
              {parseFloat(tank.current_volume || 0).toLocaleString()} / {parseFloat(tank.capacity || 0).toLocaleString()} bbl
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(getCapacityPercentage(tank), 100)} 
            color={getCapacityPercentage(tank) > 80 ? 'error' : 'primary'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/logistics/tanks/${tank.id}`)}>
            {t('common.view')}
          </Button>
          <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/logistics/tanks/${tank.id}/edit`)}>
            {t('common.edit')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          {t('logistics.storageTanks')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/logistics/tanks/new')}
          fullWidth={isMobile}
        >
          {t('logistics.newTank')}
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder={t('common.search')}
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
              <TextField
                fullWidth
                size="small"
                select
                label={t('logistics.type')}
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                {TANK_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                size="small"
                select
                label={t('common.status')}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                {TANK_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Mobile View */}
      {isMobile ? (
        <Box>
          {tanks.map(renderMobileCard)}
        </Box>
      ) : (
        /* Desktop Table */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('logistics.code')}</TableCell>
                <TableCell>{t('logistics.name')}</TableCell>
                <TableCell>{t('logistics.type')}</TableCell>
                <TableCell>{t('logistics.location')}</TableCell>
                <TableCell align="right">{t('logistics.capacity')}</TableCell>
                <TableCell>{t('logistics.fill')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tanks.map((tank) => (
                <TableRow key={tank.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{tank.code}</Typography>
                  </TableCell>
                  <TableCell>{tank.name}</TableCell>
                  <TableCell>
                    <Chip label={tank.type} size="small" color={getTypeColor(tank.type)} />
                  </TableCell>
                  <TableCell>{tank.location || '-'}</TableCell>
                  <TableCell align="right">
                    {parseFloat(tank.capacity || 0).toLocaleString()} bbl
                  </TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(getCapacityPercentage(tank), 100)} 
                        color={getCapacityPercentage(tank) > 80 ? 'error' : 'primary'}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 40 }}>
                        {getCapacityPercentage(tank).toFixed(0)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={tank.status} size="small" color={getStatusColor(tank.status)} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => navigate(`/logistics/tanks/${tank.id}`)}>
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/logistics/tanks/${tank.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, tank })}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={tanksPagination?.total || 0}
            page={(filters.page || 1) - 1}
            onPageChange={handlePageChange}
            rowsPerPage={filters.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </TableContainer>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        title={t('logistics.deleteTank')}
        message={t('logistics.deleteTankConfirm', { code: deleteDialog.tank?.code })}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, tank: null })}
      />
    </Box>
  );
};

export default TankList;
