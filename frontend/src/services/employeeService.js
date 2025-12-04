import api from './api';

const employeeService = {
  // Listar empleados con paginación y filtros
  list: async (params = {}) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  // Obtener empleado por ID
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Obtener empleado con todas sus relaciones (trazabilidad completa)
  getFullById: async (id) => {
    const response = await api.get(`/employees/${id}/full`);
    return response.data;
  },

  // Crear empleado
  create: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  // Actualizar empleado
  update: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  // Eliminar empleado
  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Obtener estadísticas
  getStats: async () => {
    const response = await api.get('/employees/stats');
    return response.data;
  },

  // Obtener documentos por vencer
  getExpiringDocuments: async (days = 30) => {
    const response = await api.get('/employees/expiring-documents', {
      params: { days },
    });
    return response.data;
  },
};

export default employeeService;
