import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const MentalScene: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // 4-second inhale / exhale breath cycle
    const breathFactor = (Math.sin(t * (Math.PI / 2)) + 1) / 2; // 0 to 1 smooth wave
    const scale = 1.2 + breathFactor * 0.8;

    if (sphereRef.current) {
      sphereRef.current.scale.set(scale, scale, scale);
      sphereRef.current.rotation.y = t * 0.2;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.3;
      ringRef.current.scale.set(scale * 1.3, scale * 1.3, scale * 1.3);
    }
  });

  return (
    <group>
      <pointLight position={[0, 0, 0]} color="#14b8a6" intensity={2.5} distance={7} />

      {/* Breathing Sphere */}
      <mesh ref={sphereRef}>
        <icosahedronGeometry args={[1.2, 4]} />
        <meshPhysicalMaterial
          color="#0d9488"
          emissive="#14b8a6"
          emissiveIntensity={0.5}
          metalness={0.2}
          roughness={0.1}
          transmission={0.7}
          thickness={0.5}
          clearcoat={1}
        />
      </mesh>

      {/* Outer Calming Torus Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.8, 0.04, 16, 64]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
};

export default MentalScene;
