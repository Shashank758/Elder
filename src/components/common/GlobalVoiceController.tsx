import React, { useState, useEffect } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Mic, MicOff, X, Play } from 'lucide-react';

export const GlobalVoiceController: React.FC = () => {
  const {
    executeVoiceCommand, isGlobalVoiceListening, setIsGlobalVoiceListening,
    lastVoiceResponse, showVoiceGuide, setShowVoiceGuide, language
  } = useEcosystem();

  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      rec.onstart = () => setIsGlobalVoiceListening(true);
      rec.onresult = (e: any) => {
        setIsGlobalVoiceListening(false);
        executeVoiceCommand(e.results[0][0].transcript);
      };
      rec.onerror = () => setIsGlobalVoiceListening(false);
      rec.onend = () => setIsGlobalVoiceListening(false);
      setRecognition(rec);
    }
  }, [language]);

  const toggle = () => {
    if (!recognition) return;
    if (isGlobalVoiceListening) { recognition.stop(); }
    else { try { recognition.start(); } catch {} }
  };

  const commands = [
    { label: 'Go Home', cmd: 'Go Home' },
    { label: 'My Medicines', cmd: 'Show Medicine' },
    { label: 'Mark Pill Taken', cmd: 'Take Medicine' },
    { label: 'Play Hanuman Chalisa', cmd: 'Play Hanuman Chalisa' },
    { label: 'Play Gayatri Mantra', cmd: 'Play Gayatri Mantra' },
    { label: 'Turn On Lights', cmd: 'Turn on Lights' },
    { label: 'Turn Off Lights', cmd: 'Lights off' },
    { label: 'Check Heart Rate', cmd: 'Check Heart Rate' },
    { label: 'Emergency SOS', cmd: 'SOS Emergency' },
  ];

  return (
    <>
      {/* Voice response toast */}
      {lastVoiceResponse && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-lg text-sm font-medium text-center">
          {lastVoiceResponse}
        </div>
      )}

      {/* Floating mic button */}
      <button
        onClick={toggle}
        className={`fixed bottom-20 lg:bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all ${
          isGlobalVoiceListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isGlobalVoiceListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {/* Voice guide modal */}
      {showVoiceGuide && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowVoiceGuide(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">Voice Commands</h3>
              <button onClick={() => setShowVoiceGuide(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {commands.map((c, i) => (
                <button
                  key={i}
                  onClick={() => { executeVoiceCommand(c.cmd); setShowVoiceGuide(false); }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-left transition-colors"
                >
                  <span>{c.label}</span>
                  <Play className="w-3.5 h-3.5 text-blue-500" />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
