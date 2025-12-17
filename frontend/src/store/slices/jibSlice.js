import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== DASHBOARD ==========

export const fetchJIBDashboard = createAsyncThunk(
  'jib/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/jib/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== JIB BILLINGS ==========

export const fetchJIBs = createAsyncThunk(
  'jib/fetchJIBs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/jib/billings?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchJIBById = createAsyncThunk(
  'jib/fetchJIBById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jib/billings/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createJIB = createAsyncThunk(
  'jib/createJIB',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/jib/billings', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateJIB = createAsyncThunk(
  'jib/updateJIB',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jib/billings/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteJIB = createAsyncThunk(
  'jib/deleteJIB',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/jib/billings/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const sendJIB = createAsyncThunk(
  'jib/sendJIB',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jib/billings/${id}/send`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== JIB LINE ITEMS ==========

export const addJIBLineItem = createAsyncThunk(
  'jib/addLineItem',
  async ({ jibId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jib/billings/${jibId}/items`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateJIBLineItem = createAsyncThunk(
  'jib/updateLineItem',
  async ({ jibId, itemId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jib/billings/${jibId}/items/${itemId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteJIBLineItem = createAsyncThunk(
  'jib/deleteLineItem',
  async ({ jibId, itemId }, { rejectWithValue }) => {
    try {
      await api.delete(`/jib/billings/${jibId}/items/${itemId}`);
      return { jibId, itemId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== JIB PARTNER SHARES ==========

export const updatePartnerShare = createAsyncThunk(
  'jib/updatePartnerShare',
  async ({ jibId, shareId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jib/billings/${jibId}/shares/${shareId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const recordPartnerPayment = createAsyncThunk(
  'jib/recordPartnerPayment',
  async ({ jibId, shareId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jib/billings/${jibId}/shares/${shareId}/payment`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const disputePartnerShare = createAsyncThunk(
  'jib/disputePartnerShare',
  async ({ jibId, shareId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jib/billings/${jibId}/shares/${shareId}/dispute`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== CASH CALLS ==========

export const fetchCashCalls = createAsyncThunk(
  'jib/fetchCashCalls',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/jib/cash-calls?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchCashCallById = createAsyncThunk(
  'jib/fetchCashCallById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jib/cash-calls/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createCashCall = createAsyncThunk(
  'jib/createCashCall',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/jib/cash-calls', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateCashCall = createAsyncThunk(
  'jib/updateCashCall',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jib/cash-calls/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteCashCall = createAsyncThunk(
  'jib/deleteCashCall',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/jib/cash-calls/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const sendCashCall = createAsyncThunk(
  'jib/sendCashCall',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jib/cash-calls/${id}/send`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const recordCashCallFunding = createAsyncThunk(
  'jib/recordCashCallFunding',
  async ({ cashCallId, responseId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jib/cash-calls/${cashCallId}/responses/${responseId}/fund`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const markPartnerDefault = createAsyncThunk(
  'jib/markPartnerDefault',
  async ({ cashCallId, responseId, penaltyAmount }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jib/cash-calls/${cashCallId}/responses/${responseId}/default`, { penalty_amount: penaltyAmount });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== PARTNER STATEMENT ==========

export const fetchPartnerStatement = createAsyncThunk(
  'jib/fetchPartnerStatement',
  async ({ partyId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value);
        }
      });
      const response = await api.get(`/jib/partner-statement/${partyId}?${params}`);
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
  // JIBs
  jibs: [],
  jibsPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  currentJIB: null,
  jibsLoading: false,
  // Cash Calls
  cashCalls: [],
  cashCallsPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  currentCashCall: null,
  cashCallsLoading: false,
  // Partner Statement
  partnerStatement: null,
  partnerStatementLoading: false,
  // General
  loading: false,
  error: null,
};

const jibSlice = createSlice({
  name: 'jib',
  initialState,
  reducers: {
    clearCurrentJIB: (state) => {
      state.currentJIB = null;
    },
    clearCurrentCashCall: (state) => {
      state.currentCashCall = null;
    },
    clearPartnerStatement: (state) => {
      state.partnerStatement = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchJIBDashboard.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(fetchJIBDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchJIBDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload?.message || 'Error loading dashboard';
      })
      // JIBs
      .addCase(fetchJIBs.pending, (state) => {
        state.jibsLoading = true;
      })
      .addCase(fetchJIBs.fulfilled, (state, action) => {
        state.jibsLoading = false;
        state.jibs = action.payload.data;
        state.jibsPagination = action.payload.pagination;
      })
      .addCase(fetchJIBs.rejected, (state, action) => {
        state.jibsLoading = false;
        state.error = action.payload?.message || 'Error loading JIBs';
      })
      .addCase(fetchJIBById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJIBById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJIB = action.payload;
      })
      .addCase(fetchJIBById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading JIB';
      })
      .addCase(createJIB.fulfilled, (state, action) => {
        state.jibs.unshift(action.payload);
      })
      .addCase(updateJIB.fulfilled, (state, action) => {
        state.currentJIB = action.payload;
        const index = state.jibs.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) state.jibs[index] = action.payload;
      })
      .addCase(deleteJIB.fulfilled, (state, action) => {
        state.jibs = state.jibs.filter((j) => j.id !== action.payload);
      })
      .addCase(sendJIB.fulfilled, (state, action) => {
        state.currentJIB = action.payload;
        const index = state.jibs.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) state.jibs[index] = action.payload;
      })
      // Line Items
      .addCase(addJIBLineItem.fulfilled, (state, action) => {
        if (state.currentJIB && state.currentJIB.lineItems) {
          state.currentJIB.lineItems.push(action.payload);
        }
      })
      .addCase(deleteJIBLineItem.fulfilled, (state, action) => {
        if (state.currentJIB && state.currentJIB.lineItems) {
          state.currentJIB.lineItems = state.currentJIB.lineItems.filter(
            (item) => item.id !== action.payload.itemId
          );
        }
      })
      // Partner Shares
      .addCase(recordPartnerPayment.fulfilled, (state, action) => {
        if (state.currentJIB && state.currentJIB.partnerShares) {
          const index = state.currentJIB.partnerShares.findIndex(
            (s) => s.id === action.payload.id
          );
          if (index !== -1) state.currentJIB.partnerShares[index] = action.payload;
        }
      })
      .addCase(disputePartnerShare.fulfilled, (state, action) => {
        if (state.currentJIB && state.currentJIB.partnerShares) {
          const index = state.currentJIB.partnerShares.findIndex(
            (s) => s.id === action.payload.id
          );
          if (index !== -1) state.currentJIB.partnerShares[index] = action.payload;
        }
      })
      // Cash Calls
      .addCase(fetchCashCalls.pending, (state) => {
        state.cashCallsLoading = true;
      })
      .addCase(fetchCashCalls.fulfilled, (state, action) => {
        state.cashCallsLoading = false;
        state.cashCalls = action.payload.data;
        state.cashCallsPagination = action.payload.pagination;
      })
      .addCase(fetchCashCalls.rejected, (state, action) => {
        state.cashCallsLoading = false;
        state.error = action.payload?.message || 'Error loading Cash Calls';
      })
      .addCase(fetchCashCallById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCashCallById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCashCall = action.payload;
      })
      .addCase(fetchCashCallById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error loading Cash Call';
      })
      .addCase(createCashCall.fulfilled, (state, action) => {
        state.cashCalls.unshift(action.payload);
      })
      .addCase(updateCashCall.fulfilled, (state, action) => {
        state.currentCashCall = action.payload;
        const index = state.cashCalls.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.cashCalls[index] = action.payload;
      })
      .addCase(deleteCashCall.fulfilled, (state, action) => {
        state.cashCalls = state.cashCalls.filter((c) => c.id !== action.payload);
      })
      .addCase(sendCashCall.fulfilled, (state, action) => {
        state.currentCashCall = action.payload;
        const index = state.cashCalls.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.cashCalls[index] = action.payload;
      })
      .addCase(recordCashCallFunding.fulfilled, (state, action) => {
        if (state.currentCashCall && state.currentCashCall.responses) {
          const index = state.currentCashCall.responses.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) state.currentCashCall.responses[index] = action.payload;
        }
      })
      .addCase(markPartnerDefault.fulfilled, (state, action) => {
        if (state.currentCashCall && state.currentCashCall.responses) {
          const index = state.currentCashCall.responses.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) state.currentCashCall.responses[index] = action.payload;
        }
      })
      // Partner Statement
      .addCase(fetchPartnerStatement.pending, (state) => {
        state.partnerStatementLoading = true;
      })
      .addCase(fetchPartnerStatement.fulfilled, (state, action) => {
        state.partnerStatementLoading = false;
        state.partnerStatement = action.payload;
      })
      .addCase(fetchPartnerStatement.rejected, (state, action) => {
        state.partnerStatementLoading = false;
        state.error = action.payload?.message || 'Error loading partner statement';
      });
  },
});

export const {
  clearCurrentJIB,
  clearCurrentCashCall,
  clearPartnerStatement,
  clearError,
} = jibSlice.actions;

export default jibSlice.reducer;
