import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEcosystem } from '../../../context/EcosystemContext';

export const SmartHomeScene: React.FC = () => {
  const { homeSensors } = useEcosystem();
  const houseGroupRef = useRef<THREE.Group>(null);
  const gasNodeRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (houseGroupRef.current) {
      houseGroupRef.current.rotation.y = t * 0.15;
    }

    if (gasNodeRef.current) {
      if (homeSensors.gasLeak) {
        gasNodeRef.current.intensity = 2 + Math.sin(t * 8) * 2;
        gasNodeRef.current.color.set('#ef4444');
      } else {
        gasNodeRef.current.intensity = 1.0;
        gasNodeRef.current.color.set('#10b981');
      }
    }
  });

  return (
    <group ref={houseGroupRef} rotation={[0.4, 0, 0]}>
      {/* House Base Floor */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[4, 0.2, 4]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main Living Structure (Glass Walls) */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3.2, 2, 3.2]} />
        <meshPhysicalMaterial
          color="#0284c7"
          metalness={0.1}
          roughness={0.1}
          transmission={0.8}
          thickness={0.4}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Roof Structure */}
      <mesh position={[0, 2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.8, 1.2, 4]} />
        <meshStandardMaterial color="#0369a1" metalness={0.7} roughness={0.3} wireframe />
      </mesh>

      {/* Room Sensor Node Lights */}
      {/* Living Room */}
      <pointLight position={[-0.8, 0.5, 0.8]} intensity={1.5} color="#06b6d4" distance={3} />
      <mesh position={[-0.8, 0.5, 0.8]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} />
      </mesh>

      {/* Bedroom */}
      <pointLight position={[0.8, 0.5, -0.8]} intensity={1.5} color="#8b5cf6" distance={3} />
      <mesh position={[0.8, 0.5, -0.8]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} />
      </mesh>

      {/* Kitchen Gas / Smoke Sensor */}
      <pointLight ref={gasNodeRef} position={[-0.8, 0.5, -0.8]} distance={3} />
      <mesh position={[-0.8, 0.5, -0.8]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={homeSensors.gasLeak ? '#ef4444' : '#10b981'} emissive={homeSensors.gasLeak ? '#ef4444' : '#10b981'} emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

export default SmartHomeScene;
