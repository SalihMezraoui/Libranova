import React from 'react';
import './App.css';
import { Header } from './components/NavBar/Header';
import { Footer } from './components/Footer/Footer';
import { MainPage } from './components/MainPage/MainPage';
import { SearchBookPage } from './components/SearchBookPage/SearchBookPage';

export const App = () =>{
  return (
    <div>
      <Header />
      {/* <MainPage /> */}
      <SearchBookPage />
      <Footer/>
    </div>
  );
}
