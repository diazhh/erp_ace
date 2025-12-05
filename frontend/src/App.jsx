import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

import { getMe } from './store/slices/authSlice';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/employees/EmployeeDetail';
import EmployeeForm from './pages/employees/EmployeeForm';
import EmployeeBankAccountForm from './pages/employees/EmployeeBankAccountForm';
import Departments from './pages/organization/Departments';
import Positions from './pages/organization/Positions';
import OrgChart from './pages/organization/OrgChart';
import Directory from './pages/organization/Directory';
import PayrollPeriods from './pages/payroll/PayrollPeriods';
import PayrollPeriodDetail from './pages/payroll/PayrollPeriodDetail';
import Loans from './pages/payroll/Loans';
import LoanDetail from './pages/payroll/LoanDetail';
import LoanForm from './pages/payroll/LoanForm';
import BankAccounts from './pages/finance/BankAccounts';
import BankAccountDetail from './pages/finance/BankAccountDetail';
import BankAccountForm from './pages/finance/BankAccountForm';
import Transactions from './pages/finance/Transactions';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import PettyCashList from './pages/petty-cash/PettyCashList';
import PettyCashDetail from './pages/petty-cash/PettyCashDetail';
import PettyCashForm from './pages/petty-cash/PettyCashForm';
import ProjectList from './pages/projects/ProjectList';
import ProjectDetail from './pages/projects/ProjectDetail';
import ProjectForm from './pages/projects/ProjectForm';
import ProjectDashboard from './pages/projects/ProjectDashboard';
import ContractorList from './pages/contractors/ContractorList';
import ContractorDetail from './pages/contractors/ContractorDetail';
import ContractorForm from './pages/contractors/ContractorForm';
import ItemList from './pages/inventory/ItemList';
import ItemDetail from './pages/inventory/ItemDetail';
import ItemForm from './pages/inventory/ItemForm';
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import WarehouseList from './pages/inventory/WarehouseList';
import WarehouseDetail from './pages/inventory/WarehouseDetail';
import WarehouseForm from './pages/inventory/WarehouseForm';
import MovementList from './pages/inventory/MovementList';
import MovementForm from './pages/inventory/MovementForm';
import VehicleList from './pages/fleet/VehicleList';
import VehicleDetail from './pages/fleet/VehicleDetail';
import VehicleForm from './pages/fleet/VehicleForm';
import FleetDashboard from './pages/fleet/FleetDashboard';
import MaintenanceList from './pages/fleet/MaintenanceList';
import MaintenanceForm from './pages/fleet/MaintenanceForm';
import FuelLogList from './pages/fleet/FuelLogList';
import FuelLogForm from './pages/fleet/FuelLogForm';
// Procurement
import PurchaseOrderList from './pages/procurement/PurchaseOrderList';
import PurchaseOrderDetail from './pages/procurement/PurchaseOrderDetail';
import PurchaseOrderForm from './pages/procurement/PurchaseOrderForm';
import InvoiceList from './pages/procurement/InvoiceList';
import InvoiceDetail from './pages/procurement/InvoiceDetail';
import InvoiceForm from './pages/procurement/InvoiceForm';
import PaymentList from './pages/procurement/PaymentList';
import PaymentDetail from './pages/procurement/PaymentDetail';
import PaymentForm from './pages/procurement/PaymentForm';
import QuoteList from './pages/procurement/QuoteList';
// HSE
import HSEDashboard from './pages/hse/HSEDashboard';
import IncidentList from './pages/hse/IncidentList';
import IncidentDetail from './pages/hse/IncidentDetail';
import IncidentForm from './pages/hse/IncidentForm';
import InspectionList from './pages/hse/InspectionList';
import InspectionDetail from './pages/hse/InspectionDetail';
import InspectionForm from './pages/hse/InspectionForm';
import TrainingList from './pages/hse/TrainingList';
import TrainingDetail from './pages/hse/TrainingDetail';
import TrainingForm from './pages/hse/TrainingForm';
import EquipmentList from './pages/hse/EquipmentList';
import EquipmentDetail from './pages/hse/EquipmentDetail';
import EquipmentForm from './pages/hse/EquipmentForm';
// Documents
import {
  DocumentsDashboard,
  DocumentList,
  DocumentDetail,
  DocumentForm,
  CategoryList,
  CategoryForm,
} from './pages/documents';
// Admin - Users & Roles
import UserList from './pages/admin/UserList';
import UserDetail from './pages/admin/UserDetail';
import UserForm from './pages/admin/UserForm';
import RoleList from './pages/admin/RoleList';
import RoleDetail from './pages/admin/RoleDetail';
import RoleForm from './pages/admin/RoleForm';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated, user]);

  if (isAuthenticated && loading && !user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/new" element={<EmployeeForm />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="employees/:id/edit" element={<EmployeeForm />} />
        <Route path="employees/:employeeId/accounts/new" element={<EmployeeBankAccountForm />} />
        <Route path="employees/:employeeId/accounts/:accountId/edit" element={<EmployeeBankAccountForm />} />
        {/* Organization */}
        <Route path="organization/departments" element={<Departments />} />
        <Route path="organization/positions" element={<Positions />} />
        <Route path="organization/chart" element={<OrgChart />} />
        <Route path="organization/directory" element={<Directory />} />
        <Route path="payroll" element={<PayrollPeriods />} />
        <Route path="payroll/periods/:id" element={<PayrollPeriodDetail />} />
        <Route path="payroll/loans" element={<Loans />} />
        <Route path="payroll/loans/new" element={<LoanForm />} />
        <Route path="payroll/loans/:id" element={<LoanDetail />} />
        <Route path="finance" element={<FinanceDashboard />} />
        <Route path="finance/transactions" element={<Transactions />} />
        <Route path="finance/accounts" element={<BankAccounts />} />
        <Route path="finance/accounts/new" element={<BankAccountForm />} />
        <Route path="finance/accounts/:id" element={<BankAccountDetail />} />
        <Route path="finance/accounts/:id/edit" element={<BankAccountForm />} />
        <Route path="petty-cash" element={<PettyCashList />} />
        <Route path="petty-cash/new" element={<PettyCashForm />} />
        <Route path="petty-cash/:id" element={<PettyCashDetail />} />
        <Route path="petty-cash/:id/edit" element={<PettyCashForm />} />
        {/* Projects */}
        <Route path="projects" element={<ProjectDashboard />} />
        <Route path="projects/list" element={<ProjectList />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="projects/:id/edit" element={<ProjectForm />} />
        {/* Contractors */}
        <Route path="contractors" element={<ContractorList />} />
        <Route path="contractors/new" element={<ContractorForm />} />
        <Route path="contractors/:id" element={<ContractorDetail />} />
        <Route path="contractors/:id/edit" element={<ContractorForm />} />
        {/* Inventory */}
        <Route path="inventory" element={<InventoryDashboard />} />
        <Route path="inventory/items" element={<ItemList />} />
        <Route path="inventory/items/new" element={<ItemForm />} />
        <Route path="inventory/items/:id" element={<ItemDetail />} />
        <Route path="inventory/items/:id/edit" element={<ItemForm />} />
        <Route path="inventory/warehouses" element={<WarehouseList />} />
        <Route path="inventory/warehouses/new" element={<WarehouseForm />} />
        <Route path="inventory/warehouses/:id" element={<WarehouseDetail />} />
        <Route path="inventory/warehouses/:id/edit" element={<WarehouseForm />} />
        <Route path="inventory/movements" element={<MovementList />} />
        <Route path="inventory/movements/new" element={<MovementForm />} />
        {/* Fleet */}
        <Route path="fleet" element={<FleetDashboard />} />
        <Route path="fleet/vehicles" element={<VehicleList />} />
        <Route path="fleet/vehicles/new" element={<VehicleForm />} />
        <Route path="fleet/vehicles/:id" element={<VehicleDetail />} />
        <Route path="fleet/vehicles/:id/edit" element={<VehicleForm />} />
        <Route path="fleet/maintenances" element={<MaintenanceList />} />
        <Route path="fleet/maintenances/new" element={<MaintenanceForm />} />
        <Route path="fleet/maintenances/:id" element={<MaintenanceForm />} />
        <Route path="fleet/maintenances/:id/edit" element={<MaintenanceForm />} />
        <Route path="fleet/fuel-logs" element={<FuelLogList />} />
        <Route path="fleet/fuel-logs/new" element={<FuelLogForm />} />
        <Route path="fleet/fuel-logs/:id/edit" element={<FuelLogForm />} />
        {/* Procurement */}
        <Route path="procurement/purchase-orders" element={<PurchaseOrderList />} />
        <Route path="procurement/purchase-orders/new" element={<PurchaseOrderForm />} />
        <Route path="procurement/purchase-orders/:id" element={<PurchaseOrderDetail />} />
        <Route path="procurement/purchase-orders/:id/edit" element={<PurchaseOrderForm />} />
        <Route path="procurement/invoices" element={<InvoiceList />} />
        <Route path="procurement/invoices/new" element={<InvoiceForm />} />
        <Route path="procurement/invoices/:id" element={<InvoiceDetail />} />
        <Route path="procurement/invoices/:id/edit" element={<InvoiceForm />} />
        <Route path="procurement/payments" element={<PaymentList />} />
        <Route path="procurement/payments/new" element={<PaymentForm />} />
        <Route path="procurement/payments/:id" element={<PaymentDetail />} />
        <Route path="procurement/payments/:id/edit" element={<PaymentForm />} />
        <Route path="procurement/quotes" element={<QuoteList />} />
        {/* HSE */}
        <Route path="hse" element={<HSEDashboard />} />
        <Route path="hse/incidents" element={<IncidentList />} />
        <Route path="hse/incidents/new" element={<IncidentForm />} />
        <Route path="hse/incidents/:id" element={<IncidentDetail />} />
        <Route path="hse/incidents/:id/edit" element={<IncidentForm />} />
        <Route path="hse/inspections" element={<InspectionList />} />
        <Route path="hse/inspections/new" element={<InspectionForm />} />
        <Route path="hse/inspections/:id" element={<InspectionDetail />} />
        <Route path="hse/inspections/:id/edit" element={<InspectionForm />} />
        <Route path="hse/trainings" element={<TrainingList />} />
        <Route path="hse/trainings/new" element={<TrainingForm />} />
        <Route path="hse/trainings/:id" element={<TrainingDetail />} />
        <Route path="hse/trainings/:id/edit" element={<TrainingForm />} />
        <Route path="hse/equipment" element={<EquipmentList />} />
        <Route path="hse/equipment/new" element={<EquipmentForm />} />
        <Route path="hse/equipment/:id" element={<EquipmentDetail />} />
        <Route path="hse/equipment/:id/edit" element={<EquipmentForm />} />
        {/* Documents */}
        <Route path="documents" element={<DocumentsDashboard />} />
        <Route path="documents/list" element={<DocumentList />} />
        <Route path="documents/new" element={<DocumentForm />} />
        <Route path="documents/:id" element={<DocumentDetail />} />
        <Route path="documents/:id/edit" element={<DocumentForm />} />
        <Route path="documents/categories" element={<CategoryList />} />
        <Route path="documents/categories/new" element={<CategoryForm />} />
        <Route path="documents/categories/:id/edit" element={<CategoryForm />} />
        {/* Admin - Users & Roles */}
        <Route path="admin/users" element={<UserList />} />
        <Route path="admin/users/new" element={<UserForm />} />
        <Route path="admin/users/:id" element={<UserDetail />} />
        <Route path="admin/users/:id/edit" element={<UserForm />} />
        <Route path="admin/roles" element={<RoleList />} />
        <Route path="admin/roles/new" element={<RoleForm />} />
        <Route path="admin/roles/:id" element={<RoleDetail />} />
        <Route path="admin/roles/:id/edit" element={<RoleForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
