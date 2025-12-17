import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
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
  useTheme,
  useMediaQuery,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { fetchConcessions, deleteConcession } from '../../store/slices/contractSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const CONCESSION_TYPES = ['EXPLORATION', 'DEVELOPMENT', 'PRODUCTION', 'MIXED'];
const CONCESSION_STATUSES = ['ACTIVE', 'RELINQUISHED', 'EXPIRED', 'PENDING', 'SUSPENDED'];

const STATUS_COLORS = {
  ACTIVE: 'success',
  RELINQUISHED: 'default',
  EXPIRED: 'error',
  PENDING: 'warning',
  SUSPENDED: 'warning',
};

const ConcessionList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { concessions, concessionsPagination, concessionsLoading } = useSelector((state) => state.contracts);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [concessionToDelete, setConcessionToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchConcessions(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', type: '', status: '', page: 1, limit: 10 });
  };

  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters((prev) => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleDeleteClick = (concession) => {
    setConcessionToDelete(concession);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (concessionToDelete) {
      await dispatch(deleteConcession(concessionToDelete.id));
      setDeleteDialogOpen(false);
      setConcessionToDelete(null);
    }
  };

  const renderMobileCard = (concession) => (
    <Card key={concession.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="bold">
              {concession.code}
            </Typography>
          </Box>
          <Chip
            label={t(`contracts.status.${concession.status?.toLowerCase()}`)}
            color={STATUS_COLORS[concession.status] || 'default'}
            size="small"
          />
        </Box>
        <Typography variant="body1" gutterBottom>
          {concession.name}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('contracts.fields.type')}</Typography>
            <Typography variant="body2">{t(`contracts.concessionTypes.${concession.type?.toLowerCase()}`)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('contracts.fields.area')}</Typography>
            <Typography variant="body2">{concession.area_km2} km²</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('contracts.fields.location')}</Typography>
            <Typography variant="body2">{concession.location || '-'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('contracts.fields.expiryDate')}</Typography>
            <Typography variant="body2">{concession.expiry_date ? new Date(concession.expiry_date).toLocaleDateString() : '-'}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/contracts/concessions/${concession.id}`)}>
          {t('common.view')}
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/contracts/concessions/${concession.id}/edit`)}>
          {t('common.edit')}
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MapIcon color="primary" fontSize="large" />
          <Typography variant="h4" component="h1">
            {t('contracts.concessions.title')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/contracts/concessions/new')}
          fullWidth={isMobile}
        >
          {t('contracts.actions.newConcession')}
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('contracts.fields.type')}</InputLabel>
              <Select
                value={filters.type}
                label={t('contracts.fields.type')}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                {CONCESSION_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`contracts.concessionTypes.${type.toLowerCase()}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('contracts.fields.status')}</InputLabel>
              <Select
                value={filters.status}
                label={t('contracts.fields.status')}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                {CONCESSION_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {t(`contracts.status.${status.toLowerCase()}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                fullWidth={isMobile}
              >
                {t('common.clearFilters')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {concessionsLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Box>
          {concessions.length > 0 ? (
            concessions.map(renderMobileCard)
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('common.noData')}</Typography>
            </Paper>
          )}
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('contracts.fields.code')}</TableCell>
                  <TableCell>{t('contracts.fields.name')}</TableCell>
                  <TableCell>{t('contracts.fields.type')}</TableCell>
                  <TableCell>{t('contracts.fields.location')}</TableCell>
                  <TableCell align="right">{t('contracts.fields.area')}</TableCell>
                  <TableCell>{t('contracts.fields.status')}</TableCell>
                  <TableCell>{t('contracts.fields.expiryDate')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {concessions.length > 0 ? (
                  concessions.map((concession) => (
                    <TableRow key={concession.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {concession.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{concession.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={t(`contracts.concessionTypes.${concession.type?.toLowerCase()}`)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{concession.location || '-'}</TableCell>
                      <TableCell align="right">{concession.area_km2 ? `${concession.area_km2} km²` : '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={t(`contracts.status.${concession.status?.toLowerCase()}`)}
                          color={STATUS_COLORS[concession.status] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {concession.expiry_date ? new Date(concession.expiry_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('common.view')}>
                          <IconButton size="small" onClick={() => navigate(`/contracts/concessions/${concession.id}`)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.edit')}>
                          <IconButton size="small" onClick={() => navigate(`/contracts/concessions/${concession.id}/edit`)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
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
          </TableContainer>
          <TablePagination
            component="div"
            count={concessionsPagination.total}
            page={concessionsPagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={concessionsPagination.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('contracts.dialogs.deleteConcessionTitle')}
        message={t('contracts.dialogs.deleteConcessionMessage', { name: concessionToDelete?.name })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText={t('common.delete')}
        confirmColor="error"
      />
    </Box>
  );
};

export default ConcessionList;
