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
import usersReducer from './slices/usersSlice';
import rolesReducer from './slices/rolesSlice';
import attachmentReducer from './slices/attachmentSlice';
import whatsappReducer from './slices/whatsappSlice';
import emailReducer from './slices/emailSlice';
import assetReducer from './slices/assetSlice';
import crmReducer from './slices/crmSlice';
import qualityReducer from './slices/qualitySlice';
import expenseReportReducer from './slices/expenseReportSlice';
import productionReducer from './slices/productionSlice';
import afeReducer from './slices/afeSlice';
import contractReducer from './slices/contractSlice';
import complianceReducer from './slices/complianceSlice';
import jibReducer from './slices/jibSlice';
import ptwReducer from './slices/ptwSlice';
import logisticsReducer from './slices/logisticsSlice';
import uiReducer from './slices/uiSlice';

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
    users: usersReducer,
    roles: rolesReducer,
    attachments: attachmentReducer,
    whatsapp: whatsappReducer,
    email: emailReducer,
    assets: assetReducer,
    crm: crmReducer,
    quality: qualityReducer,
    expenseReports: expenseReportReducer,
    production: productionReducer,
    afe: afeReducer,
    contracts: contractReducer,
    compliance: complianceReducer,
    jib: jibReducer,
    ptw: ptwReducer,
    logistics: logisticsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
