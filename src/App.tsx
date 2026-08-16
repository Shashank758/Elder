import React, { useState, useEffect } from 'react';
import { EcosystemProvider, useEcosystem } from './context/EcosystemContext';
import { SceneProvider, useScene } from './context/SceneContext';
import { Master3DCanvas } from './components/3d/Master3DCanvas';

import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { FloatingControls } from './components/common/FloatingControls';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { HomeDashboard } from './components/screens/HomeDashboard';
import { MotionAnalysis } from './components/screens/MotionAnalysis';
import { FallDetectionModal } from './components/screens/FallDetectionModal';
import { AIPrediction } from './components/screens/AIPrediction';
import { AIVoiceCompanion } from './components/screens/AIVoiceCompanion';
import { SpiritualHub } from './components/screens/SpiritualHub';
import { MedicineSystem } from './components/screens/MedicineSystem';
import { SmartHomeHub } from './components/screens/SmartHomeHub';
import { FamilyDashboard } from './components/screens/FamilyDashboard';
import { DoctorDashboard } from './components/screens/DoctorDashboard';
import { EmergencyCenter } from './components/screens/EmergencyCenter';
import { MentalWellness } from './components/screens/MentalWellness';
import { Analytics } from './components/screens/Analytics';
import { ElderGuardAI360Screen } from './components/screens/ElderGuardAI360Screen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AdminPanel } from './components/screens/AdminPanel';
import { GlobalAudioPlayer } from './components/common/GlobalAudioPlayer';
import { GlobalVoiceController } from './components/common/GlobalVoiceController';

const AppContent: React.FC = () => {
  const { screen, isAuthenticated, darkMode } = useEcosystem();
  const { setActiveScreen } = useScene();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Sync screen to 3D scene store
  useEffect(() => {
    setActiveScreen(screen);
  }, [screen, setActiveScreen]);

  // Sync dark/light mode class to html and body elements
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  if (screen === 'splash') {
    return <SplashScreen />;
  }

  if (screen === 'login' || !isAuthenticated) {
    return <LoginScreen />;
  }

  const renderActiveScreen = () => {
    switch (screen) {
      case 'dashboard': return <HomeDashboard />;
      case 'motion': return <MotionAnalysis />;
      case 'prediction': return <AIPrediction />;
      case 'companion': return <AIVoiceCompanion />;
      case 'spiritual': return <SpiritualHub />;
      case 'medicine': return <MedicineSystem />;
      case 'smarthome': return <SmartHomeHub />;
      case 'family': return <FamilyDashboard />;
      case 'doctor': return <DoctorDashboard />;
      case 'emergency': return <EmergencyCenter />;
      case 'mental': return <MentalWellness />;
      case 'analytics': return <Analytics />;
      case 'ai360': return <ElderGuardAI360Screen />;
      case 'settings': return <SettingsScreen />;
      case 'admin': return <AdminPanel />;
      default: return <HomeDashboard />;
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex flex-col bg-slate-50 dark:bg-[#060911] text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white relative overflow-hidden transition-colors duration-300">
      {/* 3D Canvas rendering in dark mode */}
      {darkMode && <Master3DCanvas />}

      {/* Top Header */}
      <Header toggleNotifications={() => setIsNotificationOpen(!isNotificationOpen)} />

      {/* Main Layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 min-h-0 overflow-y-auto pb-36 lg:pb-8 pt-4 sm:pt-6 bg-slate-50 dark:bg-[#060911] transition-colors duration-300">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Global Controls & Modals */}
      <FloatingControls />
      <NotificationDrawer isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      <FallDetectionModal />
      <GlobalAudioPlayer />
      <GlobalVoiceController />
    </div>
  );
};

export default function App() {
  return (
    <EcosystemProvider>
      <SceneProvider>
        <AppContent />
      </SceneProvider>
    </EcosystemProvider>
  );
}
