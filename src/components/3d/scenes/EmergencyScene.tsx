import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const EmergencyScene: React.FC = () => {
  const radarRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (radarRef.current) {
      radarRef.current.rotation.y = t * 1.5;
    }

    if (ring1Ref.current) {
      const scale1 = 1 + (t % 1.5) * 1.8;
      ring1Ref.current.scale.set(scale1, scale1, scale1);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = 1 - (t % 1.5) / 1.5;
    }

    if (ring2Ref.current) {
      const scale2 = 1 + ((t + 0.75) % 1.5) * 1.8;
      ring2Ref.current.scale.set(scale2, scale2, scale2);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = 1 - ((t + 0.75) % 1.5) / 1.5;
    }

    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(t * 10) * 3;
    }
  });

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 0, 0]} color="#ef4444" distance={12} />

      {/* Pulsing Red Radar Dome */}
      <mesh ref={radarRef}>
        <sphereGeometry args={[2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshPhysicalMaterial
          color="#dc2626"
          emissive="#ef4444"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Expanding Shockwave Rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.6, 32]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.6, 32]} />
        <meshBasicMaterial color="#f87171" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default EmergencyScene;
