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
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Terrain as FieldIcon,
} from '@mui/icons-material';
import { fetchFields, deleteField } from '../../store/slices/productionSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const FieldList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { fields, fieldsPagination, loading } = useSelector((state) => state.production);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    page: 1,
    limit: 10,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, field: null });

  useEffect(() => {
    dispatch(fetchFields(filters));
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
    if (deleteDialog.field) {
      await dispatch(deleteField(deleteDialog.field.id));
      setDeleteDialog({ open: false, field: null });
      dispatch(fetchFields(filters));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      INACTIVE: 'default',
      ABANDONED: 'error',
      UNDER_DEVELOPMENT: 'warning',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    return type === 'ONSHORE' ? 'primary' : 'info';
  };

  const FieldCard = ({ field }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FieldIcon color="primary" />
            <Typography variant="h6">{field.code}</Typography>
          </Box>
          <Chip label={t(`production.status.${field.status}`)} color={getStatusColor(field.status)} size="small" />
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
          {field.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {field.location || '-'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={t(`production.type.${field.type}`)} color={getTypeColor(field.type)} size="small" variant="outlined" />
          {field.wells?.length > 0 && (
            <Chip label={`${field.wells.length} ${t('production.wellsCount')}`} size="small" variant="outlined" />
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/production/fields/${field.id}`)}>
          {t('common.view')}
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/production/fields/${field.id}/edit`)}>
          {t('common.edit')}
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialog({ open: true, field })}>
          {t('common.delete')}
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t('production.fields.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('production.fields.subtitle')}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/production/fields/new')} fullWidth={isMobile}>
          {t('production.fields.new')}
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder={t('common.search')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              select
              size="small"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              label={t('common.status')}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="ACTIVE">{t('production.status.ACTIVE')}</MenuItem>
              <MenuItem value="INACTIVE">{t('production.status.INACTIVE')}</MenuItem>
              <MenuItem value="ABANDONED">{t('production.status.ABANDONED')}</MenuItem>
              <MenuItem value="UNDER_DEVELOPMENT">{t('production.status.UNDER_DEVELOPMENT')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              select
              size="small"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              label={t('production.type.label')}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="ONSHORE">{t('production.type.ONSHORE')}</MenuItem>
              <MenuItem value="OFFSHORE">{t('production.type.OFFSHORE')}</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Content */}
      {isMobile ? (
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} key={field.id}>
              <FieldCard field={field} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('production.fields.code')}</TableCell>
                <TableCell>{t('production.fields.name')}</TableCell>
                <TableCell>{t('production.type.label')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell>{t('production.fields.location')}</TableCell>
                <TableCell>{t('production.wells')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {field.code}
                    </Typography>
                  </TableCell>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>
                    <Chip label={t(`production.type.${field.type}`)} color={getTypeColor(field.type)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={t(`production.status.${field.status}`)} color={getStatusColor(field.status)} size="small" />
                  </TableCell>
                  <TableCell>{field.location || '-'}</TableCell>
                  <TableCell>{field.wells?.length || 0}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => navigate(`/production/fields/${field.id}`)} title={t('common.view')}>
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/production/fields/${field.id}/edit`)} title={t('common.edit')}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, field })} title={t('common.delete')}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {fields.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      {t('common.noData')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {fieldsPagination && (
            <TablePagination
              component="div"
              count={fieldsPagination.total}
              page={fieldsPagination.page - 1}
              rowsPerPage={fieldsPagination.limit}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage={t('common.rowsPerPage')}
            />
          )}
        </TableContainer>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        title={t('production.fields.deleteTitle')}
        message={t('production.fields.deleteMessage', { name: deleteDialog.field?.name })}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, field: null })}
      />
    </Box>
  );
};

export default FieldList;
