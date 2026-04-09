import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import StaffDashboard from './pages/StaffDashboard';
import Services from './pages/Services';
import Offers from './pages/Offers';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Availability from './pages/Availability';
import Staff from './pages/Staff';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Ads from './pages/ads'
import GenericFormPage from "./components/components/BaseComponents/FullDynamic/GenericFormPage";
import GenericViewPage from './components/components/BaseComponents/FullDynamic/GenericViewPage';
 import { AdsFields } from "./schemas/adsSchema"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

const DashboardRouter = () => {
  const role = localStorage.getItem('role');
  return role === 'staff' ? <StaffDashboard /> : <Dashboard />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/availability" element={<ProtectedRoute><Availability /></ProtectedRoute>} />
        <Route path="/ads" element={<ProtectedRoute><Ads /></ProtectedRoute>} />
     <Route 
  path="/ads/edit/:id" 
  element={
    <GenericFormPage 
      endpoint="ads"          // اسم الـ API اللي هنكلمه
      fields={AdsFields}      // الخريطة اللي انت لسه باعتها دي
      mode="edit"             // عشان يفهم إنه هيعمل Get للبيانات الأول
      title="Edit Advertisement" 
    />
  }
  />
  <Route 
  path="/ads/view/:id" 
  element={<GenericViewPage entityName="ads" title="Ad Details" fields={AdsFields} />} 
/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
