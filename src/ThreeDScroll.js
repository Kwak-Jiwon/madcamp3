// src/ThreeDScroll.js
import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';

// Model 컴포넌트를 정의합니다. props를 받아서 사용합니다.
const Model = forwardRef((props, ref) => {
  const { scene } = useGLTF('/the-universe.glb'); // useGLTF 훅을 사용해 .glb 파일을 로드합니다.
  
  // 모델의 모든 메시에 기본 재질을 적용합니다.
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5 });
    }
  });

  return <primitive object={scene} ref={ref} {...props} />; // 로드된 glb 객체를 primitive로 반환합니다.
});

// RotatingAndMovingModel 컴포넌트를 정의합니다.
const RotatingAndMovingModel = () => {
  const ref = useRef(); // 모델의 참조를 저장하기 위해 useRef 훅을 사용합니다.
  const [scrollY, setScrollY] = useState(0); // 스크롤 위치를 저장하기 위해 useState 훅을 사용합니다.

  useEffect(() => {
    // 부드러운 스크롤 처리를 위해 requestAnimationFrame을 사용합니다.
    let animationFrameId;
    const handleScroll = () => {
      setScrollY(window.scrollY); // 스크롤 위치를 scrollY 상태로 업데이트합니다.
    };

    const animate = () => {
      handleScroll();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId); // 컴포넌트가 언마운트될 때 애니메이션 프레임을 취소합니다.
  }, []);

  useFrame(() => {
    // 매 프레임마다 실행되는 함수입니다.
    if (ref.current) {
      ref.current.rotation.x = scrollY / 700; // 스크롤 위치에 따라 모델의 x축 회전을 조정합니다.
      ref.current.rotation.z = scrollY / 300; // 스크롤 위치에 따라 모델의 z축 회전을 조정합니다.
      ref.current.position.y = scrollY / 400; // 스크롤 위치에 따라 모델의 y축 위치를 조정합니다.
      ref.current.position.z = scrollY / 300; // 스크롤 위치에 따라 모델의 z축 위치를 조정합니다.
      ref.current.position.x = scrollY / 500;
    }
  });

  return <Model ref={ref} scale={0.5} />; // 모델을 반환하며, 스케일을 0.3으로 설정합니다.
};

// ThreeDScroll 컴포넌트를 정의합니다.
const ThreeDScroll = () => {
  return (
    <div className="canvas-container"> {/* 3D 씬을 담을 컨테이너를 정의합니다. */}
      <Canvas camera={{ position: [0, 0, 10] }}> {/* 3D 씬을 렌더링하는 Canvas를 정의합니다. 카메라 위치를 [0, 0, 10]로 설정합니다. */}
        <ambientLight intensity={0.5} /> {/* 전체적인 조명을 추가합니다. */}
        <directionalLight position={[10, 10, 5]} intensity={7} /> {/* 방향성 조명을 추가합니다. */}
        <pointLight position={[-10, -10, 10]} intensity={3} /> {/* 포인트 조명을 추가합니다. */}
        <hemisphereLight skyColor={0xffffbb} groundColor={0x080820} intensity={0.8} /> {/* 반구 조명을 추가합니다. */}
        <RotatingAndMovingModel /> {/* 회전 및 이동 모델 컴포넌트를 추가합니다. */}
        <OrbitControls enableZoom={false} /> {/* 모델을 회전시키고 이동할 수 있는 컨트롤을 추가합니다. 줌은 비활성화합니다. */}
      </Canvas>
    </div>
  );
};

export default ThreeDScroll; // ThreeDScroll 컴포넌트를 기본으로 내보냅니다.
