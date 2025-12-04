import api from './api';

const organizationService = {
  // ========== DEPARTMENTS ==========
  
  // Listar departamentos
  listDepartments: async (params = {}) => {
    const response = await api.get('/organization/departments', { params });
    return response.data;
  },

  // Obtener árbol de departamentos
  getDepartmentTree: async () => {
    const response = await api.get('/organization/departments/tree');
    return response.data;
  },

  // Obtener departamento por ID
  getDepartmentById: async (id) => {
    const response = await api.get(`/organization/departments/${id}`);
    return response.data;
  },

  // Crear departamento
  createDepartment: async (data) => {
    const response = await api.post('/organization/departments', data);
    return response.data;
  },

  // Actualizar departamento
  updateDepartment: async (id, data) => {
    const response = await api.put(`/organization/departments/${id}`, data);
    return response.data;
  },

  // Eliminar departamento
  deleteDepartment: async (id) => {
    const response = await api.delete(`/organization/departments/${id}`);
    return response.data;
  },

  // ========== POSITIONS ==========

  // Listar posiciones
  listPositions: async (params = {}) => {
    const response = await api.get('/organization/positions', { params });
    return response.data;
  },

  // Obtener posición por ID
  getPositionById: async (id) => {
    const response = await api.get(`/organization/positions/${id}`);
    return response.data;
  },

  // Crear posición
  createPosition: async (data) => {
    const response = await api.post('/organization/positions', data);
    return response.data;
  },

  // Actualizar posición
  updatePosition: async (id, data) => {
    const response = await api.put(`/organization/positions/${id}`, data);
    return response.data;
  },

  // Eliminar posición
  deletePosition: async (id) => {
    const response = await api.delete(`/organization/positions/${id}`);
    return response.data;
  },

  // ========== ORGANIGRAMA Y DIRECTORIO ==========

  // Obtener organigrama
  getOrgChart: async () => {
    const response = await api.get('/organization/org-chart');
    return response.data;
  },

  // Obtener directorio
  getDirectory: async (params = {}) => {
    const response = await api.get('/organization/directory', { params });
    return response.data;
  },

  // Obtener estadísticas
  getOrgStats: async () => {
    const response = await api.get('/organization/stats');
    return response.data;
  },

  // ========== EMPLOYEE BANK ACCOUNTS ==========

  // Listar cuentas bancarias de un empleado
  listBankAccounts: async (employeeId) => {
    const response = await api.get(`/employee-bank-accounts/employee/${employeeId}`);
    return response.data;
  },

  // Obtener cuenta bancaria por ID
  getBankAccountById: async (id) => {
    const response = await api.get(`/employee-bank-accounts/${id}`);
    return response.data;
  },

  // Crear cuenta bancaria
  createBankAccount: async (data) => {
    const response = await api.post('/employee-bank-accounts', data);
    return response.data;
  },

  // Actualizar cuenta bancaria
  updateBankAccount: async (id, data) => {
    const response = await api.put(`/employee-bank-accounts/${id}`, data);
    return response.data;
  },

  // Eliminar cuenta bancaria
  deleteBankAccount: async (id) => {
    const response = await api.delete(`/employee-bank-accounts/${id}`);
    return response.data;
  },

  // Establecer como primaria
  setBankAccountPrimary: async (id) => {
    const response = await api.post(`/employee-bank-accounts/${id}/set-primary`);
    return response.data;
  },

  // Verificar cuenta bancaria
  verifyBankAccount: async (id) => {
    const response = await api.post(`/employee-bank-accounts/${id}/verify`);
    return response.data;
  },
};

export default organizationService;
