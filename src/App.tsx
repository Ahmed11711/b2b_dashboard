import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
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
import UserPage from "./pages/User/UserPage";
import { UserFields } from "./schemas/UserSchema"
import ProviderPage from "./pages/Provider/ProviderPage";
import { ProviderFields } from "./schemas/ProviderSchema"
import CustomerPage from "./pages/Customer/CustomerPage";
import CategoryPage from "./pages/Category/CategoryPage";
import { CategoryFields } from "./schemas/CategorySchema"
import { CustomerFields } from "./schemas/CustomerSchema"
import ServicePage from "./pages/Service/ServicePage";
import { ServiceFields } from "./schemas/ServiceSchema";
import PostsPage from "./pages/Posts/PostsPage";
import { PostsFields } from "./schemas/PostsSchema"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

export default function App() {
  const { t } = useTranslation();
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
        <Route path="/ads/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="ads" fields={AdsFields} mode="edit" title={t("pages.ads.title")} /></ProtectedRoute>} />
        <Route path="/ads/view/:id" element={<ProtectedRoute><GenericViewPage entityName="ads" fields={AdsFields} title={t("pages.ads.details")} /></ProtectedRoute>} />

        {/* App Routes */}
        <Route path="/app" element={<ProtectedRoute><AppPage /></ProtectedRoute>} />

        {/* Packages Routes */}
        <Route path="/Packages" element={<ProtectedRoute><PackagesPage /></ProtectedRoute>} />
        <Route path="/Packages/edit/:id" element={<ProtectedRoute><PackagesFormPage mode="edit" /></ProtectedRoute>} />
        <Route path="/Packages/view/:id" element={<ProtectedRoute><PackagesViewPage /></ProtectedRoute>} />

        {/* Bag Routes */}
        <Route path="/Bag" element={<ProtectedRoute><BagPage /></ProtectedRoute>} />
        <Route path="/bags/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="bags" fields={BagFields} mode="edit" title={t("pages.bag.title")} /></ProtectedRoute>} />
        <Route path="/bags/view/:id" element={<ProtectedRoute><GenericViewPage entityName="bags" fields={BagFields} title={t("pages.bag.details")} /></ProtectedRoute>} />

        {/* Bags Categories Routes */}
        <Route path="/bags_categories" element={<ProtectedRoute><Bags_categoriesPage /></ProtectedRoute>} />
        <Route path="/bags_categories/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="bags_categories" fields={BagsCategoryFields} mode="edit" title={t("pages.bags_categories.title")} /></ProtectedRoute>} />
        <Route path="/bags_categories/view/:id" element={<ProtectedRoute><GenericViewPage entityName="bags_categories" fields={BagsCategoryFields} title={t("pages.bags_categories.details")} /></ProtectedRoute>} />

        {/* Bag Items Routes (تم الإصلاح هنا) */}
        <Route path="/bag_items" element={<ProtectedRoute><Bag_itemsPage /></ProtectedRoute>} />
        <Route path="/bag_items/edit/:id" element={<ProtectedRoute><BagItemsFormPage mode="edit" /></ProtectedRoute>} />
        <Route path="/bag_items/view/:id" element={<ProtectedRoute><BagItemsViewPage /></ProtectedRoute>} />


        {/* User  Routes */}
        <Route path="/User" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
        <Route path="/User/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="users" fields={UserFields} mode="edit" title={t("pages.user.title")} /></ProtectedRoute>} />
        <Route path="/User/view/:id" element={<ProtectedRoute><GenericViewPage entityName="users" fields={UserFields} title={t("pages.user.details")} /></ProtectedRoute>} />

        {/* Provider  Routes */}
        <Route path="/Provider" element={<ProtectedRoute><ProviderPage /></ProtectedRoute>} />
        <Route path="/Provider/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="provider" fields={ProviderFields} mode="edit" title={t("pages.provider.title")} /></ProtectedRoute>} />
        <Route path="/Provider/view/:id" element={<ProtectedRoute><GenericViewPage entityName="provider" fields={ProviderFields} title={t("pages.provider.details")} /></ProtectedRoute>} />

        {/* Customer  Routes */}
        <Route path="/Customer" element={<ProtectedRoute><CustomerPage /></ProtectedRoute>} />

        <Route path="/Customer/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="customer" fields={CustomerFields} mode="edit" title="Edit customer Item" /></ProtectedRoute>} />
        <Route path="/Customer/view/:id" element={<ProtectedRoute><GenericViewPage entityName="customer" fields={CustomerFields} title="customer Item Details" /></ProtectedRoute>} />


        {/* Category  Routes */}
        <Route path="/Category" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/Category/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="categories" fields={CategoryFields} mode="edit" title={t("pages.category.title")} /></ProtectedRoute>} />
        <Route path="/Category/view/:id" element={<ProtectedRoute><GenericViewPage entityName="categories" fields={CategoryFields} title={t("pages.category.details")} /></ProtectedRoute>} />

        {/* Service  Routes */}
        <Route path="/Service" element={<ProtectedRoute><ServicePage /></ProtectedRoute>} />
        <Route path="/Service/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="services" fields={ServiceFields} mode="edit" title="Edit Category Item" /></ProtectedRoute>} />
        <Route path="/Service/view/:id" element={<ProtectedRoute><GenericViewPage entityName="services" fields={ServiceFields} title="Category Item Details" /></ProtectedRoute>} />


        {/* posts  Routes */}
        <Route path="/Posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
        <Route path="/Posts/edit/:id" element={<ProtectedRoute><GenericFormPage endpoint="postss" fields={PostsFields} mode="edit" title="Edit Category Item" /></ProtectedRoute>} />
        <Route path="/Posts/view/:id" element={<ProtectedRoute><GenericViewPage entityName="postss" fields={PostsFields} title="Category Item Details" /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}