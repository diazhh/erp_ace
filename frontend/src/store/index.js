import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import payrollReducer from './slices/payrollSlice';
import financeReducer from './slices/financeSlice';
import pettyCashReducer from './slices/pettyCashSlice';
import projectReducer from './slices/projectSlice';
import contractorReducer from './slices/contractorSlice';
import inventoryReducer from './slices/inventorySlice';
import fleetReducer from './slices/fleetSlice';
import hseReducer from './slices/hseSlice';
import documentReducer from './slices/documentSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    payroll: payrollReducer,
    finance: financeReducer,
    pettyCash: pettyCashReducer,
    projects: projectReducer,
    contractors: contractorReducer,
    inventory: inventoryReducer,
    fleet: fleetReducer,
    hse: hseReducer,
    documents: documentReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
