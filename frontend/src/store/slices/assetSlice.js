import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ========== CATEGORIES ==========

export const fetchAssetCategories = createAsyncThunk(
  'assets/fetchCategories',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/assets/categories', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener categorías');
    }
  }
);

export const fetchAssetCategoryById = createAsyncThunk(
  'assets/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/assets/categories/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener categoría');
    }
  }
);

export const createAssetCategory = createAsyncThunk(
  'assets/createCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/assets/categories', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear categoría');
    }
  }
);

export const updateAssetCategory = createAsyncThunk(
  'assets/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/assets/categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al actualizar categoría');
    }
  }
);

export const deleteAssetCategory = createAsyncThunk(
  'assets/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/assets/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al eliminar categoría');
    }
  }
);

// ========== ASSETS ==========

export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/assets', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener activos');
    }
  }
);

export const fetchAssetById = createAsyncThunk(
  'assets/fetchAssetById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/assets/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener activo');
    }
  }
);

export const fetchAssetFull = createAsyncThunk(
  'assets/fetchAssetFull',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/assets/${id}/full`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener activo');
    }
  }
);

export const createAsset = createAsyncThunk(
  'assets/createAsset',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/assets', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear activo');
    }
  }
);

export const updateAsset = createAsyncThunk(
  'assets/updateAsset',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/assets/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al actualizar activo');
    }
  }
);

export const deleteAsset = createAsyncThunk(
  'assets/deleteAsset',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/assets/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al eliminar activo');
    }
  }
);

export const disposeAsset = createAsyncThunk(
  'assets/disposeAsset',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/assets/${id}/dispose`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al dar de baja activo');
    }
  }
);

// ========== MAINTENANCES ==========

export const fetchAssetMaintenances = createAsyncThunk(
  'assets/fetchMaintenances',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/assets/maintenances/list', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener mantenimientos');
    }
  }
);

export const fetchAssetMaintenanceById = createAsyncThunk(
  'assets/fetchMaintenanceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/assets/maintenances/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener mantenimiento');
    }
  }
);

export const createAssetMaintenance = createAsyncThunk(
  'assets/createMaintenance',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/assets/maintenances', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear mantenimiento');
    }
  }
);

export const updateAssetMaintenance = createAsyncThunk(
  'assets/updateMaintenance',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/assets/maintenances/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al actualizar mantenimiento');
    }
  }
);

export const completeAssetMaintenance = createAsyncThunk(
  'assets/completeMaintenance',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/assets/maintenances/${id}/complete`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al completar mantenimiento');
    }
  }
);

// ========== TRANSFERS ==========

export const fetchAssetTransfers = createAsyncThunk(
  'assets/fetchTransfers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/assets/transfers/list', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener transferencias');
    }
  }
);

export const fetchAssetTransferById = createAsyncThunk(
  'assets/fetchTransferById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/assets/transfers/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener transferencia');
    }
  }
);

export const createAssetTransfer = createAsyncThunk(
  'assets/createTransfer',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/assets/transfers', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear transferencia');
    }
  }
);

export const approveAssetTransfer = createAsyncThunk(
  'assets/approveTransfer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/assets/transfers/${id}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al aprobar transferencia');
    }
  }
);

export const completeAssetTransfer = createAsyncThunk(
  'assets/completeTransfer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/assets/transfers/${id}/complete`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al completar transferencia');
    }
  }
);

// ========== DEPRECIATION ==========

export const fetchAssetDepreciations = createAsyncThunk(
  'assets/fetchDepreciations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/assets/depreciations', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener depreciaciones');
    }
  }
);

export const calculateAssetDepreciation = createAsyncThunk(
  'assets/calculateDepreciation',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/assets/depreciations/calculate', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al calcular depreciación');
    }
  }
);

export const runMonthlyDepreciation = createAsyncThunk(
  'assets/runMonthlyDepreciation',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/assets/depreciations/run-monthly', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al ejecutar depreciación mensual');
    }
  }
);

// ========== STATS & CATALOGS ==========

export const fetchAssetStats = createAsyncThunk(
  'assets/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/assets/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener estadísticas');
    }
  }
);

export const fetchAssetCatalogs = createAsyncThunk(
  'assets/fetchCatalogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/assets/catalogs');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener catálogos');
    }
  }
);

export const fetchAssetAlerts = createAsyncThunk(
  'assets/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/assets/alerts');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener alertas');
    }
  }
);

const initialState = {
  // Categories
  categories: [],
  categoriesPagination: null,
  currentCategory: null,
  // Assets
  assets: [],
  assetsPagination: null,
  currentAsset: null,
  // Maintenances
  maintenances: [],
  maintenancesPagination: null,
  currentMaintenance: null,
  // Transfers
  transfers: [],
  transfersPagination: null,
  currentTransfer: null,
  // Depreciations
  depreciations: [],
  depreciationsPagination: null,
  // Stats & Catalogs
  stats: null,
  catalogs: null,
  alerts: null,
  // UI State
  loading: false,
  error: null,
};

const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    clearCurrentAsset: (state) => {
      state.currentAsset = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearCurrentMaintenance: (state) => {
      state.currentMaintenance = null;
    },
    clearCurrentTransfer: (state) => {
      state.currentTransfer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchAssetCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.items;
        state.categoriesPagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAssetCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssetCategoryById.fulfilled, (state, action) => {
        state.currentCategory = action.payload;
      })
      .addCase(createAssetCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })
      .addCase(updateAssetCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteAssetCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      })
      // Assets
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload.items;
        state.assetsPagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAsset = action.payload;
      })
      .addCase(fetchAssetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssetFull.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetFull.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAsset = action.payload;
      })
      .addCase(fetchAssetFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAsset.fulfilled, (state, action) => {
        state.assets.unshift(action.payload);
      })
      .addCase(updateAsset.fulfilled, (state, action) => {
        const index = state.assets.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.assets[index] = action.payload;
        }
        if (state.currentAsset?.id === action.payload.id) {
          state.currentAsset = { ...state.currentAsset, ...action.payload };
        }
      })
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.assets = state.assets.filter((a) => a.id !== action.payload);
      })
      .addCase(disposeAsset.fulfilled, (state, action) => {
        const index = state.assets.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.assets[index] = action.payload;
        }
        if (state.currentAsset?.id === action.payload.id) {
          state.currentAsset = action.payload;
        }
      })
      // Maintenances
      .addCase(fetchAssetMaintenances.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssetMaintenances.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenances = action.payload.items;
        state.maintenancesPagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAssetMaintenances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssetMaintenanceById.fulfilled, (state, action) => {
        state.currentMaintenance = action.payload;
      })
      .addCase(createAssetMaintenance.fulfilled, (state, action) => {
        state.maintenances.unshift(action.payload);
      })
      .addCase(updateAssetMaintenance.fulfilled, (state, action) => {
        const index = state.maintenances.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.maintenances[index] = action.payload;
        }
      })
      .addCase(completeAssetMaintenance.fulfilled, (state, action) => {
        const index = state.maintenances.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.maintenances[index] = action.payload;
        }
      })
      // Transfers
      .addCase(fetchAssetTransfers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssetTransfers.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = action.payload.items;
        state.transfersPagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAssetTransfers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssetTransferById.fulfilled, (state, action) => {
        state.currentTransfer = action.payload;
      })
      .addCase(createAssetTransfer.fulfilled, (state, action) => {
        state.transfers.unshift(action.payload);
      })
      .addCase(approveAssetTransfer.fulfilled, (state, action) => {
        const index = state.transfers.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transfers[index] = action.payload;
        }
      })
      .addCase(completeAssetTransfer.fulfilled, (state, action) => {
        const index = state.transfers.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transfers[index] = action.payload;
        }
      })
      // Depreciations
      .addCase(fetchAssetDepreciations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssetDepreciations.fulfilled, (state, action) => {
        state.loading = false;
        state.depreciations = action.payload.items;
        state.depreciationsPagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAssetDepreciations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(calculateAssetDepreciation.fulfilled, (state, action) => {
        state.depreciations.unshift(action.payload);
      })
      // Stats & Catalogs
      .addCase(fetchAssetStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchAssetCatalogs.fulfilled, (state, action) => {
        state.catalogs = action.payload;
      })
      .addCase(fetchAssetAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      });
  },
});

export const {
  clearCurrentAsset,
  clearCurrentCategory,
  clearCurrentMaintenance,
  clearCurrentTransfer,
  clearError,
} = assetSlice.actions;

export default assetSlice.reducer;
