import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMenu, FiX, FiBell, FiUser, FiLogOut,
  FiHome, FiPackage,
} from 'react-icons/fi';

export default function Navbar({ onMenuToggle, menuOpen }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  // Close menu and profile dropdown on navigation
  React.useEffect(() => {
    setProfileOpen(false);
    if (menuOpen) onMenuToggle?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const dashboardPath =
    user?.role === 'admin' ? '/admin/dashboard'
    : user?.role === 'pharmacy' ? '/pharmacy/dashboard'
    : '/dashboard';

  // Navigate to a hash section — if already on /, just push the hash;
  // otherwise go to / first so the landing page mounts and handles the hash.
  const handleHashNav = (hash, closeMobileMenu) => {
    closeMobileMenu?.();
    if (location.pathname === '/') {
      navigate({ pathname: '/', hash });
    } else {
      navigate(`/${hash}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span
              className="text-white text-xs font-bold px-2 py-1 rounded"
              style={{ backgroundColor: '#0d2d1e' }}
            >
              Px
            </span>
            <span className="font-semibold text-gray-900 text-sm hidden sm:block">Pathway</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0" aria-label="Main navigation">
            <NavLink to="/find-medicine"    label="Find medicine" />
            <NavLink to="/dashboard/verify" label="Verify medicine" />
            <button
              onClick={() => handleHashNav('#how-it-works')}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => handleHashNav('#who-its-for')}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Who it's for
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/orders"
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Orders"
                >
                  <FiPackage size={18} />
                </Link>
                <Link
                  to="/dashboard"
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Notifications"
                >
                  <FiBell size={18} />
                </Link>

                {/* Profile dropdown */}
                <div className="relative ml-1">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    aria-haspopup="true"
                    aria-expanded={profileOpen}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs text-white"
                      style={{ backgroundColor: '#0d2d1e' }}
                    >
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      <Link
                        to={dashboardPath}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        <FiHome size={14} /> Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        <FiUser size={14} /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut size={14} /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-sm font-semibold text-white rounded-md transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#0d2d1e' }}
                >
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md ml-1"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-0.5">
          <MobileNavLink to="/find-medicine"    label="Find medicine"   onClick={onMenuToggle} />
          <MobileNavLink to="/dashboard/verify" label="Verify medicine" onClick={onMenuToggle} />
          <button
            onClick={() => handleHashNav('#how-it-works', onMenuToggle)}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => handleHashNav('#who-its-for', onMenuToggle)}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Who it's for
          </button>
          {!isAuthenticated && (
            <div className="pt-3 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={onMenuToggle}
                className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={onMenuToggle}
                className="block w-full text-center px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#0d2d1e' }}
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
    >
      {label}
    </Link>
  );
}
