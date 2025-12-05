import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Obtener estadísticas principales del dashboard
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

// Obtener flujo de caja
export const fetchCashFlow = createAsyncThunk(
  'dashboard/fetchCashFlow',
  async (year, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/cash-flow`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar flujo de caja');
    }
  }
);

// Obtener proyectos por estado
export const fetchProjectsByStatus = createAsyncThunk(
  'dashboard/fetchProjectsByStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/projects-by-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proyectos');
    }
  }
);

// Obtener empleados por departamento
export const fetchEmployeesByDepartment = createAsyncThunk(
  'dashboard/fetchEmployeesByDepartment',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/employees-by-department`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar empleados');
    }
  }
);

// Obtener alertas
export const fetchAlerts = createAsyncThunk(
  'dashboard/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar alertas');
    }
  }
);

// Obtener actividad reciente
export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchRecentActivity',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar actividad');
    }
  }
);

const initialState = {
  stats: null,
  cashFlow: [],
  projectsByStatus: [],
  employeesByDepartment: [],
  alerts: [],
  recentActivity: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.stats = null;
      state.cashFlow = [];
      state.projectsByStatus = [];
      state.employeesByDepartment = [];
      state.alerts = [];
      state.recentActivity = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Cash Flow
      .addCase(fetchCashFlow.fulfilled, (state, action) => {
        state.cashFlow = action.payload;
      })
      // Fetch Projects by Status
      .addCase(fetchProjectsByStatus.fulfilled, (state, action) => {
        state.projectsByStatus = action.payload;
      })
      // Fetch Employees by Department
      .addCase(fetchEmployeesByDepartment.fulfilled, (state, action) => {
        state.employeesByDepartment = action.payload;
      })
      // Fetch Alerts
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      })
      // Fetch Recent Activity
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.recentActivity = action.payload;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
