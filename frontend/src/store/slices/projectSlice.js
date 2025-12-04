import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ==================== ASYNC THUNKS ====================

// Projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proyectos');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proyecto');
    }
  }
);

export const fetchProjectFull = createAsyncThunk(
  'projects/fetchFull',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${id}/full`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proyecto');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/projects', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear proyecto');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/projects/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar proyecto');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar proyecto');
    }
  }
);

// Stats
export const fetchProjectStats = createAsyncThunk(
  'projects/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

// Catalogs
export const fetchProjectTypes = createAsyncThunk(
  'projects/fetchTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects/types');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar tipos');
    }
  }
);

export const fetchExpenseTypes = createAsyncThunk(
  'projects/fetchExpenseTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects/expense-types');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar tipos de gasto');
    }
  }
);

export const fetchMemberRoles = createAsyncThunk(
  'projects/fetchMemberRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects/member-roles');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar roles');
    }
  }
);

// Members
export const fetchMembers = createAsyncThunk(
  'projects/fetchMembers',
  async ({ projectId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}/members`, { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar miembros');
    }
  }
);

export const addMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/members`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al agregar miembro');
    }
  }
);

export const updateMember = createAsyncThunk(
  'projects/updateMember',
  async ({ projectId, memberId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/projects/${projectId}/members/${memberId}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar miembro');
    }
  }
);

export const removeMember = createAsyncThunk(
  'projects/removeMember',
  async ({ projectId, memberId }, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}/members/${memberId}`);
      return memberId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al remover miembro');
    }
  }
);

// Milestones
export const fetchMilestones = createAsyncThunk(
  'projects/fetchMilestones',
  async ({ projectId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}/milestones`, { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar hitos');
    }
  }
);

export const createMilestone = createAsyncThunk(
  'projects/createMilestone',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/milestones`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear hito');
    }
  }
);

export const updateMilestone = createAsyncThunk(
  'projects/updateMilestone',
  async ({ projectId, milestoneId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/projects/${projectId}/milestones/${milestoneId}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar hito');
    }
  }
);

export const completeMilestone = createAsyncThunk(
  'projects/completeMilestone',
  async ({ projectId, milestoneId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/milestones/${milestoneId}/complete`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al completar hito');
    }
  }
);

export const deleteMilestone = createAsyncThunk(
  'projects/deleteMilestone',
  async ({ projectId, milestoneId }, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}/milestones/${milestoneId}`);
      return milestoneId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar hito');
    }
  }
);

// Expenses
export const fetchExpenses = createAsyncThunk(
  'projects/fetchExpenses',
  async ({ projectId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}/expenses`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar gastos');
    }
  }
);

export const createExpense = createAsyncThunk(
  'projects/createExpense',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/expenses`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear gasto');
    }
  }
);

export const approveExpense = createAsyncThunk(
  'projects/approveExpense',
  async ({ projectId, expenseId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/expenses/${expenseId}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar gasto');
    }
  }
);

export const rejectExpense = createAsyncThunk(
  'projects/rejectExpense',
  async ({ projectId, expenseId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/expenses/${expenseId}/reject`, { reason });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al rechazar gasto');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'projects/deleteExpense',
  async ({ projectId, expenseId }, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}/expenses/${expenseId}`);
      return expenseId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar gasto');
    }
  }
);

// ==================== SLICE ====================

const initialState = {
  // Projects
  projects: [],
  projectsPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  currentProject: null,
  // Members
  members: [],
  // Milestones
  milestones: [],
  // Expenses
  expenses: [],
  expensesPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  // Catalogs
  projectTypes: [],
  expenseTypes: [],
  memberRoles: [],
  // Stats
  stats: {
    total: 0,
    active: 0,
    delayed: 0,
    byStatus: [],
    byPriority: [],
    financial: {
      totalBudget: 0,
      totalActualCost: 0,
      totalRevenue: 0,
      totalProfit: 0,
    },
  },
  // UI State
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.members = [];
      state.milestones = [];
      state.expenses = [];
    },
    clearMembers: (state) => {
      state.members = [];
    },
    clearMilestones: (state) => {
      state.milestones = [];
    },
    clearExpenses: (state) => {
      state.expenses = [];
      state.expensesPagination = { total: 0, page: 1, limit: 20, totalPages: 0 };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data;
        state.projectsPagination = action.payload.pagination || initialState.projectsPagination;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By Id
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      // Fetch Full
      .addCase(fetchProjectFull.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectFull.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
        state.members = action.payload.members || [];
        state.milestones = action.payload.milestones || [];
        state.expenses = action.payload.recentExpenses || [];
      })
      .addCase(fetchProjectFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      })
      // Update
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = { ...state.currentProject, ...action.payload };
        }
      })
      // Delete
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      })
      // Stats
      .addCase(fetchProjectStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Catalogs
      .addCase(fetchProjectTypes.fulfilled, (state, action) => {
        state.projectTypes = action.payload;
      })
      .addCase(fetchExpenseTypes.fulfilled, (state, action) => {
        state.expenseTypes = action.payload;
      })
      .addCase(fetchMemberRoles.fulfilled, (state, action) => {
        state.memberRoles = action.payload;
      })
      // Members
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        const index = state.members.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.members = state.members.filter(m => m.id !== action.payload);
      })
      // Milestones
      .addCase(fetchMilestones.fulfilled, (state, action) => {
        state.milestones = action.payload;
      })
      .addCase(createMilestone.fulfilled, (state, action) => {
        state.milestones.push(action.payload);
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        const index = state.milestones.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
      })
      .addCase(completeMilestone.fulfilled, (state, action) => {
        const index = state.milestones.findIndex(m => m.id === action.payload.milestone.id);
        if (index !== -1) {
          state.milestones[index] = action.payload.milestone;
        }
        if (state.currentProject) {
          state.currentProject.progress = action.payload.projectProgress;
        }
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.milestones = state.milestones.filter(m => m.id !== action.payload);
      })
      // Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.data;
        state.expensesPagination = action.payload.pagination || initialState.expensesPagination;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      })
      .addCase(approveExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(rejectExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(e => e.id !== action.payload);
      });
  },
});

export const { 
  clearError, 
  clearCurrentProject, 
  clearMembers, 
  clearMilestones, 
  clearExpenses 
} = projectSlice.actions;

export default projectSlice.reducer;
