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
  InputAdornment,
  useTheme,
  useMediaQuery,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { fetchReports } from '../../store/slices/complianceSlice';

const REPORT_TYPES = ['PRODUCTION', 'ENVIRONMENTAL', 'FISCAL', 'SAFETY', 'OPERATIONAL', 'FINANCIAL', 'OTHER'];
const REPORT_ENTITIES = ['MENPET', 'SENIAT', 'INEA', 'MINEA', 'PDVSA', 'ANH', 'OTHER'];
const REPORT_STATUSES = ['DRAFT', 'PENDING', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'REVISION_REQUIRED'];

const getStatusColor = (status) => {
  switch (status) {
    case 'DRAFT': return 'default';
    case 'PENDING': return 'warning';
    case 'SUBMITTED': return 'info';
    case 'ACCEPTED': return 'success';
    case 'REJECTED': return 'error';
    case 'REVISION_REQUIRED': return 'warning';
    default: return 'default';
  }
};

const ReportList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { reports, reportsPagination, reportsLoading } = useSelector((state) => state.compliance);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    entity: '',
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchReports(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', type: '', entity: '', page: 1, limit: 10 });
  };

  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters((prev) => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const MobileCard = ({ report }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
            {report.title}
          </Typography>
          <Chip label={t(`compliance.status.${report.status?.toLowerCase()}`)} size="small" color={getStatusColor(report.status)} />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {report.code}
        </Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.type')}</Typography>
            <Typography variant="body2">{t(`compliance.reportType.${report.type?.toLowerCase()}`)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.entity')}</Typography>
            <Typography variant="body2">{report.entity}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.dueDate')}</Typography>
            <Typography variant="body2">{new Date(report.due_date).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">{t('compliance.field')}</Typography>
            <Typography variant="body2">{report.field?.name || '-'}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/compliance/reports/${report.id}`)}>
          {t('common.view')}
        </Button>
        {['DRAFT', 'REVISION_REQUIRED'].includes(report.status) && (
          <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/compliance/reports/${report.id}/edit`)}>
            {t('common.edit')}
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
          {t('compliance.regulatoryReports')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/compliance/reports/new')}>
          {t('compliance.newReport')}
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
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
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label={t('compliance.status')}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {REPORT_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`compliance.status.${status.toLowerCase()}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label={t('compliance.type')}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {REPORT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`compliance.reportType.${type.toLowerCase()}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label={t('compliance.entity')}
              value={filters.entity}
              onChange={(e) => handleFilterChange('entity', e.target.value)}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {REPORT_ENTITIES.map((entity) => (
                <MenuItem key={entity} value={entity}>{entity}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button startIcon={<ClearIcon />} onClick={handleClearFilters} fullWidth>
              {t('common.clear')}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {reportsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Box>
          {reports.map((report) => (
            <MobileCard key={report.id} report={report} />
          ))}
          {reports.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              {t('common.noData')}
            </Typography>
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('compliance.code')}</TableCell>
                <TableCell>{t('compliance.title')}</TableCell>
                <TableCell>{t('compliance.type')}</TableCell>
                <TableCell>{t('compliance.entity')}</TableCell>
                <TableCell>{t('compliance.dueDate')}</TableCell>
                <TableCell>{t('compliance.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{report.code}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>{report.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={t(`compliance.reportType.${report.type?.toLowerCase()}`)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{report.entity}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={new Date(report.due_date) < new Date() && !['SUBMITTED', 'ACCEPTED'].includes(report.status) ? 'error' : 'inherit'}
                    >
                      {new Date(report.due_date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={t(`compliance.status.${report.status?.toLowerCase()}`)} size="small" color={getStatusColor(report.status)} />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.view')}>
                      <IconButton size="small" onClick={() => navigate(`/compliance/reports/${report.id}`)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {['DRAFT', 'REVISION_REQUIRED'].includes(report.status) && (
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => navigate(`/compliance/reports/${report.id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">{t('common.noData')}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={reportsPagination.total}
            page={reportsPagination.page - 1}
            rowsPerPage={reportsPagination.limit}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default ReportList;
