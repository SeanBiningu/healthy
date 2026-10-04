import React, { useState } from 'react';
import { FiShield, FiCheckCircle, FiAlertTriangle, FiXCircle, FiTrash2 } from 'react-icons/fi';

const mockLogs = [
  { id: 'v-1', code: 'DEMO-AMX-001', product: 'Amoxicillin 500mg', status: 'verified', date: '2024-06-10T14:30:00Z', user: 'patient@pathway.demo' },
  { id: 'v-2', code: 'DEMO-ISSUE-999', product: 'Unknown', status: 'potential_issue', date: '2024-06-11T09:15:00Z', user: 'patient@pathway.demo' },
  { id: 'v-3', code: 'DEMO-PCM-002', product: 'Paracetamol 500mg', status: 'verified', date: '2024-06-12T11:45:00Z', user: 'patient@pathway.demo' },
  { id: 'v-4', code: 'INVALID-123', product: 'Unknown', status: 'unable_to_verify', date: '2024-06-12T16:20:00Z', user: 'anonymous' },
];

export default function AdminVerification() {
  const [logs, setLogs] = useState(mockLogs);

  const handleRemove = (id) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'verified':
        return <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-medium w-fit"><FiCheckCircle size={13} /> Verified</span>;
      case 'potential_issue':
        return <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-full text-xs font-medium w-fit"><FiAlertTriangle size={13} /> Issue</span>;
      default:
        return <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs font-medium w-fit"><FiXCircle size={13} /> Unverified</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verification Logs</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Verification Code</th>
                <th className="px-6 py-4">Product Match</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900">{l.code}</td>
                  <td className="px-6 py-4">{l.product}</td>
                  <td className="px-6 py-4">{getStatusDisplay(l.status)}</td>
                  <td className="px-6 py-4">{new Date(l.date).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(l.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                      title="Remove Log"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No verification logs found.
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
