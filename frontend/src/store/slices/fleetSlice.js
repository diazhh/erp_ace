import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== VEHICLES ==========

export const fetchVehicles = createAsyncThunk(
  'fleet/fetchVehicles',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/fleet/vehicles', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener vehículos');
    }
  }
);

export const fetchVehicleById = createAsyncThunk(
  'fleet/fetchVehicleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/fleet/vehicles/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener vehículo');
    }
  }
);

export const fetchVehicleFull = createAsyncThunk(
  'fleet/fetchVehicleFull',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/fleet/vehicles/${id}/full`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener vehículo');
    }
  }
);

export const createVehicle = createAsyncThunk(
  'fleet/createVehicle',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/fleet/vehicles', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear vehículo');
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'fleet/updateVehicle',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/fleet/vehicles/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al actualizar vehículo');
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  'fleet/deleteVehicle',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/fleet/vehicles/${id}`);
      return { id, ...response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al eliminar vehículo');
    }
  }
);

// ========== ASSIGNMENTS ==========

export const fetchAssignments = createAsyncThunk(
  'fleet/fetchAssignments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/fleet/assignments', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener asignaciones');
    }
  }
);

export const createAssignment = createAsyncThunk(
  'fleet/createAssignment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/fleet/assignments', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear asignación');
    }
  }
);

export const endAssignment = createAsyncThunk(
  'fleet/endAssignment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/fleet/assignments/${id}/end`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al finalizar asignación');
    }
  }
);

// ========== MAINTENANCES ==========

export const fetchMaintenances = createAsyncThunk(
  'fleet/fetchMaintenances',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/fleet/maintenances', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener mantenimientos');
    }
  }
);

export const fetchMaintenanceById = createAsyncThunk(
  'fleet/fetchMaintenanceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/fleet/maintenances/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener mantenimiento');
    }
  }
);

export const createMaintenance = createAsyncThunk(
  'fleet/createMaintenance',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/fleet/maintenances', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear mantenimiento');
    }
  }
);

export const updateMaintenance = createAsyncThunk(
  'fleet/updateMaintenance',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/fleet/maintenances/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al actualizar mantenimiento');
    }
  }
);

export const completeMaintenance = createAsyncThunk(
  'fleet/completeMaintenance',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/fleet/maintenances/${id}/complete`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al completar mantenimiento');
    }
  }
);

// ========== FUEL LOGS ==========

export const fetchFuelLogs = createAsyncThunk(
  'fleet/fetchFuelLogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/fleet/fuel-logs', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener registros de combustible');
    }
  }
);

export const fetchFuelLogById = createAsyncThunk(
  'fleet/fetchFuelLogById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/fleet/fuel-logs/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener registro de combustible');
    }
  }
);

export const createFuelLog = createAsyncThunk(
  'fleet/createFuelLog',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/fleet/fuel-logs', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear registro de combustible');
    }
  }
);

export const updateFuelLog = createAsyncThunk(
  'fleet/updateFuelLog',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/fleet/fuel-logs/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al actualizar registro de combustible');
    }
  }
);

export const deleteFuelLog = createAsyncThunk(
  'fleet/deleteFuelLog',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/fleet/fuel-logs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al eliminar registro de combustible');
    }
  }
);

// ========== STATS & CATALOGS ==========

export const fetchFleetStats = createAsyncThunk(
  'fleet/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/fleet/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener estadísticas');
    }
  }
);

export const fetchFleetCatalogs = createAsyncThunk(
  'fleet/fetchCatalogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/fleet/catalogs');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener catálogos');
    }
  }
);

export const fetchFleetAlerts = createAsyncThunk(
  'fleet/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/fleet/alerts');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener alertas');
    }
  }
);

const initialState = {
  // Vehicles
  vehicles: [],
  vehiclesPagination: null,
  currentVehicle: null,
  // Assignments
  assignments: [],
  assignmentsPagination: null,
  // Maintenances
  maintenances: [],
  maintenancesPagination: null,
  currentMaintenance: null,
  // Fuel Logs
  fuelLogs: [],
  fuelLogsPagination: null,
  currentFuelLog: null,
  // Stats & Catalogs
  stats: null,
  catalogs: null,
  alerts: null,
  // UI State
  loading: false,
  error: null,
};

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    clearCurrentVehicle: (state) => {
      state.currentVehicle = null;
    },
    clearCurrentMaintenance: (state) => {
      state.currentMaintenance = null;
    },
    clearCurrentFuelLog: (state) => {
      state.currentFuelLog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload.vehicles;
        state.vehiclesPagination = action.payload.pagination;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVehicle = action.payload;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVehicleFull.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleFull.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVehicle = action.payload;
      })
      .addCase(fetchVehicleFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.vehicles.unshift(action.payload);
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
        if (state.currentVehicle?.id === action.payload.id) {
          state.currentVehicle = { ...state.currentVehicle, ...action.payload };
        }
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter((v) => v.id !== action.payload.id);
      })
      // Assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.assignments;
        state.assignmentsPagination = action.payload.pagination;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.assignments.unshift(action.payload);
      })
      .addCase(endAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      // Maintenances
      .addCase(fetchMaintenances.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaintenances.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenances = action.payload.maintenances;
        state.maintenancesPagination = action.payload.pagination;
      })
      .addCase(fetchMaintenances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
        state.currentMaintenance = action.payload;
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.maintenances.unshift(action.payload);
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        const index = state.maintenances.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.maintenances[index] = action.payload;
        }
      })
      .addCase(completeMaintenance.fulfilled, (state, action) => {
        const index = state.maintenances.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.maintenances[index] = action.payload;
        }
      })
      // Fuel Logs
      .addCase(fetchFuelLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFuelLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.fuelLogs = action.payload.fuelLogs;
        state.fuelLogsPagination = action.payload.pagination;
      })
      .addCase(fetchFuelLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFuelLogById.fulfilled, (state, action) => {
        state.currentFuelLog = action.payload;
      })
      .addCase(createFuelLog.fulfilled, (state, action) => {
        state.fuelLogs.unshift(action.payload);
      })
      .addCase(updateFuelLog.fulfilled, (state, action) => {
        const index = state.fuelLogs.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.fuelLogs[index] = action.payload;
        }
      })
      .addCase(deleteFuelLog.fulfilled, (state, action) => {
        state.fuelLogs = state.fuelLogs.filter((f) => f.id !== action.payload);
      })
      // Stats & Catalogs
      .addCase(fetchFleetStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchFleetCatalogs.fulfilled, (state, action) => {
        state.catalogs = action.payload;
      })
      .addCase(fetchFleetAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      });
  },
});

export const { clearCurrentVehicle, clearCurrentMaintenance, clearCurrentFuelLog, clearError } = fleetSlice.actions;
export default fleetSlice.reducer;
