import React, { useState, useEffect } from 'react';
import { pharmacies as initialPharmacies } from '../../data/demoData';
import { FiTrash2, FiPlus, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function AdminPharmacies() {
  const [pharmaciesList, setPharmaciesList] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pathway_pharmacies');
      if (stored) {
        setPharmaciesList(JSON.parse(stored));
      } else {
        setPharmaciesList(initialPharmacies);
        localStorage.setItem('pathway_pharmacies', JSON.stringify(initialPharmacies));
      }
    } catch {
      setPharmaciesList(initialPharmacies);
    }
  }, []);

  const savePharmacies = (newPharmacies) => {
    setPharmaciesList(newPharmacies);
    localStorage.setItem('pathway_pharmacies', JSON.stringify(newPharmacies));
  };

  const handleAdd = () => {
    const newPharmacy = {
      id: `ph-${Math.random().toString(36).substring(2, 9)}`,
      name: `New Pharmacy ${Math.floor(Math.random() * 100)}`,
      verified: Math.random() > 0.5,
      address: '123 New Street, Harare',
      phone: '+263 77 000 0000',
      email: `contact${Math.floor(Math.random() * 100)}@pharmacy.demo`,
      openingHours: 'Mon-Fri: 08:00-17:00',
      deliveryAvailable: true,
      city: 'Harare',
    };
    savePharmacies([newPharmacy, ...pharmaciesList]);
  };

  const handleRemove = (id) => {
    savePharmacies(pharmaciesList.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Pharmacies</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-950 transition-colors"
        >
          <FiPlus size={16} /> Add Pharmacy
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Pharmacy Name</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Verified</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pharmaciesList.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4">{p.city}</td>
                  <td className="px-6 py-4 text-xs">{p.email}<br/>{p.phone}</td>
                  <td className="px-6 py-4">
                    {p.verified ? (
                      <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-full w-fit text-xs font-medium">
                        <FiCheckCircle size={14} /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded-full w-fit text-xs font-medium">
                        <FiXCircle size={14} /> No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                      title="Remove Pharmacy"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {pharmaciesList.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No pharmacies found.
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
