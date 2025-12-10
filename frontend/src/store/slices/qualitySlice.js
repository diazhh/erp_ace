import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== PLANES DE CALIDAD ==========

export const fetchPlans = createAsyncThunk(
  'quality/fetchPlans',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/quality/plans?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPlanById = createAsyncThunk(
  'quality/fetchPlanById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/quality/plans/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createPlan = createAsyncThunk(
  'quality/createPlan',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/quality/plans', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updatePlan = createAsyncThunk(
  'quality/updatePlan',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/quality/plans/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const approvePlan = createAsyncThunk(
  'quality/approvePlan',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/quality/plans/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deletePlan = createAsyncThunk(
  'quality/deletePlan',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quality/plans/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== INSPECCIONES ==========

export const fetchInspections = createAsyncThunk(
  'quality/fetchInspections',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/quality/inspections?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchInspectionById = createAsyncThunk(
  'quality/fetchInspectionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/quality/inspections/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createInspection = createAsyncThunk(
  'quality/createInspection',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/quality/inspections', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateInspection = createAsyncThunk(
  'quality/updateInspection',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/quality/inspections/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteInspection = createAsyncThunk(
  'quality/deleteInspection',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quality/inspections/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== NO CONFORMIDADES ==========

export const fetchNonConformances = createAsyncThunk(
  'quality/fetchNonConformances',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/quality/non-conformances?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchNonConformanceById = createAsyncThunk(
  'quality/fetchNonConformanceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/quality/non-conformances/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createNonConformance = createAsyncThunk(
  'quality/createNonConformance',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/quality/non-conformances', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateNonConformance = createAsyncThunk(
  'quality/updateNonConformance',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/quality/non-conformances/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const closeNonConformance = createAsyncThunk(
  'quality/closeNonConformance',
  async ({ id, verificationNotes }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/quality/non-conformances/${id}/close`, { verificationNotes });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteNonConformance = createAsyncThunk(
  'quality/deleteNonConformance',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quality/non-conformances/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== ACCIONES CORRECTIVAS ==========

export const fetchCorrectiveActions = createAsyncThunk(
  'quality/fetchCorrectiveActions',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/quality/corrective-actions?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createCorrectiveAction = createAsyncThunk(
  'quality/createCorrectiveAction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/quality/corrective-actions', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const completeCorrectiveAction = createAsyncThunk(
  'quality/completeCorrectiveAction',
  async ({ id, results }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/quality/corrective-actions/${id}/complete`, { results });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const verifyCorrectiveAction = createAsyncThunk(
  'quality/verifyCorrectiveAction',
  async ({ id, effectivenessNotes, isEffective }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/quality/corrective-actions/${id}/verify`, { effectivenessNotes, isEffective });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== CERTIFICADOS ==========

export const fetchCertificates = createAsyncThunk(
  'quality/fetchCertificates',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/quality/certificates?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchCertificateById = createAsyncThunk(
  'quality/fetchCertificateById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/quality/certificates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createCertificate = createAsyncThunk(
  'quality/createCertificate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/quality/certificates', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateCertificate = createAsyncThunk(
  'quality/updateCertificate',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/quality/certificates/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const issueCertificate = createAsyncThunk(
  'quality/issueCertificate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/quality/certificates/${id}/issue`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteCertificate = createAsyncThunk(
  'quality/deleteCertificate',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quality/certificates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== ESTADÍSTICAS ==========

export const fetchQualityStats = createAsyncThunk(
  'quality/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/quality/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  // Planes
  plans: [],
  currentPlan: null,
  // Inspecciones
  inspections: [],
  currentInspection: null,
  // No Conformidades
  nonConformances: [],
  currentNonConformance: null,
  // Acciones Correctivas
  correctiveActions: [],
  // Certificados
  certificates: [],
  currentCertificate: null,
  // Estadísticas
  stats: null,
  // Estado
  loading: false,
  error: null,
};

const qualitySlice = createSlice({
  name: 'quality',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
    clearCurrentInspection: (state) => {
      state.currentInspection = null;
    },
    clearCurrentNonConformance: (state) => {
      state.currentNonConformance = null;
    },
    clearCurrentCertificate: (state) => {
      state.currentCertificate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Planes
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar planes';
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.currentPlan = action.payload;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.plans.unshift(action.payload);
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.plans[index] = action.payload;
        if (state.currentPlan?.id === action.payload.id) {
          state.currentPlan = action.payload;
        }
      })
      .addCase(approvePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.plans[index] = action.payload;
        if (state.currentPlan?.id === action.payload.id) {
          state.currentPlan = action.payload;
        }
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter(p => p.id !== action.payload);
      })
      // Inspecciones
      .addCase(fetchInspections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInspections.fulfilled, (state, action) => {
        state.loading = false;
        state.inspections = action.payload;
      })
      .addCase(fetchInspections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar inspecciones';
      })
      .addCase(fetchInspectionById.fulfilled, (state, action) => {
        state.currentInspection = action.payload;
      })
      .addCase(createInspection.fulfilled, (state, action) => {
        state.inspections.unshift(action.payload);
      })
      .addCase(updateInspection.fulfilled, (state, action) => {
        const index = state.inspections.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.inspections[index] = action.payload;
        if (state.currentInspection?.id === action.payload.id) {
          state.currentInspection = action.payload;
        }
      })
      .addCase(deleteInspection.fulfilled, (state, action) => {
        state.inspections = state.inspections.filter(i => i.id !== action.payload);
      })
      // No Conformidades
      .addCase(fetchNonConformances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNonConformances.fulfilled, (state, action) => {
        state.loading = false;
        state.nonConformances = action.payload;
      })
      .addCase(fetchNonConformances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar no conformidades';
      })
      .addCase(fetchNonConformanceById.fulfilled, (state, action) => {
        state.currentNonConformance = action.payload;
      })
      .addCase(createNonConformance.fulfilled, (state, action) => {
        state.nonConformances.unshift(action.payload);
      })
      .addCase(updateNonConformance.fulfilled, (state, action) => {
        const index = state.nonConformances.findIndex(nc => nc.id === action.payload.id);
        if (index !== -1) state.nonConformances[index] = action.payload;
        if (state.currentNonConformance?.id === action.payload.id) {
          state.currentNonConformance = action.payload;
        }
      })
      .addCase(closeNonConformance.fulfilled, (state, action) => {
        const index = state.nonConformances.findIndex(nc => nc.id === action.payload.id);
        if (index !== -1) state.nonConformances[index] = action.payload;
        if (state.currentNonConformance?.id === action.payload.id) {
          state.currentNonConformance = action.payload;
        }
      })
      .addCase(deleteNonConformance.fulfilled, (state, action) => {
        state.nonConformances = state.nonConformances.filter(nc => nc.id !== action.payload);
      })
      // Acciones Correctivas
      .addCase(fetchCorrectiveActions.fulfilled, (state, action) => {
        state.correctiveActions = action.payload;
      })
      .addCase(createCorrectiveAction.fulfilled, (state, action) => {
        state.correctiveActions.unshift(action.payload);
      })
      .addCase(completeCorrectiveAction.fulfilled, (state, action) => {
        const index = state.correctiveActions.findIndex(ca => ca.id === action.payload.id);
        if (index !== -1) state.correctiveActions[index] = action.payload;
      })
      .addCase(verifyCorrectiveAction.fulfilled, (state, action) => {
        const index = state.correctiveActions.findIndex(ca => ca.id === action.payload.id);
        if (index !== -1) state.correctiveActions[index] = action.payload;
      })
      // Certificados
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar certificados';
      })
      .addCase(fetchCertificateById.fulfilled, (state, action) => {
        state.currentCertificate = action.payload;
      })
      .addCase(createCertificate.fulfilled, (state, action) => {
        state.certificates.unshift(action.payload);
      })
      .addCase(updateCertificate.fulfilled, (state, action) => {
        const index = state.certificates.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.certificates[index] = action.payload;
        if (state.currentCertificate?.id === action.payload.id) {
          state.currentCertificate = action.payload;
        }
      })
      .addCase(issueCertificate.fulfilled, (state, action) => {
        const index = state.certificates.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.certificates[index] = action.payload;
        if (state.currentCertificate?.id === action.payload.id) {
          state.currentCertificate = action.payload;
        }
      })
      .addCase(deleteCertificate.fulfilled, (state, action) => {
        state.certificates = state.certificates.filter(c => c.id !== action.payload);
      })
      // Estadísticas
      .addCase(fetchQualityStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentPlan,
  clearCurrentInspection,
  clearCurrentNonConformance,
  clearCurrentCertificate,
} = qualitySlice.actions;

export default qualitySlice.reducer;
