import api from './api';

export const dashboardService = {
  getHrDashboard: async () => {
    const res = await api.get('/dashboard/hr');
    return res.data.data;
  },
  getEmployeeDashboard: async () => {
    const res = await api.get('/dashboard/employee');
    return res.data.data;
  },
};
