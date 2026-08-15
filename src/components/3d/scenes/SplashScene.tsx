import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export const SplashScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.3;
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x = -t * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} color="#06b6d4" intensity={4} distance={10} />

      {/* Floating Boot Shield Core */}
      <Float speed={3} rotationIntensity={0.6} floatIntensity={1}>
        <mesh ref={coreRef}>
          <octahedronGeometry args={[1.5, 2]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            metalness={0.9}
            roughness={0.1}
            transmission={0.8}
            thickness={0.5}
            clearcoat={1}
            emissive="#06b6d4"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      {/* Orbital Boot Rings */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.8, 0.08, 16, 64]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
        <torusGeometry args={[3.4, 0.06, 16, 64]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
};

export default SplashScene;
