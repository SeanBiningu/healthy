import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiSearch, FiMapPin, FiShield, FiShoppingBag,
  FiHeart, FiAlertCircle, FiUser, FiLogOut, FiPackage,
} from 'react-icons/fi';

const patientLinks = [
  { to: '/dashboard',                  label: 'Overview',         icon: FiHome,        end: true },
  { to: '/dashboard/medicines',        label: 'Find medicine',    icon: FiSearch },
  { to: '/dashboard/pharmacies',       label: 'Pharmacies',       icon: FiMapPin },
  { to: '/dashboard/verify',           label: 'Verify medicine',  icon: FiShield },
  { to: '/dashboard/orders',           label: 'My orders',        icon: FiShoppingBag },
  { to: '/dashboard/health-assistant', label: 'Health assistant', icon: FiHeart },
  { to: '/dashboard/first-aid',        label: 'First aid',        icon: FiAlertCircle },
];

const pharmacyLinks = [
  { to: '/pharmacy/dashboard',  label: 'Dashboard', icon: FiHome,        end: true },
  { to: '/pharmacy/inventory',  label: 'Inventory', icon: FiPackage },
  { to: '/pharmacy/orders',     label: 'Orders',    icon: FiShoppingBag },
  { to: '/pharmacy/profile',    label: 'Profile',   icon: FiUser },
];

const adminLinks = [
  { to: '/admin/dashboard',    label: 'Dashboard',    icon: FiHome,        end: true },
  { to: '/admin/users',        label: 'Users',        icon: FiUser },
  { to: '/admin/pharmacies',   label: 'Pharmacies',   icon: FiMapPin },
  { to: '/admin/medicines',    label: 'Medicines',    icon: FiSearch },
  { to: '/admin/orders',       label: 'Orders',       icon: FiShoppingBag },
  { to: '/admin/verification', label: 'Verification', icon: FiShield },
];

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === 'admin'    ? adminLinks
    : user?.role === 'pharmacy' ? pharmacyLinks
    : patientLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose?.();
  };

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100 w-60">

      {/* ── Brand ── */}
      <div className="flex items-center gap-2 px-5 h-14 border-b border-gray-100 shrink-0">
        <span
          className="text-white rounded-lg px-1.5 py-1 text-xs font-bold leading-none"
          style={{ backgroundColor: '#0d2d1e' }}
        >
          Px
        </span>
        <span className="text-gray-900 font-bold text-base">Pathway</span>
      </div>

      {/* ── User info ── */}
      {user && (
        <div className="px-4 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs text-white shrink-0"
              style={{ backgroundColor: '#0d2d1e' }}
            >
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role} account</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" aria-label="Sidebar navigation">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-green-50 text-green-900 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-green-800' : ''} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom: Profile + Log out ── */}
      <div className="p-3 border-t border-gray-100 space-y-0.5 shrink-0">
        <NavLink
          to="/dashboard/profile"
          onClick={onClose}
          className={({ isActive }) =>
            [
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-green-50 text-green-900 font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
            ].join(' ')
          }
        >
          <FiUser size={16} />
          <span>Profile</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FiLogOut size={16} />
          <span>Log out</span>
        </button>
      </div>

    </aside>
  );
}
