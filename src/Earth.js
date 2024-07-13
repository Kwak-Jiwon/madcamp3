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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 변수

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

  const handleLogin = (event) => {
    event.preventDefault(); // 폼 기본 동작 막기
    setIsLoggedIn(true); // 로그인 상태로 변경
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} /> {/* 부드러운 전체 조명 */}
        <directionalLight position={[10, 10, 5]} intensity={1} /> {/* 태양과 같은 조명 */}
        <pointLight position={[-10, -10, 10]} intensity={1} /> {/* 전구와 같은 조명 */}
        <spotLight position={[15, 20, 5]} angle={0.3} penumbra={1} intensity={2} castShadow /> {/* 스포트라이트 */}
        <rectAreaLight width={10} height={10} position={[5, 5, 5]} intensity={1.5} /> {/* 사각형 영역 조명 */}
        <hemisphereLight skyColor={0xffffbb} groundColor={0x080820} intensity={0.8} /> {/* 반구 조명 */}

        <EarthModel rotationSpeed={rotationSpeed} />
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* 로그인되지 않았을 때만 버튼 표시 */}
      {!isLoggedIn && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // 80% 불투명한 검정 배경
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '300px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)', // 90% 불투명한 흰색 배경
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h2>돈 벌기</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <input type="text" placeholder="행성등록번호" style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="이름" style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="password" placeholder="비밀번호" style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#0f0f0f', color: '#0df', cursor: 'pointer' }}>노동 시작</button>
            </form>
          </div>
        </div>
      )}

      {/* 로그인된 상태일 때 엔진 버튼 표시 */}
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

      {/* 클릭 수를 표시하는 정보 박스 */}
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