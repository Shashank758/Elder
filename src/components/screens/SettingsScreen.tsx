import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Settings, Eye, Bluetooth, Wifi, Cpu, RefreshCw, ArrowLeft } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { 
    darkMode, setDarkMode, 
    accessibilityLargeText, setAccessibilityLargeText, 
    highContrast, setHighContrast, 
    voiceNavigation, setVoiceNavigation,
    comfortMode, setComfortMode,
    setScreen
  } = useEcosystem();

  const [firmwareUpdating, setFirmwareUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);

  const startFirmwareUpdate = () => {
    setFirmwareUpdating(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setUpdateProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setFirmwareUpdating(false), 500);
      }
    }, 150);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-500" /> Settings & Hardware Pairing
            </h1>
            <p className="text-xs text-slate-500">Configure accessibility, theme, voice navigation & ESP32 pairing</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual & Senior Accessibility Controls */}
        <div className="lg:col-span-6 app-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-500" />
              Senior Accessibility & Vision Mode
            </h3>

            <div className="flex flex-col gap-3">
              
              {/* Large Font Mode */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Large Typography Mode</div>
                  <div className="text-xs text-slate-500 mt-0.5">Increases font sizes across all screens for elderly readability</div>
                </div>
                <input
                  type="checkbox"
                  checked={accessibilityLargeText}
                  onChange={e => setAccessibilityLargeText(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              {/* High Contrast Mode */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">High Contrast Vision Mode</div>
                  <div className="text-xs text-slate-500 mt-0.5">Deep black backgrounds with high contrast text for low vision</div>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={e => setHighContrast(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Theme Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Color Theme Mode</div>
                  <div className="text-xs text-slate-500 mt-0.5">Switch between Light Mode and Dark Mode</div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm"
                >
                  {darkMode ? 'DARK MODE 🌙' : 'LIGHT MODE ☀️'}
                </button>
              </div>

              {/* Voice Navigation */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Voice Navigation Feedback</div>
                  <div className="text-xs text-slate-500 mt-0.5">Speaks action confirmation when buttons are pressed</div>
                </div>
                <input
                  type="checkbox"
                  checked={voiceNavigation}
                  onChange={e => setVoiceNavigation(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Comfort Mode Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    3D Comfort Mode
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Disables continuous WebGL background animations for low-power devices
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={comfortMode}
                  onChange={e => setComfortMode(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Hardware Pairing & Firmware OTA */}
        <div className="lg:col-span-6 app-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-emerald-500" />
              Hardware Pairing & Firmware OTA
            </h3>

            <div className="flex flex-col gap-3 mb-6">
              
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <Bluetooth className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">ElderGuard SmartWatch (ESP32)</span>
                    <span className="text-[10px] text-slate-400">MAC: 24:62:AB:78:E4:90</span>
                  </div>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">CONNECTED</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <Wifi className="w-4 h-4 text-cyan-500" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Smart Home Hub (ESP32 Central)</span>
                    <span className="text-[10px] text-slate-400">SSID: ElderGuard_Secure_Mesh</span>
                  </div>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">CONNECTED</span>
              </div>

            </div>

            {/* OTA Firmware Update Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-2">
                <span>FIRMWARE OVER-THE-AIR (OTA)</span>
                <span className="text-blue-600 dark:text-blue-400">v2.4.1 Latest</span>
              </div>

              {firmwareUpdating ? (
                <div>
                  <div className="flex justify-between text-[11px] text-blue-600 dark:text-blue-400 mb-1">
                    <span>Flashing ESP32 Flash Memory...</span>
                    <span>{updateProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${updateProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={startFirmwareUpdate}
                  className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/20 hover:bg-blue-100 text-blue-600 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-500/30 flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Trigger OTA Firmware Flash Simulation
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
