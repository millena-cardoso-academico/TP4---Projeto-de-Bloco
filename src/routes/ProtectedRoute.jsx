import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { signed } = useAuth();

  return signed ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
