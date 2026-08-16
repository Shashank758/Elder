import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Activity, Heart, Thermometer, Droplets, Send, X, Zap, CheckCircle2 } from 'lucide-react';

export const VitalSimulatorModal: React.FC = () => {
  const { isSimulatorOpen, setIsSimulatorOpen, watchData, updateVitals, speakText } = useEcosystem();

  const [heartRateInput, setHeartRateInput] = useState<number>(watchData.heartRate || 75);
  const [systolicInput, setSystolicInput] = useState<number>(watchData.systolicBp || 120);
  const [diastolicInput, setDiastolicInput] = useState<number>(watchData.diastolicBp || 80);
  const [spO2Input, setSpO2Input] = useState<number>(watchData.spO2 || 98);
  const [tempInput, setTempInput] = useState<number>(watchData.temperature || 36.8);

  const [successMsg, setSuccessMsg] = useState<string>('');

  const [telegramToken, setTelegramToken] = useState<string>(localStorage.getItem('elderguard_telegram_bot_token') || '');
  const [telegramChatId, setTelegramChatId] = useState<string>(localStorage.getItem('elderguard_telegram_chat_id') || '');
  const [showTelegramConfig, setShowTelegramConfig] = useState<boolean>(false);

  if (!isSimulatorOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (telegramToken) localStorage.setItem('elderguard_telegram_bot_token', telegramToken);
    if (telegramChatId) localStorage.setItem('elderguard_telegram_chat_id', telegramChatId);

    updateVitals({
      heartRate: Number(heartRateInput),
      systolicBp: Number(systolicInput),
      diastolicBp: Number(diastolicInput),
      spO2: Number(spO2Input),
      temperature: Number(tempInput)
    });
    setSuccessMsg('Vitals updated! SMS & Telegram alerts dispatched to family.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const triggerPreset = (scenario: 'HIGH_BP' | 'HIGH_HR' | 'LOW_SPO2' | 'HIGH_TEMP' | 'NORMAL') => {
    switch (scenario) {
      case 'HIGH_BP':
        setSystolicInput(165);
        setDiastolicInput(105);
        setHeartRateInput(95);
        updateVitals({ systolicBp: 165, diastolicBp: 105, heartRate: 95 });
        break;
      case 'HIGH_HR':
        setHeartRateInput(148);
        updateVitals({ heartRate: 148 });
        break;
      case 'LOW_SPO2':
        setSpO2Input(87);
        updateVitals({ spO2: 87 });
        break;
      case 'HIGH_TEMP':
        setTempInput(39.5);
        updateVitals({ temperature: 39.5 });
        break;
      case 'NORMAL':
        setHeartRateInput(72);
        setSystolicInput(120);
        setDiastolicInput(80);
        setSpO2Input(98);
        setTempInput(36.8);
        updateVitals({ heartRate: 72, systolicBp: 120, diastolicBp: 80, spO2: 98, temperature: 36.8 });
        speakText("Vitals reset to normal baseline.");
        break;
    }
    setSuccessMsg(`Preset applied: ${scenario.replace('_', ' ')}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1329] text-white rounded-3xl border border-blue-500/40 p-6 max-w-lg w-full shadow-[0_0_50px_rgba(59,130,246,0.3)] flex flex-col gap-5 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
                Hackathon Manual Vitals Entry
              </h3>
              <p className="text-xs text-slate-400">
                Trigger real-time vital sign surges & instant family SMS alerts
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSimulatorOpen(false)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Feedback Banner */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Quick Hackathon Preset Buttons */}
        <div>
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
            ⚡ Quick Hackathon Trigger Presets:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => triggerPreset('HIGH_BP')}
              className="p-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-left flex flex-col gap-1 transition-all active:scale-95"
            >
              <span className="text-[10px] text-rose-400 font-mono">CRITICAL HIGH</span>
              <span>🚨 High BP (165/105)</span>
            </button>

            <button
              onClick={() => triggerPreset('HIGH_HR')}
              className="p-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-left flex flex-col gap-1 transition-all active:scale-95"
            >
              <span className="text-[10px] text-rose-400 font-mono">TACHYCARDIA</span>
              <span>❤️‍🔥 High HR (148 BPM)</span>
            </button>

            <button
              onClick={() => triggerPreset('LOW_SPO2')}
              className="p-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold text-left flex flex-col gap-1 transition-all active:scale-95"
            >
              <span className="text-[10px] text-amber-400 font-mono">HYPOXIA</span>
              <span>🫁 Low SpO₂ (87%)</span>
            </button>

            <button
              onClick={() => triggerPreset('HIGH_TEMP')}
              className="p-2.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-left flex flex-col gap-1 transition-all active:scale-95"
            >
              <span className="text-[10px] text-red-400 font-mono">HIGH FEVER</span>
              <span>🌡️ High Temp (39.5°C)</span>
            </button>

            <button
              onClick={() => triggerPreset('NORMAL')}
              className="p-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-left flex flex-col gap-1 col-span-2 sm:col-span-2 transition-all active:scale-95"
            >
              <span className="text-[10px] text-emerald-400 font-mono">NORMAL BASELINE</span>
              <span>✅ Reset All Vitals to Normal (72 BPM, 120/80)</span>
            </button>
          </div>
        </div>

        {/* Manual Data Entry Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-t border-slate-800 pt-3">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            📝 Manual Vital Value Entry:
          </span>

          <div className="grid grid-cols-2 gap-3 text-xs">
            
            {/* Heart Rate */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <Heart className="w-3.5 h-3.5" /> Heart Rate
                </span>
                <span className="font-mono text-[10px] text-slate-500">BPM</span>
              </label>
              <input
                type="number"
                value={heartRateInput}
                onChange={(e) => setHeartRateInput(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-rose-500 outline-none"
                placeholder="e.g. 145"
              />
            </div>

            {/* Blood Pressure Systolic */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Activity className="w-3.5 h-3.5" /> BP Systolic
                </span>
                <span className="font-mono text-[10px] text-slate-500">mmHg</span>
              </label>
              <input
                type="number"
                value={systolicInput}
                onChange={(e) => setSystolicInput(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-amber-500 outline-none"
                placeholder="e.g. 165"
              />
            </div>

            {/* Blood Pressure Diastolic */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Activity className="w-3.5 h-3.5" /> BP Diastolic
                </span>
                <span className="font-mono text-[10px] text-slate-500">mmHg</span>
              </label>
              <input
                type="number"
                value={diastolicInput}
                onChange={(e) => setDiastolicInput(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-amber-500 outline-none"
                placeholder="e.g. 105"
              />
            </div>

            {/* SpO2 Oxygen */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Droplets className="w-3.5 h-3.5" /> SpO₂ Oxygen
                </span>
                <span className="font-mono text-[10px] text-slate-500">%</span>
              </label>
              <input
                type="number"
                value={spO2Input}
                onChange={(e) => setSpO2Input(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-cyan-500 outline-none"
                placeholder="e.g. 88"
              />
            </div>

            {/* Temperature */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1.5 col-span-2">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-red-400">
                  <Thermometer className="w-3.5 h-3.5" /> Body Temperature
                </span>
                <span className="font-mono text-[10px] text-slate-500">°C</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={tempInput}
                onChange={(e) => setTempInput(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-red-500 outline-none"
                placeholder="e.g. 39.2"
              />
            </div>

          </div>

          {/* Optional Telegram Bot Integration Settings Accordion */}
          <div className="border-t border-slate-800 pt-2">
            <button
              type="button"
              onClick={() => setShowTelegramConfig(!showTelegramConfig)}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 mb-2 font-mono"
            >
              <span>✈️ {showTelegramConfig ? 'Hide' : 'Configure'} Live Telegram Bot API (Optional)</span>
            </button>

            {showTelegramConfig && (
              <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex flex-col gap-2.5 text-xs animate-in fade-in duration-200">
                <div>
                  <label className="text-[10px] font-mono text-sky-300 font-bold block mb-1">Telegram Bot Token (from @BotFather):</label>
                  <input
                    type="text"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    placeholder="e.g. 7524912984:AAH3k891..."
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-sky-500/40 text-white font-mono text-xs focus:border-sky-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-sky-300 font-bold block mb-1">Telegram User / Group Chat ID:</label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="e.g. 591238412"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-sky-500/40 text-white font-mono text-xs focus:border-sky-400 outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Leave blank to use direct 1-click Telegram Web Dispatch link for instant presentation demo!
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsSimulatorOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" /> Send Vitals, SMS & Telegram Alert
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
