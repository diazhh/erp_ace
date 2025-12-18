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
  CheckCircle as ApproveIcon,
} from '@mui/icons-material';
import { fetchQualities, deleteQuality, approveQuality } from '../../../store/slices/logisticsSlice';
import ConfirmDialog from '../../../components/ConfirmDialog';

const QUALITY_STATUSES = ['PENDING', 'ANALYZED', 'APPROVED', 'REJECTED'];

const QualityList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { qualities, qualitiesPagination, loading } = useSelector((state) => state.logistics);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, quality: null });

  useEffect(() => {
    dispatch(fetchQualities(filters));
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
    if (deleteDialog.quality) {
      await dispatch(deleteQuality(deleteDialog.quality.id));
      setDeleteDialog({ open: false, quality: null });
      dispatch(fetchQualities(filters));
    }
  };

  const handleApprove = async (id) => {
    await dispatch(approveQuality(id));
    dispatch(fetchQualities(filters));
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      ANALYZED: 'info',
      APPROVED: 'success',
      REJECTED: 'error',
    };
    return colors[status] || 'default';
  };

  const renderMobileCard = (quality) => (
    <Card key={quality.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{quality.code}</Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(quality.sample_date).toLocaleDateString()}
            </Typography>
          </Box>
          <Chip label={quality.status} size="small" color={getStatusColor(quality.status)} />
        </Box>
        <Typography variant="body2" gutterBottom>
          <strong>{t('logistics.field')}:</strong> {quality.field?.name || '-'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>{t('logistics.tank')}:</strong> {quality.tank?.name || '-'}
        </Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <Typography variant="caption" color="textSecondary">API</Typography>
            <Typography variant="body2">{quality.api_gravity ? `${quality.api_gravity}°` : '-'}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="textSecondary">BSW</Typography>
            <Typography variant="body2">{quality.bsw ? `${quality.bsw}%` : '-'}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="textSecondary">{t('logistics.sulfur')}</Typography>
            <Typography variant="body2">{quality.sulfur_content ? `${quality.sulfur_content}%` : '-'}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/logistics/quality/${quality.id}`)}>
            {t('common.view')}
          </Button>
          {quality.status !== 'APPROVED' && (
            <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/logistics/quality/${quality.id}/edit`)}>
              {t('common.edit')}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          {t('logistics.crudeQuality')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/logistics/quality/new')}
          fullWidth={isMobile}
        >
          {t('logistics.newQualitySample')}
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
                label={t('common.status')}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                {QUALITY_STATUSES.map((status) => (
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
          {qualities.map(renderMobileCard)}
        </Box>
      ) : (
        /* Desktop Table */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('logistics.code')}</TableCell>
                <TableCell>{t('logistics.sampleDate')}</TableCell>
                <TableCell>{t('logistics.field')}</TableCell>
                <TableCell>{t('logistics.tank')}</TableCell>
                <TableCell align="right">{t('logistics.apiGravity')}</TableCell>
                <TableCell align="right">{t('logistics.bsw')}</TableCell>
                <TableCell align="right">{t('logistics.sulfur')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qualities.map((quality) => (
                <TableRow key={quality.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{quality.code}</Typography>
                  </TableCell>
                  <TableCell>{new Date(quality.sample_date).toLocaleDateString()}</TableCell>
                  <TableCell>{quality.field?.name || '-'}</TableCell>
                  <TableCell>{quality.tank?.name || '-'}</TableCell>
                  <TableCell align="right">{quality.api_gravity ? `${quality.api_gravity}°` : '-'}</TableCell>
                  <TableCell align="right">{quality.bsw ? `${quality.bsw}%` : '-'}</TableCell>
                  <TableCell align="right">{quality.sulfur_content ? `${quality.sulfur_content}%` : '-'}</TableCell>
                  <TableCell>
                    <Chip label={quality.status} size="small" color={getStatusColor(quality.status)} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => navigate(`/logistics/quality/${quality.id}`)}>
                      <ViewIcon />
                    </IconButton>
                    {quality.status !== 'APPROVED' && (
                      <>
                        <IconButton size="small" onClick={() => navigate(`/logistics/quality/${quality.id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                        {quality.status === 'ANALYZED' && (
                          <IconButton size="small" color="success" onClick={() => handleApprove(quality.id)}>
                            <ApproveIcon />
                          </IconButton>
                        )}
                        <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, quality })}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={qualitiesPagination?.total || 0}
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
        title={t('logistics.deleteQuality')}
        message={t('logistics.deleteQualityConfirm', { code: deleteDialog.quality?.code })}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, quality: null })}
      />
    </Box>
  );
};

export default QualityList;
