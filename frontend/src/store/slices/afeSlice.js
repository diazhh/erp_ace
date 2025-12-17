import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== DASHBOARD ==========

export const fetchAFEDashboard = createAsyncThunk(
  'afe/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/afe/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== AFE CRUD ==========

export const fetchAFEs = createAsyncThunk(
  'afe/fetchAFEs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/afe?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAFEById = createAsyncThunk(
  'afe/fetchAFEById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/afe/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createAFE = createAsyncThunk(
  'afe/createAFE',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/afe', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateAFE = createAsyncThunk(
  'afe/updateAFE',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/afe/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteAFE = createAsyncThunk(
  'afe/deleteAFE',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/afe/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== WORKFLOW ==========

export const submitAFE = createAsyncThunk(
  'afe/submitAFE',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${id}/submit`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approveAFE = createAsyncThunk(
  'afe/approveAFE',
  async ({ id, comments = '' }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${id}/approve`, { comments });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const rejectAFE = createAsyncThunk(
  'afe/rejectAFE',
  async ({ id, comments = '' }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${id}/reject`, { comments });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const startAFEExecution = createAsyncThunk(
  'afe/startExecution',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${id}/start`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const closeAFE = createAsyncThunk(
  'afe/closeAFE',
  async ({ id, final_cost = null }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${id}/close`, { final_cost });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== CATEGORIES ==========

export const addAFECategory = createAsyncThunk(
  'afe/addCategory',
  async ({ afeId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${afeId}/categories`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateAFECategory = createAsyncThunk(
  'afe/updateCategory',
  async ({ afeId, categoryId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/afe/${afeId}/categories/${categoryId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteAFECategory = createAsyncThunk(
  'afe/deleteCategory',
  async ({ afeId, categoryId }, { rejectWithValue }) => {
    try {
      await api.delete(`/afe/${afeId}/categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== EXPENSES ==========

export const fetchAFEExpenses = createAsyncThunk(
  'afe/fetchExpenses',
  async ({ afeId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/afe/${afeId}/expenses?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addAFEExpense = createAsyncThunk(
  'afe/addExpense',
  async ({ afeId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${afeId}/expenses`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approveAFEExpense = createAsyncThunk(
  'afe/approveExpense',
  async ({ afeId, expenseId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${afeId}/expenses/${expenseId}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== VARIANCES ==========

export const requestAFEVariance = createAsyncThunk(
  'afe/requestVariance',
  async ({ afeId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${afeId}/variances`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approveAFEVariance = createAsyncThunk(
  'afe/approveVariance',
  async ({ afeId, varianceId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${afeId}/variances/${varianceId}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const rejectAFEVariance = createAsyncThunk(
  'afe/rejectVariance',
  async ({ afeId, varianceId, comments = '' }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/afe/${afeId}/variances/${varianceId}/reject`, { comments });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== PENDING APPROVALS ==========

export const fetchPendingApprovals = createAsyncThunk(
  'afe/fetchPendingApprovals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/afe/pending-approvals');
      return response.data;
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
  // AFE List
  afes: [],
  afesPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  // Current AFE
  currentAFE: null,
  // Expenses
  expenses: [],
  expensesPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  // Pending Approvals
  pendingApprovals: [],
  // Loading states
  loading: false,
  expensesLoading: false,
  // Error
  error: null,
};

const afeSlice = createSlice({
  name: 'afe',
  initialState,
  reducers: {
    clearCurrentAFE: (state) => {
      state.currentAFE = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchAFEDashboard.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(fetchAFEDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchAFEDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload?.message || 'Error loading dashboard';
      })
      // Fetch AFEs
      .addCase(fetchAFEs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAFEs.fulfilled, (state, action) => {
        state.loading = false;
        state.afes = action.payload.data;
        state.afesPagination = action.payload.pagination;
      })
      .addCase(fetchAFEs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading AFEs';
      })
      // Fetch AFE by ID
      .addCase(fetchAFEById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAFEById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAFE = action.payload;
      })
      .addCase(fetchAFEById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading AFE';
      })
      // Create AFE
      .addCase(createAFE.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAFE.fulfilled, (state, action) => {
        state.loading = false;
        state.afes.unshift(action.payload);
      })
      .addCase(createAFE.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error creating AFE';
      })
      // Update AFE
      .addCase(updateAFE.fulfilled, (state, action) => {
        state.currentAFE = action.payload;
        const index = state.afes.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.afes[index] = action.payload;
        }
      })
      // Delete AFE
      .addCase(deleteAFE.fulfilled, (state, action) => {
        state.afes = state.afes.filter((a) => a.id !== action.payload);
      })
      // Submit AFE
      .addCase(submitAFE.fulfilled, (state, action) => {
        state.currentAFE = action.payload;
        const index = state.afes.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.afes[index] = action.payload;
        }
      })
      // Approve AFE
      .addCase(approveAFE.fulfilled, (state, action) => {
        state.currentAFE = action.payload;
        const index = state.afes.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.afes[index] = action.payload;
        }
      })
      // Reject AFE
      .addCase(rejectAFE.fulfilled, (state, action) => {
        state.currentAFE = action.payload;
        const index = state.afes.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.afes[index] = action.payload;
        }
      })
      // Start Execution
      .addCase(startAFEExecution.fulfilled, (state, action) => {
        state.currentAFE = action.payload;
        const index = state.afes.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.afes[index] = action.payload;
        }
      })
      // Close AFE
      .addCase(closeAFE.fulfilled, (state, action) => {
        state.currentAFE = action.payload;
        const index = state.afes.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.afes[index] = action.payload;
        }
      })
      // Fetch Expenses
      .addCase(fetchAFEExpenses.pending, (state) => {
        state.expensesLoading = true;
      })
      .addCase(fetchAFEExpenses.fulfilled, (state, action) => {
        state.expensesLoading = false;
        state.expenses = action.payload.data;
        state.expensesPagination = action.payload.pagination;
      })
      .addCase(fetchAFEExpenses.rejected, (state, action) => {
        state.expensesLoading = false;
        state.error = action.payload?.message || 'Error loading expenses';
      })
      // Pending Approvals
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.pendingApprovals = action.payload;
      });
  },
});

export const { clearCurrentAFE, clearError } = afeSlice.actions;
export default afeSlice.reducer;
