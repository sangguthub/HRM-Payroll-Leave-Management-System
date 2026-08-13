import api from './api';

export const employeeService = {
  getAll: async () => {
    const res = await api.get('/employees');
    return res.data.data;
  },
  getById: async (id) => {
    const res = await api.get(`/employees/${id}`);
    return res.data.data;
  },
  create: async (data) => {
    const res = await api.post('/employees', data);
    return res.data.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/employees/${id}`, data);
    return res.data.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/employees/${id}`);
    return res.data;
  },
};
