import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ==================== ASYNC THUNKS ====================

// Stats
export const fetchInventoryStats = createAsyncThunk(
  'inventory/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

// ==================== WAREHOUSES ====================

export const fetchWarehouses = createAsyncThunk(
  'inventory/fetchWarehouses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/warehouses', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar almacenes');
    }
  }
);

export const fetchWarehouseById = createAsyncThunk(
  'inventory/fetchWarehouseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/warehouses/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar almacén');
    }
  }
);

export const fetchWarehouseFull = createAsyncThunk(
  'inventory/fetchWarehouseFull',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/warehouses/${id}/full`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar almacén');
    }
  }
);

export const createWarehouse = createAsyncThunk(
  'inventory/createWarehouse',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/inventory/warehouses', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear almacén');
    }
  }
);

export const updateWarehouse = createAsyncThunk(
  'inventory/updateWarehouse',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/inventory/warehouses/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar almacén');
    }
  }
);

export const deleteWarehouse = createAsyncThunk(
  'inventory/deleteWarehouse',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/inventory/warehouses/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar almacén');
    }
  }
);

export const fetchWarehouseStock = createAsyncThunk(
  'inventory/fetchWarehouseStock',
  async ({ warehouseId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/warehouses/${warehouseId}/stock`, { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar stock');
    }
  }
);

// ==================== CATEGORIES ====================

export const fetchCategories = createAsyncThunk(
  'inventory/fetchCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/categories', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar categorías');
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'inventory/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/categories/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar categoría');
    }
  }
);

export const createCategory = createAsyncThunk(
  'inventory/createCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/inventory/categories', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear categoría');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'inventory/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/inventory/categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar categoría');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'inventory/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/inventory/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar categoría');
    }
  }
);

// ==================== ITEMS ====================

export const fetchItems = createAsyncThunk(
  'inventory/fetchItems',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/items', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar items');
    }
  }
);

export const fetchItemById = createAsyncThunk(
  'inventory/fetchItemById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/items/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar item');
    }
  }
);

export const fetchItemFull = createAsyncThunk(
  'inventory/fetchItemFull',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/items/${id}/full`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar item');
    }
  }
);

export const createItem = createAsyncThunk(
  'inventory/createItem',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/inventory/items', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear item');
    }
  }
);

export const updateItem = createAsyncThunk(
  'inventory/updateItem',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/inventory/items/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar item');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'inventory/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/inventory/items/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar item');
    }
  }
);

export const fetchItemStock = createAsyncThunk(
  'inventory/fetchItemStock',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/items/${itemId}/stock`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar stock');
    }
  }
);

// ==================== MOVEMENTS ====================

export const fetchMovements = createAsyncThunk(
  'inventory/fetchMovements',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/movements', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar movimientos');
    }
  }
);

export const fetchMovementById = createAsyncThunk(
  'inventory/fetchMovementById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/movements/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar movimiento');
    }
  }
);

export const createMovement = createAsyncThunk(
  'inventory/createMovement',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/inventory/movements', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al registrar movimiento');
    }
  }
);

export const cancelMovement = createAsyncThunk(
  'inventory/cancelMovement',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/inventory/movements/${id}/cancel`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cancelar movimiento');
    }
  }
);

// ==================== CATALOGS ====================

export const fetchWarehouseTypes = createAsyncThunk(
  'inventory/fetchWarehouseTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/warehouse-types');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar tipos de almacén');
    }
  }
);

export const fetchItemTypes = createAsyncThunk(
  'inventory/fetchItemTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/item-types');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar tipos de item');
    }
  }
);

export const fetchMovementTypes = createAsyncThunk(
  'inventory/fetchMovementTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/movement-types');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar tipos de movimiento');
    }
  }
);

export const fetchMovementReasons = createAsyncThunk(
  'inventory/fetchMovementReasons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/movement-reasons');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar razones');
    }
  }
);

export const fetchUnits = createAsyncThunk(
  'inventory/fetchUnits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/units');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar unidades');
    }
  }
);

// ==================== SLICE ====================

const initialState = {
  // Stats
  stats: null,
  
  // Warehouses
  warehouses: [],
  warehousesPagination: null,
  currentWarehouse: null,
  warehouseStock: [],
  
  // Categories
  categories: [],
  currentCategory: null,
  
  // Items
  items: [],
  itemsPagination: null,
  currentItem: null,
  itemStock: null,
  
  // Movements
  movements: [],
  movementsPagination: null,
  currentMovement: null,
  
  // Catalogs
  warehouseTypes: [],
  itemTypes: [],
  movementTypes: [],
  movementReasons: [],
  units: [],
  
  // UI State
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentWarehouse: (state) => {
      state.currentWarehouse = null;
      state.warehouseStock = [];
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
      state.itemStock = null;
    },
    clearCurrentMovement: (state) => {
      state.currentMovement = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchInventoryStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventoryStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchInventoryStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Warehouses
      .addCase(fetchWarehouses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        state.warehouses = action.payload.warehouses;
        state.warehousesPagination = action.payload.pagination;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWarehouseById.fulfilled, (state, action) => {
        state.currentWarehouse = action.payload;
      })
      .addCase(fetchWarehouseFull.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWarehouseFull.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWarehouse = action.payload;
      })
      .addCase(fetchWarehouseFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createWarehouse.fulfilled, (state, action) => {
        state.warehouses.unshift(action.payload);
      })
      .addCase(updateWarehouse.fulfilled, (state, action) => {
        const index = state.warehouses.findIndex(w => w.id === action.payload.id);
        if (index !== -1) {
          state.warehouses[index] = action.payload;
        }
        if (state.currentWarehouse?.id === action.payload.id) {
          state.currentWarehouse = { ...state.currentWarehouse, ...action.payload };
        }
      })
      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.warehouses = state.warehouses.filter(w => w.id !== action.payload);
      })
      .addCase(fetchWarehouseStock.fulfilled, (state, action) => {
        state.warehouseStock = action.payload.stocks;
      })
      
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.currentCategory = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
      })
      
      // Items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.itemsPagination = action.payload.pagination;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.currentItem = action.payload;
      })
      .addCase(fetchItemFull.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemFull.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchItemFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = { ...state.currentItem, ...action.payload };
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      })
      .addCase(fetchItemStock.fulfilled, (state, action) => {
        state.itemStock = action.payload;
      })
      
      // Movements
      .addCase(fetchMovements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.movements = action.payload.movements;
        state.movementsPagination = action.payload.pagination;
      })
      .addCase(fetchMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMovementById.fulfilled, (state, action) => {
        state.currentMovement = action.payload;
      })
      .addCase(createMovement.fulfilled, (state, action) => {
        state.movements.unshift(action.payload);
      })
      .addCase(cancelMovement.fulfilled, (state, action) => {
        const index = state.movements.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.movements[index] = action.payload;
        }
      })
      
      // Catalogs
      .addCase(fetchWarehouseTypes.fulfilled, (state, action) => {
        state.warehouseTypes = action.payload;
      })
      .addCase(fetchItemTypes.fulfilled, (state, action) => {
        state.itemTypes = action.payload;
      })
      .addCase(fetchMovementTypes.fulfilled, (state, action) => {
        state.movementTypes = action.payload;
      })
      .addCase(fetchMovementReasons.fulfilled, (state, action) => {
        state.movementReasons = action.payload;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.units = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentWarehouse,
  clearCurrentCategory,
  clearCurrentItem,
  clearCurrentMovement,
} = inventorySlice.actions;

export default inventorySlice.reducer;
