import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogIn, Lock, Mail, ShieldCheck, UserCheck, Briefcase, Building2, Sun, Moon } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AuthContext);
  const { toggleTheme, isDark } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-200">
      {/* Top Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 rounded-2xl shadow-lg transition-all duration-200 flex items-center gap-2 text-xs font-bold z-20"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? (
          <>
            <Sun size={16} className="text-amber-400" /> Light Mode
          </>
        ) : (
          <>
            <Moon size={16} className="text-slate-600" /> Dark Mode
          </>
        )}
      </button>

      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10 backdrop-blur-md transition-colors duration-200">
        {/* Header Banner */}
        <div className="gradient-primary p-8 text-center text-white relative">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-xl">
            <Building2 size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">HRM Payroll Portal</h1>
          <p className="text-xs text-blue-100 mt-1 font-medium">Salary Structure & Payslip Automation System</p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs rounded-xl font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 gradient-primary hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In to Portal</>}
            </button>
          </form>

          {/* Quick Login Auto-Fill Buttons */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Demo Quick Login Credentials</p>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@hrm.com', 'Admin@123')}
                className="p-2.5 bg-slate-50 dark:bg-slate-950/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition group"
              >
                <ShieldCheck size={16} className="text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition" /> Admin
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('hr@hrm.com', 'Hr@123')}
                className="p-2.5 bg-slate-50 dark:bg-slate-950/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition group"
              >
                <Briefcase size={16} className="text-blue-500 dark:text-blue-400 group-hover:scale-110 transition" /> HR Manager
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('employee@hrm.com', 'Employee@123')}
                className="p-2.5 bg-slate-50 dark:bg-slate-950/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition group"
              >
                <UserCheck size={16} className="text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition" /> Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
