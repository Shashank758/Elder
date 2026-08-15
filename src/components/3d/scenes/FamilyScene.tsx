import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FamilyScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.2;
    }
  });

  const members = [
    { name: 'Devendra (Elder)', pos: [0, 0, 0], color: '#06b6d4', size: 0.5 },
    { name: 'Rahul (Son)', pos: [2.5, 0.8, 0], color: '#10b981', size: 0.35 },
    { name: 'Dr. Sharma', pos: [-2.2, 1.2, 0.5], color: '#38bdf8', size: 0.35 },
    { name: 'Priya (Nurse)', pos: [0.5, -2.0, -1], color: '#8b5cf6', size: 0.35 },
    { name: 'Fleet Ops Admin', pos: [-1.8, -1.5, 0.8], color: '#f59e0b', size: 0.35 }
  ];

  return (
    <group ref={groupRef}>
      {/* Central Elder Node */}
      {members.map((m, idx) => (
        <group key={idx} position={m.pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[m.size, 24, 24]} />
            <meshPhysicalMaterial
              color={m.color}
              emissive={m.color}
              emissiveIntensity={0.6}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>

          {/* Connection Line to Center */}
          {idx > 0 && (
            <primitive
              object={new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(...m.pos).negate()]),
                new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 })
              )}
            />
          )}
        </group>
      ))}

      {/* Orbiting Constellation Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3.2, 0.03, 16, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  );
};

export default FamilyScene;
