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

// Updates (Seguimiento)
export const fetchUpdates = createAsyncThunk(
  'projects/fetchUpdates',
  async ({ projectId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}/updates`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar actualizaciones');
    }
  }
);

export const createUpdate = createAsyncThunk(
  'projects/createUpdate',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/updates`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear actualización');
    }
  }
);

export const deleteUpdate = createAsyncThunk(
  'projects/deleteUpdate',
  async ({ projectId, updateId }, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}/updates/${updateId}`);
      return updateId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar actualización');
    }
  }
);

// Photos
export const fetchPhotos = createAsyncThunk(
  'projects/fetchPhotos',
  async ({ projectId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}/photos`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar fotos');
    }
  }
);

export const addPhoto = createAsyncThunk(
  'projects/addPhoto',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/photos`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al agregar foto');
    }
  }
);

export const updatePhoto = createAsyncThunk(
  'projects/updatePhoto',
  async ({ projectId, photoId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/projects/${projectId}/photos/${photoId}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar foto');
    }
  }
);

export const deletePhoto = createAsyncThunk(
  'projects/deletePhoto',
  async ({ projectId, photoId }, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}/photos/${photoId}`);
      return photoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar foto');
    }
  }
);

// Catalogs adicionales
export const fetchUpdateTypes = createAsyncThunk(
  'projects/fetchUpdateTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects/update-types');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar tipos de actualización');
    }
  }
);

export const fetchPhotoCategories = createAsyncThunk(
  'projects/fetchPhotoCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects/photo-categories');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar categorías de fotos');
    }
  }
);

// ==================== VALUATIONS ====================

export const fetchValuations = createAsyncThunk(
  'projects/fetchValuations',
  async ({ projectId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}/valuations`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar valuaciones');
    }
  }
);

export const fetchValuationById = createAsyncThunk(
  'projects/fetchValuationById',
  async ({ projectId, valuationId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}/valuations/${valuationId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar valuación');
    }
  }
);

export const createValuation = createAsyncThunk(
  'projects/createValuation',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/valuations`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear valuación');
    }
  }
);

export const submitValuation = createAsyncThunk(
  'projects/submitValuation',
  async ({ projectId, valuationId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/valuations/${valuationId}/submit`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al enviar valuación');
    }
  }
);

export const approveValuation = createAsyncThunk(
  'projects/approveValuation',
  async ({ projectId, valuationId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/valuations/${valuationId}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar valuación');
    }
  }
);

export const rejectValuation = createAsyncThunk(
  'projects/rejectValuation',
  async ({ projectId, valuationId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/valuations/${valuationId}/reject`, { reason });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al rechazar valuación');
    }
  }
);

export const generateInvoiceFromValuation = createAsyncThunk(
  'projects/generateInvoiceFromValuation',
  async ({ projectId, valuationId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${projectId}/valuations/${valuationId}/generate-invoice`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al generar factura');
    }
  }
);

export const deleteValuation = createAsyncThunk(
  'projects/deleteValuation',
  async ({ projectId, valuationId }, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}/valuations/${valuationId}`);
      return valuationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar valuación');
    }
  }
);

export const fetchValuationStatuses = createAsyncThunk(
  'projects/fetchValuationStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects/valuations/statuses');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estados de valuación');
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
  // Updates (Seguimiento)
  updates: [],
  updatesPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  // Photos
  photos: [],
  photosPagination: { total: 0, page: 1, limit: 50, totalPages: 0 },
  // Valuations
  valuations: [],
  valuationsPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  currentValuation: null,
  // Catalogs
  projectTypes: [],
  expenseTypes: [],
  memberRoles: [],
  updateTypes: [],
  photoCategories: [],
  valuationStatuses: [],
  // Stats
  stats: {
    total: 0,
    active: 0,
    delayed: 0,
    byStatus: [],
    byPriority: [],
    byExecutionType: [],
    financial: {
      totalBudget: 0,
      totalActualCost: 0,
      totalRevenue: 0,
      totalProfit: 0,
      totalContractAmount: 0,
      totalPaidToContractor: 0,
      pendingContractorPayments: 0,
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
      state.updates = [];
      state.photos = [];
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
    clearUpdates: (state) => {
      state.updates = [];
      state.updatesPagination = { total: 0, page: 1, limit: 20, totalPages: 0 };
    },
    clearPhotos: (state) => {
      state.photos = [];
      state.photosPagination = { total: 0, page: 1, limit: 50, totalPages: 0 };
    },
    clearValuations: (state) => {
      state.valuations = [];
      state.valuationsPagination = { total: 0, page: 1, limit: 20, totalPages: 0 };
      state.currentValuation = null;
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
      })
      // Updates (Seguimiento)
      .addCase(fetchUpdates.fulfilled, (state, action) => {
        state.updates = action.payload.data;
        state.updatesPagination = action.payload.pagination || initialState.updatesPagination;
      })
      .addCase(createUpdate.fulfilled, (state, action) => {
        state.updates.unshift(action.payload);
      })
      .addCase(deleteUpdate.fulfilled, (state, action) => {
        state.updates = state.updates.filter(u => u.id !== action.payload);
      })
      // Photos
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.photos = action.payload.data;
        state.photosPagination = action.payload.pagination || initialState.photosPagination;
      })
      .addCase(addPhoto.fulfilled, (state, action) => {
        state.photos.push(action.payload);
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        const index = state.photos.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.photos[index] = action.payload;
        }
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.photos = state.photos.filter(p => p.id !== action.payload);
      })
      // Catalogs adicionales
      .addCase(fetchUpdateTypes.fulfilled, (state, action) => {
        state.updateTypes = action.payload;
      })
      .addCase(fetchPhotoCategories.fulfilled, (state, action) => {
        state.photoCategories = action.payload;
      })
      // Valuations
      .addCase(fetchValuations.fulfilled, (state, action) => {
        state.valuations = action.payload.data;
        state.valuationsPagination = action.payload.pagination;
      })
      .addCase(fetchValuationById.fulfilled, (state, action) => {
        state.currentValuation = action.payload;
      })
      .addCase(createValuation.fulfilled, (state, action) => {
        state.valuations.unshift(action.payload);
      })
      .addCase(submitValuation.fulfilled, (state, action) => {
        const index = state.valuations.findIndex(v => v.id === action.payload.id);
        if (index !== -1) state.valuations[index] = action.payload;
      })
      .addCase(approveValuation.fulfilled, (state, action) => {
        const index = state.valuations.findIndex(v => v.id === action.payload.id);
        if (index !== -1) state.valuations[index] = action.payload;
      })
      .addCase(rejectValuation.fulfilled, (state, action) => {
        const index = state.valuations.findIndex(v => v.id === action.payload.id);
        if (index !== -1) state.valuations[index] = action.payload;
      })
      .addCase(generateInvoiceFromValuation.fulfilled, (state, action) => {
        // La factura se genera, actualizamos la valuación
        const valuation = state.valuations.find(v => v.invoiceId === action.payload.id);
        if (valuation) valuation.status = 'INVOICED';
      })
      .addCase(deleteValuation.fulfilled, (state, action) => {
        state.valuations = state.valuations.filter(v => v.id !== action.payload);
      })
      .addCase(fetchValuationStatuses.fulfilled, (state, action) => {
        state.valuationStatuses = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentProject, 
  clearMembers, 
  clearMilestones, 
  clearExpenses,
  clearUpdates,
  clearPhotos,
  clearValuations,
} = projectSlice.actions;

export default projectSlice.reducer;
