import React, { Suspense, lazy, useRef, useState, useEffect } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import {
  Activity,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Pill,
  Users,
  Sparkles,
  Heart,
  ChevronDown,
  Lock,
  Stethoscope,
  Bell
} from 'lucide-react';
import { motion, useScroll } from 'framer-motion';

const LandingHeroCanvas = lazy(() => import('../3d/LandingHeroCanvas'));

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

export const SplashScreen: React.FC = () => {
  const { setScreen } = useEcosystem();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  const { scrollYProgress } = useScroll({
    container: containerRef
  });

  useEffect(() => {
    setWebGLAvailable(checkWebGLSupport());

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  const scrollToFeatures = () => {
    if (containerRef.current) {
      const featuresEl = document.getElementById('features-section');
      featuresEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-y-auto bg-[#050811] text-slate-100 selection:bg-cyan-500 selection:text-white scroll-smooth"
    >
      {/* Fixed Background 3D WebGL Scene & Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Radial ambient lighting layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(6,182,212,0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:32px_32px]" />

        {webGLAvailable && (
          <Suspense fallback={null}>
            <LandingHeroCanvas scrollProgress={scrollProgress} />
          </Suspense>
        )}
      </div>

      {/* Floating Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050811]/80 border-b border-cyan-500/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-extrabold font-heading tracking-tight text-white block leading-none">
                ElderGuard <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80">ECOSYSTEM OS</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            ESP32 Biosensors Online
          </div>

          <button
            onClick={() => setScreen('login')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            Launch System Portal <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[90vh] flex flex-col justify-center items-center text-center px-6 py-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Hardware Sensor Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-8 backdrop-blur-md shadow-lg">
            <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>ESP32 MPU6050 + MAX30102 Continuous Monitoring</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-tight text-white mb-6 leading-tight">
            Autonomous Elder Care &{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent">
              Medical Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl font-normal leading-relaxed mb-10">
            Real-time 6-DOF motion kinematics, instant AI fall detection, smart home environment protection, and multi-role guardian coverage for families and doctors.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setScreen('login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-base shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              Enter System Portal <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 font-bold text-base hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            >
              Explore Platform Features <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>

          {/* Live Telemetry Diagnostic Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-16 p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">HEART RATE</span>
              <span className="text-emerald-400 font-bold text-base mt-0.5">74 BPM</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">FALL RISK INDEX</span>
              <span className="text-cyan-400 font-bold text-base mt-0.5">12% (Optimal)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">SMART HOME SENSORS</span>
              <span className="text-emerald-400 font-bold text-base mt-0.5">All Systems Safe</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">AI COMPANION</span>
              <span className="text-indigo-400 font-bold text-base mt-0.5">7 Languages Active</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Value Propositions / Content Sections */}
      <section id="features-section" className="relative z-10 py-24 px-6 max-w-6xl mx-auto space-y-24">

        {/* Section 1: AI Fall Detection */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/20 shadow-2xl bg-slate-950/80 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-2">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-cyan-400 tracking-wider block">01 / KINEMATIC INTEGRITY</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
              Instant 6-DOF Fall Detection & Impact Verification
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Custom ESP32 smartwatch firmware streams accelerometer & gyroscopic vectors at 100Hz. Our neural model detects high-G impacts and horizontal orientation, automatically triggering emergency sirens and contact auto-dials.
            </p>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs text-cyan-300 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100ms Trigger Latency</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero False Positive Filter</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 animate-pulse">
              <Bell className="w-10 h-10" />
            </div>
            <span className="text-xs font-mono text-red-400 font-bold">AUTONOMOUS EMERGENCY ALERT</span>
            <p className="text-xs text-slate-400 mt-1">Automatic SOS broadcast to primary guardians, doctors, and emergency dispatchers.</p>
          </div>
        </div>

        {/* Section 2: Medicine System */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/20 shadow-2xl bg-slate-950/80 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
              <Pill className="w-10 h-10" />
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">PRESERVED DOSE ADHERENCE</span>
            <p className="text-xs text-slate-400 mt-1">Smart dispenser synchronization ensures medications are taken on exact medical timelines.</p>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2">
              <Pill className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-emerald-400 tracking-wider block">02 / MEDICATION SECURITY</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
              Intelligent Medicine Schedules & Family Adherence Sync
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Timely audio and visual alerts guide elders through daily prescription regimens. Missed doses automatically escalate notifications to family guardians and caregivers to ensure zero missed medications.
            </p>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs text-emerald-300 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Voice Audio Reminders</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time Guardian Log</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Multi-Role Guardian Ecosystem */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/20 shadow-2xl bg-slate-950/80 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-2">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-indigo-400 tracking-wider block">03 / MULTI-ROLE GOVERNANCE</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
              5 Dedicated Roles: Elder, Family, Doctor, Caregiver & Admin
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every user role experiences a tailored interface optimized for their needs: high-contrast simplified controls for elders, live vitals monitoring for family, clinical analytics for doctors, and fleet management for administrators.
            </p>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs text-indigo-300 pt-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Strict Role Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Clinical Doctor Dashboard</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4">
              <Sparkles className="w-10 h-10" />
            </div>
            <span className="text-xs font-mono text-indigo-400 font-bold">7-LANGUAGE AI COMPANION</span>
            <p className="text-xs text-slate-400 mt-1">Voice support in English, Hindi, Gujarati, Tamil, Marathi, Punjabi & Bengali.</p>
          </div>
        </div>

      </section>

      {/* CTA Footer Section */}
      <section className="relative z-10 py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="glass-panel p-10 sm:p-16 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-8 h-8 text-slate-950" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white mb-4">
            Protecting Every Heartbeat
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join the next generation of intelligent, continuous elder care monitoring. Simple for seniors, empowering for families.
          </p>

          <button
            onClick={() => setScreen('login')}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-400 text-slate-950 font-extrabold text-base sm:text-lg shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-3"
          >
            Access ElderGuard Portal Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-12 text-xs font-mono text-slate-500">
          ElderGuard AI Enterprise System • Compatible with WebGL & PWA Devices
        </div>
      </section>
    </div>
  );
};
