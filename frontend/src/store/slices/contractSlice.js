import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== DASHBOARD ==========

export const fetchContractDashboard = createAsyncThunk(
  'contracts/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contracts/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== CONTRACT CRUD ==========

export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/contracts?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchContractById = createAsyncThunk(
  'contracts/fetchContractById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contracts/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createContract = createAsyncThunk(
  'contracts/createContract',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/contracts', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateContract = createAsyncThunk(
  'contracts/updateContract',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contracts/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteContract = createAsyncThunk(
  'contracts/deleteContract',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contracts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== WORKFLOW ==========

export const activateContract = createAsyncThunk(
  'contracts/activateContract',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contracts/${id}/activate`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const terminateContract = createAsyncThunk(
  'contracts/terminateContract',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contracts/${id}/terminate`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== PARTIES ==========

export const fetchContractParties = createAsyncThunk(
  'contracts/fetchParties',
  async (contractId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contracts/${contractId}/parties`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addContractParty = createAsyncThunk(
  'contracts/addParty',
  async ({ contractId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contracts/${contractId}/parties`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateContractParty = createAsyncThunk(
  'contracts/updateParty',
  async ({ contractId, partyId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contracts/${contractId}/parties/${partyId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteContractParty = createAsyncThunk(
  'contracts/deleteParty',
  async ({ contractId, partyId }, { rejectWithValue }) => {
    try {
      await api.delete(`/contracts/${contractId}/parties/${partyId}`);
      return partyId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== WORKING INTERESTS ==========

export const fetchWorkingInterests = createAsyncThunk(
  'contracts/fetchWorkingInterests',
  async ({ contractId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/contracts/${contractId}/working-interests?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addWorkingInterest = createAsyncThunk(
  'contracts/addWorkingInterest',
  async ({ contractId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contracts/${contractId}/working-interests`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateWorkingInterest = createAsyncThunk(
  'contracts/updateWorkingInterest',
  async ({ contractId, wiId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contracts/${contractId}/working-interests/${wiId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== ROYALTIES ==========

export const fetchRoyalties = createAsyncThunk(
  'contracts/fetchRoyalties',
  async ({ contractId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/contracts/${contractId}/royalties?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const calculateRoyalty = createAsyncThunk(
  'contracts/calculateRoyalty',
  async ({ contractId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contracts/${contractId}/royalties/calculate`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const payRoyalty = createAsyncThunk(
  'contracts/payRoyalty',
  async ({ contractId, royaltyId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contracts/${contractId}/royalties/${royaltyId}/pay`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== CONCESSIONS ==========

export const fetchConcessions = createAsyncThunk(
  'contracts/fetchConcessions',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/contracts/concessions/list?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchConcessionById = createAsyncThunk(
  'contracts/fetchConcessionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contracts/concessions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createConcession = createAsyncThunk(
  'contracts/createConcession',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/contracts/concessions', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateConcession = createAsyncThunk(
  'contracts/updateConcession',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contracts/concessions/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteConcession = createAsyncThunk(
  'contracts/deleteConcession',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contracts/concessions/${id}`);
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
  dashboardLoading: false,
  // Contract List
  contracts: [],
  contractsPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  // Current Contract
  currentContract: null,
  // Parties
  parties: [],
  // Working Interests
  workingInterests: [],
  // Royalties
  royalties: [],
  royaltiesPagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
  // Concessions
  concessions: [],
  concessionsPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  currentConcession: null,
  // Loading states
  loading: false,
  partiesLoading: false,
  royaltiesLoading: false,
  concessionsLoading: false,
  // Error
  error: null,
};

const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    clearCurrentContract: (state) => {
      state.currentContract = null;
      state.parties = [];
      state.workingInterests = [];
      state.royalties = [];
    },
    clearCurrentConcession: (state) => {
      state.currentConcession = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchContractDashboard.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(fetchContractDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchContractDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload?.message || 'Error loading dashboard';
      })
      // Fetch Contracts
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload.data;
        state.contractsPagination = action.payload.pagination;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading contracts';
      })
      // Fetch Contract by ID
      .addCase(fetchContractById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContract = action.payload;
      })
      .addCase(fetchContractById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading contract';
      })
      // Create Contract
      .addCase(createContract.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts.unshift(action.payload);
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error creating contract';
      })
      // Update Contract
      .addCase(updateContract.fulfilled, (state, action) => {
        state.currentContract = action.payload;
        const index = state.contracts.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      })
      // Delete Contract
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.contracts = state.contracts.filter((c) => c.id !== action.payload);
      })
      // Activate Contract
      .addCase(activateContract.fulfilled, (state, action) => {
        state.currentContract = action.payload;
        const index = state.contracts.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      })
      // Terminate Contract
      .addCase(terminateContract.fulfilled, (state, action) => {
        state.currentContract = action.payload;
        const index = state.contracts.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      })
      // Fetch Parties
      .addCase(fetchContractParties.pending, (state) => {
        state.partiesLoading = true;
      })
      .addCase(fetchContractParties.fulfilled, (state, action) => {
        state.partiesLoading = false;
        state.parties = action.payload;
      })
      .addCase(fetchContractParties.rejected, (state, action) => {
        state.partiesLoading = false;
        state.error = action.payload?.message || 'Error loading parties';
      })
      // Add Party
      .addCase(addContractParty.fulfilled, (state, action) => {
        state.parties.push(action.payload);
      })
      // Update Party
      .addCase(updateContractParty.fulfilled, (state, action) => {
        const index = state.parties.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.parties[index] = action.payload;
        }
      })
      // Delete Party
      .addCase(deleteContractParty.fulfilled, (state, action) => {
        state.parties = state.parties.filter((p) => p.id !== action.payload);
      })
      // Fetch Working Interests
      .addCase(fetchWorkingInterests.fulfilled, (state, action) => {
        state.workingInterests = action.payload;
      })
      // Add Working Interest
      .addCase(addWorkingInterest.fulfilled, (state, action) => {
        state.workingInterests.push(action.payload);
      })
      // Update Working Interest
      .addCase(updateWorkingInterest.fulfilled, (state, action) => {
        const index = state.workingInterests.findIndex((wi) => wi.id === action.payload.id);
        if (index !== -1) {
          state.workingInterests[index] = action.payload;
        }
      })
      // Fetch Royalties
      .addCase(fetchRoyalties.pending, (state) => {
        state.royaltiesLoading = true;
      })
      .addCase(fetchRoyalties.fulfilled, (state, action) => {
        state.royaltiesLoading = false;
        state.royalties = action.payload.data;
        state.royaltiesPagination = action.payload.pagination;
      })
      .addCase(fetchRoyalties.rejected, (state, action) => {
        state.royaltiesLoading = false;
        state.error = action.payload?.message || 'Error loading royalties';
      })
      // Calculate Royalty
      .addCase(calculateRoyalty.fulfilled, (state, action) => {
        const index = state.royalties.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.royalties[index] = action.payload;
        } else {
          state.royalties.unshift(action.payload);
        }
      })
      // Pay Royalty
      .addCase(payRoyalty.fulfilled, (state, action) => {
        const index = state.royalties.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.royalties[index] = action.payload;
        }
      })
      // Fetch Concessions
      .addCase(fetchConcessions.pending, (state) => {
        state.concessionsLoading = true;
      })
      .addCase(fetchConcessions.fulfilled, (state, action) => {
        state.concessionsLoading = false;
        state.concessions = action.payload.data;
        state.concessionsPagination = action.payload.pagination;
      })
      .addCase(fetchConcessions.rejected, (state, action) => {
        state.concessionsLoading = false;
        state.error = action.payload?.message || 'Error loading concessions';
      })
      // Fetch Concession by ID
      .addCase(fetchConcessionById.pending, (state) => {
        state.concessionsLoading = true;
      })
      .addCase(fetchConcessionById.fulfilled, (state, action) => {
        state.concessionsLoading = false;
        state.currentConcession = action.payload;
      })
      .addCase(fetchConcessionById.rejected, (state, action) => {
        state.concessionsLoading = false;
        state.error = action.payload?.message || 'Error loading concession';
      })
      // Create Concession
      .addCase(createConcession.fulfilled, (state, action) => {
        state.concessions.unshift(action.payload);
      })
      // Update Concession
      .addCase(updateConcession.fulfilled, (state, action) => {
        state.currentConcession = action.payload;
        const index = state.concessions.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.concessions[index] = action.payload;
        }
      })
      // Delete Concession
      .addCase(deleteConcession.fulfilled, (state, action) => {
        state.concessions = state.concessions.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearCurrentContract, clearCurrentConcession, clearError } = contractSlice.actions;
export default contractSlice.reducer;
