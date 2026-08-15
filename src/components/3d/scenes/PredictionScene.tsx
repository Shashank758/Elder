import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const PredictionScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate neural network node positions
  const { nodes, connections } = useMemo(() => {
    const nodeCount = 16;
    const nList: [number, number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      nList.push([
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3
      ]);
    }

    const cList: [number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = new THREE.Vector3(...nList[i]).distanceTo(new THREE.Vector3(...nList[j]));
        if (dist < 3.2) {
          cList.push([i, j]);
        }
      }
    }
    return { nodes: nList, connections: cList };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#06b6d4" emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Connecting Edges */}
      {connections.map(([startIdx, endIdx], idx) => {
        const start = new THREE.Vector3(...nodes[startIdx]);
        const end = new THREE.Vector3(...nodes[endIdx]);
        const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);

        return (
          <primitive key={idx} object={new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.4 }))} />
        );
      })}
    </group>
  );
};

export default PredictionScene;
