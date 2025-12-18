import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== DASHBOARD ==========

export const fetchLogisticsDashboard = createAsyncThunk(
  'logistics/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/logistics/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== STORAGE TANKS ==========

export const fetchTanks = createAsyncThunk(
  'logistics/fetchTanks',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/logistics/tanks?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchTankById = createAsyncThunk(
  'logistics/fetchTankById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/logistics/tanks/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createTank = createAsyncThunk(
  'logistics/createTank',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/logistics/tanks', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateTank = createAsyncThunk(
  'logistics/updateTank',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/logistics/tanks/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteTank = createAsyncThunk(
  'logistics/deleteTank',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/logistics/tanks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== TANK GAUGINGS ==========

export const fetchGaugingsByTank = createAsyncThunk(
  'logistics/fetchGaugingsByTank',
  async ({ tankId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/logistics/tanks/${tankId}/gaugings?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createGauging = createAsyncThunk(
  'logistics/createGauging',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/logistics/gaugings', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteGauging = createAsyncThunk(
  'logistics/deleteGauging',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/logistics/gaugings/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== LOADING TICKETS ==========

export const fetchTickets = createAsyncThunk(
  'logistics/fetchTickets',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/logistics/tickets?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'logistics/fetchTicketById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/logistics/tickets/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createTicket = createAsyncThunk(
  'logistics/createTicket',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/logistics/tickets', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateTicket = createAsyncThunk(
  'logistics/updateTicket',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/logistics/tickets/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'logistics/deleteTicket',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/logistics/tickets/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const completeTicket = createAsyncThunk(
  'logistics/completeTicket',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/logistics/tickets/${id}/complete`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== CRUDE QUALITY ==========

export const fetchQualities = createAsyncThunk(
  'logistics/fetchQualities',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/logistics/quality?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchQualityById = createAsyncThunk(
  'logistics/fetchQualityById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/logistics/quality/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createQuality = createAsyncThunk(
  'logistics/createQuality',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/logistics/quality', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateQuality = createAsyncThunk(
  'logistics/updateQuality',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/logistics/quality/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteQuality = createAsyncThunk(
  'logistics/deleteQuality',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/logistics/quality/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approveQuality = createAsyncThunk(
  'logistics/approveQuality',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/logistics/quality/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== PIPELINES ==========

export const fetchPipelines = createAsyncThunk(
  'logistics/fetchPipelines',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/logistics/pipelines?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPipelineById = createAsyncThunk(
  'logistics/fetchPipelineById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/logistics/pipelines/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createPipeline = createAsyncThunk(
  'logistics/createPipeline',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/logistics/pipelines', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updatePipeline = createAsyncThunk(
  'logistics/updatePipeline',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/logistics/pipelines/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deletePipeline = createAsyncThunk(
  'logistics/deletePipeline',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/logistics/pipelines/${id}`);
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
  // Tanks
  tanks: [],
  currentTank: null,
  tanksPagination: null,
  gaugings: [],
  gaugingsPagination: null,
  // Tickets
  tickets: [],
  currentTicket: null,
  ticketsPagination: null,
  // Quality
  qualities: [],
  currentQuality: null,
  qualitiesPagination: null,
  // Pipelines
  pipelines: [],
  currentPipeline: null,
  pipelinesPagination: null,
  // Status
  loading: false,
  error: null,
};

const logisticsSlice = createSlice({
  name: 'logistics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTank: (state) => {
      state.currentTank = null;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
    clearCurrentQuality: (state) => {
      state.currentQuality = null;
    },
    clearCurrentPipeline: (state) => {
      state.currentPipeline = null;
    },
    clearGaugings: (state) => {
      state.gaugings = [];
      state.gaugingsPagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchLogisticsDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogisticsDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchLogisticsDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar dashboard';
      })
      // Tanks
      .addCase(fetchTanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTanks.fulfilled, (state, action) => {
        state.loading = false;
        state.tanks = action.payload.data;
        state.tanksPagination = action.payload.pagination;
      })
      .addCase(fetchTanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar tanques';
      })
      .addCase(fetchTankById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTankById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTank = action.payload;
      })
      .addCase(fetchTankById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar tanque';
      })
      .addCase(createTank.fulfilled, (state, action) => {
        state.tanks.unshift(action.payload);
      })
      .addCase(updateTank.fulfilled, (state, action) => {
        const index = state.tanks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tanks[index] = action.payload;
        if (state.currentTank?.id === action.payload.id) {
          state.currentTank = action.payload;
        }
      })
      .addCase(deleteTank.fulfilled, (state, action) => {
        state.tanks = state.tanks.filter(t => t.id !== action.payload);
      })
      // Gaugings
      .addCase(fetchGaugingsByTank.fulfilled, (state, action) => {
        state.gaugings = action.payload.data;
        state.gaugingsPagination = action.payload.pagination;
      })
      .addCase(createGauging.fulfilled, (state, action) => {
        state.gaugings.unshift(action.payload);
      })
      .addCase(deleteGauging.fulfilled, (state, action) => {
        state.gaugings = state.gaugings.filter(g => g.id !== action.payload);
      })
      // Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.data;
        state.ticketsPagination = action.payload.pagination;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar tickets';
      })
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar ticket';
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.unshift(action.payload);
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tickets[index] = action.payload;
        if (state.currentTicket?.id === action.payload.id) {
          state.currentTicket = action.payload;
        }
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter(t => t.id !== action.payload);
      })
      .addCase(completeTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tickets[index] = action.payload;
        if (state.currentTicket?.id === action.payload.id) {
          state.currentTicket = action.payload;
        }
      })
      // Quality
      .addCase(fetchQualities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQualities.fulfilled, (state, action) => {
        state.loading = false;
        state.qualities = action.payload.data;
        state.qualitiesPagination = action.payload.pagination;
      })
      .addCase(fetchQualities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar calidades';
      })
      .addCase(fetchQualityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQualityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuality = action.payload;
      })
      .addCase(fetchQualityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar calidad';
      })
      .addCase(createQuality.fulfilled, (state, action) => {
        state.qualities.unshift(action.payload);
      })
      .addCase(updateQuality.fulfilled, (state, action) => {
        const index = state.qualities.findIndex(q => q.id === action.payload.id);
        if (index !== -1) state.qualities[index] = action.payload;
        if (state.currentQuality?.id === action.payload.id) {
          state.currentQuality = action.payload;
        }
      })
      .addCase(deleteQuality.fulfilled, (state, action) => {
        state.qualities = state.qualities.filter(q => q.id !== action.payload);
      })
      .addCase(approveQuality.fulfilled, (state, action) => {
        const index = state.qualities.findIndex(q => q.id === action.payload.id);
        if (index !== -1) state.qualities[index] = action.payload;
        if (state.currentQuality?.id === action.payload.id) {
          state.currentQuality = action.payload;
        }
      })
      // Pipelines
      .addCase(fetchPipelines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipelines.fulfilled, (state, action) => {
        state.loading = false;
        state.pipelines = action.payload.data;
        state.pipelinesPagination = action.payload.pagination;
      })
      .addCase(fetchPipelines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar ductos';
      })
      .addCase(fetchPipelineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipelineById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPipeline = action.payload;
      })
      .addCase(fetchPipelineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar ducto';
      })
      .addCase(createPipeline.fulfilled, (state, action) => {
        state.pipelines.unshift(action.payload);
      })
      .addCase(updatePipeline.fulfilled, (state, action) => {
        const index = state.pipelines.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.pipelines[index] = action.payload;
        if (state.currentPipeline?.id === action.payload.id) {
          state.currentPipeline = action.payload;
        }
      })
      .addCase(deletePipeline.fulfilled, (state, action) => {
        state.pipelines = state.pipelines.filter(p => p.id !== action.payload);
      });
  },
});

export const {
  clearError,
  clearCurrentTank,
  clearCurrentTicket,
  clearCurrentQuality,
  clearCurrentPipeline,
  clearGaugings,
} = logisticsSlice.actions;

export default logisticsSlice.reducer;
