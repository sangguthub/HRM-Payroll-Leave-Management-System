import api from './api';

export const payrollService = {
  processPayroll: async (month, year, employeeId = null) => {
    const res = await api.post('/payroll/process', { month, year, employeeId });
    return res.data.data;
  },
  getPayroll: async (month, year) => {
    const res = await api.get('/payroll', { params: { month, year } });
    return res.data.data;
  },
  getEmployeePayrollHistory: async (employeeId) => {
    const res = await api.get(`/payroll/employee/${employeeId}`);
    return res.data.data;
  },
  exportExcel: async (month, year) => {
    const response = await api.get('/payroll/export/excel', {
      params: { month, year },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Monthly_Payroll_${month}_${year}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  exportZip: async (month, year) => {
    const response = await api.get('/payroll/export/zip', {
      params: { month, year },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Payslips_${month}_${year}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  downloadPayslipPdf: async (payslipId, fileName = 'payslip.pdf') => {
    const response = await api.get(`/payslips/${payslipId}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
