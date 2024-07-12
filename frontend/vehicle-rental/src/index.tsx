import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise=loadStripe('pk_test_51PahYdEqVWFP4EYlbC8NShFjUjg0Rd2jkDP30ymkclnrXNtZfBaojRnW8bA9Zs1qkTfx3mCHrmSYp26LQCvkCxVW00Tjtp68ig');
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Elements stripe={stripePromise}>
    <App />
    </Elements>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
