import api from './api';

export const salaryService = {
  getAllStructures: async () => {
    const res = await api.get('/salary-structures');
    return res.data.data;
  },
  createStructure: async (data) => {
    const res = await api.post('/salary-structures', data);
    return res.data.data;
  },
  updateStructure: async (id, data) => {
    const res = await api.put(`/salary-structures/${id}`, data);
    return res.data.data;
  },
  assignSalary: async (data) => {
    const res = await api.post('/salary-structures/assign', data);
    return res.data;
  },
  getActiveSalaryForEmployee: async (employeeId) => {
    const res = await api.get(`/salary-structures/employee/${employeeId}`);
    return res.data.data;
  },
  getSalaryHistoryForEmployee: async (employeeId) => {
    const res = await api.get(`/salary-structures/employee/${employeeId}/history`);
    return res.data.data;
  },
};
