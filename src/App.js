// src/App.js
import React from 'react';
import './App.css';
import ThreeDScroll from './ThreeDScroll';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Scroll to Rotate 3D Model</h1>
      </header>
      <div className="scroll-container">
        <ThreeDScroll />
      </div>
    </div>
  );
}

export default App;
