import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { emailService } from '../services/emailService';
import { Users, Clock, CheckCircle2, AlertTriangle, FileText, Send, RotateCw, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getHrDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryEmail = async (id) => {
    try {
      await emailService.retryEmail(id);
      alert('Email retry initiated successfully');
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Error retrying email');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading HR Metrics Dashboard...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-rose-500">Error loading dashboard metrics.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Employees</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{data.totalEmployees}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Payroll Processed</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{data.payrollProcessed}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Payroll</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{data.pendingPayroll}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Payslips Sent</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">{data.payslipsSent}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Send size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Failed Emails</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">{data.failedEmails}</h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Financial Summary Highlight Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Monthly Gross Outflow</p>
          <p className="text-2xl font-black mt-1">₹{data.totalGrossSalary?.toLocaleString() || '0'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-rose-200 uppercase tracking-wider">Total Statuary Deductions</p>
          <p className="text-2xl font-black mt-1 text-rose-300">₹{data.totalDeductions?.toLocaleString() || '0'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">Total Net Salary Paid</p>
          <p className="text-3xl font-black mt-1 text-emerald-400">₹{data.totalNetSalary?.toLocaleString() || '0'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Delivery Audit Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Send size={18} className="text-blue-600" /> Email Delivery Audit Log
            </h2>
            <button onClick={fetchDashboard} className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
              <RotateCw size={14} /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs sticky top-0">
                <tr>
                  <th className="p-3">Emp ID</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentEmailLogs?.length === 0 ? (
                  <tr><td colSpan="5" className="text-center p-4 text-xs">No email logs recorded yet.</td></tr>
                ) : (
                  data.recentEmailLogs?.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-mono text-xs font-bold text-blue-600">{log.employeeCode}</td>
                      <td className="p-3 font-medium text-gray-800">{log.employeeName}</td>
                      <td className="p-3 text-xs">{log.recipientEmail}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          log.status === 'SENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {log.status} {log.retryCount > 0 ? `(Retry ${log.retryCount})` : ''}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {log.status === 'FAILED' && (
                          <button
                            onClick={() => handleRetryEmail(log.id)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs px-2.5 py-1 rounded font-bold transition"
                          >
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave Allocation & Usage Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" /> Annual Leave Usage
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-blue-900">Casual Leave (CL)</span>
                <span className="text-sm text-blue-700 font-bold">{data.totalClUsed} Days Used</span>
              </div>
              <p className="text-xs text-blue-600">Standard annual allocation: 12 days / employee</p>
            </div>

            <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-amber-900">Sick Leave (SL)</span>
                <span className="text-sm text-amber-700 font-bold">{data.totalSlUsed} Days Used</span>
              </div>
              <p className="text-xs text-amber-600">Standard annual allocation: 12 days / employee</p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-emerald-900">Earned Leave (EL)</span>
                <span className="text-sm text-emerald-700 font-bold">{data.totalElUsed} Days Used</span>
              </div>
              <p className="text-xs text-emerald-600">Standard annual allocation: 15 days / employee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}