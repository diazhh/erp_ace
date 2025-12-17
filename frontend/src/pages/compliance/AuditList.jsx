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
import { fetchAudits } from '../../store/slices/complianceSlice';

const AUDIT_TYPES = ['INTERNAL', 'EXTERNAL', 'REGULATORY', 'CERTIFICATION', 'SURVEILLANCE'];
const AUDIT_STATUSES = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'CANCELLED'];

const getStatusColor = (status) => {
  switch (status) {
    case 'PLANNED': return 'info';
    case 'IN_PROGRESS': return 'warning';
    case 'COMPLETED': return 'success';
    case 'CLOSED': return 'default';
    case 'CANCELLED': return 'error';
    default: return 'default';
  }
};

const AuditList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { audits, auditsPagination, auditsLoading } = useSelector((state) => state.compliance);
  const [filters, setFilters] = useState({ search: '', status: '', type: '', page: 1, limit: 10 });

  useEffect(() => { dispatch(fetchAudits(filters)); }, [dispatch, filters]);

  const handleFilterChange = (field, value) => setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  const handleClearFilters = () => setFilters({ search: '', status: '', type: '', page: 1, limit: 10 });
  const handlePageChange = (e, newPage) => setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  const handleRowsPerPageChange = (e) => setFilters((prev) => ({ ...prev, limit: parseInt(e.target.value, 10), page: 1 }));

  const MobileCard = ({ audit }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>{audit.title}</Typography>
          <Chip label={t(`compliance.auditStatus.${audit.status?.toLowerCase()}`)} size="small" color={getStatusColor(audit.status)} />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>{audit.code}</Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.type')}</Typography>
            <Typography variant="body2">{t(`compliance.auditType.${audit.type?.toLowerCase()}`)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.startDate')}</Typography>
            <Typography variant="body2">{new Date(audit.start_date).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.findings')}</Typography>
            <Typography variant="body2">{audit.findings_count || 0}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.department')}</Typography>
            <Typography variant="body2">{audit.department?.name || '-'}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/compliance/audits/${audit.id}`)}>{t('common.view')}</Button>
        {['PLANNED', 'IN_PROGRESS'].includes(audit.status) && (
          <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/compliance/audits/${audit.id}/edit`)}>{t('common.edit')}</Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">{t('compliance.complianceAudits')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/compliance/audits/new')}>{t('compliance.newAudit')}</Button>
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
              {AUDIT_STATUSES.map((s) => <MenuItem key={s} value={s}>{t(`compliance.auditStatus.${s.toLowerCase()}`)}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" select label={t('compliance.type')} value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}>
              <MenuItem value="">{t('common.all')}</MenuItem>
              {AUDIT_TYPES.map((type) => <MenuItem key={type} value={type}>{t(`compliance.auditType.${type.toLowerCase()}`)}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button startIcon={<ClearIcon />} onClick={handleClearFilters} fullWidth>{t('common.clear')}</Button>
          </Grid>
        </Grid>
      </Paper>

      {auditsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : isMobile ? (
        <Box>
          {audits.map((audit) => <MobileCard key={audit.id} audit={audit} />)}
          {audits.length === 0 && <Typography color="text.secondary" align="center" sx={{ py: 4 }}>{t('common.noData')}</Typography>}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('compliance.code')}</TableCell>
                <TableCell>{t('compliance.title')}</TableCell>
                <TableCell>{t('compliance.type')}</TableCell>
                <TableCell>{t('compliance.startDate')}</TableCell>
                <TableCell>{t('compliance.findings')}</TableCell>
                <TableCell>{t('compliance.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {audits.map((audit) => (
                <TableRow key={audit.id} hover>
                  <TableCell><Typography variant="body2" fontWeight="medium">{audit.code}</Typography></TableCell>
                  <TableCell><Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{audit.title}</Typography></TableCell>
                  <TableCell><Chip label={t(`compliance.auditType.${audit.type?.toLowerCase()}`)} size="small" variant="outlined" /></TableCell>
                  <TableCell>{new Date(audit.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {audit.major_findings > 0 && <Chip label={`${audit.major_findings} ${t('compliance.major')}`} size="small" color="error" />}
                      {audit.minor_findings > 0 && <Chip label={`${audit.minor_findings} ${t('compliance.minor')}`} size="small" color="warning" />}
                      {audit.observations > 0 && <Chip label={`${audit.observations} ${t('compliance.obs')}`} size="small" color="info" />}
                      {audit.findings_count === 0 && '-'}
                    </Box>
                  </TableCell>
                  <TableCell><Chip label={t(`compliance.auditStatus.${audit.status?.toLowerCase()}`)} size="small" color={getStatusColor(audit.status)} /></TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.view')}><IconButton size="small" onClick={() => navigate(`/compliance/audits/${audit.id}`)}><ViewIcon /></IconButton></Tooltip>
                    {['PLANNED', 'IN_PROGRESS'].includes(audit.status) && (
                      <Tooltip title={t('common.edit')}><IconButton size="small" onClick={() => navigate(`/compliance/audits/${audit.id}/edit`)}><EditIcon /></IconButton></Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {audits.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography color="text.secondary">{t('common.noData')}</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
          <TablePagination component="div" count={auditsPagination.total} page={auditsPagination.page - 1}
            rowsPerPage={auditsPagination.limit} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]} labelRowsPerPage={t('common.rowsPerPage')} />
        </TableContainer>
      )}
    </Box>
  );
};

export default AuditList;
