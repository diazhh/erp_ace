import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar usuarios');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar usuario');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'users/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear usuario');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar usuario');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar usuario');
    }
  }
);

export const toggleUserActive = createAsyncThunk(
  'users/toggleUserActive',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}/toggle-active`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cambiar estado');
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'users/resetUserPassword',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${id}/reset-password`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al resetear contraseña');
    }
  }
);

export const assignUserRoles = createAsyncThunk(
  'users/assignUserRoles',
  async ({ id, roleIds }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${id}/roles`, { roleIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al asignar roles');
    }
  }
);

const initialState = {
  users: [],
  currentUser: null,
  stats: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
  success: null,
  temporaryPassword: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearTemporaryPassword: (state) => {
      state.temporaryPassword = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.users.unshift(action.payload.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.currentUser = action.payload.data;
        const index = state.users.findIndex(u => u.id === action.payload.data.id);
        if (index !== -1) {
          state.users[index] = action.payload.data;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.users = state.users.filter(u => u.id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Toggle active
      .addCase(toggleUserActive.fulfilled, (state, action) => {
        state.success = action.payload.message;
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index].isActive = action.payload.data.isActive;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser.isActive = action.payload.data.isActive;
        }
      })
      .addCase(toggleUserActive.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Reset password
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.temporaryPassword = action.payload.data.temporaryPassword;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Assign roles
      .addCase(assignUserRoles.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.currentUser = action.payload.data;
      })
      .addCase(assignUserRoles.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearTemporaryPassword, clearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
