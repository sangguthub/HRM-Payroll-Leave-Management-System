import api from './api';

export const emailService = {
  getLogs: async () => {
    const res = await api.get('/email-delivery/logs');
    return res.data.data;
  },
  retryEmail: async (id) => {
    const res = await api.post(`/email-delivery/${id}/retry`);
    return res.data.data;
  },
  sendPayslipEmail: async (payslipId) => {
    const res = await api.post(`/email-delivery/payslip/${payslipId}/send`);
    return res.data.data;
  },
};
