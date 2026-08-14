import React from 'react';
import { LayoutDashboard, Users, Wallet, Calendar, FileCheck2, Building2, Sparkles, Layers } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, role }) {
  const isHrOrAdmin = role === 'ROLE_HR' || role === 'ROLE_ADMIN';

  const menuItems = isHrOrAdmin ? [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'employees', label: 'Employee Directory', icon: Users, badge: null },
    { id: 'salary', label: 'Salary Structure', icon: Wallet, badge: null },
    { id: 'leave', label: 'Leave Audit', icon: Calendar, badge: 'Live' },
    { id: 'payroll', label: 'Payroll & Payslips', icon: FileCheck2, badge: 'Auto' },
  ] : [
    { id: 'employee-portal', label: 'My Portal', icon: LayoutDashboard, badge: null },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 dark:bg-slate-950 text-slate-300 min-h-screen flex flex-col border-r border-slate-800/90 dark:border-slate-900 shrink-0 transition-colors duration-200 shadow-xl">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/25 border border-indigo-400/30">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-sm tracking-tight leading-tight flex items-center gap-1">
              HRM Payroll
            </h1>
            <span className="text-[10px] bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent font-bold tracking-wider uppercase">Enterprise Suite</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-4 space-y-6 flex-1">
        <div>
          <p className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">Core Modules</p>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Feature Highlights Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/60 text-xs text-slate-300 space-y-2 shadow-inner">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Sparkles size={14} className="text-amber-400" /> Automated Payroll Engine
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Auto-calculates attendance pro-rata, generates PDF payslips, and dispatches email notifications.
          </p>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between font-medium">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Service Operational
        </span>
        <span className="font-mono text-[10px] text-slate-500">v1.0.0</span>
      </div>
    </aside>
  );
}
