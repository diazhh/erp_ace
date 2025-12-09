import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  MenuItem,
  useMediaQuery,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import organizationService from '../../services/organizationService';
import DownloadPDFButton from '../../components/common/DownloadPDFButton';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Directory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    loadDirectory();
  }, [search, selectedLetter, selectedDepartment, page]);

  const loadDirectory = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 24,
      };
      if (search) params.search = search;
      if (selectedLetter) params.letter = selectedLetter;
      if (selectedDepartment) params.departmentId = selectedDepartment;

      const response = await organizationService.getDirectory(params);
      setEmployees(response.data?.employees || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Error al cargar directorio');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await organizationService.listDepartments({ status: 'ACTIVE' });
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
    setSelectedLetter('');
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(selectedLetter === letter ? '' : letter);
    setPage(1);
    setSearch('');
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setPage(1);
  };

  const handleViewEmployee = (id) => {
    navigate(`/employees/${id}`);
  };

  const EmployeeCard = ({ employee }) => (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => handleViewEmployee(employee.id)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar
            src={employee.photoUrl}
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
          </Avatar>
          <Typography variant="h6" gutterBottom>
            {employee.firstName} {employee.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {employee.positionRef?.name || employee.position}
          </Typography>
          {employee.departmentRef && (
            <Chip
              label={employee.departmentRef.name}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          )}
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
          {employee.email && (
            <Tooltip title={employee.email}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `mailto:${employee.email}`;
                }}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {(employee.phone || employee.mobilePhone) && (
            <Tooltip title={employee.phone || employee.mobilePhone}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${employee.phone || employee.mobilePhone}`;
                }}
              >
                <PhoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {employee.extension && (
            <Tooltip title={`Ext. ${employee.extension}`}>
              <Chip label={`Ext. ${employee.extension}`} size="small" />
            </Tooltip>
          )}
        </Box>
        {employee.officeLocation && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {employee.officeLocation}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const EmployeeListItem = ({ employee }) => (
    <Card
      sx={{
        mb: 1,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
      }}
      onClick={() => handleViewEmployee(employee.id)}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={employee.photoUrl}
            sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
          >
            {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {employee.positionRef?.name || employee.position}
              {employee.departmentRef && ` • ${employee.departmentRef.name}`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            {employee.email && (
              <Tooltip title={employee.email}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `mailto:${employee.email}`;
                  }}
                >
                  <EmailIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {(employee.phone || employee.mobilePhone) && (
              <Tooltip title={employee.phone || employee.mobilePhone}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${employee.phone || employee.mobilePhone}`;
                  }}
                >
                  <PhoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Directorio de Empleados
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <DownloadPDFButton
            endpoint={`/reports/employees?departmentId=${selectedDepartment || ''}`}
            filename={`empleados-${new Date().toISOString().split('T')[0]}.pdf`}
            variant="outlined"
          />
          <Button
            variant="outlined"
            startIcon={<BusinessIcon />}
            onClick={() => navigate('/organization/chart')}
          >
            Ver Organigrama
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              placeholder="Buscar por nombre, email, cargo..."
              value={search}
              onChange={handleSearchChange}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Departamento"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              size="small"
              fullWidth
            >
              <MenuItem value="">Todos</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {!isMobile && (
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, value) => value && setViewMode(value)}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Grid>
        </Grid>

        {/* Filtro alfabético */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {alphabet.map((letter) => (
            <Chip
              key={letter}
              label={letter}
              size="small"
              variant={selectedLetter === letter ? 'filled' : 'outlined'}
              color={selectedLetter === letter ? 'primary' : 'default'}
              onClick={() => handleLetterClick(letter)}
              sx={{ minWidth: 32 }}
            />
          ))}
          {selectedLetter && (
            <Chip
              label="Limpiar"
              size="small"
              color="secondary"
              onDelete={() => setSelectedLetter('')}
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      </Paper>

      {/* Contenido */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : employees.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No se encontraron empleados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta con otros criterios de búsqueda
          </Typography>
        </Paper>
      ) : (
        <>
          {viewMode === 'grid' || isMobile ? (
            <Grid container spacing={2}>
              {employees.map((employee) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={employee.id}>
                  <EmployeeCard employee={employee} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper>
              {employees.map((employee) => (
                <EmployeeListItem key={employee.id} employee={employee} />
              ))}
            </Paper>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Directory;
