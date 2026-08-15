import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DoctorScene: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 100;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * 0.12;
      let y = Math.sin(i * 0.3) * 0.2;
      // Synthesize ECG spike (PQR waves)
      if (i % 20 === 10) y += 2.2;
      if (i % 20 === 9) y -= 0.8;
      if (i % 20 === 11) y -= 0.6;
      points.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
      meshRef.current.position.x = -((t * 2) % 4) + 2;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#38bdf8" />

      <mesh ref={meshRef}>
        <tubeGeometry args={[curve, 128, 0.08, 8, false]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
};

export default DoctorScene;
