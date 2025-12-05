import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ==================== ASYNC THUNKS ====================

// Contratistas CRUD
export const fetchContractors = createAsyncThunk(
  'contractors/fetchContractors',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/contractors', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar contratistas');
    }
  }
);

export const fetchContractorById = createAsyncThunk(
  'contractors/fetchContractorById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contractors/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar contratista');
    }
  }
);

export const fetchContractorFull = createAsyncThunk(
  'contractors/fetchContractorFull',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contractors/${id}/full`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar contratista');
    }
  }
);

export const createContractor = createAsyncThunk(
  'contractors/createContractor',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/contractors', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear contratista');
    }
  }
);

export const updateContractor = createAsyncThunk(
  'contractors/updateContractor',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contractors/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar contratista');
    }
  }
);

export const deleteContractor = createAsyncThunk(
  'contractors/deleteContractor',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contractors/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar contratista');
    }
  }
);

// Estadísticas
export const fetchContractorStats = createAsyncThunk(
  'contractors/fetchContractorStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contractors/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

// Catálogos
export const fetchSpecialties = createAsyncThunk(
  'contractors/fetchSpecialties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contractors/specialties');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar especialidades');
    }
  }
);

// Cuentas Bancarias
export const fetchBankAccounts = createAsyncThunk(
  'contractors/fetchBankAccounts',
  async (contractorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contractors/${contractorId}/bank-accounts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cuentas bancarias');
    }
  }
);

export const createBankAccount = createAsyncThunk(
  'contractors/createBankAccount',
  async ({ contractorId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contractors/${contractorId}/bank-accounts`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear cuenta bancaria');
    }
  }
);

// Documentos
export const fetchDocuments = createAsyncThunk(
  'contractors/fetchDocuments',
  async (contractorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contractors/${contractorId}/documents`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar documentos');
    }
  }
);

export const createDocument = createAsyncThunk(
  'contractors/createDocument',
  async ({ contractorId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contractors/${contractorId}/documents`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear documento');
    }
  }
);

// Facturas
export const fetchInvoices = createAsyncThunk(
  'contractors/fetchInvoices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/contractors/invoices/all', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar facturas');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'contractors/createInvoice',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/contractors/invoices', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear factura');
    }
  }
);

export const approveInvoice = createAsyncThunk(
  'contractors/approveInvoice',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contractors/invoices/${invoiceId}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar factura');
    }
  }
);

// Pagos
export const fetchPayments = createAsyncThunk(
  'contractors/fetchPayments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/contractors/payments/all', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar pagos');
    }
  }
);

export const createPayment = createAsyncThunk(
  'contractors/createPayment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/contractors/payments', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear pago');
    }
  }
);

export const approvePayment = createAsyncThunk(
  'contractors/approvePayment',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contractors/payments/${paymentId}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar pago');
    }
  }
);

export const processPayment = createAsyncThunk(
  'contractors/processPayment',
  async ({ paymentId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contractors/payments/${paymentId}/process`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al procesar pago');
    }
  }
);

// Órdenes de Compra
export const fetchPurchaseOrders = createAsyncThunk(
  'contractors/fetchPurchaseOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/contractors/purchase-orders/all', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar órdenes');
    }
  }
);

export const createPurchaseOrder = createAsyncThunk(
  'contractors/createPurchaseOrder',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/contractors/purchase-orders', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear orden');
    }
  }
);

// ==================== SLICE ====================

const initialState = {
  // Contratistas
  contractors: [],
  contractorsPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  currentContractor: null,
  
  // Cuentas bancarias
  bankAccounts: [],
  
  // Documentos
  documents: [],
  
  // Facturas
  invoices: [],
  invoicesPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  
  // Pagos
  payments: [],
  paymentsPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  
  // Órdenes de compra
  purchaseOrders: [],
  purchaseOrdersPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  
  // Catálogos
  specialties: [],
  
  // Estadísticas
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    totalPaid: 0,
    totalPending: 0,
  },
  
  // Estado
  loading: false,
  error: null,
};

const contractorSlice = createSlice({
  name: 'contractors',
  initialState,
  reducers: {
    clearCurrentContractor: (state) => {
      state.currentContractor = null;
      state.bankAccounts = [];
      state.documents = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contractors
      .addCase(fetchContractors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.loading = false;
        state.contractors = action.payload.data;
        state.contractorsPagination = action.payload.pagination || state.contractorsPagination;
      })
      .addCase(fetchContractors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Contractor by ID
      .addCase(fetchContractorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContractorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContractor = action.payload.data;
      })
      .addCase(fetchContractorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Contractor Full
      .addCase(fetchContractorFull.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContractorFull.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContractor = action.payload.data;
        state.bankAccounts = action.payload.data?.bankAccounts || [];
        state.documents = action.payload.data?.documents || [];
      })
      .addCase(fetchContractorFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Contractor
      .addCase(createContractor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContractor.fulfilled, (state, action) => {
        state.loading = false;
        state.contractors.unshift(action.payload.data);
      })
      .addCase(createContractor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Contractor
      .addCase(updateContractor.fulfilled, (state, action) => {
        const index = state.contractors.findIndex(c => c.id === action.payload.data.id);
        if (index !== -1) {
          state.contractors[index] = action.payload.data;
        }
        if (state.currentContractor?.id === action.payload.data.id) {
          state.currentContractor = { ...state.currentContractor, ...action.payload.data };
        }
      })
      
      // Delete Contractor
      .addCase(deleteContractor.fulfilled, (state, action) => {
        state.contractors = state.contractors.filter(c => c.id !== action.payload);
      })
      
      // Stats
      .addCase(fetchContractorStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      })
      
      // Specialties
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.specialties = action.payload.data;
      })
      
      // Bank Accounts
      .addCase(fetchBankAccounts.fulfilled, (state, action) => {
        state.bankAccounts = action.payload.data;
      })
      .addCase(createBankAccount.fulfilled, (state, action) => {
        state.bankAccounts.push(action.payload.data);
      })
      
      // Documents
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.documents = action.payload.data;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload.data);
      })
      
      // Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
        state.invoicesPagination = action.payload.pagination || state.invoicesPagination;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload.data);
      })
      
      // Payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data;
        state.paymentsPagination = action.payload.pagination || state.paymentsPagination;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload.data);
      })
      
      // Purchase Orders
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = action.payload.data;
        state.purchaseOrdersPagination = action.payload.pagination || state.purchaseOrdersPagination;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.purchaseOrders.unshift(action.payload.data);
      });
  },
});

export const { clearCurrentContractor, clearError } = contractorSlice.actions;
export default contractorSlice.reducer;
