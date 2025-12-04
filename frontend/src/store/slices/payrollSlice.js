import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ==================== ASYNC THUNKS ====================

// Periods
export const fetchPeriods = createAsyncThunk(
  'payroll/fetchPeriods',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/payroll/periods', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar períodos');
    }
  }
);

export const fetchPeriodById = createAsyncThunk(
  'payroll/fetchPeriodById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payroll/periods/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar período');
    }
  }
);

export const fetchPeriodFull = createAsyncThunk(
  'payroll/fetchPeriodFull',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payroll/periods/${id}/full`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar período');
    }
  }
);

export const createPeriod = createAsyncThunk(
  'payroll/createPeriod',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/payroll/periods', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear período');
    }
  }
);

export const updatePeriod = createAsyncThunk(
  'payroll/updatePeriod',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/payroll/periods/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar período');
    }
  }
);

export const deletePeriod = createAsyncThunk(
  'payroll/deletePeriod',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/payroll/periods/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar período');
    }
  }
);

export const generateEntries = createAsyncThunk(
  'payroll/generateEntries',
  async ({ periodId, employeeIds }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/payroll/periods/${periodId}/generate`, { employeeIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al generar entradas');
    }
  }
);

export const approvePeriod = createAsyncThunk(
  'payroll/approvePeriod',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/payroll/periods/${id}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar período');
    }
  }
);

export const markPeriodAsPaid = createAsyncThunk(
  'payroll/markPeriodAsPaid',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/payroll/periods/${id}/pay`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al marcar como pagado');
    }
  }
);

// Entries
export const updateEntry = createAsyncThunk(
  'payroll/updateEntry',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/payroll/entries/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar entrada');
    }
  }
);

// Loans
export const fetchLoans = createAsyncThunk(
  'payroll/fetchLoans',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/payroll/loans', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar préstamos');
    }
  }
);

export const fetchLoanById = createAsyncThunk(
  'payroll/fetchLoanById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payroll/loans/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar préstamo');
    }
  }
);

export const createLoan = createAsyncThunk(
  'payroll/createLoan',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/payroll/loans', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear préstamo');
    }
  }
);

export const approveLoan = createAsyncThunk(
  'payroll/approveLoan',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/payroll/loans/${id}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar préstamo');
    }
  }
);

export const cancelLoan = createAsyncThunk(
  'payroll/cancelLoan',
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/payroll/loans/${id}/cancel`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cancelar préstamo');
    }
  }
);

// Stats
export const fetchPayrollStats = createAsyncThunk(
  'payroll/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payroll/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

// ==================== SLICE ====================

const initialState = {
  // Periods
  periods: [],
  currentPeriod: null,
  periodsPagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  // Loans
  loans: [],
  currentLoan: null,
  loansPagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  // Stats
  stats: {
    yearlyTotal: 0,
    pendingPeriods: 0,
    activeLoans: 0,
    totalLoanAmount: 0,
  },
  // UI State
  loading: false,
  error: null,
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPeriod: (state) => {
      state.currentPeriod = null;
    },
    clearCurrentLoan: (state) => {
      state.currentLoan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Periods
      .addCase(fetchPeriods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeriods.fulfilled, (state, action) => {
        state.loading = false;
        state.periods = action.payload.data;
        state.periodsPagination = action.payload.pagination;
      })
      .addCase(fetchPeriods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Period By Id
      .addCase(fetchPeriodById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPeriodById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPeriod = action.payload;
      })
      .addCase(fetchPeriodById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Period Full
      .addCase(fetchPeriodFull.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeriodFull.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPeriod = action.payload;
      })
      .addCase(fetchPeriodFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Period
      .addCase(createPeriod.fulfilled, (state, action) => {
        state.periods.unshift(action.payload);
      })
      // Update Period
      .addCase(updatePeriod.fulfilled, (state, action) => {
        const index = state.periods.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.periods[index] = action.payload;
        }
        if (state.currentPeriod?.id === action.payload.id) {
          state.currentPeriod = action.payload;
        }
      })
      // Delete Period
      .addCase(deletePeriod.fulfilled, (state, action) => {
        state.periods = state.periods.filter(p => p.id !== action.payload);
      })
      // Generate Entries
      .addCase(generateEntries.fulfilled, (state, action) => {
        if (state.currentPeriod) {
          state.currentPeriod.entries = action.payload.data;
        }
      })
      // Approve Period
      .addCase(approvePeriod.fulfilled, (state, action) => {
        const index = state.periods.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.periods[index] = action.payload;
        }
        if (state.currentPeriod?.id === action.payload.id) {
          state.currentPeriod = { ...state.currentPeriod, ...action.payload };
        }
      })
      // Mark as Paid
      .addCase(markPeriodAsPaid.fulfilled, (state, action) => {
        const index = state.periods.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.periods[index] = action.payload;
        }
        if (state.currentPeriod?.id === action.payload.id) {
          state.currentPeriod = { ...state.currentPeriod, ...action.payload };
        }
      })
      // Update Entry
      .addCase(updateEntry.fulfilled, (state, action) => {
        if (state.currentPeriod?.entries) {
          const index = state.currentPeriod.entries.findIndex(e => e.id === action.payload.id);
          if (index !== -1) {
            state.currentPeriod.entries[index] = action.payload;
          }
        }
      })
      // Fetch Loans
      .addCase(fetchLoans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload.data;
        state.loansPagination = action.payload.pagination;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Loan By Id
      .addCase(fetchLoanById.fulfilled, (state, action) => {
        state.currentLoan = action.payload;
      })
      // Create Loan
      .addCase(createLoan.fulfilled, (state, action) => {
        state.loans.unshift(action.payload);
      })
      // Approve Loan
      .addCase(approveLoan.fulfilled, (state, action) => {
        const index = state.loans.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
      })
      // Cancel Loan
      .addCase(cancelLoan.fulfilled, (state, action) => {
        const index = state.loans.findIndex(l => l.id === action.payload);
        if (index !== -1) {
          state.loans[index].status = 'CANCELLED';
        }
      })
      // Fetch Stats
      .addCase(fetchPayrollStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError, clearCurrentPeriod, clearCurrentLoan } = payrollSlice.actions;
export default payrollSlice.reducer;
