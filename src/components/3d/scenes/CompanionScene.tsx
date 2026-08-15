import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CompanionScene: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.3;
      meshRef.current.rotation.y = t * 0.4;
      const audioPulse = 1 + Math.sin(t * 3) * 0.08;
      meshRef.current.scale.set(audioPulse, audioPulse, audioPulse);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={2} color="#06b6d4" />
      <pointLight position={[-3, -3, -2]} intensity={1.5} color="#8b5cf6" />

      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 3]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.4}
          metalness={0.1}
          roughness={0.1}
          transmission={0.8}
          thickness={0.5}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
};

export default CompanionScene;
