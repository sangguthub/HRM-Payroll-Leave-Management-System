import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { notificationService } from '../services/notificationService';
import {
  Bell,
  LogOut,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Sun,
  Moon,
  CheckCheck,
  Calendar,
  FileCheck2,
  AlertTriangle,
  Info,
  Clock,
  X,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Auto-poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [list, count] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount(),
      ]);
      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await notificationService.markAllAsRead();
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const roleColor =
    user.role === 'ROLE_ADMIN'
      ? 'bg-indigo-50/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200/90 dark:border-indigo-800 shadow-2xs'
      : user.role === 'ROLE_HR'
      ? 'bg-blue-50/90 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200/90 dark:border-blue-800 shadow-2xs'
      : 'bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800 shadow-2xs';

  const RoleIcon = user.role === 'ROLE_ADMIN' ? ShieldCheck : user.role === 'ROLE_HR' ? Briefcase : UserCheck;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'LEAVE_APPROVED':
        return <Calendar size={16} className="text-emerald-500" />;
      case 'LEAVE_REJECTED':
        return <Calendar size={16} className="text-rose-500" />;
      case 'PAYSLIP_GENERATED':
        return <FileCheck2 size={16} className="text-blue-500" />;
      case 'EMAIL_FAILED':
        return <AlertTriangle size={16} className="text-amber-500" />;
      default:
        return <Info size={16} className="text-indigo-500" />;
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-all duration-300">
      {/* Left Portal Workspace Label */}
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
          className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
          title={isDark ? 'Switch to Vibrant Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400 animate-spin-slow" />
          ) : (
            <Moon size={18} className="text-indigo-600" />
          )}
        </button>

        {/* Interactive Notification Popover Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-slate-100 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer ${
              isOpen ? 'ring-2 ring-indigo-500/50 bg-indigo-50/80 dark:bg-slate-800' : ''
            }`}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping"></span>
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border border-white dark:border-slate-900 shadow-md">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </>
            )}
          </button>

          {/* Popover Dropdown Panel */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Dropdown Header */}
              <div className="p-4 bg-slate-50/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                {notifications.length > 0 && unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={loading}
                    className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Bell size={28} className="mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No notifications yet</p>
                    <p className="text-[11px] text-slate-400">You're all caught up with your workspace alerts.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={(e) => !n.readStatus && handleMarkAsRead(n.id, e)}
                      className={`p-4 flex gap-3 items-start transition-colors duration-150 cursor-pointer ${
                        !n.readStatus
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/30 font-semibold'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 opacity-80'
                      }`}
                    >
                      <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl shadow-2xs shrink-0 mt-0.5">
                        {getNotificationIcon(n.type)}
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs ${!n.readStatus ? 'font-extrabold text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 shrink-0">
                            <Clock size={10} /> {formatTimestamp(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>

                      {!n.readStatus && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5"></span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
            className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
