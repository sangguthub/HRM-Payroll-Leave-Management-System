import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogIn, Lock, Mail, ShieldCheck, UserCheck, Briefcase, Building2, Sun, Moon, Sparkles, KeyRound } from 'lucide-react';
import gsap from 'gsap';

export default function Login() {
  const { login } = useContext(AuthContext);
  const { toggleTheme, isDark } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // GSAP Animation Refs
  const cardRef = useRef(null);
  const bannerRef = useRef(null);
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const demoButtonsRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance animation for the main card
      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0, scale: 0.92, rotationX: -10 },
        { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1.2, ease: 'power4.out' }
      );

      // 2. Logo spin & pop
      gsap.fromTo(
        logoRef.current,
        { scale: 0, rotate: -180 },
        { scale: 1, rotate: 0, duration: 0.9, delay: 0.3, ease: 'back.out(2)' }
      );

      // 3. Staggered banner text
      gsap.fromTo(
        bannerRef.current?.children || [],
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, delay: 0.4, ease: 'power3.out' }
      );

      // 4. Staggered form elements
      if (formRef.current) {
        gsap.fromTo(
          formRef.current.children,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, delay: 0.6, ease: 'power2.out' }
        );
      }

      // 5. Demo quick login buttons pop-in
      if (demoButtonsRef.current) {
        gsap.fromTo(
          demoButtonsRef.current.children,
          { opacity: 0, scale: 0.8, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.9, ease: 'back.out(1.6)' }
        );
      }

      // 6. Continuous ambient background fluid motion
      gsap.to(blob1Ref.current, {
        x: 60,
        y: -40,
        scale: 1.3,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(blob2Ref.current, {
        x: -70,
        y: 50,
        scale: 0.85,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(blob3Ref.current, {
        x: 40,
        y: 40,
        scale: 1.15,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Pulse animation on submit
    gsap.to(cardRef.current, { scale: 0.98, duration: 0.15, yoyo: true, repeat: 1 });

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      // Shake animation on error
      gsap.to(cardRef.current, { x: [-8, 8, -6, 6, -3, 3, 0], duration: 0.4, ease: 'power2.inOut' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Top Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 text-xs font-black z-30 cursor-pointer"
        title={isDark ? 'Switch to Vibrant Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? (
          <>
            <Sun size={16} className="text-amber-400 animate-spin-slow" /> Light Mode
          </>
        ) : (
          <>
            <Moon size={16} className="text-indigo-600" /> Dark Mode
          </>
        )}
      </button>

      {/* GSAP Fluid Animated Background Blobs */}
      <div
        ref={blob1Ref}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 dark:from-blue-600/30 dark:to-indigo-600/30 rounded-full blur-3xl pointer-events-none"
      ></div>
      <div
        ref={blob2Ref}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 dark:from-purple-600/30 dark:to-pink-600/30 rounded-full blur-3xl pointer-events-none"
      ></div>
      <div
        ref={blob3Ref}
        className="absolute top-1/2 right-1/3 w-80 h-80 bg-gradient-to-tr from-emerald-500/15 to-teal-500/15 dark:from-emerald-600/20 dark:to-teal-600/20 rounded-full blur-3xl pointer-events-none"
      ></div>

      {/* Main Glassmorphic Login Card */}
      <div
        ref={cardRef}
        className="max-w-md w-full bg-white/85 dark:bg-slate-900/90 border border-white/60 dark:border-slate-800 rounded-3xl shadow-2xl shadow-indigo-500/10 dark:shadow-black/60 overflow-hidden relative z-10 backdrop-blur-xl transition-all duration-300"
      >
        {/* Header Banner with Gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div
            ref={logoRef}
            className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-xl shadow-indigo-900/30"
          >
            <Building2 size={32} className="text-white drop-shadow-md" />
          </div>

          <div ref={bannerRef} className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight flex items-center justify-center gap-2">
              HRM Payroll Portal <Sparkles size={18} className="text-amber-300 animate-pulse" />
            </h1>
            <p className="text-xs text-blue-100 font-medium">Enterprise Salary & Leave Automation System</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs rounded-xl font-bold flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>{error}</span>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white rounded-xl text-xs font-semibold placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white rounded-xl text-xs font-semibold placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <>
                  <LogIn size={16} /> Sign In to Portal
                </>
              )}
            </button>
          </form>

          {/* Quick Login Auto-Fill Buttons */}
          <div className="border-t border-slate-200/80 dark:border-slate-800 pt-5 space-y-3">
            <p className="text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-1">
              <KeyRound size={12} className="text-indigo-500" /> Demo Quick Login Credentials
            </p>

            <div ref={demoButtonsRef} className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@hrm.com', 'Admin@123')}
                className="p-2.5 bg-slate-50/90 dark:bg-slate-950/90 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs group cursor-pointer"
              >
                <ShieldCheck size={18} className="text-indigo-500 dark:text-indigo-400 group-hover:rotate-12 transition-transform" /> Admin
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('hr@hrm.com', 'Hr@123')}
                className="p-2.5 bg-slate-50/90 dark:bg-slate-950/90 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs group cursor-pointer"
              >
                <Briefcase size={18} className="text-blue-500 dark:text-blue-400 group-hover:rotate-12 transition-transform" /> HR Manager
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('employee@hrm.com', 'Employee@123')}
                className="p-2.5 bg-slate-50/90 dark:bg-slate-950/90 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs group cursor-pointer"
              >
                <UserCheck size={18} className="text-emerald-500 dark:text-emerald-400 group-hover:rotate-12 transition-transform" /> Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
