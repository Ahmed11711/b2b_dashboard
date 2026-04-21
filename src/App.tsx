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
import { PackagesFields } from "./schemas/PackagesSchema";
import { BagFields } from "./schemas/BagSchema";
import BagPage from "./pages/Bag/BagPage";
import Bags_categoriesPage from "./pages/bags_categories/Bags_categoriesPage";
import { BagsCategoryFields } from "./schemas/bags_categoriesSchema";
import StyleGuide from "./pages/StyleGuide";
import { Bag_itemsFields } from "./schemas/bag_itemsSchema";
import Bag_itemsPage from "./pages/bag_items/Bag_itemsPage";
import UserPage from "./pages/User/UserPage";
import {UserFields} from "./schemas/UserSchema"
import ProviderPage from "./pages/Provider/ProviderPage";
import {ProviderFields} from "./schemas/ProviderSchema"
import CustomerPage from "./pages/Customer/CustomerPage";

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
        <Route path="/Packages/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="packages" fields={PackagesFields} mode="edit" title="Edit Package" /></ProtectedRoute>} />
        <Route path="/Packages/view/:id" element={<ProtectedRoute><GenericViewPage entityName="packages" fields={PackagesFields} title="Package Details" /></ProtectedRoute>} />

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
        <Route path="/bag_items/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="bag_items" fields={Bag_itemsFields} mode="edit" title="Edit Bag Item" /></ProtectedRoute>} />
        <Route path="/bag_items/view/:id" element={<ProtectedRoute><GenericViewPage entityName="bag_items" fields={Bag_itemsFields} title="Bag Item Details" /></ProtectedRoute>} />
        

        {/* User  Routes */}
        <Route path="/User" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
        <Route path="/User/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="users" fields={UserFields} mode="edit" title="Edit User Item" /></ProtectedRoute>} />
        <Route path="/User/view/:id" element={<ProtectedRoute><GenericViewPage entityName="users" fields={UserFields} title="User Item Details" /></ProtectedRoute>} />

   {/* Provider  Routes */}
        <Route path="/Provider" element={<ProtectedRoute><ProviderPage /></ProtectedRoute>} />
        <Route path="/Provider/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="provider" fields={ProviderFields} mode="edit" title="Edit Provider Item" /></ProtectedRoute>} />
        <Route path="/Provider/view/:id" element={<ProtectedRoute><GenericViewPage entityName="provider" fields={ProviderFields} title="Provider Item Details" /></ProtectedRoute>} />

 {/* Customer  Routes */}
        <Route path="/Customer" element={<ProtectedRoute><CustomerPage /></ProtectedRoute>} />
 


      </Routes>
    </BrowserRouter>
  );
}