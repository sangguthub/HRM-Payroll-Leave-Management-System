import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import { Users, UserPlus, Search, Edit3, Trash2, Mail, Phone, Calendar, Shield, Sparkles, Filter } from 'lucide-react';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfJoining: '2026-01-01',
    departmentId: 1,
    designation: 'Software Engineer',
    password: 'Employee@123',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeService.create(formData);
      alert('Employee created successfully!');
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating employee');
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      try {
        await employeeService.delete(id);
        fetchEmployees();
      } catch (err) {
        alert('Error deactivating employee');
      }
    }
  };

  const filtered = employees.filter((emp) =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-100/30 dark:shadow-none flex flex-wrap gap-4 justify-between items-center transition-all">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, EMP code, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
        >
          <UserPlus size={16} /> Provision New Employee
        </button>
      </div>

      {/* Employee List Table */}
      <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-100/30 dark:shadow-none overflow-hidden transition-all">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <Users size={18} className="text-indigo-600 dark:text-indigo-400" /> Workforce Directory ({filtered.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active personnel records and department assignments</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 uppercase font-extrabold text-[11px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-4">Emp ID</th>
                <th className="p-4">Employee Name</th>
                <th className="p-4">Email & Phone</th>
                <th className="p-4">Department</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Joining Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {loading ? (
                <tr><td colSpan="8" className="text-center p-8 text-slate-400 font-semibold">Loading workforce directory...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" className="text-center p-8 text-slate-400 font-semibold">No employees matched your filter.</td></tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 transition duration-150">
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{emp.employeeCode}</td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-black flex items-center justify-center text-xs">
                        {emp.fullName?.[0]}
                      </div>
                      {emp.fullName}
                    </td>
                    <td className="p-4 text-xs">
                      <div className="text-slate-800 dark:text-slate-200 font-semibold">{emp.email}</div>
                      <div className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">{emp.phone || 'No phone'}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-indigo-50/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px] px-3 py-1 rounded-full border border-indigo-200/90 dark:border-indigo-800 shadow-2xs">
                        {emp.departmentName}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{emp.designation}</td>
                    <td className="p-4 text-xs font-mono text-slate-500 dark:text-slate-400">{emp.dateOfJoining}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide border shadow-2xs ${
                        emp.status === 'ACTIVE'
                          ? 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800'
                          : 'bg-rose-100/90 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200/90 dark:border-rose-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeactivate(emp.id)}
                        className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title="Deactivate Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-lg w-full rounded-3xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-600 dark:text-indigo-400" /> Provision New Employee Account
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Employee Code</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    placeholder="EMP006"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="new.emp@company.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value={1}>Engineering</option>
                    <option value={2}>Human Resources</option>
                    <option value={3}>Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-black shadow-md shadow-indigo-500/25 hover:shadow-lg transition"
                >
                  Create & Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
