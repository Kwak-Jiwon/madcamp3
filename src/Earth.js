// React와 필요한 훅(useRef, useState)을 불러옵니다.
import React, { useRef, useState } from 'react';

// @react-three/fiber에서 Canvas와 useFrame을 불러옵니다. Canvas는 3D 씬을 렌더링하고, useFrame은 매 프레임마다 호출되는 함수입니다.
import { Canvas, useFrame } from '@react-three/fiber';

// @react-three/drei에서 OrbitControls와 useGLTF를 불러옵니다. OrbitControls는 3D 씬의 카메라 제어를 도와주고, useGLTF는 GLTF 파일을 불러옵니다.
import { OrbitControls, useGLTF } from '@react-three/drei';

// 사용자 인증을 위한 커스텀 훅과 로그인 페이지 컴포넌트를 불러옵니다.
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';

// 지구 모델 컴포넌트를 정의합니다. rotationSpeed를 prop으로 받습니다.
function EarthModel({ rotationSpeed }) {
  // GLTF 파일을 불러와 scene을 가져옵니다.
  const { scene } = useGLTF('/techno.glb');

  // 회전을 위해 참조를 사용합니다.
  const earthRef = useRef();

  // useFrame 훅을 사용하여 매 프레임마다 호출되는 함수를 정의합니다.
  useFrame(() => {
    if (earthRef.current) {
      // earthRef.current가 존재하면 z축으로 회전시킵니다.
      earthRef.current.rotation.z += rotationSpeed;
    }
  });

  // primitive 컴포넌트를 사용하여 GLTF 씬을 렌더링합니다.
  return <primitive object={scene} ref={earthRef} />;
}

// 지구 컴포넌트를 정의합니다.
function Earth() {
  // 회전 속도와 클릭 횟수를 상태로 관리합니다.
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  // 사용자 인증 상태를 가져옵니다.
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // 지구 회전을 처리하는 함수입니다.
  const handleRotate = () => {
    // 회전 속도를 설정합니다.
    setRotationSpeed(Math.PI / 600);

    // 1초 후에 회전을 멈춥니다.
    setTimeout(() => {
      setRotationSpeed(0);
    }, 1000);

    // 클릭 횟수를 증가시킵니다.
    setClickCount(prevCount => prevCount + 1);
  };

  // 전체 화면을 차지하는 div를 렌더링합니다.
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Canvas 컴포넌트를 사용하여 3D 씬을 렌더링합니다. 카메라 위치를 설정합니다. */}
      <Canvas camera={{ position: [0, 0, 10] }}>
        {/* 3D 씬에 다양한 조명을 추가합니다. */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={1} />
        <spotLight position={[15, 20, 5]} angle={0.3} penumbra={1} intensity={2} castShadow />
        <rectAreaLight width={10} height={10} position={[5, 5, 5]} intensity={1.5} />
        <hemisphereLight skyColor={0xffffbb} groundColor={0x080820} intensity={0.8} />
        
        {/* EarthModel 컴포넌트를 추가합니다. */}
        <EarthModel rotationSpeed={rotationSpeed} />

        {/* OrbitControls 컴포넌트를 추가하여 카메라 제어를 가능하게 합니다. */}
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* 사용자가 로그인되어 있지 않으면 로그인 페이지를 렌더링합니다. */}
      {!isLoggedIn && <LoginPage />}

      {/* 사용자가 로그인되어 있으면 버튼을 렌더링합니다. */}
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

      {/* 클릭 횟수를 표시하는 정보 상자를 렌더링합니다. */}
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
        {/* 유닛 아이콘을 추가합니다. */}
        <img src="/unit.png" alt="Example" style={{ width: '100px', marginRight: '10px' }} />
        
        {/* 클릭 횟수를 표시하는 텍스트를 포함한 div를 렌더링합니다. */}
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

      {/* 스타일을 정의합니다. */}
      <style>
        {`
          /* 버튼에 호버 효과를 추가합니다. */
          button:hover {
            box-shadow: 0 0 20px #0df, 0 0 30px #0df, 0 0 40px #0df;
          }

          /* 정보 상자에 호버 효과를 추가합니다. */
          .info-box:hover {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
}

// Earth 컴포넌트를 기본 내보내기로 내보냅니다.
export default Earth;
