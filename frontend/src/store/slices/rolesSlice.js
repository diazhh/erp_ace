import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/roles', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar roles');
    }
  }
);

export const fetchRoleById = createAsyncThunk(
  'roles/fetchRoleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar rol');
    }
  }
);

export const fetchRoleStats = createAsyncThunk(
  'roles/fetchRoleStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/roles/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  'roles/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/permissions');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar permisos');
    }
  }
);

export const fetchPermissionModules = createAsyncThunk(
  'roles/fetchPermissionModules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/permissions/modules');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar módulos');
    }
  }
);

export const createRole = createAsyncThunk(
  'roles/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/roles', roleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear rol');
    }
  }
);

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/roles/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar rol');
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar rol');
    }
  }
);

export const assignPermissions = createAsyncThunk(
  'roles/assignPermissions',
  async ({ id, permissionIds }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/roles/${id}/permissions`, { permissionIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al asignar permisos');
    }
  }
);

const initialState = {
  roles: [],
  currentRole: null,
  permissions: {}, // Agrupados por módulo
  modules: [],
  stats: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  },
  loading: false,
  error: null,
  success: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        // La respuesta viene como { success, data: [...], pagination: {...} }
        state.roles = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch role by ID
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchRoleStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Fetch permissions
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
      })
      // Fetch modules
      .addCase(fetchPermissionModules.fulfilled, (state, action) => {
        state.modules = action.payload;
      })
      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.roles.unshift(action.payload.data);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.currentRole = action.payload.data;
        const index = state.roles.findIndex(r => r.id === action.payload.data.id);
        if (index !== -1) {
          state.roles[index] = action.payload.data;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete role
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.roles = state.roles.filter(r => r.id !== action.payload.id);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Assign permissions
      .addCase(assignPermissions.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.currentRole = action.payload.data;
      })
      .addCase(assignPermissions.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentRole } = rolesSlice.actions;
export default rolesSlice.reducer;
