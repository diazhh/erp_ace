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
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SubmitIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { fetchAFEs, deleteAFE } from '../../store/slices/afeSlice';
import { fetchFields } from '../../store/slices/productionSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const AFE_TYPES = ['DRILLING', 'WORKOVER', 'FACILITIES', 'EXPLORATION', 'MAINTENANCE', 'OTHER'];
const AFE_STATUSES = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'CLOSED', 'CANCELLED'];

const AFEList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { afes, afesPagination, loading } = useSelector((state) => state.afe);
  const { fields } = useSelector((state) => state.production);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    fieldId: '',
    page: 1,
    limit: 10,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, afe: null });

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const queryFilters = { ...filters };
    if (!queryFilters.search) delete queryFilters.search;
    if (!queryFilters.status) delete queryFilters.status;
    if (!queryFilters.type) delete queryFilters.type;
    if (!queryFilters.fieldId) delete queryFilters.fieldId;
    dispatch(fetchAFEs(queryFilters));
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

  const handleDelete = async () => {
    if (deleteDialog.afe) {
      await dispatch(deleteAFE(deleteDialog.afe.id));
      setDeleteDialog({ open: false, afe: null });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
      IN_PROGRESS: 'info',
      CLOSED: 'secondary',
      CANCELLED: 'default',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      DRILLING: 'error',
      WORKOVER: 'warning',
      FACILITIES: 'info',
      EXPLORATION: 'secondary',
      MAINTENANCE: 'success',
      OTHER: 'default',
    };
    return colors[type] || 'default';
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-VE');
  };

  const AFECard = ({ afe }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle2" color="primary" fontWeight="bold">
            {afe.code}
          </Typography>
          <Chip
            label={t(`afe.status.${afe.status}`)}
            color={getStatusColor(afe.status)}
            size="small"
          />
        </Box>
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 1 }} noWrap>
          {afe.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={t(`afe.type.${afe.type}`)}
            color={getTypeColor(afe.type)}
            size="small"
            variant="outlined"
          />
          {afe.field && (
            <Chip label={afe.field.name} size="small" variant="outlined" />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <MoneyIcon color="success" fontSize="small" />
          <Typography variant="h6" color="success.main">
            {formatCurrency(afe.estimated_cost, afe.currency)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {formatDate(afe.created_at)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/afe/${afe.id}`)}>
          {t('common.view')}
        </Button>
        {afe.status === 'DRAFT' && (
          <>
            <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/afe/${afe.id}/edit`)}>
              {t('common.edit')}
            </Button>
            <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, afe })}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          {t('afe.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/afe/new')}
          fullWidth={isMobile}
        >
          {t('afe.new')}
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              name="search"
              label={t('common.search')}
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              name="status"
              label={t('common.status')}
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {AFE_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`afe.status.${status}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              name="type"
              label={t('afe.type.label')}
              value={filters.type}
              onChange={handleFilterChange}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {AFE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`afe.type.${type}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              select
              name="fieldId"
              label={t('production.field')}
              value={filters.fieldId}
              onChange={handleFilterChange}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {fields?.map((field) => (
                <MenuItem key={field.id} value={field.id}>
                  {field.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {isMobile ? (
        <Grid container spacing={2}>
          {afes.map((afe) => (
            <Grid item xs={12} key={afe.id}>
              <AFECard afe={afe} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('afe.code')}</TableCell>
                <TableCell>{t('afe.titleField')}</TableCell>
                <TableCell>{t('afe.type.label')}</TableCell>
                <TableCell>{t('production.field')}</TableCell>
                <TableCell align="right">{t('afe.estimatedCost')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell>{t('common.date')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {afes.map((afe) => (
                <TableRow key={afe.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {afe.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {afe.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`afe.type.${afe.type}`)}
                      color={getTypeColor(afe.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{afe.field?.name || '-'}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {formatCurrency(afe.estimated_cost, afe.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`afe.status.${afe.status}`)}
                      color={getStatusColor(afe.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(afe.created_at)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={t('common.view')}>
                      <IconButton size="small" onClick={() => navigate(`/afe/${afe.id}`)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {afe.status === 'DRAFT' && (
                      <>
                        <Tooltip title={t('common.edit')}>
                          <IconButton size="small" onClick={() => navigate(`/afe/${afe.id}/edit`)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.delete')}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, afe })}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {afes.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="text.secondary" sx={{ py: 4 }}>
                      {t('common.noData')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={afesPagination.total}
            page={afesPagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={afesPagination.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </TableContainer>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        title={t('afe.deleteTitle')}
        message={t('afe.deleteMessage', { code: deleteDialog.afe?.code })}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, afe: null })}
      />
    </Box>
  );
};

export default AFEList;
