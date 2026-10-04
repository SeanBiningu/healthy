import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicinesApi, ordersApi } from '../../services/api';
import { MedicineAvailabilityCard } from '../../components/Cards';
import { SkeletonCard, ErrorState, MedicalDisclaimer, Button, DemoNotice } from '../../components/UI';
import { FiArrowLeft, FiAlertTriangle, FiInfo } from 'react-icons/fi';

export default function MedicineDetailPage() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderModal, setOrderModal] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      medicinesApi.getById(id),
      medicinesApi.getAvailability(id),
    ])
      .then(([medData, avData]) => {
        setMedicine(medData.medicine);
        setAvailability(avData.availability || []);
      })
      .catch(() => setError("We couldn't load this medicine. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleOrder = async (avail) => {
    setOrdering(true);
    try {
      await ordersApi.create({
        pharmacyId: avail.pharmacyId,
        items: [{ medicineId: medicine.id, medicineName: `${medicine.name} ${medicine.strength}`, quantity: 1, price: avail.price, subtotal: avail.price }],
        deliveryType: avail.deliveryAvailable ? 'delivery' : 'pickup',
        deliveryAddress: avail.deliveryAvailable ? '— Enter on checkout —' : null,
        total: avail.price,
      });
      setOrderModal(null);
      setOrderSuccess(true);
    } catch {
      alert('Order failed. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <SkeletonCard lines={5} />
      <SkeletonCard lines={3} />
      <SkeletonCard lines={3} />
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ErrorState message={error} />
    </div>
  );

  if (!medicine) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-4">
        <DemoNotice />
      </div>

      <Link to="/dashboard/medicines" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-800 mb-5 transition-colors">
        <FiArrowLeft size={14} /> Back to search
      </Link>

      {/* Medicine info */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{medicine.name}</h1>
              <span className="text-sm text-gray-500 font-medium">{medicine.strength}</span>
              {medicine.requiresPrescription && (
                <span className="bg-purple-100 text-purple-700 border border-purple-200 text-xs px-2 py-0.5 rounded-full font-semibold">
                  Prescription Required
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">{medicine.genericName} • {medicine.form}</p>
            <p className="text-xs text-gray-400 mt-0.5">{medicine.category} — {medicine.manufacturer}</p>
          </div>
          <div className="bg-green-50 text-green-900 rounded-xl px-4 py-2 text-center shrink-0">
            <p className="text-xs font-medium">Category</p>
            <p className="font-bold text-sm">{medicine.category}</p>
          </div>
        </div>

        {medicine.requiresPrescription && (
          <div className="flex items-start gap-2 bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-800 mb-4">
            <FiAlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p>This medicine requires a valid prescription from a qualified healthcare professional. Please bring your prescription to the pharmacy.</p>
          </div>
        )}

        {/* Info sections */}
        {[
          { label: 'What it is used for', value: medicine.uses },
          { label: 'Dosage information', value: medicine.dosageInfo },
          { label: 'Warnings & precautions', value: medicine.warnings },
          { label: 'Possible side effects', value: medicine.sideEffects },
          { label: 'Contraindications', value: medicine.contraindications },
          { label: 'Storage instructions', value: medicine.storageInstructions },
        ].map(({ label, value }) => (
          value ? (
            <div key={label} className="mb-3 last:mb-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
            </div>
          ) : null
        ))}
      </div>

      <MedicalDisclaimer />

      {/* Availability */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available at</h2>
        {availability.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <p className="text-3xl mb-3">🔍</p>
            <p className="font-medium">No availability data found</p>
            <p className="text-sm mt-1">Try a different location or search again later.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availability.map((a) => (
              <MedicineAvailabilityCard
                key={a.pharmacyId}
                availability={a}
                onSelect={() => setOrderModal(a)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order success */}
      {orderSuccess && (
        <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm">
          <p className="font-semibold mb-1">✅ Order placed successfully!</p>
          <p>Check your <Link to="/dashboard/orders" className="underline font-medium">orders page</Link> for status updates.</p>
        </div>
      )}

      {/* Order confirmation modal */}
      {orderModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Order</h3>
            <p className="text-sm text-gray-500 mb-4">
              Order <strong>{medicine.name} {medicine.strength}</strong> from <strong>{orderModal.pharmacyName}</strong>?
            </p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm mb-4 space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="font-semibold">\${orderModal.price?.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Type</span><span>{orderModal.deliveryAvailable ? 'Delivery / Pickup' : 'Pickup Only'}</span></div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setOrderModal(null)}>Cancel</Button>
              <Button className="flex-1" loading={ordering} onClick={() => handleOrder(orderModal)}>Place Order</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
