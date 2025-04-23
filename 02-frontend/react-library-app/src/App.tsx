import React from 'react';
import './App.css';
import { Header } from './components/NavBar/Header';
import { Footer } from './components/Footer/Footer';
import { MainPage } from './components/MainPage/MainPage';
import { SearchBookPage } from './components/SearchBookPage/SearchBookPage';
import { Redirect, Route, Switch } from 'react-router-dom';

export const App = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
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
        </Switch>
      </div>
      <Footer />
    </div>
  );
}
