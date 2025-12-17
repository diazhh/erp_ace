import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  CardActions,
  Grid,
  useMediaQuery,
  useTheme,
  InputAdornment,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as VerifyIcon,
  Approval as ApproveIcon,
  OilBarrel as OilIcon,
  LocalGasStation as GasIcon,
  WaterDrop as WaterIcon,
} from '@mui/icons-material';
import { fetchDailyProduction, fetchFields, fetchWells, deleteProduction, verifyProduction, approveProduction } from '../../store/slices/productionSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const DailyProductionList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { dailyProduction, dailyProductionPagination, fields, wells, loading } = useSelector((state) => state.production);

  const [filters, setFilters] = useState({
    search: '',
    fieldId: '',
    wellId: '',
    status: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, production: null });
  const [actionDialog, setActionDialog] = useState({ open: false, production: null, action: null });

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (filters.fieldId) {
      dispatch(fetchWells({ fieldId: filters.fieldId, limit: 100 }));
    }
  }, [dispatch, filters.fieldId]);

  useEffect(() => {
    const queryFilters = { ...filters };
    if (!queryFilters.fieldId) delete queryFilters.fieldId;
    if (!queryFilters.wellId) delete queryFilters.wellId;
    if (!queryFilters.status) delete queryFilters.status;
    if (!queryFilters.startDate) delete queryFilters.startDate;
    if (!queryFilters.endDate) delete queryFilters.endDate;
    if (!queryFilters.search) delete queryFilters.search;
    dispatch(fetchDailyProduction(queryFilters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value, page: 1 };
      if (name === 'fieldId') {
        newFilters.wellId = '';
      }
      return newFilters;
    });
  };

  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters((prev) => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleDelete = async () => {
    if (deleteDialog.production) {
      await dispatch(deleteProduction(deleteDialog.production.id));
      setDeleteDialog({ open: false, production: null });
    }
  };

  const handleAction = async () => {
    if (actionDialog.production && actionDialog.action) {
      if (actionDialog.action === 'verify') {
        await dispatch(verifyProduction(actionDialog.production.id));
      } else if (actionDialog.action === 'approve') {
        await dispatch(approveProduction(actionDialog.production.id));
      }
      setActionDialog({ open: false, production: null, action: null });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      VERIFIED: 'info',
      APPROVED: 'success',
      REJECTED: 'error',
    };
    return colors[status] || 'default';
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('es-VE', { maximumFractionDigits: 2 }).format(num);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-VE');
  };

  const ProductionCard = ({ production }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {formatDate(production.production_date)}
          </Typography>
          <Chip 
            label={t(`production.daily.status.${production.status}`)} 
            color={getStatusColor(production.status)} 
            size="small" 
          />
        </Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {production.well?.code || '-'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {production.well?.name} • {production.well?.field?.name}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <OilIcon color="warning" fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatNumber(production.oil_volume)}
              </Typography>
              <Typography variant="caption" color="text.secondary">bbl</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <GasIcon color="info" fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatNumber(production.gas_volume)}
              </Typography>
              <Typography variant="caption" color="text.secondary">mcf</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <WaterIcon color="primary" fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatNumber(production.water_volume)}
              </Typography>
              <Typography variant="caption" color="text.secondary">bbl</Typography>
            </Box>
          </Grid>
        </Grid>
        {production.hours_on && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {t('production.hoursOn')}: {production.hours_on}h
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ flexWrap: 'wrap', gap: 0.5 }}>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/production/daily/${production.id}`)}>
          {t('common.view')}
        </Button>
        {production.status === 'DRAFT' && (
          <>
            <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/production/daily/${production.id}/edit`)}>
              {t('common.edit')}
            </Button>
            <Button 
              size="small" 
              color="info" 
              startIcon={<VerifyIcon />} 
              onClick={() => setActionDialog({ open: true, production, action: 'verify' })}
            >
              {t('production.daily.verify')}
            </Button>
          </>
        )}
        {production.status === 'VERIFIED' && (
          <Button 
            size="small" 
            color="success" 
            startIcon={<ApproveIcon />} 
            onClick={() => setActionDialog({ open: true, production, action: 'approve' })}
          >
            {t('production.daily.approve')}
          </Button>
        )}
        {production.status === 'DRAFT' && (
          <Button 
            size="small" 
            color="error" 
            startIcon={<DeleteIcon />} 
            onClick={() => setDeleteDialog({ open: true, production })}
          >
            {t('common.delete')}
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          {t('production.daily.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/production/daily/new')}
          fullWidth={isMobile}
        >
          {t('production.daily.new')}
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              name="fieldId"
              label={t('production.field')}
              select
              value={filters.fieldId}
              onChange={handleFilterChange}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {fields.map((field) => (
                <MenuItem key={field.id} value={field.id}>
                  {field.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              name="wellId"
              label={t('production.well')}
              select
              value={filters.wellId}
              onChange={handleFilterChange}
              disabled={!filters.fieldId}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {wells.map((well) => (
                <MenuItem key={well.id} value={well.id}>
                  {well.code} - {well.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              name="status"
              label={t('common.status')}
              select
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="DRAFT">{t('production.daily.status.DRAFT')}</MenuItem>
              <MenuItem value="VERIFIED">{t('production.daily.status.VERIFIED')}</MenuItem>
              <MenuItem value="APPROVED">{t('production.daily.status.APPROVED')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              name="startDate"
              label={t('production.daily.startDate')}
              type="date"
              value={filters.startDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              name="endDate"
              label={t('production.daily.endDate')}
              type="date"
              value={filters.endDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {isMobile ? (
        <Grid container spacing={2}>
          {dailyProduction.map((production) => (
            <Grid item xs={12} key={production.id}>
              <ProductionCard production={production} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('production.daily.date')}</TableCell>
                <TableCell>{t('production.well')}</TableCell>
                <TableCell>{t('production.field')}</TableCell>
                <TableCell align="right">{t('production.oilBbl')}</TableCell>
                <TableCell align="right">{t('production.gasMcf')}</TableCell>
                <TableCell align="right">{t('production.waterBbl')}</TableCell>
                <TableCell align="right">{t('production.bsw')}</TableCell>
                <TableCell align="center">{t('common.status')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dailyProduction.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                dailyProduction.map((production) => (
                  <TableRow key={production.id} hover>
                    <TableCell>{formatDate(production.production_date)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {production.well?.code}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {production.well?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{production.well?.field?.name || '-'}</TableCell>
                    <TableCell align="right">{formatNumber(production.oil_volume)}</TableCell>
                    <TableCell align="right">{formatNumber(production.gas_volume)}</TableCell>
                    <TableCell align="right">{formatNumber(production.water_volume)}</TableCell>
                    <TableCell align="right">{production.bsw ? `${production.bsw}%` : '-'}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={t(`production.daily.status.${production.status}`)} 
                        color={getStatusColor(production.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('common.view')}>
                        <IconButton size="small" onClick={() => navigate(`/production/daily/${production.id}`)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {production.status === 'DRAFT' && (
                        <>
                          <Tooltip title={t('common.edit')}>
                            <IconButton size="small" onClick={() => navigate(`/production/daily/${production.id}/edit`)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('production.daily.verify')}>
                            <IconButton 
                              size="small" 
                              color="info"
                              onClick={() => setActionDialog({ open: true, production, action: 'verify' })}
                            >
                              <VerifyIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete')}>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, production })}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {production.status === 'VERIFIED' && (
                        <Tooltip title={t('production.daily.approve')}>
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => setActionDialog({ open: true, production, action: 'approve' })}
                          >
                            <ApproveIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={dailyProductionPagination?.total || 0}
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
        title={t('common.confirm')}
        message={t('production.daily.deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, production: null })}
      />

      <ConfirmDialog
        open={actionDialog.open}
        title={t('common.confirm')}
        message={
          actionDialog.action === 'verify' 
            ? t('production.daily.verifyConfirm') 
            : t('production.daily.approveConfirm')
        }
        onConfirm={handleAction}
        onCancel={() => setActionDialog({ open: false, production: null, action: null })}
      />
    </Box>
  );
};

export default DailyProductionList;
