import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  FiMenu, FiX, FiMapPin, FiSettings, FiRefreshCw,
  FiUser, FiLogOut, FiHome, FiBell, FiMoon, FiSun,
  FiCheckCircle,
} from 'react-icons/fi';

// ── click-outside hook ────────────────────────────────────────────────────────
function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

// ── TopBar ────────────────────────────────────────────────────────────────────
function TopBar({ user, onMenuToggle, sidebarOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen]   = useState(false);
  const [profileOpen,  setProfileOpen]    = useState(false);
  const [spinning,     setSpinning]       = useState(false);
  const [refreshed,    setRefreshed]      = useState(false);
  const [darkMode,     setDarkMode]       = useState(false);
  const [notifs,       setNotifs]         = useState(true);

  const settingsRef = useRef(null);
  const profileRef  = useRef(null);

  useClickOutside(settingsRef, () => setSettingsOpen(false));
  useClickOutside(profileRef,  () => setProfileOpen(false));

  const city    = user?.city || 'Harare';
  const initial = user?.name?.[0]?.toUpperCase() || 'U';

  // Refresh handler — spin the icon, brief flash, done
  const handleRefresh = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setRefreshed(false);
    setTimeout(() => {
      setSpinning(false);
      setRefreshed(true);
      window.location.reload();
    }, 800);
  }, [spinning]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath =
    user?.role === 'admin'    ? '/admin/dashboard'
    : user?.role === 'pharmacy' ? '/pharmacy/dashboard'
    : '/dashboard';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-6">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <FiMapPin size={13} className="text-gray-400" />
          <span>{city}, Zimbabwe</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">

        {/* ── Settings ── */}
        <div ref={settingsRef} className="relative">
          <button
            onClick={() => { setSettingsOpen(!settingsOpen); setProfileOpen(false); }}
            className={`p-2 rounded-lg transition-colors ${
              settingsOpen
                ? 'bg-gray-100 text-gray-700'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Settings"
          >
            <FiSettings size={17} className={settingsOpen ? 'text-green-800' : ''} />
          </button>

          {settingsOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                 style={{ animation: 'dropIn 0.15s ease both' }}>
              <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Preferences
              </p>

              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  {darkMode ? <FiMoon size={15} className="text-gray-500" /> : <FiSun size={15} className="text-amber-500" />}
                  {darkMode ? 'Dark mode' : 'Light mode'}
                </span>
                {/* Toggle pill */}
                <span
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                    darkMode ? 'bg-green-800' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      darkMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </span>
              </button>

              {/* Notifications toggle */}
              <button
                onClick={() => setNotifs(!notifs)}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <FiBell size={15} className={notifs ? 'text-green-700' : 'text-gray-400'} />
                  Notifications
                </span>
                <span
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                    notifs ? 'bg-green-800' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      notifs ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </span>
              </button>

              <div className="border-t border-gray-100 mt-1 pt-1">
                <Link
                  to="/dashboard/profile"
                  onClick={() => setSettingsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiUser size={15} className="text-gray-400" />
                  Account settings
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Refresh ── */}
        <button
          onClick={handleRefresh}
          className={`p-2 rounded-lg transition-colors ${
            refreshed
              ? 'text-green-700 bg-green-50'
              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
          }`}
          aria-label="Refresh"
          title="Refresh page"
        >
          <FiRefreshCw
            size={17}
            className={spinning ? 'animate-spin' : ''}
            style={{ transition: 'color 0.2s' }}
          />
        </button>

        {/* ── Avatar / Profile dropdown ── */}
        <div ref={profileRef} className="relative ml-1">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setSettingsOpen(false); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-opacity hover:opacity-80 ${
              profileOpen ? 'ring-2 ring-green-700 ring-offset-1' : ''
            }`}
            style={{ backgroundColor: '#0d2d1e' }}
            aria-label="User menu"
          >
            {initial}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                 style={{ animation: 'dropIn 0.15s ease both' }}>
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: '#0d2d1e' }}
                  >
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user?.role} account</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <Link
                to={dashboardPath}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiHome size={15} className="text-gray-400" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiUser size={15} className="text-gray-400" />
                Profile
              </Link>

              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut size={15} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drop-in animation */}
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </header>
  );
}

// ── DashboardLayout ───────────────────────────────────────────────────────────
export default function DashboardLayout({ requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading Pathway...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0 sticky top-0 self-start h-screen">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-60">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          user={user}
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
