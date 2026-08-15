import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Bot, Mic, Volume2, ArrowLeft, Send, Sparkles } from 'lucide-react';

export const AIVoiceCompanion: React.FC = () => {
  const {
    setScreen, executeVoiceCommand, isGlobalVoiceListening,
    setIsGlobalVoiceListening, lastVoiceResponse,
    speakText, currentUser
  } = useEcosystem();

  const [inputMsg, setInputMsg] = useState('');

  const quickPrompts = [
    { text: "I'm feeling good", cmd: "I am feeling good today" },
    { text: "What's my health status?", cmd: "Check my health status" },
    { text: "Play Hanuman Chalisa", cmd: "Play Hanuman Chalisa" },
    { text: "Remind me medicine", cmd: "Show Medicine schedule" },
    { text: "Call my daughter", cmd: "Call daughter" }
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    executeVoiceCommand(text);
    setInputMsg('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full pb-24 flex flex-col gap-6">

      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold font-heading">AI Companion</h1>
        <div className="w-9" />
      </div>

      {/* Robot Hero Avatar Card */}
      <div className="app-card p-6 flex flex-col items-center text-center bg-gradient-to-b from-blue-50/60 to-white dark:from-slate-900 dark:to-slate-900">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-1 shadow-lg shadow-blue-500/20 mb-4 animate-float">
          <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[20px] flex items-center justify-center">
            <Bot className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          Hello {currentUser?.name || 'Devendra'}! 👋
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          I'm here to help you. How are you feeling today?
        </p>
      </div>

      {/* Spoken Response Box if active */}
      {lastVoiceResponse && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-medium text-blue-900 dark:text-blue-300 flex items-start gap-3">
          <Volume2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[10px] text-blue-600 block uppercase mb-0.5">Voice Reply:</span>
            <span>{lastVoiceResponse}</span>
          </div>
        </div>
      )}

      {/* Quick Action Pills */}
      <div className="flex flex-col gap-2">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp.cmd)}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-200 text-xs font-semibold text-left transition-all shadow-2xs flex items-center justify-between"
          >
            <span>{qp.text}</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          </button>
        ))}
      </div>

      {/* Bottom Microphone Button & Input */}
      <div className="flex flex-col items-center gap-4 mt-2">
        <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(inputMsg)}
            placeholder="Type your health question..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            onClick={() => handleSend(inputMsg)}
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Large Mic Trigger */}
        <button
          onClick={() => {
            setIsGlobalVoiceListening(!isGlobalVoiceListening);
            speakText("Listening for your voice command");
          }}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
            isGlobalVoiceListening
              ? 'bg-rose-500 animate-bounce'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
          }`}
        >
          <Mic className="w-7 h-7" />
        </button>
        <span className="text-[11px] font-semibold text-slate-400">
          {isGlobalVoiceListening ? 'Listening...' : 'Tap to speak'}
        </span>
      </div>

    </div>
  );
};
