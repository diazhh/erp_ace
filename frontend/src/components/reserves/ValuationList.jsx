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
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const ValuationList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [valuations, setValuations] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', methodology: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValuation, setSelectedValuation] = useState(null);

  useEffect(() => {
    fetchValuations();
  }, [pagination.page, pagination.limit, filters]);

  const fetchValuations = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page + 1,
        limit: pagination.limit,
        search,
        ...filters,
      };
      const response = await api.get('/reserves/valuations', { params });
      setValuations(response.data.data);
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
    fetchValuations();
  };

  const handleMenuOpen = (event, valuation) => {
    setAnchorEl(event.currentTarget);
    setSelectedValuation(valuation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedValuation(null);
  };

  const handleDelete = async () => {
    if (!selectedValuation) return;
    try {
      await api.delete(`/reserves/valuations/${selectedValuation.id}`);
      fetchValuations();
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
    };
    return colors[status] || 'default';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return '-';
    return `$${parseFloat(num).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MM`;
  };

  // Mobile Card View
  const MobileCard = ({ valuation }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {valuation.code}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {valuation.estimate?.field?.name || '-'}
            </Typography>
          </Box>
          <Chip 
            label={t(`reserves.status.${valuation.status}`)} 
            color={getStatusColor(valuation.status)}
            size="small"
          />
        </Box>
        <Box mt={2}>
          <Typography variant="body2">
            <strong>NPV 2P:</strong> {formatCurrency(valuation.npv_2p)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('reserves.fields.valuationDate')}: {formatDate(valuation.valuation_date)}
          </Typography>
        </Box>
        <Box mt={1} display="flex" justifyContent="flex-end">
          <IconButton size="small" onClick={() => navigate(`/reserves/valuations/${valuation.id}`)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton size="small" onClick={() => navigate(`/reserves/valuations/${valuation.id}/edit`)}>
            <EditIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box p={isMobile ? 2 : 3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1">
          {t('reserves.valuations.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/reserves/valuations/new')}
        >
          {t('reserves.valuations.new')}
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
                <InputLabel>{t('reserves.fields.methodology')}</InputLabel>
                <Select
                  value={filters.methodology}
                  label={t('reserves.fields.methodology')}
                  onChange={(e) => setFilters(prev => ({ ...prev, methodology: e.target.value }))}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  <MenuItem value="DCF">DCF</MenuItem>
                  <MenuItem value="COMPARABLE">Comparable</MenuItem>
                  <MenuItem value="COST">Cost</MenuItem>
                  <MenuItem value="OPTION">Option</MenuItem>
                  <MenuItem value="HYBRID">Hybrid</MenuItem>
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
        <Box>
          {valuations.length > 0 ? (
            valuations.map((valuation) => (
              <MobileCard key={valuation.id} valuation={valuation} />
            ))
          ) : (
            <Typography align="center" color="text.secondary" py={4}>
              {t('common.noData')}
            </Typography>
          )}
        </Box>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('reserves.fields.code')}</TableCell>
                  <TableCell>{t('reserves.fields.field')}</TableCell>
                  <TableCell>{t('reserves.fields.valuationDate')}</TableCell>
                  <TableCell>{t('reserves.fields.priceScenario')}</TableCell>
                  <TableCell align="right">{t('reserves.fields.npv2p')}</TableCell>
                  <TableCell>{t('reserves.fields.status')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {valuations.length > 0 ? (
                  valuations.map((valuation) => (
                    <TableRow key={valuation.id} hover>
                      <TableCell>{valuation.code}</TableCell>
                      <TableCell>{valuation.estimate?.field?.name || '-'}</TableCell>
                      <TableCell>{formatDate(valuation.valuation_date)}</TableCell>
                      <TableCell>{t(`reserves.priceScenario.${valuation.price_scenario}`)}</TableCell>
                      <TableCell align="right">{formatCurrency(valuation.npv_2p)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={t(`reserves.status.${valuation.status}`)} 
                          color={getStatusColor(valuation.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => navigate(`/reserves/valuations/${valuation.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => navigate(`/reserves/valuations/${valuation.id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, valuation)}>
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
        <MenuItem onClick={() => { navigate(`/reserves/valuations/${selectedValuation?.id}`); handleMenuClose(); }}>
          <VisibilityIcon sx={{ mr: 1 }} /> {t('common.view')}
        </MenuItem>
        <MenuItem onClick={() => { navigate(`/reserves/valuations/${selectedValuation?.id}/edit`); handleMenuClose(); }}>
          <EditIcon sx={{ mr: 1 }} /> {t('common.edit')}
        </MenuItem>
        {selectedValuation?.status === 'DRAFT' && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} /> {t('common.delete')}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ValuationList;
