import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();

  if (!auth) return <Navigate to='/login' />;
  if (!allowedRoles.includes(auth?.user?.role))
    return <Navigate to='/unauthorized' />;

  return children;
};

export default PrivateRoute;
