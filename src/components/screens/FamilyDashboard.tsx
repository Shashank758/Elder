import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Users, MapPin, Footprints, Heart, Moon, Pill, ArrowLeft, Video, Activity, Thermometer, Droplets, Zap, PhoneCall, AlertTriangle } from 'lucide-react';

export const FamilyDashboard: React.FC = () => {
  const { setScreen, watchData, medicines, setIsSimulatorOpen, speakText } = useEcosystem();

  const familyMembers = [
    { name: 'Devendra', role: 'Grandpa (Monitored)', avatar: '👴', phone: '+91 98765 00000', active: true },
    { name: 'Rahul', role: 'Son (Telegram Guardian)', avatar: '👨', phone: '+91 7597036780', active: false },
    { name: 'Neha', role: 'Daughter (Guardian)', avatar: '👩', phone: '+91 98765 43210', active: false },
    { name: 'Priya', role: 'Caregiver Nurse', avatar: '🩺', phone: '+91 98711 22334', active: false },
  ];

  const hrHigh = watchData.heartRate > 120;
  const bpHigh = (watchData.systolicBp || 120) > 140 || (watchData.diastolicBp || 80) > 90;
  const spo2Low = (watchData.spO2 || 98) < 92;
  const tempHigh = (watchData.temperature || 36.8) > 38.0;

  const hasCriticalVital = hrHigh || bpHigh || spo2Low || tempHigh;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-28 flex flex-col gap-6">

      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" /> Family & Caregiver Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live Senior Telemetry & Automated Emergency SMS Dispatch
            </p>
          </div>
        </div>

        {/* Hackathon Manual Entry Trigger Button */}
        <button
          onClick={() => setIsSimulatorOpen(true)}
          className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">Manual Vitals Entry</span>
        </button>
      </div>

      {/* Active Vital Critical Alert Warning Banner */}
      {hasCriticalVital && (
        <div className="p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.4)] animate-in zoom-in-95 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/50 shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold text-rose-400 uppercase tracking-wider block mb-0.5">
                🚨 CRITICAL VITAL SURGE DETECTED
              </span>
              <h3 className="text-base font-extrabold text-white">
                {hrHigh && `High Heart Rate (${watchData.heartRate} BPM Tachycardia)`}
                {!hrHigh && bpHigh && `High Blood Pressure (${watchData.systolicBp}/${watchData.diastolicBp} mmHg)`}
                {!hrHigh && !bpHigh && spo2Low && `Low Oxygen Level (${watchData.spO2}% SpO₂)`}
                {!hrHigh && !bpHigh && !spo2Low && tempHigh && `High Fever (${watchData.temperature}°C)`}
              </h3>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Automated SMS & Telegram alerts dispatched to Rahul (+91 7597036780) & Neha (+91 98765 43210).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0">
            <a
              href={`sms:7597036780?body=${encodeURIComponent(`🚨 ELDERGUARD EMERGENCY VITAL ALERT\nSenior: Devendra (78y)\nHR: ${watchData.heartRate} BPM | BP: ${watchData.systolicBp}/${watchData.diastolicBp} mmHg\nImmediate check required!`)}`}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>📱 Send SMS</span>
            </a>
            <button
              onClick={() => {
                const text = `🚨 *ELDERGUARD EMERGENCY ALERT*\n\nSenior Devendra's vital sign exceeded critical limit!\nHeart Rate: ${watchData.heartRate} BPM | BP: ${watchData.systolicBp}/${watchData.diastolicBp} mmHg\nLocation: Living Room\nImmediate check required!`;
                window.open(`https://t.me/share/url?url=${encodeURIComponent('http://localhost:5173')}&text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>✈️ Telegram Alert</span>
            </button>
            <button
              onClick={() => {
                speakText("Calling Son Rahul...");
                alert("Calling Son (Rahul +91 98100 12345)...");
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call Guardian
            </button>
          </div>
        </div>
      )}

      {/* Real-time Senior Vital Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Heart Rate */}
        <div className={`p-4 rounded-2xl border transition-all ${
          hrHigh
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 shadow-md animate-pulse'
            : 'app-card'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Heart Rate</span>
            <Heart className={`w-4 h-4 ${hrHigh ? 'text-rose-500 animate-ping' : 'text-rose-500'}`} />
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            {watchData.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
          </div>
          <span className={`text-[10px] font-bold mt-1 block ${hrHigh ? 'text-rose-500' : 'text-emerald-500'}`}>
            {hrHigh ? '⚠️ HIGH (Tachycardia)' : 'Normal (60-100)'}
          </span>
        </div>

        {/* Blood Pressure */}
        <div className={`p-4 rounded-2xl border transition-all ${
          bpHigh
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 shadow-md'
            : 'app-card'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Blood Pressure</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            {watchData.systolicBp}/{watchData.diastolicBp} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className={`text-[10px] font-bold mt-1 block ${bpHigh ? 'text-amber-500' : 'text-emerald-500'}`}>
            {bpHigh ? '⚠️ ELEVATED STAGE 2' : 'Normal (<120/80)'}
          </span>
        </div>

        {/* SpO2 Oxygen */}
        <div className={`p-4 rounded-2xl border transition-all ${
          spo2Low
            ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-900 dark:text-cyan-200 shadow-md'
            : 'app-card'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">SpO₂ Oxygen</span>
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            {watchData.spO2}%
          </div>
          <span className={`text-[10px] font-bold mt-1 block ${spo2Low ? 'text-cyan-400 font-mono' : 'text-emerald-500'}`}>
            {spo2Low ? '⚠️ LOW HYPOXIA' : 'Optimal (95-100%)'}
          </span>
        </div>

        {/* Temperature */}
        <div className={`p-4 rounded-2xl border transition-all ${
          tempHigh
            ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 shadow-md'
            : 'app-card'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Body Temp</span>
            <Thermometer className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            {watchData.temperature}°C
          </div>
          <span className={`text-[10px] font-bold mt-1 block ${tempHigh ? 'text-red-500' : 'text-emerald-500'}`}>
            {tempHigh ? '⚠️ HIGH FEVER' : 'Normal (36.5-37.5°C)'}
          </span>
        </div>
      </div>

      {/* Family Members Avatars & SMS Contact Row */}
      <div className="app-card p-5">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center justify-between">
          <span>Family Guardians & Caregiver Emergency Network</span>
          <span className="text-xs font-mono font-normal text-slate-400">4 Active Contacts</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {familyMembers.map((m, i) => (
            <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-1">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-2xl mb-1 shadow-sm">
                {m.avatar}
              </div>
              <span className="font-bold text-xs text-slate-900 dark:text-white">{m.name}</span>
              <span className="text-[10px] text-slate-400">{m.role}</span>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 mt-1">{m.phone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Location Map Widget */}
      <div className="app-card p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            LIVE GPS TELEMETRY
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" /> Ahmedabad, Gujarat
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">GPS accuracy: High (within 3 meters)</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => alert("Starting HD Video Call with Family...")}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-2xs"
          >
            <Video className="w-4 h-4" /> Video Call
          </button>
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-300" /> Test SMS Alert
          </button>
        </div>
      </div>

      {/* Today's Summary List */}
      <div className="app-card p-6">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-4">
          Senior Health & Activity Summary
        </h3>

        <div className="flex flex-col gap-3">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Footprints className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-xs sm:text-sm">Steps Today</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">4,256 steps</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-500" />
              <span className="font-bold text-xs sm:text-sm">Heart Rate Stream</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{watchData.heartRate} BPM</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-500" />
              <span className="font-bold text-xs sm:text-sm">Sleep Quality</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">7h 30m (Optimal Rest)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Pill className="w-5 h-5 text-cyan-500" />
              <span className="font-bold text-xs sm:text-sm">Medicine Compliance</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {medicines.filter(m => m.taken).length}/{medicines.length} Taken
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
