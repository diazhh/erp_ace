import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Chip,
  Divider,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  alpha,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  AccountTree as TreeIcon,
  ViewList as ListIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import organizationService from '../../services/organizationService';

// Componente para nodo de departamento
const DepartmentNode = ({ department, level = 0, onViewEmployee, onViewDepartment, theme }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = (department.children && department.children.length > 0) || 
                      (department.employees && department.employees.length > 0);
  
  const bgColor = department.color || theme.palette.primary.main;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Card del departamento */}
      <Card
        sx={{
          minWidth: 220,
          maxWidth: 300,
          cursor: 'pointer',
          border: '3px solid',
          borderColor: bgColor,
          bgcolor: alpha(bgColor, 0.08),
          '&:hover': {
            boxShadow: 4,
            bgcolor: alpha(bgColor, 0.15),
          },
        }}
        onClick={() => onViewDepartment && onViewDepartment(department.id)}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: bgColor,
              }}
            >
              <BusinessIcon />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap fontWeight="bold">
                {department.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {department.code}
              </Typography>
              <Chip
                label={{
                  DIRECTION: 'Dirección',
                  MANAGEMENT: 'Gerencia',
                  DEPARTMENT: 'Departamento',
                  AREA: 'Área',
                  UNIT: 'Unidad',
                }[department.type] || department.type}
                size="small"
                sx={{
                  mt: 0.5,
                  height: 20,
                  fontSize: '0.65rem',
                  bgcolor: bgColor,
                  color: 'white',
                }}
              />
            </Box>
          </Box>
          
          {/* Manager */}
          {department.manager && (
            <Box 
              sx={{ 
                mt: 1.5, 
                pt: 1.5, 
                borderTop: '1px dashed',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onViewEmployee(department.manager.id);
              }}
            >
              <Avatar
                src={department.manager.photoUrl}
                sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
              >
                {department.manager.firstName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="caption" fontWeight="bold">
                  {department.manager.firstName} {department.manager.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {department.manager.position || 'Gerente'}
                </Typography>
              </Box>
            </Box>
          )}
          
          {/* Contador de empleados */}
          {department.employeeCount > 0 && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <GroupsIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {department.employeeCount} empleados
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Botón para expandir/colapsar */}
      {hasChildren && (
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          sx={{ mt: 0.5 }}
        >
          {expanded ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>
      )}

      {/* Línea vertical hacia abajo */}
      {hasChildren && expanded && (
        <Box
          sx={{
            width: 2,
            height: 20,
            bgcolor: bgColor,
          }}
        />
      )}

      {/* Hijos (subdepartamentos y empleados) */}
      <Collapse in={expanded}>
        {hasChildren && (
          <Box sx={{ position: 'relative' }}>
            {/* Línea horizontal */}
            {((department.children?.length || 0) + (department.employees?.length || 0)) > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  right: '10%',
                  height: 2,
                  bgcolor: bgColor,
                }}
              />
            )}
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                pt: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {/* Subdepartamentos */}
              {department.children?.map((child) => (
                <Box key={child.id} sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -16,
                      left: '50%',
                      width: 2,
                      height: 16,
                      bgcolor: bgColor,
                      transform: 'translateX(-50%)',
                    }}
                  />
                  <DepartmentNode
                    department={child}
                    level={level + 1}
                    onViewEmployee={onViewEmployee}
                    onViewDepartment={onViewDepartment}
                    theme={theme}
                  />
                </Box>
              ))}
              
              {/* Empleados del departamento (sin subdepartamentos) */}
              {department.employees?.map((emp) => (
                <Box key={emp.id} sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -16,
                      left: '50%',
                      width: 2,
                      height: 16,
                      bgcolor: bgColor,
                      transform: 'translateX(-50%)',
                    }}
                  />
                  <EmployeeNode
                    employee={emp}
                    onViewEmployee={onViewEmployee}
                    color={bgColor}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

// Componente para nodo de empleado
const EmployeeNode = ({ employee, onViewEmployee, color }) => {
  return (
    <Card
      sx={{
        minWidth: 180,
        maxWidth: 220,
        cursor: 'pointer',
        border: '2px solid',
        borderColor: color || 'primary.main',
        '&:hover': {
          boxShadow: 4,
        },
      }}
      onClick={() => onViewEmployee(employee.id)}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={employee.photoUrl}
            sx={{
              width: 36,
              height: 36,
              bgcolor: color || 'primary.main',
            }}
          >
            {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap fontWeight="bold">
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap display="block">
              {employee.position}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Componente para un nodo del organigrama por jerarquía
const OrgNode = ({ employee, level = 0, onViewEmployee }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Card del empleado */}
      <Card
        sx={{
          minWidth: 200,
          maxWidth: 280,
          cursor: 'pointer',
          border: '2px solid',
          borderColor: employee.departmentColor || 'primary.main',
          '&:hover': {
            boxShadow: 4,
          },
        }}
        onClick={() => onViewEmployee(employee.id)}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={employee.photoUrl}
              sx={{
                width: 48,
                height: 48,
                bgcolor: employee.departmentColor || 'primary.main',
              }}
            >
              {employee.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap fontWeight="bold">
                {employee.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {employee.position}
              </Typography>
              {employee.department && (
                <Chip
                  label={employee.department}
                  size="small"
                  sx={{
                    mt: 0.5,
                    height: 20,
                    fontSize: '0.65rem',
                    bgcolor: employee.departmentColor || 'primary.main',
                    color: 'white',
                  }}
                />
              )}
            </Box>
          </Box>
          {/* Info de contacto */}
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {employee.email && (
              <Tooltip title={employee.email}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${employee.email}`; }}>
                  <EmailIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {employee.phone && (
              <Tooltip title={employee.phone}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${employee.phone}`; }}>
                  <PhoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Botón para expandir/colapsar */}
      {hasSubordinates && (
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          sx={{ mt: 0.5 }}
        >
          {expanded ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>
      )}

      {/* Línea vertical hacia abajo */}
      {hasSubordinates && expanded && (
        <Box
          sx={{
            width: 2,
            height: 20,
            bgcolor: 'divider',
          }}
        />
      )}

      {/* Subordinados */}
      <Collapse in={expanded}>
        {hasSubordinates && (
          <Box sx={{ position: 'relative' }}>
            {/* Línea horizontal */}
            {employee.subordinates.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '25%',
                  right: '25%',
                  height: 2,
                  bgcolor: 'divider',
                }}
              />
            )}
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                pt: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {employee.subordinates.map((sub) => (
                <Box key={sub.id} sx={{ position: 'relative' }}>
                  {/* Línea vertical hacia arriba */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -16,
                      left: '50%',
                      width: 2,
                      height: 16,
                      bgcolor: 'divider',
                      transform: 'translateX(-50%)',
                    }}
                  />
                  <OrgNode
                    employee={sub}
                    level={level + 1}
                    onViewEmployee={onViewEmployee}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

// Componente para vista de lista de departamentos (móvil)
const DepartmentList = ({ departments, level = 0, onViewEmployee }) => {
  return (
    <Box sx={{ pl: level * 2 }}>
      {departments.map((dept) => (
        <Box key={dept.id}>
          <Card
            sx={{
              mb: 1,
              borderLeft: `4px solid ${dept.color || '#1976d2'}`,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: dept.color || 'primary.main' }}>
                  <BusinessIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {dept.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dept.code} • {{
                      DIRECTION: 'Dirección',
                      MANAGEMENT: 'Gerencia',
                      DEPARTMENT: 'Departamento',
                      AREA: 'Área',
                      UNIT: 'Unidad',
                    }[dept.type] || dept.type}
                  </Typography>
                </Box>
                {dept.employeeCount > 0 && (
                  <Chip
                    label={`${dept.employeeCount}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    icon={<GroupsIcon />}
                  />
                )}
              </Box>
              {dept.manager && (
                <Box 
                  sx={{ mt: 1, pt: 1, borderTop: '1px dashed', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                  onClick={() => onViewEmployee(dept.manager.id)}
                >
                  <Avatar src={dept.manager.photoUrl} sx={{ width: 28, height: 28 }}>
                    {dept.manager.firstName?.charAt(0)}
                  </Avatar>
                  <Typography variant="caption">
                    {dept.manager.firstName} {dept.manager.lastName}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          {dept.children && dept.children.length > 0 && (
            <DepartmentList
              departments={dept.children}
              level={level + 1}
              onViewEmployee={onViewEmployee}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

// Componente para vista de lista (móvil)
const OrgList = ({ employees, level = 0, onViewEmployee }) => {
  return (
    <Box sx={{ pl: level * 2 }}>
      {employees.map((emp) => (
        <Box key={emp.id}>
          <Card
            sx={{
              mb: 1,
              cursor: 'pointer',
              borderLeft: `4px solid ${emp.departmentColor || '#1976d2'}`,
            }}
            onClick={() => onViewEmployee(emp.id)}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={emp.photoUrl}
                  sx={{ bgcolor: emp.departmentColor || 'primary.main' }}
                >
                  {emp.name?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {emp.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {emp.position}
                  </Typography>
                  {emp.department && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      {emp.department}
                    </Typography>
                  )}
                </Box>
                {emp.subordinates?.length > 0 && (
                  <Chip
                    label={`${emp.subordinates.length} reportes`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </CardContent>
          </Card>
          {emp.subordinates && emp.subordinates.length > 0 && (
            <OrgList
              employees={emp.subordinates}
              level={level + 1}
              onViewEmployee={onViewEmployee}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

const OrgChart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [orgChart, setOrgChart] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('departments'); // 'departments' | 'hierarchy'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orgResponse, deptResponse, statsResponse] = await Promise.all([
        organizationService.getOrgChart(),
        organizationService.getDepartmentTree(),
        organizationService.getOrgStats(),
      ]);
      setOrgChart(orgResponse.data || []);
      setDepartments(deptResponse.data || []);
      setStats(statsResponse.data);
    } catch (error) {
      toast.error('Error al cargar organigrama');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEmployee = (id) => {
    navigate(`/employees/${id}`);
  };

  const handleViewDepartment = (id) => {
    // Por ahora navegar a departamentos
    navigate('/organization/departments');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/organization/departments')}
          >
            Departamentos
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Organigrama
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="departments">
              <Tooltip title="Por Departamentos">
                <BusinessIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="hierarchy">
              <Tooltip title="Por Jerarquía">
                <TreeIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={() => navigate('/organization/directory')}
          >
            Ver Directorio
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">{stats.totalEmployees}</Typography>
              <Typography variant="body2" color="text.secondary">Empleados</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">{stats.totalDepartments}</Typography>
              <Typography variant="body2" color="text.secondary">Departamentos</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">{stats.totalPositions}</Typography>
              <Typography variant="body2" color="text.secondary">Posiciones</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{stats.activeEmployees || stats.totalEmployees}</Typography>
              <Typography variant="body2" color="text.secondary">Activos</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Vista por Departamentos */}
      {viewMode === 'departments' && (
        departments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay departamentos definidos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Crea departamentos para ver la estructura organizacional
            </Typography>
            <Button variant="contained" onClick={() => navigate('/organization/departments')}>
              Ir a Departamentos
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ p: 3, overflow: 'auto' }}>
            {isMobile ? (
              <DepartmentList departments={departments} onViewEmployee={handleViewEmployee} />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 'fit-content',
                }}
              >
                {departments.map((dept) => (
                  <Box key={dept.id} sx={{ mb: 4 }}>
                    <DepartmentNode
                      department={dept}
                      onViewEmployee={handleViewEmployee}
                      onViewDepartment={handleViewDepartment}
                      theme={theme}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        )
      )}

      {/* Vista por Jerarquía */}
      {viewMode === 'hierarchy' && (
        orgChart.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <TreeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay estructura jerárquica definida
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Asigna supervisores a los empleados para ver el organigrama
            </Typography>
            <Button variant="contained" onClick={() => navigate('/employees')}>
              Ir a Empleados
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ p: 3, overflow: 'auto' }}>
            {isMobile ? (
              <OrgList employees={orgChart} onViewEmployee={handleViewEmployee} />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 'fit-content',
                }}
              >
                {orgChart.map((employee) => (
                  <Box key={employee.id} sx={{ mb: 4 }}>
                    <OrgNode
                      employee={employee}
                      onViewEmployee={handleViewEmployee}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        )
      )}
    </Box>
  );
};

export default OrgChart;
