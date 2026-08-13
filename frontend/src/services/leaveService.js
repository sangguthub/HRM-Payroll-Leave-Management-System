import api from './api';

export const leaveService = {
  getPolicies: async () => {
    const res = await api.get('/leaves/policies');
    return res.data.data;
  },
  updatePolicy: async (id, data) => {
    const res = await api.put(`/leaves/policies/${id}`, data);
    return res.data.data;
  },
  getBalances: async (employeeId, year) => {
    const params = {};
    if (employeeId) params.employeeId = employeeId;
    if (year) params.year = year;
    const res = await api.get('/leaves/balances', { params });
    return res.data.data;
  },
  applyLeave: async (data) => {
    const res = await api.post('/leaves', data);
    return res.data.data;
  },
  getMyLeaves: async () => {
    const res = await api.get('/leaves/my');
    return res.data.data;
  },
  getAllLeaves: async (status) => {
    const params = status ? { status } : {};
    const res = await api.get('/leaves', { params });
    return res.data.data;
  },
  approveLeave: async (id) => {
    const res = await api.put(`/leaves/${id}/approve`);
    return res.data.data;
  },
  rejectLeave: async (id, rejectionReason) => {
    const res = await api.put(`/leaves/${id}/reject`, { rejectionReason });
    return res.data.data;
  },
};
