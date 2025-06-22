import React from 'react';
import './App.css';
import { Header } from './components/NavBar/Header';
import { Footer } from './components/Footer/Footer';
import { MainPage } from './components/MainPage/MainPage';
import { SearchBookPage } from './components/SearchBookPage/SearchBookPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { CheckoutBook } from './components/CheckoutBook/CheckoutBook';
import { ok } from 'assert';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { oktaConfig } from './lib/oktaConfig';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import OktaLoginWidget from './access/OktaLoginWidget';
import { ReviewList } from './components/ReviewListPage/ReviewList';
import { LibraryActivity } from './components/LibraryActivityPage/LibraryActivity';


const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Header />
        <div className='flex-grow-1'>
          <Switch>
            <Route path='/' exact>
              <Redirect to='/home' />
            </Route>
            <Route path='/home'>
              <MainPage />
            </Route>
            <Route path='/search'>
              <SearchBookPage />
            </Route>
            <Route path='/reviewsList/:bookId'>
              <ReviewList />
            </Route>
            <Route path='/checkout/:bookId'>
              <CheckoutBook />
            </Route>
            <Route path='/login' render={() => <OktaLoginWidget config={oktaConfig} />} />
            <Route path='login/callback' component={LoginCallback} />
            <SecureRoute path='/libraryActivity'> <LibraryActivity /> </SecureRoute>

          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
}
