import { createSlice } from '@reduxjs/toolkit';

// Get initial theme mode from localStorage
const getInitialThemeMode = () => {
  const saved = localStorage.getItem('themeMode');
  if (saved) return saved;
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const initialState = {
  themeMode: getInitialThemeMode(),
  sidebarOpen: true,
  formDrafts: {}, // For auto-save feature: { formId: { data, timestamp } }
  pushNotificationsEnabled: false,
  pushSubscription: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
      localStorage.setItem('themeMode', action.payload);
    },
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.themeMode);
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    // Form drafts for auto-save
    saveDraft: (state, action) => {
      const { formId, data } = action.payload;
      state.formDrafts[formId] = {
        data,
        timestamp: Date.now(),
      };
      // Also save to localStorage for persistence
      try {
        const drafts = JSON.parse(localStorage.getItem('formDrafts') || '{}');
        drafts[formId] = { data, timestamp: Date.now() };
        localStorage.setItem('formDrafts', JSON.stringify(drafts));
      } catch (e) {
        console.error('Error saving draft to localStorage:', e);
      }
    },
    loadDraft: (state, action) => {
      const formId = action.payload;
      try {
        const drafts = JSON.parse(localStorage.getItem('formDrafts') || '{}');
        if (drafts[formId]) {
          state.formDrafts[formId] = drafts[formId];
        }
      } catch (e) {
        console.error('Error loading draft from localStorage:', e);
      }
    },
    clearDraft: (state, action) => {
      const formId = action.payload;
      delete state.formDrafts[formId];
      try {
        const drafts = JSON.parse(localStorage.getItem('formDrafts') || '{}');
        delete drafts[formId];
        localStorage.setItem('formDrafts', JSON.stringify(drafts));
      } catch (e) {
        console.error('Error clearing draft from localStorage:', e);
      }
    },
    clearAllDrafts: (state) => {
      state.formDrafts = {};
      localStorage.removeItem('formDrafts');
    },
    // Push notifications
    setPushNotificationsEnabled: (state, action) => {
      state.pushNotificationsEnabled = action.payload;
      localStorage.setItem('pushNotificationsEnabled', JSON.stringify(action.payload));
    },
    setPushSubscription: (state, action) => {
      state.pushSubscription = action.payload;
    },
  },
});

export const {
  setThemeMode,
  toggleThemeMode,
  setSidebarOpen,
  toggleSidebar,
  saveDraft,
  loadDraft,
  clearDraft,
  clearAllDrafts,
  setPushNotificationsEnabled,
  setPushSubscription,
} = uiSlice.actions;

export default uiSlice.reducer;
