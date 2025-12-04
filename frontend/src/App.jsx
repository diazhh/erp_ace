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
import PettyCashList from './pages/petty-cash/PettyCashList';
import PettyCashDetail from './pages/petty-cash/PettyCashDetail';
import PettyCashForm from './pages/petty-cash/PettyCashForm';
import ProjectList from './pages/projects/ProjectList';
import ProjectDetail from './pages/projects/ProjectDetail';
import ProjectForm from './pages/projects/ProjectForm';

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
        <Route path="finance" element={<Transactions />} />
        <Route path="finance/accounts" element={<BankAccounts />} />
        <Route path="finance/accounts/new" element={<BankAccountForm />} />
        <Route path="finance/accounts/:id" element={<BankAccountDetail />} />
        <Route path="finance/accounts/:id/edit" element={<BankAccountForm />} />
        <Route path="petty-cash" element={<PettyCashList />} />
        <Route path="petty-cash/new" element={<PettyCashForm />} />
        <Route path="petty-cash/:id" element={<PettyCashDetail />} />
        <Route path="petty-cash/:id/edit" element={<PettyCashForm />} />
        {/* Projects */}
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="projects/:id/edit" element={<ProjectForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
