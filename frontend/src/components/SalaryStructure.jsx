import React, { useState, useEffect } from 'react';
import { salaryService } from '../services/salaryService';
import { employeeService } from '../services/employeeService';
import { Plus, Check, Wallet, UserCheck } from 'lucide-react';

export default function SalaryStructure() {
  const [structures, setStructures] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [selectedStructureId, setSelectedStructureId] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  // New Structure Form state
  const [formData, setFormData] = useState({
    name: 'Custom Structure',
    description: 'Custom Grade Structure',
    basicSalary: 20000,
    hra: 8000,
    specialAllowance: 7000,
    pf: 2400,
    esi: 0,
    professionalTax: 200,
  });

  const grossSalary = Number(formData.basicSalary) + Number(formData.hra) + Number(formData.specialAllowance);
  const totalDeductions = Number(formData.pf) + Number(formData.esi) + Number(formData.professionalTax);
  const netSalary = grossSalary - totalDeductions;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [structs, emps] = await Promise.all([
        salaryService.getAllStructures(),
        employeeService.getAll(),
      ]);
      setStructures(structs);
      setEmployees(emps);
      if (structs.length > 0) setSelectedStructureId(structs[0].id);
      if (emps.length > 0) setSelectedEmpId(emps[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStructure = async (e) => {
    e.preventDefault();
    try {
      await salaryService.createStructure({ ...formData, grossSalary, totalDeductions, netSalary });
      alert('Salary structure created successfully!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating structure');
    }
  };

  const handleAssignStructure = async (e) => {
    e.preventDefault();
    try {
      await salaryService.assignSalary({
        employeeId: Number(selectedEmpId),
        salaryStructureId: Number(selectedStructureId),
        effectiveFrom,
      });
      alert('Salary structure assigned successfully to employee!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error assigning salary structure');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Salary Configuration...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Assign Salary Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors duration-200">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <UserCheck size={20} className="text-blue-600 dark:text-blue-400" /> Assign Salary Structure
        </h2>
        <form onSubmit={handleAssignStructure} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Select Employee</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeCode})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Select Salary Template</label>
            <select
              value={selectedStructureId}
              onChange={(e) => setSelectedStructureId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {structures.map((st) => (
                <option key={st.id} value={st.id}>{st.name} (Gross: ₹{st.grossSalary?.toLocaleString()})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Effective Date</label>
            <input
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition"
          >
            Assign Salary & Update History
          </button>
        </form>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Configured Structures ({structures.length})</h3>
          <div className="space-y-2">
            {structures.map((s) => (
              <div key={s.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-800 dark:text-slate-200">{s.name}</div>
                <div className="text-slate-500 dark:text-slate-400 flex justify-between mt-1">
                  <span>Gross: ₹{s.grossSalary?.toLocaleString()}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Net: ₹{s.netSalary?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Configure / Add New Salary Template */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Wallet size={20} className="text-blue-600 dark:text-blue-400" /> Create Salary Component Structure
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Calculates Gross, Deductions, and Net Salary dynamically</p>
          </div>
        </div>

        <form onSubmit={handleCreateStructure} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Structure Template Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Description / Grade</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Earnings */}
          <div>
            <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">Earnings Components</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Basic Salary (₹)</label>
                <input
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">HRA (₹)</label>
                <input
                  type="number"
                  value={formData.hra}
                  onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Special Allowance (₹)</label>
                <input
                  type="number"
                  value={formData.specialAllowance}
                  onChange={(e) => setFormData({ ...formData, specialAllowance: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-2">Deductions Components</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Provident Fund (PF) (₹)</label>
                <input
                  type="number"
                  value={formData.pf}
                  onChange={(e) => setFormData({ ...formData, pf: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">ESI (₹)</label>
                <input
                  type="number"
                  value={formData.esi}
                  onChange={(e) => setFormData({ ...formData, esi: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Professional Tax (₹)</label>
                <input
                  type="number"
                  value={formData.professionalTax}
                  onChange={(e) => setFormData({ ...formData, professionalTax: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Calculations Summary Box */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Gross Salary</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">₹{grossSalary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Deductions</p>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400">₹{totalDeductions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Net Payable</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{netSalary.toLocaleString()}</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition"
          >
            Save New Salary Template
          </button>
        </form>
      </div>
    </div>
  );
}