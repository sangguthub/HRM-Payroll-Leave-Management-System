import React, { useState, useEffect } from 'react';
import { leaveService } from '../services/leaveService';
import { Calendar, CheckCircle, XCircle, FileText } from 'lucide-react';

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
      alert('Leave application approved! Leave balance updated.');
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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Leave Data...</div>;

  return (
    <div className="space-y-6">
      {/* 1. Leave Balances Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 transition-colors duration-200">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-blue-600 dark:text-blue-400" /> Employee Leave Balances ({new Date().getFullYear()})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-xs">
              <tr>
                <th className="p-3">Employee Name</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Allocated</th>
                <th className="p-3">Used</th>
                <th className="p-3">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {balances.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4 text-slate-400">No balance records found.</td></tr>
              ) : (
                balances.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{b.employeeName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        b.leaveType === 'CL' ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800' :
                        b.leaveType === 'SL' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {b.leaveType}
                      </span>
                    </td>
                    <td className="p-3">{b.allocated}</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400 font-bold">{b.used}</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{b.remaining}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Leave Applications & Approvals */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 transition-colors duration-200">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <FileText size={20} className="text-blue-600 dark:text-blue-400" /> Leave Applications Audit & Approval
        </h2>
        <div className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 p-4 text-center">No leave applications submitted yet.</p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="flex flex-wrap items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 gap-4">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {app.employeeName} <span className="text-xs font-mono text-blue-600 dark:text-blue-400">({app.employeeCode})</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Requested <span className="font-extrabold text-blue-600 dark:text-blue-400">{app.numberOfDays} Day(s)</span> of <span className="font-bold">{app.leaveType}</span> ({app.fromDate} to {app.toDate})
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">"{app.reason}"</p>
                </div>

                <div>
                  {app.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-md transition"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-md transition"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${
                      app.status === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
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