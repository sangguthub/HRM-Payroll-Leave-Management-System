import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { emailService } from '../services/emailService';
import { Users, Clock, CheckCircle2, AlertTriangle, FileText, Send, RotateCw, DollarSign, TrendingUp, Sparkles, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setRefreshing(true);
    try {
      const res = await dashboardService.getHrDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading HR Analytics Engine...</p>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-rose-500 font-bold">Error loading dashboard metrics. Please try refreshing.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Enterprise HR Overview <Sparkles size={20} className="text-amber-500 animate-bounce" />
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics for workforce management, monthly payroll dispatches, and leave balances.
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
        >
          <RotateCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Metrics'}
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Employees */}
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-indigo-100/40 dark:shadow-none hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Staff</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{data.totalEmployees}</h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
              <ArrowUpRight size={12} /> Active Workforce
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
            <Users size={22} />
          </div>
        </div>

        {/* Card 2: Payroll Processed */}
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-emerald-100/40 dark:shadow-none hover:shadow-xl hover:shadow-emerald-200/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Payroll Done</p>
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tracking-tight">{data.payrollProcessed}</h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
              <CheckCircle2 size={12} /> Month Cleared
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Card 3: Pending Payroll */}
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-amber-100/40 dark:shadow-none hover:shadow-xl hover:shadow-amber-200/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Pending Batch</p>
            <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 tracking-tight">{data.pendingPayroll}</h3>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5 mt-1">
              <Clock size={12} /> Awaiting Run
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <Clock size={22} />
          </div>
        </div>

        {/* Card 4: Payslips Sent */}
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-sky-100/40 dark:shadow-none hover:shadow-xl hover:shadow-sky-200/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Payslips Sent</p>
            <h3 className="text-3xl font-black text-sky-600 dark:text-sky-400 mt-1 tracking-tight">{data.payslipsSent}</h3>
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-0.5 mt-1">
              <Send size={12} /> Email Dispatched
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/30 group-hover:scale-110 transition-transform">
            <Send size={22} />
          </div>
        </div>

        {/* Card 5: Failed Emails */}
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-rose-100/40 dark:shadow-none hover:shadow-xl hover:shadow-rose-200/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Failed Delivery</p>
            <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1 tracking-tight">{data.failedEmails}</h3>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5 mt-1">
              <AlertTriangle size={12} /> Auto Retry Queued
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-110 transition-transform">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Financial Summary Highlight Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 border border-white/20 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <DollarSign size={200} />
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
          <p className="text-xs font-extrabold text-blue-100 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={14} className="text-blue-300" /> Monthly Gross Outflow
          </p>
          <p className="text-3xl font-black mt-2 tracking-tight">₹{data.totalGrossSalary?.toLocaleString() || '0'}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
          <p className="text-xs font-extrabold text-rose-100 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-rose-300" /> Total Statutory Deductions
          </p>
          <p className="text-3xl font-black mt-2 text-rose-200 tracking-tight">₹{data.totalDeductions?.toLocaleString() || '0'}</p>
        </div>

        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <p className="text-xs font-extrabold text-emerald-100 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-300" /> Net Salary Dispatched
          </p>
          <p className="text-3xl font-black mt-2 text-emerald-300 tracking-tight">₹{data.totalNetSalary?.toLocaleString() || '0'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Delivery Audit Table */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-100/30 dark:shadow-none p-6 transition-all">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Send size={18} className="text-indigo-600 dark:text-indigo-400" /> Email Delivery Audit Log
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Automated payslip PDF delivery verification & retry log</p>
            </div>
            <button
              onClick={fetchDashboard}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 transition flex items-center gap-1.5"
            >
              <RotateCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto max-h-80 rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 uppercase font-extrabold text-[11px] sticky top-0 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Emp ID</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Delivery Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {data.recentEmailLogs?.length === 0 ? (
                  <tr><td colSpan="5" className="text-center p-6 text-xs text-slate-400 font-medium">No email logs recorded yet.</td></tr>
                ) : (
                  data.recentEmailLogs?.map((log) => (
                    <tr key={log.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 transition duration-150">
                      <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{log.employeeCode}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{log.employeeName}</td>
                      <td className="p-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{log.recipientEmail}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide border shadow-2xs ${
                          log.status === 'SENT'
                            ? 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800'
                            : 'bg-rose-100/90 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200/90 dark:border-rose-800'
                        }`}>
                          {log.status} {log.retryCount > 0 ? `(Retry ${log.retryCount})` : ''}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {log.status === 'FAILED' && (
                          <button
                            onClick={() => handleRetryEmail(log.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] px-3 py-1.5 rounded-lg font-bold shadow-xs hover:shadow transition"
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
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-100/30 dark:shadow-none p-6 transition-all space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-indigo-600 dark:text-indigo-400" /> Annual Leave Utilization
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Aggregated team leave usage totals</p>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50 shadow-2xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-blue-900 dark:text-blue-200 text-xs">Casual Leave (CL)</span>
                <span className="text-xs text-blue-700 dark:text-blue-300 font-black bg-blue-100/80 dark:bg-blue-900/60 px-2.5 py-0.5 rounded-full">{data.totalClUsed} Days Used</span>
              </div>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Standard allocation: 12 days / year</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/60 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-100 dark:border-amber-900/50 shadow-2xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-amber-900 dark:text-amber-200 text-xs">Sick Leave (SL)</span>
                <span className="text-xs text-amber-700 dark:text-amber-300 font-black bg-amber-100/80 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-full">{data.totalSlUsed} Days Used</span>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Standard allocation: 12 days / year</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-100 dark:border-emerald-900/50 shadow-2xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-emerald-900 dark:text-emerald-200 text-xs">Earned Leave (EL)</span>
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-black bg-emerald-100/80 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">{data.totalElUsed} Days Used</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Standard allocation: 15 days / year</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}