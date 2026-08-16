import React, { useState, useEffect } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { ShieldAlert, Phone, CheckCircle2, Video, Heart, Droplets, MapPin, AlertTriangle } from 'lucide-react';

export const FallDetectionModal: React.FC = () => {
  const { fallAlertActive, dismissFallAlert, watchData, homeSensors, speakText } = useEcosystem();
  const [countdown, setCountdown] = useState(25);

  const isHubEmergency = homeSensors.emergency || homeSensors.sosActive || homeSensors.sosAlert;
  const isWatchSos = watchData.sos;

  useEffect(() => {
    let timer: any;
    if (fallAlertActive) {
      setCountdown(25);
      if (isHubEmergency) {
        speakText("Emergency SOS button pressed on Smart Home Hub! Auto-calling guardians in 25 seconds.");
      } else if (isWatchSos) {
        speakText("Emergency SOS button pressed on Smart Watch! Auto-calling guardians in 25 seconds.");
      } else {
        speakText("Emergency Fall detected! Auto-calling guardians in 25 seconds.");
      }

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            alert("Emergency dispatch & guardians notified!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [fallAlertActive, isHubEmergency, isWatchSos]);

  if (!fallAlertActive) return null;

  const alertTitle = isHubEmergency
    ? "Smart Hub SOS Alert!"
    : isWatchSos
    ? "Smartwatch SOS Alert!"
    : "Fall Detected";

  const alertDesc = isHubEmergency
    ? "Emergency distress button pressed on Home Hub"
    : isWatchSos
    ? "Emergency SOS button pressed on Watch"
    : "Possible hard fall detected by MPU6050";

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#110507] text-white rounded-3xl border border-rose-500/40 p-6 sm:p-8 max-w-md w-full shadow-[0_0_60px_rgba(244,63,94,0.4)] flex flex-col gap-6 animate-in zoom-in-95">

        {/* Fall / SOS Icon Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-500 mb-3 animate-bounce">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-extrabold font-heading text-rose-400">
            {alertTitle}
          </h2>
          <p className="text-xs text-rose-200/80 mt-0.5">
            {alertDesc} • {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/20">
            <span className="text-slate-400 text-[10px] block">IMPACT LEVEL</span>
            <span className="text-rose-400 font-bold text-sm">High G-Impact</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/20">
            <span className="text-slate-400 text-[10px] block">BODY POSITION</span>
            <span className="text-amber-400 font-bold text-sm">Face Down</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/20 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] block">HEART RATE</span>
              <span className="text-white font-bold">{watchData.heartRate} BPM</span>
            </div>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>

          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/20 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] block">SPO₂ OXYGEN</span>
              <span className="text-white font-bold">{watchData.spO2}%</span>
            </div>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        {/* Location Row */}
        <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/20 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <div>
              <span className="text-slate-400 text-[10px] block">LOCATION</span>
              <span className="text-white font-bold">Living Room • Home</span>
            </div>
          </div>
          <span className="text-emerald-400 font-bold text-[10px]">GPS HIGH</span>
        </div>

        {/* Countdown Timer Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-rose-300 mb-1.5">
            <span>Are you OK? Auto-calling in</span>
            <span className="text-sm font-mono text-white">{countdown} SEC</span>
          </div>
          <div className="w-full h-2.5 bg-rose-950 rounded-full overflow-hidden border border-rose-500/30">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-1000"
              style={{ width: `${(countdown / 25) * 100}%` }}
            />
          </div>
        </div>

        {/* 3 Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              dismissFallAlert();
              speakText("Fall alert cancelled. I am safe.");
            }}
            className="py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-md active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>I'm Safe</span>
          </button>

          <button
            onClick={() => {
              alert("Calling Primary Guardian (Son)...");
              dismissFallAlert();
            }}
            className="py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-md active:scale-95 transition-all"
          >
            <Phone className="w-5 h-5" />
            <span>Call Family</span>
          </button>

          <button
            onClick={() => {
              alert("Calling Ambulance & Emergency Dispatch!");
              dismissFallAlert();
            }}
            className="py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-md active:scale-95 transition-all"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>Call 108</span>
          </button>
        </div>

        {/* Video Stream Button */}
        <button
          onClick={() => alert("Initiating Live Video Feed...")}
          className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-2"
        >
          <Video className="w-4 h-4 text-purple-400" /> Start Live Video
        </button>

      </div>
    </div>
  );
};
