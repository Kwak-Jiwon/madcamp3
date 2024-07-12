// src/App.js
import React from 'react';
import './App.css';
import ThreeDScroll from './ThreeDScroll';

function App() {
  return (
    <div className="App">
      <ThreeDScroll />
      <div className="content-container">
        <div className="scroll-container">
          <button className='button'>NEED MORE CASH</button>
        </div>
      </div>
    </div>
  );
}

export default App;
