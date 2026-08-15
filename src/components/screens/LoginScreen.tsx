import React, { useState } from 'react';
import { useEcosystem, ROLE_PROFILES } from '../../context/EcosystemContext';
import type { UserRole } from '../../types';
import {
  Bot,
  ShieldCheck,
  Lock,
  Fingerprint,
  Phone,
  ArrowRight,
  Users,
  Stethoscope,
  User,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Heart,
  FileSpreadsheet,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginScreen: React.FC = () => {
  const { role, loginAsRole, triggerFallAlert } = useEcosystem();

  const [selectedRole, setSelectedRole] = useState<UserRole>(role || 'Elder');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [passwordOrOtp, setPasswordOrOtp] = useState('784912');
  const [licenseCode, setLicenseCode] = useState('MCI-84920-CARD');
  const [adminToken, setAdminToken] = useState('EG-SEC-9021');
  const [biometricScanning, setBiometricScanning] = useState(false);

  const activeProfile = ROLE_PROFILES[selectedRole];

  const handleRoleSelect = (r: UserRole) => {
    setSelectedRole(r);
  };

  const handleBiometricAuth = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      loginAsRole(selectedRole);
    }, 1000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsRole(selectedRole);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#060911]/80 backdrop-blur-sm relative overflow-hidden">

      {/* Background Animated Gradient Glows */}
      <div className={`absolute top-1/4 left-1/4 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${selectedRole === 'Doctor' ? 'bg-purple-500/15' : selectedRole === 'Family' ? 'bg-emerald-500/15' : selectedRole === 'Admin' ? 'bg-rose-500/15' : 'bg-cyan-500/15'
        }`} />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      <div className="glass-panel w-full max-w-5xl p-6 sm:p-10 rounded-3xl border border-cyan-500/30 shadow-2xl relative z-10 my-auto flex flex-col gap-6 backdrop-blur-xl">

        {/* Top Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-3 border border-cyan-300/30"
          >
            <Bot className="w-9 h-9 text-white" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            ElderGuard <span className="text-cyan-400">AI OS</span>
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Multi-Role Authentication Portal • Select Your Access Portal
          </p>
        </div>

        {/* 4 Role Cards Grid with Dynamic 3D Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {/* Elder Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect('Elder')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${selectedRole === 'Elder'
              ? 'bg-gradient-to-b from-cyan-500/25 to-slate-950 border-cyan-400 text-white shadow-2xl shadow-cyan-500/30 ring-2 ring-cyan-400/40'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700'
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                <User className="w-5 h-5" />
              </div>
              <span className="text-2xl">👴</span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Elderly User</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Devendra Kumar (82 yrs)</p>
              <div className="mt-2 text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">
                • Vitals & Emergency SOS<br />
                • Devotional & Voice AI
              </div>
            </div>
          </motion.div>

          {/* Family Guardian Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect('Family')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${selectedRole === 'Family'
              ? 'bg-gradient-to-b from-emerald-500/25 to-slate-950 border-emerald-400 text-white shadow-2xl shadow-emerald-500/30 ring-2 ring-emerald-400/40'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700'
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl">👨‍👩‍👦</span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Family Guardian</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Rahul Kumar (Son)</p>
              <div className="mt-2 text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                • 3D 6-Axis Telemetry<br />
                • Live GPS & HD Call
              </div>
            </div>
          </motion.div>

          {/* Doctor Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect('Doctor')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${selectedRole === 'Doctor'
              ? 'bg-gradient-to-b from-purple-500/25 to-slate-950 border-purple-400 text-white shadow-2xl shadow-purple-500/30 ring-2 ring-purple-400/40'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700'
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-2xl">🩺</span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Doctor / Physician</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Dr. A. Sharma (MD)</p>
              <div className="mt-2 text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">
                • Continuous ECG & Vitals<br />
                • Rx Prescriptions
              </div>
            </div>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect('Admin')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${selectedRole === 'Admin'
              ? 'bg-gradient-to-b from-rose-500/25 to-slate-950 border-rose-400 text-white shadow-2xl shadow-rose-500/30 ring-2 ring-rose-400/40'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700'
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-2xl">🛡️</span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">System Admin</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Fleet Operations</p>
              <div className="mt-2 text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20">
                • ESP32 Fleet Health<br />
                • User Access Audit
              </div>
            </div>
          </motion.div>

        </div>

        {/* Dynamic Role Login Form Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl relative overflow-hidden"
          >

            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{activeProfile.avatar}</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
                    Logging in as: <span className={
                      selectedRole === 'Doctor' ? 'text-purple-400' : selectedRole === 'Family' ? 'text-emerald-400' : selectedRole === 'Admin' ? 'text-rose-400' : 'text-cyan-400'
                    }>{activeProfile.name}</span>
                  </h2>
                  <p className="text-xs font-mono text-slate-400">{activeProfile.credential}</p>
                </div>
              </div>

              <span className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold hidden sm:inline-block ${selectedRole === 'Doctor' ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : selectedRole === 'Family' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : selectedRole === 'Admin' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                }`}>
                PORTAL: {selectedRole.toUpperCase()}
              </span>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">

              {/* Role specific input fields */}
              {selectedRole === 'Doctor' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Doctor Medical License No.</label>
                    <div className="relative">
                      <Stethoscope className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={licenseCode}
                        onChange={e => setLicenseCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Hospital Passcode / OTP</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        value={passwordOrOtp}
                        onChange={e => setPasswordOrOtp(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>
              ) : selectedRole === 'Family' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Registered Guardian Phone</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">6-Digit Security OTP Code</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={passwordOrOtp}
                        onChange={e => setPasswordOrOtp(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              ) : selectedRole === 'Admin' ? (
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Fleet Security Token Key</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={adminToken}
                      onChange={e => setAdminToken(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              ) : (
                /* Elder quick biometric button */
                <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                      <Fingerprint className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <strong className="text-sm sm:text-base text-white font-bold block">Smartwatch One-Tap Login</strong>
                      <p className="text-xs text-slate-400 font-mono">Biometrics automatically verified via ESP32 SmartWatch</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBiometricAuth}
                    className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-xl transition-transform active:scale-95 shrink-0"
                  >
                    {biometricScanning ? 'Verifying Watch Biometrics...' : 'Touch Watch Screen to Enter'}
                  </button>
                </div>
              )}

              {/* Feature List for Selected Role */}
              <div className="mt-1 text-xs font-mono text-slate-300 flex flex-wrap items-center gap-4">
                <span className="text-slate-500 font-bold">PORTAL CAPABILITIES:</span>
                {selectedRole === 'Doctor' && (
                  <>
                    <span className="flex items-center gap-1.5 text-purple-300"><Heart className="w-3.5 h-3.5 text-purple-400" /> Patient Vitals Monitor</span>
                    <span className="flex items-center gap-1.5 text-purple-300"><FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" /> Prescribe Medications</span>
                  </>
                )}
                {selectedRole === 'Family' && (
                  <>
                    <span className="flex items-center gap-1.5 text-emerald-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 3D 6-Axis Kinematics</span>
                    <span className="flex items-center gap-1.5 text-emerald-300"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /> WebRTC Video Call</span>
                  </>
                )}
                {selectedRole === 'Elder' && (
                  <>
                    <span className="flex items-center gap-1.5 text-cyan-300"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Accessible Big UI</span>
                    <span className="flex items-center gap-1.5 text-cyan-300"><Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Devotional Audio Player</span>
                  </>
                )}
                {selectedRole === 'Admin' && (
                  <>
                    <span className="flex items-center gap-1.5 text-rose-300"><Cpu className="w-3.5 h-3.5 text-rose-400" /> ESP32 Device Telemetry</span>
                    <span className="flex items-center gap-1.5 text-rose-300"><Sparkles className="w-3.5 h-3.5 text-rose-400" /> System Logs & Access</span>
                  </>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-2xl flex items-center justify-center gap-2 transition-all active:scale-98 mt-2 ${selectedRole === 'Doctor'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-purple-600/30'
                  : selectedRole === 'Family'
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : selectedRole === 'Admin'
                      ? 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 text-white shadow-rose-600/30'
                      : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-white shadow-cyan-500/30'
                  }`}
              >
                <span>ENTER {selectedRole.toUpperCase()} PORTAL</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

          </motion.div>
        </AnimatePresence>

        {/* Emergency SOS Access */}
        <div className="pt-1">
          <button
            onClick={() => {
              triggerFallAlert();
              loginAsRole('Elder');
            }}
            className="w-full py-3.5 rounded-2xl bg-red-600/20 border border-red-500/40 hover:bg-red-600/30 text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <ShieldAlert className="w-4.5 h-4.5 text-red-400" />
            EMERGENCY SOS BYPASS — IMMEDIATE PANIC ALERT
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;
