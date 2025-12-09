import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ==================== ASYNC THUNKS ====================

// Petty Cash
export const fetchPettyCashes = createAsyncThunk(
  'pettyCash/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/petty-cash', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cajas chicas');
    }
  }
);

export const fetchPettyCashById = createAsyncThunk(
  'pettyCash/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/petty-cash/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar caja chica');
    }
  }
);

export const fetchPettyCashFull = createAsyncThunk(
  'pettyCash/fetchFull',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/petty-cash/${id}/full`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar caja chica');
    }
  }
);

export const createPettyCash = createAsyncThunk(
  'pettyCash/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/petty-cash', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear caja chica');
    }
  }
);

export const updatePettyCash = createAsyncThunk(
  'pettyCash/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/petty-cash/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar caja chica');
    }
  }
);

// Stats
export const fetchPettyCashStats = createAsyncThunk(
  'pettyCash/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/petty-cash/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const fetchPettyCashCashStats = createAsyncThunk(
  'pettyCash/fetchCashStats',
  async ({ id, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/petty-cash/${id}/stats`, { params: { startDate, endDate } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

// Categories
export const fetchCategories = createAsyncThunk(
  'pettyCash/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/petty-cash/categories');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar categorías');
    }
  }
);

// Entries
export const fetchEntries = createAsyncThunk(
  'pettyCash/fetchEntries',
  async ({ pettyCashId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/petty-cash/${pettyCashId}/entries`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar movimientos');
    }
  }
);

export const fetchEntryById = createAsyncThunk(
  'pettyCash/fetchEntryById',
  async ({ pettyCashId, entryId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/petty-cash/${pettyCashId}/entries/${entryId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar movimiento');
    }
  }
);

export const createEntry = createAsyncThunk(
  'pettyCash/createEntry',
  async ({ pettyCashId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/petty-cash/${pettyCashId}/entries`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear movimiento');
    }
  }
);

export const createReplenishment = createAsyncThunk(
  'pettyCash/createReplenishment',
  async ({ pettyCashId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/petty-cash/${pettyCashId}/replenishment`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear reposición');
    }
  }
);

export const approveEntry = createAsyncThunk(
  'pettyCash/approveEntry',
  async ({ pettyCashId, entryId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/petty-cash/${pettyCashId}/entries/${entryId}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar movimiento');
    }
  }
);

export const rejectEntry = createAsyncThunk(
  'pettyCash/rejectEntry',
  async ({ pettyCashId, entryId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/petty-cash/${pettyCashId}/entries/${entryId}/reject`, { reason });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al rechazar movimiento');
    }
  }
);

export const cancelEntry = createAsyncThunk(
  'pettyCash/cancelEntry',
  async ({ pettyCashId, entryId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/petty-cash/${pettyCashId}/entries/${entryId}/cancel`, { reason });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cancelar movimiento');
    }
  }
);

// ==================== SLICE ====================

const initialState = {
  // Petty Cashes
  pettyCashes: [],
  currentPettyCash: null,
  // Entries
  entries: [],
  entriesPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  currentEntry: null,
  entryLoading: false,
  // Categories
  categories: [],
  // Stats
  stats: {
    activeCashes: 0,
    totalBalance: 0,
    cashesNeedingReplenishment: 0,
    pendingApproval: 0,
    monthlyExpenses: 0,
  },
  // UI State
  loading: false,
  error: null,
};

const pettyCashSlice = createSlice({
  name: 'pettyCash',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPettyCash: (state) => {
      state.currentPettyCash = null;
    },
    clearEntries: (state) => {
      state.entries = [];
      state.entriesPagination = { total: 0, page: 1, limit: 20, totalPages: 0 };
    },
    clearCurrentEntry: (state) => {
      state.currentEntry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPettyCashes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPettyCashes.fulfilled, (state, action) => {
        state.loading = false;
        state.pettyCashes = action.payload.data;
      })
      .addCase(fetchPettyCashes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By Id
      .addCase(fetchPettyCashById.fulfilled, (state, action) => {
        state.currentPettyCash = action.payload;
      })
      // Fetch Full
      .addCase(fetchPettyCashFull.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPettyCashFull.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPettyCash = action.payload;
      })
      .addCase(fetchPettyCashFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createPettyCash.fulfilled, (state, action) => {
        state.pettyCashes.unshift(action.payload);
      })
      // Update
      .addCase(updatePettyCash.fulfilled, (state, action) => {
        const index = state.pettyCashes.findIndex(pc => pc.id === action.payload.id);
        if (index !== -1) {
          state.pettyCashes[index] = action.payload;
        }
        if (state.currentPettyCash?.id === action.payload.id) {
          state.currentPettyCash = { ...state.currentPettyCash, ...action.payload };
        }
      })
      // Stats
      .addCase(fetchPettyCashStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Entries
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.data;
        state.entriesPagination = action.payload.pagination;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Entry
      .addCase(createEntry.fulfilled, (state, action) => {
        state.entries.unshift(action.payload);
      })
      // Create Replenishment
      .addCase(createReplenishment.fulfilled, (state, action) => {
        state.entries.unshift(action.payload);
      })
      // Approve Entry
      .addCase(approveEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      // Reject Entry
      .addCase(rejectEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      // Cancel Entry
      .addCase(cancelEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      // Fetch Entry By Id
      .addCase(fetchEntryById.pending, (state) => {
        state.entryLoading = true;
        state.error = null;
      })
      .addCase(fetchEntryById.fulfilled, (state, action) => {
        state.entryLoading = false;
        state.currentEntry = action.payload;
      })
      .addCase(fetchEntryById.rejected, (state, action) => {
        state.entryLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPettyCash, clearEntries, clearCurrentEntry } = pettyCashSlice.actions;
export default pettyCashSlice.reducer;
