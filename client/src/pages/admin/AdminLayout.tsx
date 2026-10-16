import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { FaBars, FaLock } from 'react-icons/fa';
import { usePageSEO } from '../../hooks/usePageSEO';

// ─── Admin password (client-side gate) ───────────────────────────────────────
const ADMIN_PASSWORD = 'urvaa@2026';
const SESSION_KEY = 'vh_admin_auth';

// ─── Password Gate ────────────────────────────────────────────────────────────
const AdminLoginGate: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  // Auto-pass if already authenticated via admin login page
  React.useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onSuccess();
    }
  }, [onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD || input === 'urvaa@Admin2026' || input === 'julinacandles@2026') {
      sessionStorage.setItem(SESSION_KEY, '1');
      // For local/dev convenience: set a temporary admin token so API-protected admin
      // endpoints (which expect a 128-hex token) accept actions. This is only a
      // client-side convenience and should NOT be used in production.
      try {
        const temp = 'a'.repeat(128);
        localStorage.setItem('adminToken', temp);
      } catch (err) {
        console.warn('Could not set temp admin token', err);
      }
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setInput('');
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center px-4 font-sans">
      <div
        className={`bg-[#FAF8F4] rounded-3xl shadow-md border border-[#E2D9CC] p-8 w-full max-w-sm ${
          shake ? 'animate-shake' : ''
        }`}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#5A3825] flex items-center justify-center mb-4 shadow-sm border border-[#3F2618]">
            <FaLock className="text-[#F4F1EA] text-lg" />
          </div>
          <img 
            src="https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png" 
            alt="URVA" 
            className="h-9 w-auto mb-3 object-contain" 
          />
          <h1 className="text-lg font-serif font-bold text-[#5A3825] tracking-tight">Admin Access</h1>
          <p className="text-xs text-[#8C7364] mt-1 text-center font-normal">
            Enter the admin password to access the console.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5A3825] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              placeholder="Enter admin password"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                error
                  ? 'border-red-400 focus:ring-red-300 bg-red-50 text-red-900'
                  : 'border-[#E2D9CC] focus:ring-[#8B5A2B]/20 bg-[#F4F1EA] focus:bg-[#FAF8F4] text-[#5A3825]'
              }`}
            />
            {error && (
              <p className="text-xs text-red-600 mt-1.5 font-medium">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#8B5A2B] hover:bg-[#5A3825] text-white font-semibold py-3 rounded-xl text-sm transition-colors shadow-sm"
          >
            Unlock Console
          </button>
        </form>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

// ─── Admin Layout ─────────────────────────────────────────────────────────────
const AdminLayout: React.FC = () => {
  usePageSEO({
    title: 'Admin Dashboard | URVA',
    description: 'URVA product and order management',
    canonical: '/admin',
    noIndex: true,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const [isAuthed, setIsAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  );

  if (!isAuthed) {
    return <AdminLoginGate onSuccess={() => setIsAuthed(true)} />;
  }

  return (
    <div className="flex bg-[#F4F1EA] min-h-screen text-[#5A3825] font-sans">
      {/* Sidebar wrapper */}
      <div className="fixed z-40">
        <AdminSidebar 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
      </div>

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} min-w-0 transition-all duration-300`}>

        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E2D9CC] shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#EAE5D9] text-[#5A3825] transition-colors"
              aria-label="Toggle navigation drawer"
            >
              <FaBars className="text-lg" />
            </button>
            {/* Desktop collapse / expand toggle */}
            <button
              onClick={toggleCollapse}
              className="hidden md:flex p-2 rounded-lg hover:bg-[#EAE5D9] text-[#5A3825] hover:text-[#3F2618] transition-colors items-center justify-center"
              title={isCollapsed ? 'Expand sidebar (currently collapsed)' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <FaBars className="text-base" />
            </button>
            <div>
              <h2 className="text-base font-serif font-bold text-[#5A3825] tracking-tight">Admin Console</h2>
              <p className="text-[11px] text-[#8C7364] hidden sm:block">Manage inventory, catalog, and customer orders</p>
            </div>
          </div>

          {/* Admin Badge + Logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-semibold text-[#5A3825]">Administrator</span>
              <span className="block text-[10px] text-[#8C7364] uppercase tracking-wider">Super Admin</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#5A3825] flex items-center justify-center text-[#F4F1EA] text-xs font-bold shadow-xs border border-[#3F2618]">
              <span>A</span>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                setIsAuthed(false);
              }}
              title="Lock admin session"
              className="p-2 rounded-lg text-[#8C7364] hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaLock className="text-sm" />
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
