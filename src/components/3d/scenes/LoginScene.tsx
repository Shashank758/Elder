import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useEcosystem } from '../../../context/EcosystemContext';

export const LoginScene: React.FC = () => {
  const { role } = useEcosystem();

  const elderMeshRef = useRef<THREE.Group>(null);
  const familyMeshRef = useRef<THREE.Group>(null);
  const doctorMeshRef = useRef<THREE.Group>(null);
  const adminMeshRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Background particle cloud
  const particles = useMemo(() => {
    const count = 250;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.03;
    }

    // Role specific rotations & animations
    if (elderMeshRef.current) {
      elderMeshRef.current.rotation.y = t * 0.4;
      elderMeshRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }
    if (familyMeshRef.current) {
      familyMeshRef.current.rotation.y = -t * 0.3;
      familyMeshRef.current.rotation.z = Math.cos(t * 0.4) * 0.1;
    }
    if (doctorMeshRef.current) {
      doctorMeshRef.current.rotation.y = t * 0.5;
      doctorMeshRef.current.rotation.x = Math.cos(t * 0.3) * 0.2;
    }
    if (adminMeshRef.current) {
      adminMeshRef.current.rotation.y = -t * 0.6;
      adminMeshRef.current.rotation.z = Math.sin(t * 0.4) * 0.25;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.8} />
      
      {/* Dynamic Lighting corresponding to selected role theme */}
      <pointLight 
        position={[0, 2, 3]} 
        intensity={2.5} 
        color={role === 'Doctor' ? '#a855f7' : role === 'Family' ? '#10b981' : role === 'Admin' ? '#f43f5e' : '#06b6d4'} 
      />

      {/* Ambient Floating Particles Cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.06} 
          color={role === 'Doctor' ? '#c084fc' : role === 'Family' ? '#34d399' : role === 'Admin' ? '#fb7185' : '#38bdf8'} 
          transparent 
          opacity={0.6} 
        />
      </points>

      {/* 1. ELDER ROLE 3D HOLOGRAM (Smartwatch + Heart Ring) */}
      {role === 'Elder' && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
          <group ref={elderMeshRef} position={[0, 0, 0]}>
            {/* Outer Cyan Ring */}
            <mesh>
              <torusGeometry args={[2.0, 0.12, 16, 64]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} wireframe />
            </mesh>
            {/* Core SmartWatch Bezel */}
            <mesh>
              <octahedronGeometry args={[1.1, 1]} />
              <meshPhysicalMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} roughness={0.1} clearcoat={1} />
            </mesh>
            {/* Heart Node */}
            <mesh position={[0, 0, 0.4]}>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={1} />
            </mesh>
          </group>
        </Float>
      )}

      {/* 2. FAMILY ROLE 3D HOLOGRAM (Earth Globe Radar) */}
      {role === 'Family' && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
          <group ref={familyMeshRef} position={[0, 0, 0]}>
            {/* Earth Wireframe Globe */}
            <mesh>
              <sphereGeometry args={[1.5, 24, 24]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} wireframe />
            </mesh>
            {/* Orbital Safe Zone Ring */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[2.1, 0.08, 16, 64]} />
              <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.8} />
            </mesh>
            {/* GPS Beacon Node */}
            <mesh position={[0, 1.2, 0]}>
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
            </mesh>
          </group>
        </Float>
      )}

      {/* 3. DOCTOR ROLE 3D HOLOGRAM (DNA Helix / Caduceus) */}
      {role === 'Doctor' && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
          <group ref={doctorMeshRef} position={[0, 0, 0]}>
            {/* Extruded Double Helix Rings */}
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <torusGeometry args={[1.6, 0.1, 16, 64]} />
              <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.7} wireframe />
            </mesh>
            <mesh rotation={[-Math.PI / 4, 0, 0]}>
              <torusGeometry args={[1.6, 0.1, 16, 64]} />
              <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.7} wireframe />
            </mesh>
            {/* Clinical Stethoscope Core Node */}
            <mesh>
              <icosahedronGeometry args={[0.9, 1]} />
              <meshPhysicalMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.9} roughness={0.1} clearcoat={1} />
            </mesh>
          </group>
        </Float>
      )}

      {/* 4. ADMIN ROLE 3D HOLOGRAM (Quantum Hex Shield Matrix) */}
      {role === 'Admin' && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
          <group ref={adminMeshRef} position={[0, 0, 0]}>
            {/* Hexagonal Shield Mesh */}
            <mesh>
              <cylinderGeometry args={[1.6, 1.6, 0.2, 6]} />
              <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.6} wireframe />
            </mesh>
            {/* Security Core Cube Lock */}
            <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
              <boxGeometry args={[0.9, 0.9, 0.9]} />
              <meshPhysicalMaterial color="#e11d48" emissive="#e11d48" emissiveIntensity={1} roughness={0.2} />
            </mesh>
          </group>
        </Float>
      )}

    </group>
  );
};

export default LoginScene;
