import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchEmployees, deleteEmployee } from '../store/slices/employeeSlice';
import ConfirmDialog from '../components/ConfirmDialog';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  ON_LEAVE: 'warning',
  TERMINATED: 'error',
};

const Employees = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { employees, pagination, loading } = useSelector((state) => state.employees);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, [page, rowsPerPage, search]);

  const loadEmployees = () => {
    dispatch(fetchEmployees({
      page: page + 1,
      limit: rowsPerPage,
      search: search || undefined,
    }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteEmployee(employeeToDelete.id)).unwrap();
      toast.success(t('employees.employeeDeleted'));
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      toast.error(error);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      ACTIVE: t('employees.status.active'),
      INACTIVE: t('employees.status.inactive'),
      ON_LEAVE: t('employees.status.onLeave'),
      TERMINATED: t('employees.status.terminated'),
    };
    return labels[status] || status;
  };

  const renderMobileCard = (employee) => (
    <Card key={employee.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {employee.firstName} {employee.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {employee.employeeCode}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={getStatusLabel(employee.status)}
            color={statusColors[employee.status]}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {employee.idType}-{employee.idNumber}
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {employee.position}
        </Typography>
        {employee.department && (
          <Typography variant="body2" color="text.secondary">
            {employee.department}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<ViewIcon />} onClick={() => navigate(`/employees/${employee.id}`)}>
          {t('common.view')}
        </Button>
        <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/employees/${employee.id}/edit`)}>
          {t('common.edit')}
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(employee)}>
          {t('common.delete')}
        </Button>
      </CardActions>
    </Card>
  );

  const renderMobileList = () => (
    <Box>
      {loading ? (
        [...Array(3)].map((_, i) => (
          <Card key={i} sx={{ mb: 2 }}>
            <CardContent>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        ))
      ) : employees.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">{t('common.noData')}</Typography>
        </Paper>
      ) : (
        employees.map(renderMobileCard)
      )}
    </Box>
  );

  const renderTable = () => (
    <TableContainer component={Paper}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('employees.code')}</TableCell>
              <TableCell>{t('employees.firstName')}</TableCell>
              <TableCell>{t('employees.lastName')}</TableCell>
              <TableCell>{t('employees.idNumber')}</TableCell>
              <TableCell>{t('employees.position')}</TableCell>
              <TableCell>{t('employees.department')}</TableCell>
              <TableCell>{t('common.status')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>{employee.employeeCode}</TableCell>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.idType}-{employee.idNumber}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(employee.status)}
                      color={statusColors[employee.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.view')}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/employees/${employee.id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.edit')}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/employees/${employee.id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(employee)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('employees.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/employees/new')}
        >
          {t('employees.newEmployee')}
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          placeholder={t('common.search')}
          value={search}
          onChange={handleSearchChange}
          size="small"
          fullWidth={isMobile}
          sx={{ width: isMobile ? '100%' : 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {isMobile ? renderMobileList() : renderTable()}

      <TablePagination
        component={Paper}
        count={pagination.total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage={isMobile ? '' : t('common.rowsPerPage')}
        sx={{ mt: 2 }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('common.confirm')}
        message={t('employees.deleteConfirm', { name: `${employeeToDelete?.firstName} ${employeeToDelete?.lastName}` })}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default Employees;
