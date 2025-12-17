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
import { fetchPolicies } from '../../store/slices/complianceSlice';

const POLICY_CATEGORIES = ['HSE', 'OPERATIONS', 'HR', 'FINANCE', 'IT', 'QUALITY', 'ENVIRONMENTAL', 'SECURITY', 'ETHICS', 'OTHER'];
const POLICY_STATUSES = ['DRAFT', 'UNDER_REVIEW', 'ACTIVE', 'SUPERSEDED', 'ARCHIVED'];

const getStatusColor = (status) => {
  switch (status) {
    case 'DRAFT': return 'default';
    case 'UNDER_REVIEW': return 'warning';
    case 'ACTIVE': return 'success';
    case 'SUPERSEDED': return 'info';
    case 'ARCHIVED': return 'default';
    default: return 'default';
  }
};

const PolicyList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { policies, policiesPagination, policiesLoading } = useSelector((state) => state.compliance);
  const [filters, setFilters] = useState({ search: '', status: '', category: '', page: 1, limit: 10 });

  useEffect(() => { dispatch(fetchPolicies(filters)); }, [dispatch, filters]);

  const handleFilterChange = (field, value) => setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  const handleClearFilters = () => setFilters({ search: '', status: '', category: '', page: 1, limit: 10 });
  const handlePageChange = (e, newPage) => setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  const handleRowsPerPageChange = (e) => setFilters((prev) => ({ ...prev, limit: parseInt(e.target.value, 10), page: 1 }));

  const MobileCard = ({ policy }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>{policy.title}</Typography>
          <Chip label={t(`compliance.policyStatus.${policy.status?.toLowerCase()}`)} size="small" color={getStatusColor(policy.status)} />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>{policy.code} - v{policy.version}</Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.category')}</Typography>
            <Typography variant="body2">{t(`compliance.policyCategory.${policy.category?.toLowerCase()}`)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.effectiveDate')}</Typography>
            <Typography variant="body2">{new Date(policy.effective_date).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/compliance/policies/${policy.id}`)}>{t('common.view')}</Button>
        {['DRAFT', 'UNDER_REVIEW'].includes(policy.status) && (
          <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/compliance/policies/${policy.id}/edit`)}>{t('common.edit')}</Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">{t('compliance.policies')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/compliance/policies/new')}>{t('compliance.newPolicy')}</Button>
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
              {POLICY_STATUSES.map((s) => <MenuItem key={s} value={s}>{t(`compliance.policyStatus.${s.toLowerCase()}`)}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" select label={t('compliance.category')} value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}>
              <MenuItem value="">{t('common.all')}</MenuItem>
              {POLICY_CATEGORIES.map((cat) => <MenuItem key={cat} value={cat}>{t(`compliance.policyCategory.${cat.toLowerCase()}`)}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button startIcon={<ClearIcon />} onClick={handleClearFilters} fullWidth>{t('common.clear')}</Button>
          </Grid>
        </Grid>
      </Paper>

      {policiesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : isMobile ? (
        <Box>
          {policies.map((policy) => <MobileCard key={policy.id} policy={policy} />)}
          {policies.length === 0 && <Typography color="text.secondary" align="center" sx={{ py: 4 }}>{t('common.noData')}</Typography>}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('compliance.code')}</TableCell>
                <TableCell>{t('compliance.title')}</TableCell>
                <TableCell>{t('compliance.category')}</TableCell>
                <TableCell>{t('compliance.version')}</TableCell>
                <TableCell>{t('compliance.effectiveDate')}</TableCell>
                <TableCell>{t('compliance.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id} hover>
                  <TableCell><Typography variant="body2" fontWeight="medium">{policy.code}</Typography></TableCell>
                  <TableCell><Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{policy.title}</Typography></TableCell>
                  <TableCell><Chip label={t(`compliance.policyCategory.${policy.category?.toLowerCase()}`)} size="small" variant="outlined" /></TableCell>
                  <TableCell>v{policy.version}</TableCell>
                  <TableCell>{new Date(policy.effective_date).toLocaleDateString()}</TableCell>
                  <TableCell><Chip label={t(`compliance.policyStatus.${policy.status?.toLowerCase()}`)} size="small" color={getStatusColor(policy.status)} /></TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.view')}><IconButton size="small" onClick={() => navigate(`/compliance/policies/${policy.id}`)}><ViewIcon /></IconButton></Tooltip>
                    {['DRAFT', 'UNDER_REVIEW'].includes(policy.status) && (
                      <Tooltip title={t('common.edit')}><IconButton size="small" onClick={() => navigate(`/compliance/policies/${policy.id}/edit`)}><EditIcon /></IconButton></Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {policies.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography color="text.secondary">{t('common.noData')}</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
          <TablePagination component="div" count={policiesPagination.total} page={policiesPagination.page - 1}
            rowsPerPage={policiesPagination.limit} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]} labelRowsPerPage={t('common.rowsPerPage')} />
        </TableContainer>
      )}
    </Box>
  );
};

export default PolicyList;
