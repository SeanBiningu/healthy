import React, { useState, useEffect } from 'react';
import { initialOrders } from '../../data/demoData';
import { FiTrash2, FiShoppingBag, FiTruck, FiBox } from 'react-icons/fi';

export default function AdminOrders() {
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pathway_orders');
      if (stored) {
        setOrdersList(JSON.parse(stored));
      } else {
        setOrdersList(initialOrders);
        localStorage.setItem('pathway_orders', JSON.stringify(initialOrders));
      }
    } catch {
      setOrdersList(initialOrders);
    }
  }, []);

  const saveOrders = (newOrders) => {
    setOrdersList(newOrders);
    localStorage.setItem('pathway_orders', JSON.stringify(newOrders));
  };

  const handleRemove = (id) => {
    saveOrders(ordersList.filter((o) => o.id !== id));
  };

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    preparing: 'bg-purple-50 text-purple-700',
    out_for_delivery: 'bg-indigo-50 text-indigo-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordersList.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900">{o.id}</td>
                  <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[o.status] || 'bg-gray-50 text-gray-700'}`}>
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">${o.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(o.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                      title="Remove Order"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {ordersList.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No orders found.
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
