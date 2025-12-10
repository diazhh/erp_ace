import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ============================================
// ADMIN THUNKS - WhatsApp Session Management
// ============================================

export const fetchWhatsAppStatus = createAsyncThunk(
  'whatsapp/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/whatsapp/status');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener estado');
    }
  }
);

export const connectWhatsApp = createAsyncThunk(
  'whatsapp/connect',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/whatsapp/connect');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al conectar');
    }
  }
);

export const disconnectWhatsApp = createAsyncThunk(
  'whatsapp/disconnect',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/whatsapp/disconnect');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al desconectar');
    }
  }
);

export const sendTestMessage = createAsyncThunk(
  'whatsapp/sendTestMessage',
  async ({ phoneNumber, message }, { rejectWithValue }) => {
    try {
      const response = await api.post('/whatsapp/test-message', { phoneNumber, message });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al enviar mensaje');
    }
  }
);

export const checkPhoneNumber = createAsyncThunk(
  'whatsapp/checkNumber',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await api.post('/whatsapp/check-number', { phoneNumber });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al verificar número');
    }
  }
);

// ============================================
// USER THUNKS - Personal WhatsApp Configuration
// ============================================

export const fetchUserWhatsAppConfig = createAsyncThunk(
  'whatsapp/fetchUserConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/whatsapp/user/config');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener configuración');
    }
  }
);

export const requestVerification = createAsyncThunk(
  'whatsapp/requestVerification',
  async ({ phoneNumber, countryCode }, { rejectWithValue }) => {
    try {
      const response = await api.post('/whatsapp/user/request-verification', { phoneNumber, countryCode });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al solicitar verificación');
    }
  }
);

export const verifyCode = createAsyncThunk(
  'whatsapp/verifyCode',
  async (code, { rejectWithValue }) => {
    try {
      const response = await api.post('/whatsapp/user/verify', { code });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al verificar código');
    }
  }
);

export const updateNotifications = createAsyncThunk(
  'whatsapp/updateNotifications',
  async (enabled, { rejectWithValue }) => {
    try {
      const response = await api.put('/whatsapp/user/notifications', { enabled });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar preferencias');
    }
  }
);

export const removeUserWhatsApp = createAsyncThunk(
  'whatsapp/removeUserConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/whatsapp/user/config');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar configuración');
    }
  }
);

const initialState = {
  // Admin state
  status: 'disconnected', // disconnected, connecting, connected, qr_pending
  qrCode: null,
  phoneNumber: null,
  name: null,
  isConnected: false,
  
  // User config state
  userConfig: null,
  verificationPending: false,
  verificationExpires: null,
  
  // UI state
  loading: false,
  error: null,
  success: null,
};

const whatsappSlice = createSlice({
  name: 'whatsapp',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    updateStatus: (state, action) => {
      const { status, qrCode, phoneNumber, name, isConnected } = action.payload;
      if (status) state.status = status;
      if (qrCode !== undefined) state.qrCode = qrCode;
      if (phoneNumber !== undefined) state.phoneNumber = phoneNumber;
      if (name !== undefined) state.name = name;
      if (isConnected !== undefined) state.isConnected = isConnected;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch status
      .addCase(fetchWhatsAppStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWhatsAppStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.qrCode = action.payload.qrCode;
        state.phoneNumber = action.payload.phoneNumber;
        state.name = action.payload.name;
        state.isConnected = action.payload.isConnected;
      })
      .addCase(fetchWhatsAppStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Connect
      .addCase(connectWhatsApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectWhatsApp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        if (action.payload.data) {
          state.status = action.payload.data.status;
          state.qrCode = action.payload.data.qrCode;
          state.phoneNumber = action.payload.data.phoneNumber;
          state.name = action.payload.data.name;
          state.isConnected = action.payload.data.isConnected;
        }
      })
      .addCase(connectWhatsApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Disconnect
      .addCase(disconnectWhatsApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disconnectWhatsApp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.status = 'disconnected';
        state.qrCode = null;
        state.phoneNumber = null;
        state.name = null;
        state.isConnected = false;
      })
      .addCase(disconnectWhatsApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send test message
      .addCase(sendTestMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendTestMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(sendTestMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check phone number
      .addCase(checkPhoneNumber.fulfilled, (state, action) => {
        // Just return the result, no state change needed
      })
      // Fetch user config
      .addCase(fetchUserWhatsAppConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWhatsAppConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.userConfig = action.payload;
      })
      .addCase(fetchUserWhatsAppConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Request verification
      .addCase(requestVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.verificationPending = true;
        state.verificationExpires = action.payload.data?.expiresAt;
      })
      .addCase(requestVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify code
      .addCase(verifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.verificationPending = false;
        state.userConfig = {
          ...state.userConfig,
          isVerified: true,
          verifiedAt: action.payload.data?.verifiedAt,
          phoneNumber: action.payload.data?.phoneNumber,
          countryCode: action.payload.data?.countryCode,
        };
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update notifications
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.success = action.payload.message;
        if (state.userConfig) {
          state.userConfig.notificationsEnabled = action.payload.data?.notificationsEnabled;
        }
      })
      // Remove user config
      .addCase(removeUserWhatsApp.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.userConfig = null;
        state.verificationPending = false;
      });
  },
});

export const { clearError, clearSuccess, updateStatus } = whatsappSlice.actions;
export default whatsappSlice.reducer;
