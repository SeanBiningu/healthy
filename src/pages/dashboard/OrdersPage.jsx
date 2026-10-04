import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { SkeletonList, ErrorState, EmptyState, DemoNotice, Button } from '../../components/UI';
import { FiShoppingBag, FiArrowRight, FiTruck, FiMapPin } from 'react-icons/fi';

const STATUS_STEPS = [
  { key: 'pending',           label: 'Order Placed' },
  { key: 'confirmed',         label: 'Confirmed' },
  { key: 'preparing',         label: 'Preparing' },
  { key: 'ready_for_pickup',  label: 'Ready' },
  { key: 'assigned_to_driver',label: 'Driver Assigned' },
  { key: 'out_for_delivery',  label: 'Out for Delivery' },
  { key: 'delivered',         label: 'Delivered' },
];

function getStepIndex(status) {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ordersApi.getAll()
      .then((data) => setOrders(data.orders || []))
      .catch(() => setError("We couldn't load your orders. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-4"><DemoNotice /></div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500">Track your medicine orders and deliveries</p>
        </div>
        <Link to="/dashboard/medicines" className="text-sm text-green-800 hover:underline flex items-center gap-1">
          Order Medicine <FiArrowRight size={14} />
        </Link>
      </div>

      {loading && <SkeletonList count={3} />}
      {error && <ErrorState message={error} />}

      {!loading && !error && orders.length === 0 && (
        <EmptyState
          icon="🛍️"
          title="No orders yet"
          description="Find and order medicine from verified pharmacies."
          action={<Link to="/dashboard/medicines" className="text-sm bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-950 transition-colors font-medium">Find Medicine</Link>}
        />
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }) {
  const stepIdx = getStepIndex(order.status);
  const isActive = !['delivered', 'cancelled'].includes(order.status);

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <FiShoppingBag size={16} className="text-green-800" />
            <span className="font-semibold text-gray-900 text-sm">Order #{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Placed: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <p className="font-bold text-gray-900 text-lg shrink-0">\${order.total?.toFixed(2)}</p>
      </div>

      {/* Items */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-700">{item.medicineName} × {item.quantity}</span>
            <span className="text-gray-500">\${item.subtotal?.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Delivery info */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        {order.deliveryType === 'delivery' ? (
          <span className="flex items-center gap-1"><FiTruck size={12} /> Delivery to: {order.deliveryAddress}</span>
        ) : (
          <span className="flex items-center gap-1"><FiMapPin size={12} /> Pickup</span>
        )}
      </div>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <div className="mt-2">
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-0 min-w-max">
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-3 h-3 rounded-full border-2 transition-colors ${i <= stepIdx ? 'bg-green-900 border-green-900' : 'bg-white border-gray-300'}`} />
                    <span className={`text-xs mt-1 whitespace-nowrap px-0.5 ${i === stepIdx ? 'text-green-900 font-semibold' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`w-8 h-0.5 mb-4 ${i < stepIdx ? 'bg-green-900' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <p className="text-xs text-red-500 font-medium">This order was cancelled.</p>
      )}
    </div>
  );
}
