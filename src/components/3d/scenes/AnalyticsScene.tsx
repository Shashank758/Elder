import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AnalyticsScene: React.FC = () => {
  const chartGroupRef = useRef<THREE.Group>(null);

  const bars = [
    { height: 2.2, color: '#06b6d4', pos: [-1.8, 0, 0] },
    { height: 3.5, color: '#10b981', pos: [-0.9, 0, 0] },
    { height: 1.8, color: '#38bdf8', pos: [0, 0, 0] },
    { height: 4.2, color: '#8b5cf6', pos: [0.9, 0, 0] },
    { height: 2.8, color: '#f59e0b', pos: [1.8, 0, 0] }
  ];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (chartGroupRef.current) {
      chartGroupRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group ref={chartGroupRef} position={[0, -1, 0]}>
      {/* Extruded 3D Bars */}
      {bars.map((b, idx) => (
        <mesh key={idx} position={[b.pos[0], b.height / 2, b.pos[2]]}>
          <boxGeometry args={[0.6, b.height, 0.6]} />
          <meshPhysicalMaterial
            color={b.color}
            emissive={b.color}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
            clearcoat={0.6}
          />
        </mesh>
      ))}

      {/* Grid Floor */}
      <gridHelper args={[8, 16, 0x06b6d4, 0x1e293b]} position={[0, 0, 0]} />
    </group>
  );
};

export default AnalyticsScene;
