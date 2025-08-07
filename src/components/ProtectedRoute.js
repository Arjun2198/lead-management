import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const uid = localStorage.getItem('uid');
  const role = localStorage.getItem('userRole');

  if (!uid || !role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
