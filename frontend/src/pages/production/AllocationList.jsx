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
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Approval as ApproveIcon,
  Calculate as CalculateIcon,
  OilBarrel as OilIcon,
  LocalGasStation as GasIcon,
  WaterDrop as WaterIcon,
} from '@mui/icons-material';
import { fetchAllocations, fetchFields, generateAllocation, approveAllocation } from '../../store/slices/productionSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const AllocationList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { allocations, allocationsPagination, fields, loading } = useSelector((state) => state.production);

  const currentDate = new Date();
  const [filters, setFilters] = useState({
    fieldId: '',
    year: currentDate.getFullYear(),
    month: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [generateDialog, setGenerateDialog] = useState({ open: false });
  const [generateForm, setGenerateForm] = useState({
    fieldId: '',
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });
  const [approveDialog, setApproveDialog] = useState({ open: false, allocation: null });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const queryFilters = { ...filters };
    if (!queryFilters.fieldId) delete queryFilters.fieldId;
    if (!queryFilters.month) delete queryFilters.month;
    if (!queryFilters.status) delete queryFilters.status;
    dispatch(fetchAllocations(queryFilters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters((prev) => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleGenerate = async () => {
    if (!generateForm.fieldId) return;
    setGenerating(true);
    try {
      await dispatch(generateAllocation({
        fieldId: generateForm.fieldId,
        month: generateForm.month,
        year: generateForm.year,
      })).unwrap();
      setGenerateDialog({ open: false });
      dispatch(fetchAllocations(filters));
    } catch (error) {
      console.error('Error generating allocation:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (approveDialog.allocation) {
      await dispatch(approveAllocation(approveDialog.allocation.id));
      setApproveDialog({ open: false, allocation: null });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
    };
    return colors[status] || 'default';
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('es-VE', { maximumFractionDigits: 2 }).format(num);
  };

  const getMonthName = (month) => {
    const monthObj = MONTHS.find(m => m.value === month);
    return monthObj ? t(`common.months.${monthObj.label.toLowerCase()}`) : month;
  };

  const getYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 5; y <= currentYear + 1; y++) {
      years.push(y);
    }
    return years;
  };

  const AllocationCard = ({ allocation }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6">
            {getMonthName(allocation.month)} {allocation.year}
          </Typography>
          <Chip 
            label={t(`production.allocation.status.${allocation.status}`)} 
            color={getStatusColor(allocation.status)} 
            size="small" 
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {allocation.field?.name || '-'}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <OilIcon color="warning" fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatNumber(allocation.total_oil)}
              </Typography>
              <Typography variant="caption" color="text.secondary">bbl</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <GasIcon color="info" fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatNumber(allocation.total_gas)}
              </Typography>
              <Typography variant="caption" color="text.secondary">mcf</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <WaterIcon color="primary" fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatNumber(allocation.total_water)}
              </Typography>
              <Typography variant="caption" color="text.secondary">bbl</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/production/allocations/${allocation.id}`)}>
          {t('common.view')}
        </Button>
        {(allocation.status === 'DRAFT' || allocation.status === 'PENDING') && (
          <Button 
            size="small" 
            color="success" 
            startIcon={<ApproveIcon />} 
            onClick={() => setApproveDialog({ open: true, allocation })}
          >
            {t('production.allocation.approve')}
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          {t('production.allocation.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<CalculateIcon />}
          onClick={() => setGenerateDialog({ open: true })}
          fullWidth={isMobile}
        >
          {t('production.allocation.generate')}
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
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              name="year"
              label={t('common.year')}
              select
              value={filters.year}
              onChange={handleFilterChange}
            >
              {getYears().map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              name="month"
              label={t('production.allocation.month')}
              select
              value={filters.month}
              onChange={handleFilterChange}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {MONTHS.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {t(`common.months.${month.label.toLowerCase()}`)}
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
              <MenuItem value="DRAFT">{t('production.allocation.status.DRAFT')}</MenuItem>
              <MenuItem value="PENDING">{t('production.allocation.status.PENDING')}</MenuItem>
              <MenuItem value="APPROVED">{t('production.allocation.status.APPROVED')}</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {isMobile ? (
        <Grid container spacing={2}>
          {allocations.map((allocation) => (
            <Grid item xs={12} key={allocation.id}>
              <AllocationCard allocation={allocation} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('production.allocation.period')}</TableCell>
                <TableCell>{t('production.field')}</TableCell>
                <TableCell align="right">{t('production.oilBbl')}</TableCell>
                <TableCell align="right">{t('production.gasMcf')}</TableCell>
                <TableCell align="right">{t('production.waterBbl')}</TableCell>
                <TableCell align="right">{t('production.allocation.allocatedOil')}</TableCell>
                <TableCell align="right">{t('production.allocation.allocatedGas')}</TableCell>
                <TableCell align="center">{t('common.status')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                allocations.map((allocation) => (
                  <TableRow key={allocation.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {getMonthName(allocation.month)} {allocation.year}
                      </Typography>
                    </TableCell>
                    <TableCell>{allocation.field?.name || '-'}</TableCell>
                    <TableCell align="right">{formatNumber(allocation.total_oil)}</TableCell>
                    <TableCell align="right">{formatNumber(allocation.total_gas)}</TableCell>
                    <TableCell align="right">{formatNumber(allocation.total_water)}</TableCell>
                    <TableCell align="right">{formatNumber(allocation.allocated_oil)}</TableCell>
                    <TableCell align="right">{formatNumber(allocation.allocated_gas)}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={t(`production.allocation.status.${allocation.status}`)} 
                        color={getStatusColor(allocation.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('common.view')}>
                        <IconButton size="small" onClick={() => navigate(`/production/allocations/${allocation.id}`)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {(allocation.status === 'DRAFT' || allocation.status === 'PENDING') && (
                        <Tooltip title={t('production.allocation.approve')}>
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => setApproveDialog({ open: true, allocation })}
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
            count={allocationsPagination?.total || 0}
            page={(filters.page || 1) - 1}
            onPageChange={handlePageChange}
            rowsPerPage={filters.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </TableContainer>
      )}

      {/* Generate Allocation Dialog */}
      <Dialog open={generateDialog.open} onClose={() => setGenerateDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('production.allocation.generate')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label={t('production.field')}
                value={generateForm.fieldId}
                onChange={(e) => setGenerateForm((prev) => ({ ...prev, fieldId: e.target.value }))}
                required
              >
                <MenuItem value="">{t('production.selectField')}</MenuItem>
                {fields.map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label={t('production.allocation.month')}
                value={generateForm.month}
                onChange={(e) => setGenerateForm((prev) => ({ ...prev, month: e.target.value }))}
              >
                {MONTHS.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {t(`common.months.${month.label.toLowerCase()}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label={t('common.year')}
                value={generateForm.year}
                onChange={(e) => setGenerateForm((prev) => ({ ...prev, year: e.target.value }))}
              >
                {getYears().map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialog({ open: false })}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleGenerate} 
            disabled={!generateForm.fieldId || generating}
            startIcon={generating ? <CircularProgress size={20} /> : <CalculateIcon />}
          >
            {t('production.allocation.generate')}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={approveDialog.open}
        title={t('common.confirm')}
        message={t('production.allocation.approveConfirm')}
        onConfirm={handleApprove}
        onCancel={() => setApproveDialog({ open: false, allocation: null })}
      />
    </Box>
  );
};

export default AllocationList;
