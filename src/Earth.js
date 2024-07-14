import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';

function EarthModel({ rotationSpeed }) {
  const { scene } = useGLTF('/techno.glb');
  const earthRef = useRef();

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.z += rotationSpeed;
    }
  });

  return <primitive object={scene} ref={earthRef} />;
}

function Earth() {
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleRotate = () => {
    setRotationSpeed(Math.PI / 600);
    setTimeout(() => {
      setRotationSpeed(0);
    }, 1000);
    setClickCount(prevCount => prevCount + 1);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={1} />
        <spotLight position={[15, 20, 5]} angle={0.3} penumbra={1} intensity={2} castShadow />
        <rectAreaLight width={10} height={10} position={[5, 5, 5]} intensity={1.5} />
        <hemisphereLight skyColor={0xffffbb} groundColor={0x080820} intensity={0.8} />
        <EarthModel rotationSpeed={rotationSpeed} />
        <OrbitControls enableZoom={false} />
      </Canvas>

      {!isLoggedIn && <LoginPage />}

      {isLoggedIn && (
        <button
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px 70px',
            fontSize: '18px',
            backgroundColor: '#0f0f0f',
            color: '#0df',
            border: '2px solid #0df',
            borderRadius: '5px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: '0.3s',
            boxShadow: '0 0 10px #0df, 0 0 20px #0df, 0 0 30px #0df',
          }}
          onClick={handleRotate}
        >
          Engine
        </button>
      )}

      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.7,
          transition: 'opacity 0.3s',
        }}
        className="info-box"
      >
        <img src="/unit.png" alt="Example" style={{ width: '100px', marginRight: '10px' }} />
        <div style={{
          padding: '10px',
          backgroundColor: '#222',
          border: '2px solid #0df',
          borderRadius: '5px',
          color: '#fff',
        }}>
          Your Cash: {clickCount} Units
        </div>
      </div>
      <style>
        {`
          button:hover {
            box-shadow: 0 0 20px #0df, 0 0 30px #0df, 0 0 40px #0df;
          }

          .info-box:hover {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
}

export default Earth;
