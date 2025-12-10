import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ============================================
// ADMIN THUNKS - Email Configuration
// ============================================

export const fetchEmailConfig = createAsyncThunk(
  'email/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/email/config');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener configuración');
    }
  }
);

export const saveEmailConfig = createAsyncThunk(
  'email/saveConfig',
  async (configData, { rejectWithValue }) => {
    try {
      const response = await api.post('/email/config', configData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al guardar configuración');
    }
  }
);

export const testEmailConnection = createAsyncThunk(
  'email/testConnection',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/email/config/test');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al probar conexión');
    }
  }
);

export const sendTestEmail = createAsyncThunk(
  'email/sendTestEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/email/config/test-email', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al enviar correo de prueba');
    }
  }
);

// ============================================
// TEMPLATES THUNKS
// ============================================

export const fetchEmailTemplates = createAsyncThunk(
  'email/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/email/templates');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener plantillas');
    }
  }
);

export const fetchEmailTemplateById = createAsyncThunk(
  'email/fetchTemplateById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/email/templates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener plantilla');
    }
  }
);

export const updateEmailTemplate = createAsyncThunk(
  'email/updateTemplate',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/email/templates/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar plantilla');
    }
  }
);

export const createEmailTemplate = createAsyncThunk(
  'email/createTemplate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/email/templates', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear plantilla');
    }
  }
);

export const deleteEmailTemplate = createAsyncThunk(
  'email/deleteTemplate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/email/templates/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar plantilla');
    }
  }
);

// ============================================
// LOGS & STATS THUNKS
// ============================================

export const fetchEmailLogs = createAsyncThunk(
  'email/fetchLogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/email/logs', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener historial');
    }
  }
);

export const fetchEmailStats = createAsyncThunk(
  'email/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/email/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }
);

// ============================================
// USER THUNKS - Personal Email Configuration
// ============================================

export const fetchUserEmailConfig = createAsyncThunk(
  'email/fetchUserConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/email/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener configuración');
    }
  }
);

export const setUserEmail = createAsyncThunk(
  'email/setUserEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/email/me', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al configurar email');
    }
  }
);

export const verifyUserEmail = createAsyncThunk(
  'email/verifyUserEmail',
  async (code, { rejectWithValue }) => {
    try {
      const response = await api.post('/email/me/verify', { code });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al verificar código');
    }
  }
);

export const resendVerificationCode = createAsyncThunk(
  'email/resendCode',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/email/me/resend');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al reenviar código');
    }
  }
);

export const updateEmailNotifications = createAsyncThunk(
  'email/updateNotifications',
  async (notificationsEnabled, { rejectWithValue }) => {
    try {
      const response = await api.put('/email/me/notifications', { notificationsEnabled });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar preferencias');
    }
  }
);

export const removeUserEmail = createAsyncThunk(
  'email/removeUserEmail',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/email/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar configuración');
    }
  }
);

const initialState = {
  // Admin config state
  config: null,
  configured: false,
  
  // Templates state
  templates: [],
  currentTemplate: null,
  
  // Logs state
  logs: [],
  logsPagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  
  // Stats state
  stats: null,
  
  // User config state
  userConfig: null,
  verificationPending: false,
  verificationExpires: null,
  
  // UI state
  loading: false,
  error: null,
  success: null,
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch config
      .addCase(fetchEmailConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload.config;
        state.configured = action.payload.configured;
      })
      .addCase(fetchEmailConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save config
      .addCase(saveEmailConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveEmailConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.config = action.payload.config;
        state.configured = true;
      })
      .addCase(saveEmailConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Test connection
      .addCase(testEmailConnection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(testEmailConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(testEmailConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send test email
      .addCase(sendTestEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendTestEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(sendTestEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch templates
      .addCase(fetchEmailTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchEmailTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch template by ID
      .addCase(fetchEmailTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload;
      })
      .addCase(fetchEmailTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update template
      .addCase(updateEmailTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmailTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.currentTemplate = action.payload.template;
        const index = state.templates.findIndex(t => t.id === action.payload.template.id);
        if (index !== -1) {
          state.templates[index] = action.payload.template;
        }
      })
      .addCase(updateEmailTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create template
      .addCase(createEmailTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmailTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.templates.push(action.payload.template);
      })
      .addCase(createEmailTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete template
      .addCase(deleteEmailTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmailTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.templates = state.templates.filter(t => t.id !== action.payload.id);
      })
      .addCase(deleteEmailTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch logs
      .addCase(fetchEmailLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs;
        state.logsPagination = action.payload.pagination;
      })
      .addCase(fetchEmailLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchEmailStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchEmailStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user config
      .addCase(fetchUserEmailConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEmailConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.userConfig = action.payload;
      })
      .addCase(fetchUserEmailConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Set user email
      .addCase(setUserEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setUserEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.verificationPending = true;
        state.verificationExpires = action.payload.expiresAt;
      })
      .addCase(setUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify user email
      .addCase(verifyUserEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.verificationPending = false;
        state.userConfig = {
          ...state.userConfig,
          configured: true,
          isVerified: true,
          email: action.payload.email,
        };
      })
      .addCase(verifyUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Resend verification code
      .addCase(resendVerificationCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationCode.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.verificationExpires = action.payload.expiresAt;
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update notifications
      .addCase(updateEmailNotifications.fulfilled, (state, action) => {
        state.success = action.payload.message;
        if (state.userConfig) {
          state.userConfig.notificationsEnabled = action.payload.notificationsEnabled;
        }
      })
      // Remove user email
      .addCase(removeUserEmail.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.userConfig = null;
        state.verificationPending = false;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentTemplate } = emailSlice.actions;
export default emailSlice.reducer;
