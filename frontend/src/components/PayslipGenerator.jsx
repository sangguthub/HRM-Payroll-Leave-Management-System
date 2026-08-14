import React, { useState, useEffect } from 'react';
import { payrollService } from '../services/payrollService';
import { emailService } from '../services/emailService';
import { Download, FileSpreadsheet, Archive, Play, RefreshCw, Send, CheckCircle2, AlertTriangle, FileText, Mail } from 'lucide-react';

export default function PayslipGenerator() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState(null);

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

  const handleSendEmail = async (payslipId, empName) => {
    if (!payslipId) {
      alert('Payslip PDF not generated yet.');
      return;
    }
    setSendingEmailId(payslipId);
    try {
      await emailService.sendPayslipEmail(payslipId);
      alert(`Payslip email dispatch initiated for ${empName}!`);
      fetchPayroll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending payslip email');
    } finally {
      setSendingEmailId(null);
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
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap justify-between items-center gap-4 transition-colors duration-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Select Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                <option key={m} value={m}>{new Date(2026, m - 1, 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Select Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm w-24 outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          <button
            onClick={handleProcessPayroll}
            disabled={processing}
            className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-md transition"
          >
            <Play size={16} /> {processing ? 'Processing Payroll...' : 'Process Monthly Payroll'}
          </button>
        </div>

        {/* Bonus Export Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg text-xs font-bold transition"
          >
            <FileSpreadsheet size={16} /> Export Excel (.xlsx)
          </button>
          <button
            onClick={handleExportZip}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg text-xs font-bold transition"
          >
            <Archive size={16} /> Download ZIP Payslips
          </button>
        </div>
      </div>

      {/* Payroll Results Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText size={18} className="text-blue-600 dark:text-blue-400" /> Payroll Records for {new Date(2026, month - 1, 1).toLocaleString('default', { month: 'long' })} {year} ({payrolls.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-xs">
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
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan="8" className="text-center p-6 text-slate-400">Loading payroll records...</td></tr>
              ) : payrolls.length === 0 ? (
                <tr><td colSpan="8" className="text-center p-6 text-slate-400">No payroll processed yet for this month. Click "Process Monthly Payroll" above.</td></tr>
              ) : (
                payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-3 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{p.employeeCode}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{p.employeeName}</td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">₹{p.grossSalary?.toLocaleString()}</td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold">₹{p.totalDeductions?.toLocaleString()}</td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-base">₹{p.netSalary?.toLocaleString()}</td>
                    <td className="p-3 text-xs">{p.paidDays} / {p.workingDays} days</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleSendEmail(p.payslipId, p.employeeName)}
                        disabled={sendingEmailId === p.payslipId}
                        title="Click to Send / Resend Payslip Email"
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition duration-150 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                          p.emailStatus === 'SENT'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900'
                        }`}
                      >
                        <Mail size={12} className={sendingEmailId === p.payslipId ? 'animate-spin' : ''} />
                        {sendingEmailId === p.payslipId ? 'Sending...' : p.emailStatus === 'SENT' ? 'SENT (Click to Resend)' : (p.emailStatus || 'Send Email')}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDownloadPdf(p.payslipId, p.employeeCode)}
                        className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 transition ml-auto"
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