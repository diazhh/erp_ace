import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import employeeService from '../../services/employeeService';

// Thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await employeeService.list(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar empleados');
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeeService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar empleado');
    }
  }
);

export const fetchEmployeeFull = createAsyncThunk(
  'employees/fetchFull',
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeeService.getFullById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar empleado');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await employeeService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear empleado');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await employeeService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar empleado');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await employeeService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar empleado');
    }
  }
);

export const fetchEmployeeStats = createAsyncThunk(
  'employees/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeService.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

const initialState = {
  employees: [],
  currentEmployee: null,
  stats: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch full (with all relations)
      .addCase(fetchEmployeeFull.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeFull.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.unshift(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        state.currentEmployee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(e => e.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Stats
      .addCase(fetchEmployeeStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError, clearCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
