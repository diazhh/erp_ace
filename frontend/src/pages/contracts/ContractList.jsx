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
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { fetchContracts, deleteContract } from '../../store/slices/contractSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const CONTRACT_TYPES = ['PSA', 'SERVICE', 'JOA', 'CONCESSION', 'FARMOUT', 'LEASE', 'OTHER'];
const CONTRACT_STATUSES = ['DRAFT', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'TERMINATED'];

const STATUS_COLORS = {
  DRAFT: 'default',
  ACTIVE: 'success',
  SUSPENDED: 'warning',
  EXPIRED: 'error',
  TERMINATED: 'error',
};

const ContractList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { contracts, contractsPagination, loading } = useSelector((state) => state.contracts);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchContracts(filters));
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

  const handleDeleteClick = (contract) => {
    setContractToDelete(contract);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (contractToDelete) {
      await dispatch(deleteContract(contractToDelete.id));
      setDeleteDialogOpen(false);
      setContractToDelete(null);
    }
  };

  const renderMobileCard = (contract) => (
    <Card key={contract.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {contract.code}
          </Typography>
          <Chip
            label={t(`contracts.status.${contract.status?.toLowerCase()}`)}
            color={STATUS_COLORS[contract.status] || 'default'}
            size="small"
          />
        </Box>
        <Typography variant="body1" gutterBottom>
          {contract.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(`contracts.types.${contract.type?.toLowerCase()}`)}
        </Typography>
        {contract.operator && (
          <Typography variant="body2" color="text.secondary">
            {t('contracts.fields.operator')}: {contract.operator.name}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {contract.parties?.slice(0, 3).map((party) => (
            <Chip
              key={party.id}
              label={`${party.party_name} (${party.working_interest}%)`}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/contracts/${contract.id}`)}>
          {t('common.view')}
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/contracts/${contract.id}/edit`)}>
          {t('common.edit')}
        </Button>
        {contract.status === 'DRAFT' && (
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(contract)}>
            {t('common.delete')}
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" component="h1">
          {t('contracts.list.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/contracts/new')}
          fullWidth={isMobile}
        >
          {t('contracts.actions.newContract')}
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
                {CONTRACT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`contracts.types.${type.toLowerCase()}`)}
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
                {CONTRACT_STATUSES.map((status) => (
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
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        // Mobile: Cards
        <Box>
          {contracts.length > 0 ? (
            contracts.map(renderMobileCard)
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('common.noData')}</Typography>
            </Paper>
          )}
        </Box>
      ) : (
        // Desktop: Table
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('contracts.fields.code')}</TableCell>
                  <TableCell>{t('contracts.fields.name')}</TableCell>
                  <TableCell>{t('contracts.fields.type')}</TableCell>
                  <TableCell>{t('contracts.fields.operator')}</TableCell>
                  <TableCell>{t('contracts.fields.status')}</TableCell>
                  <TableCell>{t('contracts.fields.endDate')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.length > 0 ? (
                  contracts.map((contract) => (
                    <TableRow key={contract.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {contract.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{contract.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={t(`contracts.types.${contract.type?.toLowerCase()}`)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{contract.operator?.name || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={t(`contracts.status.${contract.status?.toLowerCase()}`)}
                          color={STATUS_COLORS[contract.status] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('common.view')}>
                          <IconButton size="small" onClick={() => navigate(`/contracts/${contract.id}`)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.edit')}>
                          <IconButton size="small" onClick={() => navigate(`/contracts/${contract.id}/edit`)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {contract.status === 'DRAFT' && (
                          <Tooltip title={t('common.delete')}>
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(contract)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
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
            count={contractsPagination.total}
            page={contractsPagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={contractsPagination.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('contracts.dialogs.deleteTitle')}
        message={t('contracts.dialogs.deleteMessage', { name: contractToDelete?.name })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText={t('common.delete')}
        confirmColor="error"
      />
    </Box>
  );
};

export default ContractList;
