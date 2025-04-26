import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getFromStorage } from '../utils/storage';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = '/login' }) => {
  const user = getFromStorage('user');

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
