import React, { Suspense, lazy, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SmartWatch3DCanvas = lazy(() => import('./SmartWatch3DCanvas'));

interface SmartWatch3DProps {
  pitch: number;
  roll: number;
  yaw: number;
  heartRate: number;
  spO2: number;
  battery: number;
  activity: string;
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// Fallback CSS-based 3D watch for devices without WebGL support
const SmartWatchCSSFallback: React.FC<SmartWatch3DProps> = ({
  pitch,
  roll,
  yaw,
  heartRate,
  spO2,
  battery,
  activity
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div 
        className="relative transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          transform: `rotateX(${pitch}deg) rotateY(${roll}deg) rotateZ(${yaw * 0.2}deg)`
        }}
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-24 h-28 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-t-2xl border-t-2 border-slate-700 shadow-xl" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-24 h-28 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 rounded-b-2xl border-b-2 border-slate-700 shadow-xl" />

        <div className="relative w-52 h-64 rounded-[36px] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] border border-slate-700/80">
          <div className="absolute -right-3 top-16 w-3 h-10 bg-gradient-to-r from-cyan-600 to-slate-700 rounded-r-md border border-cyan-400/40 shadow-lg" />
          <div className="relative w-full h-full rounded-[28px] bg-black p-3 flex flex-col justify-between overflow-hidden border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-cyan-400 font-bold">ElderGuard</span>
              <span className="text-emerald-400 font-bold">{battery}% 🔋</span>
            </div>

            <div className="flex flex-col items-center justify-center my-auto text-center gap-1.5">
              <div className="text-3xl font-extrabold text-white tracking-tight">
                09:42 <span className="text-xs font-medium text-slate-400">AM</span>
              </div>

              <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
                <motion.span 
                  animate={{ scale: [1, 1.25, 1] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="text-red-400 text-sm"
                >
                  ❤️
                </motion.span>
                <span className="text-sm font-bold text-red-300 font-mono">{heartRate} BPM</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono mt-1 text-slate-300">
                <span className="text-cyan-300">SpO₂ {spO2}%</span>
                <span className="text-amber-300">{activity}</span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-blue-500" 
                animate={{ width: ['20%', '90%', '40%', '80%'] }} 
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SmartWatch3D: React.FC<SmartWatch3DProps> = (props) => {
  const { pitch, roll, yaw } = props;
  const [webGLAvailable, setWebGLAvailable] = useState<boolean>(true);

  useEffect(() => {
    setWebGLAvailable(checkWebGLSupport());
  }, []);

  return (
    <div className="relative w-full h-[340px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/95 border border-cyan-500/20 shadow-2xl backdrop-blur-xl">
      {/* Background Ambient Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Axis Vector Overlay Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 text-[11px] font-mono text-cyan-400/90 bg-slate-900/90 px-3 py-2 rounded-lg border border-cyan-500/30 z-10 backdrop-blur-md shadow-lg">
        <span>PITCH (X): {pitch.toFixed(1)}°</span>
        <span>ROLL (Y): {roll.toFixed(1)}°</span>
        <span>YAW (Z): {yaw.toFixed(1)}°</span>
      </div>

      {/* Live Stream Sensor Status Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 z-10 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        ESP32 MPU6050 Live WebGL Stream
      </div>

      {/* 3D WebGL Canvas with Suspense & Fallback */}
      {webGLAvailable ? (
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center gap-3 text-cyan-400 font-mono text-xs">
              <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <span>Loading WebGL 3D Watch Model...</span>
            </div>
          }
        >
          <SmartWatch3DCanvas {...props} />
        </Suspense>
      ) : (
        <SmartWatchCSSFallback {...props} />
      )}

      {/* Footer Orientation Summary */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-slate-400 font-mono bg-slate-900/90 px-4 py-1 rounded-full border border-slate-800 backdrop-blur-md z-10">
        Hardware Sensor: ESP32 MAX30102 + MPU6050 + MLX90614
      </div>
    </div>
  );
};
