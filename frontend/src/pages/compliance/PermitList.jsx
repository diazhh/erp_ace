import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Paper, Typography, Button, TextField, MenuItem, IconButton, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Card, CardContent, CardActions, Grid, InputAdornment, useTheme, useMediaQuery, Tooltip, CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Visibility as ViewIcon, Edit as EditIcon, Clear as ClearIcon } from '@mui/icons-material';
import { fetchPermits } from '../../store/slices/complianceSlice';

const PERMIT_TYPES = ['EIA', 'WATER', 'EMISSIONS', 'WASTE', 'DRILLING', 'CONSTRUCTION', 'OPERATION', 'DISCHARGE', 'OTHER'];
const PERMIT_STATUSES = ['ACTIVE', 'EXPIRED', 'PENDING_RENEWAL', 'REVOKED', 'SUSPENDED', 'PENDING_APPROVAL'];

const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'EXPIRED': return 'error';
    case 'PENDING_RENEWAL': return 'warning';
    case 'REVOKED': return 'error';
    case 'SUSPENDED': return 'warning';
    case 'PENDING_APPROVAL': return 'info';
    default: return 'default';
  }
};

const PermitList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { permits, permitsPagination, permitsLoading } = useSelector((state) => state.compliance);
  const [filters, setFilters] = useState({ search: '', status: '', type: '', page: 1, limit: 10 });

  useEffect(() => { dispatch(fetchPermits(filters)); }, [dispatch, filters]);

  const handleFilterChange = (field, value) => setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  const handleClearFilters = () => setFilters({ search: '', status: '', type: '', page: 1, limit: 10 });
  const handlePageChange = (e, newPage) => setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  const handleRowsPerPageChange = (e) => setFilters((prev) => ({ ...prev, limit: parseInt(e.target.value, 10), page: 1 }));

  const MobileCard = ({ permit }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>{permit.name}</Typography>
          <Chip label={t(`compliance.permitStatus.${permit.status?.toLowerCase()}`)} size="small" color={getStatusColor(permit.status)} />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>{permit.code}</Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.type')}</Typography>
            <Typography variant="body2">{t(`compliance.permitType.${permit.type?.toLowerCase()}`)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.expiryDate')}</Typography>
            <Typography variant="body2" color={new Date(permit.expiry_date) < new Date() ? 'error' : 'inherit'}>
              {new Date(permit.expiry_date).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/compliance/permits/${permit.id}`)}>{t('common.view')}</Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/compliance/permits/${permit.id}/edit`)}>{t('common.edit')}</Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">{t('compliance.environmentalPermits')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/compliance/permits/new')}>{t('compliance.newPermit')}</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField fullWidth size="small" placeholder={t('common.search')} value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" select label={t('compliance.status')} value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}>
              <MenuItem value="">{t('common.all')}</MenuItem>
              {PERMIT_STATUSES.map((s) => <MenuItem key={s} value={s}>{t(`compliance.permitStatus.${s.toLowerCase()}`)}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" select label={t('compliance.type')} value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}>
              <MenuItem value="">{t('common.all')}</MenuItem>
              {PERMIT_TYPES.map((type) => <MenuItem key={type} value={type}>{t(`compliance.permitType.${type.toLowerCase()}`)}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button startIcon={<ClearIcon />} onClick={handleClearFilters} fullWidth>{t('common.clear')}</Button>
          </Grid>
        </Grid>
      </Paper>

      {permitsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : isMobile ? (
        <Box>
          {permits.map((permit) => <MobileCard key={permit.id} permit={permit} />)}
          {permits.length === 0 && <Typography color="text.secondary" align="center" sx={{ py: 4 }}>{t('common.noData')}</Typography>}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('compliance.code')}</TableCell>
                <TableCell>{t('compliance.name')}</TableCell>
                <TableCell>{t('compliance.type')}</TableCell>
                <TableCell>{t('compliance.issuingAuthority')}</TableCell>
                <TableCell>{t('compliance.expiryDate')}</TableCell>
                <TableCell>{t('compliance.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permits.map((permit) => (
                <TableRow key={permit.id} hover>
                  <TableCell><Typography variant="body2" fontWeight="medium">{permit.code}</Typography></TableCell>
                  <TableCell><Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{permit.name}</Typography></TableCell>
                  <TableCell><Chip label={t(`compliance.permitType.${permit.type?.toLowerCase()}`)} size="small" variant="outlined" /></TableCell>
                  <TableCell>{permit.issuing_authority}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color={new Date(permit.expiry_date) < new Date() ? 'error' : 'inherit'}>
                      {new Date(permit.expiry_date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell><Chip label={t(`compliance.permitStatus.${permit.status?.toLowerCase()}`)} size="small" color={getStatusColor(permit.status)} /></TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.view')}><IconButton size="small" onClick={() => navigate(`/compliance/permits/${permit.id}`)}><ViewIcon /></IconButton></Tooltip>
                    <Tooltip title={t('common.edit')}><IconButton size="small" onClick={() => navigate(`/compliance/permits/${permit.id}/edit`)}><EditIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {permits.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography color="text.secondary">{t('common.noData')}</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
          <TablePagination component="div" count={permitsPagination.total} page={permitsPagination.page - 1}
            rowsPerPage={permitsPagination.limit} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]} labelRowsPerPage={t('common.rowsPerPage')} />
        </TableContainer>
      )}
    </Box>
  );
};

export default PermitList;
