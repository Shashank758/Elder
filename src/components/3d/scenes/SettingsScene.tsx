import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export const SettingsScene: React.FC = () => {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (modelRef.current) {
      modelRef.current.rotation.y = t * 0.4;
      modelRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
  });

  return (
    <group ref={modelRef}>
      {/* Miniature Gear / Comfort Widget Object */}
      <RoundedBox args={[1.6, 1.6, 0.4]} radius={0.2} smoothness={8}>
        <meshPhysicalMaterial
          color="#06b6d4"
          metalness={0.9}
          roughness={0.15}
          clearcoat={0.5}
          emissive="#06b6d4"
          emissiveIntensity={0.2}
        />
      </RoundedBox>

      {/* Orbiting Glass Gear Teeth */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh key={idx} position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.4]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

export default SettingsScene;
