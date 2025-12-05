import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const uploadFiles = createAsyncThunk(
  'attachments/uploadFiles',
  async ({ entityType, entityId, files, category, description }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      if (category) formData.append('category', category);
      if (description) formData.append('description', description);

      const response = await api.post(
        `/attachments/${entityType}/${entityId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const uploadSingleFile = createAsyncThunk(
  'attachments/uploadSingleFile',
  async ({ entityType, entityId, file, category, description }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (category) formData.append('category', category);
      if (description) formData.append('description', description);

      const response = await api.post(
        `/attachments/${entityType}/${entityId}/single`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAttachments = createAsyncThunk(
  'attachments/fetchAttachments',
  async ({ entityType, entityId, category }, { rejectWithValue }) => {
    try {
      const params = category ? { category } : {};
      const response = await api.get(`/attachments/${entityType}/${entityId}`, { params });
      return { entityType, entityId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAttachmentById = createAsyncThunk(
  'attachments/fetchAttachmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/attachments/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateAttachment = createAsyncThunk(
  'attachments/updateAttachment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/attachments/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  'attachments/deleteAttachment',
  async ({ id, hard = false }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/attachments/${id}`, { params: { hard } });
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteAttachmentsByEntity = createAsyncThunk(
  'attachments/deleteAttachmentsByEntity',
  async ({ entityType, entityId, hard = false }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/attachments/${entityType}/${entityId}`, { params: { hard } });
      return { entityType, entityId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const reorderAttachments = createAsyncThunk(
  'attachments/reorderAttachments',
  async (items, { rejectWithValue }) => {
    try {
      const response = await api.put('/attachments/reorder', { items });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAttachmentStats = createAsyncThunk(
  'attachments/fetchStats',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/attachments/stats', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAttachmentCatalogs = createAsyncThunk(
  'attachments/fetchCatalogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attachments/catalogs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  // Attachments por entidad: { 'entityType_entityId': [...] }
  byEntity: {},
  // Attachment actual
  current: null,
  // Catálogos
  catalogs: {
    entityTypes: [],
    categories: [],
    allowedMimeTypes: [],
    maxFileSize: 10 * 1024 * 1024,
    maxFiles: 10,
  },
  // Estadísticas
  stats: null,
  // Estado de carga
  loading: false,
  uploading: false,
  error: null,
  uploadProgress: 0,
};

const attachmentSlice = createSlice({
  name: 'attachments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearEntityAttachments: (state, action) => {
      const { entityType, entityId } = action.payload;
      const key = `${entityType}_${entityId}`;
      delete state.byEntity[key];
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Files
      .addCase(uploadFiles.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.uploading = false;
        // Los attachments se agregarán cuando se haga fetch
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload?.message || 'Error al subir archivos';
      })
      // Upload Single File
      .addCase(uploadSingleFile.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadSingleFile.fulfilled, (state, action) => {
        state.uploading = false;
      })
      .addCase(uploadSingleFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload?.message || 'Error al subir archivo';
      })
      // Fetch Attachments
      .addCase(fetchAttachments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttachments.fulfilled, (state, action) => {
        state.loading = false;
        const { entityType, entityId, data } = action.payload;
        const key = `${entityType}_${entityId}`;
        state.byEntity[key] = data.data || [];
      })
      .addCase(fetchAttachments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al obtener archivos';
      })
      // Fetch by ID
      .addCase(fetchAttachmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttachmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.data;
      })
      .addCase(fetchAttachmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al obtener archivo';
      })
      // Update
      .addCase(updateAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttachment.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.data;
      })
      .addCase(updateAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al actualizar archivo';
      })
      // Delete
      .addCase(deleteAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.loading = false;
        // Remover de todas las listas
        Object.keys(state.byEntity).forEach((key) => {
          state.byEntity[key] = state.byEntity[key].filter(
            (att) => att.id !== action.payload.id
          );
        });
      })
      .addCase(deleteAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al eliminar archivo';
      })
      // Delete by Entity
      .addCase(deleteAttachmentsByEntity.fulfilled, (state, action) => {
        const { entityType, entityId } = action.payload;
        const key = `${entityType}_${entityId}`;
        state.byEntity[key] = [];
      })
      // Fetch Stats
      .addCase(fetchAttachmentStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      })
      // Fetch Catalogs
      .addCase(fetchAttachmentCatalogs.fulfilled, (state, action) => {
        state.catalogs = action.payload.data;
      });
  },
});

export const {
  clearError,
  clearCurrent,
  setUploadProgress,
  clearEntityAttachments,
} = attachmentSlice.actions;

// Selectors
export const selectAttachmentsByEntity = (state, entityType, entityId) => {
  const key = `${entityType}_${entityId}`;
  return state.attachments.byEntity[key] || [];
};

export const selectCurrentAttachment = (state) => state.attachments.current;
export const selectAttachmentCatalogs = (state) => state.attachments.catalogs;
export const selectAttachmentStats = (state) => state.attachments.stats;
export const selectAttachmentLoading = (state) => state.attachments.loading;
export const selectAttachmentUploading = (state) => state.attachments.uploading;
export const selectAttachmentError = (state) => state.attachments.error;

export default attachmentSlice.reducer;
