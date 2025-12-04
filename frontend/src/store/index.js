import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import payrollReducer from './slices/payrollSlice';
import financeReducer from './slices/financeSlice';
import pettyCashReducer from './slices/pettyCashSlice';
import projectReducer from './slices/projectSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    payroll: payrollReducer,
    finance: financeReducer,
    pettyCash: pettyCashReducer,
    projects: projectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
