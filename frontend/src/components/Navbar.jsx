import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Search, Bell, LogOut, ShieldCheck, UserCheck, Briefcase, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);

  if (!user) return null;

  const roleColor =
    user.role === 'ROLE_ADMIN'
      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
      : user.role === 'ROLE_HR'
      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

  const RoleIcon = user.role === 'ROLE_ADMIN' ? ShieldCheck : user.role === 'ROLE_HR' ? Briefcase : UserCheck;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors duration-200">
      {/* Global Search Bar */}
      <div className="relative w-72">
        <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search employees, payroll, payslips..."
          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl transition duration-200 flex items-center justify-center"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}

        >
          {isDark ? (
            <Sun size={18} className="text-amber-400 animate-spin-slow" />
          ) : (
            <Moon size={18} className="text-slate-600" />
          )}
        </button>

        {/* Notification Pill */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

        {/* User Info & Role Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${roleColor}`}>
                <RoleIcon size={10} /> {user.role?.replace('ROLE_', '')}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{user.name}</p>
          </div>

          <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
            {user.name?.[0]}
          </div>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition ml-1"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
