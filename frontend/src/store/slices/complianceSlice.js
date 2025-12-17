import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== DASHBOARD & ALERTS ==========

export const fetchComplianceDashboard = createAsyncThunk(
  'compliance/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/compliance/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchComplianceAlerts = createAsyncThunk(
  'compliance/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/compliance/alerts');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== REGULATORY REPORTS ==========

export const fetchReports = createAsyncThunk(
  'compliance/fetchReports',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/compliance/reports?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchReportById = createAsyncThunk(
  'compliance/fetchReportById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/compliance/reports/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createReport = createAsyncThunk(
  'compliance/createReport',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/compliance/reports', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateReport = createAsyncThunk(
  'compliance/updateReport',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/compliance/reports/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteReport = createAsyncThunk(
  'compliance/deleteReport',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/compliance/reports/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const submitReport = createAsyncThunk(
  'compliance/submitReport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/compliance/reports/${id}/submit`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const markReportSubmitted = createAsyncThunk(
  'compliance/markReportSubmitted',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/compliance/reports/${id}/mark-submitted`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateReportResponse = createAsyncThunk(
  'compliance/updateReportResponse',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/compliance/reports/${id}/response`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== ENVIRONMENTAL PERMITS ==========

export const fetchPermits = createAsyncThunk(
  'compliance/fetchPermits',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/compliance/permits?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPermitById = createAsyncThunk(
  'compliance/fetchPermitById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/compliance/permits/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createPermit = createAsyncThunk(
  'compliance/createPermit',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/compliance/permits', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updatePermit = createAsyncThunk(
  'compliance/updatePermit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/compliance/permits/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deletePermit = createAsyncThunk(
  'compliance/deletePermit',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/compliance/permits/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== COMPLIANCE AUDITS ==========

export const fetchAudits = createAsyncThunk(
  'compliance/fetchAudits',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/compliance/audits?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAuditById = createAsyncThunk(
  'compliance/fetchAuditById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/compliance/audits/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createAudit = createAsyncThunk(
  'compliance/createAudit',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/compliance/audits', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateAudit = createAsyncThunk(
  'compliance/updateAudit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/compliance/audits/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteAudit = createAsyncThunk(
  'compliance/deleteAudit',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/compliance/audits/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const startAudit = createAsyncThunk(
  'compliance/startAudit',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/compliance/audits/${id}/start`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const completeAudit = createAsyncThunk(
  'compliance/completeAudit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/compliance/audits/${id}/complete`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const closeAudit = createAsyncThunk(
  'compliance/closeAudit',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/compliance/audits/${id}/close`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== POLICIES ==========

export const fetchPolicies = createAsyncThunk(
  'compliance/fetchPolicies',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/compliance/policies?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPolicyById = createAsyncThunk(
  'compliance/fetchPolicyById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/compliance/policies/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createPolicy = createAsyncThunk(
  'compliance/createPolicy',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/compliance/policies', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updatePolicy = createAsyncThunk(
  'compliance/updatePolicy',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/compliance/policies/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deletePolicy = createAsyncThunk(
  'compliance/deletePolicy',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/compliance/policies/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const submitPolicyForReview = createAsyncThunk(
  'compliance/submitPolicyForReview',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/compliance/policies/${id}/submit-review`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approvePolicy = createAsyncThunk(
  'compliance/approvePolicy',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/compliance/policies/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== CERTIFICATIONS ==========

export const fetchCertifications = createAsyncThunk(
  'compliance/fetchCertifications',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/compliance/certifications?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchCertificationById = createAsyncThunk(
  'compliance/fetchCertificationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/compliance/certifications/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createCertification = createAsyncThunk(
  'compliance/createCertification',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/compliance/certifications', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateCertification = createAsyncThunk(
  'compliance/updateCertification',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/compliance/certifications/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteCertification = createAsyncThunk(
  'compliance/deleteCertification',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/compliance/certifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== SLICE ==========

const initialState = {
  // Dashboard
  dashboard: null,
  dashboardLoading: false,
  // Alerts
  alerts: [],
  alertsLoading: false,
  // Reports
  reports: [],
  reportsPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  currentReport: null,
  reportsLoading: false,
  // Permits
  permits: [],
  permitsPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  currentPermit: null,
  permitsLoading: false,
  // Audits
  audits: [],
  auditsPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  currentAudit: null,
  auditsLoading: false,
  // Policies
  policies: [],
  policiesPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  currentPolicy: null,
  policiesLoading: false,
  // Certifications
  certifications: [],
  certificationsPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  currentCertification: null,
  certificationsLoading: false,
  // General
  loading: false,
  error: null,
};

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearCurrentPermit: (state) => {
      state.currentPermit = null;
    },
    clearCurrentAudit: (state) => {
      state.currentAudit = null;
    },
    clearCurrentPolicy: (state) => {
      state.currentPolicy = null;
    },
    clearCurrentCertification: (state) => {
      state.currentCertification = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchComplianceDashboard.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(fetchComplianceDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(fetchComplianceDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload?.message || 'Error loading dashboard';
      })
      // Alerts
      .addCase(fetchComplianceAlerts.pending, (state) => {
        state.alertsLoading = true;
      })
      .addCase(fetchComplianceAlerts.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts = action.payload.data;
      })
      .addCase(fetchComplianceAlerts.rejected, (state, action) => {
        state.alertsLoading = false;
        state.error = action.payload?.message || 'Error loading alerts';
      })
      // Reports
      .addCase(fetchReports.pending, (state) => {
        state.reportsLoading = true;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.reports = action.payload.data;
        state.reportsPagination = action.payload.pagination;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.reportsLoading = false;
        state.error = action.payload?.message || 'Error loading reports';
      })
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload.data;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading report';
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.reports.unshift(action.payload.data);
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.currentReport = action.payload.data;
        const index = state.reports.findIndex((r) => r.id === action.payload.data.id);
        if (index !== -1) state.reports[index] = action.payload.data;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter((r) => r.id !== action.payload);
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.currentReport = action.payload.data;
        const index = state.reports.findIndex((r) => r.id === action.payload.data.id);
        if (index !== -1) state.reports[index] = action.payload.data;
      })
      .addCase(markReportSubmitted.fulfilled, (state, action) => {
        state.currentReport = action.payload.data;
        const index = state.reports.findIndex((r) => r.id === action.payload.data.id);
        if (index !== -1) state.reports[index] = action.payload.data;
      })
      .addCase(updateReportResponse.fulfilled, (state, action) => {
        state.currentReport = action.payload.data;
        const index = state.reports.findIndex((r) => r.id === action.payload.data.id);
        if (index !== -1) state.reports[index] = action.payload.data;
      })
      // Permits
      .addCase(fetchPermits.pending, (state) => {
        state.permitsLoading = true;
      })
      .addCase(fetchPermits.fulfilled, (state, action) => {
        state.permitsLoading = false;
        state.permits = action.payload.data;
        state.permitsPagination = action.payload.pagination;
      })
      .addCase(fetchPermits.rejected, (state, action) => {
        state.permitsLoading = false;
        state.error = action.payload?.message || 'Error loading permits';
      })
      .addCase(fetchPermitById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermitById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPermit = action.payload.data;
      })
      .addCase(fetchPermitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading permit';
      })
      .addCase(createPermit.fulfilled, (state, action) => {
        state.permits.unshift(action.payload.data);
      })
      .addCase(updatePermit.fulfilled, (state, action) => {
        state.currentPermit = action.payload.data;
        const index = state.permits.findIndex((p) => p.id === action.payload.data.id);
        if (index !== -1) state.permits[index] = action.payload.data;
      })
      .addCase(deletePermit.fulfilled, (state, action) => {
        state.permits = state.permits.filter((p) => p.id !== action.payload);
      })
      // Audits
      .addCase(fetchAudits.pending, (state) => {
        state.auditsLoading = true;
      })
      .addCase(fetchAudits.fulfilled, (state, action) => {
        state.auditsLoading = false;
        state.audits = action.payload.data;
        state.auditsPagination = action.payload.pagination;
      })
      .addCase(fetchAudits.rejected, (state, action) => {
        state.auditsLoading = false;
        state.error = action.payload?.message || 'Error loading audits';
      })
      .addCase(fetchAuditById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuditById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAudit = action.payload.data;
      })
      .addCase(fetchAuditById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading audit';
      })
      .addCase(createAudit.fulfilled, (state, action) => {
        state.audits.unshift(action.payload.data);
      })
      .addCase(updateAudit.fulfilled, (state, action) => {
        state.currentAudit = action.payload.data;
        const index = state.audits.findIndex((a) => a.id === action.payload.data.id);
        if (index !== -1) state.audits[index] = action.payload.data;
      })
      .addCase(deleteAudit.fulfilled, (state, action) => {
        state.audits = state.audits.filter((a) => a.id !== action.payload);
      })
      .addCase(startAudit.fulfilled, (state, action) => {
        state.currentAudit = action.payload.data;
        const index = state.audits.findIndex((a) => a.id === action.payload.data.id);
        if (index !== -1) state.audits[index] = action.payload.data;
      })
      .addCase(completeAudit.fulfilled, (state, action) => {
        state.currentAudit = action.payload.data;
        const index = state.audits.findIndex((a) => a.id === action.payload.data.id);
        if (index !== -1) state.audits[index] = action.payload.data;
      })
      .addCase(closeAudit.fulfilled, (state, action) => {
        state.currentAudit = action.payload.data;
        const index = state.audits.findIndex((a) => a.id === action.payload.data.id);
        if (index !== -1) state.audits[index] = action.payload.data;
      })
      // Policies
      .addCase(fetchPolicies.pending, (state) => {
        state.policiesLoading = true;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.policiesLoading = false;
        state.policies = action.payload.data;
        state.policiesPagination = action.payload.pagination;
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.policiesLoading = false;
        state.error = action.payload?.message || 'Error loading policies';
      })
      .addCase(fetchPolicyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPolicyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPolicy = action.payload.data;
      })
      .addCase(fetchPolicyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading policy';
      })
      .addCase(createPolicy.fulfilled, (state, action) => {
        state.policies.unshift(action.payload.data);
      })
      .addCase(updatePolicy.fulfilled, (state, action) => {
        state.currentPolicy = action.payload.data;
        const index = state.policies.findIndex((p) => p.id === action.payload.data.id);
        if (index !== -1) state.policies[index] = action.payload.data;
      })
      .addCase(deletePolicy.fulfilled, (state, action) => {
        state.policies = state.policies.filter((p) => p.id !== action.payload);
      })
      .addCase(submitPolicyForReview.fulfilled, (state, action) => {
        state.currentPolicy = action.payload.data;
        const index = state.policies.findIndex((p) => p.id === action.payload.data.id);
        if (index !== -1) state.policies[index] = action.payload.data;
      })
      .addCase(approvePolicy.fulfilled, (state, action) => {
        state.currentPolicy = action.payload.data;
        const index = state.policies.findIndex((p) => p.id === action.payload.data.id);
        if (index !== -1) state.policies[index] = action.payload.data;
      })
      // Certifications
      .addCase(fetchCertifications.pending, (state) => {
        state.certificationsLoading = true;
      })
      .addCase(fetchCertifications.fulfilled, (state, action) => {
        state.certificationsLoading = false;
        state.certifications = action.payload.data;
        state.certificationsPagination = action.payload.pagination;
      })
      .addCase(fetchCertifications.rejected, (state, action) => {
        state.certificationsLoading = false;
        state.error = action.payload?.message || 'Error loading certifications';
      })
      .addCase(fetchCertificationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCertificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCertification = action.payload.data;
      })
      .addCase(fetchCertificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading certification';
      })
      .addCase(createCertification.fulfilled, (state, action) => {
        state.certifications.unshift(action.payload.data);
      })
      .addCase(updateCertification.fulfilled, (state, action) => {
        state.currentCertification = action.payload.data;
        const index = state.certifications.findIndex((c) => c.id === action.payload.data.id);
        if (index !== -1) state.certifications[index] = action.payload.data;
      })
      .addCase(deleteCertification.fulfilled, (state, action) => {
        state.certifications = state.certifications.filter((c) => c.id !== action.payload);
      });
  },
});

export const {
  clearCurrentReport,
  clearCurrentPermit,
  clearCurrentAudit,
  clearCurrentPolicy,
  clearCurrentCertification,
  clearError,
} = complianceSlice.actions;

export default complianceSlice.reducer;
