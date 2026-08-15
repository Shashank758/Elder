import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEcosystem } from '../../../context/EcosystemContext';

export const MotionScene: React.FC = () => {
  const { watchData } = useEcosystem();
  const figureGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (figureGroupRef.current) {
      // Map ESP32 pitch, roll, yaw to 3D skeletal figure orientation
      const targetX = (watchData.pitch * Math.PI) / 180;
      const targetY = (watchData.roll * Math.PI) / 180;
      const targetZ = (watchData.yaw * 0.2 * Math.PI) / 180;

      figureGroupRef.current.rotation.x = THREE.MathUtils.lerp(figureGroupRef.current.rotation.x, targetX, 0.1);
      figureGroupRef.current.rotation.y = THREE.MathUtils.lerp(figureGroupRef.current.rotation.y, targetY + t * 0.1, 0.1);
      figureGroupRef.current.rotation.z = THREE.MathUtils.lerp(figureGroupRef.current.rotation.z, targetZ, 0.1);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group>
      {/* Dynamic 6-DOF Skeletal Kinematic Rig */}
      <group ref={figureGroupRef}>
        {/* Head Node */}
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} wireframe />
        </mesh>

        {/* Torso Spine */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.1, 1.6, 8]} />
          <meshPhysicalMaterial color="#38bdf8" metalness={0.8} roughness={0.2} wireframe />
        </mesh>

        {/* Shoulder Crossbar */}
        <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.4, 8]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.4} />
        </mesh>

        {/* Left & Right Joint Spheres */}
        <mesh position={[-0.7, 1.4, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.7, 1.4, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Outer Orientation Radar Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.04, 16, 64]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
};

export default MotionScene;
