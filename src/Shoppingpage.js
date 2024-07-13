import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const RotatingStar = () => {
  const { scene } = useGLTF('/star.glb');
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0007; // 천천히 회전
    }
  });

  return <primitive object={scene} ref={ref} />;
};

const ShoppingPage = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={1} />
        <RotatingStar />
      </Canvas>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {/* 쇼핑몰 상품 페이지 내용 */}
        <h1 style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Welcome to the Shop</h1>
        {/* Add your shop components and items here */}
      </div>
    </div>
  );
};

export default ShoppingPage;
