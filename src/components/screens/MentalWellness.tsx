import React, { useState, useEffect } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Smile, BrainCircuit, Wind, Image, RotateCw, Volume2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const MentalWellness: React.FC = () => {
  const { setScreen } = useEcosystem();
  const [selectedMood, setSelectedMood] = useState<string>('Happy & Peaceful');
  const [journalNote, setJournalNote] = useState('');
  const [moodSaved, setMoodSaved] = useState(false);

  // Breathing Exercise State
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // Memory Card Matching Game State
  const memoryCardsInitial = [
    { id: 1, symbol: '🌸', matched: false, flipped: false },
    { id: 2, symbol: '🌸', matched: false, flipped: false },
    { id: 3, symbol: '🪔', matched: false, flipped: false },
    { id: 4, symbol: '🪔', matched: false, flipped: false },
    { id: 5, symbol: '🦚', matched: false, flipped: false },
    { id: 6, symbol: '🦚', matched: false, flipped: false },
    { id: 7, symbol: '🕉️', matched: false, flipped: false },
    { id: 8, symbol: '🕉️', matched: false, flipped: false },
  ];

  const [cards, setCards] = useState(memoryCardsInitial);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  // Breathing Cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setBreathTimer(prev => {
        if (prev <= 1) {
          setBreathState(curr => (curr === 'Inhale' ? 'Hold' : curr === 'Hold' ? 'Exhale' : 'Inhale'));
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Card Flip Logic
  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (newCards[first].symbol === newCards[second].symbol) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedCards([]);
        setScore(s => s + 10);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(memoryCardsInitial.map(c => ({ ...c, matched: false, flipped: false })));
    setFlippedCards([]);
    setScore(0);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-purple-500" /> Mental Wellness & Brain Training
            </h1>
            <p className="text-xs text-slate-500">Memory games, guided breathwork & daily mood logging</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 font-mono text-xs font-bold">
          Daily Score: 88/100
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Memory Game & Guided Breathing */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Brain Training Memory Card Game */}
          <div className="app-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-cyan-500" />
                <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">Memory Card Matching</h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">Score: {score}</span>
                <button onClick={resetGame} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200">
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-4 gap-3 my-2">
              {cards.map((c, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  className={`h-20 rounded-2xl border flex items-center justify-center text-2xl cursor-pointer transition-all ${
                    c.flipped || c.matched
                      ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-400 text-slate-900 dark:text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-transparent hover:bg-slate-200'
                  }`}
                >
                  {c.flipped || c.matched ? c.symbol : '❓'}
                </div>
              ))}
            </div>
          </div>

          {/* Guided Breathing Exercises */}
          <div className="app-card p-6 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-600 dark:text-purple-400 mb-2">
              <Wind className="w-4 h-4 text-purple-500" />
              <span>4-4-4 Pranayama Breath Guide</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-4">Deep Breathing Exercise</h3>

            {/* Expanding Circle Animation */}
            <div className="relative w-36 h-36 flex items-center justify-center my-4">
              <motion.div
                animate={{ scale: breathState === 'Inhale' ? [1, 1.4] : breathState === 'Exhale' ? [1.4, 1] : 1.4 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border-2 border-purple-300/50 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex items-center justify-center text-white font-extrabold font-heading text-lg"
              >
                {breathState}
              </motion.div>
            </div>
            <span className="text-sm font-mono font-bold text-purple-600 dark:text-purple-300">{breathTimer} Seconds</span>
          </div>

        </div>

        {/* Right Column: Mood Journal & Photo Memories */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Mood Journal */}
          <div className="app-card p-6">
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Smile className="w-5 h-5 text-amber-500" />
              Daily Senior Mood Journal
            </h3>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {['Happy & Peaceful', 'Calm', 'Feeling Tired', 'Anxious', 'Slightly Sad'].map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedMood === m
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Write a gratitude note or how you feel today..."
              value={journalNote}
              onChange={e => setJournalNote(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
            />

            <button
              onClick={() => setMoodSaved(true)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md"
            >
              {moodSaved ? 'Saved to Health Record ✓' : 'Save Mood Entry'}
            </button>
          </div>

          {/* Photo Memories Gallery */}
          <div className="app-card p-6">
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-emerald-500" />
              Family Photo Memories
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div className="w-full h-24 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-3xl">
                  👨‍👩‍👦
                </div>
                <div className="mt-2 font-bold text-xs text-slate-900 dark:text-white">Aarav's Birthday</div>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <Volume2 className="w-3 h-3" /> Voice Note (0:45)
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div className="w-full h-24 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-700 flex items-center justify-center text-3xl">
                  🏛️
                </div>
                <div className="mt-2 font-bold text-xs text-slate-900 dark:text-white">Shirdi Temple Trip</div>
                <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                  <Volume2 className="w-3 h-3" /> Voice Note (1:12)
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
