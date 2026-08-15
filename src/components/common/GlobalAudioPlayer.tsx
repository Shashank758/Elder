import React, { useEffect, useRef, useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { SPIRITUAL_PLAYLIST } from '../../data/playlist';
import { Play, Pause, Volume2, VolumeX, Music, X, Sparkles, ExternalLink } from 'lucide-react';

export const GlobalAudioPlayer: React.FC = () => {
  const { currentTrack, setCurrentTrack, isPlayingTrack, setIsPlayingTrack, setScreen } = useEcosystem();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Initialize track to first default if not set
  const activeTrack = currentTrack || SPIRITUAL_PLAYLIST[0];

  // Sync state with HTML5 Audio Element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingTrack) {
      if (activeTrack.audioUrl) {
        audio.src = activeTrack.audioUrl;
        audio.play().catch((err) => {
          console.warn('Audio stream autoplay policy or load error:', err);
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [isPlayingTrack, activeTrack.id]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedData = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      // Auto play next track in playlist
      const currentIndex = SPIRITUAL_PLAYLIST.findIndex(t => t.id === activeTrack.id);
      const nextTrack = SPIRITUAL_PLAYLIST[(currentIndex + 1) % SPIRITUAL_PLAYLIST.length];
      setCurrentTrack(nextTrack);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeTrack.id]);

  const togglePlayPause = () => {
    setIsPlayingTrack(!isPlayingTrack);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !secs) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isPlayingTrack && !currentTrack) return null;

  return (
    <>
      {/* Hidden HTML5 Audio Element with direct CORS enabled */}
      <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />

      {/* Floating Bottom Audio Dock Banner */}
      <div 
        className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
          minimized ? 'w-auto' : 'w-80 sm:w-96'
        }`}
      >
        <div className="glass-panel p-4 rounded-3xl border border-amber-500/30 shadow-[0_10px_40px_rgba(245,158,11,0.25)] bg-slate-950/95 backdrop-blur-xl text-white">
          
          {minimized ? (
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg"
              >
                {isPlayingTrack ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
              </button>
              
              <div 
                onClick={() => setMinimized(false)}
                className="cursor-pointer pr-2 flex items-center gap-2"
              >
                <Music className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="text-xs font-bold font-heading line-clamp-1 max-w-[140px]">
                  {activeTrack.title}
                </span>
              </div>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>DEVOTIONAL AUDIO PLAYER</span>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setMinimized(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                    title="Minimize player"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Track Metadata */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-lg relative overflow-hidden">
                  <Music className="w-6 h-6" />
                  {isPlayingTrack && (
                    <div className="absolute inset-0 bg-amber-400/20 animate-pulse" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold font-heading text-white line-clamp-1">
                    {activeTrack.title}
                  </h4>
                  <p className="text-[11px] font-mono text-amber-300/80 line-clamp-1">
                    {activeTrack.artist}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="my-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{activeTrack.duration}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : isPlayingTrack ? 45 : 0}%` }}
                  />
                </div>
              </div>

              {/* Player Control Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    setScreen('spiritual');
                    setMinimized(true);
                  }}
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> View Verses
                </button>

                <div className="flex items-center gap-3">
                  <button onClick={toggleMute} className="text-slate-400 hover:text-white p-1">
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95"
                  >
                    {isPlayingTrack ? (
                      <Pause className="w-5 h-5 fill-slate-950" />
                    ) : (
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
};
