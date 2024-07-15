// src/EarthModel.js
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const EarthModel = ({ rotationSpeed }) => {
  const { scene } = useGLTF('/techno.glb');
  const earthRef = useRef();

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.z += rotationSpeed;
    }
  });

  return <primitive object={scene} ref={earthRef} />;
};

export default EarthModel;
