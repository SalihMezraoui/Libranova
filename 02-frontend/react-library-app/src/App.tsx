import React from 'react';
import './App.css';
import { Header } from './components/NavBar/Header';
import { Footer } from './components/Footer/Footer';
import { MainPage } from './components/MainPage/MainPage';

export const App = () =>{
  return (
    <div>
      <Header />
      <MainPage />
      <Footer/>
    </div>
  );
}
