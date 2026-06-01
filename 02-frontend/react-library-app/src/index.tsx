import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './i18n';
import { Auth0Provider } from '@auth0/auth0-react';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const onRedirectCallback = (appState: any) => {
    window.history.replaceState(
        {},
        document.title,
        appState?.returnTo || window.location.pathname
    );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
      authorizationParams={{
          redirect_uri: window.location.origin,
          audience: process.env.REACT_APP_AUTH0_AUDIENCE!,
          scope: 'openid profile email offline_access'
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
  >
      <BrowserRouter>
          <Elements stripe={stripePromise}>
              <App />
          </Elements>
      </BrowserRouter>
  </Auth0Provider>
);


