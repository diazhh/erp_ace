import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ==================== ASYNC THUNKS ====================

// Bank Accounts
export const fetchAccounts = createAsyncThunk(
  'finance/fetchAccounts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/finance/accounts', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cuentas');
    }
  }
);

export const fetchAccountById = createAsyncThunk(
  'finance/fetchAccountById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/finance/accounts/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cuenta');
    }
  }
);

export const fetchAccountFull = createAsyncThunk(
  'finance/fetchAccountFull',
  async ({ id, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/finance/accounts/${id}/full`, { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cuenta');
    }
  }
);

export const createAccount = createAsyncThunk(
  'finance/createAccount',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/finance/accounts', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear cuenta');
    }
  }
);

export const updateAccount = createAsyncThunk(
  'finance/updateAccount',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/finance/accounts/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar cuenta');
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'finance/deleteAccount',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/finance/accounts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar cuenta');
    }
  }
);

// Transactions
export const fetchTransactions = createAsyncThunk(
  'finance/fetchTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/finance/transactions', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar transacciones');
    }
  }
);

export const fetchTransactionById = createAsyncThunk(
  'finance/fetchTransactionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/finance/transactions/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar transacción');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'finance/createTransaction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/finance/transactions', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear transacción');
    }
  }
);

export const createTransfer = createAsyncThunk(
  'finance/createTransfer',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/finance/transfers', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear transferencia');
    }
  }
);

export const cancelTransaction = createAsyncThunk(
  'finance/cancelTransaction',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/finance/transactions/${id}/cancel`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cancelar transacción');
    }
  }
);

export const reconcileTransaction = createAsyncThunk(
  'finance/reconcileTransaction',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/finance/transactions/${id}/reconcile`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al conciliar transacción');
    }
  }
);

// Exchange Rates
export const fetchExchangeRates = createAsyncThunk(
  'finance/fetchExchangeRates',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/finance/exchange-rates', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar tasas');
    }
  }
);

export const createExchangeRate = createAsyncThunk(
  'finance/createExchangeRate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/finance/exchange-rates', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear tasa');
    }
  }
);

export const fetchCurrentRate = createAsyncThunk(
  'finance/fetchCurrentRate',
  async ({ from = 'USD', to = 'VES' }, { rejectWithValue }) => {
    try {
      const response = await api.get('/finance/exchange-rates/current', { params: { from, to } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener tasa actual');
    }
  }
);

// Statistics
export const fetchFinanceStats = createAsyncThunk(
  'finance/fetchStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/finance/stats', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const fetchCashFlow = createAsyncThunk(
  'finance/fetchCashFlow',
  async (year, { rejectWithValue }) => {
    try {
      const response = await api.get('/finance/cash-flow', { params: { year } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar flujo de caja');
    }
  }
);

// Categories
export const fetchCategories = createAsyncThunk(
  'finance/fetchCategories',
  async (type, { rejectWithValue }) => {
    try {
      const response = await api.get('/finance/categories', { params: { type } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar categorías');
    }
  }
);

// ==================== SLICE ====================

const initialState = {
  // Accounts
  accounts: [],
  currentAccount: null,
  // Transactions
  transactions: [],
  transactionsPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  currentTransaction: null,
  // Exchange Rates
  exchangeRates: [],
  currentRate: null,
  // Categories
  categories: [],
  // Statistics
  stats: {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    pendingReconciliation: 0,
    accountBalances: [],
    totalByAccount: {},
    expensesByCategory: [],
  },
  cashFlow: [],
  // UI State
  loading: false,
  error: null,
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    clearCurrentAccount: (state) => {
      state.currentAccount = null;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.data;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.currentAccount = action.payload;
      })
      .addCase(fetchAccountFull.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountFull.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccount = action.payload;
      })
      .addCase(fetchAccountFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(a => a.id !== action.payload);
      })
      // Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.transactionsPagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.currentTransaction = action.payload;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(cancelTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(reconcileTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      // Exchange Rates
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.exchangeRates = action.payload.data;
      })
      .addCase(createExchangeRate.fulfilled, (state, action) => {
        state.exchangeRates.unshift(action.payload);
      })
      .addCase(fetchCurrentRate.fulfilled, (state, action) => {
        state.currentRate = action.payload;
      })
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Statistics
      .addCase(fetchFinanceStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchCashFlow.fulfilled, (state, action) => {
        state.cashFlow = action.payload;
      });
  },
});

export const { clearCurrentAccount, clearCurrentTransaction, clearError } = financeSlice.actions;
export default financeSlice.reducer;
