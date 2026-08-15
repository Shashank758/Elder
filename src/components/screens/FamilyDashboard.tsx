import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Users, MapPin, Footprints, Heart, Moon, Pill, ArrowLeft, Settings, Video } from 'lucide-react';

export const FamilyDashboard: React.FC = () => {
  const { setScreen, watchData, medicines } = useEcosystem();

  const familyMembers = [
    { name: 'Grandpa', role: 'You', avatar: '👴', active: true },
    { name: 'Neha', role: 'Daughter', avatar: '👩', active: false },
    { name: 'Amit', role: 'Son', avatar: '👨', active: false },
    { name: 'Priya', role: 'Caregiver', avatar: '🩺', active: false },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-24 flex flex-col gap-6">

      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" /> Family Dashboard
          </h1>
        </div>

        <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Family Members Avatars Row */}
      <div className="flex items-center justify-around gap-2 p-4 app-card">
        {familyMembers.map((m, i) => (
          <div key={i} className="flex flex-col items-center text-center cursor-pointer group">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1.5 transition-all ${
              m.active
                ? 'bg-blue-50 dark:bg-blue-500/20 ring-2 ring-blue-500 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 hover:scale-105'
            }`}>
              {m.avatar}
            </div>
            <span className="font-bold text-xs text-slate-900 dark:text-white">{m.name}</span>
            <span className="text-[10px] text-slate-400">({m.role})</span>
          </div>
        ))}
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
            onClick={() => alert("Showing live location map...")}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            View Live
          </button>
        </div>
      </div>

      {/* Today's Summary List */}
      <div className="app-card p-6">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-4">
          Today's Summary
        </h3>

        <div className="flex flex-col gap-3">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Footprints className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-xs sm:text-sm">Steps</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">4,256 steps ›</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-500" />
              <span className="font-bold text-xs sm:text-sm">Heart Rate</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{watchData.heartRate} BPM ›</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-500" />
              <span className="font-bold text-xs sm:text-sm">Sleep Quality</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">7h 30m ›</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Pill className="w-5 h-5 text-cyan-500" />
              <span className="font-bold text-xs sm:text-sm">Medicine</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {medicines.filter(m => m.taken).length}/{medicines.length} Taken ›
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
