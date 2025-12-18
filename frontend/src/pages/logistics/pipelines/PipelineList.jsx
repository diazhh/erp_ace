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
} from '@mui/icons-material';
import { fetchPipelines, deletePipeline } from '../../../store/slices/logisticsSlice';
import ConfirmDialog from '../../../components/ConfirmDialog';

const PIPELINE_TYPES = ['CRUDE', 'GAS', 'WATER', 'MULTIPHASE', 'CONDENSATE', 'DIESEL'];
const PIPELINE_STATUSES = ['ACTIVE', 'MAINTENANCE', 'SHUTDOWN', 'DECOMMISSIONED'];

const PipelineList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { pipelines, pipelinesPagination, loading } = useSelector((state) => state.logistics);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, pipeline: null });

  useEffect(() => {
    dispatch(fetchPipelines(filters));
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
    if (deleteDialog.pipeline) {
      await dispatch(deletePipeline(deleteDialog.pipeline.id));
      setDeleteDialog({ open: false, pipeline: null });
      dispatch(fetchPipelines(filters));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      MAINTENANCE: 'warning',
      SHUTDOWN: 'error',
      DECOMMISSIONED: 'default',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      CRUDE: 'primary',
      GAS: 'secondary',
      WATER: 'info',
      MULTIPHASE: 'warning',
      CONDENSATE: 'success',
      DIESEL: 'error',
    };
    return colors[type] || 'default';
  };

  const renderMobileCard = (pipeline) => (
    <Card key={pipeline.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{pipeline.code}</Typography>
            <Typography variant="body2" color="textSecondary">{pipeline.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip label={pipeline.type} size="small" color={getTypeColor(pipeline.type)} />
            <Chip label={pipeline.status} size="small" color={getStatusColor(pipeline.status)} />
          </Box>
        </Box>
        <Typography variant="body2" gutterBottom>
          <strong>{t('logistics.origin')}:</strong> {pipeline.origin || pipeline.originField?.name || '-'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>{t('logistics.destination')}:</strong> {pipeline.destination || pipeline.destinationField?.name || '-'}
        </Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <Typography variant="caption" color="textSecondary">{t('logistics.length')}</Typography>
            <Typography variant="body2">{pipeline.length_km ? `${pipeline.length_km} km` : '-'}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="textSecondary">{t('logistics.diameter')}</Typography>
            <Typography variant="body2">{pipeline.diameter_inches ? `${pipeline.diameter_inches}"` : '-'}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="textSecondary">{t('logistics.capacity')}</Typography>
            <Typography variant="body2">{pipeline.capacity_bpd ? `${parseFloat(pipeline.capacity_bpd).toLocaleString()} bpd` : '-'}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/logistics/pipelines/${pipeline.id}`)}>
            {t('common.view')}
          </Button>
          <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/logistics/pipelines/${pipeline.id}/edit`)}>
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
          {t('logistics.pipelines')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/logistics/pipelines/new')}
          fullWidth={isMobile}
        >
          {t('logistics.newPipeline')}
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
                {PIPELINE_TYPES.map((type) => (
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
                {PIPELINE_STATUSES.map((status) => (
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
          {pipelines.map(renderMobileCard)}
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
                <TableCell>{t('logistics.origin')}</TableCell>
                <TableCell>{t('logistics.destination')}</TableCell>
                <TableCell align="right">{t('logistics.length')}</TableCell>
                <TableCell align="right">{t('logistics.diameter')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pipelines.map((pipeline) => (
                <TableRow key={pipeline.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{pipeline.code}</Typography>
                  </TableCell>
                  <TableCell>{pipeline.name}</TableCell>
                  <TableCell>
                    <Chip label={pipeline.type} size="small" color={getTypeColor(pipeline.type)} />
                  </TableCell>
                  <TableCell>{pipeline.origin || pipeline.originField?.name || '-'}</TableCell>
                  <TableCell>{pipeline.destination || pipeline.destinationField?.name || '-'}</TableCell>
                  <TableCell align="right">{pipeline.length_km ? `${pipeline.length_km} km` : '-'}</TableCell>
                  <TableCell align="right">{pipeline.diameter_inches ? `${pipeline.diameter_inches}"` : '-'}</TableCell>
                  <TableCell>
                    <Chip label={pipeline.status} size="small" color={getStatusColor(pipeline.status)} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => navigate(`/logistics/pipelines/${pipeline.id}`)}>
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/logistics/pipelines/${pipeline.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, pipeline })}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={pipelinesPagination?.total || 0}
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
        title={t('logistics.deletePipeline')}
        message={t('logistics.deletePipelineConfirm', { code: deleteDialog.pipeline?.code })}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, pipeline: null })}
      />
    </Box>
  );
};

export default PipelineList;
