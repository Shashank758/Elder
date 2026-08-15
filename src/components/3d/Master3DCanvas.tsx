import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import gsap from 'gsap';
import * as THREE from 'three';

import { useEcosystem } from '../../context/EcosystemContext';
import { useScene, SCREEN_3D_PRESETS } from '../../context/SceneContext';

import DashboardScene from './scenes/DashboardScene';
import MotionScene from './scenes/MotionScene';
import MedicineScene from './scenes/MedicineScene';
import EmergencyScene from './scenes/EmergencyScene';
import CompanionScene from './scenes/CompanionScene';
import SmartHomeScene from './scenes/SmartHomeScene';
import PredictionScene from './scenes/PredictionScene';
import FamilyScene from './scenes/FamilyScene';
import DoctorScene from './scenes/DoctorScene';
import SpiritualScene from './scenes/SpiritualScene';
import MentalScene from './scenes/MentalScene';
import AnalyticsScene from './scenes/AnalyticsScene';
import SettingsScene from './scenes/SettingsScene';
import AdminScene from './scenes/AdminScene';
import LoginScene from './scenes/LoginScene';
import SplashScene from './scenes/SplashScene';

// GSAP Camera Controller component inside Canvas
const GSAPCameraController: React.FC = () => {
  const { camera } = useThree();
  const { screen, fallAlertActive } = useEcosystem();
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const activeScreenName = fallAlertActive ? 'emergency' : screen;
    const preset = SCREEN_3D_PRESETS[activeScreenName] || SCREEN_3D_PRESETS.dashboard;

    // Smooth GSAP transition for camera position & fov
    gsap.to(camera.position, {
      x: preset.camera.position[0],
      y: preset.camera.position[1],
      z: preset.camera.position[2],
      duration: 1.2,
      ease: 'power2.inOut'
    });

    if ('fov' in camera && typeof (camera as THREE.PerspectiveCamera).fov === 'number') {
      gsap.to(camera as THREE.PerspectiveCamera, {
        fov: preset.camera.fov,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix()
      });
    }

    gsap.to(targetLookAt.current, {
      x: preset.camera.lookAt[0],
      y: preset.camera.lookAt[1],
      z: preset.camera.lookAt[2],
      duration: 1.2,
      ease: 'power2.inOut'
    });
  }, [screen, fallAlertActive, camera]);

  useFrame(() => {
    camera.lookAt(targetLookAt.current);
  });

  return null;
};

// Scene Content Router inside Canvas
const SceneContentRouter: React.FC = () => {
  const { screen, fallAlertActive } = useEcosystem();

  if (fallAlertActive) {
    return <EmergencyScene />;
  }

  switch (screen) {
    case 'splash':
      return <SplashScene />;
    case 'login':
      return <LoginScene />;
    case 'dashboard':
      return <DashboardScene />;
    case 'motion':
      return <MotionScene />;
    case 'medicine':
      return <MedicineScene />;
    case 'emergency':
      return <EmergencyScene />;
    case 'companion':
      return <CompanionScene />;
    case 'smarthome':
      return <SmartHomeScene />;
    case 'prediction':
      return <PredictionScene />;
    case 'family':
      return <FamilyScene />;
    case 'doctor':
      return <DoctorScene />;
    case 'spiritual':
      return <SpiritualScene />;
    case 'mental':
      return <MentalScene />;
    case 'analytics':
      return <AnalyticsScene />;
    case 'settings':
      return <SettingsScene />;
    case 'admin':
      return <AdminScene />;
    default:
      return <DashboardScene />;
  }
};

export const Master3DCanvas: React.FC = () => {
  const { comfortMode, fallAlertActive } = useEcosystem();
  const { postConfig } = useScene();

  // If Comfort Mode is enabled, skip heavy 3D rendering for low-end elder hardware
  if (comfortMode) {
    return null;
  }

  const bloomIntensity = fallAlertActive ? 3.0 : postConfig.bloomIntensity;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', depth: true }}
        shadows={false}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />

        <GSAPCameraController />

        <Suspense fallback={null}>
          <SceneContentRouter />
        </Suspense>

        {/* Optimized Lightweight Post-Processing Pipeline */}
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom
            intensity={bloomIntensity * 0.8}
            luminanceThreshold={0.4}
          />
          <Vignette eskil={false} offset={postConfig.vignetteOffset} darkness={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Master3DCanvas;
