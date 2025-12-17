import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== DASHBOARD ==========

export const fetchProductionDashboard = createAsyncThunk(
  'production/fetchDashboard',
  async (fieldId = null, { rejectWithValue }) => {
    try {
      const params = fieldId ? `?fieldId=${fieldId}` : '';
      const response = await api.get(`/production/dashboard${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchProductionTrend = createAsyncThunk(
  'production/fetchTrend',
  async ({ fieldId = null, days = 30 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (fieldId) params.append('fieldId', fieldId);
      params.append('days', days);
      const response = await api.get(`/production/trend?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== FIELDS ==========

export const fetchFields = createAsyncThunk(
  'production/fetchFields',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/production/fields?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchFieldById = createAsyncThunk(
  'production/fetchFieldById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/production/fields/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createField = createAsyncThunk(
  'production/createField',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/production/fields', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateField = createAsyncThunk(
  'production/updateField',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/production/fields/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteField = createAsyncThunk(
  'production/deleteField',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/production/fields/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== WELLS ==========

export const fetchWells = createAsyncThunk(
  'production/fetchWells',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/production/wells?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchWellById = createAsyncThunk(
  'production/fetchWellById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/production/wells/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createWell = createAsyncThunk(
  'production/createWell',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/production/wells', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateWell = createAsyncThunk(
  'production/updateWell',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/production/wells/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteWell = createAsyncThunk(
  'production/deleteWell',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/production/wells/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchWellProduction = createAsyncThunk(
  'production/fetchWellProduction',
  async ({ wellId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/production/wells/${wellId}/production?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== DAILY PRODUCTION ==========

export const fetchDailyProduction = createAsyncThunk(
  'production/fetchDailyProduction',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/production/daily?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchProductionById = createAsyncThunk(
  'production/fetchProductionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/production/daily/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createProduction = createAsyncThunk(
  'production/createProduction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/production/daily', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateProduction = createAsyncThunk(
  'production/updateProduction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/production/daily/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const verifyProduction = createAsyncThunk(
  'production/verifyProduction',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/production/daily/${id}/verify`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approveProduction = createAsyncThunk(
  'production/approveProduction',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/production/daily/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteProduction = createAsyncThunk(
  'production/deleteProduction',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/production/daily/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== ALLOCATIONS ==========

export const fetchAllocations = createAsyncThunk(
  'production/fetchAllocations',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/production/allocations?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAllocationById = createAsyncThunk(
  'production/fetchAllocationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/production/allocations/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const generateAllocation = createAsyncThunk(
  'production/generateAllocation',
  async ({ fieldId, month, year }, { rejectWithValue }) => {
    try {
      const response = await api.post('/production/allocations/generate', { fieldId, month, year });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approveAllocation = createAsyncThunk(
  'production/approveAllocation',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/production/allocations/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== MORNING REPORTS ==========

export const fetchMorningReports = createAsyncThunk(
  'production/fetchMorningReports',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/production/morning-reports?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchMorningReportById = createAsyncThunk(
  'production/fetchMorningReportById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/production/morning-reports/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createMorningReport = createAsyncThunk(
  'production/createMorningReport',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/production/morning-reports', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateMorningReport = createAsyncThunk(
  'production/updateMorningReport',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/production/morning-reports/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const submitMorningReport = createAsyncThunk(
  'production/submitMorningReport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/production/morning-reports/${id}/submit`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approveMorningReport = createAsyncThunk(
  'production/approveMorningReport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/production/morning-reports/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteMorningReport = createAsyncThunk(
  'production/deleteMorningReport',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/production/morning-reports/${id}`);
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
  trend: [],
  // Fields
  fields: [],
  currentField: null,
  fieldsPagination: null,
  // Wells
  wells: [],
  currentWell: null,
  wellsPagination: null,
  wellProduction: [],
  wellProductionPagination: null,
  // Daily Production
  dailyProduction: [],
  currentProduction: null,
  dailyProductionPagination: null,
  // Allocations
  allocations: [],
  currentAllocation: null,
  allocationsPagination: null,
  // Morning Reports
  morningReports: [],
  currentMorningReport: null,
  morningReportsPagination: null,
  // Status
  loading: false,
  error: null,
};

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentField: (state) => {
      state.currentField = null;
    },
    clearCurrentWell: (state) => {
      state.currentWell = null;
    },
    clearCurrentProduction: (state) => {
      state.currentProduction = null;
    },
    clearCurrentAllocation: (state) => {
      state.currentAllocation = null;
    },
    clearCurrentMorningReport: (state) => {
      state.currentMorningReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchProductionDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchProductionDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar dashboard';
      })
      // Trend
      .addCase(fetchProductionTrend.fulfilled, (state, action) => {
        state.trend = action.payload;
      })
      // Fields
      .addCase(fetchFields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFields.fulfilled, (state, action) => {
        state.loading = false;
        state.fields = action.payload.data;
        state.fieldsPagination = action.payload.pagination;
      })
      .addCase(fetchFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar campos';
      })
      .addCase(fetchFieldById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentField = action.payload;
      })
      .addCase(fetchFieldById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar campo';
      })
      .addCase(createField.fulfilled, (state, action) => {
        state.fields.unshift(action.payload);
      })
      .addCase(updateField.fulfilled, (state, action) => {
        const index = state.fields.findIndex(f => f.id === action.payload.id);
        if (index !== -1) state.fields[index] = action.payload;
        if (state.currentField?.id === action.payload.id) {
          state.currentField = action.payload;
        }
      })
      .addCase(deleteField.fulfilled, (state, action) => {
        state.fields = state.fields.filter(f => f.id !== action.payload);
      })
      // Wells
      .addCase(fetchWells.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWells.fulfilled, (state, action) => {
        state.loading = false;
        state.wells = action.payload.data;
        state.wellsPagination = action.payload.pagination;
      })
      .addCase(fetchWells.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar pozos';
      })
      .addCase(fetchWellById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWellById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWell = action.payload;
      })
      .addCase(fetchWellById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar pozo';
      })
      .addCase(createWell.fulfilled, (state, action) => {
        state.wells.unshift(action.payload);
      })
      .addCase(updateWell.fulfilled, (state, action) => {
        const index = state.wells.findIndex(w => w.id === action.payload.id);
        if (index !== -1) state.wells[index] = action.payload;
        if (state.currentWell?.id === action.payload.id) {
          state.currentWell = action.payload;
        }
      })
      .addCase(deleteWell.fulfilled, (state, action) => {
        state.wells = state.wells.filter(w => w.id !== action.payload);
      })
      .addCase(fetchWellProduction.fulfilled, (state, action) => {
        state.wellProduction = action.payload.data;
        state.wellProductionPagination = action.payload.pagination;
      })
      // Daily Production
      .addCase(fetchDailyProduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyProduction.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyProduction = action.payload.data;
        state.dailyProductionPagination = action.payload.pagination;
      })
      .addCase(fetchDailyProduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar producción';
      })
      .addCase(fetchProductionById.fulfilled, (state, action) => {
        state.currentProduction = action.payload;
      })
      .addCase(createProduction.fulfilled, (state, action) => {
        state.dailyProduction.unshift(action.payload);
      })
      .addCase(updateProduction.fulfilled, (state, action) => {
        const index = state.dailyProduction.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.dailyProduction[index] = action.payload;
        if (state.currentProduction?.id === action.payload.id) {
          state.currentProduction = action.payload;
        }
      })
      .addCase(verifyProduction.fulfilled, (state, action) => {
        const index = state.dailyProduction.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.dailyProduction[index] = action.payload;
      })
      .addCase(approveProduction.fulfilled, (state, action) => {
        const index = state.dailyProduction.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.dailyProduction[index] = action.payload;
      })
      .addCase(deleteProduction.fulfilled, (state, action) => {
        state.dailyProduction = state.dailyProduction.filter(p => p.id !== action.payload);
      })
      // Allocations
      .addCase(fetchAllocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllocations.fulfilled, (state, action) => {
        state.loading = false;
        state.allocations = action.payload.data;
        state.allocationsPagination = action.payload.pagination;
      })
      .addCase(fetchAllocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar allocations';
      })
      .addCase(fetchAllocationById.fulfilled, (state, action) => {
        state.currentAllocation = action.payload;
      })
      .addCase(generateAllocation.fulfilled, (state, action) => {
        const index = state.allocations.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.allocations[index] = action.payload;
        } else {
          state.allocations.unshift(action.payload);
        }
      })
      .addCase(approveAllocation.fulfilled, (state, action) => {
        const index = state.allocations.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.allocations[index] = action.payload;
      })
      // Morning Reports
      .addCase(fetchMorningReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMorningReports.fulfilled, (state, action) => {
        state.loading = false;
        state.morningReports = action.payload.data;
        state.morningReportsPagination = action.payload.pagination;
      })
      .addCase(fetchMorningReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar reportes';
      })
      .addCase(fetchMorningReportById.fulfilled, (state, action) => {
        state.currentMorningReport = action.payload;
      })
      .addCase(createMorningReport.fulfilled, (state, action) => {
        state.morningReports.unshift(action.payload);
      })
      .addCase(updateMorningReport.fulfilled, (state, action) => {
        const index = state.morningReports.findIndex(r => r.id === action.payload.id);
        if (index !== -1) state.morningReports[index] = action.payload;
        if (state.currentMorningReport?.id === action.payload.id) {
          state.currentMorningReport = action.payload;
        }
      })
      .addCase(submitMorningReport.fulfilled, (state, action) => {
        const index = state.morningReports.findIndex(r => r.id === action.payload.id);
        if (index !== -1) state.morningReports[index] = action.payload;
      })
      .addCase(approveMorningReport.fulfilled, (state, action) => {
        const index = state.morningReports.findIndex(r => r.id === action.payload.id);
        if (index !== -1) state.morningReports[index] = action.payload;
      })
      .addCase(deleteMorningReport.fulfilled, (state, action) => {
        state.morningReports = state.morningReports.filter(r => r.id !== action.payload);
      });
  },
});

export const {
  clearError,
  clearCurrentField,
  clearCurrentWell,
  clearCurrentProduction,
  clearCurrentAllocation,
  clearCurrentMorningReport,
} = productionSlice.actions;

export default productionSlice.reducer;
