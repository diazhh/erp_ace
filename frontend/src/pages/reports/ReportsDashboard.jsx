import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Autocomplete,
  Tabs,
  Tab,
  Snackbar,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  People as PeopleIcon,
  AccountBalance as FinanceIcon,
  Inventory as InventoryIcon,
  DirectionsCar as FleetIcon,
  Engineering as ProjectsIcon,
  HealthAndSafety as HseIcon,
  Receipt as PayrollIcon,
  Download as DownloadIcon,
  Warehouse as WarehouseIcon,
  CreditCard as LoanIcon,
  AccountBalanceWallet as AccountIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import api from '../../services/api';
import { getServerBaseUrl } from '../../utils/fileUrl';

const ReportsDashboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Datos para selectores
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [payrollPeriods, setPayrollPeriods] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  // Selecciones actuales
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [selectedPayrollEmployee, setSelectedPayrollEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filtros
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: '',
  });

  // Cargar datos al montar
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [
        empRes,
        projRes,
        vehRes,
        whRes,
        accRes,
        payRes,
        deptRes,
        itemRes,
      ] = await Promise.all([
        api.get('/employees?limit=500').catch(() => ({ data: { data: [] } })),
        api.get('/projects?limit=500').catch(() => ({ data: { data: [] } })),
        api.get('/fleet/vehicles?limit=500').catch(() => ({ data: { data: [] } })),
        api.get('/inventory/warehouses?limit=500').catch(() => ({ data: { data: [] } })),
        api.get('/finance/accounts?limit=500').catch(() => ({ data: { data: [] } })),
        api.get('/payroll/periods?limit=100').catch(() => ({ data: { data: [] } })),
        api.get('/organization/departments?limit=100').catch(() => ({ data: { data: [] } })),
        api.get('/inventory/items?limit=500').catch(() => ({ data: { data: [] } })),
      ]);

      setEmployees(empRes.data?.data || empRes.data || []);
      setProjects(projRes.data?.data || projRes.data || []);
      setVehicles(vehRes.data?.data || vehRes.data || []);
      setWarehouses(whRes.data?.data || whRes.data || []);
      setBankAccounts(accRes.data?.data || accRes.data || []);
      setPayrollPeriods(payRes.data?.data || payRes.data || []);
      setDepartments(deptRes.data?.data || deptRes.data || []);
      setInventoryItems(itemRes.data?.data || itemRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const downloadReport = async (endpoint, format = 'pdf', params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString().split('T')[0]);
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const queryString = queryParams.toString();
      const url = `${getServerBaseUrl()}/api/reports${endpoint}${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || t('reports.downloadError'));
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `reporte.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      setSuccess(t('reports.success'));
    } catch (err) {
      setError(err.message || t('reports.downloadError'));
    } finally {
      setLoading(false);
    }
  };

  // Componente de botones de descarga
  const DownloadButtons = ({ onPdf, onExcel, disabled, pdfOnly = false }) => (
    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
      <Button
        variant="contained"
        color="error"
        startIcon={<PdfIcon />}
        onClick={onPdf}
        disabled={disabled || loading}
        fullWidth={isMobile}
      >
        {t('reports.downloadPdf')}
      </Button>
      {!pdfOnly && (
        <Button
          variant="contained"
          color="success"
          startIcon={<ExcelIcon />}
          onClick={onExcel}
          disabled={disabled || loading}
          fullWidth={isMobile}
        >
          {t('reports.downloadExcel')}
        </Button>
      )}
    </Box>
  );

  // Componente de rango de fechas
  const DateRangeFilter = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label={t('reports.startDate')}
            value={filters.startDate}
            onChange={(date) => setFilters({ ...filters, startDate: date })}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label={t('reports.endDate')}
            value={filters.endDate}
            onChange={(date) => setFilters({ ...filters, endDate: date })}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );

  // ========== TABS DE REPORTES ==========

  const EmployeesTab = () => (
    <Grid container spacing={3}>
      {/* Listado General */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="primary" />
              {t('reports.employeesList')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.employeesListDesc') || 'Listado completo de empleados con filtros opcionales'}
            </Typography>
            
            <Autocomplete
              options={departments}
              getOptionLabel={(opt) => opt.name || ''}
              value={selectedDepartment}
              onChange={(_, val) => setSelectedDepartment(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectDepartment') || 'Departamento (opcional)'} size="small" />
              )}
              sx={{ mb: 2 }}
            />
            
            <TextField
              select
              fullWidth
              size="small"
              label={t('reports.status')}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="ACTIVE">{t('common.active')}</MenuItem>
              <MenuItem value="INACTIVE">{t('common.inactive')}</MenuItem>
            </TextField>

            <DownloadButtons
              onPdf={() => downloadReport('/employees', 'pdf', { 
                status: filters.status, 
                departmentId: selectedDepartment?.id 
              })}
              onExcel={() => downloadReport('/excel/employees', 'excel', { 
                status: filters.status, 
                departmentId: selectedDepartment?.id 
              })}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Ficha Individual */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="primary" />
              {t('reports.employeeDetail')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.employeeDetailDesc') || 'Ficha completa de un empleado específico'}
            </Typography>
            
            <Autocomplete
              options={employees}
              getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName} (${opt.employeeCode || opt.documentNumber || 'N/A'})`}
              value={selectedEmployee}
              onChange={(_, val) => setSelectedEmployee(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectEmployee') || 'Seleccionar Empleado'} size="small" required />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport(`/employees/${selectedEmployee?.id}`, 'pdf')}
              disabled={!selectedEmployee}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const PayrollTab = () => (
    <Grid container spacing={3}>
      {/* Reporte de Nómina */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PayrollIcon color="success" />
              {t('reports.payrollReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.payrollReportDesc') || 'Reporte completo de un período de nómina'}
            </Typography>
            
            <Autocomplete
              options={payrollPeriods}
              getOptionLabel={(opt) => opt.name || opt.periodName || `Período ${opt.id}`}
              value={selectedPayroll}
              onChange={(_, val) => setSelectedPayroll(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectPayrollPeriod') || 'Seleccionar Período'} size="small" required />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport(`/payroll/${selectedPayroll?.id}`, 'pdf')}
              onExcel={() => downloadReport(`/excel/payroll/${selectedPayroll?.id}`, 'excel')}
              disabled={!selectedPayroll}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Recibo de Pago Individual */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PayrollIcon color="success" />
              {t('reports.payslip')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.payslipDesc') || 'Recibo de pago individual de un empleado'}
            </Typography>
            
            <Autocomplete
              options={payrollPeriods}
              getOptionLabel={(opt) => opt.name || opt.periodName || `Período ${opt.id}`}
              value={selectedPayroll}
              onChange={(_, val) => setSelectedPayroll(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectPayrollPeriod') || 'Seleccionar Período'} size="small" required />
              )}
              sx={{ mb: 2 }}
            />
            
            <Autocomplete
              options={employees}
              getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
              value={selectedPayrollEmployee}
              onChange={(_, val) => setSelectedPayrollEmployee(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectEmployee') || 'Seleccionar Empleado'} size="small" required />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport(`/payroll/${selectedPayroll?.id}/employee/${selectedPayrollEmployee?.id}`, 'pdf')}
              disabled={!selectedPayroll || !selectedPayrollEmployee}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Listado de Préstamos */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LoanIcon color="success" />
              {t('reports.loansList')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.loansListDesc') || 'Listado de préstamos a empleados'}
            </Typography>
            
            <DateRangeFilter />
            
            <TextField
              select
              fullWidth
              size="small"
              label={t('reports.status')}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="PENDING">Pendiente</MenuItem>
              <MenuItem value="APPROVED">Aprobado</MenuItem>
              <MenuItem value="ACTIVE">Activo</MenuItem>
              <MenuItem value="PAID">Pagado</MenuItem>
            </TextField>

            <DownloadButtons
              onPdf={() => downloadReport('/loans', 'pdf', { 
                status: filters.status,
                startDate: filters.startDate,
                endDate: filters.endDate,
              })}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const FinanceTab = () => (
    <Grid container spacing={3}>
      {/* Reporte Financiero */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FinanceIcon color="warning" />
              {t('reports.financialReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.financialReportDesc') || 'Resumen financiero por período'}
            </Typography>
            
            <DateRangeFilter />

            <DownloadButtons
              onPdf={() => downloadReport('/financial', 'pdf', { 
                startDate: filters.startDate,
                endDate: filters.endDate,
              })}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Transacciones */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FinanceIcon color="warning" />
              {t('reports.transactionsList')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.transactionsListDesc') || 'Listado de transacciones financieras'}
            </Typography>
            
            <DateRangeFilter />
            
            <Autocomplete
              options={bankAccounts}
              getOptionLabel={(opt) => `${opt.bankName} - ${opt.accountNumber}`}
              value={selectedAccount}
              onChange={(_, val) => setSelectedAccount(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectAccount') || 'Cuenta (opcional)'} size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport('/transactions', 'pdf', { 
                startDate: filters.startDate,
                endDate: filters.endDate,
                accountId: selectedAccount?.id,
              })}
              onExcel={() => downloadReport('/excel/transactions', 'excel', { 
                startDate: filters.startDate,
                endDate: filters.endDate,
                accountId: selectedAccount?.id,
              })}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Estado de Cuenta */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountIcon color="warning" />
              {t('reports.bankAccountReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.bankAccountReportDesc') || 'Estado de cuenta bancaria con movimientos'}
            </Typography>
            
            <Autocomplete
              options={bankAccounts}
              getOptionLabel={(opt) => `${opt.bankName} - ${opt.accountNumber}`}
              value={selectedAccount}
              onChange={(_, val) => setSelectedAccount(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectAccount') || 'Seleccionar Cuenta'} size="small" required />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport(`/bank-accounts/${selectedAccount?.id}`, 'pdf')}
              disabled={!selectedAccount}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const ProjectsTab = () => (
    <Grid container spacing={3}>
      {/* Listado de Proyectos */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ProjectsIcon color="secondary" />
              {t('reports.projectsList')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.projectsListDesc') || 'Listado de todos los proyectos'}
            </Typography>
            
            <TextField
              select
              fullWidth
              size="small"
              label={t('reports.status')}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="PLANNING">Planificación</MenuItem>
              <MenuItem value="IN_PROGRESS">En Progreso</MenuItem>
              <MenuItem value="COMPLETED">Completado</MenuItem>
              <MenuItem value="ON_HOLD">En Espera</MenuItem>
            </TextField>

            <DownloadButtons
              onPdf={() => downloadReport('/projects', 'pdf', { status: filters.status })}
              onExcel={() => downloadReport('/excel/projects', 'excel', { status: filters.status })}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Reporte de Proyecto Individual */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ProjectsIcon color="secondary" />
              {t('reports.projectDetail')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.projectDetailDesc') || 'Reporte detallado de un proyecto específico'}
            </Typography>
            
            <Autocomplete
              options={projects}
              getOptionLabel={(opt) => `${opt.code || ''} - ${opt.name}`}
              value={selectedProject}
              onChange={(_, val) => setSelectedProject(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectProject') || 'Seleccionar Proyecto'} size="small" required />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport(`/projects/${selectedProject?.id}`, 'pdf')}
              disabled={!selectedProject}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const InventoryTab = () => (
    <Grid container spacing={3}>
      {/* Inventario General */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InventoryIcon color="info" />
              {t('reports.inventoryReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.inventoryReportDesc') || 'Reporte general de inventario'}
            </Typography>
            
            <Autocomplete
              options={warehouses}
              getOptionLabel={(opt) => opt.name || ''}
              value={selectedWarehouse}
              onChange={(_, val) => setSelectedWarehouse(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectWarehouse') || 'Almacén (opcional)'} size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport('/inventory', 'pdf', { warehouseId: selectedWarehouse?.id })}
              onExcel={() => downloadReport('/excel/inventory', 'excel', { warehouseId: selectedWarehouse?.id })}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Reporte de Almacén */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarehouseIcon color="info" />
              {t('reports.warehouseReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.warehouseReportDesc') || 'Reporte detallado de un almacén'}
            </Typography>
            
            <Autocomplete
              options={warehouses}
              getOptionLabel={(opt) => opt.name || ''}
              value={selectedWarehouse}
              onChange={(_, val) => setSelectedWarehouse(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectWarehouse') || 'Seleccionar Almacén'} size="small" required />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport(`/inventory/warehouses/${selectedWarehouse?.id}`, 'pdf')}
              disabled={!selectedWarehouse}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Reporte de Item */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InventoryIcon color="info" />
              {t('reports.inventoryItemReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.inventoryItemReportDesc') || 'Reporte de un item específico con movimientos'}
            </Typography>
            
            <Autocomplete
              options={inventoryItems}
              getOptionLabel={(opt) => `${opt.code || opt.sku || ''} - ${opt.name}`}
              value={selectedItem}
              onChange={(_, val) => setSelectedItem(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectItem') || 'Seleccionar Item'} size="small" required />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport(`/inventory/items/${selectedItem?.id}`, 'pdf')}
              disabled={!selectedItem}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const FleetTab = () => (
    <Grid container spacing={3}>
      {/* Flota General */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FleetIcon color="error" />
              {t('reports.fleetReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.fleetReportDesc') || 'Reporte general de la flota vehicular'}
            </Typography>
            
            <TextField
              select
              fullWidth
              size="small"
              label={t('reports.status')}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="AVAILABLE">Disponible</MenuItem>
              <MenuItem value="IN_USE">En Uso</MenuItem>
              <MenuItem value="MAINTENANCE">En Mantenimiento</MenuItem>
            </TextField>

            <DownloadButtons
              onPdf={() => downloadReport('/fleet', 'pdf', { status: filters.status })}
              onExcel={() => downloadReport('/excel/fleet', 'excel', { status: filters.status })}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Vehículo Individual */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FleetIcon color="error" />
              {t('reports.vehicleReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.vehicleReportDesc') || 'Reporte detallado de un vehículo'}
            </Typography>
            
            <Autocomplete
              options={vehicles}
              getOptionLabel={(opt) => `${opt.plate} - ${opt.brand} ${opt.model}`}
              value={selectedVehicle}
              onChange={(_, val) => setSelectedVehicle(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectVehicle') || 'Seleccionar Vehículo'} size="small" required />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport(`/vehicles/${selectedVehicle?.id}`, 'pdf')}
              disabled={!selectedVehicle}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Combustible */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FleetIcon color="error" />
              {t('reports.fuelLogsReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.fuelLogsReportDesc') || 'Registro de cargas de combustible'}
            </Typography>
            
            <DateRangeFilter />
            
            <Autocomplete
              options={vehicles}
              getOptionLabel={(opt) => `${opt.plate} - ${opt.brand} ${opt.model}`}
              value={selectedVehicle}
              onChange={(_, val) => setSelectedVehicle(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectVehicle') || 'Vehículo (opcional)'} size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport('/fuel-logs', 'pdf', { 
                startDate: filters.startDate,
                endDate: filters.endDate,
                vehicleId: selectedVehicle?.id,
              })}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Mantenimientos */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FleetIcon color="error" />
              {t('reports.maintenancesReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.maintenancesReportDesc') || 'Historial de mantenimientos'}
            </Typography>
            
            <DateRangeFilter />
            
            <Autocomplete
              options={vehicles}
              getOptionLabel={(opt) => `${opt.plate} - ${opt.brand} ${opt.model}`}
              value={selectedVehicle}
              onChange={(_, val) => setSelectedVehicle(val)}
              renderInput={(params) => (
                <TextField {...params} label={t('reports.selectVehicle') || 'Vehículo (opcional)'} size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <DownloadButtons
              onPdf={() => downloadReport('/maintenances', 'pdf', { 
                startDate: filters.startDate,
                endDate: filters.endDate,
                vehicleId: selectedVehicle?.id,
              })}
              pdfOnly
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const HSETab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HseIcon sx={{ color: '#f57c00' }} />
              {t('reports.hseReport')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('reports.hseReportDesc') || 'Reporte de incidentes y seguridad'}
            </Typography>
            
            <DateRangeFilter />
            
            <TextField
              select
              fullWidth
              size="small"
              label={t('reports.severity') || 'Severidad'}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="LOW">Baja</MenuItem>
              <MenuItem value="MEDIUM">Media</MenuItem>
              <MenuItem value="HIGH">Alta</MenuItem>
              <MenuItem value="CRITICAL">Crítica</MenuItem>
            </TextField>

            <DownloadButtons
              onPdf={() => downloadReport('/hse', 'pdf', { 
                startDate: filters.startDate,
                endDate: filters.endDate,
                severity: filters.status,
              })}
              onExcel={() => downloadReport('/excel/hse', 'excel', { 
                startDate: filters.startDate,
                endDate: filters.endDate,
                severity: filters.status,
              })}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const tabs = [
    { label: t('reports.categories.employees'), icon: <PeopleIcon />, component: <EmployeesTab /> },
    { label: t('reports.categories.payroll'), icon: <PayrollIcon />, component: <PayrollTab /> },
    { label: t('reports.categories.finance'), icon: <FinanceIcon />, component: <FinanceTab /> },
    { label: t('reports.categories.projects'), icon: <ProjectsIcon />, component: <ProjectsTab /> },
    { label: t('reports.categories.inventory'), icon: <InventoryIcon />, component: <InventoryTab /> },
    { label: t('reports.categories.fleet'), icon: <FleetIcon />, component: <FleetTab /> },
    { label: t('reports.categories.hse'), icon: <HseIcon />, component: <HSETab /> },
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {t('reports.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('reports.subtitle')}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
          <CircularProgress size={24} />
          <Typography>{t('reports.generating')}</Typography>
        </Box>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab, idx) => (
            <Tab
              key={idx}
              label={isMobile ? '' : tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 2 }}>
        {tabs[activeTab]?.component}
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        message={success}
      />
    </Box>
  );
};

export default ReportsDashboard;
