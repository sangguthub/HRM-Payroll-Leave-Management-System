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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-blue-600" /> Employee Leave Balances ({new Date().getFullYear()})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3">Employee Name</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Allocated</th>
                <th className="p-3">Used</th>
                <th className="p-3">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {balances.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4">No balance records found.</td></tr>
              ) : (
                balances.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-800">{b.employeeName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        b.leaveType === 'CL' ? 'bg-blue-100 text-blue-800' :
                        b.leaveType === 'SL' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {b.leaveType}
                      </span>
                    </td>
                    <td className="p-3">{b.allocated}</td>
                    <td className="p-3 text-amber-600 font-bold">{b.used}</td>
                    <td className="p-3 font-bold text-emerald-600">{b.remaining}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Leave Applications & Approvals */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" /> Leave Applications Audit & Approval
        </h2>
        <div className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-sm text-gray-500 p-4 text-center">No leave applications submitted yet.</p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="flex flex-wrap items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 gap-4">
                <div>
                  <p className="font-bold text-gray-800">
                    {app.employeeName} <span className="text-xs font-mono text-blue-600">({app.employeeCode})</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Requested <span className="font-extrabold text-blue-600">{app.numberOfDays} Day(s)</span> of <span className="font-bold">{app.leaveType}</span> ({app.fromDate} to {app.toDate})
                  </p>
                  <p className="text-xs text-gray-500 italic mt-0.5">"{app.reason}"</p>
                </div>

                <div>
                  {app.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow transition"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow transition"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                      app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
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