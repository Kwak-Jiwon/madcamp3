import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import axios from 'axios';
import Modal from 'react-modal';

// 지구 모델 컴포넌트를 정의합니다.
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

// 지구 컴포넌트를 정의합니다.
function Earth() {
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalCallback, setModalCallback] = useState(null);
  const { isLoggedIn, userId } = useAuth();

  const handleRotate = () => {
    setRotationSpeed(Math.PI / 600);
    setTimeout(() => {
      setRotationSpeed(0);
    }, 1000);
    setClickCount(prevCount => prevCount + 1);
  };

  const handleAddMoney = async () => {
    try {
      const response = await axios.post('http://43.200.215.241:2000/add-money', {
        userid: userId,
        money: clickCount // 예시로 클릭 횟수를 돈으로 사용합니다.
      });

      if (response.data.status === 'success') {
        setTotalMoney(response.data.currentMoney);
        openModal(`Total Money: ${response.data.currentMoney}`, null);
        setClickCount(0);
      } else {
        openModal(response.data.message, null);
      }
    } catch (error) {
      console.error('Error adding money:', error);
      openModal('Error adding money', null);
    }
  };

  const openModal = (message, callback) => {
    setModalMessage(message);
    setModalCallback(() => callback);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    if (modalCallback) {
      modalCallback();
    }
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
      <button
          style={{
            position: 'absolute',
            bottom: '87%',
            left: '90%',
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
          onClick={handleAddMoney}
        >
          저금하기
        </button>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        <h2>{modalMessage}</h2>
        <div className="modal-buttons">
          <button onClick={closeModal} className="confirm-button">확인</button>
        </div>
      </Modal>

      <style>
        {`
          button:hover {
            box-shadow: 0 0 20px #0df, 0 0 30px #0df, 0 0 40px #0df;
          }

          .info-box:hover {
            opacity: 1;
          }

          .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
            z-index: 1000;
            width: 90%;
            max-width: 30rem;
            text-align: center;
          }

          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
          }

          .modal-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
          }

          .confirm-button {
            padding: 0.5rem 1rem;
            background-color: #00bfff;
            border: none;
            color: white;
            cursor: pointer;
            border-radius: 0.5rem;
            transition: background-color 0.2s;
          }

          .confirm-button:hover {
            background-color: #009acd;
          }
        `}
      </style>
    </div>
  );
}

export default Earth;
