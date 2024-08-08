import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar } from './layout/NavbarAndFooter/Navbar';
import { Footer } from './layout/NavbarAndFooter/Footer';
import { Route, useNavigate, Routes, Navigate } from 'react-router-dom';
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
import SearchVehicle from './layout/SearchVehicle/SearchVehicle';
import Checkout from './layout/Checkout/Checkout';
import UserBookings from './layout/UserBookings/UserBookings';
import Payment from './layout/PaymentPage/PaymentPage';
import ConfirmationPage from './layout/ConfirmationPage/ConfirmationPage';
import UserBookingsV2 from './layout/UserBookings/UserBookingsV2';
import AddVehicleLocations from './layout/AddVehicleLocations/AddVehicleLocations';
import AdminPage from './layout/AdminPage/AdminPage';
import SearchVehicleV2 from './layout/SearchVehicle/SearchVehicleV2';
import AddNewLocations from './layout/AddNewLocations/AddNewLocations';
import SearchVehicleV3 from './layout/SearchVehicle/SearchVehicleV3';
import Notifications from './layout/NotificationPage/Notifications';



const oktaAuth = new OktaAuth(oktaConfig);


export const App = () => {

  const navigate = useNavigate();
  const customAuthHandler = () => {
    navigate('/login');
  }


  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });
    window.location.reload();
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
      <Navbar />
      <div className='flex-grow-1'>
        <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/home" />} />
          
          <Route path="/login/callback" element={<LoginCallback />} />
          <Route path="/searchvehicles" element={<SearchVehicleV3 />} />

          <Route path="/notifications" element={<Notifications />} />
          
          <Route path="/addnewvehicle" element={<RequiredAuth />}>
            <Route path='' element={<AddNewVehicle />} />
          </Route>
          <Route path="/addnewlocations" element={<RequiredAuth />}>
            <Route path='' element={<AddNewLocations />} />
          </Route>
          <Route path="/addvehiclelocations" element={<RequiredAuth />}>
            <Route path='' element={<AddVehicleLocations />} />
          </Route>
          <Route path="/login" element={<RequiredAuth />}>
            <Route path='' element={<Navigate to="/home" />}/>
          </Route>
          <Route path="/checkout" element={<RequiredAuth />}>
            <Route path='' element={<Checkout />} />
          </Route>
          <Route path="/myBookings" element={<RequiredAuth />}>
            <Route path='' element={<UserBookingsV2 />} />
          </Route>

          <Route path="/admin" element={<RequiredAuth />}>
            <Route path='' element={<AdminPage />} />
          </Route>
          <Route path="/payment" element={<RequiredAuth />}>
            <Route path='' element={<Payment />} />
          </Route>
          <Route path="/confirmation" element={<RequiredAuth />}>
            <Route path='' element={<ConfirmationPage />} />
          </Route>
        </Routes>
        </div>
        <Footer />
      </Security>
    </div>
  );
};