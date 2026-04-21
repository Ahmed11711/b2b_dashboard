import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Ads from "./pages/ads";
import GenericFormPage from "./components/components/BaseComponents/FullDynamic/GenericFormPage";
import GenericViewPage from "./components/components/BaseComponents/FullDynamic/GenericViewPage";
import { AdsFields } from "./schemas/adsSchema";
import AppPage from "./pages/app/AppPage";
import PackagesPage from "./pages/Packages/PackagesPage";
import AdsPage from "./pages/Ads/AdsPage";
import { BagFields } from "./schemas/BagSchema";
import BagPage from "./pages/Bag/BagPage";
import Bags_categoriesPage from "./pages/bags_categories/Bags_categoriesPage";
import { BagsCategoryFields } from "./schemas/bags_categoriesSchema";
import StyleGuide from "./pages/StyleGuide";
import Bag_itemsPage from "./pages/bag_items/Bag_itemsPage";
import PackagesFormPage from "./pages/Packages/PackagesFormPage";
import PackagesViewPage from "./pages/Packages/PackagesViewPage";
import BagItemsFormPage from "./pages/bag_items/BagItemsFormPage";
import BagItemsViewPage from "./pages/bag_items/BagItemsViewPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <BrowserRouter basename="/dashboard">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes Wrapper */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/style-guide" element={<ProtectedRoute><StyleGuide /></ProtectedRoute>} />

        {/* Ads Routes */}
        <Route path="/ads" element={<ProtectedRoute><AdsPage /></ProtectedRoute>} />
        <Route path="/ads/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="ads" fields={AdsFields} mode="edit" title="Edit Advertisement" /></ProtectedRoute>} />
        <Route path="/ads/view/:id" element={<ProtectedRoute><GenericViewPage entityName="ads" fields={AdsFields} title="Ad Details" /></ProtectedRoute>} />

        {/* App Routes */}
        <Route path="/app" element={<ProtectedRoute><AppPage /></ProtectedRoute>} />

        {/* Packages Routes */}
        <Route path="/Packages" element={<ProtectedRoute><PackagesPage /></ProtectedRoute>} />
        <Route path="/Packages/edit/:id" element={<ProtectedRoute><PackagesFormPage mode="edit" /></ProtectedRoute>} />
        <Route path="/Packages/view/:id" element={<ProtectedRoute><PackagesViewPage /></ProtectedRoute>} />

        {/* Bag Routes */}
        <Route path="/Bag" element={<ProtectedRoute><BagPage /></ProtectedRoute>} />
        <Route path="/bags/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="bags" fields={BagFields} mode="edit" title="Edit Bag" /></ProtectedRoute>} />
        <Route path="/bags/view/:id" element={<ProtectedRoute><GenericViewPage entityName="bags" fields={BagFields} title="Bag Details" /></ProtectedRoute>} />

        {/* Bags Categories Routes */}
        <Route path="/bags_categories" element={<ProtectedRoute><Bags_categoriesPage /></ProtectedRoute>} />
        <Route path="/bags_categories/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="bags_categories" fields={BagsCategoryFields} mode="edit" title="Edit Category" /></ProtectedRoute>} />
        <Route path="/bags_categories/view/:id" element={<ProtectedRoute><GenericViewPage entityName="bags_categories" fields={BagsCategoryFields} title="Category Details" /></ProtectedRoute>} />

        {/* Bag Items Routes (تم الإصلاح هنا) */}
        <Route path="/bag_items" element={<ProtectedRoute><Bag_itemsPage /></ProtectedRoute>} />
        <Route path="/bag_items/edit/:id" element={<ProtectedRoute><BagItemsFormPage mode="edit" /></ProtectedRoute>} />
        <Route path="/bag_items/view/:id" element={<ProtectedRoute><BagItemsViewPage /></ProtectedRoute>} />
        
      </Routes>
    </BrowserRouter>
  );
}