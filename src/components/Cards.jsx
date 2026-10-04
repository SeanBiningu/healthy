import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiTruck, FiClock } from 'react-icons/fi';
import { StatusBadge, VerificationBadge } from './StatusBadge';

/**
 * Medicine card for search results
 */
export function MedicineCard({ medicine, showAvailability = false, availability }) {
  return (
    <Link
      to={`/dashboard/medicines/${medicine.id}`}
      className="card p-4 hover:shadow-md transition-shadow block"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm">{medicine.name}</h3>
            {medicine.requiresPrescription && (
              <span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded-full font-medium">
                Rx
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{medicine.genericName} • {medicine.strength} • {medicine.form}</p>
          <p className="text-xs text-gray-400 mt-0.5">{medicine.category}</p>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{medicine.manufacturer}</span>
      </div>

      {showAvailability && availability && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">Available at</p>
          <div className="space-y-2">
            {availability.slice(0, 3).map((a) => (
              <div key={a.pharmacyId} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <VerificationBadge verified={a.pharmacyVerified} />
                  <span className="text-xs text-gray-700 truncate">{a.pharmacyName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {a.price && (
                    <span className="text-xs font-semibold text-green-900">\${a.price.toFixed(2)}</span>
                  )}
                  <StatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Link>
  );
}

/**
 * Availability row card for medicine detail page
 */
export function MedicineAvailabilityCard({ availability, onSelect }) {
  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-semibold text-gray-900 text-sm">{availability.pharmacyName}</h4>
            <VerificationBadge verified={availability.pharmacyVerified} />
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <FiMapPin size={11} />
            {availability.pharmacyAddress}
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <StatusBadge status={availability.status} />
            {availability.deliveryAvailable ? (
              <span className="text-xs text-green-800 flex items-center gap-1">
                <FiTruck size={11} /> Delivery Available
              </span>
            ) : (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <FiTruck size={11} /> Pickup Only
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1.5">
            <FiClock size={11} />
            {availability.openingHours}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {availability.price && (
            <p className="text-lg font-bold text-gray-900">\${availability.price.toFixed(2)}</p>
          )}
          {availability.status !== 'out_of_stock' && onSelect && (
            <button
              onClick={() => onSelect(availability)}
              className="text-xs bg-green-900 text-white px-3 py-1.5 rounded-lg hover:bg-green-950 transition-colors font-medium"
            >
              Order / Pickup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Pharmacy card for locator
 */
export function PharmacyCard({ pharmacy, onClick }) {
  return (
    <button
      onClick={() => onClick?.(pharmacy)}
      className="card p-4 hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{pharmacy.name}</h3>
            <VerificationBadge verified={pharmacy.verified} />
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <FiMapPin size={11} /> {pharmacy.address}
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <FiClock size={11} /> {pharmacy.openingHours}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {pharmacy.deliveryAvailable && (
            <span className="text-xs text-green-800 flex items-center gap-1">
              <FiTruck size={11} /> Delivery
            </span>
          )}
          {pharmacy.availableMedicineCount !== undefined && (
            <p className="text-xs text-gray-400 mt-1">
              {pharmacy.availableMedicineCount} items available
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
