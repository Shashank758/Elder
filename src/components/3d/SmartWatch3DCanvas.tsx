import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export interface SmartWatch3DCanvasProps {
  pitch: number;
  roll: number;
  yaw: number;
  heartRate: number;
  spO2: number;
  battery: number;
  activity: string;
}

const WatchModel: React.FC<SmartWatch3DCanvasProps> = ({
  pitch,
  roll,
  yaw,
  heartRate,
  spO2,
  battery,
  activity
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Check for prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Convert sensor pitch, roll, yaw from degrees to radians
    const targetX = (pitch * Math.PI) / 180;
    const targetY = (roll * Math.PI) / 180;
    const targetZ = (yaw * 0.2 * Math.PI) / 180;

    // Gentle floating animation
    const floatY = prefersReducedMotion ? 0 : Math.sin(t * 1.5) * 0.06;

    // Smooth lerp to target orientation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.1);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, 0.1);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.1);
  });

  return (
    <group ref={groupRef}>
      {/* Top Strap */}
      <mesh position={[0, 1.85, -0.05]}>
        <boxGeometry args={[1.0, 1.3, 0.14]} />
        <meshPhysicalMaterial color="#0f172a" roughness={0.6} metalness={0.2} />
      </mesh>
      
      {/* Bottom Strap */}
      <mesh position={[0, -1.85, -0.05]}>
        <boxGeometry args={[1.0, 1.3, 0.14]} />
        <meshPhysicalMaterial color="#0f172a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Watch Outer Casing (Titanium Metal Look) */}
      <RoundedBox args={[2.1, 2.6, 0.42]} radius={0.22} smoothness={8} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#1e293b"
          metalness={0.92}
          roughness={0.15}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </RoundedBox>

      {/* Bezel Ring */}
      <RoundedBox args={[1.9, 2.4, 0.44]} radius={0.18} smoothness={8} position={[0, 0, 0]}>
        <meshPhysicalMaterial color="#090d16" metalness={0.5} roughness={0.3} />
      </RoundedBox>

      {/* Side Crown Button */}
      <mesh position={[1.12, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 24]} />
        <meshPhysicalMaterial color="#06b6d4" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Flat Emissive Screen Surface Base */}
      <mesh position={[0, 0, 0.23]}>
        <planeGeometry args={[1.68, 2.18]} />
        <meshStandardMaterial color="#000000" emissive="#06b6d4" emissiveIntensity={0.15} />
      </mesh>

      {/* Crisp HTML Screen Display Overlay on Watch Face */}
      <Html
        transform
        wrapperClass="pointer-events-none select-none"
        distanceFactor={3.2}
        position={[0, 0, 0.24]}
        style={{ width: '220px', height: '280px' }}
      >
        <div className="w-full h-full bg-slate-950/95 border border-cyan-500/40 rounded-[24px] p-3 flex flex-col justify-between text-white shadow-2xl backdrop-blur-md overflow-hidden font-sans">
          {/* Screen Top Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold">ElderGuard</span>
            <span className="text-emerald-400 font-bold">{battery}% 🔋</span>
          </div>

          {/* Screen Center - OLED Display Data */}
          <div className="flex flex-col items-center justify-center my-auto text-center gap-1.5">
            <div className="text-2xl font-extrabold text-white tracking-tight">
              09:42 <span className="text-xs font-medium text-slate-400">AM</span>
            </div>

            {/* Heartbeat Animated Wave */}
            <div className="flex items-center gap-1.5 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/40">
              <motion.span 
                animate={{ scale: [1, 1.25, 1] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="text-red-400 text-xs"
              >
                ❤️
              </motion.span>
              <span className="text-xs font-bold text-red-300 font-mono">{heartRate} BPM</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5 text-slate-300">
              <span className="text-cyan-300">SpO₂ {spO2}%</span>
              <span className="text-amber-300">{activity}</span>
            </div>
          </div>

          {/* Bottom OLED Progress Bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-blue-500" 
              animate={{ width: ['20%', '90%', '40%', '80%'] }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </Html>
    </group>
  );
};

export const SmartWatch3DCanvas: React.FC<SmartWatch3DCanvasProps> = (props) => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        shadows={false}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-4, -4, -2]} intensity={1.2} color="#06b6d4" />
        <pointLight position={[4, -2, 2]} intensity={1.0} color="#10b981" />
        
        <WatchModel {...props} />
        
        <OrbitControls enablePan={false} minDistance={2.5} maxDistance={6} />
      </Canvas>
    </div>
  );
};

export default SmartWatch3DCanvas;
