import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpiritualScene: React.FC = () => {
  const mandalaRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 8;
      const radius = 0.5 + (i / count) * 4;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mandalaRef.current) {
      mandalaRef.current.rotation.z = t * 0.05;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.03;
    }
  });

  return (
    <group>
      <pointLight position={[0, 0, 0]} color="#f59e0b" intensity={3} distance={8} />

      {/* Concentric Mandala Rings */}
      <group ref={mandalaRef}>
        {[1.2, 2.0, 2.8, 3.6].map((radius, idx) => (
          <mesh key={idx} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.03, 16, 64]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#d97706"
              emissiveIntensity={0.8}
              wireframe={idx % 2 === 1}
            />
          </mesh>
        ))}
      </group>

      {/* Warm Golden Particle Cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlesPosition, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.07} color="#fbbf24" transparent opacity={0.75} />
      </points>
    </group>
  );
};

export default SpiritualScene;
