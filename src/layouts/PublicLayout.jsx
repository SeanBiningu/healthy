import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onMenuToggle={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 py-6 px-4" style={{ backgroundColor: '#0d2d1e' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <span className="bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded">Px</span>
            <span className="text-sm font-semibold">Pathway</span>
          </div>
          <nav className="flex items-center gap-5 text-xs text-white/60">
            <Link to="/find-medicine"    className="hover:text-white transition-colors">Find medicine</Link>
            <Link to="/pharmacies"       className="hover:text-white transition-colors">Pharmacies</Link>
            <Link to="/dashboard/verify" className="hover:text-white transition-colors">Verify medicine</Link>
            <Link to="/register"         className="hover:text-white transition-colors">Contact</Link>
          </nav>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Pathway</p>
        </div>
      </footer>
    </div>
  );
}
