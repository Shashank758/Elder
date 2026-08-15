import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AdminScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  const { nodes, lines } = useMemo(() => {
    const nList = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-2, 1.5, -1),
      new THREE.Vector3(2, 1.5, 1),
      new THREE.Vector3(-2.5, -1.2, 0.5),
      new THREE.Vector3(2.5, -1.2, -0.5),
      new THREE.Vector3(0, 2.2, 0.5)
    ];

    const lList: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 1; i < nList.length; i++) {
      lList.push([nList[0], nList[i]]);
    }
    lList.push([nList[1], nList[5]]);
    lList.push([nList[2], nList[5]]);

    return { nodes: nList, lines: lList };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Server Node */}
      <mesh position={nodes[0]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshPhysicalMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Satellite Fleet Nodes */}
      {nodes.slice(1).map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* Network Connections */}
      {lines.map(([start, end], idx) => (
        <primitive
          key={idx}
          object={new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([start, end]),
            new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 })
          )}
        />
      ))}
    </group>
  );
};

export default AdminScene;
