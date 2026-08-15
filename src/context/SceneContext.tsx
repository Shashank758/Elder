import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppScreen } from '../types';

export interface CameraPreset {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

export interface PostProcessingConfig {
  bloomIntensity: number;
  bloomThreshold: number;
  chromaticAberration: number;
  vignetteOffset: number;
  noiseOpacity: number;
}

export const SCREEN_3D_PRESETS: Record<AppScreen, { camera: CameraPreset; post: PostProcessingConfig }> = {
  splash: {
    camera: { position: [0, 0, 8], lookAt: [0, 0, 0], fov: 50 },
    post: { bloomIntensity: 1.5, bloomThreshold: 0.2, chromaticAberration: 0.003, vignetteOffset: 0.4, noiseOpacity: 0.03 }
  },
  login: {
    camera: { position: [0, 1.2, 7], lookAt: [0, 0, 0], fov: 45 },
    post: { bloomIntensity: 0.9, bloomThreshold: 0.4, chromaticAberration: 0.001, vignetteOffset: 0.5, noiseOpacity: 0.02 }
  },
  dashboard: {
    camera: { position: [0, 0.5, 6], lookAt: [0, 0, 0], fov: 45 },
    post: { bloomIntensity: 1.0, bloomThreshold: 0.35, chromaticAberration: 0.001, vignetteOffset: 0.45, noiseOpacity: 0.02 }
  },
  motion: {
    camera: { position: [0, 0, 5.5], lookAt: [0, 0, 0], fov: 45 },
    post: { bloomIntensity: 1.2, bloomThreshold: 0.3, chromaticAberration: 0.002, vignetteOffset: 0.4, noiseOpacity: 0.02 }
  },
  prediction: {
    camera: { position: [0, 0.8, 6.5], lookAt: [0, 0, 0], fov: 48 },
    post: { bloomIntensity: 1.1, bloomThreshold: 0.35, chromaticAberration: 0.0015, vignetteOffset: 0.4, noiseOpacity: 0.02 }
  },
  companion: {
    camera: { position: [0, 0, 5], lookAt: [0, 0, 0], fov: 42 },
    post: { bloomIntensity: 1.3, bloomThreshold: 0.25, chromaticAberration: 0.002, vignetteOffset: 0.35, noiseOpacity: 0.025 }
  },
  spiritual: {
    camera: { position: [0, -0.5, 7], lookAt: [0, 0, 0], fov: 50 },
    post: { bloomIntensity: 1.6, bloomThreshold: 0.15, chromaticAberration: 0.001, vignetteOffset: 0.5, noiseOpacity: 0.015 }
  },
  medicine: {
    camera: { position: [0, 2, 6], lookAt: [0, 0, 0], fov: 45 },
    post: { bloomIntensity: 0.8, bloomThreshold: 0.4, chromaticAberration: 0.001, vignetteOffset: 0.45, noiseOpacity: 0.02 }
  },
  smarthome: {
    camera: { position: [3.5, 3.5, 5], lookAt: [0, 0, 0], fov: 42 },
    post: { bloomIntensity: 1.1, bloomThreshold: 0.3, chromaticAberration: 0.001, vignetteOffset: 0.4, noiseOpacity: 0.02 }
  },
  family: {
    camera: { position: [0, 1, 6.5], lookAt: [0, 0, 0], fov: 46 },
    post: { bloomIntensity: 1.0, bloomThreshold: 0.35, chromaticAberration: 0.001, vignetteOffset: 0.45, noiseOpacity: 0.02 }
  },
  doctor: {
    camera: { position: [0, 0.2, 5.8], lookAt: [0, 0, 0], fov: 44 },
    post: { bloomIntensity: 0.7, bloomThreshold: 0.5, chromaticAberration: 0.0008, vignetteOffset: 0.5, noiseOpacity: 0.015 }
  },
  emergency: {
    camera: { position: [0, 0, 4.5], lookAt: [0, 0, 0], fov: 55 },
    post: { bloomIntensity: 2.5, bloomThreshold: 0.1, chromaticAberration: 0.006, vignetteOffset: 0.3, noiseOpacity: 0.04 }
  },
  mental: {
    camera: { position: [0, 0, 6], lookAt: [0, 0, 0], fov: 45 },
    post: { bloomIntensity: 1.2, bloomThreshold: 0.3, chromaticAberration: 0.001, vignetteOffset: 0.4, noiseOpacity: 0.015 }
  },
  analytics: {
    camera: { position: [2.5, 2, 5.5], lookAt: [0, 0, 0], fov: 45 },
    post: { bloomIntensity: 0.9, bloomThreshold: 0.4, chromaticAberration: 0.001, vignetteOffset: 0.45, noiseOpacity: 0.02 }
  },
  settings: {
    camera: { position: [0, 0, 5], lookAt: [0, 0, 0], fov: 45 },
    post: { bloomIntensity: 0.8, bloomThreshold: 0.4, chromaticAberration: 0.001, vignetteOffset: 0.45, noiseOpacity: 0.02 }
  },
  admin: {
    camera: { position: [0, 1.5, 7], lookAt: [0, 0, 0], fov: 48 },
    post: { bloomIntensity: 1.2, bloomThreshold: 0.3, chromaticAberration: 0.002, vignetteOffset: 0.4, noiseOpacity: 0.025 }
  }
};

interface SceneContextType {
  activeScreen: AppScreen;
  setActiveScreen: (screen: AppScreen) => void;
  cameraTarget: CameraPreset;
  setCameraTarget: (preset: CameraPreset) => void;
  postConfig: PostProcessingConfig;
  setPostConfig: (config: PostProcessingConfig) => void;
  comfortMode: boolean;
  setComfortMode: (val: boolean) => void;
  alertIntensity: number; // 0 to 1 for emergencies
  setAlertIntensity: (val: number) => void;
}

const SceneContext = createContext<SceneContextType | undefined>(undefined);

export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('splash');
  const [comfortMode, setComfortMode] = useState<boolean>(false);
  const [alertIntensity, setAlertIntensity] = useState<number>(0);

  const initialPreset = SCREEN_3D_PRESETS[activeScreen] || SCREEN_3D_PRESETS.dashboard;
  const [cameraTarget, setCameraTarget] = useState<CameraPreset>(initialPreset.camera);
  const [postConfig, setPostConfig] = useState<PostProcessingConfig>(initialPreset.post);

  useEffect(() => {
    const preset = SCREEN_3D_PRESETS[activeScreen] || SCREEN_3D_PRESETS.dashboard;
    setCameraTarget(preset.camera);
    setPostConfig(preset.post);
  }, [activeScreen]);

  return (
    <SceneContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        cameraTarget,
        setCameraTarget,
        postConfig,
        setPostConfig,
        comfortMode,
        setComfortMode,
        alertIntensity,
        setAlertIntensity
      }}
    >
      {children}
    </SceneContext.Provider>
  );
};

export const useScene = () => {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return context;
};
