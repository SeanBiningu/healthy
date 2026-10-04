import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

/**
 * Status badge for medicine availability / order status / verification
 */
export function StatusBadge({ status, size = 'sm' }) {
  const configs = {
    available:        { label: 'Available',        className: 'badge-verified', icon: <FiCheckCircle size={12} /> },
    low_stock:        { label: 'Low Stock',        className: 'badge-warning',  icon: <FiAlertTriangle size={12} /> },
    out_of_stock:     { label: 'Out of Stock',     className: 'badge-danger',   icon: <FiXCircle size={12} /> },
    verified:         { label: 'Verified',         className: 'badge-verified', icon: <MdVerified size={12} /> },
    unable_to_verify: { label: 'Unable to Verify', className: 'badge-warning',  icon: <FiAlertTriangle size={12} /> },
    potential_issue:  { label: 'Potential Issue',  className: 'badge-danger',   icon: <FiXCircle size={12} /> },
    pending:          { label: 'Pending',          className: 'badge-info',     icon: null },
    confirmed:        { label: 'Confirmed',        className: 'badge-info',     icon: <FiCheckCircle size={12} /> },
    preparing:        { label: 'Preparing',        className: 'badge-info',     icon: null },
    out_for_delivery: { label: 'Out for Delivery', className: 'badge-warning',  icon: null },
    delivered:        { label: 'Delivered',        className: 'badge-verified', icon: <FiCheckCircle size={12} /> },
    cancelled:        { label: 'Cancelled',        className: 'badge-danger',   icon: <FiXCircle size={12} /> },
    ready_for_pickup: { label: 'Ready for Pickup', className: 'badge-verified', icon: <FiCheckCircle size={12} /> },
  };

  const cfg = configs[status] || { label: status, className: 'badge-info', icon: <FiInfo size={12} /> };
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${cfg.className} ${padding}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

/**
 * Verification badge for pharmacies and suppliers
 */
export function VerificationBadge({ verified, size = 'sm' }) {
  if (!verified) return null;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1 badge-verified rounded-full font-medium ${padding}`}>
      <MdVerified size={12} />
      Verified
    </span>
  );
}
