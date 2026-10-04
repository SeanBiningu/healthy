import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { SkeletonList, ErrorState } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import {
  FiUsers, FiMapPin, FiPackage, FiShoppingBag,
  FiArrowRight, FiShield, FiActivity
} from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getStats()
      .then((data) => setStats(data.stats))
      .catch(() => setError('Failed to load admin stats.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8"><SkeletonList /></div>;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;

  const firstName = user?.name?.split(' ')[0] ?? 'Admin';
  
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pharmacies', value: stats.totalPharmacies, icon: FiMapPin, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Medicines', value: stats.totalMedicines, icon: FiPackage, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Orders', value: stats.activeOrders, icon: FiShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const quickActions = [
    { to: '/admin/users', label: 'Manage Users', icon: FiUsers },
    { to: '/admin/pharmacies', label: 'Manage Pharmacies', icon: FiMapPin },
    { to: '/admin/medicines', label: 'Manage Inventory', icon: FiPackage },
    { to: '/admin/verification', label: 'Verification Logs', icon: FiShield },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      
      {/* ── Greeting ── */}
      <div>
        <p className="text-sm text-gray-400 mb-1">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-gray-400 mt-1">Here is what's happening across the Pathway platform today.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500">{s.label}</span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.bg} ${s.color}`}>
                <s.icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ to, label, icon: Icon }) => (
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
              <p className="text-sm font-semibold text-gray-900 mt-1">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent Activity / Orders ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <FiActivity className="text-green-700" />
            Recent Orders
          </div>
          <Link to="/admin/orders" className="text-sm text-green-700 hover:text-green-800 font-medium">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders?.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-gray-900">{o.id}</td>
                  <td className="px-6 py-3 capitalize">{o.status.replace(/_/g, ' ')}</td>
                  <td className="px-6 py-3 font-medium">${o.total.toFixed(2)}</td>
                </tr>
              ))}
              {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                    No recent orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
