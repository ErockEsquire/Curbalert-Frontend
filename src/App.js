import React, { useState } from 'react';
import './App.css';
import Main from './containers/Main'
import Navbar from './containers/Navbar'

function App() {

  return (
    <section id="app">
      <Navbar/>
      <Main/>
    </section>
  );
}

export default App;
