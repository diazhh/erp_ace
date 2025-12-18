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
} from '@mui/icons-material';
import { fetchTickets, deleteTicket } from '../../../store/slices/logisticsSlice';
import ConfirmDialog from '../../../components/ConfirmDialog';

const TICKET_TYPES = ['LOADING', 'UNLOADING', 'TRANSFER'];
const TICKET_STATUSES = ['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'VOID'];
const PRODUCT_TYPES = ['CRUDE', 'DIESEL', 'GASOLINE', 'WATER', 'CHEMICALS', 'CONDENSATE'];

const TicketList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { tickets, ticketsPagination, loading } = useSelector((state) => state.logistics);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    product_type: '',
    page: 1,
    limit: 10,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, ticket: null });

  useEffect(() => {
    dispatch(fetchTickets(filters));
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
    if (deleteDialog.ticket) {
      await dispatch(deleteTicket(deleteDialog.ticket.id));
      setDeleteDialog({ open: false, ticket: null });
      dispatch(fetchTickets(filters));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      IN_PROGRESS: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'error',
      VOID: 'error',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      LOADING: 'primary',
      UNLOADING: 'secondary',
      TRANSFER: 'info',
    };
    return colors[type] || 'default';
  };

  const renderMobileCard = (ticket) => (
    <Card key={ticket.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{ticket.code}</Typography>
            <Typography variant="body2" color="textSecondary">
              {ticket.loading_start ? new Date(ticket.loading_start).toLocaleDateString() : '-'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip label={ticket.type} size="small" color={getTypeColor(ticket.type)} />
            <Chip label={ticket.status} size="small" color={getStatusColor(ticket.status)} />
          </Box>
        </Box>
        <Typography variant="body2" gutterBottom>
          <strong>{t('logistics.source')}:</strong> {ticket.sourceTank?.name || '-'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>{t('logistics.destination')}:</strong> {ticket.destination || ticket.destinationTank?.name || '-'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>{t('logistics.volume')}:</strong> {parseFloat(ticket.gross_volume || 0).toLocaleString()} bbl
        </Typography>
        {ticket.vehicle_plate && (
          <Typography variant="body2" gutterBottom>
            <strong>{t('logistics.vehicle')}:</strong> {ticket.vehicle_plate} - {ticket.driver_name}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/logistics/tickets/${ticket.id}`)}>
            {t('common.view')}
          </Button>
          {ticket.status === 'DRAFT' && (
            <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/logistics/tickets/${ticket.id}/edit`)}>
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
          {t('logistics.loadingTickets')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/logistics/tickets/new')}
          fullWidth={isMobile}
        >
          {t('logistics.newTicket')}
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
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
                label={t('logistics.type')}
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                {TICKET_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                size="small"
                select
                label={t('common.status')}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                {TICKET_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                size="small"
                select
                label={t('logistics.product')}
                value={filters.product_type}
                onChange={(e) => handleFilterChange('product_type', e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                {PRODUCT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
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
          {tickets.map(renderMobileCard)}
        </Box>
      ) : (
        /* Desktop Table */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('logistics.code')}</TableCell>
                <TableCell>{t('logistics.type')}</TableCell>
                <TableCell>{t('logistics.source')}</TableCell>
                <TableCell>{t('logistics.destination')}</TableCell>
                <TableCell>{t('logistics.product')}</TableCell>
                <TableCell align="right">{t('logistics.volume')}</TableCell>
                <TableCell>{t('logistics.vehicle')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{ticket.code}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {ticket.loading_start ? new Date(ticket.loading_start).toLocaleDateString() : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={ticket.type} size="small" color={getTypeColor(ticket.type)} />
                  </TableCell>
                  <TableCell>{ticket.sourceTank?.name || '-'}</TableCell>
                  <TableCell>{ticket.destination || ticket.destinationTank?.name || '-'}</TableCell>
                  <TableCell>{ticket.product_type}</TableCell>
                  <TableCell align="right">
                    {parseFloat(ticket.gross_volume || 0).toLocaleString()} bbl
                  </TableCell>
                  <TableCell>
                    {ticket.vehicle_plate || '-'}
                  </TableCell>
                  <TableCell>
                    <Chip label={ticket.status} size="small" color={getStatusColor(ticket.status)} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => navigate(`/logistics/tickets/${ticket.id}`)}>
                      <ViewIcon />
                    </IconButton>
                    {ticket.status === 'DRAFT' && (
                      <>
                        <IconButton size="small" onClick={() => navigate(`/logistics/tickets/${ticket.id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, ticket })}>
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
            count={ticketsPagination?.total || 0}
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
        title={t('logistics.deleteTicket')}
        message={t('logistics.deleteTicketConfirm', { code: deleteDialog.ticket?.code })}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, ticket: null })}
      />
    </Box>
  );
};

export default TicketList;
