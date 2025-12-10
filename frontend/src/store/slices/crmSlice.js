import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== CLIENTES ==========

export const fetchClients = createAsyncThunk(
  'crm/fetchClients',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/crm/clients?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchClientById = createAsyncThunk(
  'crm/fetchClientById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/crm/clients/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createClient = createAsyncThunk(
  'crm/createClient',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/crm/clients', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateClient = createAsyncThunk(
  'crm/updateClient',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/crm/clients/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteClient = createAsyncThunk(
  'crm/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/crm/clients/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== CONTACTOS ==========

export const createContact = createAsyncThunk(
  'crm/createContact',
  async ({ clientId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/crm/clients/${clientId}/contacts`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateContact = createAsyncThunk(
  'crm/updateContact',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/crm/contacts/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteContact = createAsyncThunk(
  'crm/deleteContact',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/crm/contacts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== OPORTUNIDADES ==========

export const fetchOpportunities = createAsyncThunk(
  'crm/fetchOpportunities',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/crm/opportunities?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchOpportunityById = createAsyncThunk(
  'crm/fetchOpportunityById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/crm/opportunities/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createOpportunity = createAsyncThunk(
  'crm/createOpportunity',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/crm/opportunities', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateOpportunity = createAsyncThunk(
  'crm/updateOpportunity',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/crm/opportunities/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteOpportunity = createAsyncThunk(
  'crm/deleteOpportunity',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/crm/opportunities/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== COTIZACIONES ==========

export const fetchQuotes = createAsyncThunk(
  'crm/fetchQuotes',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/crm/quotes?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchQuoteById = createAsyncThunk(
  'crm/fetchQuoteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/crm/quotes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createQuote = createAsyncThunk(
  'crm/createQuote',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/crm/quotes', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateQuote = createAsyncThunk(
  'crm/updateQuote',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/crm/quotes/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteQuote = createAsyncThunk(
  'crm/deleteQuote',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/crm/quotes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const sendQuote = createAsyncThunk(
  'crm/sendQuote',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/crm/quotes/${id}/send`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== ACTIVIDADES ==========

export const fetchActivities = createAsyncThunk(
  'crm/fetchActivities',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/crm/activities?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createActivity = createAsyncThunk(
  'crm/createActivity',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/crm/activities', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const completeActivity = createAsyncThunk(
  'crm/completeActivity',
  async ({ id, outcome }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/crm/activities/${id}/complete`, { outcome });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteActivity = createAsyncThunk(
  'crm/deleteActivity',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/crm/activities/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== ESTADÍSTICAS ==========

export const fetchCrmStats = createAsyncThunk(
  'crm/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/crm/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  // Clientes
  clients: [],
  currentClient: null,
  // Oportunidades
  opportunities: [],
  currentOpportunity: null,
  // Cotizaciones
  quotes: [],
  currentQuote: null,
  // Actividades
  activities: [],
  // Estadísticas
  stats: null,
  // Estado
  loading: false,
  error: null,
};

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
    clearCurrentOpportunity: (state) => {
      state.currentOpportunity = null;
    },
    clearCurrentQuote: (state) => {
      state.currentQuote = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Clientes
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar clientes';
      })
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar cliente';
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.clients.unshift(action.payload);
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.clients[index] = action.payload;
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(c => c.id !== action.payload);
      })
      // Oportunidades
      .addCase(fetchOpportunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        state.loading = false;
        state.opportunities = action.payload;
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar oportunidades';
      })
      .addCase(fetchOpportunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOpportunity = action.payload;
      })
      .addCase(fetchOpportunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar oportunidad';
      })
      .addCase(createOpportunity.fulfilled, (state, action) => {
        state.opportunities.unshift(action.payload);
      })
      .addCase(updateOpportunity.fulfilled, (state, action) => {
        const index = state.opportunities.findIndex(o => o.id === action.payload.id);
        if (index !== -1) state.opportunities[index] = action.payload;
        if (state.currentOpportunity?.id === action.payload.id) {
          state.currentOpportunity = action.payload;
        }
      })
      .addCase(deleteOpportunity.fulfilled, (state, action) => {
        state.opportunities = state.opportunities.filter(o => o.id !== action.payload);
      })
      // Cotizaciones
      .addCase(fetchQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload;
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar cotizaciones';
      })
      .addCase(fetchQuoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuote = action.payload;
      })
      .addCase(fetchQuoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar cotización';
      })
      .addCase(createQuote.fulfilled, (state, action) => {
        state.quotes.unshift(action.payload);
      })
      .addCase(updateQuote.fulfilled, (state, action) => {
        const index = state.quotes.findIndex(q => q.id === action.payload.id);
        if (index !== -1) state.quotes[index] = action.payload;
        if (state.currentQuote?.id === action.payload.id) {
          state.currentQuote = action.payload;
        }
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.quotes = state.quotes.filter(q => q.id !== action.payload);
      })
      .addCase(sendQuote.fulfilled, (state, action) => {
        const index = state.quotes.findIndex(q => q.id === action.payload.id);
        if (index !== -1) state.quotes[index] = action.payload;
        if (state.currentQuote?.id === action.payload.id) {
          state.currentQuote = action.payload;
        }
      })
      // Actividades
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload);
      })
      .addCase(completeActivity.fulfilled, (state, action) => {
        const index = state.activities.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.activities[index] = action.payload;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.activities = state.activities.filter(a => a.id !== action.payload);
      })
      // Estadísticas
      .addCase(fetchCrmStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentClient,
  clearCurrentOpportunity,
  clearCurrentQuote,
} = crmSlice.actions;

export default crmSlice.reducer;
