import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import FindMedicinePage from './pages/public/FindMedicinePage';

// Dashboard pages
import PatientDashboard from './pages/dashboard/PatientDashboard';
import MedicineDetailPage from './pages/dashboard/MedicineDetailPage';
import PharmacyLocatorPage from './pages/dashboard/PharmacyLocatorPage';
import VerifyMedicinePage from './pages/dashboard/VerifyMedicinePage';
import HealthAssistantPage from './pages/dashboard/HealthAssistantPage';
import FirstAidPage from './pages/dashboard/FirstAidPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// Admin / Pharmacy pages (basic for MVP)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPharmacies from './pages/admin/AdminPharmacies';
import AdminMedicines from './pages/admin/AdminMedicines';
import AdminOrders from './pages/admin/AdminOrders';
import AdminVerification from './pages/admin/AdminVerification';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/find-medicine" element={<FindMedicinePage />} />
            <Route path="/pharmacies" element={<PharmacyLocatorPage />} />
          </Route>

          {/* Patient dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="medicines" element={<FindMedicinePage />} />
            <Route path="medicines/:id" element={<MedicineDetailPage />} />
            <Route path="pharmacies" element={<PharmacyLocatorPage />} />
            <Route path="verify" element={<VerifyMedicinePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="health-assistant" element={<HealthAssistantPage />} />
            <Route path="first-aid" element={<FirstAidPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Admin dashboard routes */}
          <Route path="/admin" element={<DashboardLayout requiredRole="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="pharmacies" element={<AdminPharmacies />} />
            <Route path="medicines" element={<AdminMedicines />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="verification" element={<AdminVerification />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Pharmacy dashboard routes */}
          <Route path="/pharmacy" element={<DashboardLayout requiredRole="pharmacy" />}>
            <Route path="dashboard" element={<PharmacyDashboard />} />
            {/* Redirect other pharmacy routes to dashboard for MVP */}
            <Route path="*" element={<Navigate to="/pharmacy/dashboard" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
