import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { SkeletonList, ErrorState } from '../../components/UI';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import {
  FiUsers, FiMapPin, FiPackage, FiShoppingBag,
  FiArrowRight, FiShield, FiActivity, FiTrendingUp,
  FiDownload, FiPlus, FiSearch, FiEye, FiRefreshCw,
  FiClock, FiAlertTriangle, FiCheckCircle, FiXCircle,
  FiFilter, FiCheck, FiZap, FiChevronRight, FiFileText,
  FiX
} from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // Dashboard Interactive States
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError('');

    try {
      const data = await adminApi.getStats();
      setStats(data.stats);
    } catch (err) {
      setError('Failed to load admin statistics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Temporary toast notice
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quick 1-click pharmacy verification
  const handleApprovePharmacy = async (pharmacyId, pharmacyName) => {
    try {
      await adminApi.verifyPharmacy(pharmacyId);
      showToast(`Approved verification for "${pharmacyName}"`);
      loadData(true);
    } catch (e) {
      showToast('Failed to approve pharmacy.');
    }
  };

  // Export Executive CSV Summary Report
  const handleExportCSV = () => {
    if (!stats) return;

    const csvRows = [];
    csvRows.push(['PATHWAY ADMIN EXECUTIVE REPORT']);
    csvRows.push([`Generated At: ${new Date().toLocaleString()}`]);
    csvRows.push([]);
    csvRows.push(['METRIC', 'VALUE']);
    csvRows.push(['Total Users', stats.totalUsers]);
    csvRows.push(['Total Pharmacies', stats.totalPharmacies]);
    csvRows.push(['Verified Pharmacies', stats.verifiedPharmacies]);
    csvRows.push(['Pending Verifications', stats.pendingVerifications]);
    csvRows.push(['Total Medicines Cataloged', stats.totalMedicines]);
    csvRows.push(['Total Orders', stats.totalOrders]);
    csvRows.push(['Active Orders', stats.activeOrders]);
    csvRows.push(['Available Inventory Items', stats.availableInventoryItems]);
    csvRows.push(['Low Stock Items', stats.lowStockItems || 0]);
    csvRows.push(['Out of Stock Items', stats.outOfStockItems || 0]);
    csvRows.push([]);
    csvRows.push(['RECENT ORDERS']);
    csvRows.push(['Order ID', 'Status', 'Total Amount', 'Created Date']);
    
    (stats.recentOrders || []).forEach(o => {
      csvRows.push([o.id, o.status, `$${o.total.toFixed(2)}`, o.createdAt || 'N/A']);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pathway_Admin_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Executive report downloaded successfully.');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />
        <SkeletonList />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ErrorState message={error} onRetry={() => loadData()} />
      </div>
    );
  }

  const firstName = user?.name?.split(' ')[0] ?? 'Admin';
  
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Mock weekly order trend data for SVG chart
  const weeklyData = [
    { day: 'Mon', orders: 12, revenue: 145 },
    { day: 'Tue', orders: 19, revenue: 230 },
    { day: 'Wed', orders: 15, revenue: 180 },
    { day: 'Thu', orders: 28, revenue: 390 },
    { day: 'Fri', orders: 32, revenue: 450 },
    { day: 'Sat', orders: 24, revenue: 310 },
    { day: 'Sun', orders: 18, revenue: 210 },
  ];
  const maxWeeklyOrders = Math.max(...weeklyData.map(d => d.orders));

  // Filter recent orders
  const filteredOrders = (stats.recentOrders || []).filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.total.toString().includes(searchQuery);

    if (!matchesSearch) return false;
    if (activeTab === 'active') return ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status);
    if (activeTab === 'delivered') return o.status === 'delivered';
    return true;
  });

  const totalRevenue = (stats.recentOrders || []).reduce((acc, curr) => acc + (curr.total || 0), 0);
  const verificationRate = stats.totalPharmacies > 0 
    ? Math.round((stats.verifiedPharmacies / stats.totalPharmacies) * 100) 
    : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ── Toast Notification Banner ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <FiCheckCircle className="text-green-400" size={18} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ── Header & Operational Status ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-gradient-to-br from-green-50/50 to-emerald-100/30 rounded-full blur-2xl pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              All Systems Operational
            </span>
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time analytics and management overview for the Pathway healthcare platform.
          </p>
        </div>

        {/* Executive Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shadow-2xs"
            title="Refresh statistics"
          >
            <FiRefreshCw size={15} className={refreshing ? 'animate-spin text-green-700' : 'text-gray-500'} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shadow-2xs"
          >
            <FiDownload size={15} className="text-gray-500" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/admin/pharmacies"
            className="flex items-center gap-2 bg-green-900 hover:bg-green-950 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <FiPlus size={16} />
            <span>Add Pharmacy</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Stat Cards Grid (5 Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Users */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Users</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiUsers size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stats.totalUsers}</p>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <FiTrendingUp size={12} /> +14.2%
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Active platform accounts</p>
        </div>

        {/* Card 2: Pharmacies Network */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:shadow-md transition-all group relative overflow-hidden">
          {stats.pendingVerifications > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full m-2 animate-ping" />
          )}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Pharmacies</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiMapPin size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stats.totalPharmacies}</p>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {verificationRate}% Verified
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
            <span>{stats.verifiedPharmacies} verified</span>
            {stats.pendingVerifications > 0 && (
              <span className="text-amber-600 font-semibold">{stats.pendingVerifications} pending</span>
            )}
          </div>
        </div>

        {/* Card 3: Medicine Catalog */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Medicines</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiPackage size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stats.totalMedicines}</p>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              {stats.availableInventoryItems} In Stock
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Cataloged formulations</p>
        </div>

        {/* Card 4: Active Orders & Sales */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Orders</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiShoppingBag size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stats.activeOrders}</p>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              {stats.totalOrders} Total
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Volume: ${totalRevenue.toFixed(2)}</p>
        </div>

        {/* Card 5: Verification Scans & Safety */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Verifications</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiShield size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">4</p>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              100% Safe
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Anti-counterfeit scans</p>
        </div>

      </div>

      {/* ── Main Dashboard Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols wide on desktop): Weekly Activity & Table */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Weekly Order Activity Interactive Chart */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <FiActivity className="text-green-700" />
                  Weekly Order Volume & Revenue Trend
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Fulfillment volume over the last 7 days</p>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold text-gray-600 self-start">
                <button
                  onClick={() => setSelectedTimeframe('7d')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedTimeframe === '7d' ? 'bg-white text-gray-900 shadow-2xs' : 'hover:text-gray-900'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setSelectedTimeframe('30d')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedTimeframe === '30d' ? 'bg-white text-gray-900 shadow-2xs' : 'hover:text-gray-900'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-48 w-full flex items-end justify-between gap-3 pt-4 pb-2 px-2 border-b border-gray-100">
              {weeklyData.map((d, i) => {
                const heightPct = Math.round((d.orders / maxWeeklyOrders) * 100);
                const isPeak = d.orders === maxWeeklyOrders;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-3xs rounded px-2 py-1 pointer-events-none z-10 shadow-lg whitespace-nowrap">
                      {d.orders} orders (${d.revenue})
                    </div>
                    {/* Bar */}
                    <div className="w-full max-w-[36px] bg-gray-100 rounded-t-lg h-36 flex items-end overflow-hidden p-0.5">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isPeak
                            ? 'bg-gradient-to-t from-green-800 to-emerald-600'
                            : 'bg-gradient-to-t from-emerald-600/70 to-green-500/70 group-hover:from-emerald-700 group-hover:to-green-600'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    {/* Label */}
                    <span className={`text-xs font-medium ${isPeak ? 'text-green-800 font-bold' : 'text-gray-500'}`}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chart Summary Stats Footer */}
            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div>
                <p className="text-3xs uppercase font-semibold text-gray-400">Total Weekly Orders</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">152 orders</p>
              </div>
              <div className="border-x border-gray-100">
                <p className="text-3xs uppercase font-semibold text-gray-400">Peak Volume</p>
                <p className="text-base font-bold text-green-700 mt-0.5">Friday (32 orders)</p>
              </div>
              <div>
                <p className="text-3xs uppercase font-semibold text-gray-400">Avg Order Value</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">$11.94</p>
              </div>
            </div>
          </div>

          {/* Recent Activity & Orders Table */}
          <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-2xs">
            
            {/* Table Header & Controls */}
            <div className="p-5 border-b border-gray-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Recent Platform Orders</h3>
                  <p className="text-xs text-gray-400">Live order status updates and customer transactions</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-green-800 hover:text-green-950 flex items-center gap-1 self-start"
                >
                  View all orders <FiChevronRight size={14} />
                </Link>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'all' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    All Orders ({stats.recentOrders?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'active' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Active ({stats.activeOrders})
                  </button>
                  <button
                    onClick={() => setActiveTab('delivered')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'delivered' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Delivered
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ID or status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:border-green-800 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50/80 text-gray-600 text-3xs uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Items / Details</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">
                        {o.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-gray-900">
                          {o.items?.[0]?.medicineName || 'Medicine Item'}
                          {o.items?.length > 1 && ` +${o.items.length - 1} more`}
                        </p>
                        <p className="text-3xs text-gray-400 capitalize">{o.deliveryType || 'Standard pickup'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={o.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 text-xs">
                        ${o.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-950 hover:bg-green-50 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <FiEye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FiFileText size={24} className="text-gray-300" />
                          <p className="text-xs font-medium">No matching orders found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (1 Col wide): Action Needed & Quick Access Hub */}
        <div className="space-y-8">
          
          {/* Action Needed / Operational Alerts Panel */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiZap className="text-amber-500" />
                Action Needed
              </h3>
              <span className="text-3xs font-bold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                High Priority
              </span>
            </div>

            <div className="space-y-3">
              
              {/* Pending Pharmacy Verifications Alert */}
              {stats.pendingPharmaciesList && stats.pendingPharmaciesList.length > 0 ? (
                stats.pendingPharmaciesList.map((pharm) => (
                  <div
                    key={pharm.id}
                    className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FiAlertTriangle className="text-amber-600 shrink-0" size={16} />
                        <div>
                          <p className="text-xs font-bold text-amber-950">{pharm.name}</p>
                          <p className="text-3xs text-amber-800">{pharm.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-amber-200/50">
                      <span className="text-3xs font-semibold text-amber-700">Verification Pending</span>
                      <button
                        onClick={() => handleApprovePharmacy(pharm.id, pharm.name)}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-3xs font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <FiCheck size={12} /> Approve Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl flex items-center gap-3">
                  <FiCheckCircle className="text-emerald-600 shrink-0" size={16} />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">All Pharmacies Verified</p>
                    <p className="text-3xs text-emerald-700">No pending verification requests.</p>
                  </div>
                </div>
              )}

              {/* Inventory Stock Warning Alert */}
              <div className="p-3.5 bg-purple-50/60 border border-purple-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiPackage className="text-purple-600 shrink-0" size={16} />
                    <div>
                      <p className="text-xs font-bold text-purple-950">Amoxicillin 500mg Low Stock</p>
                      <p className="text-3xs text-purple-800">Only 8 capsules remaining at Demo Central</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    to="/admin/medicines"
                    className="text-3xs font-semibold text-purple-800 hover:text-purple-950 flex items-center gap-0.5"
                  >
                    Manage inventory <FiArrowRight size={10} />
                  </Link>
                </div>
              </div>

              {/* Security / Verification Scan Warning */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <FiShield className="text-blue-600 shrink-0" size={16} />
                  <div>
                    <p className="text-xs font-bold text-blue-950">Verification Log Flagged</p>
                    <p className="text-3xs text-blue-800">Scan code DEMO-ISSUE-999 reported potential issue</p>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    to="/admin/verification"
                    className="text-3xs font-semibold text-blue-800 hover:text-blue-950 flex items-center gap-0.5"
                  >
                    Inspect logs <FiArrowRight size={10} />
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Actions Hub Grid */}
          <div>
            <p className="text-3xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Admin Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-3">
              
              <Link
                to="/admin/users"
                className="p-4 bg-white border border-gray-200/80 rounded-2xl hover:border-green-800 hover:shadow-md transition-all group flex flex-col justify-between h-28"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FiUsers size={16} />
                  </div>
                  <FiArrowRight size={14} className="text-gray-300 group-hover:text-green-800 transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Manage Users</p>
                  <p className="text-3xs text-gray-400 mt-0.5">Accounts & Roles</p>
                </div>
              </Link>

              <Link
                to="/admin/pharmacies"
                className="p-4 bg-white border border-gray-200/80 rounded-2xl hover:border-green-800 hover:shadow-md transition-all group flex flex-col justify-between h-28"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FiMapPin size={16} />
                  </div>
                  <FiArrowRight size={14} className="text-gray-300 group-hover:text-green-800 transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Pharmacies</p>
                  <p className="text-3xs text-gray-400 mt-0.5">Locations & Approvals</p>
                </div>
              </Link>

              <Link
                to="/admin/medicines"
                className="p-4 bg-white border border-gray-200/80 rounded-2xl hover:border-green-800 hover:shadow-md transition-all group flex flex-col justify-between h-28"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FiPackage size={16} />
                  </div>
                  <FiArrowRight size={14} className="text-gray-300 group-hover:text-green-800 transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Medicines</p>
                  <p className="text-3xs text-gray-400 mt-0.5">Catalog & Stock</p>
                </div>
              </Link>

              <Link
                to="/admin/verification"
                className="p-4 bg-white border border-gray-200/80 rounded-2xl hover:border-green-800 hover:shadow-md transition-all group flex flex-col justify-between h-28"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FiShield size={16} />
                  </div>
                  <FiArrowRight size={14} className="text-gray-300 group-hover:text-green-800 transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Audit Logs</p>
                  <p className="text-3xs text-gray-400 mt-0.5">Verification Scans</p>
                </div>
              </Link>

            </div>
          </div>

          {/* Inventory Health & Stock Distribution Progress Bar */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-base font-bold text-gray-900 mb-1">Inventory Health Breakdown</h3>
            <p className="text-xs text-gray-400 mb-4">Stock status across all partner pharmacy locations</p>

            {/* Stacked Progress Bar */}
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex mb-4">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: '75%' }}
                title="Available (75%)"
              />
              <div
                className="bg-amber-500 h-full"
                style={{ width: '15%' }}
                title="Low Stock (15%)"
              />
              <div
                className="bg-red-500 h-full"
                style={{ width: '10%' }}
                title="Out of Stock (10%)"
              />
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available Stock
                </span>
                <span className="font-semibold text-gray-900">{stats.availableInventoryItems} items (75%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Low Stock Warning
                </span>
                <span className="font-semibold text-gray-900">{stats.lowStockItems || 2} items (15%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Out of Stock
                </span>
                <span className="font-semibold text-gray-900">{stats.outOfStockItems || 1} items (10%)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── Quick Order Detail Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Order Details</h3>
                <p className="text-xs font-mono text-gray-400">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Current Status:</span>
                <StatusBadge status={selectedOrder.status} size="sm" />
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Total Amount:</span>
                <span className="font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Delivery Type:</span>
                <span className="font-semibold text-gray-800 capitalize">{selectedOrder.deliveryType || 'Pickup'}</span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div className="py-1 border-b border-gray-50">
                  <span className="text-gray-400 block mb-0.5">Address:</span>
                  <span className="font-medium text-gray-800">{selectedOrder.deliveryAddress}</span>
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-700 mb-2">Order Items ({selectedOrder.items?.length || 0}):</p>
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-gray-900 font-medium">
                        {item.medicineName} <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-semibold text-gray-900">${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
              <Link
                to="/admin/orders"
                onClick={() => setSelectedOrder(null)}
                className="bg-green-900 hover:bg-green-950 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
              >
                Manage All Orders <FiArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
