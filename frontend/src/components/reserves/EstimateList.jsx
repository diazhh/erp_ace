import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const EstimateList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', standard: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEstimate, setSelectedEstimate] = useState(null);

  useEffect(() => {
    fetchEstimates();
  }, [pagination.page, pagination.limit, filters]);

  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page + 1,
        limit: pagination.limit,
        search,
        ...filters,
      };
      const response = await api.get('/reserves/estimates', { params });
      setEstimates(response.data.data);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || t('reserves.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchEstimates();
  };

  const handleMenuOpen = (event, estimate) => {
    setAnchorEl(event.currentTarget);
    setSelectedEstimate(estimate);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEstimate(null);
  };

  const handleDelete = async () => {
    if (!selectedEstimate) return;
    try {
      await api.delete(`/reserves/estimates/${selectedEstimate.id}`);
      fetchEstimates();
    } catch (err) {
      setError(err.response?.data?.message || t('reserves.errors.deleteFailed'));
    }
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      UNDER_REVIEW: 'warning',
      APPROVED: 'success',
      SUPERSEDED: 'info',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  // Mobile Card View
  const MobileCard = ({ estimate }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {estimate.code}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {estimate.field?.name || '-'}
            </Typography>
          </Box>
          <Chip 
            label={t(`reserves.status.${estimate.status}`)} 
            color={getStatusColor(estimate.status)}
            size="small"
          />
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t('reserves.fields.standard')}: {estimate.standard}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              {t('reserves.fields.estimateDate')}: {formatDate(estimate.estimate_date)}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={() => navigate(`/reserves/estimates/${estimate.id}`)}>
              <VisibilityIcon />
            </IconButton>
            <IconButton size="small" onClick={() => navigate(`/reserves/estimates/${estimate.id}/edit`)}>
              <EditIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box p={isMobile ? 2 : 3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1">
          {t('reserves.estimates.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/reserves/estimates/new')}
        >
          {t('reserves.estimates.new')}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
              <FormControl fullWidth size="small">
                <InputLabel>{t('reserves.fields.status')}</InputLabel>
                <Select
                  value={filters.status}
                  label={t('reserves.fields.status')}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  <MenuItem value="DRAFT">{t('reserves.status.DRAFT')}</MenuItem>
                  <MenuItem value="UNDER_REVIEW">{t('reserves.status.UNDER_REVIEW')}</MenuItem>
                  <MenuItem value="APPROVED">{t('reserves.status.APPROVED')}</MenuItem>
                  <MenuItem value="SUPERSEDED">{t('reserves.status.SUPERSEDED')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('reserves.fields.standard')}</InputLabel>
                <Select
                  value={filters.standard}
                  label={t('reserves.fields.standard')}
                  onChange={(e) => setFilters(prev => ({ ...prev, standard: e.target.value }))}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  <MenuItem value="PRMS">PRMS</MenuItem>
                  <MenuItem value="SEC">SEC</MenuItem>
                  <MenuItem value="SPE">SPE</MenuItem>
                  <MenuItem value="PDVSA">PDVSA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="outlined" startIcon={<FilterListIcon />} onClick={handleSearch}>
                {t('common.filter')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        // Mobile View
        <Box>
          {estimates.length > 0 ? (
            estimates.map((estimate) => (
              <MobileCard key={estimate.id} estimate={estimate} />
            ))
          ) : (
            <Typography align="center" color="text.secondary" py={4}>
              {t('common.noData')}
            </Typography>
          )}
        </Box>
      ) : (
        // Desktop Table View
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('reserves.fields.code')}</TableCell>
                  <TableCell>{t('reserves.fields.field')}</TableCell>
                  <TableCell>{t('reserves.fields.estimateDate')}</TableCell>
                  <TableCell>{t('reserves.fields.standard')}</TableCell>
                  <TableCell>{t('reserves.fields.evaluator')}</TableCell>
                  <TableCell>{t('reserves.fields.status')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {estimates.length > 0 ? (
                  estimates.map((estimate) => (
                    <TableRow key={estimate.id} hover>
                      <TableCell>{estimate.code}</TableCell>
                      <TableCell>{estimate.field?.name || '-'}</TableCell>
                      <TableCell>{formatDate(estimate.estimate_date)}</TableCell>
                      <TableCell>{estimate.standard}</TableCell>
                      <TableCell>
                        {estimate.evaluator === 'EXTERNAL' 
                          ? estimate.evaluator_company 
                          : t('reserves.evaluator.INTERNAL')}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={t(`reserves.status.${estimate.status}`)} 
                          color={getStatusColor(estimate.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => navigate(`/reserves/estimates/${estimate.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => navigate(`/reserves/estimates/${estimate.id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, estimate)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page}
            onPageChange={(e, newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={(e) => setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 0 }))}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </Card>
      )}

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { navigate(`/reserves/estimates/${selectedEstimate?.id}`); handleMenuClose(); }}>
          <VisibilityIcon sx={{ mr: 1 }} /> {t('common.view')}
        </MenuItem>
        <MenuItem onClick={() => { navigate(`/reserves/estimates/${selectedEstimate?.id}/edit`); handleMenuClose(); }}>
          <EditIcon sx={{ mr: 1 }} /> {t('common.edit')}
        </MenuItem>
        {selectedEstimate?.status === 'DRAFT' && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} /> {t('common.delete')}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default EstimateList;
