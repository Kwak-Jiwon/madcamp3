import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function EarthModel({ rotationSpeed }) {
  const { scene } = useGLTF('/techno.glb');
  const earthRef = useRef();

  // Use useFrame to rotate the model incrementally
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.z += rotationSpeed;
    }
  });

  return <primitive object={scene} ref={earthRef} />;
}

function Earth() {
  const [rotationSpeed, setRotationSpeed] = useState(0); // Initial rotation speed is 0
  const [clickCount, setClickCount] = useState(0); // State to track button click count

  const handleRotate = () => {
    // Set the rotation speed for smooth rotation
    setRotationSpeed(Math.PI / 600); // Rotate at 1 degree per frame
    // Stop rotation after a short duration (e.g., 1 second)
    setTimeout(() => {
      setRotationSpeed(0);
    }, 1000);
    // Increment the click count
    setClickCount(prevCount => prevCount + 1);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <EarthModel rotationSpeed={rotationSpeed} />
        <OrbitControls enableZoom={false} />
      </Canvas>
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
          Button Clicked: {clickCount} times
        </div>
      </div>
      <style>
        {`
          button:hover {
            box-shadow: 0 0 20px #0df, 0 0 30px #0df, 0 0 40px #0df;
          }

          .info-box:hover {
            opacity: 0;
          }
        `}
      </style>
    </div>
  );
}

export default Earth;
