// src/ThreeDScroll.js
import React, { useRef, useEffect, useState, forwardRef } from 'react'; // React와 훅들을 임포트합니다.
import { Canvas, useFrame } from '@react-three/fiber'; // Canvas와 useFrame을 @react-three/fiber에서 임포트합니다.
import { OrbitControls, useFBX } from '@react-three/drei'; // OrbitControls와 useFBX를 @react-three/drei에서 임포트합니다.

// Model 컴포넌트를 정의합니다. props를 받아서 사용합니다.
const Model = forwardRef((props, ref) => {
  const fbx = useFBX('/the-universe.fbx'); // useFBX 훅을 사용해 .fbx 파일을 로드합니다.
  return <primitive object={fbx} ref={ref} {...props} />; // 로드된 fbx 객체를 primitive로 반환합니다.
});

// RotatingModel 컴포넌트를 정의합니다.
const RotatingModel = () => {
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
      ref.current.rotation.y = scrollY / 700; // 스크롤 위치에 따라 모델의 x축 회전을 조정합니다.
      ref.current.rotation.z = scrollY / 400; // 스크롤 위치에 따라 모델의 z축 회전을 조정합니다.
    }
  });

  return <Model ref={ref} scale={0.3} />; // 모델을 반환하며, 스케일을 0.3으로 설정합니다.
};

// ThreeDScroll 컴포넌트를 정의합니다.
const ThreeDScroll = () => {
  return (
    <div className="canvas-container"> {/* 3D 씬을 담을 컨테이너를 정의합니다. */}
      <Canvas camera={{ position: [0, 0, 10] }}> {/* 3D 씬을 렌더링하는 Canvas를 정의합니다. 카메라 위치를 [0, 0, 10]로 설정합니다. */}
        <ambientLight intensity={1.0} /> {/* 전체적인 조명을 추가합니다. */}
        <directionalLight position={[10, 10, 5]} intensity={1.5} /> {/* 방향성 조명을 추가합니다. */}
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={2.0} /> {/* 스포트라이트 조명을 추가합니다. */}
        <RotatingModel /> {/* 회전 모델 컴포넌트를 추가합니다. */}
        <OrbitControls enableZoom={false} /> {/* 모델을 회전시키고 이동할 수 있는 컨트롤을 추가합니다. 줌은 비활성화합니다. */}
      </Canvas>
    </div>
  );
};

export default ThreeDScroll; // ThreeDScroll 컴포넌트를 기본으로 내보냅니다.
