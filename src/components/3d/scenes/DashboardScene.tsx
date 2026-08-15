import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEcosystem } from '../../../context/EcosystemContext';

export const DashboardScene: React.FC = () => {
  const { watchData } = useEcosystem();
  const shardsGroupRef = useRef<THREE.Group>(null);
  const pulseLightRef = useRef<THREE.PointLight>(null);

  // Optimized 16 data shards
  const shards = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const radius = 3 + (i % 3) * 1.5;
      const angle = (i / 16) * Math.PI * 2;
      return {
        id: i,
        position: [
          Math.cos(angle) * radius,
          ((i % 5) - 2) * 0.8,
          Math.sin(angle) * radius
        ] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        scale: 0.2 + (i % 3) * 0.1
      };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (shardsGroupRef.current) {
      shardsGroupRef.current.rotation.y = t * 0.08;
    }

    // Heartbeat pulse calculation
    const hrBps = (watchData?.heartRate || 74) / 60;
    const pulseFactor = Math.pow((Math.sin(t * Math.PI * 2 * hrBps) + 1) / 2, 4);

    if (pulseLightRef.current) {
      pulseLightRef.current.intensity = 1.2 + pulseFactor * 2.5;
    }
  });

  return (
    <group>
      <pointLight ref={pulseLightRef} position={[0, 0, 0]} color="#06b6d4" distance={8} />

      <group ref={shardsGroupRef}>
        {shards.map((s) => (
          <mesh key={s.id} position={s.position} rotation={s.rotation} scale={s.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.3}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default DashboardScene;
