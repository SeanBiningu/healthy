import React from 'react';
import { DemoNotice } from '../../components/UI';

export default function PharmacyDashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <DemoNotice />
      <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4">Pharmacy Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome to your pharmacy portal.</p>
      
      <div className="card p-6 bg-gray-50 border-gray-100 text-center text-gray-500">
        <p>Pharmacy inventory management and order processing will be implemented in a future phase.</p>
      </div>
    </div>
  );
}
