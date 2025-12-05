import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ==================== ASYNC THUNKS ====================

// Catalogs
export const fetchHSECatalogs = createAsyncThunk(
  'hse/fetchCatalogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/hse/catalogs');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar catálogos');
    }
  }
);

// Stats
export const fetchHSEStats = createAsyncThunk(
  'hse/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/hse/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

// Alerts
export const fetchHSEAlerts = createAsyncThunk(
  'hse/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/hse/alerts');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar alertas');
    }
  }
);

// ==================== INCIDENTS ====================

export const fetchIncidents = createAsyncThunk(
  'hse/fetchIncidents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/hse/incidents', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar incidentes');
    }
  }
);

export const fetchIncident = createAsyncThunk(
  'hse/fetchIncident',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hse/incidents/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar incidente');
    }
  }
);

export const createIncident = createAsyncThunk(
  'hse/createIncident',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/hse/incidents', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear incidente');
    }
  }
);

export const updateIncident = createAsyncThunk(
  'hse/updateIncident',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hse/incidents/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar incidente');
    }
  }
);

export const investigateIncident = createAsyncThunk(
  'hse/investigateIncident',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hse/incidents/${id}/investigate`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al iniciar investigación');
    }
  }
);

export const closeIncident = createAsyncThunk(
  'hse/closeIncident',
  async ({ id, closureNotes }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hse/incidents/${id}/close`, { closureNotes });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cerrar incidente');
    }
  }
);

// ==================== INSPECTIONS ====================

export const fetchInspections = createAsyncThunk(
  'hse/fetchInspections',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/hse/inspections', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar inspecciones');
    }
  }
);

export const fetchInspection = createAsyncThunk(
  'hse/fetchInspection',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hse/inspections/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar inspección');
    }
  }
);

export const createInspection = createAsyncThunk(
  'hse/createInspection',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/hse/inspections', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear inspección');
    }
  }
);

export const updateInspection = createAsyncThunk(
  'hse/updateInspection',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hse/inspections/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar inspección');
    }
  }
);

export const completeInspection = createAsyncThunk(
  'hse/completeInspection',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hse/inspections/${id}/complete`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al completar inspección');
    }
  }
);

// ==================== TRAININGS ====================

export const fetchTrainings = createAsyncThunk(
  'hse/fetchTrainings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/hse/trainings', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar capacitaciones');
    }
  }
);

export const fetchTraining = createAsyncThunk(
  'hse/fetchTraining',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hse/trainings/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar capacitación');
    }
  }
);

export const createTraining = createAsyncThunk(
  'hse/createTraining',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/hse/trainings', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear capacitación');
    }
  }
);

export const updateTraining = createAsyncThunk(
  'hse/updateTraining',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hse/trainings/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar capacitación');
    }
  }
);

export const completeTraining = createAsyncThunk(
  'hse/completeTraining',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hse/trainings/${id}/complete`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al completar capacitación');
    }
  }
);

export const registerAttendance = createAsyncThunk(
  'hse/registerAttendance',
  async ({ trainingId, employeeIds }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hse/trainings/${trainingId}/attendances`, { employeeIds });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al registrar asistencia');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'hse/updateAttendance',
  async ({ trainingId, attendanceId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hse/trainings/${trainingId}/attendances/${attendanceId}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar asistencia');
    }
  }
);

// ==================== SAFETY EQUIPMENT ====================

export const fetchEquipment = createAsyncThunk(
  'hse/fetchEquipment',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/hse/equipment', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar equipos');
    }
  }
);

export const fetchEquipmentItem = createAsyncThunk(
  'hse/fetchEquipmentItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hse/equipment/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar equipo');
    }
  }
);

export const createEquipment = createAsyncThunk(
  'hse/createEquipment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/hse/equipment', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear equipo');
    }
  }
);

export const updateEquipment = createAsyncThunk(
  'hse/updateEquipment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hse/equipment/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar equipo');
    }
  }
);

export const assignEquipment = createAsyncThunk(
  'hse/assignEquipment',
  async ({ id, employeeId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hse/equipment/${id}/assign`, { employeeId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al asignar equipo');
    }
  }
);

export const returnEquipment = createAsyncThunk(
  'hse/returnEquipment',
  async ({ id, condition, notes }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hse/equipment/${id}/return`, { condition, notes });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al devolver equipo');
    }
  }
);

// ==================== SLICE ====================

const initialState = {
  // Catalogs
  catalogs: null,
  catalogsLoading: false,
  
  // Stats
  stats: null,
  statsLoading: false,
  
  // Alerts
  alerts: [],
  alertsLoading: false,
  
  // Incidents
  incidents: [],
  incidentsPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  currentIncident: null,
  incidentsLoading: false,
  
  // Inspections
  inspections: [],
  inspectionsPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  currentInspection: null,
  inspectionsLoading: false,
  
  // Trainings
  trainings: [],
  trainingsPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  currentTraining: null,
  trainingsLoading: false,
  
  // Equipment
  equipment: [],
  equipmentPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  currentEquipment: null,
  equipmentLoading: false,
  
  // General
  loading: false,
  error: null,
};

const hseSlice = createSlice({
  name: 'hse',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentIncident: (state) => {
      state.currentIncident = null;
    },
    clearCurrentInspection: (state) => {
      state.currentInspection = null;
    },
    clearCurrentTraining: (state) => {
      state.currentTraining = null;
    },
    clearCurrentEquipment: (state) => {
      state.currentEquipment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Catalogs
      .addCase(fetchHSECatalogs.pending, (state) => {
        state.catalogsLoading = true;
      })
      .addCase(fetchHSECatalogs.fulfilled, (state, action) => {
        state.catalogsLoading = false;
        state.catalogs = action.payload;
      })
      .addCase(fetchHSECatalogs.rejected, (state, action) => {
        state.catalogsLoading = false;
        state.error = action.payload;
      })
      
      // Stats
      .addCase(fetchHSEStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchHSEStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchHSEStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      
      // Alerts
      .addCase(fetchHSEAlerts.pending, (state) => {
        state.alertsLoading = true;
      })
      .addCase(fetchHSEAlerts.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchHSEAlerts.rejected, (state, action) => {
        state.alertsLoading = false;
        state.error = action.payload;
      })
      
      // Incidents
      .addCase(fetchIncidents.pending, (state) => {
        state.incidentsLoading = true;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.incidentsLoading = false;
        state.incidents = action.payload.data;
        state.incidentsPagination = action.payload.pagination;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.incidentsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchIncident.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIncident = action.payload;
      })
      .addCase(fetchIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.incidents.unshift(action.payload);
      })
      .addCase(updateIncident.fulfilled, (state, action) => {
        const index = state.incidents.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.incidents[index] = action.payload;
        if (state.currentIncident?.id === action.payload.id) {
          state.currentIncident = action.payload;
        }
      })
      .addCase(investigateIncident.fulfilled, (state, action) => {
        const index = state.incidents.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.incidents[index] = action.payload;
        if (state.currentIncident?.id === action.payload.id) {
          state.currentIncident = action.payload;
        }
      })
      .addCase(closeIncident.fulfilled, (state, action) => {
        const index = state.incidents.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.incidents[index] = action.payload;
        if (state.currentIncident?.id === action.payload.id) {
          state.currentIncident = action.payload;
        }
      })
      
      // Inspections
      .addCase(fetchInspections.pending, (state) => {
        state.inspectionsLoading = true;
      })
      .addCase(fetchInspections.fulfilled, (state, action) => {
        state.inspectionsLoading = false;
        state.inspections = action.payload.data;
        state.inspectionsPagination = action.payload.pagination;
      })
      .addCase(fetchInspections.rejected, (state, action) => {
        state.inspectionsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchInspection.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInspection.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInspection = action.payload;
      })
      .addCase(fetchInspection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
      .addCase(completeInspection.fulfilled, (state, action) => {
        const index = state.inspections.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.inspections[index] = action.payload;
        if (state.currentInspection?.id === action.payload.id) {
          state.currentInspection = action.payload;
        }
      })
      
      // Trainings
      .addCase(fetchTrainings.pending, (state) => {
        state.trainingsLoading = true;
      })
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.trainingsLoading = false;
        state.trainings = action.payload.data;
        state.trainingsPagination = action.payload.pagination;
      })
      .addCase(fetchTrainings.rejected, (state, action) => {
        state.trainingsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTraining.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTraining.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTraining = action.payload;
      })
      .addCase(fetchTraining.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTraining.fulfilled, (state, action) => {
        state.trainings.unshift(action.payload);
      })
      .addCase(updateTraining.fulfilled, (state, action) => {
        const index = state.trainings.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.trainings[index] = action.payload;
        if (state.currentTraining?.id === action.payload.id) {
          state.currentTraining = action.payload;
        }
      })
      .addCase(completeTraining.fulfilled, (state, action) => {
        const index = state.trainings.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.trainings[index] = action.payload;
        if (state.currentTraining?.id === action.payload.id) {
          state.currentTraining = action.payload;
        }
      })
      
      // Equipment
      .addCase(fetchEquipment.pending, (state) => {
        state.equipmentLoading = true;
      })
      .addCase(fetchEquipment.fulfilled, (state, action) => {
        state.equipmentLoading = false;
        state.equipment = action.payload.data;
        state.equipmentPagination = action.payload.pagination;
      })
      .addCase(fetchEquipment.rejected, (state, action) => {
        state.equipmentLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchEquipmentItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEquipmentItem.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEquipment = action.payload;
      })
      .addCase(fetchEquipmentItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEquipment.fulfilled, (state, action) => {
        state.equipment.unshift(action.payload);
      })
      .addCase(updateEquipment.fulfilled, (state, action) => {
        const index = state.equipment.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.equipment[index] = action.payload;
        if (state.currentEquipment?.id === action.payload.id) {
          state.currentEquipment = action.payload;
        }
      })
      .addCase(assignEquipment.fulfilled, (state, action) => {
        const index = state.equipment.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.equipment[index] = action.payload;
        if (state.currentEquipment?.id === action.payload.id) {
          state.currentEquipment = action.payload;
        }
      })
      .addCase(returnEquipment.fulfilled, (state, action) => {
        const index = state.equipment.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.equipment[index] = action.payload;
        if (state.currentEquipment?.id === action.payload.id) {
          state.currentEquipment = action.payload;
        }
      });
  },
});

export const {
  clearError,
  clearCurrentIncident,
  clearCurrentInspection,
  clearCurrentTraining,
  clearCurrentEquipment,
} = hseSlice.actions;

export default hseSlice.reducer;
