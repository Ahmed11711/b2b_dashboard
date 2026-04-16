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
import {PackagesFields} from "./schemas/PackagesSchema"
import {BagFields} from "./schemas/BagSchema"
import BagPage from "./pages/Bag/BagPage";
import Bags_categoriesPage from "./pages/bags_categories/Bags_categoriesPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
   
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

const DashboardRouter = () => {
  return <Dashboard />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ads"
          element={
            <ProtectedRoute>
              <Ads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ads/edit/:id"
          element={
            <GenericFormPage
              endpoint="ads"  
              fields={AdsFields}  
              mode="edit"  
              title="Edit Advertisement"
            />
          }
        />
        <Route
          path="/ads/view/:id"
          element={
            <GenericViewPage
              entityName="ads"
              title="Ad Details"
              fields={AdsFields}
            />
          }
        />
      </Routes>

      <Routes>
        
  {/* AUTO ROUTE: app */}

  <Route
    path="/app"
    element={
      <ProtectedRoute>
        <AppPage />
      </ProtectedRoute>
    }
  />


  {/* AUTO ROUTE: User */}

 


{/* AUTO ROUTE: Packages */}
<Route
  path="/Packages"
  element={
    <ProtectedRoute>
      <PackagesPage />
    // </ProtectedRoute>
  }
/>
 <Route
          path="/Packages/edit/:id"
          element={
            <GenericFormPage
              endpoint="packages"  
              fields={PackagesFields}  
              mode="edit"  
              title="Edit Advertisement"
            />
          }
        />
 
        <Route
          path="/Packages/view/:id"
          element={
            <GenericViewPage
              entityName="packages"
              title="packages Details"
              fields={PackagesFields}
            />
          }
        />

{/* AUTO ROUTE: Ads */}
<Route
  path="/Ads"
  element={
    <ProtectedRoute>
      <AdsPage />
    </ProtectedRoute>
  }
/>


{/* AUTO ROUTE: Bag */}
<Route
  path="/Bag"
  element={
    <ProtectedRoute>
      <BagPage />
    </ProtectedRoute>
  }
/>
 <Route
          path="/bags/edit/:id"
          element={
            <GenericFormPage
              endpoint="bags"  
              fields={BagFields}  
              mode="edit"  
              title="Edit Advertisement"
            />
          }
        />
 
        <Route
          path="/bags/view/:id"
          element={
            <GenericViewPage
              entityName="bags"
              title="packages Details"
              fields={BagFields}
            />
          }
        />


{/* AUTO ROUTE: bags_categories */}
<Route
  path="/bags_categories"
  element={
    <ProtectedRoute>
      <Bags_categoriesPage />
    </ProtectedRoute>
  }
/>

{/* AUTO ROUTES START */}
        {/* AUTO ROUTES END */}
      </Routes>
    </BrowserRouter>



  );
}
