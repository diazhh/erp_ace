import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchExpenseReports = createAsyncThunk(
  'expenseReports/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/expense-reports', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchExpenseReportById = createAsyncThunk(
  'expenseReports/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/expense-reports/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createExpenseReport = createAsyncThunk(
  'expenseReports/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/expense-reports', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateExpenseReport = createAsyncThunk(
  'expenseReports/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/expense-reports/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const submitExpenseReport = createAsyncThunk(
  'expenseReports/submit',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/expense-reports/${id}/submit`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approveExpenseReport = createAsyncThunk(
  'expenseReports/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/expense-reports/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const rejectExpenseReport = createAsyncThunk(
  'expenseReports/reject',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/expense-reports/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addExpenseReportItem = createAsyncThunk(
  'expenseReports/addItem',
  async ({ reportId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/expense-reports/${reportId}/items`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const removeExpenseReportItem = createAsyncThunk(
  'expenseReports/removeItem',
  async ({ reportId, itemId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/expense-reports/${reportId}/items/${itemId}`);
      return { ...response.data, itemId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchExpenseReportStats = createAsyncThunk(
  'expenseReports/fetchStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/expense-reports/stats', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchExpenseReportCatalogs = createAsyncThunk(
  'expenseReports/fetchCatalogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/expense-reports/catalogs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  reports: [],
  currentReport: null,
  stats: null,
  catalogs: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  loading: false,
  error: null,
  success: null,
};

const expenseReportSlice = createSlice({
  name: 'expenseReports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchExpenseReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExpenseReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar reportes';
      })
      // Fetch by ID
      .addCase(fetchExpenseReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload.data;
      })
      .addCase(fetchExpenseReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar reporte';
      })
      // Create
      .addCase(createExpenseReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpenseReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload.data;
        state.success = 'Reporte creado exitosamente';
      })
      .addCase(createExpenseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al crear reporte';
      })
      // Update
      .addCase(updateExpenseReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpenseReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload.data;
        state.success = 'Reporte actualizado';
      })
      .addCase(updateExpenseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al actualizar reporte';
      })
      // Submit
      .addCase(submitExpenseReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExpenseReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload.data;
        state.success = 'Reporte enviado para aprobación';
      })
      .addCase(submitExpenseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al enviar reporte';
      })
      // Approve
      .addCase(approveExpenseReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveExpenseReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload.data;
        state.success = 'Reporte aprobado';
      })
      .addCase(approveExpenseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al aprobar reporte';
      })
      // Reject
      .addCase(rejectExpenseReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectExpenseReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload.data;
        state.success = 'Reporte rechazado';
      })
      .addCase(rejectExpenseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al rechazar reporte';
      })
      // Add item
      .addCase(addExpenseReportItem.fulfilled, (state, action) => {
        state.success = 'Item agregado';
      })
      // Remove item
      .addCase(removeExpenseReportItem.fulfilled, (state, action) => {
        state.success = 'Item eliminado';
      })
      // Stats
      .addCase(fetchExpenseReportStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      })
      // Catalogs
      .addCase(fetchExpenseReportCatalogs.fulfilled, (state, action) => {
        state.catalogs = action.payload.data;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentReport } = expenseReportSlice.actions;
export default expenseReportSlice.reducer;
