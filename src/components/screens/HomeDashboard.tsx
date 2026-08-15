import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import {
  Heart, Droplets, Thermometer, Pill, Sparkles,
  Mic, Sun, Zap, CheckCircle2, ArrowRight, Play, Bot, TrendingUp
} from 'lucide-react';
import { SPIRITUAL_PLAYLIST } from '../../data/playlist';

export const HomeDashboard: React.FC = () => {
  const {
    watchData, medicines, setScreen,
    toggleMedicineTaken, homeSensors, setHomeSensors,
    setCurrentTrack, setIsPlayingTrack, speakText,
    setShowVoiceGuide, currentUser
  } = useEcosystem();

  const nextMed = medicines.find(m => !m.taken);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full pb-24 flex flex-col gap-6">

      {/* Top Greeting & AI Status Banner */}
      <div className="app-card p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading mt-2">
            Welcome back, {currentUser?.name || 'Devendra'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Your vitals are stable. ESP32 Biosensor telemetry active.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowVoiceGuide(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all"
          >
            <Mic className="w-4 h-4 text-cyan-300" /> Voice Assistant
          </button>
          <button
            onClick={() => setScreen('prediction')}
            className="px-4 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            Vitals Analytics <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Today's Overview Grid (Vitals + AI Health Score) */}
      <div>
        <h2 className="text-base font-bold font-heading mb-3 flex items-center justify-between">
          <span>Today's Overview</span>
          <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer" onClick={() => setScreen('prediction')}>
            View Full Telemetry →
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Heart Rate Card */}
          <div className="app-card p-5 flex flex-col justify-between app-card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" /> Heart Rate
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Normal</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                {watchData.heartRate} <span className="text-xs font-semibold text-slate-400">BPM</span>
              </div>
              {/* Mini Sparkline SVG */}
              <div className="h-8 w-full mt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                  <path d="M0,20 Q15,10 30,22 T60,8 T90,18 L100,15" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* SpO2 Card */}
          <div className="app-card p-5 flex flex-col justify-between app-card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-500" /> SpO₂ Oxygen
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">Optimal</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                {watchData.spO2}%
              </div>
              <div className="h-8 w-full mt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                  <path d="M0,15 Q25,25 50,12 T80,18 L100,10" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="app-card p-5 flex flex-col justify-between app-card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-500" /> Temperature
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Normal</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                {watchData.temperature}°F
              </div>
              <div className="h-8 w-full mt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                  <path d="M0,18 Q30,8 60,20 T100,14" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* AI Health Score Ring */}
          <div className="app-card p-5 flex items-center justify-between app-card-hover">
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">AI Health Score</span>
              <div className="text-2xl font-extrabold font-heading text-blue-600 dark:text-blue-400">
                85 <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Good • Updated now</span>
            </div>

            {/* Circular Ring Gauge */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100 dark:text-slate-800" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-blue-600" strokeDasharray="85, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <TrendingUp className="w-4 h-4 text-blue-600 absolute" />
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Medicine + AI Companion + Smart Home */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Medicine Schedule Card */}
        <div className="lg:col-span-6 app-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Today's Medicine Schedule</h3>
                  <p className="text-xs text-slate-400">
                    {medicines.filter(m => m.taken).length} of {medicines.length} doses taken
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScreen('medicine')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Schedule →
              </button>
            </div>

            {nextMed ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">DUE AT {nextMed.timeStr}</span>
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white block mt-0.5">{nextMed.name}</span>
                  <span className="text-xs text-slate-500 font-medium">{nextMed.dosage}</span>
                </div>
                <button
                  onClick={() => {
                    toggleMedicineTaken(nextMed.id);
                    speakText(`Marked ${nextMed.name} as taken`);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Taken
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">All medications completed for today! 🎉</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Adherence rate: <strong className="text-slate-900 dark:text-white">92% This Week</strong></span>
            <span className="text-emerald-600 font-semibold">100% Streak Active</span>
          </div>
        </div>

        {/* AI Voice Assistant Quick Launch */}
        <div className="lg:col-span-6 app-card p-6 flex flex-col justify-between bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 dark:from-slate-900 dark:to-slate-900">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">AI Voice Companion</h3>
                <p className="text-xs text-slate-500">Ask health questions or play bhajans hands-free</p>
              </div>
            </div>

            {/* Quick Voice Prompt Pills */}
            <div className="grid grid-cols-2 gap-2 my-3">
              {[
                { label: "What's my health status?", cmd: "Check health status" },
                { label: "Play Hanuman Chalisa", cmd: "Play Hanuman Chalisa" },
                { label: "Remind me medicine", cmd: "Show Medicine" },
                { label: "Call my daughter", cmd: "Call daughter" },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    speakText(p.label);
                    setScreen('companion');
                  }}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold text-left hover:border-indigo-400 transition-colors shadow-2xs truncate"
                >
                  "{p.label}"
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setScreen('companion')}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Mic className="w-4 h-4" /> Open Full AI Assistant
          </button>
        </div>

      </div>

      {/* Row 3: Bhajans & Smart Home Quick Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Spiritual Bhajans */}
        <div className="lg:col-span-6 app-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm sm:text-base">Spiritual Bhajans & Mantras</h3>
            </div>
            <button onClick={() => setScreen('spiritual')} className="text-xs font-semibold text-blue-600 hover:underline">
              Library →
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {SPIRITUAL_PLAYLIST.slice(0, 3).map(track => (
              <div
                key={track.id}
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlayingTrack(true);
                  speakText(`Playing ${track.title}`);
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:bg-amber-50/50 cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{track.title}</h4>
                  <p className="text-[10px] text-slate-400">{track.artist}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Home Quick Switches */}
        <div className="lg:col-span-6 app-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-sm sm:text-base">Smart Home Controls</h3>
            </div>
            <button onClick={() => setScreen('smarthome')} className="text-xs font-semibold text-blue-600 hover:underline">
              All Devices →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const next = !homeSensors.smartLightsOn;
                setHomeSensors(p => ({ ...p, smartLightsOn: next }));
                speakText(next ? "Lights on" : "Lights off");
              }}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                homeSensors.smartLightsOn
                  ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <Sun className="w-6 h-6 text-amber-500" />
              <div>
                <span className="font-bold text-xs block">Room Lights</span>
                <span className="text-[10px] font-semibold">{homeSensors.smartLightsOn ? 'ACTIVE' : 'OFF'}</span>
              </div>
            </button>

            <button
              onClick={() => {
                const next = !homeSensors.smartFanOn;
                setHomeSensors(p => ({ ...p, smartFanOn: next }));
                speakText(next ? "Fan on" : "Fan off");
              }}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                homeSensors.smartFanOn
                  ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-900 dark:text-blue-300'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <Zap className="w-6 h-6 text-blue-500" />
              <div>
                <span className="font-bold text-xs block">Ceiling Fan</span>
                <span className="text-[10px] font-semibold">{homeSensors.smartFanOn ? 'ACTIVE' : 'OFF'}</span>
              </div>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
