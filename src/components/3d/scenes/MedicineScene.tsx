import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const MedicineScene: React.FC = () => {
  const containerRef = useRef<THREE.Group>(null);

  const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  const pills = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      color: colors[i % colors.length],
      speed: 0.5 + Math.random() * 0.8
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (containerRef.current) {
      containerRef.current.rotation.y = Math.sin(t * 0.2) * 0.15;
      containerRef.current.rotation.x = Math.cos(t * 0.15) * 0.1;
    }
  });

  return (
    <group ref={containerRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      {pills.map((p) => (
        <group key={p.id} position={p.position} rotation={p.rotation}>
          {/* Top Half */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.45, 12]} />
            <meshStandardMaterial color={p.color} metalness={0.4} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color={p.color} metalness={0.4} roughness={0.2} />
          </mesh>
          {/* Bottom Half */}
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.45, 12]} />
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.48, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default MedicineScene;
