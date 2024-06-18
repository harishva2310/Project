import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState } = useOktaAuth();
  const location = useLocation();

  if (!authState || !authState.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
