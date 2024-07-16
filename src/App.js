// src/App.js
import React from 'react';
import './App.css';
import ThreeDScroll from './ThreeDScroll';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Earth from './Earth';
import ShoppingPage from './ShoppingPage'; // 정확한 파일 이름 사용
import CartPage from './CartPage'; // 새로운 CartPage 컴포넌트 추가
import PurchaseHistory from './PurchaseHistory.js';
import { AuthProvider } from './AuthContext';
import { useAuth } from './AuthContext';
import ItemDetail from './ItemDetail';
function MainPage() {
  const navigate = useNavigate();
  const { userId } = useAuth(); // useAuth 훅을 사용하여 사용자 ID를 가져옵니다.

  const handleNavigateToEarth = () => {
    navigate('/earth');
  };

  const handleNavigateToShop = () => {
    navigate('/shoppingpage');
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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/earth" element={<Earth />} />
          <Route path="/shoppingpage" element={<ShoppingPage />} />
          <Route path="/items/:itemId" element={<ItemDetail />} /> {/* 상세 페이지 라우트 추가 */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/purchase-history" element={<PurchaseHistory/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;