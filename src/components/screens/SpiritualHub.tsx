import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { SPIRITUAL_PLAYLIST } from '../../data/playlist';
import { Sparkles, Play, Pause, Flame, BookOpen, Bell, Heart, ArrowLeft } from 'lucide-react';

export const SpiritualHub: React.FC = () => {
  const { setScreen, currentTrack, setCurrentTrack, isPlayingTrack, setIsPlayingTrack, speakText } = useEcosystem();
  const [activeCategory, setActiveCategory] = useState('bhajans');

  const categories = [
    { id: 'bhajans', label: 'Bhajans', icon: <Flame className="w-5 h-5 text-amber-500" /> },
    { id: 'mantras', label: 'Mantras', icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
    { id: 'meditation', label: 'Meditation', icon: <Heart className="w-5 h-5 text-emerald-500" /> },
    { id: 'stories', label: 'Stories', icon: <BookOpen className="w-5 h-5 text-blue-500" /> },
    { id: 'aarti', label: 'Aarti', icon: <Bell className="w-5 h-5 text-rose-500" /> },
  ];

  const featuredTrack = SPIRITUAL_PLAYLIST[0];

  const playTrack = (track: typeof SPIRITUAL_PLAYLIST[0]) => {
    setCurrentTrack(track);
    setIsPlayingTrack(true);
    speakText(`Now playing ${track.title}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-32 flex flex-col gap-6">

      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          Spiritual Companion
        </h1>
        <div className="w-9" />
      </div>

      {/* Featured Banner Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 sm:p-8 flex flex-col justify-end min-h-[180px]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md mb-2 inline-block">
            FEATURED DEVOTIONAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">{featuredTrack.title}</h2>
          <p className="text-xs text-amber-100 mt-0.5">{featuredTrack.artist}</p>

          <button
            onClick={() => playTrack(featuredTrack)}
            className="mt-4 px-6 py-2.5 rounded-2xl bg-white text-amber-700 font-extrabold text-xs shadow-md flex items-center gap-2 active:scale-95 transition-all w-fit"
          >
            <Play className="w-4 h-4 fill-amber-700" /> Play Now
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Categories</h3>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                activeCategory === c.id
                  ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-400 text-amber-900 dark:text-amber-300 ring-2 ring-amber-400/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {c.icon}
              <span className="text-[11px] font-semibold">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recently Played Playlist */}
      <div className="app-card p-6">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-4">
          Recently Played
        </h3>

        <div className="flex flex-col gap-2">
          {SPIRITUAL_PLAYLIST.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 text-amber-900 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    🕉️
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{track.title}</h4>
                    <p className="text-[10px] text-slate-400">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{track.duration}</span>
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                    {isCurrent && isPlayingTrack ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Audio Player Bar */}
      {currentTrack && (
        <div className="fixed bottom-16 lg:bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] app-card p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-400/50 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              🕉️
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{currentTrack.title}</h4>
              <p className="text-[10px] text-slate-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlayingTrack(!isPlayingTrack)}
              className="p-2.5 rounded-full bg-amber-500 text-white shadow-md active:scale-95 transition-all"
            >
              {isPlayingTrack ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
