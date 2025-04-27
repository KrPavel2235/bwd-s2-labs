import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectAuth } from '../store/slices/authSlice';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppSelector(selectAuth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
