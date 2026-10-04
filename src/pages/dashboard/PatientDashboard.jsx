import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FiSearch, FiShield, FiHeart, FiMapPin,
  FiArrowRight, FiClipboard, FiAlertCircle,
  FiInfo,
} from 'react-icons/fi';

// ── helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

// ── quick actions ─────────────────────────────────────────────────────────────
const quickActions = [
  {
    to: '/dashboard/medicines',
    label: 'Find medicine',
    sub: 'Check stock near you',
    Icon: FiSearch,
  },
  {
    to: '/dashboard/verify',
    label: 'Scan & verify',
    sub: 'Confirm authenticity',
    Icon: FiShield,
  },
  {
    to: '/dashboard/first-aid',
    label: 'First aid',
    sub: 'Immediate guidance',
    Icon: FiAlertCircle,
  },
  {
    to: '/dashboard/health-assistant',
    label: 'Health assistant',
    sub: 'Ask a health question',
    Icon: FiHeart,
  },
];

// ── component ─────────────────────────────────────────────────────────────────
export default function PatientDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const city = user?.city || 'Harare';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

      {/* ── Greeting ── */}
      <div>
        <p className="text-sm text-gray-400 mb-1">{formatDate()}</p>
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-gray-400 mt-1">What can we help you with today?</p>
      </div>

      {/* ── Search bar ── */}
      <Link
        to="/dashboard/medicines"
        className="flex items-center gap-3 w-full border border-gray-200 bg-white rounded-xl px-4 py-3 hover:border-green-700 hover:shadow-sm transition-all group"
      >
        <FiSearch size={16} className="text-gray-400 shrink-0" />
        <span className="text-sm text-gray-400 flex-1">
          Search by medicine or active ingredient
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
          <FiMapPin size={12} />
          {city}
        </span>
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: '#0d2d1e' }}
        >
          <FiArrowRight size={14} />
        </span>
      </Link>

      {/* ── Quick Actions ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Quick actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ to, label, sub, Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col gap-3 border border-gray-200 bg-white rounded-xl p-4 hover:border-green-700 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between">
                <span className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-green-50 group-hover:border-green-100 group-hover:text-green-800 transition-colors">
                  <Icon size={16} />
                </span>
                <FiArrowRight size={14} className="text-gray-300 group-hover:text-green-700 transition-colors mt-0.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Orders + Near You ── */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Orders */}
        <div className="border border-gray-200 bg-white rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Orders</p>
            <span className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
              <FiClipboard size={15} />
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No active orders</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">
            When you place an order, you'll be able to track its status and collection details here.
          </p>
          <Link
            to="/dashboard/medicines"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: '#0d2d1e' }}
          >
            Find a medicine <FiArrowRight size={13} />
          </Link>
        </div>

        {/* Near You */}
        <div className="border border-gray-200 bg-white rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Near you</p>
            <span className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
              <FiMapPin size={15} />
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Verified pharmacies</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">
            Browse licensed pharmacies and check medicine availability nearby.
          </p>
          <Link
            to="/dashboard/pharmacies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:border-green-700 hover:text-green-900 transition-colors"
          >
            Open pharmacy locator <FiArrowRight size={13} />
          </Link>
        </div>

      </div>

      {/* ── Health info notice ── */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
        <FiInfo size={15} className="shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold">Health information notice: </span>
          Pathway provides general health information only. Always consult a qualified healthcare professional
          or pharmacist for medical decisions.
        </p>
      </div>

    </div>
  );
}
