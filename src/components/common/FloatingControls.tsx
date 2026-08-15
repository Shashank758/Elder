import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Bot, ShieldAlert } from 'lucide-react';

export const FloatingControls: React.FC = () => {
  const { setScreen, triggerFallAlert } = useEcosystem();

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5 sm:gap-3 pointer-events-none">
      
      {/* Floating Emergency SOS Button */}
      <button
        onClick={triggerFallAlert}
        className="pointer-events-auto flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] border-2 border-red-300 hover:scale-110 active:scale-95 transition-all group"
        title="Trigger Emergency SOS"
      >
        <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-bounce" />
        <span className="absolute -top-8 bg-slate-900 text-red-300 text-[10px] font-mono px-2 py-0.5 rounded border border-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity">
          SOS ALERT
        </span>
      </button>

      {/* Floating AI Companion Launcher */}
      <button
        onClick={() => setScreen('companion')}
        className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-cyan-300/50 hover:scale-105 active:scale-95 transition-all"
        title="Talk to ElderGuard AI Voice Companion"
      >
        <div className="relative">
          <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="font-bold text-xs sm:text-sm font-heading hidden sm:inline">
          ElderGuard AI
        </span>
      </button>
    </div>
  );
};
