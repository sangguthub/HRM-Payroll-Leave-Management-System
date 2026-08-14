import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { leaveService } from '../services/leaveService';
import { payrollService } from '../services/payrollService';
import { User, Calendar, FileText, Download, Send, PlusCircle, CheckCircle, Clock } from 'lucide-react';

export default function EmployeeView() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Leave Form State
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'CL',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    reason: '',
  });

  useEffect(() => {
    loadEmployeeDashboard();
  }, []);

  const loadEmployeeDashboard = async () => {
    try {
      const res = await dashboardService.getEmployeeDashboard();
      const leaves = await leaveService.getMyLeaves();
      setData(res);
      setMyLeaves(leaves);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await leaveService.applyLeave({
        employeeId: data?.profile?.id,
        leaveType: leaveForm.leaveType,
        fromDate: leaveForm.fromDate,
        toDate: leaveForm.toDate,
        reason: leaveForm.reason,
      });
      alert('Leave application submitted successfully!');
      setLeaveForm({ ...leaveForm, reason: '' });
      loadEmployeeDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying for leave');
    }
  };

  const handleDownloadPdf = (payslipId, payPeriod) => {
    if (!payslipId) {
      alert('Payslip PDF not ready.');
      return;
    }
    payrollService.downloadPayslipPdf(payslipId, `Payslip_${payPeriod}.pdf`);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Employee Portal...</div>;

  return (
    <div className="space-y-6">
      {/* 1. Employee Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap justify-between items-center gap-4 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-black shadow-md shadow-blue-500/20">
            {data?.profile?.firstName?.[0]}{data?.profile?.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{data?.profile?.fullName}</h1>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{data?.profile?.designation} • {data?.profile?.departmentName}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Emp Code: <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{data?.profile?.employeeCode}</span> | Email: {data?.profile?.email}</p>
          </div>
        </div>

        <div className="text-right text-xs bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Date of Joining</p>
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{data?.profile?.dateOfJoining}</p>
        </div>
      </div>

      {/* 2. Leave Balances Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Calendar size={20} className="text-blue-600 dark:text-blue-400" /> My Annual Leave Balances
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.leaveBalances?.map((b) => (
            <div key={b.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{b.leaveType === 'CL' ? 'Casual Leave (CL)' : b.leaveType === 'SL' ? 'Sick Leave (SL)' : 'Earned Leave (EL)'}</span>
                <span className="text-xs bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-bold border border-blue-200 dark:border-blue-800">{b.remaining} Remaining</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span>Allocated: <strong>{b.allocated}</strong></span>
                <span>Used: <strong className="text-amber-600 dark:text-amber-400">{b.used}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Apply Leave Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <PlusCircle size={18} className="text-blue-600 dark:text-blue-400" /> Apply for Leave
          </h2>
          <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Leave Type</label>
              <select
                value={leaveForm.leaveType}
                onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CL">Casual Leave (CL)</option>
                <option value="SL">Sick Leave (SL)</option>
                <option value="EL">Earned Leave (EL)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">From Date</label>
                <input
                  type="date"
                  required
                  value={leaveForm.fromDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">To Date</label>
                <input
                  type="date"
                  required
                  value={leaveForm.toDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Reason</label>
              <textarea
                required
                rows="2"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                placeholder="Reason for leave request..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition"
            >
              Submit Leave Application
            </button>
          </form>
        </div>

        {/* 4. Leave History */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock size={18} className="text-blue-600 dark:text-blue-400" /> My Leave Application History
          </h2>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {myLeaves.length === 0 ? (
              <p className="text-xs text-slate-400">No leave applications submitted yet.</p>
            ) : (
              myLeaves.map((l) => (
                <div key={l.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{l.leaveType}</span> ({l.numberOfDays} Days: {l.fromDate} to {l.toDate})
                    <p className="text-slate-500 dark:text-slate-400 italic mt-0.5">"{l.reason}"</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    l.status === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                    l.status === 'REJECTED' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800' : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }`}>
                    {l.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. My Payslips Table & Download */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 transition-colors duration-200">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <FileText size={20} className="text-blue-600 dark:text-blue-400" /> My Monthly Payslips
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-xs">
              <tr>
                <th className="p-3">Pay Period</th>
                <th className="p-3">Gross Salary</th>
                <th className="p-3">Total Deductions</th>
                <th className="p-3">Net Salary</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data?.recentPayslips?.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4 text-slate-400">No payslips generated yet.</td></tr>
              ) : (
                data?.recentPayslips?.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{p.payPeriodFormatted}</td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">₹{p.grossSalary?.toLocaleString()}</td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold">₹{p.totalDeductions?.toLocaleString()}</td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-base">₹{p.netSalary?.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDownloadPdf(p.payslipId, p.payPeriodFormatted)}
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
