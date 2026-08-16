import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { MessageSquare, AlertTriangle, PhoneCall, X, Heart, Activity, Thermometer, UserCheck } from 'lucide-react';

export const SmsAlertBanner: React.FC = () => {
  const { latestSmsAlert, dismissSmsAlert, setScreen, speakText } = useEcosystem();

  if (!latestSmsAlert) return null;

  const getIcon = () => {
    switch (latestSmsAlert.type) {
      case 'HIGH_HR':
        return <Heart className="w-6 h-6 text-rose-500 animate-pulse" />;
      case 'HIGH_BP':
        return <Activity className="w-6 h-6 text-amber-500 animate-bounce" />;
      case 'HIGH_TEMP':
        return <Thermometer className="w-6 h-6 text-red-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-rose-500" />;
    }
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-xl animate-in slide-in-from-top-6 duration-300">
      <div className="bg-[#0f172a] text-white rounded-2xl border-2 border-rose-500/80 p-4 shadow-[0_10px_40px_rgba(244,63,94,0.45)] backdrop-blur-xl flex flex-col gap-3">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-rose-500/30 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <MessageSquare className="w-4 h-4 animate-bounce" />
            </div>
            <span className="font-mono text-xs font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              CRITICAL SMS ALERT SENT TO FAMILY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">
              {latestSmsAlert.timestamp}
            </span>
            <button
              onClick={dismissSmsAlert}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vital Signal & Recipient Details */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 shrink-0">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                {latestSmsAlert.vitalName}
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold border border-rose-500/40">
                {latestSmsAlert.vitalValue}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {latestSmsAlert.message}
            </p>

            <div className="mt-2 text-[11px] font-mono text-cyan-300/90 flex items-center gap-1.5 bg-cyan-950/50 p-2 rounded-lg border border-cyan-500/30">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">
                SMS Delivered to: <strong className="text-white">{latestSmsAlert.recipient}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => {
              setScreen('family');
              dismissSmsAlert();
            }}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Open Family Dashboard ›
          </button>
          
          <button
            onClick={() => {
              speakText("Calling emergency guardian Amit...");
              alert("Calling Son (Amit +91 98100 12345)...");
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-1 transition-all active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call Son (+91 98100 12345)
          </button>

          <button
            onClick={dismissSmsAlert}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            Acknowledge
          </button>
        </div>

      </div>
    </div>
  );
};
