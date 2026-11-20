import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AuthVerify from "./pages/AuthVerify";
import AuthCallback from "./pages/AuthCallback";
import Products from "./pages/Products";
import ListingDetails from "./pages/ListingDetails";
import Vendors from "./pages/Vendors";
import VendorStore from "./pages/VendorStore";
import SellApply from "./pages/SellApply";
import AddListing from "./pages/AddListing";
import AdminApplications from "./pages/AdminApplications";
import VendorDashboard from "./pages/VendorDashboard";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import Notifications from "./pages/Notifications";
import Addresses from "./pages/Addresses";
import Settings from "./pages/Settings";
import Escrow from "./pages/Escrow";
import "./index.css";

function App() {
  const API = import.meta.env.VITE_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((res) => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, [API]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* public */}
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login initialMode="signup" />} />
            <Route path="/verify" element={<AuthVerify />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/products" element={<Products />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendors/:id" element={<VendorStore />} />
            <Route path="/sell/apply" element={<SellApply />} />

            {/* signed in */}
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} loading={loading} />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Escrow />} />
              <Route path="/marketplace" element={<div>Marketplace Page</div>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/saved" element={<Saved />} />
              <Route path="/profile/notifications" element={<Notifications />} />
              <Route path="/profile/addresses" element={<Addresses />} />
              <Route path="/profile/settings" element={<Settings />} />
            </Route>

            {/* vendors only */}
            <Route element={<ProtectedRoute roles={["vendor"]} />}>
              <Route path="/vendor" element={<VendorDashboard />} />
              <Route path="/sell/new" element={<AddListing />} />
            </Route>

            {/* admins only */}
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/admin/applications" element={<AdminApplications />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;