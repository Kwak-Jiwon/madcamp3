import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import './ShoppingPage.css';
import userIcon from './assets/user.png';
import cartIcon from './assets/cart.webp';

const RotatingStar = () => {
  const { scene } = useGLTF('/star.glb');
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0003;
    }
  });

  return <primitive object={scene} ref={ref} />;
};

const ShoppingPage = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [cartItems, setCartItems] = useState(['Product 1', 'Product 2']);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const handleUserClick = () => {
    setShowUserModal(true);
  };

  const handleCartClick = () => {
    setShowCartModal(true);
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setShowCartModal(false);
  };

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={1} />
        <RotatingStar />
      </Canvas>

      <div className="overlay">
        <header className="header">
          <h1 className="shop-title">Welcome to the Shop</h1>
          <div className="icons">
            <img src={userIcon} alt="User" onClick={handleUserClick} className="icon" />
            <img src={cartIcon} alt="Cart" onClick={handleCartClick} className="icon" />
          </div>
        </header>
        <div className="products-container">
          <div className="products">
            {Array.from({ length: 12 }, (_, i) => (
              <div className={`product product-${i % 2 === 0 ? 'even' : 'odd'}`} key={i + 1}>
                <h2>Product {i + 1}</h2>
                <p>Description of product {i + 1}</p>
                <button>Buy Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>User Information</h2>
            <p>Name: {user.name}</p>
            <p>Cash: ${user.cash}</p>
            <p>Address: {user.address}</p>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      )}

      {showCartModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Shopping Cart</h2>
            {cartItems.length > 0 ? (
              <ul>
                {cartItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingPage;
