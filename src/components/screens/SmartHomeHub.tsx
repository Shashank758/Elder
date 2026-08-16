import React, { useState, useEffect } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import {
  Home, Sun, Zap, Lock, ShieldCheck, Flame, Thermometer,
  ArrowLeft, Activity, Volume2, VolumeX, AlertTriangle,
  Wifi, RefreshCw, Send, Terminal, Radio, Gauge, LockKeyhole
} from 'lucide-react';
import { hubDatabase, ref, set, type ArduinoHubTelemetry } from '../../services/firebase';

export const SmartHomeHub: React.FC = () => {
  const {
    setScreen,
    homeSensors,
    setHomeSensors,
    speakText,
    firebaseConnected
  } = useEcosystem();

  const [tab, setTab] = useState<'hub' | 'sensors' | 'terminal'>('hub');
  const [logs, setLogs] = useState<string[]>([
    `12:30:18.734 -> {"temperature":0.0,"humidity":0.0,"mq3Analog":533,"mq3Digital":0,"ldr":570,"doorClosed":false,"soundDetected":true,"flameDetected":false,"mq3Alert":false,"emergency":false}`,
    `12:30:19.895 -> Firebase upload SUCCESS!`,
    `12:30:19.927 -> Realtime DB connected: farmer-f19d9-default-rtdb.firebaseio.com`
  ]);

  const [isSending, setIsSending] = useState(false);

  // Monitor sensor alerts for audio announcement
  useEffect(() => {
    if (homeSensors.flameDetected) {
      speakText("Warning! Flame detected in the home!");
    } else if (homeSensors.mq3Alert) {
      speakText("Alert! High gas reading detected on MQ3 sensor!");
    } else if (homeSensors.emergency) {
      speakText("Emergency SOS triggered on Home Hub!");
    }
  }, [homeSensors.flameDetected, homeSensors.mq3Alert, homeSensors.emergency]);

  // Helper to send test payload to Firebase Realtime Database
  const handlePushToFirebase = async (customPayload?: Partial<ArduinoHubTelemetry>) => {
    setIsSending(true);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

    const payload: ArduinoHubTelemetry = {
      temperature: customPayload?.temperature ?? (homeSensors.temperature || 24.5),
      humidity: customPayload?.humidity ?? (homeSensors.humidity || 48.0),
      mq3Analog: customPayload?.mq3Analog ?? homeSensors.mq3Analog ?? 533,
      mq3Digital: customPayload?.mq3Digital ?? homeSensors.mq3Digital ?? 0,
      ldr: customPayload?.ldr ?? homeSensors.ldr ?? 570,
      doorClosed: customPayload?.doorClosed ?? homeSensors.doorClosed ?? false,
      soundDetected: customPayload?.soundDetected ?? homeSensors.soundDetected ?? true,
      flameDetected: customPayload?.flameDetected ?? homeSensors.flameDetected ?? false,
      mq3Alert: customPayload?.mq3Alert ?? homeSensors.mq3Alert ?? false,
      emergency: customPayload?.emergency ?? homeSensors.emergency ?? false,
      lastUpdated: timeStr
    };

    try {
      await set(ref(hubDatabase, 'ElderGuard/sensor_data/latest'), payload);

      setLogs(prev => [
        `${timeStr} -> ${JSON.stringify(payload)}`,
        `${timeStr} -> Firebase upload SUCCESS!`,
        ...prev.slice(0, 15)
      ]);

      setHomeSensors(prev => ({
        ...prev,
        ...payload,
        gasLeak: payload.mq3Alert
      }));

    } catch (error: any) {
      setLogs(prev => [
        `${timeStr} -> Firebase upload FAILED: ${error.message || error}`,
        ...prev.slice(0, 15)
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Convert raw LDR (0-1023) to approximate percentage
  const ldrPct = Math.min(100, Math.round(((homeSensors.ldr || 570) / 1024) * 100));

  const getOverallStatus = () => {
    if (homeSensors.emergency) return { title: 'EMERGENCY SOS ACTIVE', color: '!bg-rose-600', text: 'Critical distress flag set on Home Hub!' };
    if (homeSensors.flameDetected) return { title: 'FLAME / FIRE HAZARD', color: '!bg-red-600', text: 'Flame sensor active in living space!' };
    if (homeSensors.mq3Alert) return { title: 'GAS / ALCOHOL ALERT', color: '!bg-amber-600', text: 'MQ-3 gas threshold exceeded!' };
    if (!homeSensors.doorClosed) return { title: 'ATTENTION: DOOR OPEN', color: '!bg-amber-500', text: 'Main entry door is currently unlatched' };
    return { title: 'ALL SYSTEMS NORMAL', color: '!bg-emerald-600', text: 'Arduino Hub & Firebase stream healthy' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full pb-28 flex flex-col gap-4 sm:gap-6">

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 shrink-0" /> Home Hub Monitor
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Live Arduino & Firebase Realtime DB
            </p>
          </div>
        </div>

        {/* Firebase Live Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-mono font-semibold">
            <span className={`w-2.5 h-2.5 rounded-full ${firebaseConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <Wifi className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-slate-700 dark:text-slate-300 truncate max-w-[120px] sm:max-w-none">
              {firebaseConnected ? 'Firebase RTDB Live' : 'Firebase Ready'}
            </span>
          </div>

          <button
            onClick={() => handlePushToFirebase()}
            disabled={isSending}
            className="p-2 sm:p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors shrink-0"
            title="Refresh / Sync Firebase"
          >
            <RefreshCw className={`w-4 h-4 ${isSending ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Banner with Dynamic Hazard Detection */}
      <div className={`app-card p-4 sm:p-6 ${overallStatus.color} text-white border-0 shadow-lg relative overflow-hidden transition-colors duration-300`}>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider">
                Arduino Microcontroller Hub
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono opacity-80">
                Last update: {homeSensors.lastUpdated || '12:30:18'}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-extrabold font-heading">{overallStatus.title}</h2>
            <p className="text-xs text-white/90 mt-1 max-w-md">{overallStatus.text}</p>
          </div>

          {/* Quick Action Controls in Hero */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => handlePushToFirebase({ emergency: !homeSensors.emergency })}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all shadow-md active:scale-95 ${
                homeSensors.emergency
                  ? 'bg-white text-rose-600 hover:bg-rose-50'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              {homeSensors.emergency ? 'Clear SOS' : 'Test SOS'}
            </button>
          </div>
        </div>

        {/* Ambient Glow Graphic */}
        <Radio className="absolute -right-6 -bottom-6 w-28 h-28 sm:w-36 sm:h-36 opacity-15 text-white pointer-events-none" />
      </div>

      {/* Navigation Tabs (Scrollable on small screens) */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 w-full sm:w-fit overflow-x-auto shrink-0">
        <button
          onClick={() => setTab('hub')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            tab === 'hub'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Home className="w-3.5 h-3.5" /> Dashboard Hub
        </button>
        <button
          onClick={() => setTab('sensors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            tab === 'sensors'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" /> Arduino Telemetry
        </button>
        <button
          onClick={() => setTab('terminal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            tab === 'terminal'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" /> Live Terminal
        </button>
      </div>

      {/* TAB 1: DASHBOARD HUB */}
      {tab === 'hub' && (
        <div className="flex flex-col gap-4 sm:gap-6">

          {/* Primary Arduino Live Sensor Readings Grid */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-heading text-slate-700 dark:text-slate-300 mb-2.5 sm:mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Real-time Arduino Telemetry Stream
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

              {/* 1. MQ-3 Alcohol & Gas Sensor */}
              <div className={`app-card p-4 sm:p-5 flex flex-col justify-between transition-all ${
                homeSensors.mq3Alert ? 'border-amber-500 bg-amber-500/10' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${homeSensors.mq3Alert ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20'}`}>
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">MQ-3 Gas / Alcohol</h4>
                      <span className="text-[10px] text-slate-400">Analog & Digital</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                    homeSensors.mq3Alert ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {homeSensors.mq3Alert ? 'ALERT!' : 'SAFE'}
                  </span>
                </div>

                <div className="mt-3 sm:mt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                      {homeSensors.mq3Analog ?? 533}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Digital Pin: <strong>{homeSensors.mq3Digital ?? 0}</strong>
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        (homeSensors.mq3Analog || 533) > 600 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.round(((homeSensors.mq3Analog || 533) / 1024) * 100))}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handlePushToFirebase({ mq3Alert: !homeSensors.mq3Alert, mq3Analog: homeSensors.mq3Alert ? 320 : 750 })}
                  className="mt-3 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline text-left active:scale-95"
                >
                  Toggle Test Gas Reading →
                </button>
              </div>

              {/* 2. LDR Ambient Light Sensor */}
              <div className="app-card p-4 sm:p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20">
                      <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">LDR Light Level</h4>
                      <span className="text-[10px] text-slate-400">Photoresistor Sensor</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {ldrPct > 40 ? 'Daylight' : 'Night'}
                  </span>
                </div>

                <div className="mt-3 sm:mt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                      {homeSensors.ldr ?? 570}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {ldrPct}% Light
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                      style={{ width: `${ldrPct}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handlePushToFirebase({ ldr: homeSensors.ldr > 600 ? 180 : 750 })}
                  className="mt-3 text-[11px] font-semibold text-yellow-600 dark:text-yellow-400 hover:underline text-left active:scale-95"
                >
                  Toggle Day / Night Simulation →
                </button>
              </div>

              {/* 3. Door Closed Sensor */}
              <div className={`app-card p-4 sm:p-5 flex flex-col justify-between transition-all ${
                !homeSensors.doorClosed ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-500/10' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${homeSensors.doorClosed ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20'}`}>
                      {homeSensors.doorClosed ? <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5" /> : <Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Door Sensor</h4>
                      <span className="text-[10px] text-slate-400">Reed Magnetic Switch</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                    homeSensors.doorClosed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 animate-pulse'
                  }`}>
                    {homeSensors.doorClosed ? 'CLOSED' : 'OPEN'}
                  </span>
                </div>

                <div className="mt-3 sm:mt-4">
                  <div className="text-sm sm:text-base font-extrabold font-heading text-slate-900 dark:text-white">
                    {homeSensors.doorClosed ? '🔒 Door Closed & Latched' : '🔓 Door Unlatched / Open'}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                    {homeSensors.doorClosed ? 'Main entrance is fully secured' : 'Alert: Entryway door is currently open!'}
                  </p>
                </div>

                <button
                  onClick={() => handlePushToFirebase({ doorClosed: !homeSensors.doorClosed })}
                  className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline text-left active:scale-95"
                >
                  Toggle Door State ({homeSensors.doorClosed ? 'Open Door' : 'Close Door'}) →
                </button>
              </div>

              {/* 4. Sound Detector */}
              <div className={`app-card p-4 sm:p-5 flex flex-col justify-between transition-all ${
                homeSensors.soundDetected ? 'border-cyan-400 bg-cyan-50/30 dark:bg-cyan-500/10' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${homeSensors.soundDetected ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                      {homeSensors.soundDetected ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Sound Sensor</h4>
                      <span className="text-[10px] text-slate-400">Microphone Module</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                    homeSensors.soundDetected ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {homeSensors.soundDetected ? 'ACTIVE' : 'QUIET'}
                  </span>
                </div>

                <div className="mt-3 sm:mt-4">
                  <div className="text-sm sm:text-base font-extrabold font-heading text-slate-900 dark:text-white">
                    {homeSensors.soundDetected ? '🔊 Audio Sound Wave Detected' : '🔇 Quiet Room Atmosphere'}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                    {homeSensors.soundDetected ? 'Recent voice/noise activity captured' : 'No acoustic events'}
                  </p>
                </div>

                <button
                  onClick={() => handlePushToFirebase({ soundDetected: !homeSensors.soundDetected })}
                  className="mt-3 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline text-left active:scale-95"
                >
                  Toggle Sound Detection →
                </button>
              </div>

              {/* 5. Flame / Fire Sensor */}
              <div className={`app-card p-4 sm:p-5 flex flex-col justify-between transition-all ${
                homeSensors.flameDetected ? 'border-red-500 bg-red-500/10' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${homeSensors.flameDetected ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Flame Sensor</h4>
                      <span className="text-[10px] text-slate-400">IR Flame Detector</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                    homeSensors.flameDetected ? 'bg-red-500 text-white animate-bounce' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                  }`}>
                    {homeSensors.flameDetected ? '🔥 FIRE DETECTED!' : 'SAFE'}
                  </span>
                </div>

                <div className="mt-3 sm:mt-4">
                  <div className="text-sm sm:text-base font-extrabold font-heading text-slate-900 dark:text-white">
                    {homeSensors.flameDetected ? '🚨 Flame Spectral Active' : '🛡️ No Flame Detected'}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                    {homeSensors.flameDetected ? 'CRITICAL: IR flame signature!' : 'Kitchen & living zone flame safe'}
                  </p>
                </div>

                <button
                  onClick={() => handlePushToFirebase({ flameDetected: !homeSensors.flameDetected })}
                  className="mt-3 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline text-left active:scale-95"
                >
                  Toggle Flame Simulation →
                </button>
              </div>

              {/* 6. Temperature & Humidity */}
              <div className="app-card p-4 sm:p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/20">
                      <Thermometer className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Temperature</h4>
                      <span className="text-[10px] text-slate-400">DHT Thermistor Sensor</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                    Comfort
                  </span>
                </div>

                <div className="mt-3 sm:mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                      {homeSensors.temperature ?? 0.0} °C
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({homeSensors.humidity ?? 0.0}%)
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                    Indoor climate monitor active
                  </p>
                </div>

                <button
                  onClick={() => handlePushToFirebase({ temperature: 26.5, humidity: 45.0 })}
                  className="mt-3 text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline text-left active:scale-95"
                >
                  Set Room Comfort Temp (26.5°C) →
                </button>
              </div>

            </div>
          </div>

          {/* Quick Actuator & Smart Switches */}
          <div className="app-card p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-bold font-heading text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" /> Smart Home Actuators
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400">App & Voice Control</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              
              {/* Lights */}
              <button
                onClick={() => {
                  const next = !homeSensors.smartLightsOn;
                  setHomeSensors(p => ({ ...p, smartLightsOn: next }));
                  speakText(next ? "Smart lights turned on" : "Smart lights turned off");
                }}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all active:scale-95 ${
                  homeSensors.smartLightsOn
                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <Sun className={`w-5 h-5 sm:w-6 sm:h-6 mb-2 ${homeSensors.smartLightsOn ? 'text-amber-500' : 'text-slate-400'}`} />
                <div className="font-bold text-xs">Smart Lights</div>
                <div className="text-[10px] font-mono mt-0.5">{homeSensors.smartLightsOn ? 'ON (80%)' : 'OFF'}</div>
              </button>

              {/* Fan */}
              <button
                onClick={() => {
                  const next = !homeSensors.smartFanOn;
                  setHomeSensors(p => ({ ...p, smartFanOn: next }));
                  speakText(next ? "Ceiling fan turned on" : "Ceiling fan turned off");
                }}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all active:scale-95 ${
                  homeSensors.smartFanOn
                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/40 text-blue-900 dark:text-blue-300 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <Zap className={`w-5 h-5 sm:w-6 sm:h-6 mb-2 ${homeSensors.smartFanOn ? 'text-blue-500 animate-spin' : 'text-slate-400'}`} />
                <div className="font-bold text-xs">Ceiling Fan</div>
                <div className="text-[10px] font-mono mt-0.5">{homeSensors.smartFanOn ? 'SPEED 2' : 'OFF'}</div>
              </button>

              {/* Door Lock */}
              <button
                onClick={() => {
                  const next = !homeSensors.doorLocked;
                  setHomeSensors(p => ({ ...p, doorLocked: next }));
                  speakText(next ? "Door locked securely" : "Door unlocked");
                }}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all active:scale-95 ${
                  homeSensors.doorLocked
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300'
                }`}
              >
                <Lock className={`w-5 h-5 sm:w-6 sm:h-6 mb-2 ${homeSensors.doorLocked ? 'text-emerald-500' : 'text-amber-500'}`} />
                <div className="font-bold text-xs">Main Door Lock</div>
                <div className="text-[10px] font-mono mt-0.5">{homeSensors.doorLocked ? 'LOCKED' : 'UNLOCKED'}</div>
              </button>

              {/* Siren */}
              <button
                onClick={() => {
                  const next = !homeSensors.alarmActive;
                  setHomeSensors(p => ({ ...p, alarmActive: next }));
                  speakText(next ? "Siren alarm activated!" : "Alarm muted");
                }}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all active:scale-95 ${
                  homeSensors.alarmActive
                    ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-400 text-rose-900 dark:text-rose-300 shadow-xs animate-pulse'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <ShieldCheck className={`w-5 h-5 sm:w-6 sm:h-6 mb-2 ${homeSensors.alarmActive ? 'text-rose-500' : 'text-slate-400'}`} />
                <div className="font-bold text-xs">Security Siren</div>
                <div className="text-[10px] font-mono mt-0.5">{homeSensors.alarmActive ? 'ACTIVE' : 'MUTED'}</div>
              </button>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DETAILED ARDUINO TELEMETRY TABLE */}
      {tab === 'sensors' && (
        <div className="app-card p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white">
                Arduino Microcontroller Register Map
              </h3>
              <p className="text-[11px] text-slate-400">Full telemetry parameter mapping sent to Firebase</p>
            </div>
            <button
              onClick={() => handlePushToFirebase()}
              className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Force Sync
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs min-w-[540px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="pb-2.5 pt-1">Parameter Key</th>
                  <th className="pb-2.5 pt-1">Arduino Sensor</th>
                  <th className="pb-2.5 pt-1">Raw Value</th>
                  <th className="pb-2.5 pt-1">Status</th>
                  <th className="pb-2.5 pt-1 text-right">Test</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                
                {/* temperature */}
                <tr>
                  <td className="py-2.5 font-bold text-blue-500">temperature</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">DHT Thermistor</td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">{homeSensors.temperature} °C</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 font-bold text-[10px]">NORMAL</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handlePushToFirebase({ temperature: 27.2 })} className="text-blue-500 hover:underline text-[10px]">Set 27.2</button>
                  </td>
                </tr>

                {/* humidity */}
                <tr>
                  <td className="py-2.5 font-bold text-cyan-500">humidity</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">RH Sensor</td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">{homeSensors.humidity} %</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 font-bold text-[10px]">OK</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handlePushToFirebase({ humidity: 55.0 })} className="text-blue-500 hover:underline text-[10px]">Set 55%</button>
                  </td>
                </tr>

                {/* mq3Analog */}
                <tr>
                  <td className="py-2.5 font-bold text-amber-500">mq3Analog</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">MQ-3 Gas (A0)</td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">{homeSensors.mq3Analog ?? 533}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      (homeSensors.mq3Analog || 533) > 600 ? 'bg-amber-500 text-white' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {(homeSensors.mq3Analog || 533) > 600 ? 'HIGH' : 'NORMAL'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handlePushToFirebase({ mq3Analog: 533 })} className="text-blue-500 hover:underline text-[10px]">Set 533</button>
                  </td>
                </tr>

                {/* mq3Digital */}
                <tr>
                  <td className="py-2.5 font-bold text-amber-500">mq3Digital</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">MQ-3 Pin (D0)</td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">{homeSensors.mq3Digital ?? 0}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px]">
                      {homeSensors.mq3Digital === 1 ? 'TRIGGERED (1)' : 'CLEAR (0)'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handlePushToFirebase({ mq3Digital: homeSensors.mq3Digital ? 0 : 1 })} className="text-blue-500 hover:underline text-[10px]">Toggle 0/1</button>
                  </td>
                </tr>

                {/* ldr */}
                <tr>
                  <td className="py-2.5 font-bold text-yellow-500">ldr</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">LDR Photoresistor</td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">{homeSensors.ldr ?? 570}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 font-bold text-[10px]">
                      {ldrPct}% Light
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handlePushToFirebase({ ldr: 570 })} className="text-blue-500 hover:underline text-[10px]">Set 570</button>
                  </td>
                </tr>

                {/* doorClosed */}
                <tr>
                  <td className="py-2.5 font-bold text-emerald-500">doorClosed</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">Door Reed Switch</td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">{homeSensors.doorClosed ? 'true' : 'false'}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      homeSensors.doorClosed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {homeSensors.doorClosed ? 'CLOSED' : 'OPEN'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handlePushToFirebase({ doorClosed: !homeSensors.doorClosed })} className="text-blue-500 hover:underline text-[10px]">Toggle</button>
                  </td>
                </tr>

                {/* soundDetected */}
                <tr>
                  <td className="py-2.5 font-bold text-purple-500">soundDetected</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">Microphone Sound</td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">{homeSensors.soundDetected ? 'true' : 'false'}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      homeSensors.soundDetected ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {homeSensors.soundDetected ? 'NOISE ACTIVE' : 'QUIET'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handlePushToFirebase({ soundDetected: !homeSensors.soundDetected })} className="text-blue-500 hover:underline text-[10px]">Toggle</button>
                  </td>
                </tr>

                {/* flameDetected */}
                <tr>
                  <td className="py-2.5 font-bold text-red-500">flameDetected</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">IR Flame Sensor</td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">{homeSensors.flameDetected ? 'true' : 'false'}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      homeSensors.flameDetected ? 'bg-red-500 text-white animate-bounce' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {homeSensors.flameDetected ? 'FLAME ALERT!' : 'SAFE'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handlePushToFirebase({ flameDetected: !homeSensors.flameDetected })} className="text-blue-500 hover:underline text-[10px]">Toggle</button>
                  </td>
                </tr>

                {/* mq3Alert */}
                <tr>
                  <td className="py-2.5 font-bold text-amber-500">mq3Alert</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">MQ-3 Logic Flag</td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">{homeSensors.mq3Alert ? 'true' : 'false'}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      homeSensors.mq3Alert ? 'bg-amber-500 text-white' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {homeSensors.mq3Alert ? 'ALERT ACTIVE' : 'CLEAR'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handlePushToFirebase({ mq3Alert: !homeSensors.mq3Alert })} className="text-blue-500 hover:underline text-[10px]">Toggle</button>
                  </td>
                </tr>

                {/* emergency */}
                <tr>
                  <td className="py-2.5 font-bold text-rose-500">emergency</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">Panic SOS Flag</td>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">{homeSensors.emergency ? 'true' : 'false'}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      homeSensors.emergency ? 'bg-rose-600 text-white animate-ping' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {homeSensors.emergency ? 'CRITICAL SOS' : 'NORMAL'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handlePushToFirebase({ emergency: !homeSensors.emergency })} className="text-blue-500 hover:underline text-[10px]">Toggle</button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE ARDUINO SERIAL STREAM TERMINAL */}
      {tab === 'terminal' && (
        <div className="app-card p-4 sm:p-6 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl shadow-xl flex flex-col gap-3.5 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 text-slate-400 gap-1.5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-slate-200 text-xs sm:text-sm">Arduino Serial Console Monitor</span>
            </div>
            <span className="text-[10px]">Baud Rate: 115200 • RTDB: /homehub</span>
          </div>

          {/* Quick Payload Injectors */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-800 text-slate-300">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 block w-full sm:w-auto">Simulate Serial Stream:</span>
            <button
              onClick={() => handlePushToFirebase({
                temperature: 0.0, humidity: 0.0, mq3Analog: 533, mq3Digital: 0, ldr: 570,
                doorClosed: false, soundDetected: true, flameDetected: false, mq3Alert: false, emergency: false
              })}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] sm:text-[11px] flex items-center gap-1 active:scale-95"
            >
              <Send className="w-3 h-3" /> User Arduino Sample
            </button>

            <button
              onClick={() => handlePushToFirebase({
                flameDetected: true, mq3Alert: true, emergency: true
              })}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] sm:text-[11px] flex items-center gap-1 active:scale-95"
            >
              <AlertTriangle className="w-3 h-3" /> Hazard SOS Sample
            </button>
          </div>

          {/* Console Log Window */}
          <div className="bg-black/80 rounded-xl p-3 sm:p-4 h-64 sm:h-72 overflow-y-auto font-mono text-[10px] sm:text-[11px] space-y-1.5 border border-slate-900">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2 items-start leading-relaxed break-all">
                <span className="text-slate-600 shrink-0">[{index + 1}]</span>
                <span className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('ALERT') || log.includes('FAILED') ? 'text-rose-400' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800 gap-1">
            <span className="truncate">Firebase: farmer-f19d9-default-rtdb.firebaseio.com</span>
            <span>Realtime Listener: Active</span>
          </div>
        </div>
      )}

    </div>
  );
};
