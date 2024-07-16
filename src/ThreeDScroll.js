// React와 필요한 훅(useRef, useEffect, useState, forwardRef)을 불러옵니다.
import React, { useRef, useEffect, useState, forwardRef } from 'react';

// @react-three/fiber에서 Canvas와 useFrame을 불러옵니다. Canvas는 3D 씬을 렌더링하고, useFrame은 매 프레임마다 호출되는 함수입니다.
import { Canvas, useFrame } from '@react-three/fiber';

// @react-three/drei에서 OrbitControls와 useGLTF를 불러옵니다. OrbitControls는 3D 씬의 카메라 제어를 도와주고, useGLTF는 GLTF 파일을 불러옵니다.
import { OrbitControls, useGLTF } from '@react-three/drei';

// three.js에서 MeshStandardMaterial을 불러옵니다. 이 자료는 표준적인 메쉬 재질입니다.
import { MeshStandardMaterial } from 'three';

// 리액트 라우터의 useNavigate 훅을 불러옵니다. 이 훅은 프로그래밍적으로 경로를 변경할 때 사용됩니다.
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가

// GLTF 모델 컴포넌트를 정의합니다. forwardRef를 사용하여 ref를 전달받습니다.
const Model = forwardRef((props, ref) => {
  // GLTF 파일을 불러와 scene을 가져옵니다.
  const { scene } = useGLTF('/the-universe.glb');

  // 씬을 순회하여 모든 메쉬의 재질을 설정합니다.
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5 });
    }
  });

  // primitive 컴포넌트를 사용하여 GLTF 씬을 렌더링합니다.
  return <primitive object={scene} ref={ref} {...props} />;
});

// 회전하고 이동하는 모델 컴포넌트를 정의합니다.
const RotatingAndMovingModel = () => {
  const ref = useRef(); // 모델을 참조하기 위해 ref를 생성합니다.
  const [scrollY, setScrollY] = useState(0); // 스크롤 위치를 상태로 관리합니다.

  // 스크롤 이벤트와 애니메이션을 설정합니다.
  useEffect(() => {
    let animationFrameId;

    // 스크롤 핸들러를 정의합니다.
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // 애니메이션 함수를 정의합니다.
    const animate = () => {
      handleScroll();
      animationFrameId = requestAnimationFrame(animate);
    };

    // 애니메이션을 시작합니다.
    animate();
    // 컴포넌트 언마운트 시 애니메이션을 취소합니다.
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 매 프레임마다 호출되는 함수입니다.
  useFrame(() => {
    if (ref.current) {
      // 스크롤 위치에 따라 모델의 회전과 위치를 업데이트합니다.
      ref.current.rotation.x = scrollY / 700;
      ref.current.rotation.z = scrollY / 800;
      ref.current.position.y = scrollY / 400;
      ref.current.position.z = scrollY / 300;
      ref.current.position.x = scrollY / 500;
    }
  });

  // 모델을 렌더링합니다.
  return <Model ref={ref} scale={0.5} />;
};

// 3D 스크롤 컴포넌트를 정의합니다.
const ThreeDScroll = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기

  // "SHOP NOW" 버튼 클릭 핸들러를 정의합니다.
  const handleShopNowClick = () => {
    navigate('/shop'); // shop 경로로 이동
  };

  // 전체 화면을 차지하는 div를 렌더링합니다.
  return (
    <div className="canvas-container">
      {/* Canvas 컴포넌트를 사용하여 3D 씬을 렌더링합니다. 카메라 위치를 설정합니다. */}
      <Canvas camera={{ position: [0, 0, 10] }}>
        {/* 3D 씬에 다양한 조명을 추가합니다. */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={7} />
        <pointLight position={[-10, -10, 10]} intensity={3} />
        <hemisphereLight skyColor={0xffffbb} groundColor={0x080820} intensity={0.8} />
        
        {/* 회전하고 이동하는 모델 컴포넌트를 추가합니다. */}
        <RotatingAndMovingModel />

        {/* OrbitControls 컴포넌트를 추가하여 카메라 제어를 가능하게 합니다. */}
        <OrbitControls enableZoom={false} />
      </Canvas>
      
      {/* 컨텐츠를 포함하는 div를 추가합니다. */}
      <div className="content-container">
        {/* 스크롤 컨테이너를 추가합니다. */}
        <div className="scroll-container">
          {/* 버튼을 추가하고 클릭 이벤트 핸들러를 설정합니다. */}
          <button className='button1' onClick={handleShopNowClick}>NEED MORE CASH</button>
          <button className='button2' onClick={handleShopNowClick}>SHOP NOW</button>
        </div>
      </div>
    </div>
  );
};

// ThreeDScroll 컴포넌트를 기본 내보내기로 내보냅니다.
export default ThreeDScroll;