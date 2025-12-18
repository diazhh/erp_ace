import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== DASHBOARD ==========

export const fetchPTWDashboard = createAsyncThunk(
  'ptw/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/ptw/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchActivePermitsBoard = createAsyncThunk(
  'ptw/fetchActiveBoard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/ptw/active-board');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== WORK PERMITS ==========

export const fetchPermits = createAsyncThunk(
  'ptw/fetchPermits',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/ptw/permits?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPermitById = createAsyncThunk(
  'ptw/fetchPermitById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/ptw/permits/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createPermit = createAsyncThunk(
  'ptw/createPermit',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/ptw/permits', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updatePermit = createAsyncThunk(
  'ptw/updatePermit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/ptw/permits/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deletePermit = createAsyncThunk(
  'ptw/deletePermit',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/ptw/permits/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== PERMIT WORKFLOW ==========

export const submitPermit = createAsyncThunk(
  'ptw/submitPermit',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/permits/${id}/submit`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approvePermit = createAsyncThunk(
  'ptw/approvePermit',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/permits/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const rejectPermit = createAsyncThunk(
  'ptw/rejectPermit',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/permits/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const activatePermit = createAsyncThunk(
  'ptw/activatePermit',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/permits/${id}/activate`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const closePermit = createAsyncThunk(
  'ptw/closePermit',
  async ({ id, notes }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/permits/${id}/close`, { notes });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const cancelPermit = createAsyncThunk(
  'ptw/cancelPermit',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/permits/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== CHECKLISTS ==========

export const updateChecklist = createAsyncThunk(
  'ptw/updateChecklist',
  async ({ permitId, checklistId, items }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/ptw/permits/${permitId}/checklists/${checklistId}`, { items });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== EXTENSIONS ==========

export const requestExtension = createAsyncThunk(
  'ptw/requestExtension',
  async ({ permitId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/permits/${permitId}/extensions`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approveExtension = createAsyncThunk(
  'ptw/approveExtension',
  async ({ permitId, extensionId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/permits/${permitId}/extensions/${extensionId}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const rejectExtension = createAsyncThunk(
  'ptw/rejectExtension',
  async ({ permitId, extensionId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/permits/${permitId}/extensions/${extensionId}/reject`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== STOP WORK AUTHORITY ==========

export const fetchStopWork = createAsyncThunk(
  'ptw/fetchStopWork',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/ptw/stop-work?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchStopWorkById = createAsyncThunk(
  'ptw/fetchStopWorkById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/ptw/stop-work/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createStopWork = createAsyncThunk(
  'ptw/createStopWork',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/ptw/stop-work', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const resolveStopWork = createAsyncThunk(
  'ptw/resolveStopWork',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/stop-work/${id}/resolve`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const resumeWork = createAsyncThunk(
  'ptw/resumeWork',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ptw/stop-work/${id}/resume`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== SLICE ==========

const initialState = {
  dashboard: null,
  dashboardLoading: false,
  activeBoard: null,
  activeBoardLoading: false,
  permits: [],
  permitsPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  permitsLoading: false,
  currentPermit: null,
  stopWorkList: [],
  stopWorkPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  stopWorkLoading: false,
  currentStopWork: null,
  loading: false,
  error: null,
};

const ptwSlice = createSlice({
  name: 'ptw',
  initialState,
  reducers: {
    clearCurrentPermit: (state) => {
      state.currentPermit = null;
    },
    clearCurrentStopWork: (state) => {
      state.currentStopWork = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchPTWDashboard.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(fetchPTWDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchPTWDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload?.message || 'Error loading dashboard';
      })
      // Active Board
      .addCase(fetchActivePermitsBoard.pending, (state) => {
        state.activeBoardLoading = true;
      })
      .addCase(fetchActivePermitsBoard.fulfilled, (state, action) => {
        state.activeBoardLoading = false;
        state.activeBoard = action.payload;
      })
      .addCase(fetchActivePermitsBoard.rejected, (state, action) => {
        state.activeBoardLoading = false;
        state.error = action.payload?.message || 'Error loading active board';
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
        state.currentPermit = action.payload;
      })
      .addCase(fetchPermitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading permit';
      })
      .addCase(createPermit.fulfilled, (state, action) => {
        state.permits.unshift(action.payload);
      })
      .addCase(updatePermit.fulfilled, (state, action) => {
        state.currentPermit = action.payload;
        const index = state.permits.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.permits[index] = action.payload;
      })
      .addCase(deletePermit.fulfilled, (state, action) => {
        state.permits = state.permits.filter((p) => p.id !== action.payload);
      })
      // Workflow
      .addCase(submitPermit.fulfilled, (state, action) => {
        state.currentPermit = action.payload;
      })
      .addCase(approvePermit.fulfilled, (state, action) => {
        state.currentPermit = action.payload;
      })
      .addCase(rejectPermit.fulfilled, (state, action) => {
        state.currentPermit = action.payload;
      })
      .addCase(activatePermit.fulfilled, (state, action) => {
        state.currentPermit = action.payload;
      })
      .addCase(closePermit.fulfilled, (state, action) => {
        state.currentPermit = action.payload;
      })
      .addCase(cancelPermit.fulfilled, (state, action) => {
        state.currentPermit = action.payload;
      })
      // Checklists
      .addCase(updateChecklist.fulfilled, (state, action) => {
        if (state.currentPermit && state.currentPermit.checklists) {
          const index = state.currentPermit.checklists.findIndex(
            (c) => c.id === action.payload.id
          );
          if (index !== -1) state.currentPermit.checklists[index] = action.payload;
        }
      })
      // Stop Work
      .addCase(fetchStopWork.pending, (state) => {
        state.stopWorkLoading = true;
      })
      .addCase(fetchStopWork.fulfilled, (state, action) => {
        state.stopWorkLoading = false;
        state.stopWorkList = action.payload.data;
        state.stopWorkPagination = action.payload.pagination;
      })
      .addCase(fetchStopWork.rejected, (state, action) => {
        state.stopWorkLoading = false;
        state.error = action.payload?.message || 'Error loading stop work';
      })
      .addCase(fetchStopWorkById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStopWorkById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStopWork = action.payload;
      })
      .addCase(fetchStopWorkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading stop work';
      })
      .addCase(createStopWork.fulfilled, (state, action) => {
        state.stopWorkList.unshift(action.payload);
      })
      .addCase(resolveStopWork.fulfilled, (state, action) => {
        state.currentStopWork = action.payload;
      })
      .addCase(resumeWork.fulfilled, (state, action) => {
        state.currentStopWork = action.payload;
      });
  },
});

export const { clearCurrentPermit, clearCurrentStopWork, clearError } = ptwSlice.actions;

export default ptwSlice.reducer;
