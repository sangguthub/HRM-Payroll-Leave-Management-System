import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Bell, LogOut, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  const roleColor =
    user.role === 'ROLE_ADMIN'
      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
      : user.role === 'ROLE_HR'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  const RoleIcon = user.role === 'ROLE_ADMIN' ? ShieldCheck : user.role === 'ROLE_HR' ? Briefcase : UserCheck;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Global Search Bar */}
      <div className="relative w-72">
        <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search employees, payroll, payslips..."
          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Pill */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Info & Role Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${roleColor}`}>
                <RoleIcon size={10} /> {user.role?.replace('ROLE_', '')}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{user.name}</p>
          </div>

          <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
            {user.name?.[0]}
          </div>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition ml-1"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
