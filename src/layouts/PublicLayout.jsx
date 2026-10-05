import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiPlusSquare } from 'react-icons/fi';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar onMenuToggle={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-900">
            <span className="text-[#0D6A46] bg-green-50 p-1 rounded">
              <FiPlusSquare size={16} fill="currentColor" className="text-white" />
            </span>
            <span className="text-sm font-semibold">Pathway</span>
          </div>
          <nav className="flex items-center gap-5 text-xs text-gray-500 font-medium">
            <Link to="/find-medicine"    className="hover:text-gray-900 transition-colors">Find medicine</Link>
            <Link to="/pharmacies"       className="hover:text-gray-900 transition-colors">Pharmacies</Link>
            <Link to="/dashboard/verify" className="hover:text-gray-900 transition-colors">Verify medicine</Link>
            <Link to="/register"         className="hover:text-gray-900 transition-colors">Contact</Link>
          </nav>
          <p className="text-xs text-gray-400">© 2025 Pathway</p>
        </div>
      </footer>
    </div>
  );
}
