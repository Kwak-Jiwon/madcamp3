// src/ThreeDScroll.js
import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가

const Model = forwardRef((props, ref) => {
  const { scene } = useGLTF('/the-universe.glb');

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5 });
    }
  });

  return <primitive object={scene} ref={ref} {...props} />;
});

const RotatingAndMovingModel = () => {
  const ref = useRef();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const animate = () => {
      handleScroll();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = scrollY / 700;
      ref.current.rotation.z = scrollY / 800;
      ref.current.position.y = scrollY / 400;
      ref.current.position.z = scrollY / 300;
      ref.current.position.x = scrollY / 500;
    }
  });

  return <Model ref={ref} scale={0.5} />;
};

const ThreeDScroll = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기

  const handleShopNowClick = () => {
    navigate('/shop'); // shop 경로로 이동
  };

  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={7} />
        <pointLight position={[-10, -10, 10]} intensity={3} />
        <hemisphereLight skyColor={0xffffbb} groundColor={0x080820} intensity={0.8} />
        <RotatingAndMovingModel />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <div className="content-container">
        <div className="scroll-container">
          <button className='button1' onClick={handleShopNowClick}>NEED MORE CASH</button>
          <button className='button2' onClick={handleShopNowClick}>SHOP NOW</button>
        </div>
      </div>
    </div>
  );
};

export default ThreeDScroll;
