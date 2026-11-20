import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  // 1. Show a loading state while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-xs font-semibold">
        Verifying session...
      </div>
    );
  }
  if(!user){
    return <Navigate to="/login" replace />; 
  }
 if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  

  // 3. If logged in, render the protected component (e.g. Home Page)
  return <Outlet />;
}