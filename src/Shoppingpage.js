import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import './ShoppingPage.css';

const RotatingStar = () => {
  const { scene } = useGLTF('/star.glb');
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0002;
    }
  });

  return <primitive object={scene} ref={ref} />;
};

const ShoppingPage = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={1} />
        <RotatingStar />
      </Canvas>

      <div className="overlay">
        <h1 className="shop-title">Welcome to the Shop</h1>
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

      {!isLoggedIn && <LoginPage />}
    </div>
  );
};

export default ShoppingPage;
