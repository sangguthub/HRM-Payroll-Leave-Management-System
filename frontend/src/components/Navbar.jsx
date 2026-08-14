import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Bell, LogOut, ShieldCheck, UserCheck, Briefcase, Sun, Moon, Sparkles, Building2 } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);

  if (!user) return null;

  const roleColor =
    user.role === 'ROLE_ADMIN'
      ? 'bg-indigo-50/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200/90 dark:border-indigo-800 shadow-2xs'
      : user.role === 'ROLE_HR'
      ? 'bg-blue-50/90 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200/90 dark:border-blue-800 shadow-2xs'
      : 'bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800 shadow-2xs';

  const RoleIcon = user.role === 'ROLE_ADMIN' ? ShieldCheck : user.role === 'ROLE_HR' ? Briefcase : UserCheck;

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-all duration-300">
      {/* Left Portal Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-slate-900 dark:text-white tracking-wide uppercase bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          ACME Payroll Workspace
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Active Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 rounded-full text-[11px] font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Active
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs"
          title={isDark ? 'Switch to Vibrant Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400 animate-spin-slow" />
          ) : (
            <Moon size={18} className="text-indigo-600" />
          )}
        </button>

        {/* Notification Pill */}
        <button className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition duration-200">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping"></span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

        {/* User Info & Role Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${roleColor}`}>
                <RoleIcon size={11} /> {user.role?.replace('ROLE_', '')}
              </span>
            </div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">{user.name}</p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/25 border border-indigo-400/30">
            {user.name?.[0]}
          </div>

          <button
            onClick={logout}
            className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition duration-200 hover:scale-105 active:scale-95"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
