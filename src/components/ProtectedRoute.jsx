import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import Layout from './layout/Layout';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; // Or a spinner component
  }

  if (!token) {
    // User not authenticated, redirect to login page
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // User authenticated but role not allowed, redirect to a default dashboard or unauthorized page
    // For now, redirect to a generic dashboard. You might want a specific unauthorized page.
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
