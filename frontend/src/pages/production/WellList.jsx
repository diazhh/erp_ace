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
  OilBarrel as WellIcon,
} from '@mui/icons-material';
import { fetchWells, fetchFields, deleteWell } from '../../store/slices/productionSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const WellList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { wells, wellsPagination, fields, loading } = useSelector((state) => state.production);

  const [filters, setFilters] = useState({
    search: '',
    fieldId: '',
    status: '',
    type: '',
    page: 1,
    limit: 10,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, well: null });

  useEffect(() => {
    dispatch(fetchFields({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchWells(filters));
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
    if (deleteDialog.well) {
      await dispatch(deleteWell(deleteDialog.well.id));
      setDeleteDialog({ open: false, well: null });
      dispatch(fetchWells(filters));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      INACTIVE: 'default',
      SHUT_IN: 'warning',
      ABANDONED: 'error',
      DRILLING: 'info',
      COMPLETING: 'info',
      WORKOVER: 'secondary',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      PRODUCER: 'success',
      INJECTOR: 'info',
      OBSERVATION: 'default',
      DISPOSAL: 'warning',
      EXPLORATION: 'secondary',
    };
    return colors[type] || 'default';
  };

  const WellCard = ({ well }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WellIcon color="primary" />
            <Typography variant="h6">{well.code}</Typography>
          </Box>
          <Chip label={t(`production.wellStatus.${well.status}`)} color={getStatusColor(well.status)} size="small" />
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
          {well.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {well.field?.name || '-'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={t(`production.wellType.${well.type}`)} color={getTypeColor(well.type)} size="small" variant="outlined" />
          {well.classification && (
            <Chip label={t(`production.classification.${well.classification}`)} size="small" variant="outlined" />
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/production/wells/${well.id}`)}>
          {t('common.view')}
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/production/wells/${well.id}/edit`)}>
          {t('common.edit')}
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialog({ open: true, well })}>
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
            {t('production.wells.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('production.wells.subtitle')}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/production/wells/new')} fullWidth={isMobile}>
          {t('production.wells.new')}
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={6} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              name="fieldId"
              value={filters.fieldId}
              onChange={handleFilterChange}
              label={t('production.field')}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {fields.map((field) => (
                <MenuItem key={field.id} value={field.id}>
                  {field.code} - {field.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
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
              <MenuItem value="ACTIVE">{t('production.wellStatus.ACTIVE')}</MenuItem>
              <MenuItem value="INACTIVE">{t('production.wellStatus.INACTIVE')}</MenuItem>
              <MenuItem value="SHUT_IN">{t('production.wellStatus.SHUT_IN')}</MenuItem>
              <MenuItem value="WORKOVER">{t('production.wellStatus.WORKOVER')}</MenuItem>
              <MenuItem value="ABANDONED">{t('production.wellStatus.ABANDONED')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              label={t('production.wellType.label')}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="PRODUCER">{t('production.wellType.PRODUCER')}</MenuItem>
              <MenuItem value="INJECTOR">{t('production.wellType.INJECTOR')}</MenuItem>
              <MenuItem value="OBSERVATION">{t('production.wellType.OBSERVATION')}</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Content */}
      {isMobile ? (
        <Grid container spacing={2}>
          {wells.map((well) => (
            <Grid item xs={12} key={well.id}>
              <WellCard well={well} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('production.wells.code')}</TableCell>
                <TableCell>{t('production.wells.name')}</TableCell>
                <TableCell>{t('production.field')}</TableCell>
                <TableCell>{t('production.wellType.label')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell>{t('production.wells.classification')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wells.map((well) => (
                <TableRow key={well.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {well.code}
                    </Typography>
                  </TableCell>
                  <TableCell>{well.name}</TableCell>
                  <TableCell>{well.field?.name || '-'}</TableCell>
                  <TableCell>
                    <Chip label={t(`production.wellType.${well.type}`)} color={getTypeColor(well.type)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={t(`production.wellStatus.${well.status}`)} color={getStatusColor(well.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    {well.classification ? t(`production.classification.${well.classification}`) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => navigate(`/production/wells/${well.id}`)} title={t('common.view')}>
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/production/wells/${well.id}/edit`)} title={t('common.edit')}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, well })} title={t('common.delete')}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {wells.length === 0 && !loading && (
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
          {wellsPagination && (
            <TablePagination
              component="div"
              count={wellsPagination.total}
              page={wellsPagination.page - 1}
              rowsPerPage={wellsPagination.limit}
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
        title={t('production.wells.deleteTitle')}
        message={t('production.wells.deleteMessage', { name: deleteDialog.well?.name })}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, well: null })}
      />
    </Box>
  );
};

export default WellList;
