import React, { useState, useEffect } from 'react';
import { payrollService } from '../services/payrollService';
import { emailService } from '../services/emailService';
import { Download, FileSpreadsheet, Archive, Play, RefreshCw, Send, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function PayslipGenerator() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPayroll();
  }, [month, year]);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const data = await payrollService.getPayroll(month, year);
      setPayrolls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async () => {
    setProcessing(true);
    try {
      const data = await payrollService.processPayroll(Number(month), Number(year));
      alert(`Monthly payroll processed successfully for ${data.length} employees!`);
      setPayrolls(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing payroll');
    } finally {
      setProcessing(false);
    }
  };

  const handleExportExcel = () => {
    payrollService.exportExcel(month, year);
  };

  const handleExportZip = () => {
    payrollService.exportZip(month, year);
  };

  const handleDownloadPdf = (payslipId, empCode) => {
    if (!payslipId) {
      alert('Payslip PDF not generated yet.');
      return;
    }
    payrollService.downloadPayslipPdf(payslipId, `Payslip_${empCode}_${month}_${year}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Payroll Control Bar */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Select Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                <option key={m} value={m}>{new Date(2026, m - 1, 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Select Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="p-2 border border-gray-200 rounded-lg text-sm w-24 outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          <button
            onClick={handleProcessPayroll}
            disabled={processing}
            className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow transition"
          >
            <Play size={16} /> {processing ? 'Processing Payroll...' : 'Process Monthly Payroll'}
          </button>
        </div>

        {/* Bonus Export Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs font-bold transition"
          >
            <FileSpreadsheet size={16} /> Export Excel (.xlsx)
          </button>
          <button
            onClick={handleExportZip}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-xs font-bold transition"
          >
            <Archive size={16} /> Download ZIP Payslips
          </button>
        </div>
      </div>

      {/* Payroll Results Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" /> Payroll Records for {new Date(2026, month - 1, 1).toLocaleString('default', { month: 'long' })} {year} ({payrolls.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3">Emp ID</th>
                <th className="p-3">Employee Name</th>
                <th className="p-3">Gross Salary</th>
                <th className="p-3">Deductions</th>
                <th className="p-3">Net Pay</th>
                <th className="p-3">Work / Paid Days</th>
                <th className="p-3">Email Delivery</th>
                <th className="p-3 text-right">PDF Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="8" className="text-center p-6">Loading payroll records...</td></tr>
              ) : payrolls.length === 0 ? (
                <tr><td colSpan="8" className="text-center p-6 text-gray-400">No payroll processed yet for this month. Click "Process Monthly Payroll" above.</td></tr>
              ) : (
                payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-xs font-bold text-blue-600">{p.employeeCode}</td>
                    <td className="p-3 font-semibold text-gray-800">{p.employeeName}</td>
                    <td className="p-3 font-semibold text-gray-700">₹{p.grossSalary?.toLocaleString()}</td>
                    <td className="p-3 text-rose-600 font-semibold">₹{p.totalDeductions?.toLocaleString()}</td>
                    <td className="p-3 font-black text-emerald-600 text-base">₹{p.netSalary?.toLocaleString()}</td>
                    <td className="p-3 text-xs">{p.paidDays} / {p.workingDays} days</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.emailStatus === 'SENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.emailStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDownloadPdf(p.payslipId, p.employeeCode)}
                        className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-200 transition ml-auto"
                      >
                        <Download size={14} /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}