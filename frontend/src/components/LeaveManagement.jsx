import React, { useState, useEffect } from 'react';
import { leaveService } from '../services/leaveService';
import { Calendar, CheckCircle, XCircle, FileText, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export default function LeaveManagement() {
  const [balances, setBalances] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaveData();
  }, []);

  const loadLeaveData = async () => {
    try {
      const [balList, appList] = await Promise.all([
        leaveService.getBalances(null, new Date().getFullYear()),
        leaveService.getAllLeaves(null),
      ]);
      setBalances(balList);
      setApplications(appList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await leaveService.approveLeave(id);
      alert('Leave application approved! Employee balance updated.');
      loadLeaveData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving leave');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:', 'Not feasible due to project deadline');
    if (reason !== null) {
      try {
        await leaveService.rejectLeave(id, reason);
        alert('Leave application rejected.');
        loadLeaveData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error rejecting leave');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Loading Leave Audit Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Leave Balances Summary */}
      <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-100/30 dark:shadow-none p-6 transition-all">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={20} className="text-indigo-600 dark:text-indigo-400" /> Workforce Leave Balances ({new Date().getFullYear()})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Annual leave quotas allocated vs consumed</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 uppercase font-extrabold text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Employee Name</th>
                <th className="p-4">Leave Type</th>
                <th className="p-4">Allocated</th>
                <th className="p-4">Used</th>
                <th className="p-4">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {balances.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-6 text-slate-400 font-semibold">No balance records found.</td></tr>
              ) : (
                balances.map((b) => (
                  <tr key={b.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 transition duration-150">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{b.employeeName}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide border shadow-2xs ${
                        b.leaveType === 'CL'
                          ? 'bg-blue-100/90 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200/90 dark:border-blue-800'
                          : b.leaveType === 'SL'
                          ? 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200/90 dark:border-amber-800'
                          : 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800'
                      }`}>
                        {b.leaveType}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold">{b.allocated} Days</td>
                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400 font-black">{b.used} Days</td>
                    <td className="p-4 font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">{b.remaining} Days</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Leave Applications & Approvals */}
      <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-100/30 dark:shadow-none p-6 transition-all">
        <div className="mb-5">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText size={20} className="text-indigo-600 dark:text-indigo-400" /> Submitted Leave Requests & Approval Queue
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Audit requested leaves and manage manager approvals</p>
        </div>

        <div className="space-y-3.5">
          {applications.length === 0 ? (
            <p className="text-xs text-slate-400 p-8 text-center bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 font-semibold">
              No leave applications submitted yet.
            </p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="flex flex-wrap items-center justify-between p-5 bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 gap-4 hover:border-indigo-300 dark:hover:border-slate-600 transition shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white text-sm">{app.employeeName}</span>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">({app.employeeCode})</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Requested <span className="font-black text-indigo-600 dark:text-indigo-400">{app.numberOfDays} Day(s)</span> of <span className="font-extrabold text-slate-900 dark:text-slate-100">{app.leaveType}</span> ({app.fromDate} to {app.toDate})
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{app.reason}"</p>
                </div>

                <div>
                  {app.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg transition cursor-pointer"
                      >
                        <CheckCircle size={15} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md shadow-rose-500/20 hover:shadow-lg transition cursor-pointer"
                      >
                        <XCircle size={15} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs px-3.5 py-1.5 rounded-full font-black tracking-wide uppercase border shadow-2xs ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800'
                        : 'bg-rose-100/90 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200/90 dark:border-rose-800'
                    }`}>
                      {app.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}