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
import DepartmentDetail from './pages/organization/DepartmentDetail';
import DepartmentForm from './pages/organization/DepartmentForm';
import Positions from './pages/organization/Positions';
import PositionDetail from './pages/organization/PositionDetail';
import PositionForm from './pages/organization/PositionForm';
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
import TransactionList from './pages/finance/TransactionList';
import TransactionDetail from './pages/finance/TransactionDetail';
import TransactionForm from './pages/finance/TransactionForm';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import PettyCashList from './pages/petty-cash/PettyCashList';
import PettyCashDetail from './pages/petty-cash/PettyCashDetail';
import PettyCashForm from './pages/petty-cash/PettyCashForm';
import PettyCashEntryDetail from './pages/petty-cash/PettyCashEntryDetail';
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
import WhatsAppConfig from './pages/admin/WhatsAppConfig';
import EmailConfig from './pages/admin/EmailConfig';
import Settings from './pages/Settings';
// Assets
import AssetList from './pages/assets/AssetList';
import AssetDetail from './pages/assets/AssetDetail';
import AssetForm from './pages/assets/AssetForm';
import AssetCategoryList from './pages/assets/AssetCategoryList';
// CRM
import CrmDashboard from './pages/crm/CrmDashboard';
import ClientList from './pages/crm/ClientList';
import ClientDetail from './pages/crm/ClientDetail';
import ClientForm from './pages/crm/ClientForm';
import OpportunityList from './pages/crm/OpportunityList';
import OpportunityDetail from './pages/crm/OpportunityDetail';
import OpportunityForm from './pages/crm/OpportunityForm';
// Quality
import QualityDashboard from './pages/quality/QualityDashboard';
import QualityInspectionList from './pages/quality/InspectionList';
import QualityInspectionDetail from './pages/quality/InspectionDetail';
import QualityInspectionForm from './pages/quality/InspectionForm';
import NonConformanceList from './pages/quality/NonConformanceList';
import NonConformanceDetail from './pages/quality/NonConformanceDetail';
import NonConformanceForm from './pages/quality/NonConformanceForm';
// Expense Reports
import { ExpenseReportList, ExpenseReportDetail, ExpenseReportForm } from './pages/petty-cash/expense-reports';
// Reports
import { ReportsDashboard } from './pages/reports';
// Production
import { 
  ProductionDashboard, 
  FieldList, 
  FieldForm, 
  FieldDetail, 
  WellList, 
  WellForm, 
  WellDetail, 
  WellLogForm,
  DailyProductionList,
  DailyProductionForm,
  DailyProductionDetail,
  AllocationList,
  AllocationDetail,
} from './pages/production';
// AFE
import { AFEDashboard, AFEList, AFEForm, AFEDetail } from './pages/afe';
// Contracts
import { ContractDashboard, ContractList, ContractForm, ContractDetail, ConcessionList } from './pages/contracts';
// Compliance
import ComplianceDashboard from './pages/compliance/ComplianceDashboard';
import ReportList from './pages/compliance/ReportList';
import ReportDetail from './pages/compliance/ReportDetail';
import ReportForm from './pages/compliance/ReportForm';
import PermitList from './pages/compliance/PermitList';
import PermitDetail from './pages/compliance/PermitDetail';
import PermitForm from './pages/compliance/PermitForm';
import AuditList from './pages/compliance/AuditList';
import AuditDetail from './pages/compliance/AuditDetail';
import AuditForm from './pages/compliance/AuditForm';
import PolicyList from './pages/compliance/PolicyList';
import PolicyDetail from './pages/compliance/PolicyDetail';
import PolicyForm from './pages/compliance/PolicyForm';
import CertificationList from './pages/compliance/CertificationList';
import CertificationDetail from './pages/compliance/CertificationDetail';
import CertificationForm from './pages/compliance/CertificationForm';
// JIB
import { JIBDashboard, JIBList, JIBForm, JIBDetail, CashCallList, CashCallForm, CashCallDetail } from './pages/jib';
// PTW
import { PTWDashboard, PermitList as PTWPermitList, PermitForm as PTWPermitForm, PermitDetail as PTWPermitDetail, StopWorkList, StopWorkForm, StopWorkDetail } from './pages/ptw';
// Reserves
import { ReservesDashboard, EstimateList, EstimateDetail, EstimateForm, ValuationList, ValuationForm } from './components/reserves';
// Logistics
import {
  LogisticsDashboard,
  TankList,
  TankForm,
  TankDetail,
  TicketList,
  TicketForm,
  TicketDetail,
  QualityList,
  QualityForm,
  QualityDetail,
  PipelineList,
  PipelineForm,
  PipelineDetail,
} from './pages/logistics';

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
        <Route path="organization/departments/new" element={<DepartmentForm />} />
        <Route path="organization/departments/:id" element={<DepartmentDetail />} />
        <Route path="organization/departments/:id/edit" element={<DepartmentForm />} />
        <Route path="organization/positions" element={<Positions />} />
        <Route path="organization/positions/new" element={<PositionForm />} />
        <Route path="organization/positions/:id" element={<PositionDetail />} />
        <Route path="organization/positions/:id/edit" element={<PositionForm />} />
        <Route path="organization/chart" element={<OrgChart />} />
        <Route path="organization/directory" element={<Directory />} />
        <Route path="payroll" element={<PayrollPeriods />} />
        <Route path="payroll/periods/:id" element={<PayrollPeriodDetail />} />
        <Route path="payroll/loans" element={<Loans />} />
        <Route path="payroll/loans/new" element={<LoanForm />} />
        <Route path="payroll/loans/:id" element={<LoanDetail />} />
        <Route path="finance" element={<FinanceDashboard />} />
        <Route path="finance/transactions" element={<TransactionList />} />
        <Route path="finance/transactions/new" element={<TransactionForm />} />
        <Route path="finance/transactions/:id" element={<TransactionDetail />} />
        <Route path="finance/accounts" element={<BankAccounts />} />
        <Route path="finance/accounts/new" element={<BankAccountForm />} />
        <Route path="finance/accounts/:id" element={<BankAccountDetail />} />
        <Route path="finance/accounts/:id/edit" element={<BankAccountForm />} />
        <Route path="petty-cash" element={<PettyCashList />} />
        <Route path="petty-cash/new" element={<PettyCashForm />} />
        <Route path="petty-cash/:id" element={<PettyCashDetail />} />
        <Route path="petty-cash/:id/edit" element={<PettyCashForm />} />
        <Route path="petty-cash/:id/entries/:entryId" element={<PettyCashEntryDetail />} />
        {/* Expense Reports */}
        <Route path="petty-cash/expense-reports" element={<ExpenseReportList />} />
        <Route path="petty-cash/expense-reports/new" element={<ExpenseReportForm />} />
        <Route path="petty-cash/expense-reports/:id" element={<ExpenseReportDetail />} />
        <Route path="petty-cash/expense-reports/:id/edit" element={<ExpenseReportForm />} />
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
        {/* Assets */}
        <Route path="assets" element={<AssetList />} />
        <Route path="assets/new" element={<AssetForm />} />
        <Route path="assets/categories" element={<AssetCategoryList />} />
        <Route path="assets/:id" element={<AssetDetail />} />
        <Route path="assets/:id/edit" element={<AssetForm />} />
        {/* CRM */}
        <Route path="crm" element={<CrmDashboard />} />
        <Route path="crm/clients" element={<ClientList />} />
        <Route path="crm/clients/new" element={<ClientForm />} />
        <Route path="crm/clients/:id" element={<ClientDetail />} />
        <Route path="crm/clients/:id/edit" element={<ClientForm />} />
        <Route path="crm/opportunities" element={<OpportunityList />} />
        <Route path="crm/opportunities/new" element={<OpportunityForm />} />
        <Route path="crm/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="crm/opportunities/:id/edit" element={<OpportunityForm />} />
        {/* Quality */}
        <Route path="quality" element={<QualityDashboard />} />
        <Route path="quality/inspections" element={<QualityInspectionList />} />
        <Route path="quality/inspections/new" element={<QualityInspectionForm />} />
        <Route path="quality/inspections/:id" element={<QualityInspectionDetail />} />
        <Route path="quality/inspections/:id/edit" element={<QualityInspectionForm />} />
        <Route path="quality/non-conformances" element={<NonConformanceList />} />
        <Route path="quality/non-conformances/new" element={<NonConformanceForm />} />
        <Route path="quality/non-conformances/:id" element={<NonConformanceDetail />} />
        <Route path="quality/non-conformances/:id/edit" element={<NonConformanceForm />} />
        {/* Admin - Users & Roles */}
        <Route path="admin/users" element={<UserList />} />
        <Route path="admin/users/new" element={<UserForm />} />
        <Route path="admin/users/:id" element={<UserDetail />} />
        <Route path="admin/users/:id/edit" element={<UserForm />} />
        <Route path="admin/roles" element={<RoleList />} />
        <Route path="admin/roles/new" element={<RoleForm />} />
        <Route path="admin/roles/:id" element={<RoleDetail />} />
        <Route path="admin/roles/:id/edit" element={<RoleForm />} />
        {/* WhatsApp */}
        <Route path="admin/whatsapp" element={<WhatsAppConfig />} />
        {/* Email */}
        <Route path="admin/email" element={<EmailConfig />} />
        {/* Settings */}
        <Route path="settings" element={<Settings />} />
        {/* Reports */}
        <Route path="reports" element={<ReportsDashboard />} />
        {/* Production */}
        <Route path="production" element={<ProductionDashboard />} />
        <Route path="production/fields" element={<FieldList />} />
        <Route path="production/fields/new" element={<FieldForm />} />
        <Route path="production/fields/:id" element={<FieldDetail />} />
        <Route path="production/fields/:id/edit" element={<FieldForm />} />
        <Route path="production/wells" element={<WellList />} />
        <Route path="production/wells/new" element={<WellForm />} />
        <Route path="production/wells/:id" element={<WellDetail />} />
        <Route path="production/wells/:id/edit" element={<WellForm />} />
        <Route path="production/logs/new" element={<WellLogForm />} />
        <Route path="production/logs/:id" element={<WellLogForm />} />
        <Route path="production/logs/:id/edit" element={<WellLogForm />} />
        {/* Daily Production */}
        <Route path="production/daily" element={<DailyProductionList />} />
        <Route path="production/daily/new" element={<DailyProductionForm />} />
        <Route path="production/daily/:id" element={<DailyProductionDetail />} />
        <Route path="production/daily/:id/edit" element={<DailyProductionForm />} />
        {/* Allocations */}
        <Route path="production/allocations" element={<AllocationList />} />
        <Route path="production/allocations/:id" element={<AllocationDetail />} />
        {/* AFE */}
        <Route path="afe" element={<AFEDashboard />} />
        <Route path="afe/list" element={<AFEList />} />
        <Route path="afe/new" element={<AFEForm />} />
        <Route path="afe/:id" element={<AFEDetail />} />
        <Route path="afe/:id/edit" element={<AFEForm />} />
        {/* Contracts */}
        <Route path="contracts" element={<ContractDashboard />} />
        <Route path="contracts/list" element={<ContractList />} />
        <Route path="contracts/new" element={<ContractForm />} />
        <Route path="contracts/:id" element={<ContractDetail />} />
        <Route path="contracts/:id/edit" element={<ContractForm />} />
        <Route path="contracts/concessions" element={<ConcessionList />} />
        {/* Compliance */}
        <Route path="compliance" element={<ComplianceDashboard />} />
        <Route path="compliance/reports" element={<ReportList />} />
        <Route path="compliance/reports/new" element={<ReportForm />} />
        <Route path="compliance/reports/:id" element={<ReportDetail />} />
        <Route path="compliance/reports/:id/edit" element={<ReportForm />} />
        <Route path="compliance/permits" element={<PermitList />} />
        <Route path="compliance/permits/new" element={<PermitForm />} />
        <Route path="compliance/permits/:id" element={<PermitDetail />} />
        <Route path="compliance/permits/:id/edit" element={<PermitForm />} />
        <Route path="compliance/audits" element={<AuditList />} />
        <Route path="compliance/audits/new" element={<AuditForm />} />
        <Route path="compliance/audits/:id" element={<AuditDetail />} />
        <Route path="compliance/audits/:id/edit" element={<AuditForm />} />
        <Route path="compliance/policies" element={<PolicyList />} />
        <Route path="compliance/policies/new" element={<PolicyForm />} />
        <Route path="compliance/policies/:id" element={<PolicyDetail />} />
        <Route path="compliance/policies/:id/edit" element={<PolicyForm />} />
        <Route path="compliance/certifications" element={<CertificationList />} />
        <Route path="compliance/certifications/new" element={<CertificationForm />} />
        <Route path="compliance/certifications/:id" element={<CertificationDetail />} />
        <Route path="compliance/certifications/:id/edit" element={<CertificationForm />} />
        {/* JIB */}
        <Route path="jib" element={<JIBDashboard />} />
        <Route path="jib/billings" element={<JIBList />} />
        <Route path="jib/billings/new" element={<JIBForm />} />
        <Route path="jib/billings/:id" element={<JIBDetail />} />
        <Route path="jib/billings/:id/edit" element={<JIBForm />} />
        <Route path="jib/cash-calls" element={<CashCallList />} />
        <Route path="jib/cash-calls/new" element={<CashCallForm />} />
        <Route path="jib/cash-calls/:id" element={<CashCallDetail />} />
        <Route path="jib/cash-calls/:id/edit" element={<CashCallForm />} />
        {/* PTW */}
        <Route path="ptw" element={<PTWDashboard />} />
        <Route path="ptw/permits" element={<PTWPermitList />} />
        <Route path="ptw/permits/new" element={<PTWPermitForm />} />
        <Route path="ptw/permits/:id" element={<PTWPermitDetail />} />
        <Route path="ptw/permits/:id/edit" element={<PTWPermitForm />} />
        <Route path="ptw/stop-work" element={<StopWorkList />} />
        <Route path="ptw/stop-work/new" element={<StopWorkForm />} />
        <Route path="ptw/stop-work/:id" element={<StopWorkDetail />} />
        {/* Reserves */}
        <Route path="reserves" element={<ReservesDashboard />} />
        <Route path="reserves/estimates" element={<EstimateList />} />
        <Route path="reserves/estimates/new" element={<EstimateForm />} />
        <Route path="reserves/estimates/:id" element={<EstimateDetail />} />
        <Route path="reserves/estimates/:id/edit" element={<EstimateForm />} />
        <Route path="reserves/valuations" element={<ValuationList />} />
        <Route path="reserves/valuations/new" element={<ValuationForm />} />
        <Route path="reserves/valuations/:id/edit" element={<ValuationForm />} />
        {/* Logistics */}
        <Route path="logistics" element={<LogisticsDashboard />} />
        <Route path="logistics/tanks" element={<TankList />} />
        <Route path="logistics/tanks/new" element={<TankForm />} />
        <Route path="logistics/tanks/:id" element={<TankDetail />} />
        <Route path="logistics/tanks/:id/edit" element={<TankForm />} />
        <Route path="logistics/tickets" element={<TicketList />} />
        <Route path="logistics/tickets/new" element={<TicketForm />} />
        <Route path="logistics/tickets/:id" element={<TicketDetail />} />
        <Route path="logistics/tickets/:id/edit" element={<TicketForm />} />
        <Route path="logistics/quality" element={<QualityList />} />
        <Route path="logistics/quality/new" element={<QualityForm />} />
        <Route path="logistics/quality/:id" element={<QualityDetail />} />
        <Route path="logistics/quality/:id/edit" element={<QualityForm />} />
        <Route path="logistics/pipelines" element={<PipelineList />} />
        <Route path="logistics/pipelines/new" element={<PipelineForm />} />
        <Route path="logistics/pipelines/:id" element={<PipelineDetail />} />
        <Route path="logistics/pipelines/:id/edit" element={<PipelineForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
