import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface LandingHeroCanvasProps {
  scrollProgress: number; // 0 to 1
}

const Hero3DModel: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Generate random particle cloud positions
  const particlesPosition = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Scroll-driven camera / mesh animation
      const targetRotY = prefersReducedMotion ? 0 : t * 0.25 + scrollProgress * Math.PI * 2;
      const targetRotX = (Math.sin(t * 0.5) * 0.1) + scrollProgress * Math.PI * 0.4;
      const targetScale = 1.0 - scrollProgress * 0.25;
      const targetZ = -scrollProgress * 2.0;
      const targetY = -scrollProgress * 1.0;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08));
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
    }

    if (outerRingRef.current && !prefersReducedMotion) {
      outerRingRef.current.rotation.z = t * 0.4;
      outerRingRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }

    if (innerCoreRef.current && !prefersReducedMotion) {
      innerCoreRef.current.rotation.y = -t * 0.5;
      innerCoreRef.current.rotation.z = Math.cos(t * 0.4) * 0.3;
    }

    if (particlesRef.current && !prefersReducedMotion) {
      particlesRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floating Glass Outer Ring */}
      <Float speed={prefersReducedMotion ? 0 : 2} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh ref={outerRingRef} position={[0, 0, 0]}>
          <torusGeometry args={[2.2, 0.28, 32, 64]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            metalness={0.1}
            roughness={0.1}
            transmission={0.85}
            thickness={0.8}
            ior={1.4}
            clearcoat={1}
            emissive="#06b6d4"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Secondary Metallic Ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[1.7, 0.12, 24, 48]} />
          <meshPhysicalMaterial
            color="#10b981"
            metalness={0.9}
            roughness={0.2}
            clearcoat={0.6}
            emissive="#10b981"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Inner Core Monitoring Node */}
        <mesh ref={innerCoreRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.9, 2]} />
          <meshPhysicalMaterial
            color="#0284c7"
            metalness={0.8}
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            wireframe={false}
            emissive="#0284c7"
            emissiveIntensity={0.25}
          />
        </mesh>
      </Float>

      {/* Biosensor Signal Particles Cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlesPosition, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#38bdf8"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export const LandingHeroCanvas: React.FC<LandingHeroCanvasProps> = ({ scrollProgress }) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        shadows={false}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-6, -6, -4]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[6, -4, 4]} intensity={1.2} color="#10b981" />

        <Hero3DModel scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};

export default LandingHeroCanvas;
