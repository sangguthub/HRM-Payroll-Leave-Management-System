import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import SalaryStructure from './components/SalaryStructure';
import LeaveManagement from './components/LeaveManagement';
import PayslipGenerator from './components/PayslipGenerator';
import EmployeeView from './components/EmployeeView';

function AppLayout() {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-400 text-sm font-semibold">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        Loading System Engine...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const isHrOrAdmin = user.role === 'ROLE_HR' || user.role === 'ROLE_ADMIN';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sleek Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={user.role} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {isHrOrAdmin ? (
            <>
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'employees' && <EmployeeManagement />}
              {activeTab === 'salary' && <SalaryStructure />}
              {activeTab === 'leave' && <LeaveManagement />}
              {activeTab === 'payroll' && <PayslipGenerator />}
            </>
          ) : (
            <EmployeeView />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}