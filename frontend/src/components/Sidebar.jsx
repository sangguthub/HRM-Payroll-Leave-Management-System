import React from 'react';
import { LayoutDashboard, Users, Wallet, Calendar, FileCheck2, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

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
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-sm tracking-tight leading-none">HRM Payroll</h1>
            <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">Automation Hub</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-4 space-y-6 flex-1">
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Main Navigation</p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-950 text-blue-400 border border-blue-800/50'
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
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/50 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Sparkles size={14} className="text-amber-400" /> Automated Workflow
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Calculates pro-rata working days, auto-generates PDF payslips, and dispatches email attachments.
          </p>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Service Active
        </span>
        <span className="font-mono text-[10px]">v1.0.0</span>
      </div>
    </aside>
  );
}
