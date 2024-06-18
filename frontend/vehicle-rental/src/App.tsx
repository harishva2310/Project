import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar } from './layout/NavbarAndFooter/Navbar';
import { Footer } from './layout/NavbarAndFooter/Footer';
import { Route, useNavigate, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './layout/HomePage/HomePage';
import OktaAuth, { toRelativeUrl } from '@okta/okta-auth-js';
import oktaConfig from './lib/oktaConfig';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react'
import LoginWidget from './Auth/Login';
import AddNewVehicle from './layout/AddNewVehicle/AddNewVehicle';
import ProtectedRoute from './Auth/ProtectedRoute';
import { RequiredAuth } from './Auth/SecureRoute';



const oktaAuth = new OktaAuth(oktaConfig);


export const App = () => {

  const navigate = useNavigate();
  const customAuthHandler = () => {
    navigate('/login');
  }


  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Routes>
          <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
          <Route path="/login" element={<LoginWidget config={oktaConfig} />} />
          <Route path="/login/callback" element={<LoginCallback />} />
          <Route
            path="/addnewvehicle"
            element={<RequiredAuth />}>
            <Route path='' element={<AddNewVehicle />} />
          </Route>

        </Routes>
      </Security>
    </div>
  );
};