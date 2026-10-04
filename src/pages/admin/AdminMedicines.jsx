import React, { useState, useEffect } from 'react';
import { medicines as initialMedicines } from '../../data/demoData';
import { FiTrash2, FiPlus, FiTag } from 'react-icons/fi';

export default function AdminMedicines() {
  const [medicinesList, setMedicinesList] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pathway_medicines');
      if (stored) {
        setMedicinesList(JSON.parse(stored));
      } else {
        setMedicinesList(initialMedicines);
        localStorage.setItem('pathway_medicines', JSON.stringify(initialMedicines));
      }
    } catch {
      setMedicinesList(initialMedicines);
    }
  }, []);

  const saveMedicines = (newMedicines) => {
    setMedicinesList(newMedicines);
    localStorage.setItem('pathway_medicines', JSON.stringify(newMedicines));
  };

  const handleAdd = () => {
    const newMed = {
      id: `m-${Math.random().toString(36).substring(2, 8)}`,
      name: `New Medicine ${Math.floor(Math.random() * 100)}`,
      genericName: 'Sample Generic',
      brandNames: ['SampleBrand'],
      strength: '500mg',
      form: 'Tablet',
      category: 'General',
      manufacturer: 'Demo Pharma',
      requiresPrescription: false,
      verificationCode: `DEMO-NEW-${Math.floor(Math.random() * 1000)}`,
    };
    saveMedicines([newMed, ...medicinesList]);
  };

  const handleRemove = (id) => {
    saveMedicines(medicinesList.filter((m) => m.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Medicines</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-950 transition-colors"
        >
          <FiPlus size={16} /> Add Medicine
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Form & Strength</th>
                <th className="px-6 py-4">Verification Code</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {medicinesList.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {m.name}
                    <div className="text-xs text-gray-400 font-normal">{m.genericName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs w-fit">
                      <FiTag size={12} /> {m.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{m.form} • {m.strength}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{m.verificationCode}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(m.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                      title="Remove Medicine"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {medicinesList.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No medicines found.
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
