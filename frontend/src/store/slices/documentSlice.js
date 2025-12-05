import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ==================== ASYNC THUNKS ====================

// Catalogs
export const fetchDocumentCatalogs = createAsyncThunk(
  'documents/fetchCatalogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/documents/catalogs');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar catálogos');
    }
  }
);

// Stats
export const fetchDocumentStats = createAsyncThunk(
  'documents/fetchStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/documents/stats', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

// Expiring Documents
export const fetchExpiringDocuments = createAsyncThunk(
  'documents/fetchExpiring',
  async (days = 30, { rejectWithValue }) => {
    try {
      const response = await api.get('/documents/expiring', { params: { days } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar documentos próximos a vencer');
    }
  }
);

// ==================== CATEGORIES ====================

export const fetchCategories = createAsyncThunk(
  'documents/fetchCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/documents/categories', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar categorías');
    }
  }
);

export const fetchCategory = createAsyncThunk(
  'documents/fetchCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/documents/categories/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar categoría');
    }
  }
);

export const createCategory = createAsyncThunk(
  'documents/createCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/documents/categories', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear categoría');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'documents/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/documents/categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar categoría');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'documents/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/documents/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar categoría');
    }
  }
);

// ==================== DOCUMENTS ====================

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/documents', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar documentos');
    }
  }
);

export const fetchDocument = createAsyncThunk(
  'documents/fetchDocument',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar documento');
    }
  }
);

export const createDocument = createAsyncThunk(
  'documents/createDocument',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/documents', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear documento');
    }
  }
);

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/documents/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar documento');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/documents/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar documento');
    }
  }
);

// ==================== WORKFLOW ====================

export const submitForReview = createAsyncThunk(
  'documents/submitForReview',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/documents/${id}/submit`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al enviar a revisión');
    }
  }
);

export const approveDocument = createAsyncThunk(
  'documents/approveDocument',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/documents/${id}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar documento');
    }
  }
);

export const rejectDocument = createAsyncThunk(
  'documents/rejectDocument',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/documents/${id}/reject`, { reason });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al rechazar documento');
    }
  }
);

export const archiveDocument = createAsyncThunk(
  'documents/archiveDocument',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/documents/${id}/archive`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al archivar documento');
    }
  }
);

// ==================== VERSIONS ====================

export const createVersion = createAsyncThunk(
  'documents/createVersion',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/documents/${id}/versions`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear versión');
    }
  }
);

// ==================== SHARING ====================

export const shareDocument = createAsyncThunk(
  'documents/shareDocument',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/documents/${id}/share`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al compartir documento');
    }
  }
);

export const removeShare = createAsyncThunk(
  'documents/removeShare',
  async ({ documentId, shareId }, { rejectWithValue }) => {
    try {
      await api.delete(`/documents/${documentId}/share/${shareId}`);
      return { documentId, shareId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar compartición');
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
  
  // Expiring
  expiringDocuments: [],
  expiringLoading: false,
  
  // Categories
  categories: [],
  categoriesLoading: false,
  currentCategory: null,
  
  // Documents
  documents: [],
  documentsPagination: null,
  documentsLoading: false,
  currentDocument: null,
  currentDocumentLoading: false,
  
  // General
  error: null,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Catalogs
      .addCase(fetchDocumentCatalogs.pending, (state) => {
        state.catalogsLoading = true;
      })
      .addCase(fetchDocumentCatalogs.fulfilled, (state, action) => {
        state.catalogsLoading = false;
        state.catalogs = action.payload;
      })
      .addCase(fetchDocumentCatalogs.rejected, (state, action) => {
        state.catalogsLoading = false;
        state.error = action.payload;
      })
      
      // Stats
      .addCase(fetchDocumentStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchDocumentStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDocumentStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      
      // Expiring
      .addCase(fetchExpiringDocuments.pending, (state) => {
        state.expiringLoading = true;
      })
      .addCase(fetchExpiringDocuments.fulfilled, (state, action) => {
        state.expiringLoading = false;
        state.expiringDocuments = action.payload;
      })
      .addCase(fetchExpiringDocuments.rejected, (state, action) => {
        state.expiringLoading = false;
        state.error = action.payload;
      })
      
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
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
      
      // Documents
      .addCase(fetchDocuments.pending, (state) => {
        state.documentsLoading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.documentsLoading = false;
        state.documents = action.payload.data;
        state.documentsPagination = action.payload.pagination;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.documentsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDocument.pending, (state) => {
        state.currentDocumentLoading = true;
      })
      .addCase(fetchDocument.fulfilled, (state, action) => {
        state.currentDocumentLoading = false;
        state.currentDocument = action.payload;
      })
      .addCase(fetchDocument.rejected, (state, action) => {
        state.currentDocumentLoading = false;
        state.error = action.payload;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents.unshift(action.payload);
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(d => d.id !== action.payload);
      })
      
      // Workflow
      .addCase(submitForReview.fulfilled, (state, action) => {
        const index = state.documents.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(approveDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(rejectDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(archiveDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentDocument, clearCurrentCategory } = documentSlice.actions;
export default documentSlice.reducer;
