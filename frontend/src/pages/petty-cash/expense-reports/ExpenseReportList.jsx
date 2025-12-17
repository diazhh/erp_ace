import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Send as SendIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { fetchExpenseReports, clearError, clearSuccess } from '../../../store/slices/expenseReportSlice';
import { useAnyPermission } from "../../../hooks/usePermission";

const statusColors = {
  DRAFT: 'default',
  SUBMITTED: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

const statusLabels = {
  DRAFT: 'Borrador',
  SUBMITTED: 'Enviado',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

export default function ExpenseReportList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { reports, pagination, loading } = useSelector((state) => state.expenseReports);

  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 20,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchExpenseReports(filters));
  }, [dispatch, filters]);

  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters((prev) => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value, page: 1 }));
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const canCreate = useAnyPermission(['expense_reports:create', 'expense_reports:*', 'petty_cash:expense', 'petty_cash:*']);
  const canApprove = useAnyPermission(['expense_reports:approve', 'expense_reports:*', 'petty_cash:approve', 'petty_cash:*']);

  // Mobile card view
  const renderMobileCard = (report) => (
    <Card key={report.id} sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {report.code}
            </Typography>
            <Chip
              label={statusLabels[report.status]}
              color={statusColors[report.status]}
              size="small"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            {report.employee?.firstName} {report.employee?.lastName}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Fecha: {formatDate(report.reportDate)}</Typography>
            <Typography variant="body2" fontWeight="bold">
              {formatCurrency(report.totalSpent)}
            </Typography>
          </Box>
          
          {report.pettyCashEntry?.pettyCash && (
            <Typography variant="caption" color="text.secondary">
              Caja: {report.pettyCashEntry.pettyCash.name}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ViewIcon />}
              onClick={() => navigate(`/petty-cash/expense-reports/${report.id}`)}
            >
              Ver
            </Button>
            {report.status === 'DRAFT' && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/petty-cash/expense-reports/${report.id}/edit`)}
              >
                Editar
              </Button>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          {t('expenseReports.title', 'Reportes de Gastos')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/petty-cash/expense-reports/new')}
            >
              {isMobile ? 'Nuevo' : 'Nuevo Reporte'}
            </Button>
          )}
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Estado"
                value={filters.status}
                onChange={handleFilterChange('status')}
                size="small"
              >
                <MenuItem value="">Todos</MenuItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Content */}
      {isMobile ? (
        // Mobile view - Cards
        <Box>
          {reports.map(renderMobileCard)}
          {reports.length === 0 && !loading && (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No hay reportes de gastos
            </Typography>
          )}
        </Box>
      ) : (
        // Desktop view - Table
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Empleado</TableCell>
                <TableCell>Caja Chica</TableCell>
                <TableCell align="right">Recibido</TableCell>
                <TableCell align="right">Gastado</TableCell>
                <TableCell align="right">Diferencia</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">{report.code}</Typography>
                  </TableCell>
                  <TableCell>{formatDate(report.reportDate)}</TableCell>
                  <TableCell>
                    {report.employee?.firstName} {report.employee?.lastName}
                  </TableCell>
                  <TableCell>
                    {report.pettyCashEntry?.pettyCash?.name || '-'}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(report.amountReceived)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(report.totalSpent)}
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      color={report.difference > 0 ? 'error.main' : report.difference < 0 ? 'success.main' : 'text.primary'}
                    >
                      {formatCurrency(report.difference)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[report.status]}
                      color={statusColors[report.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver detalle">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/petty-cash/expense-reports/${report.id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {report.status === 'DRAFT' && (
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/petty-cash/expense-reports/${report.id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography color="text.secondary" py={4}>
                      No hay reportes de gastos
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage="Filas por página"
          />
        </TableContainer>
      )}
    </Box>
  );
}
