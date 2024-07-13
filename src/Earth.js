import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function EarthModel() {
  const { scene } = useGLTF('/techno.glb'); // 지구본 모델 파일 경로
  const earthRef = useRef();

  // z축 기준으로 지구본을 회전시키는 함수
  const handleRotate = () => {
    if (earthRef.current) {
      earthRef.current.rotation.z += Math.PI / 4; // 45도 회전
    }
  };

  return <primitive object={scene} ref={earthRef} />;
}

function Earth() {
  const earthRef = useRef();

  const handleRotate = () => {
    if (earthRef.current) {
      earthRef.current.rotation.z += Math.PI / 4; // 45도 회전 중임
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <primitive object={useGLTF('/techno.glb').scene} ref={earthRef} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <button
        style={{ position: 'absolute', top: '20px', left: '20px' }}
        onClick={handleRotate}
      >
        Rotate Earth
      </button>
    </div>
  );
}

export default Earth;
