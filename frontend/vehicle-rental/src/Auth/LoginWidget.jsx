import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { SpinnerLoading } from '../util/SpinnerLoading';
import OktaSignInWidget from './OktaSignInWidget';

const LoginWidget = ({ config }) => {
  const navigate = useNavigate();
  const { oktaAuth, authState } = useOktaAuth();

  const onSuccess = (tokens) => {
    oktaAuth.handleLoginRedirect(tokens);
    navigate('/'); // Redirect to home page after successful authentication
  };

  const onError = (err) => {
    console.log('Sign in error: ', err);
  };

  if (!authState) {
    return <SpinnerLoading />;
  }

  return authState.isAuthenticated ? (
    <Navigate to="/" replace /> // Navigate and replace history entry
  ) : (
    <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError} />
  );
};

export default LoginWidget;
