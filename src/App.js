import React from 'react';
import './App.css';
import ThreeDScroll from './ThreeDScroll';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Earth from './Earth'; // Earth 컴포넌트를 import
import ShoppingPage from './Shoppingpage';



function MainPage() {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기

  const handleNavigateToEarth = () => {
    navigate('/earth'); // 이동하려는 경로로 변경
  };

  const handleNavigateToShop = () => {
    navigate('/Shoppingpage'); // 이동하려는 경로로 변경
  };

  return (
    <div className="App">
      <ThreeDScroll />
      <div className="content-container">
        <div className="scroll-container">
          <button className='button1' onClick={handleNavigateToEarth}>NEED MORE CASH</button>
          <button className='button2' onClick={handleNavigateToShop}>SHOP NOW</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/earth" element={<Earth />} />
        <Route path="/shoppingpage" element={<ShoppingPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;