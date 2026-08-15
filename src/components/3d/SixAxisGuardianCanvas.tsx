import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

export interface SixAxisGuardianCanvasProps {
  pitch: number;
  roll: number;
  yaw: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroX?: number;
  gyroY?: number;
  gyroZ?: number;
  activity: string;
}

// Realistic 3D Human Anatomical Mesh with 6-Axis Kinematic Joint Rigging
const RealisticHumanMesh: React.FC<SixAxisGuardianCanvasProps> = ({
  pitch,
  roll,
  yaw,
  accelX,
  accelY,
  accelZ,
  activity
}) => {
  const humanBodyGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const pitchRingRef = useRef<THREE.Mesh>(null);
  const rollRingRef = useRef<THREE.Mesh>(null);
  const yawRingRef = useRef<THREE.Mesh>(null);

  // Posture status logic
  const isHorizontalRisk = Math.abs(pitch) > 50 || Math.abs(roll) > 50;
  const isTilted = Math.abs(pitch) > 22 || Math.abs(roll) > 22;
  const skinColor = isHorizontalRisk ? '#f43f5e' : isTilted ? '#fbbf24' : '#38bdf8';
  const skinEmissive = isHorizontalRisk ? '#be123c' : isTilted ? '#d97706' : '#0284c7';

  // Motion arc points
  const arcPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * 1.95, 0, Math.sin(angle) * 1.95));
    }
    return points;
  }, []);

  const arcGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(arcPoints), [arcPoints]);

  useFrame((state) => {
    if (!humanBodyGroupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Map 6-DOF Gyroscope angles (Pitch, Roll, Yaw) to 3D kinematics
    const targetRadX = (pitch * Math.PI) / 180;
    const targetRadY = (yaw * 0.2 * Math.PI) / 180;
    const targetRadZ = (roll * Math.PI) / 180;

    // Body smooth lerp to orientation
    humanBodyGroupRef.current.rotation.x = THREE.MathUtils.lerp(humanBodyGroupRef.current.rotation.x, targetRadX, 0.08);
    humanBodyGroupRef.current.rotation.y = THREE.MathUtils.lerp(humanBodyGroupRef.current.rotation.y, targetRadY + Math.sin(t * 0.3) * 0.05, 0.08);
    humanBodyGroupRef.current.rotation.z = THREE.MathUtils.lerp(humanBodyGroupRef.current.rotation.z, targetRadZ, 0.08);

    // Natural gait/breathing micro-movements
    if (spineRef.current) {
      spineRef.current.rotation.z = Math.sin(t * 1.5) * 0.03;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.08;
    }
    if (leftArmRef.current && rightArmRef.current) {
      const armSwing = activity.toLowerCase().includes('walk') ? Math.sin(t * 4) * 0.35 : Math.sin(t * 1.2) * 0.05;
      leftArmRef.current.rotation.x = armSwing;
      rightArmRef.current.rotation.x = -armSwing;
    }
    if (leftLegRef.current && rightLegRef.current) {
      const legSwing = activity.toLowerCase().includes('walk') ? Math.sin(t * 4) * 0.4 : 0;
      leftLegRef.current.rotation.x = -legSwing;
      rightLegRef.current.rotation.x = legSwing;
    }

    // Gyroscope Ring rotations
    if (pitchRingRef.current) pitchRingRef.current.rotation.x = t * 0.2;
    if (rollRingRef.current) rollRingRef.current.rotation.z = -t * 0.18;
    if (yawRingRef.current) yawRingRef.current.rotation.y = t * 0.12;
  });

  return (
    <group>
      {/* 🧍 REALISTIC 3D HUMAN ANATOMICAL FIGURE */}
      <group ref={humanBodyGroupRef} position={[0, -0.2, 0]}>
        
        {/* HEAD & FACIAL CRANIUM */}
        <group ref={headRef} position={[0, 1.85, 0]}>
          {/* Main Skull Mesh */}
          <mesh>
            <sphereGeometry args={[0.24, 32, 32]} />
            <meshPhysicalMaterial
              color={skinColor}
              emissive={skinEmissive}
              emissiveIntensity={0.4}
              roughness={0.2}
              metalness={0.3}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
            />
          </mesh>
          {/* Jaw Contour */}
          <mesh position={[0, -0.1, 0.06]}>
            <boxGeometry args={[0.22, 0.16, 0.22]} />
            <meshPhysicalMaterial color={skinColor} emissive={skinEmissive} emissiveIntensity={0.3} roughness={0.3} />
          </mesh>
          {/* Holographic Visor Display Bar */}
          <mesh position={[0, 0.02, 0.18]}>
            <boxGeometry args={[0.3, 0.08, 0.12]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} />
          </mesh>
        </group>

        {/* NECK COLUMN */}
        <mesh position={[0, 1.52, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.22, 16]} />
          <meshPhysicalMaterial color={skinColor} roughness={0.3} />
        </mesh>

        {/* TORSO & SPINE RIBCAGE */}
        <group ref={spineRef} position={[0, 1.05, 0]}>
          {/* Upper Chest Pectorals */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.32, 0.28, 0.42, 20]} />
            <meshPhysicalMaterial
              color={skinColor}
              emissive={skinEmissive}
              emissiveIntensity={0.35}
              roughness={0.2}
              metalness={0.4}
              clearcoat={0.8}
            />
          </mesh>
          {/* Lower Abdominal Torso */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.28, 0.24, 0.38, 20]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.25} metalness={0.3} />
          </mesh>

          {/* Chest Heart Node Pulsing Blue */}
          <mesh position={[0, 0.18, 0.22]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* PELVIS / HIPS STRUCTURE */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.26, 0.22, 0.28, 20]} />
          <meshPhysicalMaterial color={skinColor} roughness={0.3} />
        </mesh>

        {/* SHOULDER JOINTS BAR */}
        <mesh position={[0, 1.34, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.88, 16]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* LEFT ARM & HAND */}
        <group ref={leftArmRef} position={[-0.52, 1.34, 0]}>
          {/* Deltoid Shoulder */}
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.2} />
          </mesh>
          {/* Upper Arm Bicep */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 0.52, 16]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.2} />
          </mesh>
          {/* Elbow Joint */}
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.88, 0]}>
            <cylinderGeometry args={[0.065, 0.055, 0.52, 16]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.2} />
          </mesh>
          {/* Hand Palm */}
          <mesh position={[0, -1.18, 0]}>
            <boxGeometry args={[0.09, 0.12, 0.04]} />
            <meshPhysicalMaterial color={skinColor} />
          </mesh>
        </group>

        {/* RIGHT ARM & HAND (ESP32 SMARTWATCH WEARER) */}
        <group ref={rightArmRef} position={[0.52, 1.34, 0]}>
          {/* Deltoid Shoulder */}
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.2} />
          </mesh>
          {/* Upper Arm Bicep */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 0.52, 16]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.2} />
          </mesh>
          {/* Elbow Joint */}
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#06b6d4" />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.88, 0]}>
            <cylinderGeometry args={[0.065, 0.055, 0.52, 16]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.2} />
          </mesh>
          {/* ESP32 Smartwatch Wrist Device */}
          <mesh position={[0, -1.02, 0]}>
            <boxGeometry args={[0.16, 0.16, 0.16]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} />
          </mesh>
          {/* Hand Palm */}
          <mesh position={[0, -1.18, 0]}>
            <boxGeometry args={[0.09, 0.12, 0.04]} />
            <meshPhysicalMaterial color={skinColor} />
          </mesh>
        </group>

        {/* LEFT LEG & FOOT */}
        <group ref={leftLegRef} position={[-0.18, 0.28, 0]}>
          {/* Hip Joint */}
          <mesh>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshPhysicalMaterial color={skinColor} />
          </mesh>
          {/* Thigh Quadricep */}
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.11, 0.085, 0.65, 16]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.2} />
          </mesh>
          {/* Knee Cap */}
          <mesh position={[0, -0.72, 0.02]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Calf / Shin */}
          <mesh position={[0, -1.05, 0]}>
            <cylinderGeometry args={[0.08, 0.06, 0.62, 16]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.2} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -1.38, 0.08]}>
            <boxGeometry args={[0.1, 0.08, 0.26]} />
            <meshPhysicalMaterial color={skinColor} />
          </mesh>
        </group>

        {/* RIGHT LEG & FOOT */}
        <group ref={rightLegRef} position={[0.18, 0.28, 0]}>
          {/* Hip Joint */}
          <mesh>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshPhysicalMaterial color={skinColor} />
          </mesh>
          {/* Thigh Quadricep */}
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.11, 0.085, 0.65, 16]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.2} />
          </mesh>
          {/* Knee Cap */}
          <mesh position={[0, -0.72, 0.02]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Calf / Shin */}
          <mesh position={[0, -1.05, 0]}>
            <cylinderGeometry args={[0.08, 0.06, 0.62, 16]} />
            <meshPhysicalMaterial color={skinColor} roughness={0.2} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -1.38, 0.08]}>
            <boxGeometry args={[0.1, 0.08, 0.26]} />
            <meshPhysicalMaterial color={skinColor} />
          </mesh>
        </group>

        {/* Floating HTML 3D Status Overlay Badge */}
        <Html transform position={[0, 2.35, 0]} distanceFactor={3.6} wrapperClass="pointer-events-none select-none">
          <div className="px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-400 text-[10px] font-mono text-cyan-300 font-bold whitespace-nowrap shadow-2xl backdrop-blur-md">
            {isHorizontalRisk ? '🚨 RISK: HORIZONTAL TILT' : isTilted ? '⚠️ POSTURE: TILTED' : `REAL 3D HUMAN: ${activity.toUpperCase()}`}
          </div>
        </Html>
      </group>

      {/* 🧭 GYROSCOPE SPHERICAL GIMBAL RINGS & ARCS */}
      <mesh ref={pitchRingRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[1.9, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} wireframe />
      </mesh>

      {/* Equatorial Roll Ring */}
      <mesh ref={rollRingRef} position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.92, 0.02, 16, 64]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
      </mesh>

      {/* Compass Base Ring */}
      <mesh ref={yawRingRef} position={[0, -1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 64]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.7} />
      </mesh>

      {/* Motion Arc Trajectory Path */}
      <primitive object={new THREE.Line(arcGeo, new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 }))} position={[0, -1.3, 0]} />

      {/* Accel Vector Arrows (X, Y, Z) */}
      <mesh position={[1.5, 0.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, Math.min(1.5, Math.abs(accelX) + 0.3), 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, Math.min(1.5, Math.abs(accelY) + 0.3), 8]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0.4, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, Math.min(1.5, Math.abs(accelZ) * 0.15 + 0.3), 8]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} />
      </mesh>

      {/* Spatial Ground Floor Grid */}
      <gridHelper args={[8, 16, 0x06b6d4, 0x1e293b]} position={[0, -1.3, 0]} />
    </group>
  );
};

export const SixAxisGuardianCanvas: React.FC<SixAxisGuardianCanvasProps> = (props) => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.8, 5.2], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        shadows={false}
      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-5, -4, -5]} intensity={0.8} color="#06b6d4" />
        <pointLight position={[0, 2, 3]} intensity={1.2} color="#10b981" />

        <RealisticHumanMesh {...props} />

        <OrbitControls enablePan={false} minDistance={2.8} maxDistance={7.5} />
      </Canvas>
    </div>
  );
};

export default SixAxisGuardianCanvas;
